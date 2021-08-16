import { BufferGeometry, Box3, BufferAttribute, Sphere } from "three";
import * as createIndices from "quad-indices";
import * as vertices from "./lib/vertices";
import * as utils from "./lib/utils";

import { createLayout } from "./lib/layout-bmfont-text";

interface TextGeometryOptions {
    text: string;
    font: any;
    width: number;
    align: string;
    multipage: boolean;
}

export class TextGeometry extends BufferGeometry {
    private _opt: {};
    public layout: any;
    public visibleGlyphs: any;

    constructor(opt: TextGeometryOptions) {
        super();

        this._opt = opt;

        this.update(opt);
    }

    update(opt) {
        if (!opt.font) {
            throw new TypeError("must specify a { font } in options");
        }

        this.layout = createLayout(opt);

        // get vec2 texcoords
        const flipY = opt.flipY !== false;

        // the desired BMFont data
        const font = opt.font;

        // determine texture size from font file
        const texWidth = font.common.scaleW;
        const texHeight = font.common.scaleH;

        // get visible glyphs
        const glyphs = this.layout.glyphs.filter(function (glyph) {
            const bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        });

        // provide visible glyphs for convenience
        this.visibleGlyphs = glyphs;

        // get common vertex data
        const positions = vertices.positions(glyphs);
        const uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY);
        const indices = createIndices([], {
            clockwise: true,
            type: "uint16",
            count: glyphs.length,
        });

        // update vertex data
        this.setIndex(indices);
        this.addAttribute("position", new BufferAttribute(positions, 2));
        this.addAttribute("uv", new BufferAttribute(uvs, 2));

        // update multipage data
        if (!opt.multipage && "page" in this.attributes) {
            // disable multipage rendering
            this.removeAttribute("page");
        } else if (opt.multipage) {
            // enable multipage rendering
            const pages = vertices.pages(glyphs);
            this.addAttribute("page", new BufferAttribute(pages, 1));
        }
    }

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }

        const positions = this.getAttribute("position").array;
        const itemSize = this.getAttribute("position").itemSize;

        if (!positions || !itemSize || positions.length < 2) {
            this.boundingSphere.radius = 0;
            this.boundingSphere.center.set(0, 0, 0);
            return;
        }
        utils.computeSphere(positions, this.boundingSphere);
        if (isNaN(this.boundingSphere.radius)) {
            console.error(
                "BufferGeometry.computeBoundingSphere(): " +
                    "Computed radius is NaN. The " +
                    '"position" attribute is likely to have NaN values.'
            );
        }
    }

    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }

        const bbox = this.boundingBox;
        const positions = this.getAttribute("position").array;
        const itemSize = this.getAttribute("position").itemSize;

        if (!positions || !itemSize || positions.length < 2) {
            bbox.makeEmpty();
            return;
        }
        utils.computeBox(positions, bbox);
    }
}
