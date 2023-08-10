(function () {
    const slider = '[data-reviews-slider="slider"]'

    function initSlider() {
        $(slider).slick({
            arrows: false,
            dots: false,
            accessibility: false,
            infinite: false,
            adaptiveHeight: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        adaptiveHeight: true,
                    }
                }
            ]
        });
    }

    initSlider();
})()