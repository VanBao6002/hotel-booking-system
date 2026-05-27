// global var

import { navigation } from "../../router/router.js";
import { searchHotel } from "../../services/hotel.js";
import { searchHoteltemplate } from "../templates/search-hotel.template.js";
import { initSearchHotel } from "../logics/search-hotel.js";

var textLocation = "";

var count = {
    singleRoom: 1,
    coupleRoom: 0
};

var minDate = new Date();

var startDate = {
    year: "",
    month: "",
    day: ""
};


var endDate = {
  year: "",
  month: "",
  day: ""
};


export function searchElement(selector) {
    return document.querySelector(selector);
}

export function searchElementAll(selector) {
    return document.querySelectorAll(selector);
}

function hideWrap(input, searchInputWrap, textCurrent) {
    searchInputWrap.style.display = "none";
    input.value = textCurrent;
}

function showWrap(input, searchInputWrap) {
    input.focus();
    searchInputWrap.style.display = "block";
    input.value = "";
} 


function initLocation(element) {
    
    const input = element.querySelector("input");
    const searchInputWrap = element.querySelector(".booking-search__dropdown");
    
    // input.value = "";
    

    element.addEventListener("click", () => showWrap(input, searchInputWrap));

    input.addEventListener("blur", () => hideWrap(input, searchInputWrap, textLocation));

    document.querySelectorAll(".location-item").forEach(item => {
        item.addEventListener("mousedown", () => {
            textLocation = item.textContent;
        });
    });

}

function initDuration(element) {

    const inputStart = element.querySelector(".booking-search__input-start");
    const inputEnd = element.querySelector(".booking-search__input-end");


    startDate.day = String(minDate.getDate()).padStart(2, "0");
    startDate.month = String(minDate.getMonth() + 1).padStart(2, "0");
    startDate.year = String(minDate.getFullYear());

    let initDate = new Date(minDate);
    initDate.setDate(minDate.getDate() + 1); 

    endDate.day = String(initDate.getDate()).padStart(2, "0");
    endDate.month = String(initDate.getMonth() + 1).padStart(2, "0");
    endDate.year = String(initDate.getFullYear());

    inputStart.min = `${startDate.year}-${startDate.month}-${startDate.day}`;
    inputStart.value = `${startDate.year}-${startDate.month}-${startDate.day}`;

    inputEnd.min = `${endDate.year}-${endDate.month}-${endDate.day}`;
    inputEnd.value = `${endDate.year}-${endDate.month}-${endDate.day}`;
    
    let valueInputStart;
    let valueInputEnd;

    inputStart.addEventListener("change", () => {
        
        valueInputStart = inputStart.value.split("-");
        startDate = {
            year: valueInputStart[0],
            month: valueInputStart[1],
            day: valueInputStart[2]
        }

        let currentChoice = new Date(startDate.year, startDate.month - 1, startDate.day);
        let nextChoice = new Date(currentChoice);
        nextChoice.setDate(currentChoice.getDate()+ 1);


        inputEnd.min = `${nextChoice.getFullYear()}-${String(nextChoice.getMonth() + 1).padStart(2, "0")}-${String(nextChoice.getDate()).padStart(2, "0")}`;
        inputEnd.value = inputEnd.min;

        valueInputEnd = inputEnd.value.split("-");
        endDate = {
            year: valueInputEnd[0],
            month: valueInputEnd[1],
            day: valueInputEnd[2]
        }

    });
    inputStart.onkeydown = () => {
        return false;
    };

    inputEnd.addEventListener("change", () => {
        valueInputEnd = inputEnd.value.split("-");
        endDate = {
            year: valueInputEnd[0],
            month: valueInputEnd[1],
            day: valueInputEnd[2]
        }
    });
    inputEnd.onkeydown = () => {
        return false;
    };


    
}

