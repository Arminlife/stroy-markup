
$(function () {
   

    $('.js-tel').inputmask('+7 999 999-99-99');
    $('.js-tel-new').mask("+7 000 000-00-00");

    $('[data-toggle="tooltip"]').tooltip();

    function validateTel(val) {
        var tellReg = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/;
        return tellReg.test(val);
    }

    function validateEmail(val) {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailReg.test(val);
    }

    $.fn.validateMe = function () {
        var input = $(this),
            val = input.val(),
            parent = input.closest('.form-group'),
            errorText = parent.data('error-text'),
            b_has_errors = false;

        if (!val) {
            b_has_errors = true;
        } else if (input.is(':checkbox') && !input.prop('checked')) {
            b_has_errors = true;
        } else if (input.attr('type') === 'email' && !validateEmail(val)) {
            b_has_errors = true;
        } else if ((input.attr('type') === 'tel' || input.hasClass('js-tel')) && !validateTel(val)) {
            b_has_errors = true;
        }

        parent.find('.error-text').remove();

        if (b_has_errors) {
            parent.removeClass('has-success').addClass('has-error');
            if (errorText)
                if (parent.is('.form-check')) {
                    parent.prepend('<div class="error-text">' + errorText + '</div>');
                } else {
                    parent.append('<div class="error-text">' + errorText + '</div>');
                }
        } else {
            parent.removeClass('has-error').addClass('has-success');
        }
    };

    $('.required input, .required textarea').on('focus', function () {
        $(this).closest('.required').removeClass('has-error').find('.error-text').remove();
    }).on('blur change', function () {
        $(this).validateMe();
    });

    $('.required').each(function () {
        if ($(this).find('label, .label, .form-caption, .caption').length === 0)
            $(this).addClass('no-label');
    });

    $('form').on('submit', function (event) {
        var form = $(this),
            requiredInputs = $('.required', form);

        if (requiredInputs.length) {
            event.preventDefault();

            requiredInputs.each(function () {
                var input = $(this).find('input, textarea');
                input.validateMe();

            }).promise().done(function () {
                if (form.find('.has-error').length === 0) {
                    if (form.next().hasClass('success-text'))
                        form.hide().next().show();

                    $.ajax({
                        method: form.attr('method'),
                        url: form.attr('action'),
                        data: form.serialize(),
                        success: function (response) {
                            var callback = form.data('success-callback');
                            if (callback) {
                                window[callback](form, response);
                            }
                        },
                        error: function (response) {
                            var callback = form.data('error-callback');
                            if (callback) {
                                window[callback](form, response);
                            }
                        }
                    });
                }
            });
        }
    });

    $('.js-col-input').each(function () {
        var counter = $(this),
            input = $('input', counter),
            minus = $('.less', counter),
            plus = $('.plus', counter),
            maxValue = input.attr('data-max-value');

        minus.on('click', function (event) {
            event.preventDefault();
            var val = parseInt(input.val());

            if (val > 0) {
                val = val - 1;
                input.val(val);
            }
            if (maxValue) {

            	if (val >= maxValue) {
	            	plus.addClass('disable');
	            } else {
	            	plus.removeClass('disable');
	            	$('.wrapper-adress .sum').removeClass('red');
	            }
            }
                        
        });

        plus.on('click', function (event) {
            event.preventDefault();
            var val = parseInt(input.val()) + 1;
            input.val(val);

            if (maxValue) {

            	if (val >= maxValue) {
	            	plus.addClass('disable');
	            } else {
	            	plus.removeClass('disable');
	            	$('.wrapper-adress .sum').removeClass('red');
	            }
            } 
        });

        input.on('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl/cmd+A
                (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+C
                (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+X
                (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        })
		input.change(function(){
			if (maxValue) {
				if(parseInt(this.value) >= maxValue){
				    input.val(maxValue);
				    $('.wrapper-adress .sum').addClass('red');
				    setTimeout(function() { $('.wrapper-adress .sum').removeClass('red') }, 2000);
				 } else{
				 	plus.removeClass('disable');
				 }
			}
		     
		})        
    });
});

$(function () {
    $('.b-good-gallery').each(function () {
        var component = $(this),
            main_slider_el = $('.js-slider', component),
            thumbs_slider_el = $('.js-navigate-slider', component),
            pagination = $('.js-pagination', component),
            count_sliders = main_slider_el.find('.swiper-slide').length;

        var mainSlider = new Swiper(main_slider_el, {
            speed: 400,
            spaceBetween: 0,
            nextButton: $('.js-next', component),
            prevButton: $('.js-prev', component),
            pagination: pagination,
            paginationClickable: true,
            loop: false,
            autoHeight: true,
            effect: 'fade'
        });

        var thumbsSlider = new Swiper(thumbs_slider_el, {
            speed: 400,
            spaceBetween: 9,
            slidesPerView: 3,
            nextButton: $('.js-next-nav', component),
            prevButton: $('.js-prev-nav', component),
            slideToClickedSlide: true
        });

        thumbs_slider_el.on('click', '.swiper-slide', function (e) {
            e.preventDefault();
            var index = $(this).data('swiper-slide-index');

            if (!index)
                index = $(this).index();

            mainSlider.slideTo(index);
        });

        mainSlider.on('slideChangeEnd', function (swiper) {
            var index = swiper.activeIndex;
            thumbsSlider.slideTo(index);
        });


        main_slider_el.on('click', '.swiper-slide', function (e) {
            e.preventDefault();

            $(document.body).addClass('disable-scroll');
            component.addClass('fixed');

            thumbs_slider_el.width(count_sliders * (68 + 9) - 9);
            thumbs_slider_el.find('.swiper-slide').width('');

            thumbsSlider.params.slidesPerView = 'auto';
            thumbsSlider.params.freeMode = true;
            thumbsSlider.update();

            mainSlider.params.centeredSlides = true;
            mainSlider.update();
            mainSlider.slideTo(mainSlider.activeIndex);

            main_slider_el.find('img').each(function () {
                var img = $(this);

                if (img.data('origin'))
                    img.data('small', img.attr('src')).attr('src', img.data('origin'));
            });
        });

        component.find('.js-modal-close').on('click', function (e) {
            e.preventDefault();

            $(document.body).removeClass('disable-scroll');
            component.removeClass('fixed');

            thumbs_slider_el.width('');

            thumbsSlider.params.slidesPerView = 3;
            thumbsSlider.params.freeMode = false;
            thumbsSlider.update();

            mainSlider.params.centeredSlides = false;
            mainSlider.update();
            mainSlider.slideTo(mainSlider.activeIndex);

            main_slider_el.find('img').each(function () {
                var img = $(this);

                if (img.data('small'))
                    img.attr('src', img.data('small'));
            });
        });
    });
});
$(function () {
    $('.b-description').each(function () {

        var component = $(this);


        $('.js-add-review a', component).on('click', function (event) {
            event.preventDefault();
            var index = $(this).index(),
                parent = $(this).closest('.js-add-review');
            $('.filled', parent).removeClass('filled');
            while (index >= 0) {
                $('a', parent).eq(index).addClass('filled');
                index--;
            }
        });

        $('.js-like', component).on('click', function () {
            $(this).toggleClass('active');
            var val = parseInt($(this).find('span').text());

            if ($(this).hasClass('active')) {
                val += 1;
            } else {
                if (val) {
                    val -= 1;
                }
            }
            $(this).find('span').text(val);
        });

        $('.js-cancel', component).on('click', function (event) {

            event.preventDefault();
            var collapse = $(this).closest('.collapse');
            collapse.collapse('hide');

        });


    });
});
$(function () {
    $('.b-header').each(function () {
        var component = $(this);

        $('.js-burger', component).on('click', function (event) {
            event.preventDefault();

            $(this).toggleClass('active');

            $('.b-sidebar').stop(true, true).slideToggle(380);
        });

        $('.js-select', component).chosen({
            width: '100%',
            no_results_text: 'Ничего не надено по запросу: '
        });
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 160 && !$('.js-top').hasClass('active-top')) {
            $('.js-top').addClass('active-top');
            $('.js-floated-header').fadeIn(210);
        } else if ($(this).scrollTop() <= 160 && $('.js-top').hasClass('active-top')) {
            $('.js-top').removeClass('active-top');
            $('.js-floated-header').fadeOut(210);
        }
    });

    $('.js-go-top').on('click', function (event) {
        event.preventDefault();
        $('body, html').animate({scrollTop: 0}, 450)
    });
});
$(function () {

    $('.b-sidebar').each(function () {
        var component = $(this);

        $('.js-selectbox', component).chosen({
            disable_search_threshold: 10,
            width: '100%'
        });

        $('.js-close-mobile-menu', component).on('click', function (event) {
            event.preventDefault();
            $('.js-burger').toggleClass('active');
            component.stop(true, true).slideUp(240);
        });

        component.find('li').on('click', function (e) {
            if ($(e.target).closest('.js-sidebar-close').length > 0)
                return;

            var li = $(this);

            if (li.children('.dropdown-sidebar').length > 0) {
                console.log('add class', li);
                e.preventDefault();
                li.parent().children('.hover').not(li).removeClass('hover').find('li').removeClass('hover');
                li.addClass('hover');
            } else {
                e.stopPropagation();
            }
        });

        component.on('click', '.js-sidebar-close', function (e) {
            e.preventDefault();
            $(this).closest('.hover').removeClass('hover').find('.hover').removeClass('hover');
        });


        $(document).on('click', function (e) {
            if ($(e.target).closest('.b-sidebar').length === 0) {
                component.find('.hover').removeClass('hover');
            }
        });
    });
});
$(function () {

    $('.b-slider').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                // autoplay: 8500,
                loop: 'true'
            });
    });
});
$(function () {

    $('.b-carousel').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            params = {
                speed: 400,
                spaceBetween: 0,
                slidesPerView: 4,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                observer: true,
                observeParents: true,
                //loop: true,
                breakpoints: {
                    1280: {
                        slidesPerView: 4,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    1200: {
                        slidesPerView: 3
                    }
                }
            },
            slider = new Swiper($('.js-slider', component), params);


        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();
            var icon = $(this);
            icon.toggleClass('filled');
        });        
        // Перебор всех иконок
		function iconsHover() {
			$('.wrapper-icon').each(function () {
				$(this).hover(
					function () {

						// Убираем класс в других иконках
						$('.wrapper-icon').removeClass('dropdown-visible');

						// Добавляем класс текущей иконке
						$(this).addClass('dropdown-visible');

					},
					function () {
						// Убираем класс в текущей иконки
						$(this).removeClass('dropdown-visible');

					}
				);
			})
		}
		iconsHover()
        $('.js-sort', component).each(function () {
            var activeLink = $(this).find('.active'),
                target = activeLink.data('target'),
                slides = $('.js-slider .swiper-slide', component);

            if (target === 'all') {
                slides.show();
                slider.destroy(true, true);
                slider = new Swiper($('.js-slider', component), params);
            } else {

                slides.hide();
                slides.addClass('hidden');

                slides.each(function () {

                    if ($(this).data('type') === target) {
                        $(this).show();
                        $(this).removeClass('hidden');
                    }

                }).promise().done(function () {
                    slider.destroy(true, true);
                    slider = new Swiper($('.js-slider', component), params);
                });
            }
        });

        $('.js-sort a', component).on('click', function (event) {
            event.preventDefault();

            var clickedLink = $(this),
                target = clickedLink.data('target'),
                slides = $('.js-slider .swiper-slide', component);

            if (!clickedLink.hasClass('active')) {
                clickedLink.closest('.js-sort').find('.active').removeClass('active');
                clickedLink.addClass('active');
                if (target === 'all') {
                    slides.show();
                    slider.destroy(true, true);
                    slider = new Swiper($('.js-slider', component), params);
                } else {

                    slides.hide();
                    slides.addClass('hidden');

                    slides.each(function () {

                        if ($(this).data('type') === target) {
                            $(this).show();
                            $(this).removeClass('hidden');
                        }

                    }).promise().done(function () {
                        slider.destroy(true, true);
                        slider = new Swiper($('.js-slider', component), params);
                    });
                }
            }
        });
        $('.b-carousel .js-count-link').each(function (index) {
            $(this).attr('data-dropdown', 'dropdown' + index);
        });        
        $('.b-carousel .dropdown').each(function (index) {
            $(this).attr('id', 'dropdown' + index);
        });

       	$('.js-count-link', component).on('click', function (event) {
       		var $this = $(this);
       		$('.b-carousel .dropdown').removeClass('active');
       		$('#' + $this.attr('data-dropdown')).addClass('active');

            event.preventDefault();
            
        }); 
        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $('.b-carousel .dropdown').removeClass('active');
        }); 
        
        $('.js-product-add-to-cart', component).on('click', function (event) {
           event.preventDefault();
           $('.b-carousel .dropdown').removeClass('active');
        });  
		$(document.body).on('click', function (event) {
            if ($('.b-carousel .dropdown.active').length) {
                if (  (!$(event.target).closest('.js-count-link').length) &&  (!$(event.target).closest('.dropdown.active').length) ) {
                    $('.b-carousel .dropdown').removeClass('active');
                }
            }       
        })            
       
    });
});
$(function () {
    $('.b-actions').each(function () {
        var component = $(this);

        new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: $('.js-pagination', component),
                paginationClickable: true,
                autoHeight: true,
                loop: true,
                slidesPerView: 4,
                breakpoints: {
                    519: {
                        slidesPerView: 1
                    },
                    767: {
                        slidesPerView: 2
                    },
                    1200: {
                        slidesPerView: 3
                    },
                    1280: {
                        slidesPerView: 4
                    }
                }
            }
        );
    });
});
$(function () {
    $('.b-search').each(function () {

        var component = $(this),
            suggest = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: component.data('suggestion'),
                remote: {
                    url: 'json/queries/%QUERY.json',
                    wildcard: '%QUERY'
                }
            });

        $('.js-searchbox', component).typeahead({
            hint: false,
            highlight: true,
            minLength: 1
        }, {
            name: 'suggest',
            source: suggest,
            display: 'name'
        }, {
            name: 'suggest',
            source: suggest,
            display: 'name',
            templates: {
                suggestion: function (data) {
                    var result = '<div class="item">' +
                        '<a href="' + data.link + '" class="img">' +
                        '<img src="' + data.img + '">';

                    if (data.isNew) {
                        result += '<span class="product-badge new">Новинка</span>';
                    }

                    result += '</a>' +
                        '<div class="text">' +
                        '   <div class="price">' + data.price + ' <span class="rouble">₽</span><span class="old-price">' + data.oldPrice + ' <span class="rouble">₽</span></span>' +
                        '   </div>' +
                        '<div class="title">' +
                        '<a href="' + data.link + '">' + data.text + '</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    return result
                }
            }

        });
    });
});
$(function () {

    $('.b-good').each(function () {
        var component = $(this),
            offersDiscount = component.find('.item-discount'),
            sliders = component.find('.b-good-gallery');

        $('.js-show-gallery').on('click', function () {
            var offerId = $(this).data('offer-id');

            sliders.removeClass('slider-selected').filter(function () {
                return $(this).data('offer-id') == offerId;
            }).addClass('slider-selected');

            sliders.filter('.slider-selected').find('.js-slider, .js-navigate-slider').each(function () {
                $(this).data('swiper').onResize();
            });
        });

        offersDiscount.on('click', function () {
            offersDiscount.removeClass('selected').filter(this).addClass('selected');
        });

        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();
            var icon = $(this);
            icon.toggleClass('filled');
        });

        $('.js-change-view', component).on('click', function (event) {
            event.preventDefault();

            $(this).closest('.collapse').removeClass('in');

            var target = $(this).data('target');

            $(target).addClass('in');
        });

        $('.js-more', component).on('click', function (event) {
            $(this).hide();
        });

        $('.js-more-hide', component).on('click', function (event) {
            $('.js-more').show();
        });

        $(document).on('scroll', function () {
            if ($(this).scrollTop() > 180) {
                $('.js-get-calc', component).addClass('active');
            } else {
                $('.js-get-calc', component).removeClass('active');
            }
        });

        $('.js-scroll-to-review', component).on('click', function (event) {
            event.preventDefault();

            $('body, html').animate({
                scrollTop: $('.js-review-tab').offset().top
            }, 650);

            $('.js-review-tab').trigger('click');
        });
    });
});
$(function () {

    $('.b-installations').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                //autoplay: 8500,
                loop: 'true',
                autoHeight: true
            });

        $('.js-select', component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        $('.js-installations-nav', component).on('change', function () {

            var category = $('.js-installations-nav[data-role="category"]', component).val(),
                position = $('.js-installations-nav[data-role="position"]', component).val(),
                index = $('.swiper-slide[data-category="' + category + '"][data-pos="' + position + '"]', component).attr('data-swiper-slide-index');

            aboutSlider.slideTo(index);

        });

    });
});
$(function () {
    $('.b-filter').each(function () {
        var component = $(this);

        component.on('change', function () {
            //do something
        });

        $(document).on('click', '.js-close-filter-btn', function (event) {
            event.preventDefault();
            component.trigger('change');

            var pluginExemplar = $(this).closest('.b-filter').find('.select2-container--open');
            $(this).text('Закрыть').removeClass('btn-success').addClass('btn-secondary');

            pluginExemplar.prev('.js-select').select2('close');
            pluginExemplar.find('input').trigger('blur');
        });

        var createTags = function () {
            $('.js-selected', component).show().find('.item').remove();

            $('.js-select', component).each(function () {
                var select = $(this),
                    options = select.find('option:selected');

                options.each(function () {
                    var option = $(this),
                        title = $.trim(option.text()),
                        template = '<div class="item"><span class="js-value">' + title + '</span><a class="js-remove-tag" href="#"><svg class="filter-icon icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/sprite.svg#filter-close"></use></svg></a></div>';

                    var wrapper = $('.wrapper-selected', component);
                    if (wrapper.find('.item').length > 0) {
                        $(template).insertAfter(wrapper.find('.item:last-of-type'));
                    } else {
                        $(template).insertAfter('.wrapper-selected > .chose');
                    }
                });
            });

            $('.js-color-select', component).each(function () {
                var values = $(this).val(),
                    select = $(this);

                $(values).each(function () {
                    var title = select.find('option[value="' + this + '"]').attr('title'),
                        template = '<div class="item">' + title + '<a class="js-remove-tag" href="#"><svg class="filter-icon icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/sprite.svg#filter-close"></use></svg></a></div>';
                    $(template).insertAfter('.wrapper-selected>.chose');
                });
            });
        };

        $('.js-get-filters', component).on('click', function (event) {
            event.preventDefault();
            $(this).hide();
            $('.js-filter-collapse', component).stop(true, true).slideToggle(300);
        });

        $('.js-select', component).each(function () {
            var select = $(this),
                placeholder = select.attr('placeholder');

            select.select2({
                placeholder: placeholder,
                dropdownParent: component,
                closeOnSelect: false
            });

            select.on('change', function () {
                createTags();
                //$('.js-close-filter-btn:visible').text('Применить').addClass('btn-success').removeClass('btn-secondary');
            });
        });

        $(document).on('click', '.js-remove-tag', function (event) {
            event.preventDefault();

            var val = $(this).closest('.item').find('.js-value').text();
            $(this).closest('.item').remove();

            if (val) {
                var selects = $('.js-select', component);
                selects.find('option:selected').filter(function () {
                    return $.trim($(this).text()) == val;
                }).prop('selected', false);
            }

            component.trigger('change');

            if (!component.find('.js-remove-tag').length) {
                $('.js-selected', component).hide();
            }
        });

        $('.js-clear', component).on('click', function (e) {
            e.preventDefault();
			
            $('.js-selected', component).hide();
            $('.js-remove-tag', component).trigger('click');
            

            component.find('option').prop('selected', function () {
                return this.defaultSelected;
            });
        });

        var formatState = function (state) {
            if (!state.id) {
                return state.text;
            }
            var $state = $(
                '<span class="color-select" style="background-color:' + state.element.value + '"></span>'
            );
            return $state;
        };

        $('.js-color-select').each(function () {
            var that = $(this);
            that.select2({
                templateResult: formatState,
                placeholder: that.attr('placeholder'),
                dropdownParent: that.closest('.color-parent'),
                closeOnSelect: false
            });


            that.on('change', function () {
                $('.js-close-filter-btn:visible').text('Применить').addClass('btn-success').removeClass('btn-secondary');
                createTags();
            });
        })
    });
});
$(function () {
    $('.b-catalog').each(function () {
        var component = $(this),
            calc = component.find('.js-calc');

        $('.js-count-link', component).on('click', function (event) {
            event.preventDefault();
            var count = $(this).closest('.count'),
                dropdown = count.find('.dropdown'),
                windowWidth = $(window).width();
            if (!count.hasClass('active') && $('.count.active').length) {
                $('.count.active .js-count-link').trigger('click');
            }
            count.toggleClass('active');

        });

        $('.js-select', component).chosen({
            disable_search_threshold: 10,
            width: '100%'
        });

        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();
            var icon = $(this);
            icon.toggleClass('filled');
        });

        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $(this).closest('.count').removeClass('active');
        });
        $('.js-product-add-to-cart', component).on('click', function (event) {
            event.preventDefault();
           $(this).closest('.count').removeClass('active');
        });        



        $('.js-change-view', component).on('click', function (event) {
            event.preventDefault();
            $('.catalog-tab').addClass('active').show();
            $(this).closest('.catalog-tab').removeClass('active').hide();
        });
        // Перебор всех иконок
		function iconsHover() {
			$('.wrapper-icon').each(function () {
				$(this).hover(
					function () {

						// Убираем класс в других иконках
						$('.wrapper-icon').removeClass('dropdown-visible');

						// Добавляем класс текущей иконке
						$(this).addClass('dropdown-visible');

					},
					function () {
						// Убираем класс в текущей иконки
						$(this).removeClass('dropdown-visible');

					}
				);
			})
		}
		iconsHover()
		function runCalc() {
			    $('.js-get-calc').on('click', function (event) {
		        event.preventDefault();

		        var clickedLink = $(this),
		            target = clickedLink.data('target');


		        $(target).trigger('show').offset({
		            left: clickedLink.offset().left - $(target).width() + 300,
		            top: clickedLink.offset().top - 7
		        });
		    });	
		}
        $('.js-load-more', component).each(function () {
            var loader = $(this);

            $(document).on('scroll', function () {
                if ($(this).scrollTop() > loader.offset().top - $(window).height()) {
                    console.log('visible');
                    setTimeout(function () {
                        $.ajax({
                            url: loader.data('url'),
                            context: document.body
                        }).done(function (data) {
                            $(data).insertBefore(loader);
                            iconsHover()
                            runCalc()
                            $('.js-icon', component).on('click', function (event) {
					            event.preventDefault();
					            var icon = $(this);
					            icon.toggleClass('filled');				            
					        });					        
                        });
                    }, 200);
                }
            });
        });

        component.find('.item').each(function () {
            var item = $(this),
                images = item.find('.img img'),
                interval = 0;

            if (images.length <= 1)
                return;

            item.on('mouseenter', function () {
                interval = setInterval(function () {
                    var index = images.filter('.active').removeClass('active').index();

                    if (index === -1 || index + 1 == images.length)
                        images.first().addClass('active');
                    else
                        images.eq(index + 1).addClass('active');
                }, 800);
            });

            item.on('mouseleave', function () {
                clearInterval(interval);
            })
        });

        // $(document).on('scroll', function () {
        //     if ($(this).scrollTop() > 180) {
        //         $('.js-get-calc', component).addClass('active');
        //     } else {
        //         $('.js-get-calc', component).removeClass('active');
        //     }
        // });

        calc.on('click', function (e) {
            e.stopPropagation();
        });

        $(document.body).on('click', function (event) {

            if ($('.count.active').length) {

                if (!$(event.target).closest('.count').length) {
                    $('.count.active .js-count-link').trigger('click');
                }

            }       

            if (calc.hasClass('active')) {

                $('.count.active .js-count-link').trigger('click');
                calc.find('.js-calc-close').trigger('click');
            }
            //calc.toggleClass('active')

        })
    });
});
$(function () {

    $('.b-possibly').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                observer: true,
                observeParents: true,
                //autoplay: 8500,
                loop: component.find('.swiper-slide').length > 4,
                autoHeight: false,
                slidesPerView: 4,
                breakpoints: {
                    350: {
                        slidesPerView: 1,
                        //spaceBetween: 10
                    },
                    520: {
                        slidesPerView: 2,
                        //spaceBetween: 10
                    },
                    1200: {
                        slidesPerView: 3,
                    }
                }

            });



        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();


            var icon = $(this);


            icon.addClass('filled');

        });
        // Перебор всех иконок
		function iconsHover() {
			$('.wrapper-icon').each(function () {
				$(this).hover(
					function () {

						// Убираем класс в других иконках
						$('.wrapper-icon').removeClass('dropdown-visible');

						// Добавляем класс текущей иконке
						$(this).addClass('dropdown-visible');

					},
					function () {
						// Убираем класс в текущей иконки
						$(this).removeClass('dropdown-visible');

					}
				);
			})
		}
		iconsHover()        
        $('.b-possibly .js-count-link').each(function (index) {
            $(this).attr('data-dropdown', 'dropdown' + index);
        });        
        $('.b-possibly .dropdown').each(function (index) {
            $(this).attr('id', 'dropdown' + index);
        });

       	$('.js-count-link', component).on('click', function (event) {
       		$('.b-possibly .dropdown').removeClass('active');
       		$('#' + $(this).attr('data-dropdown')).addClass('active');
            event.preventDefault();
            console.log('clicked');
            
        }); 
        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $('.b-possibly .dropdown').removeClass('active');
        }); 
		$(document.body).on('click', function (event) {
            if ($('.b-possibly .dropdown.active').length) {
                if (  (!$(event.target).closest('.js-count-link').length) &&  (!$(event.target).closest('.dropdown.active').length) ) {
                    $('.b-possibly .dropdown').removeClass('active');
                }
            }       
        })          
    });
});
$(function () {

    $('.b-set').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            slider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                observer: true,
                observeParents: true,
                loop: 'true',
                slidesPerView: 2,
                slidesPerGroup: 2,
                breakpoints: {
                    992: {
                        slidesPerView: 1,
                        //spaceBetween: 10
                    },
                    574: {
                        direction: 'vertical',
                        slidesPerView: 1,
                        slidesPerGroup: 1
                    }
                }
            });
    });
});
$(function () {

    $('.b-history').each(function () {
        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                //autoplay: 8500,
                loop: false,
                autoHeight: true,
                slidesPerView: 4,
                breakpoints: {
                    520: {
                        slidesPerView: 2,
                        //spaceBetween: 10
                    },
                    1200: {
                        slidesPerView: 3,
                    }
                }
            });

        $('.js-icon', component).on('click', function (event) {

            event.preventDefault();


            var icon = $(this);


            icon.addClass('filled');

        });
        // Перебор всех иконок
		function iconsHover() {
			$('.wrapper-icon').each(function () {
				$(this).hover(
					function () {

						// Убираем класс в других иконках
						$('.wrapper-icon').removeClass('dropdown-visible');

						// Добавляем класс текущей иконке
						$(this).addClass('dropdown-visible');

					},
					function () {
						// Убираем класс в текущей иконки
						$(this).removeClass('dropdown-visible');

					}
				);
			})
		}
		iconsHover()        
        $('.b-history .js-count-link').each(function (index) {
            $(this).attr('data-dropdown', 'dropdown' + index);
        });        
        $('.b-history .dropdown').each(function (index) {
            $(this).attr('id', 'dropdown' + index);
        });

       	$('.js-count-link', component).on('click', function (event) {
       		$('.b-history .dropdown').removeClass('active');
       		$('#' + $(this).attr('data-dropdown')).addClass('active');
            event.preventDefault();
            
        }); 
        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $('.b-history .dropdown').removeClass('active');
        }); 
		$(document.body).on('click', function (event) {
            if ($('.b-history .dropdown.active').length) {
                if (  (!$(event.target).closest('.js-count-link').length) &&  (!$(event.target).closest('.dropdown.active').length) ) {
                    $('.b-history .dropdown').removeClass('active');
                }
            }       
        })           
    });
});
$(function () {
    $('.b-profile').each(function () {
        var component = $(this);

        $('.js-add-address', component).on('click', function (event) {
            event.preventDefault();
            var target = $(this).attr('href'),
                parent = $(this).closest('.wrapper-address');

            $.ajax({
                url: target,
                context: document.body
            }).done(function (data) {
                $(data).insertBefore(parent);
            });

        });

        $('.js-bonus', component).inputmask('999 999-999');

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        $('.js-tabs-select', component).on('change', function () {
            var select = $(this);

            $('.tab-pane.active:visible').removeClass('active');
            $('.tab-pane' + select.val()).addClass('active');
        });

        $('.js-edit-form', component).on('click', function (event) {

            event.preventDefault();

            $(this).closest('.wrapper-btn').removeClass('active').hide().next('.wrapper-btn').addClass('active').show();

            var parent = $(this).closest('form');

            parent.addClass('editable');

            $('[disabled]', parent).each(function () {
                $(this).removeAttr('disabled');
            });
        });

        $('.js-cancel-edit', component).on('click', function (event) {

            event.preventDefault();

            $(this).closest('.wrapper-btn').removeClass('active').hide().prev('.wrapper-btn').addClass('active').show();

            var parent = $(this).closest('form');

            parent.removeClass('editable');

            $('input, textarea, select', parent).each(function () {
                $(this).attr('disabled', 'disabled').parent().removeClass('has-error').removeClass('has-success').find('.error-text').remove();
            });
        });


    });
    $(document).on('click', '.js-remove-address', function (event) {
        event.preventDefault();

        $(this).closest('.wrapper-address').slideUp(220, function () {
            $(this).remove();
        });
    })
});
$(function () {

    $('.b-possibly').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                observer: true,
                observeParents: true,
                //autoplay: 8500,
                loop: component.find('.swiper-slide').length > 4,
                autoHeight: false,
                slidesPerView: 4,
                breakpoints: {
                    350: {
                        slidesPerView: 1,
                        //spaceBetween: 10
                    },
                    520: {
                        slidesPerView: 2,
                        //spaceBetween: 10
                    },
                    1200: {
                        slidesPerView: 3,
                    }
                }

            });



        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();


            var icon = $(this);


            icon.addClass('filled');

        });
    });
});
$(function () {

    $('.b-set').each(function () {

        var component = $(this),
            pagination = $('.js-pagination', component),
            slider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                observer: true,
                observeParents: true,
                loop: 'true',
                slidesPerView: 2,
                slidesPerGroup: 2,
                breakpoints: {
                    992: {
                        slidesPerView: 1,
                        //spaceBetween: 10
                    },
                    574: {
                        direction: 'vertical',
                        slidesPerView: 1,
                        slidesPerGroup: 1
                    }
                }
            });
    });
});
$(function () {

    $('.b-history').each(function () {
        var component = $(this),
            pagination = $('.js-pagination', component),
            aboutSlider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                pagination: pagination,
                paginationClickable: true,
                //autoplay: 8500,
                loop: component.find('.swiper-slide').length > 4,
                autoHeight: true,
                slidesPerView: 4,
                breakpoints: {
                    520: {
                        slidesPerView: 2,
                        //spaceBetween: 10
                    },
                    1200: {
                        slidesPerView: 3,
                    }
                }
            });

        $('.js-icon', component).on('click', function (event) {

            event.preventDefault();


            var icon = $(this);


            icon.addClass('filled');

        });
    });
});
$(function () {

    $('.b-compare').each(function () {

        var component = $(this),

            slider = new Swiper($('.js-slider', component), {
                speed: 400,
                spaceBetween: 0,
                slidesPerView: 'auto',
                nextButton: $('.js-next', component),
                prevButton: $('.js-prev', component),
                loop: false,
                breakpoints: {
                    519: {
                        slidesPerView: 1,
                        //spaceBetween: 10
                    }
                }
            });

        $('.js-remove', component).on('click', function (event) {
            event.preventDefault();
            $(this).closest('.swiper-slide').remove();
            if (component.find('.swiper-slide').length ===1) {
            	component.find('.flex-cont').remove();
            	component.find('.container >.h2').text('В сравнении 0 товаров');
            } else {}
            console.log(component.find('.swiper-slide').length);
        });

        $('.js-remove-all', component).on('click', function (event) {
            event.preventDefault();
            $('.js-remove', component).trigger('click');
        })
    });
});
$(function () {

    $('.b-contacts').each(function () {

        var component = $(this);

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        ymaps.ready(init);

        function init() {
            var myMap = new ymaps.Map('map', {
                center: [55.76, 37.64],
                zoom: 10
            });

            myMap.behaviors.disable('scrollZoom');
        }
    });
});
$(function () {
    $('.b-goods-list').each(function () {
        var component = $(this);

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });
        $('.js-count-link').on('click', function (event) {
            event.preventDefault();
            var count = $(this).closest('.wrapper-buy'),
                dropdown = count.find('.dropdown'),
                windowWidth = $(window).width();
            if (!count.hasClass('active') && $('.wrapper-buy.active').length) {
                $('.wrapper-buy.active .js-count-link').trigger('click');
            }
            count.toggleClass('active');

        });

        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();


            var icon = $(this);


            icon.toggleClass('filled');

        });

        $('.js-change-view', component).on('click', function (event) {
            event.preventDefault();
            $('.catalog-tab').addClass('active').show();
            $(this).closest('.catalog-tab').removeClass('active').hide();
        });

        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $(this).closest('.wrapper-buy').removeClass('active');
        });


        $('.js-load-more', component).each(function () {
            var loader = $(this);

            $(document).on('scroll', function () {
                if ($(this).scrollTop() > loader.offset().top - $(window).height()) {
                    setTimeout(function () {
                        $.ajax({
                            url: loader.data('url'),
                            context: document.body
                        }).done(function (data) {
                            $(data).insertBefore(loader);
                        });
                    }, 200);
                }
            });
        });

        component.find('.item').each(function () {
            var item = $(this),
                images = item.find('.img img'),
                interval = 0;

            if (images.length <= 1)
                return;

            item.on('mouseenter', function () {
                interval = setInterval(function () {
                    var index = images.filter('.active').removeClass('active').index();

                    if (index === -1 || index + 1 == images.length)
                        images.first().addClass('active');
                    else
                        images.eq(index + 1).addClass('active');
                }, 800);
            });

            item.on('mouseleave', function () {
                clearInterval(interval);
            })
        });


        $(document.body).on('click', function (event) {
            if ($('.wrapper-buy.active').length) {

                if (!$(event.target).closest('.wrapper-buy').length) {
                    $('.wrapper-buy.active .js-count-link').trigger('click');
                }

            }

        })


    });
});
$(function () {

    $('.b-delivery').each(function () {

        var component = $(this);

        $('.js-select', component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        $('.js-collapser', component).on('click', function (event) {
            event.preventDefault();
            $(this).hide();
            var target = $(this).data('target');
            $(target).collapse('show');
        });

        $('.js-edit-form', component).on('click', function (event) {

            event.preventDefault();

            $(this).closest('.wrapper-btn').removeClass('active').hide().next('.wrapper-btn').addClass('active').show();

            var parent = $(this).closest('form');

            parent.addClass('editable');

            $('[disabled]', parent).each(function () {
                $(this).removeAttr('disabled');
            });
        });

        $('.js-cancel-edit', component).on('click', function (event) {

            event.preventDefault();

            $(this).closest('.wrapper-btn').removeClass('active').hide().prev('.wrapper-btn').addClass('active').show();

            var parent = $(this).closest('form');

            parent.removeClass('editable');

            $('input, textarea, select', parent).each(function () {
                $(this).attr('disabled', 'disabled').parent().removeClass('has-error').removeClass('has-success').find('.error-text').remove();
            });
        });
    });
});
$(function () {
    var modals = $('.b-modal');

    modals.each(function () {
        var component = $(this);

        component.on('show', function () {
            $(document.body).addClass('fixed');

            modals.filter(':visible').trigger('hide', [true]);
            component.stop(true, true).fadeIn(260);

            if (window.history && (component.attr('id') || '').length > 0 && window.location.hash !== '#' + component.attr('id'))
                history.pushState('', document.title, '#' + component.attr('id'));

        }).on('hide', function (e, show_next) {
            $(document.body).removeClass('fixed');
            $('.modal-backdrop').remove();
            component.stop(true, true).fadeOut(260);

            if (window.location.hash === '#' + component.attr('id') && !show_next)
                history.pushState('', document.title, window.location.pathname + window.location.search);
        });

        window.onpopstate = function () {
            if (window.location.hash.length > 0) {
                modals.filter(window.location.hash).trigger('show');
            } else {
                modals.trigger('hide');
            }
        };

        $('.js-modal-close', component).on('click', function (e) {
            e.preventDefault();
            component.trigger('hide');
        });

        if ((component.attr('id') || '').length > 0 && window.location.hash === '#' + component.attr('id'))
            component.modal('show');
    });


    $('.js-get-modal').on('click', function (e) {
        e.preventDefault();

        var target = $(this).data('target');

        $(target).trigger('show');
    });
});
$(function () {

    $('.b-info-panel').each(function () {
        var component = $(this);

        component.on('changePosition', function () {

        }).on('activate', function () {

            component.fadeIn(340);

        });
    });

    $('.js-add-to-compare').on('click', function (event) {


        event.preventDefault();
        $('.b-info-panel').trigger('activate');

    });

});
$(function () {

    $('.b-calc').each(function () {

        var component = $(this);

        component.on('show', function () {

            component.show();

            setTimeout(function () {
                component.addClass('active')
            }, 10);

        }).on('hide', function () {

            component.removeClass('active');

            setTimeout(function () {
                component.hide();
            }, 350);

        });

        $('.js-calc-close', component).on('click', function (event) {

            event.preventDefault();

            component.trigger('hide');

        });

        $('.js-next-step', component).on('click', function (event) {
            event.preventDefault();

            $(this).closest('.calc-body').removeClass('active').hide().next('.calc-body').addClass('active').show();
        });

    });

    $('.js-get-calc').on('click', function (event) {
        event.preventDefault();

        var clickedLink = $(this),
            target = clickedLink.data('target');


        $(target).trigger('show').offset({
            left: clickedLink.offset().left - $(target).width() + 300,
            top: clickedLink.offset().top - 7
        });
    });
});
$(function () {
    $('.b-cart').each(function () {
        var component = $(this);

        $('.js-toggle-dropdown', component).on('click', function (event) {
            event.preventDefault();
            $(event.target).next().slideToggle(300);
            $(event.target).closest('.count').toggleClass('active');
        });

        $('.js-hide-mobile-dropdown', component).on('click', function (event) {
            event.preventDefault();
            $(event.target).closest('.dropdown-wrapper').slideUp(300);
            $(event.target).closest('.count').removeClass('active');
        });

        $('.js-count-link', component).on('click', function (event) {
            event.preventDefault();
            var dd = $(this).closest('.count');
            if (!dd.hasClass('active') && $('.count.active').length) {
                $('.count.active .js-count-link').trigger('click');
            }
            dd.toggleClass('active');
        });

        $('.js-sorting-tabs', component).on('click', function (event) {
            event.preventDefault();

            if (!$(this).hasClass('active')) {

                var target = $(this).attr('href');

                $(this).parent().find('.active').removeClass('active');

                $(this).addClass('active');

                $('.cart-tabs.active').removeClass('active').hide();
                $(target).addClass('active').show();
            }
        });

        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
            var parent = $(this).closest('.dropdown');

            $('.js-col-input', parent).find('input').val(0);
        });

        $('.js-icon', component).on('click', function (event) {
            event.preventDefault();


            var icon = $(this);


            icon.toggleClass('filled');

        });
        $('.black-link.js-add-to-compare', component).on('click', function (event) {
            event.preventDefault();
            $(this).find('span').html('<a href="#">Перейти к сравнению</a>');
            $(this).addClass('filled');
        });

        $('.js-remove', component).on('click', function (event) {
            event.preventDefault();
            var parent = $(this).closest('.js-sorted-group');
            $(this).closest('.product').slideUp(220, function () {
                $(this).remove();
                parent.trigger('change');
            });
        });

        $('.js-sorted-group', component).on('change', function () {
            var group = $(this),
                price = 0;

            $('.js-total-price', group).each(function () {
                var text = $(this).text().replace(/\s/g, '');
                price += parseInt(text);
                console.log(price);
            }).promise().done(function () {
                $('.js-total', group).text(price);
                if (!price) {
                    group.remove();
                }
            });
        }).trigger('change');

        $(document.body).on('click', function (event) {

            if ($('.count.active').length) {

                if (!$(event.target).closest('.count').length) {
                    $('.count.active .js-count-link').trigger('click');
                }

            }

        })

    });
});
$(function () {
    $('.b-job-form').each(function () {
        var component = $(this);

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        $('.js-collapse-control', component).on('click', function (event) {
            $(this).hide();
        });
    });
});
$(function () {
    $('.job-vacancy').each(function () {
        var component = $(this);

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });
    });
});
$(function () {
    $('.b-orders').each(function () {
        var component = $(this);

        $(".js-buttons-points").click(function (e) {
            e.preventDefault();

            var parent = $(this).closest('.wrapper-order-item');

            $('.part-status,.part-bonus', parent).fadeToggle(220, function () {
                $('.print', parent).toggleClass('hidden-md-down');
                $('.return', parent).toggleClass('hidden-md-down');
                $('.button-points', parent).toggleClass('right-button-points');
            });
        });

        $(".js-select", component).chosen({
            disable_search_threshold: 10,
            width: "100%"
        });

        $('.wrapper-icon', component).on('click', function (event) {
            event.preventDefault();

            $(this).closest('.wrapper-order-item').toggleClass('active').closest('.order').toggleClass('active');
        });
    });
});
$(function () {
    $('.b-favs').each(function () {

        var component = $(this);

        $('.js-remove-all').on('click', function (event) {

            event.preventDefault();

            $('.item', component).fadeOut(220, function () {
                $(this).remove();
            });

            $(this).fadeOut(220, function () {
                $('.nav-tabs .nav-link').eq(0).trigger('click');
            });
        });

        $('.js-unlike', component).on('click', function (event) {
            event.preventDefault();

            $(this).closest('.col-xl-3').fadeOut(310, function () {

                $(this).remove();

                if (!$('.item', component).length) {
                    $('.js-remove-all').trigger('click');
                }
            })
        });
        $('.js-count-link', component).on('click', function (event) {
            event.preventDefault();
            var count = $(this).closest('.count'),
                dropdown = count.find('.dropdown'),
                windowWidth = $(window).width();
            if (!count.hasClass('active') && $('.count.active').length) {
                $('.count.active .js-count-link').trigger('click');
            }
            count.toggleClass('active');

        }); 
        $('.js-clear', component).on('click', function (event) {
            event.preventDefault();
           $(this).closest('.count').removeClass('active');
        });
        function iconsHover() {
            $('.wrapper-icon').each(function () {
                $(this).hover(
                    function () {

                        // Убираем класс в других иконках
                        $('.wrapper-icon').removeClass('dropdown-visible');

                        // Добавляем класс текущей иконке
                        $(this).addClass('dropdown-visible');

                    },
                    function () {
                        // Убираем класс в текущей иконки
                        $(this).removeClass('dropdown-visible');

                    }
                );
            })
        }
        iconsHover();
        $(document.body).on('click', function (event) {

            if ($('.count.active').length) {

                if (!$(event.target).closest('.count').length) {
                    $('.count.active .js-count-link').trigger('click');
                }

            }       

        })               

    });
});
$(function () {
    $('.b-action').each(function () {
        var component = $(this);

        $('.js-timer', component).each(function () {

            var timer = $(this),
                time = timer.data('time'),
                formateNumber = function (number) {
                    var string = number;

                    if (number <= 9) {
                        string = '0' + number;
                    }

                    return string
                };
            //Время принимаем в минутах
            time = parseInt(time) * 60;

            var interval = setInterval(function () {
                time -= 1;

                if (!time) {

                    clearInterval(interval);

                }
                var minutes = time / 60 | 0,
                    seconds = time % 60;
                minutes = formateNumber(minutes);
                seconds = formateNumber(seconds);
                timer.text(minutes + ':' + seconds);
            }, 1000);

        });

    });
});
$(function () {
    $('.b-jobs').each(function () {
        var component = $(this);


        $('.js-load-more', component).each(function () {

            var loader = $(this);

            $(document).on('scroll', function () {


                if ($(this).scrollTop() > loader.offset().top - $(window).height()) {
                    setTimeout(function () {
                        $.ajax({
                            url: loader.data('url'),
                            context: document.body
                        }).done(function (data) {
                            $(data).insertBefore(loader);
                        });
                    }, 200);
                }

            });

        });

    });
});
$(function () {
    $('.b-sitemap').each(function () {
        var component = $(this);

        $('.js-tabs-header a', component).on('click', function (event) {

            event.preventDefault();

            if (!$(this).hasClass('active')) {
                $(this).closest('.js-tabs-header').find('.active').removeClass('active');
                $(this).addClass('active');
                var target = $(this).attr('href');

                $('.tabs-body.active', component).find('.collapse').collapse('hide').end().removeClass('active').hide();
                $(target).addClass('active').show();
                $('.js-open-all').removeClass('active');
            }

        });

        $('.js-open-all', component).on('click', function (event) {
            event.preventDefault();

            $(this).toggleClass('active');

            $('[data-toggle="collapse"]:visible', component).trigger('click');


        });

    });
});
$(function () {
    $('.b-articles').each(function () {
        var component = $(this);


        $('.js-load-more', component).each(function () {

            var loader = $(this);

            $(document).on('scroll', function () {


                if ($(this).scrollTop() > loader.offset().top - $(window).height()) {
                    setTimeout(function () {
                        $.ajax({
                            url: loader.data('url'),
                            context: document.body
                        }).done(function (data) {
                            $(data).insertBefore(loader);
                        });
                    }, 200);
                }

            });

        });

    });
});

