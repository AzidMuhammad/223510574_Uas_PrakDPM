import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface BookFormProps {
  initialData?: { title: string; author: string };
  onSubmit: (data: { title: string; author: string }) => void;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <Button title="Submit" onPress={() => onSubmit({ title, author })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, marginBottom: 8, padding: 8, borderRadius: 4 },
});

export default BookForm;
