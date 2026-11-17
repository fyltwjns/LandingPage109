/**
 * ULIS Vibe - Xử lý tương tác giao diện và dữ liệu
 * Nhóm 109 - Lớp FLF1007 - Trường Đại học Ngoại ngữ - ĐHQGHN
 */

// Trạng thái ứng dụng (Application State)
const state = {
  // Event Hub filters
  eventMonth: "all", // all | 2026-11 | 2026-12 | 2027-01
  eventCert: "all",  // all | A1 | A2 | A3
  eventCategory: "all", // all | academic | talents | volunteering
  eventType: "all", // all | event | recruitment
  eventSearch: "",
  eventView: "cards", // cards | calendar
  savedEvents: JSON.parse(localStorage.getItem("ulis_saved_events") || "[]"),

  // Club Directory filters
  clubCategory: "all", // all | academic | talents | volunteering
  clubStatus: "all", // all | open
  clubSearch: "",

  // Survey Chart View Mode
  chartMode: "charts", // charts (interactive Chart.js) | originals (docx screenshots)

  // Feedback storage
  feedbacks: JSON.parse(localStorage.getItem("ulis_feedbacks") || "[]")
};

// Khởi tạo ứng dụng sau khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initLucide();
  initEventHub();
  initClubDirectory();
  initCertHub();
  initSurveySection();
  initFaqAccordion();
  initFeedbackForm();
  initRoadmapAndTeam();
  updateSavedBadge();
  setupSmoothScroll();
});

// Khởi tạo icon Lucide
function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Menu Mobile
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    const isOpen = !mobileMenu.classList.contains("hidden");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

// Cuộn mượt mà
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length <= 1) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ==========================================
// 1. EVENT HUB: LỊCH SỰ KIỆN & TUYỂN QUÂN
// ==========================================
function initEventHub() {
  const container = document.getElementById("events-container");
  if (!container) return;

  const monthFilter = document.getElementById("filter-event-month");
  const certFilter = document.getElementById("filter-event-cert");
  const categoryFilter = document.getElementById("filter-event-category");
  const searchInput = document.getElementById("search-event-input");
  const viewToggleCards = document.getElementById("btn-view-cards");
  const viewToggleCalendar = document.getElementById("btn-view-calendar");
  const savedDrawerBtn = document.getElementById("btn-view-saved");

  if (monthFilter) {
    monthFilter.addEventListener("change", (e) => {
      state.eventMonth = e.target.value;
      renderEvents();
    });
  }

  if (certFilter) {
    certFilter.addEventListener("change", (e) => {
      state.eventCert = e.target.value;
      renderEvents();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      state.eventCategory = e.target.value;
      renderEvents();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.eventSearch = e.target.value.toLowerCase().trim();
      renderEvents();
    });
  }

  if (viewToggleCards && viewToggleCalendar) {
    viewToggleCards.addEventListener("click", () => {
      state.eventView = "cards";
      viewToggleCards.classList.add("bg-blue-800", "text-white");
      viewToggleCards.classList.remove("bg-white", "text-slate-700");
      viewToggleCalendar.classList.remove("bg-blue-800", "text-white");
      viewToggleCalendar.classList.add("bg-white", "text-slate-700");
      renderEvents();
    });

    viewToggleCalendar.addEventListener("click", () => {
      state.eventView = "calendar";
      viewToggleCalendar.classList.add("bg-blue-800", "text-white");
      viewToggleCalendar.classList.remove("bg-white", "text-slate-700");
      viewToggleCards.classList.remove("bg-blue-800", "text-white");
      viewToggleCards.classList.add("bg-white", "text-slate-700");
      renderEvents();
    });
  }

  if (savedDrawerBtn) {
    savedDrawerBtn.addEventListener("click", () => {
      openSavedEventsModal();
    });
  }

  // Lọc nhanh từ các pill buttons
  document.querySelectorAll(".quick-filter-event").forEach(btn => {
    btn.addEventListener("click", function() {
      const type = this.dataset.type;
      const value = this.dataset.value;
      
      document.querySelectorAll(".quick-filter-event").forEach(b => b.classList.remove("bg-blue-700", "text-white"));
      this.classList.add("bg-blue-700", "text-white");

      if (type === "month" && monthFilter) monthFilter.value = value;
      if (type === "cert" && certFilter) certFilter.value = value;
      if (type === "category" && categoryFilter) categoryFilter.value = value;
      
      state[type === "month" ? "eventMonth" : type === "cert" ? "eventCert" : "eventCategory"] = value;
      renderEvents();
    });
  });
}

function getFilteredEvents() {
  return ULIS_DATA.events.filter(ev => {
    if (state.eventMonth !== "all" && !ev.date.startsWith(state.eventMonth)) return false;
    if (state.eventCert !== "all" && ev.certType !== state.eventCert) return false;
    if (state.eventCategory !== "all" && ev.category !== state.eventCategory) return false;
    if (state.eventSearch) {
      const q = state.eventSearch;
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchOrg = ev.organizer.toLowerCase().includes(q);
      const matchLoc = ev.location.toLowerCase().includes(q);
      const matchDesc = ev.description.toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchLoc && !matchDesc) return false;
    }
    return true;
  });
}

