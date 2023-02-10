import { Request, Response } from 'express'
import {OwnedStock} from "../models/ownedStockModel"
// import {User} from "../models/userModel"

export const createOrUpdateOwnedStock = async (req:Request, res:Response) => {
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

// export const createOwnedStock = async (req:Request, res:Response) => {
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

export const getOwnedStocks = async (req:Request, res:Response) => {
  try {
    const ownedStocks = await OwnedStock.find({ owner: req.user._id });
    res.send(ownedStocks);
  } catch (error) {
    res.status(500).send();
  }
};

export const deleteOwnedStock = async (req:Request, res:Response) => {
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

