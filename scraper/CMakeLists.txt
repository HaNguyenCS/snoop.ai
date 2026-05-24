cmake_minimum_required(VERSION 3.14)

project(MarketFilterEngine VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_EXTENSIONS OFF) # Disables compiler-specific extensions for cleaner code

set(USE_TLS ON CACHE BOOL "Enable TLS support" FORCE)
set(USE_OPEN_SSL ON CACHE BOOL "Use OpenSSL" FORCE)

include(FetchContent)

# --- DEPENDENCIES ---

message(STATUS "Fetching IXWebSocket...")
FetchContent_Declare(
    IXWebSocket
    GIT_REPOSITORY https://github.com/machinezone/IXWebSocket.git
    GIT_TAG        v12.0.0
)

message(STATUS "Fetching CPR...")
FetchContent_Declare(
    cpr
    GIT_REPOSITORY https://github.com/libcpr/cpr.git
    GIT_TAG        1.12.0
)

message(STATUS "Fetching simdjson...")
FetchContent_Declare(
  simdjson
  GIT_REPOSITORY https://github.com/simdjson/simdjson.git
  GIT_TAG        v4.6.4
  GIT_SHALLOW    TRUE
)

FetchContent_MakeAvailable(IXWebSocket)
FetchContent_MakeAvailable(cpr)
FetchContent_MakeAvailable(simdjson)

# --- EXECUTABLE & LINKING ---

add_executable(scraper main.cpp)

target_link_libraries(scraper PRIVATE 
    simdjson::simdjson 
    cpr::cpr
    ixwebsocket::ixwebsocket
)
