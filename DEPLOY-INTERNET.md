# 🌐 Deploy lên Internet - Mọi người có thể vào

## 🎯 Mục tiêu

Hiện tại: Website chỉ chạy trên máy bạn (localhost)
Mục tiêu: Website có link, mọi người vào được

---

## ⚡ Cách nhanh nhất (5 phút) - Netlify Drop

### Bước 1: Chuẩn bị files

Đảm bảo có các files này:
```
study-garden/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── timer.js
│   ├── quiz.js
│   ├── missions.js
│   ├── shop.js
│   ├── group-study.js
│   └── utils.js
├── audio/
│   └── (các file audio nếu có)
└── (các file khác)
```

### Bước 2: Deploy lên Netlify

1. Vào: **https://app.netlify.com/drop**
2. Kéo thả **toàn bộ folder** `study-garden` vào
3. Đợi 10-30 giây
4. Nhận link: `https://random-name-123.netlify.app`
5. **XONG!** ✅

### Bước 3: Chia sẻ link

- Copy link: `https://random-name-123.netlify.app`
- Gửi cho bạn bè
- Họ mở link → Vào được website! 🎉

---

## 🚀 Cách tốt hơn (10 phút) - GitHub Pages

### Bước 1: Tạo GitHub account

1. Vào: **https://github.com**
2. Click **"Sign up"**
3. Nhập email, password, username
4. Verify email

### Bước 2: Tạo repository

1. Click **"+"** → **"New repository"**
2. Repository name: `study-garden`
3. Public (để deploy miễn phí)
4. Click **"Create repository"**

### Bước 3: Upload code

#### Option A: Upload qua web (Dễ nhất)

1. Click **"uploading an existing file"**
2. Kéo thả **tất cả files** vào
3. Scroll xuống → Click **"Commit changes"**

#### Option B: Dùng Git (Nếu biết Git)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/study-garden.git
git push -u origin main
```

### Bước 4: Enable GitHub Pages

1. Vào repository → **Settings**
2. Sidebar → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Click **"Save"**
6. Đợi 1-2 phút
7. Refresh page → Thấy link: `https://YOUR_USERNAME.github.io/study-garden`

### Bước 5: Chia sẻ

- Link: `https://YOUR_USERNAME.github.io/study-garden`
- Mọi người vào được! ✅

---

## 💎 Cách chuyên nghiệp (15 phút) - Vercel

### Bước 1: Tạo Vercel account

1. Vào: **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

### Bước 2: Import project

1. Click **"Add New..."** → **"Project"**
2. Import Git Repository
3. Chọn repository `study-garden`
4. Click **"Import"**

### Bước 3: Deploy

1. Framework Preset: **Other**
2. Root Directory: `./`
3. Click **"Deploy"**
4. Đợi 1-2 phút
5. Nhận link: `https://study-garden.vercel.app`

### Bước 4: Custom domain (Optional)

1. Settings → Domains
2. Add domain của bạn (nếu có)
3. Hoặc dùng subdomain miễn phí của Vercel

---

## 📊 So sánh các cách

| Method | Time | Cost | Custom Domain | Auto-update |
|--------|------|------|---------------|-------------|
| **Netlify Drop** | 5 min | Free | ❌ | ❌ |
| **GitHub Pages** | 10 min | Free | ✅ | ✅ (with Git) |
| **Vercel** | 15 min | Free | ✅ | ✅ |
| **Netlify (Git)** | 15 min | Free | ✅ | ✅ |

---

## 🎯 Khuyến nghị

### Cho người mới:
→ **Netlify Drop** (kéo thả, xong ngay)

### Cho người biết Git:
→ **GitHub Pages** (miễn phí, ổn định)

### Cho dự án thật:
→ **Vercel** hoặc **Netlify** (chuyên nghiệp, nhanh)

---

## ⚠️ Lưu ý quan trọng

### 1. HTTPS tự động
Tất cả các service trên đều cho HTTPS miễn phí!
- ✅ WebRTC hoạt động (cần HTTPS)
- ✅ Camera/mic hoạt động
- ✅ An toàn

### 2. Group Call vẫn cần Firebase
Deploy lên internet chỉ giúp:
- ✅ Mọi người vào được website
- ✅ Dùng được timer, quiz, missions, shop