function renderEvents() {
  const container = document.getElementById("events-container");
  const countBadge = document.getElementById("events-count-badge");
  if (!container) return;

  const events = getFilteredEvents();
  if (countBadge) {
    countBadge.textContent = `${events.length} sự kiện & đợt tuyển`;
  }

  if (state.eventView === "calendar") {
    renderCalendarView(events, container);
    return;
  }

  if (events.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="calendar-x" class="w-8 h-8"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-800 mb-1">Không tìm thấy sự kiện nào phù hợp</h4>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-4">
          Vui lòng thử điều chỉnh lại bộ lọc tháng, loại chứng nhận hoặc từ khóa tìm kiếm.
        </p>
        <button onclick="resetEventFilters()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Đặt lại bộ lọc
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = events.map(ev => {
    const isSaved = state.savedEvents.includes(ev.id);
    const certBadgeClass = ev.certType === "A1" ? "badge-a1" : ev.certType === "A2" ? "badge-a2" : "badge-a3";
    const dateFormatted = formatDateVietnamese(ev.date);

    return `
      <div data-event-id="${ev.id}" class="event-card-item group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md interactive-card flex flex-col justify-between overflow-hidden relative">
        <!-- Event Banner Thumbnail (16:9 aspect ratio displaying 100% banner info without cropping) -->
        <div class="event-banner-container aspect-video cursor-pointer" onclick="openEventModal('${ev.id}')">
          <img src="./assets/events/${ev.id}.webp" alt="${ev.title}" class="event-banner-img" loading="lazy" onerror="this.onerror=null; this.src='./assets/events/${ev.id}.png';" />
          <button onclick="event.stopPropagation(); toggleSaveEvent('${ev.id}')" title="${isSaved ? 'Bỏ lưu' : 'Lưu sự kiện'}" aria-label="${isSaved ? 'Bỏ lưu' : 'Lưu sự kiện'}" class="btn-save-${ev.id} absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 ${isSaved ? 'text-amber-400' : 'text-white/80 hover:text-white'} transition shadow-xs">
            <i data-lucide="bookmark" class="w-4 h-4 ${isSaved ? 'fill-current' : ''}"></i>
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
                <span class="px-2 py-0.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${ev.type === 'recruitment' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-slate-100 text-slate-800 border border-slate-200'}">
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
  }).join("");

  initLucide();
}

function renderCalendarView(events, container) {
  const currentMonthStr = state.eventMonth !== "all" ? state.eventMonth : "2026-11";
  const [year, month] = currentMonthStr.split("-").map(Number);
  
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const startDay = (firstDayIndex + 6) % 7;

  const eventsByDay = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && (d.getMonth() + 1) === month) {
      const dayNum = d.getDate();
      if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
      eventsByDay[dayNum].push(ev);
    }
  });

  let calendarHtml = `
    <div class="col-span-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden animate-fade-in">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h4 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <i data-lucide="calendar" class="w-5 h-5 text-blue-700"></i>
            Lịch Hoạt Động & Sự Kiện: ${monthNames[month - 1]} Năm ${year}
          </h4>
          <p class="text-xs text-slate-500 mt-1">Bấm vào từng ngày để xem nhanh sự kiện và đăng ký tham gia</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="changeCalendarMonth(-1)" class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition" title="Tháng trước">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          <span class="px-3 py-1 bg-blue-50 text-blue-900 font-bold rounded-xl text-sm">${monthNames[month - 1]} / ${year}</span>
          <button onclick="changeCalendarMonth(1)" class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition" title="Tháng sau">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div class="text-blue-700">T7</div>
        <div class="text-red-600">CN</div>
      </div>

      <div class="grid grid-cols-7 gap-2">
  `;

  for (let i = 0; i < startDay; i++) {
    calendarHtml += `<div class="min-h-[90px] p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/60"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = eventsByDay[day] || [];
    const hasEvents = dayEvents.length > 0;
    const isToday = (day === 20 && month === 11 && year === 2026);

    calendarHtml += `
      <div class="min-h-[105px] p-2 rounded-xl border ${hasEvents ? 'bg-blue-50/30 border-blue-200 hover:border-blue-400 cal-day-active' : 'bg-white border-slate-200'} flex flex-col justify-between transition group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center -ml-1 -mt-1' : hasEvents ? 'text-blue-900 font-extrabold' : 'text-slate-700'}">
            ${day}
          </span>
          ${hasEvents ? `<span class="w-2 h-2 rounded-full bg-blue-600"></span>` : ''}
        </div>
        
        <div class="space-y-1 overflow-hidden">
          ${dayEvents.map(ev => {
            const certColor = ev.certType === 'A1' ? 'bg-blue-600 text-white' : ev.certType === 'A2' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white';
            return `
              <div onclick="openEventModal('${ev.id}')" title="${ev.title}" class="px-1.5 py-1 rounded text-[10px] font-semibold truncate cursor-pointer ${certColor} hover:opacity-90 shadow-xs">
                ${ev.certType}: ${ev.title}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  calendarHtml += `
      </div>
      <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-blue-600"></span> A1: Học thuật & NCKH</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500"></span> A2: Kỹ năng & Hướng nghiệp</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-600"></span> A3: Tình nguyện & Xã hội</span>
        </div>
        <button onclick="resetEventFilters()" class="text-blue-700 font-semibold hover:underline">Xem tất cả sự kiện</button>
      </div>
    </div>
  `;

  container.innerHTML = calendarHtml;
  initLucide();
}

function changeCalendarMonth(direction) {
  const current = state.eventMonth !== "all" ? state.eventMonth : "2026-11";
  let [year, month] = current.split("-").map(Number);
  month += direction;
  if (month > 12) {
    month = 1;
    year += 1;
  } else if (month < 1) {
    month = 12;
    year -= 1;
  }
  const formatted = `${year}-${String(month).padStart(2, "0")}`;
  state.eventMonth = formatted;

  const monthFilter = document.getElementById("filter-event-month");
  if (monthFilter) monthFilter.value = formatted;

  renderEvents();
}

function resetEventFilters() {
  state.eventMonth = "all";
  state.eventCert = "all";
  state.eventCategory = "all";
  state.eventSearch = "";

  const monthFilter = document.getElementById("filter-event-month");
  const certFilter = document.getElementById("filter-event-cert");
  const categoryFilter = document.getElementById("filter-event-category");
  const searchInput = document.getElementById("search-event-input");

  if (monthFilter) monthFilter.value = "all";
  if (certFilter) certFilter.value = "all";
  if (categoryFilter) categoryFilter.value = "all";
  if (searchInput) searchInput.value = "";

  renderEvents();
  showToast("Đã đặt lại tất cả bộ lọc sự kiện!", "info");
}

function toggleSaveEvent(eventId) {
  const index = state.savedEvents.indexOf(eventId);
  if (index > -1) {
    state.savedEvents.splice(index, 1);
    showToast("Đã xóa sự kiện khỏi danh sách quan tâm.", "info");
  } else {
    state.savedEvents.push(eventId);
    showToast("Đã lưu sự kiện vào danh sách quan tâm của bạn!", "success");
  }
  localStorage.setItem("ulis_saved_events", JSON.stringify(state.savedEvents));
  updateSavedBadge();
  renderEvents();
}

function updateSavedBadge() {
  const badge = document.getElementById("saved-events-badge");
  if (badge) {
    badge.textContent = state.savedEvents.length;
    if (state.savedEvents.length > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
}

function openEventModal(eventId) {
  const ev = ULIS_DATA.events.find(e => e.id === eventId);
  if (!ev) return;

  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  const certBadgeClass = ev.certType === "A1" ? "badge-a1" : ev.certType === "A2" ? "badge-a2" : "badge-a3";
  const isSaved = state.savedEvents.includes(ev.id);

  modalContent.innerHTML = `
    <div class="relative overflow-hidden rounded-3xl flex flex-col max-h-[92vh]">
      <!-- Modal Banner Image (16:9 full banner display) -->
      <div class="event-banner-container aspect-video shrink-0">
        <img src="./assets/events/${ev.id}.webp" alt="${ev.title}" class="event-banner-img" onerror="this.onerror=null; this.src='./assets/events/${ev.id}.png';" />
        <button onclick="closeModal()" class="absolute top-4 right-4 p-2 text-white bg-slate-900/60 hover:bg-slate-900/80 rounded-xl backdrop-blur-md transition" aria-label="Đóng cửa sổ">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="px-2.5 py-1 text-xs font-bold rounded-lg ${certBadgeClass}">
              ${ev.certType}: ${ev.certName}
            </span>
            <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800">
              ${ev.typeName}
            </span>
            <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-900">
              Nhóm: ${ev.categoryName}
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900">${ev.title}</h3>
        </div>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto flex-1 bg-white">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100">
          <div class="flex items-center gap-2">
            <i data-lucide="building" class="w-4 h-4 text-blue-600"></i>
            <span><strong>Đơn vị:</strong> ${ev.organizer}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-blue-600"></i>
            <span><strong>Thời gian:</strong> ${formatDateVietnamese(ev.date)} (${ev.time})</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-red-500"></i>
            <span><strong>Địa điểm:</strong> ${ev.location}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
            <span><strong>Hạn đăng ký:</strong> ${ev.registrationDeadline}</span>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Mô tả chương trình</h4>
          <p class="text-sm text-slate-600 leading-relaxed">${ev.description}</p>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="award" class="w-4 h-4 text-blue-700"></i> Quyền lợi & Chứng nhận nhận được
          </h4>
          <ul class="space-y-2">
            ${ev.benefits.map(b => `
              <li class="flex items-start gap-2 text-sm text-slate-700">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                <span>${b}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i> Yêu cầu tham gia
          </h4>
          <p class="text-sm text-slate-600">${ev.requirements}</p>
        </div>

        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
          <div>
            <span class="inline-block px-2 py-0.5 bg-blue-700 text-white rounded text-[11px] font-bold uppercase mb-1">Tính năng thử nghiệm</span>
            <h5 class="text-sm font-bold text-slate-900">Mã QR Check-in Thông Minh</h5>
            <p class="text-xs text-slate-600">Dùng mã này khi đến tham dự sự kiện tại hội trường để ghi nhận điểm danh tự động.</p>
          </div>
          <div class="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ulis.vnu.edu.vn/vibe/checkin?id=${ev.id}" alt="QR Checkin" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 shrink-0">
        <button onclick="toggleSaveEvent('${ev.id}'); openEventModal('${ev.id}');" class="px-4 py-2 border rounded-xl text-sm font-semibold transition flex items-center gap-2 ${isSaved ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}">
          <i data-lucide="bookmark" class="w-4 h-4 ${isSaved ? 'fill-current' : ''}"></i>
          ${isSaved ? 'Đã lưu trong mục quan tâm' : 'Lưu vào mục quan tâm'}
        </button>

        <div class="flex items-center gap-3">
          <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            Đóng
          </button>
          <a href="${ev.formUrl || '#'}" target="_blank" rel="noopener noreferrer" class="px-6 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-md">
            Mở đơn đăng ký chính thức <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  initLucide();
}

function openSavedEventsModal() {
  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  const savedList = ULIS_DATA.events.filter(e => state.savedEvents.includes(e.id));

  modalContent.innerHTML = `
    <div class="relative">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <i data-lucide="bookmark" class="w-5 h-5 text-amber-500 fill-current"></i>
          Danh sách sự kiện đã lưu (${savedList.length})
        </h3>
        <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        ${savedList.length === 0 ? `
          <div class="text-center py-12">
            <i data-lucide="bookmark-x" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
            <p class="text-sm font-medium text-slate-600">Bạn chưa lưu sự kiện nào.</p>
            <p class="text-xs text-slate-400 mt-1">Bấm vào biểu tượng bookmark ở thẻ sự kiện để lưu và theo dõi sau.</p>
          </div>
        ` : savedList.map(ev => `
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold text-blue-700">${ev.certType}: ${ev.certName}</span>
              <h4 class="text-sm font-bold text-slate-900 mt-0.5">${ev.title}</h4>
              <p class="text-xs text-slate-500 mt-1">${formatDateVietnamese(ev.date)} • ${ev.location}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button onclick="openEventModal('${ev.id}')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold">
                Xem
              </button>
              <button onclick="toggleSaveEvent('${ev.id}'); openSavedEventsModal();" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Xóa">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-right">
        <button onclick="closeModal()" class="px-4 py-2 bg-blue-800 text-white rounded-xl text-xs font-bold hover:bg-blue-900">
          Xong
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  initLucide();
}

function closeModal() {
  const modal = document.getElementById("app-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// ==========================================
// 2. CLUB DIRECTORY: DANH BẠ CÂU LẠC BỘ
// ==========================================
function initClubDirectory() {
  const container = document.getElementById("clubs-container");
  if (!container) return;

  const searchInput = document.getElementById("search-club-input");
  const groupTabs = document.querySelectorAll(".club-group-tab");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.clubSearch = e.target.value.toLowerCase().trim();
      renderClubs();
    });
  }

  groupTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      groupTabs.forEach(t => {
        t.classList.remove("tab-active");
        t.classList.add("bg-white", "text-slate-600");
      });
      this.classList.add("tab-active");
      this.classList.remove("bg-white", "text-slate-600");

      state.clubCategory = this.dataset.category;
      renderClubs();
    });
  });
}