function initGuestsRooms(element) {

    const input = element.querySelector("input");
    const searchInputWrap = element.querySelector(".booking-search__dropdown");
    
    
    input.value = count.singleRoom + " Phòng đơn, " + count.coupleRoom + " Phòng đôi";

    const Max = {
        singleRoom: 10,
        coupleRoom:10
    };

    const Min = {
        singleRoom: 0,
        coupleRoom: 0
    };

    const countElement = document.querySelectorAll(".booking-search__control span");
    const plusButtons = document.querySelectorAll(".booking-search__control-btn--plus");
    const minusButtons = document.querySelectorAll(".booking-search__control-btn-minus");


    countElement[0].innerText = count.singleRoom;
    countElement[1].innerText = count.coupleRoom;

    function updateInputer(singleRoom, coupleRoom) {
        let textCurrent = singleRoom + " Phòng đơn, " + coupleRoom + " Phòng đôi";
        input.value = textCurrent;
    }


    function updateCouter(btnIndex, countRef, el, max, min, isPlus) {
        if(isPlus && countRef < max) {
            minusButtons[btnIndex].classList.remove("booking-search__control-btn--limit");
            countRef++;
            if(countRef === max) {
                plusButtons[btnIndex].classList.add("booking-search__control-btn--limit");
            }
        }
        else if(!isPlus && countRef > min ) {
            plusButtons[btnIndex].classList.remove("booking-search__control-btn--limit");
            countRef--;
            if(countRef === min) {
                minusButtons[btnIndex].classList.add("booking-search__control-btn--limit");
            }
        }
        
        el.innerText = countRef;
        return countRef;
    }



    plusButtons[0].addEventListener("click", () => {
        count.singleRoom = updateCouter(0, count.singleRoom, countElement[0], Max.singleRoom, Min.singleRoom, true);
        updateInputer(count.singleRoom,count.coupleRoom);
    });
    minusButtons[0].addEventListener("click", () => {
        count.singleRoom = updateCouter(0, count.singleRoom, countElement[0], Max.singleRoom, Min.singleRoom, false);
        updateInputer(count.singleRoom,count.coupleRoom);

    });

    plusButtons[1].addEventListener("click", () => {
        count.coupleRoom = updateCouter(1, count.coupleRoom, countElement[1], Max.coupleRoom, Min.coupleRoom, true);
        updateInputer(count.singleRoom,count.coupleRoom);
    });
    minusButtons[1].addEventListener("click", () => {
        count.coupleRoom = updateCouter(1, count.coupleRoom, countElement[1], Max.coupleRoom, Min.coupleRoom, false);
        updateInputer(count.singleRoom,count.coupleRoom);
    });






    const showWrap = (input, searchInputWrap) => {
        input.focus();
        searchInputWrap.style.display = "block";
    }


    element.addEventListener("click", () => showWrap(input, searchInputWrap));

    function clickOutSide(e) {
        if(!element.contains(e.target)) {
            searchInputWrap.style.display = "none";
        }
    }

    document.addEventListener("click", clickOutSide);
}


export function initBookingSearch() {

    const searchBox = document.querySelectorAll(".booking-search__box");

    searchBox.forEach((element) => {
        const searchInputWrap = element.querySelector(".booking-search__dropdown");

        if(searchInputWrap.classList.contains("booking-search__dropdown--location")){
            initLocation(element);
        }
        else if(searchInputWrap.classList.contains("booking-search__dropdown--rooms")){
            initGuestsRooms(element);
        }
        else if(searchInputWrap.classList.contains("booking-search__dropdown--duration")) {
            initDuration(element);
        }
    });


    const searchButton = document.querySelector(".booking-search__submit");
    const locationInput = document.getElementById("hotel-location");

    searchButton.addEventListener("click", () => {
        if(locationInput.value !== "" && (count.singleRoom !== 0 || count.coupleRoom !== 0)) {

            const searchInfoData = {
                location: textLocation,
                checkInDate: `${startDate.year}-${startDate.month}-${startDate.day}`,
                checkOutDate: `${endDate.year}-${endDate.month}-${endDate.day}`,
                singleRoomQuantity: count.singleRoom,
                doubleRoomQuantity: count.coupleRoom
            };
            console.log(searchInfoData);

            localStorage.setItem("searchInfoData", JSON.stringify(searchInfoData));
            
            searchHotel(searchInfoData)
                .then(data => {
                    localStorage.setItem("hotelData", JSON.stringify(data));
                    if(window.location.hash !== "#search-hotel") {
                        navigation("#search-hotel");
                    }
                    else {
                        const main = document.querySelector(".main");
                        main.innerHTML = searchHoteltemplate();
                        initSearchHotel();
                        console.log("Check input:", document.querySelector("#hotel-location"));
                    }
                    console.log(data);
                })
                .catch(errorData => {
                    console.log("fail(searchbooking)");
                    console.log(errorData);
                })
        }
    });


}