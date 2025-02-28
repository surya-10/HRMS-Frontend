export const isTokenExpired = (token) => {
    if (!token) {
        console.log('No token found');
        return true;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (exp < currentTime) {
            console.log('Token has expired');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

export const handleLogout = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('http://localhost:3002/api/routes/user/logout', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error calling logout API:', error);
            }
        }
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        localStorage.clear();
        window.location.href = '/login';
    }
}; 