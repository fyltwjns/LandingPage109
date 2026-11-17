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
    let typeBadgeClass = "bg-slate-100 text-slate-800 border border-slate-200";
    if (ev.type === "recruitment") {
      typeBadgeClass = "bg-purple-100 text-purple-950 border border-purple-200";
    }
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
    let dayNumClass = "text-slate-800";
    if (isToday) {
      dayNumClass = "w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center -ml-1 -mt-1";
    } else if (hasEvents) {
      dayNumClass = "text-blue-950 font-extrabold";
    }

    calendarHtml += `
      <div class="min-h-[105px] p-2 rounded-xl border ${hasEvents ? 'bg-blue-50/30 border-blue-200 hover:border-blue-400 cal-day-active' : 'bg-white border-slate-200'} flex flex-col justify-between transition group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold ${dayNumClass}">
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

// Helper to open modal cleanly with zero scroll leakage and body scroll lock
function openModal(htmlContent) {
  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = htmlContent;
  modal.scrollTop = 0;
  requestAnimationFrame(() => {
    modal.scrollTop = 0;
  });
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
  initLucide();
}

function closeModal() {
  const modal = document.getElementById("app-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.scrollTop = 0;
  }
  document.body.classList.remove("overflow-hidden");
}

// ESC key to close modal
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

function openEventModal(eventId) {
  const ev = ULIS_DATA.events.find(e => e.id === eventId);
  if (!ev) return;

  const certBadgeClass = ev.certType === "A1" ? "badge-a1" : ev.certType === "A2" ? "badge-a2" : "badge-a3";
  const isSaved = state.savedEvents.includes(ev.id);
  const bookmarkBtnClass = isSaved
    ? "bg-amber-100 border-amber-300 text-amber-950 font-bold"
    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100";

  const html = `
    <div class="relative overflow-hidden rounded-3xl flex flex-col bg-white">
      <!-- Modal Banner Image (Strict framing, 100% full uncropped graphic artwork) -->
      <div class="w-full aspect-video max-h-72 bg-slate-950 relative overflow-hidden rounded-t-3xl flex items-center justify-center shrink-0">
        <img src="./assets/events/${ev.id}.webp" alt="${ev.title}" class="w-full h-full object-contain" onerror="this.onerror=null; this.src='./assets/events/${ev.id}.png';" />
        <button onclick="closeModal()" class="absolute top-3.5 right-3.5 p-2 text-white bg-slate-900/60 hover:bg-slate-900/90 rounded-xl backdrop-blur-md transition shadow-md cursor-pointer z-10" aria-label="Đóng cửa sổ">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Title & Classification Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 bg-white">
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
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">${ev.title}</h3>
        </div>
      </div>

      <!-- Main Body Content (Natural flow, fully expanded, zero overlap) -->
      <div class="p-5 sm:p-6 space-y-5 bg-white">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 sm:p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-700 border border-slate-100">
          <div class="flex items-center gap-2">
            <i data-lucide="building" class="w-4 h-4 text-blue-600 shrink-0"></i>
            <span><strong>Đơn vị:</strong> ${ev.organizer}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-blue-600 shrink-0"></i>
            <span><strong>Thời gian:</strong> ${formatDateVietnamese(ev.date)} (${ev.time})</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-red-500 shrink-0"></i>
            <span><strong>Địa điểm:</strong> ${ev.location}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="clock" class="w-4 h-4 text-amber-500 shrink-0"></i>
            <span><strong>Hạn đăng ký:</strong> ${ev.registrationDeadline}</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Mô tả chương trình</h4>
          <p class="text-sm text-slate-600 leading-relaxed">${ev.description}</p>
        </div>

        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
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
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i> Yêu cầu tham gia
          </h4>
          <p class="text-sm text-slate-600">${ev.requirements}</p>
        </div>

        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span class="inline-block px-2 py-0.5 bg-blue-700 text-white rounded text-[11px] font-bold uppercase mb-1">Tính năng thử nghiệm</span>
            <h5 class="text-sm font-bold text-slate-900">Mã QR Check-in Thông Minh</h5>
            <p class="text-xs text-slate-600">Dùng mã này khi đến tham dự sự kiện tại hội trường để ghi nhận điểm danh tự động.</p>
          </div>
          <div class="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center shadow-2xs">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ulis.vnu.edu.vn/vibe/checkin?id=${ev.id}" alt="QR Checkin" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <!-- Natural Unfolded Footer (Xổ hết ra, không thu gọn, không chồng lấn nội dung) -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
        <button onclick="toggleSaveEvent('${ev.id}'); openEventModal('${ev.id}');" class="px-4 py-2.5 border rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${bookmarkBtnClass}">
          <i data-lucide="bookmark" class="w-4 h-4 ${isSaved ? 'fill-current' : ''}"></i>
          ${isSaved ? 'Đã lưu trong mục quan tâm' : 'Lưu vào mục quan tâm'}
        </button>

        <div class="flex items-center gap-2 sm:gap-3">
          <button onclick="closeModal()" class="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition cursor-pointer">
            Đóng
          </button>
          <a href="${ev.formUrl || '#'}" target="_blank" rel="noopener noreferrer" class="px-5 sm:px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm">
            Mở đơn đăng ký chính thức <i data-lucide="external-link" class="w-4 h-4 text-amber-400"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  openModal(html);
}

