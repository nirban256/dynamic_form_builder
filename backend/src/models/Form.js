import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    operator: {
        type: String,
        enum: ['equals', 'not_equals'],
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    _id: false
});

const questionSchema = new mongoose.Schema({
    fieldId: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    options: [String],
    condition: conditionSchema
}, {
    _id: false
});

const formSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    airtableBaseId: {
        type: String,
        required: true
    },
    airtableTableId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Form'
    },
    questions: [questionSchema]
}, {
    timestamps: true
});

export default mongoose.model("Form", formSchema);