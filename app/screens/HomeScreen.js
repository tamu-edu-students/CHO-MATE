import React from 'react';
import { View, Text, StyleSheet, ImageBackground  } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Avatar, ProgressBar } from 'react-native-paper';
import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';

import AppButton from '../components/AppButton';
import ListItemSeparator from '../components/ListItemSeparator';

import colors from '../config/colors';


function HomeScreen(props) {
    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require("../assets/background.jpg")}>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <Text style={styles.header}>Welcome Back, Kelton!</Text>
                <Card style={{
                    marginTop: 10,
                    height: "40%",
                    width: 350,
                    borderRadius: 30,
                    backgroundColor: "#edfffd",
                    ...styles.shadow
                }}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <Feather style={{paddingHorizontal: 10}} name="info" size={40}/>
                            <Text style={styles.title}>Machine Status</Text>
                        </View>
                        <ListItemSeparator />
                        <View style={styles.cardItem}>
                            <Avatar.Icon style={{backgroundColor: "#00e1ff"}} size={50} icon="water-outline" />
                            <Text style={styles.listHeader}>Liquid Amount:</Text>
                        </View>
                        <ProgressBar style={{marginTop: 10}} progress={0.6} color="#00e1ff" />
                        <View style={styles.cardItem}>
                            <Avatar.Icon style={{backgroundColor: "#f7886f"}} size={50} icon="circle-outline" />
                            <Text style={styles.listHeader}>Candy Amount:</Text>
                        </View>
                        <ProgressBar style={{marginTop: 10}} progress={0.85} color="#f7886f" />                     
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
                <Card style = {{
                    marginTop: 20,
                    height: "18%",
                    width: 230,
                    borderRadius: 30,
                    backgroundColor: "#edfffd",
                    ...styles.shadow
                }}>
                    <Card.Content>
                    <View style={styles.cardHeader}>
                            <Feather style={{paddingHorizontal: 10}} name="droplet" size={30}/>
                            <Text style={[styles.title, {fontSize: 20}]}>Glucose Reading</Text>
                        </View>
                        <ListItemSeparator />
                        <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                            <Text style={{fontSize: 70, marginTop: 7}}>130</Text>
                            <Text style={{fontSize: 20, marginTop: 30}}>mg/dl</Text>
                        </View>
                    </Card.Content>
                </Card>
                <View style={{marginTop:40}}>
                    <AppButton style={{height: 75}} textSize={25} title="Dispense Sugar" onPress={() => alert("Button Presssed!")} />
                </View>
                
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
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    header: {
        fontWeight:"bold",
        fontSize: 40,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 20,
        paddingTop: 10
    },
    title: {
        fontSize: 30,
        textTransform: 'uppercase',
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    listHeader: {
        paddingHorizontal: 10,
        fontSize: 20,
        fontWeight: '500',
        textTransform: 'uppercase'
    }
})

export default HomeScreen;

