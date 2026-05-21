cmake_minimum_required(VERSION 3.14)

project(MarketFilterEngine VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_EXTENSIONS OFF) # Disables compiler-specific extensions for cleaner code

include(FetchContent)

# --- DEPENDENCIES ---

message(STATUS "Fetching simdjson...")
FetchContent_Declare(
  simdjson
  GIT_REPOSITORY https://github.com/simdjson/simdjson.git
  GIT_TAG        v4.6.4
  GIT_SHALLOW    TRUE)
FetchContent_MakeAvailable(simdjson)

message(STATUS "Fetching CPR...")
FetchContent_Declare(
    cpr
    GIT_REPOSITORY https://github.com/libcpr/cpr.git
    GIT_TAG        1.12.0
)
FetchContent_MakeAvailable(cpr)

# --- EXECUTABLE & LINKING ---

add_executable(fetch_filter main.cpp)

target_link_libraries(fetch_filter PRIVATE 
    simdjson::simdjson 
    cpr::cpr
)
