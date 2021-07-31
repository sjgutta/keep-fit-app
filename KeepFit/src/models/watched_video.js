import BaseModel from '../models/base';

class WatchedVideo extends BaseModel {
    static collection_name = 'watched_video';

    constructor(data) {
        // initialize base model with firebase collection name
        self.id = data.id;
        self.user_id = data.user_id;
        self.video_id = data.video_id;
        self.watched_on = data.watched_on;
    }
}

export default WatchedVideo;
