import React, { useState } from 'react';
import {
    SafeAreaView, Text, Alert, View,
    Button, StyleSheet, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Input from '../../components/input';
import Container from '@app/components/container.js'
import { Header } from '@app/components/text.js';

import { createUser, loginUser } from "../../redux/actions/auth.js";
import { useSelector, useDispatch } from 'react-redux';
import { GenderPicker, FitnessLevelPicker } from '../../components/pickers';
import DateTimePicker from '@react-native-community/datetimepicker';
import User from '../../models/user.js';
import db from "../../firebase/firebase";
import * as firebase from 'firebase';



const CreateUserScreen = props => {
    const [enteredUsername, setUsername] = useState('');
    const [enteredBirthday, setBirthday] = useState(new Date());
    const [enteredHeight, setHeight] = useState('');
    const [enteredWeight, setWeight] = useState('');
    const [enteredGender, setGender] = useState('');
    const [enteredFitnessLevel, setFitnessLevel] = useState('');

    const usernameInputHandler = inputText => {
        setUsername(inputText);
    };

    const birthdayInputHandler = (event, selectedDate) => {
        setBirthday(selectedDate);
    };

    const heightInputHandler = inputText => {
        setHeight(inputText.replace(/[^0-9]/g, ''));
    };

    const weightInputHandler = inputText => {
        setWeight(inputText.replace(/[^0-9]/g, ''));
    };

    const genderInputHandler = inputText => {
        setGender(inputText);
    };

    const fitnessLevelInputHandler = inputText => {
        setFitnessLevel(inputText);
    };

    const dispatch = useDispatch();

    const currentUserId = useSelector(state => state.auth.currentUserId);
    const currentUser = useSelector(state => state.auth.currentUser);

    const finishCreateHandler = (user_id, user_object) => {
        let birthday = enteredBirthday.toLocaleDateString();
        if (!enteredUsername || !enteredWeight || !enteredHeight || !enteredGender || !enteredFitnessLevel) {
            Alert.alert('Error', 'You must fill out all fields', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        let username = enteredUsername.toLowerCase();
        db.collection(User.collection_name).where("username", "==", username).get().then(function (snapshot) {
            if (!snapshot.empty) {
                Alert.alert('Error', 'A user already exists with that username!', [
                    { text: 'Dismiss', style: 'cancel' }
                ])
            } else {
                db.collection(User.collection_name).doc(user_id).update({
                    isNew: firebase.firestore.FieldValue.delete(),
                    username: username,
                    birthday: birthday,
                    weight: parseInt(enteredWeight),
                    height: parseInt(enteredHeight),
                    gender: enteredGender,
                    fitness_level: enteredFitnessLevel
                }).then(function (result) {
                    db.collection(User.collection_name).doc(user_id).get().then(function (user) {
                        dispatch(loginUser(user.id, user.data()));
                    })
                });
            }
        })
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <SafeAreaView style={styles.container}>
                <Header style={styles.mainHeader}>
                    Welcome to KeepFit!
                    </Header>
                <Text style={styles.inputHeader}>Username:</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="default"
                    onChangeText={usernameInputHandler}
                    value={enteredUsername}
                    testID="usernameInput"
                />
                <Text style={styles.inputHeader}>Birthday:</Text>
                    <DateTimePicker
                        value={enteredBirthday}
                        maximumDate={Date.parse(new Date())}
                        mode="date"
                        display="default"
                        onChange={birthdayInputHandler}
                        style={styles.dateTimePicker}
                        testID="birthdayInput"
                    />
                <Text style={styles.inputHeader}>Height (Inches):</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={heightInputHandler}
                    value={enteredHeight}
                    testID="heightInput"
                />
                <Text style={styles.inputHeader}>Weight (pounds):</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={3}
                    onChangeText={weightInputHandler}
                    value={enteredWeight}
                    testID="weightInput"
                />
                <View>
                    <Text style={styles.inputHeader}>Gender:</Text>
                    <GenderPicker
                        selectedValue={enteredGender}
                        onValueChange={genderInputHandler}
                        style={styles.picker}
                        testID="genderInput"
                    />
                    <Text style={styles.inputHeader}>Fitness Level:</Text>
                    <FitnessLevelPicker
                        selectedValue={enteredFitnessLevel}
                        onValueChange={fitnessLevelInputHandler}
                        style={styles.picker}
                        testID="fitnessInput"
                    />
                </View>
                <Button title="Create" testID="createButton" onPress={() => { finishCreateHandler(currentUserId, currentUser) }} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 40,
        textAlign: "center",
        marginBottom: 40
    },
    input: {
        width: 50,
        textAlign: 'center',
        marginBottom: 15,
        width: 100
    },
    inputHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    picker: {
        height: 30
    },
    dateTimePicker: {
        marginTop: 10,
        marginHorizontal: '25%',
        width: '30%',
        marginBottom: 10
    }
});

export default CreateUserScreen;
