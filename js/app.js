$(document).ready(function() {
    new Employee();
});


// Lớp nhân viên
class Employee {
    TitlePage = 'Danh sách khách hàng';
    FormMode = null;
    EmployeeIdSelected = null;
    constructor() {
        this.loadData();
        // this.intitEvents();
        this.hidePopup();


    }

    /**
     * Thực hiện load dữ liệu
     * author: Bakachan
     */
    loadData() {
        var me = this;
        // Lam sach bang
        $('#tbdlEmloyeesList tbody').empty();

        // Lấy dữ liệu:
        let employees = [];
        // Lấy các thông tin thực hiện phân trang
        const employeeFilter = $('#txtSearch').val();
        const pageSize = $('#cbxPageSize').val();
        const pageNumber = 1;
        let apiUrl = `http://cukcuk.manhnv.net/api/v1/Employees/employeeFilter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${employeeFilter}`;

        // Gọi lên api thực hiện lấy dữ liệu:

        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees",
            async: false,
            success: function(response) {
                employees = response;
                // if (employees > 0) {
                //Duyệt từng nhân viên trong mảng:
                for (let e of employees) {
                    e.DateOfBirth = CommonJS.formatDate(e.DateOfBirth);
                    // Build từng tr và append vào tbody của table:
                    let tr = $(`<tr>
                                <td><input type="checkbox"></td>
                                <td class="text-align-left">${e.EmployeeCode}</td>
                                <td class="text-align-left">${e.EmployeeName}</td>
                                <td class="text-align-left">${e.GenderName}</td>
                                <td class="text-align-center">${e.DateOfBirth}</td>
                                <td class="text-align-left">${e.IdentityNumber}</td>
                                <td class="text-align-left" >${e.EmployeePosition}</td>
                                <td class="text-align-left">${e.DepartmentName}</td>
                                <td class="text-align-left">${e.BankAccountNumber}</td>
                                <td class="text-align-left" >${e.BankName}</td>
                                <td class="text-align-left">${e.BankBranchName}</td>
                                <td class="text-align-left">
                                    <div class="m-content-table-row-setting">
                                    <div class="m-c-t-r-box">
                                        <div id="m-c-t-r-icon-btn" class="m-content-table-row-setting-text">Sửa</div>
                                        <div id="m-c-t-r-icon-down" class="m-content-table-row-icon"></div>
                                    </div>
                                    <div class="m-c-t-r-data">
                                        <div class="m-c-t-r-item" value='1'>Nhân bản</div>
                                        <div id="" class="m-c-t-r-item m-c-t-r-activate" value='2'>Xóa</div>
                                        <div class="m-c-t-r-item" value='3'>Ngừng sử dụng</div>
                                    </div>
                                        </div>
                                </td>
                                </tr>`);
                    // Lưu trử khóa chính của dòng dữ liệu hiện tại: 
                    tr.data("employeeId", e.EmployeeId);
                    tr.data("data", e);
                    // Thêm tr vào trong bảng
                    $('#tbdlEmloyeesList tbody').append(tr);
                }
                // }

            },
            error: function(res) {
                alert("Co loi xay ra");
            }
        });




        // Hiện lại hiệu ứng loading page
        $('.m-loading').show();

        // Tắt hiệu ứng loading page
        setTimeout(() => {
            $('.m-loading').hide();
        }, 1000);

        me.intitEvents();


    }


    /**
     * Thực hiện gán các sự kiện trong trang
     * author: bakachan
     */
    intitEvents() {

        //Nút thêm nhân viên:
        $("#m-btn-add-ele").click(this.btnAddOnClick.bind(this));

        // Nút Refresh lại page
        $("#btnRefresh").click(this.btnLoadingPage.bind(this));

        // Nút tìm kiếm nhân viên
        // $("#txtSearch").on

        // Nút save và add nhân viên
        $("#m-d-f-save-add").click(this.saveData.bind(this));

        // Hiện thị đang chọn dòng nhân viên nào
        $('table#tbdlEmloyeesList tbody').on('click', 'tr', this.rowOnClick.bind(this));

        // Nút sửa nhân viên:
        $('table#tbdlEmloyeesList tbody tr').on('click', '.m-content-table-row-setting-text', this.btnUpdateData.bind(this));

        //Nhấn downicon để hiện thị thao tác
        $(".m-content-table-row-setting .m-content-table-row-icon").on('click', this.btnDownIconOnclick.bind(this));

        // Nhấn item để ẩn data item
        $(".m-c-t-r-item").on('click', this.itemDownIconOnClick.bind(this));

        // Nhấn vào item xóa để hiện thị popup delete
        $(".m-c-t-r-activate").on('click', this.dataEmployeeDelete.bind(this))

        // Nhấn vào btn xóa để xóa nhân viên
        $('#k-d-f-delete').on('click', this.delete.bind(this));

    }

    /**
     * Chọn nhân viên khi nhấn vào dòng nhân viên
     * Author: Bakachan
     */
    rowOnClick(sender) {
        let currentRow = sender.currentTarget;
        let employeeId = $(currentRow).data('employeeId');
        this.EmployeeIdSelected = employeeId;
        $(currentRow).siblings().removeClass('m-row-selected');
        currentRow.classList.add('m-row-selected');
    }

    /**
     * Thực hiện hiển thị popup khi nhấn vào nút thêm nhân viên
     * author: bakachan
     */
    btnAddOnClick() {

        // Gán lại giá trị cho FormMode của EmployeePage:
        this.FormMode = Enum.FormMode.Add;
        // Clean error
        this.HideError();
        //Clean các giá trị đã được nhập trước đó;
        // reset input
        let inputs = $("#dlgPopup input");
        for (const input of inputs) {
            if ($(input).attr('type') != 'radio') {
                $(input).val(null);
            }
        }


        // Lấy mã nhân viên mới và hiện thị lên ô nhập mã nhân viên
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response) {
                // Lấy dữ liệu mã nhân viên
                $("#m-employeeCode-txt").val(response);
                // Focus vào ô nhập liệu đầu tiên
                $("#m-employeeCode-txt").focus();
            }
        });
        // Hiện thị form thêm mới nhân viên
        $("#dlgPopup").show();
    }

    /**
     * Hiện thị form nhân viên khi nhấn vào nút sửa
     * author: Bakachan
     */
    btnUpdateData(sender) {
        // debugger
        // Clean error
        this.HideError();
        this.FormMode = Enum.FormMode.Update;
        let currentRow = sender.currentTarget;
        let test = $(currentRow).parents("tr");

        let employeeId = $(test).data('employeeId');
        this.EmployeeIdSelected = employeeId;
        // Gọi api lấy dữ liệu chi tiết nhân viên:
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
            // async: false,
            // async: true,
            success: function(e) {

                // Binding du lieu vao form
                // 1. Lấy toàn bộ các input sẽ biding dữ liệu -> có attribute [fieldName];
                let inputs = $("input[fieldName]");
                // 2. Duyệt từng input -> Lấy ra giá trị của attribute -> Để biết được sẽ map thông tin nào của đối tượng
                for (const input of inputs) {
                    let fieldName = input.getAttribute("fieldName");
                    let value = e[fieldName];
                    if (value)
                        input.value = value;
                    else
                        input.value = null
                }
                console.log(e);

                // Hiện thị form chi tiết
                $("#dlgPopup").show();

            }
        });



    }

    /**
     * Thực hiện nhấn downIcon để thực hiện thao tác 
     * author: Bakachan
     */
    btnDownIconOnclick(e) {
        // debugger
        // Ẩn/Hiện DownIcon data
        let check = e.currentTarget;
        // $(check).parents('.m-c-t-r-data').toggle();
        $(e.currentTarget).parents('.m-c-t-r-box').siblings(".m-c-t-r-data").toggle();
        // return
    }

    /**
     * Nhấn item để ẩn data item
     * author: Bakachan
     */
    itemDownIconOnClick(e) {
        // debugger
        // Ẩn data item
        let check = e.currentTarget;
        $(check).parents('.m-c-t-r-data').hide();

    }

    /**
     * Thực hiện ẩn đi popup
     * author: bakachan
     */
    hidePopup() {

        // Nhấn dấu x bên trên để ẩn 
        $('#m-dialog-close').click(() => {
            $('#dlgPopup').hide();
        })

        // Nhấn dấu hủy bên dưới để ẩn
        $('#m-d-f-close').click(() => {
            $('#dlgPopup').hide();
        })
    }

    /**
     * Thực hiện ẩn Error
     * author: Bakachan
     */
    HideError() {
        $("#m-employeeCode-txt").removeClass("m-input-select");
        $("#m-employeeCode-txt").next().hide();
        $("#m-employeeFullName-txt").removeClass("m-input-select");
        $("#m-employeeFullName-txt").next().hide();
        $("#m-employeeDepartmentId-txt").removeClass("m-input-select");
        $("#m-employeeDepartmentId-txt").next().hide();
    }

    /**
     * Thực hiện click input ẩn Error
     * author: Bakachan
     */
    OnClickHideError() {
        $("#m-employeeCode-txt").click(() => {
            $("#m-employeeCode-txt").removeClass("m-input-select");
            $("#m-employeeCode-txt").next().fadeOut();
        });
        $("#m-employeeFullName-txt").click(() => {
            $("#m-employeeFullName-txt").removeClass("m-input-select");
            $("#m-employeeFullName-txt").next().fadeOut();
        });
        $("#m-employeeDepartmentId-txt").click(() => {
            $("#m-employeeDepartmentId-txt").removeClass("m-input-select");
            $("#m-employeeDepartmentId-txt").next().fadeOut();
        });
    }

    /**
     * Thực hiện lưu dữ liệu nhân viên
     * author: Bakachan
     */
    saveData() {
        // Xóa class hiện thị bị trống trong div
        this.OnClickHideError();


        var me = this;
        // value dữ liệu: Kiểm tra dữ liệu có hợp lệ hay ko:

        // Thực hiện build object chi tiết thông tin khách hàng
        // 1. Lấy toàn bộ các input sẽ biding dữ liệu -> có attribute [fieldName];
        let inputs = $("input[fieldName]");
        // 2. Duyệt từng input -> Lấy ra giá trị của attribute -> Để biết được sẽ map thông tin nào của đối tượng
        let e = {};
        for (const input of inputs) {
            let fieldName = input.getAttribute("fieldName");
            let value = input.value;
            if (value)
                e[fieldName] = value;
        }

        let radioCheck = $('input[type=radio]:checked');
        // console.log(radioCheck);
        let radiofieldName = $('#m-employeeGender-txt').attr("fieldName");
        let radiovalue = radioCheck.val();
        if (radiovalue)
            e[radiofieldName] = radiovalue;
        // debugger
        // Duyệt các combobox 
        let comboboxs = $('#dlgPopup div[mcombobox]');
        // Duyệt từng thằng combobox lấy ra value:
        for (const combobox of comboboxs) {
            let value = $(combobox).attr('value');
            let fieldName = $(combobox).data('fieldName');
            if (fieldName) {
                e[fieldName] = value;
            }
            // debugger

        }
        console.log(e);
        const idHTML = e.EmployeeCode;
        const fullnameHTML = e.EmployeeName;
        const DepartmentHTML = e.DepartmentId;
        if (idHTML == null || fullnameHTML == null || DepartmentHTML == null) {
            if (idHTML == null) {
                $("#m-employeeCode-txt").addClass("m-input-select");
                $("#m-employeeCode-txt").next().fadeIn();
            }
            if (fullnameHTML == null) {
                $("#m-employeeFullName-txt").addClass("m-input-select");
                $("#m-employeeFullName-txt").next().fadeIn();

            }
            if (DepartmentHTML == null) {
                $("#m-employeeDepartmentId-txt").addClass("m-input-select");
                $("#m-employeeDepartmentId-txt").next().fadeIn();

            }
            // alert('Vui lòng nhập lại form')
            return;
        }
        // Thực hiện cất dữ liệu => cần kiểm tra xem form ở trạng thái thêm mới hay là update để gọi api tương ứng
        if (this.FormMode == Enum.FormMode.Add) {
            $.ajax({
                type: "POST",
                url: "http://amis.manhnv.net/api/v1/Employees",
                data: JSON.stringify(e),
                async: false,
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    // console.log(e);
                    // Load lại dự liệu
                    me.loadData();
                    // Ẩn form chi tiết
                    $("#dlgPopup").hide();

                },
                error: function(res) {
                    let status = res.status;
                    switch (status) {
                        case 400:
                            // Thay đổi text của popup error là mã nhân viên không hợp lệ
                            $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > không hợp lệ vui lòng kiểm tra lại.</div>
                            `);
                            break;
                        case 500:
                            // Thay đổi text của popup error là mã nhân viên bị trùng
                            $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > đã tồn tại trong hệ thống vui lòng kiểm tra lại.</div>
                            `);
                            break
                        default:
                            break;
                    }
                    // Hiện thị popup error
                    $('#kien-dlgPopup').show();
                    // Nhấn nút đồng ý để ẩn delete popup
                    $('#kien-d-f-close').click(() => {
                        $('#kien-dlgPopup').hide();
                        // alert("Co loi xay ra");
                    })
                }
            });

        } else {
            $.ajax({
                type: "PUT",
                url: `http://amis.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
                data: JSON.stringify(e),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    // Load lại dự liệu
                    // console.log(e);
                    me.loadData();
                    // Ẩn form chi tiết
                    $("#dlgPopup").hide();
                },
                error: function(res) {
                    let status = res.status;
                    switch (status) {
                        case 400:
                            // Thay đổi text của popup error là mã nhân viên không hợp lệ
                            $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > không hợp lệ vui lòng kiểm tra lại.</div>
                            `);
                            break;
                        case 500:
                            // Thay đổi text của popup error là mã nhân viên bị trùng
                            $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > đã tồn tại trong hệ thống vui lòng kiểm tra lại.</div>
                            `);
                            break
                        default:
                            break;
                    }
                    // Hiện thị popup error
                    $('#kien-dlgPopup').show();
                    // Nhấn nút đồng ý để ẩn delete popup
                    $('#kien-d-f-close').click(() => {
                        $('#kien-dlgPopup').hide();
                        // alert("Co loi xay ra");
                    })
                }
            });
        }
    }

    /**
     * Thực hiện loading page khi nhấn nút refresh
     * author: Bakachan
     */
    btnLoadingPage() {
        this.loadData();

    }





    /**
     * Hiện thị popup delete
     * author: Bakachan
     */
    deletePopup() {
        // Hiện thị
        // debugger
        $('#k-dlgPopup').show();
        // Ẩn data của item

        $(this).parents('.m-c-t-r-data').hide();
        // Nhấn nút hủy để ẩn delete popup
        $('#k-d-f-close').click(() => {
            $('#k-dlgPopup').hide();
        })



    }

    /**
     * Thực hiện xóa 1 dòng nhân viên
     * author: Bakachan
     */
    delete(sender) {
        // debugger
        var me = this;
        // Lấy ra id của bản ghi vừa chọn
        let currentRow = $('tr.m-row-selected');

        let employeeId = $(currentRow).data('employeeId');
        this.EmployeeIdSelected = employeeId;
        // Gọi api thực hiện xóa
        $.ajax({
            type: "DELETE",
            url: `http://amis.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,

            success: function(response) {
                // Ẩn delete popup
                $('#k-dlgPopup').hide();

                me.loadData();
                // $('#m-toast-error').fadeIn(1000);
                // $('#m-toast-error').fadeOut(3000);
            }
        });
    }

    /**
     * Load data về mã nhân viên cần xóa
     * author: Bakachan
     */

    dataEmployeeDelete() {
        // debugger

        let currentRow = $('tr.m-row-selected');

        let employeeId = $(currentRow).data('employeeId');
        this.EmployeeIdSelected = employeeId;
        // Gọi api lấy dữ liệu chi tiết nhân viên:
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
            // async: false,
            // async: true,
            success: function(e) {
                // debugger
                const idHTML = e.EmployeeCode;

                $("div.k-dialog-content-right").html(`<div class="k-d-c-r-text">Bạn có chắc chắn muốn xóa Nhân viên < ${idHTML} > không?</div>
                `);
            }
        });
        // Hiện thị
        // debugger
        $('#k-dlgPopup').show();
        // Ẩn data của item

        $(this).parents('.m-c-t-r-data').hide();
        // Nhấn nút hủy để ẩn delete popup
        $('#k-d-f-close').click(() => {
            $('#k-dlgPopup').hide();
        })
    }
}