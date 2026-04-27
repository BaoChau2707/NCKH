# ✅ Deploy Checklist - Trước khi đưa lên Internet

## 📋 Checklist cơ bản

### 1. Files cần thiết
- [ ] `index.html` - File chính
- [ ] `css/styles.css` - CSS
- [ ] `js/*.js` - Tất cả JS files (7 files)
- [ ] `audio/` folder (nếu có audio files)
- [ ] `README.md` - Documentation

### 2. Kiểm tra code
- [ ] Mở `index.html` trong browser → Hoạt động OK
- [ ] Test timer → OK
- [ ] Test quiz → OK
- [ ] Test missions → OK
- [ ] Test shop → OK
- [ ] Test auth (login/register) → OK
- [ ] Không có lỗi trong Console (F12)

### 3. Paths (Quan trọng!)
- [ ] Tất cả paths dùng relative (không có `/` đầu)
- [ ] `css/styles.css` ✅ (không phải `/css/styles.css` ❌)
- [ ] `js/app.js` ✅ (không phải `/js/app.js` ❌)
- [ ] Audio URLs hoạt động

### 4. Cleanup
- [ ] Xóa files không cần: `test-*.html`, `debug-*.html`
- [ ] Xóa `firebase-config.js` nếu có (chứa API keys)
- [ ] Kiểm tra `.gitignore` đã ignore sensitive files

---

## 🚀 Deploy Steps

### Option 1: Netlify Drop (5 phút)

**Bước 1: Chuẩn bị**
- [ ] Đóng tất cả files
- [ ] Mở folder `study-garden`

**Bước 2: Deploy**
- [ ] Vào https://app.netlify.com/drop
- [ ] Kéo thả **toàn bộ folder**
- [ ] Đợi upload (10-30 giây)

**Bước 3: Test**
- [ ] Copy link: `https://xxx.netlify.app`
- [ ] Mở link trong browser
- [ ] Test các tính năng
- [ ] Mở trên điện thoại test

**Bước 4: Chia sẻ**
- [ ] Gửi link cho bạn bè
- [ ] Họ test được không?

---

### Option 2: GitHub Pages (10 phút)

**Bước 1: Tạo repo**
- [ ] Vào https://github.com/new
- [ ] Tên repo: `study-garden`
- [ ] Public
- [ ] Create repository

**Bước 2: Upload**
- [ ] Click "uploading an existing file"
- [ ] Kéo thả tất cả files
- [ ] Commit changes

**Bước 3: Enable Pages**
- [ ] Settings → Pages
- [ ] Source: main branch
- [ ] Save
- [ ] Đợi 1-2 phút

**Bước 4: Test**
- [ ] Copy link: `https://username.github.io/study-garden`
- [ ] Test website
- [ ] Chia sẻ link

---

## 🔥 Sau khi deploy

### 1. Test cơ bản
- [ ] Website load được
- [ ] CSS hiển thị đúng
- [ ] JS hoạt động
- [ ] Không có lỗi 404

### 2. Test tính năng
- [ ] Timer đếm được
- [ ] Quiz hoạt động
- [ ] Missions update
- [ ] Shop mua được
- [ ] Auth login/register

### 3. Test responsive
- [ ] Desktop: OK
- [ ] Tablet: OK
- [ ] Mobile: OK

### 4. Test cross-browser
- [ ] Chrome: OK
- [ ] Edge: OK
- [ ] Firefox: OK (nếu có)
- [ ] Safari: OK (nếu có)

---

## ⚠️ Common Issues

### Issue 1: CSS không load
**Triệu chứng:** Website không có màu, layout lỗi

**Fix:**
```html
<!-- Sai -->
<link rel="stylesheet" href="/css/styles.css">

<!-- Đúng -->
<link rel="stylesheet" href="css/styles.css">
```

### Issue 2: JS không chạy
**Triệu chứng:** Buttons không hoạt động

**Fix:**
```html
<!-- Sai -->
<script src="/js/app.js"></script>

<!-- Đúng -->
<script src="js/app.js"></script>
```

### Issue 3: Audio không phát
**Triệu chứng:** Nhạc không chạy

**Fix:**
- Kiểm tra audio files đã upload chưa
- Hoặc dùng demo URLs (như hiện tại)

### Issue 4: 404 errors
**Triệu chứng:** Console có lỗi 404

**Fix:**
- Kiểm tra file paths
- Kiểm tra file names (case-sensitive)
- Đảm bảo files đã upload

---

## 🎯 Group Call Setup (Optional)

**Lưu ý:** Deploy website ≠ Fix group call

**Để group call hoạt động cross-device:**
- [ ] Setup Firebase (5 phút)
- [ ] Xem `FIREBASE-QUICK-START.md`
- [ ] Add Firebase config
- [ ] Uncomment Firebase scripts
- [ ] Deploy lại

**Không setup Firebase:**
- ✅ Website vẫn hoạt động
- ✅ Timer, quiz, missions, shop OK
- ⚠️ Group call chỉ hoạt động same-browser

---

## 📊 Final Checklist

### Before Deploy:
- [ ] Code hoạt động local
- [ ] Paths đúng (relative)
- [ ] Cleanup files không cần
- [ ] Test trên nhiều browsers

### After Deploy:
- [ ] Website load được
- [ ] Tất cả tính năng hoạt động
- [ ] Test trên mobile
- [ ] Chia sẻ link cho bạn bè test

### Optional:
- [ ] Setup Firebase (cho group call)
- [ ] Custom domain
- [ ] Analytics (Google Analytics)
- [ ] SEO optimization

---

## 🎉 Success!

**Khi hoàn thành:**
- ✅ Website có link công khai
- ✅ Mọi người vào được
- ✅ HTTPS tự động
- ✅ Miễn phí 100%

**Link ví dụ:**
```
https://study-garden.netlify.app
https://username.github.io/study-garden
https://study-garden.vercel.app
```

**Chia sẻ và enjoy! 🚀**

---

## 📞 Need Help?

**Nếu gặp vấn đề:**
1. Đọc `DEPLOY-INTERNET.md`
2. Kiểm tra Console (F12)
3. Test local trước
4. Google error message
5. Ask for help với error logs

**Common docs:**
- `DEPLOY-INTERNET.md` - Hướng dẫn deploy
- `TROUBLESHOOTING.md` - Fix lỗi
- `FIREBASE-QUICK-START.md` - Setup Firebase
- `README.md` - Overview

---

**Good luck! 🍀**
