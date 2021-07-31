import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Button, TouchableHighlight, Image, View, Linking, TouchableOpacity } from 'react-native';
import Container from '@app/components/container.js'
import Text from '@app/components/text.js';
import SavedExercise from '../../models/saved_exercise';
import whichImage from '../profile/workout-image';

import Follows from '../../models/follows';

import db from '../../firebase/firebase';

const Workout = (props) => {
    const { CompletedWorkout, deleteSavedExerciseHandler } = props;
    return (
        <View style={styles.unpaddedHorizontalContainer}>
            {whichImage({ CompletedWorkout })}
            <View style={styles.addFlex}>
                <View style={styles.horizontalItemContainer}>
                    <Text style={styles.workoutHistName}>
                        {CompletedWorkout.category}
                    </Text>
                </View>
                <Text style={styles.workoutHistSub}>
                    {CompletedWorkout.completed_on}
                </Text>
                <Text style={styles.workoutHistLastSub}>
                    {CompletedWorkout.caloriesBurned} cals. burned
                </Text>
                <View style={styles.unpaddedTagsHorizontalContainer}>
                    <Text style={styles.workoutTagName}>
                        {CompletedWorkout.muscle_group}
                    </Text>
                    <Text style={styles.workoutTagName}>
                        {CompletedWorkout.secondary_muscle_group}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const UserDetailsScreen = props => {
    const user_profile = props.user;
    const current_user_id = user_profile.id;

    const [numFollowers, setNumFollowers] = useState(0);
    const [numFollowing, setNumFollowing] = useState(0);
    const [savedExercises, setSavedExercises] = useState([]);
    const [visibleScreen, setVisibleScreen] = useState("data");

    useEffect(() => {
        getNumFollowers();
        getNumFollowing();
        getSavedExercises();
    }, []);

    const getNumFollowers = async () => {
        const snapshot = await db
            .collection(Follows.collection_name)
            .where('followee_id', '==', current_user_id)
            .get()
        let myNumFollowers = 0;
        snapshot.forEach(function (doc) {
            myNumFollowers++;
        })
        setNumFollowers(myNumFollowers);
    }

    const getNumFollowing = async () => {
        const snapshot = await db
            .collection(Follows.collection_name)
            .where('follower_id', '==', current_user_id)
            .get()
        let myNumFollowing = 0;
        snapshot.forEach(function (doc) {
            myNumFollowing++;
        })
        setNumFollowing(myNumFollowing);
    }

    const getSavedExercises = async () => {
        const snapshot = await db
            .collection(SavedExercise.collection_name)
            .where('user_id', '==', current_user_id)
            .get();
        let workoutHist = [];
        snapshot.forEach((doc) => {
            let this_data = doc.data();
            this_data['id'] = doc.id;
            workoutHist.push(this_data);
        });
        setSavedExercises((workoutHist));
    };

    let paneContent;
    if (visibleScreen == "data") {
        paneContent = <View>
            <View style={styles.tagName}>
                <Text style={styles.subheading}>
                    Birthday:
                    </Text>
                <Text style={styles.entryHeading}>
                    {user_profile.birthday}
                </Text>
            </View>
            <View style={styles.tagName}>
                <Text style={styles.subheading}>
                    Height:
                    </Text>
                <Text style={styles.entryHeading}>
                    {user_profile.height} inches
                    </Text>
            </View>
            <View style={styles.tagName}>
                <Text style={styles.subheading}>
                    Weight:
                    </Text>
                <Text style={styles.entryHeading}>
                    {user_profile.weight} lbs.
                    </Text>
            </View>
            <View style={styles.tagName}>
                <Text style={styles.subheading}>
                    Gender:
                    </Text>
                <Text style={styles.entryHeading}>
                    {user_profile.gender}
                </Text>
            </View>
            <View style={styles.tagName}>
                <Text style={styles.subheading}>
                    Fitness Level:
                    </Text>
                <Text style={styles.entryHeading}>
                    {user_profile.fitness_level}
                </Text>
            </View>
        </View>;
    } else {
        paneContent = (
            <>
                <FlatList
                    style={styles.addFlex}
                    data={savedExercises}
                    renderItem={({ item }) => (
                        <TouchableHighlight>
                            <Workout CompletedWorkout={item} />
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </>
        );
    }

    console.log(savedExercises);

    return (
        <SafeAreaView style={styles.detailsContainer}>
            <View style={styles.userHeadings}>
                <Text style={styles.userName}>
                    {user_profile.username}
                </Text>
                {
                    <View style={styles.googleButtonContainer}>
                        <Button title="<< Back" onPress={() => props.detailsBackHandler()} />
                    </View>
                }
            </View>
            <View style={styles.horizontalContainer}>
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
                <View style={styles.followHeadings}>
                    <View style={styles.followBox}>
                        <Text style={styles.numFollow}>
                            {numFollowers}
                        </Text>
                        <Text style={styles.follow}>
                            Followers
                            </Text>
                    </View>
                    <View style={styles.followBox}>
                        <Text style={styles.numFollow}>
                            {numFollowing}
                        </Text>
                        <Text style={styles.follow}>
                            Following
                            </Text>
                    </View>
                </View>
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.fullName}>
                    {user_profile.full_name}
                </Text>
            </View>
            <View style={styles.editHeadings}>
                <View style={styles.editBorder}>
                    <TouchableOpacity
                        onPress={() => setVisibleScreen('data')}
                    >
                        <Text style={styles.editText}>
                            View Data
                                    </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.spaceBox}></View>
                <View style={styles.editBorder}>
                    <TouchableOpacity
                        onPress={() => setVisibleScreen('hsitory')}
                    >
                        <Text style={styles.editText}>
                            Workout History
                                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {paneContent}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 50,
        marginTop: "55%",
        textAlign: "center"
    },
    mainContainer: {
        marginTop: 20,
        paddingHorizontal: 35
    },
    googleButton: {
        height: 60,
        paddingLeft: 10,
        paddingRight: 1,
        justifyContent: "flex-end"
    },
    googleButtonContainer: {
        marginTop: 0,
        justifyContent: "flex-end"
    },
    googleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    nameContainer: {
        marginLeft: "0%"
    },
    fullName: {
        marginTop: "5%",
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: "1%"
    },
    userHeadings: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    userName: {
        fontSize: 20,
        marginTop: "0%",
        fontWeight: "bold"
    },
    bio: {
        fontSize: 15,
        marginTop: "0%"
    },
    twoHeadings: {
        flexDirection: "row",
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 15
    },
    followHeadings: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    followBox: {
        justifyContent: "center"
    },
    numFollow: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: "0%",
        textAlign: "center"
    },
    follow: {
        fontSize: 15,
        marginTop: "0%",
        textAlign: "center"
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: "10%",
        marginLeft: "0%",
        justifyContent: 'flex-start'
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 15
    },
    unpaddedHorizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    unpaddedTagsHorizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: "5%",
        paddingTop: "0%"
    },
    editHeadings: {
        flexDirection: "row",
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20
    },
    spaceBox: {
        flex: 0.01
    },
    btnPress: {
        color: 'black',
        fontSize: 18
    },
    btnBluePress: {
        color: 'blue',
        fontSize: 18,
    },
    image: {
        width: 25,
        height: 25,
        fontWeight: 'bold'
    },
    editText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: "center"
    },
    editBorder: {
        borderColor: "grey",
        borderWidth: 1,
        flex: 1
    },
    tagName: {
        flexDirection: "row",
        justifyContent: 'space-between',
        fontSize: 30,
        marginTop: "5%"
    },
    subheading: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "blue"
    },
    workoutHistName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: "5%",
        paddingLeft: "5%"
    },
    workoutHistSub: {
        fontSize: 18,
        marginTop: "0%",
        paddingLeft: "5%"
    },
    workoutHistLastSub: {
        fontSize: 18,
        marginTop: "0%",
        marginBottom: "0%",
        paddingLeft: "5%"
    },
    workoutHistVidLink: {
        fontSize: 18,
        marginTop: "0%",
        marginBottom: "0%",
        paddingLeft: "5%",
        color: 'blue',
        textDecorationLine: "underline"
    },
    workoutPic: {
        width: 110,
        height: 110,
        marginTop: "5%"
    },
    addFlex: {
        flexGrow: 1
    },
    savedContentContainer: {
        height: "55%"
    },
    detailsContainer: {
        marginTop: 40
    },
    workoutTagName: {
        fontSize: 15,
        marginTop: '8%',
        color: 'skyblue',
        fontWeight: 'bold',
        paddingRight: '8%',
    },
    bigHeading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: "underline",
        marginTop: 30
    }
});

export default UserDetailsScreen;
