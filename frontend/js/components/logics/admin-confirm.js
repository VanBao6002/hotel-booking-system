// Logic for confirmation modal interactions
// Handles modal display, user input, and event listeners

import { renderConfirmModal } from "../templates/admin-confirm.template.js";

/**
 * Show a confirmation dialog with callback
 * @param {string} actionType - Type of action: 'delete', 'ban', 'warn', 'promote'
 * @param {number} userId - ID of the user
 * @param {string} userName - Username or display name
 * @param {function} callback - Function to call on confirmation (receives optional reason/message)
 */
export const showConfirmDialog = (actionType, userId, userName, callback) => {
  // Render modal HTML
  const modalHTML = renderConfirmModal(actionType, userId, userName);
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Get modal elements
  const backdrop = document.getElementById("confirmModalBackdrop");
  const modal = document.getElementById("confirmModal");
  const closeBtn = document.getElementById("confirmModalClose");
  const cancelBtn = document.getElementById("confirmCancel");
  const okBtn = document.getElementById("confirmOk");
  const inputField = document.getElementById("confirmInput");

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

  // Auto-focus on input field if it exists
  if (inputField) {
    inputField.focus();
  }
};
