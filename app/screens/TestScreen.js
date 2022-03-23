import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';

function TestScreen(props) {
    return (
        <View style={styles.container}>
            <Text>Data Screen</Text>
            <AppButton title="Press me" onPress={() => alert("Button Presssed!")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
})

export default TestScreen;

