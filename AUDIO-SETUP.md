# 🎵 Hướng dẫn Setup Audio - Study Garden

## ⚠️ Quan trọng

App hiện đang sử dụng **audio demo từ internet** (SoundHelix). Để sử dụng nhạc thật:

## Cách 1: Sử dụng Audio Demo (Đang dùng)

✅ **Không cần làm gì!** App đã cấu hình sẵn audio demo từ internet.

**Lưu ý:**
- Cần kết nối internet
- Chất lượng nhạc demo (không phải lo-fi/rain thật)
- Có thể chậm nếu mạng yếu

## Cách 2: Sử dụng Audio Local (Khuyến nghị)

### Bước 1: Tải audio files

Tải 5 file MP3 và đặt vào thư mục `audio/`:

```
audio/
├── lofi.mp3          # Nhạc lo-fi beats
├── rain.mp3          # Âm thanh mưa
├── cafe.mp3          # Âm thanh quán cafe
├── piano.mp3         # Nhạc piano
└── timer-end.mp3     # Âm thanh kết thúc timer
```

**Nguồn tải miễn phí:**
- 🎵 [YouTube Audio Library](https://studio.youtube.com/) - Miễn phí, không cần ghi nguồn
- 🎵 [Pixabay Music](https://pixabay.com/music/) - Miễn phí thương mại
- 🔊 [Freesound](https://freesound.org/) - Sound effects
- 🔊 [Mixkit](https://mixkit.co/free-sound-effects/) - Free sounds

### Bước 2: Sửa code

Mở file `js/app.js`, tìm dòng:

```javascript
const musicSources = {
  'lofi': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'rain': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'cafe': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'piano': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'none': ''
};
```

Thay bằng:

```javascript
const musicSources = {
  'lofi': 'audio/lofi.mp3',
  'rain': 'audio/rain.mp3',
  'cafe': 'audio/cafe.mp3',
  'piano': 'audio/piano.mp3',
  'none': ''
};
```

### Bước 3: Test

1. Mở `index.html` trong trình duyệt
2. Chọn loại nhạc
3. Click nút **▶️ Play**
4. Điều chỉnh âm lượng

## 🎮 Cách sử dụng

### Phát nhạc:
1. Chọn loại nhạc từ dropdown
2. Click nút **▶️ Play**
3. Nhạc sẽ tự động loop

### Tạm dừng:
- Click nút **⏸️ Pause**

### Đổi nhạc:
- Chọn nhạc khác từ dropdown
- Nhạc mới sẽ tự động phát

### Điều chỉnh âm lượng:
- Kéo thanh trượt volume (0-100%)

## 🔧 Troubleshooting

### ❌ Nhạc không phát?

**Nguyên nhân 1: Chưa có file audio**
```
✅ Giải pháp: Tải file MP3 vào thư mục audio/
```

**Nguyên nhân 2: Đường dẫn sai**
```
✅ Giải pháp: Kiểm tra tên file phải đúng:
   - lofi.mp3 (không phải lofi-beats.mp3)
   - rain.mp3 (không phải rain-sound.mp3)
```

**Nguyên nhân 3: Định dạng file sai**
```
✅ Giải pháp: Chỉ dùng MP3 (không dùng WAV, OGG, M4A)
```

**Nguyên nhân 4: Browser chặn autoplay**
```
✅ Giải pháp: Click nút Play thủ công
```

### 🔍 Kiểm tra lỗi:

1. Mở Console (F12)
2. Xem có lỗi gì không
3. Thường thấy:
   - `404 Not Found` → File không tồn tại
   - `CORS error` → Dùng Live Server
   - `Autoplay blocked` → Click Play thủ công

### 🌐 Chạy với Live Server:

Nếu dùng VS Code:
1. Cài extension "Live Server"
2. Right-click `index.html`
3. Chọn "Open with Live Server"

Hoặc dùng Python:
```bash
python -m http.server 8000
# Mở http://localhost:8000
```

## 📝 Gợi ý Audio

### Lo-fi Beats:
- Tìm kiếm: "lofi study beats"
- Thời lượng: 5-10 phút
- Bitrate: 128 kbps

### Rain Sounds:
- Tìm kiếm: "rain ambience"
- Thời lượng: 5-10 phút
- Bitrate: 128 kbps

### Cafe Ambience:
- Tìm kiếm: "coffee shop ambience"
- Thời lượng: 5-10 phút
- Bitrate: 128 kbps

### Classical Piano:
- Tìm kiếm: "classical piano study"
- Thời lượng: 5-10 phút
- Bitrate: 128 kbps

### Timer End Sound:
- Tìm kiếm: "bell chime notification"
- Thời lượng: 2-5 giây
- Bitrate: 128 kbps

## 🎯 Test Audio

Mở file `audio-test.html` để test audio trước khi dùng trong app chính.

## 💡 Tips

1. **File size**: Nên < 10MB mỗi file
2. **Format**: MP3 là tốt nhất cho web
3. **Loop**: Nhạc nền sẽ tự động lặp lại
4. **Volume**: Mặc định 50%, có thể điều chỉnh
5. **License**: Chỉ dùng nhạc miễn phí hoặc có bản quyền

## 📚 Tài liệu thêm

- `audio/README.md` - Hướng dẫn chi tiết về audio
- `download-audio.md` - Hướng dẫn tải audio
- `audio-test.html` - Test audio files

## ✅ Checklist

- [ ] Đã tải 5 file MP3
- [ ] Đã đặt vào thư mục `audio/`
- [ ] Đã đổi tên đúng (lofi.mp3, rain.mp3, ...)
- [ ] Đã sửa code trong `js/app.js` (nếu dùng local)
- [ ] Đã test bằng `audio-test.html`
- [ ] Đã mở app và test phát nhạc
- [ ] Nhạc phát được và loop tự động

---

**Cần hỗ trợ?** Mở Console (F12) và xem lỗi!
