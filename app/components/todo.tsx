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
  content: {},
  toDosFunc: {
    flexDirection: 'row',
    gap: 10,
  },
});

const Todo = (props: any) => {
  const { toDos, todo: key, saveToDos, setToDos } = props;

  const [edit, setEdit] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  const onChangeContent = (payload: string) => setContent(payload);

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
          <Feather name="edit" size={24} color="white" onPress={() => {}} />
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
