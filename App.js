import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './local/store';
import LoginScreen from './screens/login';
import MovieScreen from './screens/movies';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Movies" >
          <Stack.Screen name="Login" component={LoginScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name="Movies" component={MovieScreen}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
