import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Button, Text, Alert, Linking, View } from 'react-native';
import { Header } from '@app/components/text.js';
import db, { firebase } from "../../firebase/firebase";
import Livestream from '../../models/livestream';
import ListItem from './listitem';
import { MuscleGroupPicker, WorkoutCategoryPicker } from '../../components/pickers';

const Tag = props => {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{props.value}</Text>
        </View>
    );
};

const incrementCounter = props => {

   const increment = firebase.firestore.FieldValue.increment(1)
   const myLivestream = db.collection(Livestream.collection_name).doc(props.livestreamID);

    myLivestream.update({num_participants: increment});
    Linking.openURL(props.livestream.video_link)
}
export const DetailsScreen = props => {
    return (
        <SafeAreaView>
            <Button title="<< Back" onPress={() => props.detailsBackHandler()} testID='backButton'/>
            <Header style={styles.livestreamName}>
                {props.livestream.title}
            </Header>
            <Text style={styles.videoLink}
            onPress={() => {
                (props.livestream.max_limit > props.livestream.num_participants) ?
                incrementCounter(props)
                  : 
                 Alert.alert(
                    'Error',
                    'Participant limit has been reached.',
                    [{ text: 'Dismiss', style: 'cancel' }]
                 );
                
                 
                }}>
                Watch Livestream on Zoom
            </Text>
            <Text>
                Max Participants: {props.livestream.max_limit}   |   Current Participants: {props.livestream.num_participants}
                
            </Text>
            <Text>
                
            </Text>
            <Text>
                Description: {props.livestream.description}
            </Text>
            <View style={styles.tagsContainer}>
                <Tag value={props.livestream.category}></Tag>
                <Tag value={props.livestream.muscle_group}></Tag>
                {props.livestream.secondary_muscle_group ? <Tag value={props.livestream.secondary_muscle_group}></Tag> : null}
            </View>
        </SafeAreaView>
    );
};

const SearchLivestreamsScreen = props => {
    const [livestreamDictionary, setLivestreamDictionary] = useState({});
    const [filteredLivestreamDictionary, setFilteredLivestreamDictionary] = useState({});
    const [muscleGroupFilter1, setMuscleGroupFilter1] = useState("");
    const [muscleGroupFilter2, setMuscleGroupFilter2] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [displayedDetails, setDisplayedDetails] = useState(null);

    useEffect(() => {
        var fetchedLivestreamDictionary = {};
        db.collection(Livestream.collection_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                fetchedLivestreamDictionary[doc.id] = doc.data();
            });
            setFilteredLivestreamDictionary(fetchedLivestreamDictionary);
            setLivestreamDictionary(fetchedLivestreamDictionary);
        });
    }, []);

    //Apply filters
    useEffect(() => {
        var newFilteredLivestreamDictionary = {};

        for(var livestream in livestreamDictionary) {
            var livestreamDetails = livestreamDictionary[livestream];
            var filterFlag1 = false, filterFlag2 = false, filterFlag3 = false;

            if(muscleGroupFilter1 && muscleGroupFilter1 !== null) {
                if(livestreamDetails.muscle_group === muscleGroupFilter1 || livestreamDetails.secondary_muscle_group === muscleGroupFilter1) {
                    filterFlag1 = true;
                } 
            } else {
                filterFlag1 = true;
            }

            if(muscleGroupFilter2 && muscleGroupFilter2 !== null) {
                if(livestreamDetails.muscle_group === muscleGroupFilter2 || livestreamDetails.secondary_muscle_group === muscleGroupFilter2) {
                    filterFlag2 = true;
                } 
            } else {
                filterFlag2 = true;
            }

            if(categoryFilter && categoryFilter !== null) {
                if(livestreamDetails.category === categoryFilter) {filterFlag3 = true;}
                else {filterFlag3 = false;}
            } else {
                filterFlag3 = true;
            }

            if(filterFlag1 && filterFlag2 && filterFlag3) {
                newFilteredLivestreamDictionary[livestream] = livestreamDetails;
            }
        }
        setFilteredLivestreamDictionary(newFilteredLivestreamDictionary);
    }, [muscleGroupFilter1, muscleGroupFilter2, categoryFilter]);

    const detailsBackHandler = () => {
        setDisplayedDetails(null);
    };

    return (
        <SafeAreaView style={styles.searchContainer}>
                {displayedDetails ? (
                    <DetailsScreen 
                        livestreamID = {displayedDetails[0]}
                        livestream={filteredLivestreamDictionary[displayedDetails[0]]}
                        detailsBackHandler={detailsBackHandler}
                    />
                ) : (
                <View style={styles.listView}>
                    <Button title="<< Back" onPress={() => props.changeScreenHandler("index")} testID='backButton'/>
                    <View style={styles.filterContainer}>
                        <MuscleGroupPicker onValueChange={value => {
                            setMuscleGroupFilter1(value);
                        }}></MuscleGroupPicker>
                        <MuscleGroupPicker onValueChange={value => {
                            setMuscleGroupFilter2(value);
                        }}></MuscleGroupPicker>
                        <WorkoutCategoryPicker onValueChange={value => {
                            setCategoryFilter(value);
                        }}></WorkoutCategoryPicker>
                    </View>
                    <View style={styles.scrollView}>
                        <ScrollView style={{flexGrow: 1}}>
                        {Object.entries(filteredLivestreamDictionary).map(livestream =>
                            <ListItem setDisplayedDetails={setDisplayedDetails} object={livestream}>

                            </ListItem>
                        )}
                        </ScrollView>
                    </View>
                </View>
                )}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 25,
        flexGrow:1,
    },
    mainHeader: {
        fontSize: 50,
        marginTop: "55%",
        textAlign: "center"
    },
    livestreamText: {
        fontSize: 30,
        marginTop: 10,
    },
    listView: {
        marginBottom: 200,
    },
    filterContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        paddingBottom: 10,
    },
    scrollView: {
        height: "72.5%"
    },

    // STYLES FOR DETAILS SCREEN START
    livestreamName: {
        textAlign: 'center',
        paddingBottom: 20,
    },
    videoLink: {
        textAlign: 'center',
        color: 'blue',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 20
    },

    tagsContainer: {
        flexDirection: 'row',
        paddingTop: 20,
    },


    //STYLES FOR TAG START
    tag: {
        width: 110,
        height: 30,
        backgroundColor: 'grey',
        borderRadius: 10,
        justifyContent: 'center',
        shadowOffset:{  width: 0,  height: 2},
        shadowColor: 'black',
        shadowOpacity: 1.0,
        marginRight: 10,
      },

      tagText: {
        textAlign: 'center',
      },
});

export default SearchLivestreamsScreen;
