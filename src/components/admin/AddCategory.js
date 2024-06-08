import React, { useState } from 'react';
import './ModalStyles.css';

const AddCategory = ({ onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setCategoryDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/add-category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: categoryName, description: categoryDescription }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess('Category added successfully!');
            setCategoryName('');
            setCategoryDescription('');

            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(`Error adding category: ${err.message}`);
        }
    };

    return (
        <div className="add-category-container"> {/* Added responsive container */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categoryDescription">Category Description:</label>
                    <textarea
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={handleDescriptionChange}
                        required
                    />
                </div>
                <button type="submit">Add</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </div>
    );
};

export default AddCategory;
