import { getAllUsers, deleteUser, banUser, warnUser, grantStaffRole } from "../../services/users.js";
import { getHotels } from "../../services/admin.js";
import { showConfirmDialog } from "./admin-confirm.js";
import { safeJsonParse } from "../../utils/utils.js";

// Admin actions must call the backend so database changes are visible after reload.
const MOCK_MODE = false;

let allUsers = [];
let currentPage = 1;
let pageSize = 10;
let appliedFilters = {
  userName: "",
  email: "",
  role: "all",
};

// Display status message at the top of users-management component
function setStatus(message, type = "info") {
  const statusEl = document.querySelector(".users-management__status");
  if (!statusEl) return;

  statusEl.style.display = "block";
  statusEl.style.borderColor = type === "error" ? "#f3b5b5" : "#eee";
  statusEl.style.background = type === "error" ? "#fff5f5" : "#fff";
  statusEl.style.color = type === "error" ? "#b42318" : "#333";
  statusEl.textContent = message;
}

// Clear status message
function clearStatus() {
  const statusEl = document.querySelector(".users-management__status");
  if (!statusEl) return;
  statusEl.style.display = "none";
  statusEl.textContent = "";
}

// Update status display for a specific user row
function updateRowStatus(userId, status, message) {
  const row = document.querySelector(`tr[data-user-id="${userId}"]`);
  if (!row) return;

  const statusEl = row.querySelector(".row-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `row-status ${status}`;
  statusEl.style.display = "block";

  // Auto-hide success message after 4 seconds
  if (status === "success") {
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 4000);
  }
}

function roleBadge(role) {
  if (role === "manager") return `<span class="role-badge badge-admin">Quản lý</span>`;
  if (role === "staff") return `<span class="role-badge badge-staff">Nhân viên</span>`;
  return `<span class="role-badge badge-user">Khách hàng</span>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function accountStatusBadge(user) {
  if (user.active === false) {
    return `<span class="role-badge" style="background:#fee2e2;color:#991b1b;">Đã vô hiệu hóa</span>`;
  }
  return `<span class="role-badge" style="background:#dcfce7;color:#166534;">Hoạt động</span>`;
}

// Render user table with action buttons (uses current page & filters)
function renderRows(users) {
  const tbody = document.querySelector(".users-management__tbody");
  if (!tbody) return;

  if (!users || users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding: 14px; color:#666;">Không có dữ liệu</td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  // compute paging
  const start = (currentPage - 1) * pageSize;
  const pageUsers = users.slice(start, start + pageSize);

  tbody.innerHTML = pageUsers
    .map((u) => {
      const locked = u.lockedUntil ? new Date(u.lockedUntil).toLocaleString() : "-";
      const lockReason = u.lockReason ? `<div style="font-size:11px;color:#b42318;margin-top:4px;">${escapeHtml(u.lockReason)}</div>` : "";
      const lockInfo = u.lockedUntil ? `<div style="font-size:11px;color:#6b7280;margin-top:4px;">Khóa đến: ${escapeHtml(locked)}</div>` : "";
      const staffHotel = u.staffHotelBranchId ? `<div style="font-size:11px;color:#6b7280;margin-top:4px;">Khách sạn #${u.staffHotelBranchId}</div>` : "";
      const disabledAction = u.active === false ? "disabled" : "";
      return `
        <tr style="border-top:1px solid #f0f0f0;" data-user-id="${u.id}">
          <td style="padding: 12px 14px;">${u.id ?? ""}</td>
          <td style="padding: 12px 14px;">${u.userName ?? ""}</td>
          <td style="padding: 12px 14px;">${u.email ?? ""}</td>
          <td style="padding: 12px 14px;">${u.fullName ?? ""}</td>
          <td style="padding: 12px 14px;">${roleBadge(u.role)}${staffHotel}</td>
          <td style="padding: 12px 14px;">${accountStatusBadge(u)}${lockInfo}${lockReason}</td>
          <td style="padding: 12px 14px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="action-btn action-delete" data-user-id="${u.id}" data-user-name="${escapeHtml(u.userName)}" title="Vô hiệu hóa tài khoản" ${disabledAction}><i class="fa fa-ban"></i> Vô hiệu hóa</button>
              <button class="action-btn action-ban" data-user-id="${u.id}" data-user-name="${escapeHtml(u.userName)}" title="Cấm người dùng" ${disabledAction}><i class="fa fa-lock"></i> Cấm</button>
              <button class="action-btn action-warn" data-user-id="${u.id}" data-user-name="${escapeHtml(u.userName)}" title="Gửi cảnh báo" ${disabledAction}><i class="fa fa-exclamation-triangle"></i> Cảnh báo</button>
              <button class="action-btn action-promote" data-user-id="${u.id}" data-user-name="${escapeHtml(u.userName)}" title="Nâng cấp thành nhân viên" ${disabledAction}><i class="fa fa-user-plus"></i> Thăng cấp</button>
            </div>
            <span class="row-status" style="display: none; font-size: 12px; margin-top: 4px; padding: 4px; border-radius: 3px;"></span>
          </td>
        </tr>
      `;
    })
    .join("");

  renderPagination(users.length);
  disableSelfActions();
  wireActionButtons();
}

