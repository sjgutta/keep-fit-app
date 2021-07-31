export const LOGIN_USER = "LOGIN_USER";

export const loginUser = (user_id, user_object) => {
    return {
        type: LOGIN_USER,
        userId: user_id,
        userObject: user_object
    }
};

export const LOGOUT_USER = "LOGOUT_USER";

export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    }
};

export const CREATE_USER = "CREATE_USER";

export const createUser = (user_id, user_object) => {
    return {
        type: CREATE_USER,
        userId: user_id,
        userObject: user_object
    }
}

export const UPDATE_SAVED_EXERCISES = "UPDATE_SAVED_EXERCISES";

export const updateSavedExercises = (saved_exercises) => {
    return {
        type: UPDATE_SAVED_EXERCISES,
        exercises: saved_exercises
    }
}

export const UPDATE_LIKED_VIDEOS = "UPDATE_LIKED_VIDEOS";

export const updateLikedVideos = (liked_videos, video_data) => {
    return {
        type: UPDATE_LIKED_VIDEOS,
        videos: liked_videos,
        video_data: video_data
    }
}

export const UPDATE_WATCHED_VIDEOS = "UPDATE_WATCHED_VIDEOS";

export const updateWatchedVideos = (watched_videos, w_video_data) => {
    return {
        type: UPDATE_WATCHED_VIDEOS,
        w_videos: watched_videos,
        w_video_data: w_video_data
    }
}

export const UPDATE_UPLOADED_VIDEOS = "UPDATE_UPLOADED_VIDEOS";

export const updateUploadedVideos = (uploaded_videos) => {
    return {
        type: UPDATE_UPLOADED_VIDEOS,
        uploaded_videos: uploaded_videos
    }
}

export const UPDATE_SEARCHED_USERS = "UPDATE_SEARCHED_USERS";

export const updateSearchedUsers = (searched_users) => {
    return {
        type: UPDATE_SEARCHED_USERS,
        searchedUsers: searched_users,
    }
}

export const UPDATE_FOLLOWERS = "UPDATE_FOLLOWERS";

export const updateFollowers = (follower_users) => {
    return {
        type: UPDATE_FOLLOWERS,
        followers: follower_users,
    }
}

export const UPDATE_FOLLOWING = "UPDATE_FOLLOWING";

export const updateFollowing = (following_users, vids) => {
    console.log(vids);
    return {
        type: UPDATE_FOLLOWING,
        following: following_users,
        followingVideos: vids
    }
}
