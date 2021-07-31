import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, TouchableHighlight, Button, FlatList, Alert, TouchableOpacity, Text, Linking, View } from 'react-native';
import { Header } from '@app/components/text.js';
import Input from '../../components/input';
import db from "../../firebase/firebase";
import ListItem from './listitem';
import { updateLikedVideos, updateWatchedVideos } from "../../redux/actions/auth.js";
import { useSelector, useDispatch } from 'react-redux';
import { MuscleGroupPicker, WorkoutCategoryPicker } from '../../components/pickers';
import LikedVideo from "../../models/liked_video";
import Video from "../../models/video";
import WatchedVideo from '../../models/watched_video';


const Tag = props => {
    return (
        <View style={{ ...styles.tag, ...props.style }}>
            <Text style={styles.tagText}>{props.value}</Text>
        </View>
    );
};

const Comment = props => {
    return (
        <View style={styles.singleCommentContainer}>
            <Text>{props.commentText}</Text>
        </View>
    )
}

export const DetailsScreen = props => {
    const likedVideoData = useSelector(state => state.auth.likedVideos);
    const current_user_id = useSelector(state => state.auth.currentUserId);
    const watchedVideoData = useSelector((state) => state.auth.watchedVideos);

    const [enteredComment, setEnteredComment] = useState('');

    const commentInputHandler = inputText => {
        setEnteredComment(inputText);
    };

    const submitCommentHandler = () => {
        if (!enteredComment) {
            Alert.alert('Error', 'Comment is Empty.', [
                { text: 'Dismiss', style: 'cancel' }
            ]);
            return;
        }
        let new_comments = props.workout.comments;
        new_comments.unshift(enteredComment);
        db.collection(Video.collection_name).doc(props.workoutID).update({
            comments: new_comments
        }).then(function() {
            setEnteredComment("");
            props.reSearch();
        });
    }

    const dispatch = useDispatch();

    const getLikedVideos = async () => {
        const snapshot = await db.collection(LikedVideo.collection_name).where("user_id", "==", current_user_id).get()
        let likedVideoDictionary = {}
        let likedVideoIds = [];
        let likedVideoData = [];
        snapshot.forEach(doc => {
            likedVideoDictionary[doc.data().video_id] = doc.data();
            likedVideoIds.push(doc.data().video_id);
        });
        const video_snapshot = await db.collection(Video.collection_name).get()
        video_snapshot.forEach(function (doc) {
            if (likedVideoIds.includes(doc.id)) {
                let this_data = doc.data();
                this_data["id"] = doc.id;
                likedVideoData.push(this_data);
            }
        })
        dispatch(updateLikedVideos(likedVideoDictionary, likedVideoData));
    }

    const getWatchedVideos = async () => {
        const snapshot = await db.collection(WatchedVideo.collection_name).where("user_id", "==", current_user_id).get()
        let watchedVideoDictionary = {}
        let watchedVideoIds = [];
        let watchedVideoData = [];
        snapshot.forEach(doc => {
            watchedVideoDictionary[doc.data().video_id] = doc.data();
            watchedVideoIds.push(doc.data().video_id);
        });
        const video_snapshot = await db.collection(Video.collection_name).get()
        video_snapshot.forEach(function (doc) {
            if (watchedVideoIds.includes(doc.id)) {
                let this_data = doc.data();
                this_data["id"] = doc.id;
                watchedVideoData.push(this_data);
            }
        })
        dispatch(updateWatchedVideos(watchedVideoDictionary, watchedVideoData));
    }


    const likeVideo = () => {
        db.collection(LikedVideo.collection_name).doc().set({
            user_id: current_user_id,
            video_id: props.workoutID,
            liked_on: new Date().toLocaleDateString()
        }).then(function () {
            getLikedVideos();
        });
    }

    const unLikeVideo = () => {
        db.collection(LikedVideo.collection_name).where("video_id", "==", props.workoutID)
            .where("user_id", "==", current_user_id).get().then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    doc.ref.delete().then(function () {
                        getLikedVideos();
                    });
                })
            });
    }

    const watchVideo = () => {
        db.collection(WatchedVideo.collection_name).doc().set({
            user_id: current_user_id,
            video_id: props.workoutID,
            watched_on: new Date().toLocaleDateString()
        }).then(function () {
            getWatchedVideos();
        });
    }

    let commentsContent;
    if (props.workout.comments_enabled) {
        commentsContent = <View style={styles.commentsContainer}>
            <Input style={styles.input}
                blurOnSubmit
                autoCapitalize='none'
                autoCorrect={false}
                maxLength={255}
                keyboardType="default"
                onChangeText={commentInputHandler}
                value={enteredComment}
                testID="commentInput"
            />
            <Button title="Submit Comment" onPress={submitCommentHandler} />
            <Text style={styles.commentsHeader}>Comments</Text>
            <FlatList
                style={styles.commentsFlatList}
                data={props.workout.comments}
                renderItem={({ item }) => (
                    <TouchableHighlight>
                        <Comment commentText={item} />
                    </TouchableHighlight>
                )}
                keyExtractor={(item) => item}
            />
        </View>;
    }

    let likeBtn;
    if (likedVideoData && props.workoutID in likedVideoData) {
        likeBtn = <TouchableOpacity testID="likeBtn" onPress={() => unLikeVideo()}>
            <Tag style={styles.likedBtn} value="Liked" />
        </TouchableOpacity>
    } else {
        likeBtn = <TouchableOpacity testID="likeBtn" onPress={() => likeVideo()}>
            <Tag style={styles.likeBtn} value="Like" />
        </TouchableOpacity>
    }

    return (
        <SafeAreaView>
            <Button title="<< Back" onPress={() => props.detailsBackHandler()} testID='backButton' />
            <Header style={styles.workoutName}>
                {props.workout.title}
            </Header>
            <Text style={styles.videoLink}
                onPress={() => {
                    Linking.openURL(props.workout.video_link)
                    watchVideo()
                }}>
                Watch Workout on Youtube
            </Text>
            <Text>
                {props.workout.description}
            </Text>
            <View style={styles.tagsContainer}>
                <Tag value={props.workout.category}></Tag>
                <Tag value={props.workout.muscle_group}></Tag>
                {props.workout.secondary_muscle_group ? <Tag value={props.workout.secondary_muscle_group}></Tag> : null}
            </View>
            <View style={styles.likeBtnContainer}>
                {likeBtn}
            </View>
            {commentsContent}
        </SafeAreaView>
    );
};

