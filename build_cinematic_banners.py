"""
Master Cinematic Editorial Banner Generator for ULIS Vibe.
Generates 100% authentic, high-resolution photography banners for all 12 Events
and 17 Clubs, with deep contrast gradient scrims, professional university typography,
ZERO visual clutter, and NO tags/stickers on the illustration photos.
"""

import os
import io
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

# Directories
CACHE_DIR = "assets/.photo_cache"
EVENTS_DIR = "assets/events"
CLUBS_DIR = "assets/clubs"
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(EVENTS_DIR, exist_ok=True)
os.makedirs(CLUBS_DIR, exist_ok=True)

# High-DPI Canvas Dimensions (downscaled to 800x450 retina)
CANVAS_W, CANVAS_H = 1200, 675
FINAL_W, FINAL_H = 800, 450

# Font loader
def get_font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title = get_font(44, bold=True)
font_title_sm = get_font(39, bold=True)
font_subtitle = get_font(23, bold=False)
font_meta = get_font(18, bold=True)

def download_photo(photo_id):
    cache_path = os.path.join(CACHE_DIR, f"{photo_id}.jpg")
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 10000:
        try:
            return Image.open(cache_path).convert("RGBA")
        except Exception:
            pass
    
    url = f"https://images.unsplash.com/{photo_id}?w=1200&q=85&auto=format&fit=crop"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
        with open(cache_path, "wb") as f:
            f.write(data)
        return Image.open(io.BytesIO(data)).convert("RGBA")

def crop_and_grade_photo(img):
    # 1. Aspect Crop to 16:9
    img_ratio = img.width / img.height
    target_ratio = CANVAS_W / CANVAS_H
    if img_ratio > target_ratio:
        new_w = int(img.height * target_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        new_h = int(img.width / target_ratio)
        top = (img.height - new_h) // 2
        img = img.crop((0, top, img.width, top + new_h))
    
    img = img.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)

    # 2. Subtle contrast enhancement
    enhancer = ImageEnhance.Contrast(img.convert("RGB"))
    img_graded = enhancer.enhance(1.10).convert("RGBA")

    # 3. Composite Scrim
    overlay = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    d_ov = ImageDraw.Draw(overlay)

    # Top subtle dark vignette (for natural photo framing)
    for y in range(100):
        a = int(120 * (1 - y / 100) ** 1.3)
        d_ov.line([(0, y), (CANVAS_W, y)], fill=(6, 16, 32, a))

    # Bottom deep navy gradient scrim (starts at y=260 with power 0.75 for smooth, rich contrast)
    start_y = 260
    for y in range(start_y, CANVAS_H):
        r = (y - start_y) / (CANVAS_H - start_y)
        a = int(250 * (r ** 0.75))
        d_ov.line([(0, y), (CANVAS_W, y)], fill=(6, 16, 32, a))

    # Subtle bottom accent line
    d_ov.line([(0, CANVAS_H - 4), (CANVAS_W, CANVAS_H - 4)], fill=(59, 130, 246, 220), width=4)

    return Image.alpha_composite(img_graded, overlay)

def draw_shadowed_text(d, pos, text, font, fill=(255, 255, 255), shadow=(0, 0, 0, 240), offset=(2, 2), spacing=6):
    x, y = pos
    d.text((x + offset[0], y + offset[1]), text, font=font, fill=shadow, spacing=spacing)
    d.text((x, y), text, font=font, fill=fill, spacing=spacing)

def save_dual_asset(im, out_base_path):
    resized = im.resize((FINAL_W, FINAL_H), Image.Resampling.LANCZOS)
    rgb_im = resized.convert("RGB")
    webp_path = f"{out_base_path}.webp"
    png_path = f"{out_base_path}.png"
    rgb_im.save(webp_path, "WEBP", quality=94)
    rgb_im.save(png_path, "PNG")
    print(f"Saved: {webp_path}")

