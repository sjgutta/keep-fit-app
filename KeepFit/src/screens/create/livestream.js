import React, { useState } from 'react';

import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View,
    Button,
} from 'react-native';

import Container from '@app/components/container.js';
import Input from '@app/components/input.js';
import { Header } from '@app/components/text.js';
import {
    MuscleGroupPicker,
    WorkoutCategoryPicker,
} from '@app/components/pickers.js';

import axios from 'axios';
import db, { firebase } from '../../firebase/firebase';
import Livestream from '../../models/livestream';

import { useSelector } from 'react-redux';

import * as WebBrowser from 'expo-web-browser';
import {
    exchangeCodeAsync,
    makeRedirectUri,
    useAuthRequest,
} from 'expo-auth-session';
import * as Linking from 'expo-linking';

import { zoomClientId, zoomClientSecret } from '@app/keys.js';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://zoom.us/oauth/authorize',
    tokenEndpoint: 'https://zoom.us/oauth/token',
    revocationEndpoint: 'https://zoom.us/oauth/revoke',
};

const CreateLivestreamsScreen = (props) => {
    const current_user_id = useSelector((state) => state.auth.currentUserId);
    const user_profile = useSelector((state) => state.auth.currentUser);

    const [enteredTitle, setTitle] = useState('');
    const [enteredDescription, setDescription] = useState('');
    const [enteredLimit, setLimit] = useState(0);
    const [enteredWorkoutCategory, setWorkoutCategory] = useState(null);
    const [enteredMuscleGroup, setMuscleGroup] = useState(null);
    const [enteredSecondaryMuscleGroup, setSecondaryMuscleGroup] = useState(
        null
    );

    const titleInputHandler = (inputText) => {
        setTitle(inputText);
    };

    const descriptionInputHandler = (inputText) => {
        setDescription(inputText);
    };

    const limitInputHandler = (inputText) => {
        setLimit(inputText);
    };

    const workoutCategoryHandler = (inputText) => {
        setWorkoutCategory(inputText);
    };

    const muscleGroupHandler = (inputText) => {
        setMuscleGroup(inputText);
    };

    const secondayMuscleGroupHandler = (inputText) => {
        setSecondaryMuscleGroup(inputText);
    };

    // Login to Zoom OAuth
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: zoomClientId,
            clientSecret: zoomClientSecret,
            usePKCE: false,
            redirectUri: makeRedirectUri({ useProxy: true }),
        },
        discovery
    );

    // Debug function to test Zoom and not waste API calls
    const getZoomUser = (headers) => {
        try {
            const res = axios.get('https://api.zoom.us/v2/users/me', {
                headers,
            });
        } catch (e) {
            console.error(e);
        }
    };

    // Create Zoom meeting
    // The Zoom API only allows for 100 requests / day per user
    const createMeeting = async (token) => {
        try {
            const headers = { authorization: `Bearer ${token}` };
            const res = await axios.post(
                'https://api.zoom.us/v2/users/me/meetings',
                {
                    topic: 'Keep Fit',
                    type: 1,
                },
                {
                    headers,
                }
            );
            return res.data;
        } catch (e) {
            console.error(e);
        }
    };

    const getAccessToken = async () => {
        // Exchange code for access token
        const code = response.params.code;
        const { accessToken, refreshToken } = await exchangeCodeAsync(
            {
                clientId: zoomClientId,
                clientSecret: zoomClientSecret,
                code,
                redirectUri: makeRedirectUri({ useProxy: true }),
            },
            discovery
        );
        return accessToken;
    };

    const createLivestream = async () => {
        const token = await getAccessToken();
        const meeting = await createMeeting(token);
        console.log(meeting);
        // uncomment for testing purposes without wasting API calls
        // const meeting =
        //     (await getZoomUser(token)) ||
        //     'https://zoom.us';

        // Create Firebase record
        await db
            .collection(Livestream.collection_name)
            .doc()
            .set({
                video_link: meeting.join_url,
                user_id: current_user_id,
                title: enteredTitle,
                description: enteredDescription,
                max_limit: enteredLimit,
                num_participants: 0,
                category: enteredWorkoutCategory,
                muscle_group: enteredMuscleGroup,
                secondary_muscle_group: enteredSecondaryMuscleGroup || null,
                created_on: new Date().toLocaleDateString(),
            });

        setTitle('');
        setDescription('');
        setLimit(0);

        props.changeScreenHandler('index');

        Linking.openURL(meeting.start_url);
        // Alert.alert('Success!', `Join at ${joinLink}!`, [
        //     { text: 'Dismiss', style: 'cancel' },
        // ]);
    };

    React.useEffect(() => {
        // Handle Zoom login
        if (response && response.type === 'success') createLivestream();
    }, [response]);

    const submit = () => {
        if (isNaN(enteredLimit)) {
            Alert.alert(
                'Error',
                'Participant Limit must be a number.',
                [{ text: 'Dismiss', style: 'cancel' }]
            );
            return;
        }
        if (
            !enteredTitle ||
            !enteredWorkoutCategory ||
            !enteredMuscleGroup ||
            !enteredDescription ||
            !enteredLimit
        ) {
            Alert.alert(
                'Error',
                'You must fill out all fields except secondary muscle group.',
                [{ text: 'Dismiss', style: 'cancel' }]
            );
            return;
        }

        if(!enteredLimit || enteredLimit < 2) {
            Alert.alert('Invalid Limit!', `Max Limit Must Be 2 or More!`, [
                { text: 'Dismiss', style: 'cancel' },
            ]);
            return;
        }
        
        promptAsync({ useProxy: true });
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Button
                    title="<< Back"
                    onPress={() => props.changeScreenHandler('index')}
                />
                <Header style={styles.mainHeader}>Livestream</Header>
                <Text style={styles.inputHeader}>Title:</Text>
                <Input
                    style={styles.input}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={255}
                    keyboardType="default"
                    onChangeText={titleInputHandler}
                    value={enteredTitle}
                    testID="titleInput"
                />
                <Text style={styles.inputHeader}>
                    Short Description (255 max):
                </Text>
                <Input
                    style={styles.input}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={255}
                    keyboardType="default"
                    onChangeText={descriptionInputHandler}
                    value={enteredDescription}
                    testID="descriptionInput"
                />
                <Text style={styles.inputHeader}>
                    Participant Limit (100 max):
                </Text>
                <Input
                    style={styles.input}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={3}
                    keyboardType="number-pad"
                    onChangeText={limitInputHandler}
                    value={enteredLimit}
                    testID="limitInput"
                />
                <View>
                    <Text style={styles.inputHeader}>Workout Category:</Text>
                    <WorkoutCategoryPicker
                        selectedValue={enteredWorkoutCategory}
                        onValueChange={workoutCategoryHandler}
                        style={styles.picker}
                        testID="workoutCategoryInput"
                    />
                    <Text style={styles.inputHeader}>
                        Muscle Group (Primary):
                    </Text>
                    <MuscleGroupPicker
                        selectedValue={enteredMuscleGroup}
                        onValueChange={muscleGroupHandler}
                        style={styles.picker}
                        testID="primaryMuscleGroupInput"
                    />
                    <Text style={styles.inputHeader}>
                        Muscle Group (Secondary):
                    </Text>
                    <MuscleGroupPicker
                        selectedValue={enteredSecondaryMuscleGroup}
                        onValueChange={secondayMuscleGroupHandler}
                        style={styles.picker}
                        testID="secondaryMuscleGroupInput"
                    />
                </View>
                <TouchableOpacity onPress={submit} testID="submitButton">
                    <Text style={styles.uploadButton}>Create Livestream</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 50,
        textAlign: 'center',
    },
    inputHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    container: {
        alignItems: 'center',
    },
    uploadButton: {
        fontSize: 30,
        marginTop: 35,
        color: 'blue',
    },
    input: {
        width: 50,
        textAlign: 'center',
        marginBottom: 15,
        width: 100,
    },
    selectContentContainer: {
        marginBottom: 25,
    },
});

export default CreateLivestreamsScreen;
