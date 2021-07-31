import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { googleiosClientId, googleandroidClientId } from '../keys.js';

import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as Google from 'expo-google-app-auth';

import LoginScreen from '@app/screens/login'
import MainScreen from '@app/screens/main';
import CreateUserScreen from '@app/screens/createUser';

import User from "../models/user"

import Color from '@app/theme/color'
import { log } from 'react-native-reanimated'
import firebase from "firebase";

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, createUser } from "../redux/actions/auth.js";
import db from "../firebase/firebase";


const Stack = createStackNavigator()

const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Color.light.backgroundColor,
    },
}

const darkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: Color.dark.backgroundColor,
    },
}

function RootStackNavigator() {
    const colorScheme = useColorScheme()

    const isLoggedIn = useSelector(state => state.auth.loggedIn);

    const creatingUser = useSelector(state => state.auth.creatingUser);

    const dispatch = useDispatch();

    const loginStateHandler = (user_id, user_object) => {
        console.log("called handler");
        console.log(user_id);
        console.log(user_object);
        if(user_object.isNew) {
            dispatch(createUser(user_id, user_object));
        } else {
            dispatch(loginUser(user_id, user_object));
        }
    }

    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id
                ) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };

    const onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
            function (firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    console.log("built credential");
                    // Sign in with credential from the Google user.
                    firebase
                        .auth().signInWithCredential(credential)
                        .then(function (result) {
                            console.log('user signed in ');
                            if (result.additionalUserInfo.isNewUser) {
                                console.log("creating a user")
                                db.collection(User.collection_name).doc(result.user.uid).set({
                                    full_name: result.additionalUserInfo.profile.given_name + " " + result.additionalUserInfo.profile.family_name,
                                    email: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    isNew: true,
                                    created_at: Date.now()
                                }).then(function () {
                                    console.log("created");
                                    db.collection(User.collection_name).doc(result.user.uid).get().then(function (user) {
                                        loginStateHandler(user.id, user.data());
                                    });
                                });
                            } else {
                                db.collection(User.collection_name).doc(result.user.uid).get().then(function (user) {
                                    loginStateHandler(user.id, user.data());
                                });
                                console.log("not new user");
                            }
                        })
                        .catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                        });
                } else {
                    db.collection(User.collection_name).doc(firebaseUser.uid).get().then(function (user) {
                        loginStateHandler(user.id, user.data());
                    });
                    console.log('User already signed-in Firebase.');
                }
            }.bind(this)
        );
    };

    const signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: googleandroidClientId,
                iosClientId: googleiosClientId,
                scopes: ['profile', 'email']
            });

            if (result.type === 'success') {
                console.log("calling onsignin function");
                onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    };

    let visibleScreen;
    if (creatingUser) {
        visibleScreen = <Stack.Screen name='CreateUser'>
            {(props) => <CreateUserScreen
                loginUser={signInWithGoogleAsync}
                loggedIn={isLoggedIn}
            />}
        </Stack.Screen>;
    } else if (!isLoggedIn) {
        visibleScreen = <Stack.Screen name='Login'>
            {(props) => <LoginScreen
                loginUser={signInWithGoogleAsync}
                loggedIn={isLoggedIn}
            />}
        </Stack.Screen>;
    } else {
        visibleScreen = <Stack.Screen name='Main'>
            {(props) => <MainScreen />}
        </Stack.Screen>;
    }

    return (
        <NavigationContainer
            theme={colorScheme === 'light' ? lightTheme : darkTheme}
        >
            <Stack.Navigator headerMode="none" initialRouteName="Login">
                {visibleScreen}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStackNavigator
