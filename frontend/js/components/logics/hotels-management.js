import {
  createHotel,
  createRoom,
  deleteHotel,
  deleteRoom,
  getHotel,
  getHotels,
  getLocations,
  updateHotel,
  updateRoom,
  uploadHotelMedia,
  uploadRoomMedia,
} from "../../services/admin.js";

let allHotels = [];
let allLocations = [];

function setStatus(message, type = "info") {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;

  statusEl.style.display = "block";
  statusEl.style.borderColor = type === "error" ? "#f3b5b5" : "#dbeafe";
  statusEl.style.background = type === "error" ? "#fff5f5" : "#eff6ff";
  statusEl.style.color = type === "error" ? "#b42318" : "#1d4ed8";
  statusEl.textContent = message;
}

function clearStatus() {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;
  statusEl.style.display = "none";
  statusEl.textContent = "";
}

function friendlyError(err, fallback) {
  const message = err?.data?.message || err?.message || "";
  if (!message || /StatementCallback|PreparedStatementCallback|bad SQL|SELECT | FROM | JOIN |SQL syntax/i.test(message)) {
    return fallback;
  }
  return message;
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

function normalizeHotel(hotel) {
  return {
    ...hotel,
    hotelName: hotel.address || hotel.hotelName || "Khách sạn chưa đặt tên",
    location: hotel.locationName || hotel.location || "-",
    rating: hotel.averageStar || hotel.rating || 0,
    roomCount: hotel.roomCount || hotel.rooms?.length || 0,
    imageUrl: hotel.imageUrl || "",
    isOnline: hotel.isOnline !== false,
  };
}

function normalizeRoom(room = {}) {
  return {
    ...room,
    roomIMG: room.roomIMG || room.roomImg || "default-room.jpg",
    typeCode: room.typeCode || "SINGLE",
    roomStatus: room.roomStatus || "Available",
  };
}

function roomStatusLabel(status) {
  const labels = {
    Available: "Còn trống",
    Booked: "Đã đặt",
    Maintenance: "Bảo trì",
  };
  return labels[status] || status || "-";
}

function roomTypeLabel(typeCode) {
  const normalized = String(typeCode || "").trim().toUpperCase();
  if (normalized === "SINGLE" || normalized === "SINGLE ROOM") return "Phòng đơn";
  if (normalized === "DOUBLE" || normalized === "DOUBLE ROOM") return "Phòng đôi";
  return typeCode || "-";
}

function normalizeLocation(location = {}) {
  return {
    id: location.id,
    name: location.location || location.name || location.locationName || "",
  };
}

async function loadLocations() {
  if (allLocations.length) return allLocations;
  const locations = await getLocations() || [];
  allLocations = locations
    .map(normalizeLocation)
    .filter(location => location.name);
  return allLocations;
}

async function ensureLocationsLoaded() {
  try {
    const locations = await loadLocations();
    if (!locations.length) {
      setStatus("Chưa có khu vực trong cơ sở dữ liệu.", "error");
      return null;
    }
    return locations;
  } catch (err) {
    setStatus(friendlyError(err, "Không thể tải khu vực từ cơ sở dữ liệu."), "error");
    return null;
  }
}

function placeholderImage(label = "Chưa có ảnh") {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='20'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;
}

function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith("/media/")) {
    return `http://localhost:8080${url}`;
  }
  return url;
}

function generateStars(rating) {
  const fullStars = Math.floor(Number(rating) || 0);
  const hasHalf = (Number(rating) || 0) % 1 !== 0;
  let stars = "";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars += '<i class="fa fa-star" style="color: #fbbf24;"></i>';
    else if (i === fullStars && hasHalf) stars += '<i class="fa fa-star-half-o" style="color: #fbbf24;"></i>';
    else stars += '<i class="fa fa-star-o" style="color: #d1d5db;"></i>';
  }

  return stars;
}

