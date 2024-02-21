// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    navigation.navigate('Movies');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.titleImage}
        source={require('../assets/filmyBg.png')}
      />
      <Text style={{ fontSize: 18, fontWeight: 500, textAlign: "center", fontFamily:"Roboto" }}>Login to Discover Your Movie Adventure!</Text>
      <TextInput
        style={styles.touch}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.touch}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 2.5 }]} title="Login" onPress={handleLogin} >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 2.5 }]} title="Login" onPress={handleLogin} >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 45,
    backgroundColor: '#fcfcf7',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  titleImage: {
    width: 200,
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
  },
  touch: {
    alignItems: "center",
    width: width / 1.1 - 10,
    height: height / 14,
    margin: 2,
    backgroundColor: '#fcfcf7',
    padding: 15,
    borderRadius: 9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    marginVertical: 20
  },
});
export default LoginScreen;
