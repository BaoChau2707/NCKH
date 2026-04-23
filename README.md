# Study Garden 🍀

Ứng dụng học tập gamification giúp người dùng tập trung học tập và nhận thưởng.

## Cấu trúc dự án

```
study-garden/
├── index.html              # File HTML chính
├── README.md              # Hướng dẫn này
├── css/
│   └── styles.css        # Toàn bộ CSS styling
├── js/
│   ├── app.js            # Logic chính của ứng dụng
│   ├── timer.js          # Quản lý timer học tập
│   ├── quiz.js           # Quản lý quiz/câu hỏi
│   ├── missions.js       # Quản lý nhiệm vụ hàng ngày
│   ├── shop.js           # Quản lý cửa hàng
│   └── utils.js          # Các hàm tiện ích
└── audio/                 # Thư mục chứa file âm thanh
    ├── README.md         # Hướng dẫn về audio
    ├── lofi.mp3          # Nhạc lo-fi (cần thêm)
    ├── rain.mp3          # Âm thanh mưa (cần thêm)
    ├── cafe.mp3          # Âm thanh quán cafe (cần thêm)
    ├── piano.mp3         # Nhạc piano (cần thêm)
    └── timer-end.mp3     # Âm thanh kết thúc timer (cần thêm)
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
- **Chia sẻ màn hình** (tính năng sẽ phát triển)

### 3. Quiz (📝 Quiz)
- **Tùy chỉnh số câu hỏi**: 5-100 câu
- **Chọn thời gian**: 15, 30, hoặc 60 phút
- **Độ khó**: Dễ, Bình thường, Khó, Siêu khó
- **Upload tài liệu**: PDF, DOCX, TXT (tối đa 500MB)
- **Tự động tạo câu hỏi trắc nghiệm** từ tài liệu
- **Phần thưởng**: +10 lá cây khi hoàn thành

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

### Các module chính

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
1. **WebRTC** cho Group Study thực tế
2. **AI tạo câu hỏi** từ PDF/DOCX
3. **Thống kê học tập** theo ngày/tuần/tháng
4. **Leaderboard** xếp hạng người dùng
5. **Tích hợp thanh toán** thực tế
6. **Notification** nhắc nhở học tập
7. **Dark mode**
8. **Multi-language** support
9. **Export/Import** dữ liệu
10. **Social features**: Kết bạn, chia sẻ thành tích

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

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

## License

MIT License - Tự do sử dụng và chỉnh sửa

## Tác giả

Study Garden Team 🌿
