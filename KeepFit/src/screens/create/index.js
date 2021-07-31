import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Image, Button, TouchableOpacity, Text } from 'react-native';
import Container from '@app/components/container.js'
import { Header } from '@app/components/text.js';
import db from "../../firebase/firebase";
import LoadingPic from '../../assets/loadingPic.png';
import CreateVideosScreen from './video';
import CreateLivestreamsScreen from './livestream';

const CreateScreen = props => {
    const [displayedScreen, setDisplayedScreen] = useState('index');

    const changeScreenHandler = (new_screen) => {
        setDisplayedScreen(new_screen);
    };

    let visibleContent;
    if (displayedScreen == "videos") {
        visibleContent = <CreateVideosScreen changeScreenHandler={changeScreenHandler} />
    } else if (displayedScreen == "livestreams") {
        visibleContent = <CreateLivestreamsScreen changeScreenHandler={changeScreenHandler} />
    }

    return (
        <SafeAreaView>
                {!visibleContent ? (
                    <Container>
                        <Text style={styles.mainHeader}>
                            Create
                        </Text>
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={styles.editBorder}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("videos")}
                                testID = 'exercisesButton'
                            >
                                <Text style={styles.editText}>
                                    Upload a Video
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.editBorder}>
                            <TouchableOpacity
                                onPress={() => changeScreenHandler("livestreams")}
                                testID = 'workoutsButton'
                            >
                                <Text style={styles.editText}>
                                    Start a Livestream
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Image 
                                    source={LoadingPic}
                                    style={styles.image}
                            />
                        </View>
                    </Container>
                ) : (
                    visibleContent)}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 40,
        marginTop: "10%",
        color: "black",
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 20,
        marginTop: "5%",
        color: "black"
    },
    editBorder: {
        borderColor: 'grey',
        justifyContent: 'space-around',
        borderWidth: 1,
        marginTop: '2%',
        height: 40,
        width: 300
    },
    editText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'space-around',
    },
    image: {
        marginTop: "5%",
        width: 300,
        height: 600,
    }
});

export default CreateScreen;
