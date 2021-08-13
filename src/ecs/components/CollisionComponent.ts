export class CollisionComponent {
    public static TYPE = 'CollisionComponent';

    public isColliding: boolean;

    constructor(isColliding: boolean = false) {
        this.isColliding = isColliding;
    }

    get type(): string
    {
        return CollisionComponent.TYPE;
    }
}
