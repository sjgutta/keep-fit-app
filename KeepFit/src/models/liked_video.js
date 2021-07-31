import BaseModel from '../models/base';

class LikedVideo extends BaseModel {
    static collection_name = 'liked_video';

    constructor(data) {
        // initialize base model with firebase collection name
        self.id = data.id;
        self.user_id = data.user_id;
        self.video_id = data.video_id;
        self.liked_on = data.liked_on;
    }
}

export default LikedVideo;
