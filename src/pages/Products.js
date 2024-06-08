import { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserDashboard from '../components/users/UserDashboard';
import Swal from 'sweetalert2';

function AdminProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.products) {
                    setProducts(data.products);
                } else if (data.error === 'No products found.') {
                    Swal.fire({
                        title: "No result found",
                        icon: 'error',
                        text: "No result"
                    });
                } else {
                    Swal.fire({
                        title: "Something went wrong",
                        icon: "error",
                        text: "Please try again."
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [products]);

    return <AdminDashboard productsData={products} />;
}

function UserProducts({ handleShowLogin }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);
                const data = await response.json();
                setProducts(data.activeProducts);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    return <UserDashboard handleShowLogin={handleShowLogin} productsData={products} />;
}

export default function Products({ handleShowLogin }) {
    const { user } = useContext(UserContext);

    return (
        <>
            {user?.isAdmin ? (
                <AdminProducts />
            ) : (
                <UserProducts handleShowLogin={handleShowLogin} />
            )}
        </>
    );
}
