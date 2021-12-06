class Kcombobox {
    constructor() {
        this.buildComboboxHTML();
    }

    /**
     * Thực hiện build combobox cho html
     * author: Bakachan
     */
    buildComboboxHTML() {
        // Duyệt các thẻ combobox
        let comboboxs = $('combobox');
        for (const combobox of comboboxs) {
            // api của combobox
            const api = $(combobox).attr('api');
            // text của combobox
            const propertyDisplay = $(combobox).attr('proppertyDisplay');
            // value của combobox
            const propertyValue = $(combobox).attr('propertyValue');
            // field của combobox
            const fieldName = $(combobox).attr('fieldName');
            // id của combobox
            const id = $(combobox).attr('id')
                // Build combobox
            let comboboxHTML = $(`<div mcombobox id="${id||''}" class="mcombobox" fieldName = "${fieldName}">
                                <input type="text" fieldName = "${fieldName}"  class="m-combobox m-combobox-input">
                                <button tabindex="-1" class="m-combobox-button">
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="m-combobox-data">
                                </div>
                            </div>`);
            comboboxHTML.data('fieldName', )

        }
    }
}