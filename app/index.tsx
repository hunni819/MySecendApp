import {
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
  },
  header: {
    marginTop: 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    fontSize: 44,
    fontWeight: '600',
    color: theme.grey,
  },
});

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={() => console.log('Pressed')}
          hitSlop={10}
          pressRetentionOffset={{ bottom: 80, left: 80, right: 80, top: 80 }}
        >
          <Text style={styles.button}>Travel</Text>
        </Pressable>

        <Pressable
          onPress={() => console.log('Pressed')}
          hitSlop={10}
          pressRetentionOffset={{ bottom: 80, left: 80, right: 80, top: 80 }}
        >
          <Text style={styles.button}>Work</Text>
        </Pressable>
      </View>
    </View>
  );
}
