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

import CardioPicture from '../../assets/cardio.jpeg';
import StrengthPicture from '../../assets/strength.jpeg';
import BodyweightPicture from '../../assets/bodyweight.jpeg';
import WeightliftPicture from '../../assets/weightlift.jpeg';
import HybridPicture from '../../assets/hybrid.jpeg';
import HiitPicture from '../../assets/hiit.jpeg';

import styles from './styles';

import whichVideoImage from './video-image';

export default function VideoItem(props) {
    const { Video } = props;
    return (
        <View style={styles.unpaddedHorizontalContainer}>
            {whichVideoImage({ Video })}
            <View style={styles.addFlex}>
                <View style={styles.horizontalItemContainer}>
                    <Text style={styles.workoutHistName}>{Video.title}</Text>
                    <TouchableOpacity onPress={() => props.onDelete(Video.id)}>
                        <Text style={styles.deleteText}>X</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.workoutHistSub}>{Video.category}</Text>
                <Text
                    style={styles.workoutHistVidLink}
                    onPress={() => Linking.openURL(Video.video_link)}
                >
                    Watch on Youtube
                </Text>
                <View style={styles.unpaddedTagsHorizontalContainer}>
                    <Text style={styles.tagName}>{Video.muscle_group}</Text>
                    <Text style={styles.tagName}>
                        {Video.secondary_muscle_group}
                    </Text>
                </View>
            </View>
        </View>
    );
}
