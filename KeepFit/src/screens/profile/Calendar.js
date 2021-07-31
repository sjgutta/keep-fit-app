import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    View,
    Button,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Container from '@app/components/container.js';
import { useSelector } from 'react-redux';
import Text from '@app/components/text.js';
import Workout from './workout';
import moment from 'moment';

import styles from './styles';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS = 'NOTIFICATIONS';

const UserCalendarScreen = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [day, setDay] = useState(new Date());
    const [markedDates, setMarkedDates] = useState(null);
    const [notifications, setNotifications] = useState([]);

    let filteredWorkoutHistory = useSelector(
        (state) => state.auth.savedExercises
    );

    const selectDayString = day.toLocaleDateString();
    filteredWorkoutHistory = filteredWorkoutHistory.filter(
        (workout) => workout.completed_on == selectDayString
    );

    useEffect(() => {
        const getData = async () => {
            const value = await AsyncStorage.getItem(NOTIFICATIONS);
            if (!value) return;
            let notificationsArr = JSON.parse(value);
            notificationsArr = notificationsArr.filter(
                (notification) =>
                    notification.on &&
                    new Date() < new Date(notification.trigger)
            );
            setNotifications(notificationsArr);
        };
        getData();
    }, []);

    const scheduleWorkout = async (date) => {
        date.setDate(day.getDate());
        date.setMonth(day.getMonth());
        try {
            const notification = {
                content: {
                    title: "You've got mail! 📬",
                    body: 'Use Keep Fit to stay active!',
                    data: { data: 'goes here' },
                },
                trigger: date,
                on: true, // its not like anyone will ever create thousands of notifications
            };
            const notificationId = await Notifications.scheduleNotificationAsync(
                notification
            );
            notification.id = notificationId;
            // store id in async storage
            notifications.push(notification);
            setNotifications([...notifications]);
            await AsyncStorage.setItem(
                NOTIFICATIONS,
                JSON.stringify(notifications)
            );

            return 1;
        } catch (e) {
            return 0;
        }
    };

    const cancel = async (i) => {
        await Notifications.cancelScheduledNotificationAsync(
            notifications[i].id
        );
        // disable notification rendering
        notifications[i].on = false;
        setNotifications([...notifications]);
        await AsyncStorage.setItem(
            NOTIFICATIONS,
            JSON.stringify(notifications)
        );
    };

    let conditionalCompletedWorkoutContent;
    if (filteredWorkoutHistory.length != 0) {
        conditionalCompletedWorkoutContent = (
            <>
                <Text style={styles.calendarHeader}>
                    Workouts Completed on {selectDayString}
                </Text>
                <View style={styles.savedContentContainer}>
                    <FlatList
                        data={filteredWorkoutHistory}
                        renderItem={({ item }) => (
                            <TouchableHighlight>
                                <Workout
                                    deleteSavedExerciseHandler={
                                        props.deleteSavedExerciseHandler
                                    }
                                    CompletedWorkout={item}
                                />
                            </TouchableHighlight>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </>
        );
    } else {
        conditionalCompletedWorkoutContent = (
            <>
                <Text style={styles.calendarHeader}>
                    No Workouts Completed on {selectDayString}
                </Text>
            </>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Container>
                    <Button
                        title="<< Back"
                        onPress={() => props.cancelCalendar()}
                    />
                    <View style={styles.calendarContainer}>
                        <Calendar
                            markedDates={markedDates}
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                height: 350,
                            }}
                            onDayPress={(day) => {
                                setDay(
                                    new Date(
                                        day.timestamp +
                                            new Date().getTimezoneOffset() *
                                                60 *
                                                1000
                                    )
                                );
                                let date_string = day.dateString;
                                let newMarkedDates = {};
                                newMarkedDates[date_string] = {
                                    selected: true,
                                    marked: true,
                                    selectedColor: 'blue',
                                };
                                setMarkedDates(newMarkedDates);
                            }}
                        />
                    </View>
                    <Button
                        title="Create reminder"
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                    <DateTimePickerModal
                        isVisible={modalVisible}
                        mode="time"
                        onConfirm={async (date) => {
                            if (!(await scheduleWorkout(date)))
                                return Alert.alert(
                                    'Pick a time not in the past'
                                );
                            Alert.alert(
                                'Created reminder',
                                "You'll get a notification from us soon",
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            setModalVisible(false);
                                        },
                                    },
                                ]
                            );
                        }}
                        onCancel={() => {
                            setModalVisible(false);
                        }}
                    />
                    {conditionalCompletedWorkoutContent}

                    <Text style={{ textAlign: 'center', ...styles.bold }}>
                        Notifications
                    </Text>
                    {!notifications.filter(
                        (notification) =>
                            notification.on &&
                            new Date() < new Date(notification.trigger)
                    ).length && <Text>No notifications</Text>}
                    {notifications.map((notification, i) => {
                        if (
                            !notification.on ||
                            new Date() > new Date(notification.trigger)
                        )
                            return <></>;
                        return (
                            <View
                                style={styles.notification}
                                key={i.toString()}
                            >
                                <View style={styles.notificationText}>
                                    <Text style={styles.bold}>
                                        Workout Notification
                                    </Text>
                                    <Text>
                                        {moment(notification.trigger).format(
                                            'M/d/YY'
                                        )}{' '}
                                        at{' '}
                                        {moment(notification.trigger).format(
                                            'h:mm'
                                        )}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.cancel}
                                    onPress={() => {
                                        Alert.alert(
                                            'Cancel Notification',
                                            'Are you sure you want to cancel the notification?',
                                            [
                                                {
                                                    text: 'Nevermind',
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        cancel(i);
                                                    },
                                                },
                                            ]
                                        );
                                    }}
                                >
                                    <Text style={styles.cancelText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserCalendarScreen;
