"""
Generate deeply personalized, high-aesthetic banners for ALL 12 Events and 17 Clubs in ULIS Vibe.
Zero external API dependencies, zero tokens, 100% offline, crisp 2x supersampled (1600x900 -> 800x450).
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

# Set up output directories
os.makedirs("assets/events", exist_ok=True)
os.makedirs("assets/clubs", exist_ok=True)

WIDTH, HEIGHT = 1600, 900
FINAL_WIDTH, FINAL_HEIGHT = 800, 450

# Fonts setup with fallback
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

font_brand = get_font(24, bold=True)
font_badge = get_font(24, bold=True)
font_badge_sm = get_font(20, bold=True)
font_title_lg = get_font(52, bold=True)
font_title_md = get_font(44, bold=True)
font_title_sm = get_font(38, bold=True)
font_slogan = get_font(28, bold=False)
font_meta_bold = get_font(28, bold=True)
font_meta = get_font(26, bold=False)
font_acronym = get_font(72, bold=True)

# ULIS Logo
logo_path = "assets/ulis-logo.png"
ulis_logo = None
if os.path.exists(logo_path):
    try:
        ulis_logo = Image.open(logo_path).convert("RGBA")
        ulis_logo = ulis_logo.resize((120, 120), Image.Resampling.LANCZOS)
    except Exception:
        ulis_logo = None

# Helper drawing functions
def draw_gradient(d, c1, c2, horizontal=False, angle=False):
    if horizontal:
        for x in range(WIDTH):
            r = x / WIDTH
            color = (
                int(c1[0] * (1 - r) + c2[0] * r),
                int(c1[1] * (1 - r) + c2[1] * r),
                int(c1[2] * (1 - r) + c2[2] * r),
                255
            )
            d.line([(x, 0), (x, HEIGHT)], fill=color)
    elif angle:
        for y in range(HEIGHT):
            for x in range(0, WIDTH, 4):
                r = (x / WIDTH * 0.6 + y / HEIGHT * 0.4)
                color = (
                    int(c1[0] * (1 - r) + c2[0] * r),
                    int(c1[1] * (1 - r) + c2[1] * r),
                    int(c1[2] * (1 - r) + c2[2] * r),
                    255
                )
                d.line([(x, y), (x + 4, y)], fill=color)
    else:
        for y in range(HEIGHT):
            r = y / HEIGHT
            color = (
                int(c1[0] * (1 - r) + c2[0] * r),
                int(c1[1] * (1 - r) + c2[1] * r),
                int(c1[2] * (1 - r) + c2[2] * r),
                255
            )
            d.line([(0, y), (WIDTH, y)], fill=color)

def draw_header(im, d, accent_color, subtitle="KẾT NỐI SỰ KIỆN & NGOẠI KHÓA TOÀN TRƯỜNG"):
    if ulis_logo:
        im.paste(ulis_logo, (80, 60), ulis_logo)
    d.text((225, 75), "TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐẠI HỌC QUỐC GIA HÀ NỘI", font=font_brand, fill=(255, 255, 255, 220))
    d.text((225, 118), f"CỔNG THÔNG TIN SỐ ULIS VIBE • {subtitle}", font=font_badge_sm, fill=accent_color)

def draw_meta_bar(d, items, bg_color=(15, 23, 42, 230), border_color=(255, 255, 255, 50)):
    meta_y = HEIGHT - 145
    d.rounded_rectangle([80, meta_y, WIDTH - 80, meta_y + 95], radius=20, fill=bg_color, outline=border_color, width=2)
    
    col_w = (WIDTH - 160) // len(items)
    for idx, (label, val, icon_sym) in enumerate(items):
        cx = 100 + idx * col_w
        d.text((cx, meta_y + 16), f"{icon_sym} {label}", font=font_badge_sm, fill=(147, 197, 253, 255))
        d.text((cx, meta_y + 48), val, font=font_meta, fill=(255, 255, 255, 255))
        if idx < len(items) - 1:
            d.line([(cx + col_w - 20, meta_y + 20), (cx + col_w - 20, meta_y + 75)], fill=(255, 255, 255, 40), width=2)

def save_dual(im, out_path_base):
    final_im = im.resize((FINAL_WIDTH, FINAL_HEIGHT), Image.Resampling.LANCZOS)
    rgb_im = final_im.convert("RGB")
    webp_path = f"{out_path_base}.webp"
    png_path = f"{out_path_base}.png"
    rgb_im.save(webp_path, "WEBP", quality=92)
    rgb_im.save(png_path, "PNG")
    print(f"Generated: {webp_path}")

# ==============================================================================
# 12 EVENTS GENERATION WITH HIGHLY PERSONALIZED GRAPHICS
# ==============================================================================

def gen_ev_01():
    # ev-01: Research & Thesis Writing Workshop (Phòng KHCN & CLB SRC ULIS)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (7, 21, 39), (15, 52, 96))
    
    # Custom Art: Scientific Blueprint Grid & Atom / Graph Nodes
    for x in range(0, WIDTH, 50):
        d.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, HEIGHT, 50):
        d.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 8), width=1)
    
    # Molecule & Atom Rings on the right
    center = (1280, 450)
    d.ellipse([center[0]-220, center[1]-220, center[0]+220, center[1]+220], outline=(0, 212, 255, 70), width=3)
    d.ellipse([center[0]-220, center[1]-100, center[0]+220, center[1]+100], outline=(0, 212, 255, 90), width=3)
    d.ellipse([center[0]-100, center[1]-220, center[0]+100, center[1]+220], outline=(0, 212, 255, 90), width=3)
    d.ellipse([center[0]-35, center[1]-35, center[0]+35, center[1]+35], fill=(0, 212, 255, 220))
    
    # Nodes on orbital
    nodes = [(center[0]-150, center[1]-70), (center[0]+180, center[1]+60), (center[0]-40, center[1]+190)]
    for nx, ny in nodes:
        d.ellipse([nx-16, ny-16, nx+16, ny+16], fill=(255, 255, 255, 230), outline=(0, 212, 255, 255), width=3)
    
    # Research Paper Sheet / Chart geometry
    d.rounded_rectangle([1050, 220, 1500, 680], radius=16, fill=(255, 255, 255, 12), outline=(255, 255, 255, 50), width=2)
    # Chart bars
    bars = [(1100, 620, 1140, 480), (1160, 620, 1200, 400), (1220, 620, 1260, 320), (1280, 620, 1320, 270), (1340, 620, 1380, 210)]
    for x1, y1, x2, y2 in bars:
        d.rectangle([x1, y2, x2, y1], fill=(56, 189, 248, 140))
        d.line([(x1+20, y2), (x1+20, y1)], fill=(255, 255, 255, 200), width=2)
    # Trend line
    trend_pts = [(1120, 480), (1180, 400), (1240, 320), (1300, 270), (1360, 210)]
    d.line(trend_pts, fill=(245, 158, 11, 240), width=5)

    draw_header(im, d, (56, 189, 248))
    
    # Badges
    d.rounded_rectangle([80, 210, 420, 260], radius=10, fill=(30, 58, 138, 240), outline=(96, 165, 250, 180), width=2)
    d.text((105, 222), "A1 • HỌC THUẬT & NCKH", font=font_badge, fill=(219, 234, 254))
    d.rounded_rectangle([440, 210, 780, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((465, 222), "HỘI THẢO CHUYÊN MÔN", font=font_badge, fill=(15, 23, 42))

    # Titles
    d.text((80, 290), "Hội Thảo: Phương Pháp Viết Báo Cáo\nNghiên Cứu Khoa Học Sinh Viên 2026", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Chuẩn hóa phương pháp luận, xử lý dữ liệu định lượng & công bố bài báo khoa học", font=font_slogan, fill=(147, 197, 253))

    draw_meta_bar(d, [
        ("THỜI GIAN", "20/11/2026 • 08:30 - 11:30", "📅"),
        ("ĐỊA ĐIỂM", "Hội trường Sunwah (Tầng 2)", "📍"),
        ("ĐƠN VỊ TỔ CHỨC", "Phòng KHCN & CLB SRC ULIS", "🏛️")
    ])
    save_dual(im, "assets/events/ev-01")

def gen_ev_02():
    # ev-02: Recruitment Gen 9 Đội Lễ Tân URT
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (19, 15, 64), (44, 44, 84))
    
    # Custom Art: Royal Sapphire Ribbon & Gold Laurel Stars
    for i in range(12):
        angle = i * (math.pi / 6)
        sx = 1350 + int(240 * math.cos(angle))
        sy = 450 + int(240 * math.sin(angle))
        d.ellipse([sx-10, sy-10, sx+10, sy+10], fill=(245, 158, 11, 200))
        d.line([(1350, 450), (sx, sy)], fill=(245, 158, 11, 30), width=1)
    
    # Luxury sash diagonal ribbons across right side
    points_ribbon = [(1100, 0), (1350, 0), (1600, 600), (1600, 900), (1350, 900), (1000, 100)]
    d.polygon(points_ribbon, fill=(245, 158, 11, 25))
    d.line([(1100, 0), (1600, 600)], fill=(245, 158, 11, 140), width=3)
    d.line([(1350, 0), (1600, 900)], fill=(245, 158, 11, 140), width=3)

    # Monogram Badge
    d.rounded_rectangle([1230, 330, 1470, 570], radius=24, fill=(10, 15, 30, 240), outline=(245, 158, 11, 220), width=4)
    d.text((1270, 400), "URT", font=font_acronym, fill=(245, 158, 11))
    d.text((1275, 490), "GEN 09", font=font_badge, fill=(254, 243, 199))

    draw_header(im, d, (245, 158, 11), "ĐỘI LỄ TÂN NGOẠI NGỮ – CHUYÊN NGHIỆP & TỰ TIN")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(120, 53, 15, 230), outline=(245, 158, 11, 180), width=2)
    d.text((105, 222), "A2 • KỸ NĂNG & NGOẠI KHÓA", font=font_badge, fill=(254, 243, 199))
    d.rounded_rectangle([490, 210, 760, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "TUYỂN QUÂN CLB", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Đợt Tuyển Quân Mùa Đông Gen 9\nĐội Lễ Tân Ngoại Ngữ URT", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Tìm kiếm đại sứ hình ảnh, lễ tân khánh tiết các sự kiện cấp Quốc gia & ĐHQGHN", font=font_slogan, fill=(253, 230, 138))

    draw_meta_bar(d, [
        ("HẠN ĐĂNG KÝ", "25/11/2026 • Đóng đơn 23:59", "⏳"),
        ("ĐỊA ĐIỂM PV", "Phòng 305 Nhà B2 (Trực tiếp)", "📍"),
        ("TỔ CHỨC", "Đội Lễ tân ULIS (URT)", "⭐")
    ])
    save_dual(im, "assets/events/ev-02")

def gen_ev_03():
    # ev-03: English Challenge 2026 Speech Contest
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (15, 23, 42), (29, 78, 216))
    
    # Custom Art: Spotlight Cones & Audio Waveform + Debate Speech Bubbles
    # Spotlights from top corners
    spotlight_1 = [(0, 0), (700, 900), (950, 900), (200, 0)]
    d.polygon(spotlight_1, fill=(255, 255, 255, 18))
    spotlight_2 = [(WIDTH, 0), (1100, 900), (750, 900), (WIDTH - 200, 0)]
    d.polygon(spotlight_2, fill=(245, 158, 11, 22))

    # Dual Debate Speech Bubbles
    d.rounded_rectangle([1050, 260, 1320, 420], radius=24, fill=(255, 255, 255, 25), outline=(255, 255, 255, 100), width=3)
    d.polygon([(1150, 420), (1200, 470), (1220, 420)], fill=(255, 255, 255, 25))
    d.text((1100, 310), "SPEAK OUT", font=font_title_sm, fill=(255, 255, 255))
    d.text((1115, 365), "LEAD THE STAGE", font=font_badge_sm, fill=(245, 158, 11))

    # Sound frequency bars
    for i in range(16):
        h = 40 + int(80 * abs(math.sin(i * 0.45)))
        d.line([(1100 + i * 22, 620 - h), (1100 + i * 22, 620 + h)], fill=(245, 158, 11, 180), width=6)

    # Golden Trophy Silhouette
    d.ellipse([1400, 300, 1500, 400], fill=(245, 158, 11, 230))
    d.polygon([(1430, 400), (1470, 400), (1460, 460), (1440, 460)], fill=(245, 158, 11, 230))
    d.rectangle([1420, 460, 1480, 490], fill=(217, 119, 6, 255))

    draw_header(im, d, (245, 158, 11), "KHOA SƯ PHẠM TIẾNG ANH & ENGLISH CLUB ULIS")
    
    d.rounded_rectangle([80, 210, 420, 260], radius=10, fill=(30, 58, 138, 240), outline=(96, 165, 250, 180), width=2)
    d.text((105, 222), "A1 • HỌC THUẬT & NCKH", font=font_badge, fill=(219, 234, 254))
    d.rounded_rectangle([440, 210, 750, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((465, 222), "CUỘC THI HỌC THUẬT", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Cuộc Thi Hùng Biện Tiếng Anh\nEnglish Challenge 2026 (Sơ loại)", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Tranh biện tư duy phản biện, làm chủ diễn đàn & tích lũy minh chứng A1 ĐRL", font=font_slogan, fill=(224, 242, 254))

    draw_meta_bar(d, [
        ("THỜI GIAN", "28/11/2026 • 14:00 - 17:30", "🎤"),
        ("ĐỊA ĐIỂM", "Hội trường Vũ Đình Liên", "📍"),
        ("TỔ CHỨC", "Khoa SPTA & CLB EC ULIS", "🏆")
    ])
    save_dual(im, "assets/events/ev-03")

def gen_ev_04():
    # ev-04: Highland Winter Volunteer Campaign (CLB Hoa Đá)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (4, 47, 46), (6, 95, 70))
    
    # Custom Art: Misty Mountain Ridges, Pine Trees & Falling Snowflakes
    # Mountain layer 1 (distant)
    m1 = [(800, 900), (950, 450), (1200, 600), (1400, 380), (1600, 550), (1600, 900)]
    d.polygon(m1, fill=(5, 150, 105, 80))
    # Mountain layer 2 (front)
    m2 = [(700, 900), (850, 550), (1050, 420), (1300, 580), (1550, 440), (1600, 500), (1600, 900)]
    d.polygon(m2, fill=(4, 120, 87, 160))

    # Pine trees silhouettes
    tree_xs = [800, 880, 960, 1120, 1220, 1340, 1450, 1520]
    for tx in tree_xs:
        ty = 580 + (tx % 100)
        d.polygon([(tx, ty), (tx-25, ty+70), (tx+25, ty+70)], fill=(6, 78, 59, 240))
        d.polygon([(tx, ty+40), (tx-35, ty+110), (tx+35, ty+110)], fill=(6, 78, 59, 240))

    # Snowflakes & Warm campfire glow
    d.ellipse([1250, 480, 1550, 780], fill=(254, 240, 138, 40)) # Warm halo
    for sx, sy in [(900, 200), (1100, 180), (1350, 240), (1500, 150), (1020, 320), (1420, 360)]:
        d.text((sx, sy), "❄", font=font_title_sm, fill=(255, 255, 255, 180))

    draw_header(im, d, (167, 243, 208), "CLB TÌNH NGUYỆN HOA ĐÁ – HƠN MỘT THẬP KỶ VÌ CỘNG ĐỒNG")
    
    d.rounded_rectangle([80, 210, 450, 260], radius=10, fill=(6, 95, 70, 240), outline=(52, 211, 153, 180), width=2)
    d.text((105, 222), "A3 • TÌNH NGUYỆN & XÃ HỘI", font=font_badge, fill=(209, 250, 229))
    d.rounded_rectangle([470, 210, 830, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((495, 222), "TUYỂN TÌNH NGUYỆN VIÊN", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Chiến Dịch Tình Nguyện Mùa Đông\n'Đông Ấm Vùng Cao 2026'", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Mang áo ấm, tủ sách và nụ cười đến học sinh vùng cao Hoàng Su Phì, Hà Giang", font=font_slogan, fill=(209, 250, 229))

    draw_meta_bar(d, [
        ("LỊCH TRÌNH", "02/12/2026 (Hạn chót vòng đơn)", "🏔️"),
        ("ĐỊA BÀN", "Hoàng Su Phì, Hà Giang", "📍"),
        ("ĐƠN VỊ", "CLB Tình nguyện Hoa Đá ULIS", "💚")
    ])
    save_dual(im, "assets/events/ev-04")

def gen_ev_05():
    # ev-05: ULIS Job Fair 2026 (40+ FDI Enterprises)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (12, 74, 110), (2, 132, 199))
    
    # Custom Art: Modern Skyscraper Architectural Outlines & Handshake Nodes
    skyscrapers = [
        (950, 280, 1050, 900), (1070, 180, 1190, 900), (1210, 240, 1330, 900),
        (1350, 140, 1470, 900), (1490, 260, 1590, 900)
    ]
    for x1, y1, x2, y2 in skyscrapers:
        d.rectangle([x1, y1, x2, y2], fill=(8, 47, 73, 160), outline=(56, 189, 248, 120), width=2)
        # Windows
        for wx in range(x1 + 18, x2 - 10, 22):
            for wy in range(y1 + 25, 750, 35):
                d.rectangle([wx, wy, wx + 10, wy + 16], fill=(224, 242, 254, 80))

    # Handshake / Partnership Circle Badge
    d.rounded_rectangle([1120, 320, 1420, 600], radius=24, fill=(15, 23, 42, 230), outline=(56, 189, 248, 200), width=3)
    d.text((1155, 360), "JOB FAIR", font=font_title_sm, fill=(255, 255, 255))
    d.text((1190, 420), "40+", font=font_acronym, fill=(56, 189, 248))
    d.text((1155, 510), "DOANH NGHIỆP FDI", font=font_badge_sm, fill=(254, 243, 199))

    draw_header(im, d, (56, 189, 248), "PHÒNG CHÍNH TRỊ & CÔNG TÁC HSSV – ĐẠI HỌC NGOẠI NGỮ")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(3, 105, 161, 240), outline=(56, 189, 248, 180), width=2)
    d.text((105, 222), "A2 • KỸ NĂNG & HƯỚNG NGHIỆP", font=font_badge, fill=(224, 242, 254))
    d.rounded_rectangle([490, 210, 830, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "NGÀY HỘI TUYỂN DỤNG", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Ngày Hội Việc Làm & Thực Tập Quốc Tế\nULIS Job Fair 2026 (40+ Doanh nghiệp)", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Phỏng vấn trực tiếp, kết nối cơ hội thực tập và việc làm đa ngôn ngữ hàng đầu", font=font_slogan, fill=(186, 230, 253))

    draw_meta_bar(d, [
        ("THỜI GIAN", "05/12/2026 • 07:30 - 16:30", "💼"),
        ("ĐỊA ĐIỂM", "Khuôn viên Sân nhà A1 & B2", "📍"),
        ("QUY MÔ", "40+ Tập đoàn & Doanh nghiệp", "🌐")
    ])
    save_dual(im, "assets/events/ev-05")

def gen_ev_06():
    # ev-06: LinkedIn Branding & UI Design Workshop (UMC ULIS)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (15, 23, 42), (10, 102, 194))
    
    # Custom Art: LinkedIn Interface Card & Design Bezier Paths
    d.rounded_rectangle([980, 200, 1520, 680], radius=20, fill=(15, 23, 42, 230), outline=(10, 102, 194, 220), width=3)
    # Profile Card Mockup inside
    d.ellipse([1020, 240, 1120, 340], fill=(10, 102, 194, 240), outline=(255, 255, 255, 200), width=3)
    d.text((1045, 265), "in", font=font_title_md, fill=(255, 255, 255))
    d.text((1145, 255), "ULIS Creator Profile", font=font_meta_bold, fill=(255, 255, 255))
    d.text((1145, 295), "Design & Personal Branding", font=font_meta, fill=(147, 197, 253))
    
    # Follower growth curve & analytics
    pts = [(1020, 560), (1120, 520), (1220, 460), (1320, 420), (1450, 360)]
    d.line(pts, fill=(56, 189, 248, 255), width=6)
    for px, py in pts:
        d.ellipse([px-10, py-10, px+10, py+10], fill=(255, 255, 255), outline=(10, 102, 194), width=3)

    # Design pen tool handle representation
    d.line([(1020, 620), (1480, 620)], fill=(255, 255, 255, 60), width=2)
    d.text((1020, 635), "PORTFOLIO • RESUME • NETWORKING", font=font_badge_sm, fill=(254, 243, 199))

    draw_header(im, d, (56, 189, 248), "CLB TRUYỀN THÔNG & NHIẾP ẢNH UMC ULIS")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(30, 58, 138, 240), outline=(96, 165, 250, 180), width=2)
    d.text((105, 222), "A2 • KỸ NĂNG & NGOẠI KHÓA", font=font_badge, fill=(219, 234, 254))
    d.rounded_rectangle([490, 210, 810, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "WORKSHOP KỸ NĂNG", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Workshop: Tinh Gọn Kỹ Năng Thiết Kế\n& Xây Dựng Thương Hiệu LinkedIn", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Xây dựng hồ sơ số chuyên nghiệp, nâng cấp portfolio và thu hút nhà tuyển dụng", font=font_slogan, fill=(191, 219, 254))

    draw_meta_bar(d, [
        ("THỜI GIAN", "10/12/2026 • 19:00 - 21:30", "💻"),
        ("HÌNH THỨC", "Zoom & Livestream Fanpage", "🎥"),
        ("TỔ CHỨC", "CLB Truyền thông UMC ULIS", "🎨")
    ])
    save_dual(im, "assets/events/ev-06")

def gen_ev_07():
    # ev-07: Acoustic Music Night (MMC ULIS)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (46, 16, 101), (131, 24, 67))
    
    # Custom Art: Acoustic Guitar Silhouette Curves & Flowing Musical Staff
    # Glowing bokeh lights
    bokehs = [(1100, 250, 70), (1350, 180, 100), (1450, 400, 80), (1200, 550, 110), (1050, 420, 60)]
    for bx, by, br in bokehs:
        d.ellipse([bx-br, by-br, bx+br, by+br], fill=(244, 114, 182, 35))
    
    # Guitar Body Curves
    d.ellipse([1150, 320, 1500, 680], outline=(244, 114, 182, 140), width=4)
    d.ellipse([1250, 220, 1450, 420], outline=(244, 114, 182, 120), width=3)
    d.ellipse([1300, 350, 1380, 430], fill=(15, 23, 42, 230), outline=(245, 158, 11, 200), width=3) # Soundhole

    # Musical Staff Lines across right
    for i in range(5):
        d.line([(900, 300 + i * 20), (1550, 300 + i * 20)], fill=(255, 255, 255, 60), width=2)
    # Notes
    for nx, ny in [(980, 330), (1120, 290), (1260, 350), (1400, 310)]:
        d.ellipse([nx-12, ny-10, nx+12, ny+10], fill=(245, 158, 11, 240))
        d.line([(nx+10, ny), (nx+10, ny-45)], fill=(245, 158, 11, 240), width=3)

    draw_header(im, d, (244, 114, 182), "CLB ÂM NHẠC HIỆN ĐẠI MMC – GIAI ĐIỆU THANH XUÂN")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(112, 26, 117, 240), outline=(244, 114, 182, 180), width=2)
    d.text((105, 222), "A3 • PHONG TRÀO NGHỆ THUẬT", font=font_badge, fill=(253, 230, 138))
    d.rounded_rectangle([490, 210, 810, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "ĐÊM NHẠC & CASTING", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Đêm Nhạc Acoustic Mùa Đông\n'Vũ Khúc Thanh Xuân' & Casting Vocal", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Hòa mình cùng giai điệu acoustic mộc mạc và casting bổ sung ban nhạc/vocal", font=font_slogan, fill=(249, 168, 212))

    draw_meta_bar(d, [
        ("THỜI GIAN", "15/12/2026 • 18:30 - 21:30", "🎸"),
        ("ĐỊA ĐIỂM", "Sân tượng đài Bác Hồ (A1)", "📍"),
        ("TỔ CHỨC", "CLB Âm nhạc Hiện đại MMC", "🎶")
    ])
    save_dual(im, "assets/events/ev-07")

def gen_ev_08():
    # ev-08: Blood Donation 'Nắng Ngoại Ngữ 2026'
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (76, 5, 25), (190, 18, 60))
    
    # Custom Art: Glowing Heart, Blood Drop, ECG Pulse Wave & Sun Rays
    # Sun rays in upper right
    for a in range(0, 360, 20):
        rad = math.radians(a)
        d.line([(1350, 420), (1350 + int(400 * math.cos(rad)), 420 + int(400 * math.sin(rad)))], fill=(254, 205, 211, 20), width=2)

    # Stylized Glowing Heart with Drop
    d.ellipse([1150, 260, 1350, 460], fill=(225, 29, 72, 220))
    d.ellipse([1280, 260, 1480, 460], fill=(225, 29, 72, 220))
    d.polygon([(1160, 390), (1470, 390), (1315, 560)], fill=(225, 29, 72, 220))
    # Blood drop inside
    d.ellipse([1290, 360, 1340, 420], fill=(255, 255, 255, 240))
    d.polygon([(1290, 380), (1340, 380), (1315, 330)], fill=(255, 255, 255, 240))

    # Heartbeat ECG Pulse Line across lower right
    ecg = [(900, 640), (1050, 640), (1100, 590), (1140, 710), (1180, 540), (1220, 660), (1260, 640), (1550, 640)]
    d.line(ecg, fill=(254, 205, 211, 240), width=6)

    draw_header(im, d, (254, 205, 211), "ĐOÀN TN - HỘI SINH VIÊN ULIS & VIỆN HUYẾT HỌC")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(136, 19, 55, 240), outline=(251, 113, 133, 180), width=2)
    d.text((105, 222), "A3 • TÌNH NGUYỆN & NHÂN ĐẠO", font=font_badge, fill=(255, 228, 230))
    d.rounded_rectangle([490, 210, 810, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "HIẾN MÁU NHÂN ĐẠO", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Ngày Hội Hiến Máu Toàn Trường\n'Nắng Ngoại Ngữ 2026'", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Một giọt máu cho đi - Một cuộc đời ở lại. Lan tỏa hơi ấm nhân ái sinh viên ULIS", font=font_slogan, fill=(254, 205, 211))

    draw_meta_bar(d, [
        ("THỜI GIAN", "22/12/2026 • 07:30 - 17:00", "🩸"),
        ("ĐỊA ĐIỂM", "Sảnh tầng 1 Nhà A9", "📍"),
        ("PHỐI HỢP", "Viện Huyết học - Truyền máu TW", "❤️")
    ])
    save_dual(im, "assets/events/ev-08")

def gen_ev_09():
    # ev-09: HSK 6 & JLPT N1 Talkshow (HYC & Hikari)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (15, 23, 42), (69, 10, 10))
    
    # Custom Art: Asian Paper Scroll, Mt. Fuji & Bamboo Stalks + Red Chop Seal
    # Mt Fuji Silhouette
    d.polygon([(1100, 700), (1320, 360), (1540, 700)], fill=(30, 41, 59, 180))
    d.polygon([(1250, 470), (1320, 360), (1390, 470)], fill=(255, 255, 255, 220)) # Snowcap
    
    # Torii Gate Silhouette
    d.rectangle([1020, 420, 1180, 440], fill=(185, 28, 28, 240)) # Top beam
    d.rectangle([1000, 390, 1200, 410], fill=(185, 28, 28, 255))
    d.rectangle([1040, 440, 1060, 680], fill=(185, 28, 28, 240)) # Pillars
    d.rectangle([1140, 440, 1160, 680], fill=(185, 28, 28, 240))

    # Bamboo stalks on far right
    for bx in [1480, 1530]:
        for by in range(200, 700, 110):
            d.rectangle([bx, by, bx+12, by+95], fill=(22, 101, 52, 200))
            d.line([(bx-5, by), (bx+17, by)], fill=(34, 197, 94, 240), width=3)

    # Traditional Red Seal Chop
    d.rounded_rectangle([1380, 240, 1480, 340], radius=8, fill=(185, 28, 28, 240), outline=(254, 202, 202, 200), width=3)
    d.text((1395, 260), "HỌC\nTHUẬT", font=font_badge_sm, fill=(255, 255, 255), spacing=4)

    draw_header(im, d, (245, 158, 11), "CLB TIẾNG TRUNG HYC & CLB TIẾNG NHẬT HIKARI")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(30, 58, 138, 240), outline=(96, 165, 250, 180), width=2)
    d.text((105, 222), "A1 • HỌC THUẬT CHUYÊN MÔN", font=font_badge, fill=(219, 234, 254))
    d.rounded_rectangle([490, 210, 810, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "TỌA ĐÀM CHUYÊN ĐỀ", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Tọa Đàm: Chiến Lược Chinh Phục\nChứng Chỉ Quốc Tế HSK 6 & JLPT N1", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Bí kíp ôn luyện đỉnh cao, giải đề thực chiến từ các thủ khoa chứng chỉ ULIS", font=font_slogan, fill=(254, 215, 170))

    draw_meta_bar(d, [
        ("THỜI GIAN", "08/01/2027 • 09:00 - 11:30", "🏮"),
        ("ĐỊA ĐIỂM", "Phòng Hội thảo Quốc tế B3", "📍"),
        ("ĐỒNG TỔ CHỨC", "CLB Hán Ngữ HYC & CLB Hikari", "⛩️")
    ])
    save_dual(im, "assets/events/ev-09")

def gen_ev_10():
    # ev-10: ULIS Buddy Club Spring Recruitment (UBC)
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (19, 78, 74), (13, 148, 136))
    
    # Custom Art: Globe Latitude/Longitude Grid, Flight Arcs & Paper Planes
    center = (1300, 450)
    d.ellipse([center[0]-200, center[1]-200, center[0]+200, center[1]+200], outline=(45, 212, 191, 160), width=4)
    d.ellipse([center[0]-200, center[1]-100, center[0]+200, center[1]+100], outline=(45, 212, 191, 100), width=2)
    d.ellipse([center[0]-100, center[1]-200, center[0]+100, center[1]+200], outline=(45, 212, 191, 100), width=2)
    d.line([(center[0]-200, center[1]), (center[0]+200, center[1])], fill=(45, 212, 191, 120), width=2)
    d.line([(center[0], center[1]-200), (center[0], center[1]+200)], fill=(45, 212, 191, 120), width=2)

    # Curved dashed flight paths
    flight_pts = [(950, 600), (1050, 400), (1200, 300), (1400, 280), (1550, 350)]
    for idx in range(len(flight_pts) - 1):
        d.line([flight_pts[idx], flight_pts[idx+1]], fill=(254, 240, 138, 200), width=4)
    # Paper airplane
    d.polygon([(1550, 350), (1500, 320), (1520, 370)], fill=(255, 255, 255))

    # Passport Stamp Badge
    d.rounded_rectangle([1020, 240, 1240, 350], radius=16, fill=(15, 23, 42, 230), outline=(245, 158, 11, 200), width=3)
    d.text((1045, 260), "GLOBAL BUDDY", font=font_badge_sm, fill=(245, 158, 11))
    d.text((1055, 295), "SPRING 2027", font=font_meta_bold, fill=(255, 255, 255))

    draw_header(im, d, (45, 212, 191), "CLB BẠN ĐỒNG HÀNH QUỐC TẾ ULIS BUDDY CLUB")
    
    d.rounded_rectangle([80, 210, 450, 260], radius=10, fill=(19, 78, 74, 240), outline=(45, 212, 191, 180), width=2)
    d.text((105, 222), "A2 • GIAO LƯU QUỐC TẾ", font=font_badge, fill=(204, 251, 241))
    d.rounded_rectangle([470, 210, 740, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((495, 222), "TUYỂN QUÂN CLB", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Tuyển Thành Viên Kỳ Mùa Xuân 2027\nCLB Bạn Đồng Hành Quốc Tế UBC", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Đồng hành cùng lưu học sinh quốc tế, trao đổi văn hóa và rèn luyện ngoại ngữ", font=font_slogan, fill=(204, 251, 241))

    draw_meta_bar(d, [
        ("HẠN NỘP ĐƠN", "12/01/2027 • Đóng đơn 23:59", "🌏"),
        ("ĐỊA ĐIỂM", "Online Form & P.102 Nhà A2", "📍"),
        ("TỔ CHỨC", "ULIS Buddy Club (UBC)", "🤝")
    ])
    save_dual(im, "assets/events/ev-10")

def gen_ev_11():
    # ev-11: ULIS Cup 2027 Football Tournament
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (20, 83, 45), (22, 163, 74))
    
    # Custom Art: Football Pitch Lines & Soccer Ball Motion Blur
    # Center circle on pitch
    d.ellipse([1050, 200, 1550, 700], outline=(255, 255, 255, 70), width=5)
    d.line([(1300, 100), (1300, 800)], fill=(255, 255, 255, 70), width=5)
    d.ellipse([1280, 430, 1320, 470], fill=(255, 255, 255, 140))

    # Dynamic Soccer Ball
    bx, by, br = 1380, 420, 90
    d.ellipse([bx-br, by-br, bx+br, by+br], fill=(255, 255, 255), outline=(15, 23, 42), width=4)
    # Pentagons on ball
    d.polygon([(bx, by-40), (bx-35, by-10), (bx-20, by+30), (bx+20, by+30), (bx+35, by-10)], fill=(15, 23, 42))
    
    # Speed streaks behind ball
    for sy in range(by - 60, by + 70, 25):
        d.line([(bx - 120 - abs(sy - by) * 2, sy), (bx - br, sy)], fill=(250, 204, 21, 200), width=4)

    # Golden Trophy Silhouette
    d.ellipse([1100, 480, 1220, 600], fill=(234, 179, 8, 240))
    d.rectangle([1145, 600, 1175, 660], fill=(202, 138, 4, 255))
    d.rectangle([1120, 660, 1200, 690], fill=(161, 98, 7, 255))

    draw_header(im, d, (250, 204, 21), "ĐOÀN TRƯỜNG & CLB BÓNG ĐÁ ULIS FOOTBALL CLUB")
    
    d.rounded_rectangle([80, 210, 470, 260], radius=10, fill=(20, 83, 45, 240), outline=(74, 222, 128, 180), width=2)
    d.text((105, 222), "A3 • PHONG TRÀO THỂ THAO", font=font_badge, fill=(220, 252, 231))
    d.rounded_rectangle([490, 210, 820, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((515, 222), "GIẢI ĐẤU TOÀN TRƯỜNG", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Giải Bóng Đá Nam - Nữ Sinh Viên\nULIS Cup 2027 Thường Niên", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Tranh tài thể thao đỉnh cao, tinh thần fair-play & bùng nổ nhiệt huyết sinh viên", font=font_slogan, fill=(220, 252, 231))

    draw_meta_bar(d, [
        ("KHAI MẠC", "16/01/2027 • Bắt đầu 08:00", "⚽"),
        ("ĐỊA ĐIỂM", "Sân Vận Động Ngoại Ngữ", "📍"),
        ("TỔ CHỨC", "Đoàn Trường & CLB UFC", "🏆")
    ])
    save_dual(im, "assets/events/ev-11")

def gen_ev_12():
    # ev-12: ULIS Vibe Platform Official Launch & QR Check-in
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, (10, 25, 75), (37, 99, 235))
    
    # Custom Art: High-tech QR Matrix & Smartphone Glassmorphism Mockup
    # Circuit grid
    for x in range(950, WIDTH, 60):
        d.line([(x, 150), (x, 750)], fill=(0, 212, 255, 25), width=1)
    for y in range(150, 750, 60):
        d.line([(950, y), (WIDTH, y)], fill=(0, 212, 255, 25), width=1)
    
    # QR Code Graphic Block on right
    qr_x, qr_y, qr_s = 1200, 280, 260
    d.rounded_rectangle([qr_x - 15, qr_y - 15, qr_x + qr_s + 15, qr_y + qr_s + 15], radius=20, fill=(255, 255, 255, 240))
    # QR Eyes
    for ex, ey in [(qr_x, qr_y), (qr_x + qr_s - 70, qr_y), (qr_x, qr_y + qr_s - 70)]:
        d.rectangle([ex, ey, ex + 70, ey + 70], fill=(15, 23, 42))
        d.rectangle([ex + 12, ey + 12, ex + 58, ey + 58], fill=(255, 255, 255))
        d.rectangle([ex + 24, ey + 24, ex + 46, ey + 46], fill=(15, 23, 42))
    # QR Inner pattern
    for px, py in [(qr_x+100, qr_y+40), (qr_x+140, qr_y+40), (qr_x+90, qr_y+100), (qr_x+150, qr_y+120), (qr_x+110, qr_y+160), (qr_x+180, qr_y+180)]:
        d.rectangle([px, py, px+25, py+25], fill=(15, 23, 42))

    # Scanning laser line across QR
    d.line([(qr_x - 25, qr_y + 130), (qr_x + qr_s + 25, qr_y + 130)], fill=(0, 212, 255, 255), width=5)

    # Smartphone interface mockup silhouette
    d.rounded_rectangle([980, 220, 1140, 520], radius=24, fill=(15, 23, 42, 220), outline=(0, 212, 255, 180), width=3)
    d.rounded_rectangle([1010, 270, 1110, 310], radius=8, fill=(37, 99, 235, 220))
    d.rounded_rectangle([1010, 330, 1110, 360], radius=6, fill=(255, 255, 255, 40))
    d.rounded_rectangle([1010, 380, 1110, 410], radius=6, fill=(255, 255, 255, 40))

    draw_header(im, d, (0, 212, 255), "BỘ MÔN CNTT&TT & NHÓM THỰC HIỆN ĐỀ ÁN 109")
    
    d.rounded_rectangle([80, 210, 480, 260], radius=10, fill=(30, 58, 138, 240), outline=(96, 165, 250, 180), width=2)
    d.text((105, 222), "A2 • KỸ NĂNG & CHUYỂN ĐỔI SỐ", font=font_badge, fill=(219, 234, 254))
    d.rounded_rectangle([500, 210, 830, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((525, 222), "SỰ KIỆN CÔNG NGHỆ", font=font_badge, fill=(15, 23, 42))

    d.text((80, 290), "Lễ Ra Mắt Chính Thức Nền Tảng\nULIS Vibe & Trải Nghiệm Check-in QR", font=font_title_lg, fill=(255, 255, 255), spacing=18)
    d.text((80, 450), "Đồng bộ dữ liệu sự kiện, minh chứng rèn luyện và kết nối 50+ CLB ULIS", font=font_slogan, fill=(191, 219, 254))

    draw_meta_bar(d, [
        ("THỜI GIAN", "20/01/2027 • 14:30 - 17:00", "⚡"),
        ("ĐỊA ĐIỂM", "Hội trường Sunwah & Trực tuyến", "📍"),
        ("CHỦ TRÌ", "Bộ môn CNTT&TT & Nhóm 109", "🚀")
    ])
    save_dual(im, "assets/events/ev-12")

# ==============================================================================
# 17 CLUBS GENERATION WITH HIGHLY PERSONALIZED GRAPHICS
# ==============================================================================

def gen_club_banner(club_id, name, acronym, category_name, slogan, status, colors, motif_type):
    im = Image.new("RGBA", (WIDTH, HEIGHT))
    d = ImageDraw.Draw(im)
    draw_gradient(d, colors["bg1"], colors["bg2"], angle=True)
    
    # 1. Custom Artwork Motif based on club type
    if motif_type == "english":
        # Speech bubbles & dictionary quote marks
        d.rounded_rectangle([1050, 220, 1480, 420], radius=24, fill=(255, 255, 255, 25), outline=(245, 158, 11, 160), width=3)
        d.polygon([(1150, 420), (1200, 480), (1220, 420)], fill=(255, 255, 255, 25))
        d.text((1100, 280), "SPEAK OUT", font=font_title_sm, fill=(255, 255, 255))
        d.text((1100, 340), "INSPIRE & EMPOWER", font=font_badge, fill=(245, 158, 11))
    elif motif_type == "science":
        # Atom orbits & research formulas
        c = (1280, 450)
        d.ellipse([c[0]-180, c[1]-180, c[0]+180, c[1]+180], outline=(56, 189, 248, 120), width=3)
        d.ellipse([c[0]-180, c[1]-80, c[0]+180, c[1]+80], outline=(56, 189, 248, 140), width=3)
        d.ellipse([c[0]-80, c[1]-180, c[0]+80, c[1]+180], outline=(56, 189, 248, 140), width=3)
        d.ellipse([c[0]-25, c[1]-25, c[0]+25, c[1]+25], fill=(56, 189, 248, 240))
    elif motif_type == "chinese":
        # Silk lanterns & oriental bamboo
        d.rounded_rectangle([1250, 240, 1430, 480], radius=40, fill=(220, 38, 38, 220), outline=(254, 240, 138, 200), width=4)
        d.line([(1340, 180), (1340, 240)], fill=(254, 240, 138, 240), width=4)
        d.line([(1340, 480), (1340, 560)], fill=(254, 240, 138, 240), width=4)
        d.text((1305, 330), "漢", font=font_title_lg, fill=(254, 240, 138))
    elif motif_type == "japanese":
        # Mt Fuji & Sakura Petals
        d.polygon([(1050, 680), (1280, 320), (1510, 680)], fill=(30, 41, 59, 200))
        d.polygon([(1210, 430), (1280, 320), (1350, 430)], fill=(255, 255, 255, 240))
        d.ellipse([1360, 220, 1480, 340], fill=(225, 29, 72, 220)) # Red Sun
    elif motif_type == "korean":
        # Taegeuk swirls & Seoul skyline
        d.ellipse([1150, 280, 1450, 580], outline=(255, 255, 255, 100), width=4)
        d.arc([1150, 280, 1450, 580], start=0, end=180, fill=(239, 68, 68, 240), width=15)
        d.arc([1150, 280, 1450, 580], start=180, end=360, fill=(37, 99, 235, 240), width=15)
        d.text((1220, 400), "K-VIBE", font=font_title_sm, fill=(255, 255, 255))
    elif motif_type == "translation":
        # Bilingual bridge & translation waves
        d.rounded_rectangle([1050, 280, 1480, 520], radius=24, fill=(15, 23, 42, 220), outline=(56, 189, 248, 160), width=3)
        d.text((1100, 340), "EN / FR / DE / CN / JP", font=font_meta_bold, fill=(147, 197, 253))
        d.text((1100, 410), "⇄ VIETNAMESE", font=font_title_sm, fill=(245, 158, 11))
    elif motif_type == "music":
        # Guitar & equalizer sound waves
        for i in range(18):
            h = 40 + int(90 * abs(math.sin(i * 0.4)))
            d.line([(1050 + i * 24, 480 - h), (1050 + i * 24, 480 + h)], fill=(244, 114, 182, 200), width=7)
    elif motif_type == "dance":
        # Street dance dynamic energy lines
        for i in range(8):
            d.line([(1000 + i * 60, 220), (1150 + i * 60, 680)], fill=(249, 115, 22, 140), width=4)
        d.ellipse([1200, 320, 1420, 540], outline=(236, 72, 153, 240), width=5)
        d.text((1245, 410), "RHYTHM", font=font_title_sm, fill=(255, 255, 255))
    elif motif_type == "media":
        # Camera aperture & film strip
        cx, cy, r = 1280, 450, 160
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(245, 158, 11, 200), width=4)
        for a in range(0, 360, 60):
            rad = math.radians(a)
            d.line([(cx + int(r*math.cos(rad)), cy + int(r*math.sin(rad))), (cx + int((r-60)*math.cos(rad+0.6)), cy + int((r-60)*math.sin(rad+0.6)))], fill=(255, 255, 255, 180), width=3)
    elif motif_type == "football":
        # Soccer ball & goal net
        bx, by = 1300, 450
        d.ellipse([bx-130, by-130, bx+130, by+130], fill=(255, 255, 255), outline=(15, 23, 42), width=5)
        d.polygon([(bx, by-50), (bx-45, by-15), (bx-25, by+40), (bx+25, by+40), (bx+45, by-15)], fill=(15, 23, 42))
    elif motif_type == "drama":
        # Comedy & Tragedy Masks
        d.ellipse([1100, 320, 1260, 520], fill=(254, 243, 199, 230), outline=(217, 119, 6), width=3) # Happy
        d.arc([1140, 400, 1220, 470], start=0, end=180, fill=(15, 23, 42), width=4)
        d.ellipse([1280, 340, 1440, 540], fill=(224, 231, 255, 230), outline=(79, 70, 229), width=3) # Tragic
        d.arc([1320, 450, 1400, 510], start=180, end=360, fill=(15, 23, 42), width=4)
    elif motif_type == "reception":
        # Laurel wreath & gold stars
        c = (1300, 450)
        d.ellipse([c[0]-160, c[1]-160, c[0]+160, c[1]+160], outline=(245, 158, 11, 200), width=4)
        d.text((c[0]-75, c[1]-40), acronym, font=font_title_lg, fill=(245, 158, 11))
    elif motif_type == "volunteer":
        # Stone flower / Sprouting lotus & hands
        c = (1300, 450)
        d.ellipse([c[0]-150, c[1]-150, c[0]+150, c[1]+150], fill=(16, 185, 129, 40), outline=(52, 211, 153, 180), width=3)
        d.text((c[0]-50, c[1]-50), "🌱", font=font_title_lg, fill=(255, 255, 255))
    elif motif_type == "taskforce":
        # Blazing torch & shield
        d.polygon([(1180, 280), (1420, 280), (1400, 520), (1300, 620), (1200, 520)], fill=(30, 58, 138, 220), outline=(245, 158, 11, 220), width=4)
        d.text((1255, 380), "TNXK", font=font_title_md, fill=(255, 255, 255))
    elif motif_type == "skills":
        # Compass & Career Ladder
        c = (1300, 450)
        d.ellipse([c[0]-150, c[1]-150, c[0]+150, c[1]+150], outline=(45, 212, 191, 180), width=4)
        d.polygon([(c[0], c[1]-130), (c[0]+25, c[1]), (c[0], c[1]+130), (c[0]-25, c[1])], fill=(245, 158, 11, 240))
    elif motif_type == "blood":
        # Heart with droplet
        d.ellipse([1180, 320, 1340, 480], fill=(225, 29, 72, 220))
        d.ellipse([1280, 320, 1440, 480], fill=(225, 29, 72, 220))
        d.polygon([(1190, 420), (1430, 420), (1310, 560)], fill=(225, 29, 72, 220))
    elif motif_type == "buddy":
        # Global flight arcs
        c = (1300, 450)
        d.ellipse([c[0]-160, c[1]-160, c[0]+160, c[1]+160], outline=(45, 212, 191, 180), width=4)
        d.ellipse([c[0]-160, c[1]-80, c[0]+160, c[1]+80], outline=(45, 212, 191, 120), width=2)
        d.text((c[0]-45, c[1]-40), "UBC", font=font_title_md, fill=(255, 255, 255))

    # Header
    draw_header(im, d, colors["accent"], f"DANH BẠ CÂU LẠC BỘ & TỔ CHỨC • {acronym}")
    
    # Category and Status Badges
    d.rounded_rectangle([80, 210, 360, 260], radius=10, fill=(15, 23, 42, 220), outline=colors["accent"], width=2)
    d.text((105, 222), category_name.upper(), font=font_badge, fill=colors["accent"])

    d.rounded_rectangle([380, 210, 780, 260], radius=10, fill=(255, 255, 255, 230))
    d.text((405, 222), status.upper(), font=font_badge, fill=(15, 23, 42))

    # Club Titles
    d.text((80, 290), name, font=font_title_md, fill=(255, 255, 255))
    d.text((80, 370), f"\"{slogan}\"", font=font_slogan, fill=(254, 243, 199))

    # Acronym Crest watermark on bottom-left
    d.rounded_rectangle([80, 450, 480, 680], radius=18, fill=(15, 23, 42, 160), outline=(255, 255, 255, 40), width=2)
    d.text((110, 490), acronym, font=font_acronym, fill=colors["accent"])
    d.text((110, 590), "HOẠT ĐỘNG CHÍNH THỨC TẠI ULIS", font=font_badge_sm, fill=(226, 232, 240))

    draw_meta_bar(d, [
        ("CÂU LẠC BỘ", acronym, "🏛️"),
        ("TRẠNG THÁI", status, "📌"),
        ("PHÂN NHÓM", category_name, "⭐")
    ])

    save_dual(im, f"assets/clubs/{club_id}")

# 17 Clubs Data
clubs_data = [
    {
        "id": "ec-ulis",
        "name": "CLB Tiếng Anh (English Club - EC ULIS)",
        "acronym": "EC ULIS",
        "category_name": "CLB Học thuật",
        "slogan": "Connect, Inspire, Empower through English",
        "status": "Đang mở đơn Gen 24",
        "colors": {"bg1": (10, 25, 60), "bg2": (30, 64, 175), "accent": (245, 158, 11)},
        "motif": "english"
    },
    {
        "id": "src-ulis",
        "name": "CLB Nghiên cứu Khoa học Sinh viên (SRC ULIS)",
        "acronym": "SRC ULIS",
        "category_name": "CLB Học thuật",
        "slogan": "Nurturing Academic Passion & Research Excellence",
        "status": "Sắp mở đơn tuyển CTV",
        "colors": {"bg1": (15, 23, 42), "bg2": (2, 132, 199), "accent": (56, 189, 248)},
        "motif": "science"
    },
    {
        "id": "chinese-club",
        "name": "CLB Tiếng Trung (Hán Ngữ ULIS - HanYu Club)",
        "acronym": "HYC ULIS",
        "category_name": "CLB Học thuật",
        "slogan": "Thế giới rộng lớn – Tiếng Trung kết nối",
        "status": "Sinh hoạt định kỳ",
        "colors": {"bg1": (69, 10, 10), "bg2": (185, 28, 28), "accent": (254, 240, 138)},
        "motif": "chinese"
    },
    {
        "id": "japanese-club",
        "name": "CLB Tiếng Nhật Hikari (Hikari Japanese Club)",
        "acronym": "HIKARI",
        "category_name": "CLB Học thuật",
        "slogan": "Lan tỏa ánh sáng văn hóa & ngôn ngữ Phù Tang",
        "status": "Đang nhận hồ sơ phỏng vấn",
        "colors": {"bg1": (15, 23, 42), "bg2": (159, 18, 57), "accent": (251, 113, 133)},
        "motif": "japanese"
    },
    {
        "id": "korean-club",
        "name": "CLB Tiếng Hàn & Văn Hóa Hàn Quốc (K-ULIS)",
        "acronym": "K-ULIS",
        "category_name": "CLB Học thuật",
        "slogan": "Kết nối đam mê – Trải nghiệm bản sắc Hàn Quốc",
        "status": "Chuẩn bị tuyển kỳ 2",
        "colors": {"bg1": (11, 19, 43), "bg2": (30, 58, 138), "accent": (244, 114, 182)},
        "motif": "korean"
    },
    {
        "id": "translation-club",
        "name": "CLB Biên Phiên Dịch Trẻ (Young Translators Club)",
        "acronym": "YTC ULIS",
        "category_name": "CLB Học thuật",
        "slogan": "Chính xác từng câu từ – Nâng tầm bản dịch",
        "status": "Mở đơn tuyển Ban Nội dung",
        "colors": {"bg1": (15, 23, 42), "bg2": (14, 116, 144), "accent": (56, 189, 248)},
        "motif": "translation"
    },
    {
        "id": "mmc-ulis",
        "name": "CLB Âm Nhạc Ngoại Ngữ (Modern Music Club)",
        "acronym": "MMC ULIS",
        "category_name": "Sở thích & Năng khiếu",
        "slogan": "Nơi âm nhạc xóa nhòa mọi ranh giới ngôn ngữ",
        "status": "Đã tuyển xong đợt 1",
        "colors": {"bg1": (59, 7, 100), "bg2": (162, 28, 175), "accent": (245, 158, 11)},
        "motif": "music"
    },
    {
        "id": "udc-ulis",
        "name": "CLB Vũ Đạo Ngoại Ngữ (ULIS Dance Club)",
        "acronym": "UDC ULIS",
        "category_name": "Sở thích & Năng khiếu",
        "slogan": "Dance with Passion, Shine with Rhythm",
        "status": "Tập luyện giải mùa đông",
        "colors": {"bg1": (24, 24, 27), "bg2": (234, 88, 12), "accent": (244, 114, 182)},
        "motif": "dance"
    },
    {
        "id": "umc-ulis",
        "name": "CLB Truyền Thông & Nhiếp Ảnh (ULIS Media Club)",
        "acronym": "UMC ULIS",
        "category_name": "Sở thích & Năng khiếu",
        "slogan": "Lưu giữ từng khoảnh khắc thanh xuân dưới mái trường ULIS",
        "status": "Mở đơn Media Gen 12",
        "colors": {"bg1": (24, 24, 27), "bg2": (59, 130, 246), "accent": (245, 158, 11)},
        "motif": "media"
    },
    {
        "id": "ufc-ulis",
        "name": "CLB Bóng Đá Sinh Viên ULIS (ULIS Football Club)",
        "acronym": "UFC",
        "category_name": "Sở thích & Năng khiếu",
        "slogan": "Đoàn kết – Cống hiến – Hết mình vì màu cờ sắc áo",
        "status": "Tuyển bổ sung vị trí",
        "colors": {"bg1": (5, 46, 22), "bg2": (22, 163, 74), "accent": (250, 204, 21)},
        "motif": "football"
    },
    {
        "id": "drama-club",
        "name": "CLB Kịch Nghệ & Điện Ảnh Ngoại Ngữ (Drama Club)",
        "acronym": "DRAMA",
        "category_name": "Sở thích & Năng khiếu",
        "slogan": "Sân khấu là nơi hiện thực hóa những giấc mơ nghệ thuật",
        "status": "Tuyển diễn viên kịch",
        "colors": {"bg1": (76, 5, 25), "bg2": (180, 83, 9), "accent": (254, 240, 138)},
        "motif": "drama"
    },
    {
        "id": "reception-team",
        "name": "Đội Lễ Tân Ngoại Ngữ (ULIS Reception Team)",
        "acronym": "URT ULIS",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Thanh lịch – Chuyên nghiệp – Tự tin tỏa sáng",
        "status": "Mở đơn Gen 9",
        "colors": {"bg1": (12, 30, 60), "bg2": (30, 58, 138), "accent": (245, 158, 11)},
        "motif": "reception"
    },
    {
        "id": "volunteer-club",
        "name": "CLB Tình Nguyện Hoa Đá ULIS (Hoa Da Club)",
        "acronym": "HOA ĐÁ",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Sống là cho đâu chỉ nhận riêng mình",
        "status": "Tuyển TNV Đông Ấm 2026",
        "colors": {"bg1": (6, 78, 59), "bg2": (13, 148, 136), "accent": (254, 240, 138)},
        "motif": "volunteer"
    },
    {
        "id": "youth-taskforce",
        "name": "Đội Thanh Niên Xung Kích ULIS (Youth Taskforce)",
        "acronym": "TNXK ULIS",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Xung kích – Tiên phong – Kỷ luật – Trách nhiệm",
        "status": "Nhận hồ sơ đợt đông",
        "colors": {"bg1": (20, 30, 80), "bg2": (185, 28, 28), "accent": (245, 158, 11)},
        "motif": "taskforce"
    },
    {
        "id": "soft-skills-club",
        "name": "CLB Kỹ Năng Mềm & Hướng Nghiệp (Soft Skills Club)",
        "acronym": "SSC ULIS",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Trang bị kỹ năng vững vàng – Định hướng tương lai",
        "status": "Chuẩn bị tuyển đợt 2",
        "colors": {"bg1": (4, 47, 46), "bg2": (8, 145, 178), "accent": (249, 115, 22)},
        "motif": "skills"
    },
    {
        "id": "blood-donation",
        "name": "CLB Vận Động Hiến Máu Nhân Đạo (Đội Máu ULIS)",
        "acronym": "ĐỘI MÁU",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Một giọt máu cho đi – Một cuộc đời ở lại",
        "status": "Mở đơn Ngày Hội Nắng",
        "colors": {"bg1": (76, 5, 25), "bg2": (225, 29, 72), "accent": (254, 205, 211)},
        "motif": "blood"
    },
    {
        "id": "buddy-club",
        "name": "CLB Bạn Đồng Hành Sinh Viên Quốc Tế (Buddy Club)",
        "acronym": "UBC",
        "category_name": "Kỹ năng & Tình nguyện",
        "slogan": "Be a Buddy, Make Global Friends",
        "status": "Tuyển Buddy Mùa Xuân",
        "colors": {"bg1": (15, 118, 110), "bg2": (2, 132, 199), "accent": (250, 204, 21)},
        "motif": "buddy"
    }
]

def main():
    print("=== STARTING BATCH BANNERS GENERATION ===")
    print("Generating 12 deeply personalized Event banners...")
    gen_ev_01()
    gen_ev_02()
    gen_ev_03()
    gen_ev_04()
    gen_ev_05()
    gen_ev_06()
    gen_ev_07()
    gen_ev_08()
    gen_ev_09()
    gen_ev_10()
    gen_ev_11()
    gen_ev_12()
    
    print("\nGenerating 17 deeply personalized Club banners...")
    for club in clubs_data:
        gen_club_banner(
            club["id"],
            club["name"],
            club["acronym"],
            club["category_name"],
            club["slogan"],
            club["status"],
            club["colors"],
            club["motif"]
        )
    print("\n=== COMPLETED! ALL 12 EVENTS AND 17 CLUBS BANNERS GENERATED ===")

if __name__ == "__main__":
    main()
