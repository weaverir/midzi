import axios from 'axios';

const baseURL = 'https://midzi.liara.run';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Authorization header to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh token logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Avoid infinite retry loop

            try {
                // Refresh the token
                const refreshToken = localStorage.getItem('refresh');
                const response = await axios.post(`${baseURL}/accounts/api/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Save the new access token
                localStorage.setItem('access', access);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out the user (or handle as needed)
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Redirect to login or show an error
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;