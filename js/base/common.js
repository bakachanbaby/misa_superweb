class CommonJS {

    /**
     * Định dạng hiện thị thông tin ngày là (dd//mm//yyyy)
     * @param {Date} date
     * Author: BAKACHAN
     *  */

    static formatDate(date) {
        if (date) {
            const dateOfBirth = new Date(date);
            let day = dateOfBirth.getDate();
            day = (day < 10 ? `0${day}` : day);
            let month = dateOfBirth.getMonth() + 1;
            month = (month < 10 ? `0${month}` : month);
            let year = dateOfBirth.getFullYear();
            return `${day}/${month}/${year}`;
        } else
            return "";
    }

    /**
     * Định dạng hiện thị mức lương là xxx.xxx.xxxđ
     * Author: Bakachan
     */
    static formatSalary(e) {
        e = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(e);
        return e;
    }
}