function wireActionButtons() {
  document.querySelectorAll(".users-management__tbody .action-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;

      const userId = Number(button.dataset.userId);
      const userName = button.dataset.userName || "";
      if (!Number.isFinite(userId)) return;

      if (button.classList.contains("action-delete")) {
        handleDeleteUser(userId, userName);
      } else if (button.classList.contains("action-ban")) {
        handleBanUser(userId, userName);
      } else if (button.classList.contains("action-warn")) {
        handleWarnUser(userId, userName);
      } else if (button.classList.contains("action-promote")) {
        handleGrantStaffRole(userId, userName);
      }
    });
  });
}

function renderPagination(total) {
  const info = document.getElementById("um-page-info");
  const container = document.getElementById("um-page-buttons");
  if (!container) return;

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  if (info) {
    info.textContent = `Đang hiển thị ${start} đến ${end} trong tổng ${total} người dùng`;
  }

  container.innerHTML = "";
  container.appendChild(makePagerBtn("<", currentPage === 1, () => {
    currentPage--;
    applyFiltersAndRender();
  }));

  for (let p = 1; p <= pages; p++) {
    const btn = makePagerBtn(p, false, () => {
      currentPage = p;
      applyFiltersAndRender();
    });
    if (p === currentPage) {
      btn.style.background = "linear-gradient(135deg,#c9a84c,#e8cc7a)";
      btn.style.color = "#1a1a2e";
      btn.style.borderColor = "transparent";
      btn.style.fontWeight = "700";
    }
    container.appendChild(btn);
  }

  container.appendChild(makePagerBtn(">", currentPage === pages, () => {
    currentPage++;
    applyFiltersAndRender();
  }));
}

function makePagerBtn(label, disabled, onClick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.disabled = disabled;
  btn.style.cssText = `
    min-width: 34px; height: 34px; padding: 0 10px;
    border: 1.5px solid #e2e2da; border-radius: 7px;
    background: white; color: #4b5563;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.15s;
    opacity: ${disabled ? 0.4 : 1};
    font-family: inherit;
  `;
  if (!disabled) btn.addEventListener("click", onClick);
  return btn;
}

function disableSelfActions() {
  try {
    const userData = safeJsonParse(localStorage.getItem("userData"), {});
    const selfId = userData?.id;
    if (!selfId) return;
    const row = document.querySelector(`tr[data-user-id="${selfId}"]`);
    if (!row) return;
    const buttons = row.querySelectorAll(".action-btn");
    buttons.forEach((b) => {
      b.disabled = true;
      b.title = "Không thể thao tác trên tài khoản của chính bạn";
      b.style.opacity = 0.6;
      b.style.cursor = "not-allowed";
    });
  } catch (e) {
    // ignore
  }
}

// Apply client-side filters and render
function applyFiltersAndRender() {
  const { userName, email, role } = appliedFilters;
  let filtered = allUsers.slice();
  if (userName) {
    filtered = filtered.filter((u) => (u.userName || "").toLowerCase().includes(userName));
  }
  if (email) {
    filtered = filtered.filter((u) => (u.email || "").toLowerCase().includes(email));
  }
  if (role && role !== "all") {
    filtered = filtered.filter((u) => u.role === role);
  }
  renderRows(filtered);
}

// Load all users from API (initial) and initialize toolbar
async function loadUsers() {
  clearStatus();
  setStatus("Đang tải danh sách người dùng...");

  try {
    const users = await getAllUsers();
    clearStatus();
    allUsers = users || [];
    applyFiltersAndRender();
  } catch (err) {
    const status = err?.status;
    const message =
      status === 401
        ? "Bạn chưa đăng nhập."
        : status === 403
          ? "Bạn không có quyền Quản lý để xem danh sách người dùng."
          : err?.data?.message || "Tải dữ liệu thất bại.";
    setStatus(message, "error");
    allUsers = [];
    applyFiltersAndRender();
  }
}

