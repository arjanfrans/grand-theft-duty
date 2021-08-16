import AssetManager from "../AssetManager";
import { Mesh, MeshBasicMaterial } from "three";
import { TextGeometry } from "../three-bmfont-text/TextGeometry";
import { View } from "./View";

interface TextViewOptions {
    width?: number;
    align?: string;
    color?: number;
    font?: string;
}

export class TextView extends View {
    private _text: string;
    private font: any;
    public width: number;
    public align: string;
    private readonly _color: number;
    private geometry: TextGeometry;
    private material?: MeshBasicMaterial = undefined;

    constructor(text, options: TextViewOptions = {}) {
        super();

        const fontName = options.font || "keep_calm";

        this._text = text;
        this.font = AssetManager.getFont(fontName);
        this.width = options.width || 100;
        this.align = options.align || "left";
        this._color = options.color || 0xff0000;

        this.geometry = new TextGeometry({
            text: this._text,
            width: this.width,
            align: this.align,
            font: this.font.mapping,
            multipage: true,
        });
    }

    init() {
        const material = new MeshBasicMaterial({
            map: this.font.textures[0],
            transparent: true,
            color: this._color,
        });

        const mesh = new Mesh(this.geometry, material);

        mesh.rotation.y = 180 * (Math.PI / 180);
        mesh.rotation.z = 180 * (Math.PI / 180);

        this.material = material;
        this.mesh = mesh;

        super.init();
    }

    get color() {
        return this._color;
    }

    set color(color) {
        (this.material as MeshBasicMaterial).color.setHex(color);
    }

    get text() {
        return this._text;
    }

    get height() {
        return this.geometry.layout.height;
    }

    _updateGeometry() {
        this.geometry.update({
            text: this._text,
            width: this.width,
            align: this.align,
            font: this.font.mapping,
        });

        console.log(this.geometry.attributes);
        // this.geometry.uvsNeedUpdate = true;
    }

    set text(text) {
        text = text.toString();

        // Check if text is not the same
        if (text !== this._text) {
            this._text = text;
            this._updateGeometry();
        }
    }
}
