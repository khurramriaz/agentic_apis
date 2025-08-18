// httpClient.js
import axios from "axios";

class HttpClient {
  constructor(baseURL, options = {}) {
    this.client = axios.create({
      baseURL,
      timeout: options.timeout || 10000,
      headers: options.headers || { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage?.getItem("token") || "" },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (options.getToken) {
          const token = options.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data, // Always return only `data`
      (error) => {
        // Custom error handling
        if (error.response) {
          console.error("API Error:", error.response.status, error.response.data);
        } else {
          console.error("Network/Server Error:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Wrapper methods
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

module.exports.HttpClient = HttpClient;
