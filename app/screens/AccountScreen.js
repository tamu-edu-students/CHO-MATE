import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';

function AccountScreen(props) {
    return (
        <View style={styles.container}>
            <Text>Account Screen</Text>
            <AppButton title="Press me" onPress={() => alert("Button Presssed!")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow'
    }
})

export default AccountScreen;

