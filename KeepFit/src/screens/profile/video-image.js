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

export default function whichVideoImage(props) {
    const { Video } = props;
    switch (Video.category) {
        case 'CARDIO':
            return (
                <Image
                    source={CardioPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
        case 'STRENGTH':
            return (
                <Image
                    source={StrengthPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
        case 'BODYWEIGHT':
            return (
                <Image
                    source={BodyweightPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
        case 'HIIT':
            return (
                <Image
                    source={HiitPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
        case 'WEIGHTLIFTING':
            return (
                <Image
                    source={WeightliftPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
        default:
            return (
                <Image
                    source={HybridPicture}
                    style={styles.image}
                    style={styles.workoutPic}
                />
            );
    }
}
