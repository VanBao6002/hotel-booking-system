
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

export function initSearchHotel() {
    extraOption();
}