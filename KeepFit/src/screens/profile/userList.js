import React, { useState } from 'react'
import { SafeAreaView, View, FlatList, Button, TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';
import UserDetailsScreen from "./userDetails";

const UserItem = (props) => {
    return (
        <View style={styles.userItemContainer}>
            <Image
                style={styles.profilePic}
                source={{ uri: props.UserProfile.profile_picture }}
            />
            <Text style={styles.userItemName}>
                {props.UserProfile.full_name}
            </Text>
        </View>
    )
}

const UserList = (props) => {
    const [displayedDetails, setDisplayedDetails] = useState(null);

    const cancelListDetails = () => {
        setDisplayedDetails(null);
    }

    if (displayedDetails) {
        return (
            <SafeAreaView>
                <UserDetailsScreen user={displayedDetails} detailsBackHandler={cancelListDetails}/>
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={styles.UserListContainer}>
                <Button title="<< Back" onPress={() => props.cancelDetails()} />
                <Text style={styles.bigHeading}>{props.headerText}</Text>
                <FlatList
                    style={styles.addFlex}
                    data={props.userData}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setDisplayedDetails(item)}>
                            <UserItem UserProfile={item} />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        )
    }
}

export default UserList;
