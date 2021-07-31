import BaseModel from "../models/base";

class Video extends BaseModel {
    static collection_name = "videos"

    constructor (data) {
        // initialize base model with firebase collection name        
        self.id = data.id
        self.user_id = data.user_id
        self.video_link = data.video_link
        self.title = data.title
        self.description = data.description
        self.category = data.category
        self.muscle_group = data.muscle_group
        self.secondary_muscle_group = data.secondary_muscle_group
        self.created_on = data.created_on
    }
}

export default Video;