# ==============================================================================
# 12 AUTHENTIC EVENT PHOTOGRAPHS (TAGS REMOVED, HIGH-END EDITORIAL)
# ==============================================================================
events_list = [
    {
        "id": "ev-01",
        "photo_id": "photo-1524178232363-1fb2b075b655", # University lecture hall with presentation & students
        "title": "Hội Thảo: Phương Pháp Viết Báo Cáo NCKH 2026",
        "subtitle": "Chuẩn hóa phương pháp luận, xử lý số liệu & công bố bài báo khoa học",
        "date": "20/11/2026 • 08:30 - 11:30",
        "location": "Hội trường Sunwah (Tầng 2)",
        "organizer": "Phòng KHCN & CLB SRC ULIS"
    },
    {
        "id": "ev-02",
        "photo_id": "photo-1523580494863-6f3031224c94", # Two student MCs / ambassadors hosting university gala
        "title": "Đợt Tuyển Quân Mùa Đông Gen 9 – Đội Lễ Tân URT",
        "subtitle": "Đại sứ hình ảnh, lễ tân khánh tiết các sự kiện cấp Quốc gia & ĐHQGHN",
        "date": "25/11/2026 • Đóng đơn 23:59",
        "location": "Phòng 305 Nhà B2 (Trực tiếp)",
        "organizer": "Đội Lễ tân Ngoại ngữ (URT)"
    },
    {
        "id": "ev-03",
        "photo_id": "photo-1544531585-9847b68c8c86", # Debaters on stage with microphones facing packed university auditorium
        "title": "Cuộc Thi Hùng Biện Tiếng Anh English Challenge 2026",
        "subtitle": "Tranh biện tư duy phản biện, làm chủ diễn đàn & tích lũy minh chứng A1",
        "date": "28/11/2026 • 14:00 - 17:30",
        "location": "Hội trường Vũ Đình Liên",
        "organizer": "Khoa SPTA & CLB EC ULIS"
    },
    {
        "id": "ev-04",
        "photo_id": "photo-1528127269322-539801943592", # Vietnamese misty northern terraced mountains (Ha Giang)
        "title": "Chiến Dịch Tình Nguyện 'Đông Ấm Vùng Cao 2026'",
        "subtitle": "Xây dựng tủ sách học đường và trao gửi áo ấm cho điểm trường Mèo Vạc",
        "date": "02/12/2026 • Tuyển 50 TNV",
        "location": "Hoàng Su Phì, Hà Giang",
        "organizer": "CLB Tình nguyện Hoa Đá"
    },
    {
        "id": "ev-05",
        "photo_id": "photo-1515187029135-18ee286d815b", # Career fair networking & corporate exhibition
        "title": "Ngày Hội Việc Làm & Thực Tập Quốc Tế ULIS Job Fair 2026",
        "subtitle": "40+ tập đoàn đa quốc gia phỏng vấn trực tiếp và trao cơ hội việc làm",
        "date": "05/12/2026 • 07:30 - 16:30",
        "location": "Sân nhà A1 & Giảng đường B2",
        "organizer": "Phòng CT&CT HSSV & FDI Partners"
    },
    {
        "id": "ev-06",
        "photo_id": "photo-1581291518857-4e27b48ff24e", # Designer workstation with UI wireframes & MacBook
        "title": "Workshop: Kỹ Năng Thiết Kế & Xây Dựng Profile LinkedIn",
        "subtitle": "Tối ưu hồ sơ số chuyên nghiệp, nâng cấp portfolio và kết nối nhà tuyển dụng",
        "date": "10/12/2026 • 19:00 - 21:30",
        "location": "Trực tuyến qua Zoom & Livestream",
        "organizer": "CLB Truyền thông UMC ULIS"
    },
    {
        "id": "ev-07",
        "photo_id": "photo-1511671782779-c97d3d27a1d4", # Live acoustic stage microphone with warm bokeh
        "title": "Đêm Nhạc Acoustic: 'Vũ Khúc Thanh Xuân' & Casting Vocal",
        "subtitle": "Hòa mình cùng giai điệu acoustic mộc mạc và casting vocal mới cho MMC",
        "date": "15/12/2026 • 18:30 - 21:30",
        "location": "Sân tượng đài Bác Hồ (A1)",
        "organizer": "CLB Âm nhạc Hiện đại MMC ULIS"
    },
    {
        "id": "ev-08",
        "photo_id": "photo-1615461066841-6116e61058f4", # Compassionate blood donation care
        "title": "Ngày Hội Hiến Máu Toàn Trường: 'Nắng Ngoại Ngữ 2026'",
        "subtitle": "Một giọt máu cho đi – Một cuộc đời ở lại. Lan tỏa hơi ấm nhân ái sinh viên ULIS",
        "date": "22/12/2026 • 07:30 - 17:00",
        "location": "Sảnh tầng 1 Nhà A9",
        "organizer": "Đoàn TN - Hội SV & Viện Huyết học"
    },
    {
        "id": "ev-09",
        "photo_id": "photo-1456513080510-7bf3a84b82f8", # Language textbooks & library study desk
        "title": "Tọa Đàm: Chiến Lược Chinh Phục HSK 6 & JLPT N1 Năm 2027",
        "subtitle": "Bí quyết đạt điểm số tối đa trong kỳ thi năng lực quốc tế tiếng Trung & Nhật",
        "date": "08/01/2027 • 09:00 - 11:30",
        "location": "Phòng Hội thảo Quốc tế B3",
        "organizer": "CLB Tiếng Trung HYC & CLB Tiếng Nhật Hikari"
    },
    {
        "id": "ev-10",
        "photo_id": "photo-1529156069898-49953e39b3ac", # Happy multicultural college friends outdoors
        "title": "Tuyển Thành Viên Mùa Xuân 2027 – CLB Bạn Đồng Hành UBC",
        "subtitle": "Đồng hành cùng 200+ du học sinh quốc tế nhập học kỳ mùa Xuân tại ULIS",
        "date": "12/01/2027 • Đóng đơn 23:59",
        "location": "Phòng 102 Nhà A2 & Online",
        "organizer": "CLB ULIS Buddy Club (UBC)"
    },
    {
        "id": "ev-11",
        "photo_id": "photo-1579952363873-27f3bade9f55", # Football players in action on green pitch
        "title": "Giải Bóng Đá Nam - Nữ Sinh Viên 'ULIS Cup 2027'",
        "subtitle": "16 đội tuyển tranh cúp vô địch và giao lưu thể thao ngoại ngữ toàn trường",
        "date": "16/01/2027 • Khai mạc 08:00",
        "location": "Sân Vận Động Ngoại Ngữ",
        "organizer": "Đoàn Trường & CLB UFC ULIS"
    },
    {
        "id": "ev-12",
        "photo_id": "photo-1505373877841-8d25f7d46678", # Tech keynote stage with glowing screens & presentation
        "title": "Lễ Ra Mắt Nền Tảng ULIS Vibe & Trải Nghiệm Check-in QR",
        "subtitle": "Công bố nền tảng số kết nối sự kiện, danh bạ CLB và chứng nhận A1-A2-A3",
        "date": "20/01/2027 • 14:30 - 17:00",
        "location": "Hội trường Sunwah (Tầng 2)",
        "organizer": "Bộ môn CNTT&TT & Nhóm 109"
    }
]

