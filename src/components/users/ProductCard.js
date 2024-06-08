import { Card, Button, ListGroup, ProgressBar } from 'react-bootstrap';
import { useState, useContext } from 'react';
import UserContext from '../../UserContext';
import ProductDetails from './ProductDetails';
import Login from '../../pages/Login';

export default function ProductCard({ product, handleShowLogin }) {
    const { user } = useContext(UserContext);
    const { _id, name, description, price, productImage, reviews } = product;

    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const truncateText = (text, limit) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...';
        }
        return text;
    };

    const handleShowModal = () => {
        if (user.id) {
            setShowModal(true);
        } else {
            handleShowLogin();
        }
    };

    const handleCloseModal = () => setShowModal(false);

    let totalRating = 0;
    reviews?.forEach(review => {
        totalRating += review.rating;
    });
    const averageRating = reviews?.length > 0 ? totalRating / reviews.length : 0;

    const productsSold = reviews?.length || 0;

    const recentRemark = reviews?.length > 0 ? reviews[reviews.length - 1].remarks : "No remarks yet";

    return (
        <>
            <Card className='w-100 h-100'>
                <Card.Img variant="top" src={`https://res.cloudinary.com/dgmdxa6y5/image/upload/${productImage}` || 'https://res.cloudinary.com/dgmdxa6y5/image/upload/v1716470796/products/662f78c801047e4064572fa5.png'} alt={name} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title className="fw-bold text-uppercase">{name}</Card.Title>
                    <hr></hr>
                    <Card.Subtitle>Description:</Card.Subtitle>
                    <Card.Text>
                        {isExpanded ? description : truncateText(description, 100)}
                        {description.length > 100 && (
                            <Button className='p-0' variant="link" onClick={toggleDescription}>
                                {isExpanded ? 'See less' : 'See more'}
                            </Button>
                        )}
                    </Card.Text>
                    <Card.Subtitle>
                        Price: <strong>₱{ parseFloat(price).toFixed(2) }</strong>
                    </Card.Subtitle>
                    <Button className="btn btn-primary mt-2 w-100" onClick={handleShowModal}>
                        Details
                    </Button>
                </Card.Body>
                <Card.Footer>
                    <Card.Subtitle>Reviews:</Card.Subtitle>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>Rating:</strong>
                            <ProgressBar now={reviews?.length > 0 ? (averageRating / 5) * 100 : 0} label={`${averageRating.toFixed(1)} / 5`} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Products Sold:</strong> {productsSold}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Recent Remarks:</strong> {recentRemark}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Footer>
            </Card>
            {user.id ? (
                <ProductDetails show={showModal} handleClose={handleCloseModal} product={product} />
            ) : (
                <Login show={showModal} setShow={setShowModal} />
            )}
        </>
    );
}