function renderHotelCard(rawHotel) {
  const hotel = normalizeHotel(rawHotel);
  const imageSrc = resolveMediaUrl(hotel.imageUrl) || placeholderImage();

  return `
    <div class="hotel-card">
      <div class="hotel-card__image">
        <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(hotel.hotelName)}" />
      </div>
      <div class="hotel-card__content">
        <h3 class="hotel-card__name">${escapeHtml(hotel.hotelName)}</h3>
        <div class="hotel-card__meta">
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Khu vực:</span>
            <span class="hotel-card__value">${escapeHtml(hotel.location)}</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Đánh giá:</span>
            <span class="hotel-card__rating">${generateStars(hotel.rating)}</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Số phòng:</span>
            <span class="hotel-card__value">${escapeHtml(hotel.roomCount)} phòng</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Số điện thoại:</span>
            <span class="hotel-card__value">${escapeHtml(hotel.phoneNumber || "-")}</span>
          </div>
        </div>
        <div class="hotel-card__actions">
          <button class="hotel-card__btn hotel-card__btn--primary" data-action="edit" data-hotel-id="${hotel.id}">
            <i class="fa fa-pencil"></i> Sửa
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary" data-action="rooms" data-hotel-id="${hotel.id}">
            <i class="fa fa-key"></i> Phòng
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary hotel-card__btn--danger" data-action="delete" data-hotel-id="${hotel.id}">
            <i class="fa fa-trash"></i> Xóa
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderHotels(hotels) {
  const grid = document.querySelector(".hotels-management__grid");
  const emptyEl = document.querySelector(".hotels-management__empty");
  if (!grid) return;

  if (!hotels || hotels.length === 0) {
    grid.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  grid.innerHTML = hotels.map(renderHotelCard).join("");
}

async function loadHotels(options = {}) {
  const loading = document.querySelector(".hotels-management__loading");
  if (loading) loading.style.display = "block";
  if (!options.preserveStatus) clearStatus();

  try {
    allHotels = await getHotels() || [];
    renderHotels(allHotels);
  } catch (err) {
    setStatus(friendlyError(err, "Không thể tải khách sạn từ cơ sở dữ liệu."), "error");
    renderHotels([]);
  } finally {
    if (loading) loading.style.display = "none";
  }
}

function openHotelModal({ title, subtitle = "", body, footer, size = "md", onReady }) {
  closeHotelModal();

  const modalId = `hotel-modal-title-${Date.now()}`;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="hotel-management-modal">
      <div class="hotel-management-modal__backdrop" data-close-modal></div>
      <section class="hotel-management-modal__panel hotel-management-modal__panel--${size}" role="dialog" aria-modal="true" aria-labelledby="${modalId}">
        <header class="hotel-management-modal__header">
          <div>
            <h3 id="${modalId}">${escapeHtml(title)}</h3>
            ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
          </div>
          <button class="hotel-management-modal__icon-btn" type="button" data-close-modal aria-label="Đóng">
            <i class="fa fa-times"></i>
          </button>
        </header>
        <div class="hotel-management-modal__error" style="display:none;"></div>
        <div class="hotel-management-modal__body">${body}</div>
        <footer class="hotel-management-modal__footer">${footer}</footer>
      </section>
    </div>
  `);

  const wrapper = document.querySelector(".hotel-management-modal");
  const close = () => closeHotelModal();
  const handleKeydown = (event) => {
    if (event.key === "Escape") close();
  };

  wrapper.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", close);
  });
  document.addEventListener("keydown", handleKeydown);
  wrapper.dataset.keydownAttached = "true";
  wrapper._hotelModalKeydown = handleKeydown;
  document.body.classList.add("hotel-modal-open");

  if (onReady) onReady(wrapper, close);
  (wrapper.querySelector(".hotel-management-modal__body input, .hotel-management-modal__body select, .hotel-management-modal__body textarea")
    || wrapper.querySelector(".hotel-management-modal__body button")
    || wrapper.querySelector(".hotel-management-modal__icon-btn"))?.focus();
}

function closeHotelModal() {
  const modal = document.querySelector(".hotel-management-modal");
  if (modal?._hotelModalKeydown) {
    document.removeEventListener("keydown", modal._hotelModalKeydown);
  }
  modal?.remove();
  document.body.classList.remove("hotel-modal-open");
}

