import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './src/firebase/config';

firebase.initializeApp(firebaseConfig);

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

const { mockFirebase } = require('firestore-jest-mock');

// Create a fake Firestore with a `users` and `posts` collection
mockFirebase({
  database: {
    users: [
      { id: '1', full_name: 'Sajan Gutta', username: "sjgutta" },
      { id: '2', full_name: 'Max Friedman', username: "maxfriedman" },
      { id: '3', full_name: 'Victor Udobong', username: "victorudobong" },
      { id: '4', full_name: 'Aaron Ly', username: "aaronly" },
      { id: '5', full_name: 'Devin Mui', username: "devinmui" },
      { id: '6', full_name: 'Roddur Dasgupta', username: "roddurdasgupta" },
    ],
    videos: [
      {id: '1', title: 'vid1', description: 'description of vid 1'},
      {id: '2', title: 'vid2', description: 'description of vid 2'},
      {id: '3', title: 'vid3', description: 'description of vid 3'},
    ]
  }
});



jest.mock('@expo/vector-icons');
