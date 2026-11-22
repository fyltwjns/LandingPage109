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

// 1. Generate Event Cards HTML (Minimalism Gradient Editorial Design)
const eventsHtml = D.events.map(ev => {
  const certDot = ev.certType === "A1" ? "bg-blue-600" : ev.certType === "A2" ? "bg-amber-600" : "bg-emerald-600";
  const dateFormatted = formatDateVietnamese(ev.date);
  return `
      <div data-event-id="${ev.id}" data-category="${ev.category}" data-cert="${ev.certType}" data-month="${ev.date.substring(0,7)}" class="event-card-item group bg-white rounded-2xl border border-slate-200/85 shadow-2xs hover:shadow-md hover:border-slate-300 interactive-card flex flex-col justify-between overflow-hidden relative">
        <!-- Event Banner Thumbnail (16:9 clean poster) -->
        <div class="event-banner-container aspect-video cursor-pointer" onclick="openEventModal('${ev.id}')">
          <img src="./assets/events/${ev.id}.webp" alt="${ev.title}" class="event-banner-img group-hover:scale-102 transition-transform duration-300" loading="lazy" onerror="this.onerror=null; this.src='./assets/events/${ev.id}.png';" />
          <button onclick="event.stopPropagation(); toggleSaveEvent('${ev.id}')" title="Lưu sự kiện" aria-label="Lưu sự kiện" class="btn-save-${ev.id} absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition shadow-xs">
            <i data-lucide="bookmark" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Chi tiết phân loại chứng nhận & loại sự kiện -->
            <div class="flex items-center justify-between gap-1.5 mb-3 flex-nowrap overflow-hidden text-nowrap">
              <div class="flex items-center gap-1.5 shrink-0 overflow-hidden">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full ${certDot}"></span>
                  <span>${ev.certType} • ${ev.certType === "A1" ? "Học thuật" : ev.certType === "A2" ? "Kỹ năng" : "Tình nguyện"}</span>
                </span>
                <span class="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200/70 shrink-0">
                  ${ev.typeName}
                </span>
              </div>
              <span class="text-[11px] font-semibold text-slate-600 shrink-0 flex items-center gap-1 tabular-nums bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md" title="Số lượng suất tham gia còn lại">
                <i data-lucide="users" class="w-3.5 h-3.5 text-slate-500"></i> Còn ${ev.spotsLeft}/${ev.totalSpots}
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-900 transition cursor-pointer" onclick="openEventModal('${ev.id}')">
              ${ev.title}
            </h3>

            <div class="space-y-1.5 text-xs text-slate-600 mb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="building" class="w-3.5 h-3.5 text-slate-500 shrink-0"></i>
                <span class="truncate font-medium text-slate-700">${ev.organizer}</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i>
                <span class="font-semibold text-slate-800 tabular-nums">${dateFormatted} • ${ev.time} (${ev.format})</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500 shrink-0"></i>
                <span class="truncate text-slate-600">${ev.location}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-500">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500 shrink-0"></i>
                <span>Hạn đăng ký: <strong class="text-slate-800 font-semibold tabular-nums">${formatDateVietnamese(ev.registrationDeadline.split(' ')[0])} (${ev.registrationDeadline.split(' ')[1] || ''})</strong></span>
              </div>
            </div>

            <!-- Quyền lợi chứng nhận nổi bật -->
            <div class="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-3 text-[11px] text-slate-700 flex items-start gap-1.5">
              <i data-lucide="award" class="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5"></i>
              <span class="line-clamp-1 font-medium">${ev.benefits[0]}</span>
            </div>

            <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
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
              <a href="${ev.formUrl || '#'}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-[#0B2341] hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs">
                Đăng ký <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
  `;
}).join("\n");

