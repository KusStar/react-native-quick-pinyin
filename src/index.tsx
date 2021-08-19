export interface QuickPinyin {
  getFullChars: (text: string) => string;
}

declare global {
  var quickpinyin: QuickPinyin;
}

const Pinyin = {
  getFullChars: (text: string) => {
    return quickpinyin.getFullChars(text);
  },
};

export default Pinyin;