// Mock helpers when backend not ready
function simulateActionSuccess(userId, action) {
  if (action === "promote") {
    // update local array role
    const u = allUsers.find((x) => x.id === userId);
    if (u) {
      u.role = "staff";
    }
    applyFiltersAndRender();
    updateRowStatus(userId, "success", "✓ Đã nâng cấp");
  } else if (action === "delete") {
    const u = allUsers.find((x) => x.id === userId);
    if (u) {
      u.active = false;
      u.lockReason = "Tài khoản đã bị quản lý vô hiệu hóa";
    }
    applyFiltersAndRender();
    updateRowStatus(userId, "success", "Đã vô hiệu hóa");
  } else if (action === "ban") {
    updateRowStatus(userId, "success", "✓ Đã cấm");
  } else if (action === "warn") {
    updateRowStatus(userId, "success", "✓ Đã gửi cảnh báo");
  }
}

// Handle account disable action. The backend keeps the user row for audit/history.
async function handleDeleteUser(userId, userName) {
  showConfirmDialog("delete", userId, userName, async (reason) => {
    updateRowStatus(userId, "loading", "Đang vô hiệu hóa...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "delete");
        return;
      }
      await deleteUser(userId);
      updateRowStatus(userId, "success", "Vô hiệu hóa thành công");
      // Reload users after 1.5 seconds to show update
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const message = err?.data?.message || "Vô hiệu hóa thất bại";
      updateRowStatus(userId, "error", message);
    }
  });
}

// Handle ban user action
async function handleBanUser(userId, userName) {
  showConfirmDialog("ban", userId, userName, async (reason) => {
    updateRowStatus(userId, "loading", "Đang cấm...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "ban");
        return;
      }
      await banUser(userId, reason);
      updateRowStatus(userId, "success", "✓ Cấm thành công");
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const message = err?.data?.message || "Cấm thất bại";
      updateRowStatus(userId, "error", "✗ " + message);
    }
  });
}

// Handle warn user action
async function handleWarnUser(userId, userName) {
  showConfirmDialog("warn", userId, userName, async (message) => {
    updateRowStatus(userId, "loading", "Đang gửi cảnh cáo...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "warn");
        return;
      }
      await warnUser(userId, message);
      updateRowStatus(userId, "success", "✓ Cảnh cáo thành công");
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const errorMsg = err?.data?.message || "Cảnh cáo thất bại";
      updateRowStatus(userId, "error", "✗ " + errorMsg);
    }
  });
}

// Handle grant staff role action
async function handleGrantStaffRole(userId, userName) {
  let hotels = [];
  updateRowStatus(userId, "loading", "Đang tải danh sách khách sạn...");
  try {
    hotels = await getHotels() || [];
  } catch (err) {
    const message = err?.data?.message || "Không thể tải danh sách khách sạn";
    updateRowStatus(userId, "error", "✗ " + message);
    return;
  }

  if (!hotels.length) {
    updateRowStatus(userId, "error", "✗ Chưa có khách sạn trong cơ sở dữ liệu");
    return;
  }

  updateRowStatus(userId, "success", "Chọn khách sạn để thăng cấp");
  showConfirmDialog("promote", userId, userName, async (hotelBranchId) => {
    updateRowStatus(userId, "loading", "Đang nâng cấp...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "promote");
        return;
      }
      await grantStaffRole(userId, Number(hotelBranchId));
      updateRowStatus(userId, "success", "✓ Nâng cấp thành công");
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const message = err?.data?.message || "Nâng cấp thất bại";
      updateRowStatus(userId, "error", "✗ " + message);
    }
  }, { hotels });
}

// Setup toolbar (search, filter, page size) and wire events
function setupToolbar() {
  const container = document.querySelector('.users-management__status')?.parentElement;
  if (!container) return;
  // Toolbar already added?
  if (document.querySelector('.users-management__toolbar')) return;

  // create toolbar nodes near the status element
  const toolbar = document.createElement('div');
  toolbar.className = "users-management__toolbar";

  toolbar.innerHTML = `
    <div class="users-management__search">
      <i class="fa fa-search"></i>
      <input class="admin-search-username" placeholder="Tìm theo tên đăng nhập" />
    </div>
    <div class="users-management__search">
      <i class="fa fa-envelope"></i>
      <input class="admin-search-email" type="email" placeholder="Tìm theo email" />
    </div>
    <div class="users-management__select-wrap">
      <select class="admin-filter-role">
        <option value="all">Tất cả vai trò</option>
        <option value="manager">Quản lý</option>
        <option value="staff">Nhân viên</option>
        <option value="customer">Khách hàng</option>
      </select>
      <i class="fa fa-chevron-down"></i>
    </div>
    <div class="users-management__page-size">
      <label>Hiển thị</label>
      <div class="users-management__select-wrap users-management__select-wrap--compact">
        <select class="admin-page-size">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
        </select>
        <i class="fa fa-chevron-down"></i>
      </div>
    </div>
    <button type="button" class="users-management__filter-btn">
      <i class="fa fa-filter"></i>
      Lọc
    </button>
  `;

  const statusEl = document.querySelector('.users-management__status');
  statusEl.insertAdjacentElement('afterend', toolbar);

  // wire events
  const userNameInput = document.querySelector('.admin-search-username');
  const emailInput = document.querySelector('.admin-search-email');
  const filterButton = document.querySelector('.users-management__filter-btn');
  const pageSizeSelect = document.querySelector('.admin-page-size');

  const applyFilters = () => {
    appliedFilters = {
      userName: userNameInput?.value?.toLowerCase()?.trim() || "",
      email: emailInput?.value?.toLowerCase()?.trim() || "",
      role: document.querySelector('.admin-filter-role')?.value || "all",
    };
    currentPage = 1;
    applyFiltersAndRender();
  };

  filterButton?.addEventListener('click', applyFilters);
  pageSizeSelect?.addEventListener('change', (e) => { pageSize = parseInt(e.target.value) || 10; currentPage = 1; applyFiltersAndRender(); });
}

