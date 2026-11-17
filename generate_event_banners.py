import os
from PIL import Image, ImageDraw, ImageFont

# Danh sách 12 sự kiện từ ULIS Vibe
events = [
    {
        "id": "ev-01",
        "title": "Phương Pháp Viết Báo Cáo\nNghiên Cứu Khoa Học Sinh Viên 2026",
        "cert": "A1 • HỌC THUẬT & NCKH",
        "type": "HỘI THẢO CHUYÊN MÔN",
        "organizer": "Phòng KHCN & CLB SRC ULIS",
        "date": "20/11/2026 • 08:30",
        "location": "Hội trường Sunwah (Tầng 2)",
        "theme": {"bg1": (10, 30, 80), "bg2": (20, 70, 160), "badge_bg": (220, 240, 255), "badge_fg": (10, 40, 120), "accent": (245, 158, 11)}
    },
    {
        "id": "ev-02",
        "title": "Tuyển Quân Mùa Đông Gen 9\nĐội Lễ Tân Ngoại Ngữ URT",
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "type": "TUYỂN QUÂN CLB",
        "organizer": "Đội Lễ tân ULIS (URT)",
        "date": "25/11/2026 • Hạn chót: 23:59",
        "location": "Phòng 305 Nhà B2",
        "theme": {"bg1": (30, 27, 75), "bg2": (67, 56, 202), "badge_bg": (254, 243, 199), "badge_fg": (146, 64, 14), "accent": (236, 72, 153)}
    },
    {
        "id": "ev-03",
        "title": "Cuộc Thi Hùng Biện Tiếng Anh\nEnglish Challenge 2026 (Sơ loại)",
        "cert": "A1 • HỌC THUẬT & NCKH",
        "type": "CUỘC THI HỌC THUẬT",
        "organizer": "Khoa SPTA & CLB EC ULIS",
        "date": "28/11/2026 • 14:00",
        "location": "Hội trường Vũ Đình Liên",
        "theme": {"bg1": (15, 23, 42), "bg2": (29, 78, 216), "badge_bg": (224, 242, 254), "badge_fg": (3, 105, 161), "accent": (251, 191, 36)}
    },
    {
        "id": "ev-04",
        "title": "Chiến Dịch Tình Nguyện Mùa Đông\nĐông Ấm Vùng Cao 2026",
        "cert": "A3 • TÌNH NGUYỆN & XÃ HỘI",
        "type": "TUYỂN TÌNH NGUYỆN VIÊN",
        "organizer": "CLB Tình nguyện Hoa Đá ULIS",
        "date": "02/12/2026 • Xuất phát 18/12",
        "location": "Hoàng Su Phì, Hà Giang",
        "theme": {"bg1": (6, 78, 59), "bg2": (5, 150, 105), "badge_bg": (236, 253, 245), "badge_fg": (4, 120, 87), "accent": (254, 240, 138)}
    },
    {
        "id": "ev-05",
        "title": "Ngày Hội Việc Làm & Thực Tập\nULIS Job Fair 2026 (40+ Doanh nghiệp)",
        "cert": "A2 • KỸ NĂNG & HƯỚNG NGHIỆP",
        "type": "NGÀY HỘI TUYỂN DỤNG",
        "organizer": "Phòng CT&CT HSSV & FDI Partners",
        "date": "05/12/2026 • 07:30 - 16:30",
        "location": "Khuôn viên Sân nhà A1 & B2",
        "theme": {"bg1": (12, 74, 110), "bg2": (2, 132, 199), "badge_bg": (254, 243, 199), "badge_fg": (146, 64, 14), "accent": (56, 189, 248)}
    },
    {
        "id": "ev-06",
        "title": "Workshop Thiết Kế & Xây Dựng\nThương Hiệu Cá Nhân Trên LinkedIn",
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "type": "WORKSHOP KỸ NĂNG",
        "organizer": "CLB Truyền thông UMC ULIS",
        "date": "10/12/2026 • 19:00 - 21:30",
        "location": "Trực tuyến qua Zoom & Livestream",
        "theme": {"bg1": (24, 24, 27), "bg2": (59, 130, 246), "badge_bg": (254, 243, 199), "badge_fg": (146, 64, 14), "accent": (96, 165, 250)}
    },
    {
        "id": "ev-07",
        "title": "Đêm Nhạc Acoustic Mùa Đông\nVũ Khúc Thanh Xuân & Casting Vocal",
        "cert": "A3 • PHONG TRÀO NGHỆ THUẬT",
        "type": "ĐÊM NHẠC & CASTING",
        "organizer": "CLB Âm nhạc Hiện đại MMC",
        "date": "15/12/2026 • 18:30 - 21:30",
        "location": "Sân tượng đài Bác Hồ (Nhà A1)",
        "theme": {"bg1": (76, 29, 149), "bg2": (139, 92, 246), "badge_bg": (253, 230, 138), "badge_fg": (120, 53, 15), "accent": (244, 114, 182)}
    },
    {
        "id": "ev-08",
        "title": "Ngày Hội Hiến Máu Toàn Trường\nNắng Ngoại Ngữ 2026",
        "cert": "A3 • TÌNH NGUYỆN & NHÂN ĐẠO",
        "type": "HIẾN MÁU NHÂN ĐẠO",
        "organizer": "Đoàn TN - Hội SV ULIS & Viện Huyết học",
        "date": "22/12/2026 • 07:30 - 17:00",
        "location": "Sảnh tầng 1 Nhà A9",
        "theme": {"bg1": (136, 19, 55), "bg2": (225, 29, 72), "badge_bg": (255, 241, 242), "badge_fg": (159, 18, 57), "accent": (254, 205, 211)}
    },
    {
        "id": "ev-09",
        "title": "Tọa Đàm Chinh Phục Chứng Chỉ\nQuốc Tế HSK 6 & JLPT N1 Năm 2027",
        "cert": "A1 • HỌC THUẬT CHUYÊN MÔN",
        "type": "TỌA ĐÀM HỌC THUẬT",
        "organizer": "CLB Hán Ngữ HYC & CLB Hikari",
        "date": "08/01/2027 • 09:00 - 11:30",
        "location": "Phòng Hội thảo Quốc tế B3",
        "theme": {"bg1": (15, 23, 42), "bg2": (30, 64, 175), "badge_bg": (219, 234, 254), "badge_fg": (30, 58, 138), "accent": (245, 158, 11)}
    },
    {
        "id": "ev-10",
        "title": "Tuyển Thành Viên Kỳ Mùa Xuân\nCLB Bạn Đồng Hành Quốc Tế UBC",
        "cert": "A2 • GIAO LƯU QUỐC TẾ",
        "type": "TUYỂN QUÂN CLB",
        "organizer": "ULIS Buddy Club (UBC)",
        "date": "12/01/2027 • Hạn chót: 23:59",
        "location": "Online Form & P.102 Nhà A2",
        "theme": {"bg1": (19, 78, 74), "bg2": (13, 148, 136), "badge_bg": (254, 243, 199), "badge_fg": (146, 64, 14), "accent": (45, 212, 191)}
    },
    {
        "id": "ev-11",
        "title": "Giải Bóng Đá Nam - Nữ Sinh Viên\nULIS Cup 2027 Thường Niên",
        "cert": "A3 • PHONG TRÀO THỂ THAO",
        "type": "GIẢI ĐẤU TOÀN TRƯỜNG",
        "organizer": "Đoàn Trường & CLB Bóng đá UFC",
        "date": "16/01/2027 • Khai mạc 08:00",
        "location": "Sân Vận Động Ngoại Ngữ",
        "theme": {"bg1": (20, 83, 45), "bg2": (22, 163, 74), "badge_bg": (220, 252, 231), "badge_fg": (22, 101, 52), "accent": (250, 204, 21)}
    },
    {
        "id": "ev-12",
        "title": "Lễ Ra Mắt Chính Thức Nền Tảng\nULIS Vibe & Check-in QR Thông Minh",
        "cert": "A2 • KỸ NĂNG & CHUYỂN ĐỔI SỐ",
        "type": "SỰ KIỆN CÔNG NGHỆ",
        "organizer": "Bộ môn CNTT&TT & Nhóm 109",
        "date": "20/01/2027 • 14:30 - 17:00",
        "location": "Hội trường Sunwah & Livestream",
        "theme": {"bg1": (10, 25, 75), "bg2": (37, 99, 235), "badge_bg": (254, 243, 199), "badge_fg": (146, 64, 14), "accent": (245, 158, 11)}
    }
]

