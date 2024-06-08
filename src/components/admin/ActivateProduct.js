import Swal from 'sweetalert2';

function ActivateProduct(productId, updateProducts) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.activatedProduct) {
            // Update the UI to reflect the changes
            updateProducts(productId, { isActive: true });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product activated successfully!',
            });
        } else if (data.error === 'Product not found') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Product not found.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
            });
        }
    })
    .catch(error => {
        console.error('Error activating product:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again later.',
        });
    });
}

export default ActivateProduct;
