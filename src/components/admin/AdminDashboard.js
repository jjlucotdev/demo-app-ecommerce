import React, { useState } from 'react';
import ProductTable from './ProductTable';
import Pagination from './Pagination';
import './AdminDashboard.css';



const AdminDashboard = ({ productsData }) => {
  // Assuming productsData is an array of product objects
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page

  // Calculate indexes for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsData.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ProductTable products={currentProducts} />
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={productsData.length}
        paginate={paginate}
      />
    </div>
  );
};

export default AdminDashboard;
