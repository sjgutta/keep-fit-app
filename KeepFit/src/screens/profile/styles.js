import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    notificationsContainer: {
        height: 100,
    },
    notification: {
        flex: 1,
        flexDirection: 'row',
    },
    notificationText: {
        flex: 8,
        justifyContent: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    cancel: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 4,
    },
    cancelText: { color: 'red' },
    mainHeader: {
        fontSize: 50,
        marginTop: '55%',
        textAlign: 'center',
    },
    mainContainer: {
        marginTop: 20,
        paddingHorizontal: 35,
    },
    googleButton: {
        height: 60,
        paddingLeft: 10,
        paddingRight: 1,
        justifyContent: 'flex-end',
    },
    googleButtonContainer: {
        marginTop: 0,
        justifyContent: 'flex-end',
    },
    googleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    nameContainer: {
        marginLeft: '0%',
    },
    fullName: {
        marginTop: '5%',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: '1%',
    },
    userHeadings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    calendar: {
        width: 40,
        height: 40,
        marginRight: '0%',
        justifyContent: 'center',
    },
    deleteText: {
        color: 'red',
        fontSize: 20,
    },
    userName: {
        fontSize: 20,
        marginTop: '0%',
        fontWeight: 'bold',
    },
    bio: {
        fontSize: 15,
        marginTop: '0%',
    },
    twoHeadings: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    followHeadings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    followBox: {
        justifyContent: 'center',
    },
    numFollow: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: '0%',
        textAlign: 'center',
    },
    follow: {
        fontSize: 15,
        marginTop: '0%',
        textAlign: 'center',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: '10%',
        marginLeft: '0%',
        justifyContent: 'flex-start',
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 15,
    },
    horizontalItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    unpaddedHorizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    unpaddedTagsHorizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: '5%',
        paddingTop: '0%',
    },
    subheading: {
        fontWeight: 'bold',
    },
    mainHeader1: {
        fontSize: 40,
        marginTop: '10%',
        color: 'black',
        fontWeight: 'bold',
    },
    editHeadings: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    spaceBox: {
        flex: 0.01,
    },
    btnPress: {
        color: 'black',
        fontSize: 14,
    },
    btnBluePress: {
        color: 'blue',
        fontSize: 14,
    },
    image: {
        width: 25,
        height: 25,
        fontWeight: 'bold',
    },
    editText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editBorder: {
        borderColor: 'grey',
        borderWidth: 1,
        flex: 1,
    },
    workoutHistName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: '5%',
        paddingLeft: '5%',
    },
    workoutHistSub: {
        fontSize: 18,
        marginTop: '0%',
        paddingLeft: '5%',
    },
    workoutHistLastSub: {
        fontSize: 18,
        marginTop: '0%',
        marginBottom: '0%',
        paddingLeft: '5%',
    },
    workoutHistVidLink: {
        fontSize: 18,
        marginTop: '0%',
        marginBottom: '0%',
        paddingLeft: '5%',
        color: 'blue',
        textDecorationLine: 'underline',
    },
    workoutPic: {
        width: 110,
        height: 110,
        marginTop: '5%',
    },
    tagName: {
        fontSize: 15,
        marginTop: '8%',
        color: 'skyblue',
        fontWeight: 'bold',
        paddingRight: '8%',
    },
    addFlex: {
        flexGrow: 1,
    },
    savedContentContainer: {
        // height: '55%',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    calendarHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    calBorder: {
        flex: 0.2,
    },
    nameHeadings: {
        flex: 1,
    },
    userItemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 20,
    },
    bigHeading: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    detailsContainer: {
        paddingHorizontal: 35,
    },
});
