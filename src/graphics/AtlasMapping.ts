import AtlasMappingFrame from "./AtlasMappingFrame";

class AtlasMapping {
    private image: string;
    private width: number;
    private height: number;
    private scale: number;
    private frames: Map<string, AtlasMappingFrame> = new Map<string, AtlasMappingFrame>();

    constructor(image: string, width: number, height: number, scale: number) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    public addFrame(frame: AtlasMappingFrame) {
        this.frames.set(frame.getId(), frame);
    }

    public getFrame(id: string): AtlasMappingFrame {
        return this.frames.get(id);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }
}

export default AtlasMapping;
