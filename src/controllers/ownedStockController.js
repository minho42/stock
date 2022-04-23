const OwnedStock = require("../models/ownedStockModel");
// const User = require("../models/userModel");

const createOrUpdateOwnedStock = async (req, res) => {
  console.log(req.body);
  try {
    const filter = { owner: req.user._id };
    const update = {
      symbols: req.body.symbols,
    };
    const r = await OwnedStock.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    res.status(200).send(r);
  } catch (error) {
    res.status(400).send();
  }
};

// const createOwnedStock = async (req, res) => {
//   const ownedStock = new OwnedStock({
//     ...req.body,
//     owner: req.user._id,
//   });
//   try {
//     await ownedStock.save();
//     res.status(201).send(ownedStock);
//   } catch (error) {
//     res.status(400).send();
//   }
// };

const getOwnedStocks = async (req, res) => {
  try {
    const ownedStocks = await OwnedStock.find({ owner: req.user._id });
    res.send(ownedStocks);
  } catch (error) {
    res.status(500).send();
  }
};

const deleteOwnedStock = async (req, res) => {
  try {
    const ownedStock = await OwnedStock.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!ownedStock) {
      res.status(404).send();
    }

    res.send(ownedStock);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createOrUpdateOwnedStock,
  getOwnedStocks,
  deleteOwnedStock,
};
