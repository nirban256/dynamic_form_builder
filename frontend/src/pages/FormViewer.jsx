import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api.js'; // Ensure this path is correct

const FormViewer = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [submissionState, setSubmissionState] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await api.get(`/forms/${id}`);
                setForm(response.data);
            } catch (err) {
                console.error("Failed to fetch form", err);
                setError("Could not find this form. The link may be broken.");
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    // FIXED: Updated handleChange to handle both single and multi-select
    const handleChange = (fieldId, e) => {
        const { options, value, type } = e.target;
        if (type === 'select-multiple') {
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData(prev => ({ ...prev, [fieldId]: selectedValues }));
        } else {
            setFormData(prev => ({ ...prev, [fieldId]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionState('submitting');
        setError('');
        try {
            await api.post(`/forms/${id}/responses`, formData);
            setSubmissionState('success');
        } catch (err) {
            console.error("Failed to submit form", err);
            setError('There was an error submitting your response. Please try again.');
            setSubmissionState('error');
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading form...</div>;
    }

    if (error && submissionState !== 'error') {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (submissionState === 'success') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Thank You!</h2>
                    <p className="mt-2 text-gray-600">Your response has been submitted successfully.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">{form.title}</h1>
                <form onSubmit={handleSubmit}>
                    {form.questions.map(q => (
                        <div key={q.fieldId} className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{q.label}</label>
                            {q.type === 'multilineText' ? (
                                <textarea onChange={(e) => handleChange(q.fieldId, e)} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" rows="4" required></textarea>
                            ) : q.type === 'singleSelect' || q.type === 'multipleSelects' ? (
                                // FIXED: Added 'multiple' attribute for multi-select fields
                                <select multiple={q.type === 'multipleSelects'} onChange={(e) => handleChange(q.fieldId, e)} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                                    {q.type === 'singleSelect' && <option value="">-- Select an option --</option>}
                                    {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : q.type === 'multipleAttachments' ? (
                                <input type="file" onChange={(e) => handleChange(q.fieldId, e)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            ) : (
                                <input type="text" onChange={(e) => handleChange(q.fieldId, e)} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={submissionState === 'submitting'}
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    >
                        {submissionState === 'submitting' && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {submissionState === 'submitting' ? 'Submitting...' : 'Submit Response'}
                    </button>
                    {submissionState === 'error' && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default FormViewer;