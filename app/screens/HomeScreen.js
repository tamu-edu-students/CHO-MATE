import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Avatar, ProgressBar, Button } from 'react-native-paper';
import init from 'react_native_mqtt';

import AppButton from '../components/AppButton';
import ListItemSeparator from '../components/ListItemSeparator';
import colors from '../config/colors';
import { auth } from '../config/firebase';

const HomeScreen = React.memo(function HomeScreen({ navigation }) {
  let client;
  let connected = false;
  const [state, setState] = React.useState(false);
  const [liquid, setLiquid] = React.useState(undefined);
  const [candy, setCandy] = React.useState(undefined);

  const clearCandy = () => setCandy(undefined);
  const clearLiquid = () => setLiquid(undefined);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (connected) {
        client.disconnect();
      }
      setState(false);
    });

    return unsubscribe;
  }, [navigation]);

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  function onConnect() {
    console.log('[MQTT] Connection Successful.');
    client.subscribe('app/amount/#');
    // eslint-disable-next-line no-undef
    const stock = new Paho.MQTT.Message('STOCK');
    stock.destinationName = 'chomate/request';

    client.send(stock);

    setState(true);
    connected = true;
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('[MQTT] Connection Lost. Reason: ' + responseObject.errorMessage);
    }
    if (responseObject.errorCode === 0) {
      console.log('[MQTT] Disconnected with no errors.');
    }
    connected = false;
  }

  function onMessageArrived(message) {
    let liquidGood = false;
    let candyGood = true;
    console.log('[MQTT] Message Received.');
    console.log('[MQTT] <Message: ' + message.payloadString + '>');
    console.log('[MQTT] <Destination: ' + message.destinationName + '>');

    if (message.destinationName === 'app/amount/candy') {
      setCandy(Number(message.payloadString));
      candyGood = true;
    }
    if (message.destinationName === 'app/amount/liquid') {
      setLiquid(Number(message.payloadString));
      liquidGood = true;
    }

    if (candyGood && liquidGood) {
      setState(false);
      client.disconnect();
    }
  }
  function buttonPress(candy, liquid) {
    clearCandy();
    clearLiquid();
    setState(true);
    console.log(candy);
    console.log(liquid);
    // eslint-disable-next-line no-undef
    client = new Paho.MQTT.Client('driver.cloudmqtt.com', 38763, Device.deviceName);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      userName: 'tvsqdgpg',
      password: '7hNc0P-Bx048',
      onSuccess: onConnect,
      useSSL: true,
    });
  }

  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.header}>
          {auth.currentUser.displayName
            ? 'Welcome back, ' + String(auth.currentUser.displayName) + '!'
            : 'Welcome back!'}
        </Text>
        <Card
          style={{
            marginTop: 10,
            height: '40%',
            width: 350,
            borderRadius: 30,
            backgroundColor: '#edfffd',
            ...styles.shadow,
          }}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Feather style={{ paddingHorizontal: 10 }} name="info" size={40} />
              <Text style={styles.title}>Machine Status</Text>
            </View>
            <ListItemSeparator />
            <View style={styles.cardItem}>
              <Avatar.Icon style={{ backgroundColor: '#00e1ff' }} size={50} icon="water-outline" />
              <Text style={styles.listHeader}>Liquid Amount:</Text>
            </View>
            <ProgressBar
              style={{ marginTop: 10 }}
              indeterminate={state}
              progress={liquid}
              color="#00e1ff"
            />
            <View style={styles.cardItem}>
              <Avatar.Icon style={{ backgroundColor: '#f7886f' }} size={50} icon="circle-outline" />
              <Text style={styles.listHeader}>Candy Amount:</Text>
            </View>
            <ProgressBar
              style={{ marginTop: 10 }}
              indeterminate={state}
              progress={candy}
              color="#f7886f"
            />
          </Card.Content>
          <Card.Actions style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity>
              <Button
                onPress={buttonPress}
                dark
                mode="contained"
                color={colors.secondary}
                labelStyle={{ fontSize: 15 }}>
                Refresh
              </Button>
            </TouchableOpacity>
          </Card.Actions>
        </Card>
        <Card
          style={{
            marginTop: 20,
            height: '18%',
            width: 230,
            borderRadius: 30,
            backgroundColor: '#edfffd',
            ...styles.shadow,
          }}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Feather style={{ paddingHorizontal: 10 }} name="droplet" size={30} />
              <Text style={[styles.title, { fontSize: 20 }]}>Glucose Reading</Text>
            </View>
            <ListItemSeparator />
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 70, marginTop: 7 }}>130</Text>
              <Text style={{ fontSize: 20, marginTop: 30 }}>mg/dl</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={{ marginTop: 40 }}>
          <AppButton
            style={{ height: 75 }}
            textSize={25}
            title="Dispense Sugar"
            onPress={() => navigation.navigate('Dispense')}
          />
        </View>
      </View>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    textTransform: 'uppercase',
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  listHeader: {
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
