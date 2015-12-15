import { expect } from 'chai';
import ObjectPool from '../src/engine/ObjectPool';

describe('ObjectPool', function () {
    before(() => {
        let factoryFunction = function () {
            return { test: true };
        };

        this.pool = new ObjectPool(factoryFunction, 3, 1, 5);
    });

    it('initial totalInstances is correct', () => {
        expect(this.pool.size).to.equal(3);
    });

    it('initial instances are available', () => {
        expect(this.pool.availableInstances.length).to.equal(3);
    });

    context('use objects from the pool', () => {
        before(() => {
            this.usedObject1 = this.pool.get();
            this.usedObject2 = this.pool.get();
        });

        it('one less instance is available', () => {
            expect(this.pool.availableInstances.length).to.equal(1);
        });

        it('used objects are correct', () => {
            expect(this.usedObject1).to.have.property('test');
            expect(this.usedObject2).to.have.property('test');
            expect(this.usedObject1.test).to.equal(true);
            expect(this.usedObject2.test).to.equal(true);
        })

        context('free one used object', () => {
            before(() => {
                this.pool.free(this.usedObject1);
            });

            it('all instances are available again', () => {
                expect(this.pool.availableInstances.length).to.equal(2);
            });
        });

        context('clear the object pool', () => {
            before(() => {
                this.pool.clear();
            });

            it('pool availability is reset', () => {
                expect(this.pool.availableInstances.length).to.equal(0);
                expect(this.pool.totalInstances).to.equal(0);
            });
        });

        context('allocate new instances', () => {
            before(() => {
                this.pool.allocate(4);
            });

            it('instances are available', () => {
                expect(this.pool.availableInstances.length).to.equal(4);
            })
        });

        context('allocate too many instances', () => {
            before(() => {
                try {
                    this.pool.allocate(5);
                } catch (err) {
                    this.error = err;
                }
            });

            it('error is thrown', () => {
                expect(this.error.message).to.equal('ObjectPool allocation limit reached');
            });
        });
    });
});
