import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosConfig';
import { X, Phone, UserRound, Heart } from 'lucide-react';

const EmergencyContactForm = ({ onClose }) => {
    const [contacts, setContacts] = useState([
        { name: '', phone_number: '', relationship: '' },
        { name: '', phone_number: '', relationship: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [existingContacts, setExistingContacts] = useState([]);

    useEffect(() => {
        const fetchExistingContacts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axiosInstance.get(`/api/routes/profile/get-profile/${userId}`);
                console.log(response)
                if (response.data.ok && response.data.profile.emergency_contact) {
                    setExistingContacts(response.data.profile.emergency_contact);
                    setContacts(response.data.profile.emergency_contact);
                }
            } catch (err) {
                setError('Failed to fetch existing contacts');
            }
        };
        fetchExistingContacts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate all fields are filled
        const isValid = contacts.every(contact => 
            contact.name.trim() && contact.phone_number.trim() && contact.relationship.trim()
        );

        if (!isValid) {
            setError('Please fill in all fields for both emergency contacts');
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            
            const response = await axiosInstance.post(
                `/api/routes/profile/update-emergency-contacts/${userId}`,
                { emergency_contact: contacts }
            );

            if (response.data.ok) {
                onClose();
                window.location.reload(); // Refresh to show updated data
            } else {
                setError('Failed to update emergency contacts');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving emergency contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Emergency Contact Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {!isEditing && existingContacts.length > 0 ? (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-700">Current Emergency Contacts</h3>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Edit Contacts
                            </button>
                        </div>
                        <div className="space-y-4">
                            {existingContacts.map((contact, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2">
                                            <UserRound size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="font-medium text-gray-800">{contact.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phone Number</p>
                                                <p className="font-medium text-gray-800">{contact.phone_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Relationship</p>
                                                <p className="font-medium text-gray-800">{contact.relationship}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {contacts.map((contact, index) => (
                            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">
                                    Emergency Contact {index + 1}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={contact.name}
                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={contact.phone_number}
                                            onChange={(e) => handleInputChange(index, 'phone_number', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Relationship
                                        </label>
                                        <input
                                            type="text"
                                            value={contact.relationship}
                                            onChange={(e) => handleInputChange(index, 'relationship', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter relationship"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => isEditing ? setIsEditing(false) : onClose()}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                {isEditing ? 'Cancel Edit' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Saving...' : 'Save Contacts'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EmergencyContactForm; 