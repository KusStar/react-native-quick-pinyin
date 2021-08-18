const fs = require('fs');
const { join } = require('path');

const dict = require('./dict.json');

const MIN_VALUE = 19968;
const MAX_VALUE = 40869;

const genHeader = (obj) => {
  const result = [];
  let idx = 0;

  result.push(`#ifndef QUICK_PINYIN_H
#define QUICK_PINYIN_H

#include <string>

#define PINYIN_MIN_VALUE ${MIN_VALUE}
#define PINYIN_MAX_VALUE ${MAX_VALUE}
#define PINYIN_12295 "ling"
#define PINYIN_CODE_12295 12295
`);

  result.push(`
uint16_t getPinyinCodeIndex(uint16_t c) ;
uint16_t toUnicode(const std::string &hanzi);
std::string toFullChars(const std::string &text);
`);

  // PINYIN_TABLE and PINYIN_CODE
  const pinyinIndexMap = Object.keys(obj).reduce((acc, cur, i) => {
    acc[cur] = i + 1;
    return acc;
  }, {});
  const pinyinTableResult = [];
  const offsetTable = {};
  for (let key in obj) {
    pinyinIndexMap[key] = idx + 1;
    for (let c of obj[key]) {
      const curOffset = c.charCodeAt(0) - MIN_VALUE;
      offsetTable[curOffset] = pinyinIndexMap[key];
    }
    idx++;
    pinyinTableResult.push(`"${key}"`);
  }
  result.push(`static const std::string PINYIN_TABLE[] = {
      "", ${pinyinTableResult.join(', ')}
    };`);

  const pinyinCodeLen =
    Number(Object.keys(offsetTable).sort((a, b) => b - a)[0]) + 1;
  const pinyinCode = new Array(pinyinCodeLen);

  for (let i = 0; i < pinyinCodeLen; i++) {
    if (offsetTable.hasOwnProperty(i)) {
      pinyinCode[i] = offsetTable[i];
    } else {
      pinyinCode[i] = 0;
    }
  }

  result.push(
    `static const uint16_t PINYIN_CODE[] = { ${pinyinCode.join(', ')} };`
  );

  result.push('#endif');

  const target = join(__dirname, '../../cpp', 'pinyin.h');

  fs.writeFileSync(target, result.join('\n'), {
    encoding: 'utf-8',
  });

  console.log(`Generated ${target}`);
};

const genCpp = () => {
  const result = [];

  result.push(`#include "pinyin.h"`);

  result.push(`
uint16_t getPinyinCodeIndex(uint16_t c) {
  uint16_t offset = c - PINYIN_MIN_VALUE;
  if (offset >= 0 && offset <= ${MAX_VALUE - MIN_VALUE}) {
    return PINYIN_CODE[offset];
  }
  return 0;
}`);

  result.push(`
uint16_t toUnicode(const std::string &hanzi) {
  uint16_t code = (hanzi[0] & 0x1F) << 12;
  code |= (hanzi[1] & 0x3F) << 6;
  code |= (hanzi[2] & 0x3F);
  return code;
};`);

  result.push(`
/**
 * @see
 * https://stackoverflow.com/questions/40054732/c-iterate-utf-8-string-with-mixed-length-of-characters
 */
std::string toFullChars(const std::string &text) {
  std::string ret;
  for (size_t i = 0; i < text.length();) {
    int cplen = 1;
    if ((text[i] & 0xf8) == 0xf0) {
      cplen = 4;
    } else if ((text[i] & 0xf0) == 0xe0)
      cplen = 3;
    else if ((text[i] & 0xe0) == 0xc0)
      cplen = 2;
    if ((i + cplen) > text.length())
      cplen = 1;

    const std::string cur = text.substr(i, cplen);
    if (cplen == 3) {
      uint16_t code = toUnicode(cur);
      if (code == PINYIN_CODE_12295) {
        ret += PINYIN_12295;
      } else if (code >= PINYIN_MIN_VALUE && code <= PINYIN_MAX_VALUE) {
        const std::string pinyin = PINYIN_TABLE[getPinyinCodeIndex(code)];
        if (!pinyin.empty()) {
          ret += pinyin;
        } else {
          ret += cur;
        }
      }
    } else {
      ret += cur;
    }
    i += cplen;
  }
  return ret;
}`);

  const target = join(__dirname, '../../cpp', 'pinyin.cpp');

  fs.writeFileSync(target, result.join('\n'), {
    encoding: 'utf-8',
  });

  console.log(`Generated ${target}`);
};

const genTxt = (obj) => {
  const hanzi = [];
  const pinyin = [];
  for (let key in obj) {
    for (let c of obj[key]) {
      hanzi.push(c);
      pinyin.push(key);
    }
  }

  const hanziTarget = join(__dirname, '../../cpp/__tests__', 'hanzi.txt');
  const pinyinTarget = join(__dirname, '../../cpp/__tests__', 'pinyin.txt');

  fs.writeFileSync(hanziTarget, hanzi.join('\n'), {
    encoding: 'utf-8',
  });

  fs.writeFileSync(pinyinTarget, pinyin.join('\n'), {
    encoding: 'utf-8',
  });

  console.log(`Generated ${hanziTarget}`);
  console.log(`Generated ${pinyinTarget}`);
};

genHeader(dict);
genCpp();
genTxt(dict);
