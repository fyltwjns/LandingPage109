"""
Master Cinematic Editorial Banner Generator for ULIS Vibe.
Generates 100% authentic, high-resolution photography banners for all 12 Events
and 17 Clubs, with deep contrast gradient scrims, professional university typography,
and zero visual clash or broken emoji glyphs.
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

font_univ = get_font(18, bold=True)
font_univ_sub = get_font(14, bold=False)
font_tag = get_font(18, bold=True)
font_title = get_font(42, bold=True)
font_title_sm = get_font(38, bold=True)
font_subtitle = get_font(22, bold=False)
font_meta = get_font(18, bold=True)

# ULIS Logo setup
logo_path = "assets/ulis-logo.png"
ulis_logo = None
if os.path.exists(logo_path):
    try:
        ulis_logo = Image.open(logo_path).convert("RGBA")
        ulis_logo = ulis_logo.resize((65, 65), Image.Resampling.LANCZOS)
    except Exception:
        ulis_logo = None

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

def crop_and_grade_photo(img, is_event=True):
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

    # Top dark vignette
    top_limit = 130 if is_event else 110
    for y in range(top_limit):
        a = int(160 * (1 - y / top_limit) ** 1.3)
        d_ov.line([(0, y), (CANVAS_W, y)], fill=(6, 16, 32, a))

    # Bottom deep navy gradient scrim (starts at y=230 with power 0.75 for fast contrast ramp)
    start_y = 230
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
# 12 AUTHENTIC EVENT PHOTOGRAPHS & METADATA
# ==============================================================================
events_list = [
    {
        "id": "ev-01",
        "photo_id": "photo-1524178232363-1fb2b075b655", # University lecture hall with presentation & students
        "cert": "A1 • HỌC THUẬT & NCKH",
        "accent": (37, 99, 235),
        "title": "Hội Thảo: Phương Pháp Viết Báo Cáo NCKH 2026",
        "subtitle": "Chuẩn hóa phương pháp luận, xử lý số liệu & công bố bài báo khoa học",
        "date": "20/11/2026 • 08:30 - 11:30",
        "location": "Hội trường Sunwah (Tầng 2)",
        "organizer": "Phòng KHCN & CLB SRC ULIS"
    },
    {
        "id": "ev-02",
        "photo_id": "photo-1511578314322-379afb476865", # Grand formal gala & reception ambassadors
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "accent": (217, 119, 6),
        "title": "Đợt Tuyển Quân Mùa Đông Gen 9 – Đội Lễ Tân URT",
        "subtitle": "Đại sứ hình ảnh, lễ tân khánh tiết các sự kiện cấp Quốc gia & ĐHQGHN",
        "date": "25/11/2026 • Đóng đơn 23:59",
        "location": "Phòng 305 Nhà B2 (Trực tiếp)",
        "organizer": "Đội Lễ tân Ngoại ngữ (URT)"
    },
    {
        "id": "ev-03",
        "photo_id": "photo-1475721027785-f74eccf877e2", # Podium stage speaker with warm spotlight
        "cert": "A1 • HỌC THUẬT & NCKH",
        "accent": (37, 99, 235),
        "title": "Cuộc Thi Hùng Biện Tiếng Anh English Challenge 2026",
        "subtitle": "Tranh biện tư duy phản biện, làm chủ diễn đàn & tích lũy minh chứng A1",
        "date": "28/11/2026 • 14:00 - 17:30",
        "location": "Hội trường Vũ Đình Liên",
        "organizer": "Khoa SPTA & CLB EC ULIS"
    },
    {
        "id": "ev-04",
        "photo_id": "photo-1528127269322-539801943592", # Vietnamese misty northern terraced mountains (Ha Giang)
        "cert": "A3 • TÌNH NGUYỆN & XÃ HỘI",
        "accent": (5, 150, 105),
        "title": "Chiến Dịch Tình Nguyện 'Đông Ấm Vùng Cao 2026'",
        "subtitle": "Xây dựng tủ sách học đường và trao gửi áo ấm cho điểm trường Mèo Vạc",
        "date": "02/12/2026 • Tuyển 50 TNV",
        "location": "Hoàng Su Phì, Hà Giang",
        "organizer": "CLB Tình nguyện Hoa Đá"
    },
    {
        "id": "ev-05",
        "photo_id": "photo-1515187029135-18ee286d815b", # Career fair networking & corporate exhibition
        "cert": "A2 • HƯỚNG NGHIỆP & VIỆC LÀM",
        "accent": (2, 132, 199),
        "title": "Ngày Hội Việc Làm & Thực Tập Quốc Tế ULIS Job Fair 2026",
        "subtitle": "40+ tập đoàn đa quốc gia phỏng vấn trực tiếp và trao cơ hội việc làm",
        "date": "05/12/2026 • 07:30 - 16:30",
        "location": "Sân nhà A1 & Giảng đường B2",
        "organizer": "Phòng CT&CT HSSV & FDI Partners"
    },
    {
        "id": "ev-06",
        "photo_id": "photo-1581291518857-4e27b48ff24e", # Designer workstation with UI wireframes & MacBook
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "accent": (37, 99, 235),
        "title": "Workshop: Kỹ Năng Thiết Kế & Xây Dựng Profile LinkedIn",
        "subtitle": "Tối ưu hồ sơ số chuyên nghiệp, nâng cấp portfolio và kết nối nhà tuyển dụng",
        "date": "10/12/2026 • 19:00 - 21:30",
        "location": "Trực tuyến qua Zoom & Livestream",
        "organizer": "CLB Truyền thông UMC ULIS"
    },
    {
        "id": "ev-07",
        "photo_id": "photo-1511671782779-c97d3d27a1d4", # Live acoustic stage microphone with warm bokeh
        "cert": "A3 • PHONG TRÀO NGHỆ THUẬT",
        "accent": (168, 85, 247),
        "title": "Đêm Nhạc Acoustic: 'Vũ Khúc Thanh Xuân' & Casting Vocal",
        "subtitle": "Hòa mình cùng giai điệu acoustic mộc mạc và casting vocal mới cho MMC",
        "date": "15/12/2026 • 18:30 - 21:30",
        "location": "Sân tượng đài Bác Hồ (A1)",
        "organizer": "CLB Âm nhạc Hiện đại MMC ULIS"
    },
    {
        "id": "ev-08",
        "photo_id": "photo-1615461066841-6116e61058f4", # Compassionate blood donation care
        "cert": "A3 • TÌNH NGUYỆN & NHÂN ĐẠO",
        "accent": (225, 29, 72),
        "title": "Ngày Hội Hiến Máu Toàn Trường: 'Nắng Ngoại Ngữ 2026'",
        "subtitle": "Một giọt máu cho đi – Một cuộc đời ở lại. Lan tỏa hơi ấm nhân ái sinh viên ULIS",
        "date": "22/12/2026 • 07:30 - 17:00",
        "location": "Sảnh tầng 1 Nhà A9",
        "organizer": "Đoàn TN - Hội SV & Viện Huyết học"
    },
    {
        "id": "ev-09",
        "photo_id": "photo-1456513080510-7bf3a84b82f8", # Language textbooks & library study desk
        "cert": "A1 • HỌC THUẬT & NCKH",
        "accent": (37, 99, 235),
        "title": "Tọa Đàm: Chiến Lược Chinh Phục HSK 6 & JLPT N1 Năm 2027",
        "subtitle": "Bí quyết đạt điểm số tối đa trong kỳ thi năng lực quốc tế tiếng Trung & Nhật",
        "date": "08/01/2027 • 09:00 - 11:30",
        "location": "Phòng Hội thảo Quốc tế B3",
        "organizer": "CLB Tiếng Trung HYC & CLB Tiếng Nhật Hikari"
    },
    {
        "id": "ev-10",
        "photo_id": "photo-1529156069898-49953e39b3ac", # Happy multicultural college friends outdoors
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "accent": (217, 119, 6),
        "title": "Tuyển Thành Viên Mùa Xuân 2027 – CLB Bạn Đồng Hành UBC",
        "subtitle": "Đồng hành cùng 200+ du học sinh quốc tế nhập học kỳ mùa Xuân tại ULIS",
        "date": "12/01/2027 • Đóng đơn 23:59",
        "location": "Phòng 102 Nhà A2 & Online",
        "organizer": "CLB ULIS Buddy Club (UBC)"
    },
    {
        "id": "ev-11",
        "photo_id": "photo-1579952363873-27f3bade9f55", # Football players in action on green pitch
        "cert": "A3 • PHONG TRÀO THỂ THAO",
        "accent": (22, 163, 74),
        "title": "Giải Bóng Đá Nam - Nữ Sinh Viên 'ULIS Cup 2027'",
        "subtitle": "16 đội tuyển tranh cúp vô địch và giao lưu thể thao ngoại ngữ toàn trường",
        "date": "16/01/2027 • Khai mạc 08:00",
        "location": "Sân Vận Động Ngoại Ngữ",
        "organizer": "Đoàn Trường & CLB UFC ULIS"
    },
    {
        "id": "ev-12",
        "photo_id": "photo-1505373877841-8d25f7d46678", # Tech keynote stage with glowing screens & presentation
        "cert": "A2 • KỸ NĂNG & NGOẠI KHÓA",
        "accent": (37, 99, 235),
        "title": "Lễ Ra Mắt Nền Tảng ULIS Vibe & Trải Nghiệm Check-in QR",
        "subtitle": "Công bố nền tảng số kết nối sự kiện, danh bạ CLB và chứng nhận A1-A2-A3",
        "date": "20/01/2027 • 14:30 - 17:00",
        "location": "Hội trường Sunwah (Tầng 2)",
        "organizer": "Bộ môn CNTT&TT & Nhóm 109"
    }
]

def render_event_poster(ev):
    raw_img = download_photo(ev["photo_id"])
    graded = crop_and_grade_photo(raw_img, is_event=True)
    d = ImageDraw.Draw(graded)

    # 1. Top-Left: ULIS Header (leaves top-right clear for HTML bookmark button)
    if ulis_logo:
        graded.paste(ulis_logo, (50, 32), ulis_logo)
    d.text((128, 36), "TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN", font=font_univ, fill=(255, 255, 255, 240))
    d.text((128, 62), "CỔNG THÔNG TIN SỰ KIỆN SỐ ULIS VIBE", font=font_univ_sub, fill=(147, 197, 253, 220))

    # 2. Bottom Content Area
    # Cert Capsule
    cert_text = ev["cert"].upper()
    tw = int(d.textlength(cert_text, font=font_tag)) + 24
    d.rounded_rectangle([50, 420, 50 + tw, 420 + 34], radius=6, fill=ev["accent"])
    d.text((62, 426), cert_text, font=font_tag, fill=(255, 255, 255))

    # Title
    font_t = font_title if len(ev["title"]) < 45 else font_title_sm
    draw_shadowed_text(d, (50, 470), ev["title"], font_t, fill=(255, 255, 255), shadow=(0, 0, 0, 240), offset=(2, 2))

    # Subtitle
    d.text((50, 545), ev["subtitle"], font=font_subtitle, fill=(226, 232, 240))

    # Metadata Line (Clean typography with dots, no broken emojis)
    meta_text = f"{ev['date']}  •  {ev['location']}  •  {ev['organizer']}"
    d.text((50, 600), meta_text, font=font_meta, fill=(148, 163, 184))

    out_base = os.path.join(EVENTS_DIR, ev["id"])
    save_dual_asset(graded, out_base)


# ==============================================================================
# 17 AUTHENTIC CLUB PHOTOGRAPHS & METADATA
# ==============================================================================
clubs_list = [
    {
        "id": "ec-ulis",
        "photo_id": "photo-1523240795612-9a054b0db644", # English speaking students studying in library
        "name": "CLB Tiếng Anh",
        "acronym": "EC ULIS",
        "category": "CLB Học Thuật",
        "slogan": "Connect, Inspire, Empower through English",
        "status": "Đang mở đơn Gen 24",
        "accent": (37, 99, 235)
    },
    {
        "id": "src-ulis",
        "photo_id": "photo-1532094349884-543bc11b234d", # Research science lab & student data
        "name": "CLB Nghiên cứu Khoa học Sinh viên",
        "acronym": "SRC ULIS",
        "category": "CLB Học Thuật",
        "slogan": "Nurturing Academic Passion & Research Excellence",
        "status": "Mở đề tài NCKH 2026",
        "accent": (37, 99, 235)
    },
    {
        "id": "chinese-club",
        "photo_id": "photo-1547981609-4b6bfe67ca0b", # Chinese Forbidden City & cultural heritage
        "name": "CLB Tiếng Trung (Hán Ngữ)",
        "acronym": "HANYU CLUB",
        "category": "CLB Học Thuật",
        "slogan": "Khám phá chiều sâu ngôn ngữ & văn hóa Trung Hoa",
        "status": "Đang mở đơn Gen 12",
        "accent": (225, 29, 72)
    },
    {
        "id": "japanese-club",
        "photo_id": "photo-1493976040374-85c8e12f0c0e", # Kyoto pagoda & Japanese traditional setting
        "name": "CLB Tiếng Nhật Hikari",
        "acronym": "HIKARI ULIS",
        "category": "CLB Học Thuật",
        "slogan": "Lan tỏa nét đẹp văn hóa và tình yêu xứ sở hoa anh đào",
        "status": "Đang mở đơn Gen 15",
        "accent": (225, 29, 72)
    },
    {
        "id": "korean-club",
        "photo_id": "photo-1538485399081-7191377e8241", # Seoul Korean aesthetic & culture
        "name": "CLB Tiếng Hàn & Văn Hóa Hàn Quốc",
        "acronym": "K-ULIS",
        "category": "CLB Học Thuật",
        "slogan": "Cầu nối văn hóa và lan tỏa làn sóng Hallyu tại ULIS",
        "status": "Đang tuyển thành viên K-Fest",
        "accent": (37, 99, 235)
    },
    {
        "id": "translation-club",
        "photo_id": "photo-1587825140708-dfaf72ae4b04", # International conference interpreting booth & headsets
        "name": "CLB Biên Phiên Dịch Trẻ",
        "acronym": "YTC ULIS",
        "category": "CLB Học Thuật",
        "slogan": "Bridging Languages, Connecting Cultures",
        "status": "Tuyển dịch thuật viên Gen 10",
        "accent": (14, 116, 144)
    },
    {
        "id": "mmc-ulis",
        "photo_id": "photo-1514525253161-7a46d19cd819", # Live concert band performance & stage lights
        "name": "CLB Âm Nhạc Hiện Đại",
        "acronym": "MMC ULIS",
        "category": "Sở Thích & Năng Khiếu",
        "slogan": "Nơi âm nhạc xóa nhòa mọi ranh giới ngôn ngữ",
        "status": "Đang mở đơn Casting Vocal/Band",
        "accent": (147, 51, 234)
    },
    {
        "id": "udc-ulis",
        "photo_id": "photo-1508700929628-666bc8bd84ea", # Street dance crew handstand freeze on neon stage
        "name": "CLB Vũ Đạo Ngoại Ngữ",
        "acronym": "UDC ULIS",
        "category": "Sở Thích & Năng Khiếu",
        "slogan": "Dance with Passion, Shine with Rhythm",
        "status": "Tập luyện giải đấu mùa đông",
        "accent": (234, 88, 12)
    },
    {
        "id": "umc-ulis",
        "photo_id": "photo-1516035069371-29a1b244cc32", # Professional DSLR camera & cinematic lens
        "name": "CLB Truyền Thông & Nhiếp Ảnh",
        "acronym": "UMC ULIS",
        "category": "Sở Thích & Năng Khiếu",
        "slogan": "Lưu giữ từng khoảnh khắc thanh xuân dưới mái trường ULIS",
        "status": "Mở đơn Media Gen 12",
        "accent": (217, 119, 6)
    },
    {
        "id": "ufc-ulis",
        "photo_id": "photo-1517927033932-b3d18e61fb3a", # Soccer football players on green field
        "name": "CLB Bóng Đá Sinh Viên",
        "acronym": "UFC ULIS",
        "category": "Sở Thích & Năng Khiếu",
        "slogan": "Đoàn kết – Cống hiến – Hết mình vì màu cờ sắc áo",
        "status": "Tuyển bổ sung vị trí thi đấu",
        "accent": (22, 163, 74)
    },
    {
        "id": "drama-club",
        "photo_id": "photo-1514306191717-452ec28c7814", # Theatrical stage velvet red curtains & footlights
        "name": "CLB Kịch Nghệ & Điện Ảnh",
        "acronym": "DRAMA CLUB",
        "category": "Sở Thích & Năng Khiếu",
        "slogan": "Sân khấu là nơi hiện thực hóa những giấc mơ nghệ thuật",
        "status": "Tuyển diễn viên kịch mùa đông",
        "accent": (147, 51, 234)
    },
    {
        "id": "reception-team",
        "photo_id": "photo-1511795409834-ef04bbd61622", # Formal diplomatic reception ambassadors
        "name": "Đội Lễ Tân Ngoại Ngữ",
        "acronym": "URT ULIS",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Thanh lịch – Tận tâm – Tỏa sáng phong thái Ngoại ngữ",
        "status": "Đang mở đơn Tuyển quân Gen 9",
        "accent": (217, 119, 6)
    },
    {
        "id": "volunteer-club",
        "photo_id": "photo-1488521787991-ed7bbaae773c", # Cheerful volunteers caring for children
        "name": "CLB Tình Nguyện Hoa Đá",
        "acronym": "HOA ĐÁ ULIS",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Sống để cống hiến, sẻ chia để yêu thương đong đầy",
        "status": "Mở đơn Chiến dịch Đông Ấm",
        "accent": (5, 150, 105)
    },
    {
        "id": "youth-taskforce",
        "photo_id": "photo-1529156069898-49953e39b3ac", # Dynamic student youth team outdoors
        "name": "Đội Thanh Niên Xung Kích",
        "acronym": "TNXK ULIS",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Tiên phong – Gương mẫu – Bản lĩnh sinh viên Ngoại ngữ",
        "status": "Tập huấn nghiệp vụ an ninh sự kiện",
        "accent": (37, 99, 235)
    },
    {
        "id": "soft-skills-club",
        "photo_id": "photo-1552664730-d307ca884978", # Leadership workshop & design thinking
        "name": "CLB Kỹ Năng Mềm & Hướng Nghiệp",
        "acronym": "SSC ULIS",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Làm chủ kỹ năng thế kỷ 21 – Tự tin hội nhập toàn cầu",
        "status": "Đang mở đơn Workshop Leader",
        "accent": (217, 119, 6)
    },
    {
        "id": "blood-donation",
        "photo_id": "photo-1579684385127-1ef15d508118", # Compassionate medical care & blood donor support
        "name": "CLB Hiến Máu Nhân Đạo (Đội Máu)",
        "acronym": "ĐỘI MÁU ULIS",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Một giọt máu cho đi – Một cuộc đời ở lại",
        "status": "Mở đơn Ngày Hội Nắng Ngoại Ngữ",
        "accent": (225, 29, 72)
    },
    {
        "id": "buddy-club",
        "photo_id": "photo-1517486808906-6ca8b3f04846", # Multiracial international exchange friends
        "name": "CLB Bạn Đồng Hành Quốc Tế",
        "acronym": "BUDDY CLUB",
        "category": "Kỹ Năng & Tình Nguyện",
        "slogan": "Be a Buddy, Make Global Friends",
        "status": "Tuyển Buddy Mùa Xuân 2027",
        "accent": (13, 148, 136)
    }
]

def render_club_poster(c):
    raw_img = download_photo(c["photo_id"])
    graded = crop_and_grade_photo(raw_img, is_event=False)
    d = ImageDraw.Draw(graded)

    # Note: Top area left clean so HTML category badge and acronym pill sit without collision!

    # Bottom Content Area
    # 1. Category Capsule
    tag_text = c["category"].upper()
    tw = int(d.textlength(tag_text, font=font_tag)) + 24
    d.rounded_rectangle([50, 420, 50 + tw, 420 + 34], radius=6, fill=c["accent"])
    d.text((62, 426), tag_text, font=font_tag, fill=(255, 255, 255))

    # 2. Club Headline
    title_text = f"{c['name']} • {c['acronym']}"
    font_t = font_title if len(title_text) < 42 else font_title_sm
    draw_shadowed_text(d, (50, 470), title_text, font_t, fill=(255, 255, 255), shadow=(0, 0, 0, 240), offset=(2, 2))

    # 3. Slogan
    d.text((50, 545), f"\"{c['slogan']}\"", font=font_subtitle, fill=(254, 243, 199))

    # 4. Clean Metadata Line (Clean middle dots, no broken emojis)
    meta_line = f"ULIS - ĐHQGHN  •  Thành lập 2002  •  Trạng thái: {c['status']}"
    d.text((50, 600), meta_line, font=font_meta, fill=(148, 163, 184))

    out_base = os.path.join(CLUBS_DIR, c["id"])
    save_dual_asset(graded, out_base)

def main():
    print("=== STARTING CINEMATIC EDITORIAL BANNERS GENERATION ===")
    print(f"Generating {len(events_list)} real-photography Event posters...")
    for idx, ev in enumerate(events_list):
        print(f"[{idx+1}/{len(events_list)}] Processing Event: {ev['id']} ({ev['title']})...")
        render_event_poster(ev)

    print(f"\nGenerating {len(clubs_list)} real-photography Club posters...")
    for idx, club in enumerate(clubs_list):
        print(f"[{idx+1}/{len(clubs_list)}] Processing Club: {club['id']} ({club['name']})...")
        render_club_poster(club)

    print("\n=== FINISHED! ALL 29 EDITORIAL REAL PHOTOGRAPHY BANNERS GENERATED ===")

if __name__ == "__main__":
    main()
