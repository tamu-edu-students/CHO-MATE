import { Constants } from 'expo-constants';
import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import ListItemSeparator from '../components/ListItemSeparator';
import colors from '../config/colors';
import { auth } from '../config/firebase';

function AccountScreen({ navigate }) {
  console.log(auth.currentUser);
  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Account Screen</Text>
        <Text style={styles.title}>Name: {auth.currentUser?.displayName}</Text>
        <Text style={styles.title}>Email: {auth.currentUser?.email}</Text>
        <Text style={styles.title}>UID: {auth.currentUser?.uid} </Text>
        <View style={{ marginTop: 10, width: '45%' }}>
          <AppButton title="Sign Out" onPress={() => signOut(auth)} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default AccountScreen;