function openSavedEventsModal() {
  const savedList = ULIS_DATA.events.filter(e => state.savedEvents.includes(e.id));

  const html = `
    <div class="relative overflow-hidden rounded-3xl flex flex-col bg-white">
      <!-- Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <i data-lucide="bookmark" class="w-5 h-5 text-amber-500 fill-current"></i>
          Danh sách sự kiện đã lưu (${savedList.length})
        </h3>
        <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition shrink-0 cursor-pointer" aria-label="Đóng">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto bg-white">
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
              <button onclick="openEventModal('${ev.id}')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer">
                Xem
              </button>
              <button onclick="toggleSaveEvent('${ev.id}'); openSavedEventsModal();" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Xóa">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl text-right">
        <button onclick="closeModal()" class="px-5 py-2 bg-blue-950 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition cursor-pointer">
          Xong
        </button>
      </div>
    </div>
  `;

  openModal(html);
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

  const badgeColor = club.category === "academic" ? "bg-blue-100 text-blue-800 border-blue-200" :
                     club.category === "talents" ? "bg-amber-100 text-amber-800 border-amber-200" :
                     "bg-emerald-100 text-emerald-800 border-emerald-200";

  const html = `
    <div class="relative overflow-hidden rounded-3xl flex flex-col bg-white">
      <!-- Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-white">
        <div>
          <span class="px-2.5 py-1 text-xs font-bold rounded-lg border ${badgeColor} inline-block mb-2">
            ${club.categoryName} • ${club.acronym}
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">${club.name}</h3>
          <p class="text-xs sm:text-sm text-blue-800 font-medium italic mt-1">"${club.slogan}"</p>
        </div>
        <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition shrink-0 cursor-pointer" aria-label="Đóng">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body (Natural expanded flow, perfectly spaced) -->
      <div class="p-5 sm:p-6 space-y-4 sm:space-y-5 bg-white">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Giới thiệu tổng quan</h4>
          <p class="text-sm text-slate-700 leading-relaxed">${club.description}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Các hoạt động thường niên</h4>
          <div class="space-y-2">
            ${club.activities.map(act => `
              <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <i data-lucide="check" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
                <span>${act}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div class="p-3.5 sm:p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h5 class="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <i data-lucide="users" class="w-4 h-4 text-blue-700"></i> Đối tượng phù hợp
            </h5>
            <p class="text-xs text-slate-700 leading-relaxed">${club.targetAudience}</p>
          </div>
          <div class="p-3.5 sm:p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <h5 class="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <i data-lucide="calendar" class="w-4 h-4 text-amber-700"></i> Thời điểm tuyển quân
            </h5>
            <p class="text-xs text-slate-700 leading-relaxed">${club.recruitmentPeriod}</p>
            <span class="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              ${club.currentStatus}
            </span>
          </div>
        </div>

        <div class="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200">
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

      <!-- Natural Unfolded Footer (Xổ hết ra, không che lấp, không thu gọn) -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between">
        <button onclick="closeModal()" class="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition cursor-pointer">
          Đóng
        </button>
        <a href="${club.formLink}" target="_blank" rel="noopener noreferrer" class="px-5 sm:px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm">
          Nộp đơn gia nhập CLB <i data-lucide="external-link" class="w-4 h-4 text-amber-400"></i>
        </a>
      </div>
    </div>
  `;

  openModal(html);
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

          <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
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
                <div class="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-sm font-medium text-blue-950 flex items-center gap-2">
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
            <button onclick="filterEventsByCert('${cert.type}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-2 transition">
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
      <div class="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl animate-fade-in text-sm text-blue-950">
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
  if (document.getElementById("chart-missed-3d")) {
    renderInteractiveCharts();
  }
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
  const html = `
    <div class="p-8 text-center animate-fade-in">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 shadow-xs">
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

      <button onclick="closeModal()" class="px-6 py-2.5 bg-blue-800 text-white font-bold rounded-xl text-sm hover:bg-blue-900 transition cursor-pointer">
        Tiếp tục trải nghiệm ULIS Vibe
      </button>
    </div>
  `;

  openModal(html);
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
window.showToast = showToast;

// ==========================================
// 8. TÍNH NĂNG MÔ PHỎNG CỔNG SỰ KIỆN YOUTH.IS.VNU
// ==========================================

// A. Bộ lọc trạng thái sự kiện (Đang mở đơn / Sắp diễn ra / Tất cả)
function filterEventsByStatus(status) {
  // Update active pill styling
  document.querySelectorAll('.event-filter-pill').forEach(btn => {
    btn.classList.remove('bg-[#0B2341]', 'text-white', 'shadow-2xs');
    btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  });

  const activeBtn = event ? event.currentTarget : null;
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    activeBtn.classList.add('bg-[#0B2341]', 'text-white', 'shadow-2xs');
  }

  const cards = document.querySelectorAll('.event-card-item');
  let visibleCount = 0;

  cards.forEach(card => {
    const eventId = card.getAttribute('data-event-id');
    const ev = ULIS_DATA.events.find(e => e.id === eventId);
    let match = true;

    if (status === 'open') {
      match = ev && ev.status === 'open';
    } else if (status === 'closing_soon') {
      match = ev && ev.status === 'closing_soon';
    }

    if (match) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  const countBadge = document.getElementById('events-count-badge');
  if (countBadge) {
    countBadge.textContent = `${visibleCount} sự kiện hiển thị`;
  }
}
window.filterEventsByStatus = filterEventsByStatus;

// B. Chuyển đổi Tab Bảng Vinh Danh (Tháng / Học Kỳ)
function switchLeaderboardTab(type) {
  const btnMonth = document.getElementById('tab-lb-month');
  const btnTerm = document.getElementById('tab-lb-term');
  if (!btnMonth || !btnTerm) return;

  if (type === 'month') {
    btnMonth.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B2341] text-white transition shadow-2xs';
    btnTerm.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-950 transition';
    showToast('Đang hiển thị Bảng vinh danh Tháng 11/2026', 'info');
  } else {
    btnTerm.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B2341] text-white transition shadow-2xs';
    btnMonth.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-950 transition';
    showToast('Đang hiển thị Bảng vinh danh tích lũy toàn Học Kỳ I (2026-2027)', 'info');
  }
}
window.switchLeaderboardTab = switchLeaderboardTab;

// C. Modal Thông Báo / Tin Tức Chi Tiết
const NEWS_DATA = {
  'news-01': {
    title: 'Kế Hoạch Xét Cấp Chứng Nhận Ngoại Khóa A1 - A2 - A3 Học Kỳ I (2026 - 2027)',
    date: '15/11/2026',
    unit: 'Phòng Chính trị & Công tác HSSV • Trường Đại học Ngoại ngữ',
    img: './assets/news/news-01.webp',
    content: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p class="font-semibold text-slate-900">Kính gửi toàn thể sinh viên các khóa QH2023, QH2024, QH2025 và QH2026,</p>
        <p>Nhằm chuẩn hóa việc thẩm định và công nhận quyền lợi tham gia hoạt động ngoại khóa, Phòng CT&CT HSSV phối hợp cùng Đoàn Thanh niên – Hội Sinh viên thông báo kế hoạch nộp và xét cấp chứng nhận A1, A2, A3 cho Học kỳ I năm học 2026 – 2027 như sau:</p>
        <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
          <p><strong>1. Thời gian mở cổng nộp minh chứng:</strong> Từ ngày 01/12/2026 đến hết 23:59 ngày 25/12/2026.</p>
          <p><strong>2. Hình thức nộp:</strong> Trực tuyến qua hệ thống ULIS Vibe hoặc cổng dịch vụ sinh viên.</p>
          <p><strong>3. Thời gian công bố kết quả:</strong> Dự kiến ngày 10/01/2027.</p>
        </div>
        <p>Sinh viên lưu ý kiểm tra đối chiếu mã hoạt động với <strong>Cert Hub</strong> trên ULIS Vibe để nộp đúng danh mục minh chứng, tránh sai sót khi xét học bổng khuyến khích học tập.</p>
      </div>
    `
  },
  'news-02': {
    title: 'Phát Động Chiến Dịch "Sinh Viên 5 Tốt" & Tháng Rèn Luyện Sinh Viên ULIS 2026',
    date: '10/11/2026',
    unit: 'Đoàn TNCS Hồ Chí Minh – Hội Sinh viên ULIS',
    img: './assets/news/news-02.webp',
    content: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p class="font-semibold text-slate-900">Chào mừng Năm học 2026 - 2027 và phong trào thi đua cao điểm sinh viên,</p>
        <p>Đoàn Thanh niên - Hội Sinh viên Trường Đại học Ngoại ngữ chính thức phát động chiến dịch "Sinh viên 5 Tốt" cấp trường và cấp ĐHQGHN với 5 tiêu chí toàn diện: <strong>Đạo đức tốt - Học tập tốt - Thể lực tốt - Tình nguyện tốt - Hội nhập tốt</strong>.</p>
        <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
          <p><strong>• Chuỗi 15 hội thảo chuyên môn:</strong> Hỗ trợ sinh viên hoàn thành tiêu chí Học tập tốt (Cert A1).</p>
          <p><strong>• Hoạt động tình nguyện Ba Vì:</strong> Tích lũy 01 chứng nhận A3 và 15 ngày công tình nguyện.</p>
          <p><strong>• Quyền lợi đặc biệt:</strong> Ưu tiên xét học bổng Thắp sáng tương lai, vé trao đổi quốc tế.</p>
        </div>
      </div>
    `
  },
  'news-03': {
    title: 'Khai Mạc Tuần Lễ Văn Hóa Quốc Tế & Chung Kết Hùng Biện Ngoại Ngữ 2026',
    date: '05/11/2026',
    unit: 'Hội Sinh viên Trường Đại học Ngoại ngữ - ĐHQGHN',
    img: './assets/news/news-03.webp',
    content: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p class="font-semibold text-slate-900">Sự kiện văn hóa thường niên lớn nhất trường đã chính thức mở màn!</p>
        <p>Tuần lễ Văn hóa Quốc tế 2026 quy tụ hơn 30 gian hàng truyền thống từ các khoa ngôn ngữ: Anh, Pháp, Nga, Trung, Đức, Nhật, Hàn và khoa Ngôn ngữ & Văn hóa các nước Ả Rập.</p>
        <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
          <p><strong>• Địa điểm:</strong> Khuôn viên Sân A1-A2 & Hội trường Vũ Đình Liên.</p>
          <p><strong>• Quyền lợi tham gia:</strong> Cấp Giấy chứng nhận ngoại khóa chuẩn A2 (Kỹ năng & Hội nhập quốc tế) + 5 điểm rèn luyện.</p>
        </div>
      </div>
    `
  }
};

