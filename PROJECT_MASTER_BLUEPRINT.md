# PROJECT MASTER BLUEPRINT: SỔ THU CHI (QuanLyThuChi)

> **TÔN CHỈ HOẠT ĐỘNG CỦA HỆ THỐNG (THE 1-PERSON AI ENTERPRISE):**
> **MÔ HÌNH: 1 CHỦ (SẾP) — 1 BOT MASTER (SORA) VẬN HÀNH TOÀN BỘ TẤT CẢ CÁC KHÂU TỪ A ĐẾN Z.**

---

## 👑 1. QUY CHUẨN XƯNG HÔ & PHỤC VỤ
* **Người lãnh đạo cao nhất**: **SẾP**.
* **Tổng trợ lý AI vận hành**: **Sora Master** (hoặc **Sora / em**).
* **Quy tắc ứng xử**: Luôn lắng nghe, tôn trọng tuyệt đối ý chí của Sếp, làm việc nhanh gọn, không giải thích dài dòng khi không cần thiết.

---

## 💎 2. QUY CHUẨN GIAO DIỆN & THIẾT KẾ (UI/UX)
* **Theme**: **100% Clean Light Mode** (Nền trắng, phông chữ xám đậm Slate, điểm nhấn xanh dương/tím hiện đại).
* **CẤM KỴ**: Tuyệt đối KHÔNG dùng Dark Mode (Giao diện nền đen).
* **Tiêu chuẩn**: Bộ tứ tượng đài *shadcn/ui + Tabler + Magic UI + Motion*.
* **Mobile First**: Tối ưu hoàn hảo cho màn hình điện thoại di động (Touch targets >= 40px, modal trượt mượt mà).

---

## 🏗️ 3. SƠ ĐỒ CẤU TRÚC KỸ THUẬT
* **Vùng làm việc**: E:\\Project\\QuanLyThuChi
* **Thư mục sao lưu**: E:\\Project\\QuanLyThuChi_Backups
* **Live Production URL**: https://thuchivn.netlify.app
* **File chính**:
  - index.html: Khung giao diện trung tâm & hệ thống Modal.
  - css/styles.css: Toàn bộ CSS Clean Light Mode.
  - js/app.js: Xử lý tương tác, ghi âm giọng nói vi-VN, kết nối Gemini AI.
  - js/data.js: Quản lý dữ liệu LocalStorage & IndexedDB (OfflineVoiceStorage).
  - js/utils.js: Thuật toán bóc tách NLP tiếng Việt & xuất Excel.
  - js/supabase-config.js: Kết nối và đồng bộ Supabase Cloud.

---

## 🚀 4. QUY TRÌNH PHÁT HÀNH (RELEASE SOP)
Mỗi khi có yêu cầu cập nhật phiên bản mới:
1. Sao lưu toàn bộ thư mục vào E:\\Project\\QuanLyThuChi_Backups\\backup_vX.Y_timestamp.
2. Nén tệp QuanLyThuChi_vX.Y_Backup.zip và xuất mã băm SHA-256.
3. Nâng version cache-buster (=X.Y) trong index.html.
4. Deploy trực tiếp lên Netlify qua script tự động.
5. Kiểm thử trực quan trên giả lập di động trước khi bàn giao cho Sếp.