// Initialize users-management component with event listeners
// export function initUsersManagement() {
//     // ── Fetch users từ API ────────────────────────────────────────────────────
//     // Thay URL bằng endpoint thực tế của bạn
//     const API_URL = "/api/users"; // ← ĐỔI THÀNH URL API THỰC TẾ

//     let allUsers = [];
//     let filtered  = [];
//     let currentPage = 1;
//     let pageSize    = 10;

//     async function fetchUsers() {
//         try {
//             const token = localStorage.getItem("token") || "";
//             const res = await fetch(API_URL, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (!res.ok) throw new Error("API error " + res.status);
//             const data = await res.json();
//             // Giả sử API trả về mảng users hoặc { data: [...] }
//             return Array.isArray(data) ? data : (data.data || data.users || []);
//         } catch {
//             // Fallback: dữ liệu mẫu khi chưa có API
//             return generateMockUsers(35);
//         }
//     }

//     function generateMockUsers(count) {
//         const roles    = ["ADMIN", "STAFF", "USER", "USER", "USER", "guest"];
//         const statuses = ["Hoạt động", "Hoạt động", "Hoạt động", "Bị khóa"];
//         const names    = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Châu", "Phạm Đức Dũng",
//                           "Hoàng Thị Én", "Vũ Văn Phong", "Đặng Thị Giang", "Bùi Quốc Hùng",
//                           "Lý Thị Iris", "Trịnh Minh Khoa"];
//         return Array.from({ length: count }, (_, i) => ({
//             id:     i + 1,
//             name:   names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
//             email:  `user${i + 1}@aethelgard.com`,
//             role:   roles[i % roles.length],
//             status: statuses[i % statuses.length],
//         }));
//     }

//     // ── Render ────────────────────────────────────────────────────────────────

//     function renderTable() {
//         const tbody = document.getElementById("um-tbody");
//         if (!tbody) return;

//         const start    = (currentPage - 1) * pageSize;
//         const pageData = filtered.slice(start, start + pageSize);

//         if (pageData.length === 0) {
//             tbody.innerHTML = `<tr><td colspan="6" style="padding:28px;text-align:center;color:#9aa3b0;font-size:13px;">Không có dữ liệu</td></tr>`;
//             updatePagination();
//             return;
//         }

//         tbody.innerHTML = pageData.map((u, idx) => {
//             const globalIdx = start + idx + 1;
//             const roleStyle = roleTagStyle(u.role);
//             const statusStyle = u.status === "Hoạt động"
//                 ? "background:#dcfce7; color:#166534;"
//                 : "background:#fee2e2; color:#b91c1c;";

//             return `
//                 <tr style="border-bottom:1px solid #f0ece4; background:white; transition:background 0.15s;"
//                     onmouseenter="this.style.background='#fafaf8'"
//                     onmouseleave="this.style.background='white'">
//                     <td style="padding:13px 16px; font-size:13px; color:#6b7280;">${globalIdx}</td>
//                     <td style="padding:13px 16px; font-size:13px; color:#1a1a2e; font-weight:500;">${u.name || u.username || "—"}</td>
//                     <td style="padding:13px 16px; font-size:13px; color:#4b5563;">${u.email || "—"}</td>
//                     <td style="padding:13px 16px;">
//                         <span style="${roleStyle} padding:3px 10px; border-radius:5px; font-size:12px; font-weight:600;">${u.role || "—"}</span>
//                     </td>
//                     <td style="padding:13px 16px;">
//                         <span style="${statusStyle} padding:3px 10px; border-radius:5px; font-size:12px; font-weight:500;">${u.status || "—"}</span>
//                     </td>
//                     <td style="padding:13px 16px; display:flex; gap:8px; align-items:center;">
//                         <button class="um-edit-btn" data-id="${u.id}"
//                             style="padding:5px 14px; background:linear-gradient(135deg,#c9a84c,#e8cc7a); color:#1a1a2e;
//                                    border:none; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
//                             Sửa
//                         </button>
//                         <button class="um-delete-btn" data-id="${u.id}"
//                             style="padding:5px 14px; background:#fee2e2; color:#b91c1c;
//                                    border:none; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
//                             Xóa
//                         </button>
//                     </td>
//                 </tr>
//             `;
//         }).join("");

