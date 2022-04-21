import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, orderBy } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { Divider, Headline } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db, auth } from '../config/firebase';

function TestScreen(props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isRefreshed, setIsRefreshed] = React.useState(false);
  let array = [];
  const [stateArray, setStateArray] = React.useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    array = [];
    getData();
    setStateArray(array);
    setIsRefreshed(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      array = [];
      setStateArray([]);
      setIsRefreshed(false);
      return () => {
        array = [];
        setStateArray([]);
        setIsRefreshed(false);
      };
    }, [])
  );

  const ItemDivider = () => {
    return <Divider style={{ backgroundColor: 'black', marginTop: 5 }} />;
  };

  async function getData() {
    const document = collection(db, 'dispenses');
    let q;
    try {
      q = query(document, orderBy('date'), where('uid', '==', auth.currentUser.uid));
    } catch (e) {
      console.error(e);
    }
    //const q = query(document, orderBy('uid'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setRefreshing(false);
  }
  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Recent Dispensings</Text>
          <Text style={styles.subheader}>{!isRefreshed ? 'Pull to Refresh' : null}</Text>
        </View>
        <FlatList
          style={styles.flatlist}
          keyExtractor={(item, index) => 'key' + index}
          onRefresh={onRefresh}
          refreshing={refreshing}
          data={stateArray}
          extraData={stateArray}
          ItemSeparatorComponent={ItemDivider}
          renderItem={({ item, index }) => (
            <View style={styles.list}>
              <Text style={styles.font}>Candy: {item.candy === '' ? '0' : item.candy}</Text>
              <Text style={styles.font}>Liquid: {item.liquid === '' ? '0' : item.liquid}</Text>
              <Text style={styles.font}>Date: {item.date.toDate().toLocaleString()}</Text>
            </View>
          )}
        />
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
    flex: 1,
    width: '90%',
    marginTop: 50,
    marginBottom: 115,
  },
  list: {
    marginVertical: 5,
  },
  font: {
    fontSize: 20,
    textTransform: 'uppercase',
  },
  flatlist: {
    marginBottom: -35,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  subheader: {
    fontSize: 20,
  },
});

export default TestScreen;