function openNewsModal(newsId) {
  const item = NEWS_DATA[newsId];
  if (!item) return;

  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="relative">
      <div class="aspect-video w-full overflow-hidden bg-slate-950">
        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover" />
      </div>
      <button onclick="closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition backdrop-blur-md">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>
    <div class="p-6 sm:p-8">
      <div class="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">TIN TỨC CHÍNH THỨC</span>
        <span>${item.date}</span>
        <span>•</span>
        <span>${item.unit}</span>
      </div>
      <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 leading-tight">
        ${item.title}
      </h3>
      ${item.content}
      <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
        <a href="#event-hub" onclick="closeModal()" class="text-xs font-bold text-blue-900 hover:underline">
          ← Khám phá các sự kiện liên quan
        </a>
        <button onclick="closeModal()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition">
          Đóng thông báo
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  initLucide();
}
window.openNewsModal = openNewsModal;

// D. Modal Đăng Nhập VNU Mail (@vnu.edu.vn - Mô phỏng SSO ĐHQGHN)
function openLoginModal() {
  const modal = document.getElementById("app-modal");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-6 sm:p-8">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div class="flex items-center gap-3">
          <img src="./assets/ulis-logo.png" alt="ULIS Logo" class="w-10 h-10 object-contain" />
          <div>
            <h3 class="text-lg font-black text-[#0B2341]">CỔNG ĐĂNG NHẬP VNU MAIL</h3>
            <p class="text-[11px] text-slate-500 font-medium">Xác thực tài khoản sinh viên ĐHQGHN</p>
          </div>
        </div>
        <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="space-y-4">
        <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2.5">
          <i data-lucide="shield-check" class="w-5 h-5 text-blue-800 shrink-0 mt-0.5"></i>
          <div>
            <p class="font-bold">Đăng nhập một điểm chạm (Single Sign-On):</p>
            <p class="text-blue-900 mt-0.5 leading-relaxed">Sử dụng địa chỉ email sinh viên do Trường cấp (<strong class="underline">@vnu.edu.vn</strong>) để tự động đồng bộ hóa hồ sơ ngoại khóa, tích lũy điểm rèn luyện và nhận thông báo mở đợt tuyển quân CLB.</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Tài khoản VNU Email:</label>
          <div class="relative">
            <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input type="email" id="vnu-login-email" placeholder="msv@vnu.edu.vn (Ví dụ: 24040123@vnu.edu.vn)" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-800 uppercase mb-1.5">Mật khẩu:</label>
          <div class="relative">
            <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input type="password" id="vnu-login-pass" placeholder="••••••••" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white" />
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-600">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked class="rounded border-slate-300 text-blue-900 focus:ring-blue-900" />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" onclick="showToast('Vui lòng liên hệ Phòng CT&CT HSSV hoặc TT CNTT để cấp lại mật khẩu VNU Mail.', 'info')" class="text-blue-900 hover:underline">Quên mật khẩu?</a>
        </div>

        <button onclick="handleVnuLoginSubmit()" class="w-full py-3 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm">
          <i data-lucide="log-in" class="w-4 h-4 text-amber-400"></i> Đăng nhập qua VNU SSO
        </button>

        <div class="relative flex items-center justify-center py-2">
          <span class="absolute inset-x-0 h-px bg-slate-200"></span>
          <span class="relative bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">Hoặc</span>
        </div>

        <button onclick="handleGuestDemoLogin()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
          <i data-lucide="sparkles" class="w-4 h-4 text-blue-800"></i> Trải nghiệm nhanh với Tài khoản Khách (Demo K58)
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  initLucide();
}
window.openLoginModal = openLoginModal;

function handleVnuLoginSubmit() {
  const emailInput = document.getElementById("vnu-login-email");
  const val = emailInput ? emailInput.value.trim() : "";
  if (!val || !val.includes("@")) {
    showToast("Vui lòng nhập định dạng email hợp lệ (@vnu.edu.vn)!", "warning");
    return;
  }
  closeModal();
  showToast(`Xin chào sinh viên ${val.split('@')[0]}! Đã đăng nhập thành công vào cổng ULIS Vibe.`, "success");
}
window.handleVnuLoginSubmit = handleVnuLoginSubmit;

function handleGuestDemoLogin() {
  closeModal();
  showToast("Đã đăng nhập tài khoản Trải nghiệm: Nguyễn Minh Châu (QH2024.F1) • 98 ĐRL", "success");
}
window.handleGuestDemoLogin = handleGuestDemoLogin;

