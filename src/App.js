import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppNavbar from './components/AppNavbar';
import AdminSidebar from './components/admin/AdminSidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import UserOrder from './pages/UserOrder';
import Logout from './pages/Logout';
import Error from './pages/Error';
import CreateProduct from './components/admin/CreateProduct';
import UsersAccess from './components/admin/UsersAccess';
import OrderHistory from './components/admin/OrderHistory';
import CategoryList from './components/admin/CategoryList';

import { UserProvider } from './UserContext';
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  useEffect(() => {
    // Add your logic here to check if the user is logged in
    // For example, you can check if user.id exists
  }, [user]);

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: null
    });
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar handleShowLogin={handleShowLogin} />
        <Container fluid>
          {user.isAdmin && <AdminSidebar />}
          <div className={`main-content ${!user.isAdmin ? 'no-sidebar' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products handleShowLogin={handleShowLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders-history" element={<UserOrder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              {user.isAdmin && (
                <>
                  <Route path="/create-product" element={<CreateProduct />} />
                  <Route path="/product-list" element={<Products />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/users-access" element={<UsersAccess />} />
                  <Route path="/product-category" element={<CategoryList />} />
                </>
              )}
              <Route path="*" element={<Error />} />              
            </Routes>
          </div>
        </Container>
        <Login show={showLogin} setShow={setShowLogin} openRegister={handleShowRegister} />
        <Register show={showRegister} handleClose={handleCloseRegister} handleShowLogin={handleShowLogin} />
      </Router>
    </UserProvider>
  );
}

export default App;
