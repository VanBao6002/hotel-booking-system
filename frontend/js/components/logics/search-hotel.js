import { getHotelBranches } from "../../utils/utils.js";

function extraOption() {

    const stateBox = document.querySelectorAll(".search-hotel-filter__box");
    const extraButton = document.querySelectorAll(".search-hotel-filter__item-icon");

    extraButton.forEach((e, i) => {
        e.addEventListener("click", ()=> {
            if(window.getComputedStyle(stateBox[i]).display === "none") {
                stateBox[i].style.display = "flex";
                extraButton[i].style.transform = "rotate(180deg)";
            }
            else {
                stateBox[i].style.display = "none";
                extraButton[i].style.transform = "rotate(0)";
            }
        })
    });
}

function rederHotel() {
    const hotelBranches = getHotelBranches();
    let hotelResultEl = document.querySelector(".search-hotel-result__body");
    
    if(hotelBranches) {
        let html = "";
        hotelBranches.forEach(branch => {
            const { id, address ,averageStar, cheapestRoom: { price}} = branch;

            html += `<div class="search-hotel-result__wrap">
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
                            <span class="search-hotel-result__price-current">${price}VNĐ</span>
                          </div>
                          <div class="btn choice-hotel">Chọn phòng</div>
                        </div>
                      </div>`
        })
        hotelResultEl.innerHTML = html;
    }
}

export function initSearchHotel() {
    extraOption();
    rederHotel();
}