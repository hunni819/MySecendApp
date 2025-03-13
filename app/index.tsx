import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/color';
import { useEffect, useState } from 'react';
import Todo from './components/todo';

type toDosType = {
  [key: string]: any;
};

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
    marginTop: 20,
    fontSize: 18,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 40,
  },
  loading: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const STORAGE_KEY = '@todos';
const ACTIVED_TAB = '@tab';

export default function Index() {
  const [working, setWorking] = useState(true);

  useEffect(() => {
    loadActivedTab();
    new Promise(() => setTimeout(() => loadToDos(), 3000));
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

  const [text, setText] = useState<string>('');
  const [toDos, setToDos] = useState<toDosType>({});

  const travel = async () => {
    setWorking(false);
    await SaveActivedTab(false);
  };
  const work = async () => {
    setWorking(true);
    await SaveActivedTab(true);
  };
  const loadEnd = () => setLoading(false);
  const loadStart = () => setLoading(true);

  const onChangeText = (payload: string) => setText(payload);

  const SaveActivedTab = async (working: boolean) => {
    try {
      await AsyncStorage.setItem(ACTIVED_TAB, JSON.stringify(working));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  };

  const saveToDos = async (toSave: Object) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  };

  const loadActivedTab = async () => {
    try {
      const s = (await AsyncStorage.getItem(ACTIVED_TAB)) ?? 'true';
      setWorking(JSON.parse(s));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  };

  const loadToDos = async () => {
    try {
      loadStart();
      const s = (await AsyncStorage.getItem(STORAGE_KEY)) ?? '';
      setToDos(JSON.parse(s));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    } finally {
      loadEnd();
    }
  };

  const addToDos = async () => {
    if (text === '') return;
    setToDos((prev) => ({
      ...prev,
      [Date.now()]: { text, working },
    }));
    try {
      await saveToDos({
        ...toDos,
        [Date.now()]: { text, working },
      });
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
    setText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={work}
          hitSlop={10}
          pressRetentionOffset={{ bottom: 10, left: 10, right: 10, top: 10 }}
        >
          <Text
            style={{ ...styles.button, color: working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </Pressable>

        <Pressable
          onPress={travel}
          hitSlop={10}
          pressRetentionOffset={{ bottom: 10, left: 10, right: 10, top: 10 }}
        >
          <Text
            style={{ ...styles.button, color: !working ? 'white' : theme.grey }}
          >
            Travel
          </Text>
        </Pressable>
      </View>

      <TextInput
        onSubmitEditing={addToDos}
        style={styles.input}
        autoCapitalize={'sentences'}
        onChangeText={onChangeText}
        value={text}
        returnKeyType={working ? 'done' : 'send'}
        placeholder={working ? 'Add To do!' : 'Where do you want to go?'}
        placeholderTextColor={'#ddd'}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#ddd" />
          </View>
        ) : (
          Object.keys(toDos).map((key, index) =>
            toDos[key].working === working ? (
              <Todo
                key={index}
                toDos={toDos}
                toDo={key}
                saveToDos={saveToDos(toDos)}
                setToDos={setToDos}
              />
            ) : null
          )
        )}
      </ScrollView>
    </View>
  );
}