const SearchWorkoutsScreen = props => {
    const [workoutDictionary, setWorkoutDictionary] = useState({});
    const [filteredWorkoutDictionary, setFilteredWorkoutDictionary] = useState({});
    const [muscleGroupFilter1, setMuscleGroupFilter1] = useState("");
    const [muscleGroupFilter2, setMuscleGroupFilter2] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [displayedDetails, setDisplayedDetails] = useState(null);

    const current_user_id = useSelector(state => state.auth.currentUserId);
    const likedVideoData = useSelector(state => state.auth.likedVideos);
    const isLoggedIn = useSelector(state => state.auth.loggedIn);

    const dispatch = useDispatch();

    useEffect(() => {
        var fetchedWorkoutDictionary = {};
        db.collection(Video.collection_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                fetchedWorkoutDictionary[doc.id] = doc.data();
            });
            sortVideosByLikes(fetchedWorkoutDictionary);
        });
    }, []);

    console.log(filteredWorkoutDictionary);

    const reSearchVideos = () => {
        var fetchedWorkoutDictionary = {};
        db.collection(Video.collection_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                fetchedWorkoutDictionary[doc.id] = doc.data();
            });
            sortVideosByLikes(fetchedWorkoutDictionary);
        });
    }

    const sortVideosByLikes = async (fetchedWorkoutDictionary) => {
        var likeCountDictionary = {};
        var sortedMap = {};
        db.collection(LikedVideo.collection_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                if (likeCountDictionary[doc.data().video_id]) {
                    likeCountDictionary[doc.data().video_id]++;
                } else {
                    likeCountDictionary[doc.data().video_id] = 1;
                }
            });

            var sortedArray = Object.keys(likeCountDictionary).sort(function (a, b) {
                return likeCountDictionary[b] - likeCountDictionary[a];
            });

            sortedArray.forEach(element => {
                sortedMap[element] = fetchedWorkoutDictionary[element];
            });
            for (var key in fetchedWorkoutDictionary) {
                if (!(key in sortedMap)) {
                    sortedMap[key] = fetchedWorkoutDictionary[key];
                }
            }

            setWorkoutDictionary(sortedMap);
            setFilteredWorkoutDictionary(sortedMap);
        });
    }

    const getLikedVideos = async () => {
        const snapshot = await db.collection(LikedVideo.collection_name).where("user_id", "==", current_user_id).get()
        let likedVideoDictionary = {}
        let likedVideoIds = [];
        let likedVideoData = [];
        snapshot.forEach(doc => {
            likedVideoDictionary[doc.data().video_id] = doc.data();
            likedVideoIds.push(doc.data().video_id);
        });
        const video_snapshot = await db.collection(Video.collection_name).get()
        video_snapshot.forEach(function (doc) {
            if (likedVideoIds.includes(doc.id)) {
                let this_data = doc.data();
                this_data["id"] = doc.id;
                likedVideoData.push(this_data);
            }
        })
        dispatch(updateLikedVideos(likedVideoDictionary, likedVideoData));
    }

    if (!likedVideoData && isLoggedIn) {
        getLikedVideos();
    }

    //Apply filters
    useEffect(() => {
        var newFilteredWorkoutDictionary = {};

        for (var workout in workoutDictionary) {
            var workoutDetails = workoutDictionary[workout];
            var filterFlag1 = false, filterFlag2 = false, filterFlag3 = false;

            if (muscleGroupFilter1 && muscleGroupFilter1 !== null) {
                if (workoutDetails.muscle_group === muscleGroupFilter1 || workoutDetails.secondary_muscle_group === muscleGroupFilter1) {
                    filterFlag1 = true;
                }
            } else {
                filterFlag1 = true;
            }

            if (muscleGroupFilter2 && muscleGroupFilter2 !== null) {
                if (workoutDetails.muscle_group === muscleGroupFilter2 || workoutDetails.secondary_muscle_group === muscleGroupFilter2) {
                    filterFlag2 = true;
                }
            } else {
                filterFlag2 = true;
            }

            if (categoryFilter && categoryFilter !== null) {
                if (workoutDetails.category === categoryFilter) { filterFlag3 = true; }
                else { filterFlag3 = false; }
            } else {
                filterFlag3 = true;
            }

            if (filterFlag1 && filterFlag2 && filterFlag3) {
                newFilteredWorkoutDictionary[workout] = workoutDetails;
            }
        }
        setFilteredWorkoutDictionary(newFilteredWorkoutDictionary);
    }, [muscleGroupFilter1, muscleGroupFilter2, categoryFilter]);

    const detailsBackHandler = () => {
        setDisplayedDetails(null);
    };

    return (
        <SafeAreaView style={styles.searchContainer}>
            {displayedDetails ? (
                <DetailsScreen
                    workoutID={displayedDetails[0]}
                    workout={filteredWorkoutDictionary[displayedDetails[0]]}
                    detailsBackHandler={detailsBackHandler}
                    reSearch={reSearchVideos}
                />
            ) : (
                    <View style={styles.listView}>
                        <Button title="<< Back" onPress={() => props.changeScreenHandler("index")} testID='backButton' />
                        <View style={styles.filterContainer}>
                            <MuscleGroupPicker onValueChange={value => {
                                setMuscleGroupFilter1(value);
                            }}></MuscleGroupPicker>
                            <MuscleGroupPicker onValueChange={value => {
                                setMuscleGroupFilter2(value);
                            }}></MuscleGroupPicker>
                            <WorkoutCategoryPicker onValueChange={value => {
                                setCategoryFilter(value);
                            }}></WorkoutCategoryPicker>
                        </View>
                        <View style={styles.scrollView}>
                            <ScrollView style={{ flexGrow: 1 }}>
                                {Object.entries(filteredWorkoutDictionary).map(workout =>
                                    <ListItem setDisplayedDetails={setDisplayedDetails} object={workout}>

                                    </ListItem>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 25,
        flexGrow: 1,
    },
    mainHeader: {
        fontSize: 50,
        marginTop: "55%",
        textAlign: "center"
    },
    workoutText: {
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
        height: "72.5%"
    },

    // STYLES FOR DETAILS SCREEN START
    workoutName: {
        textAlign: 'center',
        paddingBottom: 20,
    },
    videoLink: {
        textAlign: 'center',
        color: 'blue',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 20
    },

    tagsContainer: {
        flexDirection: 'row',
        paddingTop: 20,
    },
    likeBtn: {
        backgroundColor: "lightblue",
        marginTop: 50
    },
    likedBtn: {
        backgroundColor: "lightgreen",
        marginTop: 100
    },
    likeBtnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    commentsFlatList: {
        marginTop: 20,
        height: "37%"
    },
    commentsHeader: {
        marginTop: 5,
        textAlign: "center",
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 25
    },
    singleCommentContainer: {
        paddingVertical: 5,
        borderBottomColor: "black",
        borderBottomWidth: 1
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


export default SearchWorkoutsScreen;
