import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';

declare function quickpinyin(arg: string): void;

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result {quickpinyin('asdsd')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
