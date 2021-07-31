import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Alert, StyleSheet, TouchableHighlight, FlatList, Linking, Button, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@app/components/container.js'
import { Header } from '@app/components/text.js';
import Follows from '../../models/follows';
import Video from '../../models/video';
import LikedVideo from '../../models/liked_video';
import { ExploreListItem } from './listitem';
import SearchExercisesScreen from '../explore/exercises';
import SearchWorkoutsScreen from '../explore/workouts';
import SearchLivestreamsScreen from '../explore/livestreams';
import SearchUsersScreen from '../explore/users';
import db from "../../firebase/firebase";
import Input from '../../components/input';
import LoadingPic from '../../assets/loadingPic.png';
import User from '../../models/user';
import {
    updateLikedVideos,
    updateFollowing
} from '../../redux/actions/auth.js';

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
        <SafeAreaView style={styles.detailsScreen}>
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

const ExploreScreen = props => {
    const [displayedScreen, setDisplayedScreen] = useState('index');
    const [displayedDetails, setDisplayedDetails] = useState(null);
    const [followedUserIds, setFollowedUserIds] = useState([]);
    const current_user_id = useSelector(state => state.auth.currentUserId);
    const followeesVideos = useSelector((state) => state.auth.followingVideos);

    console.log("followee vidoes");
    console.log(followeesVideos);
    console.log("logged");

    const dispatch = useDispatch();

    useEffect(() => {
        getFollowing();
    }, []);

    const getFollowing = async () => {
        let following = [];
        let followingIds = [];
        let vids = [];
        const snapshot = await db
            .collection(Follows.collection_name)
            .where('follower_id', '==', current_user_id)
            .get()
        snapshot.forEach(function (doc) {
            followingIds.push(doc.data().followee_id);
        })
        const user_snapshot = await db.collection(User.collection_name).get();
        user_snapshot.forEach(function (doc) {
            if (followingIds.includes(doc.id)) {
                let this_data = doc.data();
                this_data['id'] = doc.id;
                following.push(this_data);
            }
        });
        await db.collection(Video.collection_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                let video = doc.data();
                if (followingIds.includes(video["user_id"])) {
                    let this_data = doc.data();
                    this_data["id"] = doc.id;
                    vids.push(this_data);
                }
            });
        });
        console.log("vids");
        console.log(vids);
        dispatch(updateFollowing(following, vids));
    }

    const changeScreenHandler = (new_screen) => {
        setDisplayedScreen(new_screen);
    };

    const detailsBackHandler = () => {
        setDisplayedDetails(null);
    };

    let visibleContent;
    let followee_flat_list;
    if (displayedScreen == "exercises") {
        visibleContent = <SearchExercisesScreen changeScreenHandler={changeScreenHandler} testID="searchExerciseScreen" />
    } else if (displayedScreen == "workouts") {
        visibleContent = <SearchWorkoutsScreen changeScreenHandler={changeScreenHandler} testID="searchWorkoutScreen" />
    } else if (displayedScreen == "livestreams") {
        visibleContent = <SearchLivestreamsScreen changeScreenHandler={changeScreenHandler} testID="searchLivestreamScreen" />
    } else if (displayedScreen == "users") {
        visibleContent = <SearchUsersScreen changeScreenHandler={changeScreenHandler} />
    } else {
        followee_flat_list = (
            <>
                <FlatList
                    style={styles.addFlex}
                    data={followeesVideos}
                    renderItem={({ item }) => (
                        <TouchableHighlight>
                            <ExploreListItem setDisplayedDetails={setDisplayedDetails} object={item} />
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </>
        );
    }

    if (displayedDetails) { //show followee video details on click.
        console.log(displayedDetails.id);
        return (
            <SafeAreaView>
                <DetailsScreen
                    workoutID={displayedDetails.id} //used to be displayedDetails[0]
                    workout={displayedDetails}   // and filteredWorkoutDict[displayedDetails[0]]
                    detailsBackHandler={detailsBackHandler}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView>
            {!visibleContent ? (
                <Container>
                    <Text style={styles.mainHeader}>
                        Explore
                        </Text>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <Text style={styles.subHeader}>
                        Search for:
                        </Text>
                    <ScrollView horizontal={true} decelerationRate={0} snapToInterval={400} snapToAlignment={"center"} marginTop='2%'>
                        <View style={styles.editBorder}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("exercises")}
                                testID='exercisesButton'
                            >
                                <Text style={styles.editText}>
                                    Exercises
                                    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.editBorder}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("workouts")}
                                testID='workoutsButton'
                            >
                                <Text style={styles.editText}>
                                    Workouts
                                    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.editBorder3}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("livestreams")}
                                testID='livestreamsButton'
                            >
                                <Text style={styles.editText}>
                                    Livestreams
                                    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.editBorder}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("users")}
                                testID='usersButton'
                            >
                                <Text style={styles.editText}>
                                    Users
                                    </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {followee_flat_list}
                </Container>
            ) : (
                    visibleContent)}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 40,
        marginTop: "10%",
        color: "black",
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 20,
        marginTop: "5%",
        color: "black"
    },
    editBorder: {
        borderColor: 'grey',
        justifyContent: 'space-around',
        borderWidth: 1,
        flex: 1,
        height: 30,
        width: 120
    },
    editBorder3: {
        borderColor: 'grey',
        justifyContent: 'space-around',
        borderWidth: 1,
        flex: 1,
        height: 30,
        width: 150
    },
    editText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    explorePics: {
        flexDirection: 'row'
    },
    spaceBorder: {
        flex: 0.9
    },
    image1: {
        marginTop: "5%",
        width: 100,
        height: 100,
    },
    image: {
        marginTop: "1%",
        width: 100,
        height: 100,
    },
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
    detailsScreen: {
        paddingHorizontal: 25
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
    }
});

export default ExploreScreen;
