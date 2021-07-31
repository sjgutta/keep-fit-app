import BaseModel from "../models/base";

class SavedExercise extends BaseModel {
    static collection_name = "saved_exercises"

    constructor (data) {
        // initialize base model with firebase collection name        
        self.id = data.id
        self.user_id = data.user_id
        self.calories_burned = data.calories_burned
        self.category = data.category
        self.muscle_group = data.muscle_group
        self.secondary_muscle_group = data.secondary_muscle_group
        self.completed_on = data.completed_on
    }
}

export default SavedExercise;
