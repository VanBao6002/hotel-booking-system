const BASE_URL = "http://localhost:8080";

function apiClient(endpoint, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    })
    .then(response => {
        if(!response.ok) {
            return response.json()
                .then(errorData => {
                    throw {
                        status: response.status,
                        statusText: response.statusText,
                        data: errorData
                    };
                },
                () => {
                    throw {
                        status: response.status,
                        statusText: response.statusText,
                        data : null
                    };
                })
        }
        return response.json();
    })
    .catch(error => {
      throw error;
    });
}

export default apiClient;