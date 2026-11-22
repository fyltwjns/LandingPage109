/**
 * ULIS Vibe - Dữ liệu dự án Nhóm 109 (Lớp FLF1007)
 * Đề xuất ý tưởng Cổng thông tin sự kiện, CLB & Chứng nhận Ngoại khóa ULIS
 */

const ULIS_DATA = {
  // Thông tin đề tài & nhóm
  projectInfo: {
    name: "ULIS Vibe",
    tagline: "Nền tảng kết nối sự kiện, câu lạc bộ & tra cứu chứng nhận toàn diện dành cho sinh viên ULIS",
    subtext: "Một địa chỉ duy nhất – Không còn trôi tin, không còn lỡ hẹn, nắm chắc lộ trình rèn luyện A1, A2, A3.",
    university: "Trường Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội (ULIS - VNU)",
    department: "Bộ môn Công nghệ thông tin & Truyền thông",
    academicYear: "Học kỳ I: Năm học 2026 - 2027",
    classCode: "FLF1007",
    teamName: "Nhóm 109",
    leader: "Đoàn Thị Phương Thảo",
    contact: {
      address: "Số 2, Phạm Văn Đồng, Cầu Giấy, Hà Nội",
      phone: "0919672122",
      email: "phuongthaodoan07@gmail.com"
    },
    budget: {
      total: "800.000 đ",
      items: [
        { name: "In poster A2 (kèm mã QR) dán tại các khu vực sinh viên tập trung", unit: "5 tờ", price: "30.000 đ", total: "150.000 đ" },
        { name: "Standee giới thiệu dự án, mã QR check-in và truy cập nền tảng", unit: "1 cái", price: "100.000 đ", total: "100.000 đ" },
        { name: "Quà tặng sinh viên tham gia thử nghiệm và góp ý", unit: "20 phần", price: "25.000 đ", total: "500.000 đ" },
        { name: "Chi phí dự phòng phát sinh (~5%)", unit: "1 gói", price: "50.000 đ", total: "50.000 đ" }
      ]
    }
  },

  // Thành viên nhóm 109
  teamMembers: [
    { stt: 1, msv: "25041061", name: "Phạm Công Thành", faculty: "Sư phạm Tiếng Anh", phone: "0967876963", email: "emperpham@gmail.com", role: "Nghiên cứu & Khảo sát dữ liệu" },
    { stt: 2, msv: "25041062", name: "Tạ Tiến Thành", faculty: "Ngôn ngữ & VH Anh", phone: "0325288207", email: "tatienthanh07@gmail.com", role: "Thiết kế giao diện UI/UX" },
    { stt: 3, msv: "25041063", name: "Vũ Chí Thành", faculty: "NN&VH Anh", phone: "0328640369", email: "vuchithanhts2007@gmail.com", role: "Phát triển tính năng Event Hub & Lịch" },
    { stt: 4, msv: "24042131", name: "Bùi Phương Thảo", faculty: "Ngôn ngữ & VH Trung Quốc", phone: "0979941483", email: "suzy41536@gmail.com", role: "Tổng hợp dữ liệu Club Directory" },
    { stt: 5, msv: "25041065", name: "Đào Phương Thảo", faculty: "Ngôn ngữ & VH Nhật Bản", phone: "0369481595", email: "pthaodao3010@gmail.com", role: "Chuẩn hóa quy chế Cert Hub A1-A2-A3" },
    { stt: 6, msv: "25040188", name: "Đoàn Thị Phương Thảo", faculty: "NN&VH Anh", phone: "0919672122", email: "phuongthaodoan07@gmail.com", role: "Nhóm trưởng / Điều phối dự án", isLeader: true },
    { stt: 7, msv: "25041068", name: "Hà Phương Thảo", faculty: "NN&VH Anh", phone: "0397536963", email: "haphuongthao2401@gmail.com", role: "Kế hoạch truyền thông & Báo cáo thử nghiệm" }
  ],

  // Số liệu khảo sát 105 sinh viên ULIS
  surveyStats: {
    sampleSize: 105,
    missedOpportunities: {
      often: 28.6,
      sometimes: 42.9,
      rarely: 19.0,
      neverDueToNoNeed: 5.7,
      never: 3.8,
      totalMissed: 71.5
    },
    informationChannels: [
      { name: "Facebook (Fanpage)", percentage: 43.8, color: "#1877F2" },
      { name: "Bạn bè, người quen", percentage: 26.7, color: "#F59E0B" },
      { name: "Group sinh viên", percentage: 19.0, color: "#10B981" },
      { name: "Thông báo chính thức", percentage: 10.5, color: "#6366F1" }
    ],
    recruitmentAwareness: [
      { name: "Biết rõ", percentage: 35.2, color: "#10B981" },
      { name: "Đã nghe nhưng chưa rõ", percentage: 50.5, color: "#F59E0B" },
      { name: "Chưa biết", percentage: 14.3, color: "#EF4444" }
    ],
    certUnderstanding: [
      { level: "Mức 1 (Mơ hồ/Không biết)", count: 13, percentage: 12.4 },
      { level: "Mức 2 (Ít hiểu)", count: 13, percentage: 12.4 },
      { level: "Mức 3 (Bình thường)", count: 26, percentage: 24.8 },
      { level: "Mức 4 (Khá rõ)", count: 35, percentage: 33.3 },
      { level: "Mức 5 (Rất rõ)", count: 18, percentage: 17.1 }
    ],
    topDifficulties: [
      { issue: "Không biết CLB nào phù hợp", count: 69, percentage: 65.7 },
      { issue: "Xung đột thời gian giữa các lịch", count: 66, percentage: 62.9 },
      { issue: "Thiếu kinh nghiệm, kỹ năng cần thiết", count: 62, percentage: 59.0 },
      { issue: "Khó nắm thông tin lịch sinh hoạt", count: 61, percentage: 58.1 },
      { issue: "Chưa rõ tiêu chí tuyển chọn thành viên", count: 57, percentage: 54.3 },
      { issue: "Khó theo dõi thông báo, hạn chót", count: 54, percentage: 51.4 },
      { issue: "Thiếu kênh tổng hợp uy tín toàn trường", count: 52, percentage: 49.5 },
      { issue: "Lo ngại khối lượng công việc quá tải", count: 50, percentage: 47.6 },
      { issue: "Chưa có nhu cầu tham gia", count: 48, percentage: 45.7 },
      { issue: "Khó tìm hiểu nội dung hoạt động", count: 42, percentage: 40.0 },
      { issue: "Thiếu thông tin về các cơ hội rèn luyện", count: 38, percentage: 36.2 },
      { issue: "Hạn chế về chi phí tham gia", count: 37, percentage: 35.2 },
      { issue: "Quy trình đăng ký, ứng tuyển rườm rà", count: 37, percentage: 35.2 }
    ],
    readinessToUse: [
      { name: "Sẵn sàng nếu tiện lợi, dễ thao tác", percentage: 34.3, color: "#3B82F6" },
      { name: "Chưa chắc chắn, cần tìm hiểu thêm", percentage: 18.1, color: "#10B981" },
      { name: "Có thể sử dụng tùy theo tính năng", percentage: 16.2, color: "#F59E0B" },
      { name: "Không có nhu cầu sử dụng", percentage: 16.2, color: "#8B5CF6" },
      { name: "Rất sẵn sàng & có nhu cầu thường xuyên", percentage: 15.2, color: "#EC4899" }
    ]
  },

  // Danh mục Câu lạc bộ ULIS (Club Directory) chia thành 3 nhóm chuẩn xác
  clubs: [
    // 1. NHÓM HỌC THUẬT (ACADEMIC)
    {
      id: "ec-ulis",
      image: "./assets/clubs/ec-ulis.webp",
      name: "CLB Tiếng Anh (English Club - EC ULIS)",
      acronym: "EC ULIS",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "book-open",
      slogan: "Connect, Inspire, Empower through English",
      description: "Câu lạc bộ học thuật ngôn ngữ lớn và giàu truyền thống nhất trường Đại học Ngoại ngữ, tạo môi trường luyện nói, tranh biện và giao lưu học thuật tiếng Anh hàng đầu cho sinh viên.",
      activities: [
        "Sinh hoạt định kỳ Speak Out thứ Năm hàng tuần tại Không gian Sáng tạo Sunwah",
        "Cuộc thi Hùng biện Tiếng Anh thường niên toàn trường English Challenge",
        "Workshop kỹ năng thuyết trình, chuẩn bị chứng chỉ IELTS/C1 VSTEP",
        "Giao lưu ngoại giao với sinh viên quốc tế và giảng viên bản ngữ"
      ],
      targetAudience: "Sinh viên toàn trường yêu thích tiếng Anh, có mong muốn cải thiện sự tự tin khi thuyết trình và mở rộng vốn từ chuyên ngành.",
      recruitmentPeriod: "Tuyển quân Mùa Thu (Tháng 10 - 11) & Tuyển bổ sung (Tháng 2)",
      currentStatus: "Đang mở đơn Gen 24",
      formLink: "https://forms.gle/ulis-ec-recruitment-2026",
      facebook: "https://facebook.com/ec.ulis.vnu",
      email: "ec.ulis.vnu@gmail.com",
      tags: ["Tiếng Anh", "Hùng biện", "Học thuật", "C1 VSTEP"]
    },
    {
      id: "src-ulis",
      image: "./assets/clubs/src-ulis.webp",
      name: "CLB Nghiên cứu Khoa học Sinh viên (SRC ULIS)",
      acronym: "SRC ULIS",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "microscope",
      slogan: "Nurturing Academic Passion & Research Excellence",
      description: "Tổ chức học thuật trực thuộc Đoàn Thanh niên - Hội Sinh viên phối hợp cùng Phòng KHCN, kết nối sinh viên đam mê nghiên cứu khoa học và viết bài báo quốc tế.",
      activities: [
        "Chuỗi Seminar 'Phương pháp NCKH và xử lý dữ liệu định lượng/định tính'",
        "Hỗ trợ tìm kiếm Giảng viên hướng dẫn cho đề tài NCKH sinh viên cấp Khoa/Trường",
        "Tổ chức Hội thảo học thuật sinh viên VNU Young Researchers Summit",
        "Tập san nghiên cứu khoa học trẻ phát hành định kỳ mỗi học kỳ"
      ],
      targetAudience: "Sinh viên năm 1-4 yêu thích nghiên cứu khoa học ngôn ngữ, giáo dục học, văn hóa học, muốn tích lũy chứng nhận A1 và giải thưởng SV NCKH.",
      recruitmentPeriod: "Tuyển quân đợt 1 (Tháng 11/2026) & Đợt 2 (Tháng 1/2027)",
      currentStatus: "Sắp mở đơn tuyển cộng tác viên",
      formLink: "https://forms.gle/src-ulis-apply-2026",
      facebook: "https://facebook.com/src.ulis",
      email: "src.ulis@vnu.edu.vn",
      tags: ["NCKH", "A1 Chứng nhận", "Hội thảo", "Viết bài báo"]
    },
    {
      id: "chinese-club",
      image: "./assets/clubs/chinese-club.webp",
      name: "CLB Tiếng Trung (Hán Ngữ ULIS - HanYu Club)",
      acronym: "HYC",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "languages",
      slogan: "Thế giới rộng lớn – Tiếng Trung kết nối",
      description: "Mái nhà chung của sinh viên khoa Ngôn ngữ & Văn hóa Trung Quốc cùng các bạn sinh viên toàn trường yêu thích tiếng Trung, văn hóa và nghệ thuật thư pháp Đông Á.",
      activities: [
        "Góc đàm thoại Hán ngữ thứ Tư hàng tuần tại khuôn viên A2",
        "Lễ hội Văn hóa Trung Hoa & Gian hàng ẩm thực truyền thống",
        "Ôn luyện chứng chỉ HSK 4-5-6 và kỹ năng biên phiên dịch đối ngoại",
        "Cuộc thi lồng tiếng phim và hát tiếng Trung toàn trường"
      ],
      targetAudience: "Sinh viên chuyên ngành tiếng Trung và sinh viên các ngoại ngữ khác đang học ngoại ngữ 2 tiếng Trung.",
      recruitmentPeriod: "Đầu mỗi học kỳ (Tháng 10 và Tháng 2)",
      currentStatus: "Sinh hoạt định kỳ",
      formLink: "https://forms.gle/hanyu-club-reg",
      facebook: "https://facebook.com/hanyu.ulis",
      email: "hanyu.ulis@gmail.com",
      tags: ["Tiếng Trung", "HSK", "Văn hóa", "Ngoại ngữ 2"]
    },
    {
      id: "japanese-club",
      image: "./assets/clubs/japanese-club.webp",
      name: "CLB Tiếng Nhật Hikari (Hikari Japanese Club)",
      acronym: "HJC",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "sparkles",
      slogan: "Lan tỏa ánh sáng văn hóa & ngôn ngữ Phù Tang",
      description: "CLB chuyên sâu về giao lưu ngôn ngữ tiếng Nhật, văn hóa trà đạo, cosplay và kết nối cơ hội thực tập, việc làm tại các tập đoàn Nhật Bản.",
      activities: [
        "Kaiwa Club - Luyện phản xạ giao tiếp với sinh viên tình nguyện Nhật Bản",
        "Ngày hội Văn hóa Nhật Bản Bunkasai tại Hội trường Sunwah",
        "Workshop chia sẻ kinh nghiệm săn học bổng MEXT và kỳ thi JLPT N2-N1",
        "Trải nghiệm nghệ thuật gấp giấy Origami và Thư đạo Nhật Bản"
      ],
      targetAudience: "Tất cả sinh viên có đam mê với đất nước mặt trời mọc, từ sơ cấp N5 đến cao cấp N1.",
      recruitmentPeriod: "Tháng 11 hàng năm",
      currentStatus: "Đang nhận hồ sơ phỏng vấn",
      formLink: "https://forms.gle/hikari-apply",
      facebook: "https://facebook.com/hikari.ulis",
      email: "hikari.japan.ulis@gmail.com",
      tags: ["Tiếng Nhật", "JLPT", "Văn hóa Nhật", "Học bổng"]
    },
    {
      id: "korean-club",
      image: "./assets/clubs/korean-club.webp",
      name: "CLB Tiếng Hàn & Văn Hóa Hàn Quốc (K-ULIS)",
      acronym: "K-ULIS",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "heart",
      slogan: "Kết nối đam mê – Trải nghiệm bản sắc Hàn Quốc",
      description: "Không gian học tập và thực hành tiếng Hàn sôi động, tổ chức các cuộc thi nói tiếng Hàn, trải nghiệm Hanbok và ẩm thực xứ kim chi.",
      activities: [
        "Lớp học ôn thi TOPIK II cấp tốc do sinh viên năm 4 và cựu sinh viên giảng dạy",
        "Cuộc thi K-Speech Contest phối hợp với Trung tâm Văn hóa Hàn Quốc KCC",
        "Tuần lễ Phim ảnh và Văn hóa Hàn Quốc",
        "Chương trình giao lưu thường niên với các trường Đại học Seoul, Busan"
      ],
      targetAudience: "Sinh viên Khoa NN&VH Hàn Quốc và sinh viên học tiếng Hàn ngoại ngữ 2.",
      recruitmentPeriod: "Tháng 10 - Tháng 12",
      currentStatus: "Chuẩn bị tuyển bổ sung kỳ 2",
      formLink: "https://forms.gle/kulis-member",
      facebook: "https://facebook.com/kulis.official",
      email: "kulis.club@gmail.com",
      tags: ["Tiếng Hàn", "TOPIK", "K-Culture", "Giao lưu"]
    },
    {
      id: "translation-club",
      image: "./assets/clubs/translation-club.webp",
      name: "CLB Biên Phiên Dịch Trẻ (Young Translators Club - YTC)",
      acronym: "YTC ULIS",
      category: "academic",
      categoryName: "CLB Học thuật",
      badgeColor: "blue",
      logoIcon: "file-text",
      slogan: "Chính xác từng câu từ – Nâng tầm bản dịch",
      description: "Môi trường rèn luyện kỹ năng dịch thuật văn bản học thuật, hợp đồng thương mại và thực hành Cabin phiên dịch song song với trang thiết bị chuyên dụng của trường.",
      activities: [
        "Mock Conference - Mô phỏng hội nghị quốc tế và thực hành dịch Cabin",
        "Biên dịch các tài liệu tin tức, bài nghiên cứu và phụ đề video phi lợi nhuận",
        "Tọa đàm hướng nghiệp với các chuyên gia biên phiên dịch tại các Bộ/Ban ngành",
        "Thử thách 'Dịch chuẩn mỗi ngày' trên cộng đồng học tập"
      ],
      targetAudience: "Sinh viên năm 2 trở lên của tất cả các chuyên ngành ngôn ngữ có định hướng nghề nghiệp biên phiên dịch chuyên nghiệp.",
      recruitmentPeriod: "Tháng 11 và Tháng 3",
      currentStatus: "Mở đơn tuyển Ban Nội dung & Ban Phiên dịch",
      formLink: "https://forms.gle/ytc-recruitment-2026",
      facebook: "https://facebook.com/ytc.ulis",
      email: "ytc.ulis.translators@gmail.com",
      tags: ["Biên dịch", "Phiên dịch Cabin", "Kỹ năng chuyên môn", "A1"]
    },

    // 2. NHÓM SỞ THÍCH VÀ NĂNG KHIẾU (INTERESTS & TALENTS)
    {
      id: "mmc-ulis",
      image: "./assets/clubs/mmc-ulis.webp",
      name: "CLB Âm Nhạc Ngoại Ngữ (Modern Music Club - MMC)",
      acronym: "MMC ULIS",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      badgeColor: "amber",
      logoIcon: "music",
      slogan: "Nơi âm nhạc xóa nhòa mọi ranh giới ngôn ngữ",
      description: "Câu lạc bộ nghệ thuật nổi bật với các ban chuyên môn: Hát (Vocal), Nhạc cụ (Band), Sản xuất âm nhạc và Truyền thông sự kiện, linh hồn của các đêm nhạc ULIS.",
      activities: [
        "Đêm nhạc thường niên MMC Acoustic Night tại sân tượng đài ULIS",
        "Biểu diễn trong các chương trình Gala Chào tân sinh viên, Ngày hội Việc làm",
        "Workshop thanh nhạc cơ bản và kỹ năng chơi nhạc cụ acoustic/guitar/cajon",
        "Phòng thu và sản xuất các bản cover đa ngôn ngữ triệu views"
      ],
      targetAudience: "Sinh viên có giọng hát, khả năng chơi bất kỳ nhạc cụ nào hoặc đam mê kỹ thuật âm thanh, sân khấu.",
      recruitmentPeriod: "Tháng 10 - Tháng 11 (Vòng casting trực tiếp)",
      currentStatus: "Đã hoàn thành casting đợt 1, tuyển ban Hậu cần",
      formLink: "https://forms.gle/mmc-ulis-casting",
      facebook: "https://facebook.com/mmc.ulis",
      email: "mmc.modernmusic@gmail.com",
      tags: ["Âm nhạc", "Vocal", "Acoustic", "Biểu diễn", "A3"]
    },
    {
      id: "udc-ulis",
      image: "./assets/clubs/udc-ulis.webp",
      name: "CLB Vũ Đạo Ngoại Ngữ (ULIS Dance Club - UDC)",
      acronym: "UDC ULIS",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      badgeColor: "amber",
      logoIcon: "flame",
      slogan: "Dance with Passion, Shine with Rhythm",
      description: "Đội nhảy đại diện trường tham gia các giải đấu nhảy sinh viên toàn quốc (VUG), biểu diễn các thể loại Street Dance, Kpop Cover, Choreography và Contemporary.",
      activities: [
        "Luyện tập thể lực và vũ đạo cơ bản 3 buổi/tuần tại sảnh nhà C",
        "Đại diện trường tham dự Giải Nhảy Đối Kháng Sinh viên Hà Nội",
        "Show diễn Showcase thường niên quy tụ hàng nghìn khán giả",
        "Lớp workshop vũ đạo miễn phí mở rộng cho sinh viên toàn trường"
      ],
      targetAudience: "Sinh viên đam mê nhảy múa, có tinh thần đồng đội cao và mong muốn rèn luyện sức khỏe, phong thái tự tin.",
      recruitmentPeriod: "Tháng 10 hàng năm",
      currentStatus: "Đang tập luyện giải mùa đông",
      formLink: "https://forms.gle/udc-audition",
      facebook: "https://facebook.com/ulisdanceclub",
      email: "udc.dance@gmail.com",
      tags: ["Nhảy", "Kpop Cover", "VUG", "Năng khiếu", "A3"]
    },
    {
      id: "umc-ulis",
      image: "./assets/clubs/umc-ulis.webp",
      name: "CLB Truyền Thông & Nhiếp Ảnh (ULIS Media Club - UMC)",
      acronym: "UMC ULIS",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      badgeColor: "amber",
      logoIcon: "camera",
      slogan: "Lưu giữ từng khoảnh khắc thanh xuân dưới mái trường ULIS",
      description: "Đơn vị phụ trách hình ảnh, quay phim, chụp ảnh và sản xuất nội dung số cho các sự kiện cấp trường và các chiến dịch truyền thông của Đoàn - Hội.",
      activities: [
        "Nhiếp ảnh tác nghiệp tại tất cả các sự kiện lớn của ULIS",
        "Khóa đào tạo Photoshop, Premiere, Lightroom và tư duy bố cục ảnh",
        "Dự án triển lãm ảnh nghệ thuật 'ULIS trong mắt tôi'",
        "Sản xuất các video viral về đời sống sinh viên trên TikTok & YouTube"
      ],
      targetAudience: "Sinh viên yêu thích chụp ảnh máy cơ/điện thoại, thiết kế đồ họa, viết kịch bản hoặc dựng video ngắn.",
      recruitmentPeriod: "Tuyển quân Tháng 11/2026",
      currentStatus: "Mở đơn tuyển Media & Design Gen 12",
      formLink: "https://forms.gle/umc-recruitment-gen12",
      facebook: "https://facebook.com/umc.ulis",
      email: "media.umc.ulis@gmail.com",
      tags: ["Nhiếp ảnh", "Thiết kế", "Video", "Truyền thông"]
    },
    {
      id: "ufc-ulis",
      image: "./assets/clubs/ufc-ulis.webp",
      name: "CLB Bóng Đá Sinh Viên ULIS (ULIS Football Club)",
      acronym: "UFC",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      badgeColor: "amber",
      logoIcon: "trophy",
      slogan: "Đoàn kết – Cống hiến – Hết mình vì màu cờ sắc áo",
      description: "Đội tuyển bóng đá nam và nữ đại diện trường thi đấu tại giải bóng đá sinh viên VNU và tổ chức giải bóng đá nội bộ ULIS Cup.",
      activities: [
        "Tập luyện chiến thuật hàng tuần tại Sân vận động Ngoại ngữ",
        "Tổ chức giải bóng đá sinh viên liên khoa ULIS Cup thường niên",
        "Giao hữu định kỳ với các trường đại học thành viên ĐHQGHN",
        "Hoạt động gắn kết đội bóng và cổ động viên văn minh"
      ],
      targetAudience: "Sinh viên nam và nữ yêu thích môn thể thao vua, có tinh thần rèn luyện thể lực bền bỉ.",
      recruitmentPeriod: "Đầu kỳ 1 và Đầu kỳ 2",
      currentStatus: "Tuyển chọn bổ sung vị trí Thủ môn & Hậu vệ",
      formLink: "https://forms.gle/ufc-tryout",
      facebook: "https://facebook.com/ufc.ulis",
      email: "ufc.football@gmail.com",
      tags: ["Bóng đá", "Thể thao", "ULIS Cup", "Sức khỏe"]
    },
    {
      id: "drama-club",
      image: "./assets/clubs/drama-club.webp",
      name: "CLB Kịch Nghệ & Điện Ảnh Ngoại Ngữ (Drama Club)",
      acronym: "UDC Drama",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      badgeColor: "amber",
      logoIcon: "clapperboard",
      slogan: "Sân khấu là nơi hiện thực hóa những giấc mơ nghệ thuật",
      description: "Sân chơi kịch nghệ đa ngôn ngữ, dàn dựng các vở kịch kinh điển bằng tiếng Anh, Pháp, Trung, Nga và sáng tác kịch ngắn đương đại.",
      activities: [
        "Công diễn vở kịch sân khấu thường niên tại Hội trường Vũ Đình Liên",
        "Lớp tập huấn diễn xuất, biểu cảm hình thể và biên kịch kịch bản",
        "Tham gia Liên hoan Sân khấu Sinh viên Thủ đô",
        "Câu lạc bộ chiếu phim và phân tích điện ảnh cuối tuần"
      ],
      targetAudience: "Sinh viên yêu thích diễn xuất, biên kịch, thiết kế đạo cụ sân khấu và trang điểm nghệ thuật.",
      recruitmentPeriod: "Tháng 11 hàng năm",
      currentStatus: "Mở đơn tuyển diễn viên vở kịch Giáng sinh",
      formLink: "https://forms.gle/drama-ulis-casting",
      facebook: "https://facebook.com/dramaclub.ulis",
      email: "drama.club.ulis@gmail.com",
      tags: ["Kịch nghệ", "Diễn xuất", "Biên kịch", "Nghệ thuật"]
    },

    // 3. NHÓM KỸ NĂNG VÀ TÌNH NGUYỆN (SKILLS & VOLUNTEERING)
    {
      id: "reception-team",
      image: "./assets/clubs/reception-team.webp",
      name: "Đội Lễ Tân Ngoại Ngữ (ULIS Reception Team - URT)",
      acronym: "URT ULIS",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "award",
      slogan: "Thanh lịch – Chuyên nghiệp – Tự tin tỏa sáng",
      description: "Đội hình tiêu biểu đại diện cho bộ mặt của sinh viên ULIS trong công tác đón tiếp đại biểu quốc tế, lãnh đạo Nhà nước và các sự kiện ngoại giao trọng thể.",
      activities: [
        "Đón tiếp đại sứ quán, khách quốc tế và lãnh đạo ĐHQGHN tại Hội trường Sunwah",
        "Khóa tập huấn chuyên sâu về nghi thức ngoại giao, dáng đi, nụ cười và giao tiếp lễ tân",
        "Điều phối thảm đỏ, trao bằng khen trong Lễ Bế giảng và Khai giảng toàn trường",
        "Tham gia các hội nghị ngoại giao tầm cỡ quốc gia do Bộ Ngoại giao tổ chức"
      ],
      targetAudience: "Sinh viên có ngoại hình thanh lịch, chiều cao phù hợp (Nữ >= 1m60, Nam >= 1m70), giọng nói chuẩn và khả năng giao tiếp ngoại ngữ lưu loát.",
      recruitmentPeriod: "Tháng 11/2026 (Tuyển quân khóa mới)",
      currentStatus: "Đang mở đơn đăng ký Vòng Đơn Gen 9",
      formLink: "https://forms.gle/urt-gen9-recruitment",
      facebook: "https://facebook.com/urt.ulis",
      email: "letan.ulis@vnu.edu.vn",
      tags: ["Lễ tân", "Ngoại giao", "Kỹ năng mềm", "A2 Chứng nhận"]
    },
    {
      id: "volunteer-club",
      image: "./assets/clubs/volunteer-club.webp",
      name: "CLB Tình Nguyện Hoa Đá ULIS (Hoa Da Volunteer Club)",
      acronym: "HDC ULIS",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "hand-heart",
      slogan: "Sống là cho đâu chỉ nhận riêng mình",
      description: "Câu lạc bộ tình nguyện giàu truyền thống với hàng loạt chiến dịch vì cộng đồng, dạy học cho trẻ em vùng cao và hỗ trợ người có hoàn cảnh khó khăn.",
      activities: [
        "Chiến dịch Mùa Hè Xanh tại các xã khó khăn thuộc tỉnh miền núi phía Bắc",
        "Chương trình 'Đông Ấm Vùng Cao' trao tặng áo ấm và sách vở cho học sinh nghèo",
        "Lớp học tiếng Anh tình nguyện miễn phí cho trẻ em tại Làng trẻ SOS Hà Nội",
        "Hỗ trợ tổ chức giải chạy gây quỹ từ thiện và bảo vệ môi trường khuôn viên xanh"
      ],
      targetAudience: "Tất cả sinh viên có trái tim nhiệt huyết, không ngại khó khăn và mong muốn mang lại giá trị tích cực cho xã hội.",
      recruitmentPeriod: "Tháng 10 và Tháng 12 hàng năm",
      currentStatus: "Tuyển tình nguyện viên Đông Ấm 2026",
      formLink: "https://forms.gle/hoada-dongam2026",
      facebook: "https://facebook.com/hoada.volunteer.ulis",
      email: "tinhnguyenhoada.ulis@gmail.com",
      tags: ["Tình nguyện", "Mùa hè xanh", "A3 Chứng nhận", "Cộng đồng"]
    },
    {
      id: "youth-taskforce",
      image: "./assets/clubs/youth-taskforce.webp",
      name: "Đội Thanh Niên Xung Kích ULIS (Youth Taskforce)",
      acronym: "TNXK ULIS",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "shield-check",
      slogan: "Xung kích – Tiên phong – Kỷ luật – Trách nhiệm",
      description: "Cánh tay đắc lực của Đoàn Thanh niên - Hội Sinh viên trường, nòng cốt trong công tác an ninh, điều phối sự kiện lớn và các hoạt động phong trào thanh niên.",
      activities: [
        "Đảm bảo trật tự và phân luồng giao thông trong các kỳ thi VSTEP, THPT Chuyên Ngoại ngữ",
        "Chương trình Tiếp Sức Mùa Thi hàng năm tại các điểm thi trường Đại học Ngoại ngữ",
        "Huấn luyện kỹ năng sinh tồn, sơ cấp cứu và quản trị rủi ro sự kiện",
        "Tổ chức hội trại truyền thống và đêm lửa trại sinh viên ULIS"
      ],
      targetAudience: "Sinh viên năng động, có tinh thần trách nhiệm cao, tác phong nghiêm túc, muốn rèn luyện bản lĩnh chỉ huy.",
      recruitmentPeriod: "Tháng 11/2026",
      currentStatus: "Nhận hồ sơ đợt tuyển mùa đông",
      formLink: "https://forms.gle/tnxk-recruitment",
      facebook: "https://facebook.com/tnxk.ulis",
      email: "thanhnienxungkich@ulis.vnu.edu.vn",
      tags: ["Xung kích", "Tiếp sức mùa thi", "Kỷ luật", "A3 Chứng nhận"]
    },
    {
      id: "soft-skills-club",
      image: "./assets/clubs/soft-skills-club.webp",
      name: "CLB Kỹ Năng Mềm & Hướng Nghiệp (Soft Skills Club - SSC)",
      acronym: "SSC ULIS",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "compass",
      slogan: "Trang bị kỹ năng vững vàng – Định hướng tương lai bứt phá",
      description: "Tổ chức chuyên sâu tổ chức các chuỗi đào tạo về kỹ năng thuyết trình, quản lý thời gian, tư duy phản biện, làm việc nhóm và kết nối ngày hội việc làm.",
      activities: [
        "Chuỗi workshop 'Chinh phục nhà tuyển dụng đa quốc gia' cùng các HR Manager",
        "Buổi sửa CV 1-1 miễn phí cho sinh viên năm 3 và năm 4",
        "Tập huấn kỹ năng lãnh đạo dành cho cán bộ chi đoàn và ban chủ nhiệm CLB",
        "Tour tham quan thực tế doanh nghiệp FDI tại Hà Nội và các khu công nghiệp"
      ],
      targetAudience: "Sinh viên mọi khóa muốn nâng cao kỹ năng làm việc thực tế, sẵn sàng cho thị trường lao động toàn cầu.",
      recruitmentPeriod: "Tháng 10 và Tháng 1 hàng năm",
      currentStatus: "Chuẩn bị mở đơn Tuyển thành viên đợt 2",
      formLink: "https://forms.gle/ssc-recruitment",
      facebook: "https://facebook.com/ssc.ulis",
      email: "softskills.ulis@gmail.com",
      tags: ["Kỹ năng mềm", "Hướng nghiệp", "CV Workshop", "A2"]
    },
    {
      id: "blood-donation",
      image: "./assets/clubs/blood-donation.webp",
      name: "CLB Vận Động Hiến Máu Nhân Đạo ULIS (Đội Máu ULIS)",
      acronym: "Đội Máu ULIS",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "droplet",
      slogan: "Một giọt máu cho đi – Một cuộc đời ở lại",
      description: "Đơn vị phối hợp cùng Viện Huyết học - Truyền máu Trung ương tổ chức các ngày hội hiến máu toàn trường quy mô hàng ngàn đơn vị máu mỗi năm.",
      activities: [
        "Ngày hội hiến máu 'Nắng Ngoại Ngữ' và 'Giọt Hồng Tri Ân' định kỳ 2 lần/năm",
        "Tuyên truyền lưu động về ý nghĩa nhân văn của việc hiến máu cứu người",
        "Huấn luyện kỹ năng chăm sóc người hiến máu và xử lý tình huống y tế cơ bản",
        "Chuyến đi dã ngoại và gắn kết tình nguyện viên thường niên"
      ],
      targetAudience: "Sinh viên có lòng nhân ái, mong muốn rèn luyện kỹ năng truyền thông trực tiếp và gắn kết cộng đồng hiến máu.",
      recruitmentPeriod: "Tháng 11 và Tháng 3",
      currentStatus: "Đang mở đơn Tuyển Tình nguyện viên Ngày hội Nắng Ngoại Ngữ",
      formLink: "https://forms.gle/doimau-ulis-apply",
      facebook: "https://facebook.com/doimau.ulis",
      email: "doimauulis@gmail.com",
      tags: ["Hiến máu", "Nhân đạo", "A3 Chứng nhận", "Cộng đồng"]
    },
    {
      id: "buddy-club",
      image: "./assets/clubs/buddy-club.webp",
      name: "CLB Bạn Đồng Hành Sinh Viên Quốc Tế (ULIS Buddy Club)",
      acronym: "UBC",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      badgeColor: "emerald",
      logoIcon: "globe",
      slogan: "Be a Buddy, Make Global Friends",
      description: "Cầu nối trực tiếp hỗ trợ lưu học sinh nước ngoài (Hàn Quốc, Nhật Bản, Trung Quốc, Pháp, Mỹ, Đức...) khi sang học tập và trải nghiệm tại ULIS.",
      activities: [
        "Đón tiếp và hỗ trợ thủ tục ký túc xá, làm thẻ ngân hàng cho lưu học sinh",
        "City Tour khám phá văn hóa Hà Nội và các danh lam thắng cảnh miền Bắc",
        "Chương trình Language Exchange 1 kèm 1 giữa sinh viên Việt Nam và quốc tế",
        "Lễ hội ẩm thực quốc tế International Food Festival"
      ],
      targetAudience: "Sinh viên có khả năng ngoại ngữ tốt, yêu thích giao lưu văn hóa và có tính cách thân thiện, chu đáo.",
      recruitmentPeriod: "Tháng 12/2026 & Tháng 8 hàng năm",
      currentStatus: "Mở đơn tuyển Buddy cho kỳ học mùa Xuân 2027",
      formLink: "https://forms.gle/ulis-buddy-reg",
      facebook: "https://facebook.com/ulisbuddyclub",
      email: "buddy.club@vnu.edu.vn",
      tags: ["Quốc tế", "Giao lưu văn hóa", "Language Exchange", "A2"]
    }
  ],

  // Lịch Sự Kiện & Tuyển Quân Toàn Trường (Event Hub)
  events: [
    {
      id: "ev-01",
      image: "./assets/events/ev-01.webp",
      title: "Hội thảo: Phương pháp Viết Báo Cáo Nghiên cứu Khoa học Sinh viên 2026",
      type: "event", // event | recruitment
      typeName: "Hội thảo Chuyên môn",
      category: "academic",
      categoryName: "Học thuật",
      certType: "A1",
      certName: "Chứng nhận A1 (Học thuật & NCKH)",
      organizer: "Phòng KHCN & CLB SRC ULIS",
      date: "2026-11-20",
      time: "08:30 - 11:30",
      location: "Hội trường Sunwah (Tầng 2)",
      format: "Trực tiếp",
      spotsLeft: 45,
      totalSpots: 150,
      description: "Trang bị phương pháp luận nghiên cứu, kỹ thuật tìm kiếm trích dẫn chuẩn APA 7th, kỹ năng xử lý số liệu định lượng với SPSS/R dành cho sinh viên chuẩn bị đề tài NCKH cấp Khoa và cấp Trường.",
      benefits: [
        "Được cấp Giấy chứng nhận Hoạt động Học thuật A1 (dùng xét điểm rèn luyện Tiêu chí 1 & Tiêu chí 2)",
        "Nhận cẩm nang Hướng dẫn Đề tài NCKH bản quyền ULIS",
        "Cơ hội được ghép nhóm cùng Giảng viên hướng dẫn uy tín"
      ],
      requirements: "Sinh viên mang theo laptop hoặc sổ ghi chép, check-in QR trước 08:20.",
      registrationDeadline: "2026-11-19 23:59",
      status: "open", // open | closing_soon | closed
      formUrl: "https://forms.gle/ulis-nckh-seminar-2026"
    },
    {
      id: "ev-02",
      image: "./assets/events/ev-02.webp",
      title: "Đợt Tuyển Quân Mùa Đông Gen 9 – Đội Lễ Tân Ngoại Ngữ URT",
      type: "recruitment",
      typeName: "Tuyển quân CLB",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      certType: "A2",
      certName: "Chứng nhận A2 (Kỹ năng Ngoại khóa)",
      organizer: "Đội Lễ tân ULIS (URT)",
      date: "2026-11-25",
      time: "Hạn chót vòng đơn: 23:59",
      location: "Trực tuyến (Phỏng vấn trực tiếp tại P.305 B2)",
      format: "Hồ sơ online",
      spotsLeft: 30,
      totalSpots: 100,
      description: "Tìm kiếm các gương mặt đại diện thanh lịch, năng động cho Đội Lễ tân ULIS. Cơ hội xuất hiện tại các sự kiện ngoại giao danh giá của ĐHQGHN và các bộ ban ngành.",
      benefits: [
        "Rèn luyện kỹ năng lễ tân ngoại giao, phong thái đĩnh đạc, ứng xử tình huống",
        "Nhận giấy chứng nhận A2 sau mỗi kỳ hoạt động tích cực",
        "Cơ hội mở rộng mối quan hệ với lãnh đạo, đại biểu quốc tế"
      ],
      requirements: "Sinh viên K58, K59, K60. Nữ cao từ 1m60, Nam cao từ 1m70.",
      registrationDeadline: "2026-11-25 23:59",
      status: "open",
      formUrl: "https://forms.gle/urt-gen9-apply"
    },
    {
      id: "ev-03",
      image: "./assets/events/ev-03.webp",
      title: "Cuộc thi Hùng biện Tiếng Anh English Challenge 2026 (Vòng Sơ loại)",
      type: "event",
      typeName: "Cuộc thi Học thuật",
      category: "academic",
      categoryName: "Học thuật",
      certType: "A1",
      certName: "Chứng nhận A1 (Học thuật & NCKH)",
      organizer: "Khoa Sư phạm Tiếng Anh & CLB EC ULIS",
      date: "2026-11-28",
      time: "14:00 - 17:30",
      location: "Hội trường Vũ Đình Liên",
      format: "Trực tiếp",
      spotsLeft: 12,
      totalSpots: 80,
      description: "Sân chơi học thuật tranh biện tiếng Anh đỉnh cao với chủ đề 'Digital Transformation & Global Citizenship'. Thí sinh tham gia và cổ động viên đều được ghi nhận chứng nhận học thuật.",
      benefits: [
        "Cấp Giấy chứng nhận A1 cấp Trường cho toàn bộ thí sinh và khán giả tham gia đủ 80% thời lượng",
        "Tổng giá trị giải thưởng lên tới 15.000.000 VNĐ cùng các suất học bổng IELTS",
        "Cộng điểm rèn luyện tối đa trong kỳ học"
      ],
      requirements: "Sinh viên toàn trường, trang phục lịch sự, thẻ sinh viên để check-in.",
      registrationDeadline: "2026-11-26 18:00",
      status: "closing_soon",
      formUrl: "https://forms.gle/english-challenge-2026"
    },
    {
      id: "ev-04",
      image: "./assets/events/ev-04.webp",
      title: "Chiến dịch Tình nguyện 'Đông Ấm Vùng Cao 2026' – Tuyển Tình Nguyện Viên",
      type: "recruitment",
      typeName: "Tuyển quân Tình nguyện",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      certType: "A3",
      certName: "Chứng nhận A3 (Tình nguyện & Xã hội)",
      organizer: "CLB Tình nguyện Hoa Đá ULIS",
      date: "2026-12-02",
      time: "20:00 (Đóng cổng đơn)",
      location: "Huyện Hoàng Su Phì, Tỉnh Hà Giang (Xuất phát từ Cổng 1 ULIS)",
      format: "Tình nguyện thực địa",
      spotsLeft: 25,
      totalSpots: 50,
      description: "Chiến dịch đông thường niên mang áo ấm, sách truyện và xây dựng tủ sách yêu thương cho các em học sinh tiểu học dân tộc thiểu số tại vùng cao.",
      benefits: [
        "Cấp Chứng nhận Tình nguyện A3 cấp Trường (Điều kiện then chốt xét Sinh viên 5 Tốt)",
        "Trải nghiệm văn hóa bản địa, kỹ năng làm việc nhóm và sinh tồn thực tế",
        "Tích lũy trọn vẹn điểm rèn luyện mục Hoạt động xã hội & cộng đồng"
      ],
      requirements: "Sinh viên có sức khỏe tốt, cam kết tham gia trọn vẹn lịch trình từ 18-21/12/2026.",
      registrationDeadline: "2026-12-02 20:00",
      status: "open",
      formUrl: "https://forms.gle/hoada-dongam-apply"
    },
    {
      id: "ev-05",
      image: "./assets/events/ev-05.webp",
      title: "Ngày Hội Việc Làm & Thực Tập Quốc Tế ULIS Job Fair 2026",
      type: "event",
      typeName: "Ngày hội Kỹ năng & Hướng nghiệp",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      certType: "A2",
      certName: "Chứng nhận A2 (Kỹ năng Ngoại khóa)",
      organizer: "Phòng Chính trị & Công tác HSSV phối hợp cùng 40+ Doanh nghiệp FDI",
      date: "2026-12-05",
      time: "07:30 - 16:30",
      location: "Khuôn viên Sân nhà A1 & Giảng đường B2",
      format: "Trực tiếp",
      spotsLeft: 320,
      totalSpots: 1000,
      description: "Sự kiện định hướng nghề nghiệp lớn nhất trong năm của ULIS với sự góp mặt của hơn 40 tập đoàn đa quốc gia từ Nhật Bản, Hàn Quốc, Mỹ, Singapore và Việt Nam.",
      benefits: [
        "Cấp Giấy chứng nhận A2 (Kỹ năng & Định hướng nghề nghiệp)",
        "Phỏng vấn tuyển dụng trực tiếp, nhận offer thực tập ngay trong ngày",
        "Workshop sửa CV và Mock Interview 1-1 miễn phí cùng các chuyên gia HR"
      ],
      requirements: "Sinh viên mang theo CV bản in và chuẩn bị trang phục công sở/lịch thiệp.",
      registrationDeadline: "2026-12-04 12:00",
      status: "open",
      formUrl: "https://forms.gle/ulis-jobfair-2026"
    },
    {
      id: "ev-06",
      image: "./assets/events/ev-06.webp",
      title: "Workshop: Tinh Gọn Kỹ Năng Thiết Kế & Xây Dựng Thương Hiệu Cá Nhân Trên LinkedIn",
      type: "event",
      typeName: "Workshop Kỹ năng",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      certType: "A2",
      certName: "Chứng nhận A2 (Kỹ năng Ngoại khóa)",
      organizer: "CLB Truyền thông UMC ULIS",
      date: "2026-12-10",
      time: "19:00 - 21:30",
      location: "Trực tuyến qua Zoom & Livestream tại Fanpage ULIS",
      format: "Online",
      spotsLeft: 85,
      totalSpots: 300,
      description: "Chia sẻ cách tối ưu profile LinkedIn thu hút nhà tuyển dụng nước ngoài, cách xây dựng Portfolio cá nhân và tư duy thẩm mỹ cơ bản với Canva/Figma.",
      benefits: [
        "Cấp Giấy chứng nhận tham gia A2 điện tử (E-certificate có mã xác thực)",
        "Bộ Template CV chuyên nghiệp và E-book hướng dẫn LinkedIn",
        "Giải đáp trực tiếp câu hỏi cùng diễn giả Senior Brand Strategist"
      ],
      requirements: "Đăng ký trước và tham gia làm khảo sát đánh giá cuối buổi để nhận chứng nhận.",
      registrationDeadline: "2026-12-09 22:00",
      status: "open",
      formUrl: "https://forms.gle/umc-linkedin-workshop"
    },
    {
      id: "ev-07",
      image: "./assets/events/ev-07.webp",
      title: "Đêm Nhạc Acoustic Mùa Đông: 'Vũ Khúc Thanh Xuân' & Casting Ban Vocal/Band",
      type: "event",
      typeName: "Giao lưu Nghệ thuật & Casting",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      certType: "A3",
      certName: "Chứng nhận A3 (Tình nguyện & Xã hội)",
      organizer: "CLB Âm nhạc Hiện đại MMC ULIS",
      date: "2026-12-15",
      time: "18:30 - 21:30",
      location: "Không gian Sân tượng đài Bác Hồ (Nhà A1)",
      format: "Trực tiếp ngoài trời",
      spotsLeft: 150,
      totalSpots: 400,
      description: "Đêm nhạc nghệ thuật giao lưu cuối năm, nơi các ban nhạc sinh viên thăng hoa với các giai điệu mùa đông ấm áp và mở đơn tuyển cộng tác viên nghệ thuật.",
      benefits: [
        "Chứng nhận hoạt động phong trào văn hóa nghệ thuật A3",
        "Thưởng thức âm nhạc đa ngôn ngữ và đồ uống miễn phí",
        "Cơ hội đăng ký thử giọng trực tiếp tại bàn casting của Ban Giám khảo MMC"
      ],
      requirements: "Vé vào cửa miễn phí. Đăng ký trước để nhận vị trí ngồi ưu tiên và quà tặng.",
      registrationDeadline: "2026-12-14 20:00",
      status: "open",
      formUrl: "https://forms.gle/mmc-acoustic-night"
    },
    {
      id: "ev-08",
      image: "./assets/events/ev-08.webp",
      title: "Ngày Hội Hiến Máu Toàn Trường: 'Nắng Ngoại Ngữ 2026'",
      type: "event",
      typeName: "Hoạt động Nhân đạo",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      certType: "A3",
      certName: "Chứng nhận A3 (Tình nguyện & Xã hội)",
      organizer: "Đoàn TN - Hội SV ULIS & Viện Huyết học - Truyền máu TW",
      date: "2026-12-22",
      time: "07:30 - 17:00",
      location: "Sảnh tầng 1 Nhà A9 & Nhà văn hóa Sinh viên",
      format: "Trực tiếp",
      spotsLeft: 210,
      totalSpots: 600,
      description: "Chương trình hiến máu nhân đạo lớn nhất học kỳ I tại trường Đại học Ngoại ngữ. Hãy cùng trao gửi những giọt hồng hy vọng để cứu sống người bệnh.",
      benefits: [
        "Được cấp Giấy chứng nhận hiến máu tình nguyện A3 và Giấy chứng nhận của Viện Huyết học",
        "Được bồi dưỡng quà tặng, suất ăn nhẹ và kiểm tra nhóm máu, xét nghiệm miễn phí",
        "Cộng 5 điểm rèn luyện trực tiếp vào Tiêu chí 3"
      ],
      requirements: "Sinh viên đủ 18 tuổi trở lên, cân nặng >= 45kg, không thức khuya đêm trước ngày hiến máu.",
      registrationDeadline: "2026-12-21 17:00",
      status: "open",
      formUrl: "https://forms.gle/nang-ngoai-ngu-2026"
    },
    {
      id: "ev-09",
      image: "./assets/events/ev-09.webp",
      title: "Tọa đàm: Chiến Lược Chinh Phục Chứng Chỉ Quốc Tế HSK 6 & JLPT N1 Năm 2027",
      type: "event",
      typeName: "Tọa đàm Chuyên môn",
      category: "academic",
      categoryName: "Học thuật",
      certType: "A1",
      certName: "Chứng nhận A1 (Học thuật & NCKH)",
      organizer: "CLB Tiếng Trung HYC & CLB Tiếng Nhật Hikari",
      date: "2027-01-08",
      time: "09:00 - 11:30",
      location: "Phòng Hội thảo Quốc tế B3",
      format: "Kết hợp Trực tiếp & Livestream",
      spotsLeft: 60,
      totalSpots: 180,
      description: "Bí quyết đạt điểm số tối đa trong các kỳ thi năng lực tiếng Trung và tiếng Nhật, cách phân bổ thời gian ôn thi song song cùng chương trình học trên lớp tại ULIS.",
      benefits: [
        "Cấp Giấy xác nhận tham gia hoạt động học thuật chuyên sâu A1",
        "Nhận trọn bộ đề thi thử độc quyền có lời giải chi tiết",
        "Tư vấn trực tiếp lộ trình du học thạc sĩ tại Bắc Kinh, Tokyo"
      ],
      requirements: "Sinh viên chuẩn bị câu hỏi trước cho diễn giả.",
      registrationDeadline: "2027-01-07 18:00",
      status: "open",
      formUrl: "https://forms.gle/hsk-jlpt-seminar-2027"
    },
    {
      id: "ev-10",
      image: "./assets/events/ev-10.webp",
      title: "Tuyển Thành Viên Kỳ Mùa Xuân 2027 – CLB Bạn Đồng Hành Quốc Tế UBC",
      type: "recruitment",
      typeName: "Tuyển quân CLB",
      category: "volunteering",
      categoryName: "Kỹ năng & Tình nguyện",
      certType: "A2",
      certName: "Chứng nhận A2 (Kỹ năng Ngoại khóa)",
      organizer: "CLB ULIS Buddy Club (UBC)",
      date: "2027-01-12",
      time: "23:59",
      location: "Online Form & Phỏng vấn Phòng 102 Nhà A2",
      format: "Online + Phỏng vấn",
      spotsLeft: 35,
      totalSpots: 80,
      description: "Trở thành người bạn đồng hành cho hơn 200 lưu học sinh quốc tế nhập học kỳ mùa Xuân 2027 tại ULIS. Nâng tầm phản xạ giao tiếp ngoại ngữ và hiểu biết văn hóa.",
      benefits: [
        "Cấp Giấy chứng nhận hoạt động đối ngoại & kỹ năng A2",
        "Luyện nói tiếng Anh/Hàn/Trung/Nhật hàng ngày với người bản xứ",
        "Được ưu tiên xét duyệt tham gia các chương trình trao đổi sinh viên quốc tế ngắn hạn"
      ],
      requirements: "Sinh viên năm 1-3, nhiệt tình, giao tiếp tốt ít nhất 1 ngoại ngữ.",
      registrationDeadline: "2027-01-12 23:59",
      status: "open",
      formUrl: "https://forms.gle/ubc-spring2027-apply"
    },
    {
      id: "ev-11",
      image: "./assets/events/ev-11.webp",
      title: "Giải Bóng Đá Nam - Nữ Sinh Viên Thường Niên 'ULIS Cup 2027'",
      type: "event",
      typeName: "Giải Thể thao Toàn trường",
      category: "talents",
      categoryName: "Sở thích & Năng khiếu",
      certType: "A3",
      certName: "Chứng nhận A3 (Tình nguyện & Xã hội)",
      organizer: "Đoàn Trường & CLB Bóng đá UFC",
      date: "2027-01-16",
      time: "Khai mạc: 08:00",
      location: "Sân Vận Động Ngoại Ngữ",
      format: "Trực tiếp",
      spotsLeft: 16,
      totalSpots: 32,
      description: "Giải đấu bóng đá thường niên quy tụ các đội bóng đại diện từ tất cả các chi đoàn, câu lạc bộ và khoa phòng trong trường Đại học Ngoại ngữ.",
      benefits: [
        "Chứng nhận tham gia hoạt động rèn luyện thể chất A3",
        "Cúp vô địch, huy chương vàng - bạc - đồng và tiền thưởng cho đội thắng cuộc",
        "Điểm rèn luyện rèn luyện thể chất cho vận động viên và cổ động viên"
      ],
      requirements: "Đội hình đăng ký theo Chi đoàn hoặc Liên quân Khoa, có danh sách xác nhận của Bí thư Chi đoàn.",
      registrationDeadline: "2027-01-10 17:00",
      status: "open",
      formUrl: "https://forms.gle/ulis-cup-2027"
    },
    {
      id: "ev-12",
      image: "./assets/events/ev-12.webp",
      title: "Lễ Ra Mắt Chính Thức Nền Tảng ULIS Vibe & Trải Nghiệm Check-in QR",
      type: "event",
      typeName: "Sự kiện Công nghệ Sinh viên",
      category: "academic",
      categoryName: "Học thuật",
      certType: "A2",
      certName: "Chứng nhận A2 (Kỹ năng Ngoại khóa)",
      organizer: "Bộ môn CNTT&TT, TT CNTT-TT&HL & Nhóm 109",
      date: "2027-01-20",
      time: "14:30 - 17:00",
      location: "Hội trường Sunwah & Trực tuyến",
      format: "Trực tiếp",
      spotsLeft: 120,
      totalSpots: 250,
      description: "Công bố nền tảng ULIS Vibe chính thức đưa vào sử dụng toàn trường, hướng dẫn sử dụng tính năng tra cứu sự kiện, lưu danh bạ CLB và tích lũy chứng nhận A1-A2-A3.",
      benefits: [
        "Chứng nhận A2 tham gia hoạt động chuyển đổi số và phát triển kỹ năng công nghệ",
        "Nhận 20 phần quà đặc biệt từ Nhóm 109 cho các sinh viên có góp ý xuất sắc",
        "Check-in QR thử nghiệm nhận mã bốc thăm may mắn trúng quà công nghệ"
      ],
      requirements: "Sinh viên toàn trường mang theo điện thoại để trải nghiệm ứng dụng.",
      registrationDeadline: "2027-01-19 20:00",
      status: "open",
      formUrl: "https://forms.gle/ulis-vibe-launch-2027"
    }
  ],

  // Bảng chuẩn hóa Chứng Nhận Ngoại Khóa A1, A2, A3 (Cert Hub)
  certGuidelines: [
    {
      type: "A1",
      code: "CERT_A1",
      name: "Chứng nhận A1: Học thuật & Nghiên cứu Khoa học",
      badgeColor: "blue",
      category: "Chuyên môn & Nghiên cứu",
      pointRange: "Từ 5 đến 15 điểm rèn luyện (Tùy cấp độ)",
      applicableCriteria: "Tiêu chí 1 (Ý thức học tập) & Tiêu chí 2 (Kỷ luật & NCKH)",
      importance: "Rất cao – Bắt buộc đối với xét học bổng Khuyến khích học tập và sinh viên giỏi/xuất sắc",
      summary: "Dành cho sinh viên tham gia các hoạt động liên quan trực tiếp đến trau dồi chuyên môn ngoại ngữ, phương pháp giảng dạy, biên phiên dịch, hội thảo khoa học và các cuộc thi học thuật.",
      criteria: [
        "Tham gia tối thiểu 80% thời lượng các buổi hội thảo, tọa đàm chuyên môn do Nhà trường, Khoa hoặc CLB học thuật tổ chức.",
        "Viết và nộp báo cáo nghiên cứu khoa học sinh viên được nghiệm thu từ cấp Khoa trở lên.",
        "Tham gia các cuộc thi học thuật ngôn ngữ, hùng biện, tranh biện, dịch thuật và có giấy xác nhận từ Ban Tổ chức.",
        "Hoàn thành các khóa tập huấn phương pháp NCKH và công bố bài viết trên kỷ yếu hội nghị sinh viên."
      ],
      examples: [
        "Hội nghị NCKH Sinh viên cấp Trường và cấp ĐHQGHN",
        "Cuộc thi Hùng biện tiếng Anh English Challenge",
        "Tọa đàm chuyên đề dịch thuật Cabin của CLB YTC",
        "Seminar phương pháp học ngoại ngữ 2 của các Khoa"
      ],
      evidenceForm: "Giấy chứng nhận (bản cứng hoặc bản điện tử có mã QR/chữ ký số), giấy xác nhận của Ban Chủ nhiệm Khoa hoặc Phòng KHCN.",
      notes: "Nếu tham gia với tư cách Ban Tổ chức (BTC) phần học thuật hoặc Báo cáo viên, sinh viên được tính mức điểm cao nhất trong khung."
    },
    {
      type: "A2",
      code: "CERT_A2",
      name: "Chứng nhận A2: Kỹ năng Mềm, Hội nhập & Hướng nghiệp",
      badgeColor: "amber",
      category: "Kỹ năng & Phát triển bản thân",
      pointRange: "Từ 5 đến 10 điểm rèn luyện",
      applicableCriteria: "Tiêu chí 3 (Hoạt động chính trị - xã hội, văn hóa, thể thao, kỹ năng)",
      importance: "Cao – Quan trọng để hoàn thiện hồ sơ ứng tuyển việc làm và nâng cao điểm rèn luyện",
      summary: "Dành cho sinh viên tham gia các chương trình đào tạo kỹ năng mềm, ngày hội việc làm, workshop định hướng nghề nghiệp, kỹ năng công nghệ số và các hoạt động hội nhập quốc tế.",
      criteria: [
        "Tham gia đầy đủ các buổi tập huấn kỹ năng viết CV, phỏng vấn, giao tiếp công sở do Trường hoặc Phòng CT&CT HSSV tổ chức.",
        "Tham gia tương tác và ứng tuyển tại Ngày hội Việc làm ULIS Job Fair.",
        "Tham gia các chương trình trao đổi văn hóa, làm Buddy hỗ trợ sinh viên quốc tế (CLB UBC).",
        "Tham gia các buổi hội thảo chuyển đổi số, an toàn thông tin hoặc ứng dụng AI trong học tập ngôn ngữ."
      ],
      examples: [
        "Ngày hội Việc làm ULIS Job Fair thường niên",
        "Workshop kỹ năng xây dựng thương hiệu cá nhân trên LinkedIn",
        "Chương trình đồng hành cùng lưu học sinh quốc tế ULIS Buddy",
        "Khóa tập huấn Lễ tân Ngoại giao của Đội Lễ tân URT"
      ],
      evidenceForm: "Chứng nhận tham gia điện tử có danh sách xác nhận của Phòng CT&CT HSSV hoặc Ban Tổ chức sự kiện.",
      notes: "Một sự kiện A2 có thể được bảo lưu điểm rèn luyện trong đúng học kỳ diễn ra sự kiện đó."
    },
    {
      type: "A3",
      code: "CERT_A3",
      name: "Chứng nhận A3: Tình nguyện, Cộng đồng & Phong trào Xã hội",
      badgeColor: "emerald",
      category: "Cộng đồng & Xã hội",
      pointRange: "Từ 8 đến 20 điểm rèn luyện",
      applicableCriteria: "Tiêu chí 3 (Hoạt động xã hội) & Tiêu chí xét danh hiệu 'Sinh viên 5 Tốt'",
      importance: "Bắt buộc – Điều kiện tiên quyết để đạt chuẩn 'Tình nguyện tốt' trong phong trào SV5T",
      summary: "Dành cho các hoạt động phụng sự cộng đồng, hiến máu nhân đạo, tình nguyện mùa hè xanh, tiếp sức mùa thi, bảo vệ môi trường và các hoạt động văn hóa, văn nghệ, thể dục thể thao toàn trường.",
      criteria: [
        "Tham gia chiến dịch Mùa Hè Xanh, Đông Ấm Vùng Cao hoặc Tiếp Sức Mùa Thi có xác nhận hoàn thành tốt nhiệm vụ.",
        "Tham gia hiến máu nhân đạo tại Ngày hội hiến máu cấp Trường hoặc cấp Thành phố (tối thiểu 1 lần/năm học).",
        "Là thành viên chính thức hoạt động tích cực trong các Đội tình nguyện, Đội Xung kích, Đội Máu ULIS.",
        "Đại diện trường hoặc khoa tham gia các giải thể thao, hội diễn văn nghệ sinh viên cấp ĐHQGHN trở lên."
      ],
      examples: [
        "Ngày hội hiến máu 'Nắng Ngoại Ngữ' & 'Giọt Hồng Tri Ân'",
        "Chiến dịch Tiếp sức mùa thi tại các điểm thi ULIS",
        "Chiến dịch Mùa Hè Xanh tại các tỉnh vùng cao",
        "Tham gia biểu diễn nghệ thuật tại Gala Chào tân sinh viên hoặc thi đấu VUG"
      ],
      evidenceForm: "Giấy chứng nhận tình nguyện của Đoàn TN - Hội SV Trường, Giấy chứng nhận hiến máu của Viện Huyết học, Bằng khen/Giấy khen các cấp.",
      notes: "Để xét Sinh viên 5 Tốt cấp Trường và cấp ĐHQGHN, sinh viên bắt buộc phải có ít nhất 01 chứng nhận tình nguyện A3 hợp lệ trong năm học."
    }
  ],

  // Kế hoạch triển khai (15 bước trong Word)
  roadmap: [
    { step: 1, title: "Lập đề xuất dự án", time: "13/10/2026", participants: "Nhóm 109", status: "completed" },
    { step: 2, title: "Làm tờ trình, phiếu trình xin chủ trương phê duyệt", time: "11/2026", participants: "Nhóm 109, Phòng KHTC", status: "completed" },
    { step: 3, title: "Xây dựng đề cương chi tiết", time: "11/2026", participants: "Nhóm 109", status: "completed" },
    { step: 4, title: "Thực hiện khảo sát chi tiết đối với 105 sinh viên ULIS", time: "11/2026", participants: "Nhóm 109, sinh viên ULIS", status: "completed" },
    { step: 5, title: "Tổng hợp và phân tích kết quả khảo sát", time: "11/2026", participants: "Nhóm 109", status: "completed" },
    { step: 6, title: "Hoàn thiện, rà soát và nộp bài Đề xuất ý tưởng", time: "16-19/11/2026", participants: "Nhóm 109", status: "in_progress" },
    { step: 7, title: "Xây dựng nội dung chi tiết và bố cục landing page", time: "20-27/11/2026", participants: "Nhóm 109", status: "upcoming" },
    { step: 8, title: "Thẩm định nội dung và bố cục cùng giảng viên phụ trách", time: "28-30/11/2026", participants: "Nhóm 109 & Giảng viên phụ trách", status: "upcoming" },
    { step: 9, title: "Thiết kế giao diện và hoàn thiện hệ thống landing page", time: "01-07/12/2026", participants: "Nhóm 109", status: "upcoming" },
    { step: 10, title: "Tiến hành thử nghiệm diện hẹp, thu thập phản hồi sinh viên", time: "08-10/12/2026", participants: "Nhóm 109 & Sinh viên thử nghiệm", status: "upcoming" },
    { step: 11, title: "Chỉnh sửa, hoàn thiện hệ thống theo góp ý thực tế", time: "11-13/12/2026", participants: "Nhóm 109", status: "upcoming" },
    { step: 12, title: "Báo cáo toàn bộ kết quả thử nghiệm và đánh giá số liệu", time: "15/12/2026", participants: "Nhóm 109", status: "upcoming" },
    { step: 13, title: "Chính thức nộp sản phẩm Landing Page cuối kỳ", time: "16/12/2026", participants: "Nhóm 109", status: "upcoming" },
    { step: 14, title: "Lập kế hoạch đưa nền tảng ULIS Vibe vào sử dụng rộng rãi", time: "01/2027", participants: "Nhóm 109, TT CNTT-TT&HL, Phòng Đào tạo", status: "upcoming" },
    { step: 15, title: "Theo dõi, bảo trì và phát triển tính năng mới", time: "Từ 02/2027 trở đi", participants: "Nhóm 109, TT CNTT-TT&HL", status: "upcoming" }
  ],

  // Kế hoạch truyền thông (7 bài đăng trên Fanpage theo Word)
  mediaPlan: [
    {
      stt: 1,
      publishTime: "20/11/2026 - 20:00",
      postTitle: "Giới thiệu dự án ULIS Vibe",
      content: "Bài viết giới thiệu tổng quan về dự án, mục tiêu, ý nghĩa và những vấn đề mà ULIS Vibe hướng đến giải quyết cho sinh viên trường Ngoại ngữ.",
      responsible: "Nhóm 109"
    },
    {
      stt: 2,
      publishTime: "25/11/2026 - 20:00",
      postTitle: "ULIS Vibe có gì? Khám phá những tiện ích nổi bật của nền tảng",
      content: "Bài viết kết hợp infographic giới thiệu các tính năng chính: Event Hub, QR Check-in, Club Directory, Recruitment Board và Smart Notification...",
      responsible: "Nhóm 109"
    },
    {
      stt: 3,
      publishTime: "30/11/2026 - 20:00",
      postTitle: "Khám phá thế giới câu lạc bộ ULIS cùng Club Directory",
      content: "Bài viết giới thiệu hệ thống câu lạc bộ được phân loại theo ba nhóm; giới thiệu tính năng tìm kiếm và đăng ký tham gia CLB phù hợp bản thân.",
      responsible: "Nhóm 109"
    },
    {
      stt: 4,
      publishTime: "05/12/2026 - 20:00",
      postTitle: "Không bỏ lỡ sự kiện cùng Event Hub và QR Check-in",
      content: "Bài viết kết hợp hình ảnh minh họa giới thiệu tính năng cập nhật lịch sự kiện, đăng ký trực tuyến và check-in bằng mã QR tiện lợi.",
      responsible: "Nhóm 109"
    },
    {
      stt: 5,
      publishTime: "10/12/2026 - 20:00",
      postTitle: "Tích lũy chứng nhận ngoại khóa dễ dàng cùng Cert Hub",
      content: "Infographic giới thiệu tính năng tra cứu, lọc sự kiện theo từng loại chứng nhận A1, A2, A3, hỗ trợ sinh viên chủ động lựa chọn hoạt động phù hợp.",
      responsible: "Nhóm 109"
    },
    {
      stt: 6,
      publishTime: "20/12/2026 - 20:00",
      postTitle: "Trải nghiệm ULIS Vibe - Cùng sinh viên ULIS khám phá nền tảng mới",
      content: "Thông báo và hướng dẫn sinh viên tham gia trải nghiệm thử nền tảng; thu thập ý kiến đóng góp và phản hồi để hoàn thiện sản phẩm.",
      responsible: "Nhóm 109"
    },
    {
      stt: 7,
      publishTime: "01/01/2027 - 20:00",
      postTitle: "ULIS Vibe chính thức ra mắt",
      content: "Bài viết công bố sản phẩm, giới thiệu các tính năng hoàn thiện, kèm hình ảnh giao diện, đường link truy cập và Video hướng dẫn sử dụng cơ bản.",
      responsible: "Nhóm 109"
    }
  ],

  // Câu hỏi thường gặp (FAQ)
  faqs: [
    {
      q: "Làm sao để biết một sự kiện hoặc hoạt động sẽ được cấp loại chứng nhận nào (A1, A2 hay A3)?",
      a: "Trên giao diện Event Hub của ULIS Vibe, mỗi thẻ sự kiện đều được gắn nhãn màu rõ ràng (A1: Màu Xanh Dương - Học thuật, A2: Màu Vàng Cam - Kỹ năng & Ngoại khóa, A3: Màu Xanh Lá - Tình nguyện). Bạn có thể bấm vào thẻ để xem chi tiết căn cứ quy chế và hướng dẫn nhận chứng nhận sau sự kiện."
    },
    {
      q: "ULIS Vibe có yêu cầu đăng nhập tài khoản hay thu thập thông tin cá nhân của sinh viên không?",
      a: "Hoàn toàn không. Đúng theo đề xuất dự án ban đầu của Nhóm 109, phiên bản Landing Page được thiết kế tinh gọn, mở hoàn toàn cho mọi sinh viên tra cứu tự do mà không cần đăng nhập. Biểu mẫu góp ý cũng là ẩn danh 100% để đảm bảo tính khách quan và bảo mật."
    },
    {
      q: "Tôi có thể đăng ký tham gia nhiều câu lạc bộ trong cùng một đợt tuyển quân không?",
      a: "Có thể! Sinh viên hoàn toàn có quyền nộp đơn ứng tuyển nhiều CLB khác nhau. Tuy nhiên, tính năng Club Directory trên ULIS Vibe cung cấp thông tin chi tiết về đối tượng phù hợp và khối lượng sinh hoạt để bạn cân nhắc quỹ thời gian, tránh tình trạng trùng lịch phỏng vấn hoặc quá tải công việc."
    },
    {
      q: "Chứng nhận ngoại khóa A1, A2, A3 có giá trị như thế nào đối với điểm rèn luyện và chuẩn đầu ra?",
      a: "Tại ULIS, chứng nhận ngoại khóa là căn cứ xác thực bắt buộc để chấm điểm rèn luyện hàng kỳ. Trong đó: A1 bổ sung vào Tiêu chí Học tập & NCKH; A2 bổ sung vào Tiêu chí Kỹ năng & Hội nhập; A3 là điều kiện bắt buộc để đạt điểm Tình nguyện vì cộng đồng và xét danh hiệu 'Sinh viên 5 Tốt' các cấp."
    },
    {
      q: "Các Ban Chủ nhiệm CLB có thể cập nhật thông tin tuyển quân hoặc sự kiện mới lên nền tảng bằng cách nào?",
      a: "Ban Chủ nhiệm các CLB có thể gửi thông tin trực tiếp qua Biểu mẫu đóng góp ý kiến hoặc liên hệ Nhóm 109 qua email nhóm trưởng (phuongthaodoan07@gmail.com). Dữ liệu sự kiện sẽ được ban quản trị kiểm duyệt và cập nhật lên Event Hub trong vòng 24 giờ."
    },
    {
      q: "Nếu tôi phát hiện thông tin sự kiện bị hoãn hoặc thay đổi địa điểm thì báo ở đâu?",
      a: "Bạn có thể sử dụng ngay nút 'Góp ý nhanh' ở góc dưới màn hình hoặc phần Biểu mẫu ẩn danh ở cuối trang. Hệ thống sẽ ghi nhận tức thời để ban quản trị điều chỉnh thông tin chính xác nhất cho toàn thể sinh viên."
    }
  ]
};

// Xuất ra phạm vi toàn cục
window.ULIS_DATA = ULIS_DATA;
