import { getAllUsers, deleteUser, banUser, warnUser, grantStaffRole } from "../../services/users.js";
import { showConfirmDialog } from "./admin-confirm.js";

// Toggle mock mode: when true, frontend simulates actions instead of calling backend
const MOCK_MODE = true;

let allUsers = [];
let currentPage = 1;
let pageSize = 10;

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
  if (role === "ADMIN")  return `<span class="role-badge badge-admin">Admin</span>`;
  if (role === "STAFF")  return `<span class="role-badge badge-staff">Staff</span>`;
  return `<span class="role-badge badge-user">User</span>`;
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
    return;
  }

  // compute paging
  const start = (currentPage - 1) * pageSize;
  const pageUsers = users.slice(start, start + pageSize);

  tbody.innerHTML = pageUsers
    .map((u) => {
      const locked = u.lockedUntil ? new Date(u.lockedUntil).toLocaleString() : "-";
      return `
        <tr style="border-top:1px solid #f0f0f0;" data-user-id="${u.id}">
          <td style="padding: 12px 14px;">${u.id ?? ""}</td>
          <td style="padding: 12px 14px;">${u.userName ?? ""}</td>
          <td style="padding: 12px 14px;">${u.email ?? ""}</td>
          <td style="padding: 12px 14px;">${u.fullName ?? ""}</td>
          <td style="padding: 12px 14px;">${roleBadge(u.role)}</td>
          <td style="padding: 12px 14px;">${locked}</td>
          <td style="padding: 12px 14px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="action-btn action-delete" data-user-id="${u.id}" data-user-name="${u.userName}" title="Delete user"><i class="fa fa-trash"></i> Xóa</button>
              <button class="action-btn action-ban" data-user-id="${u.id}" data-user-name="${u.userName}" title="Ban user"><i class="fa fa-lock"></i> Cấm</button>
              <button class="action-btn action-warn" data-user-id="${u.id}" data-user-name="${u.userName}" title="Send warning"><i class="fa fa-exclamation-triangle"></i> Cảnh báo</button>
              <button class="action-btn action-promote" data-user-id="${u.id}" data-user-name="${u.userName}" title="Promote to STAFF"><i class="fa fa-user-plus"></i> Thăng cấp</button>
            </div>
            <span class="row-status" style="display: none; font-size: 12px; margin-top: 4px; padding: 4px; border-radius: 3px;"></span>
          </td>
        </tr>
      `;
    })
    .join("");

  renderPagination(users.length);
  disableSelfActions();
}

function renderPagination(total) {
  const container = document.querySelector(".admin-pagination");
  if (!container) return;
  container.innerHTML = "";
  const pages = Math.max(1, Math.ceil(total / pageSize));
  for (let p = 1; p <= pages; p++) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = p;
    if (p === currentPage) btn.style.opacity = "0.8";
    btn.addEventListener("click", () => {
      currentPage = p;
      applyFiltersAndRender();
    });
    container.appendChild(btn);
  }
}

function disableSelfActions() {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
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
  const search = document.querySelector(".admin-search")?.value?.toLowerCase()?.trim() || "";
  const role = document.querySelector(".admin-filter-role")?.value || "all";
  let filtered = allUsers.slice();
  if (search) {
    filtered = filtered.filter((u) => (u.userName || "").toLowerCase().includes(search) || (u.email || "").toLowerCase().includes(search) || (u.fullName || "").toLowerCase().includes(search));
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
          ? "Bạn không có quyền Admin để xem danh sách người dùng."
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
      u.role = "STAFF";
    }
    applyFiltersAndRender();
    updateRowStatus(userId, "success", "✓ Đã nâng cấp");
  } else if (action === "delete") {
    allUsers = allUsers.filter((x) => x.id !== userId);
    applyFiltersAndRender();
    updateRowStatus(userId, "success", "✓ Đã xóa");
  } else if (action === "ban") {
    updateRowStatus(userId, "success", "✓ Đã cấm");
  } else if (action === "warn") {
    updateRowStatus(userId, "success", "✓ Đã gửi cảnh báo");
  }
}

