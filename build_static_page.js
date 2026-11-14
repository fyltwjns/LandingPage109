const fs = require('fs');

// Load data
const dataCode = fs.readFileSync('./js/data.js', 'utf8');
const window = {};
eval(dataCode);
const D = window.ULIS_DATA;

function formatDateVietnamese(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Pre-render Cert Recommender Initial Box
const certRecommenderInitHtml = `
      <div class="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-slate-800">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-3 h-3 rounded-full bg-blue-600"></span>
          <h4 class="font-bold text-blue-900 text-base">Lộ trình rèn luyện được cá nhân hóa:</h4>
        </div>
        <p class="leading-relaxed mb-4">
          Đối với mục tiêu <strong>Săn Học bổng Khuyến khích Học tập</strong>, bạn cần duy trì điểm rèn luyện từ 80-90 điểm trở lên. Ưu tiên hàng đầu là tích lũy <strong>ít nhất 02 chứng nhận A1 (Học thuật & NCKH)</strong> và bổ sung thêm <strong>A2</strong> để tối đa hóa điểm Tiêu chí 1 và 2.
        </p>

        <div class="mb-4">
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Chứng nhận bạn nên ưu tiên thu thập:</span>
          <div class="flex gap-2">
            <span class="px-3 py-1 font-bold text-xs rounded-lg badge-a1">Chứng nhận A1</span>
            <span class="px-3 py-1 font-bold text-xs rounded-lg badge-a2">Chứng nhận A2</span>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Gợi ý hoạt động sắp diễn ra phù hợp:</span>
          <div class="space-y-2">
            <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <span class="font-medium text-xs text-slate-900 truncate">Hội thảo: Phương pháp Viết Báo Cáo Nghiên cứu Khoa học Sinh viên 2026</span>
              <button onclick="openEventModal('ev-01')" class="px-3 py-1 bg-blue-800 text-white rounded-lg text-xs font-bold hover:bg-blue-900 shrink-0">
                Xem & Đăng ký
              </button>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <span class="font-medium text-xs text-slate-900 truncate">Cuộc thi Hùng biện Tiếng Anh English Challenge 2026</span>
              <button onclick="openEventModal('ev-03')" class="px-3 py-1 bg-blue-800 text-white rounded-lg text-xs font-bold hover:bg-blue-900 shrink-0">
                Xem & Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
`;

// Generate Original Survey Images Grid HTML
const originalImagesHtml = `<!-- Mode 2: Original Extracted Images from Group 109 Word Document -->
        <div id="survey-originals-container" class="hidden grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 1: Biểu đồ tỷ lệ bỏ lỡ sự kiện (Trích trang 2 đề án)</span>
            <img src="./assets/chart-missed-events.png" alt="Biểu đồ bỏ lỡ sự kiện" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">71,5% sinh viên từng bỏ lỡ sự kiện vì thiếu thông tin kịp thời</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 2: Biểu đồ khó khăn lớn nhất của SV ULIS (Trích trang 3 đề án)</span>
            <img src="./assets/chart-difficulties.png" alt="Biểu đồ khó khăn" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Top 1: Không biết CLB phù hợp (65,7%), Xung đột lịch (62,9%)</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 3: Biểu đồ kênh tiếp cận thông tin chính (Trích trang 3 đề án)</span>
            <img src="./assets/chart-channels.png" alt="Biểu đồ kênh tiếp cận" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Gần 90% nhận tin qua kênh không chính thức; thông báo chính thức chỉ 10,5%</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 4: Nhận thức về lịch tuyển thành viên CLB (Trích trang 3 đề án)</span>
            <img src="./assets/chart-recruitment-schedule.png" alt="Lịch tuyển quân" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">64,8% sinh viên chưa nắm rõ lịch tuyển quân của các CLB</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 5: Mức độ hiểu về chứng nhận ngoại khóa A1, A2, A3 (Trích trang 4)</span>
            <img src="./assets/chart-cert-understanding.png" alt="Mức độ hiểu A1 A2 A3" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">24,8% sinh viên mơ hồ hoặc không hiểu quy định chứng nhận ngoại khóa</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 6: Mức độ sẵn sàng sử dụng nền tảng ULIS Vibe (Trích trang 4 đề án)</span>
            <img src="./assets/chart-readiness.png" alt="Biểu đồ sẵn sàng sử dụng" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">65,7% sinh viên có thể trở thành người dùng tiềm năng</p>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center col-span-full">
            <span class="text-xs font-bold text-slate-700 block mb-2">Ảnh 7: Mức độ cần thiết của các tính năng nền tảng (Trích trang 4 đề án)</span>
            <img src="./assets/chart-feature-necessity.png" alt="Mức độ cần thiết các tính năng" class="max-w-2xl w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Đa số đánh giá cao nhu cầu tra cứu chứng nhận, cập nhật lịch và gợi ý hoạt động</p>
          </div>

        </div>`;

// Read template and update
let html = fs.readFileSync('index.html', 'utf8');

// Update cert recommender result placeholder
if (html.includes('<div id="cert-calc-result"></div>')) {
  html = html.replace('<div id="cert-calc-result"></div>', `<div id="cert-calc-result">${certRecommenderInitHtml}</div>`);
}

// Update survey originals if needed
const surveyRegex = /<!-- Mode 2: Original Extracted Images from Group 109 Word Document -->[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
if (surveyRegex.test(html)) {
  html = html.replace(surveyRegex, originalImagesHtml + '\n      </div>\n    </section>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Updated index.html with complete pre-rendered static content and charts!");
