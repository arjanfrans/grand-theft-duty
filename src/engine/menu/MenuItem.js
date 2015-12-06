class MenuItem {
    constructor (name, text, onAction = null) {
        this.name = name;
        this.text = text;
        this.onAction = onAction;
        this.editable = false;
    }

    action () {
        if (this.onAction) {
            this.onAction();
        }
    }
}

export default MenuItem;