def render_event_poster(ev):
    raw_img = download_photo(ev["photo_id"])
    graded = crop_and_grade_photo(raw_img)
    d = ImageDraw.Draw(graded)

    # Note: NO tags or watermarks at the top, leaving photo pure and clean.
    # Bottom Content Area (Comfortably spaced on deep navy gradient scrim)
    title_y = 445
    font_t = font_title if len(ev["title"]) < 46 else font_title_sm
    draw_shadowed_text(d, (50, title_y), ev["title"], font_t, fill=(255, 255, 255), shadow=(0, 0, 0, 240), offset=(2, 2))

    # Subtitle
    d.text((50, title_y + 75), ev["subtitle"], font=font_subtitle, fill=(226, 232, 240))

    # Metadata Line (Clean typography with dots, no broken emojis)
    meta_text = f"{ev['date']}  •  {ev['location']}  •  {ev['organizer']}"
    d.text((50, title_y + 140), meta_text, font=font_meta, fill=(148, 163, 184))

    out_base = os.path.join(EVENTS_DIR, ev["id"])
    save_dual_asset(graded, out_base)


# ==============================================================================
# 17 AUTHENTIC CLUB PHOTOGRAPHS (TAGS REMOVED, HIGH-END EDITORIAL)
# ==============================================================================
clubs_list = [
    {
        "id": "ec-ulis",
        "photo_id": "photo-1523240795612-9a054b0db644", # English speaking students studying in library
        "name": "CLB Tiếng Anh",
        "acronym": "EC ULIS",
        "slogan": "Connect, Inspire, Empower through English",
        "status": "Đang mở đơn Gen 24"
    },
    {
        "id": "src-ulis",
        "photo_id": "photo-1522202176988-66273c2fd55f", # University students collaborating with laptops & books in study library
        "name": "CLB Nghiên cứu Khoa học Sinh viên",
        "acronym": "SRC ULIS",
        "slogan": "Nurturing Academic Passion & Research Excellence",
        "status": "Mở đề tài NCKH 2026"
    },
    {
        "id": "chinese-club",
        "photo_id": "photo-1547981609-4b6bfe67ca0b", # Chinese Forbidden City & cultural heritage
        "name": "CLB Tiếng Trung (Hán Ngữ)",
        "acronym": "HANYU CLUB",
        "slogan": "Khám phá chiều sâu ngôn ngữ & văn hóa Trung Hoa",
        "status": "Đang mở đơn Gen 12"
    },
    {
        "id": "japanese-club",
        "photo_id": "photo-1493976040374-85c8e12f0c0e", # Kyoto pagoda & Japanese traditional setting
        "name": "CLB Tiếng Nhật Hikari",
        "acronym": "HIKARI ULIS",
        "slogan": "Lan tỏa nét đẹp văn hóa và tình yêu xứ sở hoa anh đào",
        "status": "Đang mở đơn Gen 15"
    },
    {
        "id": "korean-club",
        "photo_id": "photo-1548115184-bc6544d06a58", # Bukchon Hanok Village Seoul traditional Korean tiled roofs & golden sunset
        "name": "CLB Tiếng Hàn & Văn Hóa Hàn Quốc",
        "acronym": "K-ULIS",
        "slogan": "Cầu nối văn hóa và lan tỏa làn sóng Hallyu tại ULIS",
        "status": "Đang tuyển thành viên K-Fest"
    },
    {
        "id": "translation-club",
        "photo_id": "photo-1455390582262-044cdead277a", # Fountain pen writing translation on lined manuscript paper
        "name": "CLB Biên Phiên Dịch Trẻ",
        "acronym": "YTC ULIS",
        "slogan": "Bridging Languages, Connecting Cultures",
        "status": "Tuyển dịch thuật viên Gen 10"
    },
    {
        "id": "mmc-ulis",
        "photo_id": "photo-1514525253161-7a46d19cd819", # Live concert band performance & stage lights
        "name": "CLB Âm Nhạc Hiện Đại",
        "acronym": "MMC ULIS",
        "slogan": "Nơi âm nhạc xóa nhòa mọi ranh giới ngôn ngữ",
        "status": "Đang mở đơn Casting Vocal/Band"
    },
    {
        "id": "udc-ulis",
        "photo_id": "photo-1508700929628-666bc8bd84ea", # Street dance crew handstand freeze on neon stage
        "name": "CLB Vũ Đạo Ngoại Ngữ",
        "acronym": "UDC ULIS",
        "slogan": "Dance with Passion, Shine with Rhythm",
        "status": "Tập luyện giải đấu mùa đông"
    },
    {
        "id": "umc-ulis",
        "photo_id": "photo-1516035069371-29a1b244cc32", # Professional DSLR camera & cinematic lens
        "name": "CLB Truyền Thông & Nhiếp Ảnh",
        "acronym": "UMC ULIS",
        "slogan": "Lưu giữ từng khoảnh khắc thanh xuân dưới mái trường ULIS",
        "status": "Mở đơn Media Gen 12"
    },
    {
        "id": "ufc-ulis",
        "photo_id": "photo-1517927033932-b3d18e61fb3a", # Soccer football players on green field
        "name": "CLB Bóng Đá Sinh Viên",
        "acronym": "UFC ULIS",
        "slogan": "Đoàn kết – Cống hiến – Hết mình vì màu cờ sắc áo",
        "status": "Tuyển bổ sung vị trí thi đấu"
    },
    {
        "id": "drama-club",
        "photo_id": "photo-1514306191717-452ec28c7814", # Theatrical stage velvet red curtains & footlights
        "name": "CLB Kịch Nghệ & Điện Ảnh",
        "acronym": "DRAMA CLUB",
        "slogan": "Sân khấu là nơi hiện thực hóa những giấc mơ nghệ thuật",
        "status": "Tuyển diễn viên kịch mùa đông"
    },
    {
        "id": "reception-team",
        "photo_id": "photo-1573496359142-b8d87734a5a2", # Smart, elegant female student ambassador in blazer smiling warmly
        "name": "Đội Lễ Tân Ngoại Ngữ",
        "acronym": "URT ULIS",
        "slogan": "Thanh lịch – Tận tâm – Tỏa sáng phong thái Ngoại ngữ",
        "status": "Đang mở đơn Tuyển quân Gen 9"
    },
    {
        "id": "volunteer-club",
        "photo_id": "photo-1488521787991-ed7bbaae773c", # Cheerful volunteers caring for children
        "name": "CLB Tình Nguyện Hoa Đá",
        "acronym": "HOA ĐÁ ULIS",
        "slogan": "Sống để cống hiến, sẻ chia để yêu thương đong đầy",
        "status": "Mở đơn Chiến dịch Đông Ấm"
    },
    {
        "id": "youth-taskforce",
        "photo_id": "photo-1582213782179-e0d53f98f2ca", # Dynamic youth team with hands stacked together in center circle
        "name": "Đội Thanh Niên Xung Kích",
        "acronym": "TNXK ULIS",
        "slogan": "Tiên phong – Gương mẫu – Bản lĩnh sinh viên Ngoại ngữ",
        "status": "Tập huấn nghiệp vụ an ninh sự kiện"
    },
    {
        "id": "soft-skills-club",
        "photo_id": "photo-1552664730-d307ca884978", # Leadership workshop & design thinking
        "name": "CLB Kỹ Năng Mềm & Hướng Nghiệp",
        "acronym": "SSC ULIS",
        "slogan": "Làm chủ kỹ năng thế kỷ 21 – Tự tin hội nhập toàn cầu",
        "status": "Đang mở đơn Workshop Leader"
    },
    {
        "id": "blood-donation",
        "photo_id": "photo-1544027993-37dbfe43562a", # Two hands reaching out to connect and support in life-saving solidarity
        "name": "CLB Hiến Máu Nhân Đạo (Đội Máu)",
        "acronym": "ĐỘI MÁU ULIS",
        "slogan": "Một giọt máu cho đi – Một cuộc đời ở lại",
        "status": "Mở đơn Ngày Hội Nắng Ngoại Ngữ"
    },
    {
        "id": "buddy-club",
        "photo_id": "photo-1517486808906-6ca8b3f04846", # Multiracial international exchange friends
        "name": "CLB Bạn Đồng Hành Quốc Tế",
        "acronym": "BUDDY CLUB",
        "slogan": "Be a Buddy, Make Global Friends",
        "status": "Tuyển Buddy Mùa Xuân 2027"
    }
]