function setModalError(modal, message) {
  const errorEl = modal.querySelector(".hotel-management-modal__error");
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function setButtonLoading(button, loading, label) {
  if (!button) return;
  button.disabled = loading;
  button.innerHTML = loading
    ? `<i class="fa fa-spinner fa-spin"></i> Đang lưu`
    : label;
}

function hotelPayloadFromForm(form) {
  const formData = new FormData(form);
  const address = String(formData.get("address") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();
  const locationName = String(formData.get("locationName") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!address || !phoneNumber || !locationName) {
    throw new Error("Vui lòng nhập tên/địa chỉ khách sạn, số điện thoại và khu vực.");
  }

  return { address, phoneNumber, locationName, imageUrl };
}

function roomPayloadFromForm(form, defaults = {}) {
  const formData = new FormData(form);
  const typeCode = String(formData.get("typeCode") || "SINGLE").trim().toUpperCase();
  const room = {
    roomNumber: Number(formData.get("roomNumber")),
    floor: Number(formData.get("floor")),
    area: String(formData.get("area") || "").trim(),
    numberOfBed: Number(formData.get("numberOfBed")),
    price: Number(formData.get("price")),
    description: String(formData.get("description") || "").trim() || "Chưa có mô tả",
    roomIMG: String(formData.get("roomIMG") || "").trim() || defaults.roomIMG || "default-room.jpg",
    typeCode,
    roomStatus: String(formData.get("roomStatus") || "Available").trim(),
  };

  if (!room.roomNumber || !room.floor || !room.area || !room.numberOfBed || !room.price) {
    throw new Error("Vui lòng nhập số phòng, tầng, diện tích, số giường và giá.");
  }

  if (!["SINGLE", "DOUBLE"].includes(room.typeCode)) {
    throw new Error("Loại phòng chỉ được là SINGLE hoặc DOUBLE.");
  }

  return room;
}

function renderLocationOptions(locations, currentLocation) {
  const current = String(currentLocation || "").trim();
  const hasCurrent = locations.some(location => location.name === current);
  const options = locations.map(location => `
    <option value="${escapeHtml(location.name)}" ${location.name === current ? "selected" : ""}>
      ${escapeHtml(location.name)}
    </option>
  `);

  if (current && !hasCurrent) {
    options.unshift(`
      <option value="${escapeHtml(current)}" selected>
        ${escapeHtml(current)}
      </option>
    `);
  }

  return `<option value="">Chọn khu vực</option>${options.join("")}`;
}

function roomNumberExists(roomNumber, rooms, currentRoomId = null) {
  return rooms.some(room => (
    Number(room.roomNumber) === Number(roomNumber)
    && String(room.id) !== String(currentRoomId ?? "")
  ));
}

function openHotelForm({ mode, defaults = {}, locations = [], onSubmit }) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Sửa Khách Sạn" : "Thêm Khách Sạn";
  const submitLabel = isEdit ? `<i class="fa fa-save"></i> Lưu thay đổi` : `<i class="fa fa-plus"></i> Thêm khách sạn`;

  openHotelModal({
    title,
    subtitle: isEdit ? "Cập nhật thông tin chính của khách sạn." : "Tạo chi nhánh khách sạn mới.",
    body: `
      <form class="hotel-admin-form" id="hotel-admin-form">
        <label>
          <span>Tên/địa chỉ khách sạn</span>
          <input name="address" type="text" value="${escapeHtml(defaults.address || "")}" required>
        </label>
        <label>
          <span>Số điện thoại</span>
          <input name="phoneNumber" type="text" value="${escapeHtml(defaults.phoneNumber || "")}" required>
        </label>
        <label>
          <span>Khu vực</span>
          <select name="locationName" required>
            ${renderLocationOptions(locations, defaults.locationName)}
          </select>
        </label>
        <label>
          <span>URL/tên file ảnh đại diện</span>
          <input name="imageUrl" type="text" value="${escapeHtml(defaults.imageUrl || "")}" placeholder="assets/images/example-banner.jpeg hoặc https://...">
        </label>
        <label>
          <span>Ảnh đại diện khách sạn</span>
          <input type="file" name="hotelImageFile" accept="image/*">
          <small>Chọn ảnh ở đây, hệ thống sẽ tải ảnh lên tự động khi nhấn Lưu thay đổi.</small>
        </label>
      </form>
    `,
    footer: `
      <button class="hotel-modal-btn hotel-modal-btn--ghost" type="button" data-close-modal>Hủy</button>
      <button class="hotel-modal-btn hotel-modal-btn--primary" type="submit" form="hotel-admin-form">${submitLabel}</button>
    `,
    onReady(modal, close) {
      const form = modal.querySelector("#hotel-admin-form");
      const submitBtn = modal.querySelector(".hotel-modal-btn--primary");
      const fileInput = modal.querySelector("input[name=\"hotelImageFile\"]");
      const hotelImgInput = modal.querySelector("input[name=\"imageUrl\"]");
      let pendingFile = null;

      fileInput?.addEventListener("change", (event) => {
        pendingFile = event.target.files?.[0] || null;
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
          const payload = hotelPayloadFromForm(form);
          setButtonLoading(submitBtn, true, submitLabel);
          const createdHotel = await onSubmit(payload);
          if (pendingFile && createdHotel?.id) {
            const result = await uploadHotelMedia(createdHotel.id, pendingFile);
            if (result?.mediaUrl) {
              hotelImgInput.value = result.mediaUrl;
            }
            await loadHotels({ preserveStatus: true });
          }
          close();
        } catch (err) {
          setModalError(modal, friendlyError(err, err.message || "Thao tác khách sạn thất bại."));
          setButtonLoading(submitBtn, false, submitLabel);
        }
      });
    },
  });
}

