import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Button, Text, TouchableHighlight, View } from 'react-native';


const ListItem = props => {
    return(
        <TouchableHighlight
        onPress={() => {
            props.setDisplayedDetails(props.object);
        }}>
            <View style={styles.listItemContainer}>
                <Text style={styles.objectText}>{props.object[1].name}{props.object[1].title}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>{props.object[1].description}</Text>
            </View>
        </TouchableHighlight>
    )
};

export const ExploreListItem = props => {
    return(
        <TouchableHighlight
        onPress={() => {
            props.setDisplayedDetails(props.object);
        }}>
            <View style={styles.listItemContainer}>
                <Text style={styles.objectText}>{props.object.name}{props.object.title}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>{props.object.description}</Text>
            </View>
        </TouchableHighlight>
    )
};

const styles = StyleSheet.create({
    objectText: {
        fontSize: 30,
        marginTop: 10,
    },
    listItemContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 10,
    }
});

export default ListItem;