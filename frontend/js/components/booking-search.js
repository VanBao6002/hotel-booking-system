
// global var

var textLocation = "";
var count = {
    adult: 1,
    childrent: 0,
    room: 1,
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
    
    input.value = "";
    

    element.addEventListener("click", () => showWrap(input, searchInputWrap));

    input.addEventListener("blur", () => hideWrap(input, searchInputWrap, textLocation));

    document.querySelectorAll(".location-item").forEach(item => {
        item.addEventListener("mousedown", () => {
            textLocation = item.textContent;
        });
    });

}

function initDuration(element) {

}

function initGuestsRooms(element) {

    const input = element.querySelector("input");
    const searchInputWrap = element.querySelector(".booking-search__dropdown");
    const errorMessage = element.querySelector(".guests-rooms-msg");

    
    
    input.value = count.adult + " Người lớn, " + count.childrent + " Trẻ em, " + count.room + " Phòng";

    const Max = {
        adult: 30,
        childrent: 6,
        room: 30
    };

    const Min = {
        adult: 1,
        childrent: 0,
        room: 1
    };

    const countElement = document.querySelectorAll(".booking-search__control span");
    const plusButtons = document.querySelectorAll(".booking-search__control-btn--plus");
    const minusButtons = document.querySelectorAll(".booking-search__control-btn-minus");


    countElement[0].innerText = count.adult;
    countElement[1].innerText = count.childrent;
    countElement[2].innerText = count.room;

    function updateInputer(countAdult, countChildrent, countRoom) {
        let textCurrent = countAdult + " Người lớn, " + countChildrent + " Trẻ em,  " + countRoom + " Phòng";
        input.value = textCurrent;
    }

    // countAdult >= countRoom

    function updateCouter(btnIndex, countRef, el, max, min, isPlus, isSpecial,countToCmp, currentBtn) {
        if(isPlus && countRef < max) {
            minusButtons[btnIndex].classList.remove("booking-search__control-btn--limit");
            countRef++;
            if(isSpecial && countRef > countToCmp && currentBtn ==="room-btn"){
                errorMessage.style.display = "flex";
                countRef--;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                },2000);
                if(countRef === min) {
                    minusButtons[btnIndex].classList.add("booking-search__control-btn--limit");
                }
            }
            if(countRef === max) {
                plusButtons[btnIndex].classList.add("booking-search__control-btn--limit");
            }
        }
        else if(!isPlus && countRef > min ) {
            plusButtons[btnIndex].classList.remove("booking-search__control-btn--limit");
            countRef--;
            if(isSpecial && countRef < countToCmp && currentBtn === "guest-btn"){
                errorMessage.style.display = "flex";
                countRef++;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                },2000);
            }
            if(countRef === min) {
                minusButtons[btnIndex].classList.add("booking-search__control-btn--limit");
            }
        }
        
        el.innerText = countRef;
        return countRef;
    }



    plusButtons[0].addEventListener("click", () => {
        count.adult = updateCouter(0, count.adult, countElement[0], Max.adult, Min.adult, true, false);
        updateInputer(count.adult,count.childrent,count.room);
    });
    minusButtons[0].addEventListener("click", () => {
        count.adult = updateCouter(0, count.adult, countElement[0], Max.adult, Min.adult, false, true,count.room, "guest-btn");
        updateInputer(count.adult,count.childrent,count.room);
    });

    plusButtons[1].addEventListener("click", () => {
        count.childrent = updateCouter(1, count.childrent, countElement[1], Max.childrent, Min.childrent, true, false);
        updateInputer(count.adult,count.childrent,count.room);
    });
    minusButtons[1].addEventListener("click", () => {
        count.childrent = updateCouter(1, count.childrent, countElement[1], Max.childrent, Min.childrent, false, false);
        updateInputer(count.adult,count.childrent,count.room);
    });

    plusButtons[2].addEventListener("click", () => {
        count.room = updateCouter(2, count.room, countElement[2], Max.room, Min.room, true, true, count.adult, "room-btn");
        updateInputer(count.adult,count.childrent,count.room);
    });
    minusButtons[2].addEventListener("click", () => {
        count.room = updateCouter(2, count.room, countElement[2], Max.room, Min.room, false, false);
        updateInputer(count.adult,count.childrent,count.room);
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
        else if(searchInputWrap.classList.contains("booking-search__dropdown--guests-rooms")){
            initGuestsRooms(element);
        }
        else if(searchInputWrap.classList.contains("duration-wrap")) {
            initDuration(element);
        }
    });

    document.querySelector(".booking-search__submit").addEventListener("click", () => {
        console.log(textLocation,count);
    })
    document.querySelector(".booking-search__last-view").addEventListener("click", () =>{
        console.log(1);
    });
}