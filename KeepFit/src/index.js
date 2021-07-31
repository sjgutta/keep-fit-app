import React, { useState, useEffect } from 'react';
import {
    useColorScheme,
    Keyboard,
    KeyboardAvoidingView,
    StatusBar,
    Pressable,
    Platform,
} from 'react-native';

import { Provider } from 'react-redux';
import store from './redux/store';

import RootStackNavigator from '@app/navigation/RootStackNavigator.js';

import Color from './theme/color';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const {
            status: existingStatus,
        } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

function App() {
    const colorScheme = useColorScheme();
    registerForPushNotificationsAsync();

    return (
        <Provider store={store}>
            <KeyboardAvoidingView
                style={{
                    backgroundColor:
                        colorScheme === 'light'
                            ? Color.light.backgroundColor
                            : Color.dark.backgroundColor,
                    flex: 1,
                }}
                behavior="padding"
            >
                <Pressable
                    onPress={() => Keyboard.dismiss()}
                    style={{ flex: 1 }}
                >
                    <StatusBar
                        barStyle={
                            colorScheme === 'light'
                                ? 'dark-content'
                                : 'light-content'
                        }
                    />
                    <RootStackNavigator />
                </Pressable>
            </KeyboardAvoidingView>
        </Provider>
    );
}

export default App;
