(function () {
    const root = '[data-relink-blocks-container]'

    function initSlider() {
        $(root).slick({
            arrows: false,
            dots: true,
            accessibility: false,
            infinite: false,
            adaptiveHeight: false,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }

    if(window.matchMedia("(max-width: 991px)").matches) {
        initSlider();
    }
})()