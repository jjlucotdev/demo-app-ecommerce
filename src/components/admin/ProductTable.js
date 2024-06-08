import React, { useState } from 'react';
import './ProductTable.css'; // Import CSS file for styling
import EditProduct from './EditProduct'; // Import EditProduct component
import { Button } from 'react-bootstrap';
import ActivateProduct from './ActivateProduct';
import ArchiveProduct from './ArchiveProduct';
import HighlightProduct from './HighlightProduct';
import RemoveHighlight from './RemoveHighlight';

const ProductTable = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateClick = product => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleArchive = productId => {
    ArchiveProduct(productId, updateProducts);
  };

  const handleActivate = productId => {
    ActivateProduct(productId, updateProducts);
  };

  const handleFeature = productId => {
    HighlightProduct(productId, updateProducts);
  };

  const handleDontFeature = productId => {
    RemoveHighlight(productId, updateProducts);
  };

  const updateProducts = (productId, updatedFields) => {
    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        return { ...product, ...updatedFields };
      }
      return product;
    });
    setSelectedProduct(null); // Clear selected product
  };

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th> {/* New header for action buttons */}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                {/* Action buttons */}
                <button className="btn bg-info" onClick={() => handleUpdateClick(product)}>Update</button>
                {product.isActive ? (
                  <Button className="btn bg-warning" onClick={() => handleArchive(product._id)}>
                    Archive
                  </Button>
                ) : (
                  <Button className="btn bg-success" onClick={() => handleActivate(product._id)}>
                    Activate
                  </Button>
                )}

                {product.isFeatured ? (
                  <Button className="btn bg-secondary" onClick={() => handleDontFeature(product._id)}>Deemphasize</Button>
                ) : (
                  <Button className="btn highlight-btn" onClick={() => handleFeature(product._id)}>Highlight</Button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditModal && (
        <EditProduct
          product={selectedProduct}
          onSave={() => {
            // Implement onSave logic if needed
            setShowEditModal(false);
          }}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;
