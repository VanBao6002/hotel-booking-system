import { searchHotel } from "../../services/hotel.js";
import { formatDate } from "../../utils/utils.js";
import { navigation } from "../../router/router.js";
import { searchHoteltemplate } from "../templates/search-hotel.template.js";
import { initSearchHotel } from "../logics/search-hotel.js";
import { showAppDialog } from "../../utils/app-dialog.js";

function choicePopularDestinations() {
    const popularDestinationsOverlay = document.querySelectorAll(".popular-destinations__box-overlay");
    popularDestinationsOverlay.forEach(destinationOverlay => {
        destinationOverlay.onclick = async () => {
            const role = localStorage.getItem("role");
            const token = localStorage.getItem("token");
            if (role === "guest" || !token) {
                const choice = await showAppDialog({
                    title: "Vui lòng đăng nhập",
                    message: "Bạn cần đăng nhập trước khi xem khách sạn nổi bật.",
                    actions: [
                        { label: "Đăng nhập", value: "login", primary: true },
                        { label: "Để sau", value: "cancel" },
                    ],
                });

                if (choice === "login") {
                    document.querySelector(".auth__btn-login")?.click();
                }
                return;
            }
            
            const destination = destinationOverlay.closest(".popular-destinations__box");
            const destinationName = destination.querySelector(".popular-destinations__box-title h3").textContent;
            
            console.log(`Bạn đã chọn điểm đến: ${destinationName}`);
            
            const searchInfoData = {
                location: destinationName,
                checkInDate: formatDate(new Date()),
                checkOutDate:  formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
                singleRoomQuantity: 1,
                doubleRoomQuantity: 0
            };
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
        };
    });

}

export function initPopularDestinations() {
    choicePopularDestinations();
}