//         // Action events
//         tbody.querySelectorAll(".um-edit-btn").forEach(btn =>
//             btn.addEventListener("click", () => alert("Sửa user ID: " + btn.dataset.id)));
//         tbody.querySelectorAll(".um-delete-btn").forEach(btn =>
//             btn.addEventListener("click", () => {
//                 if (confirm("Xóa user ID: " + btn.dataset.id + "?")) {
//                     allUsers = allUsers.filter(u => String(u.id) !== btn.dataset.id);
//                     applyFilter();
//                 }
//             }));

//         updatePagination();
//     }

//     function roleTagStyle(role) {
//         const map = {
//             ADMIN: "background:#ede9fe; color:#5b21b6;",
//             STAFF: "background:#dbeafe; color:#1e40af;",
//             USER:  "background:#f0fdf4; color:#166534;",
//             guest: "background:#f3f4f6; color:#6b7280;",
//         };
//         return map[role] || "background:#f3f4f6; color:#6b7280;";
//     }

//     // ── Pagination ────────────────────────────────────────────────────────────

//     function updatePagination() {
//         const total      = filtered.length;
//         const totalPages = Math.max(1, Math.ceil(total / pageSize));
//         const start      = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
//         const end        = Math.min(currentPage * pageSize, total);

//         // Info text — lấy tổng từ allUsers (toàn bộ DB), filtered là kết quả lọc
//         const infoEl = document.getElementById("um-page-info");
//         if (infoEl) {
//             infoEl.textContent =
//                 `Đang hiển thị ${start} đến ${end} trong tổng ${allUsers.length} người dùng`;
//         }

//         const container = document.getElementById("um-page-buttons");
//         if (!container) return;
//         container.innerHTML = "";

//         // Prev button
//         container.appendChild(makePagerBtn("‹", currentPage === 1, () => { currentPage--; renderTable(); }));

//         // Page number buttons — hiển thị tối đa 5 trang xung quanh trang hiện tại
//         const range = pageRange(currentPage, totalPages);
//         range.forEach(p => {
//             if (p === "...") {
//                 const dot = document.createElement("span");
//                 dot.textContent = "...";
//                 dot.style.cssText = "padding:0 6px; font-size:13px; color:#9aa3b0; line-height:34px;";
//                 container.appendChild(dot);
//             } else {
//                 const btn = makePagerBtn(p, false, () => { currentPage = p; renderTable(); });
//                 if (p === currentPage) {
//                     btn.style.background     = "linear-gradient(135deg,#c9a84c,#e8cc7a)";
//                     btn.style.color          = "#1a1a2e";
//                     btn.style.borderColor    = "transparent";
//                     btn.style.fontWeight     = "700";
//                 }
//                 container.appendChild(btn);
//             }
//         });

//         // Next button
//         container.appendChild(makePagerBtn("›", currentPage === totalPages, () => { currentPage++; renderTable(); }));
//     }

//     function pageRange(current, total) {
//         if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//         if (current <= 4)  return [1, 2, 3, 4, 5, "...", total];
//         if (current >= total - 3) return [1, "...", total-4, total-3, total-2, total-1, total];
//         return [1, "...", current-1, current, current+1, "...", total];
//     }

//     function makePagerBtn(label, disabled, onClick) {
//         const btn = document.createElement("button");
//         btn.textContent = label;
//         btn.disabled    = disabled;
//         btn.style.cssText = `
//             min-width:34px; height:34px; padding:0 10px;
//             border:1.5px solid #e2e2da; border-radius:7px;
//             background:white; color:#4b5563;
//             font-size:13px; font-weight:500; cursor:pointer;
//             transition:all 0.15s; opacity:${disabled ? 0.4 : 1};
//             font-family:inherit;
//         `;
//         if (!disabled) {
//             btn.addEventListener("mouseenter", () => { btn.style.borderColor="#c9a84c"; btn.style.color="#c9a84c"; });
//             btn.addEventListener("mouseleave", () => { btn.style.borderColor="#e2e2da"; btn.style.color="#4b5563"; });
//             btn.addEventListener("click", onClick);
//         }
//         return btn;
//     }

//     // ── Filter ────────────────────────────────────────────────────────────────