// 2. Generate Club Cards HTML (Minimalism Gradient Editorial Design)
const clubsHtml = D.clubs.map(club => {
  const catDot = club.category === "academic" ? "bg-blue-600" :
                 club.category === "talents" ? "bg-amber-600" : "bg-emerald-600";

  return `
      <div data-club-id="${club.id}" data-category="${club.category}" class="club-card-item group bg-white rounded-2xl border border-slate-200/85 shadow-2xs hover:shadow-md hover:border-slate-300 interactive-card flex flex-col justify-between overflow-hidden transition-all duration-300">
        <!-- Club Banner Thumbnail (16:9 clean poster) -->
        <div class="event-banner-container aspect-video cursor-pointer relative overflow-hidden bg-slate-950" onclick="openClubModal('${club.id}')">
          <img src="./assets/clubs/${club.id}.webp" alt="${club.name}" class="event-banner-img group-hover:scale-102 transition-transform duration-300" loading="lazy" onerror="this.onerror=null; this.src='./assets/clubs/${club.id}.png';" />
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full ${catDot}"></span>
              ${club.categoryName}
            </span>
          </div>
          <span class="absolute top-2.5 right-2.5 text-[11px] font-bold text-slate-700 bg-white/95 backdrop-blur-md border border-slate-200/80 px-2 py-0.5 rounded shadow-xs">
            ${club.acronym}
          </span>
        </div>

        <div class="p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1 hover:text-blue-900 cursor-pointer transition line-clamp-1" onclick="openClubModal('${club.id}')">
              ${club.name}
            </h3>
            <p class="text-xs text-blue-900 font-medium italic mb-3">"${club.slogan}"</p>

            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
              ${club.description}
            </p>

            <div class="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div>
                <span class="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <i data-lucide="activity" class="w-3.5 h-3.5 text-blue-700"></i> Hoạt động chính:
                </span>
                <p class="text-slate-500 line-clamp-2 pl-5 text-[11px]">
                  ${club.activities[0]} • ${club.activities[1]}
                </p>
              </div>

              <div>
                <span class="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-700"></i> Đối tượng phù hợp:
                </span>
                <p class="text-slate-500 line-clamp-2 pl-5 text-[11px]">
                  ${club.targetAudience}
                </p>
              </div>

              <div>
                <span class="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-700"></i> Lịch tuyển quân:
                </span>
                <p class="text-slate-700 pl-5 text-[11px] font-semibold">
                  ${club.recruitmentPeriod}
                </p>
              </div>
            </div>
          </div>

          <div class="px-0 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <a href="${club.facebook}" target="_blank" rel="noopener noreferrer" class="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition" title="Fanpage Facebook">
                <i data-lucide="facebook" class="w-4 h-4"></i>
              </a>
              <a href="mailto:${club.email}" class="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition" title="Gửi Email">
                <i data-lucide="mail" class="w-4 h-4"></i>
              </a>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="openClubModal('${club.id}')" class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                Chi tiết CLB
              </button>
              <a href="${club.formLink}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-[#0B2341] hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs">
                Ứng tuyển <i data-lucide="arrow-right" class="w-3 h-3"></i>
              </a>
            </div>
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
const glowCtaHtml = fs.readFileSync('./components/u211-glow-cta.html', 'utf8');

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
  <!-- MAIN NAVIGATION BAR (Sticky Frosted Nav) -->
  <!-- ==================================================== -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-20 gap-2 lg:gap-3">
        
        <!-- Logo & Brand (Chuẩn cổng sự kiện) — shrink-0 đảm bảo không bị squeeze -->
        <a href="#hero" class="flex items-center gap-2 group shrink-0">
          <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 object-contain group-hover:scale-105 transition-transform" />
          <div class="flex items-center gap-1.5">
            <span class="text-lg lg:text-xl xl:text-2xl font-black tracking-tight text-[#0B2341] group-hover:text-blue-900 transition">ULIS VIBE</span>
            <!-- Badge ẩn ở lg để tiết kiệm không gian ngang -->
            <span class="hidden xl:inline px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 rounded-md uppercase tracking-wider">CỔNG SỰ KIỆN</span>
          </div>
        </a>

        <!-- Desktop Navigation Links — flex-1 chiếm hết phần giữa, justify-center -->
        <nav class="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1 font-semibold text-xs xl:text-sm text-slate-600 whitespace-nowrap overflow-hidden">
          <a href="#hero" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">Trang chủ</a>
          <a href="#event-hub" class="px-2 xl:px-2.5 py-1.5 rounded-xl text-slate-950 font-bold hover:bg-slate-100/80 transition whitespace-nowrap">Sự kiện</a>
          <a href="#club-directory" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">CLB</a>
          <a href="#leaderboard" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">Vinh danh</a>
          <a href="#cert-hub" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">Cert Hub</a>
          <a href="#news" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">Tin tức</a>
          <a href="#gallery" class="px-2 xl:px-2.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-slate-100/80 transition whitespace-nowrap">Khoảnh khắc</a>
        </nav>

        <!-- Right Action Buttons — shrink-0, ml-auto khi không có nav (mobile sm) -->
        <div class="hidden sm:flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <!-- Saved Events Button -->
          <button id="btn-view-saved" class="relative p-2 rounded-lg border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition shrink-0 cursor-pointer" title="Sự kiện đã lưu">
            <i data-lucide="bookmark" class="w-4 h-4"></i>
            <span id="saved-events-badge" class="hidden absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-amber-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">0</span>
          </button>

          <!-- VNU Mail SSO Login Button — shrink-0 + min-w-max = không bao giờ clip -->
          <button onclick="openLoginModal()" class="px-3.5 py-2 bg-[#0B2341] hover:bg-[#071b30] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 min-w-max cursor-pointer">
            <i data-lucide="user" class="w-3.5 h-3.5 text-blue-300 shrink-0"></i>
            <span>Đăng nhập VNU Mail</span>
          </button>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="lg:hidden flex items-center gap-2">
          <button id="mobile-menu-btn" class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition" aria-label="Toggle Menu">
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
      <a href="#hero" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Trang chủ</a>
      <a href="#event-hub" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-bold text-blue-950 bg-blue-50">Sự kiện & Tuyển quân (Event Hub)</a>
      <a href="#club-directory" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Danh bạ 50+ CLB ULIS (3 Nhóm)</a>
      <a href="#leaderboard" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100">Bảng vàng Top sinh viên tích cực</a>
      <a href="#cert-hub" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Tra cứu Cert Hub (A1, A2, A3 Chuẩn Hóa)</a>
      <a href="#news" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Tin tức & Thông báo Đoàn - Hội</a>
      <a href="#gallery" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Khoảnh khắc sinh viên ULIS</a>
      <a href="#team-plan" class="mobile-nav-link block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Kế hoạch & Nhóm thực hiện 109</a>
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
    <!-- KHU VỰC 1: ĐẦU TRANG (HERO SECTION MINIMALISM GRADIENT) -->
    <!-- ==================================================== -->
    <section id="hero" class="relative pt-16 pb-20 overflow-hidden bg-minimal-mesh">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-4xl mx-auto">

          <!-- Academic Status Eyebrow Badge -->
          <div class="inline-flex items-center gap-2 text-slate-500 text-xs font-medium mb-6 tracking-wide">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ĐHQGHN • Trường Đại học Ngoại ngữ • Cổng Ngoại Khóa Số</span>
            <span class="text-slate-300">|</span>
            <span class="text-[#0B2341] font-bold">Học kỳ I 2026-2027</span>
          </div>

          <!-- Main Heading with Minimalism Gradient Text -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B2341] tracking-tighter leading-[1.08] mb-6">
            Không còn bỏ lỡ sự kiện & cơ hội với <span class="minimal-gradient-text">ULIS Vibe</span>
          </h1>

          <!-- Value Proposition / Subtitle -->
          <p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Nền tảng tập trung duy nhất đồng bộ hóa <strong>Lịch sự kiện toàn trường</strong>, <strong>Hệ thống tuyển quân 50+ CLB</strong> và <strong>Tra cứu chuẩn hóa chứng nhận A1, A2, A3</strong> dành riêng cho sinh viên Đại học Ngoại ngữ - ĐHQGHN.
          </p>

          <!-- Realtime Stat Bar — plain divider metrics, no floating chips -->
          <div class="flex items-center justify-center gap-0 mb-10 text-sm text-slate-500 divide-x divide-slate-200/80">
            <div class="flex items-center gap-2 px-5 first:pl-0">
              <span class="text-2xl font-black text-[#0B2341] tracking-tighter tabular-nums">12</span>
              <span class="text-xs text-slate-500 leading-tight">Sự kiện<br>mở đơn</span>
            </div>
            <div class="flex items-center gap-2 px-5">
              <span class="text-2xl font-black text-[#0B2341] tracking-tighter tabular-nums">50+</span>
              <span class="text-xs text-slate-500 leading-tight">CLB tuyển<br>thành viên</span>
            </div>
            <div class="flex items-center gap-2 px-5">
              <span class="text-2xl font-black text-[#0B2341] tracking-tighter tabular-nums">100%</span>
              <span class="text-xs text-slate-500 leading-tight">Chuẩn Cert<br>A1 · A2 · A3</span>
            </div>
          </div>

          <!-- 3 Core Navigation CTA Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3.5">
            <a href="#event-hub" class="px-6 py-3.5 bg-[#0B2341] hover:bg-[#071b30] text-white rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95">
              <i data-lucide="calendar" class="w-4 h-4 text-blue-200"></i>
              <span>Khám phá Event Hub</span>
              <i data-lucide="chevron-right" class="w-4 h-4 opacity-70"></i>
            </a>

            <a href="#club-directory" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2.5 transition shadow-sm hover:-translate-y-0.5 active:scale-95">
              <i data-lucide="users" class="w-4 h-4 text-slate-600"></i>
              <span>Duyệt Club Directory</span>
              
            </a>

            <a href="#cert-hub" class="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2.5 transition shadow-sm hover:-translate-y-0.5 active:scale-95">
              <i data-lucide="award" class="w-4 h-4 text-slate-600"></i>
              <span>Tra cứu Cert Hub</span>
              
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================================================== -->
    <!-- QUICK FEATURE ACCESS HUB (MINIMALISM GRADIENT UNIFIED) -->
    <!-- ==================================================== -->
    <section class="py-5 sm:py-7 bg-white border-b border-slate-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <a href="#event-hub" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors duration-200">
              <i data-lucide="calendar" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Sự kiện & Workshop</span>
            <span class="text-[11px] text-slate-500 mt-0.5">12 sự kiện mở đơn</span>
          </a>

          <a href="#club-directory" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-700 group-hover:text-white transition-colors duration-200">
              <i data-lucide="users" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Tổ chức & 50+ CLB</span>
            <span class="text-[11px] text-slate-500 mt-0.5">3 nhóm chuyên môn</span>
          </a>

          <a href="#leaderboard" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors duration-200">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Bảng vàng Vinh danh</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Top SV tích cực</span>
          </a>

          <a href="#cert-hub" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-200">
              <i data-lucide="file-check-2" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Chuẩn Cert A1-A2-A3</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Minh chứng ĐRL</span>
          </a>

          <a href="#news" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center mb-3 group-hover:bg-sky-700 group-hover:text-white transition-colors duration-200">
              <i data-lucide="newspaper" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Tin tức & Phong trào</span>
            <span class="text-[11px] text-slate-500 mt-0.5">Bản tin Đoàn - Hội</span>
          </a>

          <a href="#gallery" class="group p-4 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-none hover:shadow-sm hover:-translate-y-0.5 border-slate-200/60 hover:border-slate-300 flex flex-col items-center text-center">
            <div class="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200">
              <i data-lucide="camera" class="w-5 h-5"></i>
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">Khoảnh khắc ULIS</span>
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
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-100/40 via-sky-50/20 to-transparent blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Video Showcase Frame (Pure 16:9 Motion Display) -->
        <div class="rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto bg-slate-950">
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
    <!-- LEADERBOARD: TOP SINH VIÊN TÍCH CỰC (MINIMALISM GRADIENT EDITORIAL) -->
    <!-- ==================================================== -->
    <section id="leaderboard" class="py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <i data-lucide="trophy" class="w-3.5 h-3.5 text-blue-700"></i> Bảng Vàng & Vinh Danh Sinh Viên
              </span>
              <span class="text-xs text-slate-500 hidden sm:inline">• Cập nhật hàng tuần</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">Top Sinh Viên Tích Cực — Bảng Vàng Hoạt Động & Rèn Luyện
            </h2>
            <p class="text-sm text-slate-600 mt-2 max-w-2xl">
              Vinh danh các gương mặt sinh viên năng nổ tham gia các hoạt động ngoại khóa, hội thảo học thuật và phong trào tình nguyện, tích lũy điểm rèn luyện (ĐRL) xuất sắc nhất Trường Đại học Ngoại ngữ.
            </p>
          </div>

          <!-- Switcher Tabs -->
          <div class="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0 self-start md:self-auto">
            <button id="tab-lb-month" onclick="switchLeaderboardTab('month')" class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#0B2341] text-white transition shadow-xs">
              Theo Tháng 11/2026
            </button>
            <button id="tab-lb-term" onclick="switchLeaderboardTab('term')" class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition">
              Toàn Học Kỳ I (2026-2027)
            </button>
          </div>
        </div>

        <!-- Top 3 Podium Cards (Elite Minimalism Gradient Architecture) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <!-- Hạng 2: Á Quân Bạc (Frosted Architectural Card) -->
          <div class="order-2 md:order-1 podium-rank-2 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden interactive-card">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-black text-slate-400 tracking-widest uppercase">02</span>
              <span class="text-xs text-slate-500 font-medium">Khóa K57</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-base overflow-hidden shrink-0">
                  <span class="bg-slate-800 w-full h-full flex items-center justify-center text-white font-bold text-sm">HN</span>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Trần Hoàng Nam</h3>
                  <p class="text-xs text-slate-500">Khoa NN&VH Nhật Bản</p>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200/80">Cán bộ CLB Năng nổ</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-center mb-4">
                <div>
                  <span class="block text-base font-extrabold text-[#0B2341] tabular-nums">13</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Huy hiệu</span>
                </div>
                <div class="border-x border-slate-200">
                  <span class="block text-base font-extrabold text-emerald-700 tabular-nums">95</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-base font-extrabold text-slate-800 tabular-nums">8</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Đạt chuẩn Cert A1 & A2</span>
              <a href="#event-hub" class="font-semibold text-blue-900 hover:underline">Xem sự kiện →</a>
            </div>
          </div>

          <!-- Hạng 1: Quán Quân (Elite Midnight Sapphire Obsidian Card) -->
          <div class="order-1 md:order-2 podium-rank-1 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between relative overflow-hidden -translate-y-2 interactive-card">
            <div class="flex items-center justify-between mb-5">
              <span class="text-[10px] font-black text-blue-300 tracking-widest uppercase">01 — QUÁN QUÂN</span>
              <span class="text-xs text-blue-300 font-semibold">Khóa K58</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-5">
                <div class="w-16 h-16 rounded-full bg-blue-800 border-2 border-blue-600/60 flex items-center justify-center font-bold text-white text-xl overflow-hidden shrink-0">
                  MC
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <h3 class="font-black text-white text-lg">Nguyễn Minh Châu</h3>
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-400"></i>
                  </div>
                  <p class="text-xs text-blue-200 mt-0.5">Khoa Sư phạm Tiếng Anh</p>
                  <span class="inline-block mt-1 px-2.5 py-0.5 bg-white/10 text-blue-200 text-[10px] font-semibold rounded-md border border-white/15">
                    Đại sứ Ngoại khóa Tháng 11
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3 bg-white/[0.08] backdrop-blur-md rounded-2xl border border-white/15 text-center mb-4">
                <div>
                  <span class="block text-lg font-black text-white tabular-nums">15</span>
                  <span class="text-[10px] text-blue-200 font-semibold uppercase">Huy hiệu</span>
                </div>
                <div class="border-x border-white/10">
                  <span class="block text-lg font-black text-emerald-400 tabular-nums">98</span>
                  <span class="text-[10px] text-blue-200 font-semibold uppercase">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-lg font-black text-amber-300 tabular-nums">9</span>
                  <span class="text-[10px] text-blue-200 font-semibold uppercase">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
              <span>Tích lũy trọn vẹn A1 • A2 • A3</span>
              <button onclick="showToast('Nguyễn Minh Châu đã đạt danh hiệu Sinh viên Xuất sắc Tháng 11!', 'success')" class="font-bold text-white hover:text-blue-300 transition cursor-pointer">Vinh danh →</button>
            </div>
          </div>

          <!-- Hạng 3: Á Quân Đồng (Frosted Architectural Card) -->
          <div class="order-3 podium-rank-3 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden interactive-card">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-black text-slate-400 tracking-widest uppercase">03</span>
              <span class="text-xs text-slate-500 font-medium">Khóa K58</span>
            </div>
            <div>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-base overflow-hidden shrink-0">
                  <span class="bg-slate-700 w-full h-full flex items-center justify-center text-white font-bold text-sm">PT</span>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Lê Phương Thảo</h3>
                  <p class="text-xs text-slate-500">Khoa NN&VH Trung Quốc</p>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200/80">Tình nguyện viên Tiêu biểu</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-center mb-4">
                <div>
                  <span class="block text-base font-extrabold text-[#0B2341] tabular-nums">11</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Huy hiệu</span>
                </div>
                <div class="border-x border-slate-200">
                  <span class="block text-base font-extrabold text-emerald-700 tabular-nums">92</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Điểm RL</span>
                </div>
                <div>
                  <span class="block text-base font-extrabold text-slate-800 tabular-nums">7</span>
                  <span class="text-[10px] text-slate-500 font-medium uppercase">Sự kiện</span>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Đạt chuẩn Cert A2 & A3</span>
              <a href="#event-hub" class="font-semibold text-blue-900 hover:underline">Xem sự kiện →</a>
            </div>
          </div>

        </div>

        <!-- Leaderboard Row 4, 5, 6 & Rèn Luyện Conversion Box -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
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
          <div class="lg:col-span-5 bg-[#0B2341] p-6 rounded-2xl text-white flex flex-col justify-between shadow-sm">
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
                  <span><span class="inline-flex items-center justify-center w-5 h-5 mr-1 rounded bg-blue-900/50 text-blue-200 text-[9px] font-black">A1</span>Chứng nhận A1 (Học thuật & NCKH):</span>
                  <strong class="text-amber-300 font-bold tabular-nums">+5 ĐRL / Sự kiện</strong>
                </div>
                <div class="p-2.5 bg-blue-900/60 rounded-xl border border-blue-800 flex items-center justify-between">
                  <span><span class="inline-flex items-center justify-center w-5 h-5 mr-1 rounded bg-blue-900/50 text-amber-200 text-[9px] font-black">A2</span>Chứng nhận A2 (Kỹ năng & Ngoại khóa):</span>
                  <strong class="text-amber-300 font-bold tabular-nums">+3 ĐRL / Sự kiện</strong>
                </div>
                <div class="p-2.5 bg-blue-900/60 rounded-xl border border-blue-800 flex items-center justify-between">
                  <span><span class="inline-flex items-center justify-center w-5 h-5 mr-1 rounded bg-blue-900/50 text-emerald-200 text-[9px] font-black">A3</span>Chứng nhận A3 (Tình nguyện & Xã hội):</span>
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
    <section id="event-hub" class="py-20 bg-white border-t border-slate-200 scroll-mt-16">
      <div id="events" class="scroll-mt-20"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Sự kiện & Workshop
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">Event Hub – Lịch Sự Kiện & Tuyển Quân Toàn Trường
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Tập trung toàn bộ hội thảo chuyên môn, hoạt động rèn luyện và các đợt mở đơn tuyển thành viên của mọi CLB tại ULIS. Dễ dàng lọc theo loại chứng nhận A1, A2, A3 hoặc nhóm hoạt động.
          </p>
        </div>

        <!-- Event Category Tabs (Mô phỏng youth.is.vnu.edu.vn Tabs) -->
        
    param($m)
    @'
<div class="flex items-center justify-center mb-8">
          <div class="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-0.5 overflow-x-auto no-scrollbar">
            <button onclick="filterEventsByStatus('all')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#0B2341] text-white whitespace-nowrap transition shadow-xs">
              Tất cả
            </button>
            <button onclick="filterEventsByStatus('open')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white whitespace-nowrap transition flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang mở đăng ký
            </button>
            <button onclick="filterEventsByStatus('closing_soon')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white whitespace-nowrap transition flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Sắp diễn ra
            </button>
            <button onclick="filterEventsByCert('A1')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white whitespace-nowrap transition">
              Học thuật A1
            </button>
            <button onclick="filterEventsByCert('A2')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white whitespace-nowrap transition">
              Kỹ năng A2
            </button>
            <button onclick="filterEventsByCert('A3')" class="event-filter-pill px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white whitespace-nowrap transition">
              Tình nguyện A3
            </button>
          </div>
        </div>
'@


        <!-- Filter & Search Controls Bar -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
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
              
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 mr-1 hidden sm:inline">Chế độ xem:</span>
              <div class="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                <button id="btn-view-cards" class="px-3 py-1.5 rounded-md text-xs font-bold bg-[#0B2341] text-white transition flex items-center gap-1.5">
                  <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i> Thẻ (Cards)
                </button>
                <button id="btn-view-calendar" class="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5">
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
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 50+ CLB & Tổ chức
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">
            Club Directory – Danh Bạ Hệ Thống Câu Lạc Bộ ULIS
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Giải quyết triệt để 65,7% băn khoăn "Không biết CLB nào phù hợp". Toàn bộ danh sách CLB được phân loại theo đúng 3 nhóm chuẩn: <strong>Học thuật</strong>, <strong>Sở thích & Năng khiếu</strong>, <strong>Kỹ năng & Tình nguyện</strong>, kèm rõ đối tượng phù hợp và kênh ứng tuyển.
          </p>
        </div>

        <!-- Khối "Tổ chức tích cực" (Top Active Clubs mô phỏng youth.is.vnu) -->
        <div class="mb-10 bg-slate-50/60 p-5 rounded-xl border border-slate-200/70">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-slate-600"></i> Tổ Chức & Câu Lạc Bộ Hoạt Động Tích Cực Nhất
            </h3>
            <span class="text-xs text-slate-500">Được đánh giá dựa trên tần suất tổ chức sự kiện & số thành viên</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between overflow-hidden group">
              <div class="aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer relative" onclick="openClubModal('ec-ulis')">
                <img src="./assets/clubs/ec-ulis.webp" alt="CLB Tiếng Anh" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='./assets/clubs/ec-ulis.png';" />
                <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-white/95 text-slate-800 rounded shadow-xs">HỌC THUẬT</span>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 hover:text-blue-900 cursor-pointer" onclick="openClubModal('ec-ulis')">CLB Tiếng Anh (EC ULIS)</h4>
                  <p class="text-xs text-slate-500 mt-1">240 thành viên • 12 sự kiện</p>
                </div>
                <button onclick="openClubModal('ec-ulis')" class="mt-3 text-xs font-bold text-blue-900 hover:underline text-left flex items-center gap-1 cursor-pointer">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between overflow-hidden group">
              <div class="aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer relative" onclick="openClubModal('japanese-club')">
                <img src="./assets/clubs/japanese-club.webp" alt="CLB Tiếng Nhật" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='./assets/clubs/japanese-club.png';" />
                <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-white/95 text-slate-800 rounded shadow-xs">HỌC THUẬT</span>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 hover:text-blue-900 cursor-pointer" onclick="openClubModal('japanese-club')">CLB Tiếng Nhật Hikari</h4>
                  <p class="text-xs text-slate-500 mt-1">180 thành viên • 9 sự kiện</p>
                </div>
                <button onclick="openClubModal('japanese-club')" class="mt-3 text-xs font-bold text-blue-900 hover:underline text-left flex items-center gap-1 cursor-pointer">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between overflow-hidden group">
              <div class="aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer relative" onclick="openClubModal('volunteer-club')">
                <img src="./assets/clubs/volunteer-club.webp" alt="CLB Hoa Đá" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='./assets/clubs/volunteer-club.png';" />
                <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-white/95 text-slate-800 rounded shadow-xs">TÌNH NGUYỆN</span>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 hover:text-emerald-900 cursor-pointer" onclick="openClubModal('volunteer-club')">CLB Tình Nguyện Hoa Đá</h4>
                  <p class="text-xs text-slate-500 mt-1">310 thành viên • 15 sự kiện</p>
                </div>
                <button onclick="openClubModal('volunteer-club')" class="mt-3 text-xs font-bold text-emerald-900 hover:underline text-left flex items-center gap-1 cursor-pointer">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between overflow-hidden group">
              <div class="aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer relative" onclick="openClubModal('reception-team')">
                <img src="./assets/clubs/reception-team.webp" alt="Đội Lễ Tân URT" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='./assets/clubs/reception-team.png';" />
                <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-white/95 text-slate-800 rounded shadow-xs">KỸ NĂNG</span>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 hover:text-amber-900 cursor-pointer" onclick="openClubModal('reception-team')">Đội Lễ Tân Ngoại Ngữ URT</h4>
                  <p class="text-xs text-slate-500 mt-1">120 thành viên • 14 sự kiện</p>
                </div>
                <button onclick="openClubModal('reception-team')" class="mt-3 text-xs font-bold text-amber-900 hover:underline text-left flex items-center gap-1 cursor-pointer">Xem CLB <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
              </div>
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
              <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-600"></span> Bản tin & Thông báo
              </span>
              <span class="text-xs text-slate-500 hidden sm:inline">• Tin tức chính thức</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">
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
          <article class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-01.webp" alt="Kế hoạch xét cấp chứng nhận A1-A2-A3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-01.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">THÔNG BÁO</span>
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
          <article class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-02.webp" alt="Chiến dịch Sinh viên 5 Tốt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-02.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">PHONG TRÀO</span>
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
          <article class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="aspect-video w-full overflow-hidden bg-slate-900">
                <img src="./assets/news/news-03.webp" alt="Khai mạc Tuần lễ Văn hóa Quốc tế" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/news/news-03.png'" />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">VĂN HÓA</span>
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
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Gallery Sinh viên
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">
            Khoảnh Khắc Sinh Viên ULIS
          </h2>
          <p class="text-sm text-slate-600 mt-2">
            Những dấu ấn thanh xuân rực rỡ qua các hoạt động ngoại khóa, phong trào tình nguyện và ngày hội giao lưu văn hóa quốc tế.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="group relative rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/80">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-01.webp" alt="ULIS International Day" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-01.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Văn hóa Quốc tế</span>
              <h4 class="text-sm font-bold text-white leading-snug">ULIS International Day</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Sân A1-A2 • 1.200 sinh viên tham gia</p>
            </div>
          </div>

          <div class="group relative rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/80">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-02.webp" alt="Chung Kết Hùng Biện Tiếng Anh" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-02.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Học thuật & Tranh biện</span>
              <h4 class="text-sm font-bold text-white leading-snug">Chung Kết Hùng Biện Tiếng Anh</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Hội trường Sunwah • Tranh tài 8 đội</p>
            </div>
          </div>

          <div class="group relative rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/80">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img src="./assets/gallery/gal-03.webp" alt="Mùa Hè Xanh Ba Vì" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='./assets/gallery/gal-03.png'" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span class="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Tình nguyện Xã hội</span>
              <h4 class="text-sm font-bold text-white leading-snug">Chiến Dịch Mùa Hè Xanh</h4>
              <p class="text-[11px] text-slate-300 mt-0.5">Huyện Ba Vì • Đội Tình nguyện ULIS</p>
            </div>
          </div>

          <div class="group relative rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/80">
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
          <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">
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
        <div class="bg-blue-950 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
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

        <!-- ==================================================== -->
        <!-- BỘ TÍNH ĐIỂM RÈN LUYỆN (ĐRL) TƯƠNG TÁC THỜI GIAN THỰC -->
        <!-- ==================================================== -->
        <div id="drl-simulator-card" class="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <i data-lucide="calculator" class="w-3.5 h-3.5 text-emerald-700"></i> Tính năng Độc quyền Đề án 109
                </span>
                <span class="text-xs text-slate-500 hidden sm:inline">• Chuẩn Quy chế ĐHQGHN</span>
              </div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">
                Bộ Mô Phỏng & Dự Phóng Điểm Rèn Luyện (ĐRL) Học Kỳ
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Tự điều chỉnh số lượng chứng nhận A1, A2, A3 bạn dự định tham gia để xem tổng điểm ĐRL dự kiến, xếp loại rèn luyện và khả năng đạt Học bổng Khuyến khích Học tập.
              </p>
            </div>
            <button onclick="calculateDrlScore()" class="px-4 py-2.5 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-400"></i> Tính toán lại
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <!-- Cột trái: 4 Sliders/Inputs -->
            <div class="lg:col-span-7 space-y-5">
              
              <!-- Input 1: Điểm nền -->
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div class="flex items-center justify-between mb-2">
                  <label for="drl-calc-base" class="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Điểm nền rèn luyện & Ý thức học tập
                  </label>
                  <span class="text-xs font-extrabold text-[#0B2341] tabular-nums" id="drl-base-val">70 điểm</span>
                </div>
                <input type="range" id="drl-calc-base" min="50" max="85" value="70" step="1" oninput="document.getElementById('drl-base-val').textContent = this.value + ' điểm'; calculateDrlScore();" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-950" />
                <div class="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>50đ (Cơ bản)</span>
                  <span>70đ (Trung bình ULIS)</span>
                  <span>85đ (Ý thức tốt)</span>
                </div>
              </div>

              <!-- Input 2: Cert A1 -->
              <div class="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80">
                <div class="flex items-center justify-between mb-2">
                  <label for="drl-calc-a1" class="text-xs font-bold text-blue-950 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-700"></span> Số sự kiện Cert A1 (Học thuật & NCKH)
                    <span class="px-2 py-0.5 rounded bg-blue-200 text-blue-950 text-[10px] font-bold">+5đ / sự kiện</span>
                  </label>
                  <span class="text-xs font-extrabold text-blue-950 tabular-nums" id="drl-a1-val">2 sự kiện (+10đ)</span>
                </div>
                <input type="range" id="drl-calc-a1" min="0" max="5" value="2" step="1" oninput="document.getElementById('drl-a1-val').textContent = this.value + ' sự kiện (+' + (this.value*5) + 'đ)'; calculateDrlScore();" class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-950" />
              </div>

              <!-- Input 3: Cert A2 -->
              <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
                <div class="flex items-center justify-between mb-2">
                  <label for="drl-calc-a2" class="text-xs font-bold text-amber-950 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Số sự kiện Cert A2 (Kỹ năng & Ngoại khóa)
                    <span class="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">+3đ / sự kiện</span>
                  </label>
                  <span class="text-xs font-extrabold text-amber-950 tabular-nums" id="drl-a2-val">2 sự kiện (+6đ)</span>
                </div>
                <input type="range" id="drl-calc-a2" min="0" max="5" value="2" step="1" oninput="document.getElementById('drl-a2-val').textContent = this.value + ' sự kiện (+' + (this.value*3) + 'đ)'; calculateDrlScore();" class="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600" />
              </div>

              <!-- Input 4: Cert A3 -->
              <div class="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                <div class="flex items-center justify-between mb-2">
                  <label for="drl-calc-a3" class="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Số sự kiện Cert A3 (Tình nguyện & Xã hội)
                    <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px] font-bold">+4đ / sự kiện</span>
                  </label>
                  <span class="text-xs font-extrabold text-emerald-950 tabular-nums" id="drl-a3-val">1 sự kiện (+4đ)</span>
                </div>
                <input type="range" id="drl-calc-a3" min="0" max="5" value="1" step="1" oninput="document.getElementById('drl-a3-val').textContent = this.value + ' sự kiện (+' + (this.value*4) + 'đ)'; calculateDrlScore();" class="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              </div>

            </div>

            <!-- Cột phải: Live Result Card -->
            <div class="lg:col-span-5 bg-gradient-to-br from-[#0B2341] via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <span class="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-2">Kết quả mô phỏng dự kiến</span>
                <div class="flex items-baseline gap-2 mb-3">
                  <span id="drl-calc-total" class="text-5xl font-black text-amber-400 tabular-nums">90</span>
                  <span class="text-base text-blue-200 font-bold">/ 100 ĐRL</span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-blue-900/80 rounded-full h-3 mb-4 overflow-hidden border border-blue-800">
                  <div id="drl-calc-bar" class="bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-300" style="width: 90%;"></div>
                </div>

                <div class="flex items-center justify-between mb-4 pb-4 border-b border-blue-800/80">
                  <span class="text-xs text-blue-200 font-medium">Xếp loại rèn luyện:</span>
                  <div id="drl-calc-rank">
                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs">Xuất Sắc</span>
                  </div>
                </div>

                <div id="drl-calc-scholarship" class="p-3 bg-blue-900/60 rounded-xl border border-blue-800 text-xs">
                  <span class="text-emerald-300 font-bold flex items-center gap-1.5">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i> Đủ điều kiện xét Học bổng KKHT & Vinh danh Top ĐHQGHN
                  </span>
                </div>
              </div>

              <div class="pt-5 mt-4 border-t border-blue-900 flex items-center justify-between text-xs">
                <span class="text-blue-300">Cần tư vấn sâu theo khóa?</span>
                <button onclick="toggleChatbot()" class="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                  Hỏi Chatbot AI <i data-lucide="bot" class="w-3.5 h-3.5"></i>
                </button>
              </div>
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
              <h2 class="text-2xl sm:text-3xl font-black text-[#0B2341] tracking-tighter">
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
            <div class="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-sm relative">
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
          <h2 class="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tighter">
            Kế Hoạch Dự Án & Đội Ngũ Nhóm 109
          </h2>
          <p class="text-sm text-slate-600 mt-2">
            Đề xuất ý tưởng dự án ULIS Vibe • Bộ môn Công nghệ thông tin & Truyền thông • Học kỳ I: Năm học 2026-2027
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <!-- Cột 1: Kế hoạch triển khai (15 bước - Bảng 3 Đề án) -->
          <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="milestone" class="w-5 h-5 text-blue-800"></i> Kế hoạch triển khai (15 Bước)
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded uppercase">Bảng 3</span>
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
            <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="megaphone" class="w-5 h-5 text-amber-600"></i> Kế hoạch truyền thông (7 Bài đăng Fanpage)
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded uppercase">Bảng 4</span>
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
              <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
                      <i data-lucide="wallet" class="w-4 h-4 text-emerald-700"></i> Dự toán kinh phí tài trợ
                    </h4>
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded uppercase">Bảng 5</span>
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
              <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between text-center">
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
          <div class="mb-10 overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm bg-white p-2">
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

    <!-- ==================================================== -->
    <!-- SECTION CTA: GLOW-BORDER SIGN-UP CTA (#211) -->
    <!-- ==================================================== -->
    <section id="cta-signup" class="py-16 sm:py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden flex flex-col items-center justify-center">
      <!-- Ambient subtle background glow -->
      <div class="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
        <div class="w-[600px] h-[350px] bg-gradient-to-tr from-blue-100/50 via-indigo-50/40 to-sky-100/50 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
${glowCtaHtml}
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
  <!-- TOAST NOTIFICATION (Repositioned to left to avoid chatbot overlap) -->
  <!-- ==================================================== -->
  <div id="toast" class="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm">
    <div id="toast-icon">
      <i data-lucide="info" class="w-5 h-5 text-blue-400"></i>
    </div>
    <span id="toast-message" class="font-medium">Thông báo từ ULIS Vibe</span>
  </div>

  <!-- ==================================================== -->
  <!-- CHATBOT AI ASSISTANT (6-PHASE GUIDED CONVERSATION) -->
  <!-- ==================================================== -->
  <div id="vibe-chatbot-wrapper" class="relative z-50">
    <!-- Floating Circular Trigger Button (White Background) -->
    <button 
      id="btn-chatbot-toggle" 
      onclick="toggleChatbot()" 
      class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white hover:bg-slate-50 text-[#0B2341] shadow-2xl border-2 border-slate-200 hover:border-blue-900/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer"
      title="Hỏi Trợ lý AI ULIS Vibe"
      aria-label="Mở Trợ lý ảo AI ULIS Vibe">
      <div class="relative flex items-center justify-center">
        <i data-lucide="bot" class="w-7 h-7 sm:w-8 sm:h-8 text-[#0B2341] group-hover:rotate-12 transition-transform"></i>
        <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-ping"></span>
        <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
      </div>
    </button>

    <!-- Chatbot Window Container -->
    <div 
      id="chatbot-window" 
      class="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 transform scale-95 opacity-0 pointer-events-none origin-bottom-right">
      
      <!-- Chatbot Header -->
      <div class="p-4 bg-[#0B2341] text-white flex items-center justify-between border-b border-blue-900 shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 rounded-2xl bg-blue-900 flex items-center justify-center text-amber-400 border border-blue-700/60 shadow-xs">
            <i data-lucide="bot" class="w-6 h-6"></i>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B2341]"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-sm font-black text-white">ULIS Vibe AI Assistant</h3>
              <span class="px-1.5 py-0.5 bg-blue-800 text-blue-200 text-[9px] font-bold rounded">DEMO</span>
            </div>
            <p class="text-[11px] text-blue-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Phễu tư vấn ngoại khóa 6 Phase
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="resetChatbotSession()" class="p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-xl transition cursor-pointer" title="Làm mới hội thoại từ đầu">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
          <button onclick="toggleChatbot()" class="p-2 text-blue-200 hover:text-white hover:bg-blue-900/60 rounded-xl transition cursor-pointer" title="Đóng cửa sổ">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Messages Stream Container -->
      <div id="chatbot-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs sm:text-sm">
        <!-- Messages will be dynamically rendered here -->
      </div>

      <!-- Quick Option Chips Container -->
      <div id="chatbot-chips-container" class="px-4 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto shrink-0">
        <!-- Interactive chips will be dynamically populated here -->
      </div>

      <!-- Input Bar -->
      <form id="chatbot-input-form" onsubmit="handleChatbotInputSubmit(event)" class="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <input 
          type="text" 
          id="chatbot-text-input" 
          placeholder="Nhập từ khóa (học bổng, K60, CLB, A1, A2...)..." 
          class="flex-1 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 transition" />
        <button 
          type="submit" 
          class="p-2.5 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl transition shadow-xs shrink-0 cursor-pointer" 
          title="Gửi tin nhắn">
          <i data-lucide="send" class="w-4 h-4 text-amber-400"></i>
        </button>
      </form>

    </div>
  </div>

  <!-- Scripts -->
  <script src="./js/data.js"></script>
  <script src="./js/app.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', templateHtml, 'utf8');
console.log("Successfully rebuilt index.html to Impeccable standard!");
