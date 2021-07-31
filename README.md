# KeepFit

This is the repository for KeepFit, a fitness application built in React Native. KeepFit provides numerous amazing features, including the list below:
1. User account management and authentication with Googla OAuth 2.0.
2. The ability to explore exercise options, create a workout plan, and learn about the plan.
3. Video uploading and sharing in a similar style to Youtube. These workout videos can be tagged based on the types of workouts they contain.
4. Users can start livestreams of their workouts which other users on the app can join.
5. The app has a social aspect, allowing users to follow each other, share workouts, track progress and more.
6. KeepFit has a workout tracking feature similar to apps like Nike Run Club, which allows users to time their workout, record calories burned, what workouts they performed, and more.
7. Users can schedule future workouts and receive reminders when its time to do them.
8. All content such as videos, livestreams, and workouts can be saved/liked and referenced later by users.

For a complete list of KeepFit's features, you can view the multiple pdf files in the base of this repository. The REDLINE_DESIGN_DOCUMENT.pdf is particularly useful for learning about the application.

## Background

KeepFit is an application intended to help users remain in shape during the COVID-19 pandemic. While everyone has been stuck inside due to social distancing, access to the tools needed to stay in shape has been limited. This application solves that problems and allows users to "keep fit" from anywhere.

This application was created as part of a project in my CSCI 310: Software Engineering Class. It involves experience with a large number of useful, real-world technologies including React Native, Firebase Authentication, Firebase Firestore, Styled components, React navigation, Redux state management, Jest, Enzyme, React Native Testing Library, and various other smaller React Native libraries.

Full Disclosure: This was a group project. However, I completed many of the critical features including the following:
1. Initializing the application and setting up React Navigation infrastructure.
2. Setting up all Firebase features and infrastructure (this was the most intensive part of completing the application).
3. Implementing Video uploading, searching, and liking features.
4. Implementing all user authentication and account management features.
5. Connecting the application with Redux.
6. Following/Unfollowing users.
7. Tagging exercises, also searching for them.
8. Exercise tracking/timing feature.
9. Testing infrastructure.
10. Regularly reviewed other group member's code and fixed and/or approved PR's.

## Running All Tests

1. Navigate to the KeepFit directory from your terminal or command line.
2. Make sure you have installed all node_modules.
3. Run npm test.
4. Test case execution will output to the terminal/command line.

# Running KeepFit

-   Clone this repository/unzip the submitted zip file. You have likely already done this if you are seeing this README.
-   You should have the node package manager (npm) on your computer.
    -   If you do not have npm, you can install pretty quickly it with instructions at https://www.npmjs.com/get-npm
-   Install the Expo CLI on your computer.
    -   You can see the instructions at https://docs.expo.io/get-started/installation/
    -   We suggest installing with npm as is in the instructions. However, it is also possible to use other tools such as homebrew.
-   Node Modules required for the application to run should already be included in the zip file. This has been done to save you the time of waiting for all of them to install via the package.json or yarn.lock files.
-   Download the Expo Go application on your mobile device.
    -   https://apps.apple.com/us/app/expo-go/id982107779
    -   This will allow you to run the application from your phone. Otherwise, you will need Xcode to run an iOS simulator.
-   At this point, you can open your terminal/command line and navigate to the directory within this directory, titled "KeepFit" which is not to be confused with "keep-fit" (this directory).
-   Make sure your mobile device and computer are on the same Wifi network.
-   Once there, run "expo start" and expo should start the application. The Expo Developer Console will open up with your application in a browser. Scan the QR code shown on that page from your mobile device. You will now be able to navigate to the Expo Go application and run KeepFit!
-   NOTE: In the future, this process will no longer be necessary. We intend to eventually (in future sprints) make an optimized build of KeepFit for iOS and/or Android.