$('#delivery-type input').click(function() {
	if($('#del2').is(':checked')) {
		$('#delivery-address').hide();
		$('#delivery-time').hide();
	} else{
		$('#delivery-address').show();
		$('#delivery-time').show();
	}
});


$('.js-total-value em').each(function () {
	var component = $(this);

	$('.js-update-total-price').on('change', function () {
		var valueText = component.text(),
			valueNumber = parseInt(valueText),
			valuePrice = 500;

		if ($(this).is(':checked')) {
			component.text(valueNumber + valuePrice);
		} else {
			component.text(valueNumber - valuePrice);
		}
	});
})

$('.wrapper-img').each(function() {
    $(this).magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
          enabled:true
        },
		callbacks: {
			beforeOpen: function() {
			   this.st.mainClass = this.st.el.attr('data-effect');
			}
		}        
    });
});

$('.popup-youtube').magnificPopup({
    type: 'iframe',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false,
	callbacks: {
		beforeOpen: function() {
		   this.st.mainClass = this.st.el.attr('data-effect');
		}
	}
});

// Init dropzone file upload
function initDropzone(element) {
    element.each(function (index) {
        var $this = $(this);
        $this.attr('id', 'dropzone-' + index);
        
        Dropzone.autoDiscover = false;
          var dropzone = new Dropzone("#dropzone-" + index, { 
            url: "/file/post",
            acceptedFiles: "image/jpeg,image/jpg,image/png",
            dictDefaultMessage: "Добавьте новую  фотографию перетащив их в поле. Или воспользуйтесь обычной загрузкой",
            dictRemoveFile: "Удалить",
            uploadMultiple: true,
            thumbnailWidth: null,
            thumbnailHeight: null,
            addRemoveLinks: true,
            init: function() {
                this.on("addedfile", function() {
                  if (this.files[1]!=null){
                    this.removeFile(this.files[0]);
                  }
                });
              }
          });

    });
}; 
initDropzone($('.dropzone'));

