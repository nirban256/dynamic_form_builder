import Form from '../models/Form.js';
import User from '../models/User.js';
import airtableAPI from '../utils/airtableAPI.js';

const createForm = async (req, res) => {
    try {
        const { title, airtableBaseId, airtableTableId, questions } = req.body;
        const newForm = new Form({
            user: req.user_id,
            title: title,
            airtableBaseId: airtableBaseId,
            airtableTableId: airtableTableId,
            questions: questions,
        });
        await newForm.save();
        res.status(201).json(newForm);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create form' });
    }
};

const getForms = async (req, res) => {
    try {
        const forms = await Form.find({ user: req.user_id });
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch forms' });
    }
};


const getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: 'Form not found' });
    }
};

const submitForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        const user = await User.findById(form.user);
        const api = airtableAPI(user.accessToken);

        const fields = req.body;

        await api.post(`/${form.airtableBaseId}/${form.airtableTableId}`, {
            records: [{ fields }]
        });

        res.status(201).json({ message: 'Response saved to Airtable' });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to submit response' });
    }
};

export { createForm, getForms, getFormById, submitForm };