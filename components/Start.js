import React, { useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const COLORS = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const [bgColor, setBgColor] = useState(COLORS[3]);

  const signInUser = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", { userID: result.user.uid, username, background: bgColor });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
        console.error("Sign in error:", error);
      });
  };

  return (
    <ImageBackground source={require('../image/Background-Image.png')} style={styles.container}>
      <Text style={styles.title}>Chat App</Text>
      <View style={styles.content}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.textInput}
          placeholder="Your Name"
          autoCapitalize="words"
        />
        <Text style={styles.text}>Choose Background Color</Text>
        <View style={styles.bgColors}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBlock,
                { backgroundColor: color, borderWidth: bgColor === color ? 2 : 0 },
              ]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={signInUser}
          disabled={!username}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    padding: '6%',
    marginTop: '60%',
    borderRadius: 10,
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  bgColors: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  colorBlock: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#757083',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;
