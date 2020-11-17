const { assert } = require('chai')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const db = require("../models");

describe('/auth/login POST', () => {
    it('should successfully log a user in', async() => {

        let response = await axios.post('http://localhost:5000/auth/login', {
            email: 'u1@luckyshine.xyz',
            password: 'luckyshine001'
        });

        let response_status = response.status;
        let response_data = response.data;
        let token = response_data.access_token;

        //verify the reposonse status is correct
        assert.strictEqual(response_status, 200, 'status code incorrect')


        //Verify the access_token
        const isVerified = jwt.verify(token, "luck_shine");
        assert.isNotNull(isVerified, 'token incorrect')

        //Validate
        //Check whether user exists by email
        const user = await db.user.findOne({
            where: {
                id: isVerified.id
            },
        });
        assert.strictEqual(response_data.user.data.email, user.email, 'token account incorrect')

    })
})