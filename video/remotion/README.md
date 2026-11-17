# ULIS VIBE - Programmatic Video Presentation (Remotion & Opus 5.5)

Dự án dựng video giới thiệu đề án bài tập nhóm giữa kỳ học phần CNTT & Truyền thông:
- **Tên đề án:** ULIS VIBE - Cổng Sự Kiện, CLB & Tra Cứu Chuẩn Hóa Cert A1 - A2 - A3
- **Đơn vị:** Trường Đại học Ngoại ngữ – ĐHQGHN
- **Nhóm thực hiện:** Nhóm 109 - Lớp FLF1007
- **Thông số kỹ thuật video:**
  - Tỉ lệ: 16:9 Landscape
  - Độ phân giải: 1920x1080 (Full HD)
  - Tốc độ khung hình: 60 FPS
  - Thời lượng: 45 giây (2700 frames)
  - Phong cách: Modern Cyberpunk / Neo-Brutalist / Kinetic Typography & Synthwave Audio

---

## Cách Xem & Xuất Video

### Lựa chọn 1: Trình chiếu trực tiếp trên Web Browser (Không cần cài đặt gì thêm)
1. Mở trang studio tại: `http://localhost:5500/video/index.html`
2. Bấm nút **Play** ở giữa màn hình để thưởng thức toàn bộ 6 cảnh cùng âm thanh Synthwave và hiệu ứng âm thanh Whoosh khi chuyển cảnh.
3. Bấm nút **Xuất video MP4 (1080p 60fps)** để trình duyệt render và tự động tải file MP4 chất lượng cao về máy tính.

### Lựa chọn 2: Sử dụng Remotion CLI
```bash
cd video/remotion
npm install
npm run start     # Xem trước thời gian thực bằng Remotion Studio
npm run build     # Render xuất video mp4 chất lượng cao
```
