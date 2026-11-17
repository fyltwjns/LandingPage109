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

// 1. Generate Event Cards HTML (Full rich details: 16:9 clean banner + detailed tags & metadata below)
const eventsHtml = D.events.map(ev => {
  const certBadgeClass = ev.certType === "A1" ? "badge-a1" : ev.certType === "A2" ? "badge-a2" : "badge-a3";
  let typeBadgeClass = "bg-slate-100 text-slate-800 border border-slate-200";
  if (ev.type === "recruitment") {
    typeBadgeClass = "bg-purple-100 text-purple-950 border border-purple-200";
  }
  const dateFormatted = formatDateVietnamese(ev.date);
  return `
      <div data-event-id="${ev.id}" data-category="${ev.category}" data-cert="${ev.certType}" data-month="${ev.date.substring(0,7)}" class="event-card-item group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md interactive-card flex flex-col justify-between overflow-hidden relative">
        <!-- Event Banner Thumbnail (16:9 clean poster without overlapping overlay tags) -->
        <div class="event-banner-container aspect-video cursor-pointer" onclick="openEventModal('${ev.id}')">
          <img src="./assets/events/${ev.id}.webp" alt="${ev.title}" class="event-banner-img" loading="lazy" onerror="this.onerror=null; this.src='./assets/events/${ev.id}.png';" />
          <button onclick="event.stopPropagation(); toggleSaveEvent('${ev.id}')" title="Lưu sự kiện" aria-label="Lưu sự kiện" class="btn-save-${ev.id} absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition shadow-xs">
            <i data-lucide="bookmark" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Chi tiết phân loại chứng nhận & loại sự kiện (gọn gàng trên 1 dòng, không bị xuống dòng) -->
            <div class="flex items-center justify-between gap-1.5 mb-3 flex-nowrap overflow-hidden text-nowrap">
              <div class="flex items-center gap-1.5 shrink-0 overflow-hidden">
                <span class="px-2 py-0.5 text-xs font-bold rounded-md whitespace-nowrap shrink-0 ${certBadgeClass}">
                  ${ev.certType} • ${ev.certType === "A1" ? "Học thuật" : ev.certType === "A2" ? "Kỹ năng" : "Tình nguyện"}
                </span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${typeBadgeClass}">
                  ${ev.typeName}
                </span>
              </div>
              <span class="text-[11px] font-semibold text-slate-600 shrink-0 flex items-center gap-1 tabular-nums bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap" title="Số lượng suất tham gia còn lại">
                <i data-lucide="users" class="w-3.5 h-3.5 text-blue-700"></i> Còn ${ev.spotsLeft}/${ev.totalSpots}
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-900 cursor-pointer" onclick="openEventModal('${ev.id}')">
              ${ev.title}
            </h3>

            <div class="space-y-1.5 text-xs text-slate-700 mb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="building" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i>
                <span class="truncate font-medium text-slate-800">${ev.organizer}</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i>
                <span class="font-semibold text-blue-950 tabular-nums">${dateFormatted} • ${ev.time} (${ev.format})</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
                <span class="truncate text-slate-700">${ev.location}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-700 shrink-0"></i>
                <span>Hạn đăng ký: <strong class="text-slate-900 font-semibold tabular-nums">${formatDateVietnamese(ev.registrationDeadline.split(' ')[0])} (${ev.registrationDeadline.split(' ')[1] || ''})</strong></span>
              </div>
            </div>

            <!-- Quyền lợi chứng nhận nổi bật -->
            <div class="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl mb-3 text-[11px] text-blue-950 flex items-start gap-1.5">
              <i data-lucide="award" class="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5"></i>
              <span class="line-clamp-1 font-medium">${ev.benefits[0]}</span>
            </div>

            <p class="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              ${ev.description}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <span class="text-[11px] font-semibold ${ev.status === 'closing_soon' ? 'text-amber-800' : 'text-emerald-800'} flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${ev.status === 'closing_soon' ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}"></span>
              ${ev.status === 'closing_soon' ? 'Sắp hết hạn' : 'Đang mở đơn'}
            </span>
            <div class="flex items-center gap-2">
              <button onclick="openEventModal('${ev.id}')" class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition">
                Chi tiết
              </button>
              <a href="${ev.formUrl || '#'}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm">
                Đăng ký <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
  `;
}).join("\n");

// 2. Generate Club Cards HTML (Clean, semantic text, no gray on color)
const clubsHtml = D.clubs.map(club => {
  const badgeColor = club.category === "academic" ? "bg-blue-100 text-blue-900 border-blue-200" :
                     club.category === "talents" ? "bg-amber-100 text-amber-950 border-amber-200" :
                     "bg-emerald-100 text-emerald-950 border-emerald-200";

  return `
      <div data-club-id="${club.id}" data-category="${club.category}" class="club-card-item bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg interactive-card flex flex-col justify-between overflow-hidden transition-all duration-300">
        <div class="p-6">
          <div class="flex items-start justify-between gap-3 mb-3">
            <span class="px-2.5 py-1 text-xs font-bold rounded-lg border ${badgeColor}">
              ${club.categoryName}
            </span>
            <span class="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              ${club.acronym}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-1 hover:text-blue-900 cursor-pointer" onclick="openClubModal('${club.id}')">
            ${club.name}
          </h3>
          <p class="text-xs text-blue-900 font-medium italic mb-3">"${club.slogan}"</p>

          <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            ${club.description}
          </p>

          <div class="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="activity" class="w-3.5 h-3.5 text-blue-700"></i> Hoạt động chính:
              </span>
              <p class="text-slate-600 line-clamp-2 pl-5 text-[11px]">
                ${club.activities[0]} • ${club.activities[1]}
              </p>
            </div>

            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-700"></i> Đối tượng phù hợp:
              </span>
              <p class="text-slate-600 line-clamp-2 pl-5 text-[11px]">
                ${club.targetAudience}
              </p>
            </div>

            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-700"></i> Lịch tuyển quân:
              </span>
              <p class="text-amber-950 pl-5 text-[11px] font-semibold">
                ${club.recruitmentPeriod}
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <a href="${club.facebook}" target="_blank" rel="noopener noreferrer" class="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition" title="Fanpage Facebook">
              <i data-lucide="facebook" class="w-4 h-4"></i>
            </a>
            <a href="mailto:${club.email}" class="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition" title="Gửi Email">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openClubModal('${club.id}')" class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-white rounded-lg transition">
              Chi tiết CLB
            </button>
            <a href="${club.formLink}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs">
              Ứng tuyển <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </a>
          </div>
        </div>
      </div>
  `;
}).join("\n");

