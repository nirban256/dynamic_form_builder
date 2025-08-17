import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

// A constant to define which Airtable field types your app supports
const SUPPORTED_FIELD_TYPES = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];

const FormBuilder = () => {
    const navigate = useNavigate();

    // State for data fetched from Airtable
    const [bases, setBases] = useState([]);
    const [tables, setTables] = useState([]);
    const [fields, setFields] = useState([]);

    // State for user selections
    const [selectedBase, setSelectedBase] = useState('');
    const [selectedTable, setSelectedTable] = useState('');

    // State for the form being built
    const [formTitle, setFormTitle] = useState('My New Form');
    const [formQuestions, setFormQuestions] = useState([]);

    // State for loading and errors to improve UX
    const [loading, setLoading] = useState({ bases: false, tables: false });
    const [error, setError] = useState('');

    // 1. Fetch bases on component mount
    useEffect(() => {
        const fetchBases = async () => {
            setLoading(prev => ({ ...prev, bases: true }));
            setError('');
            try {
                const res = await api.get('/airtable/bases');
                setBases(res.data);
            } catch (err) {
                console.error("Failed to fetch bases:", err);
                setError('Could not load your Airtable bases. Please try again.');
            } finally {
                setLoading(prev => ({ ...prev, bases: false }));
            }
        };
        fetchBases();
    }, []);

    // 2. Fetch tables when a base is selected
    const handleBaseSelect = async (baseId) => {
        setSelectedBase(baseId);
        setTables([]);
        setFields([]);
        setFormQuestions([]);
        setSelectedTable('');

        if (!baseId) return;

        setLoading(prev => ({ ...prev, tables: true }));
        setError('');
        try {
            const res = await api.get(`/airtable/bases/${baseId}/tables`);
            setTables(res.data);
        } catch (err) {
            console.error("Failed to fetch tables:", err);
            setError('Could not load tables for this base.');
        } finally {
            setLoading(prev => ({ ...prev, tables: false }));
        }
    };

    // 3. Set fields when a table is selected
    const handleTableSelect = (tableId) => {
        setSelectedTable(tableId);
        const selectedTableData = tables.find(t => t.id === tableId);
        const availableFields = selectedTableData?.fields.filter(field => SUPPORTED_FIELD_TYPES.includes(field.type)) || [];
        setFields(availableFields);
        setFormQuestions([]);
    };

    // 4. Add a field as a question to the form
    const addQuestion = (field) => {
        if (formQuestions.find(q => q.fieldId === field.id)) return;

        const newQuestion = {
            fieldId: field.id,
            label: field.name,
            type: field.type,
            options: field.options?.choices?.map(c => c.name) || [],
        };
        setFormQuestions([...formQuestions, newQuestion]);
    };

    // 5. Save the final form configuration to your database
    const handleSaveForm = async () => {
        if (!selectedBase || !selectedTable || formQuestions.length === 0) {
            alert("Please select a base, table, and add at least one question.");
            return;
        }

        const payload = {
            title: formTitle,
            airtableBaseId: selectedBase,
            airtableTableId: selectedTable,
            questions: formQuestions,
        };

        try {
            const res = await api.post('/forms', payload);
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to save form:", err);
            setError('An error occurred while saving the form. Check the backend console for details.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Panel: Configuration */}
            <div className="w-1/3 bg-white p-6 overflow-y-auto border-r">
                <h2 className="text-xl font-bold mb-6">Form Builder</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">1. Select a Base</label>
                    <select disabled={loading.bases} onChange={(e) => handleBaseSelect(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm">
                        <option value="">{loading.bases ? "Loading..." : "-- Select Base --"}</option>
                        {bases.map(base => <option key={base.id} value={base.id}>{base.name}</option>)}
                    </select>
                </div>

                {selectedBase && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">2. Select a Table</label>
                        <select disabled={loading.tables} onChange={(e) => handleTableSelect(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm">
                            <option value="">{loading.tables ? "Loading..." : "-- Select Table --"}</option>
                            {tables.map(table => <option key={table.id} value={table.id}>{table.name}</option>)}
                        </select>
                    </div>
                )}

                {selectedTable && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2 text-gray-800">3. Add Questions from Fields</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-md">
                            {fields.map(field => (
                                <button key={field.id} onClick={() => addQuestion(field)} className="w-full text-left p-2 bg-white hover:bg-gray-200 rounded-md text-sm border">
                                    + {field.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={handleSaveForm} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer">
                    Save Form
                </button>
            </div>

            <div className="w-2/3 p-8 overflow-y-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="text-3xl font-bold mb-8 w-full border-b-2 pb-2 focus:outline-none focus:border-blue-500"
                    />
                    {formQuestions.length > 0 ? (
                        formQuestions.map((q, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{q.label}</label>
                                {q.type === 'multilineText' ? (
                                    <textarea className="w-full p-2 border rounded-md bg-gray-50" rows="3" readOnly></textarea>
                                ) : q.type === 'singleSelect' ? (
                                    <select className="w-full p-2 border rounded-md bg-gray-50">
                                        {q.options.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" className="w-full p-2 border rounded-md bg-gray-50" readOnly />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-md">
                            <p className="text-gray-500">Select a base and table to start adding questions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;