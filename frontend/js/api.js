// API Client for Study Garden

const API_BASE_URL = 'http://localhost:8000/api'; // Thay đổi khi deploy

class API {
    // ============================================
    // AUTH APIs
    // ============================================
    
    static async register(email, password, fullName) {
        return await this.post('/auth/register', {
            email,
            password,
            fullName
        });
    }
    
    static async login(email, password) {
        return await this.post('/auth/login', {
            email,
            password
        });
    }
    
    static async logout() {
        return await this.post('/auth/logout');
    }
    
    static async checkSession() {
        return await this.get('/auth/check');
    }
    
    // ============================================
    // STUDY SESSION APIs
    // ============================================
    
    static async startStudySession(sessionType, musicType, timerMode, targetMinutes) {
        return await this.post('/study/start', {
            sessionType,
            musicType,
            timerMode,
            targetMinutes
        });
    }
    
    static async endStudySession(sessionId, durationMinutes, sessionType) {
        return await this.post('/study/end', {
            sessionId,
            durationMinutes,
            sessionType
        });
    }
    
    static async getStudyStats() {
        return await this.get('/study/stats');
    }
    
    // ============================================
    // MISSIONS APIs
    // ============================================
    
    static async getMissions() {
        return await this.get('/missions/list');
    }
    
    static async getMissionProgress() {
        return await this.get('/missions/progress');
    }
    
    static async updateMissionProgress(missionCode, progressIncrement) {
        return await this.post('/missions/update', {
            missionCode,
            progressIncrement
        });
    }
    
    // ============================================
    // SHOP APIs
    // ============================================
    
    static async getShopItems() {
        return await this.get('/shop/items');
    }
    
    static async getUserInventory() {
        return await this.get('/shop/inventory');
    }
    
    static async purchaseItem(itemId, quantity = 1) {
        return await this.post('/shop/purchase', {
            itemId,
            quantity
        });
    }
    
    // ============================================
    // QUIZ APIs
    // ============================================
    
    static async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        return await this.postFormData('/quiz/upload', formData);
    }
    
    static async createQuiz(fileId, difficulty, totalQuestions, timeLimit) {
        return await this.post('/quiz/create', {
            fileId,
            difficulty,
            totalQuestions,
            timeLimit
        });
    }
    
    static async submitQuiz(quizId, score, correctAnswers, wrongAnswers) {
        return await this.post('/quiz/submit', {
            quizId,
            score,
            correctAnswers,
            wrongAnswers
        });
    }
    
    static async getUserQuizzes() {
        return await this.get('/quiz/list');
    }
    
    // ============================================
    // HTTP Methods
    // ============================================
    
    static async get(endpoint) {
        try {
            const response = await fetch(API_BASE_URL + endpoint, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    static async post(endpoint, data) {
        try {
            const response = await fetch(API_BASE_URL + endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    static async postFormData(endpoint, formData) {
        try {
            const response = await fetch(API_BASE_URL + endpoint, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('API POST FormData Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export
window.API = API;
