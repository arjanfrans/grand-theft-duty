import { ComponentInterface } from "../components/ComponentInterface";

export class Entity {
    public readonly components: ComponentInterface[];

    constructor(components: ComponentInterface[]) {
        this.components = components;
    }

    public getComponent<T extends ComponentInterface>(type: string): T {
        const component = this.components.find((v) => v.type === type) as
            | T
            | undefined;

        if (!component) {
            throw new Error(`Component of type ${type} not found!`);
        }

        return component;
    }

    public hasComponent(type: string): boolean {
        const component = this.components.find((v) => v.type === type);

        return component !== undefined;
    }

    public hasComponents(types: string[]): boolean {
        return types.every((type) => this.getComponentTypes().includes(type));
    }

    public getComponentTypes(): string[] {
        return this.components.map((v) => v.type);
    }
}
