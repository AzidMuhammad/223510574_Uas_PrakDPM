import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import BookListScreen from '../screens/BookListScreen';
import ProfileStackNavigator from '../screens/ProfileStackNavigator';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Books':
              iconName = 'book-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#ffffff', // Putih untuk item aktif
        tabBarInactiveTintColor: '#7a7a7a', // Abu-abu lembut untuk item tidak aktif
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarBadge: 5,
          tabBarBadgeStyle: styles.badge,
          headerShown: false
        }}
      />
      <Tab.Screen name="Books" component={BookListScreen}
        options={{ headerShown: false }}
       />
      <Tab.Screen name="Profile" component={ProfileStackNavigator}
        options={{ headerShown: false }}
       />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1c1c1c', // Hitam modern untuk latar belakang
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  header: {
    backgroundColor: '#292929', // Hitam lembut untuk header
    borderBottomWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    color: '#ffffff', // Putih untuk judul header
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#ff5252', // Merah modern untuk badge
    color: '#ffffff', // Putih untuk teks badge
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 8,
    minWidth: 18,
    minHeight: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;
