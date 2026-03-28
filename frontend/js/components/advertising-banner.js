export function initAdvertisingBanner() {

    const container = document.querySelector(".advertising-banner__wrap");
    const nextButton = document.querySelector(".advertising-banner__btn-next");
    const previousButton = document.querySelector(".advertising-banner__btn-previous");

    nextButton.addEventListener("click", () => {
        nextButton.style.display = "none";
        previousButton.style.display = "flex";
        container.scrollLeft = 1200;
    });

    previousButton.addEventListener("click", () => {
        nextButton.style.display = "flex";
        previousButton.style.display = "none";
        container.scrollLeft = 0;
    });

    container.addEventListener("scroll", () => {
        if(container.scrollLeft === 1200) {
            nextButton.style.display = "none";
            previousButton.style.display = "flex";
        }
        else if (container.scrollLeft === 0) {
            nextButton.style.display = "flex";
            previousButton.style.display = "none";
        }
        else {
            nextButton.style.display = "flex";
            previousButton.style.display = "flex";
        }
    });
}