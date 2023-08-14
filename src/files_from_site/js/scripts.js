var form_master = null;
var fm_summ = null;
var fm_limit = null;
var fm_over = null;
var fm_total = null;
var fm_day = null;
moment.locale('ru', {
    calendar: {
        lastDay: 'D MMMM YYYY',
        sameDay: 'D MMMM YYYY',
        nextDay: 'D MMMM YYYY',
        lastWeek: 'D MMMM YYYY',
        nextWeek: 'D MMMM YYYY',
        sameElse: 'D MMMM YYYY'
    }
});

/**
 * Получение склонение слова "день"
 * type - Тип (1 - день, 2 - месяц, 3 - недель)
 */
function getDeclensionWordDay(day, type = 1) {
    let result;
    let format;
    day = day.toString();

    if (day === '1' || (day.substr(-1) === '1' && day.substr(-2) !== '11')) {
        format = 1;
    } else if (
        jQuery.inArray(day.substr(-1), ['2', '3', '4']) !== -1
        && day.substr(-2) !== '12'
        && day.substr(-2) !== '13'
        && day.substr(-2) !== '14'
    ) {
        format = 2;
    } else {
        format = 3;
    }

    if (+type === 3) {
        if (format === 1) {
            result = 'неделя';
        } else if (format === 2) {
            result = 'недели';
        } else {
            result = 'недель';
        }
    } else if (+type === 2) {
        if (format === 1) {
            result = 'месяц';
        } else if (format === 2) {
            result = 'месяца';
        } else {
            result = 'месяцев';
        }
    } else { // 1
        if (format === 1) {
            result = 'день';
        } else if (format === 2) {
            result = 'дня';
        } else {
            result = 'дней';
        }
    }

    return result;
}

function formatPrice(price) {
    let result = '';
    if (typeof (price) != 'undefined') {
        if (typeof (price) == 'number')
            price = price.toString();
        if (price.length > 0) {
            let testPrice = /^([\d]+)|([\d]+\.|,[\d]+)$/;
            if (testPrice.test(price)) {
                let str, integral, decimal, delim, regex;
                regex = /\.|,[\d]+$/ig;
                delimPos = price.search(regex);
                if (delimPos >= 0) {
                    integral = price.substr(0, delimPos);
                    decimal = price.substr(delimPos + 1);
                } else {
                    integral = price;
                    decimal = '';
                }
                str = integral;
                let blockSize = 3;
                if (str.length > blockSize) {
                    while (str.length > 0) {
                        if (str.length > blockSize) {
                            result = ' ' + str.substr((blockSize * (-1)), blockSize) + result;
                            str = str.substr(0, (str.length - blockSize));
                        } else {
                            result = str + result;
                            str = '';
                        }
                    }
                    result = decimal.length > 0 ? result + '.' + decimal : result;
                } else {
                    result = str + (decimal.length > 0 ? '.' + decimal : '');
                }
            } else {
                result = price;
            }
        }
    }
    return result;
}


jQuery(function ($) {
    if (typeof $('form[name="index_master"]').html() != 'undefined') {
        form_master = $('form[name="index_master"]');
        fm_summ = $(form_master).find('input[name="summ"]');
        fm_limit = $(form_master).find('input[name="limit"]');
        fm_over = $(form_master).find('input[name="over"]');
        fm_total = $(form_master).find('input[name="total"]');
        fm_day = $(form_master).find('input[name="day"]');
    }

    $('#calc_butt').on('click', function () {
        $(this).attr('disabled', 'disabled');
        setWait(true);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api/json/submitMainCalc',
            data: {
                data_form: $('form[name="index_master"]').serialize()
            },
            success: function (data) {
                if (data.result == true) {
                    window.top.location.href = data.response;
                } else {
                    setWait(false);
                }
            }
        });
    });
});


