# 🚀 Hướng dẫn Deploy Study Garden

## 📱 Responsive Design

Web đã được tối ưu cho:
- ✅ **Mobile** (< 480px) - Điện thoại
- ✅ **Tablet** (481px - 1023px) - Máy tính bảng
- ✅ **Desktop** (> 1024px) - Laptop/PC
- ✅ **Landscape** - Xoay ngang điện thoại

## 🌐 Cách 1: Deploy lên GitHub Pages (Miễn phí, Dễ nhất)

### Bước 1: Tạo GitHub Repository

1. Vào https://github.com/new
2. Đặt tên repo: `study-garden`
3. Chọn **Public**
4. Click **Create repository**

### Bước 2: Upload code

**Cách A: Dùng GitHub Desktop (Dễ)**
```bash
1. Tải GitHub Desktop: https://desktop.github.com/
2. Clone repo vừa tạo
3. Copy toàn bộ file vào folder
4. Commit & Push
```

**Cách B: Dùng Git Command (Nhanh)**
```bash
# Trong thư mục project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/study-garden.git
git push -u origin main
```

### Bước 3: Enable GitHub Pages

1. Vào repo → **Settings**
2. Sidebar → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** → folder: **/ (root)**
5. Click **Save**

### Bước 4: Truy cập website

Sau 1-2 phút, website sẽ có tại:
```
https://USERNAME.github.io/study-garden/
```

**Ví dụ:**
```
https://nguyenvanan.github.io/study-garden/
```

---

## 🌐 Cách 2: Deploy lên Netlify (Miễn phí, Nhanh nhất)

### Bước 1: Tạo tài khoản

1. Vào https://netlify.com
2. Sign up (dùng GitHub account)

### Bước 2: Deploy

**Cách A: Drag & Drop (Siêu dễ)**
1. Vào https://app.netlify.com/drop
2. Kéo thả toàn bộ folder project
3. Xong! Website live ngay

**Cách B: Connect GitHub**
1. Click **Add new site** → **Import an existing project**
2. Chọn **GitHub**
3. Chọn repo `study-garden`
4. Click **Deploy site**

### Bước 3: Custom domain (Optional)

1. Site settings → **Domain management**
2. Click **Add custom domain**
3. Nhập domain của bạn (hoặc dùng subdomain miễn phí)

**URL mặc định:**
```
https://random-name-123.netlify.app
```

**Đổi tên:**
```
Site settings → Site details → Change site name
→ https://study-garden.netlify.app
```

---

## 🌐 Cách 3: Deploy lên Vercel (Miễn phí, Chuyên nghiệp)

### Bước 1: Tạo tài khoản

1. Vào https://vercel.com
2. Sign up với GitHub

### Bước 2: Deploy

1. Click **Add New** → **Project**
2. Import repo `study-garden`
3. Click **Deploy**

### Bước 3: Truy cập

```
https://study-garden.vercel.app
```

---

## 🌐 Cách 4: Deploy lên Firebase Hosting (Google)

### Bước 1: Cài Firebase CLI

```bash
npm install -g firebase-tools
```

### Bước 2: Login & Init

```bash
firebase login
firebase init hosting
```

Chọn:
- Use existing project hoặc Create new
- Public directory: `.` (thư mục hiện tại)
- Single-page app: **No**
- GitHub deploys: **No** (hoặc Yes nếu muốn)

### Bước 3: Deploy

```bash
firebase deploy
```

### Bước 4: Truy cập

```
https://PROJECT-ID.web.app
```

---

## 📊 So sánh các nền tảng

| Platform | Tốc độ | Dễ dùng | Custom Domain | SSL | CDN |
|----------|--------|---------|---------------|-----|-----|
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Netlify** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Firebase** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ | ✅ | ✅ |

**Khuyến nghị:**
- 🥇 **Netlify** - Dễ nhất, nhanh nhất
- 🥈 **GitHub Pages** - Phổ biến nhất
- 🥉 **Vercel** - Chuyên nghiệp nhất

---

## 🔧 Chuẩn bị trước khi deploy

### 1. Kiểm tra audio files

Nếu dùng audio local, đảm bảo:
```
audio/
├── lofi.mp3
├── rain.mp3
├── cafe.mp3
├── piano.mp3
└── timer-end.mp3
```

Hoặc giữ nguyên URL demo trong `js/app.js`

### 2. Test local

```bash
# Dùng Python
python -m http.server 8000

# Hoặc dùng Live Server (VS Code)
# Right-click index.html → Open with Live Server
```

Mở: http://localhost:8000

### 3. Test responsive

Trong browser:
- Press **F12** → Toggle device toolbar
- Test trên: iPhone, iPad, Desktop

---

## 📱 Test trên thiết bị thật

### Sau khi deploy:

1. **Trên điện thoại:**
   - Mở browser (Chrome/Safari)
   - Vào URL của bạn
   - Test tất cả tính năng

2. **Trên tablet:**
   - Test landscape & portrait
   - Kiểm tra layout

3. **Trên laptop:**
   - Test các màn hình khác nhau
   - Zoom in/out

---

## 🎯 Checklist Deploy

- [ ] Code đã test kỹ local
- [ ] Responsive đã test trên nhiều màn hình
- [ ] Audio files đã chuẩn bị (hoặc dùng URL)
- [ ] Đã chọn platform deploy
- [ ] Đã tạo tài khoản
- [ ] Đã upload code
- [ ] Website đã live
- [ ] Đã test trên điện thoại thật
- [ ] Đã test trên laptop
- [ ] Đã chia sẻ link cho bạn bè

---

## 🔗 Chia sẻ website

Sau khi deploy, bạn có URL như:
```
https://study-garden.netlify.app
```

Chia sẻ link này cho:
- 👥 Bạn bè
- 📱 Social media
- 💼 Portfolio
- 📧 Email

---

## 🆘 Troubleshooting

### Website không load?
- Đợi 1-2 phút sau khi deploy
- Clear cache browser (Ctrl + Shift + R)
- Kiểm tra Console (F12) xem lỗi

### Audio không phát?
- Kiểm tra file audio đã upload chưa
- Kiểm tra đường dẫn trong `js/app.js`
- Hoặc dùng URL demo

### Layout bị vỡ trên mobile?
- Kiểm tra viewport meta tag trong HTML
- Test lại responsive trong DevTools

### HTTPS bị lỗi?
- Tất cả platform trên đều tự động có SSL
- Đợi vài phút để certificate active

---

## 💡 Tips

1. **Custom domain:**
   - Mua domain tại Namecheap, GoDaddy (~$10/năm)
   - Point DNS về hosting
   - Ví dụ: `studygarden.com`

2. **Analytics:**
   - Thêm Google Analytics để track visitors
   - Xem có bao nhiêu người dùng

3. **SEO:**
   - Thêm meta tags trong `<head>`
   - Tạo file `sitemap.xml`
   - Submit lên Google Search Console

4. **PWA:**
   - Thêm `manifest.json`
   - Thêm Service Worker
   - Có thể cài như app trên điện thoại

---

## 🎉 Hoàn thành!

Website của bạn giờ đã:
- ✅ Live trên internet
- ✅ Mọi người truy cập được
- ✅ Responsive trên mọi thiết bị
- ✅ Có HTTPS (bảo mật)
- ✅ Tốc độ nhanh (CDN)
- ✅ Miễn phí 100%

**Chúc mừng! 🎊**
