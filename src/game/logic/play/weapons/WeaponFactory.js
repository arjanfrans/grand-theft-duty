import Gun from './Gun';

let WeaponFactory = {
    mp44: function () {
        // TODO give it different properties
        let mp44 = new Gun('mp44', {
            maxAmmo: 120,
            maxMagazine: 30
        });

        return mp44;
    },
    thompson: function () {
        // TODO give it different properties
        let thompson = new Gun('thompson', {
            maxAmmo: 90,
            maxMagazine: 25,
            fireRate: 90
        });

        return thompson;
    }
};

export default WeaponFactory;