function option(value, current, label = value) {
  return `<option value="${value}" ${value === current ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function openRoomForm({ hotelId, mode, defaults = {}, existingRooms = [], onSubmit }) {
  const room = normalizeRoom(defaults);
  const isEdit = mode === "edit";
  const title = isEdit ? `Sửa Phòng ${room.roomNumber || ""}` : "Thêm Phòng";
  const submitLabel = isEdit ? `<i class="fa fa-save"></i> Lưu phòng` : `<i class="fa fa-plus"></i> Thêm phòng`;

  openHotelModal({
    title,
    subtitle: `Khách sạn #${hotelId}`,
    size: "lg",
    body: `
      <form class="hotel-admin-form hotel-admin-form--grid" id="hotel-room-form">
        <label>
          <span>Số phòng</span>
          <input name="roomNumber" type="number" min="1" value="${escapeHtml(room.roomNumber || "")}" required>
        </label>
        <label>
          <span>Tầng</span>
          <input name="floor" type="number" min="1" value="${escapeHtml(room.floor || "1")}" required>
        </label>
        <label>
          <span>Diện tích</span>
          <input name="area" type="text" value="${escapeHtml(room.area || "25m2")}" required>
        </label>
        <label>
          <span>Số giường</span>
          <input name="numberOfBed" type="number" min="1" value="${escapeHtml(room.numberOfBed || "1")}" required>
        </label>
        <label>
          <span>Giá mỗi đêm</span>
          <input name="price" type="number" min="1" value="${escapeHtml(room.price || "200000")}" required>
        </label>
        <label>
          <span>Loại phòng</span>
          <select name="typeCode">
            ${option("SINGLE", room.typeCode, roomTypeLabel("SINGLE"))}
            ${option("DOUBLE", room.typeCode, roomTypeLabel("DOUBLE"))}
          </select>
        </label>
        <label>
          <span>Trạng thái</span>
          <select name="roomStatus">
            ${option("Available", room.roomStatus, roomStatusLabel("Available"))}
            ${option("Booked", room.roomStatus, roomStatusLabel("Booked"))}
            ${option("Maintenance", room.roomStatus, roomStatusLabel("Maintenance"))}
          </select>
        </label>
        <label>
          <span>URL/tên file ảnh phòng</span>
          <input name="roomIMG" type="text" value="${escapeHtml(room.roomIMG)}">
        </label>
        <label>
          <span>Ảnh phòng</span>
          <input type="file" name="roomImageFile" accept="image/*">
          <small>Chọn ảnh ở đây, hệ thống sẽ tải ảnh lên tự động khi nhấn Lưu phòng.</small>
        </label>
        <label class="hotel-admin-form__wide">
          <span>Mô tả</span>
          <textarea name="description" rows="3">${escapeHtml(room.description || "")}</textarea>
        </label>
      </form>
    `,
    footer: `
      <button class="hotel-modal-btn hotel-modal-btn--ghost" type="button" data-close-modal>Hủy</button>
      <button class="hotel-modal-btn hotel-modal-btn--primary" type="submit" form="hotel-room-form">${submitLabel}</button>
    `,
    onReady(modal, close) {
      const form = modal.querySelector("#hotel-room-form");
      const submitBtn = modal.querySelector(".hotel-modal-btn--primary");
      const fileInput = modal.querySelector("input[name=\"roomImageFile\"]");
      const roomImgInput = modal.querySelector("input[name=\"roomIMG\"]");
      let pendingFile = null;

      fileInput?.addEventListener("change", (event) => {
        pendingFile = event.target.files?.[0] || null;
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
          const payload = roomPayloadFromForm(form, room);
          if (roomNumberExists(payload.roomNumber, existingRooms, room.id)) {
            throw new Error(`Số phòng ${payload.roomNumber} đã tồn tại trong khách sạn này.`);
          }
          setButtonLoading(submitBtn, true, submitLabel);

          const createdRoom = await onSubmit(payload);
          if (pendingFile && createdRoom?.id) {
            await uploadRoomMedia(createdRoom.id, pendingFile);
            await loadHotels({ preserveStatus: true });
          }

          close();
        } catch (err) {
          setModalError(modal, friendlyError(err, err.message || "Thao tác phòng thất bại."));
          setButtonLoading(submitBtn, false, submitLabel);
        }
      });
    },
  });
}

