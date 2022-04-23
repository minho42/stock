const Journal = require("../models/journalModel");
const User = require("../models/userModel");

const createJournal = async (req, res) => {
  console.log(req.body);
  const journal = new Journal({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await journal.save();
    res.status(201).send(journal);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ owner: req.user._id });

    const newJournals = journals.map(async (journal) => {
      const owner = await User.findById({ _id: journal.owner });
      const ownerName = owner.name ?? owner.email;
      return { ...journal._doc, ownerName };
    });

    res.send(await Promise.all(newJournals));
  } catch (error) {
    res.status(500).send();
  }
};

const getJournalsForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const journals = await Journal.find({ owner: userId });
    // await req.user.populate('journals').execPopulate()
    // const journals = req.user.journals

    const newJournals = journals.map(async (journal) => {
      const owner = await User.findById({ _id: journal.owner });
      const ownerName = owner.name ?? owner.email;
      return { ...journal._doc, ownerName };
    });

    res.send(await Promise.all(newJournals));
  } catch (error) {
    res.status(500).send();
  }
};

const getJournal = async (req, res) => {
  const _id = req.params.id;

  try {
    const journal = await Journal.findOne({
      _id,
      owner: req.user._id,
    });

    if (!journal) {
      return res.status(404).send();
    }
    res.send(journal);
  } catch (error) {
    res.status(500).send();
  }
};
const updateJournal = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["isPublic", "action", "symbol", "amount", "price", "units", "date", "content"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!journal) {
      return res.status(404).send();
    }

    updates.forEach((update) => (journal[update] = req.body[update]));
    await journal.save();
    res.send(journal);
  } catch (error) {
    res.status(400).send(error);
  }
};
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!journal) {
      res.status(404).send();
    }

    res.send(journal);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createJournal,
  getJournals,
  getJournalsForUser,
  getJournal,
  updateJournal,
  deleteJournal,
};
