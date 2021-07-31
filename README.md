# KeepFit

This is the repository for Team 12 (CSCI 310 Dream Team) in USC's CSCI 310 during Spring 2021. It contains the application KeepFit.

## Short Description

KeepFit is an application intended to help users remain in shape during the COVID-19 pandemic. While everyone has been stuck inside due to social distancing, access to the tools needed to stay in shape has been limited. This application solves that problems and allows users to "keep fit" from anywhere.

## Team Members

1. Sajan Gutta
2. Victor Udobong
3. Max Friedman
4. Aaron Ly
5. Devin Mui
6. Roddur Dasgupta

# Instructions for Tests in Assignment 4

## Running All Tests

1. Navigate to the KeepFit directory from your terminal or command line.
2. Make sure you have installed all node_modules.
3. Run npm test.
4. Test case execution will output to the terminal/command line.

# Deployment/Demo Instructions for Assignment 3

## Some Notes/Prerequisite Information

-   We are developing this application in React Native. This allows it to run on android and iOS ideally.
-   For this demo, due to quick turnaround times, the application is intended to be run using Expo and the Expo client.
-   Since all members of the team have iPhones, the app has been built and tested on iOS. We are uncertain if android has any particular errors.
-   If none of the TA's grading us have iPhones, they can also use an iOS simulator on their computer. This will entail downloading Xcode and using expo to start an iOS simulator. We are happy to help with any issues that arise related to this to make sure KeepFit can be properly demonstrated.
-   Our Deployment Doc can be found in this same directory as a pdf.
-   We have provided our redlined Design Document with changes as a pdf in this directory as well. It is in a specific

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

# Using Zoom for Livestream API

-   We use the Zoom API to create livestreams on KeepFit. Zoom has extensive security in place to prevent unauthorized people from using the API.
-   As a result, it requires us to login to `expo` from the command line and also be logged into the proper Zoom account on our mobile device when working in development mode.
-   This makes the API difficult to check without providing you with our Zoom (and also Google account) credentials. We'd also have to share our expo account. For security purposes, we hope to demonstrate this feature when we provide you with a live demo of KeepFit for this assignment!
-   All other features will work easily when using the steps above though!
-   To set up your own local testing environment, follow these steps:

    -   Visit the [Zoom API](https://marketplace.zoom.us/docs/api-reference/zoom-api).
    -   Click `Create App`.
    -   Choose OAuth App.
    -   Copy the development credentials (client ID and client secret).
    -   Use `https://auth.expo.io/@<your Expo username>/KeepFit` for the redirect URL.
    -   Make a copy of `keys_defaults.txt` as `src/keys.js` and fill out the Zoom keys with the credentials copied from earlier.
    -   Run the Expo app.

        ```sh
        $ expo start
        ```

    -   The development credentials only allow for the Zoom developer account to sign into the app.
