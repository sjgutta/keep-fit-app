import ExploreScreen from "../src/screens/explore/index"
import SearchExercisesScreen from "../src/screens/explore/exercises"
import SearchLivestreamsScreen, { DetailsScreen } from "../src/screens/explore/livestreams"
import SearchWorkoutsScreen from "../src/screens/explore/workouts"
import SearchUsersScreen from "../src/screens/explore/users"
import { render, fireEvent, screen } from '@testing-library/react-native';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store'
import { WorkoutCategoryPicker } from '../src/components/pickers';




describe('Explore Screen Tests', () => {
    const initialState = {
        auth: {
            loggedIn: true,
            savedExercises: null,
            creatingUser: false,
            currentUserId: "2",
            currentUser: { "full_name": 'Max Friedman' },
            likedVideos: null,
            videoDatas: null
        }
    }
    const mockStore = configureStore()
    let store

    it('SearchExercisesScreen loads properly ', async () => {
        act(() => {
            const useEffect_spy = jest.spyOn(React, 'useEffect');
            const { getByTestId } = render(<ExploreScreen />);
            fireEvent.press(getByTestId('exercisesButton'));
            expect(useEffect_spy).toHaveBeenCalledTimes(2);
        });
    });

    // LIVESTREAM
    it('SearchLivestreamsScreen loads properly', async () => {
        act(() => {
            const useEffect_spy = jest.spyOn(React, 'useEffect');
            const { getByTestId } = render(<ExploreScreen />);
            fireEvent.press(getByTestId('livestreamsButton'));
            expect(useEffect_spy).toHaveBeenCalledTimes(4);
        });
    });

    it('SearchWorkoutsScreen loads properly', async () => {
        store = mockStore(initialState)

        act(() => {
            const useEffect_spy = jest.spyOn(React, 'useEffect');
            const { getByTestId } = render(<Provider store={store}><ExploreScreen /></Provider>);
            fireEvent.press(getByTestId('workoutsButton'));
            expect(useEffect_spy).toHaveBeenCalledTimes(6);
        });
    });

    it('SearchUsersScreen loads properly', async () => {
      store = mockStore(initialState)
        act(() => {
            const useEffect_spy = jest.spyOn(React, 'useEffect');
            const { getByTestId } = render(<Provider store={store}><ExploreScreen /></Provider>);
            fireEvent.press(getByTestId('usersButton'));
            expect(useEffect_spy).toHaveBeenCalledTimes(8);
        });
    });

    it('Return from exercises search to explore page correctly', () => {
        act(() => {
            const mockBackButton = jest.fn();
            const { getByTestId } = render(<SearchExercisesScreen changeScreenHandler={mockBackButton} />);
            fireEvent.press(getByTestId('backButton'));
            expect(mockBackButton).toHaveBeenCalledTimes(1);
        });
    });

    it('Return from livestream search to explore page page correctly', () => {
        act(() => {
            const mockBackButton = jest.fn();
            const { getByTestId } = render(<SearchLivestreamsScreen changeScreenHandler={mockBackButton} />);
            fireEvent.press(getByTestId('backButton'));
            expect(mockBackButton).toHaveBeenCalledTimes(1);
        });
    });

    it('Return from workout search to explore page correctly', () => {
        act(() => {
            store = mockStore(initialState)

            const mockBackButton = jest.fn();
            const { getByTestId } = render(<Provider store={store}><SearchWorkoutsScreen changeScreenHandler={mockBackButton} /></Provider>);
            fireEvent.press(getByTestId('backButton'));
            expect(mockBackButton).toHaveBeenCalledTimes(1);
        });
    });

    it('Return from livestream details to search screen correctly', () => {
        const livestream = {
            title: "test",
            video_link: "test.com",
            description: "test",
            muscle_group: "test",
            secondary_muscle_group: "test2",
            category: "test"
        }
        act(() => {
            const mockBackButton = jest.fn();
            const { getByTestId } = render(<DetailsScreen detailsBackHandler={mockBackButton} livestream={livestream} />);
            fireEvent.press(getByTestId('backButton'));
            expect(mockBackButton).toHaveBeenCalledTimes(1);
        });
    });

    it('Return from users to search index screen correctly', () => {
        store = mockStore(initialState)
        act(() => {
            const mockBackButton = jest.fn();
            const { getByTestId } = render(
              <Provider store={store}>
              <SearchUsersScreen changeScreenHandler={mockBackButton} detailsBackHandler={mockBackButton}/>
              </Provider>);
            fireEvent.press(getByTestId('backButton'));
            expect(mockBackButton).toHaveBeenCalledTimes(1);
        });
    });




});
