import React from 'react';
import { StyleSheet, ImageBackground, View, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';

import AppButton from '../components/AppButton';
import colors from '../config/colors';

function WelcomeScreen(props) {
    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require("../assets/background.jpg")}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/CHO-Mate-No-Tag.png')} />
                <Image style={styles.tagline} source={require('../assets/CHO-Mate-Name.png')} />
            </View>
            <View style={styles.buttonContainer}>
                <AppButton title="Login" />
                <AppButton title="Register" color="secondary" />
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",

    },
    buttonContainer: {
        padding: 20,
        width: '100%'
    },
    logo: {
        width: 150,
        height: 150,
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center"
    },
    tagline: {
        paddingVertical: 20,
        resizeMode:'contain',
        height:55

    }
})

export default WelcomeScreen;