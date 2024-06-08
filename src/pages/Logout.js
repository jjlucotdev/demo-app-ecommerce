import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Logout() {
    const { unsetUser, setUser } = useContext(UserContext);
    const [isSwalShown, setIsSwalShown] = useState(false);

    useEffect(() => {
        if (!isSwalShown) {
            Swal.fire({
                title: 'Are you sure you want to leave?',
                text: 'Hope to see you soon again!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout'
            }).then((result) => {
                if (result.isConfirmed) {
                    unsetUser();
                    setUser({
                        id: null,
                        isAdmin: null
                    });
                    localStorage.removeItem('token');
                    window.location.href = '/';
                } else {
                    window.history.back();
                }
            });
            setIsSwalShown(true);
        }
    }, [isSwalShown, unsetUser, setUser]);

    return null;
}
