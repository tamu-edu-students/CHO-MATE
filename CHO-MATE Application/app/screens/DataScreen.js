import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { Divider, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Popup from '../components/Popup';
import colors from '../config/colors';
import { db, auth } from '../config/firebase';

function DataScreen(props) {
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isRefreshed, setIsRefreshed] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  let array = [];
  const [stateArray, setStateArray] = React.useState([]);

  const clearError = () => setError(false);

  const onRefresh = () => {
    setRefreshing(true);
    array = [];
    getData();
    setStateArray(array);
    setIsRefreshed(true);
  };

  const EmptyList = () => {
    if (!isRefreshed) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Pull down to refresh</Text>
          <AnimatedLottieView
            autoPlay
            loop
            style={{ height: 150, width: 150, marginTop: -10 }}
            speed={1.1}
            source={require('../assets/swipe-down.json')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data to show</Text>
          <AnimatedLottieView
            autoPlay
            loop
            style={{ height: 150, width: 150, marginTop: 0 }}
            speed={1.1}
            source={require('../assets/empty-data.json')}
          />
        </View>
      );
    }
  };

  const ItemDivider = () => {
    return <Divider style={{ backgroundColor: 'black' }} />;
  };

  async function getData() {
    const document = collection(db, 'dispenses');
    let q;
    try {
      q = await query(document, orderBy('date', 'desc'), where('uid', '==', auth.currentUser.uid));
    } catch (e) {
      console.log(e.message);
      setErrorMessage(e.message);
      setError(true);
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      array.push({ ...doc.data(), key: doc.id });
    });
    setRefreshing(false);
  }
  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <SafeAreaView style={styles.container}>
        <Popup title="ERROR" dialogue={errorMessage} visible={error} onPress={clearError} />
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Recent Data</Text>
        </View>
        <View style={styles.flatlistContainer}>
          <FlatList
            style={styles.flatlist}
            onRefresh={onRefresh}
            refreshing={refreshing}
            data={stateArray}
            extraData={stateArray}
            ListEmptyComponent={EmptyList}
            contentContainerStyle={{ flexGrow: 1 }}
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
                  <Text style={styles.fontLiquidAmount}>{item.liquid}mL</Text>
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
    marginBottom: 120,
  },
  date: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateText: {
    color: colors.grey,
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
    flex: 1,
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
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    marginBottom: 10,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: 'grey',
  },
});

export default DataScreen;
