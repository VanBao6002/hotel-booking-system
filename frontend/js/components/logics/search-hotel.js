import { navigation } from "../../router/router.js";
import {  HotelService, safeJsonParse } from "../../utils/utils.js";
import { initBookingSearch } from "../logics/booking-search.js";

function extraOption() {

    const stateBox = document.querySelectorAll(".search-hotel-filter__box");
    const extraButton = document.querySelectorAll(".search-hotel-filter__item-icon");

    extraButton.forEach((e, i) => {
        e.onclick = ()=> {
            if(window.getComputedStyle(stateBox[i]).display === "none") {
                stateBox[i].style.display = "flex";
                extraButton[i].style.transform = "rotate(180deg)";
            }
            else {
                stateBox[i].style.display = "none";
                extraButton[i].style.transform = "rotate(0)";
            }
        };
    });
}

function choiceHotel() {
  const container = document.querySelector(".search-hotel-result__body");
  container.onclick = (e) => {
    const wrap = e.target.closest(".search-hotel-result__wrap");
    if (wrap) {
      const hotelId = wrap.id;
      localStorage.setItem("choicedHotelId", hotelId);
      navigation("#booking");
    }
  };
}

function hotelCard(id, address, averageStar, price) {
  return `
    <div class="search-hotel-result__wrap" id="${id}">
      <div class="search-hotel-result__picture">
        <div class="search-hotel-result__picture-img">
          <img src="assets/images/example-room.jpg" alt="room">
        </div>
      </div>
      <div class="search-hotel-result__info">
        <div class="search-hotel-result__hotel">
          <div class="search-hotel-result__hotel-name">
            <span>Hotel ${id}</span>
          </div>
          <div class="search-hotel-result__hotel-rate">
            <span>${averageStar}</span>
            <i class="fa-solid fa-star"></i>
          </div>
        </div>
        <div class="search-hotel-result__location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${address}</span>
        </div>
      </div>
      <div class="search-hotel-result__price">
        <div class="search-hotel-result__price-wrap">
          <span class="search-hotel-result__price-current">${price.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div class="btn choice-hotel">Chọn phòng</div>
      </div>
    </div>  
  `;
}

function renderHotelFilter(filterFn, sortFn) {
    const hotelBranches = HotelService.getBranches(filterFn,sortFn);
    let hotelResultEl = document.querySelector(".search-hotel-result__body");
    
    if(hotelBranches && hotelBranches.length > 0) {
        let html = "";
        hotelBranches.forEach(branch => {
            const { id, address ,averageStar, cheapestRoom: { price}} = branch;
            html += hotelCard(id, address, averageStar, price);
        });
        hotelResultEl.innerHTML = html;
    }
    else {
      hotelResultEl.innerHTML = `<p style="text-align:center; font-size: 1.6rem; color: gray">Không tìm thấy khách sạn phù hợp.</p>`;
    }
}

function renderHotel() {

  const filterRateEl = document.querySelector(".search-hotel-filter__rate");
  const filterPriceEl = document.querySelector(".search-hotel-filter__price");

  let currentFilters = {
    sortPrice: null,
    stars: []
  };

  function applyFilters() {
    
    const filterFn = currentFilters.stars.length > 0
      ? (branch) => currentFilters.stars.includes(Math.floor(branch.averageStar))
      : null;

    const sortFn = 
      currentFilters.sortPrice === "asc"
        ? (a, b) => a.cheapestRoom.price - b.cheapestRoom.price
      : currentFilters.sortPrice === "desc"
        ? (a, b) => b.cheapestRoom.price - a.cheapestRoom.price
      : null;

    renderHotelFilter(filterFn,sortFn);
  }

  function handleFilterRate() {
    let filterRateCheckBoxs = filterRateEl.querySelectorAll(".search-hotel-filter__box-choice input");

    filterRateCheckBoxs.forEach((cb) => {
      cb.onclick = () => {
        const star = Number(cb.value);

        if(cb.checked) {
          currentFilters.stars.push(star);
        }
        else{
          currentFilters.stars = currentFilters.stars.filter((s) => {
            return s !== star; 
          })
        }
        // console.log(currentFilters);
        applyFilters();

      };
    });
  }

  function handleFilterPrice() {
    let filterPriceCheckBoxs = filterPriceEl.querySelectorAll(".search-hotel-filter__box-choice input");
    
    //xu ly chi checked 1 trong 2 nut
    filterPriceCheckBoxs.forEach((cb, index) => {
      cb.onchange = () => {
        filterPriceCheckBoxs.forEach((otherCb, otherIndex) => {
          if(otherIndex !== index) {
            otherCb.checked = false;
          }
        });

        if(index === 0 && cb.checked) {
          currentFilters.sortPrice = "asc";
        }
        else if(index === 1 && cb.checked) {
          currentFilters.sortPrice = "desc"
        }
        else {
          currentFilters.sortPrice = null;
        }
        
        applyFilters();
        
      };
    });
  }
  handleFilterRate();
  handleFilterPrice();
  applyFilters();
}

function initSearchInfoData() {
    const searchInfoData = safeJsonParse(localStorage.getItem("searchInfoData"), {}); 
    setTimeout(() => {
        document.querySelector("#hotel-location").value = searchInfoData.location;
        document.querySelector("#start-date").value = searchInfoData.checkInDate;
        document.querySelector("#end-date").value = searchInfoData.checkOutDate;
        document.querySelector("#rooms").value = searchInfoData.singleRoomQuantity + " Phòng đơn, " + searchInfoData.doubleRoomQuantity + " Phòng đôi";
    }, 0);
}

export function initSearchHotel() {
    initBookingSearch();
    extraOption();
    renderHotel();
    choiceHotel();
    initSearchInfoData();
}