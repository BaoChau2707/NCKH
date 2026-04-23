# Hướng dẫn tải Audio cho Study Garden

## Cách 1: Tải thủ công (Khuyến nghị)

### Bước 1: Truy cập YouTube Audio Library
1. Vào https://studio.youtube.com/
2. Đăng nhập tài khoản YouTube (hoặc tạo tài khoản mới)
3. Click vào menu bên trái → **Audio Library**

### Bước 2: Tìm và tải nhạc

#### Lo-fi Beats (lofi.mp3)
- Tìm kiếm: "lofi" hoặc "chill"
- Gợi ý: "Lofi Study", "Chill Abstract"
- Tải về và đổi tên thành `lofi.mp3`

#### Rain Sounds (rain.mp3)
- Tìm kiếm: "rain" hoặc "nature"
- Gợi ý: "Rain and Thunder", "Gentle Rain"
- Tải về và đổi tên thành `rain.mp3`

#### Cafe Ambience (cafe.mp3)
- Tìm kiếm: "cafe" hoặc "ambient"
- Gợi ý: "Coffee Shop", "Cafe Background"
- Tải về và đổi tên thành `cafe.mp3`

#### Classical Piano (piano.mp3)
- Tìm kiếm: "piano" hoặc "classical"
- Gợi ý: "Gymnopédie", "Clair de Lune"
- Tải về và đổi tên thành `piano.mp3`

### Bước 3: Tải Sound Effect

#### Timer End Sound (timer-end.mp3)
1. Vào https://freesound.org/
2. Tìm kiếm: "bell chime" hoặc "notification"
3. Chọn file ngắn (2-5 giây)
4. Tải về và đổi tên thành `timer-end.mp3`

### Bước 4: Đặt file vào thư mục
```
study-garden/
└── audio/
    ├── lofi.mp3
    ├── rain.mp3
    ├── cafe.mp3
    ├── piano.mp3
    └── timer-end.mp3
```

---

## Cách 2: Sử dụng URL trực tuyến

Nếu không muốn tải file, bạn có thể sử dụng URL trực tuyến.

### Sửa file `js/app.js`

Tìm dòng:
```javascript
const musicSources = {
  'lofi': 'audio/lofi.mp3',
  'rain': 'audio/rain.mp3',
  'cafe': 'audio/cafe.mp3',
  'piano': 'audio/piano.mp3',
  'none': ''
};
```

Thay bằng:
```javascript
const musicSources = {
  'lofi': 'https://your-cdn.com/lofi.mp3',
  'rain': 'https://your-cdn.com/rain.mp3',
  'cafe': 'https://your-cdn.com/cafe.mp3',
  'piano': 'https://your-cdn.com/piano.mp3',
  'none': ''
};
```

**Lưu ý:** 
- URL phải hỗ trợ CORS
- Cần kết nối internet để phát nhạc
- Có thể bị chậm nếu mạng yếu

---

## Cách 3: Tạo file âm thanh đơn giản

Nếu chỉ muốn test, bạn có thể:

1. **Sử dụng Text-to-Speech online** để tạo file âm thanh
2. **Ghi âm** từ microphone
3. **Sử dụng công cụ tạo nhạc online**:
   - https://www.beepbox.co/ (tạo nhạc 8-bit)
   - https://musiclab.chromeexperiments.com/ (Chrome Music Lab)

---

## Cách 4: Sử dụng Audio API (Nâng cao)

Tạo âm thanh bằng Web Audio API (không cần file):

```javascript
// Tạo âm thanh beep đơn giản
function playBeep() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800; // Tần số Hz
  oscillator.type = 'sine'; // Loại sóng
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}
```

---

## Kiểm tra Audio

Sau khi thêm file, mở `audio-test.html` để kiểm tra:

```bash
# Mở file trong trình duyệt
open audio-test.html
# hoặc
start audio-test.html
```

---

## Troubleshooting

### Nhạc không phát?
1. Kiểm tra đường dẫn file
2. Kiểm tra định dạng (phải là MP3)
3. Mở Console (F12) xem lỗi
4. Click vào trang trước (browsers block autoplay)

### File quá lớn?
1. Sử dụng công cụ nén MP3:
   - https://www.freeconvert.com/mp3-compressor
   - Audacity (phần mềm miễn phí)
2. Giảm bitrate xuống 128 kbps
3. Cắt file ngắn hơn (5-10 phút)

### Chất lượng âm thanh kém?
1. Tải file chất lượng cao hơn
2. Tăng bitrate lên 192 kbps
3. Sử dụng định dạng lossless rồi convert

---

## Khuyến nghị

**Cho môi trường production:**
- Sử dụng CDN để host audio files
- Nén file để giảm dung lượng
- Cung cấp nhiều định dạng (MP3, OGG, WAV)
- Lazy load audio (chỉ tải khi cần)

**Cho môi trường development:**
- Sử dụng file local
- File nhỏ để test nhanh
- Có thể dùng URL online tạm thời

---

## License & Attribution

Nhớ kiểm tra license của audio files:
- ✅ CC0 (Public Domain) - Dùng tự do
- ✅ CC BY - Cần ghi nguồn
- ❌ Copyrighted - Không được dùng

Ví dụ ghi nguồn:
```html
<!-- Trong footer hoặc about page -->
<p>Music: "Lofi Study" by Artist Name (CC BY 3.0)</p>
```