//     function applyFilter() {
//         const search = (document.getElementById("um-search")?.value  || "").toLowerCase();
//         const role   = (document.getElementById("um-role-select")?.value || "");

//         filtered = allUsers.filter(u => {
//             const name  = (u.name || u.username || "").toLowerCase();
//             const email = (u.email || "").toLowerCase();
//             const matchSearch = !search || name.includes(search) || email.includes(search);
//             const matchRole   = !role   || u.role === role;
//             return matchSearch && matchRole;
//         });

//         currentPage = 1;
//         renderTable();
//     }

//     // ── Events ────────────────────────────────────────────────────────────────

//     document.getElementById("um-filter-btn")?.addEventListener("click", applyFilter);

//     document.getElementById("um-search")?.addEventListener("keydown", e => {
//         if (e.key === "Enter") applyFilter();
//     });

//     document.getElementById("um-page-size")?.addEventListener("change", e => {
//         pageSize    = parseInt(e.target.value) || 10;
//         currentPage = 1;
//         renderTable();
//     });

//     // ── Bootstrap ─────────────────────────────────────────────────────────────

//     fetchUsers().then(users => {
//         allUsers = users;
//         filtered = [...allUsers];
//         renderTable();
//     });
// }
// export function initUsersManagement() {
//     const API_URL = "/api/v1/users";  // ← endpoint Spring Boot của bạn

//     // MAP FIELD — khớp UserDTO Spring: id, userName, email, fullName, lockedUntil, role, ...
//     function statusFromLockedUntil(lockedUntil) {
//         if (lockedUntil == null || lockedUntil === "") return "Hoạt động";
//         const until = new Date(lockedUntil);
//         if (Number.isNaN(until.getTime())) return "—";
//         return until > new Date() ? "Bị khóa" : "Hoạt động";
//     }

//     function mapUser(u) {
//         const userName = u.userName ?? "";
//         const fullName = u.fullName ?? "";
//         return {
//             id: u.id,
//             name: fullName || userName || "—",
//             userName,
//             fullName,
//             email: u.email ?? "",
//             role: u.role ?? "",
//             status: statusFromLockedUntil(u.lockedUntil),
//         };
//     }
//     // ═══════════════════════════════════════════════════════════════════

//     let allUsers    = [];
//     let filtered    = [];
//     let currentPage = 1;
//     let pageSize    = 10;
//     let isLoading   = false;

//     // ── Fetch từ Spring Boot ──────────────────────────────────────────

//     async function fetchUsers() {
//         showLoading(true);
//         try {
//             const token = localStorage.getItem("token") || "";

//             const res = await fetch(API_URL, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             if (res.status === 401) {
//                 showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
//                 return [];
//             }
//             if (res.status === 403) {
//                 showError("Bạn không có quyền truy cập danh sách người dùng.");
//                 return [];
//             }
//             if (!res.ok) {
//                 throw new Error(`HTTP ${res.status}`);
//             }

//             const data = await res.json();

//             // Spring Boot thường trả về mảng trực tiếp hoặc bọc trong object
//             // Đã xử lý cả hai trường hợp:
//             const list = Array.isArray(data) ? data : (data.data ?? data.content ?? data.users ?? []);

//             return list.map((u) => mapUser(u));

//         } catch (err) {
//             console.error("[UsersManagement] Fetch error:", err);
//             showError(`Không thể tải dữ liệu: ${err.message}`);
//             return [];
//         } finally {
//             showLoading(false);
//         }
//     }

//     // ── Loading / Error state ────────────────────────────────────────

//     function showLoading(on) {
//         isLoading = on;
//         const tbody = document.getElementById("um-tbody");
//         if (!tbody) return;
//         if (on) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="6" style="padding:40px; text-align:center;">
//                         <div style="display:inline-flex; align-items:center; gap:10px; color:#9aa3b0; font-size:13px;">
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation:um-spin 0.9s linear infinite;">
//                                 <circle cx="12" cy="12" r="10" stroke="#e8e4dc" stroke-width="3"/>
//                                 <path d="M12 2a10 10 0 0 1 10 10" stroke="#c9a84c" stroke-width="3" stroke-linecap="round"/>
//                             </svg>
//                             Đang tải dữ liệu...
//                         </div>
//                     </td>
//                 </tr>
//             `;
//             if (!document.getElementById("um-spin-style")) {
//                 const s = document.createElement("style");
//                 s.id = "um-spin-style";
//                 s.textContent = "@keyframes um-spin { to { transform: rotate(360deg); } }";
//                 document.head.appendChild(s);
//             }
//         }
//     }

