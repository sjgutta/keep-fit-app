import db from "../firebase/firebase.js";

class BaseModel {
    select() {
        return db.collection(this.collection_name);
    }
}

export default BaseModel;
