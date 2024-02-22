import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState('');

  const handleLogin = async () => {
    const storedData = await AsyncStorage.getItem('userDetails');
    const parsedData = JSON.parse(storedData);
    if (parsedData) {
      if (parsedData.username === username && parsedData.password === password) {
        setUsername('');
        setPassword('');
        navigation.navigate('Movies');
      }else
      setErr("UserName or Password Incorrect !!! ");
    }
    else
      setErr("Login to continue !!! ");
  };

  const handleSignUp = async () => {
    setShowForm(true);
  };

  const handleRegister = async () => {
    setErr('');
    setUsername('');
    setPassword('');
    if (username && password && firstName) {
      const userDetails = { firstName: firstName, username: username, password: password }
      await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
      const token = '168hedwijjdiwo832idTokenhajhsjas'; 
      await AsyncStorage.setItem('token', token);
      setShowForm(false);
      setUsername('');
      setPassword('');
      setFirstName('');
      navigation.navigate('Movies');
    } else {
      alert('Please enter username and password');
    }
  };

  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.navigate('Movies');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.titleImage}
        source={require('../assets/filmyBg.png')}
      />
      <Text style={{ fontSize: 18, fontWeight: 500, textAlign: "center", fontFamily: "Roboto" }}>Login to Discover Your Movie Adventure!</Text>

      {showForm === false && (
        <>
          <TextInput
            style={styles.touch}
            placeholder="Username"
            value={username}
            onChangeText={setUsername} />
          <TextInput
            style={styles.touch}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword} />
        </>
      )}
      {showForm === true && (
        <>
          <TextInput
            style={styles.touch}
            placeholder="FirstName"
            value={firstName}
            onChangeText={setFirstName} />
          <TextInput
            style={styles.touch}
            placeholder="Username"
            value={username}
            onChangeText={setUsername} />
          <TextInput
            style={styles.touch}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword} />
        </>
      )}
      {showForm === false && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 2.5 }]} title="Login" onPress={handleLogin}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 2.5 }]} title="Login" onPress={handleSignUp}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>SignUp</Text>
          </TouchableOpacity>
        </View>
      )}
      {showForm === true && (
        <TouchableOpacity style={[styles.touch, { backgroundColor: "black", width: width / 2.5, alignSelf: "center" }]} title="Login" onPress={handleRegister}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>Register</Text>
        </TouchableOpacity>
      )}
      {err ? <Text style={{ color: "red", fontSize: 18, fontWeight: 300 }}>{err}</Text> : null}
    </View >
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
