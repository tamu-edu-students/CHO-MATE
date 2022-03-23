import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../config/colors'

function AppButton({ title, onPress, color = "primary", textSize = 18, style}) {
    return (
        <TouchableOpacity style={[{ backgroundColor: colors[color] }, style, styles.button]} onPress={onPress}> 
            <Text style={[styles.text, {fontSize: textSize}]}>{title}</Text>
        </TouchableOpacity>
    );
}

export default AppButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        marginVertical: 10
    },
    text: {
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})