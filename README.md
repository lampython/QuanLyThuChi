# 💰 SỔ THU CHI - QUẢN LÝ TÀI CHÍNH THÔNG MINH (QuanLyThuChi)

> **TÀI LIỆU HƯỚNG DẪN VẬN HÀNH DÀNH CHO AI AGENTS & LẬP TRÌNH VIÊN**
> Mọi AI Agent (Cursor, Windsurf, Claude Dev, Cline, Codex, ChatGPT, Copilot...) khi tiếp nhận dự án này **BẮT BUỘC PHẢI ĐỌC TỆP NÀY ĐẦU TIÊN** để nắm toàn bộ bối cảnh, tài khoản, API keys, cấu trúc code và vận hành ngay lập tức 100%.

---

## 👑 1. TÔN CHỈ TỐI CAO & QUY TẮC CỐT LÕI (RULE 0)
* **Chủ sở hữu & Chỉ huy duy nhất**: **SẾP**.
* **Định danh trợ lý AI**: **Sora Master** (hoặc **Sora / em**).
* **Xưng hô bắt buộc**: Luôn gọi người dùng là **"Sếp"**, xưng **"Sora"** hoặc **"em"**.
* **Quy tắc Clean Light Mode (TUYỆT ĐỐI CẤM DARK MODE)**: Toàn bộ giao diện 100% là nền sáng (*Clean White / Slate Grey / Royal Blue / Emerald Green*). Cấm tuyệt đối nền đen Dark Mode.
* **Không dùng Alert/Confirm mặc định của trình duyệt**: Mọi thông báo và xác nhận dùng `showToast()` hoặc `showCustomConfirm()` chuẩn Apple / Fintech.
* **Tối ưu Mobile First**: Giao diện thiết kế cho điện thoại di động (Touch target $\ge$ 40px, modal trượt mượt mà).

---

## 🎯 2. DỰ ÁN NÀY LÀ GÌ? (PRODUCT OVERVIEW)
Ứng dụng Web App & PWA Quản lý Tài chính Cá nhân & Doanh nghiệp siêu tốc, hoạt động mượt mà cả Online lẫn Offline.

