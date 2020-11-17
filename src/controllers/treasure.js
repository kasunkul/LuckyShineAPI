const db = require("../../models");

async function findTreasureBoxesGivenKM(latitude, longitude, distance) {
    const query = `SELECT 
    *
FROM
    (SELECT 
        name,
            id,
            ROUND((6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${longitude})) + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)))), 2) AS distance
    FROM
        treasures) treasure_distance
WHERE
    treasure_distance.distance <= ${distance}
ORDER BY treasure_distance.distance ASC   
    `;

    const data = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });

    return data;
}

async function findTreasureBoxesGivenKMGivenPrize(
    latitude,
    longitude,
    distance,
    prize
) {
    const query = `SELECT 
    treasure_distance.*, MIN(money_values.amt) AS amt
FROM
    (SELECT 
        name,
            id,
            ROUND((6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${longitude})) + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)))), 2) AS distance
    FROM
        treasures) treasure_distance
        LEFT JOIN
    money_values ON money_values.treasure_id = treasure_distance.id
WHERE
    treasure_distance.distance <= ${distance}
        AND money_values.amt >= ${prize}
GROUP BY treasure_distance.id
ORDER BY treasure_distance.distance ASC`;

    const data = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });

    return data;
}

async function findTreasureBoxes(req, res) {
    try {
        const { latitude, longitude, distance, prize } = req.body;
        let data = [];

        console.log(prize);

        if (Number.isInteger(distance)) {
            console.log(distance);
            if (distance != 1 && distance != 10) {
                return res.send({
                    status: 0,
                    message: "Distance should be 1 KM or 10 KM",
                    data: {},
                });
            }
        } else {
            return res.send({
                status: 0,
                message: "Distance should be an Integer",
                data: {},
            });
        }


        if (!prize) {
            data = await findTreasureBoxesGivenKM(latitude, longitude, distance);
        } else {
            if (Number.isInteger(prize)) {
                console.log(prize);
                if (!(prize >= 10 && prize <= 30)) {
                    return res.send({
                        status: 0,
                        message: "Prize should be between $10 KM or $30",
                        data: {},
                    });
                }
            } else {
                return res.send({
                    status: 0,
                    message: "Prize should be an Integer",
                    data: {},
                });
            }

            data = await findTreasureBoxesGivenKMGivenPrize(
                latitude,
                longitude,
                distance,
                prize
            );
        }

        if (data.length == 0) {
            return res.send({
                status: 1,
                message: "Ooops sorry.! Treasures counldnt be found near you.",
                data: data,
            });
        }

        return res.send({
            status: 1,
            message: "Success",
            data: data,
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

module.exports = {
    findTreasureBoxes,
};