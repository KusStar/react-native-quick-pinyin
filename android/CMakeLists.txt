cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

if ($ENV{EXAMPLE_BUILD} MATCHES "1")

include_directories(
  ../cpp
  ../example/node_modules/react-native/React
  ../example/node_modules/react-native/React/Base
  ../example/node_modules/react-native/ReactCommon/jsi
  )

add_library(quickpinyin
  SHARED
  ../example/node_modules/react-native/ReactCommon/jsi/jsi/jsi.cpp
  ../cpp/pinyin.cpp
  ../cpp/react-native-quick-pinyin.cpp
  cpp-adapter.cpp
  )

else()

include_directories(
  ../cpp
  ../../react-native/React
  ../../react-native/React/Base
  ../../react-native/ReactCommon/jsi
  )

add_library(quickpinyin
  SHARED
  ../../react-native/ReactCommon/jsi/jsi/jsi.cpp
  ../cpp/pinyin.cpp
  ../cpp/react-native-quick-pinyin.cpp
  cpp-adapter.cpp
  )

endif()
