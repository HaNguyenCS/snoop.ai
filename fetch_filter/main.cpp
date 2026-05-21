#include <iostream>
#include <chrono>
#include <thread>
#include <ixwebsocket/IXWebSocket.h>
#include <ixwebsocket/IXUserAgent.h>
#include <cpr/cpr.h>
#include <simdjson.h>

int main() {
    ix::WebSocket webSocket;

    std::string url{"wss://jetstream2.us-west.bsky.network/subscribe?wantedCollections=app.bsky.feed.post"};
    webSocket.setUrl(url);

    std::cout << "Connecting to " << url << "..." << std::endl;

    webSocket.setOnMessageCallback([](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message) {
            const std::string& raw_json{msg->str};

            simdjson::ondemand::parser parser;
            simdjson::padded_string json_data(raw_json);
            simdjson::ondemand::document doc = parser.iterate(json_data);

            /* don't need to filter non-english since keyword matching handles that, they are in english only
            // filter out non-english posts
            std::string_view primary_lang;
            auto error = doc["commit"]["record"]["langs"].at(0).get_string().get(primary_lang);
            if (error || primary_lang != "en") {
                std::cout << "This is America mf speak english" << '\n';
                return;
            }
            */

            std::cout << doc << std::endl;
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
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    return 0;
}
