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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/color';
import { useEffect, useState } from 'react';

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
  toDos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: theme.toDoBg,
  },
  toDosText: {
    fontSize: 20,
    color: 'white',
    maxWidth: '70%',
  },
  content: {},
  toDosFunc: {
    flexDirection: 'row',
    gap: 10,
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
  const [edit, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

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
  const onChangeContent = (payload: string) => setContent(payload);

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

  const removeToDos = async (key: string) => {
    Alert.alert('Delete Todo', 'Are you Sure?', [
      {
        text: 'Cancel',
      },
      {
        text: "I'm Sure",
        style: 'destructive',
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  // const editTodo = (key: string) => {
  //   Alert.alert('Edit Todo', 'Are you edit Content?', [
  //     {
  //       text: 'Cancel',
  //     },
  //     {
  //       text: 'Ok',
  //       style: 'destructive',
  //       onPress: async () => {
  //         const newToDos = { ...toDos };
  //         newToDos[key].text = content;
  //         setToDos(newToDos);
  //         await saveToDos(newToDos);
  //       },
  //     },
  //   ]);
  // };

  const doneTodos = (key: string) => {
    Alert.alert('Completed Todo', 'Are you completed your Todo?', [
      {
        text: "No, I'm yet",
      },
      {
        text: 'Yes, I do',
        style: 'destructive',
        onPress: async () => {
          const newToDos = { ...toDos };
          newToDos[key].completed = true;
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  const addToDos = async () => {
    if (text === '') return;
    setToDos((prev) => ({ ...prev, [Date.now()]: { text, working } }));
    try {
      await saveToDos({ ...toDos, [Date.now()]: { text, working } });
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
              <View style={styles.toDos} key={index}>
                {toDos[key].completed ? (
                  <FontAwesome name="check-circle" size={24} color="green" />
                ) : null}
                {edit ? (
                  <TextInput
                    onSubmitEditing={() => {}}
                    style={styles.content}
                    autoCapitalize={'sentences'}
                    onChangeText={onChangeContent}
                    value={content}
                    returnKeyType={'done'}
                    placeholder={''}
                    placeholderTextColor={''}
                  />
                ) : toDos[key].completed ? (
                  <Text
                    style={{
                      ...styles.toDosText,
                      color: 'grey',
                      textDecorationLine: 'line-through',
                    }}
                  >
                    {toDos[key].text}
                  </Text>
                ) : (
                  <Text style={styles.toDosText}>{toDos[key].text}</Text>
                )}
                <View style={styles.toDosFunc}>
                  {!toDos[key].completed ? (
                    <Feather
                      name="check-circle"
                      size={24}
                      color="green"
                      onPress={() => doneTodos(key)}
                    />
                  ) : null}
                  {!toDos[key].completed ? (
                    <Feather
                      name="edit"
                      size={24}
                      color="white"
                      onPress={() => {}}
                    />
                  ) : null}

                  <FontAwesome
                    name="trash-o"
                    size={24}
                    color="red"
                    onPress={() => removeToDos(key)}
                  />
                </View>
              </View>
            ) : null
          )
        )}
      </ScrollView>
    </View>
  );
}
