import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

export const UlisVibeVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #FBFBFD 50%, #F4F6F9 100%)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        color: "#0F172A",
        overflow: "hidden",
      }}
    >
      {/* SCENE 1: ACADEMIC EDITORIAL INTRO (0 - 420 frames = 7s) */}
      <Sequence from={0} durationInFrames={420}>
        <SceneIntro />
      </Sequence>

      {/* SCENE 2: ASYMMETRIC DATA STORY (420 - 900 frames = 8s) */}
      <Sequence from={420} durationInFrames={480}>
        <SceneDataStory />
      </Sequence>

      {/* SCENE 3: EVENT HUB (900 - 1500 frames = 10s) */}
      <Sequence from={900} durationInFrames={600}>
        <SceneEventHub />
      </Sequence>

      {/* SCENE 4: CLUB DIRECTORY BENTO (1500 - 1980 frames = 8s) */}
      <Sequence from={1500} durationInFrames={480}>
        <SceneClubBento />
      </Sequence>

      {/* SCENE 5: CERT HUB TIERED (1980 - 2400 frames = 7s) */}
      <Sequence from={1980} durationInFrames={420}>
        <SceneCertTiered />
      </Sequence>

      {/* SCENE 6: MINIMALIST OUTRO (2400 - 2700 frames = 5s) */}
      <Sequence from={2400} durationInFrames={300}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

