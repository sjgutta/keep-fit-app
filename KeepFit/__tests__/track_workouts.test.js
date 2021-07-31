import TrackScreen from "../src/screens/track/index";
import { WorkoutCategoryPicker, MuscleGroupPicker } from '../src/components/pickers';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { Alert } from 'react-native'
import React, { useState } from 'react';
import { caloriesCalculator } from '../src/screens/track/index';
const { mockSet } = require('firestore-jest-mock/mocks/firestore');


describe('Tracking Screen Tests', () => {
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

    it('should successfully render Track Screen', () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><TrackScreen /></Provider>);
    });

    it('should alert if not all fields are full', () => {
        const alert_spy = jest.spyOn(Alert, 'alert');

        store = mockStore(initialState)
        const { getByTestId, UNSAFE_getByType } = render(<Provider store={store}><TrackScreen /></Provider>);

        // only filling category field
        fireEvent(UNSAFE_getByType(WorkoutCategoryPicker), 'onValueChange', "CARDIO");

        fireEvent.press(getByTestId('saveButton'));

        expect(alert_spy).toHaveBeenCalled();
    });

    it('should calculate increasing calories amounts in order of weightlifting, hybrid, bodyweight, cardio, hiit', () => {
        // 60 minutes elapsed
        const elapsedTime = 3600;

        // person weights 150 pounds
        const weight = 150;

        // calculating calories for each workout category
        const cardio = caloriesCalculator(elapsedTime, "CARDIO", weight);
        const bodyweight = caloriesCalculator(elapsedTime, "BODYWEIGHT", weight);
        const weightlifting = caloriesCalculator(elapsedTime, "WEIGHTLIFTING", weight);
        const hiit = caloriesCalculator(elapsedTime, "HIIT", weight);
        const hybrid = caloriesCalculator(elapsedTime, "HYBRID", weight);

        // checking order
        expect(weightlifting).toBeLessThan(hybrid);
        expect(hybrid).toBeLessThan(bodyweight);
        expect(bodyweight).toBeLessThan(cardio);
        expect(cardio).toBeLessThan(hiit);
    });

    it('should make calories N/A if no category', () => {
        // 60 minutes elapsed
        const elapsedTime = 3600;

        // person weights 150 pounds
        const weight = 150;

        // calculating calories for invalid category
        const calories = caloriesCalculator(elapsedTime, null, weight);

        // checking that it is N/A
        expect(calories).toEqual("N/A");
    });

    it('higher weight should burn more calories', () => {
        // 60 minutes elapsed
        const elapsedTime = 3600;

        // light person weight 100 pounds
        const lowWeight = 100;

        // heavier person weighs 200 pounds
        const highWeight = 200;

        // calculating calories for each weight
        const lowWeightCalories = caloriesCalculator(elapsedTime, "CARDIO", lowWeight);
        const highWeightCalories = caloriesCalculator(elapsedTime, "CARDIO", highWeight);
    
        // checking order
        expect(lowWeightCalories).toBeLessThan(highWeightCalories);
    });

    it('longer time should burn more calories', () => {
        // 60 minutes elapsed
        const shortElapsedTime = 3600;

        // 120 minutes elapsed
        const longElapsedTime = 7200;

        // person weighs 100 pounds
        const weight = 150;

        // calculating calories for each weight
        const shortTimeCalories = caloriesCalculator(shortElapsedTime, "CARDIO", weight);
        const longTimeCalories = caloriesCalculator(longElapsedTime, "CARDIO", weight);
    
        // checking order
        expect(shortTimeCalories).toBeLessThan(longTimeCalories);
    });
});