Nhưng Group Call cross-device vẫn cần Firebase:
- ⚠️ Không Firebase → Chỉ test được same-browser
- ✅ Có Firebase → Cross-device hoạt động

→ Xem `FIREBASE-QUICK-START.md` để setup

### 3. Audio files
Nếu có audio files lớn:
- Upload lên GitHub/Netlify/Vercel
- Hoặc dùng CDN (Cloudinary, etc.)
- Hoặc dùng demo URLs (như hiện tại)

---

## 🔧 Troubleshooting

### "Website không load"
- Kiểm tra `index.html` ở root folder
- Kiểm tra paths trong HTML (relative paths)
- Xem console (F12) có lỗi không

### "CSS/JS không load"
- Kiểm tra paths: `css/styles.css` (không phải `/css/styles.css`)
- Kiểm tra case-sensitive: `CSS` ≠ `css`

### "Audio không phát"
- Kiểm tra audio files đã upload chưa
- Hoặc dùng demo URLs từ internet

### "Group call không hoạt động"
- Deploy website ≠ Fix group call
- Cần setup Firebase riêng
- Xem `FIREBASE-QUICK-START.md`

---

## 📝 Step-by-Step: Netlify Drop (Dễ nhất)

### 1. Mở folder project
```
study-garden/
├── index.html
├── css/
├── js/
└── ...
```

### 2. Vào Netlify Drop
- URL: https://app.netlify.com/drop
- Không cần đăng ký!

### 3. Kéo thả folder
- Kéo **toàn bộ folder** `study-garden`
- Thả vào khung "Drag and drop"
- Đợi upload

### 4. Nhận link
- Netlify tự động deploy
- Nhận link: `https://random-name-123.netlify.app`
- Copy link này

### 5. Test
- Mở link trong browser
- Kiểm tra website hoạt động
- Gửi link cho bạn bè test

### 6. Update (nếu cần)
- Kéo thả folder mới vào lại
- Netlify tự động update
- Link giữ nguyên

---

## 🎉 Kết quả

**Sau khi deploy:**
- ✅ Website có link công khai
- ✅ Mọi người vào được
- ✅ HTTPS tự động
- ✅ Miễn phí 100%

**Link ví dụ:**
```
https://study-garden-abc123.netlify.app
https://username.github.io/study-garden
https://study-garden.vercel.app
```

**Chia sẻ:**
- Gửi link qua Messenger, Zalo, Discord
- Post lên Facebook, Twitter
- Mọi người click vào → Dùng được! 🎉

---

## 🔥 Quick Start (Copy-Paste)

### Netlify Drop:
```
1. Vào: https://app.netlify.com/drop
2. Kéo thả folder
3. Copy link
4. Chia sẻ!
```

### GitHub Pages:
```
1. Tạo repo: https://github.com/new
2. Upload files
3. Settings → Pages → Enable
4. Link: https://username.github.io/repo-name
```

### Vercel:
```
1. Vào: https://vercel.com
2. Import GitHub repo
3. Deploy
4. Link: https://project.vercel.app
```

---

## 💡 Tips

### Tên miền đẹp hơn
Thay vì: `random-name-123.netlify.app`
Có thể: `study-garden.netlify.app`

**Cách làm:**
1. Đăng ký Netlify account (miễn phí)
2. Site settings → Change site name
3. Nhập: `study-garden`
4. Link mới: `https://study-garden.netlify.app`

### Custom domain (Nếu có)
Nếu bạn có domain (vd: `studygarden.com`):
1. Mua domain từ Namecheap, GoDaddy, etc.
2. Add domain vào Netlify/Vercel
3. Update DNS records
4. Link: `https://studygarden.com`

---

## ✅ Checklist

- [ ] Chọn service (Netlify/GitHub/Vercel)
- [ ] Upload code
- [ ] Deploy
- [ ] Nhận link
- [ ] Test website
- [ ] Chia sẻ link
- [ ] (Optional) Setup Firebase cho group call
- [ ] (Optional) Custom domain

---

**Bắt đầu với Netlify Drop - Dễ nhất, nhanh nhất! 🚀**

**Link:** https://app.netlify.com/drop
