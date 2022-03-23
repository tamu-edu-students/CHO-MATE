import React from 'react';
import { StyleSheet, ImageBackground, View, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';

import AppButton from '../components/AppButton';
import colors from '../config/colors';

function LoginScreen(props) {

    const [emailText, setEmailText] = React.useState("");
    const [passwordText, setPasswordText] = React.useState("");

    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require("../assets/background.jpg")}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                    <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../assets/CHO-Mate-No-Tag.png')} />
                    <Image style={styles.tagline} source={require('../assets/CHO-Mate-Name.png')} />
                    </View>
                    <View style={styles.textContainer}>
                    <TextInput style={styles.input}
                    selectionColor={colors.primary} 
                    underlineColor={colors.primary} 
                    activeUnderlineColor={colors.primary} 
                    label="Email" value={emailText} 
                    onChangeText={emailText => setEmailText(emailText)} />
                    <TextInput 
                    secureTextEntry={true} 
                    selectionColor={colors.secondary} 
                    underlineColor={colors.secondary} 
                    activeUnderlineColor={colors.secondary} 
                    label="Password" value={passwordText} 
                    onChangeText={passwordText => setPasswordText(passwordText)} />
                    </View>
                <View style={{width: "45%"}}>
                    <AppButton textSize={25} title="Login" />
                </View>
                </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",

    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: "100%",
        height: "100%"
    },
    input: {
        marginVertical: 15
    },
    textContainer: {
        padding: 20,
        width: '90%'
    },
    logo: {
        width: 150,
        height: 150,
    },
    logoContainer: {
        top: 70,
        alignItems: "center",
        marginBottom: 70
    },
    tagline: {
        paddingVertical: 20,
        resizeMode:'contain',
        height:55

    }
})

export default LoginScreen;