function togglePhotos() {
	$('.draw-photo').slideToggle();
}

$(document).ready(function () {
	 var videobox = document.getElementById('videobox');
	 $('#video-link').on('keyup', function() {
	   if($(this).val() === "") {
	 videobox.style.display = "none";
	   }else{
	 var url =$(this).val(); 
	 var ifrm = document.createElement('iframe');
	 ifrm.src = (!url.includes('vimeo')) ? "//www.youtube.com/embed/"+ url.split("=")[1] : "//player.vimeo.com/video/"+ url.split("/")[3];
	 ifrm.width= "668";
	 ifrm.height = "450";
	 ifrm.frameborder="0";
	 ifrm.scrolling="no";
	 $('#video-preview').html(ifrm);
	 videobox.style.display = "block";
	   }
	  });
})

// Change tab based on url
$(document).ready(function () {
	var url = document.location.toString();
	if (url.match('#')) {
	    $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
	} 

	// Change hash for page-reload
	$('.nav-tabs a').on('shown.bs.tab', function (e) {
	    window.location.hash = e.target.hash;
	})
	$('.nav-tabs li a').click(function (e) {
	    e.preventDefault();
	});
})
  jQuery.extend(jQuery.validator.messages, {
          required: "Заполните поле",
          remote: "Пожалуйста, введите правильное значение.",
          email: "Введите корректный E-mail",
          emailAdvanced: "Введите корректный E-mail",
          alpha: "Введите корректный E-mail eng",
          url: "Пожалуйста, введите корректный URL видео Youtube.",
          date: "Пожалуйста, введите корректную дату.",
          dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
          number: "Пожалуйста, введите число.",
          digits: "Пожалуйста, вводите только цифры.",
          creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
          equalTo: "Пожалуйста, введите такое же значение ещё раз.",
          accept: "Пожалуйста, выберите файл с правильным расширением.",
          maxlength: jQuery.validator.format("Пожалуйста, введите не больше {0} символов."),
          minlength: jQuery.validator.format("Введите корректный номер"),
          rangelength: jQuery.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),
          range: jQuery.validator.format("Пожалуйста, введите число от {0} до {1}."),
          max: jQuery.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),
          min: jQuery.validator.format("Пожалуйста, введите число, большее или равное {0}."),
          // Add here you custom rule message
          remote: jQuery.validator.format("Такой пользователь уже зарегистрирован.")
  });


