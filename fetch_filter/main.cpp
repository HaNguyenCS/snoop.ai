#include <iostream>
#include <chrono>
#include <thread>
#include <ixwebsocket/IXWebSocket.h>
#include <ixwebsocket/IXUserAgent.h>
#include <cpr/cpr.h>
#include <simdjson.h>

// Test keywords
const std::vector<std::string> target_keywords = {
      "NVidia",
};

bool is_word_char(unsigned char c) {
    return std::isalnum(c) || c == '_' || c == '\'';
}

bool passes_filter(std::string_view post_text) {
    for (const std::string& kw : target_keywords) {
        auto search_start = post_text.begin();

        while (search_start != post_text.end()) {
            auto it = std::search(
                search_start, post_text.end(),
                kw.begin(), kw.end(),
                [](unsigned char ch1, unsigned char ch2) {
                    return std::toupper(ch1) == std::toupper(ch2);
                }
            );

            if (it == post_text.end()) {
                break;
            }

            // Word Boundary Verification
            auto match_end = it + kw.size();
            bool left_boundary_ok = (it == post_text.begin()) || !is_word_char(*(it - 1));
            bool right_boundary_ok = (match_end == post_text.end()) || !is_word_char(*match_end);

            if (left_boundary_ok && right_boundary_ok) {
                return true;
            }

            search_start = it + 1;
        }
    }
    return false;
}

int main() {
    ix::WebSocket webSocket;

    std::string url{"wss://jetstream2.us-west.bsky.network/subscribe?wantedCollections=app.bsky.feed.post"};
    webSocket.setUrl(url);

    std::cout << "Connecting to " << url << "..." << std::endl;

    // for testing % passing filter
    // int total{0};
    // int passed{0};

    webSocket.setOnMessageCallback([/* &total, &passed */](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message) {
            const std::string& raw_json{msg->str};

            simdjson::ondemand::parser parser;
            simdjson::padded_string json_data(raw_json);
            simdjson::ondemand::document doc = parser.iterate(json_data);

            std::string_view post_text;
            auto error = doc["commit"]["record"]["text"].get_string().get(post_text);
            if (error) {
                return;
            }

            if (passes_filter(post_text)) {
                std::cout << post_text << std::endl;
                //std::cout << post_text << std::endl;
                // passed++;
                // total++;
            } else {
                // std::cout << "Filtered" << std::endl;
                // total++;
            }


        } else if (msg->type == ix::WebSocketMessageType::Open) {
            std::cout << "Connection established" << std::endl;
            std::cout << "> " << std::flush;
        } else if (msg->type == ix::WebSocketMessageType::Error) {
            std::cout << "Connection error: " << msg->errorInfo.reason << std::endl;
            std::cout << "> " << std::flush;
        }
    });

    webSocket.start();

    for (;;) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    return 0;
}

