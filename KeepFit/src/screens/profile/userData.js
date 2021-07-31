import React, {Component} from 'react';
import { SafeAreaView, StyleSheet, Image, View, Button, TouchableOpacity } from 'react-native';
import Container from '@app/components/container.js'
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../../redux/actions/auth.js";
import Text, { Header, SubHeader } from '@app/components/text.js';
import User from "../../models/user";
import firebase from "firebase";
import db from "../../firebase/firebase";
import { TouchableHighlight } from 'react-native-gesture-handler';

const UserDataScreen = props => {
    const current_user_id = useSelector(state => state.auth.currentUserId);
    const currentUser = useSelector(state => state.auth.currentUser);

    const dispatch = useDispatch();

    const deleteAccountHandler = () => {
        db.collection(User.collection_name).where("username", "==", currentUser.username)
        .get().then(function (snapshot) {
            snapshot.forEach(function(doc) {
                doc.ref.delete().then(function () {
                    firebase.auth().currentUser.delete();
                    dispatch(logoutUser());
                });
            })
        });
    };

    return (
        <SafeAreaView>
            <Container>
                <Button title="<< Back" onPress={() => props.cancelDetails()} />
                <View>
                    <Text style={styles.bigHeading}>
                        User Data
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Username:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.username}
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Birthday:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.birthday}
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Height:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.height} inches
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Weight:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.weight} lbs.
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Gender:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.gender}
                    </Text>
                </View>
                <View style={styles.tagName}>
                    <Text style={styles.subheading}>
                        Fitness Level:
                    </Text>
                    <Text style={styles.entryHeading}>
                        {currentUser.fitness_level}
                    </Text>
                </View>

                <View style={styles.googleButtonContainer}>
                    <FontAwesome5.Button
                        style={styles.googleButton}
                        name="google"
                        onPress={() => props.logoutHandler()}
                    >
                        <Text style={styles.googleText}>Log Out With Google</Text>
                    </FontAwesome5.Button>
                </View>
                <View style={styles.deleteAccountContainer}>
                    <TouchableOpacity
                        onPress={() => deleteAccountHandler()}
                    >
                        <Text style={styles.deleteAccountText}>(X) Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    tagName: {
        flexDirection: "row",
        justifyContent: 'space-between',
        fontSize: 30,
        marginTop: "5%"
    },
    subheading: {
        fontWeight: 'bold',
        fontSize: 20
    },
    entryheading: {
        fontSize: 20
    },
    bigHeading: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    googleText: {
        color: 'white',
        fontWeight: 'bold'
    },
    googleButton: {
        height: 60,
        paddingLeft: 50,
        paddingRight: 50
    },
    googleButtonContainer: {
        marginTop: 25
    },
    deleteAccountContainer: {
        backgroundColor: "red",
        marginTop: 25,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    deleteAccountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17
    }
});

export default UserDataScreen;
