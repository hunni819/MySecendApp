import { theme } from '@/color';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    color: 'white',
    backgroundColor: '#111111',
    borderRadius: 40,
    maxWidth: '70%',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  toDosFunc: {
    flexDirection: 'row',
    gap: 10,
  },
  completed: {
    color: 'grey',
    textDecorationLine: 'line-through',
  },
});

const Todo = (props: any) => {
  const { toDos, toDo: key, saveToDos, setToDos } = props;

  const [edit, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<string>(toDos[key].text);

  const onChangeContent = (payload: string) => setContent(payload);

  const editTodo = (key: string) => {
    Alert.alert('Edit Todo', 'Are you edit Content?', [
      {
        text: 'Cancel',
        onPress: () => {
          setEdit(false);
          setContent(toDos[key].text);
        },
      },
      {
        text: 'Ok',
        style: 'destructive',
        onPress: async () => {
          const newToDos = { ...toDos };
          newToDos[key].text = content;
          setToDos(newToDos);
          setEdit(false);
          setContent(content);
          await saveToDos(newToDos);
        },
      },
    ]);
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
          setEdit(false);
          setContent(toDos[key].text);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  return (
    <View style={styles.toDos}>
      {toDos[key].completed ? (
        <FontAwesome name="check-circle" size={24} color="green" />
      ) : null}
      {edit ? (
        <TextInput
          onSubmitEditing={() => editTodo(key)}
          style={styles.content}
          autoCapitalize={'sentences'}
          onChangeText={onChangeContent}
          value={content}
          returnKeyType={'done'}
        />
      ) : toDos[key].completed ? (
        <Text
          style={{
            ...styles.toDosText,
            ...styles.completed,
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
            onPress={() => setEdit(true)}
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
  );
};

export default Todo;
