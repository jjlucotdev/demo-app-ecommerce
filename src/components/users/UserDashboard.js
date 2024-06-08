import { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Form, ListGroup, Dropdown, Card, Collapse, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import ProductCard from './ProductCard';
import Footer from '../Footer';

const ITEMS_PER_PAGE = 9;

export default function UserDashboard({ handleShowLogin, productsData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('name');
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openCategories, setOpenCategories] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/get-all-category`);
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                const updatedCategories = data.categories.map(category => ({ ...category, selected: false }));
                setCategories(updatedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setFilteredProducts(data.activeProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts(productsData, searchQuery, searchOption);
    }, [searchQuery, searchOption, productsData]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchOptionChange = (option) => {
        setSearchOption(option);
    };

    const handleCategoryClick = async (categoryId) => {
    
        try {
            const id = categoryId
            let url;
            if (categoryId === 'all') {
                url = `${process.env.REACT_APP_API_BASE_URL}/products/active`;
            } else {
                url = `${process.env.REACT_APP_API_BASE_URL}/products/${categoryId}/filter-by-category`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
      
            if (data && data.products && data.products.length > 0) {
            
                setFilteredProducts(data.products);
            
                setCurrentPage(1);
                const updatedCategories = categories.map(category =>
                    category._id === categoryId ? { ...category, selected: true } : { ...category, selected: false }
                );
                setCategories(updatedCategories);
            } else if(data.activeProducts){

                setFilteredProducts(data.activeProducts);
              
                setCurrentPage(1);
                const updatedCategories = categories.map(category =>
                    category._id === categoryId ? { ...category, selected: true } : { ...category, selected: false }
                );
                setCategories(updatedCategories);
            } else {
                setFilteredProducts([]); 
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };    

    const filterProducts = (data, query, option) => {
        let filteredData = data;
        if (query) {
            if (option === 'name') {
                filteredData = data.filter(product =>
                    product.name.toLowerCase().includes(query.toLowerCase())
                );
            } else if (option === 'price') {
                const priceParts = query.split('-');
                const min = priceParts[0] ? parseFloat(priceParts[0]) : null;
                const max = priceParts[1] ? parseFloat(priceParts[1]) : null;
                if (min !== null && max !== null) {
                    filteredData = data.filter(product => {
                        const price = parseFloat(product.price);
                        return price >= min && price <= max;
                    });
                } else if (min !== null) {
                    filteredData = data.filter(product => parseFloat(product.price) === min);
                }
            }
        }
        setFilteredProducts(filteredData);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    return (
        <Container fluid>
            <Row className='mb-2'>
                <Col sm={12} md={2}>
                    {isMobile ? (
                        <>
                            <Button
                                onClick={() => setOpenCategories(!openCategories)}
                                aria-controls="category-collapse"
                                aria-expanded={openCategories}
                                className="mb-2 my-sm-2  my-md-0 w-100 bg-success"
                            >
                                Filter by Categories
                            </Button>
                            <Collapse in={openCategories}>
                                <div id="category-collapse">
                                    <Card className="w-100">
                                        <Card.Header className="fw-bold text-uppercase">Categories</Card.Header>
                                        <ListGroup>
                                            <ListGroup.Item key="all" action onClick={() => handleCategoryClick('all')} className={categories.find(category => category.selected) ? '' : 'bg-success'}>
                                                All
                                            </ListGroup.Item>
                                            {categories.map(category => (
                                                <ListGroup.Item
                                                    key={category._id}
                                                    action
                                                    onClick={() => handleCategoryClick(category._id)}
                                                    className={category.selected ? 'bg-success' : ''}
                                                >
                                                    {category.name}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card>
                                </div>
                            </Collapse>
                        </>
                    ) : (
                        <Card className="w-100">
                            <Card.Header className="fw-bold text-uppercase">Categories</Card.Header>
                            <ListGroup>
                                <ListGroup.Item key="all" action onClick={() => handleCategoryClick('all')} className={categories.find(category => category.selected) ? '' : 'bg-success'}>
                                    All
                                </ListGroup.Item>
                                {categories.map(category => (
                                    <ListGroup.Item
                                        key={category._id}
                                        action
                                        onClick={() => handleCategoryClick(category._id)}
                                        className={category.selected ? 'bg-success' : ''}
                                    >
                                        {category.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}
                </Col>
                <Col sm={12} md={10}>
                    <Row className="align-items-center mb-4">
                        <Col xs={8} md={10}>
                            <Form.Control
                                type="text"
                                placeholder={searchOption === 'name' ? "Search products by name or product description..." : "Search products by price (e.g., 100-500 or 100)"}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="my-sm-2 my-md-0 me-sm-2 text-sm-small"
                            />
                        </Col>
                        <Col xs={4} md={2}>
                            <Dropdown className="my-sm-2 my-md-0">
                                <Dropdown.Toggle variant="primary" className="w-100 text-uppercase text-sm-small" id="searchOptionDropdown">
                                    Search By: {searchOption}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSearchOptionChange('name')}>Name</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSearchOptionChange('price')}>Price</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        {(filteredProducts && filteredProducts.length > 0) ? (
                            getPaginatedData().map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
                                    <ProductCard handleShowLogin={handleShowLogin} product={product} />
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <Container fluid>
                                    <p className='text-center'>No products available</p>
                                </Container>
                            </Col>
                        )}
                    </Row>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map((pageNumber) => (
                            <Pagination.Item key={pageNumber + 1} active={pageNumber + 1 === currentPage} onClick={() => handlePageChange(pageNumber + 1)}>
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}
