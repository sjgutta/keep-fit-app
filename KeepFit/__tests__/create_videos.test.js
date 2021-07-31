import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

import {
    WorkoutCategoryPicker,
    MuscleGroupPicker,
} from '../src/components/pickers';

import CreateVideosScreen from '../src/screens/create/video';
import SearchWorkoutsScreen from '../src/screens/explore/workouts';
import RootStackNavigator from "../src/navigation/RootStackNavigator";
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
const { mockWhere } = require('firestore-jest-mock/mocks/firestore');
import configureStore from 'redux-mock-store';

afterEach(() => {
    jest.clearAllMocks();
});


describe('Create Video Input Tests', () => {
    const mockStore = configureStore();

    it('If title input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateVideosScreen />
            </Provider>
        );

        await fireEvent.changeText(
            getByTestId('descriptionInput'),
            'description'
        );
        await fireEvent(
            UNSAFE_getByType(WorkoutCategoryPicker),
            'onValueChange',
            'CARDIO'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[0],
            'onValueChange',
            'CHEST'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[1],
            'onValueChange',
            'CHEST'
        );
        await fireEvent.press(getByTestId('submitButton'));

        return expect(alert_spy).toHaveBeenCalledWith('Error', 'You must fill out all fields except secondary muscle group.', [
            { text: 'Dismiss', style: 'cancel' }
        ]);
    });

    it('If description input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateVideosScreen />
            </Provider>
        );

        await fireEvent.changeText(getByTestId('titleInput'), 'title');
        await fireEvent(
            UNSAFE_getByType(WorkoutCategoryPicker),
            'onValueChange',
            'CARDIO'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[0],
            'onValueChange',
            'CHEST'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[1],
            'onValueChange',
            'CHEST'
        );
        await fireEvent.press(getByTestId('submitButton'));

        return expect(alert_spy).toHaveBeenCalledWith('Error', 'You must fill out all fields except secondary muscle group.', [
            { text: 'Dismiss', style: 'cancel' }
        ]);
    });

    it('If workout category input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateVideosScreen />
            </Provider>
        );

        await fireEvent.changeText(getByTestId('titleInput'), 'title');
        await fireEvent.changeText(
            getByTestId('descriptionInput'),
            'description'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[0],
            'onValueChange',
            'CHEST'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[1],
            'onValueChange',
            'CHEST'
        );
        await fireEvent.press(getByTestId('submitButton'));

        return expect(alert_spy).toHaveBeenCalledWith('Error', 'You must fill out all fields except secondary muscle group.', [
            { text: 'Dismiss', style: 'cancel' }
        ]);
    });

    it('If primary muscle group input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateVideosScreen />
            </Provider>
        );

        await fireEvent.changeText(getByTestId('titleInput'), 'title');
        await fireEvent.changeText(
            getByTestId('descriptionInput'),
            'description'
        );
        await fireEvent(
            UNSAFE_getByType(WorkoutCategoryPicker),
            'onValueChange',
            'CARDIO'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[1],
            'onValueChange',
            'CHEST'
        );
        await fireEvent.press(getByTestId('submitButton'));

        return expect(alert_spy).toHaveBeenCalledWith('Error', 'You must fill out all fields except secondary muscle group.', [
            { text: 'Dismiss', style: 'cancel' }
        ]);
    });

    it('If all inputs are valid, no alert is shown', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateVideosScreen />
            </Provider>
        );

        await fireEvent.changeText(getByTestId('titleInput'), 'title');
        await fireEvent.changeText(
            getByTestId('descriptionInput'),
            'description'
        );
        await fireEvent(
            UNSAFE_getByType(WorkoutCategoryPicker),
            'onValueChange',
            'CARDIO'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[0],
            'onValueChange',
            'CHEST'
        );
        await fireEvent(
            UNSAFE_getAllByType(MuscleGroupPicker)[1],
            'onValueChange',
            'CHEST'
        );
        await fireEvent.press(getByTestId('submitButton'));

        return expect(alert_spy).toHaveBeenCalledWith('Error', 'You must select a video', [
            { text: 'Dismiss', style: 'cancel' }
        ]);
    });
});