jQuery(document).ready(function ($) {
    var summ = parseInt($('input[name="summ"]').val());
    var days = parseInt($('input[name="limit"]').val());
    var p = parseFloat($('#procent').val()) / 100;
    var days_to_reduce = (typeof $('#days_to_reduce').val() !== 'undefined') ? parseInt($('#days_to_reduce').val()) : 0;
    var is_annuity = isNaN(parseInt($("#annuity").val())) ? 0 : parseInt($("#annuity").val());

    if (typeof $('#extend_show_txt').val() != 'undefined') {
        if (days > $('#extend_show_txt').val()) {
            $('.extent-calc-term').find('.ext_term').html(days - $('#extend_show_txt').val());
            $('.extent-calc-term').removeClass('hidden');
            $('.calc-extent_total').find('.ext_term').html(days - $('#extend_show_txt').val());
            $('.calc-extent_total').find('.ext_total').html(formatPrice(Math.ceil(summ * (days - $('#extend_show_txt').val()) * p)));
            $('.calc-extent_total').removeClass('hidden');

            // var days = $('#extend_show_txt').val();
        } else {
            $('.extent-calc-term').addClass('hidden');
            $('.calc-extent_total').addClass('hidden');
        }
    }

    if (typeof $('.calc-day').html() != 'undefined') {
        $('.calc-day').html(moment().add(days - days_to_reduce, 'days').calendar() + ' г.');
    }
    if (typeof $('.calc-day-short').html() != 'undefined') {
        $('.calc-day-short').html(moment().add(days - days_to_reduce, 'days').format('DD.MM.YYYY') + ' г.');
    }
    if (fm_day !== null && is_annuity === 0) {
        $(fm_day).val(moment().add(days - days_to_reduce, 'days').format('DD.MM.YYYY'));
    }
    if (fm_total !== null && is_annuity === 0) {
        $(fm_total).val(summ + (summ * p * days));
    }

    if (typeof $('.uislider.summ').html() != 'undefined') {
        $('.uislider.summ').slider({
            step: parseFloat($('#step_amount').val()),
            value: Math.round(parseFloat($('input[name="summ"]').val())),
            orientation: "horizontal",
            range: "min",
            max: parseFloat($('#sum-max').val()),
            min: parseFloat($('#sum-min').val()),
            animate: true,
            slide: function (event, ui) {
              console.log("slide");
                days = parseInt($('input[name="limit"]').val());
                summ = ui.value;
                if (useCheckProductWithParameters()) {
                    checkProductWithParameters(summ, null, 'sum');
                } else {
                    slide_summ(summ);
                }

                setMark('.uislider.summ.set_mark', summ, $('#currency_lang').val());
            },
            stop: function (event, ui) {
                summ = ui.value;
                if (useCheckProductWithParameters()) {
                    checkProductWithParameters(summ, null, 'sum');
                } else {
                    slide_summ(summ);
                }
                days = parseInt($('input[name="limit"]').val());
                /* доп. продукты по диапазонам сумм займа */
                updateExtraServicesBroken(summ, days);
                calcOver(summ, days);
            }
        });
        /* доп. продукты по диапазонам сумм займа */
        updateExtraServicesBroken(Math.round(parseFloat($('input[name="summ"]').val())));
        setMark('.uislider.summ.set_mark', $('.uislider.summ').slider('option', 'value'), $('#currency_lang').val());

        function slide_summ(value) {
            var isa = isNaN(parseInt($("#annuity").val())) ? 0 : parseInt($("#annuity").val());
            $sum_max = parseFloat($("#p1").attr("attr-maxa"));
            summ = value;
            if (typeof $('#summ_handle').html() != 'undefined') {
                // $('#summ_handle').show();
                $('#summ_handle').html(summ + ' ₽');
            }
            if (fm_summ !== null) {
                $(fm_summ).val(summ);
            }
            if (typeof $('[name="pay[sum]"]').val() != 'undefined') {
                $('[name="pay[sum]"]').val(summ);
            }
            days = parseInt($('input[name="limit"]').val());
            let count_prod = $("#count_prod").val();
            let sniffling = false;
            for (var i = 1; i <= count_prod; i++) {
                p_el = $("#p" + i);
                if ((summ >= ($(p_el).attr("attr-mina"))) && (summ <= ($(p_el).attr("attr-maxa")))) {
                    if ($('input[name="product"]').val() != $(p_el).attr("attr-id")) {
                        if ((days >= ($(p_el).attr("attr-mint"))) && (days <= ($(p_el).attr("attr-maxt")))) {
                            console.log("days", days, $(p_el).attr("attr-mint"));
                            console.log("days2", days, $(p_el).attr("attr-maxt"));
                            $('#procent').val($(p_el).attr("attr-p"));
                            $('input[name="product"]').val($(p_el).attr("attr-id"));
                        } else if (isa == $(p_el).attr("attr-isa")) {
                            for (var k = 1; k <= count_prod; k++) {
                                if (
                                    (summ >= ($(p_el).attr("attr-mina"))) && (summ <= ($(p_el).attr("attr-maxa")))
                                    && (days >= ($(p_el).attr("attr-mint"))) && (days <= ($(p_el).attr("attr-maxt")))
                                ) {
                                    sniffling = true;
                                    break;
                                }
                            }
                        }
                        if (sniffling || (isa != $(p_el).attr("attr-isa"))) {
                          console.log(i,count_prod );
                            if (isa != $(p_el).attr("attr-isa") && (i < count_prod)) {
                                $(".uislider.limit").slider("value", 0);
                                $(".mci_v2").removeClass("mci_v2_cust");
                            } else {
                                $(".uislider.limit").slider("value", $(p_el).attr("attr-position"));
                                if (isa != $(p_el).attr("attr-isa")) {
                                    $(".mci_v2").addClass("mci_v2_cust");
                                }
                            }
                            if (typeof $('.calc-limit').attr('class') != 'undefined') {
                              console.log('slide_sum');
                                $('.calc-limit').each(function () {
                                    var tagName = $(this).prop("tagName");
                                    if (tagName == 'SPAN') {
                                        $(this).html('<span>' + $(p_el).attr("attr-mint") + '</span><small>&nbsp;' + $(p_el).attr("attr-labelt") + '</small>');
                                    } else if (tagName == 'INPUT') {
                                        $(this).val($(p_el).attr("attr-mint"));
                                    }
                                })
                            }
                            $("input[name=limit]").val($(p_el).attr("attr-mint"));
                            $("#annuity").val($(p_el).attr("attr-isa"));
                            $('input[name="product"]').val($(p_el).attr("attr-id"));
                            days = $(p_el).attr("attr-mint");
                            //
                            // $(".term_label").html($(p_el).attr("attr-labelt"));
                        }
                    }
                    if (!sniffling) { // ADD
                        p_finded = true;
                        break;
                    }
                }
            }

            if (typeof $('.calc-summ').attr('class') != 'undefined') {
                $('.calc-summ').each(function () {
                    var tagName = $(this).prop("tagName");
                    if (tagName == 'SPAN') {
                        $(this).html(formatPrice(summ) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
                    } else if (tagName == 'INPUT') {
                        $(this).val(formatPrice(summ));
                    }
                })
            }
        }
    }

    if (typeof $('.uislider.limit').html() !== 'undefined') {
        function getSliderValues() {
            let $res = Array();
            let key = 0;
            let pos = 0;
            let count_prod = $("#count_prod").val();
            for (let i = 1; i <= count_prod; i++) {
                if ($('#p' + i).attr('attr-isa') === '1') {
                    continue;
                }
                let $min = parseInt($("#p" + i).attr("attr-mint"));
                let $max = parseInt($("#p" + i).attr("attr-maxt"));
                let $step = parseInt($("#p" + i).attr("attr-st"));
                for (let val = $min; val <= $max; val += $step) {
                    $res[key] = val;
                    //if ((i>1)&&(pos==0))
                    if ((i > (count_prod - 1)) && (pos == 0)) {
                        pos = key;
                    }
                    key++;
                }
            }
            let a1 = $res.slice(0, pos);
            let a2 = $res.slice(pos);
            let a3 = Array();
            let diff = Math.round(a1.length / a2.length) + 1;
            key = 0;
            for (let i = 0; i < a2.length; i++) {
                let y = 0;
                while (y < diff) {
                    a3[key] = a2[i];
                    key++;
                    y++;
                    if (key > a1.length) break;
                }
            }
            $res = $.merge(a1, a3);
            let delete_duplicate = $('#delete_duplicate').val();
            let result = [];
            if (typeof delete_duplicate !== 'undefined' && delete_duplicate === '1') {
                $.each($res, function (i, e) {
                    if ($.inArray(e, result) === -1) result.push(e);
                });
                result.sort(function(a, b) {
                    return a - b;
                });
            } else {
                result = $res;
            }
            let $ar_res = Array();
            key = 0;
            for (let i = 1; i <= count_prod; i++) {
                if ($('#p' + i).attr('attr-isa') === '1') {
                    let $min = parseInt($("#p" + i).attr("attr-mint"));
                    let $max = parseInt($("#p" + i).attr("attr-maxt"));
                    let $step = parseInt($("#p" + i).attr("attr-st"));
                    for (let val = $min; val <= $max; val += $step) {
                        $ar_res[key] = val;
                        key++;
                    }
                }
            }
            result = $.merge(result, $ar_res);
            return result;
        }

        $sliderValuesOnline = getSliderValues();

        $('.uislider.limit').slider({
            orientation: 'horizontal',
            range: 'min',
            step: 1,
            max: $sliderValuesOnline.length - 1,
            min: 0,
            value: $sliderValuesOnline.indexOf(parseInt($('input[name="limit"]').val())),
            animate: 'fast',
            create: function (event, ui) {
                let count_prod = $('#count_prod').val();
                let pos_divider;
                if ($('#p' + (count_prod)).attr('attr-isa') == '1') {
                    pos_divider = ($('#p' + (count_prod - 1)).attr('attr-maxt') - $('#p1').attr('attr-mint')) / $('#p1').attr('attr-st');
                } else {
                    pos_divider = $sliderValuesOnline.length - 1;
                }

                if ($('input[name="product"]').val() == $('#p' + count_prod).attr('attr-id')) {
                    for (i = pos_divider; i <= $sliderValuesOnline.length - 1; i++) {
                        if ($sliderValuesOnline[i] == $('input[name="limit"]').val()) {
                            $(this).slider('value', i);
                        }
                    }
                } else if ($('input[name="product"]').val() == $('#p1').attr('attr-id')) {
                    for (i = 0; i <= pos_divider; i++) {
                        if ($sliderValuesOnline[i] == $('input[name="limit"]').val()) {
                            $(this).slider('value', i);
                        }
                    }
                }
            },
            slide: function (event, ui) {
                if (!useCheckProductWithParameters()) {
                    limit_slide(ui.value);
                }
                days = $sliderValuesOnline[ui.value];
                if (useCheckProductWithParameters()) {
                    checkProductWithParameters(null, days, 'days');
                }
                setMark('.uislider.limit.set_mark', days, 'дней');
                summ = parseInt($('input[name="summ"]').val());
            },
            stop: function (event, ui) {
                if (!useCheckProductWithParameters()) {
                    limit_slide(ui.value);
                }
                days = $sliderValuesOnline[ui.value];
                if (useCheckProductWithParameters()) {
                    checkProductWithParameters(null, days, 'days');
                }
                summ = parseInt($('input[name="summ"]').val());
                calcOver(summ, days);
            }
        });
        setMark('.uislider.limit.set_mark', $sliderValuesOnline[$('.uislider.limit').slider('option', 'value')], 'дней');

        function limit_slide(value) {
            let count_prod = $('#count_prod').val();
            let pos_divider = ($('#p' + (count_prod - 1)).attr('attr-maxt') - $('#p1').attr('attr-mint')) / $('#p1').attr('attr-st');
            days = $sliderValuesOnline[value];
            summ = parseInt($('input[name="summ"]').val());
            ////////////
            i = 1;
            if (value > pos_divider) {
                i = count_prod;
            }
            p_el = $('#p' + i);
            if ($('input[name="product"]').val() != $(p_el).attr('attr-id')) {
                $('#procent').val($(p_el).attr('attr-p'));
                $('input[name="product"]').val($(p_el).attr('attr-id'));
                let isa = isNaN(parseInt($('#annuity').val())) ? 0 : parseInt($('#annuity').val());
                if (isa != $(p_el).attr('attr-isa')) { //type_changed
                    let newsumval = $(p_el).attr('attr-mina');
                    $('.uislider.summ').slider('value', parseInt(newsumval));

                    if (typeof $('.calc-summ').attr('class') !== 'undefined') {
                        $('.calc-summ').each(function () {
                            var tagName = $(this).prop("tagName");
                            if (tagName == 'SPAN') {
                                $(this).html(formatPrice(newsumval) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
                            } else if (tagName == 'INPUT') {
                                $(this).val(formatPrice(newsumval));
                            }
                        })
                    }
                    $('input[name=summ]').val(newsumval);
                    $('#annuity').val($(p_el).attr('attr-isa'));
                    // $('.term_label').html($(p_el).attr('attr-labelt'));
                    summ = newsumval;
                }
                if (($('#newcome').val() == 1) && (summ > $('#p1').attr('attr-maxa'))) {
                    $('#oversum').removeClass('hidden');
                } else {
                    $('#oversum').addClass('hidden');
                }
            }
            if ($('#annuity').val() != 1) {
                $('.mci_v2').removeClass('mci_v2_cust');
                if (count_prod > 2) {
                    var p_finded = false
                    for (var i = 1; i <= (count_prod - 1); i++) {
                        if ((days >= ($("#p" + i).attr("attr-mint"))) && (days <= ($('#p' + i).attr('attr-maxt'))) && (summ >= ($('#p' + i).attr('attr-mina'))) && (summ <= ($('#p' + i).attr('attr-maxa')))) {
                            p_finded = true;
                            $('#procent').val($('#p' + i).attr('attr-p'));
                            $('input[name="product"]').val($('#p' + i).attr('attr-id'));
                            break;
                        }
                    }
                }
            } else if ($('#annuity').val() == 1) {
                $('.mci_v2').addClass('mci_v2_cust');
            }
            ///////////////
            if (fm_limit !== null) {
                $(fm_limit).val(days);
            }
            if (typeof $('.calc-limit').attr('class') != 'undefined') {
                $('.calc-limit').each(function () {
                    var tagName = $(this).prop("tagName");
                    if (tagName == 'SPAN') {
                        $(this).html('<span>' + days + '</span><small>&nbsp;' + getDeclensionWordDay(days, $(p_el).attr('attr-time_val')) + '</small>');
                    } else if (tagName == 'INPUT') {
                        $(this).val(days);
                    }
                });
            }
        }
    }

    /* Функционал для изменение данных слайдера */
    $('.calc-value-box .calc-value-info').on('click', function () {
        $(this).addClass('hidden');
        $(this).parent().find('input').focus();
    });
    $('.calc-value-box input').on('focusout', function () {
        $(this).parent().find('.calc-value-info').removeClass('hidden');
    });
    $('.calc-value-box input').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $(this).parent().find('.calc-value-info').removeClass('hidden');
        }
    });

    /**
     * Использовать ли функцию checkProductWithParameters вместо "slide_summ" и "limit_slide"
     * @returns {boolean}
     */
    function useCheckProductWithParameters() {
        let count_prod = parseInt($('#count_prod').val());
        return (typeof $('#use_CPWP').val() !== 'undefined' && $('#use_CPWP').val() === '1' && count_prod > 1);
    }

    function checkProductWithParameters(newSum = null, newTerm = null, type = 'days') {
        let changeProduct = false;
        let productId = $('input[name="product"]').val();
        let productP = $('input[attr-id="' + productId + '"]');
        let updateTerm = false;
        let updateSum = false;
        if (newSum === null) {
            newSum = $('input[name="summ"]').val();
        }
        if (newTerm === null) {
            newTerm = $('input[name="limit"]').val();
        }
        newSum = parseFloat(newSum);
        newTerm = parseInt(newTerm);

        if (newSum < parseFloat(productP.attr('attr-mina')) || newSum > parseFloat(productP.attr('attr-maxa'))) {
            changeProduct = true;
        }
        if (newTerm < parseInt(productP.attr('attr-mint')) || newTerm > parseInt(productP.attr('attr-maxt'))) {
            changeProduct = true;
        }

        if (changeProduct) {
            let count_prod = parseInt($('#count_prod').val());
            for (let i = 1; i <= count_prod; i++) {
                let p_el = $('#p' + i);
                let mina = parseFloat(p_el.attr('attr-mina'));
                let maxa = parseFloat(p_el.attr('attr-maxa'));
                let mint = parseInt(p_el.attr('attr-mint'));
                let maxt = parseInt(p_el.attr('attr-maxt'));
                if ($('input[name="product"]').val() !== p_el.attr("attr-id")) {
                    if (type === 'sum' && newSum >= mina && newSum <= maxa) {
                        updateSum = true;
                        $('#procent').val(p_el.attr('attr-p'));
                        $('input[name="product"]').val(p_el.attr('attr-id'));
                        if (newTerm < mint || newTerm > maxt) {
                            updateTerm = true;

                            if (mina > 15000) {
                              newTerm = mint;
                            } else {
                              newTerm = maxt;
                            }

                            $('input[name="limit"]').val(newTerm);
                            let ind = $.inArray(newTerm, $sliderValuesOnline);
                            $(".uislider.limit").slider('value', ind);
                        }
                        break;
                    } else if (type === 'days' && newTerm >= mint && newTerm <= maxt) {
                        updateTerm = true;
                        $('#procent').val(p_el.attr('attr-p'));
                        $('input[name="product"]').val(p_el.attr('attr-id'));
                        if (newSum < mina || newSum > maxa) {
                            updateSum = true;

                            if (mina > 15000) {
                              newSum = 15500;
                            } else {
                              newSum = maxa;
                            }

                            $('input[name="summ"]').val(newSum);
                            $(".uislider.summ").slider('value', newSum);
                            /* доп. продукты по диапазонам сумм займа */
                            updateExtraServicesBroken(mina);
                        }
                        break;
                    }
                }
            }
        }

        if (updateSum || type === 'sum') {
            if (fm_summ !== null) {
                $(fm_summ).val(newSum);
            }
            if (typeof $('.calc-summ').attr('class') != 'undefined') {
                $('.calc-summ').each(function () {
                    let tagName = $(this).prop("tagName");
                    if (tagName === 'SPAN') {
                        $(this).html(formatPrice(newSum) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
                    } else if (tagName === 'INPUT') {
                        $(this).val(formatPrice(newSum));
                    }
                })
            }
        }
        if (updateTerm || type === 'days') {
            if (fm_limit !== null) {
                $(fm_limit).val(newTerm);
            }
            if (typeof $('.calc-limit').attr('class') != 'undefined') {
              console.log('checkProduct');
                let productId = $('input[name="product"]').val();
                let productP = $('input[attr-id="' + productId + '"]');
                $('.calc-limit').each(function () {
                    let tagName = $(this).prop("tagName");
                    if (tagName === 'SPAN') {
                        $(this).html('<span>' + newTerm + '</span><small>&nbsp;' + productP.attr('attr-labelt') + '</small>');
                    } else if (tagName === 'INPUT') {
                        $(this).val(newTerm);
                    }
                });
            }
        }
    }

    if (typeof $('.uislider.limit_get').html() != 'undefined') {
        $('.uislider.limit_get').slider({
            step: parseInt($('#step_term').val()),
            value: parseInt($('input[name="limit"]').val()),
            orientation: "horizontal",
            range: "min",
            max: parseInt($('#limit-max').val()),
            min: parseInt($('#limit-min').val()),
            animate: true,
            slide: function (event, ui) {
                days = ui.value;
                ///////////////
                if (fm_limit !== null) {
                    $(fm_limit).val(days);
                }
                if (typeof $('.calc-limit').attr('class') != 'undefined') {
                  console.log('limitget');
                    $('.calc-limit').each(function () {
                        var tagName = $(this).prop("tagName");
                        if (tagName == 'SPAN') {
                            $(this).html('<span>' + days + '</span><small>&nbsp;' + getDeclensionWordDay(days, $('#p1').attr('attr-time_val')) + '</small>');
                        } else if (tagName == 'INPUT') {
                            $(this).val(days);
                        }
                    });
                }
                setMark('.uislider.limit_get.set_mark', days, 'дней');
            },
            stop: function (event, ui) {
                days = ui.value;
                summ = parseInt($('input[name="summ"]').val());
                calcOver(summ, days);
            }
        });
        setMark('.uislider.limit_get.set_mark', $('.uislider.limit_get').slider('option', 'value'), 'дней');
    }
    if (typeof $('.uislider.summ_get').html() != 'undefined') {
        $('.uislider.summ_get').slider({
            step: parseInt($('#step_amount').val()),
            value: Math.round(parseInt($('input[name="summ"]').val())),
            orientation: "horizontal",
            range: "min",
            max: parseInt($('#sum-max').val()),
            min: parseInt($('#sum-min').val()),
            animate: true,
            slide: function (event, ui) {
                summ = ui.value;
                if (fm_summ !== null) {
                    $(fm_summ).val(summ);
                }
                if (typeof $('.calc-summ').attr('class') != 'undefined') {
                    $('.calc-summ').each(function () {
                        var tagName = $(this).prop("tagName");
                        if (tagName == 'SPAN') {
                            $(this).html(formatPrice(summ) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
                        } else if (tagName == 'INPUT') {
                            $(this).val(formatPrice(summ));
                        }
                    })
                }
                setMark('.uislider.summ_get.set_mark', summ, $('#currency_lang').val());
            },
            stop: function (event, ui) {
                summ = ui.value;
                if (fm_summ !== null) {
                    $(fm_summ).val(summ);
                }
                days = parseInt($('input[name="limit"]').val());
                calcOver(summ, days);
                if (typeof $('.calc-summ').attr('class') != 'undefined') {
                    $('.calc-summ').each(function () {
                        var tagName = $(this).prop("tagName");
                        if (tagName == 'SPAN') {
                            $(this).html(formatPrice(summ) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
                        } else if (tagName == 'INPUT') {
                            $(this).val(formatPrice(summ));
                        }
                    })
                }
            }
        });
        setMark('.uislider.summ_get.set_mark', $('.uislider.summ_get').slider('option', 'value'), $('#currency_lang').val());
    }

    if (typeof $('.uislider.limit_extention').html() != 'undefined') {
        $('.uislider.limit_extention').slider({
            step: parseInt($('#step_term').val()),
            value: parseInt($('input[name="limit"]').val()),
            orientation: "horizontal",
            range: "min",
            max: parseInt($('#limit-max').val()),
            min: parseInt($('#limit-min').val()),
            animate: 'fast',
            slide: function (event, ui) {
                days = ui.value;
                if (fm_limit !== null) {
                    $(fm_limit).val(days);
                }
                if (typeof $('.calc-limit').attr('class') != 'undefined') {
                  console.log('limit_extention');
                    $('.calc-limit').each(function () {
                        var tagName = $(this).prop("tagName");
                        if (tagName == 'SPAN') {
                            $(this).html('<span>' + days + '</span>');
                        } else if (tagName == 'INPUT') {
                            $(this).val(days);
                        }
                    });
                }
            },
            stop: function (event, ui) {
                days = ui.value;
                var new_sum = parseInt($('input[name="new_summ"]').val());
                calcOver(new_sum, days);
            }
        });
    }

    if (typeof $('select[name="limit_extention"]').html() != 'undefined') {
        $('select[name="limit_extention"]').on('change', function () {
            var new_sum = parseInt($('input[name="new_summ"]').val());
            calcOver(new_sum, $(this).val());
            if (fm_limit !== null) {
                $(fm_limit).val($(this).val());
            }
            $('.interest_debt').html($(this).children(':selected').attr('attr-summ') + ' ' + $('#currency_lang').val());
            $('input[name="interest_debt"]').val($(this).children(':selected').attr('attr-summ'));
            $('input[name="summ"]').val($(this).children(':selected').attr('attr-summ'));
        });
    }

    if (typeof $('.calc-change').html() != 'undefined') {
        $('.calc-change').on('click', function () {
            var calc_type = $(this).data('calc');
            var calc_form = $(this).closest('form');
            var slider = $(this).closest('.slider-range-box').find('.uislider');
            var option = slider.slider('option');
            // var fm_summ = calc_form.find('input[name="summ"]');
            // var fm_limit = calc_form.find('input[name="limit"]');
            if ($(this).data('value') == 'plus') {
                slider.slider('value', option.value + option.step);
            } else {
                slider.slider('value', option.value - option.step);
            }

            var $sum_value = null;
            var $limit_value = null;
            if (typeof calc_form.find('.uislider.summ').html() != 'undefined') {
                $sum_value = calc_form.find('.uislider.summ').slider('option', 'value');
            } else if (typeof calc_form.find('.uislider.summ_get').html() != 'undefined') {
                $sum_value = calc_form.find('.uislider.summ_get').slider('option', 'value');
            }
            if (typeof calc_form.find('.uislider.limit').html() != 'undefined') {
                $limit_value = calc_form.find('.uislider.limit').slider('option', 'value');
            } else if (typeof calc_form.find('.uislider.limit_get').html() != 'undefined') {
                $limit_value = calc_form.find('.uislider.limit_get').slider('option', 'value');
            } else if (typeof calc_form.find('.uislider.limit_extention').html() != 'undefined') {
                $limit_value = calc_form.find('.uislider.limit_extention').slider('option', 'value');
            }

            if ($sum_value !== null && calc_type === 'sum') {
                slide_summ($sum_value);
            }

            if ($limit_value !== null && calc_type === 'limit') {
                limit_slide($limit_value);
            }

            if ($sum_value !== null && $limit_value !== null) {
                var days = $sliderValuesOnline[$limit_value];
                calcOver($sum_value, days);
            }
        });
    }

    function updateCalc(newVal, type = 'sum') {
      if (type === 'sum') {
        if (fm_summ !== null) {
          $(fm_summ).val(newVal);
        }
        if (typeof $('.calc-summ').attr('class') != 'undefined') {
          $('.calc-summ').each(function () {
            let tagName = $(this).prop("tagName");
            if (tagName === 'SPAN') {
              $(this).html(formatPrice(newVal) + '<small>&nbsp;' + $('#currency_lang').val() + '</small>');
            } else if (tagName === 'INPUT') {
              $(this).val(formatPrice(newVal));
            }
          })
        }
      }

      if (type === 'days') {
        if (fm_limit !== null) {
          $(fm_limit).val(newVal);
        }
        if (typeof $('.calc-limit').attr('class') != 'undefined') {
          let productId = $('input[name="product"]').val();
          let productP = $('input[attr-id="' + productId + '"]');
          $('.calc-limit').each(function () {
            let tagName = $(this).prop("tagName");
            if (tagName === 'SPAN') {
              $(this).html('<span>' + newVal + '</span><small>&nbsp;' + productP.attr('attr-labelt') + '</small>');
            } else if (tagName === 'INPUT') {
              $(this).val(newVal);
            }
          });
        }
      }

    }

    if (typeof $('.calc-summ').val() !== 'undefined') {
        $('.calc-summ').on('focusout', function () {
            setAmountCalculatorByThis($(this));
            return false;
        });
        $('.calc-summ').on('keydown', function (event) {
            if (event.keyCode === 13) {
                setAmountCalculatorByThis($(this));
                event.preventDefault();
                return false;
            }
        });

        function setAmountCalculatorByThis($this) {
            // let res = $this.val().match(/\d+(\.?\d{0,2})?/g);
            // if (res !== null) {
            //     $this.val(res[0]);
            // } else {
            //     $this.val('');
            // }

            let repAmount = parseFloat($this.val().replace(' ', ''));
            let $max = parseFloat($('#sum-max').val());
            let $min = parseFloat($('#sum-min').val());
            let $step = parseFloat($('#step_amount').val());
            if ($step != 0.01) {
                let interval = repAmount % $step;
                if (interval !== 0) {
                    repAmount -= interval;
                    $this.val(repAmount);
                }
            }
            if (repAmount > $max) {
                $this.val($max);
                repAmount = $max;
            } else if (repAmount < $min) {
                $this.val($min);
                repAmount = $min;
            }

            days = parseInt($('input[name="limit"]').val());

            if (repAmount >= 15001 && days < 31) {
              updateCalc(31,'days');
              $('.uislider.limit').slider('option', 'value', 26);
            }

            if (repAmount <= 15000 && days > 31) {
              updateCalc(30,'days');
              $('.uislider.limit').slider('option', 'value', 25);
            }


            $this.parents('.param').find('.uislider').slider('option', 'value', repAmount);
            slide_summ(repAmount);

            /* доп. продукты по диапазонам сумм займа */
            updateExtraServicesBroken(summ, days);
            calcOver(repAmount, days);
        }

    }


    if (typeof $('.calc-limit').val() !== 'undefined') {
        $('.calc-limit').on('focusout', function () {
            setTermCalculatorByThis($(this));
            return false;
        });
        $('.calc-limit').on('keydown', function (event) {
            if (event.keyCode === 13) {
                setTermCalculatorByThis($(this));
                event.preventDefault();
                return false;
            }
        });

        function setTermCalculatorByThis($this) {
            let repTerm = parseInt($this.val());
            let value_position = 1;
            let $max = parseInt($('#limit-max').val());
            let $min = parseInt($('#limit-min').val());
            let $step = parseInt($('#step_term').val());
            let interval = repTerm % $step;
            if (interval !== 0) {
                repTerm -= interval;
                $this.val(repTerm);
            }
            if (repTerm > $max) {
                $this.val($max);
                repTerm = $max;
            } else if (repTerm < $min) {
                $this.val($min);
                repTerm = $min;
            }
            for (let i = 0; i < $sliderValuesOnline.length; i++) {
                if ($sliderValuesOnline[i] == repTerm) {
                    value_position = i;
                    break;
                }
            }

            let amount = parseFloat($('input[name="summ"]').val());
            if (repTerm >= 31 && amount < 15001) {
              updateCalc(15500);
              $('.uislider.summ').slider('option', 'value', 15500);
            }

            if (repTerm <= 30 && amount > 15000) {
              updateCalc(15000);
              $('.uislider.summ').slider('option', 'value', 15000);
            }

            $this.parents('.param').find('.uislider').slider('option', 'value', value_position);
            limit_slide(value_position);

            calcOver(amount, repTerm);
        }
    }

    $('.services_check:not(.services_check_change_product)').change(function () {
        let amount = parseFloat($('input[name="summ"]').val());
        let limit = parseInt($('input[name="limit"]').val());
        calcOver(amount, limit);
        if ($(this).prop('checked')) {
            $(this).parent().addClass('active');
        } else {
            $(this).parent().removeClass('active');
        }
    });

    $('.services_check_change_product').change(function () {
        let que_number = $('[name="questionnaire_number"]').val();
        let identifier = $(this).attr('data-identifier');
        let product_id = $(this).attr('data-product_current');
        let current_product_id = $(this).attr('data-product_current');
        let status = false;
        if ($(this).prop('checked')) {
            product_id = $(this).attr('data-product_new');
            status = true;
        }

        setWait(true);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api/json/changeCreditProductOfQuestionnaire',
            data: {
                identifier: identifier,
                que_number: que_number,
                current_product_id: current_product_id,
                product_id: product_id,
                status: status
            },
            success: function (data) {
                if (data.result === true) {
                    location.reload();
                }
            }
        });
    });

    $('.werWolf_services_check').change(function () {
        let identifier = $(this).attr('data-identifier');
        let amount = $('[name="summ"]').val();
        let term = $('[name="limit"]').val();
        let isAnnuity = $('#annuity').val();

        setWait(true);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api/json/changeCreditProductsOfCalculator',
            data: {
                identifier: identifier,
                amount: amount,
                term: term,
                isAnnuity: isAnnuity
            },
            success: function (data) {
                if (data.result === true) {
                    location.reload();
                }
            }
        });
    });

    function setMark(slider, value, label) {
        if (typeof $(slider).html() != 'undefined') {
            if ((slider == '.uislider.summ.set_mark') | (slider == '.uislider.summ_get.set_mark')) {
                if (value.toString().length == 5) {
                    style = 'margin-left: 30px;';
                } else if (value.toString().length == 4) {
                    style = 'margin-left: 35px;';
                } else {
                    style = 'margin-left: 27px;';
                }
            } else if ((slider == '.uislider.limit.set_mark') | (slider == '.uislider.limit_extention.set_mark')) {
                if (value.toString().length == 1) {
                    style = 'margin-left: 50px;';
                } else {
                    style = 'margin-left: 46px;';
                }
            } else if (slider == '.uislider.limit_get.set_mark') {
                if (value.toString().length == 1) {
                    style = 'margin-left: 42px;';
                } else {
                    style = 'margin-left: 38px;';
                }
            }
            $(slider).find('.ui-slider-handle').html('<div class="irs-single" style="' + style + '" >' + formatPrice(value) + ' ' + label + '</div>');
        }
    }

    function calcOver(sum, days) {
        p = parseFloat($('#procent').val()) / 100;
        if (typeof $('#MessForPrint').html() != 'undefined') {
            $('.btn_dis').attr('disabled', 'disabled');
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/api/json/getMessForPrint',
                data: {
                    sum: sum,
                    limit: days,
                    type: 1,
                    number: $('[name="questionnaire_number"]').val(),
                    card: $('#card_id').val(),
                },
                success: function (data) {
                    // console.log(data);
                    if (data.result == true) {
                        $('#MessForPrint .wrap').html(data.response);
                    }
                    $('.btn_dis:not(.btnChckbxDisabled)').removeAttr('disabled');
                }
            });
        }
        if (typeof $('#MessForPrintExtend').html() != 'undefined') {
            $('.btn_dis').attr('disabled', 'disabled');
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/api/json/getMessForPrint',
                data: {
                    sum: sum,
                    limit: days,
                    type: 2,
                    number: $('[name="questionnaire_number"]').val(),
                    card: $('#card_id').val(),
                },
                success: function (data) {
                    // console.log(data);
                    if (data.result == true) {
                        $('#MessForPrintExtend .wrap').html(data.response);
                    }
                    $('.btn_dis:not(.btnChckbxDisabled)').removeAttr('disabled');
                }
            });
        }

        if (typeof $('.refund-sum_extend').html() != 'undefined') {
            setWait(true);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/api/json/getExtendInfo',
                data: {
                    days: days,
                },
                success: function (data) {
                   $('.refund-sum_extend').text(formatPrice(Math.ceil(data.response.refund_amount)));
                    setWait(false);
                }
            });
        }

        if ((typeof $('#annuity').val() != 'undefined') && ($('#annuity').val() == 1)) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/api/json/getScheduleAnnuityLoan',
                data: {
                    product_id: $('input[name="product"]').val(),
                    sum: sum,
                    limit: days
                },
                success: function (data) {
                    // console.log(data);
                    if (data.result == true) {
                        total = data.response.payment;
                        over = data.response.percents;
                        if (fm_day !== null) {
                            $(fm_day).val(data.response.date_of_payment);
                        }
                        if (fm_over !== null) {
                            $(fm_over).val(Math.ceil(over));
                        }
                        if (fm_total !== null) {
                            $(fm_total).val(Math.ceil(total));
                        }

                        if (typeof $('[data-btn-calc-title-over]').html() !== 'undefined') {
                            if (over === 0) {
                                $('[data-btn-calc-title-over]').html($('[data-btn-calc-title-over]').attr('data-over-zero'));
                            } else {
                                $('[data-btn-calc-title-over]').html($('[data-btn-calc-title-over]').attr('data-over-title'));
                            }
                        }
                        if (data.response.payment_period != null) {
                            $('.payment_period').html(data.response.payment_period);
                        }
                        if (typeof $('.calc-over').html() != 'undefined') {
                            $('.calc-over').html(formatPrice(Math.ceil(over)) + ' <small>' + $('#currency_lang').val() + '</small>');
                        }
                        if (typeof $('.calc-total').html() != 'undefined') {
                            $('.calc-total').html(formatPrice(Math.ceil(total)) + ' <small>' + $('#currency_lang').val() + '</small>');
                        }
                        if (typeof $('.calc-day').html() != 'undefined') {
                            $('.calc-day').html(data.response.date_of_payment + ' г.');
                        }
                        if (typeof $('.calc-day-short').html() != 'undefined') {
                            $('.calc-day-short').html(data.response.date_of_payment + ' г.');
                        }
                        if (typeof $('.calc-day-short-annuity').html() != 'undefined') {
                            $('.calc-day-short-annuity').html(data.response.date_of_payment + ' г.');
                        }
                    }
                }
            });
        } else {
            var total = sum;
            var totalNotServices = sum;
            var pday = 0;
            var over = 0;
            over = sum * p * days;
            total = sum + over;

            if (typeof $('#extend_show_txt').val() != 'undefined') {
                if (days > $('#extend_show_txt').val()) {
                    $('.extent-calc-term').find('.ext_term').html(days - $('#extend_show_txt').val());
                    $('.extent-calc-term').removeClass('hidden');
                    $('.calc-extent_total').find('.ext_term').html(days - $('#extend_show_txt').val());
                    $('.calc-extent_total').find('.ext_total').html(formatPrice(Math.ceil(sum * (days - $('#extend_show_txt').val()) * p)));
                    $('.calc-extent_total').removeClass('hidden');

                    var days = $('#extend_show_txt').val();
                } else {
                    $('.extent-calc-term').addClass('hidden');
                    $('.calc-extent_total').addClass('hidden');
                }
            }

            /* услуги/льготный период */
            let service_match = Array();
            if (typeof $('input[name^="service_match"]').val() !== 'undefined') {
                $('input[name^="service_match"]').each(function () {
                    if ($(this).is(':checked') === true) {
                        service_match.push({component: $(this).data('component')});
                    }
                });
            }
            let extra_service_match = Array();
            if (typeof $('input[name^="extra_service_match"]').val() !== 'undefined') {
                $('input[name^="extra_service_match"]').each(function () {
                    if ($(this).is(':checked') === true) {
                        extra_service_match.push({identifier: $(this).data('identifier')});
                    }
                });
            }
            let sphinx_service_match = Array();
            if (typeof $('input[name^="sphinx_service_match"]').val() !== 'undefined') {
                $('input[name^="sphinx_service_match"]').each(function () {
                    if ($(this).is(':checked') === true) {
                        sphinx_service_match.push({identifier: $(this).data('identifier')});
                    }
                });
            }

            let grace_periods = ($('#is_grace_periods').val() === '1');

            if (
                grace_periods ||
                service_match.length !== 0 ||
                extra_service_match.length !== 0 ||
                sphinx_service_match.length !== 0
            ) {
                // setWait(true);
                $('.btn_dis').attr('disabled', 'disabled');
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/api/json/calculateRefundAmount',
                    data: {
                        grace_periods: grace_periods ? 1 : 0,
                        services: service_match,
                        extra_services: extra_service_match,
                        sphinx_services: sphinx_service_match,
                        sum: sum,
                        limit: days,
                        product_id: $('[name="product"]').val()
                    },
                    success: function (data) {
                        if (data.response.grace_periods.result === true) {
                            let grace_periods = data.response.grace_periods;
                            let not_lgot_term = ((days >= grace_periods.max_lgot) ? days - grace_periods.max_lgot : 0) + (grace_periods.min_lgot - 1);
                            let lgot_term = days - not_lgot_term;
                            over = (summ * p * not_lgot_term) + (summ * (parseFloat(grace_periods.percent_lgot) / 100) * lgot_term);
                        }
                        if (typeof $('.amount-extra-services') !== 'undefined') {
                            $('.amount-extra-services').each(function () {
                                let id_service = $(this).attr('data-service_id');
                                $(this).text('(Стоимость ' + data.response.amount_extra_services[id_service] + ')');
                            })
                        }
                        total = sum + over;
                        totalNotServices = total;
                        if (data.response.amount_services > 0) {
                            total += data.response.amount_services;
                        }
                        setCalcData(over, total, totalNotServices);
                        // setWait(false);
                        $('.btn_dis:not(.btnChckbxDisabled)').removeAttr('disabled');
                    }
                });
            } else {
                totalNotServices = total;
                setCalcData(over, total, totalNotServices);
            }

            if (typeof $('.infoPayPercentBlock').html() !== 'undefined') {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/api/json/getPercentAtPayment',
                    data: {
                        que_number: $('[name="questionnaire_number"]').val(),
                        amount: sum,
                    },
                    success: function (data) {
                        if (typeof data.response.fullAmount !== 'undefined') {
                            $('.fullAmountPayPercentBlock').html(formatPrice(data.response.fullAmount));
                        }
                        if (typeof data.response.commission !== 'undefined') {
                            $('.commissionPayPercentBlock').html(formatPrice(data.response.commission));
                        }
                        if (typeof data.response.days !== 'undefined' && data.response.days !== null) {
                            $('.discountPayPercentValue').html(
                                data.response.days + ' ' + getDeclensionWordDay(data.response.days)
                            ).removeClass('hidden');
                        } else {
                            $('.discountPayPercentBlock').html('').addClass('hidden');
                        }
                    }
                });

            }
        }
    }

    function setCalcData(over, total, totalNotServices = total) {
        if (fm_day !== null) {
            $(fm_day).val(moment().add(days - days_to_reduce, 'days').format('DD.MM.YYYY'));
        }
        if (fm_over !== null) {
            $(fm_over).val(Math.ceil(over));
        }
        if (fm_total !== null) {
            $(fm_total).val(Math.ceil(total));
        }

        if (typeof $('[data-btn-calc-title-over]').html() !== 'undefined') {
            if (over === 0) {
                $('[data-btn-calc-title-over]').html($('[data-btn-calc-title-over]').attr('data-over-zero'));
            } else {
                $('[data-btn-calc-title-over]').html($('[data-btn-calc-title-over]').attr('data-over-title'));
            }
        }
        if (typeof $('.payment_period').html() !== 'undefined') {
            $('.payment_period').html('Возвращаете');
        }
        if (typeof $('.calc-over').html() !== 'undefined') {
            $('.calc-over').html(formatPrice(Math.ceil(over)) + ' <small>' + $('#currency_lang').val() + '</small>');
        }
        if (typeof $('.calc-total:not(.calc-total-not-services)').html() !== 'undefined') {
            $('.calc-total:not(.calc-total-not-services)').html(formatPrice(Math.ceil(total)) + ' <small>' + $('#currency_lang').val() + '</small>');
        }
        if (typeof $('.calc-total.calc-total-not-services').html() !== 'undefined') {
            $('.calc-total.calc-total-not-services').html(formatPrice(Math.ceil(totalNotServices)) + ' <small>' + $('#currency_lang').val() + '</small>');
        }
        if (typeof $('.calc-day').html() !== 'undefined') {
            $('.calc-day').html(moment().add(days - days_to_reduce, 'days').calendar() + ' г.');
        }
        if (typeof $('.calc-day-short').html() !== 'undefined') {
            $('.calc-day-short').html(moment().add(days - days_to_reduce, 'days').format('DD.MM.YYYY') + ' г.');
        }
    }

    /* доп. продукты по диапазонам сумм займа */
    function updateExtraServicesBroken(sum, days = null) {
        if (typeof $('#extraServiceBroken').html() === 'undefined') {
            return false;
        }

        let extra_products_identifier = [];
        let updateCheckbox = false;
        let checkActiveService = false;
        $('#extraServiceBroken').find('.extra_service_broken').each(function () {
            let from = +$(this).attr('data-from');
            let to = +$(this).attr('data-to');
            if (from <= sum && sum <= to) {
                if (!$(this).hasClass('active')) {
                    updateCheckbox = true;
                    $(this).addClass('active');
                }
                checkActiveService = true;
                $.each($(this).attr('data-products').split(','), function () {
                    extra_products_identifier.push($.trim(this));
                });
            } else {
                if ($(this).hasClass('active')) {
                    updateCheckbox = true;
                    $(this).removeClass('active');
                }
            }
        });

        if (extra_products_identifier.length !== 0 && updateCheckbox) {
            if (typeof $('.extra_service_broken-label').parents('.wrapper-checkboxes').html() !== 'undefined') {
                $('.extra_service_broken-label').parents('.wrapper-checkboxes')
                    .find('input[type="checkbox"]').prop('checked', false).change()
                    .parent().removeClass('active');
            }
            $('.extra_service_broken-label').addClass('hidden').removeClass('active').find('.services_check').prop('checked', false);
            $('#extra_service_broken').attr('data-products', extra_products_identifier.join(','));
            $.each(extra_products_identifier, function () {
                $('.extra_service_broken-label[for="extra_service_' + this + '"]')
                    .removeClass('hidden').find('.services_check').prop('checked', false);
            });
        } else if (!checkActiveService) {
            if (typeof $('.extra_service_broken-label').parents('.wrapper-checkboxes').html() !== 'undefined') {
                $('.extra_service_broken-label').parents('.wrapper-checkboxes')
                    .find('input[type="checkbox"]').prop('checked', false).change()
                    .parent().removeClass('active');
            }
            $('.extra_service_broken-label').addClass('hidden').find('.services_check').prop('checked', false);
        }
    }
});
