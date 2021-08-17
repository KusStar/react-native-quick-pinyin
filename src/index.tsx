interface QuickPinyin {
  getFullChars: (text: string) => string;
}

declare const quickpinyin: QuickPinyin;

const quickpinyinMock: QuickPinyin = {
  getFullChars: (text: string) => {
    console.warn(
      '[quickpinyin.getFullChars] is not available in your environment'
    );
    return text;
  },
};

export default quickpinyin ? quickpinyin : quickpinyinMock;
