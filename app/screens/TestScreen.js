import { collection, query, where, getDocs, waitForPendingWrites } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import { db, auth } from '../config/firebase';

function TestScreen(props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [array, setArray] = React.useState([{ liquid: null, candy: null }]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setArray([{ liquid: null, candy: null }]);
    testCollection();
  });

  async function testCollection() {
    const q = query(collection(db, 'dispenses'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setArray((oldArray) => [
        ...oldArray,
        {
          liquid: doc.get('liquid'),
          candy: doc.get('candy'),
        },
      ]);
    });
    setRefreshing(false);
    console.log(array);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default TestScreen;
