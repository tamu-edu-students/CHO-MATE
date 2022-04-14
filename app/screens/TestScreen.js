import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db, auth } from '../config/firebase';

function TestScreen(props) {
  const [refreshing, setRefreshing] = React.useState(false);
  let array = [];
  const [stateArray, setStateArray] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    array = [];
    testCollection();
    setStateArray(array);
  });

  useFocusEffect(
    React.useCallback(() => {
      array = [];
      setStateArray([]);
      return () => {
        array = [];
        setStateArray([]);
      };
    }, [])
  );

  async function testCollection() {
    const q = query(collection(db, 'dispenses'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setRefreshing(false);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.container}
        data={stateArray}
        renderItem={({ item, index }) => (
          <View style={styles.list}>
            <Text style={styles.font}>Candy: {item.candy === '' ? '0' : item.candy}</Text>
            <Text style={styles.font}>Liquid: {item.liquid === '' ? '0' : item.liquid}</Text>
            <Divider style={{ backgroundColor: 'black', marginTop: 5 }} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    marginVertical: 5,
  },
  font: {
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default TestScreen;