def render_club_poster(c):
    raw_img = download_photo(c["photo_id"])
    graded = crop_and_grade_photo(raw_img)
    d = ImageDraw.Draw(graded)

    # Note: NO tags or watermarks at the top, leaving photo pure and clean.
    # Bottom Content Area
    title_y = 445
    title_text = f"{c['name']} • {c['acronym']}"
    font_t = font_title if len(title_text) < 42 else font_title_sm
    draw_shadowed_text(d, (50, title_y), title_text, font_t, fill=(255, 255, 255), shadow=(0, 0, 0, 240), offset=(2, 2))

    # Slogan
    d.text((50, title_y + 75), f"\"{c['slogan']}\"", font=font_subtitle, fill=(254, 243, 199))

    # Metadata Line (Clean middle dots, no broken emojis)
    meta_line = f"ULIS - ĐHQGHN  •  Thành lập 2002  •  Trạng thái: {c['status']}"
    d.text((50, title_y + 140), meta_line, font=font_meta, fill=(148, 163, 184))

    out_base = os.path.join(CLUBS_DIR, c["id"])
    save_dual_asset(graded, out_base)

def main():
    print("=== STARTING CINEMATIC EDITORIAL BANNERS GENERATION (NO TAGS) ===")
    print(f"Generating {len(events_list)} real-photography Event posters...")
    for idx, ev in enumerate(events_list):
        print(f"[{idx+1}/{len(events_list)}] Processing Event: {ev['id']} ({ev['title']})...")
        render_event_poster(ev)

    print(f"\nGenerating {len(clubs_list)} real-photography Club posters...")
    for idx, club in enumerate(clubs_list):
        print(f"[{idx+1}/{len(clubs_list)}] Processing Club: {club['id']} ({club['name']})...")
        render_club_poster(club)

    print("\n=== FINISHED! ALL 29 BANNERS GENERATED WITHOUT TAGS ===")

if __name__ == "__main__":
    main()
