(function () {
    const slider = '[data-reviews-slider="slider"]'

    function initSlider() {
        $(slider).slick({
            arrows: true,
            dots: false,
            accessibility: false,
            infinite: false,
            adaptiveHeight: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: '<div class="reviews-slider__arrow reviews-slider__arrow--prev"><svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<g clip-path="url(#clip0_4_2)">\n' +
                '<path d="M1.59193 10.4799L9.27288 18.1177C9.78255 18.6274 10.6081 18.6274 11.1177 18.1177C11.6274 17.6081 11.6274 16.7897 11.1177 16.2872L4.29103 9.50359L11.1177 2.71276C11.6274 2.20309 11.6274 1.38475 11.1177 0.882253C10.6081 0.372582 9.78255 0.372582 9.27288 0.882253L1.59193 8.52014C1.3191 8.79292 1.1971 9.15184 1.2186 9.50359C1.1971 9.85533 1.3191 10.2143 1.59193 10.4799Z" fill="#282828"/>\n' +
                '</g>\n' +
                '<defs>\n' +
                '<clipPath id="clip0_4_2">\n' +
                '<rect width="18" height="11" fill="white" transform="translate(11.5 0.5) rotate(90)"/>\n' +
                '</clipPath>\n' +
                '</defs>\n' +
                '</svg></div>',
            nextArrow: '<div class="reviews-slider__arrow reviews-slider__arrow--next"><svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<g clip-path="url(#clip0_4_5)">\n' +
                '<path d="M9.90807 8.02014L2.22712 0.382299C1.71745 -0.127401 0.891925 -0.127401 0.382254 0.382299C-0.127417 0.891899 -0.127417 1.7103 0.382254 2.2128L7.20897 8.99641L0.382254 15.7872C-0.127417 16.2969 -0.127418 17.1153 0.382253 17.6177C0.891924 18.1274 1.71745 18.1274 2.22712 17.6177L9.90807 9.97986C10.1809 9.70708 10.3029 9.34816 10.2814 8.99641C10.3029 8.64467 10.1809 8.28574 9.90807 8.02014Z" fill="#282828"/>\n' +
                '</g>\n' +
                '<defs>\n' +
                '<clipPath id="clip0_4_5">\n' +
                '<rect width="18" height="11" fill="white" transform="translate(0 18) rotate(-90)"/>\n' +
                '</clipPath>\n' +
                '</defs>\n' +
                '</svg></div>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        adaptiveHeight: true,
                        arrows: false,
                    }
                }
            ]
        });
    }

    initSlider();
})()