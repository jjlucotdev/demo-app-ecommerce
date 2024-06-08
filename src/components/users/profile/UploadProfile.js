import { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2';

export default function UploadProfile({ details }) {
    const [profilePic, setProfilePic] = useState(details.userImage ? `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com${details.userImage}` : null);
    const fileInputRef = useRef(null);

    const handleProfilePicClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageUrl = await uploadImage(file);
                await updateUserImage(imageUrl);
                setProfilePic(URL.createObjectURL(file)); // Update the profile picture URL
            } catch (error) {
                console.error('Error uploading image:', error);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error uploading image.',
                });
            }
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'guppyparadaisu');

        const response = await fetch(`https://api.cloudinary.com/v1_1/dgmdxa6y5/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        const imageUrl = data.secure_url;
  
        return imageUrl;
    };

    const updateUserImage = async (imageUrl) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/upload-profilePic`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userImage: imageUrl
                })
            });

            const data = await response.json();
            if (data.message) {
                Swal.fire({
                    title: 'Profile Picture Updated',
                    icon: 'success',
                    text: data.message
                });
            } else {
                Swal.fire({
                    title: 'Update Failed',
                    icon: 'error',
                    text: data.error || 'Failed to update profile picture.'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Update Failed',
                icon: 'error',
                text: 'Failed to update profile picture. Please try again later.'
            });
            console.error('Error updating profile picture:', error);
        }
    };

    const capitalizedFirstName = details.firstName ? details.firstName.charAt(0).toUpperCase() + details.firstName.slice(1) : '';
    const capitalizedLastName = details.lastName ? details.lastName.charAt(0).toUpperCase() + details.lastName.slice(1) : '';

    return (
        <>
            <Card className="text-center w-100 mb-2">
                <Card.Img
                    variant="top"
                    src={details.userImage || './profile-icon.jpg'}
                    className="rounded-circle mx-auto d-block w-50 h-50 mt-3"
                    style={{ cursor: 'pointer',  objectFit: 'cover' }}
                    onClick={handleProfilePicClick}
                />
                <Card.Body>
                    <Card.Title>{capitalizedFirstName} {capitalizedLastName}</Card.Title>                 
                </Card.Body>
                <Form>
                    <Form.Group controlId="formImage">
                    <Form.Label></Form.Label>
                    <Form.Control type="file" name="imageFile" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                    </Form.Group>
                </Form>  
            </Card>
  
        </>
    );
}