// Scene 1: Academic Editorial Intro
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 395, 420], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 220px",
      }}
    >
      <div style={{ maxWidth: "880px" }}>
        <p style={{ color: "#002B7F", fontSize: "16px", fontWeight: 700, letterSpacing: "3px", margin: "0 0 24px 0" }}>
          TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN • BỘ MÔN CNTT & TRUYỀN THÔNG
        </p>
        <h1
          style={{
            fontSize: "114px",
            fontWeight: 900,
            letterSpacing: "-2px",
            margin: "0 0 20px 0",
            background: "linear-gradient(135deg, #0A2540 0%, #002B7F 60%, #0284C7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ULIS VIBE
        </h1>
        <p style={{ fontSize: "28px", color: "#334155", fontWeight: 500, margin: "0 0 16px 0", lineHeight: 1.4 }}>
          Cổng thông tin tập trung kết nối sự kiện, CLB & tra cứu chuẩn hóa Cert.
        </p>
        <p style={{ fontSize: "19px", color: "#64748B", fontWeight: 500, margin: 0 }}>
          Đề án Bài tập nhóm Giữa kỳ • Học phần FLF1007 • Nhóm 109
        </p>
      </div>
      <img
        src="../assets/ulis-logo.png"
        alt="ULIS Logo"
        style={{
          width: "220px",
          height: "220px",
          objectFit: "contain",
          filter: "drop-shadow(0 20px 40px rgba(10, 37, 64, 0.14))",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 2: Asymmetric Data Story
const SceneDataStory: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 450, 480], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 220px",
      }}
    >
      <p style={{ color: "#0284C7", fontSize: "15px", fontWeight: 700, letterSpacing: "2px", margin: "0 0 12px 0" }}>
        CƠ SỞ THỰC TIỄN • KHẢO SÁT 105 SINH VIÊN ULIS
      </p>
      <h2 style={{ fontSize: "48px", fontWeight: 900, color: "#0A2540", margin: "0 0 60px 0", letterSpacing: "-0.5px" }}>
        Thực trạng tiếp cận thông tin ngoại khóa
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
        {/* Left Hero */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "128px",
              fontWeight: 900,
              letterSpacing: "-3px",
              background: "linear-gradient(135deg, #002B7F 0%, #0284C7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              marginBottom: "16px",
            }}
          >
            71.5%
          </div>
          <h3 style={{ fontSize: "26px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px 0" }}>
            Sinh viên từng bỏ lỡ sự kiện
          </h3>
          <p style={{ fontSize: "19px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
            Do các bài đăng bị trôi nhanh trên nhiều hội nhóm mạng xã hội, thiếu một cổng thông tin tập trung và nhắc lịch chính thức.
          </p>
        </div>
        {/* Vertical Divider */}
        <div style={{ width: "1px", height: "320px", background: "rgba(226, 232, 240, 0.8)" }}></div>
        {/* Right Sliders */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <div style={{ fontSize: "64px", fontWeight: 900, color: "#0A2540", lineHeight: 1, marginBottom: "8px" }}>82.9%</div>
            <h4 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>Khó khăn tra cứu tiêu chuẩn Cert A1, A2, A3</h4>
            <p style={{ fontSize: "17px", color: "#64748B", margin: "0 0 16px 0" }}>Mơ hồ giữa các quy định minh chứng điểm rèn luyện.</p>
            <div style={{ width: "100%", height: "6px", background: "rgba(226, 232, 240, 0.7)", borderRadius: "3px" }}>
              <div style={{ width: "82.9%", height: "100%", background: "linear-gradient(90deg, #002B7F, #F59E0B)", borderRadius: "3px" }}></div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "64px", fontWeight: 900, color: "#0A2540", lineHeight: 1, marginBottom: "8px" }}>91.4%</div>
            <h4 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>Ủng hộ nền tảng kết nối tập trung</h4>
            <p style={{ fontSize: "17px", color: "#64748B", margin: "0 0 16px 0" }}>Nhu cầu cấp thiết về một cổng thông tin chính thống của ULIS.</p>
            <div style={{ width: "100%", height: "6px", background: "rgba(226, 232, 240, 0.7)", borderRadius: "3px" }}>
              <div style={{ width: "91.4%", height: "100%", background: "linear-gradient(90deg, #002B7F, #10B981)", borderRadius: "3px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Event Hub
const SceneEventHub: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 570, 600], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 220px",
      }}
    >
      <div style={{ maxWidth: "680px" }}>
        <p style={{ color: "#0284C7", fontSize: "15px", fontWeight: 700, letterSpacing: "2px", margin: "0 0 12px 0" }}>
          TÍNH NĂNG 01 • EVENT HUB
        </p>
        <h2 style={{ fontSize: "48px", fontWeight: 900, color: "#0A2540", margin: "0 0 40px 0" }}>
          Lịch sự kiện & Tuyển quân toàn trường
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <span style={{ color: "#002B7F", fontWeight: 700, fontSize: "18px" }}>01 &nbsp; Lọc chuẩn hóa theo Cert A1, A2, A3</span>
            <p style={{ color: "#64748B", fontSize: "17px", margin: "6px 0 0 28px" }}>Đồng bộ mục đích rèn luyện và chuẩn đầu ra ngoại khóa.</p>
          </div>
          <div>
            <span style={{ color: "#002B7F", fontWeight: 700, fontSize: "18px" }}>02 &nbsp; Suất tham gia thời gian thực (Realtime)</span>
            <p style={{ color: "#64748B", fontSize: "17px", margin: "6px 0 0 28px" }}>Tránh quá tải đăng ký, minh bạch tình trạng chỗ ngồi.</p>
          </div>
          <div>
            <span style={{ color: "#002B7F", fontWeight: 700, fontSize: "18px" }}>03 &nbsp; Mã QR Check-in điểm danh tự động</span>
            <p style={{ color: "#64748B", fontSize: "17px", margin: "6px 0 0 28px" }}>Xác thực danh sách sinh viên tức thời tại hội trường.</p>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "720px",
          background: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0 30px 60px rgba(10, 37, 64, 0.12)",
          border: "1px solid rgba(226, 232, 240, 0.85)",
          overflow: "hidden",
        }}
      >
        <img src="../assets/events/ev-01.png" alt="Event Banner" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
        <div style={{ padding: "30px 36px" }}>
          <h3 style={{ fontSize: "23px", fontWeight: 700, color: "#0A2540", margin: "0 0 8px 0" }}>
            Hội thảo: Viết Báo Cáo Nghiên Cứu Khoa Học 2026
          </h3>
          <p style={{ fontSize: "16px", color: "#0284C7", fontWeight: 600, margin: "0 0 16px 0" }}>
            A1 • Học thuật & NCKH • Hội trường Sunwah (20/11)
          </p>
          <div style={{ width: "100%", height: "5px", background: "rgba(226, 232, 240, 0.7)", borderRadius: "2.5px" }}>
            <div style={{ width: "55%", height: "100%", background: "#002B7F", borderRadius: "2.5px" }}></div>
          </div>
          <p style={{ fontSize: "14px", color: "#64748B", margin: "8px 0 0 0" }}>Còn 45/100 suất đăng ký</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Club Bento