// E. Header search input sync
document.addEventListener("DOMContentLoaded", () => {
  const headerSearchInput = document.getElementById("header-search-input");
  const mobileSearchInput = document.getElementById("mobile-search-input");

  function syncSearch(query) {
    const mainSearch = document.getElementById("search-event-input");
    if (mainSearch) {
      mainSearch.value = query;
      // Trigger search filter
      const event = new Event('input', { bubbles: true });
      mainSearch.dispatchEvent(event);
    }
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener("input", (e) => syncSearch(e.target.value));
    headerSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const el = document.getElementById("event-hub");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", (e) => syncSearch(e.target.value));
    mobileSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const el = document.getElementById("event-hub");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});


// ====================================================
// 9. CHATBOT AI ASSISTANT (6-PHASE GUIDED CONVERSATION)
// ====================================================

let chatbotState = {
  isOpen: false,
  branch: null, // 'A_SCHOLARSHIP', 'B_CLUB', 'C_RESCUE', 'D_SENIOR', 'E_COMPLAINT'
  phase: 0,    // 0: Greeting, 1..6: Specific phases
  answers: {},
  history: []
};

function toggleChatbot() {
  const windowEl = document.getElementById("chatbot-window");
  if (!windowEl) return;
  chatbotState.isOpen = !chatbotState.isOpen;
  if (chatbotState.isOpen) {
    windowEl.classList.add("open");
    // If empty, init greeting
    const msgContainer = document.getElementById("chatbot-messages");
    if (msgContainer && msgContainer.children.length === 0) {
      startChatbotPhase0();
    }
    setTimeout(() => {
      const input = document.getElementById("chatbot-text-input");
      if (input) input.focus();
    }, 200);
  } else {
    windowEl.classList.remove("open");
  }
}
window.toggleChatbot = toggleChatbot;

function resetChatbotSession() {
  chatbotState.branch = null;
  chatbotState.phase = 0;
  chatbotState.answers = {};
  const msgContainer = document.getElementById("chatbot-messages");
  if (msgContainer) msgContainer.innerHTML = "";
  startChatbotPhase0();
}
window.resetChatbotSession = resetChatbotSession;

function appendBotMessage(html, chips = []) {
  const msgContainer = document.getElementById("chatbot-messages");
  if (!msgContainer) return;

  // Show typing indicator
  const typingId = "typing-" + Date.now();
  const typingDiv = document.createElement("div");
  typingDiv.id = typingId;
  typingDiv.className = "flex items-start gap-2.5";
  typingDiv.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 text-xs">
      <i data-lucide="bot" class="w-4 h-4"></i>
    </div>
    <div class="bot-msg-bubble flex items-center gap-1.5 py-3">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  msgContainer.appendChild(typingDiv);
  if (window.lucide) lucide.createIcons({ root: typingDiv });
  msgContainer.scrollTop = msgContainer.scrollHeight;

  setTimeout(() => {
    const el = document.getElementById(typingId);
    if (el) el.remove();

    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "flex items-start gap-2.5 animate-fade-in";
    botMsgDiv.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="bot-msg-bubble">
        ${html}
      </div>
    `;
    msgContainer.appendChild(botMsgDiv);
    if (window.lucide) lucide.createIcons({ root: botMsgDiv });
    msgContainer.scrollTop = msgContainer.scrollHeight;

    renderChatbotChips(chips);
  }, 400);
}

function appendUserMessage(text) {
  const msgContainer = document.getElementById("chatbot-messages");
  if (!msgContainer) return;

  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "flex justify-end animate-fade-in";
  userMsgDiv.innerHTML = `
    <div class="user-msg-bubble">
      ${text}
    </div>
  `;
  msgContainer.appendChild(userMsgDiv);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  // Clear chips while waiting
  renderChatbotChips([]);
}

function renderChatbotChips(chips) {
  const chipsContainer = document.getElementById("chatbot-chips-container");
  if (!chipsContainer) return;
  chipsContainer.innerHTML = "";

  if (!chips || chips.length === 0) {
    chipsContainer.classList.add("hidden");
    return;
  }
  chipsContainer.classList.remove("hidden");

  chips.forEach(chip => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chatbot-chip";
    btn.innerHTML = chip.label;
    btn.onclick = () => handleChipClick(chip);
    chipsContainer.appendChild(btn);
  });
}

// ----------------------------------------------------
// PHASE 0: GREETING & INITIAL GOAL SELECTION
// ----------------------------------------------------
function startChatbotPhase0() {
  chatbotState.phase = 0;
  chatbotState.branch = null;
  chatbotState.answers = {};

  const greetingHtml = `
    <p class="font-bold text-slate-900 mb-1">Xin chào bạn! Mình là ULIS Vibe AI Assistant 🤖</p>
    <p class="text-slate-600 mb-2 leading-relaxed">
      Trợ lý ảo hỗ trợ toàn diện về <strong>Câu lạc bộ</strong>, <strong>Lịch sự kiện</strong>, <strong>Điểm rèn luyện (ĐRL)</strong> và <strong>Chứng nhận A1–A2–A3</strong>.
    </p>
    <div class="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 mb-2 font-medium">
      ✨ <em>Hệ thống tư vấn phân tích chuyên sâu qua <strong>6 Phase</strong> giúp bạn xây dựng lộ trình hành động chính xác nhất.</em>
    </div>
    <p class="text-slate-700 font-semibold">Hôm nay bạn cần trợ lý đồng hành ở mục tiêu nào?</p>
  `;

  const chips = [
    { label: "🎯 A. Săn Học bổng KKHT & ĐRL Xuất sắc (>= 90đ)", branch: "A_SCHOLARSHIP", phase: 1 },
    { label: "👥 B. Tân sinh viên K60 tìm CLB & Tuyển quân", branch: "B_CLUB", phase: 1 },
    { label: "🚨 C. Gỡ Điểm Rèn Luyện khẩn cấp (ĐRL < 65)", branch: "C_RESCUE", phase: 1 },
    { label: "🏆 D. Sinh viên Năm 3-4 chuẩn bị CV & SV5T", branch: "D_SENIOR", phase: 1 },
    { label: "📜 E. Xử lý sự cố minh chứng Cert A1–A3", branch: "E_COMPLAINT", phase: 1 }
  ];

  appendBotMessage(greetingHtml, chips);
}

// ----------------------------------------------------
// STATE MACHINE: 6 PHASES DISPATCHER
// ----------------------------------------------------
function handleChipClick(chip) {
  if (chip.phase === 0) {
    resetChatbotSession();
    return;
  }

  appendUserMessage(chip.label);

  if (chip.branch) {
    chatbotState.branch = chip.branch;
  }
  if (chip.saveKey && chip.saveVal) {
    chatbotState.answers[chip.saveKey] = chip.saveVal;
  }
  chatbotState.phase = chip.phase;

  // Process next step
  processCurrentState();
}

function processCurrentState() {
  const b = chatbotState.branch;
  const p = chatbotState.phase;

  if (b === "A_SCHOLARSHIP") {
    processFlowA(p);
  } else if (b === "B_CLUB") {
    processFlowB(p);
  } else if (b === "C_RESCUE") {
    processFlowC(p);
  } else if (b === "D_SENIOR") {
    processFlowD(p);
  } else if (b === "E_COMPLAINT") {
    processFlowE(p);
  } else {
    startChatbotPhase0();
  }
}

// ====================================================
// LUỒNG A: SĂN HỌC BỔNG & ĐRL XUẤT SẮC (6 PHASES)
// ====================================================
function processFlowA(p) {
  if (p === 1) {
    // Phase 1: Background (Khóa SV)
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 1/6 • Xuất Phát Điểm</span>
      <p class="mt-2 font-semibold text-slate-900">Để tính toán chính xác điều kiện học bổng, bạn cho mình biết bạn đang là sinh viên khóa mấy tại ULIS?</p>
    `;
    const chips = [
      { label: "Sinh viên Năm 1 (Khóa K60)", phase: 2, saveKey: "year", saveVal: "K60" },
      { label: "Sinh viên Năm 2 (Khóa K59)", phase: 2, saveKey: "year", saveVal: "K59" },
      { label: "Sinh viên Năm 3 (Khóa K58)", phase: 2, saveKey: "year", saveVal: "K58" },
      { label: "Sinh viên Năm 4 (Khóa K57)", phase: 2, saveKey: "year", saveVal: "K57" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 2) {
    // Phase 2: Goal (Mức học bổng)
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 2/6 • Mục Tiêu Học Bổng</span>
      <p class="mt-2 font-semibold text-slate-900">Tuyệt vời sinh viên <strong>${chatbotState.answers.year || 'ULIS'}</strong>! Bạn đặt mục tiêu săn học bổng ở mức xếp loại nào trong học kỳ này?</p>
    `;
    const chips = [
      { label: "🥇 Học bổng Xuất sắc (Cần ĐRL >= 90 & GPA >= 3.6)", phase: 3, saveKey: "target", saveVal: "Xuất sắc (90+)" },
      { label: "🥈 Học bổng loại Giỏi (Cần ĐRL >= 80 & GPA >= 3.2)", phase: 3, saveKey: "target", saveVal: "Giỏi (80+)" },
      { label: "🥉 Duy trì mức Khá an toàn (ĐRL 70 - 79 điểm)", phase: 3, saveKey: "target", saveVal: "Khá (70+)" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 3) {
    // Phase 3: Gap Analysis (Khảo sát thiếu hụt)
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 3/6 • Khảo Sát Thiếu Hụt</span>
      <p class="mt-2 font-semibold text-slate-900">Để đạt mục tiêu <strong>${chatbotState.answers.target}</strong>, bạn cần tối đa điểm ở Tiêu chí 1 (Học thuật) và Tiêu chí 2 (Kỹ năng). Hiện tại bạn đã tích lũy được chứng nhận nào chưa?</p>
    `;
    const chips = [
      { label: "Chưa có chứng nhận nào (Bắt đầu từ số 0)", phase: 4, saveKey: "gap", saveVal: "Chưa có chứng nhận" },
      { label: "Đã có Cert A2 (Kỹ năng), đang thiếu Cert A1 (Học thuật)", phase: 4, saveKey: "gap", saveVal: "Thiếu A1" },
      { label: "Đã có Cert A1 (Học thuật), đang thiếu Cert A3 (Tình nguyện)", phase: 4, saveKey: "gap", saveVal: "Thiếu A3" },
      { label: "Đã tham gia sự kiện nhưng chưa nhận được chứng nhận", phase: 4, saveKey: "gap", saveVal: "Chưa duyệt" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 4) {
    // Phase 4: Constraints (Ràng buộc thời gian)
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 4/6 • Ràng Buộc Thời Gian</span>
      <p class="mt-2 font-semibold text-slate-900">Lịch học chuyên ngành ngoại ngữ khá dày. Quỹ thời gian và hình thức tham gia thuận tiện nhất với bạn là gì?</p>
    `;
    const chips = [
      { label: "Sáng cuối tuần (Thứ 7 / CN) tham gia trực tiếp tại trường", phase: 5, saveKey: "time", saveVal: "Cuối tuần trực tiếp" },
      { label: "Chỉ rảnh buổi tối trong tuần (Ưu tiên Online Zoom)", phase: 5, saveKey: "time", saveVal: "Tối Online" },
      { label: "Thời gian linh hoạt, sự kiện chất lượng là mình tham gia", phase: 5, saveKey: "time", saveVal: "Linh hoạt" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 5) {
    // Phase 5: Strategy Selection (Chọn gói giải pháp)
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 5/6 • Lựa Chọn Chiến Lược</span>
      <p class="mt-2 font-semibold text-slate-900">Dựa trên điều kiện <strong>${chatbotState.answers.time}</strong>, mình đề xuất 2 gói chiến lược lấy chứng nhận chuẩn hóa. Bạn chọn hướng nào?</p>
    `;
    const chips = [
      { label: "Chiến lược 1: Tham gia Hội thảo NCKH Sunwah (Nghe báo cáo 1 buổi, lấy ngay Cert A1)", phase: 6, saveKey: "strat", saveVal: "Hội thảo NCKH (ev-01)" },
      { label: "Chiến lược 2: Thi Hùng biện English Challenge (Lấy Cert A1 + cơ hội đạt giải)", phase: 6, saveKey: "strat", saveVal: "English Challenge (ev-03)" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 6) {
    // Phase 6: Action Plan (Kế hoạch hành động chi tiết)
    const eventId = chatbotState.answers.strat && chatbotState.answers.strat.includes("ev-03") ? "ev-03" : "ev-01";
    const ev = ULIS_DATA.events.find(e => e.id === eventId) || ULIS_DATA.events[0];

    const html = `
      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded font-bold text-[10px] uppercase">Phase 6/6 • Kế Hoạch Hành Động Toàn Diện</span>
      <h4 class="font-extrabold text-slate-900 text-sm mt-2 mb-2">🎯 LỘ TRÌNH SĂN HỌC BỔNG XUẤT SẮC DÀNH CHO BẠN:</h4>
      
      <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
        <p class="font-bold text-blue-950 flex items-center gap-1.5">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Sự kiện khớp 100%: <strong>${ev.title}</strong>
        </p>
        <p>• <strong>Thời gian:</strong> ${ev.date} (${ev.time})</p>
        <p>• <strong>Địa điểm:</strong> ${ev.location}</p>
        <p>• <strong>Quyền lợi ĐRL:</strong> <span class="badge-a1 px-2 py-0.5 rounded font-bold">+5 Điểm Rèn Luyện (Chuẩn Cert A1)</span></p>
        <p>• <strong>Tình trạng:</strong> Còn ${ev.spotsLeft}/${ev.totalSpots} suất đăng ký.</p>
      </div>

      <div class="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-950 mb-3 space-y-1">
        <p class="font-bold">📊 Điểm Rèn Luyện dự kiến sau khi hoàn thành:</p>
        <p>80đ (Gốc) + 5đ (Cert A1) + 5đ (Cert A2) + 3đ (Chuyên cần) = <strong>93 Điểm (Xếp loại Xuất sắc)</strong> ✨</p>
      </div>

      <p class="text-xs text-slate-600 mb-2">Bạn có thể thực hiện ngay các hành động dưới đây:</p>
      <div class="flex flex-wrap gap-2 pt-1">
        <button onclick="openEventModal('${ev.id}')" class="px-3.5 py-2 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="external-link" class="w-3.5 h-3.5 text-amber-400"></i> Xem & Đăng ký sự kiện
        </button>
        <button onclick="toggleSaveEvent('${ev.id}'); showToast('Đã lưu sự kiện vào danh sách yêu thích!', 'success');" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-600"></i> Lưu sự kiện
        </button>
      </div>
    `;

    const chips = [
      { label: "🔄 Tư vấn mục tiêu khác từ đầu", phase: 0 },
      { label: "📜 Tra cứu thêm khung Cert Hub A1-A2-A3", phase: 1, branch: "E_COMPLAINT" }
    ];

    appendBotMessage(html, chips);
  }
}

// ====================================================
// LUỒNG B: TÂN SINH VIÊN K60 TÌM CLB (6 PHASES)
// ====================================================
function processFlowB(p) {
  if (p === 1) {
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 1/6 • Xác Thực Khóa SV</span>
      <p class="mt-2 font-semibold text-slate-900">Chào mừng bạn đến với ULIS! Bạn là Tân sinh viên K60 mới vào trường đúng không?</p>
    `;
    const chips = [
      { label: "Đúng vậy, mình là Tân sinh viên K60!", phase: 2, saveKey: "role", saveVal: "K60" },
      { label: "Mình là sinh viên khóa trên (K58-K59)", phase: 2, saveKey: "role", saveVal: "Khóa trên" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 2) {
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 2/6 • Định Hướng Nhu Cầu</span>
      <p class="mt-2 font-semibold text-slate-900">ULIS có hơn 50 CLB với 3 nhóm chuyên môn. Bạn muốn gia nhập CLB với kỳ vọng lớn nhất là gì?</p>
    `;
    const chips = [
      { label: "Cải thiện khả năng nói ngoại ngữ & thực hành chuyên môn", phase: 3, saveKey: "interest", saveVal: "Ngoại ngữ" },
      { label: "Thỏa mãn đam mê năng khiếu (Âm nhạc, Nhảy, Tranh biện UDC)", phase: 3, saveKey: "interest", saveVal: "Năng khiếu" },
      { label: "Làm hoạt động tình nguyện vì cộng đồng & phong trào xã hội", phase: 3, saveKey: "interest", saveVal: "Tình nguyện" },
      { label: "Học kỹ năng thực chiến (Truyền thông, thiết kế, sự kiện)", phase: 3, saveKey: "interest", saveVal: "Kỹ năng mềm" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 3) {
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 3/6 • Mức Độ Tự Tin</span>
      <p class="mt-2 font-semibold text-slate-900">Bạn tự đánh giá mức độ tự tin và kinh nghiệm ban đầu của mình thế nào?</p>
    `;
    const chips = [
      { label: "Còn rụt rè, chưa có kinh nghiệm, muốn tìm môi trường cởi mở", phase: 4, saveKey: "level", saveVal: "Mới bắt đầu" },
      { label: "Đã có nền tảng ổn, muốn vào CLB có tính chuyên môn & tổ chức cuộc thi", phase: 4, saveKey: "level", saveVal: "Nâng cao" },
      { label: "Muốn giao lưu văn hóa đa quốc gia (Nhật, Trung, Hàn, Pháp)", phase: 4, saveKey: "level", saveVal: "Văn hóa" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 4) {
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 4/6 • Quỹ Thời Gian</span>
      <p class="mt-2 font-semibold text-slate-900">Năm nhất các môn đại cương khá nhiều bài tập. Bạn có thể dành bao nhiêu thời gian cho CLB mỗi tuần?</p>
    `;
    const chips = [
      { label: "Dưới 3 giờ/tuần (Chỉ sinh hoạt 1 buổi cuối tuần)", phase: 5, saveKey: "timeCommit", saveVal: "Dưới 3h" },
      { label: "Từ 4 - 6 giờ/tuần (Có thể tham gia ban chuyên môn chạy sự kiện)", phase: 5, saveKey: "timeCommit", saveVal: "4-6h" },
      { label: "Nhiệt huyết hết mình, sẵn sàng cống hiến 7+ giờ/tuần", phase: 5, saveKey: "timeCommit", saveVal: "7h+" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 5) {
    const html = `
      <span class="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px] uppercase">Phase 5/6 • Vị Trí Ứng Tuyển</span>
      <p class="mt-2 font-semibold text-slate-900">Để không bị quá tải trong kỳ 1, bạn muốn bắt đầu ở vai trò nào trong đợt tuyển quân này?</p>
    `;
    const chips = [
      { label: "Ứng tuyển Ban Chuyên môn (Sinh hoạt nói tiếng Anh định kỳ)", phase: 6, saveKey: "rolePref", saveVal: "Ban Chuyên môn" },
      { label: "Làm Cộng tác viên (CTV) theo từng sự kiện (Linh hoạt, rảnh thì làm)", phase: 6, saveKey: "rolePref", saveVal: "Cộng tác viên" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 6) {
    const club = ULIS_DATA.clubs.find(c => c.id === "ec") || ULIS_DATA.clubs[0];

    const html = `
      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded font-bold text-[10px] uppercase">Phase 6/6 • Gợi Ý CLB Hoàn Hảo & Tuyển Quân</span>
      <h4 class="font-extrabold text-slate-900 text-sm mt-2 mb-2">🎉 GỢI Ý DÀNH RIÊNG CHO TÂN SINH VIÊN K60:</h4>

      <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold text-blue-950 text-sm">${club.name} (${club.acronym})</span>
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded text-[10px] font-bold">ĐANG MỞ ĐƠN</span>
        </div>
        <p class="text-slate-600 italic">"${club.slogan}"</p>
        <p>• <strong>Quy mô:</strong> 240 thành viên • Trực thuộc HSV ULIS.</p>
        <p>• <strong>Lịch tuyển quân:</strong> ${club.recruitmentPeriod}</p>
        <p>• <strong>Đối tượng phù hợp:</strong> ${club.targetAudience}</p>
      </div>

      <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 mb-3 space-y-1">
        <p class="font-bold">💡 Mẹo phỏng vấn CLB dành cho K60:</p>
        <p>• Không cần quá tự ti về ngữ pháp, BCN đánh giá cao sự nhiệt tình và đúng giờ.</p>
        <p>• Nhấn mạnh mong muốn học hỏi và gắn bó lâu dài.</p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <button onclick="openClubModal('${club.id}')" class="px-3.5 py-2 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="users" class="w-3.5 h-3.5 text-amber-400"></i> Xem chi tiết CLB
        </button>
        <a href="${club.formLink}" target="_blank" class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Điền Form Ứng Tuyển
        </a>
      </div>
    `;

    const chips = [
      { label: "🔄 Khám phá thêm CLB nhóm Năng khiếu / Tình nguyện", phase: 0 },
      { label: "📅 Xem các sự kiện CLB EC đang tổ chức", phase: 1, branch: "A_SCHOLARSHIP" }
    ];

    appendBotMessage(html, chips);
  }
}

// ====================================================
// LUỒNG C: GỠ ĐRL KHẨN CẤP (ĐRL < 65) (6 PHASES)
// ====================================================
function processFlowC(p) {
  if (p === 1) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 1/6 • Khảo Sát Khóa Học</span>
      <p class="mt-2 font-semibold text-slate-900">Chào bạn! Bạn đang học năm thứ mấy tại ULIS?</p>
    `;
    const chips = [
      { label: "Năm 1 (Khóa K60)", phase: 2, saveKey: "year", saveVal: "K60" },
      { label: "Năm 2 (Khóa K59)", phase: 2, saveKey: "year", saveVal: "K59" },
      { label: "Năm 3 (Khóa K58)", phase: 2, saveKey: "year", saveVal: "K58" },
      { label: "Năm 4 (Khóa K57)", phase: 2, saveKey: "year", saveVal: "K57" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 2) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 2/6 • Tình Trạng Điểm Rèn Luyện</span>
      <p class="mt-2 font-semibold text-slate-900">Tình trạng điểm rèn luyện tạm tính hiện tại của bạn đang ở mức nào?</p>
    `;
    const chips = [
      { label: "ĐRL dưới 65 điểm (Nguy cơ xếp loại Yếu, cần cứu gấp)", phase: 3, saveKey: "status", saveVal: "Dưới 65" },
      { label: "ĐRL đang ở mức 65 - 75 điểm (Muốn gỡ lên Giỏi >= 80đ)", phase: 3, saveKey: "status", saveVal: "65-75" },
      { label: "Bị mất điểm do quên nộp minh chứng hoặc quên quét QR", phase: 3, saveKey: "status", saveVal: "Quên QR" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 3) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 3/6 • Xác Định Lỗ Hổng Điểm</span>
      <p class="mt-2 font-semibold text-slate-900">Bạn mở bảng chấm điểm rèn luyện, tiêu chí nào đang bị 0 điểm hoặc rất thấp?</p>
    `;
    const chips = [
      { label: "Tiêu chí 1: Học tập & NCKH (0 điểm, thiếu Cert A1)", phase: 4, saveKey: "missingCrit", saveVal: "Tiêu chí 1" },
      { label: "Tiêu chí 3: Tình nguyện vì cộng đồng (0 điểm, thiếu Cert A3)", phase: 4, saveKey: "missingCrit", saveVal: "Tiêu chí 3" },
      { label: "Bị 0 điểm cả 2 tiêu chí trên (Cần bù gấp ít nhất 10 - 15 điểm)", phase: 4, saveKey: "missingCrit", saveVal: "Cả hai" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 4) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 4/6 • Thời Gian Cứu Điểm</span>
      <p class="mt-2 font-semibold text-slate-900">Cổng xét duyệt rèn luyện sẽ khóa sổ vào cuối kỳ. Bạn có thể tham gia sự kiện vào thời gian nào dưới đây?</p>
    `;
    const chips = [
      { label: "Ngay trong tháng 11/2026 này (Càng sớm càng an tâm)", phase: 5, saveKey: "urgency", saveVal: "Tháng 11" },
      { label: "Đầu tháng 12/2026 trước khi bước vào đợt thi học kỳ", phase: 5, saveKey: "urgency", saveVal: "Tháng 12" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 5) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 5/6 • Gói Cứu Điểm Thần Tốc</span>
      <p class="mt-2 font-semibold text-slate-900">Mình đã tính toán 2 gói cứu điểm thần tốc để bù ngay +12 điểm rèn luyện. Bạn chọn gói nào?</p>
    `;
    const chips = [
      { label: "Gói A: 1 Hội thảo NCKH (+5đ A1) + 1 Sự kiện Tình nguyện (+4đ A3)", phase: 6, saveKey: "pack", saveVal: "Gói A" },
      { label: "Gói B: 1 Tọa đàm Kỹ năng Zoom (+3đ A2) + Ngày hội Văn hóa (+5đ A2)", phase: 6, saveKey: "pack", saveVal: "Gói B" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 6) {
    const html = `
      <span class="px-2 py-0.5 bg-red-100 text-red-950 rounded font-bold text-[10px] uppercase">Phase 6/6 • Lộ Trình Cứu Điểm Hoàn Chỉnh</span>
      <h4 class="font-extrabold text-red-900 text-sm mt-2 mb-2">🚨 KẾ HOẠCH GỠ ĐIỂM RÈN LUYỆN KHẨN CẤP (+12 ĐIỂM):</h4>

      <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
        <p class="font-bold text-slate-900">1. Sự kiện cứu Tiêu chí 1 (Học thuật - Cert A1):</p>
        <p class="text-blue-900 font-semibold">• Hội thảo Phương pháp Viết Báo cáo NCKH Sinh viên 2026 (20/11 - Sunwah).</p>
        <p class="font-bold text-slate-900 mt-2">2. Sự kiện cứu Tiêu chí 3 (Tình nguyện - Cert A3):</p>
        <p class="text-emerald-900 font-semibold">• Chiến dịch Tiếp sức Mùa thi / Tình nguyện Ba Vì (27/11 - Vũ Đình Liên).</p>
      </div>

      <div class="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-950 mb-3 space-y-1">
        <p class="font-bold">⚠️ QUY TẮC BẮT BUỘC ĐỂ KHÔNG BỊ HỦY MINH CHỨNG:</p>
        <p>• Phải quét đủ 02 lần mã QR: QR Check-in lúc đến và QR Check-out lúc về.</p>
        <p>• Điền đúng 100% Mã số sinh viên (MSV) và Email @vnu.edu.vn.</p>
      </div>

      <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 mb-3">
        <strong>Kết quả dự kiến:</strong> 58đ (Hiện tại) + 5đ (A1) + 4đ (A3) + 5đ (Chuyên cần) = <strong>72 Điểm (Xếp loại Khá an toàn)</strong>.
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <button onclick="openEventModal('ev-01')" class="px-3.5 py-2 bg-red-900 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-300"></i> Đăng ký Sự kiện 1 (A1)
        </button>
        <button onclick="openEventModal('ev-04')" class="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="heart" class="w-3.5 h-3.5 text-amber-300"></i> Đăng ký Sự kiện 2 (A3)
        </button>
      </div>
    `;

    const chips = [
      { label: "🔄 Bắt đầu tư vấn luồng khác", phase: 0 },
      { label: "📊 Mở công cụ tính Smart Recommender", phase: 1, branch: "A_SCHOLARSHIP" }
    ];

    appendBotMessage(html, chips);
  }
}

// ====================================================
// LUỒNG D: NĂM 3-4 CHUẨN BỊ CV & SV5T (6 PHASES)
// ====================================================
function processFlowD(p) {
  if (p === 1) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 1/6 • Khóa SV Cuối Khóa</span>
      <p class="mt-2 font-semibold text-slate-900">Chào bạn! Bạn đang học năm thứ mấy tại ULIS?</p>
    `;
    const chips = [
      { label: "Năm 3 (Khóa K58 - Giai đoạn tăng tốc)", phase: 2, saveKey: "year", saveVal: "K58" },
      { label: "Năm 4 (Khóa K57 - Chuẩn bị tốt nghiệp)", phase: 2, saveKey: "year", saveVal: "K57" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 2) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 2/6 • Mục Tiêu Cuối Khóa</span>
      <p class="mt-2 font-semibold text-slate-900">Ở giai đoạn quan trọng này, mục tiêu lớn nhất của bạn là gì?</p>
    `;
    const chips = [
      { label: "Đạt danh hiệu 'Sinh viên 5 Tốt' cấp Trường & ĐHQGHN", phase: 3, saveKey: "goal", saveVal: "SV5T" },
      { label: "Xây dựng CV đẹp với chứng chỉ ngoại khóa chuẩn hóa xin việc", phase: 3, saveKey: "goal", saveVal: "CV xin việc" },
      { label: "Kiểm tra điều kiện chuẩn rèn luyện tốt nghiệp ra trường", phase: 3, saveKey: "goal", saveVal: "Tốt nghiệp" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 3) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 3/6 • Rà Soát Hồ Sơ</span>
      <p class="mt-2 font-semibold text-slate-900">Hồ sơ của bạn hiện đang thiếu hụt hoặc chưa tự tin ở tiêu chí nào nhất?</p>
    `;
    const chips = [
      { label: "Tiêu chí Hội nhập tốt (Thiếu chứng nhận sự kiện quốc tế)", phase: 4, saveKey: "gap", saveVal: "Hội nhập" },
      { label: "Tiêu chí Học tập tốt (Cần có giải NCKH hoặc bài báo)", phase: 4, saveKey: "gap", saveVal: "NCKH" },
      { label: "Tiêu chí Tình nguyện tốt (Cần tích lũy ngày công tình nguyện)", phase: 4, saveKey: "gap", saveVal: "Tình nguyện" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 4) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 4/6 • Định Hướng Nghề Nghiệp</span>
      <p class="mt-2 font-semibold text-slate-900">Để chứng chỉ ngoại khóa đắt giá nhất trên CV, ngành nghề mục tiêu sau khi ra trường của bạn là gì?</p>
    `;
    const chips = [
      { label: "Doanh nghiệp Đa quốc gia / Doanh nghiệp FDI (Nhật, Hàn, Âu Mỹ)", phase: 5, saveKey: "career", saveVal: "FDI" },
      { label: "Giảng dạy / Sư phạm Ngoại ngữ / Trung tâm Giáo dục Quốc tế", phase: 5, saveKey: "career", saveVal: "Giáo dục" },
      { label: "Biên phiên dịch / Ngoại giao / Cơ quan Nhà nước", phase: 5, saveKey: "career", saveVal: "Ngoại giao" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 5) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 5/6 • Chương Trình Cấp Cao</span>
      <p class="mt-2 font-semibold text-slate-900">Hai chương trình hội nhập quốc tế đang mở đơn phù hợp nhất với hồ sơ ${chatbotState.answers.career}:</p>
    `;
    const chips = [
      { label: "Tọa đàm: Kỹ năng Làm việc trong Môi trường Đa văn hóa (Cert A2)", phase: 6, saveKey: "prog", saveVal: "ev-05" },
      { label: "Tình nguyện viên Quốc tế Ngày hội Ngoại giao ULIS (Cert A2 + Thư khen)", phase: 6, saveKey: "prog", saveVal: "ev-02" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 6) {
    const html = `
      <span class="px-2 py-0.5 bg-purple-100 text-purple-950 rounded font-bold text-[10px] uppercase">Phase 6/6 • Lộ Trình Hoàn Thiện Hồ Sơ SV5T</span>
      <h4 class="font-extrabold text-slate-900 text-sm mt-2 mb-2">🏆 HỒ SƠ SINH VIÊN 5 TỐT & CV QUỐC TẾ:</h4>

      <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
        <p class="font-bold text-blue-950">Chương trình then chốt: Tọa đàm Kỹ năng Làm việc Đa văn hóa</p>
        <p>• <strong>Diễn giả:</strong> Trưởng phòng Nhân sự Tập đoàn Đa quốc gia.</p>
        <p>• <strong>Minh chứng nhận được:</strong> Giấy chứng nhận Tiêu chí Hội nhập tốt (Chuẩn Cert A2).</p>
      </div>

      <div class="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-950 mb-3 space-y-1">
        <p class="font-bold">📋 Checklist 5 Tiêu chí SV5T ĐHQGHN:</p>
        <p>1. Đạo đức tốt: Điểm Rèn Luyện $\ge 85$ điểm.</p>
        <p>2. Học tập tốt: Điểm GPA $\ge 3.4$ + Cert A1 NCKH.</p>
        <p>3. Thể lực tốt: Đạt chuẩn Hội thao ULIS.</p>
        <p>4. Tình nguyện tốt: Tham gia tối thiểu 1 chiến dịch Mùa hè xanh / Ba Vì.</p>
        <p>5. Hội nhập tốt: Hoàn thành Cert A2 sự kiện trên.</p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <button onclick="openEventModal('ev-05')" class="px-3.5 py-2 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-amber-400"></i> Đăng ký Tọa đàm
        </button>
        <a href="#leaderboard" onclick="toggleChatbot()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="award" class="w-3.5 h-3.5 text-amber-600"></i> Xem Bảng Vàng SV5T
        </a>
      </div>
    `;

    const chips = [
      { label: "🔄 Bắt đầu tư vấn luồng khác", phase: 0 }
    ];

    appendBotMessage(html, chips);
  }
}

// ====================================================
// LUỒNG E: KHIẾU NẠI & XỬ LÝ CERT LỖI (6 PHASES)
// ====================================================
function processFlowE(p) {
  if (p === 1) {
    const html = `
      <span class="px-2 py-0.5 bg-amber-100 text-amber-950 rounded font-bold text-[10px] uppercase">Phase 1/6 • Nhận Diện Sự Cố</span>
      <p class="mt-2 font-semibold text-slate-900">Chào bạn! Bạn đang gặp sự cố gì với hệ thống chứng nhận hoặc tài khoản ULIS Vibe?</p>
    `;
    const chips = [
      { label: "Đã tham dự sự kiện nhưng chưa nhận được chứng nhận (Cert)", phase: 2, saveKey: "issue", saveVal: "Chưa nhận Cert" },
      { label: "Không quét được mã QR Check-in / Check-out tại sự kiện", phase: 2, saveKey: "issue", saveVal: "Lỗi QR" },
      { label: "Không đăng nhập được tài khoản VNU Mail (@vnu.edu.vn)", phase: 2, saveKey: "issue", saveVal: "Lỗi Login" },
      { label: "Muốn gửi góp ý ẩn danh cải tiến nền tảng cho Nhóm 109", phase: 2, saveKey: "issue", saveVal: "Góp ý" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 2) {
    if (chatbotState.answers.issue === "Góp ý") {
      // Jump to feedback modal
      const html = `
        <p class="font-bold text-slate-900 mb-2">Cảm ơn bạn đã đồng hành cùng Đề án Nhóm 109!</p>
        <p class="text-xs text-slate-600 mb-3">Mọi đóng góp đều hoàn toàn ẩn danh và không lưu thông tin cá nhân. Bạn hãy gửi ý kiến tại form bên dưới nhé:</p>
        <a href="#feedback-section" onclick="toggleChatbot()" class="px-4 py-2 bg-[#0B2341] text-white rounded-xl text-xs font-bold inline-block">
          Mở Biểu Mẫu Góp Ý Ẩn Danh →
        </a>
      `;
      appendBotMessage(html, [{ label: "🔄 Quay lại menu chính", phase: 0 }]);
      return;
    }

    const html = `
      <span class="px-2 py-0.5 bg-amber-100 text-amber-950 rounded font-bold text-[10px] uppercase">Phase 2/6 • Xác Định Sự Kiện</span>
      <p class="mt-2 font-semibold text-slate-900">Sự kiện bạn tham gia do đơn vị nào dưới đây chủ trì tổ chức?</p>
    `;
    const chips = [
      { label: "Sự kiện cấp trường (Đoàn Trường / Hội Sinh viên ULIS)", phase: 3, saveKey: "organizer", saveVal: "Đoàn - Hội" },
      { label: "Sự kiện của các CLB (EC, JPC, V-ULIS, Debate Club...)", phase: 3, saveKey: "organizer", saveVal: "CLB" },
      { label: "Sự kiện chuyên môn của các Khoa đào tạo", phase: 3, saveKey: "organizer", saveVal: "Khoa" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 3) {
    const html = `
      <span class="px-2 py-0.5 bg-amber-100 text-amber-950 rounded font-bold text-[10px] uppercase">Phase 3/6 • Kiểm Tra Quét QR</span>
      <p class="mt-2 font-semibold text-slate-900">Bạn hãy kiểm tra lại quy trình điểm danh hôm tham dự sự kiện nhé:</p>
    `;
    const chips = [
      { label: "Mình đã quét cả 2 mã QR: Check-in đầu giờ và Check-out cuối giờ", phase: 4, saveKey: "qrStatus", saveVal: "Đủ 2 QR" },
      { label: "Mình chỉ quét mã Check-in đầu giờ, quên quét Check-out", phase: 4, saveKey: "qrStatus", saveVal: "Thiếu Check-out" },
      { label: "Máy hết pin / mạng lỗi không quét được mã nào", phase: 4, saveKey: "qrStatus", saveVal: "Không quét được" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 4) {
    const html = `
      <span class="px-2 py-0.5 bg-amber-100 text-amber-950 rounded font-bold text-[10px] uppercase">Phase 4/6 • Khớp Thông Tin Sinh Viên</span>
      <p class="mt-2 font-semibold text-slate-900">Khi điền form khảo sát sau sự kiện, thông tin cá nhân của bạn có đảm bảo:</p>
    `;
    const chips = [
      { label: "Đã điền đúng Mã số sinh viên (MSV 8 số) và Email VNU", phase: 5, saveKey: "idMatch", saveVal: "Đúng MSV" },
      { label: "Nhớ mang máng có thể gõ nhầm 1 số trong MSV hoặc dùng Gmail riêng", phase: 5, saveKey: "idMatch", saveVal: "Nhầm MSV" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 5) {
    const html = `
      <span class="px-2 py-0.5 bg-amber-100 text-amber-950 rounded font-bold text-[10px] uppercase">Phase 5/6 • Kênh Xử Lý Phúc Khảo</span>
      <p class="mt-2 font-semibold text-slate-900">Thông thường chứng nhận điện tử được cấp sau 3–5 ngày làm việc. Bạn muốn xử lý khiếu nại qua kênh nào?</p>
    `;
    const chips = [
      { label: "Tạo Phiếu Tra Cứu Phúc Khảo Tức Thì qua Bot (Nhóm 109 hỗ trợ đối soát)", phase: 6, saveKey: "channel", saveVal: "Phiếu Phúc Khảo" },
      { label: "Lấy email và số điện thoại liên hệ trực tiếp Ban Tổ chức sự kiện", phase: 6, saveKey: "channel", saveVal: "Liên hệ BTC" }
    ];
    appendBotMessage(html, chips);

  } else if (p === 6) {
    const randomTicket = "ULIS-CERT-2026-" + Math.floor(1000 + Math.random() * 9000);

    const html = `
      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded font-bold text-[10px] uppercase">Phase 6/6 • Tiếp Nhận Yêu Cầu Phúc Khảo</span>
      <h4 class="font-extrabold text-slate-900 text-sm mt-2 mb-2">📩 ĐÃ TẠO PHIẾU ĐỐI SOÁT MINH CHỨNG THÀNH CÔNG!</h4>

      <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
        <p>• <strong>Mã phiếu tiếp nhận:</strong> <span class="font-black text-blue-900 text-sm">${randomTicket}</span></p>
        <p>• <strong>Tình trạng xử lý:</strong> Đang chuyển dữ liệu log QR sang Ban Thư ký Đoàn - Hội.</p>
        <p>• <strong>Thời gian phản hồi:</strong> Trong vòng 24 giờ qua VNU Mail (@vnu.edu.vn).</p>
      </div>

      <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-950 mb-3 space-y-1">
        <p class="font-bold">📞 Đường dây nóng giải quyết sự cố gấp:</p>
        <p>• Phòng Chính trị & Công tác HSSV: P.106 Nhà A1 (Hotline: 024.3754.7269).</p>
        <p>• Email đối soát: <span class="underline">congtacsinhvien@ulis.vnu.edu.vn</span></p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <button onclick="openLoginModal()" class="px-3.5 py-2 bg-[#0B2341] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i data-lucide="user" class="w-3.5 h-3.5 text-amber-400"></i> Đăng nhập VNU Mail kiểm tra
        </button>
      </div>
    `;

    const chips = [
      { label: "🔄 Quay lại trang chủ / menu chính", phase: 0 }
    ];

    appendBotMessage(html, chips);
  }
}

// ----------------------------------------------------
// KEYWORD FALLBACK INTENT DETECTION
// ----------------------------------------------------
function handleChatbotInputSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chatbot-text-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  appendUserMessage(text);

  const lower = text.toLowerCase();

  // Intent matching
  if (lower.includes("học bổng") || lower.includes("đrl") || lower.includes("điểm rèn luyện") || lower.includes("xuất sắc") || lower.includes("giỏi")) {
    chatbotState.branch = "A_SCHOLARSHIP";
    chatbotState.phase = 1;
    setTimeout(() => processCurrentState(), 200);
  } else if (lower.includes("clb") || lower.includes("câu lạc bộ") || lower.includes("k60") || lower.includes("tân sinh viên") || lower.includes("tuyển quân")) {
    chatbotState.branch = "B_CLUB";
    chatbotState.phase = 1;
    setTimeout(() => processCurrentState(), 200);
  } else if (lower.includes("cứu") || lower.includes("gỡ điểm") || lower.includes("cảnh báo") || lower.includes("yếu") || lower.includes("thiếu điểm")) {
    chatbotState.branch = "C_RESCUE";
    chatbotState.phase = 1;
    setTimeout(() => processCurrentState(), 200);
  } else if (lower.includes("sv5t") || lower.includes("sinh viên 5 tốt") || lower.includes("năm 3") || lower.includes("năm 4") || lower.includes("cv") || lower.includes("xin việc")) {
    chatbotState.branch = "D_SENIOR";
    chatbotState.phase = 1;
    setTimeout(() => processCurrentState(), 200);
  } else if (lower.includes("lỗi") || lower.includes("khiếu nại") || lower.includes("qr") || lower.includes("chưa nhận") || lower.includes("chứng nhận") || lower.includes("a1") || lower.includes("a2") || lower.includes("a3")) {
    chatbotState.branch = "E_COMPLAINT";
    chatbotState.phase = 1;
    setTimeout(() => processCurrentState(), 200);
  } else {
    // General response
    setTimeout(() => {
      const html = `
        <p class="font-bold text-slate-900 mb-1">Mình đã ghi nhận câu hỏi của bạn: "${text}".</p>
        <p class="text-xs text-slate-600 mb-2">Để tư vấn chuẩn xác nhất qua phễu 6 Phase, bạn hãy chọn chủ đề phù hợp nhất dưới đây nhé:</p>
      `;
      const chips = [
        { label: "🎯 A. Săn Học bổng & ĐRL Xuất sắc", branch: "A_SCHOLARSHIP", phase: 1 },
        { label: "👥 B. Tân sinh viên K60 tìm CLB", branch: "B_CLUB", phase: 1 },
        { label: "🚨 C. Gỡ Điểm Rèn Luyện khẩn cấp", branch: "C_RESCUE", phase: 1 },
        { label: "🏆 D. Chuẩn bị CV & Sinh viên 5 Tốt", branch: "D_SENIOR", phase: 1 },
        { label: "📜 E. Xử lý sự cố Cert A1-A2-A3", branch: "E_COMPLAINT", phase: 1 }
      ];
      appendBotMessage(html, chips);
    }, 400);
  }
}
window.handleChatbotInputSubmit = handleChatbotInputSubmit;

