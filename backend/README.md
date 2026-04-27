# Study Garden Backend (Express.js)

## 🚀 Quick Start

### 1. Install Node.js
Download: https://nodejs.org/ (LTS version)

### 2. Setup Backend
```bash
# Run setup script
setup-backend.bat
```

### 3. Configure Database
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password_here
```

### 4. Start Server
```bash
# Run start script
start-backend.bat
```

Server will run at: `http://localhost:8000`

## 📁 Structure

```
backend/
├── server.js           # Main server
├── package.json        # Dependencies
├── .env               # Configuration
├── config/
│   └── database.js    # Database connection
└── routes/
    ├── auth.js        # Auth APIs
    ├── study.js       # Study session APIs
    ├── missions.js    # Mission APIs
    ├── shop.js        # Shop APIs
    └── quiz.js        # Quiz APIs
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check session

### Study
- `POST /api/study/start` - Start session
- `POST /api/study/end` - End session
- `GET /api/study/stats` - Get stats

### Missions
- `GET /api/missions/list` - Get missions
- `GET /api/missions/progress` - Get progress

### Shop
- `GET /api/shop/items` - Get items
- `GET /api/shop/inventory` - Get inventory
- `POST /api/shop/purchase` - Purchase item

### Quiz
- `POST /api/quiz/create` - Create quiz
- `POST /api/quiz/submit` - Submit quiz
- `GET /api/quiz/list` - Get quizzes

## ✅ Done!
