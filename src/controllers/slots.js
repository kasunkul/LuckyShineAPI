const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/auth");
const db = require("../../models");

// const { Op } = db.Sequelize;

async function getFreeSlotIds(type, shopId) {
  try {
    let q;
    if (type === "processing") {
      q = `SELECT uniqueId FROM lavup_db.slots WHERE uniqueId NOT IN (SELECT 
           laundry_order_items.slotId FROM lavup_db.laundry_order_items INNER JOIN
           slots ON laundry_order_items.slotId = slots.uniqueId) and slots.type = 'lab'`;
    } else {
      q = `SELECT *FROM lavup_db.slots WHERE uniqueId NOT IN (SELECT slotId FROM lavup_db.laundry_order_items INNER JOIN
            slots ON laundry_order_items.slotId = slots.uniqueId WHERE slots.shopId = ${shopId}) AND shopId = ${shopId}`;
    }
    let data = await db.sequelize.query(q, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    data = data
      .map((e) => Number(e.uniqueId.substring(1)))
      .reduce((r, n) => {
        const lastSubArray = r[r.length - 1];

        if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
          r.push([]);
        }

        r[r.length - 1].push(n);

        return r;
      }, []);
    return data;
  } catch (error) {
    throw new Error();
  }
}

async function assignLabSlots(itm, type, userName, shopId) {
    
  const items = itm;
  let letter;
  if (type === "processing") {
    letter = "L";
  } else {
    letter = "S";
  }

  try {
    // GET FREE LAB SLOTS
    const ids = await getFreeSlotIds(type, shopId);

    // GET HANGABLE ITEMS COUNT
    const hangableItemsCount = items
      .filter((e) => e["laundry_item.isHangable"])
      .length

     
    let equalIdx = ids.findIndex((e) => e.length === hangableItemsCount + 2);

    if (equalIdx < 0) {
      // NOW CHECK SLOT LENGTH > (ITEMS COUNT +2)
      equalIdx = ids.findIndex((e) => e.length > hangableItemsCount + 2);
    }

    if (hangableItemsCount && equalIdx >= 0) {

      let slotId = ids[equalIdx][1];

      for (let index = 0; index < items.length; index++) {
        if (items[index]["laundry_item.isHangable"]) {
          items[index].slotId = `${letter}${slotId}`;
          slotId += 1;
        } else {
          items[index].slotId = `BOX ${userName}`;
        }
      }
    }
    if (!hangableItemsCount) {
      // ALL THE ITEMS ARE FOLDABLE
      for (let index = 0; index < items.length; index++) {
        items[index].slotId = `BOX ${userName}`;
      }
    }

    if (hangableItemsCount && equalIdx < 0) {
    console.log('this place ***************************')

      // SYSTEM CAN'T HANDLE
    }
    return items;
  } catch (error) {
    throw new Error();
  }
}

router.get("/:id", checkAuth,async (req, res) => {

  try {
    // const user = 
    const user = await db.user.findOne({
      where:{
        id:req.user.id
      },
      raw:true
    })
    
    //laundry_order_items
    const meta = await db.laundry_order.findOne({
      attributes: [
        "id",
        "customerId",
        "notes",
        "orderType",
        "orderPayed",
        "createdAt",
        "assignDate",
        "totalItems",
        "totalOrderAmount",
        "status",
        "shopId",
        "isDeliveryOrder",
      ],
      where: {
        id: req.params.id,
      },
      raw: true,
    });

    let items = await db.laundry_order_item.findAll({
      raw: true,
      attributes: ["id", "itemId", "slotId", "needIron"],
      where: {
        laundryOrderId: req.params.id,
      },
      include: [
        {
          model: db.laundry_item,
          attributes: ["itemName", "isHangable"],
        },
      ],
    });

    

    if (meta.status === "processing" || meta.status === "accepted by shop") {
       
      // ASSIGN SLOTS IN LAB
      items = await assignLabSlots(items, meta.status, user.firstName.charAt(0).toUpperCase(), meta.shopId);
    }

    // console.log('items',items)

    return res.status(200).json({ meta, items });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