const SceneClubBento: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 450, 480], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 220px",
      }}
    >
      <p style={{ color: "#0284C7", fontSize: "15px", fontWeight: 700, letterSpacing: "2px", margin: "0 0 12px 0" }}>
        TÍNH NĂNG 02 • CLUB DIRECTORY
      </p>
      <h2 style={{ fontSize: "48px", fontWeight: 900, color: "#0A2540", margin: "0 0 60px 0" }}>
        Hệ sinh thái 30+ Câu lạc bộ
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              letterSpacing: "-3px",
              background: "linear-gradient(135deg, #002B7F 0%, #0284C7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              marginBottom: "16px",
            }}
          >
            30+
          </div>
          <h3 style={{ fontSize: "26px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px 0" }}>
            CLB trực thuộc toàn trường
          </h3>
          <p style={{ fontSize: "19px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
            Tập hợp hồ sơ, kênh liên hệ và lịch tuyển quân của cả 3 khối chuyên môn tại ULIS.
          </p>
        </div>
        <div style={{ width: "1px", height: "300px", background: "rgba(226, 232, 240, 0.8)" }}></div>
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", gap: "24px" }}>
          <BentoRow title="Khối Học thuật & NCKH" desc="K-ULIS, SRC Nghiên cứu, E4C Tiếng Anh..." badge="Cert A1" color="#0284C7" />
          <BentoRow title="Khối Tài năng & Nghệ thuật" desc="MMC Âm nhạc, Dance Club, UFC Bóng đá..." badge="Ngoại khóa" color="#F59E0B" />
          <BentoRow title="Khối Kỹ năng & Tình nguyện" desc="Đội Lễ tân URT, Sắc Màu, Máu Ngoại Ngữ..." badge="Cert A2 • A3" color="#10B981" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Cert Hub Tiered
const SceneCertTiered: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 390, 420], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 220px",
      }}
    >
      <p style={{ color: "#0284C7", fontSize: "15px", fontWeight: 700, letterSpacing: "2px", margin: "0 0 12px 0" }}>
        TÍNH NĂNG 03 • CERT HUB
      </p>
      <h2 style={{ fontSize: "48px", fontWeight: 900, color: "#0A2540", margin: "0 0 12px 0" }}>
        Chuẩn hóa chứng nhận ngoại khóa A1 • A2 • A3
      </h2>
      <p style={{ fontSize: "20px", color: "#64748B", margin: "0 0 50px 0" }}>
        Cẩm nang minh bạch hóa quy định điểm rèn luyện cho sinh viên các khóa.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <CertTier code="A1" label="Học Thuật & NCKH" examples="Hội thảo nghiên cứu khoa học, tọa đàm học thuật ngoại ngữ" points="+5 đến +10 ĐRL" color="#002B7F" />
        <CertTier code="A2" label="Kỹ Năng & Đoàn Đội" examples="Ban tổ chức sự kiện, tuyển quân CLB, tập huấn kỹ năng mềm" points="+3 đến +8 ĐRL" color="#0284C7" />
        <CertTier code="A3" label="Tình Nguyện & Vì Cộng Đồng" examples="Hiến máu nhân đạo toàn trường, Mùa hè xanh, Tiếp sức mùa thi" points="+5 đến +15 ĐRL" color="#10B981" />
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Minimalist Outro
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 280, 300], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 220px",
      }}
    >
      <img
        src="../assets/ulis-logo.png"
        alt="ULIS Logo"
        style={{
          width: "140px",
          height: "140px",
          objectFit: "contain",
          marginBottom: "36px",
          filter: "drop-shadow(0 15px 35px rgba(10, 37, 64, 0.14))",
        }}
      />
      <h1
        style={{
          fontSize: "96px",
          fontWeight: 900,
          letterSpacing: "-2px",
          margin: "0 0 16px 0",
          background: "linear-gradient(135deg, #0A2540 0%, #002B7F 50%, #0284C7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ULIS VIBE
      </h1>
      <h3 style={{ fontSize: "30px", fontWeight: 700, color: "#002B7F", margin: "0 0 24px 0" }}>
        MỘT ĐIỂM CHẠM — VẠN CƠ HỘI NGOẠI KHÓA
      </h3>
      <p style={{ fontSize: "20px", color: "#475569", fontWeight: 500, margin: "0 0 8px 0" }}>
        Đề án Bài tập nhóm Giữa kỳ • Nhóm 109 - Lớp FLF1007
      </p>
      <p style={{ fontSize: "17px", color: "#64748B", margin: "0 0 36px 0" }}>
        Bộ môn Công nghệ Thông tin & Truyền thông — Trường ĐH Ngoại ngữ, ĐHQGHN
      </p>
      <div
        style={{
          display: "inline-block",
          padding: "16px 44px",
          borderRadius: "999px",
          background: "#002B7F",
          color: "#FFFFFF",
          fontSize: "19px",
          fontWeight: 700,
          boxShadow: "0 10px 25px rgba(0, 43, 127, 0.2)",
        }}
      >
        TRẢI NGHIỆM TẠI HTTP://LOCALHOST:5500
      </div>
    </AbsoluteFill>
  );
};