//     function showError(msg) {
//         const tbody = document.getElementById("um-tbody");
//         if (tbody) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="6" style="padding:32px; text-align:center;">
//                         <div style="color:#b91c1c; font-size:13px; background:#fee2e2;
//                                     padding:12px 20px; border-radius:8px; display:inline-block;">
//                             ⚠️ ${msg}
//                         </div>
//                     </td>
//                 </tr>
//             `;
//         }
//         const infoEl = document.getElementById("um-page-info");
//         if (infoEl) infoEl.textContent = "";
//         const btns = document.getElementById("um-page-buttons");
//         if (btns) btns.innerHTML = "";
//     }

//     // ── Render bảng ──────────────────────────────────────────────────

//     function renderTable() {
//         const tbody = document.getElementById("um-tbody");
//         if (!tbody || isLoading) return;

//         const start    = (currentPage - 1) * pageSize;
//         const pageData = filtered.slice(start, start + pageSize);

//         if (pageData.length === 0) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="6" style="padding:36px; text-align:center; color:#9aa3b0; font-size:13px;">
//                         Không tìm thấy người dùng nào
//                     </td>
//                 </tr>
//             `;
//             updatePagination();
//             return;
//         }

//         tbody.innerHTML = pageData.map((u, idx) => {
//             const globalIdx   = start + idx + 1;
//             const roleStyle   = roleTagStyle(u.role);
//             const statusStyle = u.status === "Hoạt động"
//                 ? "background:#dcfce7; color:#166534;"
//                 : "background:#fee2e2; color:#b91c1c;";

//             return `
//                 <tr style="border-bottom:1px solid #f0ece4; background:white; transition:background 0.15s;"
//                     onmouseenter="this.style.background='#fafaf8'"
//                     onmouseleave="this.style.background='white'">
//                     <td style="padding:13px 16px; font-size:13px; color:#6b7280;">${globalIdx}</td>
//                     <td style="padding:13px 16px; font-size:13px; color:#1a1a2e; font-weight:500;">${u.name || "—"}</td>
//                     <td style="padding:13px 16px; font-size:13px; color:#4b5563;">${u.email || "—"}</td>
//                     <td style="padding:13px 16px;">
//                         <span style="${roleStyle} padding:3px 10px; border-radius:5px; font-size:12px; font-weight:600;">
//                             ${u.role || "—"}
//                         </span>
//                     </td>
//                     <td style="padding:13px 16px;">
//                         <span style="${statusStyle} padding:3px 10px; border-radius:5px; font-size:12px; font-weight:500;">
//                             ${u.status || "—"}
//                         </span>
//                     </td>
//                     <td style="padding:13px 16px; display:flex; gap:8px; align-items:center;">
//                         <button class="um-edit-btn" data-id="${u.id}"
//                             style="padding:5px 14px; background:linear-gradient(135deg,#c9a84c,#e8cc7a);
//                                    color:#1a1a2e; border:none; border-radius:5px;
//                                    font-size:12px; font-weight:600; cursor:pointer;">
//                             Sửa
//                         </button>
//                         <button class="um-delete-btn" data-id="${u.id}"
//                             style="padding:5px 14px; background:#fee2e2; color:#b91c1c;
//                                    border:none; border-radius:5px;
//                                    font-size:12px; font-weight:600; cursor:pointer;">
//                             Xóa
//                         </button>
//                     </td>
//                 </tr>
//             `;
//         }).join("");

//         tbody.querySelectorAll(".um-edit-btn").forEach(btn =>
//             btn.addEventListener("click", () => {
//                 // TODO: mở modal sửa user với id = btn.dataset.id
//                 alert("Sửa user ID: " + btn.dataset.id);
//             })
//         );
//         tbody.querySelectorAll(".um-delete-btn").forEach(btn =>
//             btn.addEventListener("click", async () => {
//                 if (!confirm(`Xác nhận xóa user ID: ${btn.dataset.id}?`)) return;
//                 await deleteUser(btn.dataset.id);
//             })
//         );

//         updatePagination();
//     }

//     // ── Xóa user (gọi API DELETE) ────────────────────────────────────

//     async function deleteUser(id) {
//         try {
//             const token = localStorage.getItem("token") || "";
//             const res = await fetch(`${API_URL}/${id}`, {
//                 method: "DELETE",
//                 headers: { "Authorization": `Bearer ${token}` },
//             });
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);

//             // Xóa khỏi local state ngay, không cần fetch lại toàn bộ
//             allUsers = allUsers.filter(u => String(u.id) !== String(id));
//             applyFilter();
//         } catch (err) {
//             alert("Xóa thất bại: " + err.message);
//         }
//     }

//     // ── Màu tag Role ─────────────────────────────────────────────────

//     function roleTagStyle(role) {
//         const map = {
//             ADMIN: "background:#ede9fe; color:#5b21b6;",
//             STAFF: "background:#dbeafe; color:#1e40af;",
//             USER:  "background:#f0fdf4; color:#166534;",
//             guest: "background:#f3f4f6; color:#6b7280;",
//         };
//         return map[role] || "background:#f3f4f6; color:#6b7280;";
//     }

