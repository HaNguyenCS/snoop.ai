#include <iostream>
#include <cpr/cpr.h>
#include <simdjson.h>

// just testing if dependencies work
int main() {
    // Test CPR
    std::cout << "Testing CPR Network Request..." << std::endl;
    cpr::Response r = cpr::Get(cpr::Url{"https://api.github.com/repos/libcpr/cpr/releases/latest"});
    std::cout << "Status code: " << r.status_code << '\n';

    // Test simdjson
    if (r.status_code == 200) {
        std::cout << "Testing simdjson Parsing..." << std::endl;
        simdjson::ondemand::parser parser;
        // simdjson requires padding at the end of the string for SIMD operations
        simdjson::padded_string json_data(r.text); 
        
        simdjson::ondemand::document doc = parser.iterate(json_data);
        std::string_view release_name = doc["name"];
        
        std::cout << "Successfully parsed latest CPR release: " << release_name << std::endl;
    }

    return 0;
}