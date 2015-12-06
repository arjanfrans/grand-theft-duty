import MenuItem from './MenuItem';

class MenuInputItem extends MenuItem {
    constructor (name, label, defaultValue, onAction) {
        super(name, label + ': ' + defaultValue, onAction);

        this.label = label;
        this.defaultValue = defaultValue;
        this.isEditing = false;
        this._value = defaultValue;
        this.editable = true;
    }

    action () {
        this.isEditing = !this.isEditing;

        if (!this.isEditing && this.onAction) {
            this.onAction(this._value);
        }
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
