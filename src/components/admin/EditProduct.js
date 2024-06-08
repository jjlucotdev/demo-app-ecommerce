import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './ModalStyles.css';

function EditProduct({ product, onSave, onClose }) {
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setEditedProduct({ ...product });
        console.log(product);
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
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        const formData = new FormData();
        const fileExtension = imageFile.name.split('.').pop();
        // const fileName = `${product._id}`;

        console.log(product);

        formData.append('file', imageFile);
        formData.append('upload_preset', 'guppyparadaisu');
        // formData.append('public_id', fileName);

        const response = await fetch(`https://api.cloudinary.com/v1_1/dgmdxa6y5/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        let fullUrl = data.secure_url;
        let extractedPart = fullUrl.split("upload/")[1];
  
        return extractedPart;
    };

    const handleSubmit = async () => {
        let imageUrl = editedProduct.productImage;

        if (imageFile) {
            try {
                imageUrl = await uploadImage();
            } catch (error) {
                console.error('Error uploading image:', error);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error uploading image.',
                });
                return;
            }
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${editedProduct._id}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: editedProduct.name,
                description: editedProduct.description,
                price: editedProduct.price,
                quantity: editedProduct.quantity,
                category: editedProduct.category,
                productImage: imageUrl
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Product updated successfully') {
                Swal.fire({
                    title: 'Product updated successfully',
                    icon: 'success',
                    text: 'Product updated successfully',
                });
                onSave({ ...editedProduct, productImage: imageUrl });
            } else if (data.error === 'Product not found') {
                Swal.fire({
                    title: 'Product not found',
                    icon: 'error',
                    text: 'Product not found.',
                });
            }
        })
        .catch(error => console.error('Error updating product:', error));
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={editedProduct.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" as="textarea" rows={3} name="description" value={editedProduct.description} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formProductCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="categoryId"
                            value={editedProduct.categoryId}
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
                    <Form.Group controlId="formStockQty">
                        <Form.Label>Stock Qty</Form.Label>
                        <Form.Control type="number" name="quantity" value={editedProduct.quantity} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={editedProduct.price} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" name="imageFile" onChange={handleImageChange} />
                    </Form.Group>
                    <div>
                    <img className="object-fit" src={`https://res.cloudinary.com/dgmdxa6y5/image/upload/${product.productImage}`}/>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditProduct;
