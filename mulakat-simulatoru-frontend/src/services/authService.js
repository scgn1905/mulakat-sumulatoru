const API_URL = 'http://localhost:5000/api';

// Kayıt Ol Servisi
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Kayıt işlemi başarısız.');
        return data;
    } catch (error) {
        throw error;
    }
};

// Giriş Yap Servisi
export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Giriş işlemi başarısız.');
        return data;
    } catch (error) {
        throw error;
    }
};