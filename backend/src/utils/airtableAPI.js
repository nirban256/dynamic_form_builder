import axios from 'axios';

const airtableAPI = (token) => axios.create({
    baseURL: 'https://api.airtable.com/v0',
    headers: {
        Authorization: `Bearer ${token}`,
    }
});

export default airtableAPI;