// Jquery validation login form    
$('#loginForm').validate({
	rules: {
		login: {
			required: true,
			email: true
		}
	}
});

// Jquery validation register form    
$('#oneClickForm').validate({
	rules: {
		mail: {
			required: true,
			email: true
		}
	}
})

// Jquery validation express register form    
$('#expressRegisterForm').validate({
	rules: {
		expressRegisterMail: {
			required: true,
			email: true
		}
	}
})

// Jquery validation register form    
$('#registerForm').validate({
	rules: {
		registerMail: {
			required: true,
			email: true,
			/* 
			remote: {
				url: "/registration/register_email_exists",
				type: "post",
				data: {
					email: function(){ return $("#email").val(); }
				}
			}
			*/
		},
		cardValue: {
			required: true,
			cardNumber: 7
		}
	}
})


// Поле ввода бонусной карты
$('.bonus-activate .form-control').on("change paste keyup", function() {
   if ($(this).val().length == 7) {
   	$(this).parent().addClass('card-valid');
   } else{
   	$(this).parent().removeClass('card-valid');
   }
});

// Кастомный метод для проверки длинны поля карты
jQuery.validator.addMethod("cardNumber", function(value, element, param) {
 return this.optional(element) || value.length == param;
}, $.validator.format("Карты с таким номером не существует."));

