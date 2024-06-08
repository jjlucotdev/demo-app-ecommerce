import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../UserContext';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

export default function AppNavbar({ handleShowLogin }) {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className="bg-light fixed-top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">GuppyParadaisu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
                        {user.isAdmin ? (
                            <Nav.Link as={NavLink} to="/products" exact="true">Admin Dashboard</Nav.Link>
                        ) : (
                            <Nav.Link as={NavLink} to="/products" exact>Shop</Nav.Link>
                        )}
                        {user.id !== null ? (
                            user.isAdmin ? (
                                <>
                                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/cart">
                                        <FaShoppingCart size="1.5em" className="me-1" /> {/* Adjust size as needed */}
                                    </Nav.Link>
                                    <Dropdown align="end">
                                        <Dropdown.Toggle as={Nav.Link}>
                                            <FaUserCircle size="1.5em" className="me-1" /> {/* Adjust size as needed */}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/orders-history">Order History</Dropdown.Item>
                                            <hr></hr>
                                            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                        )) : (
                            <>
                                <Nav.Link variant="primary" onClick={handleShowLogin}>
                                    Login
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}



    
  