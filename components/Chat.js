import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import {AsyncStorage} from "@react-native-async-storage/async-storage";
// import CustomActions from './CustomActions';


const Chat = ({route, navigation, db, isConnected, storage}) => {
    const { username, background, userID } = route.params;
    const [messages, setMessages] = useState([]);
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
      }

    const renderBubble = (props) => {
        return <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#000"
            },
            left: {
              backgroundColor: "#FFF"
            }
          }}
        />
      }

      const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
       }

    let unsubMessages;
    useEffect(() => {
      if (isConnected === true){
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
        navigation.setOptions({ title: username });
     
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({ id: doc.id, ...doc.data(),  createdAt: new Date(doc.data().createdAt.toMillis()), })
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        });
      } else loadCachedMessages();

        return () => {
          if (unsubMessages) unsubMessages();
        }
      }, [isConnected]); 

      const cacheMessages = async (messagesToCache) => {
        try {
          await AsyncStorage.setItem(
            "messages",
            JSON.stringify(messagesToCache)
          );
        } catch (error) {
          console.log(error.message);
        }
      };

      const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
        setMessages(JSON.parse(cachedMessages));
      };

      const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} {...props} />;
      };


      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: userID,
              name: username,
            }}
          />
          {Platform.OS === "android" || Platform.OS === 'ios'? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      );     
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
 }
});

export default Chat;