$('#bonusCard').validate({
	rules: {
		cardValue: {
			required: true,
			cardNumber: 7
		}
	}
})

function checkFilterLength() {
	if ($('.filter .wrapper .col-12').length >4) {
		$('<span class="all-filter"><i>Ещё фильтры</i></span>').insertAfter($('.filter'));
		
		$('.all-filter i').click(function() {
			$(this).text(function(i, text){
		          return text === "Ещё фильтры" ? "Свернуть" : "Ещё фильтры";
		      })
			$(this).parent().parent().find('.filter').toggleClass('opened');
		});		
	} else {
		$('.all-filter i').remove();
	}
}

$(document).ready(function () {
	checkFilterLength()
	if ($('.b-action').length) {
		$('.b-footer').css('padding-bottom', 85 + 'px');
	} else {}
})

$.fn.timer = function( callback ) {
    callback = callback || function() {};
    return this.each(function() {
        var $timer = $( this ),
            $minutesEl = $timer.find( '.minutes' ),
            $secondsEl = $timer.find( '.seconds' ),
            interval = 1000,
            timer = null,
            start = 60,
            minutesText = $minutesEl.text(),
            minutes = ( minutesText[0] == '0' ) ? minutesText[1] : minutesText[0],
            m = Number( minutes );
            
            timer = setInterval(function() {
                start--;
                if( start == 0 ) {
                    start = 60;
                    
                    $secondsEl.text( '00' );
                    
                    m--;
                    
                    if( m == 0 ) {
                        clearInterval( timer );
                        $minutesEl.text( '00' );
                        callback();
                        
                    }
                } else {
                
                    if( start >= 10 ) {
                
                        $secondsEl.text( start.toString() );
                
                    } else {
                
                        $secondsEl.text( '0' + start.toString() );
                    
                
                    }
                    if( minutes.length == 2 ) {
                        $minutesEl.text( m.toString() );
                    } else {
                        if( m == 1 ) {
                            $minutesEl.text( '00' );    
                        } else {
                            $minutesEl.text( '0' + m.toString() );
                        }
                    }
                
                }
            
            }, interval);
    
    });

};



