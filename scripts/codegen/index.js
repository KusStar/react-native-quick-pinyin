const fs = require('fs');
const { join } = require('path');
const Buffer = require('buffer').Buffer;

const dict = require('./dict.json');

// parse hex string to code point array, e.g. 'e5958a' => [ '0xe5', '0x95', '0x8a' ]
const toHexArr = (c) => {
  const ret = [];
  const str = Buffer.from(c).toString('hex');
  for (let i = 0; i < str.length; i += 2) {
    ret.push(parseInt('0x' + str.substr(i, 2), 16));
  }
  return ret;
};

const ifRetStat = (key, from, to) => `
        if (i >= ${from} && i <= ${to}) {
          return "${key}";
        }`;

const failRetGuard = (set) => {
  const firstKeys = Object.keys(set.first);
  const secondKeys = Object.keys(set.second);
  const thirdKeys = Object.keys(set.third);

  return `
    if (p1 < ${firstKeys[0]} || p1 > ${firstKeys[firstKeys.length - 1]}) {
      return text;
    }
    if (p2 < ${secondKeys[0]} || p2 > ${secondKeys[secondKeys.length - 1]}) {
      return text;
    }
    if (p3 < ${thirdKeys[0]} || p3 > ${thirdKeys[thirdKeys.length - 1]}) {
      return text;
    }
`;
};

/**
 * @see https://stackoverflow.com/questions/40054732/c-iterate-utf-8-string-with-mixed-length-of-characters
 */
const toFullCharsBlock = `/**
* @see https://stackoverflow.com/questions/40054732/c-iterate-utf-8-string-with-mixed-length-of-characters
*/
std::string toFullChars(const std::string &text) {
  std::stringstream ss;
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
      ss << toPinyin(cur);
    } else {
      ss << cur;
    }
    i += cplen;
  }
  return ss.str();
}
`;

// generate cpp code from dict for parsing chinese to pinyin

const genCpp = (obj) => {
  const HEADER = '#include "pinyin.h"';
  const TO_PINYIN = 'toPinyin';

  const result = [];
  const lenMap = {};
  const set = {
    first: {},
    second: {},
    third: {},
  };
  let len = 0;
  let idx = 0;

  result.push(`${HEADER}\n`);
  result.push(toFullCharsBlock);

  // generate dict
  const dictStat = [];
  for (let key in obj) {
    lenMap[key] = {
      from: idx,
    };
    const valArr = [];
    for (let c of obj[key]) {
      const hexArr = toHexArr(c);
      set.first[hexArr[0]] = 1;
      set.second[hexArr[1]] = 1;
      set.third[hexArr[2]] = 1;
      valArr.push(`{ ${hexArr.join(', ')} }`);
      idx++;
      len++;
    }
    dictStat.push(`  // ${key}\n  ${valArr.join(',\n  ')}`);
    lenMap[key].to = idx - 1;
  }
  result.push(`const static uint8_t dict[${len}][3] = {
    ${dictStat.join(',\n    ')}
  };`);

  // generate if return statements
  const ifRet = [];
  for (let key in lenMap) {
    const { from, to } = lenMap[key];
    ifRet.push(ifRetStat(key, from, to));
  }

  result.push(`std::string ${TO_PINYIN}(const std::string& text) {
    const uint8_t p1 = static_cast<uint8_t>(text[0]),
      p2 = static_cast<uint8_t>(text[1]),
      p3 = static_cast<uint8_t>(text[2]);
      ${failRetGuard(set)}
    for (int i = 0; i < ${len}; i++) {
      const uint8_t a = dict[i][0], b = dict[i][1], c = dict[i][2];
      if (p1 == a && p2 == b && p3 == c) {
        ${ifRet.join('\n')}
      }
    }
    return text;
  }`);

  console.log(`ifRet length: ${ifRet.length}`);
  console.log(`Total ${len} text`);

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

genCpp(dict);
genTxt(dict);
