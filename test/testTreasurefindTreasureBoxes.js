const { assert } = require("chai");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../models");
let api_token = "";

describe("treasure/findTreasureBoxes POST", () => {
    before(async() => {
        let response = await axios.post('http://localhost:5000/auth/login', {
            email: 'u1@luckyshine.xyz',
            password: 'luckyshine001'
        });
        let response_data = response.data;
        api_token = response_data.access_token;
    });

    it("should successfully get a list of treasures [ Only Distance ] ", async() => {
        let response = await axios.post(
            "http://localhost:5000/treasure/findTreasureBoxes", {
                longitude: 103.8756757,
                latitude: 1.3273451,
                distance: 1
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${api_token}`,
                },
            }
        );

        let response_status = response.status;
        let response_data = response.data;

        //verify the reposonse status is correct
        assert.strictEqual(response_status, 200, "status code incorrect");

        //verify the reposonse data is correct
        assert.isArray(response_data.data, 'Data format is incorrect');

        //verify the reposonse message/status is correct
        assert.strictEqual(response_data.status, 1, 'message/status is incorrect');
    });

    it("should successfully get a list of treasures [ Only Distance and Prize Filter ] ", async() => {
        let response = await axios.post(
            "http://localhost:5000/treasure/findTreasureBoxes", {
                longitude: 103.8756757,
                latitude: 1.3273451,
                distance: 1,
                prize: 21,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${api_token}`,
                },
            }
        );

        let response_status = response.status;
        let response_data = response.data;

        //verify the reposonse status is correct
        assert.strictEqual(response_status, 200, "status code incorrect");

        //verify the reposonse data is correct
        assert.isArray(response_data.data, 'Data format is incorrect');

        //verify the reposonse message/status is correct
        assert.strictEqual(response_data.status, 1, 'message/status is incorrect');
    });
});