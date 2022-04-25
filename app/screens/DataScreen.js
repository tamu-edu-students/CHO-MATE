import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { Divider, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../config/colors';
import { db, auth } from '../config/firebase';

function DataScreen(props) {
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

  const ItemDivider = () => {
    return <Divider style={{ backgroundColor: 'black' }} />;
  };

  async function getData() {
    const document = collection(db, 'dispenses');
    let q;
    try {
      q = query(document, orderBy('date', 'desc'), where('uid', '==', auth.currentUser.uid));
    } catch (e) {
      console.error(e);
    }
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
        <View style={styles.flatlistContainer}>
          <FlatList
            style={styles.flatlist}
            keyExtractor={(item, index) => 'key' + index}
            onRefresh={onRefresh}
            refreshing={refreshing}
            data={stateArray}
            extraData={stateArray}
            ItemSeparatorComponent={ItemDivider}
            renderItem={({ item, index }) => (
              <View style={styles.listContainer}>
                <View style={styles.date}>
                  <Text style={styles.dateText}>
                    {item.date.toDate().toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.dateText}>
                    {item.date.toDate().toLocaleTimeString([], { timeStyle: 'short' })}
                  </Text>
                </View>
                <View style={styles.list}>
                  <Avatar.Icon
                    style={{
                      backgroundColor: colors.liquid,
                      shadowOpacity: 0.25,
                      shadowRadius: 1.5,
                    }}
                    size={45}
                    icon="water-outline"
                  />
                  <Text style={styles.fontLiquid}>LIQUID:</Text>
                  <Text style={styles.fontLiquidAmount}>{item.liquid}g</Text>
                  <Avatar.Icon
                    style={{
                      backgroundColor: colors.candy,
                      shadowOpacity: 0.25,
                      shadowRadius: 1.5,
                    }}
                    size={45}
                    icon="circle-outline"
                  />
                  <Text style={styles.fontCandy}>CANDY:</Text>
                  <Text style={styles.fontCandyAmount}>{item.candy}g</Text>
                </View>
              </View>
            )}
          />
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
    flex: 1,
    width: '90%',
    marginTop: 50,
    marginBottom: 115,
  },
  date: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateText: {
    color: 'grey',
    marginRight: 5,
    fontSize: 18,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    marginVertical: 5,
  },
  listItem: {
    marginHorizontal: 5,
  },
  fontCandy: {
    fontSize: 20,
    marginHorizontal: 10,
    color: colors.candy,
  },
  fontCandyAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.candyDark,
  },
  fontLiquid: {
    fontSize: 20,
    marginHorizontal: 10,
    color: colors.liquid,
  },
  fontLiquidAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.liquidDark,
    paddingRight: 15,
  },
  flatlist: {
    marginBottom: -35,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  flatlistContainer: {
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
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

export default DataScreen;
