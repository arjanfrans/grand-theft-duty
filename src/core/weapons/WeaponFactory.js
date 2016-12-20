import Gun from './Gun';

export default {
    mp44: function () {
        const mp44 = new Gun('mp44', {
            maxAmmo: 120,
            maxMagazine: 30
        });

        return mp44;
    },
    thompson: function () {
        const thompson = new Gun('thompson', {
            maxAmmo: 90,
            maxMagazine: 25,
            fireRate: 90
        });

        return thompson;
    }
};
