import ProfileScreen from "../src/screens/profile/index";
import UserDataScreen from "../src/screens/profile/userData";
import EditProfileScreen from "../src/screens/profile/EditProfileScreen";
import { WorkoutCategoryPicker, MuscleGroupPicker } from '../src/components/pickers';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { Alert } from 'react-native'
import React, { useState } from 'react';
import { caloriesCalculator } from '../src/screens/track/index';
const { mockSet } = require('firestore-jest-mock/mocks/firestore');


describe('Profile Screen Tests', () => {
    const initialState = {
        auth: {
            loggedIn: true,
            savedExercises: null,
            creatingUser: false,
            currentUserId: "1",
            currentUser: { "full_name": 'Sajan Gutta', "height": 72, "weight": 170 },
            likedVideos: null,
            videoDatas: null
        }
    }
    const mockStore = configureStore()
    let store, wrapper

    it('should successfully render Profile Screen', () => {
        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><ProfileScreen /></Provider>);
    });

    it('should successfully render User Data Screen', () => {
        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><UserDataScreen /></Provider>);
    });

    it('should successfully render Edit Profile Screen', () => {
        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><EditProfileScreen /></Provider>);
    });
});
