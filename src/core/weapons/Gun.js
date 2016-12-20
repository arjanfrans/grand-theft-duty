class Gun {
    constructor (name, options = {}) {
        this.name = name;
        this.maxMagazine = options.maxMagazine || 10;
        this.magazine = options.magazine || this.maxMagazine;

        this.maxAmmo = options.maxAmmo || 10;
        this.ammo = (options.ammo || this.maxAmmo) - this.magazine;

        this.fireRate = options.fireRate || 150;
        this.damage = options.damage || 10;
        this.reloadTime = options.reloadTime || 500;

        this._reloadingTime = 0;
        this._firedTime = 0;
        this._canFire = true;

        this.isReloading = false;
        this.fired = false;
    }

    fire () {
        if (!this.isReloading && this._canFire && this.magazine > 0) {
            this.fired = true;
            this._canFire = false;
            this.magazine -= 1;

            return true;
        } else {
            return false;
        }
    }

    reload () {
        if (!this.isReloading) {
            this.isReloading = true;

            let refill = this.maxMagazine - this.magazine;

            const newAmmo = this.ammo - refill;

            if (newAmmo < 0) {
                refill = this.ammo;

                this.ammo = 0;
            } else {
                this.ammo -= refill;
            }

            this.magazine += refill;
        }
    }

    get magazines () {
        return Math.floor(this.ammo / this.maxMagazine);
    }

    update (delta) {
        if (this._fired) {
            this._fired = false;
        }

        if (this.isReloading) {
            this._reloadingTime += delta;

            if (this._reloadingTime > this.reloadTime) {
                this._reloadingTime = 0;
                this.isReloading = false;
            }
        } else if (!this._canFire) {
            this._firedTime += delta;

            if (this._firedTime > this.fireRate) {
                this._firedTime = 0;
                this._canFire = true;
            }
        }
    }
}

export default Gun;
