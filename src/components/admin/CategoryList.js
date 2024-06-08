import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory';
import './CategoryList.css'; // Import the CSS file for table styles

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // To store the selected category for update
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/get-all-category`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setCategories(data.categories);
            } catch (err) {
                setError("Error fetching categories.");
                console.error("Error fetching categories: ", err);
            }
        };

        fetchCategories();
    }, [modalIsOpen]); // Fetch categories whenever modalIsOpen changes

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const openAddModal = () => {
        setModalIsOpen(true);
    };

    const openUpdateModal = (category) => {
        setSelectedCategory(category);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setModalIsOpen(false);
    };

    // Logic for displaying current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCategories.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
        <li
            key={number}
            id={number}
            onClick={handleClick}
            className={currentPage === number ? 'active' : null}
        >
            {number}
        </li>
    ));

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className='text-center'>Admin Dashboard</h1>
            <h2>Product Categories</h2>
            <Button onClick={openAddModal}>Add Category</Button>
            <div className="search-box"> {/* Search box */}
                <input
                    type="text"
                    placeholder="Search by category name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>            

            <table className="category-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th> {/* Added a new column for Actions */}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Button onClick={() => openUpdateModal(category)}>Update</Button>
                            </td> {/* Added Update button for each row */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>

            <Modal show={modalIsOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCategory ? 'Update Category' : 'Add New Category'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCategory ? (
                        <UpdateCategory category={selectedCategory} onClose={() => { closeModal(); }} />
                    ) : (
                        <AddCategory onClose={() => { closeModal(); }} />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CategoryList;
