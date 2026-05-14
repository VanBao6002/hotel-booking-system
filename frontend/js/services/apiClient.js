const BASE_URL = "http://localhost:8080";

function buildHeaders(options = {}){
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    if(!options.skipAuth && token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

function apiClient(endpoint, options = {}) {
    return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: buildHeaders(options)
    })
    .then(async response => {
        const contentType = response.headers.get("content-type") || "";
        const parseBody = async () => {
            if (response.status === 204) return null;
            if (contentType.includes("application/json")) return response.json();
            const text = await response.text();
            return text ? { message: text } : null;
        };

        if(!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                data: await parseBody()
            };
        }

        return parseBody();
    })
    .catch(error => {
      throw error;
    });
}

export default apiClient;
