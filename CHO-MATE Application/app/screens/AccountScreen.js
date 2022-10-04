import { signOut } from 'firebase/auth';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLottieView from 'lottie-react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import AppButton from '../components/AppButton';
import { auth } from '../config/firebase';

const reauthenticate = (currentPassword) => {
  const user = auth.currentUser;
  const cred = auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(cred);
};


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "CHO-MATE Notification Test! 📬",
      body: 'Here is the notification body.',
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


const changePassword = (currentPassword, newPassword) => {
  reauthenticate(currentPassword);
  const user = auth.currentUser;
  user.updatePassword(newPassword);
};

function AccountScreen({ navigate }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Account Screen</Text>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.title}>Name:</Text>
            <Text style={styles.authText}>{auth.currentUser?.displayName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Email:</Text>
            <Text style={styles.authText}>{auth.currentUser?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>UID:</Text>
            <Text style={styles.authText}>{auth.currentUser?.uid}</Text>
          </View>
        </View>
        <View style={{ width: '45%' }}>
          <AppButton title="Sign Out" onPress={() => signOut(auth)} />
        </View>
        <View style={{ width: '45%' }}>
          <AppButton title="Notifications" color="secondary"  onPress={async () => {
          await schedulePushNotification();
        }} />
        </View>
        <AnimatedLottieView
            autoPlay
            loop
            style={{ height: 200, width: 200, marginTop: 10 }}
            speed={1.1}
            source={require('../assets/empty-data.json')}
          />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  authText: {
    fontSize: 20,
    textTransform: 'uppercase',
    paddingLeft: 10,
  },
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  info: { paddingTop: 10 },
  row: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
});

export default AccountScreen;
