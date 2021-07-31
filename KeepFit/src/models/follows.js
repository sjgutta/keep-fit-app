import BaseModel from "../models/base";
import db, { firebase } from "../firebase/firebase";

class Follows extends BaseModel {
    static collection_name = "follows"

    constructor (follower_id, followee_id) {
        self.follower_id = follower_id;
        self.followee_id = followee_id;
    }
}

export default Follows;
