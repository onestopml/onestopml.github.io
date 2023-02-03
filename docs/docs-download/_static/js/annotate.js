$(document).ready(function () {
    $(".scalize").each(function () {
        $(this).scalize({
            styleSelector: 'circle',
            animationSelector: 'pulse'
        })
    });
});