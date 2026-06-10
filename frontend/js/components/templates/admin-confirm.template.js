// Template for confirmation modal used in admin operations
// This modal provides user confirmation before performing destructive actions

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

export const renderConfirmModal = (actionType, userId, userName, options = {}) => {
  const hotels = Array.isArray(options.hotels) ? options.hotels : [];
  const safeUserName = escapeHtml(userName);
  // Map action types to user-friendly messages and input labels
  const actionConfig = {
    delete: {
      title: "Xác nhận vô hiệu hóa tài khoản",
      message: `Tài khoản "${safeUserName}" sẽ bị vô hiệu hóa đăng nhập, nhưng dữ liệu đặt phòng và lịch sử liên quan vẫn được giữ lại.`,
      inputLabel: "",
      inputPlaceholder: "",
      showInput: false,
    },
    ban: {
      title: "Xác nhận Cấm Người Dùng",
      message: `Bạn có chắc là muốn cấm người dùng "${safeUserName}"?`,
      inputLabel: "Lý do (tùy chọn)",
      inputPlaceholder: "Nhập lý do để cấm...",
      showInput: true,
    },
    warn: {
      title: "Xác nhận Gửi Cảnh Báo",
      message: `Bạn có chắc là muốn gửi một cảnh báo đến người dùng "${safeUserName}"?`,
      inputLabel: "Nội dung cảnh báo (tùy chọn)",
      inputPlaceholder: "Nhập thông báo cảnh báo...",
      showInput: true,
    },
    promote: {
      title: "Xác nhận Trở Thành Nhân Viên",
      message: `Chọn khách sạn hiện có trong cơ sở dữ liệu để phân công người dùng "${safeUserName}" khi nâng cấp lên nhân viên.`,
      inputLabel: "Khách sạn phụ trách",
      inputPlaceholder: "Chọn khách sạn",
      showInput: false,
      showHotelSelect: true,
    },
  };

  const config = actionConfig[actionType] || actionConfig.delete;

  // Build HTML for modal with optional input field
  let html = `
    <div class="modal-backdrop" id="confirmModalBackdrop">
      <div class="modal-container" id="confirmModal">
        <div class="modal-header">
          <h3>${config.title}</h3>
          <span class="modal-close" id="confirmModalClose">&times;</span>
        </div>
        <div class="modal-body">
          <p>${config.message}</p>
  `;

  // Add input field if action requires additional data (reason, message, etc.)
  if (config.showInput) {
    html += `
          <div class="form-group">
            ${config.inputLabel ? `<label>${config.inputLabel}</label>` : ""}
            <input 
              type="text" 
              id="confirmInput" 
              class="form-input" 
              placeholder="${config.inputPlaceholder}"
              maxlength="200"
            />
          </div>
    `;
  }

  if (config.showHotelSelect) {
    html += `
          <div class="form-group">
            <label style="position:static;display:block;margin-bottom:8px;">${config.inputLabel}</label>
            <input
              type="search"
              id="confirmHotelSearch"
              class="form-input"
              placeholder="Tìm theo ID, tên/địa chỉ hoặc khu vực..."
              style="margin-bottom:10px;"
            />
            <select id="confirmHotelSelect" class="form-input" style="cursor:pointer;">
              <option value="">${config.inputPlaceholder}</option>
              ${hotels.map(hotel => `
                <option
                  value="${escapeHtml(hotel.id)}"
                  data-search="${escapeHtml(`#${hotel.id} ${hotel.address || ""} ${hotel.locationName || ""}`.toLowerCase())}"
                >
                  #${escapeHtml(hotel.id)} - ${escapeHtml(hotel.address || hotel.locationName || "Khách sạn")}${hotel.locationName ? ` (${escapeHtml(hotel.locationName)})` : ""}
                </option>
              `).join("")}
            </select>
            <div id="confirmHotelError" style="display:none;margin-top:6px;color:#b91c1c;font-size:13px;font-weight:600;"></div>
          </div>
    `;
  }

  html += `
        </div>
        <div class="modal-footer">
          <button id="confirmCancel" class="btn-cancel">Hủy</button>
          <button id="confirmOk" class="btn-confirm">Xác nhận</button>
        </div>
      </div>
    </div>
  `;

  return html;
};
