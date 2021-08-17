import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import Pinyin from 'react-native-quick-pinyin';

const quote = `世上人营营逐逐急急巴巴跳不出七情六欲关头打不破酒色财气圈子到头来同归于尽着甚要紧虽是如此说只这酒色财气四件中唯有财色二者更为利害怎见得他的利害
假如一个人到了那穷苦的田地受尽无限凄凉耐尽无端懊恼晚来摸一摸米瓮苦无隔宿之炊早起看一看厨前愧无半星烟火妻子饥寒一身冻馁就是那粥饭尚且艰难那讨馀钱沽酒
更有一种可恨处亲朋白眼面目寒酸便是凌云志气分外消磨怎能勾与人争气正是
一朝马死黄金尽亲者如同陌路人
到得那有钱时节挥金买笑一掷巨万思饮酒真个琼浆玉液不数那琥珀杯流要斗气钱可通神果然是颐指气使趋炎的压脊挨肩附势的吮痈舐痔真所谓得势叠肩而来失势掉臂而去古今炎冷恶态莫有甚于此者这两等人岂不是受那财的利害处如今再说那色的利害请看如今世界你说那坐怀不乱的柳下惠闭门不纳的鲁男子与那秉烛达旦的关云长古今能有几人至如三妻四妾买笑追欢的又当别论还有那一种好色的人见了个妇女略有几分颜色便百计千方偷寒送暖一到了着手时节只图那一瞬欢娱也全不顾亲戚的名分也不想朋友的交情起初时不知用了多少滥钱费了几遭酒食正是
三杯花作合两盏色媒人
到后来情浓事露甚而斗狠杀伤性命不保妻孥难顾事业成灰就如那石季伦泼天豪富为绿珠命丧囹圄楚霸王气概拔山因虞姬头悬垓下真说谓生我之门死我户看得破时忍不过这样人岂不是受那色的利害处
说便如此说这财色二字从来只没有看得破的若有那看得破的便见得堆金积玉是棺材勤带不去的瓦砾泥沙贯朽粟红是皮囊内装不尽的臭淤粪土高堂广厦玉宇琼楼是坟山上起不得的享堂锦衣绣袄狐服貂裘是骷髅上裹不了的败絮即如那妖姬艳女献媚工妍看得破的却如交锋阵上将军叱咤献威风朱唇皓齿掩袖回眸懂得来时便是阎罗殿前鬼判夜叉增恶态罗袜一弯金莲三寸是砌坟时破土的锹锄枕上绸缪被中恩爱是五殿下油锅中生活只有那金刚经上两句说得好他说道如梦幻泡影如电复如露见得人生在世一件也少不得到了那结束时一件也用不着随着你举鼎荡舟的神力到头来少不得骨软筋麻由着你铜山金谷的奢华正好时却又要冰消雪散假饶倾闭月羞花的容貌一到了垂眉落眼人皆掩鼻而过之比如你陆贾隋何的机锋若遇着齿冷唇寒吾未如之何也已到不如削去六根清净披上一领袈裟参透了空色世界打磨穿生灭机关直超无上乘不落是非窠倒得个清闭自在不向火坑中翻筋斗也正是
三寸气在千般用一日无常万事休`;

export default function App() {
  const scrollRef = React.useRef<any>();

  React.useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd();
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal ref={scrollRef}>
        <View style={styles.paragraph}>
          {quote.split('\n').map((line) =>
            line.split('').map((char, i) => {
              const pinyin = Pinyin.getFullChars(char);
              return (
                <View key={i} style={styles.textContainer}>
                  {/[a-z]/.test(pinyin) && (
                    <Text style={styles.pinyin}>{pinyin}</Text>
                  )}
                  <Text style={styles.hanzi}>{char}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(220, 210, 174)',
  },
  paragraph: {
    width: '100%',
    alignItems: 'flex-end',
    flexWrap: 'wrap-reverse',
    padding: 30,
    paddingVertical: 10,
  },
  textContainer: {
    width: 70,
    height: 70,
    padding: 5,
    alignItems: 'center',
  },
  hanzi: {
    fontSize: 30,
    marginTop: 4,
  },
  pinyin: {
    fontSize: 20,
  },
});
