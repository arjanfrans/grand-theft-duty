import MenuItem from './MenuItem';

class MenuInputItem extends MenuItem {
    constructor (name, label, defaultValue, action) {
        super(name, label + ': ' + defaultValue, action);

        this.label = label;
        this.defaultValue = defaultValue;
        this.action = action;
        this.isEditing = false;
        this._value = defaultValue;
        this.editable = true;
    }

    set value (value) {
        this._value = value;
        this.text = this.label + ': ' + value;
    }

    get value () {
        return this._value;
    }
}

export default MenuInputItem;
