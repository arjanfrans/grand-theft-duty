import { AbstractState } from "../AbstractState";

export class MenuState extends AbstractState {
    public menus: Map<any, any>;
    private _currentMenu: any;
    public currentMenuName: any;
    public options: Map<string, string>;
    public gamePlaying: boolean;
    public currentOptionsEdit: any;

    constructor(engine) {
        super("menu", engine);

        this.menus = new Map();
        this._currentMenu = null;
        this.currentMenuName = null;
        this.options = new Map([["name", "Unknown Soldier"]]);
        this.gamePlaying = false;
        this.currentOptionsEdit = null;
    }

    addMenu(name, menu) {
        this.menus.set(name, menu);
    }

    changeOption(optionName, value) {
        this.options.set(optionName, value);
    }

    set currentMenu(name) {
        this._currentMenu = this.menus.get(name);

        if (!this._currentMenu) {
            throw new Error('Menu "' + name + '" does not exist');
        }

        this.currentMenuName = name;
    }

    get currentMenu() {
        return this._currentMenu;
    }

    init() {
        super.init();
    }
}
