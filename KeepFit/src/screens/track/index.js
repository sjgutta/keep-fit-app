import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity,
    View, Text, Alert
} from 'react-native';
import Container from '@app/components/container.js'
import { Stopwatch } from 'react-native-stopwatch-timer';
import { Header } from '@app/components/text.js';
import { MuscleGroupPicker, WorkoutCategoryPicker } from '../../components/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { updateSavedExercises } from "../../redux/actions/auth.js";
import db from '../../firebase/firebase';
import SavedExercise from '../../models/saved_exercise';

export const caloriesCalculator = (elapsedTime, category, weight) => {
    var MET;
    if (!category) {
        return "N/A";
    } else if (category == "CARDIO") {
        MET = 7;
    } else if (category == "BODYWEIGHT") {
        MET = 6;
    } else if (category == "WEIGHTLIFTING") {
        MET = 3;
    } else if (category == "HIIT") {
        MET = 9;
    } else if (category == "HYBRID") {
        MET = 5;
    }
    var minutes = elapsedTime / 60;
    var calories = (minutes * (MET * 3.5 * weight * 0.453592)) / 200;
    return Math.floor(calories);
};

const TrackScreen = props => {
    const current_user_id = useSelector(state => state.auth.currentUserId);
    const user_profile = useSelector(state => state.auth.currentUser);

    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [enteredWorkoutCategory, setWorkoutCategory] = useState(null);
    const [enteredMuscleGroup, setMuscleGroup] = useState(null);
    const [enteredSecondaryMuscleGroup, setSecondaryMuscleGroup] = useState(null);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [lastStartTime, setLastStartTime] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState(0);

    const dispatch = useDispatch();

    const workoutCategoryHandler = inputText => {
        setWorkoutCategory(inputText);
        caloriesHandler(inputText);
    };

    const muscleGroupHandler = inputText => {
        setMuscleGroup(inputText);
    };

    const secondayMuscleGroupHandler = inputText => {
        setSecondaryMuscleGroup(inputText);
    };

    const caloriesHandler = (category) => {
        const calories = caloriesCalculator(elapsedTime, category, user_profile.weight);
        setCaloriesBurned(calories);
    };

    const lastStartHandler = () => {
        if (!isStopwatchStart) {
            setLastStartTime(new Date());
        } else if (isStopwatchStart) {
            var current_time = new Date();
            var new_seconds = (current_time.getTime() - lastStartTime.getTime()) / 1000;
            setElapsedTime(elapsedTime + new_seconds);
        }
    };

    const updateReduxSavedExercises = async() => {
        console.log("getting saved");
        const snapshot = await db.collection(SavedExercise.collection_name).where("user_id", "==", current_user_id).get()
        let workoutHist = []
        snapshot.forEach(doc => {
            let this_data = doc.data();
            this_data["id"] = doc.id;
            workoutHist.push(this_data);
        })
        dispatch(updateSavedExercises(workoutHist));
    }

    const saveHandler = () => {
        if (!enteredMuscleGroup || !enteredWorkoutCategory) {
            Alert.alert('Error', 'You must fill out all fields except secondary muscle group.', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        if (Math.round(elapsedTime) == 0) {
            Alert.alert('Error', 'No time has elapsed.', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        db.collection(SavedExercise.collection_name).doc().set({
            user_id: current_user_id,
            total_time: Math.round(elapsedTime),
            caloriesBurned: caloriesBurned,
            category: enteredWorkoutCategory,
            muscle_group: enteredMuscleGroup,
            secondary_muscle_group: enteredSecondaryMuscleGroup || null,
            completed_on: new Date().toLocaleDateString()
        }).then(function () {
            setIsStopwatchStart(false);
            setResetStopwatch(true);
            setElapsedTime(0);
            setCaloriesBurned(0);
            updateReduxSavedExercises();
            Alert.alert('Success', 'Workout Successfully Saved!', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
        });
    };

    return (
        <SafeAreaView>
            <Container>
                <Text style={styles.mainHeader}>
                    Track
                </Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
            
                <Text style={styles.subHeader2}>
                    1. Start Stopwatch
                </Text>
                <View style={styles.container}>
                    <Stopwatch
                        laps
                        msecs
                        start={isStopwatchStart}
                        //To start
                        reset={resetStopwatch}
                        //To reset
                        options={options}
                        //options for the styling
                        getTime={(time) => {
                            //console.log(time);
                        }}
                    />
                    <View style={styles.rowContainer}>
                        <View style={styles.rowBorder}>
                            <TouchableHighlight
                                onPress={() => {
                                    setIsStopwatchStart(!isStopwatchStart);
                                    lastStartHandler();
                                    if (isStopwatchStart) {
                                        caloriesHandler(enteredWorkoutCategory);
                                    }
                                    setResetStopwatch(false);
                                }}
                                testID={!isStopwatchStart ? 'startButton' : 'stopButton'}>
                                <Text style={styles.buttonText}>
                                    {!isStopwatchStart ? 'START' : 'STOP'}
                                </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.rowBorder}>
                            <TouchableHighlight
                                onPress={() => {
                                    setIsStopwatchStart(false);
                                    setResetStopwatch(true);
                                    setElapsedTime(0);
                                }}>
                                <Text style={styles.buttonText}>RESET</Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                    <Text style={styles.subHeader3}>
                        2. Save Workout
                    </Text>
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
                        <Text style={styles.caloriesHeader}>Calories Burned: {caloriesBurned}</Text>
                    </View>
                    <TouchableOpacity onPress={() => saveHandler()} testID="saveButton">
                        <Text style={styles.saveButton}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 40,
        marginTop: "0%",
        color: "black",
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 18,
        marginTop: '0%',
        textAlign: 'center',
    },
    container: {
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    rowBorder: {
        borderColor: 'grey',
        borderWidth: 1,
        flex: 1,
    },
    subHeader2: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '0%'
    },
    subHeader3: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '5%',
        marginBottom: '0%'
    },
    inputHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 30,
        marginTop: '0%',
        textAlign: 'center'
    },
    caloriesHeader: {
        marginTop: '10%',
        textAlign: 'center',
        fontSize: 30,
        color: 'blue'
    },
    saveButton: {
        fontSize: 30,
        marginTop: '0%',
        color: 'blue'
    }
});

const options = {
    container: {
        backgroundColor: '#0000FF',
        padding: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
        marginTop: '10%',
        marginBottom: '10%'
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        marginLeft: 7,
    },
};


export default TrackScreen;