$('#bonus-check').click(function() {
	if ($(this).is( ":checked" )) {
		$('<div class="form-group required no-label cardValue"><input type="number" class="form-control" name="cardValue" id="cardValue" placeholder="Введите номер карты" maxlength="7" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></div>').insertAfter($(this).parent());
	} else {
		$('.cardValue').remove();
	}
});

$('#login-email').keyup(function() {
    if($(this).val().length > 0) {
    	$('#loginForm').addClass('email-active');
    	$('.password-wrap').addClass('required');
    	$('.password-wrap input').prop('required',true);
        $('.phone-wrap').removeClass('required has-error');
        
        $('#login-phone').prop('required',false);    	
    } else {
        $('#loginForm').removeClass('email-active');
        $('#login-phone').prop('required',true);
        $('.phone-wrap').addClass('required');    
        $('.password-wrap').removeClass('required has-error');
        $('.password-wrap input').prop('required',false);
        $('.password-wrap input').removeClass('error');
    }
});
$('#login-phone').keyup(function() {
    if($(this).val().length > 0) {
    	$('#loginForm').addClass('phone-active');
    	$('#login-email').prop('required',false);
    	$('.email-wrap').removeClass('required has-error');
    } else {
        $('#loginForm').removeClass('phone-active');
        $('.email-wrap').addClass('required');
    	$('#login-email').prop('required',true);
    }
});

