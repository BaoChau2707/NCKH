# Study Garden 🍀

Ứng dụng học tập gamification giúp người dùng tập trung học tập và nhận thưởng.

## 🌐 Demo Live

**Website đã sẵn sàng deploy!**

Xem hướng dẫn:
- ⚡ **Quick Start** (5 phút): `QUICK-START.md`
- 📖 **Hướng dẫn chi tiết**: `HUONG-DAN-DEPLOY.md`
- 🌐 **Deployment Guide** (English): `DEPLOYMENT.md`

## ✨ Tính năng mới (v2.0)

🔐 **Authentication System**
- Đăng ký/Đăng nhập tài khoản
- Lưu tiến độ học tập
- Đồng bộ dữ liệu giữa các phiên

📄 **Upload File & Auto Quiz**
- Upload .txt, .pdf, .docx (tối đa 10MB)
- Tự động tạo câu hỏi từ văn bản
- Lưu lịch sử file đã upload

👉 **Xem chi tiết**: `AUTH-GUIDE.md`

## 📱 Responsive Design

✅ **Tự động điều chỉnh theo màn hình:**
- 📱 Mobile (< 480px)
- 📱 Tablet (481px - 1023px)
- 💻 Desktop (> 1024px)
- 🔄 Landscape mode

## 🚀 Deploy ngay (< 5 phút)

### Cách 1: Netlify (Dễ nhất)
```
1. Vào: https://app.netlify.com/drop
2. Kéo thả folder vào
3. XONG! 🎉
```

### Cách 2: GitHub Pages
```
1. Push code lên GitHub
2. Settings → Pages → Enable
3. Truy cập: username.github.io/study-garden
```

### Cách 3: Vercel
```
1. Import GitHub repo
2. Click Deploy
3. Truy cập: study-garden.vercel.app
```

## 🔥 Group Call Cross-Device (Quan trọng!)

**Vấn đề:** Link mời group study chỉ hoạt động trong cùng browser

**Giải pháp:** Setup Firebase Realtime Database (5 phút, miễn phí 100%)

### Quick Start Firebase

1. **Tạo project**: https://console.firebase.google.com/ → Add project
2. **Enable Database**: Realtime Database → Create → Test mode
3. **Lấy config**: Settings → Your apps → Web → Copy config
4. **Paste config**: Mở `index.html` → Uncomment Firebase scripts (dòng ~243) → Paste config
5. **Test**: Mở 2 devices → Bật camera → Invite → Tự động kết nối! ✅

### Hướng dẫn chi tiết