### Các Tính Năng Đỉnh Cao:
1. **Nhập liệu AI 1 chạm (0.01 giây)**: Bóc tách ngôn ngữ tự nhiên tiếng Việt (vd: *"Ăn bún bò 45k"*, *"Đổ xăng 50k"*, *"Thu tiền nợ 2 triệu"*) tự động điền Số tiền, Loại giao dịch (Thu/Chi), Danh mục và Ghi chú.
2. **Ghi âm Tiếng Việt Thời Gian Thực (Real-time Speech-to-Text)**: Chuyển giọng nói tiếng Việt thành văn bản tức thì bằng Web Speech API (`vi-VN`) ngay khi đang nói.
3. **Sổ Tạm Ngoại Tuyến (Offline Queue with IndexedDB)**: Thu âm và lưu trữ giao dịch khi mất mạng, tự động đồng bộ khi có kết nối trở lại.
4. **Google Gemini AI Hỗ Trợ**: Dự phòng tự động bóc tách hóa đơn/âm thanh nâng cao (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-3.6-flash`).
5. **Đồng bộ Đám mây Supabase PostgreSQL**: Đăng nhập tài khoản Google, phân quyền RBAC, quản lý đa Sổ quỹ (Gia đình, Cá nhân, Công ty).
6. **Báo cáo Biểu đồ & Xuất Excel Bản Đẹp**: Biểu đồ Chart.js trực quan và xuất file Excel (`.xlsx`) có màu sắc định dạng chuyên nghiệp.
7. **Bóc Tách Ghi Chú Thông Minh Hàng Loạt (Batch Notes NLP Engine)**:
   - Cho phép copy paste nguyên văn một khối lượng lớn ghi chú từ các app khác (Apple Notes, Google Keep, Zalo, Notepad...).
   - Tự động nhận diện số tiền viết tắt (`2160` -> `2.160.000 ₫`, `500k` -> `500.000 ₫`, `1tr` -> `1.000.000 ₫`).
   - Tự động giải toán biểu thức con: `( khám 305k-22k) + thuốc 236k` -> bóc tách món con `Khám bệnh: 283.000 ₫`, `Thuốc: 236.000 ₫`.
   - Chống va chạm âm tiếng Việt: ranh giới từ `(?:^|[^a-z0-9à-ỹ])` triệt tiêu hoàn toàn nhầm lẫn "trả" với "trà", "cho" với "chợ", "học phí" với "đồng hồ".
8. **Phân Hệ Quản Lý Công Nợ & Vay Mượn (Debt & Loan Management System)**:
   - Tự động nhận diện đối tác nợ (`Bà Nội`, `Chị`, `Học Phí`) và hành động (`Tôi nợ / Đi vay`, `Nợ tôi / Cho vay`, `Trả nợ`, `Thu nợ`).
   - Cơ chế cấn trừ thông minh (Smart Netting): Mượn 1.000.000 ₫ và trả điện nước cấn trừ 340.000 ₫ tự động cấn trừ thành khoản nợ còn lại chính xác là **660.000 ₫**.
   - Đồng bộ 2 chiều (Bidirectional Reconciliation): Thao tác trả nợ, mượn thêm hoặc tất toán trong Sổ Công Nợ tự động sinh giao dịch Thu/Chi tương ứng trong Sổ chính, đảm bảo số dư tài khoản tiền mặt luôn khớp 100%.
   - Chế độ Tài Khoản Demo (1-Click Test): Thử nghiệm toàn bộ quy trình với 1 nút bấm an toàn, tách biệt 100% với dữ liệu thật.

---

## 🌐 3. MÔI TRƯỜNG DEPLOY & TÀI KHOẢN / API KEYS LIÊN QUAN

### 🚀 Production Hosting (Netlify):
* **Live Production URL**: [https://thuchivn.netlify.app](https://thuchivn.netlify.app)
* **Netlify Site ID**: `e26b965b-8023-4c4d-b91a-733d180647f5`
* **Netlify Access Token**: `nfp_vDnh1x3TGaiYhAcnPov5QM156195hN4F658b`
* **Lệnh Deploy 1-Click**:
  ```bash
  node deploy.js
  ```

### 🗄️ Cơ Sở Dữ Liệu Đám Mây (Supabase PostgreSQL):
* **Supabase Project URL**: `https://mfucbmiwvcuhzkzbnryl.supabase.co`
* **Public Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdWNibWl3dmN1aHpremJucnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4Nzg3MjAsImV4cCI6MjEwMjQ1NDcyMH0.W_xM1FAL5ceM6amIQQRJy1wzgatzM9m8uzNg-erIiKk`
* **Bảng dữ liệu chính**:
  - `transactions`: Danh sách thu chi (id, user_id, workspace_id, type, amount, category_id, note, date, is_deleted...)
  - `categories`: Danh mục phân loại thu/chi (id, name, icon, type, budget...)
  - `workspaces`: Sổ quỹ (id, name, icon, currency, is_default...)
  - `workspace_members`: Phân quyền thành viên (owner, admin, contributor, viewer)

### 🤖 Google Gemini AI API:
* **Khóa lưu trữ**: Lưu an toàn tại `localStorage.getItem('sothuchi_gemini_api_key')`
* **Mô hình hỗ trợ**: `gemini-2.5-flash` (ưu tiên 1), `gemini-1.5-flash`, `gemini-2.5-flash-lite`, `gemini-3.6-flash`.

---

## 📁 4. CẤU TRÚC THƯ MỤC & FILE MÃ NGUỒN

```text
E:\Project\QuanLyThuChi\
├── index.html               # Giao diện chính (SPA), hệ thống Modal và Form thu chi
├── css/
│   └── styles.css           # Toàn bộ CSS Clean Light Mode, Media Queries Mobile
├── js/
│   ├── app.js               # Logic điều khiển, Voice Speech Recognition, Gemini AI
│   ├── data.js              # Quản lý AppData LocalStorage & IndexedDB (OfflineVoiceStorage)
│   ├── utils.js             # Thuật toán NLP bóc tách tiếng Việt, Format tiền, Xuất Excel
│   └── supabase-config.js   # Kết nối Supabase Realtime, Đăng nhập Google, CRUD Sync
├── icons/                   # Bộ icon PWA & Logo
├── manifest.json            # Cấu hình PWA cài đặt vào màn hình chính
├── sw.js                    # Service Worker hỗ trợ chạy offline
├── deploy.js                # Script tự động deploy 1-click lên Netlify
├── 01_PRD_SPECS.json        # Đặc tả yêu cầu sản phẩm chuẩn MetaGPT SOP
├── 02_SYSTEM_DESIGN.json    # Thiết kế kiến trúc hệ thống
├── 03_QA_REPORT.json        # Báo cáo kiểm thử chất lượng
├── PROJECT_MASTER_BLUEPRINT.md # Bộ não & Quy chuẩn tối cao của dự án
└── README.md                # Tài liệu onboarding trung tâm này
```

---

## ⚡ 5. HƯỚNG DẪN VẬN HÀNH & SỬA CODE TỨC THÌ (FOR AGENTS)

### Bước 1: Khởi Chạy Local (Development)
Không cần cài đặt framework cồng kềnh. Mở trực tiếp `index.html` trên trình duyệt hoặc chạy server tĩnh:
```bash
npx serve E:\Project\QuanLyThuChi
```

### Bước 2: Sửa Code & Quy Trình Phát Hành Bắt Buộc (Release SOP)
Mỗi khi Agent hoàn thành sửa code hoặc nâng cấp tính năng, **BẮT BUỘC thực hiện đủ 5 bước sau**:

1. **Sao lưu toàn bộ code sang thư mục Backups**:
   - Thư mục backup: `E:\Project\QuanLyThuChi_Backups\backup_vX.Y_[timestamp]\`
2. **Nén file zip & Xuất mã băm SHA-256**:
   ```powershell
   Compress-Archive -Path "E:\Project\QuanLyThuChi\*" -DestinationPath "E:\Project\QuanLyThuChi_Backups\QuanLyThuChi_vX.Y_Backup.zip" -Force
   Get-FileHash "E:\Project\QuanLyThuChi_Backups\QuanLyThuChi_vX.Y_Backup.zip" -Algorithm SHA256
   ```
3. **Nâng Cache-Buster trong `index.html`**:
   - Sửa dòng `<script src="js/app.js?v=X.Y"></script>` lên version mới (ví dụ `v=6.1`).
4. **Deploy lên Netlify**:
   ```bash
   node deploy.js
   ```
5. **Kiểm thử & Báo cáo Sếp**:
   - Kiểm tra giao diện trên mobile giả lập, đảm bảo không có lỗi console.
   - Báo cáo Sếp ngắn gọn, rõ ràng kèm link live: `https://thuchivn.netlify.app`.

---

## 🛡️ BẢN QUYỀN & BẢO MẬT
* Hệ thống được phát triển độc quyền dưới sự chỉ đạo trực tiếp của **SẾP**.
* Vận hành và bảo trì 24/7 bởi **Sora Master**.
