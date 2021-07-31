import React, { useEffect, useState, useRef } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Button,
    Text,
    TextInput,
    Linking,
    View,
    TouchableHighlight,
} from 'react-native';
import Container from '@app/components/container.js';
import { Header, Subtext, Subheader } from '@app/components/text.js';
import db from '../../firebase/firebase';
import Exercise from '../../models/exercise';
import ListItem from './listitem';
import {
    MuscleGroupPicker,
    WorkoutCategoryPicker,
} from '../../components/pickers';

import * as Speech from 'expo-speech';

const Tag = (props) => {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{props.value}</Text>
        </View>
    );
};

/*stolen from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/*/
const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const DetailsScreen = (props) => {
    const [count, setCount] = useState(0);
    const [repetitions, setRepetitions] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [displayCounting, setDisplayCounting] = useState(false);

    const delay = 1000;

    const CountScreen = () => {
        useInterval(
            () => {
                if (count < repetitions) {
                    setCount(count + 1);
                    // this doesnt seem to work... oh well
                    // Speech.speak(String(count + 1));
                } else {
                    setIsCounting(false);
                }
            },
            isCounting ? delay : null
        );

        let text = <></>;

        if (!isCounting)
            text = (
                <Text style={{ fontSize: 50 }}>
                    You've finished {count} repetitions!
                </Text>
            );
        else if (!count) text = <Text style={{ fontSize: 50 }}>GO</Text>;
        else text = <Text style={{ fontSize: 50 }}>{count}</Text>;

        return (
            <SafeAreaView>
                <Button
                    title="<< Back"
                    onPress={() => {
                        setCount(0);
                        setIsCounting(false);
                        setDisplayCounting(false);
                    }}
                    testID="backButton2"
                />
                {text}
            </SafeAreaView>
        );
    };

    if (displayCounting) return <CountScreen />;

    return (
        <SafeAreaView>
            <Button
                title="<< Back"
                onPress={() => props.detailsBackHandler()}
                testID="backButton"
            />
            <Header style={styles.exerciseName}>{props.exercise.name}</Header>
            <Text
                style={styles.videoLink}
                onPress={() => Linking.openURL(props.exercise.video_link)}
            >
                Watch Exercise on Youtube
            </Text>
            <Text>{props.exercise.description}</Text>

            {props.exercise.name === 'Sit Ups' && (
                <Button
                    title="Start Workout"
                    onPress={() => {
                        Alert.prompt(
                            'Number of repetions',
                            'How many repetitions do you wish to complete?',
                            (text) => {
                                setRepetitions(Number(text));
                                setIsCounting(true);
                                setDisplayCounting(true);
                            }
                        );
                    }}
                />
            )}

            <View style={styles.tagsContainer}>
                <Tag value={props.exercise.category}></Tag>
                {Object.entries(props.exercise.muscle_group).map((group) => (
                    <Tag value={group[1]}></Tag>
                ))}
            </View>
        </SafeAreaView>
    );
};

const SearchExercisesScreen = (props) => {
    const [exerciseDictionary, setExerciseDictionary] = useState({});
    const [
        filteredExerciseDictionary,
        setFilteredExerciseDictionary,
    ] = useState({});
    const [muscleGroupFilter1, setMuscleGroupFilter1] = useState('');
    const [muscleGroupFilter2, setMuscleGroupFilter2] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [displayedDetails, setDisplayedDetails] = useState(null);

    useEffect(() => {
        var fetchedExerciseDictionary = {};
        db.collection(Exercise.collection_name)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    fetchedExerciseDictionary[doc.id] = doc.data();
                });
                setFilteredExerciseDictionary(fetchedExerciseDictionary);
                setExerciseDictionary(fetchedExerciseDictionary);
            });
    }, []);

    //Apply filters
    useEffect(() => {
        var newFilteredExerciseDictionary = {};
        for (var exercise in exerciseDictionary) {
            var exerciseDetails = exerciseDictionary[exercise];
            var filterFlag1 = false,
                filterFlag2 = false,
                filterFlag3 = false;

            if (muscleGroupFilter1 && muscleGroupFilter1 !== null) {
                if (exerciseDetails.muscle_group.includes(muscleGroupFilter1)) {
                    filterFlag1 = true;
                }
            } else {
                filterFlag1 = true;
            }

            if (muscleGroupFilter2 && muscleGroupFilter2 !== null) {
                if (exerciseDetails.muscle_group.includes(muscleGroupFilter2)) {
                    filterFlag2 = true;
                }
            } else {
                filterFlag2 = true;
            }

            if (categoryFilter && categoryFilter !== null) {
                if (exerciseDetails.category === categoryFilter) {
                    filterFlag3 = true;
                } else {
                    filterFlag3 = false;
                }
            } else {
                filterFlag3 = true;
            }

            if (filterFlag1 && filterFlag2 && filterFlag3) {
                newFilteredExerciseDictionary[exercise] = exerciseDetails;
            }
        }
        setFilteredExerciseDictionary(newFilteredExerciseDictionary);
    }, [muscleGroupFilter1, muscleGroupFilter2, categoryFilter]);

    const detailsBackHandler = () => {
        setDisplayedDetails(null);
    };

    return (
        <SafeAreaView style={styles.searchContainer}>
            {displayedDetails ? (
                <DetailsScreen
                    exerciseID={displayedDetails[0]}
                    exercise={filteredExerciseDictionary[displayedDetails[0]]}
                    detailsBackHandler={detailsBackHandler}
                />
            ) : (
                <View style={styles.listView}>
                    <Button
                        title="<< Back"
                        onPress={() => props.changeScreenHandler('index')}
                        testID="backButton"
                    />
                    <View style={styles.filterContainer}>
                        <MuscleGroupPicker
                            onValueChange={(value) => {
                                setMuscleGroupFilter1(value);
                            }}
                        ></MuscleGroupPicker>
                        <MuscleGroupPicker
                            onValueChange={(value) => {
                                setMuscleGroupFilter2(value);
                            }}
                        ></MuscleGroupPicker>
                        <WorkoutCategoryPicker
                            onValueChange={(value) => {
                                setCategoryFilter(value);
                            }}
                        ></WorkoutCategoryPicker>
                    </View>
                    <View style={styles.scrollView}>
                        <ScrollView style={{ flexGrow: 1 }}>
                            {Object.entries(filteredExerciseDictionary).map(
                                (exercise) => (
                                    <ListItem
                                        setDisplayedDetails={
                                            setDisplayedDetails
                                        }
                                        object={exercise}
                                    ></ListItem>
                                )
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 25,
        flexGrow: 1,
    },
    mainHeader: {
        fontSize: 50,
        marginTop: '55%',
        textAlign: 'center',
    },
    exerciseText: {
        fontSize: 30,
        marginTop: 10,
    },
    listView: {
        marginBottom: 200,
    },
    filterContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        paddingBottom: 10,
    },
    scrollView: {
        height: '72.5%',
    },

    // STYLES FOR DETAILS SCREEN START
    exerciseName: {
        textAlign: 'center',
        paddingBottom: 20,
    },
    videoLink: {
        textAlign: 'center',
        color: 'blue',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 20,
    },

    tagsContainer: {
        flexDirection: 'row',
        paddingTop: 20,
    },

    //STYLES FOR TAG START
    tag: {
        width: 110,
        height: 30,
        backgroundColor: 'grey',
        borderRadius: 10,
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 1.0,
        marginRight: 10,
    },

    tagText: {
        textAlign: 'center',
    },
});

export default SearchExercisesScreen;
