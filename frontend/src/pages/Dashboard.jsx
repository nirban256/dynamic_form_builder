import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import FormCard from './FormCard.jsx';

const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await api.get('/forms');
                setForms(response.data);
            } catch (error) {
                console.error("Failed to fetch forms", error);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {loading ? (
                    <p className="text-center text-gray-500">Loading forms...</p>
                ) : (
                    <>
                        {forms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {forms.map(form => (
                                    <FormCard key={form._id} form={form} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-xl font-medium text-gray-700">No forms yet!</h2>
                                <p className="text-gray-500 mt-2">Click "Create New Form" to get started.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;