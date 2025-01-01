import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

  const navigation = useNavigation();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Primatech Sejahtera</Text>
        <Ionicons name="book-outline" size={28} color="#ffffff" style={styles.headerIcon} />
      </View>
      <Image 
        source={require('../../assets/primatech.png')}
        style={styles.image}
      />

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="add-circle-outline" size={32} color="#cccccc"/>
          <Text style={styles.featureText}>Add New Books</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="stats-chart-outline" size={32} color="#cccccc" />
          <Text style={styles.featureText}>Track Progress</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="heart-outline" size={32} color="#cccccc" />
          <Text style={styles.featureText}>Favorite Books</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Modern soft black background
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
  },
  headerIcon: {
    marginLeft: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff', // White for high contrast
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#cccccc', // Soft gray for subtler text
    marginBottom: 20,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    width: '30%',
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#333333', // Dark gray button for modern look
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff', // White text on button
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
