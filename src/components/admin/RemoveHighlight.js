import Swal from 'sweetalert2';

function RemoveHiglight(productId, updateProducts) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/dontfeature`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.unfeaturedProduct) {
            // Update the UI to reflect the changes
            updateProducts(productId, { isFeatured: false });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product has been removed from Featured section.',
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
        console.error('Error removing highlight:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again later.',
        });
    });
}

export default RemoveHiglight;