//     // ── Pagination ───────────────────────────────────────────────────

//     function updatePagination() {
//         const total      = filtered.length;
//         const totalPages = Math.max(1, Math.ceil(total / pageSize));
//         const start      = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
//         const end        = Math.min(currentPage * pageSize, total);

//         // Bên trái: tổng lấy từ allUsers = toàn bộ người dùng trong DB
//         const infoEl = document.getElementById("um-page-info");
//         if (infoEl) {
//             infoEl.textContent =
//                 `Đang hiển thị ${start} đến ${end} trong tổng ${allUsers.length} người dùng`;
//         }

//         const container = document.getElementById("um-page-buttons");
//         if (!container) return;
//         container.innerHTML = "";

//         container.appendChild(makePagerBtn("‹", currentPage === 1, () => { currentPage--; renderTable(); }));

//         pageRange(currentPage, totalPages).forEach(p => {
//             if (p === "...") {
//                 const dot = document.createElement("span");
//                 dot.textContent = "...";
//                 dot.style.cssText = "padding:0 4px; font-size:13px; color:#9aa3b0; line-height:34px;";
//                 container.appendChild(dot);
//             } else {
//                 const btn = makePagerBtn(p, false, () => { currentPage = p; renderTable(); });
//                 if (p === currentPage) {
//                     btn.style.background  = "linear-gradient(135deg,#c9a84c,#e8cc7a)";
//                     btn.style.color       = "#1a1a2e";
//                     btn.style.borderColor = "transparent";
//                     btn.style.fontWeight  = "700";
//                 }
//                 container.appendChild(btn);
//             }
//         });

//         container.appendChild(makePagerBtn("›", currentPage === totalPages, () => { currentPage++; renderTable(); }));
//     }

//     function pageRange(current, total) {
//         if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//         if (current <= 4)         return [1, 2, 3, 4, 5, "...", total];
//         if (current >= total - 3) return [1, "...", total-4, total-3, total-2, total-1, total];
//         return [1, "...", current-1, current, current+1, "...", total];
//     }

//     function makePagerBtn(label, disabled, onClick) {
//         const btn = document.createElement("button");
//         btn.textContent = label;
//         btn.disabled    = disabled;
//         btn.style.cssText = `
//             min-width:34px; height:34px; padding:0 10px;
//             border:1.5px solid #e2e2da; border-radius:7px;
//             background:white; color:#4b5563;
//             font-size:13px; font-weight:500; cursor:pointer;
//             transition:all 0.15s; opacity:${disabled ? 0.4 : 1};
//             font-family:inherit;
//         `;
//         if (!disabled) {
//             btn.addEventListener("mouseenter", () => { btn.style.borderColor = "#c9a84c"; btn.style.color = "#c9a84c"; });
//             btn.addEventListener("mouseleave", () => { btn.style.borderColor = "#e2e2da"; btn.style.color = "#4b5563"; });
//             btn.addEventListener("click", onClick);
//         }
//         return btn;
//     }

//     // ── Filter client-side ───────────────────────────────────────────

//     function applyFilter() {
//         const search = (document.getElementById("um-search")?.value      || "").toLowerCase().trim();
//         const role   = (document.getElementById("um-role-select")?.value || "");

//         filtered = allUsers.filter((u) => {
//             const nameStr = [u.name, u.userName, u.fullName]
//                 .filter(Boolean)
//                 .join(" ")
//                 .toLowerCase();
//             const emailStr = (u.email || "").toLowerCase();
//             const matchSearch = !search || nameStr.includes(search) || emailStr.includes(search);
//             const matchRole = !role || u.role === role;
//             return matchSearch && matchRole;
//         });

//         currentPage = 1;
//         renderTable();
//     }

//     // ── Events ───────────────────────────────────────────────────────

//     document.getElementById("um-filter-btn")?.addEventListener("click", applyFilter);

//     document.getElementById("um-search")?.addEventListener("keydown", e => {
//         if (e.key === "Enter") applyFilter();
//     });

//     document.getElementById("um-page-size")?.addEventListener("change", e => {
//         pageSize    = parseInt(e.target.value) || 10;
//         currentPage = 1;
//         renderTable();
//     });

//     // ── Khởi động: gọi API Spring Boot ──────────────────────────────

//     fetchUsers().then(users => {
//         allUsers = users;
//         filtered = [...allUsers];
//         renderTable();
//     });
// }
export function initUsersManagement() {
  appliedFilters = {
    userName: "",
    email: "",
    role: "all",
  };
  setupToolbar();
  loadUsers();
}
