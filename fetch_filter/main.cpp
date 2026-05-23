#include <algorithm>
#include <array>
#include <chrono>
#include <iostream>
#include <mutex>
#include <queue>
#include <sstream>
#include <string>
#include <thread>
#include <unordered_set>
#include <vector>

#include <cpr/cpr.h>
#include <ixwebsocket/IXWebSocket.h>
#include <ixwebsocket/IXUserAgent.h>
#include <simdjson.h>

struct AhoCorasick {
    struct Node {
        std::array<int, 128> children;
        int fail = 0; 
        std::vector<std::pair<int,std::string>> outputs; // (profile_id, keyword) pairs
        Node() { children.fill(-1); }
    };

    std::vector<Node> trie;

    AhoCorasick() { trie.emplace_back(); } // root

    void insert(const std::string& keyword, int profile_id) {
        int cur = 0;
        for (unsigned char c : keyword) {
            c = std::tolower(c);
            if (c >= 128) continue; // skip non-ASCII
            if (trie[cur].children[c] == -1) {
                trie[cur].children[c] = trie.size();
                trie.emplace_back();
            }
            cur = trie[cur].children[c];
        }
        trie[cur].outputs.push_back({profile_id, keyword});
    }

    void build() {
        std::queue<int> q;
        for (int c = 0; c < 128; c++) {
            int child = trie[0].children[c];
            if (child == -1) {
                trie[0].children[c] = 0; // loop back to root
            } else {
                trie[child].fail = 0;
                q.push(child);
            }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            // Inherit parent's outputs via fail link
            for (auto& out : trie[trie[u].fail].outputs)
                trie[u].outputs.push_back(out);

            for (int c = 0; c < 128; c++) {
                int v = trie[u].children[c];
                if (v == -1) {
                    trie[u].children[c] = trie[trie[u].fail].children[c];
                } else {
                    trie[v].fail = trie[trie[u].fail].children[c];
                    q.push(v);
                }
            }
        }
    }

    std::vector<std::pair<int, std::string>> search(std::string_view text) {
        std::vector<std::pair<int, std::string>> results;
        std::unordered_set<int> already_matched;

        int cur = 0;
        for (size_t i = 0; i < text.size(); i++) {
            unsigned char c = std::tolower((unsigned char)text[i]);
            if (c >= 128) { cur = 0; continue; }
            cur = trie[cur].children[c];
            for (auto& [profile_id, kw] : trie[cur].outputs) {
                if (already_matched.count(profile_id)) continue;
                size_t match_start = i + 1 - kw.size();
                bool left_ok  = (match_start == 0) || !is_word_char(text[match_start - 1]);
                bool right_ok = (i + 1 == text.size()) || !is_word_char(text[i + 1]);
                if (left_ok && right_ok) {
                    results.push_back({profile_id, kw});
                    already_matched.insert(profile_id);
                }
            }
        }
    
        return results;
    }

    static bool is_word_char(unsigned char c) {
        if (c >= 128) return true;
        return std::isalnum(c) || c == '_' || c == '\'';
    }
};

AhoCorasick g_ac;
std::mutex g_ac_mutex;

struct ProfileKeywords {
    int profile_id;
    std::vector<std::string> keywords;
};

void emit_match(std::string_view post_text, std::string post_url, const std::vector<std::pair<int, std::string>>& matches) {
    std::string escaped;
    for (char c : post_text) {
        if (c == '"')       escaped += "\\\"";
        else if (c == '\\') escaped += "\\\\";
        else if (c == '\n') escaped += "\\n";
        else                escaped += c;
    }

    std::ostringstream profiles;
    profiles << "[";
    for (size_t i = 0; i < matches.size(); i++) {
        if (i > 0) profiles << ",";
        profiles << "{\"profile_id\":" << matches[i].first
                 << ",\"keyword\":\"" << matches[i].second << "\"}";
    }
    profiles << "]";

    std::cout << "{"
        << "\"profiles\":" << profiles.str() << ","
        << "\"url\":\"" << post_url << "\","
        << "\"text\":\"" << escaped << "\""
        << "}" << std::endl;
}

bool fetch_and_rebuild(const std::string& api_url) {
    auto response = cpr::Get(cpr::Url{api_url + "/scraper/config"});
    if (response.status_code != 200) return false;

    simdjson::dom::parser parser;
    simdjson::dom::element doc;
    if (parser.parse(response.text).get(doc)) return false;

    AhoCorasick fresh;
    for (auto profile : doc["profiles"]) {
        int profile_id = (int)profile["profileId"].get_int64();
        //for (auto kw : profile["keywords"])
            //fresh.insert(std::string(kw.get_string().value()), profile_id);
        for (auto comp : profile["competitors"])
            fresh.insert(std::string(comp.get_string().value()), profile_id);
    }
    fresh.build();

    std::lock_guard<std::mutex> lock(g_ac_mutex);
    g_ac = std::move(fresh);
    return true;
}

void config_watcher_thread(const std::string& api_url) {
    while (true) {
        std::this_thread::sleep_for(std::chrono::seconds(15));
        
        if (!fetch_and_rebuild(api_url)) {
            std::cerr << "[config] Failed to fetch keywords.\n";
        } else {
            std::cerr << "[config] Automaton rebuilt\n";
        }

    }
}

int main() {
    const std::string api_url = "http://localhost:8000";

    // Block until first load succeeds
    while (!fetch_and_rebuild(api_url)) {
        std::cerr << "[config] Waiting for backend...\n";
        std::this_thread::sleep_for(std::chrono::seconds(3));
    }

    std::thread(config_watcher_thread, api_url).detach();

    // Bluesky Jetstream
    ix::WebSocket webSocket;

    std::string url{"wss://jetstream2.us-west.bsky.network/subscribe?wantedCollections=app.bsky.feed.post"};
    webSocket.setUrl(url);

    std::cout << "Connecting to " << url << "..." << std::endl;

    webSocket.setOnMessageCallback([/* &total, &passed */](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message) {
            static thread_local simdjson::dom::parser parser;
            simdjson::dom::element doc;

            if (parser.parse(msg->str).get(doc)) {
                return;
            }

            // Filter non-english
            std::string_view post_lang;
            if (doc["commit"]["record"]["langs"].at(0).get_string().get(post_lang)) {
                return;
            }
            if (post_lang.length() < 2 || post_lang.substr(0, 2) != "en") {
                return;
            }

            // Filter posts without matching keywords
            std::string_view post_text;
            if (doc["commit"]["record"]["text"].get_string().get(post_text)) {
                return;
            }
            
            std::vector<std::pair<int, std::string>> matches;
            {
                std::lock_guard<std::mutex> lock(g_ac_mutex);
                matches = g_ac.search(post_text);
            }
            if (matches.empty()) {
                return;
            }

            // Get url for matching posts
            std::string_view did;
            std::string_view rkey;
            if (doc["did"].get_string().get(did) || doc["commit"]["rkey"].get_string().get(rkey)) {
                return;
            }

            std::string post_url = "https://bsky.app/profile/" + std::string(did) + "/post/" + std::string(rkey);
            emit_match(post_text, post_url, matches);
        } else if (msg->type == ix::WebSocketMessageType::Open) {
            std::cerr << "Connection established" << std::endl;
        } else if (msg->type == ix::WebSocketMessageType::Error) {
            std::cerr << "Connection error: " << msg->errorInfo.reason << std::endl;
        }
    });

    webSocket.start();

    for (;;) {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    return 0;
}

