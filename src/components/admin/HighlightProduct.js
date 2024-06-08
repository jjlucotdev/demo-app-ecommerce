import Swal from 'sweetalert2';

function HighlightProduct(productId, updateProducts) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/feature`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.featuredProduct) {
            // Update the UI to reflect the changes
            updateProducts(productId, { isFeatured: true });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product has been posted to Featured section.',
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
        console.error('Error highlighting product:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again later.',
        });
    });
}

export default HighlightProduct;
