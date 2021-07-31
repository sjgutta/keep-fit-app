import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    Button,
    TouchableHighlight,
    Image,
    View,
    Linking,
    TouchableOpacity,
} from 'react-native';
import Text from '@app/components/text.js';

import whichImage from './workout-image';

import styles from './styles';

export default function Workout(props) {
    const { CompletedWorkout, deleteSavedExerciseHandler } = props;
    return (
        <View style={styles.unpaddedHorizontalContainer}>
            {whichImage({ CompletedWorkout })}
            <View style={styles.addFlex}>
                <View style={styles.horizontalItemContainer}>
                    <Text style={styles.workoutHistName}>
                        {CompletedWorkout.category}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            deleteSavedExerciseHandler(CompletedWorkout.id)
                        }
                    >
                        <Text style={styles.deleteText}>X</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.workoutHistSub}>
                    {CompletedWorkout.completed_on}
                </Text>
                <Text style={styles.workoutHistLastSub}>
                    {CompletedWorkout.caloriesBurned} cals. burned
                </Text>
                <View style={styles.unpaddedTagsHorizontalContainer}>
                    <Text style={styles.tagName}>
                        {CompletedWorkout.muscle_group}
                    </Text>
                    <Text style={styles.tagName}>
                        {CompletedWorkout.secondary_muscle_group}
                    </Text>
                </View>
            </View>
        </View>
    );
}
