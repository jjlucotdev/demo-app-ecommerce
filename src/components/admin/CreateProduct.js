import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function CreateProduct() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
    });
    const [image, setImage] = useState(null);


    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch the categories from the endpoint
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/get-all-category`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                if (data.categories) {
                    console.log(data.categories);
                    setCategories(data.categories);
                } else {
                    Swal.fire({
                        title: "No categories found",
                        icon: 'error',
                        text: "No categories found"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: "Please try again."
                });
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!image) return; // Check if image exists

        const formData = new FormData(); // Use formData instead of formAddData

        formData.append('file', image);
        formData.append('upload_preset', 'guppyparadaisu');

        const response = await fetch(`https://api.cloudinary.com/v1_1/dgmdxa6y5/image/upload`, {
            method: 'POST',
            body: formData, // Use formData instead of formAddData
        });

        const data = await response.json();
        let fullUrl = data.secure_url;
        let extractedPart = fullUrl.split("upload/")[1];

        return extractedPart;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const imageUrl = await uploadImage(); // Remove the imageUrl variable declaration

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    categoryId: formData.categoryId,
                    productImage: imageUrl
                }),
            });
            const data = await response.json();

            if (data.newProduct) {
                console.log('Product created successfully');
                setFormData({
                    name: '',
                    description: '',
                    categoryId: '',
                    price: '',
                    image: null
                });
                setImage(null);
                Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product Added Successfully!',
                });
            } else if (data.error === "Product already exist") {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Product already exist',
                });
            } else {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while adding the product.',
            });
        }
    };

    return (
        <Form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <h1>Admin Dashboard</h1>
            <h3 style={{ marginBottom: '20px' }}>Add Product</h3>

            <Row className="align-items-center">
                <div xs="auto">
                    <Form.Group controlId="formProductName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter product name"
                        />
                    </Form.Group>
                </div>

                <div xs="auto">
                    <Form.Group controlId="formProductDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter product description"
                        />
                    </Form.Group>
                </div>

                <div xs="auto">
                    <Form.Group controlId="formProductCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>

                <div xs="auto">
                    <Form.Group controlId="formProductPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder="Enter product price"
                        />
                    </Form.Group>
                </div>

                <div xs="auto">
                    <Form.Group controlId="formProductImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            value={formData.productImage}
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                        />
                    </Form.Group>
                </div>

                <div xs="auto">
                    <Button variant="primary" type="submit" className="mt-3">
                        Add Product
                    </Button>
                </div>
            </Row>


            {/* Image Preview */}
            <Row>
                <Col lg={6} className="mt-3">
                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Product Preview"
                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                    )}
                </Col>
            </Row>
        </Form>
    );
}
