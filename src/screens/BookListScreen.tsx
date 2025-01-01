import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
}

const BookListScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookGenre, setBookGenre] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token ? `Bearer ${token}` : '';
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  };

  const fetchBooks = async () => {
    const token = await getAuthToken();
    try {
      const response = await fetch('https://backendbooktrack-production.up.railway.app/api/books', {
        headers: {
          Authorization: token,
        },
      });
      const result = await response.json();
      if (result.data) {
        setBooks(result.data);
      } else {
        Alert.alert('Failed to fetch books');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching books');
    }
  };

  const handleAddOrUpdateBook = async () => {
    if (!bookTitle || !bookAuthor || !bookGenre || !bookDescription) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const token = await getAuthToken();
    const url = editingBook
      ? `https://backendbooktrack-production.up.railway.app/api/books/${editingBook._id}`
      : 'https://backendbooktrack-production.up.railway.app/api/books';

    try {
      const response = await fetch(url, {
        method: editingBook ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title: bookTitle,
          author: bookAuthor,
          genre: bookGenre,
          description: bookDescription,
        }),
      });

      const newBook = await response.json();
      if (newBook && newBook.data && newBook.data._id) {
        if (editingBook) {
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book._id === newBook.data._id ? newBook.data : book))
          );
        } else {
          setBooks((prevBooks) => [...prevBooks, newBook.data]);
        }
        resetForm();
        setModalVisible(false);
        Alert.alert(
          editingBook ? 'Updated' : 'Added',
          `Book ${editingBook ? 'updated' : 'added'} successfully!`
        );
      } else {
        Alert.alert('Failed to add or update book. Please try again.');
      }
    } catch (error) {
      console.error('Error adding/updating book:', error);
      Alert.alert('An error occurred while adding/updating the book.');
    }
  };

  const handleDeleteBook = async (_id: string) => {
    const token = await getAuthToken();
    try {
      await fetch(`https://backendbooktrack-production.up.railway.app/api/books/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== _id));
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred while deleting the book.');
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setBookTitle('');
    setBookAuthor('');
    setBookGenre('');
    setBookDescription('');
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setBookGenre(book.genre);
    setBookDescription(book.description);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellTitle}>{item.title}</Text>
              <Text style={styles.tableCell}>{item.author}</Text>
              <Text style={styles.tableCellGenre}>{item.genre}</Text>
            </View>
            <Text style={styles.bookDescription}>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEditBook(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDeleteBook(item._id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              placeholderTextColor="#8F8F8F"
              value={bookTitle}
              onChangeText={setBookTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              placeholderTextColor="#8F8F8F"
              value={bookAuthor}
              onChangeText={setBookAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="Genre"
              placeholderTextColor="#8F8F8F"
              value={bookGenre}
              onChangeText={setBookGenre}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#8F8F8F"
              value={bookDescription}
              onChangeText={setBookDescription}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateBook}>
              <Text style={styles.buttonText}>{editingBook ? 'Update Book' : 'Add Book'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#EDEDED',
  },
  addButton: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    marginTop: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    marginVertical: 20,
    borderRadius: 15,
    width: '90%',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    padding: 15,
    height: 50,
    width: 50,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  input: {
    height: 45,
    borderColor: '#333333',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookItem: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 15,
    marginBottom: 10,
    padding: 24,
    backgroundColor: '#1F1F1F',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableCellTitle: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableCell: {
    flex: 1.5,
    fontSize: 14,
    color: '#B0B0B0',
  },
  tableCellGenre: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'right',
  },
  bookDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonEdit: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonDelete: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
});

export default BookListScreen;
