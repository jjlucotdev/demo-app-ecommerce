import React, { useState } from 'react';

const ProductSearch = ({ onSearchByName, onSearchByPrice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name');

  const handleSearch = () => {
    if (searchCriteria === 'name') {
      onSearchByName(searchTerm);
    } else {
      onSearchByPrice(minPrice, maxPrice);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <h3>Product Search</h3>
      <div>
        <input
          type="radio"
          id="searchByName"
          name="searchCriteria"
          value="name"
          checked={searchCriteria === 'name'}
          onChange={() => setSearchCriteria('name')}
        />
        <label htmlFor="searchByName">Search by Name</label>

        <input
          type="radio"
          id="searchByPrice"
          name="searchCriteria"
          value="price"
          checked={searchCriteria === 'price'}
          onChange={() => setSearchCriteria('price')}
        />
        <label htmlFor="searchByPrice">Search by Price</label>
      </div>

      {searchCriteria === 'name' ? (
        <input
          type="text"
          placeholder="Search product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <div>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      )}
      <button className="btn btn-primary" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default ProductSearch;