$('#login-phone-btn').click(function () {
	$('#loginForm').addClass('sms-active');
    $(function() {
        $( '.timer' ).timer(function() {
            $( '.timer' ).hide();
            $('.again-sms').show();
        });
    });
})
$('.js-bonus-phone').click(function () {
    $(this).parents('form').addClass('sms-active');
    $(function() {
        $( '.timer' ).timer(function() {
            $( '.timer' ).hide();
            $('.bonus-again-sms').show();
        });
    });
})
$('.js-show-card').click(function () {
    $(this).parents('form').addClass('card-active');
})
$('.move-back').click(function (e) {
	e.preventDefault();
	$(this).parents('form').removeClass('sms-active phone-active');
})
$('.quick-link').click(function (e) {
	e.preventDefault();
})

$(document).on('click', 'a.auth', function () {
	$('.js-login-modal').fadeIn();
})

$(document).on('click', '.js-order-confirm', function () {
	$(this).addClass('disabled');
})

$(document).ready(function () {
	 svg4everybody();
})
function sharePlugin() {
    var Shares = {
    title: 'Поделиться',
    width: 800,
    height: 800,

    init: function() {
        var share = document.querySelectorAll('.social');
        for(var i = 0, l = share.length; i < l; i++) {
            var url = share[i].getAttribute('data-url') || location.href, title = share[i].getAttribute('data-title') || '', 
                desc = share[i].getAttribute('data-desc') || '', el = share[i].querySelectorAll('a');
            for(var a = 0, al = el.length; a < al; a++) {
                var id = el[a].getAttribute('data-id');
                if(id)
                    this.addEventListener(el[a], 'click', {id: id, url: url, title: title, desc: desc});
            }
        }
    },

    addEventListener: function(el, eventName, opt) {
        var _this = this, handler = function() {
            _this.share(opt.id, opt.url, opt.title, opt.desc);
        };
        if(el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function() {
                handler.call(el);
            });
        }
    },

    share: function(id, url, title, desc) {
        url = encodeURIComponent(url);
        desc = encodeURIComponent(desc);
        title = encodeURIComponent(title);
        switch(id) {
            case 'fb':
                this.popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + url, this.title, this.width, this.height);
                break;
            case 'vk':
                this.popupCenter('https://vk.com/share.php?url=' + url + '&description=' + title + '. ' + desc, this.title, this.width, this.height);
                break;
            case 'tw':
                var text = title || desc || '';
                if(title.length > 0 && desc.length > 0)
                    text = title + ' - ' + desc;
                if(text.length > 0)
                    text = '&text=' + text;
                this.popupCenter('https://twitter.com/intent/tweet?url=' + url + text, this.title, this.width, this.height);
                break;
            case 'gp':
                this.popupCenter('https://plus.google.com/share?url=' + url, this.title, this.width, this.height);
                break;
            case 'ok':
                this.popupCenter('https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=' + url, this.title, this.width, this.height);
                break;
        }
    },

    newTab: function(url) {
        var win = window.open(url, '_blank');
        win.focus();        
    },

    popupCenter: function(url, title, w, h) {
            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 3) - (h / 3)) + dualScreenTop;
            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            if (window.focus) {
                    newWindow.focus();
            }
        }
    };

    jQuery(document).ready(function($) {
        $('.social a').on('click', function() {
            var id = $(this).data('id');
            if(id) {
                var data = $(this).parent('.social');
                var url = data.data('url') || location.href, title = data.data('title') || '', desc = data.data('desc') || '';
                Shares.share(id, url, title, desc);
            }
        });
    });
}
$(document).on('click', '.bonus-card-form .keyboard-phone [data-number]', function () {
  if($(".bonus-card-form .js-tel-new").val().length < 16){
    var phoneNumber = $(".bonus-card-form .js-tel-new").val() + $(this).data("number");

    var SPMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 16 ? '+7 000 000-00-00' : '+7 000 000-00-09';
    },
    spOptions = {
      onKeyPress: function(val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };
    $(".bonus-card-form .js-tel-new").val(phoneNumber);
    $('.bonus-card-form .js-tel-new').mask(SPMaskBehavior, spOptions);
  }
})
$(document).on('click', '.bonus-card-form .keyboard-sms [data-number]', function () {
  if($(".bonus-card-form .sms-wrap input").val().length < 16){
    var phoneNumber = $(".bonus-card-form .sms-wrap input").val() + $(this).data("number");
    $(".bonus-card-form .sms-wrap input").val(phoneNumber);
  }
})
function bonusCardKeyboard() {
    $(".bonus-card-form .delete").on('click',function(){
      var phoneNumber = $(".bonus-card-form .js-tel-new").val().slice(0,-1);
      $(".bonus-card-form .js-tel-new").val("");
      $(".bonus-card-form .js-tel-new").val(phoneNumber);
    });
}
bonusCardKeyboard()

$(document).ready(function () {
    sharePlugin()
})
