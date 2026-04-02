// api.js - Central wrapper for fetch requests

const API_BASE_URL = '/api';

class Api {
    static getToken() {
        return sessionStorage.getItem('token');
    }

    static getUser() {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.logout();
                throw new Error('Unauthorized');
            }

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'API Request Failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Global UI Toast Notifications
window.showToast = function(message, type = 'success') {
    const existing = document.getElementById('global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'global-toast';
    const bgColor = type === 'success' ? 'bg-green-600' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    const iconClass = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    
    toast.className = `fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center z-[100] transform transition-all duration-300 translate-y-10 opacity-0`;
    toast.innerHTML = `<i class="fa-solid ${iconClass} text-xl mr-3"></i><span class="font-medium">${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};
