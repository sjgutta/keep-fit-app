import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert, Image, Button, Keyboard, 
    TouchableWithoutFeedback, View } from 'react-native';
import Input from '../../components/input';
import Container from '@app/components/container.js'
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from "../../redux/actions/auth.js";
import { GenderPicker, FitnessLevelPicker } from '../../components/pickers';
import Text, { Header, SubHeader } from '@app/components/text.js';
import db from '../../firebase/firebase';
import User from '../../models/user';

const EditProfileScreen = props => {
    const isLoggedIn = useSelector(state => state.auth.loggedIn);

    const currentUserId = useSelector(state => state.auth.currentUserId);
    const currentUser = useSelector(state => state.auth.currentUser);

    const dispatch = useDispatch();

    const [newUsername, setNewUsername] = useState(currentUser.username);
    const [newHeight, setNewHeight] = useState(currentUser.height.toString());
    const [newWeight, setNewWeight] = useState(currentUser.weight.toString())
    const [newGender, setNewGender] = useState(currentUser.gender);
    const [newFitnessLevel, setNewFitnessLevel] = useState(currentUser.fitness_level);

    const usernameInputHandler = inputText => {
        setNewUsername(inputText);
    };

    const heightInputHandler = inputText => {
        setNewHeight(inputText.replace(/[^0-9]/g, ''));
    };

    const weightInputHandler = inputText => {
        setNewWeight(inputText.replace(/[^0-9]/g, ''));
    };

    const genderInputHandler = inputText => {
        setNewGender(inputText);
    };

    const fitnessLevelInputHandler = inputText => {
        setNewFitnessLevel(inputText);
    };

    const cancelHandler = () => {
        props.cancelEdit();
    }

    const finishEditHandler = (user_id, user_object) => {
        let username, height, weight, gender, fitness_level;
        if (newUsername) {
            username = newUsername;
        } else {
            username = currentUser.username;
        }
        if (newHeight) {
            height = newHeight;
        } else {
            height = currentUser.height;
        }
        if (newWeight) {
            weight = newWeight;
        } else {
            weight = currentUser.weight;
        }
        if (newGender) {
            gender = newGender;
        } else {
            gender = currentUser.gender;
        }
        if (newFitnessLevel) {
            fitness_level = newFitnessLevel;
        } else {
            fitness_level = currentUser.fitness_level;
        }
        if(username === currentUser.username) {
            db.collection(User.collection_name).doc(currentUserId).update({
                username: username,
                height: height,
                weight: weight,
                gender: gender,
                fitness_level: fitness_level
            }).then(function() {
                db.collection(User.collection_name).doc(currentUserId).get().then(function (user) {
                    dispatch(loginUser(user.id, user.data()));
                    cancelHandler();
                });
            });
        } else {
            db.collection(User.collection_name).where("username", "==", username).get().then(function (snapshot) {
                if (!snapshot.empty) {
                    Alert.alert('Error', 'A user already exists with that username!', [
                        { text: 'Dismiss', style: 'cancel' }
                    ])
                } else {
                    db.collection(User.collection_name).doc(currentUserId).update({
                        username: username,
                        height: height,
                        weight: weight,
                        gender: gender,
                        fitness_level: fitness_level
                    }).then(function() {
                        db.collection(User.collection_name).doc(currentUserId).get().then(function (user) {
                            dispatch(loginUser(user.id, user.data()));
                            cancelHandler();
                        });
                    });
                }
            })
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <SafeAreaView style={styles.mainContainer}>
                <Button title="<< Cancel" onPress={() => cancelHandler()} />
                <Header style={styles.mainHeader}>
                    Edit Profile
                </Header>
                <Text style={styles.inputHeader}>New Username:</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="default"
                    onChangeText={usernameInputHandler}
                    value={newUsername}
                />
                <Text style={styles.inputHeader}>New Height (Inches):</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={heightInputHandler}
                    value={newHeight}
                />
                <Text style={styles.inputHeader}>New Weight (pounds):</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={3}
                    onChangeText={weightInputHandler}
                    value={newWeight}
                />
                <View>
                    <Text style={styles.inputHeader}>New Gender:</Text>
                    <GenderPicker
                        selectedValue={newGender}
                        onValueChange={genderInputHandler}
                        style={styles.picker}
                    />
                    <Text style={styles.inputHeader}>New Fitness Level:</Text>
                    <FitnessLevelPicker
                        selectedValue={newFitnessLevel}
                        onValueChange={fitnessLevelInputHandler}
                        style={styles.picker}
                    />
                </View>
                <Button title="Save Changes" onPress={() => { finishEditHandler(currentUserId, currentUser) }} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 50,
        textAlign: "center"
    },
    inputHeader: {
        fontWeight: 'bold',
        fontSize: 15
    },
    mainContainer: {
        marginTop: 20,
        paddingHorizontal: 35
    },
    googleButton: {
        height: 60,
        paddingLeft: 50,
        paddingRight: 50
    },
    googleButtonContainer: {
        marginTop: 25
    },
    googleText: {
        color: 'white',
        fontWeight: 'bold'
    },
    fullName: {
        fontSize: 15
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    twoHeadings: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 15
    },
    followers: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    following: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    subheading: {
        fontWeight: 'bold'
    }
});

export default EditProfileScreen;
