import BaseModel from '../models/base';

class Livestream extends BaseModel {
    static collection_name = 'livestream';

    constructor(data) {
        super(data);
        // initialize base model with firebase collection name
        self.id = data.id;
        self.user_id = data.user_id;
        self.video_link = data.video_link;
        self.title = data.title;
        self.description = data.description;
        self.max_limit = data.max_limit;
        self.category = data.category;
        self.muscle_group = data.muscle_group;
        self.secondary_muscle_group = data.secondary_muscle_group;
        self.created_on = data.created_on;
        self.num_participants = data.num_participants;
    }
}

export default Livestream;
