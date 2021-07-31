import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

import {
    WorkoutCategoryPicker,
    MuscleGroupPicker,
} from '../src/components/pickers';

import ProfileScreen from '../src/screens/profile/index';
import RootStackNavigator from "../src/navigation/RootStackNavigator";
import { act } from 'react-dom/test-utils';
import DetailsScreen from "../src/screens/explore/workouts";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
const { mockWhere, mockSet } = require('firestore-jest-mock/mocks/firestore');
import configureStore from 'redux-mock-store';
import LikedVideo from '../src/models/liked_video';

describe('Ensure Liked Videos are Displayed Based on Redux State', () => {
    const likedVideo = {
        id: "1",
        title: "liked vid 1",
        description: "sample description"
    }
    const initialState = {
        auth: {
            loggedIn: true,
            savedExercises: null,
            creatingUser: false,
            currentUserId: "1",
            currentUser: { "full_name": 'Sajan Gutta' },
            likedVideos: null,
            videoDatas: null
        }
    }
    const mockStore = configureStore()
    let store

    it('If video is unliked, pressing like button calls set query on firebase', async() => {
        act(async () => {
            const thisInitialState = {
                auth: {
                    loggedIn: false,
                    savedExercises: null,
                    creatingUser: true,
                    currentUserId: "1",
                    currentUser: { "full_name": 'Sajan Gutta' },
                    likedVideos: null,
                    videoDatas: null
                }
            }

            const likedVideoData = [
                {
                    id: "1",
                    title: "test1"
                },
                {
                    id: "2",
                    title: "test2"
                }
            ]

            const likedVideoDictionary = {
                "1": likedVideoData[0],
                "2": likedVideoData[1]
            }

            const workoutId = "1";

            store = mockStore(thisInitialState)
            const { getByTestId, UNSAFE_getByType } = await render(<Provider store={store}><DetailsScreen
                workoutID={workoutId}
                workout={likedVideoDictionary[workoutId]}
                detailsBackHandler={jest.fn()}
            /></Provider>);

            fireEvent.press(getByTestId('likeBtn'));

            expect(mockSet).toHaveBeenCalled();
        });
    });

    it('If video is unliked, pressing like button calls delete query on firebase', () => {
        act(async () => {
            const thisInitialState = {
                auth: {
                    loggedIn: false,
                    savedExercises: null,
                    creatingUser: true,
                    currentUserId: "1",
                    currentUser: { "full_name": 'Sajan Gutta' },
                    likedVideos: null,
                    videoDatas: null
                }
            }

            const likedVideoData = [
                {
                    id: "1",
                    title: "test1"
                },
                {
                    id: "2",
                    title: "test2"
                }
            ]

            const likedVideoDictionary = {
                "1": likedVideoData[0],
                "2": likedVideoData[1]
            }

            const workoutId = "1";

            store = mockStore(thisInitialState)
            const { getByTestId, UNSAFE_getByType } = await render(<Provider store={store}><DetailsScreen
                workoutID={workoutId}
                workout={likedVideoDictionary[workoutId]}
                detailsBackHandler={jest.fn()}
            /></Provider>);

            fireEvent.press(getByTestId('likeBtn'));

            expect(mockDelete).toHaveBeenCalled();
        });
    });
});