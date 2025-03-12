import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/color';
import { useState } from 'react';

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
  input: {
    marginTop: 10,
    fontSize: 18,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 40,
  },
});

export default function Index() {
  const [working, setWorking] = useState(false);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={travel}
          hitSlop={30}
          pressRetentionOffset={{ bottom: 20, left: 20, right: 20, top: 20 }}
        >
          <Text
            style={{ ...styles.button, color: !working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </Pressable>

        <Pressable
          onPress={work}
          hitSlop={30}
          pressRetentionOffset={{ bottom: 20, left: 20, right: 20, top: 20 }}
        >
          <Text
            style={{ ...styles.button, color: working ? 'white' : theme.grey }}
          >
            Travel
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder={!working ? 'Add To do!' : 'Where do you want to go?'}
        placeholderTextColor={'#ddd'}
      ></TextInput>
    </View>
  );
}
