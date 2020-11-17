module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('treasures', [{
                id: 100,
                latitude: 1.33125924,
                longitude: 103.8980486,
                Name: "T1"
            },
            {
                id: 101,
                latitude: 1.32255754,
                longitude: 103.8943086,
                Name: "T2"
            },
            {
                id: 102,
                latitude: 1.3166356,
                longitude: 103.8891225,
                Name: "T3"
            },
            {
                id: 103,
                latitude: 1.31286055,
                longitude: 103.8545565,
                Name: "T4"
            },
            {
                id: 104,
                latitude: 1.34439896,
                longitude: 103.8765938,
                Name: "T5"
            },
            {
                id: 105,
                latitude: 1.33616189,
                longitude: 103.8770866,
                Name: "T6"
            },
            {
                id: 106,
                latitude: 1.32552844,
                longitude: 103.8691014,
                Name: "T7"
            },
            {
                id: 107,
                latitude: 1.32303589,
                longitude: 103.8774815,
                Name: "T8"
            },
            {
                id: 108,
                latitude: 1.33465304,
                longitude: 103.870449,
                Name: "T9"
            },
            {
                id: 109,
                latitude: 1.32606138,
                longitude: 103.8793007,
                Name: "T10"
            },
            {
                id: 110,
                latitude: 1.25886946,
                longitude: 103.898879,
                Name: "T11"
            },
            {
                id: 111,
                latitude: 1.26973345,
                longitude: 103.8810448,
                Name: "T12"
            },
            {
                id: 112,
                latitude: 1.32914713,
                longitude: 103.8334781,
                Name: "T13"
            },
            {
                id: 113,
                latitude: 1.32960595,
                longitude: 103.8807937,
                Name: "T14"
            },
            {
                id: 114,
                latitude: 1.33700251,
                longitude: 103.8492249,
                Name: "T15"
            },
            {
                id: 115,
                latitude: 1.27845714,
                longitude: 103.8571762,
                Name: "T16"
            },
            {
                id: 116,
                latitude: 1.36019784,
                longitude: 103.8563582,
                Name: "T17"
            },
            {
                id: 117,
                latitude: 1.31551921,
                longitude: 103.8632839,
                Name: "T18"
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('treasures', null, {});
    }
};