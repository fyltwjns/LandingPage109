import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets/news', exist_ok=True)
os.makedirs('assets/gallery', exist_ok=True)

# Try fonts
try:
    font_bold_lg = ImageFont.truetype('arialbd.ttf', 42)
    font_bold_md = ImageFont.truetype('arialbd.ttf', 22)
    font_reg = ImageFont.truetype('arial.ttf', 24)
    font_tag = ImageFont.truetype('arialbd.ttf', 18)
except:
    font_bold_lg = font_bold_md = font_reg = font_tag = ImageFont.load_default()

# 1. Generate News Banners (1280x720)
news_items = [
    {
        'file': 'assets/news/news-01',
        'tag': 'THÔNG BÁO CHÍNH THỨC • PHÒNG CT&CT HSSV',
        'title': 'Kế Hoạch Xét Cấp Chứng Nhận Ngoại Khóa\nA1 - A2 - A3 Học Kỳ I (2026 - 2027)',
        'date': '15/11/2026',
        'bg1': (11, 35, 65), 'bg2': (0, 75, 181),
        'accent': (245, 158, 11)
    },
    {
        'file': 'assets/news/news-02',
        'tag': 'ĐOÀN THANH NIÊN - HỘI SINH VIÊN ULIS',
        'title': 'Phát Động Chiến Dịch "Sinh Viên 5 Tốt"\n& Tháng Rèn Luyện Sinh Viên ULIS 2026',
        'date': '10/11/2026',
        'bg1': (15, 60, 40), 'bg2': (16, 120, 80),
        'accent': (52, 211, 153)
    },
    {
        'file': 'assets/news/news-03',
        'tag': 'SỰ KIỆN TOÀN TRƯỜNG • VĂN HÓA QUỐC TẾ',
        'title': 'Khai Mạc Tuần Lễ Văn Hóa Quốc Tế\n& Chung Kết Hùng Biện Ngoại Ngữ 2026',
        'date': '05/11/2026',
        'bg1': (70, 20, 90), 'bg2': (130, 40, 150),
        'accent': (251, 191, 36)
    }
]

for n in news_items:
    img = Image.new('RGB', (1280, 720), n['bg1'])
    draw = ImageDraw.Draw(img)
    for y in range(720):
        ratio = y / 720.0
        r = int(n['bg1'][0] * (1 - ratio) + n['bg2'][0] * ratio)
        g = int(n['bg1'][1] * (1 - ratio) + n['bg2'][1] * ratio)
        b = int(n['bg1'][2] * (1 - ratio) + n['bg2'][2] * ratio)
        draw.line([(0, y), (1280, y)], fill=(r, g, b))
    
    # Grid lines overlay
    for x in range(0, 1280, 80):
        draw.line([(x, 0), (x, 720)], fill=(255, 255, 255, 15))
    for y in range(0, 720, 80):
        draw.line([(0, y), (1280, y)], fill=(255, 255, 255, 15))
        
    draw.rounded_rectangle([70, 70, 560, 115], radius=10, fill=n['accent'])
    draw.text((85, 80), n['tag'], fill=(10, 25, 45), font=font_tag)
    draw.text((70, 180), n['title'], fill=(255, 255, 255), font=font_bold_lg, spacing=20)
    
    draw.rectangle([70, 560, 1210, 562], fill=(255, 255, 255, 60))
    draw.text((70, 590), f"TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN • {n['date']}", fill=(200, 220, 255), font=font_reg)
    
    img.save(f"{n['file']}.webp", 'WEBP', quality=90)
    img.save(f"{n['file']}.png", 'PNG')

# 2. Generate Gallery Images (800x600 4:3)
gallery_items = [
    {
        'file': 'assets/gallery/gal-01',
        'title': 'ULIS International Day 2026',
        'subtitle': 'Ngày hội Văn hóa & Ẩm thực 7 Quốc gia tại Sân A1-A2',
        'bg1': (20, 45, 95), 'bg2': (0, 100, 200)
    },
    {
        'file': 'assets/gallery/gal-02',
        'title': 'Chung Kết Hùng Biện Tiếng Anh',
        'subtitle': 'Hội trường Sunwah rực lửa với 500 sinh viên tham dự',
        'bg1': (15, 60, 50), 'bg2': (10, 130, 90)
    },
    {
        'file': 'assets/gallery/gal-03',
        'title': 'Chiến Dịch Mùa Hè Xanh',
        'subtitle': 'Đội Tình nguyện ULIS tại xã vùng cao huyện Ba Vì',
        'bg1': (70, 30, 20), 'bg2': (160, 70, 30)
    },
    {
        'file': 'assets/gallery/gal-04',
        'title': 'Tuyên Dương Sinh Viên 5 Tốt',
        'subtitle': 'Vinh danh 120 sinh viên xuất sắc cấp ĐHQGHN tại Vũ Đình Liên',
        'bg1': (50, 15, 80), 'bg2': (120, 30, 160)
    }
]

for item in gallery_items:
    img = Image.new('RGB', (800, 600), item['bg1'])
    draw = ImageDraw.Draw(img)
    for y in range(600):
        ratio = y / 600.0
        cr = int(item['bg1'][0] * (1 - ratio) + item['bg2'][0] * ratio)
        cg = int(item['bg1'][1] * (1 - ratio) + item['bg2'][1] * ratio)
        cb = int(item['bg1'][2] * (1 - ratio) + item['bg2'][2] * ratio)
        draw.line([(0, y), (800, y)], fill=(cr, cg, cb))
        
    for x in range(0, 800, 50):
        draw.line([(x, 0), (x, 600)], fill=(255, 255, 255, 12))
    for y in range(0, 600, 50):
        draw.line([(0, y), (800, y)], fill=(255, 255, 255, 12))
        
    draw.rounded_rectangle([40, 420, 760, 560], radius=16, fill=(10, 20, 40, 200))
    draw.text((60, 440), item['title'], fill=(255, 255, 255), font=font_bold_md)
    draw.text((60, 485), item['subtitle'], fill=(203, 213, 225), font=font_reg)
    
    img.save(f"{item['file']}.webp", 'WEBP', quality=90)
    img.save(f"{item['file']}.png", 'PNG')

print('All portal banners & gallery assets created successfully!')
