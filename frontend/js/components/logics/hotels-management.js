import {
  createHotel,
  createRoom,
  deleteHotel,
  deleteRoom,
  getHotel,
  getHotels,
  updateHotel,
  updateRoom,
} from "../../services/admin.js";

let allHotels = [];

function setStatus(message, type = "info") {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;

  statusEl.style.display = "block";
  statusEl.style.borderColor = type === "error" ? "#f3b5b5" : "#e5e7eb";
  statusEl.style.background = type === "error" ? "#fff5f5" : "#f0f9ff";
  statusEl.style.color = type === "error" ? "#b42318" : "#0369a1";
  statusEl.textContent = message;
}

function clearStatus() {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;
  statusEl.style.display = "none";
  statusEl.textContent = "";
}

function normalizeHotel(hotel) {
  return {
    ...hotel,
    hotelName: hotel.address || hotel.hotelName || "Unnamed Hotel",
    location: hotel.locationName || hotel.location || "-",
    rating: hotel.averageStar || hotel.rating || 0,
    roomCount: hotel.roomCount || hotel.rooms?.length || 0,
    isOnline: hotel.isOnline !== false,
  };
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
  const imageSrc = hotel.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

  return `
    <div class="hotel-card">
      <div class="hotel-card__image">
        <img src="${imageSrc}" alt="${hotel.hotelName}" />
      </div>
      <div class="hotel-card__content">
        <h3 class="hotel-card__name">${hotel.hotelName}</h3>
        <div class="hotel-card__meta">
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Location:</span>
            <span class="hotel-card__value">${hotel.location}</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Rating:</span>
            <span class="hotel-card__rating">${generateStars(hotel.rating)}</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Room Count:</span>
            <span class="hotel-card__value">${hotel.roomCount} Rooms</span>
          </div>
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Phone:</span>
            <span class="hotel-card__value">${hotel.phoneNumber || "-"}</span>
          </div>
        </div>
        <div class="hotel-card__actions">
          <button class="hotel-card__btn hotel-card__btn--primary" data-action="edit" data-hotel-id="${hotel.id}">
            <i class="fa fa-pencil"></i> Edit
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary" data-action="rooms" data-hotel-id="${hotel.id}">
            <i class="fa fa-key"></i> Rooms
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary" data-action="delete" data-hotel-id="${hotel.id}">
            <i class="fa fa-trash"></i> Delete
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

function askHotel(defaults = {}) {
  const address = prompt("Hotel address/name:", defaults.address || "");
  if (address === null) return null;
  const phoneNumber = prompt("Phone number:", defaults.phoneNumber || "");
  if (phoneNumber === null) return null;
  const locationName = prompt("Location:", defaults.locationName || "");
  if (locationName === null) return null;
  return { address: address.trim(), phoneNumber: phoneNumber.trim(), locationName: locationName.trim() };
}

function askRoom(defaults = {}) {
  const roomNumber = prompt("Room number:", defaults.roomNumber || "");
  if (roomNumber === null) return null;
  const floor = prompt("Floor:", defaults.floor || "1");
  if (floor === null) return null;
  const area = prompt("Area:", defaults.area || "25m2");
  if (area === null) return null;
  const numberOfBed = prompt("Number of beds:", defaults.numberOfBed || "1");
  if (numberOfBed === null) return null;
  const price = prompt("Price per night:", defaults.price || "200000");
  if (price === null) return null;
  const typeCode = prompt("Room type code (SINGLE, DOUBLE, SUITE):", defaults.typeCode || "SINGLE");
  if (typeCode === null) return null;
  const roomStatus = prompt("Room status (Available, Booked, Maintenance):", defaults.roomStatus || "Available");
  if (roomStatus === null) return null;

  return {
    roomNumber: Number(roomNumber),
    floor: Number(floor),
    area: area.trim(),
    numberOfBed: Number(numberOfBed),
    price: Number(price),
    description: defaults.description || "No description",
    roomIMG: defaults.roomIMG || "default-room.jpg",
    typeCode: typeCode.trim(),
    roomStatus: roomStatus.trim(),
  };
}

async function loadHotels() {
  const loading = document.querySelector(".hotels-management__loading");
  if (loading) loading.style.display = "block";
  clearStatus();

  try {
    allHotels = await getHotels() || [];
    renderHotels(allHotels);
  } catch (err) {
    setStatus(err?.data?.message || "Could not load hotels from database.", "error");
    renderHotels([]);
  } finally {
    if (loading) loading.style.display = "none";
  }
}

async function handleAddHotel() {
  const hotel = askHotel();
  if (!hotel) return;

  try {
    await createHotel(hotel);
    setStatus("Hotel created.");
    await loadHotels();
  } catch (err) {
    setStatus(err?.data?.message || "Create hotel failed.", "error");
  }
}

async function handleEditHotel(hotelId) {
  const current = allHotels.find(h => String(h.id) === String(hotelId));
  const hotel = askHotel(current);
  if (!hotel) return;

  try {
    await updateHotel(hotelId, hotel);
    setStatus("Hotel updated.");
    await loadHotels();
  } catch (err) {
    setStatus(err?.data?.message || "Update hotel failed.", "error");
  }
}

async function handleDeleteHotel(hotelId) {
  if (!confirm("Delete this hotel? Rooms and bookings will be detached by database rules.")) return;

  try {
    await deleteHotel(hotelId);
    setStatus("Hotel deleted.");
    await loadHotels();
  } catch (err) {
    setStatus(err?.data?.message || "Delete hotel failed.", "error");
  }
}

async function handleRooms(hotelId) {
  try {
    const hotel = await getHotel(hotelId);
    const rooms = hotel.rooms || [];
    const roomList = rooms.map(room => `${room.id}: room ${room.roomNumber} - ${room.typeCode} - ${room.price}`).join("\n") || "No rooms yet.";
    const action = prompt(`${roomList}\n\nType: add, edit, delete`, "add");
    if (!action) return;

    if (action.toLowerCase() === "add") {
      const room = askRoom();
      if (room) await createRoom(hotelId, room);
    } else if (action.toLowerCase() === "edit") {
      const roomId = prompt("Room ID to edit:");
      const current = rooms.find(room => String(room.id) === String(roomId));
      if (!roomId || !current) return;
      const room = askRoom(current);
      if (room) await updateRoom(hotelId, roomId, room);
    } else if (action.toLowerCase() === "delete") {
      const roomId = prompt("Room ID to delete:");
      if (roomId && confirm(`Delete room ${roomId}?`)) await deleteRoom(hotelId, roomId);
    }

    setStatus("Room changes saved.");
    await loadHotels();
  } catch (err) {
    setStatus(err?.data?.message || "Room action failed.", "error");
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
