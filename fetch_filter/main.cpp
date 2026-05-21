#include <iostream>
#include <chrono>
#include <thread>
#include <ixwebsocket/IXWebSocket.h>
#include <ixwebsocket/IXUserAgent.h>
#include <cpr/cpr.h>
#include <simdjson.h>

int main() {
    ix::WebSocket webSocket;

    std::string url{"wss://jetstream2.us-west.bsky.network/subscribe"};
    webSocket.setUrl(url);

    std::cout << "Connecting to " << url << "..." << std::endl;

    webSocket.setOnMessageCallback([](const ix::WebSocketMessagePtr& msg) {
        if (msg->type == ix::WebSocketMessageType::Message)
        {
            std::cout << "received message: " << msg->str << std::endl;
            std::cout << "> " << std::flush;
        }
        else if (msg->type == ix::WebSocketMessageType::Open)
        {
            std::cout << "Connection established" << std::endl;
            std::cout << "> " << std::flush;
        }
        else if (msg->type == ix::WebSocketMessageType::Error)
        {
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
