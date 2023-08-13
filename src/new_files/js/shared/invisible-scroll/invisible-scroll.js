(function () {
    function isScrolledLeftToEnd(container) {
        return container.scrollLeft === 0;
    }

    function isScrolledRightToEnd(container) {
        return parseInt(container.scrollLeft + container.clientWidth) === parseInt(container.scrollWidth);
    }

    function handleScrollCheck(container, root) {
        if (parseInt(container.clientWidth) < parseInt(container.scrollWidth)) {
            root.classList.add('has-scroll')
        } else {
            root.classList.remove('has-scroll')
        }
    }

    function updateButtonsState(container, backwardButton, forwardButton) {
        if (!isScrolledLeftToEnd(container) && !isScrolledRightToEnd(container)) {
            backwardButton.classList.remove('disabled')
            forwardButton.classList.remove('disabled')
        }

        if (isScrolledLeftToEnd(container)) {
            backwardButton.classList.add('disabled')
            forwardButton.classList.remove('disabled')
        }

        if (isScrolledRightToEnd(container)) {
            backwardButton.classList.remove('disabled')
            forwardButton.classList.add('disabled')
        }
    }

    const scrollableContainers = document.querySelectorAll('[data-invisible-scroll="root"]')

    scrollableContainers.forEach(i => {
        const item = i.querySelector('[data-invisible-scroll="container"]')
        const scrollBackwardButton = i.querySelector('[data-invisible-scroll="btn-prev"]');
        const scrollForwardButton = i.querySelector('[data-invisible-scroll="btn-next"]');

        let isTouchPad = false
        let isDown = false;
        let startX;
        let scrollLeft;
        let isEventPrevent = false


        handleScrollCheck(item, i)

        item.addEventListener('wheel', (event) => {
            event.preventDefault();

            if (event.deltaX !== 0) {
                isTouchPad = true
            }

            if (isTouchPad) {
                item.scrollLeft += event.deltaX;
            } else {
                item.scrollLeft += event.deltaY;
            }

            if (scrollBackwardButton && scrollForwardButton) {
                updateButtonsState(item, scrollBackwardButton, scrollForwardButton)
            }
        });


        item.addEventListener('mousedown', (event) => {
            isDown = true;
            isEventPrevent = false
            startX = event.pageX - item.offsetLeft;
            scrollLeft = item.scrollLeft;
        });

        item.addEventListener('mouseleave', () => {
            isDown = false;
            isEventPrevent = false
            isTouchPad = false
        });

        item.addEventListener('mouseup', (e) => {
            isDown = false;
        });

        item.addEventListener('click', (e) => {
            if (isEventPrevent) {
                e.preventDefault()
                e.stopPropagation()
            }
        }, true)

        item.addEventListener('mousemove', (event) => {
            if (!isDown) return;
            event.preventDefault();
            const x = event.pageX - item.offsetLeft;
            const walk = (x - startX) * 1; // Скорость прокрутки
            item.scrollLeft = scrollLeft - walk;

            // Включаем отмену события если юзер сдвинул прокрутку более чем на 3 px чтобы при отпускании мышки не совершался переход по ссылкам и т.п
            if (walk > 3 || walk < -3) {
                isEventPrevent = true
            }

            if (scrollBackwardButton && scrollForwardButton) {
                if (scrollBackwardButton && scrollForwardButton) {
                    updateButtonsState(item, scrollBackwardButton, scrollForwardButton)
                }
            }
        });

        if (scrollBackwardButton) {
            scrollBackwardButton.addEventListener('click', () => {
                item.scrollBy({
                    left: -90,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    updateButtonsState(item, scrollBackwardButton, scrollForwardButton)
                }, 200)
            });
        }

        if (scrollForwardButton) {
            scrollForwardButton.addEventListener('click', () => {
                item.scrollBy({
                    left: 90,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    updateButtonsState(item, scrollBackwardButton, scrollForwardButton)
                }, 200)
            });
        }
    })
})()