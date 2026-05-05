import { hotelsManagementTemplate } from "../templates/hotels-management.template.js";

let allHotels = [];

// Display status message
function setStatus(message, type = "info") {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;

  statusEl.style.display = "block";
  statusEl.style.borderColor = type === "error" ? "#f3b5b5" : "#e5e7eb";
  statusEl.style.background = type === "error" ? "#fff5f5" : "#f0f9ff";
  statusEl.style.color = type === "error" ? "#b42318" : "#0369a1";
  statusEl.textContent = message;

  if (type !== "error") {
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 3000);
  }
}

// Clear status message
function clearStatus() {
  const statusEl = document.querySelector(".hotels-management__status");
  if (!statusEl) return;
  statusEl.style.display = "none";
  statusEl.textContent = "";
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  let stars = "";
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="fa fa-star" style="color: #fbbf24;"></i>';
    } else if (i === fullStars && hasHalf) {
      stars += '<i class="fa fa-star-half-o" style="color: #fbbf24;"></i>';
    } else {
      stars += '<i class="fa fa-star-o" style="color: #d1d5db;"></i>';
    }
  }
  
  return stars;
}

// Get status badge HTML
function getStatusBadge(isOnline) {
  if (isOnline) {
    return `<span style="display: inline-flex; align-items: center; gap: 4px; color: #10b981; font-size: 13px;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> Online
    </span>`;
  } else {
    return `<span style="display: inline-flex; align-items: center; gap: 4px; color: #999; font-size: 13px;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #ddd;"></span> Offline
    </span>`;
  }
}

// Render a single hotel card
function renderHotelCard(hotel) {
  const imageSrc = hotel.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
  
  return `
    <div class="hotel-card">
      <div class="hotel-card__image">
        <img src="${imageSrc}" alt="${hotel.hotelName}" />
      </div>
      
      <div class="hotel-card__content">
        <h3 class="hotel-card__name">${hotel.hotelName || "Unnamed Hotel"}</h3>
        
        <div class="hotel-card__meta">
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Location:</span>
            <span class="hotel-card__value">${hotel.location || "-"}</span>
          </div>
          
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Rating:</span>
            <span class="hotel-card__rating">${generateStars(hotel.rating || 0)}</span>
          </div>
          
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Room Count:</span>
            <span class="hotel-card__value">${hotel.roomCount || 0} Rooms</span>
          </div>
          
          <div class="hotel-card__meta-item">
            <span class="hotel-card__label">Status:</span>
            <span class="hotel-card__status">${getStatusBadge(hotel.isOnline !== false)}</span>
          </div>
        </div>
        
        <div class="hotel-card__actions">
          <button class="hotel-card__btn hotel-card__btn--primary" data-hotel-id="${hotel.id}">
            <i class="fa fa-pencil"></i> Edit Details
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary" data-hotel-id="${hotel.id}">
            <i class="fa fa-key"></i> Manage Rooms
          </button>
          <button class="hotel-card__btn hotel-card__btn--secondary" data-hotel-id="${hotel.id}">
            <i class="fa fa-bar-chart"></i> View Analytics
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render all hotel cards
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
  grid.innerHTML = hotels.map(hotel => renderHotelCard(hotel)).join("");
  
  attachCardEventListeners();
}

// Attach event listeners to action buttons
function attachCardEventListeners() {
  // Edit Details buttons
  document.querySelectorAll(".hotel-card__btn--primary").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const hotelId = btn.dataset.hotelId;
      const hotel = allHotels.find(h => h.id == hotelId);
      if (hotel) {
        console.log("Edit hotel:", hotel);
        setStatus(`Editing ${hotel.hotelName}...`, "info");
        // TODO: Open edit modal/dialog
      }
    });
  });

  // Manage Rooms buttons
  document.querySelectorAll(".hotel-card__btn--secondary").forEach((btn, idx) => {
    if (idx % 3 === 1) { // Second button in each group
      btn.addEventListener("click", (e) => {
        const hotelId = btn.dataset.hotelId;
        const hotel = allHotels.find(h => h.id == hotelId);
        if (hotel) {
          console.log("Manage rooms for hotel:", hotel);
          setStatus(`Managing rooms for ${hotel.hotelName}...`, "info");
          // TODO: Open rooms management
        }
      });
    }
  });

  // View Analytics buttons
  document.querySelectorAll(".hotel-card__btn--secondary").forEach((btn, idx) => {
    if (idx % 3 === 2) { // Third button in each group
      btn.addEventListener("click", (e) => {
        const hotelId = btn.dataset.hotelId;
        const hotel = allHotels.find(h => h.id == hotelId);
        if (hotel) {
          console.log("View analytics for hotel:", hotel);
          setStatus(`Loading analytics for ${hotel.hotelName}...`, "info");
          // TODO: Show analytics
        }
      });
    }
  });
}

// Mock hotel data for development
function getMockHotels() {
  return [
    {
      id: 1,
      hotelName: "The Oceanfront Villa",
      location: "Maldives",
      rating: 5,
      roomCount: 120,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      isOnline: true
    },
    {
      id: 2,
      hotelName: "The Presidential Suite",
      location: "Maldives",
      rating: 4.5,
      roomCount: 85,
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      isOnline: true
    },
    {
      id: 3,
      hotelName: "The Sunset Hilltop Retreat",
      location: "Seychelles",
      rating: 4.5,
      roomCount: 100,
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
      isOnline: false
    },
    {
      id: 4,
      hotelName: "Tropical Paradise Resort",
      location: "Bali",
      rating: 4,
      roomCount: 150,
      imageUrl: "https://images.unsplash.com/photo-1571896349842-34886015ae0f?w=400&h=300&fit=crop",
      isOnline: true
    }
  ];
}

// Initialize hotels management
export function initHotelsManagement() {
  // Show loading state
  const loading = document.querySelector(".hotels-management__loading");
  if (loading) loading.style.display = "block";

  // Mock data - replace with actual API call later
  allHotels = getMockHotels();
  renderHotels(allHotels);

  if (loading) loading.style.display = "none";

  // Add Property button
  const addBtn = document.querySelector(".hotels-management__add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      console.log("Add new hotel");
      setStatus("Opening new hotel form...", "info");
      // TODO: Open add hotel modal
    });
  }
}
