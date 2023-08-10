(function () {
    const root = '[data-relink-column="root"]'
    const list = '[data-relink-column="list"]'
    const btn = '[data-relink-column="btn"]'
    const listVisibleItems = 5

    /*Функция записи общей высоты списка в дата атрибут*/
    function saveHeight(el) {
        const height = el.outerHeight(true);
        el.attr('data-relink-column-height', height);
    }

    /*Функция записи высоты определенного количеста пунктов дата атрибут*/
    function saveFixedHeight(list, listItem, itemsLimit) {
        var items = list.find(listItem),
            itemsHeight = 0;

        for (let i = 0; i < itemsLimit; i++) {
            itemsHeight += $(items[i]).outerHeight(true);
        }

        list.attr('data-relink-column-fixed-height', itemsHeight);
    }


    $(list).each(function () {
        const $this = $(this)
        const itemsCount = $this.find('li').length

        if (itemsCount > listVisibleItems) {
            saveHeight($this);
            saveFixedHeight($this, 'li', listVisibleItems);
            $this.height($this.attr('data-relink-column-fixed-height'));
            $("<div class='relink-column__btn' data-relink-column='btn'><span></span> <span></span> <span></span></div>").appendTo($this.closest(root));
        }
    });

    /*При клике на кнопку еще увеличиваем либо уменьшаем высоту списка*/
    $(document).on('click', btn, function () {
        const $this = $(this)
        const $root = $this.closest(root)
        const $list = $root.find(list)
        const listHeight = $list.attr('data-relink-column-height')
        const listFiexdHeight = $list.attr('data-relink-column-fixed-height')
        const animationTime = 200;

        $list.toggleClass('open');
        $this.toggleClass('open');

        if ($list.hasClass('open')) {
            $list.stop(true);
            $list.animate({
                height: listHeight + "px"
            }, animationTime);
        } else {
            $list.stop(true);
            $list.animate({
                height: listFiexdHeight + "px"
            }, animationTime);
        }
    });
})()