import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Pagination, Form } from 'react-bootstrap';

const UserAccess = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
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
        const nonAdminUsers = data.users.filter(user => !user.isAdmin);
        setUsers(nonAdminUsers);
        setFilteredUsers(nonAdminUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const grantAdminAccess = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/grant-admin`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error granting admin access:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchEmail(term);
    setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(term)));
    setCurrentPage(1);  // Reset to the first page on a new search
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="text-center my-4">User Access Management</h2>
          <Form.Control
            type="text"
            placeholder="Search by Email"
            value={searchEmail}
            onChange={handleSearch}
            className="mb-4"
          />
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Picture</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user._id}>
                  <td><img src={user.userImage}/></td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button onClick={() => grantAdminAccess(user._id)}>Grant Admin Access</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAccess;
