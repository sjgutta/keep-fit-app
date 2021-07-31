import BaseModel from "../models/base";
import db, { firebase } from "../firebase/firebase";

class User extends BaseModel {
    static collection_name = "users"

    constructor (id, full_name, email, profile_picture, username, birthday, gender, weight, height, fitness_level, created_at) {
        // initialize base model with firebase collection name        
        self.id = id
        self.full_name = full_name
        self.email = email
        self.profile_picture = profile_picture
        self.username = username
        self.birthday = birthday
        self.gender = gender
        self.weight = weight
        self.height = height
        self.fitness_level = fitness_level
        self.created_at = created_at
    }

    static create_initial_user(id, full_name, email, profile_picture, created_at) {
        db.collection(this.collection_name).add({
            id: id,
            email: email,
            profile_picture: profile_picture,
            full_name: full_name,
            created_at: created_at
        }).then(function (docRef) {
            console.log("created");
            docRef.get().then(function(doc) {
                return doc.data();
            })
        });
    }
}

export default User;
