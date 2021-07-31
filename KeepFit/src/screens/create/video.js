import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Switch, TouchableOpacity, Alert, View, Button } from 'react-native';
import Input from '../../components/input';
import { Header } from '@app/components/text.js';
import { MuscleGroupPicker, WorkoutCategoryPicker } from '../../components/pickers';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateUploadedVideos
} from '../../redux/actions/auth.js';
import * as ImagePicker from 'expo-image-picker';
import Video from '../../models/video'
import db, { firebase } from "../../firebase/firebase";

const CreateVideosScreen = props => {
    const current_user_id = useSelector(state => state.auth.currentUserId);
    const user_profile = useSelector(state => state.auth.currentUser);

    const [enteredTitle, setTitle] = useState('');
    const [enteredDescription, setDescription] = useState('');
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [enteredWorkoutCategory, setWorkoutCategory] = useState(null);
    const [enteredMuscleGroup, setMuscleGroup] = useState(null);
    const [enteredSecondaryMuscleGroup, setSecondaryMuscleGroup] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const dispatch = useDispatch();

    const titleInputHandler = inputText => {
        setTitle(inputText);
    };

    const descriptionInputHandler = inputText => {
        setDescription(inputText);
    };

    const toggleComments = () => setCommentsEnabled(previousState => !previousState);

    const workoutCategoryHandler = inputText => {
        setWorkoutCategory(inputText);
    };

    const muscleGroupHandler = inputText => {
        setMuscleGroup(inputText);
    };

    const secondayMuscleGroupHandler = inputText => {
        setSecondaryMuscleGroup(inputText);
    };

    const getUserVideos = async () => {
        const snapshot = await db
            .collection(Video.collection_name)
            .where('user_id', '==', current_user_id)
            .get();
        const data = snapshot.docs.map((doc) => {
            let data = doc.data();
            data['id'] = doc.id;
            return data;
        });
        dispatch(updateUploadedVideos(data));
    };

    const uploadHandler = async () => {
        if (!enteredTitle || !enteredWorkoutCategory || !enteredMuscleGroup || !enteredDescription) {
            Alert.alert('Error', 'You must fill out all fields except secondary muscle group.', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        if (!selectedVideo) {
            Alert.alert('Error', 'You must select a video', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        const response = await fetch(selectedVideo);
        const blob = await response.blob();

        // limit if 10 MB size
        if (blob.size > 10000000) {
            Alert.alert('Error', 'File must be smaller than 10MB', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }

        var ref = firebase.storage().ref().child(enteredTitle);
        ref.put(blob).then((snapshot) => {
            console.log("uploaded!");
            ref.getDownloadURL().then((url) => {
                db.collection(Video.collection_name).doc().set({
                    video_link: url,
                    user_id: current_user_id,
                    title: enteredTitle,
                    description: enteredDescription,
                    comments_enabled: commentsEnabled,
                    comments: [],
                    category: enteredWorkoutCategory,
                    muscle_group: enteredMuscleGroup,
                    secondary_muscle_group: enteredSecondaryMuscleGroup || null,
                    created_on: new Date().toLocaleDateString()
                }).then(function () {
                    setSelectedVideo(null);
                    setTitle('');
                    setDescription('');
                    props.changeScreenHandler("index")
                    getUserVideos();
                    Alert.alert('Success!', 'Your video was uploaded!', [
                        { text: 'Dismiss', style: 'cancel' }
                    ]);
                });
            });
        });
    }

    const selectVideoHandler = () => {
        console.log("selecting video")

        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos
        }).then((result) => {
            if (!result.cancelled) {
                // User picked a video
                const { height, width, type, uri } = result;
                console.log('video picked', uri);
                setSelectedVideo(uri);
            }

        }).catch((error) => {
            throw error;
        });
    };

    let selectContent = <Button title="Select a Video" testID="selectButton" onPress={() => selectVideoHandler()} />
    if (selectedVideo) {
        selectContent = <Button title="Clear Selected Video" onPress={() => setSelectedVideo(null)} />;
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Button title="<< Back" onPress={() => props.changeScreenHandler("index")} />
                <Header style={styles.mainHeader}>
                    Upload a Video
                </Header>
                <View style={styles.selectContentContainer}>
                    {selectContent}
                </View>
                <Text style={styles.inputHeader}>Title:</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    maxLength={255}
                    keyboardType="default"
                    onChangeText={titleInputHandler}
                    value={enteredTitle}
                    testID="titleInput"
                />
                <Text style={styles.inputHeader}>Short Description (255 max):</Text>
                <Input style={styles.input}
                    blurOnSubmit
                    autoCapitalize='none'
                    autoCorrect={false}
                    maxLength={255}
                    keyboardType="default"
                    onChangeText={descriptionInputHandler}
                    value={enteredDescription}
                    testID="descriptionInput"
                />
                <Text style={styles.inputHeader}>Enable Comments?</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={commentsEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleComments}
                    value={commentsEnabled}
                />
                <View>
                    <Text style={styles.inputHeader}>Workout Category:</Text>
                    <WorkoutCategoryPicker
                        selectedValue={enteredWorkoutCategory}
                        onValueChange={workoutCategoryHandler}
                        style={styles.picker}
                    />
                    <Text style={styles.inputHeader}>Muscle Group (Primary):</Text>
                    <MuscleGroupPicker
                        selectedValue={enteredMuscleGroup}
                        onValueChange={muscleGroupHandler}
                        style={styles.picker}
                    />
                    <Text style={styles.inputHeader}>Muscle Group (Secondary):</Text>
                    <MuscleGroupPicker
                        selectedValue={enteredSecondaryMuscleGroup}
                        onValueChange={secondayMuscleGroupHandler}
                        style={styles.picker}
                    />
                </View>
                <TouchableOpacity onPress={() => uploadHandler()} testID="submitButton">
                    <Text style={styles.uploadButton}>Upload</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 50,
        textAlign: "center"
    },
    inputHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center'
    },
    container: {
        alignItems: 'center'
    },
    uploadButton: {
        fontSize: 30,
        marginTop: 35,
        color: 'blue'
    },
    input: {
        width: 50,
        textAlign: 'center',
        marginBottom: 15,
        width: 100
    },
    selectContentContainer: {
        marginBottom: 25
    }
});

export default CreateVideosScreen;