// Handle delete user action
async function handleDeleteUser(userId, userName) {
  showConfirmDialog("delete", userId, userName, async (reason) => {
    updateRowStatus(userId, "loading", "Đang xóa...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "delete");
        return;
      }
      await deleteUser(userId);
      updateRowStatus(userId, "success", "✓ Xóa thành công");
      // Reload users after 1.5 seconds to show update
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const message = err?.data?.message || "Xóa thất bại";
      updateRowStatus(userId, "error", "✗ " + message);
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

// Handle grant STAFF role action
async function handleGrantStaffRole(userId, userName) {
  showConfirmDialog("promote", userId, userName, async (reason) => {
    updateRowStatus(userId, "loading", "Đang nâng cấp...");
    try {
      if (MOCK_MODE) {
        simulateActionSuccess(userId, "promote");
        return;
      }
      await grantStaffRole(userId);
      updateRowStatus(userId, "success", "✓ Nâng cấp thành công");
      setTimeout(loadUsers, 1500);
    } catch (err) {
      const message = err?.data?.message || "Nâng cấp thất bại";
      updateRowStatus(userId, "error", "✗ " + message);
    }
  });
}

// Setup toolbar (search, filter, page size) and wire events
function setupToolbar() {
  const container = document.querySelector('.users-management__status')?.parentElement;
  if (!container) return;
  // Toolbar already added?
  if (document.querySelector('.admin-search')) return;

  // create toolbar nodes near the status element
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.gap = '12px';
  toolbar.style.alignItems = 'center';
  toolbar.style.marginBottom = '12px';

  toolbar.innerHTML = `
    <div style="flex:1; display:flex; gap:8px;">
      <input class="admin-search" placeholder="Tìm theo username, email, họ tên..." style="flex:1; padding:10px 12px; border:1px solid #ddd; border-radius:8px;" />
      <select class="admin-filter-role" style="padding:10px 12px; border:1px solid #ddd; border-radius:8px; background:#fff;">
        <option value="all">Tất cả vai trò</option>
        <option value="ADMIN">Admin</option>
        <option value="STAFF">Staff</option>
        <option value="USER">User</option>
      </select>
    </div>
    <div style="display:flex; gap:8px; align-items:center;">
      <label style="color:#666; font-size:13px;">Hiển thị</label>
      <select class="admin-page-size" style="padding:8px 10px; border:1px solid #ddd; border-radius:8px; background:#fff;">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
      </select>
    </div>
  `;

  const statusEl = document.querySelector('.users-management__status');
  statusEl.insertAdjacentElement('afterend', toolbar);

  // wire events
  const searchInput = document.querySelector('.admin-search');
  const roleSelect = document.querySelector('.admin-filter-role');
  const pageSizeSelect = document.querySelector('.admin-page-size');

  searchInput?.addEventListener('input', () => { currentPage = 1; applyFiltersAndRender(); });
  roleSelect?.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
  pageSizeSelect?.addEventListener('change', (e) => { pageSize = parseInt(e.target.value) || 10; currentPage = 1; applyFiltersAndRender(); });
}

// Initialize users-management component with event listeners
export function initUsersManagement() {
  setupToolbar();
  loadUsers();

  // Event delegation: attach listeners to tbody for action buttons
  const tbody = document.querySelector(".users-management__tbody");
  if (tbody) {
    tbody.addEventListener("click", (event) => {
      const target = event.target.closest('.action-btn');
      if (!target) return;
      const userId = parseInt(target.dataset.userId);
      const userName = target.dataset.userName;

      if (target.classList.contains("action-delete")) {
        handleDeleteUser(userId, userName);
      } else if (target.classList.contains("action-ban")) {
        handleBanUser(userId, userName);
      } else if (target.classList.contains("action-warn")) {
        handleWarnUser(userId, userName);
      } else if (target.classList.contains("action-promote")) {
        handleGrantStaffRole(userId, userName);
      }
    });
  }
}