function openConfirmDialog({ title, message, details = "", confirmText = "Xác nhận", danger = false, onConfirm }) {
  const confirmLabel = `${danger ? '<i class="fa fa-trash"></i>' : '<i class="fa fa-check"></i>'} ${confirmText}`;

  openHotelModal({
    title,
    body: `
      <div class="hotel-confirm">
        <div class="hotel-confirm__icon ${danger ? "hotel-confirm__icon--danger" : ""}">
          <i class="fa ${danger ? "fa-exclamation-triangle" : "fa-check"}"></i>
        </div>
        <div>
          <p>${escapeHtml(message)}</p>
          ${details ? `<span>${escapeHtml(details)}</span>` : ""}
        </div>
      </div>
    `,
    footer: `
      <button class="hotel-modal-btn hotel-modal-btn--ghost" type="button" data-close-modal>Hủy</button>
      <button class="hotel-modal-btn ${danger ? "hotel-modal-btn--danger" : "hotel-modal-btn--primary"}" type="button" id="hotel-confirm-btn">${confirmLabel}</button>
    `,
    onReady(modal, close) {
      const confirmBtn = modal.querySelector("#hotel-confirm-btn");
      confirmBtn.addEventListener("click", async () => {
        try {
          setButtonLoading(confirmBtn, true, confirmLabel);
          await onConfirm();
          close();
        } catch (err) {
          setModalError(modal, friendlyError(err, "Thao tác thất bại."));
          setButtonLoading(confirmBtn, false, confirmLabel);
        }
      });
    },
  });
}

