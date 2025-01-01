import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { fetchUserProfile } from '../services/api';
import { RootStackParamList, User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = await fetchUserProfile();
          setUser(profileData as User);
          setUsername(profileData.username);
          setEmail(profileData.email);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    // Update user state with new values (API integration can be added here)
    if (user) {
      setUser({ ...user, username, email });
    }
    setEditModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Ionicons name="settings" size={24} color="#FFF" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleEditProfile}>
            <Text style={styles.dropdownText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={{
            uri: 'data:image/jpeg;base64,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',
          }}
          style={styles.profilePicture}
        />
      </View>

      {/* Profile Details */}
      <View style={styles.profileCard}>
        <View style={styles.profileField}>
          <Text style={styles.profileLabel}>Username</Text>
          <Text style={styles.profileValue}>{user.username}</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.profileLabel}>Email</Text>
          <Text style={styles.profileValue}>{user.email}</Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Input Fields */}
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#AAA"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#AAA"
              keyboardType="email-address"
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveProfile}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#1F1F1F',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFF',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#333',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileField: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  profileValue: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    color: '#FFF',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  closeButton: {
    backgroundColor: '#555',
  },  
  text: {
    fontSize: 16, // Sesuaikan ukuran font
    color: '#FFF', // Warna teks putih
    textAlign: 'center', // Pilihan align teks
  },
});

export default ProfileScreen;
