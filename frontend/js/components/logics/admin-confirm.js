// Logic for confirmation modal interactions
// Handles modal display, user input, and event listeners

import { renderConfirmModal } from "../templates/admin-confirm.template.js";

/**
 * Show a confirmation dialog with callback
 * @param {string} actionType - Type of action: 'delete', 'ban', 'warn', 'promote'
 * @param {number} userId - ID of the user
 * @param {string} userName - Username or display name
 * @param {function} callback - Function to call on confirmation (receives optional reason/message)
 * @param {object} options - Extra modal options
 */
export const showConfirmDialog = (actionType, userId, userName, callback, options = {}) => {
  // Render modal HTML
  const modalHTML = renderConfirmModal(actionType, userId, userName, options);
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Get modal elements
  const backdrop = document.getElementById("confirmModalBackdrop");
  const modal = document.getElementById("confirmModal");
  const closeBtn = document.getElementById("confirmModalClose");
  const cancelBtn = document.getElementById("confirmCancel");
  const okBtn = document.getElementById("confirmOk");
  const inputField = document.getElementById("confirmInput");
  const hotelSearch = document.getElementById("confirmHotelSearch");
  const hotelSelect = document.getElementById("confirmHotelSelect");
  const hotelError = document.getElementById("confirmHotelError");

  // Close modal function
  const closeModal = () => {
    if (backdrop) {
      backdrop.remove();
    }
    // Remove event listeners
    closeBtn?.removeEventListener("click", closeModal);
    cancelBtn?.removeEventListener("click", closeModal);
    okBtn?.removeEventListener("click", handleConfirm);
    backdrop?.removeEventListener("click", handleBackdropClick);
    document.removeEventListener("keydown", handleEscapeKey);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (actionType === "promote") {
      const selectedHotelId = hotelSelect?.value || "";
      if (!selectedHotelId) {
        if (hotelError) {
          hotelError.style.display = "block";
          hotelError.textContent = "Vui lòng chọn khách sạn cho staff.";
        }
        return;
      }
      callback(selectedHotelId);
      closeModal();
      return;
    }

    const inputValue = inputField?.value.trim() || "";
    callback(inputValue); // Pass user input or empty string to callback
    closeModal();
  };

  // Handle backdrop click (click outside modal to close)
  const handleBackdropClick = (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  };

  // Handle ESC key press to close modal
  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  // Attach event listeners
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  okBtn?.addEventListener("click", handleConfirm);
  backdrop?.addEventListener("click", handleBackdropClick);
  document.addEventListener("keydown", handleEscapeKey);
  hotelSearch?.addEventListener("input", () => {
    const query = hotelSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    hotelSelect?.querySelectorAll("option").forEach(option => {
      if (!option.value) {
        option.hidden = false;
        return;
      }

      const matches = option.dataset.search?.includes(query);
      option.hidden = Boolean(query) && !matches;
      if (!option.hidden) visibleCount++;
    });

    if (hotelSelect?.selectedOptions?.[0]?.hidden) {
      hotelSelect.value = "";
    }

    if (hotelError) {
      hotelError.style.display = query && visibleCount === 0 ? "block" : "none";
      hotelError.textContent = query && visibleCount === 0
        ? "Không tìm thấy khách sạn phù hợp."
        : "";
    }
  });

  // Auto-focus on input field if it exists
  if (inputField) {
    inputField.focus();
  } else if (hotelSearch) {
    hotelSearch.focus();
  } else if (hotelSelect) {
    hotelSelect.focus();
  }
};
