import CreateUserScreen from "../src/screens/createUser/index";
import LoginScreen from "../src/screens/login/index";
import React, { useState } from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { Alert } from 'react-native'
import { FitnessLevelPicker, GenderPicker } from "../src/components/pickers";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from "@expo/vector-icons";
import { createUser, loginUser, logoutUser, updateSavedExercises, updateLikedVideos } from "../src/redux/actions/auth"
import { rootReducer } from "../src/redux/store";
import RootStackNavigator from "../src/navigation/RootStackNavigator";
const { mockWhere } = require('firestore-jest-mock/mocks/firestore');


describe('Create User Input Validation', () => {
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
    let store, wrapper

    it('should alert if not all fields are full', () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        store = mockStore(initialState)
        const { getByTestId } = render(<Provider store={store}><CreateUserScreen /></Provider>);
        
        // only filling username field
        fireEvent.changeText(getByTestId('usernameInput'), "test");

        fireEvent.press(getByTestId('createButton'));

        expect(alert_spy).toHaveBeenCalled();
    });

    it('should alert if using an existing username and all fields full', () => {
        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><CreateUserScreen /></Provider>);
        waitFor(() => UNSAFE_getByType(GenderPicker))
        
        // filling all fields
        fireEvent.changeText(getByTestId('usernameInput'), "sjgutta");
        fireEvent.changeText(getByTestId('weightInput'), "25");
        fireEvent.changeText(getByTestId('heightInput'), "25");

        fireEvent(UNSAFE_getByType(DateTimePicker), 'onChange', null, new Date());
        fireEvent(UNSAFE_getByType(GenderPicker), 'onValueChange', "MALE");
        fireEvent(UNSAFE_getByType(FitnessLevelPicker), 'onValueChange', "ADVANCED");

        fireEvent.press(getByTestId('createButton'));

        // checking that validation query was run
        expect(mockWhere).toHaveBeenCalledWith("username", "==", "sjgutta");
    });

    it('weight and height only allow numbers', () => {
        store = mockStore(initialState)

        const { getByTestId } = render(<Provider store={store}><CreateUserScreen /></Provider>);
        
        fireEvent.changeText(getByTestId('heightInput'), "2f5");

        expect(getByTestId('heightInput').props.value).toEqual('25');

        fireEvent.changeText(getByTestId('weightInput'), "2f5");

        expect(getByTestId('weightInput').props.value).toEqual('25');
    });
});

describe('Ensuring Proper Auth Rendering Based on Redux State', () => {
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
    let store, wrapper

    it('if creating user, create user screen is shown', () => {
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

        store = mockStore(thisInitialState)

        const { getByTestId, getByText } = render(<Provider store={store}><RootStackNavigator /></Provider>);
        
        // this raises an error if text is not present, test will fail
        expect(getByText("Welcome to KeepFit!"));
    });

    it('if not creating user, not logged in, login screen is shown', () => {
        const thisInitialState = {
            auth: {
                loggedIn: false,
                savedExercises: null,
                creatingUser: false,
                currentUserId: null,
                currentUser: null,
                likedVideos: null,
                videoDatas: null
            }
        }

        store = mockStore(thisInitialState)

        const { UNSAFE_getByType } = render(<Provider store={store}><RootStackNavigator /></Provider>);
        
        // this raises an error if the google login button is not present, test will fail
        expect(UNSAFE_getByType(FontAwesome5.Button));
    });
});

describe('Login Button Triggers Redux Login and auth reducers work properly', () => {
    const initialState = {
        auth: {
            loggedIn: false,
            savedExercises: null,
            creatingUser: false,
            currentUserId: null,
            currentUser: null,
            likedVideos: null,
            videoDatas: null
        }
    }
    const mockStore = configureStore({reducer: rootReducer})
    let store, wrapper

    it('login button calls loginUser', () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const loginMock = jest.fn();

        store = mockStore(initialState)
        const { UNSAFE_getByType } = render(<Provider store={store}><LoginScreen loginUser={loginMock} /></Provider>);
        
        // only filling username field
        fireEvent(UNSAFE_getByType(FontAwesome5.Button), 'onPress');

        expect(loginMock).toHaveBeenCalled();
    });

    it('loginUser redux action updates current user and logged in status properly', () => {
        const user_id = "user-id";
        const user_object = {
            full_name: "Test User",
        };

        const action = loginUser(user_id, user_object);

        const new_state = rootReducer(state=initialState, action)

        expect(new_state.auth.loggedIn).toEqual(true);
        expect(new_state.auth.currentUserId).toEqual(user_id);
        expect(new_state.auth.currentUser).toEqual(user_object);
    });

    it('logoutUser action clear user and id, sets logged in to false', () => {
        const user_id = "user-id";
        const user_object = {
            full_name: "Test User",
        };

        const thisInitialState = {
            auth: {
                loggedIn: true,
                savedExercises: null,
                creatingUser: false,
                currentUserId: 'test',
                currentUser: {"name": "test user"},
                likedVideos: null,
                videoDatas: null
            }
        }

        const action = logoutUser(user_id, user_object);

        const new_state = rootReducer(state=thisInitialState, action)

        expect(new_state.auth.loggedIn).toEqual(false);
        expect(new_state.auth.currentUserId).toEqual(null);
        expect(new_state.auth.currentUser).toEqual(null);
    });

    it('createUser action keeps logged in as false but indicates creatingUser, user object, and id', () => {
        const user_id = "user-id";
        const user_object = {
            full_name: "Test User",
        };

        const action = createUser(user_id, user_object);

        const new_state = rootReducer(state=initialState, action)

        expect(new_state.auth.loggedIn).toEqual(false);
        expect(new_state.auth.creatingUser).toEqual(true);
        expect(new_state.auth.currentUserId).toEqual(user_id);
        expect(new_state.auth.currentUser).toEqual(user_object);
    });

    it('testing updateSavedExercises reducer', () => {
        const saved_exercises = [
            {
                category: "CARDIO",
                caloriesBurned: "25"
            },
            {
                category: "HIIT",
                caloriesBurned: "20"
            }
        ]

        const action = updateSavedExercises(saved_exercises);

        const new_state = rootReducer(state=initialState, action)

        expect(new_state.auth.savedExercises).toEqual(saved_exercises);
    });

    it('testing updateLikedVideos reducer', () => {
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

        const action = updateLikedVideos(likedVideoDictionary, likedVideoData);

        const new_state = rootReducer(state=initialState, action)

        expect(new_state.auth.likedVideos).toEqual(likedVideoDictionary);
        expect(new_state.auth.videoDatas).toEqual(likedVideoData);
    });
});
