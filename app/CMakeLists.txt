cmake_minimum_required(VERSION 3.4.1)
#set(LIBRARY_OUTPUT_PATH libs)
#set(distribution_DIR libs)

#add_library( libffmpeg SHARED IMPORTED )
#set_target_properties( libffmpeg PROPERTIES IMPORTED_LOCATION libs/libffmpeg.so)
#set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++11")
add_library(native-lib
             SHARED
             src/main/cpp/native-lib.cpp )
#include_directories(libs/include/)
find_library(log-lib
              log )
target_link_libraries(native-lib
#libffmpeg
${log-lib} )
