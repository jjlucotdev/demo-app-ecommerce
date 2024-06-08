import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faList, faUsers, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './AdminSidebar.css'; // Ensure you create a corresponding CSS file

const AdminSidebar = () => {
  return (
    <div className="sidebar">      
      <NavLink to="/create-product" activeClassName="active-link">
        <FontAwesomeIcon icon={faPlus} className="sidebar-icon" />
        <span className="sidebar-text">Add Product</span>
      </NavLink>
      <NavLink to="/products" activeClassName="active-link">
        <FontAwesomeIcon icon={faList} className="sidebar-icon" />
        <span className="sidebar-text">Product List</span>
      </NavLink>      
      <NavLink to="/order-history" activeClassName="active-link">
        <FontAwesomeIcon icon={faEdit} className="sidebar-icon" />
        <span className="sidebar-text">Order History</span>
      </NavLink>
      <NavLink to="/product-category" activeClassName="active-link">
        <FontAwesomeIcon icon={faChartBar} className="sidebar-icon" />
        <span className="sidebar-text">Category Management</span>
      </NavLink>      
      <NavLink to="/users-access" activeClassName="active-link">
        <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
        <span className="sidebar-text">Users Access</span>
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
