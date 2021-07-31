import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

import {
    WorkoutCategoryPicker,
    MuscleGroupPicker,
} from '../src/components/pickers';

import CreateLivestreamsScreen from '../src/screens/create/livestream';

import { render, fireEvent, waitFor } from '@testing-library/react-native';
const { mockWhere } = require('firestore-jest-mock/mocks/firestore');
import configureStore from 'redux-mock-store';

afterEach(() => {
    jest.clearAllMocks();
});

describe('Input validation and livestream creation works properly', () => {
    const mockStore = configureStore();

    it('If title input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateLivestreamsScreen />
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

        return expect(alert_spy).toHaveBeenCalled();
    });

    it('If description input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateLivestreamsScreen />
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

        return expect(alert_spy).toHaveBeenCalled();
    });

    it('If workout category input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateLivestreamsScreen />
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

        return expect(alert_spy).toHaveBeenCalled();
    });

    it('If primary muscle group input is empty, save fails and alert is called', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateLivestreamsScreen />
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

        return expect(alert_spy).toHaveBeenCalled();
    });

    it('If all inputs are valid, no alert is shown', async () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        const store = mockStore({
            auth: { currentUserId: '123', currentUser: {} },
        });

        const { getByTestId, UNSAFE_getByType, UNSAFE_getAllByType } = render(
            <Provider store={store}>
                <CreateLivestreamsScreen />
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

        return expect(alert_spy).not.toHaveBeenCalled();
    });
});