// 3. Generate Cert Hub default content (A1)
const certA1 = D.certGuidelines[0];
const certA1Html = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span class="px-3 py-1 text-xs font-bold rounded-lg badge-a1 inline-block mb-2">
            Mã chuẩn: ${certA1.code} • ${certA1.category}
          </span>
          <h3 class="text-2xl font-extrabold text-slate-900">${certA1.name}</h3>
          <p class="text-sm text-slate-600 mt-1 max-w-2xl">${certA1.summary}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 text-right shrink-0">
          <span class="text-xs text-blue-900 font-bold block uppercase tracking-wider">Khung điểm rèn luyện</span>
          <span class="text-xl font-extrabold text-blue-950 tabular-nums">${certA1.pointRange}</span>
          <span class="text-[11px] text-blue-800 block mt-0.5">${certA1.applicableCriteria}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="check-square" class="w-4 h-4 text-emerald-700"></i> Điều kiện & Tiêu chí đạt chứng nhận
            </h4>
            <div class="space-y-2.5">
              ${certA1.criteria.map(crit => `
                <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"></i>
                  <span>${crit}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <span class="font-bold flex items-center gap-1.5 text-amber-950">
              <i data-lucide="info" class="w-4 h-4 text-amber-700"></i> Quy định minh chứng & Lưu ý:
            </span>
            <p><strong>Hình thức minh chứng:</strong> ${certA1.evidenceForm}</p>
            <p><strong>Lưu ý đặc biệt:</strong> ${certA1.notes}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-blue-700"></i> Ví dụ sự kiện đạt chứng nhận A1 tại ULIS
            </h4>
            <div class="grid grid-cols-1 gap-2.5">
              ${certA1.examples.map(ex => `
                <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-sm font-medium text-blue-950 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-700"></span>
                  <span>${ex}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="p-6 bg-blue-950 rounded-2xl text-white shadow-md">
            <h5 class="text-base font-bold mb-1 text-white">Muốn tìm sự kiện cấp chứng nhận A1?</h5>
            <p class="text-xs text-blue-200 mb-4 leading-relaxed">
              Event Hub đã tổng hợp sẵn các sự kiện cấp A1 trong tháng 11, 12/2026 và tháng 01/2027.
            </p>
            <button onclick="filterEventsByCert('A1')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-2 transition">
              Xem sự kiện A1 trên Event Hub <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
`;

// Pre-render Cert Recommender Initial Box (Clean tinted colors, no gray on color)
const certRecommenderInitHtml = `
      <div class="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-950">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-3 h-3 rounded-full bg-blue-700"></span>
          <h4 class="font-bold text-blue-950 text-base">Lộ trình rèn luyện được cá nhân hóa:</h4>
        </div>
        <p class="leading-relaxed mb-4 text-blue-900">
          Đối với mục tiêu <strong>Săn Học bổng Khuyến khích Học tập</strong>, bạn cần duy trì điểm rèn luyện từ 80-90 điểm trở lên. Ưu tiên hàng đầu là tích lũy <strong>ít nhất 02 chứng nhận A1 (Học thuật & NCKH)</strong> và bổ sung thêm <strong>A2</strong> để tối đa hóa điểm Tiêu chí 1 và 2.
        </p>

        <div class="mb-4">
          <span class="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">Chứng nhận bạn nên ưu tiên thu thập:</span>
          <div class="flex gap-2">
            <span class="px-3 py-1 font-bold text-xs rounded-lg badge-a1">Chứng nhận A1</span>
            <span class="px-3 py-1 font-bold text-xs rounded-lg badge-a2">Chứng nhận A2</span>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">Gợi ý hoạt động sắp diễn ra phù hợp:</span>
          <div class="space-y-2">
            <div class="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between gap-3">
              <span class="font-medium text-xs text-slate-900 truncate">Hội thảo: Phương pháp Viết Báo Cáo Nghiên cứu Khoa học Sinh viên 2026</span>
              <button onclick="openEventModal('ev-01')" class="px-3 py-1 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 shrink-0">
                Xem & Đăng ký
              </button>
            </div>
            <div class="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between gap-3">
              <span class="font-medium text-xs text-slate-900 truncate">Cuộc thi Hùng biện Tiếng Anh English Challenge 2026</span>
              <button onclick="openEventModal('ev-03')" class="px-3 py-1 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 shrink-0">
                Xem & Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
`;

// 4. Generate FAQ HTML
const faqHtml = D.faqs.map((faq, index) => `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
      <button onclick="toggleFaq(${index})" class="w-full px-6 py-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
        <span class="text-sm sm:text-base flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center shrink-0">?</span>
          ${faq.q}
        </span>
        <i id="faq-icon-${index}" data-lucide="chevron-down" class="w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0"></i>
      </button>
      <div id="faq-answer-${index}" class="hidden px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
        ${faq.a}
      </div>
    </div>
`).join("\n");

// 5. Generate Roadmap HTML
const getRoadmapBadgeClass = (status) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-950';
  if (status === 'in_progress') return 'bg-blue-100 text-blue-950';
  return 'bg-slate-100 text-slate-800';
};

const roadmapHtml = D.roadmap.map(item => `
      <div class="relative pl-8 pb-6 border-l-2 ${item.status === 'completed' ? 'border-emerald-600' : item.status === 'in_progress' ? 'border-blue-700' : 'border-slate-200'} last:border-transparent">
        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${item.status === 'completed' ? 'bg-emerald-600 ring-4 ring-emerald-100' : item.status === 'in_progress' ? 'bg-blue-700 ring-4 ring-blue-100 animate-pulse' : 'bg-slate-300'}"></div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span class="text-xs font-bold text-blue-900 tabular-nums">Bước ${item.step}: ${item.time}</span>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded ${getRoadmapBadgeClass(item.status)}">
              ${item.status === 'completed' ? 'Đã hoàn thành' : item.status === 'in_progress' ? 'Đang triển khai' : 'Dự kiến'}
            </span>
          </div>
          <h4 class="text-sm font-bold text-slate-900">${item.title}</h4>
          <p class="text-xs text-slate-600 mt-1">Đơn vị tham gia: ${item.participants}</p>
        </div>
      </div>
`).join("\n");

// 5b. Generate Roadmap Table HTML (Table 3 from Word Document)
const roadmapTableHtml = D.roadmap.map(item => `
      <tr class="hover:bg-blue-50/30 transition even:bg-slate-50/50">
        <td class="py-2.5 px-3 text-xs font-bold text-slate-500 text-center tabular-nums border-r border-slate-100">${item.step}</td>
        <td class="py-2.5 px-3 text-xs font-bold text-slate-900 border-r border-slate-100">${item.title}</td>
        <td class="py-2.5 px-3 text-xs font-semibold text-blue-950 whitespace-nowrap tabular-nums border-r border-slate-100">${item.time}</td>
        <td class="py-2.5 px-3 text-xs text-slate-600 border-r border-slate-100">${item.participants}</td>
        <td class="py-2.5 px-3 text-xs text-center whitespace-nowrap">
          <span class="px-2 py-0.5 text-[10px] font-bold rounded ${getRoadmapBadgeClass(item.status)}">
            ${item.status === 'completed' ? 'Đã hoàn thành' : item.status === 'in_progress' ? 'Đang triển khai' : 'Dự kiến'}
          </span>
        </td>
      </tr>
`).join("\n");

// 6. Generate Media Plan HTML (Table 4 from Word Document)
const mediaHtml = D.mediaPlan.map(post => `
      <tr class="hover:bg-blue-50/40 transition even:bg-slate-50/50">
        <td class="py-3 px-3.5 text-xs font-bold text-slate-500 text-center tabular-nums border-r border-slate-100">${post.stt}</td>
        <td class="py-3 px-3.5 text-xs font-bold text-blue-950 whitespace-nowrap tabular-nums border-r border-slate-100">
          <span class="inline-flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-800 shrink-0"></i>${post.publishTime}</span>
        </td>
        <td class="py-3 px-3.5 text-xs font-bold text-slate-900 border-r border-slate-100">${post.postTitle}</td>
        <td class="py-3 px-3.5 text-xs text-slate-600 leading-relaxed">${post.content}</td>
        <td class="py-3 px-3.5 text-xs text-center whitespace-nowrap">
          <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] inline-block">${post.responsible}</span>
        </td>
      </tr>
`).join("\n");

// 7. Generate Team HTML Cards
const teamHtml = D.teamMembers.map(member => `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-left flex flex-col justify-between ${member.isLeader ? 'ring-2 ring-blue-800' : ''}">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded tabular-nums">
              MSV: ${member.msv}
            </span>
            ${member.isLeader ? '<span class="px-2 py-0.5 bg-amber-500 text-amber-950 font-black text-[10px] rounded-full uppercase">Nhóm trưởng</span>' : ''}
          </div>
          <h4 class="text-base font-bold text-slate-900 mb-0.5">${member.name}</h4>
          <p class="text-xs text-slate-600 font-medium mb-3">${member.faculty || 'ĐH Ngoại ngữ - ĐHQGHN'}</p>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4">
            <span class="font-bold text-slate-900 block text-[11px] uppercase mb-0.5">Nhiệm vụ chính:</span>
            ${member.role}
          </div>
        </div>
        <div class="space-y-1 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
          <div class="flex items-center gap-1.5 truncate">
            <i data-lucide="phone" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i> <span class="tabular-nums">${member.phone}</span>
          </div>
          <div class="flex items-center gap-1.5 truncate">
            <i data-lucide="mail" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i> ${member.email}
          </div>
        </div>
      </div>
`).join("\n");

// 7b. Generate Team Table HTML (Official Member Assignment Table)
const teamTableHtml = D.teamMembers.map(member => `
      <tr class="hover:bg-blue-50/30 transition even:bg-slate-50/50 ${member.isLeader ? 'bg-blue-50/40' : ''}">
        <td class="py-3 px-3.5 text-xs font-bold text-slate-500 text-center tabular-nums border-r border-slate-100">${member.stt}</td>
        <td class="py-3 px-3.5 text-xs font-bold text-slate-900 border-r border-slate-100">
          <div class="flex items-center gap-2">
            <span>${member.name}</span>
            ${member.isLeader ? '<span class="px-2 py-0.5 bg-amber-500 text-amber-950 font-black text-[9px] rounded-full uppercase tracking-wider">Trưởng nhóm</span>' : ''}
          </div>
        </td>
        <td class="py-3 px-3.5 text-xs font-extrabold text-blue-900 tabular-nums border-r border-slate-100 text-center">${member.msv}</td>
        <td class="py-3 px-3.5 text-xs text-slate-700 border-r border-slate-100">${member.faculty || 'ĐH Ngoại ngữ - ĐHQGHN'}</td>
        <td class="py-3 px-3.5 text-xs text-slate-800 font-medium border-r border-slate-100">${member.role}</td>
        <td class="py-3 px-3.5 text-xs text-slate-600 border-r border-slate-100 text-center font-bold tabular-nums">${member.isLeader ? '100% (Chủ trì)' : '100%'}</td>
        <td class="py-3 px-3.5 text-xs text-slate-600">
          <div class="flex flex-col gap-0.5">
            <span class="tabular-nums font-semibold text-slate-800">${member.phone}</span>
            <span class="text-[10px] text-blue-700">${member.email}</span>
          </div>
        </td>
      </tr>
`).join("\n");

// 8. Generate Original Survey Images Grid HTML
const originalImagesHtml = `<!-- Mode 2: Original Extracted Images from Group 109 Word Document -->
        <div id="survey-originals-container" class="hidden grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 1: Biểu đồ tỷ lệ bỏ lỡ sự kiện (Trích trang 2 đề án)</span>
            <img src="./assets/chart-missed-events.png" alt="Biểu đồ bỏ lỡ sự kiện" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">71,5% sinh viên từng bỏ lỡ sự kiện vì thiếu thông tin kịp thời</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 2: Biểu đồ khó khăn lớn nhất của SV ULIS (Trích trang 3 đề án)</span>
            <img src="./assets/chart-difficulties.png" alt="Biểu đồ khó khăn" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">Top 1: Không biết CLB phù hợp (65,7%), Xung đột lịch (62,9%)</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 3: Biểu đồ kênh tiếp cận thông tin chính (Trích trang 3 đề án)</span>
            <img src="./assets/chart-channels.png" alt="Biểu đồ kênh tiếp cận" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">Gần 90% nhận tin qua kênh không chính thức; thông báo chính thức chỉ 10,5%</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 4: Nhận thức về lịch tuyển thành viên CLB (Trích trang 3 đề án)</span>
            <img src="./assets/chart-recruitment-schedule.png" alt="Lịch tuyển quân" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">64,8% sinh viên chưa nắm rõ lịch tuyển quân của các CLB</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 5: Mức độ hiểu về chứng nhận ngoại khóa A1, A2, A3 (Trích trang 4)</span>
            <img src="./assets/chart-cert-understanding.png" alt="Mức độ hiểu A1 A2 A3" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">24,8% sinh viên mơ hồ hoặc không hiểu quy định chứng nhận ngoại khóa</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 6: Mức độ sẵn sàng sử dụng nền tảng ULIS Vibe (Trích trang 4 đề án)</span>
            <img src="./assets/chart-readiness.png" alt="Biểu đồ sẵn sàng sử dụng" class="w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">65,7% sinh viên có thể trở thành người dùng tiềm năng</p>
          </div>

          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center col-span-full">
            <span class="text-xs font-bold text-slate-800 block mb-2">Ảnh 7: Mức độ cần thiết của các tính năng nền tảng (Trích trang 4 đề án)</span>
            <img src="./assets/chart-feature-necessity.png" alt="Mức độ cần thiết các tính năng" class="max-w-2xl w-full h-auto rounded-xl shadow-xs mx-auto" />
            <p class="text-[11px] text-slate-600 mt-2 font-medium">Đa số đánh giá cao nhu cầu tra cứu chứng nhận, cập nhật lịch và gợi ý hoạt động</p>
          </div>

        </div>`;

console.log("Built pristine HTML chunks.");

// Now assemble the immaculate index.html
const templateHtml = `<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ULIS Vibe - Cổng Thông Tin Sự Kiện, CLB & Tra Cứu Chứng Nhận Ngoại Khóa | Nhóm 109</title>
  
  <meta name="description" content="ULIS Vibe - Nền tảng kết nối toàn diện về lịch sự kiện, đợt tuyển thành viên CLB và tra cứu chứng nhận A1, A2, A3 dành riêng cho sinh viên Trường Đại học Ngoại ngữ - ĐHQGHN." />
  <meta name="author" content="Nhóm 109 - Lớp FLF1007 - ULIS VNU" />
  <link rel="icon" type="image/png" href="./assets/ulis-logo.png" />

  <!-- Google Fonts: Be Vietnam Pro (authentic Vietnamese typographic voice) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ulis: {
              DEFAULT: '#002B7F',
              navy: '#002B7F',
              dark: '#001E5B',
              light: '#1E4ED8',
              50: '#EFF6FF',
              100: '#DBEAFE',
              200: '#BFDBFE',
              800: '#002B7F',
              900: '#001E5B',
            },
            gold: {
              DEFAULT: '#D97706',
              dark: '#B45309',
              light: '#FEF3C7',
            }
          },
          fontFamily: {
            sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Chart.js & Highcharts 3D -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="./js/vendor/highcharts.js"></script>
  <script src="./js/vendor/highcharts-3d.js"></script>

  <!-- Custom Styles -->
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-[#002B7F] selection:text-white">

  <!-- ==================================================== -->
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
      <div class="pt-3 border-t border-slate-100 space-y-2">
        <button onclick="openLoginModal()" class="w-full py-2.5 bg-[#0B2341] text-white rounded-xl text-center text-xs font-bold block">
          Đăng nhập bằng tài khoản VNU Mail (@vnu.edu.vn)
        </button>
        <a href="#feedback-section" class="mobile-nav-link w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl text-center text-xs font-semibold block">
          Góp ý ẩn danh cho đề án
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- ==================================================== -->
    <!-- KHU VỰC 1: ĐẦU TRANG (HERO SECTION) -->
    <!-- ==================================================== -->
    <section id="hero" class="relative pt-12 pb-14 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">

          <!-- Main Heading (Solid Color, No AI Gradient Text) -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-blue-950 tracking-tight leading-tight mb-6">
            Không còn bỏ lỡ sự kiện & cơ hội với ULIS Vibe
          </h1>

          <!-- Value Proposition / Subtitle -->
          <p class="text-base sm:text-xl text-slate-700 font-normal leading-relaxed mb-10 max-w-3xl mx-auto">
            Nền tảng tập trung duy nhất đồng bộ hóa <strong>Lịch sự kiện toàn trường</strong>, <strong>Hệ thống tuyển quân Câu lạc bộ</strong> và <strong>Tra cứu chuẩn hóa chứng nhận A1, A2, A3</strong> dành riêng cho sinh viên Đại học Ngoại ngữ - ĐHQGHN.
          </p>

          <!-- 3 Core Navigation CTA Buttons (Yêu cầu Khu vực 1 của File Word) -->
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="#event-hub" class="px-6 py-3.5 bg-blue-950 hover:bg-blue-900 text-white rounded-2xl text-sm font-bold flex items-center gap-2.5 transition shadow-sm hover:-translate-y-0.5">
              <i data-lucide="calendar" class="w-5 h-5 text-amber-400"></i>
              <span>Khám phá Event Hub</span>
              <i data-lucide="chevron-right" class="w-4 h-4 opacity-70"></i>
            </a>

            <a href="#club-directory" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition shadow-2xs hover:shadow-xs hover:-translate-y-0.5">
              <i data-lucide="users" class="w-5 h-5 text-emerald-700"></i>
              <span>Duyệt Club Directory</span>
              <span class="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-950 rounded font-bold">3 Nhóm</span>
            </a>

            <a href="#cert-hub" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition shadow-2xs hover:shadow-xs hover:-translate-y-0.5">
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
    </section>

    <!-- ==================================================== -->
    <!-- SECTION INTRO: VIDEO GIỚI THIỆU ĐỀ ÁN (1080P 60FPS) -->
    <!-- ==================================================== -->
    <section id="video-intro" class="py-8 sm:py-12 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <!-- Background subtle decorative ambient glow -->
      <div class="absolute inset-0 pointer-events-none opacity-40">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-100/50 via-sky-50/30 to-transparent blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Video Showcase Frame (Pure 16:9 Motion Display) -->
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
    </section>

    <!-- ==================================================== -->
    <!-- KHU VỰC 2: EVENT HUB (TÍNH NĂNG CỐT LÕI 1) -->
    <!-- ==================================================== -->
    <section id="event-hub" class="py-20 bg-slate-50 scroll-mt-16">
      <div id="events" class="scroll-mt-20"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
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
        </div>

        <!-- Filter & Search Controls Bar -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <!-- Search -->
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input type="text" id="search-event-input" placeholder="Tìm tên sự kiện, CLB, địa điểm..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 transition" />
            </div>

            <!-- Month Filter -->
            <div>
              <select id="filter-event-month" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition">
                <option value="all">Tất cả thời gian</option>
                <option value="2026-11">Tháng 11/2026 (Hiện tại)</option>
                <option value="2026-12">Tháng 12/2026 (Kỳ thi & Cuối năm)</option>
                <option value="2027-01">Tháng 01/2027 (Kỳ mới & Ra mắt)</option>
              </select>
            </div>

            <!-- Cert Type Filter -->
            <div>
              <select id="filter-event-cert" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition">
                <option value="all">Tất cả chứng nhận (A1, A2, A3)</option>
                <option value="A1">Chứng nhận A1: Học thuật & NCKH</option>
                <option value="A2">Chứng nhận A2: Kỹ năng & Ngoại khóa</option>
                <option value="A3">Chứng nhận A3: Tình nguyện & Xã hội</option>
              </select>
            </div>

            <!-- Club Category Filter -->
            <div>
              <select id="filter-event-category" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition">
                <option value="all">Tất cả nhóm CLB</option>
                <option value="academic">Nhóm CLB Học thuật</option>
                <option value="talents">Nhóm Sở thích & Năng khiếu</option>
                <option value="volunteering">Nhóm Kỹ năng & Tình nguyện</option>
              </select>
            </div>

          </div>

          <!-- Quick Filter Pills & View Toggles -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div class="flex flex-wrap items-center gap-2">
              <span id="events-count-badge" class="px-3 py-1 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold tabular-nums">
                12 sự kiện & đợt tuyển
              </span>
              <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
                <span class="text-slate-500">Lọc nhanh:</span>
                <button data-type="cert" data-value="A1" class="quick-filter-event quick-filter-btn">A1 Học thuật</button>
                <button data-type="cert" data-value="A2" class="quick-filter-event quick-filter-btn">A2 Kỹ năng</button>
                <button data-type="cert" data-value="A3" class="quick-filter-event quick-filter-btn">A3 Tình nguyện</button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 mr-1 hidden sm:inline">Chế độ xem:</span>
              <div class="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button id="btn-view-cards" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900 text-white transition flex items-center gap-1.5">
                  <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i> Thẻ (Cards)
                </button>
                <button id="btn-view-calendar" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 transition flex items-center gap-1.5">
                  <i data-lucide="calendar-days" class="w-3.5 h-3.5"></i> Lịch tháng
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Events Grid / Calendar Container -->
        <div id="events-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${eventsHtml}
        </div>

      </div>
    </section>

    <!-- ==================================================== -->
    <!-- KHU VỰC 3: CLUB DIRECTORY (TÍNH NĂNG CỐT LÕI 2) -->
    <!-- ==================================================== -->
    <section id="club-directory" class="py-20 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
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
        </div>

        <!-- Category Tabs & Search Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          <div class="flex flex-nowrap items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button data-category="all" class="club-group-tab tab-active px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition">
              Tất cả (17)
            </button>
            <button data-category="academic" class="club-group-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 whitespace-nowrap shrink-0 transition flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-blue-700"></span> Học thuật (6)
            </button>
            <button data-category="talents" class="club-group-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 whitespace-nowrap shrink-0 transition flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-600"></span> Năng khiếu & Thể thao (6)
            </button>
            <button data-category="volunteering" class="club-group-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 whitespace-nowrap shrink-0 transition flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-700"></span> Tình nguyện & Kỹ năng (5)
            </button>
          </div>

          <div class="relative w-full sm:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="search-club-input" placeholder="Tìm theo tên CLB, kỹ năng..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 transition" />
          </div>

        </div>

        <div class="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span id="clubs-count-badge" class="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg tabular-nums">17 Câu lạc bộ & Đội nhóm</span>
          <span>Bấm "Chi tiết CLB" để xem toàn bộ lịch trình sinh hoạt</span>
        </div>

        <!-- Clubs Grid Container -->
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
    </section>

    <!-- ==================================================== -->
    <!-- KHU VỰC 4: CERT HUB (TÍNH NĂNG CỐT LÕI 3) -->
    <!-- ==================================================== -->
    <section id="cert-hub" class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cert Hub – Bảng Tra Cứu Chuẩn Hóa Chứng Nhận A1, A2, A3
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Giải mã quy chế điểm rèn luyện và chuẩn đầu ra ngoại khóa tại ULIS. Nắm rõ tiêu chí đạt được của từng loại giấy chứng nhận, tránh mất điểm đáng tiếc trong các kỳ xét học bổng hay danh hiệu Sinh viên 5 Tốt.
          </p>
        </div>

        <!-- Navigation Tabs: A1, A2, A3, So Sánh -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button data-cert="A1" class="cert-tab-btn tab-active px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-2xs">
            <i data-lucide="book-open" class="w-4 h-4"></i> Chứng nhận A1 (Học thuật & NCKH)
          </button>
          <button data-cert="A2" class="cert-tab-btn px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs">
            <i data-lucide="compass" class="w-4 h-4"></i> Chứng nhận A2 (Kỹ năng & Hội nhập)
          </button>
          <button data-cert="A3" class="cert-tab-btn px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs">
            <i data-lucide="hand-heart" class="w-4 h-4"></i> Chứng nhận A3 (Tình nguyện & Xã hội)
          </button>
          <button data-cert="compare" class="cert-tab-btn px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs">
            <i data-lucide="table" class="w-4 h-4"></i> Bảng So Sánh Tổng Hợp
          </button>
        </div>

        <!-- Cert Details Output Container -->
        <div id="cert-details-container" class="mb-12">
${certA1Html}
        </div>

        <!-- Interactive Cert Recommender / Calculator Tool -->
        <div class="bg-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div class="max-w-3xl">
            <h3 class="text-2xl sm:text-3xl font-black mb-3 text-white">Công cụ Gợi Ý Lộ Trình Chứng Nhận Thông Minh</h3>
            <p class="text-sm text-blue-200 leading-relaxed mb-6">
              Bạn chưa rõ mình cần tích lũy loại chứng nhận nào trong học kỳ này? Hãy chọn mục tiêu của bạn, ULIS Vibe sẽ đề xuất chính xác số lượng chứng chỉ cần đạt và gợi ý sự kiện phù hợp.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="quiz-goal" class="block text-xs font-bold text-blue-200 uppercase mb-2">Mục tiêu chính của bạn trong học kỳ này:</label>
                <select id="quiz-goal" class="w-full px-4 py-3 bg-blue-900 border border-blue-800 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="scholarship">Săn Học bổng Khuyến khích Học tập (Điểm RL >= 85)</option>
                  <option value="sv5t">Đạt danh hiệu "Sinh viên 5 Tốt" các cấp</option>
                  <option value="skills">Nâng cao kỹ năng xin việc & làm việc đa quốc gia</option>
                  <option value="friends">Giao lưu bạn bè, thể thao, văn nghệ giải tỏa căng thẳng</option>
                </select>
              </div>

              <div>
                <label for="quiz-year" class="block text-xs font-bold text-blue-200 uppercase mb-2">Bạn đang là sinh viên năm mấy:</label>
                <select id="quiz-year" class="w-full px-4 py-3 bg-blue-900 border border-blue-800 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="k60">Sinh viên Năm 1 (Khóa QH2026 / K60)</option>
                  <option value="k59">Sinh viên Năm 2 (Khóa QH2025 / K59)</option>
                  <option value="k58">Sinh viên Năm 3 (Khóa QH2024 / K58)</option>
                  <option value="k57">Sinh viên Năm 4 (Khóa QH2023 / K57)</option>
                </select>
              </div>
            </div>

            <button id="btn-calc-cert" class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl text-sm flex items-center gap-2 transition shadow-md">
              <i data-lucide="zap" class="w-4 h-4"></i> Phân tích & Gợi ý ngay
            </button>

            <!-- Quiz Result Output -->
            <div id="cert-calc-result">
${certRecommenderInitHtml}
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ==================================================== -->
    <!-- KHU VỰC 5: CÂU HỎI THƯỜNG GẶP & GÓP Ý ẨN DANH -->
    <!-- ==================================================== -->
    <section id="faq-feedback" class="py-20 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Cột trái: Câu hỏi thường gặp (FAQ) -->
          <div class="lg:col-span-6 space-y-6">
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Câu Hỏi Thường Gặp Về CLB & Hoạt Động Ngoại Khóa
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 mt-2">
                Các băn khoăn phổ biến nhất của sinh viên ULIS về cách đăng ký, bảo lưu và quy đổi chứng nhận.
              </p>
            </div>

            <div id="faq-accordion-container" class="space-y-3">
${faqHtml}
            </div>
          </div>

          <!-- Cột phải: Biểu mẫu góp ý ẩn danh (Feedback Form) -->
          <div id="feedback-section" class="lg:col-span-6">
            <div class="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-bold">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-700"></i> 100% Ẩn danh
                </span>
                <span class="text-[11px] text-slate-500 font-medium">Không lưu thông tin cá nhân</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Biểu Mẫu Góp Ý & Đóng Góp Ý Kiến</h3>
              <p class="text-xs text-slate-600 mb-6 leading-relaxed">
                Đúng theo yêu cầu đề xuất của Nhóm 109, hệ thống không yêu cầu đăng nhập và không thu thập địa chỉ email của bạn. Mọi đánh giá đều nhằm hoàn thiện phiên bản thử nghiệm tháng 12/2026.
              </p>

              <form id="anonymous-feedback-form" class="space-y-4">
                <div>
                  <label for="feedback-role" class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Bạn là ai?</label>
                  <select id="feedback-role" class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900">
                    <option value="Sinh viên năm 1">Sinh viên Năm 1 (K60)</option>
                    <option value="Sinh viên năm 2">Sinh viên Năm 2 (K59)</option>
                    <option value="Sinh viên năm 3">Sinh viên Năm 3 (K58)</option>
                    <option value="Sinh viên năm 4">Sinh viên Năm 4 (K57)</option>
                    <option value="Ban Chủ nhiệm CLB">Ban Chủ nhiệm Câu lạc bộ / Đội nhóm</option>
                    <option value="Giảng viên / Cán bộ">Giảng viên / Cán bộ quản lý</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Mức độ hữu ích của nền tảng ULIS Vibe:</label>
                  <div class="flex items-center gap-2">
                    <input type="hidden" id="feedback-rating-val" value="5" />
                    <button type="button" data-star="1" class="star-rating-btn p-1.5 text-amber-500 hover:scale-110 transition">
                      <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button type="button" data-star="2" class="star-rating-btn p-1.5 text-amber-500 hover:scale-110 transition">
                      <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button type="button" data-star="3" class="star-rating-btn p-1.5 text-amber-500 hover:scale-110 transition">
                      <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button type="button" data-star="4" class="star-rating-btn p-1.5 text-amber-500 hover:scale-110 transition">
                      <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button type="button" data-star="5" class="star-rating-btn p-1.5 text-amber-500 hover:scale-110 transition">
                      <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                    </button>
                    <span class="text-xs font-semibold text-slate-600 ml-2">(Bấm để chọn sao)</span>
                  </div>
                </div>

                <div>
                  <label for="feedback-feature" class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Tính năng bạn thấy giá trị nhất:</label>
                  <select id="feedback-feature" class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900">
                    <option value="Event Hub (Lịch sự kiện & tuyển quân)">Event Hub (Lịch sự kiện & tuyển quân toàn trường)</option>
                    <option value="Club Directory (Phân loại 3 nhóm CLB)">Club Directory (Danh bạ phân loại 3 nhóm CLB)</option>
                    <option value="Cert Hub (Bảng chuẩn hóa A1, A2, A3)">Cert Hub (Bảng chuẩn hóa & lọc theo A1, A2, A3)</option>
                    <option value="QR Check-in thông minh">Tính năng Điểm danh QR Check-in thông minh</option>
                  </select>
                </div>

                <div>
                  <label for="feedback-comment" class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Ý kiến đóng góp & đề xuất cải tiến:</label>
                  <textarea id="feedback-comment" rows="3" placeholder="Chia sẻ cảm nhận của bạn về giao diện, tính năng hoặc đề xuất bổ sung thêm CLB/sự kiện..." class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"></textarea>
                </div>

                <button type="submit" class="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm">
                  <i data-lucide="send" class="w-4 h-4 text-amber-400"></i> Gửi góp ý ẩn danh cho Nhóm 109
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ==================================================== -->
    <!-- KẾ HOẠCH TRIỂN KHAI, TRUYỀN THÔNG & NHÓM THỰC HIỆN 109 -->
    <!-- ==================================================== -->
    <section id="team-plan" class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kế Hoạch Dự Án & Đội Ngũ Nhóm 109
          </h2>
          <p class="text-sm text-slate-600 mt-2">
            Đề xuất ý tưởng dự án ULIS Vibe • Bộ môn Công nghệ thông tin & Truyền thông • Học kỳ I: Năm học 2026-2027
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <!-- Cột 1: Kế hoạch triển khai (15 bước - Bảng 3 Đề án) -->
          <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="milestone" class="w-5 h-5 text-blue-800"></i> Kế hoạch triển khai (15 Bước)
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded-full uppercase">Bảng 3 Đề Án</span>
              </div>
              <p class="text-xs text-slate-600 mb-4">Tiến độ chi tiết từ tháng 10/2026 đến tháng 02/2027</p>

              <!-- Roadmap View Mode Switcher -->
              <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
                <button type="button" id="btn-view-roadmap-timeline" class="flex-1 py-1.5 px-2.5 rounded-lg bg-white text-blue-950 shadow-2xs font-bold transition flex items-center justify-center gap-1.5">
                  <i data-lucide="git-commit" class="w-3.5 h-3.5"></i> Tiến trình
                </button>
                <button type="button" id="btn-view-roadmap-table" class="flex-1 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5">
                  <i data-lucide="table" class="w-3.5 h-3.5"></i> Bảng 15 bước
                </button>
              </div>

              <!-- View 1: Timeline -->
              <div id="roadmap-timeline-view" class="space-y-1 max-h-[500px] overflow-y-auto pr-2">
${roadmapHtml}
              </div>

              <!-- View 2: Table (Bảng 3 chi tiết) -->
              <div id="roadmap-table-view" class="hidden overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-slate-200">
                <table class="w-full text-left border-collapse text-xs">
                  <thead class="sticky top-0 z-10 bg-blue-950 text-white font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th class="py-2.5 px-2 text-center w-10">STT</th>
                      <th class="py-2.5 px-3">Nội dung công việc</th>
                      <th class="py-2.5 px-2.5 whitespace-nowrap">Thời gian</th>
                      <th class="py-2.5 px-2.5">Đơn vị tham gia</th>
                      <th class="py-2.5 px-2 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
${roadmapTableHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Cột 2: Kế hoạch truyền thông 7 bài đăng Fanpage & Dự toán kinh phí -->
          <div class="lg:col-span-7 space-y-8">
            
            <!-- Bảng Kế hoạch truyền thông (Bảng 4 File Word) -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="megaphone" class="w-5 h-5 text-amber-600"></i> Kế hoạch truyền thông (7 Bài đăng Fanpage)
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-950 rounded-full uppercase">Bảng 4 Đề Án</span>
              </div>
              <p class="text-xs text-slate-600 mb-4">Đăng tải định kỳ lúc 20h00 trên Fanpage ULIS & cộng đồng sinh viên</p>

              <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-blue-950 text-white font-bold text-[11px] uppercase tracking-wider">
                      <th class="py-3 px-3 text-center w-12 border-r border-blue-900/60">STT</th>
                      <th class="py-3 px-3 w-32 border-r border-blue-900/60 whitespace-nowrap">Thời gian</th>
                      <th class="py-3 px-3 w-52 border-r border-blue-900/60">Tên bài đăng</th>
                      <th class="py-3 px-3 border-r border-blue-900/60">Nội dung tóm tắt</th>
                      <th class="py-3 px-3 text-center w-24 whitespace-nowrap">Phụ trách</th>
                    </tr>
                  </thead>
                  <tbody id="media-plan-container" class="divide-y divide-slate-100">
${mediaHtml}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <!-- Bảng Dự toán kinh phí chi tiết (Bảng 5 File Word) -->
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
                      <i data-lucide="wallet" class="w-4 h-4 text-emerald-700"></i> Dự toán kinh phí tài trợ
                    </h4>
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-950 rounded-full uppercase">Bảng 5 Đề Án</span>
                  </div>
                  <p class="text-xs text-slate-600 mb-3">Đề xuất hỗ trợ từ ULIS: <strong class="text-slate-900 tabular-nums">800.000 đ</strong></p>

                  <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs mb-3">
                    <table class="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr class="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                          <th class="py-2 px-2 text-center w-8">STT</th>
                          <th class="py-2 px-2">Hạng mục chi</th>
                          <th class="py-2 px-2 text-center w-14">Đơn vị</th>
                          <th class="py-2 px-2 text-right w-18">Đơn giá</th>
                          <th class="py-2 px-2 text-right w-18">Tổng</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr class="hover:bg-slate-50 transition">
                          <td class="py-2 px-2 text-center font-bold text-slate-500 tabular-nums">1</td>
                          <td class="py-2 px-2 text-slate-800 font-medium">In poster A2 kèm QR dán sảnh SV</td>
                          <td class="py-2 px-2 text-center text-slate-600 tabular-nums">5 tờ</td>
                          <td class="py-2 px-2 text-right text-slate-600 tabular-nums">30.000</td>
                          <td class="py-2 px-2 text-right font-bold text-slate-900 tabular-nums">150.000</td>
                        </tr>
                        <tr class="hover:bg-slate-50 transition even:bg-slate-50/50">
                          <td class="py-2 px-2 text-center font-bold text-slate-500 tabular-nums">2</td>
                          <td class="py-2 px-2 text-slate-800 font-medium">Standee giới thiệu & QR check-in</td>
                          <td class="py-2 px-2 text-center text-slate-600 tabular-nums">1 cái</td>
                          <td class="py-2 px-2 text-right text-slate-600 tabular-nums">100.000</td>
                          <td class="py-2 px-2 text-right font-bold text-slate-900 tabular-nums">100.000</td>
                        </tr>
                        <tr class="hover:bg-slate-50 transition">
                          <td class="py-2 px-2 text-center font-bold text-slate-500 tabular-nums">3</td>
                          <td class="py-2 px-2 text-slate-800 font-medium">Quà tặng SV thử nghiệm & góp ý</td>
                          <td class="py-2 px-2 text-center text-slate-600 tabular-nums">20 phần</td>
                          <td class="py-2 px-2 text-right text-slate-600 tabular-nums">25.000</td>
                          <td class="py-2 px-2 text-right font-bold text-slate-900 tabular-nums">500.000</td>
                        </tr>
                        <tr class="hover:bg-slate-50 transition even:bg-slate-50/50">
                          <td class="py-2 px-2 text-center font-bold text-slate-500 tabular-nums">4</td>
                          <td class="py-2 px-2 text-slate-800 font-medium">Chi phí dự phòng phát sinh</td>
                          <td class="py-2 px-2 text-center text-slate-600 tabular-nums">~5%</td>
                          <td class="py-2 px-2 text-right text-slate-600 tabular-nums">50.000</td>
                          <td class="py-2 px-2 text-right font-bold text-slate-900 tabular-nums">50.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-200 flex justify-between items-center text-xs sm:text-sm font-extrabold text-blue-950">
                  <span>TỔNG KINH PHÍ ĐỀ XUẤT:</span>
                  <span class="text-base sm:text-lg text-emerald-700 font-black tabular-nums">800.000 đ</span>
                </div>
              </div>

              <!-- Chữ ký người lập đề xuất từ file Word gốc -->
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between text-center">
                <div>
                  <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Người lập đề xuất</span>
                  <p class="text-xs text-slate-600 mt-0.5 tabular-nums">Hà Nội, ngày 20/11/2026</p>
                  <p class="text-xs font-semibold text-slate-700 italic mt-1">(Nhóm trưởng đại diện ký)</p>
                  
                  <div class="my-2 flex items-center justify-center">
                    <img src="./assets/leader-signature.jpg" alt="Chữ ký Đoàn Thị Phương Thảo" class="h-20 object-contain mx-auto mix-blend-multiply" />
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-100">
                  <h5 class="text-sm font-extrabold text-slate-900">Đoàn Thị Phương Thảo</h5>
                  <p class="text-xs text-blue-900 font-medium">Nhóm trưởng Nhóm 109 • Lớp FLF1007</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        <!-- BẢNG PHÂN CÔNG NHIỆM VỤ THÀNH VIÊN VÀ DANH SÁCH THẺ (NHÓM 109) -->
        <div>
          <div class="text-center max-w-2xl mx-auto mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-2">
              <i data-lucide="users" class="w-3.5 h-3.5"></i> Đội Ngũ Thực Hiện Đề Án
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Thành Viên & Phân Công Nhiệm Vụ (Nhóm 109)</h3>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Danh sách phân công nhiệm vụ chi tiết và thông tin liên lạc của 7 thành viên lớp FLF1007</p>
          </div>

          <!-- Bảng Phân Công Nhiệm Vụ Thành Viên (Official Matrix Table) -->
          <div class="mb-10 overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white p-2">
            <table class="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr class="bg-blue-950 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th class="py-3.5 px-3 text-center w-12 border-r border-blue-900/60 whitespace-nowrap">STT</th>
                  <th class="py-3.5 px-3.5 w-44 border-r border-blue-900/60 whitespace-nowrap">Họ và tên</th>
                  <th class="py-3.5 px-3 w-28 border-r border-blue-900/60 text-center whitespace-nowrap">Mã SV</th>
                  <th class="py-3.5 px-3.5 w-48 border-r border-blue-900/60 whitespace-nowrap">Khoa / Ngành</th>
                  <th class="py-3.5 px-4 min-w-[240px] border-r border-blue-900/60">Nhiệm vụ chính trong đề án</th>
                  <th class="py-3.5 px-3 w-28 border-r border-blue-900/60 text-center whitespace-nowrap">Đóng góp</th>
                  <th class="py-3.5 px-4 min-w-[200px] whitespace-nowrap">Liên hệ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
${teamTableHtml}
              </tbody>
            </table>
          </div>

          <!-- Dạng Thẻ Chi Tiết Từng Thành Viên -->
          <div id="team-members-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
${teamHtml}
          </div>
        </div>

      </div>
    </section>
  </main>

  <!-- ==================================================== -->
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
  </footer>

  <!-- ==================================================== -->
  <!-- MODAL CHUNG (EVENT & CLUB DETAIL & FEEDBACK POPUP) -->
  <!-- ==================================================== -->
  <div id="app-modal" class="fixed inset-0 z-50 hidden items-start justify-center p-3 sm:p-6 py-6 sm:py-10 overflow-y-auto modal-backdrop animate-fade-in" onclick="if (event.target === this) closeModal()">
    <div id="modal-content" class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 animate-fade-in my-auto relative overflow-hidden mb-12 sm:mb-16">
    </div>
  </div>

  <!-- ==================================================== -->
  <!-- TOAST NOTIFICATION -->
  <!-- ==================================================== -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm">
    <div id="toast-icon">
      <i data-lucide="info" class="w-5 h-5 text-blue-400"></i>
    </div>
    <span id="toast-message" class="font-medium">Thông báo từ ULIS Vibe</span>
  </div>

  <!-- Scripts -->
  <script src="./js/data.js"></script>
  <script src="./js/app.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', templateHtml, 'utf8');
console.log("Successfully rebuilt index.html to Impeccable standard!");
