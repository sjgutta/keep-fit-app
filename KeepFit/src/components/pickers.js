import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Gender from '../models/gender';
import FitnessLevel from '../models/fitness_level';
import MuscleGroup from '../models/muscle_group';
import WorkoutCategory from '../models/workout_category';


const getItemsFromEnum = (object) => {
    let result = [];
    for (let k in object) {
        result.push({ label: object[k], value: k });
    }
    return result;
}

export const GenderPicker = props => {
    return (
        <RNPickerSelect
            placeholder={{
                label: "Select a Gender...",
                value: null
            }}
            {...props}
            style={{ ...pickerSelectStyles, ...props.style }}
            items={getItemsFromEnum(Gender)}
        />
    );
};

export const FitnessLevelPicker = props => {
    return (
        <RNPickerSelect
            placeholder={{
                label: "Select a Fitness Level...",
                value: null
            }}
            {...props}
            style={{ ...pickerSelectStyles, ...props.style }}
            items={getItemsFromEnum(FitnessLevel)}
        />
    );
};

export const MuscleGroupPicker = props => {
    return (
        <RNPickerSelect
            placeholder={{
                label: "Select a Muscle Group...",
                value: null
            }}
            {...props}
            style={{ ...pickerSelectStyles, ...props.style }}
            items={getItemsFromEnum(MuscleGroup)}
        />
    );
};

export const WorkoutCategoryPicker = props => {
    return (
        <RNPickerSelect
            placeholder={{
                label: "Select a Workout Category...",
                value: null
            }}
            {...props}
            style={{ ...pickerSelectStyles, ...props.style }}
            items={getItemsFromEnum(WorkoutCategory)}
        />
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 20,
        color: 'blue',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    }
});
