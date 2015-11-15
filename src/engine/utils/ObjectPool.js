let debug = require('debug')('game:engine/object-pool');

// https://github.com/kchapelier/migl-pool/blob/master/src/pool.js
class ObjectPool {
    /**
     * @constructor
     * @param {function} factoryFunction Function that creates the object to pool.
     * @param {number} firstAllocationNumber Initial amount of objects to allocate.
     * @param {number} allocationNumber Number to increase the pool by when it is full.
     */
    constructor (factoryFunction, firstAllocationNumber, allocationNumber, allocationLimit = 100) {
        this.factoryFunction = factoryFunction;
        this.totalInstances = 0;
        this.allocationLimit = allocationLimit;

        this.allocationNumber = allocationNumber;

        this.availableInstances = [];

        this.allocate(firstAllocationNumber);
    }

    get size () {
        return this.totalInstances;
    }

    /**
     * Instantiate a given number of elements and add them to the collection of available instances
     * @param {number} number Number of elements to allocate
     * @private
     * @returns {Pool} Own instance for fluent interface
     */
    allocate (number) {
        if (this.totalInstances + number < this.allocationLimit) {
            this.totalInstances += number;

            for (let i = 0; i < number; i++) {
                this.availableInstances.push(this.factoryFunction());
            }
        } else {
            debug('allocation limit reached');
        }

        return this;
    }

    /**
     * Retrieve an element for the collection of available instances, (re)initialize and return it.
     * @returns {function} initializeFunction Function used to initialize a new instance.
     */
    get () {
        // check if we still have enough available instances, instantiate new ones
        if (this.availableInstances.length < 1) {
            this.allocate(this.allocationNumber);
        }

        let object = this.availableInstances.pop();

        return object;
    }

    /**
     * Add a given element to the pool.
     * @param {Object} object Element to add to the pool
     * @returns {Pool} Own instance for fluent interface
     */
    free (object) {
        if (this.availableInstances.indexOf(object) === -1) {
            this.availableInstances.push(object);
        }

        return this;
    }

    /**
     * Clear all references.
     * @returns {Pool} Own instance for fluent interface
     */
    clear () {
        while (this.availableInstances.length) {
            this.availableInstances.pop();
        }

        this.totalInstances = 0;

        return this;
    }
}

export default ObjectPool;
