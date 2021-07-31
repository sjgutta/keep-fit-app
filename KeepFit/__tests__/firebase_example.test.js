const { mockCollection } = require('firestore-jest-mock/mocks/firestore');

test('testing stuff', () => {
  const firebase = require('firebase'); // or import firebase from 'firebase';
  const db = firebase.firestore();

  return db
    .collection('users')
    .get()
    .then(userDocs => {
      // Assert that a collection ID was referenced
      expect(mockCollection).toHaveBeenCalledWith('users');

      // Write other assertions here
    });
});