# Kích thước banner chuẩn 16:9 (800 x 450)
WIDTH, HEIGHT = 800, 450

# Fonts
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 30)
font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13)
font_meta = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15)
font_bold_meta = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
font_brand = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13)

# Logo ULIS
logo_path = "assets/ulis-logo.png"
ulis_logo = Image.open(logo_path).convert("RGBA") if os.path.exists(logo_path) else None
if ulis_logo:
    ulis_logo = ulis_logo.resize((65, 65), Image.Resampling.LANCZOS)

out_dir = "assets/events"
os.makedirs(out_dir, exist_ok=True)

for ev in events:
    img = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    t = ev["theme"]

    # 1. Vẽ nền Gradient mượt mà từ góc trên trái sang góc dưới phải
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(t["bg1"][0] * (1 - ratio) + t["bg2"][0] * ratio)
        g = int(t["bg1"][1] * (1 - ratio) + t["bg2"][1] * ratio)
        b = int(t["bg1"][2] * (1 - ratio) + t["bg2"][2] * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

    # 2. Họa tiết hình học tinh tế (subtle geometric circles & lines)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)

    # Vòng tròn mờ trang trí
    d_overlay.ellipse([550, -80, 880, 250], fill=(255, 255, 255, 15), outline=(255, 255, 255, 30), width=2)
    d_overlay.ellipse([620, -10, 810, 180], fill=(255, 255, 255, 12))
    d_overlay.ellipse([-80, 280, 180, 540], fill=(255, 255, 255, 10))

    # Lưới điểm trang trí góc phải
    for gx in range(650, 780, 18):
        for gy in range(320, 420, 18):
            d_overlay.ellipse([gx, gy, gx + 3, gy + 3], fill=(255, 255, 255, 35))

    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # 3. Top Header: Logo ULIS + Tên trường & Dự án
    if ulis_logo:
        img.paste(ulis_logo, (45, 35), ulis_logo)
    
    draw.text((122, 42), "TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN", font=font_brand, fill=(255, 255, 255, 230))
    draw.text((122, 65), "DỰ ÁN ULIS VIBE • KẾT NỐI SỰ KIỆN TOÀN TRƯỜNG", font=font_badge, fill=t["accent"])

    # 4. Badges (Cert & Type)
    cert_text = ev["cert"]
    type_text = ev["type"]

    # Cert badge pill
    cert_w = int(draw.textlength(cert_text, font=font_badge)) + 24
    draw.rounded_rectangle([45, 125, 45 + cert_w, 155], radius=6, fill=t["badge_bg"])
    draw.text((57, 132), cert_text, font=font_badge, fill=t["badge_fg"])

    # Type badge pill (Crisp white pill with dark text, perfectly legible)
    type_x = 55 + cert_w
    type_w = int(draw.textlength(type_text, font=font_badge)) + 24
    draw.rounded_rectangle([type_x, 125, type_x + type_w, 155], radius=6, fill=(241, 245, 249, 240), outline=(255, 255, 255, 200), width=1)
    draw.text((type_x + 12, 132), type_text, font=font_badge, fill=(15, 23, 42, 255))

    # 5. Tiêu đề sự kiện (Title)
    draw.text((45, 175), ev["title"], font=font_title, fill=(255, 255, 255, 255), spacing=10)

    # 6. Meta Information Bar (Date, Location, Organizer - Unicode safe without tofu characters)
    meta_box_y = 350
    draw.rounded_rectangle([45, meta_box_y, WIDTH - 45, meta_box_y + 65], radius=12, fill=(15, 23, 42, 220), outline=(255, 255, 255, 60), width=1)

    # Meta text: Thời gian, Địa điểm, Đơn vị
    time_str = f"LỊCH: {ev['date']}"
    loc_str = f"TẠI: {ev['location']}"
    org_str = f"BTC: {ev['organizer']}"

    draw.text((65, meta_box_y + 14), time_str, font=font_bold_meta, fill=(255, 255, 255, 255))
    draw.text((65, meta_box_y + 38), loc_str, font=font_meta, fill=(226, 232, 240, 240))
    draw.text((450, meta_box_y + 24), org_str, font=font_meta, fill=(241, 245, 249, 230))

    # 7. Lưu file WebP tối ưu & PNG
    out_file_webp = os.path.join(out_dir, f"{ev['id']}.webp")
    out_file_png = os.path.join(out_dir, f"{ev['id']}.png")
    
    img_rgb = img.convert("RGB")
    img_rgb.save(out_file_webp, "WEBP", quality=90)
    img_rgb.save(out_file_png, "PNG")

    print(f"Generated {ev['id']}: {out_file_webp} ({os.path.getsize(out_file_webp)} bytes)")

print("All 12 event banners successfully generated at 0 token cost!")