function renderRoomRows(rooms) {
  if (!rooms.length) {
    return `
      <div class="hotel-rooms-empty">
        <i class="fa fa-bed"></i>
        <span>Chưa có phòng</span>
      </div>
    `;
  }

  return `
    <div class="hotel-rooms-table-wrap">
      <table class="hotel-rooms-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Phòng</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Giá</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rooms.map(rawRoom => {
            const room = normalizeRoom(rawRoom);
            const roomImage = resolveMediaUrl(room.roomIMG || placeholderImage("Phòng"));
            return `
              <tr>
                <td>
                  <img class="hotel-room-thumb" src="${escapeHtml(roomImage)}" alt="Phòng ${escapeHtml(room.roomNumber || "-")}">
                </td>
                <td>
                  <strong>${escapeHtml(room.roomNumber || "-")}</strong>
                  <span>Tầng ${escapeHtml(room.floor || "-")} | ${escapeHtml(room.area || "-")}</span>
                </td>
                <td>${escapeHtml(roomTypeLabel(room.typeCode))}</td>
                <td><span class="hotel-room-status">${escapeHtml(roomStatusLabel(room.roomStatus))}</span></td>
                <td>${Number(room.price || 0).toLocaleString("vi-VN")} VND</td>
                <td>
                  <button class="hotel-room-action" data-room-action="edit" data-room-id="${room.id}" aria-label="Sửa phòng">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="hotel-room-action hotel-room-action--danger" data-room-action="delete" data-room-id="${room.id}" aria-label="Xóa phòng">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function openRoomsModal(hotel) {
  const rooms = hotel.rooms || [];

  openHotelModal({
    title: "Phòng",
    subtitle: hotel.address || `Khách sạn #${hotel.id}`,
    size: "xl",
    body: `
      <div class="hotel-rooms-toolbar">
        <div>
          <strong>${rooms.length}</strong>
          <span>phòng trong khách sạn này</span>
        </div>
        <button class="hotel-modal-btn hotel-modal-btn--primary" type="button" id="hotel-add-room-btn">
          <i class="fa fa-plus"></i> Thêm phòng
        </button>
      </div>
      ${renderRoomRows(rooms)}
    `,
    footer: `<button class="hotel-modal-btn hotel-modal-btn--ghost" type="button" data-close-modal>Đóng</button>`,
    onReady(modal, close) {
      modal.querySelector("#hotel-add-room-btn")?.addEventListener("click", () => {
        close();
        openRoomForm({
          hotelId: hotel.id,
          mode: "add",
          existingRooms: rooms,
          onSubmit: async (room) => {
            const createdRoom = await createRoom(hotel.id, room);
            await loadHotels({ preserveStatus: true });
            setStatus("Đã tạo phòng.");
            return createdRoom;
          },
        });
      });

      modal.querySelectorAll("[data-room-action]").forEach(button => {
        button.addEventListener("click", () => {
          const roomId = button.dataset.roomId;
          const room = rooms.find(item => String(item.id) === String(roomId));
          close();

          if (button.dataset.roomAction === "edit" && room) {
            openRoomForm({
              hotelId: hotel.id,
              mode: "edit",
              defaults: room,
              existingRooms: rooms,
              onSubmit: async (payload) => {
                const updatedRoom = await updateRoom(hotel.id, roomId, payload);
                await loadHotels({ preserveStatus: true });
                setStatus("Đã cập nhật phòng.");
                return updatedRoom;
              },
            });
          }

          if (button.dataset.roomAction === "delete" && room) {
            openConfirmDialog({
              title: "Xóa Phòng",
              message: `Xóa phòng ${room.roomNumber || roomId}?`,
              details: "Các liên kết đặt phòng hiện có sẽ xử lý theo quy tắc cơ sở dữ liệu.",
              confirmText: "Xóa phòng",
              danger: true,
              onConfirm: async () => {
                await deleteRoom(hotel.id, roomId);
                await loadHotels({ preserveStatus: true });
                setStatus("Đã xóa phòng.");
              },
            });
          }
        });
      });
    },
  });
}

async function handleAddHotel() {
  const locations = await ensureLocationsLoaded();
  if (!locations) return;

  openHotelForm({
    mode: "add",
    locations,
    onSubmit: async (hotel) => {
      const createdHotel = await createHotel(hotel);
      await loadHotels({ preserveStatus: true });
      setStatus("Đã tạo khách sạn.");
      return createdHotel;
    },
  });
}

async function handleEditHotel(hotelId) {
  const locations = await ensureLocationsLoaded();
  if (!locations) return;

  const current = allHotels.find(h => String(h.id) === String(hotelId));
  openHotelForm({
    mode: "edit",
    defaults: current,
    locations,
    onSubmit: async (hotel) => {
      const updatedHotel = await updateHotel(hotelId, hotel);
      await loadHotels({ preserveStatus: true });
      setStatus("Đã cập nhật khách sạn.");
      return updatedHotel;
    },
  });
}

async function handleDeleteHotel(hotelId) {
  const current = allHotels.find(h => String(h.id) === String(hotelId));
  const hotelName = current?.address || `Khách sạn #${hotelId}`;

  openConfirmDialog({
    title: "Xóa Khách Sạn",
    message: `Xóa ${hotelName}?`,
    details: "Phòng và đặt phòng liên quan sẽ được xử lý theo quy tắc cơ sở dữ liệu.",
    confirmText: "Xóa khách sạn",
    danger: true,
    onConfirm: async () => {
      await deleteHotel(hotelId);
      await loadHotels({ preserveStatus: true });
      setStatus("Đã xóa khách sạn.");
    },
  });
}

async function handleRooms(hotelId) {
  try {
    const hotel = await getHotel(hotelId);
    openRoomsModal(hotel);
  } catch (err) {
    setStatus(friendlyError(err, "Không thể tải phòng."), "error");
  }
}

export function initHotelsManagement() {
  loadHotels();

  document.querySelector(".hotels-management__add-btn")?.addEventListener("click", handleAddHotel);
  document.querySelector(".hotels-management__grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const hotelId = button.dataset.hotelId;
    if (button.dataset.action === "edit") handleEditHotel(hotelId);
    if (button.dataset.action === "delete") handleDeleteHotel(hotelId);
    if (button.dataset.action === "rooms") handleRooms(hotelId);
  });
}
