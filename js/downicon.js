$(document).ready(function() {
    // Khởi tạo sự kiện cho button của DownIcon
    $(".m-content-table-row-setting .m-content-table-row-icon").on('click', btnDownIconOnclick);

    $(".m-c-t-r-item").on('click', itemDownIconOnClick);

    $("#m-c-t-r-icon-btn").on('click', openPopup)


})

function btnDownIconOnclick() {
    // Ẩn/Hiện DownIcon data
    $(this).parents('.m-c-t-r-box').siblings(".m-c-t-r-data").toggle();

}

function itemDownIconOnClick() {
    // Ẩn item trong data
    $(this).parents('.m-c-t-r-data').hide();

}

function openPopup() {
    $('#dlgPopup').show();
}