// Helper Components
const BentoRow: React.FC<{ title: string; desc: string; badge: string; color: string }> = ({ title, desc, badge, color }) => (
  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid rgba(226, 232, 240, 0.85)",
      borderRadius: "20px",
      padding: "24px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 10px 25px rgba(10, 37, 64, 0.04)",
      borderLeft: `6px solid ${color}`,
    }}
  >
    <div>
      <h4 style={{ fontSize: "22px", fontWeight: 700, color: "#0A2540", margin: "0 0 6px 0" }}>{title}</h4>
      <p style={{ fontSize: "16px", color: "#64748B", margin: 0 }}>{desc}</p>
    </div>
    <span style={{ padding: "8px 18px", borderRadius: "999px", background: "#F1F5F9", color: "#002B7F", fontWeight: 700, fontSize: "14px" }}>
      {badge}
    </span>
  </div>
);

const CertTier: React.FC<{ code: string; label: string; examples: string; points: string; color: string }> = ({ code, label, examples, points, color }) => (
  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid rgba(226, 232, 240, 0.85)",
      borderRadius: "20px",
      padding: "24px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 10px 25px rgba(10, 37, 64, 0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <div style={{ width: "64px", height: "46px", borderRadius: "12px", background: color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700 }}>
        {code}
      </div>
      <div>
        <h4 style={{ fontSize: "22px", fontWeight: 700, color: "#0A2540", margin: "0 0 4px 0" }}>{label}</h4>
        <p style={{ fontSize: "16px", color: "#64748B", margin: 0 }}>{examples}</p>
      </div>
    </div>
    <span style={{ padding: "8px 20px", borderRadius: "999px", background: "#F8FAFC", border: "1px solid rgba(226, 232, 240, 0.9)", color, fontWeight: 700, fontSize: "15px" }}>
      {points}
    </span>
  </div>
);
