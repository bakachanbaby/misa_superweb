$(document).ready(function() {
    new Employee();
});


// Lớp nhân viên
class Employee {
    TitlePage = 'Danh sách khách hàng';

    FormMode = null; //Chế độ Form
    EmployeeIdSelected = null; //Id của nhân viên được chọn
    GetId = null;
    TotalPage = null; //Tổng trang
    TotalRecord = null; //Tổng bản ghi
    CurrentPageIndex = 1; //Trang hiện tại
    MaxPageIndexButton = 5; // Số nút trang hiển thị
    ValueIndex = 1;
    constructor() {
        this.TotalPage = null;
        this.TotalRecord = null;
        this.CurrentPageIndex = 1;
        this.MaxPageIndexButton = 5;
        this.ValueIndex = 1;

        this.loadData();
        this.intitEvents();
        // Ẩn popup
        this.hidePopup();
        // Tìm kiến nhân viên theo tên
        // this.findEmployeeByEnter();

    }

    /**
     * Thực hiện lấy data của phòng ban
     * author: Bakachan
     */
    dataDepartment(DeID) {
        // Lấy dữ liệu về
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Departments",
            // async: faltrue,
            success: function(response) {
                // Buid combobox
                for (const department of response) {
                    if (DeID == department.DepartmentId) {
                        this.GetId = department.DepartmentName;
                        break;
                    }
                }
            }
        });
    }

    /**
     * Thực hiện load dữ liệu
     * author: Bakachan
     */
    loadData(pageNumber) {
        var me = this;
        // Lam sach bang
        $('#tbdlEmloyeesList tbody').empty();

        // Lấy dữ liệu:
        let employees = [];
        // Lấy các thông tin thực hiện phân trang
        let employeeFilter = $('#txtSearch').val();
        let pageSize = $('#cbxPageSize').val();
        // const pageNumber = 1;
        if (!pageNumber)
            pageNumber = 1;
        // let apiUrl = "http://amis.manhnv.net/api/v1/Employees/filter?pageSize=30&pageNumber=1";
        let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${employeeFilter}`;

        // Gọi lên api thực hiện lấy dữ liệu:

        $.ajax({
            type: "GET",
            // url: "http://amis.manhnv.net/api/v1/Employees",
            url: apiUrl,
            async: false,
            success: function(response) {
                employees = response;

            },
            error: function(res) {
                alert("Co loi xay ra");
            }
        });
        // Thực tính toán các số liệu để hiện thị lên giao diện: (tổng số bản ghi, thông tin index bản ghi)
        this.TotalRecord = employees.TotalRecord;
        this.TotalPage = employees.TotalPage;
        $("#totalRecord").text(` ${this.TotalRecord}  `);


        // Tính toán việc hiển thị số trang trong Pagingbar:
        // Nếu tổng số trang lớn hơn số button trang hiển thị trên giao diện -> Render ra 5 button:
        // Nếu nhỏ hơn số button trang hiển thị trên giao diện -> reander ra this.TotalPage
        $('.m-paging .m-paging-number').empty();
        if (this.MaxPageIndexButton <= this.TotalPage) {

            // Lấy thông tin trang hiện tại:
            let currentPageIndex = this.CurrentPageIndex;
            // console.log(currentPageIndex);
            // Xác định xem trang hiện tại nằm ở phạm vi nào:
            let totalRange = Number.parseInt(this.TotalPage / pageSize) + ((this.TotalPage % pageSize) > 0 ? 1 : 0);
            let currentRange = 0;
            if (currentPageIndex % this.MaxPageIndexButton != 0)
                currentRange = Number.parseInt(currentPageIndex / this.MaxPageIndexButton) + 1;
            else {
                currentRange = Number.parseInt(currentPageIndex / this.MaxPageIndexButton);
            }
            // console.log(currentRange);
            // Xác định button bắt đầu bằng trang số bao nhiêu:
            let endButton = currentRange * this.MaxPageIndexButton;
            if (endButton > this.TotalPage)
                endButton = this.TotalPage;
            for (let index = 0; index < this.MaxPageIndexButton; index++) {
                let buttonHTML = $(`<div class="m-paging-hover page-number">${endButton}</div>`);
                buttonHTML.data('value', endButton);
                if (endButton <= this.TotalPage) {
                    if (currentPageIndex == endButton) {
                        buttonHTML.addClass('page-number-active');
                    }
                    $('.m-paging .m-paging-number').prepend(buttonHTML);
                    endButton--;
                }
                // else {

                //     if (currentPageIndex == endButton) {
                //         buttonHTML.addClass('page-number-active');
                //     }
                //     $('.m-paging .m-paging-number').prepend(buttonHTML);
                //     endButton--;
                // }
            }

        } else {
            // Lấy thông tin trang hiện tại:
            let currentPageIndex = this.CurrentPageIndex;
            // console.log(currentPageIndex);
            // Xác định xem trang hiện tại nằm ở phạm vi nào:
            let totalRange = Number.parseInt(this.TotalPage / pageSize) + ((this.TotalPage % pageSize) > 0 ? 1 : 0);
            let currentRange = 0;
            if (currentPageIndex % this.TotalPage != 0)
                currentRange = Number.parseInt(currentPageIndex / this.TotalPage) + 1;
            else {
                currentRange = Number.parseInt(currentPageIndex / this.TotalPage);
            }
            // console.log(currentRange);
            // Xác định button bắt đầu bằng trang số bao nhiêu:
            let endButton = currentRange * this.TotalPage;
            for (let index = 0; index < this.TotalPage; index++) {
                let buttonHTML = $(`<div class="m-paging-hover page-number">${endButton}</div>`);
                buttonHTML.data('value', endButton);
                // if (endButton <= this.TotalPage) {
                if (currentPageIndex == endButton) {
                    buttonHTML.addClass('page-number-active');
                }
                $('.m-paging .m-paging-number').prepend(buttonHTML);
                endButton--;
                // } else {
                //     if (currentPageIndex == endButton) {
                //         buttonHTML.addClass('page-number-active');
                //     }
                //     $('.m-paging .m-paging-number').prepend(buttonHTML);
                //     endButton--;
                // }
            }

        }
        // Lấy trang hiện tại
        this.ValueIndex = this.CurrentPageIndex;
        if (employees.Data.length > 0) {
            //Duyệt từng nhân viên trong mảng:
            for (let e of employees.Data) {
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
                // console.log(e);
                // Thêm tr vào trong bảng
                $('#tbdlEmloyeesList tbody').append(tr);
            }
        }

        // Hiện lại hiệu ứng loading page
        $('.m-loading').show();

        // Tắt hiệu ứng loading page
        setTimeout(() => {
            $('.m-loading').hide();
        }, 1000);

        // Chạy intitEvents
        // me.intitEvents();


    }

    /**
     * Thực hiện đổi trang sau hoặc trang trước
     * author: Bakachan
     */
    btnOnClickChangePage() {
        var me = this;

        // Nhấn btn sau của trang để đến trang tiếp theo
        $('.m-paging-next').click(function(e) {
            // chuyển focus sang button số trang tương ứng:
            // xác định button của trang
            let currenButtonActive = $(this).siblings('.m-paging-number').children('.page-number-active');
            $(currenButtonActive).removeClass('page-number-active');
            // Lấy ra button trước đó
            let nextButton = $(currenButtonActive).next()
                // Gán class trang đã chọn 
            nextButton.addClass('page-number-active');
            // Đến trang sau
            me.ValueIndex++;
            // Nếu trang sau lớn hơn tổng trang thoát không nhận sự kiện
            if (me.ValueIndex > me.TotalPage) {
                // Trả về trang cuối của nút hiển thị
                let prevButton = $(currenButtonActive).last();
                prevButton.addClass('page-number-active');
                me.ValueIndex--;
                return
            }
            // Lấy trang hiện tại là value
            me.CurrentPageIndex = me.ValueIndex
            console.log(me.ValueIndex);
            // Nếu chuyển sang trang qua những mốc MaxPageIndexButton thì trả về trang đầu mốc đó
            if (me.ValueIndex % me.MaxPageIndexButton == 1) {
                let prevButton = $(currenButtonActive).first();
                prevButton.addClass('page-number-active');
            }
            me.loadData(me.ValueIndex);
        });

        // Nhấn btn trước của trang để đến trang trước đó
        $('.m-paging-prev').click(function(e) {
            // chuyển focus sang button số trang tương ứng:
            // xác định button của trang
            let currenButtonActive = $(this).siblings('.m-paging-number').children('.page-number-active');
            $(currenButtonActive).removeClass('page-number-active');

            // Lấy ra button trước đó
            let prevButton = $(currenButtonActive).prev()
                // Gán class trang đã chọn 
            prevButton.addClass('page-number-active');
            // Về trang trước
            me.ValueIndex--;
            // Nếu trang trước về xuống 0 => trả lại về trang đầu tiên và không nhận sự kiện
            if (me.ValueIndex <= 0) {
                me.ValueIndex++;
                let prevButton = $(currenButtonActive).first();
                prevButton.addClass('page-number-active');
                return
            }
            // Lấy trang hiện tại là value
            me.CurrentPageIndex = me.ValueIndex
            console.log(me.ValueIndex);
            // Nếu trở về trang qua những mốc MaxPageIndexButton thì trả về trang cuối mốc đó
            if (me.ValueIndex % me.MaxPageIndexButton == 0) {
                let prevButton = $(currenButtonActive).last();
                prevButton.addClass('page-number-active');
            }
            me.loadData(me.ValueIndex);

        });
    }


    /**
     * Thực hiện gán các sự kiện trong trang
     * author: bakachan
     */
    intitEvents() {

        var me = this;
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
        $('tbody').on('click', '.m-content-table-row-setting-text', this.btnUpdateData.bind(this));

        //Nhấn downicon để hiện thị thao tác
        $("tbody").on('click', '.m-content-table-row-icon', this.btnDownIconOnclick.bind(this));

        // Nhấn item để ẩn data item
        $("tbody").on('click', '.m-c-t-r-item', this.itemDownIconOnClick.bind(this));

        // Nhấn vào item xóa để hiện thị popup delete
        $("tbody").on('click', '.m-c-t-r-activate', this.dataEmployeeDelete.bind(this))

        // Nhấn vào btn xóa để xóa nhân viên
        $('tbody').on('click', '#k-d-f-delete', this.delete.bind(this));

        // me.btnOnClickChangePage();
        // Tìm kiếm nhân viên
        $('#txtSearch').on('blur', () => {
            me.loadData();
        })

        // Nhấn enter để hiện thị nhân viên tìm kiếm 
        me.findEmployeeByEnter();

        // Nhấn nút trước sau để đổi trang
        me.btnOnClickChangePage();
        // Chọn số bản ghi hiển thị trong 1 trang
        $('#cbxPageSize').change(function(e) {
            me.loadData(me.CurrentPageIndex);
        });
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
            async: false,

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
        var me = this;
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
            async: false,
            // async: true,
            success: function(e) {

                // Binding du lieu vao form
                // 1. Lấy toàn bộ các input sẽ biding dữ liệu -> có attribute [fieldName];
                let inputs = $("input[fieldName]");
                // 2. Duyệt từng input -> Lấy ra giá trị của attribute -> Để biết được sẽ map thông tin nào của đối tượng
                for (const input of inputs) {
                    let fieldName = input.getAttribute("fieldName");
                    let value = e[fieldName];
                    // console.log(me.dataDepartment(value));
                    // -----------------------
                    let items = $('.m-dialog-content-box div[mcombobox] .m-combobox-item');
                    let text = null;
                    // -------------------------
                    // Lấy value của ngày sinh
                    if (fieldName == 'DateOfBirth') {
                        value = CommonJS.formatYYYYMMDD(value);
                        // console.log(value);
                    }
                    for (const item of items) {
                        if ($(item).attr('value') == value) {
                            text = $(item).text();
                            break;
                        }
                    }
                    if (text) {
                        $(input).val(text);
                    } else {

                        if (value)
                            input.value = value;
                        else
                            input.value = null
                    }


                }
                // Lấy value của radio input và tích lựa chọn
                let radiofieldName = $('#m-employeeGender-txt').attr("fieldName");
                let radiovalue = e[radiofieldName];
                $(`input[value=${radiovalue}]`).prop('checked', true);

                // let comboboxs = $('#dlgPopup div[mcombobox]');
                // // Duyệt từng thằng combobox lấy ra value:
                // for (const combobox of comboboxs) {
                //     let value = $(combobox).attr('value');
                //     let fieldName = $(combobox).data('fieldName');
                //     if (fieldName) {
                //         e[fieldName] = value;
                //     }
                // }
                // debugger

                // }
                // console.log(e);
                // Lấy value của combobox và cho vào input

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

        // Ẩn Error của input mã nhân viên khi mở popup
        $("#m-employeeCode-txt").removeClass("m-input-select");
        $("#m-employeeCode-txt").next().hide();

        // Ẩn Error của input họ tên khi mở popup
        $("#m-employeeFullName-txt").removeClass("m-input-select");
        $("#m-employeeFullName-txt").next().hide();

        // Ẩn Error của input phòng ban khi mở popup
        $("#m-employeeDepartmentId-txt").removeClass("m-input-select");
        $("#m-employeeDepartmentId-txt").next().hide();
    }

    /**
     * Thực hiện click input ẩn Error
     * author: Bakachan
     */
    OnClickHideError() {
        // Click vào input mã nhân viên để ẩn lỗi
        $("#m-employeeCode-txt").click(() => {
            $("#m-employeeCode-txt").removeClass("m-input-select");
            $("#m-employeeCode-txt").next().fadeOut();
        });
        // Click vào input họ tên để ẩn lỗi
        $("#m-employeeFullName-txt").click(() => {
            $("#m-employeeFullName-txt").removeClass("m-input-select");
            $("#m-employeeFullName-txt").next().fadeOut();
        });
        // Click vào input phòng ban để ẩn lỗi
        $("#m-employeeDepartmentId-txt").click(() => {
            $("#m-employeeDepartmentId-txt").removeClass("m-input-select");
            $("#m-employeeDepartmentId-txt").next().fadeOut();
        });
    }

    /**
     * Thực hiện hiển thị lỗi thông báo khi input để trống
     * author: Bakachan
     */

    showInputError(e) {

        // Lấy mã nhân viên
        const idHTML = e.EmployeeCode;
        // Lấy họ tên
        const fullnameHTML = e.EmployeeName;
        // Lấy phòng ban
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
            return true;
        }
        return false
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
        // Duyệt các radio
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
        // Lấy mã nhân viên
        const idHTML = e.EmployeeCode;
        if (me.showInputError(e) == true)
            return

        // console.log(e);

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
                    // let status = res.status;
                    if (res.responseJSON.devMsg == "Ngày sinh không được lớn hơn ngày hiện tại.") {
                        // Thay đổi text của popup error là ngày sinh không hợp lệ
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Ngày sinh không được lớn hơn ngày hiện tại.</div>
                        `);
                    } else if (res.responseJSON.devMsg == "Mã khách hàng đã tồn tại trong hệ thống.") {
                        // Thay đổi text của popup error là mã nhân viên bị trùng
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > đã tồn tại trong hệ thống vui lòng kiểm tra lại.</div>
                        `);
                    } else {
                        // Thay đổi text của popup error là mã nhân viên không hợp lệ
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > không hợp lệ vui lòng kiểm tra lại.</div>
                                `);
                    }
                    console.log(res);

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
                async: false,
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
                    if (res.responseJSON.devMsg == "Ngày sinh không được lớn hơn ngày hiện tại.") {
                        // Thay đổi text của popup error là ngày sinh không hợp lệ
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Ngày sinh không được lớn hơn ngày hiện tại.</div>
                        `);
                    } else if (res.responseJSON.devMsg == "Mã khách hàng đã tồn tại trong hệ thống.") {
                        // Thay đổi text của popup error là mã nhân viên bị trùng
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > đã tồn tại trong hệ thống vui lòng kiểm tra lại.</div>
                        `);
                    } else {
                        // Thay đổi text của popup error là mã nhân viên không hợp lệ
                        $("div.kien-dialog-content-right").html(`<div class="k-d-c-r-text">Mã nhân viên < ${idHTML} > không hợp lệ vui lòng kiểm tra lại.</div>
                                `);
                    }
                    console.log(res);
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
            async: false,
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
            async: false,
            // async: true,
            success: function(e) {
                // debugger
                const idHTML = e.EmployeeCode;
                // Lấy mã nhân viên để hiển thị cần xóa
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

    /**
     * Thực hiện tìm kiếm nhân viên bởi nhấn nút enter
     * author: Bakachan
     */
    findEmployeeByEnter() {
        var me = this;
        $('#txtSearch').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                me.loadData();
            }
        });
    }

}