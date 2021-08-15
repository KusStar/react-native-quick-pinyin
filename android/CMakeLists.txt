cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

include_directories(
  ../cpp
  ../../react-native/React
  ../../react-native/React/Base
  ../../react-native/ReactCommon/jsi
  )

add_library(quickpinyin
  SHARED
  ../cpp/pinyin.cpp
  ../cpp/react-native-quick-pinyin.cpp
  cpp-adapter.cpp
  )

# Specifies a path to native header files.
include_directories(
  ../cpp
  )
