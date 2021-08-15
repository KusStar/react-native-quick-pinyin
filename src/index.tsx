import { NativeModules } from 'react-native';

type PinyinType = {
  multiply(a: number, b: number): Promise<number>;
};

const { Pinyin } = NativeModules;

export default Pinyin as PinyinType;
