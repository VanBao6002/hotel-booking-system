// Template for confirmation modal used in admin operations
// This modal provides user confirmation before performing destructive actions

export const renderConfirmModal = (actionType, userId, userName) => {
  // Map action types to user-friendly messages and input labels
  const actionConfig = {
    delete: {
      title: "Xác nhận Xóa Người Dùng",
      message: `Bạn có chắc là muốn xóa người dùng "${userName}"? Hành động này không thể hoàn tác.`,
      inputLabel: "",
      inputPlaceholder: "",
      showInput: false,
    },
    ban: {
      title: "Xác nhận Cấm Người Dùng",
      message: `Bạn có chắc là muốn cấm người dùng "${userName}"?`,
      // inputLabel: "Lý do (tùy chọn):",
      inputPlaceholder: "Nhập lý do để cấm...",
      showInput: true,
    },
    warn: {
      title: "Xác nhận Gửi Cảnh Báo",
      message: `Bạn có chắc là muốn gửi một cảnh báo đến người dùng "${userName}"?`,
      // inputLabel: "Thông báo cảnh báo (tùy chọn):",
      inputPlaceholder: "Nhập thông báo cảnh báo...",
      showInput: true,
    },
    promote: {
      title: "Xác nhận Trở Thành STAFF",
      message: `Bạn có chắc là muốn nâng cấp người dùng "${userName}" lên vai trò STAFF?`,
      inputLabel: "",
      inputPlaceholder: "",
      showInput: false,
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
            <label>${config.inputLabel}</label>
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

  html += `
        </div>
        <div class="modal-footer">
          <button id="confirmCancel" class="btn-cancel">Cancel</button>
          <button id="confirmOk" class="btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  `;

  return html;
};
