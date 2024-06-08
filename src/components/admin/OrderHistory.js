import React, { useState, useEffect } from 'react';
import { Table, Form, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import '../OtherComponents.css';
import './ModalStyles.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUsers(data.users);

        const userMapping = data.users.reduce((acc, user) => {
          acc[user._id] = `${user.firstName} ${user.lastName}`;
          return acc;
        }, {});
        setUserMap(userMapping);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter(order => 
      order._id.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  const handleModalClose = () => setSelectedOrder(null);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="text-center my-4">Order History</h2>
          <Form.Control
            type="text"
            placeholder="Search by Order Number or Status"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4"
          />
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer Name</th>
                <th>Products Ordered</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id || 'N/A'}</td>
                  <td>{userMap[order.userId] || 'N/A'}</td>
                  <td>
                    {Array.isArray(order.productsOrdered) ? (
                      order.productsOrdered.map(product => {
                        const foundProduct = products.find(p => p._id === product.productId);
                        return foundProduct ? foundProduct.name : 'N/A';
                      }).join(', ')
                    ) : 'N/A'}
                  </td>
                  <td>${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                  <td>{order.orderedOn ? new Date(order.orderedOn).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'N/A'}</td>
                  <td>{order.status || 'N/A'}</td>
                  <td>
                    <Button onClick={() => setSelectedOrder(order)}>View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <ul className="pagination">
            {Array.from({length: Math.ceil(filteredOrders.length / ordersPerPage)}, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <Button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</Button>
              </li>
            ))}
          </ul>

          <Modal show={!!selectedOrder} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedOrder && (
                <>
                  <p><strong>Order Number:</strong> {selectedOrder._id}</p>
                  <p><strong>Customer Name:</strong> {userMap[selectedOrder.userId] || 'N/A'}</p>
                  <p><strong>Products Ordered:</strong></p>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedOrder.productsOrdered) ? (
                        selectedOrder.productsOrdered.map((product, index) => (
                          <tr key={index}>
                            <td>
                              {products.find(p => p._id === product.productId)?.name || 'N/A'}
                            </td>
                            <td>{product.quantity}</td>
                            <td>${product.subtotal ? product.subtotal.toFixed(2) : '0.00'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No products ordered</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>                  
                  <p><strong>Total Amount:</strong> ${selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}</p>
                  <p><strong>Order Date:</strong> {selectedOrder.orderedOn ? new Date(selectedOrder.orderedOn).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderList;