- 🎯 **Đơn giản nhất**: [`LINK-MOI-HOAT-DONG.md`](LINK-MOI-HOAT-DONG.md)
- 🚀 **Chi tiết**: [`SETUP-FIREBASE-NOW.md`](SETUP-FIREBASE-NOW.md)
- 📚 **Kỹ thuật**: [`FIREBASE-QUICK-START.md`](FIREBASE-QUICK-START.md)
- 🐛 **Gặp lỗi**: [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

### So sánh

| Tính năng | Không Firebase | Có Firebase |
|-----------|----------------|-------------|
| Link mời | ❌ Cùng browser | ✅ Mọi thiết bị |
| Số người | ❌ 1 người | ✅ 3 người |
| Chi phí | Miễn phí | **Miễn phí** |

---



```
study-garden/
├── index.html              # File HTML chính
├── README.md              # Hướng dẫn này
├── css/
│   └── styles.css        # Toàn bộ CSS styling
├── js/
│   ├── app.js            # Logic chính của ứng dụng
│   ├── auth.js           # 🆕 Hệ thống đăng nhập
│   ├── timer.js          # Quản lý timer học tập
│   ├── quiz.js           # Quản lý quiz/câu hỏi (+ upload file)
│   ├── missions.js       # Quản lý nhiệm vụ hàng ngày
│   ├── shop.js           # Quản lý cửa hàng
│   ├── group-study.js    # Quản lý Group Study (WebRTC)
│   └── utils.js          # Các hàm tiện ích
├── audio/                 # Thư mục chứa file âm thanh
│   ├── README.md         # Hướng dẫn về audio
│   └── ...               # File audio (cần thêm)
└── docs/                  # 🆕 Tài liệu
    ├── AUTH-GUIDE.md     # Hướng dẫn đăng nhập & upload
    ├── FEATURES.md       # Danh sách tính năng đầy đủ
    ├── CHANGELOG.md      # Lịch sử phiên bản
    └── ...
```

## Tính năng

### 1. Study Alone (📖 Study)
- **Timer học tập**: 
  - ⏱️ **Đếm lên**: Đếm thời gian học từ 0
  - ⏰ **Đếm ngược**: Đặt thời gian và đếm ngược
  - Preset: 15, 25, 30, 45, 60 phút
  - Tùy chỉnh: Giờ:Phút:Giây
  - Âm thanh thông báo khi hết giờ
- **Nhạc nền thật sự**: 
  - 🎵 Lo-fi Beats
  - 🌊 Rain & Nature
  - 🔔 Cafe Ambience
  - 🎹 Classical Piano
  - ❌ No Music
- **Điều chỉnh âm lượng**: Thanh trượt 0-100%
- **Tự động lưu**: Thời gian học được lưu tự động
- **Phần thưởng**: 
  - Học 15 phút → +10 lá cây
  - Học 30 phút → +20 lá cây

### 2. Group Study (👥 Group)
- **Tối đa 3 thành viên** (có thể mở rộng bằng cách mua slot)
- **Bật/tắt Mic và Camera**
- **Mời thành viên**: Sao chép link mời
- **Chia sẻ màn hình**
- **🔥 Cross-device support**: Cần setup Firebase (5 phút, miễn phí)
  - ❌ **Không có Firebase**: Link chỉ hoạt động trong cùng browser
  - ✅ **Có Firebase**: Link hoạt động mọi thiết bị (máy tính, điện thoại)
  - 👉 **Xem hướng dẫn**: `LINK-MOI-HOAT-DONG.md` hoặc `SETUP-FIREBASE-NOW.md`

### 3. Quiz (📝 Quiz)
- **Tùy chỉnh số câu hỏi**: 5-100 câu
- **Chọn thời gian**: 15, 30, hoặc 60 phút
- **Độ khó**: Dễ, Bình thường, Khó, Siêu khó
- **🆕 Upload tài liệu**: .txt, .pdf, .docx (tối đa 10MB)
- **🆕 Tự động tạo câu hỏi** từ văn bản (fill-in-the-blank)
- **🆕 Yêu cầu đăng nhập** để upload file
- **Phần thưởng động**: 5-20 lá tùy điểm số

### 4. Mission (🎯 Mission)
Nhiệm vụ hàng ngày (tối đa 100 lá/ngày):
- **Task 1**: Study alone 15 phút → +10 🍃
- **Task 2**: Study alone 30 phút → +20 🍃
- **Task 3**: Group Study 15 phút → +10 🍃
- **Task 4**: Group Study 30 phút → +20 🍃
- **Task 5**: Hoàn thành tất cả nhiệm vụ → +40 🍃

### 5. Shop (🛒 Shop)

#### Đổi lá cây:
- **+1 Slot Group Study**: 300 🍃
- **Time Card (+5 phút)**: 100 🍃
- **Danh hiệu "Diligent Learner"**: 1000 🍃

#### Mua bằng tiền:
- **+1 Slot Group Study**: 10.000 đ
- **Time Card x5**: 10.000 đ
- **Title: Tycoon**: 500.000 đ
- **Title: Tycoon Pro Max**: 999.999 đ

### 6. 🆕 Authentication (🔐 Đăng nhập)
- **Đăng ký tài khoản**: Email + Password + Tên
- **Đăng nhập/Đăng xuất**: Session management
- **Guest mode**: Tiếp tục không cần đăng nhập
- **Lưu tiến độ**: Leaves, uploaded files, inventory
- **Đồng bộ dữ liệu**: Giữa các phiên đăng nhập
- **Upload file**: Yêu cầu đăng nhập
- **Lịch sử file**: Xem file đã upload

👉 **Chi tiết**: Xem `AUTH-GUIDE.md`

## Cách sử dụng

### Chuẩn bị Audio Files
1. Tải file âm thanh (xem hướng dẫn trong `audio/README.md`)
2. Đặt các file vào thư mục `audio/`:
   - `lofi.mp3` - Nhạc lo-fi
   - `rain.mp3` - Âm thanh mưa
   - `cafe.mp3` - Âm thanh quán cafe
   - `piano.mp3` - Nhạc piano
   - `timer-end.mp3` - Âm thanh kết thúc timer

**Nguồn audio miễn phí:**
- YouTube Audio Library
- Pixabay Music
- Freesound.org
- Mixkit

### Chạy ứng dụng
1. Mở file `index.html` trong trình duyệt
2. Hoặc sử dụng Live Server nếu dùng VS Code
3. Click vào trang để cho phép trình duyệt phát nhạc

### Lưu trữ dữ liệu
- Ứng dụng sử dụng **localStorage** để lưu:
  - Số lá cây hiện có
  - Thời gian học tập
  - Tiến độ nhiệm vụ
  - Cài đặt nhạc và âm lượng
  - Kho đồ đã mua
  - 🆕 **Tài khoản người dùng** (email, password hash, tên)
  - 🆕 **Phiên đăng nhập** hiện tại
  - 🆕 **File đã upload** (tên, nội dung preview, ngày upload)

### Các module chính

#### 0. 🆕 `auth.js` - Hệ thống đăng nhập
```javascript
// Khởi tạo auth
initAuth();

// Kiểm tra đăng nhập
if (authManager.isUserLoggedIn()) {
  const user = authManager.getCurrentUser();
  console.log(user.name, user.email);
}

// Hiển thị dialog đăng nhập
authManager.showLoginDialog();

// Đăng xuất
authManager.logout();

// Thêm file đã upload
authManager.addUploadedFile({
  name: 'document.pdf',
  content: 'preview...',
  uploadedAt: new Date().toISOString(),
  questionCount: 20
});

// Lấy danh sách file
const files = authManager.getUploadedFiles();
```

#### 1. `app.js` - Ứng dụng chính
```javascript
// Khởi tạo ứng dụng
const app = new App();

// Chuyển tab
app.switchTab('quiz');

// Thêm lá cây
app.addLeaves(10);
```

#### 2. `timer.js` - Quản lý timer
```javascript
// Khởi tạo timer
const timer = new Timer();

// Chuyển đổi mode
timer.switchMode('countdown'); // hoặc 'countup'

// Đặt thời gian đếm ngược
timer.setCountdownTime(0, 25, 0); // 25 phút

// Bắt đầu/Tạm dừng
timer.toggle();

// Reset
timer.reset();

// Lấy số phút đã học
const minutes = timer.getStudyMinutes();
```

#### 3. `quiz.js` - Quản lý quiz
```javascript
// Khởi tạo quiz
const quiz = new QuizManager();

// Bắt đầu quiz
quiz.startQuiz();

// Reset quiz
quiz.resetQuiz();
```

#### 4. `missions.js` - Quản lý nhiệm vụ
```javascript
// Khởi tạo missions
const missions = new MissionsManager();

// Cập nhật tiến độ học
missions.checkStudyProgress(15); // 15 phút

// Cập nhật tiến độ group
missions.checkGroupProgress(30); // 30 phút

// Reset nhiệm vụ hàng ngày
missions.resetDailyMissions();
```

#### 5. `shop.js` - Quản lý shop
```javascript
// Khởi tạo shop
const shop = new ShopManager();

// Lấy kho đồ
const inventory = shop.getInventory();
```

#### 6. `utils.js` - Hàm tiện ích
```javascript
// Hiển thị thông báo
showToast('Thông báo!');

// Cập nhật hiển thị lá cây
updateLeavesDisplay(100);

// Thêm lá cây (có giới hạn)
const newLeaves = addLeaves(10, currentLeaves, 100);

// Format thời gian
const timeStr = formatTime(3665); // "01:01:05"

// Lưu/Tải dữ liệu
saveData('key', value);
const data = loadData('key', defaultValue);
```

## Phát triển thêm

### Tính năng có thể mở rộng:
1. **🆕 View/Delete uploaded files** - UI quản lý file
2. **🆕 Export/Import user data** - Backup dữ liệu
3. **🆕 Forgot password** - Khôi phục mật khẩu
4. **WebRTC signaling server** cho Group Study thực tế
5. **AI tạo câu hỏi** từ PDF/DOCX (GPT/Claude)
6. **Thống kê học tập** theo ngày/tuần/tháng
7. **Leaderboard** xếp hạng người dùng
8. **Tích hợp thanh toán** thực tế
9. **Notification** nhắc nhở học tập
10. **Dark mode**
11. **Multi-language** support
12. **Social features**: Kết bạn, chia sẻ thành tích

### Cải thiện hiệu năng:
- Sử dụng **IndexedDB** thay vì localStorage cho dữ liệu lớn
- **Service Worker** cho offline support
- **Lazy loading** cho các module
- **Code splitting** để giảm bundle size

## Công nghệ sử dụng

- **HTML5**: Cấu trúc trang
- **CSS3**: Styling với CSS Variables
- **Vanilla JavaScript**: Logic không dùng framework
- **LocalStorage**: Lưu trữ dữ liệu client-side
- **ES6+ Classes**: OOP structure
- **🆕 PDF.js**: Parse PDF files
- **🆕 Mammoth.js**: Parse DOCX files
- **WebRTC API**: Video calling (Group Study)

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

## License

MIT License - Tự do sử dụng và chỉnh sửa

## Tác giả

Study Garden Team 🌿
