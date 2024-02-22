import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import MovieScreen from './screens/movies';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" >
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
