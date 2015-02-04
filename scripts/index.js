/**
 * Created by Don on 2/4/2015.
 */
$(document).ready(function () {
    function showForm(type) {
        var intro = $('#intro') /*nxt line*/
            , loginForm = $(type);

        intro.addClass('flow_up');
        setTimeout(function () {
            intro.hide()
                .removeClass('flow_up');
        }, 600);
        setTimeout(function () {
            loginForm.show()
                .addClass('flow_up');
        }, 400);

        setTimeout(function () {
            loginForm.removeClass('flow_up');
        }, 1000);
    }

    function hideForm(type) {
        var loginForm = $(type);

        loginForm.addClass('flow_down');

        setTimeout(function () {
            loginForm.removeClass('flow_down')
                .hide();
        }, 600);
    }

    $('#login').click(function (event) {
        showForm('#login_form');

        event.preventDefault();
    });

    $('#register').click(function (event) {
        showForm('#register_form');

        event.preventDefault();
    });

    $('.cancel').click(function (event) {
        var intro = $('#intro');
        setTimeout(function () {
            intro.show();
            intro.addClass('flow_down');
        }, 400);

        setTimeout(function () {
            intro.removeClass('flow_down');
        }, 1000);

        if (!$('#login_form').is(':hidden')) {
            hideForm('#login_form');
        } else {
            hideForm('#register_form');
        }

        event.preventDefault();
    });

    $('input[type=checkbox]').on('change', function () {
        if ($(this).is(":checked"))
            $(this).parent("label").addClass("selected");
        else
            $(this).parent("label").removeClass("selected");
    });


    $('.scheckbox').prepend('<i class="icon"></i>')
});