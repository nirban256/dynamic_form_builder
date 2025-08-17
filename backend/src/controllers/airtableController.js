import User from '../models/User.js';
import airtableAPI from '../utils/airtableAPI.js';

const getBases = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);
        const api = airtableAPI(user.accessToken);
        const response = await api.get('/meta/bases');
        res.json(response.data.bases);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bases' });
    }
};

const getTables = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);
        const api = airtableAPI(user.accessToken);

        const { baseId } = req.params;
        const response = await api.get(`/meta/bases/${baseId}/tables`);
        res.json(response.data.tables);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tables' });
    }
};

export { getBases, getTables };