function getFilteredClubs() {
  return ULIS_DATA.clubs.filter(club => {
    if (state.clubCategory !== "all" && club.category !== state.clubCategory) return false;
    if (state.clubSearch) {
      const q = state.clubSearch;
      const matchName = club.name.toLowerCase().includes(q);
      const matchAcronym = club.acronym.toLowerCase().includes(q);
      const matchDesc = club.description.toLowerCase().includes(q);
      const matchAudience = club.targetAudience.toLowerCase().includes(q);
      const matchTags = club.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchAcronym && !matchDesc && !matchAudience && !matchTags) return false;
    }
    return true;
  });
}

function renderClubs() {
  const container = document.getElementById("clubs-container");
  const countBadge = document.getElementById("clubs-count-badge");
  if (!container) return;

  const clubs = getFilteredClubs();
  if (countBadge) {
    countBadge.textContent = `${clubs.length} Câu lạc bộ & Đội nhóm`;
  }

  if (clubs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-800 mb-1">Không tìm thấy câu lạc bộ nào</h4>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-4">
          Thử tìm kiếm với từ khóa khác như "tiếng Anh", "tình nguyện", "âm nhạc", hoặc chuyển sang tab nhóm khác.
        </p>
        <button onclick="resetClubFilters()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Xem tất cả CLB
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = clubs.map(club => {
    const badgeColor = club.category === "academic" ? "bg-blue-100 text-blue-800 border-blue-200" :
                       club.category === "talents" ? "bg-amber-100 text-amber-800 border-amber-200" :
                       "bg-emerald-100 text-emerald-800 border-emerald-200";

    return `
      <div data-club-id="${club.id}" class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg interactive-card flex flex-col justify-between overflow-hidden transition-all duration-300">
        <div class="p-6">
          <div class="flex items-start justify-between gap-3 mb-3">
            <span class="px-2.5 py-1 text-xs font-bold rounded-lg border ${badgeColor}">
              ${club.categoryName}
            </span>
            <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              ${club.acronym}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-1 hover:text-blue-700 cursor-pointer" onclick="openClubModal('${club.id}')">
            ${club.name}
          </h3>
          <p class="text-xs text-blue-800 font-medium italic mb-3">"${club.slogan}"</p>

          <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            ${club.description}
          </p>

          <div class="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="activity" class="w-3.5 h-3.5 text-blue-600"></i> Hoạt động chính:
              </span>
              <p class="text-slate-600 line-clamp-2 pl-5 text-[11px]">
                ${club.activities[0]} • ${club.activities[1]}
              </p>
            </div>

            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-600"></i> Đối tượng phù hợp:
              </span>
              <p class="text-slate-600 line-clamp-2 pl-5 text-[11px]">
                ${club.targetAudience}
              </p>
            </div>

            <div>
              <span class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-600"></i> Lịch tuyển quân:
              </span>
              <p class="text-slate-600 pl-5 text-[11px] font-medium text-amber-900">
                ${club.recruitmentPeriod}
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <a href="${club.facebook}" target="_blank" rel="noopener noreferrer" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Fanpage Facebook">
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
            <a href="${club.formLink}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs">
              Ứng tuyển <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");

  initLucide();
}

function resetClubFilters() {
  state.clubCategory = "all";
  state.clubSearch = "";
  const searchInput = document.getElementById("search-club-input");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll(".club-group-tab").forEach((t, i) => {
    if (i === 0) {
      t.classList.add("tab-active");
      t.classList.remove("bg-white", "text-slate-600");
    } else {
      t.classList.remove("tab-active");
      t.classList.add("bg-white", "text-slate-600");
    }
  });

  renderClubs();
  showToast("Đã xem tất cả danh sách CLB!", "info");
}

function openClubModal(clubId) {
  const club = ULIS_DATA.clubs.find(c => c.id === clubId);
  if (!club) return;

  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  const badgeColor = club.category === "academic" ? "bg-blue-100 text-blue-800 border-blue-200" :
                     club.category === "talents" ? "bg-amber-100 text-amber-800 border-amber-200" :
                     "bg-emerald-100 text-emerald-800 border-emerald-200";

  modalContent.innerHTML = `
    <div class="relative">
      <div class="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
        <div>
          <span class="px-2.5 py-1 text-xs font-bold rounded-lg border ${badgeColor} inline-block mb-2">
            ${club.categoryName} • ${club.acronym}
          </span>
          <h3 class="text-xl font-bold text-slate-900">${club.name}</h3>
          <p class="text-xs text-blue-800 font-medium italic mt-1">"${club.slogan}"</p>
        </div>
        <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Giới thiệu tổng quan</h4>
          <p class="text-sm text-slate-700 leading-relaxed">${club.description}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Các hoạt động thường niên</h4>
          <div class="space-y-2">
            ${club.activities.map(act => `
              <div class="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <i data-lucide="check" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
                <span>${act}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <h5 class="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <i data-lucide="users" class="w-4 h-4 text-blue-700"></i> Đối tượng phù hợp
            </h5>
            <p class="text-xs text-slate-700 leading-relaxed">${club.targetAudience}</p>
          </div>
          <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
            <h5 class="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <i data-lucide="calendar" class="w-4 h-4 text-amber-700"></i> Thời điểm tuyển quân
            </h5>
            <p class="text-xs text-slate-700 leading-relaxed">${club.recruitmentPeriod}</p>
            <span class="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              ${club.currentStatus}
            </span>
          </div>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h5 class="text-xs font-bold text-slate-800 mb-2">Kênh thông tin & Liên hệ</h5>
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <a href="${club.facebook}" target="_blank" class="flex items-center gap-1.5 text-blue-700 font-semibold hover:underline">
              <i data-lucide="facebook" class="w-4 h-4"></i> Fanpage chính thức
            </a>
            <a href="mailto:${club.email}" class="flex items-center gap-1.5 text-slate-700 font-semibold hover:underline">
              <i data-lucide="mail" class="w-4 h-4"></i> ${club.email}
            </a>
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
        <button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          Đóng
        </button>
        <a href="${club.formLink}" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-md">
          Nộp đơn gia nhập CLB <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  initLucide();
}

// ==========================================
// 3. CERT HUB: TRA CỨU CHỨNG NHẬN A1, A2, A3
// ==========================================
function initCertHub() {
  const container = document.getElementById("cert-details-container");
  if (!container) return;

  const certTabs = document.querySelectorAll(".cert-tab-btn");
  certTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      certTabs.forEach(t => {
        t.classList.remove("tab-active");
        t.classList.add("bg-white", "text-slate-700");
      });
      this.classList.add("tab-active");
      this.classList.remove("bg-white", "text-slate-700");

      const certKey = this.dataset.cert;
      renderCertContent(certKey);
    });
  });

  initCertRecommender();
}

function renderCertContent(certKey) {
  const container = document.getElementById("cert-details-container");
  if (!container) return;

  if (certKey === "compare") {
    renderCertComparison(container);
    return;
  }

  const cert = ULIS_DATA.certGuidelines.find(c => c.type === certKey);
  if (!cert) return;

  const badgeClass = cert.type === "A1" ? "badge-a1" : cert.type === "A2" ? "badge-a2" : "badge-a3";

  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span class="px-3 py-1 text-xs font-bold rounded-lg ${badgeClass} inline-block mb-2">
            Mã chuẩn: ${cert.code} • ${cert.category}
          </span>
          <h3 class="text-2xl font-extrabold text-slate-900">${cert.name}</h3>
          <p class="text-sm text-slate-600 mt-1 max-w-2xl">${cert.summary}</p>
        </div>
        <div class="bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-right shrink-0">
          <span class="text-xs text-blue-700 font-bold block uppercase tracking-wider">Khung điểm rèn luyện</span>
          <span class="text-xl font-extrabold text-blue-900">${cert.pointRange}</span>
          <span class="text-[11px] text-slate-500 block mt-0.5">${cert.applicableCriteria}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="check-square" class="w-4 h-4 text-emerald-600"></i> Điều kiện & Tiêu chí đạt chứng nhận
            </h4>
            <div class="space-y-2.5">
              ${cert.criteria.map(crit => `
                <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                  <span>${crit}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1.5">
            <span class="font-bold text-amber-900 flex items-center gap-1.5">
              <i data-lucide="info" class="w-4 h-4 text-amber-600"></i> Quy định minh chứng & Lưu ý:
            </span>
            <p><strong>Hình thức minh chứng:</strong> ${cert.evidenceForm}</p>
            <p><strong>Lưu ý đặc biệt:</strong> ${cert.notes}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-blue-600"></i> Ví dụ sự kiện đạt chứng nhận ${cert.type} tại ULIS
            </h4>
            <div class="grid grid-cols-1 gap-2.5">
              ${cert.examples.map(ex => `
                <div class="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-sm font-medium text-slate-800 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>${ex}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="p-6 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl text-white shadow-md">
            <h5 class="text-base font-bold mb-1">Muốn tìm sự kiện cấp chứng nhận ${cert.type}?</h5>
            <p class="text-xs text-slate-300 mb-4 leading-relaxed">
              Event Hub đã tổng hợp sẵn các sự kiện cấp ${cert.type} trong tháng 11, 12/2026 và tháng 01/2027.
            </p>
            <button onclick="filterEventsByCert('${cert.type}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition">
              Xem sự kiện ${cert.type} trên Event Hub <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  initLucide();
}

function renderCertComparison(container) {
  container.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in overflow-x-auto">
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-900 rounded-full uppercase">Ma Trận Đối Chiếu</span>
          <span class="text-xs text-slate-500">Chuẩn hóa theo Quyết định ĐHQGHN</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 tracking-tight">Bảng So Sánh 3 Loại Chứng Nhận Ngoại Khóa ULIS</h3>
        <p class="text-sm text-slate-600 mt-0.5">Đối chiếu điều kiện, khung điểm rèn luyện và giá trị pháp lý đối với hồ sơ sinh viên</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-100/90 text-slate-800 border-b-2 border-slate-200">
              <th class="w-1/4 p-3.5 font-bold text-slate-700 border-r border-slate-200">Tiêu chí so sánh</th>
              <th class="w-1/4 p-3.5 font-extrabold text-blue-950 bg-blue-50/80 border-r border-slate-200">
                <span class="inline-flex items-center gap-1.5"><i data-lucide="book-open" class="w-4 h-4 text-blue-800"></i> A1: Học thuật & NCKH</span>
              </th>
              <th class="w-1/4 p-3.5 font-extrabold text-amber-950 bg-amber-50/80 border-r border-slate-200">
                <span class="inline-flex items-center gap-1.5"><i data-lucide="compass" class="w-4 h-4 text-amber-700"></i> A2: Kỹ năng & Hướng nghiệp</span>
              </th>
              <th class="w-1/4 p-3.5 font-extrabold text-emerald-950 bg-emerald-50/80">
                <span class="inline-flex items-center gap-1.5"><i data-lucide="hand-heart" class="w-4 h-4 text-emerald-700"></i> A3: Tình nguyện & Xã hội</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr class="hover:bg-slate-50/80 transition">
              <td class="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">Bản chất hoạt động</td>
              <td class="p-3.5 text-slate-700 border-r border-slate-200 leading-relaxed">Hội thảo khoa học, tọa đàm chuyên môn, thi học thuật ngôn ngữ, nghiên cứu khoa học sinh viên</td>
              <td class="p-3.5 text-slate-700 border-r border-slate-200 leading-relaxed">Workshop kỹ năng mềm, ngày hội việc làm (Job Fair), giao lưu văn hóa quốc tế, lễ tân khánh tiết</td>
              <td class="p-3.5 text-slate-700 leading-relaxed">Hiến máu nhân đạo, Mùa hè xanh, Tiếp sức mùa thi, hoạt động cộng đồng, văn nghệ - thể thao</td>
            </tr>
            <tr class="hover:bg-slate-50/80 transition even:bg-slate-50/30">
              <td class="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">Khung điểm rèn luyện (ĐRL)</td>
              <td class="p-3.5 font-bold text-blue-900 border-r border-slate-200 tabular-nums">5 – 15 điểm (Tiêu chí 1 & 2)</td>
              <td class="p-3.5 font-bold text-amber-900 border-r border-slate-200 tabular-nums">5 – 10 điểm (Tiêu chí 3)</td>
              <td class="p-3.5 font-bold text-emerald-900 tabular-nums">8 – 20 điểm (Tiêu chí 3 & 4)</td>
            </tr>
            <tr class="hover:bg-slate-50/80 transition">
              <td class="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">Xét Học bổng KKHT</td>
              <td class="p-3.5 border-r border-slate-200">
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-xs">Bắt buộc ưu tiên hàng đầu</span>
              </td>
              <td class="p-3.5 text-slate-600 border-r border-slate-200">Bổ trợ hoàn thiện hồ sơ</td>
              <td class="p-3.5 text-slate-600">Bổ trợ hoàn thiện hồ sơ</td>
            </tr>
            <tr class="hover:bg-slate-50/80 transition even:bg-slate-50/30">
              <td class="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">Xét danh hiệu "Sinh viên 5 Tốt"</td>
              <td class="p-3.5 text-slate-700 border-r border-slate-200">Đạt chuẩn tiêu chí <strong class="text-blue-950">"Học tập tốt"</strong></td>
              <td class="p-3.5 text-slate-700 border-r border-slate-200">Đạt chuẩn tiêu chí <strong class="text-amber-950">"Hội nhập tốt"</strong></td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded bg-red-100 text-red-950 font-bold text-xs">Bắt buộc chuẩn "Tình nguyện tốt"</span>
              </td>
            </tr>
            <tr class="hover:bg-slate-50/80 transition">
              <td class="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">Minh chứng hợp lệ</td>
              <td class="p-3.5 text-slate-600 border-r border-slate-200 text-xs leading-relaxed">Giấy khen, kỷ yếu NCKH, xác nhận Khoa / Phòng KHCN</td>
              <td class="p-3.5 text-slate-600 border-r border-slate-200 text-xs leading-relaxed">E-Certificate có mã QR xác thực, danh sách BTC Phòng CT&CT HSSV</td>
              <td class="p-3.5 text-slate-600 text-xs leading-relaxed">Giấy chứng nhận Đoàn - Hội trường, thẻ xác nhận hiến máu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  initLucide();
}

function filterEventsByCert(certType) {
  state.eventCert = certType;
  const certFilter = document.getElementById("filter-event-cert");
  if (certFilter) certFilter.value = certType;

  const eventSection = document.getElementById("event-hub");
  if (eventSection) {
    eventSection.scrollIntoView({ behavior: "smooth" });
  }
  renderEvents();
  showToast(`Đã lọc sự kiện cấp chứng nhận ${certType}!`, "info");
}

function initCertRecommender() {
  const submitBtn = document.getElementById("btn-calc-cert");
  const resultContainer = document.getElementById("cert-calc-result");
  if (!submitBtn || !resultContainer) return;

  submitBtn.addEventListener("click", () => {
    const goalSelect = document.getElementById("quiz-goal");
    const yearSelect = document.getElementById("quiz-year");
    if (!goalSelect || !yearSelect) return;

    const goal = goalSelect.value;
    const year = yearSelect.value;

    let advice = "";
    let recommendedCerts = [];
    let suggestedEvents = [];

    if (goal === "scholarship") {
      recommendedCerts = ["A1", "A2"];
      advice = `Đối với mục tiêu <strong>Săn Học bổng Khuyến khích Học tập</strong>, bạn cần duy trì điểm rèn luyện từ 80-90 điểm trở lên. Ưu tiên hàng đầu là tích lũy <strong>ít nhất 02 chứng nhận A1 (Học thuật & NCKH)</strong> và bổ sung thêm <strong>A2</strong> để tối đa hóa điểm Tiêu chí 1 và 2.`;
      suggestedEvents = ULIS_DATA.events.filter(e => e.certType === "A1").slice(0, 2);
    } else if (goal === "sv5t") {
      recommendedCerts = ["A3", "A1", "A2"];
      advice = `Để đạt danh hiệu <strong>Sinh viên 5 Tốt cấp Trường / cấp ĐHQGHN</strong>, điều kiện tiên quyết không thể thiếu là tiêu chí <em>'Tình nguyện tốt'</em>. Bạn bắt buộc phải có <strong>chứng nhận A3 (hiến máu hoặc tham gia chiến dịch tình nguyện Mùa hè xanh/Đông ấm)</strong>, đồng thời hoàn thành chứng nhận <strong>A1</strong> (tiêu chí Học tập) và <strong>A2</strong> (tiêu chí Hội nhập).`;
      suggestedEvents = ULIS_DATA.events.filter(e => e.certType === "A3").slice(0, 2);
    } else if (goal === "skills") {
      recommendedCerts = ["A2"];
      advice = `Để <strong>phát triển kỹ năng nghề nghiệp và tìm kiếm việc làm</strong> tại các doanh nghiệp đa quốc gia, bạn nên tập trung vào các sự kiện cấp <strong>chứng nhận A2</strong> như Ngày hội Việc làm ULIS Job Fair, các workshop về CV, LinkedIn và rèn luyện kỹ năng mềm.`;
      suggestedEvents = ULIS_DATA.events.filter(e => e.certType === "A2").slice(0, 2);
    } else {
      recommendedCerts = ["A3"];
      advice = `Để <strong>giải tỏa căng thẳng và mở rộng mối quan hệ bạn bè</strong>, các câu lạc bộ thuộc nhóm Sở thích & Năng khiếu (Âm nhạc MMC, Nhảy UDC, Bóng đá UFC) và các hoạt động tình nguyện ngoại khóa <strong>A3</strong> là sự lựa chọn lý tưởng nhất dành cho bạn!`;
      suggestedEvents = ULIS_DATA.events.filter(e => e.category === "talents").slice(0, 2);
    }

    resultContainer.innerHTML = `
      <div class="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl animate-fade-in text-sm text-slate-800">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-3 h-3 rounded-full bg-blue-600"></span>
          <h4 class="font-bold text-blue-900 text-base">Lộ trình rèn luyện được cá nhân hóa cho bạn:</h4>
        </div>
        <p class="leading-relaxed mb-4">${advice}</p>

        <div class="mb-4">
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Chứng nhận bạn nên ưu tiên thu thập:</span>
          <div class="flex gap-2">
            ${recommendedCerts.map(c => `
              <span class="px-3 py-1 font-bold text-xs rounded-lg ${c === 'A1' ? 'badge-a1' : c === 'A2' ? 'badge-a2' : 'badge-a3'}">
                Chứng nhận ${c}
              </span>
            `).join("")}
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Gợi ý hoạt động sắp diễn ra phù hợp:</span>
          <div class="space-y-2">
            ${suggestedEvents.map(ev => `
              <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <span class="font-medium text-xs text-slate-900 truncate">${ev.title}</span>
                <button onclick="openEventModal('${ev.id}')" class="px-3 py-1 bg-blue-800 text-white rounded-lg text-xs font-bold hover:bg-blue-900 shrink-0">
                  Xem & Đăng ký
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    initLucide();
  });
}

// ==========================================
// 4. BỐI CẢNH & KHẢO SÁT 105 SINH VIÊN ULIS
// ==========================================
function initSurveySection() {
  const toggleBtnCharts = document.getElementById("btn-survey-charts");
  const toggleBtnOriginals = document.getElementById("btn-survey-originals");
  const containerCharts = document.getElementById("survey-charts-container");
  const containerOriginals = document.getElementById("survey-originals-container");

  if (!toggleBtnCharts || !toggleBtnOriginals || !containerCharts || !containerOriginals) return;

  toggleBtnCharts.addEventListener("click", () => {
    state.chartMode = "charts";
    toggleBtnCharts.classList.add("bg-blue-900", "text-white");
    toggleBtnCharts.classList.remove("bg-white", "text-slate-700");
    toggleBtnOriginals.classList.remove("bg-blue-900", "text-white");
    toggleBtnOriginals.classList.add("bg-white", "text-slate-700");

    containerCharts.classList.remove("hidden");
    containerOriginals.classList.add("hidden");
    renderInteractiveCharts();
    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.forEach(c => c && c.reflow());
    }
  });

  toggleBtnOriginals.addEventListener("click", () => {
    state.chartMode = "originals";
    toggleBtnOriginals.classList.add("bg-blue-900", "text-white");
    toggleBtnOriginals.classList.remove("bg-white", "text-slate-700");
    toggleBtnCharts.classList.remove("bg-blue-900", "text-white");
    toggleBtnCharts.classList.add("bg-white", "text-slate-700");

    containerCharts.classList.add("hidden");
    containerOriginals.classList.remove("hidden");
  });

  renderInteractiveCharts();
}

// 3D Chart Drag to Rotate Handler with Level Double-Click Reset
function add3DRotation(chart) {
  if (!chart || !chart.container) return;
  const container = chart.container;
  const isColumn = chart.options.chart.type === 'column';
  // Angle tilted from below upwards 5° for columns (-5°), and 5° for circular discs (99.6% circle, no distortion)
  const defaultAlpha = isColumn ? -5 : 5;
  const defaultBeta = 0;
  let isDragging = false;
  let downX, downY, alpha, beta;

  function onMouseDown(e) {
    if (e.target.closest('.highcharts-legend') || e.target.closest('.highcharts-data-label')) return;
    isDragging = true;
    downX = e.clientX || (e.touches && e.touches[0].clientX);
    downY = e.clientY || (e.touches && e.touches[0].clientY);
    alpha = chart.options.chart.options3d.alpha;
    beta = chart.options.chart.options3d.beta;
    container.style.cursor = 'grabbing';
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const newAlpha = Math.min(75, Math.max(-20, alpha + (clientY - downY) * 0.3));
    const newBeta = beta + (clientX - downX) * 0.3;
    chart.update({
      chart: {
        options3d: {
          alpha: newAlpha,
          beta: newBeta
        }
      }
    }, false, false, false);
    chart.redraw(false);
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  }

  // Double click resets to perfectly level, requested 5° perspective
  container.addEventListener('dblclick', () => {
    chart.update({
      chart: {
        options3d: {
          alpha: defaultAlpha,
          beta: defaultBeta
        }
      }
    });
  });

  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('touchstart', onMouseDown, { passive: true });

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onMouseMove, { passive: true });

  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchend', onMouseUp);

  container.style.cursor = 'grab';
}

function renderInteractiveCharts() {
  if (!window.Highcharts) return;

  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: "'Be Vietnam Pro', system-ui, sans-serif"
      }
    },
    credits: { enabled: false }
  });

  // 1. Chart 3D Missed Events (3D Donut - 5° tilt, pure geometric circle, no distortion)
  const elMissed = document.getElementById("chart-missed-3d");
  if (elMissed && !elMissed.chartInstance) {
    elMissed.chartInstance = Highcharts.chart('chart-missed-3d', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 15, 10],
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 0
        }
      },
      title: { text: null },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ: <b>{point.y:.1f}%</b> ({point.count} SV)'
      },
      plotOptions: {
        pie: {
          innerSize: '55%',
          depth: 18,
          size: '78%',
          center: ['50%', '48%'],
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 14,
            connectorPadding: 4,
            format: '<b>{point.name}</b><br><span style="color:#002B7F;font-weight:700">{point.y}%</span>',
            style: { fontSize: '11px', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { name: 'Thỉnh thoảng gặp phải', y: 42.9, count: 45, color: '#DC2626', sliced: true, selected: true },
          { name: 'Thường xuyên xảy ra', y: 28.6, count: 30, color: '#D97706' },
          { name: 'Hiếm khi gặp phải', y: 19.0, count: 20, color: '#059669' },
          { name: 'Chưa từng gặp (không có nhu cầu)', y: 5.7, count: 6, color: '#2563EB' },
          { name: 'Chưa từng xảy ra', y: 3.8, count: 4, color: '#64748B' }
        ]
      }]
    });
    add3DRotation(elMissed.chartInstance);
  }

  // 2. Chart 3D Channels (3D Pie - 5° tilt, pure geometric circle)
  const elChannels = document.getElementById("chart-channels-3d");
  if (elChannels && !elChannels.chartInstance) {
    elChannels.chartInstance = Highcharts.chart('chart-channels-3d', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 15, 10],
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 0
        }
      },
      title: { text: null },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ: <b>{point.y:.1f}%</b> ({point.count} SV)'
      },
      plotOptions: {
        pie: {
          depth: 18,
          size: '78%',
          center: ['50%', '48%'],
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 14,
            format: '<b>{point.name}</b><br><span style="color:#002B7F;font-weight:700">{point.y}%</span>',
            style: { fontSize: '11px', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { name: 'Facebook Fanpage', y: 43.8, count: 46, color: '#1877F2', sliced: true, selected: true },
          { name: 'Bạn bè, người quen', y: 26.7, count: 28, color: '#F59E0B' },
          { name: 'Group sinh viên', y: 19.0, count: 20, color: '#10B981' },
          { name: 'Thông báo chính thức', y: 10.5, count: 11, color: '#6366F1' }
        ]
      }]
    });
    add3DRotation(elChannels.chartInstance);
  }

  // 3. Chart 3D Difficulties (3D Column - Tilted from below upwards 5°: alpha = -5, beta = 0)
  const elDiff = document.getElementById("chart-difficulties-3d");
  if (elDiff && !elDiff.chartInstance) {
    elDiff.chartInstance = Highcharts.chart('chart-difficulties-3d', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        margin: [25, 20, 50, 45],
        options3d: {
          enabled: true,
          alpha: -5,
          beta: 0,
          depth: 35,
          viewDistance: 25
        }
      },
      title: { text: null },
      xAxis: {
        categories: [
          'Chưa rõ CLB',
          'Trùng lịch học',
          'Trôi bài MXH',
          'Thủ tục khó',
          'Mơ hồ Cert',
          'Nhiễu kênh tin'
        ],
        labels: {
          style: { fontSize: '11px', color: '#1E293B', fontWeight: '600', whiteSpace: 'nowrap' },
          autoRotation: false,
          rotation: 0
        }
      },
      yAxis: {
        title: { text: 'Tỷ lệ sinh viên (%)' },
        max: 75,
        labels: { format: '{value}%' }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ sinh viên gặp khó khăn: <b>{point.y}%</b> ({point.count} SV)'
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          depth: 35,
          colorByPoint: true,
          colors: ['#002B7F', '#1E4ED8', '#2563EB', '#D97706', '#059669', '#64748B'],
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
            style: { fontSize: '11px', fontWeight: 'bold', color: '#0F172A', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { y: 65.7, count: 69 },
          { y: 62.9, count: 66 },
          { y: 48.6, count: 51 },
          { y: 35.2, count: 37 },
          { y: 31.4, count: 33 },
          { y: 28.6, count: 30 }
        ]
      }]
    });
    add3DRotation(elDiff.chartInstance);
  }

  // 4. Chart 3D Readiness (3D Donut - 5° tilt, pure geometric circle)
  const elReady = document.getElementById("chart-readiness-3d");
  if (elReady && !elReady.chartInstance) {
    elReady.chartInstance = Highcharts.chart('chart-readiness-3d', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 15, 10],
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 0
        }
      },
      title: { text: null },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ: <b>{point.y:.1f}%</b> ({point.count} SV)'
      },
      plotOptions: {
        pie: {
          innerSize: '55%',
          depth: 18,
          size: '78%',
          center: ['50%', '48%'],
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 14,
            format: '<b>{point.name}</b><br><span style="color:#002B7F;font-weight:700">{point.y}%</span>',
            style: { fontSize: '11px', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { name: 'Sẵn sàng dùng nếu tiện lợi', y: 34.3, count: 36, color: '#002B7F', sliced: true, selected: true },
          { name: 'Chưa chắc chắn, cần tìm hiểu', y: 18.1, count: 19, color: '#059669' },
          { name: 'Cân nhắc tùy tính năng', y: 16.2, count: 17, color: '#D97706' },
          { name: 'Không có nhu cầu', y: 16.2, count: 17, color: '#94A3B8' },
          { name: 'Rất sẵn sàng thường xuyên', y: 15.2, count: 16, color: '#10B981' }
        ]
      }]
    });
    add3DRotation(elReady.chartInstance);
  }

  // 5. Chart 3D Cert Understanding (3D Pie - 5° tilt, pure geometric circle)
  const elCert = document.getElementById("chart-cert-understanding-3d");
  if (elCert && !elCert.chartInstance) {
    elCert.chartInstance = Highcharts.chart('chart-cert-understanding-3d', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 15, 10],
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 0
        }
      },
      title: { text: null },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ: <b>{point.y:.1f}%</b> ({point.count} SV)'
      },
      plotOptions: {
        pie: {
          depth: 18,
          size: '78%',
          center: ['50%', '48%'],
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 14,
            format: '<b>{point.name}</b><br><span style="color:#002B7F;font-weight:700">{point.y}%</span>',
            style: { fontSize: '11px', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { name: 'Đã hiểu rất rõ & có chiến lược', y: 17.1, count: 18, color: '#059669' },
          { name: 'Hiểu cơ bản tiêu chí', y: 58.1, count: 61, color: '#002B7F', sliced: true, selected: true },
          { name: 'Mơ hồ hoặc chưa rõ quy chế', y: 24.8, count: 26, color: '#DC2626' }
        ]
      }]
    });
    add3DRotation(elCert.chartInstance);
  }

  // 6. Chart 3D Recruitment Schedule (3D Column - Tilted from below upwards 5°: alpha = -5, beta = 0)
  const elRecruit = document.getElementById("chart-recruitment-3d");
  if (elRecruit && !elRecruit.chartInstance) {
    elRecruit.chartInstance = Highcharts.chart('chart-recruitment-3d', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        margin: [25, 20, 50, 45],
        options3d: {
          enabled: true,
          alpha: -5,
          beta: 0,
          depth: 35,
          viewDistance: 25
        }
      },
      title: { text: null },
      xAxis: {
        categories: [
          'Chưa nắm được',
          'Nắm 1 vài CLB',
          'Nắm rất rõ'
        ],
        labels: {
          style: { fontSize: '11px', color: '#1E293B', fontWeight: '600', whiteSpace: 'nowrap' },
          autoRotation: false,
          rotation: 0
        }
      },
      yAxis: {
        title: { text: 'Tỷ lệ sinh viên (%)' },
        max: 60,
        labels: { format: '{value}%' }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px;font-weight:bold">{point.key}</span><br>',
        pointFormat: 'Tỷ lệ: <b>{point.y}%</b> ({point.count} SV)'
      },
      legend: { enabled: false },
      plotOptions: {
        column: {
          depth: 35,
          colorByPoint: true,
          colors: ['#DC2626', '#D97706', '#059669'],
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
            style: { fontSize: '11px', fontWeight: 'bold', color: '#0F172A', textOutline: 'none' }
          }
        }
      },
      series: [{
        name: 'Tỷ lệ',
        data: [
          { y: 50.5, count: 53 },
          { y: 35.2, count: 37 },
          { y: 14.3, count: 15 }
        ]
      }]
    });
    add3DRotation(elRecruit.chartInstance);
  }
}

// ==========================================
// 5. CÂU HỎI THƯỜNG GẶP (FAQ)
// ==========================================
function initFaqAccordion() {
  const container = document.getElementById("faq-accordion-container");
  if (!container) return;
  // If already pre-rendered, nothing needed, or we can refresh
  initLucide();
}

function toggleFaq(index) {
  const answer = document.getElementById(`faq-answer-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  if (!answer || !icon) return;

  const isHidden = answer.classList.contains("hidden");
  if (isHidden) {
    answer.classList.remove("hidden");
    icon.style.transform = "rotate(180deg)";
  } else {
    answer.classList.add("hidden");
    icon.style.transform = "rotate(0deg)";
  }
}

// ==========================================
// 6. BIỂU MẪU GÓP Ý ẨN DANH (FEEDBACK FORM)
// ==========================================
function initFeedbackForm() {
  const form = document.getElementById("anonymous-feedback-form");
  const starInputs = document.querySelectorAll(".star-rating-btn");
  let selectedRating = 5;

  if (starInputs) {
    starInputs.forEach(btn => {
      btn.addEventListener("click", function() {
        selectedRating = parseInt(this.dataset.star, 10);
        document.getElementById("feedback-rating-val").value = selectedRating;
        updateStarDisplay(selectedRating);
      });
    });
  }

  function updateStarDisplay(rating) {
    starInputs.forEach(btn => {
      const val = parseInt(btn.dataset.star, 10);
      const icon = btn.querySelector("i");
      if (val <= rating) {
        btn.classList.add("text-amber-400");
        btn.classList.remove("text-slate-300");
        if (icon) icon.classList.add("fill-current");
      } else {
        btn.classList.remove("text-amber-400");
        btn.classList.add("text-slate-300");
        if (icon) icon.classList.remove("fill-current");
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const userRole = document.getElementById("feedback-role") ? document.getElementById("feedback-role").value : "Sinh viên";
      const rating = document.getElementById("feedback-rating-val") ? document.getElementById("feedback-rating-val").value : 5;
      const primaryNeed = document.getElementById("feedback-feature") ? document.getElementById("feedback-feature").value : "Event Hub";
      const comment = document.getElementById("feedback-comment") ? document.getElementById("feedback-comment").value.trim() : "";

      if (!comment) {
        showToast("Vui lòng nhập vài dòng ý kiến đóng góp của bạn nhé!", "warning");
        return;
      }

      const newFeedback = {
        id: "fb-" + Date.now(),
        date: new Date().toLocaleString("vi-VN"),
        role: userRole,
        rating: rating,
        feature: primaryNeed,
        comment: comment
      };

      state.feedbacks.unshift(newFeedback);
      localStorage.setItem("ulis_feedbacks", JSON.stringify(state.feedbacks));

      form.reset();
      updateStarDisplay(5);
      showFeedbackSuccessModal(newFeedback);
      showToast("Cảm ơn bạn! Ý kiến đóng góp ẩn danh đã được ghi nhận.", "success");
    });
  }
}

function showFeedbackSuccessModal(feedback) {
  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-8 text-center animate-fade-in">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <i data-lucide="check-circle-2" class="w-10 h-10"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">Góp ý ẩn danh thành công!</h3>
      <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">
        Nhóm 109 - Lớp FLF1007 xin chân thành cảm ơn ý kiến quý báu của bạn. Mọi đóng góp sẽ được tổng hợp cho đợt báo cáo kết quả thử nghiệm dự án ULIS Vibe vào tháng 12/2026.
      </p>

      <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 mb-6 space-y-1">
        <p><strong>Đối tượng:</strong> ${feedback.role}</p>
        <p><strong>Đánh giá:</strong> ${feedback.rating} / 5 sao</p>
        <p><strong>Tính năng quan tâm:</strong> ${feedback.feature}</p>
        <p><strong>Nội dung đóng góp:</strong> "${feedback.comment}"</p>
      </div>

      <button onclick="closeModal()" class="px-6 py-2.5 bg-blue-800 text-white font-bold rounded-xl text-sm hover:bg-blue-900 transition">
        Tiếp tục trải nghiệm ULIS Vibe
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  initLucide();
}

// ==========================================
// 7. KẾ HOẠCH TRIỂN KHAI, TRUYỀN THÔNG & NHÓM 109
// ==========================================
function initRoadmapAndTeam() {
  const btnTimeline = document.getElementById("btn-view-roadmap-timeline");
  const btnTable = document.getElementById("btn-view-roadmap-table");
  const viewTimeline = document.getElementById("roadmap-timeline-view");
  const viewTable = document.getElementById("roadmap-table-view");

  if (btnTimeline && btnTable && viewTimeline && viewTable) {
    btnTimeline.addEventListener("click", () => {
      btnTimeline.classList.add("bg-white", "text-blue-950", "shadow-2xs", "font-bold");
      btnTimeline.classList.remove("text-slate-600");
      btnTable.classList.remove("bg-white", "text-blue-950", "shadow-2xs", "font-bold");
      btnTable.classList.add("text-slate-600");
      viewTimeline.classList.remove("hidden");
      viewTable.classList.add("hidden");
    });

    btnTable.addEventListener("click", () => {
      btnTable.classList.add("bg-white", "text-blue-950", "shadow-2xs", "font-bold");
      btnTable.classList.remove("text-slate-600");
      btnTimeline.classList.remove("bg-white", "text-blue-950", "shadow-2xs", "font-bold");
      btnTimeline.classList.add("text-slate-600");
      viewTable.classList.remove("hidden");
      viewTimeline.classList.add("hidden");
    });
  }
  initLucide();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDateVietnamese(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (toastIcon) {
    if (type === "success") {
      toastIcon.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i>`;
    } else if (type === "warning") {
      toastIcon.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i>`;
    } else {
      toastIcon.innerHTML = `<i data-lucide="info" class="w-5 h-5 text-blue-400"></i>`;
    }
    initLucide();
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Xuất ra window
window.openEventModal = openEventModal;
window.openClubModal = openClubModal;
window.toggleSaveEvent = toggleSaveEvent;
window.openSavedEventsModal = openSavedEventsModal;
window.closeModal = closeModal;
window.filterEventsByCert = filterEventsByCert;
window.resetEventFilters = resetEventFilters;
window.resetClubFilters = resetClubFilters;
window.changeCalendarMonth = changeCalendarMonth;
window.toggleFaq = toggleFaq;
