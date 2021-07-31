import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import Container from '@app/components/container.js';
import { Header, Subheader } from '@app/components/text.js';
import LoadingPic from '../../assets/loadingPic.png';
import { useSelector, useDispatch } from 'react-redux';


const HomeScreen = (props) => {
    const [posts, setPosts] = useState([]);
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const user_profile = useSelector((state) => state.auth.currentUser);


    
    const renderItem = ({ item }) => {
        <Container>
            <View>
                <Text>User Name completed XYZ</Text>
            </View>
            <View></View>
        </Container>;
    };

    if (!isLoggedIn) {
        console.log("not logged in");
        return (
            <SafeAreaView>
                <Text>Logging Out.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <Header style={styles.keepFitHeader} >
                    KeepFit                                      Insert Icons
            </Header>
            <View style={styles.horizontalContainer}>
                <Image
                    style={styles.profilePic1}
                    source={{ uri: user_profile.profile_picture }}
                />
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
                <Image
                    style={styles.profilePic}
                    source={{ uri: user_profile.profile_picture }}
                />
            </View>
            <Container>
                <Text style={styles.mainHeader}>
                    Featured Workouts
                </Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
                <Text style={styles.mainHeader}>
                    Latest Workouts
                </Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
                <Text style={styles.mainHeader}>
                    Join a Live Workout
                </Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
                <Image 
                    source={LoadingPic}
                    style={styles.image}
                />
            </Container>
            
            
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    keepFitHeader: {
        fontSize: 20,
        marginTop: "5%",
        marginLeft: "10%",
        color: "limegreen"
    },
    profilePic1: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: '1%',
        marginLeft: '5%',
        justifyContent: 'flex-start',
    },
    profilePic: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: '1%',
        marginLeft: '0%',
        justifyContent: 'flex-start',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 15,
    },
    mainHeader: {
        fontSize: 30,
        marginTop: "5%",
        color: "black",
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 18,
        marginTop: 0,
        textAlign: 'center',
    },
    image: {
        marginTop: "2%",
        width: 300,
        height: 99,
    }
});

export default HomeScreen;
