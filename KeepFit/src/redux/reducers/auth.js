import { LOGIN_USER, LOGOUT_USER, CREATE_USER, UPDATE_SAVED_EXERCISES, 
    UPDATE_LIKED_VIDEOS, UPDATE_WATCHED_VIDEOS, UPDATE_UPLOADED_VIDEOS, UPDATE_SEARCHED_USERS, UPDATE_FOLLOWERS, UPDATE_FOLLOWING } from '../actions/auth.js';

const initialState = {
    loggedIn: false,
    savedExercises: null,
    creatingUser: false,
    currentUserId: null,
    currentUser: null,
    likedVideos: null,
    videoDatas: null,
    watchedVideos: null,
    w_videoDatas: null,
    uploadedVideos: null,
    searchedUsers: [],
    followers: [],
    following: [],
    followingVideos: []
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                loggedIn: true,
                creatingUser: false,
                currentUserId: action.userId,
                currentUser: action.userObject
            }
        case CREATE_USER:
            return {
                ...state,
                loggedIn: false,
                creatingUser: true,
                currentUserId: action.userId,
                currentUser: action.userObject
            }
        case LOGOUT_USER:
            return {
                ...state,
                loggedIn: false,
                creatingUser: false,
                currentUserId: null,
                currentUser: null,
                savedExercises: null,
                likedVideos: null,
                videoDatas: null,
                searchedUsers: [],
                followers: [],
                following: [],
                followingVideos: []
            }
        case UPDATE_SAVED_EXERCISES:
            return {
                ...state,
                savedExercises: action.exercises
            }
        case UPDATE_LIKED_VIDEOS:
            return {
                ...state,
                likedVideos: action.videos,
                videoDatas: action.video_data
            }
        
        case UPDATE_WATCHED_VIDEOS:
            return {
                ...state,
                watchedVideos: action.w_videos,
                w_videoDatas: action.w_video_data
            }
        case UPDATE_UPLOADED_VIDEOS:
            return {
                ...state,
                uploadedVideos: action.uploaded_videos
            }
        case UPDATE_SEARCHED_USERS:
            return {
                ...state,
                searchedUsers: action.searchedUsers,
            }
        case UPDATE_FOLLOWERS:
            return {
                ...state,
                followers: action.followers
            }
        case UPDATE_FOLLOWING:
            console.log(action.followingVideos);
            return {
                ...state,
                following: action.following,
                followingVideos: action.followingVideos
            }
        default:
            return state;
        
    }
}

export default authReducer;
