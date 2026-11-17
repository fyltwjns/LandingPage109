import re

with open('build_static_page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Header / Nav
old_header_target = '''  <!-- ==================================================== -->
  <!-- TOP BANNER (Academic Header) -->
  <!-- ==================================================== -->
  <div class="bg-blue-950 text-blue-100 text-xs py-2.5 px-4 border-b border-blue-900">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="font-medium">TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – ĐHQGHN • BỘ MÔN CNTT & TRUYỀN THÔNG</span>
      </div>
      <div class="flex items-center gap-4 text-[11px] text-blue-200">
        <span>Bài tập nhóm giữa kỳ: Năm học 2026 - 2027</span>
        <span class="hidden md:inline">•</span>
        <span class="font-bold text-amber-300">Nhóm thực hiện: Nhóm 109 - Lớp FLF1007</span>
      </div>
    </div>
  </div>

  <!-- ==================================================== -->
  <!-- MAIN NAVIGATION BAR (Sticky Nav) -->
  <!-- ==================================================== -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-2">
        
        <!-- Logo & Brand -->
        <a href="#hero" class="flex items-center gap-3 group shrink-0">
          <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-11 h-11 object-contain group-hover:scale-105 transition-transform" />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xl sm:text-2xl font-black tracking-tight text-blue-950 group-hover:text-blue-900 transition">ULIS VIBE</span>
              <span class="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded">BETA</span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium tracking-tight hidden 2xl:block">Cổng Sự Kiện, CLB & Tra Cứu Cert A1-A2-A3</p>
          </div>
        </a>

        <!-- Desktop Navigation Links (Strictly Single-line, No Wrapping) -->
        <nav class="hidden lg:flex items-center gap-0.5 xl:gap-1.5 font-semibold text-xs xl:text-sm text-slate-700 whitespace-nowrap shrink-0">
          <a href="#hero" class="px-2 xl:px-3 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Trang chủ</a>
          <a href="#event-hub" class="px-2 xl:px-3 py-1.5 rounded-xl text-blue-950 hover:bg-blue-50 transition flex items-center gap-1 font-bold whitespace-nowrap">
            <i data-lucide="calendar" class="w-3.5 h-3.5 xl:w-4 xl:h-4 text-blue-800"></i> Event Hub
          </a>
          <a href="#club-directory" class="px-2 xl:px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition flex items-center gap-1 whitespace-nowrap">
            <i data-lucide="users" class="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-700"></i> Club Directory
          </a>
          <a href="#cert-hub" class="px-2 xl:px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition flex items-center gap-1 whitespace-nowrap">
            <i data-lucide="award" class="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-700"></i> Cert Hub
          </a>
          <a href="#faq-feedback" class="px-2 xl:px-3 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Hỏi đáp</a>
          <a href="#team-plan" class="px-2 xl:px-3 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Nhóm 109</a>
          <a href="#video-intro" class="px-2 xl:px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 transition flex items-center gap-1 font-bold whitespace-nowrap border border-blue-200/70" title="Xem video giới thiệu đề án">
            <i data-lucide="play-circle" class="w-3.5 h-3.5 xl:w-4 xl:h-4 text-blue-700"></i> Video Đề Án
          </a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="hidden sm:flex items-center gap-1.5 xl:gap-2 shrink-0">
          <!-- Saved Events Button -->
          <button id="btn-view-saved" class="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition shrink-0" title="Sự kiện đã lưu">
            <i data-lucide="bookmark" class="w-4 h-4 xl:w-5 xl:h-5"></i>
            <span id="saved-events-badge" class="hidden absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-amber-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">0</span>
          </button>

          <!-- Quick Feedback CTA (Icon on lg, Full label on xl+) -->
          <a href="#feedback-section" class="px-2.5 xl:px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0" title="Góp ý ẩn danh">
            <i data-lucide="message-square" class="w-3.5 h-3.5 text-amber-400"></i>
            <span class="hidden xl:inline">Góp ý ẩn danh</span>
          </a>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="lg:hidden flex items-center gap-2">
          <button id="mobile-menu-btn" class="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Toggle Menu">
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div id="mobile-menu" class="hidden lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2">
      <a href="#hero" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Trang chủ</a>
      <a href="#event-hub" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-950 bg-blue-50">Event Hub (Lịch sự kiện & Tuyển quân)</a>
      <a href="#club-directory" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Club Directory (3 Nhóm CLB)</a>
      <a href="#cert-hub" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Cert Hub (A1, A2, A3 Chuẩn Hóa)</a>
      <a href="#faq-feedback" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Hỏi đáp thường gặp & Biểu mẫu ẩn danh</a>
      <a href="#team-plan" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Kế hoạch & Nhóm thực hiện 109</a>
      <a href="#video-intro" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-900 bg-blue-50 border border-blue-200/60">🎬 Video Giới Thiệu Đề Án (1080p 60fps)</a>
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <a href="#feedback-section" class="mobile-nav-link w-full py-2.5 bg-blue-950 text-white rounded-xl text-center text-xs font-bold block">
          Góp ý ẩn danh cho đề án
        </a>
      </div>
    </div>
  </header>'''

new_header = '''  <!-- ==================================================== -->
  <!-- TOP BANNER (Academic Header - Chuẩn ĐHQGHN) -->
  <!-- ==================================================== -->
  <div class="bg-[#0B2341] text-blue-100 text-xs py-2 px-4 border-b border-blue-900">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold tracking-tight text-white">ĐẠI HỌC QUỐC GIA HÀ NỘI • TRƯỜNG ĐẠI HỌC NGOẠI NGỮ</span>
        <span class="hidden md:inline text-blue-300">• ĐOÀN TNCS HỒ CHÍ MINH - HỘI SINH VIÊN</span>
      </div>
      <div class="flex items-center gap-3 text-[11px] text-blue-200">
        <span class="font-medium">Cổng Sự Kiện & Ngoại Khóa Sinh Viên</span>
        <span class="hidden md:inline">•</span>
        <span class="font-bold text-amber-300">Nhóm 109 - FLF1007</span>
      </div>
    </div>
  </div>

  <!-- ==================================================== -->
  <!-- MAIN NAVIGATION BAR (Sticky Nav mô phỏng youth.is.vnu) -->
  <!-- ==================================================== -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-3">
        
        <!-- Logo & Brand (Chuẩn cổng sự kiện) -->
        <a href="#hero" class="flex items-center gap-3 group shrink-0">
          <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xl sm:text-2xl font-black tracking-tight text-[#0B2341] group-hover:text-blue-900 transition">ULIS VIBE</span>
              <span class="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-900 rounded-full uppercase tracking-wider">CỔNG SỰ KIỆN</span>
            </div>
            <p class="text-[11px] text-slate-500 font-semibold tracking-tight hidden lg:block">Cổng Thông Tin Hoạt Động & Tra Cứu Cert A1-A2-A3</p>
          </div>
        </a>

        <!-- Quick Header Search Bar (Mô phỏng youth.is.vnu) -->
        <div class="hidden xl:flex items-center relative w-72 2xl:w-80">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="header-search-input" placeholder="Tìm sự kiện, CLB, chứng chỉ..." class="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition" />
        </div>

        <!-- Desktop Navigation Links (Single-line, Full coverage) -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-1.5 font-semibold text-xs xl:text-sm text-slate-700 whitespace-nowrap shrink-0">
          <a href="#hero" class="px-2.5 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Trang chủ</a>
          <a href="#event-hub" class="px-2.5 py-1.5 rounded-xl text-blue-950 hover:bg-blue-50 transition flex items-center gap-1 font-bold whitespace-nowrap">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-800"></i> Sự kiện
          </a>
          <a href="#club-directory" class="px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition flex items-center gap-1 whitespace-nowrap">
            <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-700"></i> CLB & Đội nhóm
          </a>
          <a href="#leaderboard" class="px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-amber-950 hover:bg-amber-50 transition flex items-center gap-1 whitespace-nowrap">
            <i data-lucide="award" class="w-3.5 h-3.5 text-amber-600"></i> Vinh danh
          </a>
          <a href="#cert-hub" class="px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition flex items-center gap-1 whitespace-nowrap">
            <i data-lucide="file-check-2" class="w-3.5 h-3.5 text-indigo-700"></i> Cert Hub
          </a>
          <a href="#news" class="px-2.5 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Tin tức</a>
          <a href="#gallery" class="px-2.5 py-1.5 rounded-xl hover:text-blue-950 hover:bg-slate-100 transition whitespace-nowrap">Khoảnh khắc</a>
          <a href="#video-intro" class="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 transition flex items-center gap-1 font-bold whitespace-nowrap border border-blue-200/70" title="Xem video giới thiệu đề án">
            <i data-lucide="play-circle" class="w-3.5 h-3.5 text-blue-700"></i> Video Đề Án
          </a>
        </nav>

        <!-- Right Action Buttons (Bookmark & VNU Mail Login) -->
        <div class="hidden sm:flex items-center gap-2 shrink-0">
          <!-- Saved Events Button -->
          <button id="btn-view-saved" class="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-950 hover:bg-slate-100 transition shrink-0" title="Sự kiện đã lưu">
            <i data-lucide="bookmark" class="w-4 h-4 xl:w-5 xl:h-5"></i>
            <span id="saved-events-badge" class="hidden absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-amber-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">0</span>
          </button>

          <!-- VNU Mail SSO Login Button (Mô phỏng youth.is.vnu) -->
          <button onclick="openLoginModal()" class="px-3.5 py-2 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0">
            <i data-lucide="user" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>Đăng nhập VNU Mail</span>
          </button>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="lg:hidden flex items-center gap-2">
          <button id="mobile-menu-btn" class="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Toggle Menu">
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div id="mobile-menu" class="hidden lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2">
      <div class="pb-2">
        <input type="text" id="mobile-search-input" placeholder="Tìm kiếm sự kiện, CLB, chứng chỉ..." class="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900" />
      </div>
      <a href="#hero" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Trang chủ</a>
      <a href="#event-hub" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-950 bg-blue-50">Sự kiện & Tuyển quân (Event Hub)</a>
      <a href="#club-directory" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Danh bạ 50+ CLB ULIS (3 Nhóm)</a>
      <a href="#leaderboard" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-900 bg-amber-50/70">Bảng vàng Top sinh viên tích cực</a>
      <a href="#cert-hub" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Tra cứu Cert Hub (A1, A2, A3 Chuẩn Hóa)</a>
      <a href="#news" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Tin tức & Thông báo Đoàn - Hội</a>
      <a href="#gallery" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Khoảnh khắc sinh viên ULIS</a>
      <a href="#team-plan" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Kế hoạch & Nhóm thực hiện 109</a>
      <a href="#video-intro" class="mobile-nav-link block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-900 bg-blue-50 border border-blue-200/60">🎬 Video Giới Thiệu Đề Án (1080p 60fps)</a>
      <div class="pt-3 border-t border-slate-100 space-y-2">
        <button onclick="openLoginModal()" class="w-full py-2.5 bg-[#0B2341] text-white rounded-xl text-center text-xs font-bold block">
          Đăng nhập bằng tài khoản VNU Mail (@vnu.edu.vn)
        </button>
        <a href="#feedback-section" class="mobile-nav-link w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl text-center text-xs font-semibold block">
          Góp ý ẩn danh cho đề án
        </a>
      </div>
    </div>
  </header>'''

assert old_header_target in content, "Header target not found in build_static_page.js!"
content = content.replace(old_header_target, new_header)

# 2. Insert Quick Access Grid between Hero and Video-Intro
old_hero_end = '''            <a href="#cert-hub" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition shadow-2xs hover:shadow-xs hover:-translate-y-0.5">
              <i data-lucide="award" class="w-5 h-5 text-amber-600"></i>
              <span>Tra cứu Cert Hub</span>
              <span class="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-950 rounded font-bold">A1 • A2 • A3</span>
            </a>
          </div>

        </div>
      </div>
    </section>'''

new_quick_access_plus_hero = '''            <a href="#cert-hub" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition shadow-2xs hover:shadow-xs hover:-translate-y-0.5">
              <i data-lucide="award" class="w-5 h-5 text-amber-600"></i>
              <span>Tra cứu Cert Hub</span>
              <span class="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-950 rounded font-bold">A1 • A2 • A3</span>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================================================== -->
    <!-- QUICK FEATURE ACCESS HUB (Mô phỏng youth.is.vnu) -->
    <!-- ==================================================== -->
    <section class="py-6 sm:py-8 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <a href="#event-hub" class="group p-4 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="calendar" class="w-6 h-6 text-blue-800"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Sự kiện & Workshop</span>
            <span class="text-[11px] text-slate-500 mt-0.5">12 sự kiện mở đơn</span>
          </a>

          <a href="#club-directory" class="group p-4 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="users" class="w-6 h-6 text-emerald-800"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-950">Tổ chức & 50+ CLB</span>
            <span class="text-[11px] text-slate-500 mt-0.5">3 nhóm chuyên môn</span>
          </a>

          <a href="#leaderboard" class="group p-4 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="award" class="w-6 h-6 text-amber-600"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-950">Bảng vàng Vinh danh</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Top SV tích cực</span>
          </a>

          <a href="#cert-hub" class="group p-4 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="file-check-2" class="w-6 h-6 text-indigo-800"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-950">Chuẩn Cert A1-A2-A3</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Minh chứng ĐRL</span>
          </a>

          <a href="#news" class="group p-4 bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="newspaper" class="w-6 h-6 text-sky-800"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-950">Tin tức & Phong trào</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Bản tin Đoàn - Hội</span>
          </a>

          <a href="#gallery" class="group p-4 bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-2xl transition shadow-2xs hover:shadow-xs flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <i data-lucide="sparkles" class="w-6 h-6 text-rose-700"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-950">Khoảnh khắc ULIS</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Thư viện sinh viên</span>
          </a>

        </div>
      </div>
    </section>'''

assert old_hero_end in content, "Hero end not found in build_static_page.js!"
content = content.replace(old_hero_end, new_quick_access_plus_hero)

# 3. Insert Leaderboard right after Video-Intro
old_video_end = '''        <!-- Video Showcase Frame (Pure 16:9 Motion Display) -->
        <div class="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-5xl mx-auto bg-slate-950">
          <div class="w-full relative aspect-video overflow-hidden">
            <iframe 
              id="video-intro-iframe"
              src="./video/index.html?embedded=1&autoplay=1&v=20261117_wix" 
              title="ULIS Vibe Dynamic Showcase Video" 
              class="w-full h-full border-0 block" 
              allow="autoplay; fullscreen; accelerometer; gyroscope" 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>
    </section>'''

new_video_end_plus_leaderboard = '''        <!-- Video Showcase Frame (Pure 16:9 Motion Display) -->
        <div class="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-5xl mx-auto bg-slate-950">
          <div class="w-full relative aspect-video overflow-hidden">
            <iframe 
              id="video-intro-iframe"
              src="./video/index.html?embedded=1&autoplay=1&v=20261117_wix" 
              title="ULIS Vibe Dynamic Showcase Video" 
              class="w-full h-full border-0 block" 
              allow="autoplay; fullscreen; accelerometer; gyroscope" 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================== -->
    <!-- LEADERBOARD: TOP SINH VIÊN TÍCH CỰC (Mô phỏng youth.is.vnu) -->
    <!-- ==================================================== -->
    <section id="leaderboard" class="py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-600"></i> Gamification & Vinh Danh Sinh Viên
              </span>
              <span class="text-xs text-slate-500 hidden sm:inline">• Cập nhật hàng tuần</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top Sinh Viên Tích Cực — Bảng Vàng Hoạt Động & Rèn Luyện
            </h2>
            <p class="text-sm text-slate-600 mt-2 max-w-2xl">
              Vinh danh các gương mặt sinh viên năng nổ tham gia các hoạt động ngoại khóa, hội thảo học thuật và phong trào tình nguyện, tích lũy điểm rèn luyện (ĐRL) xuất sắc nhất Trường Đại học Ngoại ngữ.
            </p>
          </div>

          <!-- Switcher Tabs -->
          <div class="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
            <button id="tab-lb-month" onclick="switchLeaderboardTab('month')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B2341] text-white transition shadow-2xs">
              Theo Tháng 11/2026
            </button>
            <button id="tab-lb-term" onclick="switchLeaderboardTab('term')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-950 transition">
              Toàn Học Kỳ I (2026-2027)
            </button>
          </div>
        </div>

        <!-- Top 3 Podium Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <!-- Hạng 2: Bạc -->
          <div class="order-2 md:order-1 bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-4 right-4">
              <span class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center border-2 border-white shadow-2xs">2</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xl overflow-hidden shrink-0">
                  <span class="bg-gradient-to-br from-slate-400 to-slate-500 w-full h-full flex items-center justify-center text-white font-extrabold">HN</span>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Trần Hoàng Nam</h3>
                  <p class="text-xs text-slate-500">Khoa NN&VH Nhật Bản • K57</p>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-slate-200/80 text-slate-800 text-[10px] font-bold rounded">Cán bộ CLB Năng nổ</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 text-center mb-4">
                <div>
                  <span class="block text-base font-extrabold text-[#0B2341] tabular-nums">13</span>
                  <span class="text-[10px] text-slate-500 font-medium">Huy hiệu</span>
                </div>
                <div class="border-x border-slate-100">
                  <span class="block text-base font-extrabold text-emerald-700 tabular-nums">95</span>
                  <span class="text-[10px] text-slate-500 font-medium">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-base font-extrabold text-amber-700 tabular-nums">8</span>
                  <span class="text-[10px] text-slate-500 font-medium">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Đạt chuẩn Cert A1 & A2</span>
              <a href="#event-hub" class="font-bold text-blue-900 hover:underline">Sự kiện đã tham gia →</a>
            </div>
          </div>

          <!-- Hạng 1: Vàng (Nổi bật, Elevated) -->
          <div class="order-1 md:order-2 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-md flex flex-col justify-between relative overflow-hidden -translate-y-2">
            <div class="absolute top-4 right-4">
              <span class="w-9 h-9 rounded-full bg-amber-500 text-amber-950 font-black text-sm flex items-center justify-center border-2 border-white shadow-xs">👑 1</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-5">
                <div class="w-18 h-18 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-900 text-2xl overflow-hidden shrink-0 shadow-xs">
                  <span class="bg-gradient-to-br from-amber-400 to-amber-600 w-full h-full flex items-center justify-center text-white font-extrabold">MC</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <h3 class="font-black text-slate-950 text-lg">Nguyễn Minh Châu</h3>
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600"></i>
                  </div>
                  <p class="text-xs text-slate-600">Khoa Sư phạm Tiếng Anh • K58</p>
                  <span class="inline-block mt-1 px-2.5 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-extrabold rounded-full border border-amber-200">
                    Đại sứ Ngoại khóa Tháng 11
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3.5 bg-white rounded-2xl border border-amber-200/80 text-center mb-4 shadow-2xs">
                <div>
                  <span class="block text-lg font-black text-[#0B2341] tabular-nums">15</span>
                  <span class="text-[10px] text-slate-500 font-bold uppercase">Huy hiệu</span>
                </div>
                <div class="border-x border-slate-100">
                  <span class="block text-lg font-black text-emerald-700 tabular-nums">98</span>
                  <span class="text-[10px] text-slate-500 font-bold uppercase">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-lg font-black text-amber-700 tabular-nums">9</span>
                  <span class="text-[10px] text-slate-500 font-bold uppercase">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
              <span class="text-amber-950 font-semibold">Tích lũy trọn vẹn A1 • A2 • A3</span>
              <button onclick="showToast('Nguyễn Minh Châu đã đạt danh hiệu Sinh viên Xuất sắc Tháng 11!', 'success')" class="font-bold text-amber-900 hover:underline">Vinh danh ✨</button>
            </div>
          </div>

          <!-- Hạng 3: Đồng -->
          <div class="order-3 bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-4 right-4">
              <span class="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center border-2 border-white shadow-2xs">3</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center font-bold text-amber-800 text-xl overflow-hidden shrink-0">
                  <span class="bg-gradient-to-br from-amber-600 to-amber-700 w-full h-full flex items-center justify-center text-white font-extrabold">PT</span>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Lê Phương Thảo</h3>
                  <p class="text-xs text-slate-500">Khoa NN&VH Trung Quốc • K58</p>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-bold rounded">Tình nguyện viên Tiêu biểu</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 text-center mb-4">
                <div>
                  <span class="block text-base font-extrabold text-[#0B2341] tabular-nums">11</span>
                  <span class="text-[10px] text-slate-500 font-medium">Huy hiệu</span>
                </div>
                <div class="border-x border-slate-100">
                  <span class="block text-base font-extrabold text-emerald-700 tabular-nums">92</span>
                  <span class="text-[10px] text-slate-500 font-medium">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-base font-extrabold text-amber-700 tabular-nums">7</span>
                  <span class="text-[10px] text-slate-500 font-medium">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Đạt chuẩn Cert A2 & A3</span>
              <a href="#event-hub" class="font-bold text-blue-900 hover:underline">Sự kiện đã tham gia →</a>
            </div>
          </div>

        </div>

        <!-- Leaderboard Row 4, 5, 6 & Rèn Luyện Conversion Box -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center justify-between">
              <span>Gương mặt tiêu biểu tiếp theo (Top 4 - 6)</span>
              <a href="#event-hub" class="text-blue-900 hover:underline normal-case font-semibold">Tham gia sự kiện để lên bảng vàng →</a>
            </h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center tabular-nums">4</span>
                  <div>
                    <span class="text-sm font-bold text-slate-900 block">Phạm Gia Huy</span>
                    <span class="text-xs text-slate-500">Khoa Tiếng Anh • QH2025</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs tabular-nums">
                  <span class="text-slate-600"><strong>10</strong> huy hiệu</span>
                  <span class="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">89 ĐRL</span>
                </div>
              </div>

              <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center tabular-nums">5</span>
                  <div>
                    <span class="text-sm font-bold text-slate-900 block">Hoàng Mai Linh</span>
                    <span class="text-xs text-slate-500">Khoa NN&VH Hàn Quốc • QH2024</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs tabular-nums">
                  <span class="text-slate-600"><strong>9</strong> huy hiệu</span>
                  <span class="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">87 ĐRL</span>
                </div>
              </div>

              <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center tabular-nums">6</span>
                  <div>
                    <span class="text-sm font-bold text-slate-900 block">Vũ Đức Anh</span>
                    <span class="text-xs text-slate-500">Khoa NN&VH Pháp • QH2023</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs tabular-nums">
                  <span class="text-slate-600"><strong>8</strong> huy hiệu</span>
                  <span class="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">85 ĐRL</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quy chế cộng điểm rèn luyện ĐHQGHN Box -->
          <div class="lg:col-span-5 bg-[#0B2341] p-6 rounded-3xl text-white flex flex-col justify-between shadow-sm">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span class="text-xs font-bold text-blue-200 uppercase tracking-wider">Cơ chế quy đổi ĐRL ĐHQGHN</span>
              </div>
              <h4 class="text-lg font-bold text-white mb-2">Cách Tích Lũy Điểm Rèn Luyện & Huy Hiệu</h4>
              <p class="text-xs text-blue-200 leading-relaxed mb-4">
                Mỗi sự kiện ngoại khóa trên ULIS Vibe đều được gắn nhãn chứng chỉ tương ứng theo Quy chế ĐHQGHN:
              </p>
              <div class="space-y-2 text-xs">
                <div class="p-2.5 bg-blue-900/60 rounded-xl border border-blue-800 flex items-center justify-between">
                  <span>📘 Chứng nhận A1 (Học thuật & NCKH):</span>
                  <strong class="text-amber-300 font-bold tabular-nums">+5 ĐRL / Sự kiện</strong>
                </div>
                <div class="p-2.5 bg-blue-900/60 rounded-xl border border-blue-800 flex items-center justify-between">
                  <span>📙 Chứng nhận A2 (Kỹ năng & Ngoại khóa):</span>
                  <strong class="text-amber-300 font-bold tabular-nums">+3 ĐRL / Sự kiện</strong>
                </div>
                <div class="p-2.5 bg-blue-900/60 rounded-xl border border-blue-800 flex items-center justify-between">
                  <span>📗 Chứng nhận A3 (Tình nguyện & Xã hội):</span>
                  <strong class="text-amber-300 font-bold tabular-nums">+4 ĐRL / Sự kiện</strong>
                </div>
              </div>
            </div>
            <div class="pt-4 mt-4 border-t border-blue-900 text-[11px] text-blue-300 flex items-center justify-between">
              <span>Tối đa: 100 Điểm Rèn Luyện / Học kỳ</span>
              <a href="#cert-hub" class="text-amber-400 font-bold hover:underline">Tra cứu khung tiêu chí →</a>
            </div>
          </div>
        </div>

      </div>
    </section>'''

assert old_video_end in content, "Video end not found in build_static_page.js!"
content = content.replace(old_video_end, new_video_end_plus_leaderboard)

# 4. Add Event Hub youth.is.vnu style category pills
old_event_hub_header = '''        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Event Hub – Lịch Sự Kiện & Tuyển Quân Toàn Trường
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Tập trung toàn bộ hội thảo chuyên môn, hoạt động rèn luyện và các đợt mở đơn tuyển thành viên của mọi CLB tại ULIS. Dễ dàng lọc theo loại chứng nhận A1, A2, A3 hoặc nhóm hoạt động.
          </p>
        </div>'''

new_event_hub_header = '''        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-700"></i> Hệ Thống Sự Kiện & Workshop
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Event Hub – Lịch Sự Kiện & Tuyển Quân Toàn Trường
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Tập trung toàn bộ hội thảo chuyên môn, hoạt động rèn luyện và các đợt mở đơn tuyển thành viên của mọi CLB tại ULIS. Dễ dàng lọc theo loại chứng nhận A1, A2, A3 hoặc nhóm hoạt động.
          </p>
        </div>

        <!-- Event Category Tabs (Mô phỏng youth.is.vnu.edu.vn Tabs) -->
        <div class="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar p-1.5">
          <button onclick="filterEventsByStatus('all')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#0B2341] text-white shadow-2xs whitespace-nowrap transition">
            Tất cả sự kiện
          </button>
          <button onclick="filterEventsByStatus('open')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Đang mở đăng ký
          </button>
          <button onclick="filterEventsByStatus('closing_soon')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap transition flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Sắp diễn ra
          </button>
          <button onclick="filterEventsByCert('A1')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap transition">
            Học thuật & NCKH (A1)
          </button>
          <button onclick="filterEventsByCert('A2')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap transition">
            Kỹ năng & Ngoại khóa (A2)
          </button>
          <button onclick="filterEventsByCert('A3')" class="event-filter-pill px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 whitespace-nowrap transition">
            Tình nguyện & Xã hội (A3)
          </button>
        </div>'''

assert old_event_hub_header in content, "Event Hub header not found in build_static_page.js!"
content = content.replace(old_event_hub_header, new_event_hub_header)

# 5. Add "Tổ chức tích cực" to Club Directory
old_club_header = '''        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Club Directory – Danh Bạ Hệ Thống Câu Lạc Bộ ULIS
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Giải quyết triệt để 65,7% băn khoăn "Không biết CLB nào phù hợp". Toàn bộ danh sách CLB được phân loại theo đúng 3 nhóm chuẩn: <strong>Học thuật</strong>, <strong>Sở thích & Năng khiếu</strong>, <strong>Kỹ năng & Tình nguyện</strong>, kèm rõ đối tượng phù hợp và kênh ứng tuyển.
          </p>
        </div>'''

new_club_header = '''        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-700"></i> Hệ Sinh Thái 50+ Tổ Chức & CLB
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Club Directory – Danh Bạ Hệ Thống Câu Lạc Bộ ULIS
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Giải quyết triệt để 65,7% băn khoăn "Không biết CLB nào phù hợp". Toàn bộ danh sách CLB được phân loại theo đúng 3 nhóm chuẩn: <strong>Học thuật</strong>, <strong>Sở thích & Năng khiếu</strong>, <strong>Kỹ năng & Tình nguyện</strong>, kèm rõ đối tượng phù hợp và kênh ứng tuyển.
          </p>
        </div>

        <!-- Khối "Tổ chức tích cực" (Top Active Clubs mô phỏng youth.is.vnu) -->
        <div class="mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <i data-lucide="flame" class="w-4 h-4 text-amber-500"></i> Tổ Chức & Câu Lạc Bộ Hoạt Động Tích Cực Nhất
            </h3>
            <span class="text-xs text-slate-500">Được đánh giá dựa trên tần suất tổ chức sự kiện & số thành viên</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded mb-2 inline-block">HỌC THUẬT</span>
                <h4 class="text-sm font-bold text-slate-900">CLB Tiếng Anh (EC)</h4>
                <p class="text-xs text-slate-500 mt-1">240 thành viên • 12 sự kiện</p>
              </div>
              <button onclick="openClubModal('ec')" class="mt-3 text-xs font-bold text-blue-900 hover:underline text-left flex items-center gap-1">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded mb-2 inline-block">HỌC THUẬT</span>
                <h4 class="text-sm font-bold text-slate-900">CLB Tiếng Nhật (JPC)</h4>
                <p class="text-xs text-slate-500 mt-1">180 thành viên • 9 sự kiện</p>
              </div>
              <button onclick="openClubModal('jpc')" class="mt-3 text-xs font-bold text-blue-900 hover:underline text-left flex items-center gap-1">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded mb-2 inline-block">TÌNH NGUYỆN</span>
                <h4 class="text-sm font-bold text-slate-900">CLB Tình Nguyện (V-ULIS)</h4>
                <p class="text-xs text-slate-500 mt-1">310 thành viên • 15 sự kiện</p>
              </div>
              <button onclick="openClubModal('vulis')" class="mt-3 text-xs font-bold text-emerald-900 hover:underline text-left flex items-center gap-1">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-950 rounded mb-2 inline-block">KỸ NĂNG</span>
                <h4 class="text-sm font-bold text-slate-900">ULIS Debate Club (UDC)</h4>
                <p class="text-xs text-slate-500 mt-1">120 thành viên • 8 sự kiện</p>
              </div>
              <button onclick="openClubModal('udc')" class="mt-3 text-xs font-bold text-amber-900 hover:underline text-left flex items-center gap-1">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
            </div>
          </div>
        </div>'''

assert old_club_header in content, "Club header not found in build_static_page.js!"
content = content.replace(old_club_header, new_club_header)

# 6. Insert News and Gallery between Club Directory and Cert Hub
old_club_end = '''        <!-- Clubs Grid Container -->
        <div id="clubs-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${clubsHtml}
        </div>

      </div>
    </section>'''

new_club_end_plus_news_gallery = '''        <!-- Clubs Grid Container -->
        <div id="clubs-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${clubsHtml}
        </div>

      </div>
    </section>

    <!-- ==================================================== -->
    <!-- TIN TỨC & BẢN TIN NGOẠI KHÓA (Mô phỏng youth.is.vnu) -->
    <!-- ==================================================== -->
    <section id="news" class="py-20 bg-white border-t border-slate-200 scroll-mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-sky-100 text-sky-950 rounded-full text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="newspaper" class="w-3.5 h-3.5 text-sky-700"></i> Bản Tin Đoàn - Hội & Nhà Trường
              </span>
              <span class="text-xs text-slate-500 hidden sm:inline">• Tin tức chính thức</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tin Tức & Nhịp Sống Ngoại Khóa ULIS
            </h2>
            <p class="text-sm text-slate-600 mt-2 max-w-2xl">
              Cập nhật các thông báo mới nhất về xét cấp chứng nhận ngoại khóa A1-A2-A3, các phong trào thi đua và hoạt động giao lưu quốc tế tại ULIS.
            </p>
          </div>

          <a href="#event-hub" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 self-start md:self-auto">
            <span>Xem lịch sự kiện</span>
            <i data-lucide="arrow-right" class="w-4 h-4 text-blue-900"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- News Card 1 -->
          <article class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-01.webp" alt="Kế hoạch xét cấp chứng nhận A1-A2-A3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-01.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">THÔNG BÁO</span>
                  <span>15/11/2026</span>
                  <span>•</span>
                  <span>Phòng CT&CT HSSV</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-900 transition mb-2 line-clamp-2">
                  Kế Hoạch Xét Cấp Chứng Nhận Ngoại Khóa A1 - A2 - A3 Học Kỳ I (2026 - 2027)
                </h3>
                <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  Hướng dẫn chi tiết quy trình thu nộp và thẩm định minh chứng tham gia hoạt động ngoại khóa dành cho sinh viên các khóa QH2023, QH2024, QH2025 và QH2026.
                </p>
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500">Đọc trong 3 phút</span>
              <button onclick="openNewsModal('news-01')" class="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1">
                Chi tiết thông báo <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </article>

          <!-- News Card 2 -->
          <article class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-02.webp" alt="Chiến dịch Sinh viên 5 Tốt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-02.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px]">PHONG TRÀO</span>
                  <span>10/11/2026</span>
                  <span>•</span>
                  <span>Đoàn Trường</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-900 transition mb-2 line-clamp-2">
                  Phát Động Chiến Dịch "Sinh Viên 5 Tốt" & Tháng Rèn Luyện Sinh Viên ULIS 2026
                </h3>
                <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  Chuỗi 15 hoạt động kết hợp toạ đàm hội nhập quốc tế, rèn luyện thể lực và công tác tình nguyện vì cộng đồng tại Ba Vì dành cho đoàn viên sinh viên.
                </p>
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500">Đọc trong 4 phút</span>
              <button onclick="openNewsModal('news-02')" class="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1">
                Chi tiết thông báo <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </article>

          <!-- News Card 3 -->
          <article class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-03.webp" alt="Khai mạc Tuần lễ Văn hóa Quốc tế" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-03.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 font-bold text-[10px]">VĂN HÓA</span>
                  <span>05/11/2026</span>
                  <span>•</span>
                  <span>Hội Sinh viên</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-900 transition mb-2 line-clamp-2">
                  Khai Mạc Tuần Lễ Văn Hóa Quốc Tế & Chung Kết Hùng Biện Ngoại Ngữ 2026
                </h3>
                <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  Sân chơi quy tụ hơn 30 gian hàng văn hóa đa quốc gia và các đội thi xuất sắc nhất đại diện cho 7 ngôn ngữ đào tạo tại ULIS cùng tranh tài tại Vũ Đình Liên.
                </p>
              </div>
            </div>
            <div class="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500">Đọc trong 2 phút</span>
              <button onclick="openNewsModal('news-03')" class="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1">
                Chi tiết thông báo <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </article>

        </div>

      </div>
    </section>

    <!-- ==================================================== -->
    <!-- THƯ VIỆN KHOẢNH KHẮC HOẠT ĐỘNG (Mô phỏng youth.is.vnu) -->
    <!-- ==================================================== -->
    <section id="gallery" class="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="px-3 py-1 bg-rose-100 text-rose-950 rounded-full text-xs font-bold flex items-center gap-1.5">
              <i data-lucide="camera" class="w-3.5 h-3.5 text-rose-700"></i> Gallery Ảnh Sinh Viên
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Khoảnh Khắc Sinh Viên ULIS
          </h2>
          <p class="text-sm text-slate-600 mt-2">
            Những dấu ấn thanh xuân rực rỡ qua các hoạt động ngoại khóa, phong trào tình nguyện và ngày hội giao lưu văn hóa quốc tế.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-01.webp" alt="ULIS International Day" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-01.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Văn hóa Quốc tế</span>
              <h4 class="text-sm font-bold text-white leading-snug">ULIS International Day</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Sân A1-A2 • 1.200 sinh viên tham gia</p>
            </div>
          </div>

          <div class="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-02.webp" alt="Chung Kết Hùng Biện Tiếng Anh" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-02.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Học thuật & Tranh biện</span>
              <h4 class="text-sm font-bold text-white leading-snug">Chung Kết Hùng Biện Tiếng Anh</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Hội trường Sunwah • Tranh tài 8 đội</p>
            </div>
          </div>

          <div class="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-03.webp" alt="Mùa Hè Xanh Ba Vì" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-03.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Tình nguyện Xã hội</span>
              <h4 class="text-sm font-bold text-white leading-snug">Chiến Dịch Mùa Hè Xanh</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Huyện Ba Vì • Đội Tình nguyện ULIS</p>
            </div>
          </div>

          <div class="group relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-04.webp" alt="Lễ Tuyên Dương Sinh Viên 5 Tốt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-04.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Tuyên dương & Khen thưởng</span>
              <h4 class="text-sm font-bold text-white leading-snug">Vinh Danh Sinh Viên 5 Tốt</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Vũ Đình Liên • Trao 120 danh hiệu</p>
            </div>
          </div>

        </div>

      </div>
    </section>'''

assert old_club_end in content, "Club end not found in build_static_page.js!"
content = content.replace(old_club_end, new_club_end_plus_news_gallery)

# 7. Update Footer
old_footer = '''  <!-- ==================================================== -->
  <!-- FOOTER (Navy themed, no gray on color) -->
  <!-- ==================================================== -->
  <footer class="bg-blue-950 text-blue-200 py-12 border-t border-blue-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        
        <div class="md:col-span-5 space-y-3">
          <div class="flex items-center gap-3">
            <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-10 h-10 object-contain brightness-110" />
            <div>
              <span class="text-lg font-black text-white tracking-tight">ULIS VIBE</span>
              <p class="text-[11px] text-blue-300">Nền tảng kết nối sự kiện, CLB & Tra cứu chứng nhận ngoại khóa</p>
            </div>
          </div>
          <p class="text-xs text-blue-200 leading-relaxed">
            Dự án bài tập nhóm giữa kỳ Học kỳ I (2026-2027) môn Công nghệ thông tin & Truyền thông. Thực hiện bởi <strong>Nhóm 109 - Lớp FLF1007</strong>, Trường Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội.
          </p>
          <div class="text-xs text-blue-300 space-y-1">
            <p>📍 <strong>Địa chỉ:</strong> Số 2, Phạm Văn Đồng, Cầu Giấy, Hà Nội</p>
            <p>📞 <strong>Liên hệ nhóm trưởng:</strong> <span class="tabular-nums">0919 672 122</span> (Đoàn Thị Phương Thảo)</p>
            <p>✉️ <strong>Email:</strong> phuongthaodoan07@gmail.com</p>
          </div>
        </div>

        <div class="md:col-span-4 space-y-2 text-xs text-blue-200">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2">Đơn vị chủ quản & Phối hợp</h4>
          <p>• <strong>Đơn vị chủ quản:</strong> Trường Đại học Ngoại ngữ - ĐHQG Hà Nội</p>
          <p>• <strong>Đơn vị thực hiện:</strong> Nhóm 109 CNTT - Lớp FLF1007</p>
          <p>• <strong>Đơn vị phối hợp:</strong> TT CNTT-TT & HL, Phòng Đào tạo, Phòng Kế hoạch Tài chính</p>
          <p>• <strong>Nơi nhận báo cáo:</strong> Ban Giám hiệu, Phòng KHTC, Phòng Đào tạo</p>
        </div>

        <div class="md:col-span-3 space-y-2 text-xs text-blue-200">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2">Truy cập nhanh</h4>
          <ul class="space-y-1.5">
            <li><a href="#event-hub" class="hover:text-amber-400 transition">Event Hub (Lịch sự kiện)</a></li>
            <li><a href="#club-directory" class="hover:text-amber-400 transition">Club Directory (Danh bạ 3 nhóm CLB)</a></li>
            <li><a href="#cert-hub" class="hover:text-amber-400 transition">Cert Hub (Chuẩn hóa A1, A2, A3)</a></li>
            <li><a href="#feedback-section" class="hover:text-amber-400 transition">Góp ý ẩn danh</a></li>
          </ul>
        </div>

      </div>

      <div class="pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
        <p>© 2026 ULIS Vibe • Sản phẩm đề án thuộc về Nhóm 109 (Lớp FLF1007) - ULIS VNU.</p>
        <p class="text-blue-300">Được tối ưu tải nhanh, chuẩn Responsive trên Máy tính & Thiết bị di động.</p>
      </div>
    </div>
  </footer>'''

new_footer = '''  <!-- ==================================================== -->
  <!-- FOOTER CHUẨN CỔNG ĐẠI HỌC VNU (Deep Navy #0B2341) -->
  <!-- ==================================================== -->
  <footer class="bg-[#0B2341] text-blue-200 py-16 border-t border-blue-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        
        <!-- Cột 1: Thông tin trường & Brand -->
        <div class="md:col-span-4 space-y-4">
          <div class="flex items-center gap-3">
            <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-12 h-12 object-contain brightness-110" />
            <div>
              <span class="text-xl font-black text-white tracking-tight block">ULIS VIBE</span>
              <p class="text-xs text-blue-300 font-medium">Cổng Sự Kiện, CLB & Tra Cứu Chứng Nhận Ngoại Khóa</p>
            </div>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Hệ sinh thái số hóa tập trung kết nối toàn bộ hoạt động ngoại khóa, hội thảo chuyên môn và đợt tuyển thành viên của Trường Đại học Ngoại ngữ – Đại học Quốc gia Hà Nội.
          </p>
          <div class="text-xs text-slate-300 space-y-2 pt-1">
            <p class="flex items-start gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
              <span>Số 2 Phạm Văn Đồng, Quận Cầu Giấy, Thành phố Hà Nội</span>
            </p>
            <p class="flex items-center gap-2">
              <i data-lucide="phone" class="w-4 h-4 text-amber-400 shrink-0"></i>
              <span>Hotline Hỗ trợ SV: <strong>024.3754.7269</strong></span>
            </p>
            <p class="flex items-center gap-2">
              <i data-lucide="mail" class="w-4 h-4 text-amber-400 shrink-0"></i>
              <span>dhnn@vnu.edu.vn • ulisvibe@vnu.edu.vn</span>
            </p>
          </div>
        </div>

        <!-- Cột 2: Cổng dịch vụ sinh viên -->
        <div class="md:col-span-3 space-y-3 text-xs text-slate-300">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-blue-900 pb-2">Hệ Thống Tiện Ích</h4>
          <ul class="space-y-2">
            <li><a href="#event-hub" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-400"></i> Event Hub (Lịch sự kiện toàn trường)</a></li>
            <li><a href="#club-directory" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="users" class="w-3.5 h-3.5 text-emerald-400"></i> Club Directory (Danh bạ 50+ CLB)</a></li>
            <li><a href="#leaderboard" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="award" class="w-3.5 h-3.5 text-amber-400"></i> Bảng vàng Top sinh viên tích cực</a></li>
            <li><a href="#cert-hub" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="file-check-2" class="w-3.5 h-3.5 text-indigo-400"></i> Tra cứu chuẩn Cert A1 - A2 - A3</a></li>
            <li><a href="#news" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="newspaper" class="w-3.5 h-3.5 text-sky-400"></i> Tin tức & Hoạt động Đoàn - Hội</a></li>
            <li><a href="#gallery" class="hover:text-amber-300 transition flex items-center gap-1.5"><i data-lucide="camera" class="w-3.5 h-3.5 text-rose-400"></i> Thư viện khoảnh khắc sinh viên</a></li>
          </ul>
        </div>

        <!-- Cột 3: Đơn vị chủ quản & Đối tác -->
        <div class="md:col-span-3 space-y-3 text-xs text-slate-300">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-blue-900 pb-2">Đơn Vị Quản Lý & Liên Kết</h4>
          <ul class="space-y-2">
            <li>• Trường Đại học Ngoại ngữ – ĐHQGHN</li>
            <li>• Đoàn TNCS Hồ Chí Minh Trường ĐH Ngoại ngữ</li>
            <li>• Hội Sinh viên Trường ĐH Ngoại ngữ</li>
            <li>• Phòng Chính trị & Công tác Học sinh Sinh viên</li>
            <li>• Cổng Sự kiện Trường Quốc tế VNU-IS (Tham chiếu)</li>
            <li>• Cổng thông tin Đại học Quốc gia Hà Nội (VNU)</li>
          </ul>
        </div>

        <!-- Cột 4: Đề án Nhóm 109 -->
        <div class="md:col-span-2 space-y-3 text-xs text-slate-300">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-blue-900 pb-2">Đề Án Nhóm 109</h4>
          <p class="leading-relaxed text-[11px]">
            Học phần: FLF1007<br />
            Bộ môn CNTT-TT<br />
            Học kỳ I: 2026 - 2027
          </p>
          <div class="pt-2">
            <a href="#feedback-section" class="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition">
              <i data-lucide="message-square" class="w-3.5 h-3.5 text-amber-400"></i> Góp ý ẩn danh
            </a>
          </div>
        </div>

      </div>

      <div class="pt-8 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2026 Cổng Sự Kiện & Ngoại Khóa ULIS Vibe. Bản quyền thuộc về Trường Đại học Ngoại ngữ – ĐHQGHN & Nhóm 109.</p>
        <p class="text-slate-400">Xây dựng theo tiêu chuẩn Cổng Sự kiện Đại học Quốc gia Hà Nội (VNU Youth Portal).</p>
      </div>
    </div>
  </footer>'''

assert old_footer in content, "Footer not found in build_static_page.js!"
content = content.replace(old_footer, new_footer)

with open('build_static_page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("build_static_page.js updated successfully with all youth.is.vnu features!")
