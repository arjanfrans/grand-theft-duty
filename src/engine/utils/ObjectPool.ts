export class ObjectPool<T> {
    private readonly factoryFunction: () => T;
    private totalInstances: number = 0;
    private readonly allocationLimit: number;
    private readonly allocationNumber: number;
    private availableInstances: T[];

    /**
     * @param factoryFunction Function that creates the object to pool.
     * @param firstAllocationNumber Initial amount of objects to allocate.
     * @param allocationNumber Number to increase the pool by when it is full.
     * @param allocationLimit Size limit of the pool.
     */
    constructor(
        factoryFunction: () => T,
        firstAllocationNumber: number,
        allocationNumber: number,
        allocationLimit: number
    ) {
        this.factoryFunction = factoryFunction;
        this.allocationLimit = allocationLimit;
        this.allocationNumber = allocationNumber;
        this.availableInstances = [];
        this.allocate(firstAllocationNumber);
    }

    get size() {
        return this.totalInstances;
    }

    /**
     * Instantiate a given number of elements and add them to the collection of available instances
     * @param {number} number Number of elements to allocate
     */
    public allocate(number: number): ObjectPool<T> {
        if (this.totalInstances + number < this.allocationLimit) {
            this.totalInstances += number;

            for (let i = 0; i < number; i++) {
                this.availableInstances.push(this.factoryFunction());
            }
        } else {
            throw new Error("ObjectPool allocation limit reached");
        }

        return this;
    }

    /**
     * Retrieve an element for the collection of available instances, (re)initialize and return it.
     */
    get(): T {
        // check if we still have enough available instances, instantiate new ones
        if (this.availableInstances.length < 1) {
            this.allocate(this.allocationNumber);
        }

        return this.availableInstances.pop() as T;
    }

    /**
     * Add a given element to the pool.
     * @param {Object} object Element to add to the pool
     */
    public free(object: T): ObjectPool<T> {
        if (this.availableInstances.indexOf(object) === -1) {
            this.availableInstances.push(object);
        }

        return this;
    }

    /**
     * Clear all references.
     */
    public clear(): ObjectPool<T> {
        while (this.availableInstances.length) {
            this.availableInstances.pop();
        }

        this.totalInstances = 0;

        return this;
    }
}
