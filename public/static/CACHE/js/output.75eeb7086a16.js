window.ap = true;
(function($) {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.scroll-up').fadeIn();
        } else {
            $('.scroll-up').fadeOut();
        }
    });
    $('.scroll-up').click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
    $(window).on('load resize', function() {
        $(".mtheight").matchHeight();
        $(".daily_post_details p").matchHeight();
        $(".daily_post_details h6").matchHeight();
        $(".misto_offers_box .p-lg-4.p-3 p").matchHeight();
    }).trigger('load');
    $(document).ready(function() {
        $("<span class='down-arrow'><i class='fa fa-caret-down'></i></span>").insertAfter("li.menu-item-has-children > a");
        $(".drop").click(function() {
            $(this).toggleClass('close-menu');
            $(".main_menu").slideToggle('slow');
            $("html").toggleClass("body-overflow");
            $(".down-arrow").removeClass("open2");
            $('.sub-menu').slideUp('500');
        });
        $('.main_menu ul > li.menu-item-has-children a, .main_menu ul > li.menu-item-has-children .down-arrow, .footer_menu ul > li.menu-item-has-children a, .footer_menu ul > li.menu-item-has-children .down-arrow').on('click', function() {
            $(this).parent('li').find("> .sub_menu").slideToggle('500');
            $(this).parent('li').siblings('li').find('> .sub_menu').slideUp('500');
            $(".down-arrow").toggleClass('open2');
            $(this).parent('li').siblings('li').find("> .down-arrow").removeClass('open2');
        });
    });
    $(function() {
        if ($(window).width() < 1101) {}
    })
    $(window).scroll(function() {
        if ($(window).width() > 767) {}
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > 80) {
            $('#header').addClass('sticky');
            $('.ask_us_btn').fadeIn();
        } else {
            $('#header').removeClass('sticky');
            $('.ask_us_btn').fadeOut();
        }
    });
})(jQuery);;