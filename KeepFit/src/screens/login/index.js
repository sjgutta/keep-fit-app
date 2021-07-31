import React from 'react'
import { Button, SafeAreaView, View, StyleSheet, ImageBackground } from 'react-native'
import { FontAwesome5 } from "@expo/vector-icons";
import LoadingPic from '../../assets/loadingPic.png';


import Container from '@app/components/container.js'
import Text, { Header, Subheader } from '@app/components/text.js'


const LoginScreen = props => {
    return (
        <View style={styles.container}>
            <ImageBackground source={LoadingPic} style={styles.image}>
                <Header style={styles.mainHeader} >
                    KeepFit
                </Header>
                <Subheader style={styles.subHeader}>
                    A Social Fitness Application
                </Subheader>
                <View style={styles.googleButtonContainer}>
                    <FontAwesome5.Button
                        style={styles.googleButton}
                        name="google"
                        onPress={() => props.loginUser()}
                    >
                        <Text style={styles.googleText}>Log In With Google</Text>
                    </FontAwesome5.Button>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 70,
        marginTop: "20%",
        textAlign: "center",
        color: "limegreen"
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 0,
        textAlign: "center",
        color: "black",
        backgroundColor: "limegreen"
    },
    googleButton: {
        height: 80,
        paddingLeft: 35,
        paddingRight: 35,
        backgroundColor: "green"

    },
    googleText: {
        color: 'white',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover"
    },
    googleButtonContainer: {
        paddingHorizontal: 120,
        marginTop: "50%",

    }
});

export default LoginScreen;
