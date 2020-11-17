const bcrypt = require("bcrypt");
module.exports = {
    up: (queryInterface, Sequelize) => {

        let users = [{
            id: 3000,
            name: 'U1',
            age: 21,
            password: 'luckyshine001',
            email: 'u1@luckyshine.xyz'
        }, {
            id: 3001,
            name: 'U2',
            age: 51,
            password: 'luckyshine002',
            email: 'u2@luckyshine.xyz'
        }, {
            id: 3002,
            name: 'U3',
            age: 31,
            password: 'luckyshine003',
            email: 'u1@luckyshine.xyz'
        }, {
            id: 3003,
            name: 'U4',
            age: 18,
            password: 'luckyshine004',
            email: 'u2@luckyshine.xyz'
        }, {
            id: 3004,
            name: 'U5',
            age: 21,
            password: 'luckyshine005',
            email: 'u1@luckyshine.xyz'
        }, {
            id: 3005,
            name: 'U6',
            age: 35,
            password: 'luckyshine006',
            email: 'u2@luckyshine.xyz'
        }];

        /***Encrypt user passwords */
        users.forEach(user => {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
        });

        return queryInterface.bulkInsert('users', users);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};