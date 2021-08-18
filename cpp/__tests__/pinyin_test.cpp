/**
 * @see
 * https://stackoverflow.com/questions/40054732/c-iterate-utf-8-string-with-mixed-length-of-characters
 *
 */

#include "../pinyin.h"
#include <fstream>
#include <iostream>
#include <string>

using namespace std;

int main() {
  ifstream hanzi, pinyin;
  hanzi.open("./hanzi.txt");
  pinyin.open("./pinyin.txt");

  const clock_t begin_time = clock();
  int lineNumber = 1;
  // do something
  string hanziLine, pinyinLine;
  if (hanzi.is_open() && pinyin.is_open()) {
    while (getline(hanzi, hanziLine) && getline(pinyin, pinyinLine)) {
      if (toFullChars(hanziLine) != pinyinLine) {
        cerr << "[toFullChars] incorrect at ./hanzi.txt:" << lineNumber
             << " or ./pinyin.txt:" << lineNumber << endl;
        exit(0);
      }
      lineNumber++;
    }
    hanzi.close();
    pinyin.close();
  }
  cout << "[toFullChars] test done, total " << lineNumber << " lines" << endl;
  cout << "execute time: " << float(clock() - begin_time) / CLOCKS_PER_SEC
       << '\n';
}
