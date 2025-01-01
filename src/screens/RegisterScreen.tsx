import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Portal, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../services/api';
import { RootStackParamList } from '../types';

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleRegister = async () => {
        setLoading(true);
        try {
            await register(username, password, email);
            setDialogMessage('Registration successful!');
            setVisible(true);
        } catch (error: any) {
            console.error('Failed to register:', error.message);
            setDialogMessage('Registration failed. Please try again.');
            setVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogDismiss = () => {
        setVisible(false);
        if (dialogMessage.includes('successful')) {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require("../../assets/primatech.png")} 
                style={styles.logo} 
                resizeMode="contain"
            />
            <Input
                placeholder="Enter Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#8f8f8f"
                style={styles.input}
            />
            <Input
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#8f8f8f"
                style={styles.input}
            />
            <Input
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#8f8f8f"
                style={styles.input}
            />
            <Button
                title={loading ? 'Processing...' : 'Register'}
                onPress={handleRegister}
                disabled={loading}
                style={styles.button}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={handleDialogDismiss}>
                    <Dialog.Title style={styles.dialogTitle}>{dialogMessage.includes('successful') ? 'Success' : 'Error'}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.dialogContent}>{dialogMessage}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={handleDialogDismiss} labelStyle={styles.dialogButton}>OK</PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: "60%",
        height: 150,
        alignSelf: "center",
        marginBottom: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#121212', // Hitam modern sebagai background utama
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff', // Warna teks putih untuk kontras
        marginBottom: 25,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#1e1e1e', // Warna abu gelap untuk input field
        color: '#ffffff', // Warna teks putih
        marginBottom: 15,
        borderRadius: 12, // Border halus
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333333', // Warna border lebih lembut
        elevation: 2, // Bayangan ringan
    },
    button: {
        backgroundColor: '#333333', // Warna tombol abu gelap
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3, // Bayangan tombol
    },
    dialogTitle: {
        color: '#1e1e1e', // Warna judul dialog putih
        fontSize: 20,
        fontWeight: 'bold',
    },
    dialogContent: {
        color: '#1e1e1e', // Warna teks dialog abu lembut
        fontSize: 16,
    },
    dialogButton: {
        color: '#1e1e1e', // Warna teks tombol putih
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
