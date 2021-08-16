import { Entity } from "./Entity";

export class EntityManager {
    public readonly entities: Set<Entity> = new Set();
    public readonly entityComponents: Map<string, Set<Entity>> = new Map<
        string,
        Set<Entity>
    >();

    public addEntity(entity: Entity): void {
        if (!this.entities.has(entity)) {
            this.entities.add(entity);

            const types = entity.getComponentTypes();

            for (const type of types) {
                const entitiesWithComponentTypes =
                    this.entityComponents.get(type);

                if (!entitiesWithComponentTypes) {
                    this.entityComponents.set(type, new Set([entity]));
                } else {
                    entitiesWithComponentTypes.add(entity);

                    this.entityComponents.set(type, entitiesWithComponentTypes);
                }
            }
        }
    }

    public getEntitiesWithTypes(componentTypes: string[]): Entity[] {
        const entities = new Set<Entity>();

        for (const type of componentTypes) {
            const entitiesWithType = this.entityComponents.get(type);

            if (entitiesWithType) {
                for (const entity of entitiesWithType.values()) {
                    if (entity.hasComponents(componentTypes)) {
                        entities.add(entity);
                    }
                }
            }
        }

        return entities ? Array.from(entities.values()) : [];
    }

    public removeEntity(entity: Entity): void {
        this.entities.delete(entity);

        for (const type of entity.getComponentTypes()) {
            const entities = this.entityComponents.get(type);

            entities?.delete(entity);
        }
    }
}
