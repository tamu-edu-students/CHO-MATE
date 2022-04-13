/* eslint-disable no-undef */
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { addDoc, collection } from 'firebase/firestore';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Snackbar, TextInput, ActivityIndicator } from 'react-native-paper';
import init from 'react_native_mqtt';

import AppButton from '../components/AppButton';
import ListItemSeparator from '../components/ListItemSeparator';
import colors from '../config/colors';
import { auth, db } from '../config/firebase';

function DispenseScreen({ navigation }) {
  let client;
  const [liquidText, setLiquidText] = React.useState('');
  const [candyText, setCandyText] = React.useState('');
  const [liquidVal, setLiquidVal] = React.useState('');
  const [candyVal, setCandyVal] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  function onConnect(candyAmount, liquidAmount) {
    console.log('[MQTT] Connection Successful.');
    client.subscribe('app/response');

    console.log('Sending message to machine for dispense');
    const liquid = new Paho.MQTT.Message(candyAmount);
    const candy = new Paho.MQTT.Message(liquidAmount);
    const dispense = new Paho.MQTT.Message('DISPENSE');

    liquid.destinationName = 'chomate/liquid';
    candy.destinationName = 'chomate/candy';
    dispense.destinationName = 'chomate/dispense';

    client.send(liquid);
    client.send(candy);
    client.send(dispense);

    setAnimate(true);
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('[MQTT] Connection Lost. Reason: ' + responseObject.errorMessage);
    }
    if (responseObject.errorCode === 0) {
      console.log('[MQTT] Disconnected with no errors.');
    }
  }

  async function onMessageArrived(message) {
    console.log('[MQTT] Message Received.');
    console.log('[MQTT] <Message: ' + message.payloadString + '>');
    console.log('[MQTT] <Destination: ' + message.destinationName + '>');

    if (message.payloadString === 'RECEIVED') {
      try {
        const docRef = await addDoc(collection(db, 'dispenses'), {
          liquid: String(liquidText),
          candy: String(candyText),
          uid: auth.currentUser?.uid,
        });
        console.log('Created document with ID: ', docRef.id);
      } catch (e) {
        console.error("Couldn't create document: ", e);
      }
      setCandyText('');
      setLiquidText('');
      setVisible(true);
      setAnimate(false);
      client.disconnect();
      //console.log('[MQTT] Disconnected.');
    }
  }

  function buttonPress(candyAmount, liquidAmount) {
    client = new Paho.MQTT.Client('driver.cloudmqtt.com', 38763, Device.deviceName);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      userName: 'tvsqdgpg',
      password: '7hNc0P-Bx048',
      onSuccess: () => onConnect(candyAmount, liquidAmount),
      useSSL: true,
    });
  }

  return (
    <View style={styles.container}>
      <Snackbar
        duration={2000}
        style={styles.messageBar}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'OK',
          onPress: () => {
            onDismissSnackBar();
          },
        }}>
        Success! Your sugar should be dispensed shortly.
      </Snackbar>
      <View style={styles.indicator}>
        <ActivityIndicator size={40} animating={animate} style={{ marginBottom: 10 }} />
        {animate && <Text style={styles.listHeader}>Sending to Machine...</Text>}
      </View>
      <Card
        style={{
          marginTop: 10,
          height: '45%',
          width: 350,
          borderRadius: 30,
          backgroundColor: '#edfffd',
          ...styles.shadow,
        }}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Dispense Sugar</Text>
          </View>
          <ListItemSeparator style={{ marginBottom: 10 }} />
          <View style={styles.cardItem}>
            <Text style={styles.listHeader}>Liquid Amount:</Text>
            <TextInput
              style={{ width: '90%' }}
              left={<TextInput.Icon name="water-outline" />}
              theme={{ roundness: 5 }}
              selectionColor={colors.primary}
              underlineColor={colors.primary}
              activeUnderlineColor={colors.primary}
              label="Liquid Dispense Amount"
              value={liquidText}
              onChangeText={(liquidText) => setLiquidText(liquidText)}
            />
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.listHeader}>Candy Amount:</Text>
            <TextInput
              style={{ width: '90%' }}
              left={<TextInput.Icon name="circle-outline" />}
              theme={{ roundness: 5 }}
              selectionColor={colors.secondary}
              underlineColor={colors.secondary}
              activeUnderlineColor={colors.secondary}
              label="Candy Dispense Amount"
              value={candyText}
              onChangeText={(candyText) => setCandyText(candyText)}
            />
          </View>
          <View style={[styles.cardItem, { marginTop: -5 }]}>
            <AppButton onPress={() => buttonPress(candyText, liquidText)} title="Dispense" />
          </View>
        </Card.Content>
        <Card.Actions />
      </Card>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons size={30} name="arrow-back" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DispenseScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    left: 20,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  cardItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 30,
    textTransform: 'uppercase',
  },
  listHeader: {
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  messageBar: {
    bottom: 110,
    position: 'absolute',
    borderRadius: 25,
    margin: 30,
  },
  indicator: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
