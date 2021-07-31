import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from '../firebase/config.js';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db;
export { firebase };
