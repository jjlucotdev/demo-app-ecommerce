import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const UpdateCategory = ({ category, onClose }) => {
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${category._id}/update-category`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you have a token stored in localStorage
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess('Category updated successfully!');
            onClose(); // Close the modal after successful update
        } catch (err) {
            setError(`Error updating category: ${err.message}`);
        }
    };

    return (
        <div>
            <h2>Update Category</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCategoryName">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formCategoryDescription">
                    <Form.Label>Category Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter category description"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Category
                </Button>
            </Form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </div>
    );
};

export default UpdateCategory;
