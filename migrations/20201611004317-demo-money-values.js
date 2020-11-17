module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('money_values', [{
                treasure_id: 100,
                amt: 15
            },
            {
                treasure_id: 101,
                amt: 10
            },
            {
                treasure_id: 102,
                amt: 15
            },
            {
                treasure_id: 103,
                amt: 15
            },
            {
                treasure_id: 104,
                amt: 10
            },
            {
                treasure_id: 105,
                amt: 15
            },
            {
                treasure_id: 106,
                amt: 15
            },
            {
                treasure_id: 107,
                amt: 10
            },
            {
                treasure_id: 108,
                amt: 15
            },
            {
                treasure_id: 109,
                amt: 15
            },
            {
                treasure_id: 110,
                amt: 10
            },
            {
                treasure_id: 111,
                amt: 15
            },
            {
                treasure_id: 112,
                amt: 15
            },
            {
                treasure_id: 113,
                amt: 10
            },
            {
                treasure_id: 114,
                amt: 15
            },
            {
                treasure_id: 115,
                amt: 15
            },
            {
                treasure_id: 116,
                amt: 10
            },
            {
                treasure_id: 117,
                amt: 15
            },
            {
                treasure_id: 100,
                amt: 20
            },
            {
                treasure_id: 101,
                amt: 25
            },
            {
                treasure_id: 102,
                amt: 20
            },
            {
                treasure_id: 103,
                amt: 25
            },
            {
                treasure_id: 107,
                amt: 30
            },
            {
                treasure_id: 108,
                amt: 30
            },
            {
                treasure_id: 109,
                amt: 30
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('money_values', null, {});
    }
};