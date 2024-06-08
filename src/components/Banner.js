import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './OtherComponents.css';

export default function Banner({ data }) {
    console.log(data);
    const { title, content, destination, label } = data;

    return (
        <div className="banner">
            <Col className="text-center">
                <h1 className="banner-title">{content}</h1>
                <p className="banner-content"></p>
                <Link to={destination} className="transparent-button banner-link">{label}</Link>
            </Col>
        </div>
    );
}
