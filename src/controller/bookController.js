const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const moment = require("moment")
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const { bookJoi, updateJoi,getJoi} = require("../validation/joiValidation");
const { uploadFile } = require('../routes/aws')

// -------------------------------------CREATE BOOK----------------------------------------------

const createBook = async (req, res) => {
  try {
    let fetchJSON = req.body.data // pass JSON key-value and fetch through req.body  in form-data
        let data = (JSON.parse(fetchJSON)) //Parse it

    let error = 0
    const validation = await bookJoi.validateAsync(data).then(() => true).catch((err) => { error= err.message; return null })

    if (!validation) return res.status(400).send({ status: false, message: `${error}` })

    title = data.title.trim()
    ISBN = data.ISBN.trim()   

    const existingData = await bookModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

    if (existingData) {
      if (existingData.title == title) return res.status(400).send({ status: false, message: "title is already in use" })
      if (existingData.ISBN == ISBN) return res.status(400).send({ status: false, message: "ISBN is already in use" })
    }

    if (data.isDeleted === true) data.deletedAt = Date.now()
    if(!data.releasedAt)  {data.releasedAt=Date.now()}
    let urlLink
    let files = req.files // Get the file to upload
    console.log(files)
    if (files && files.length > 0) {
        let uploadFileUrl = await uploadFile(files[0])
        urlLink = uploadFileUrl
    }
    else {
        return res.status(400).send({ message: "No File Found" })
    }
    data['bookCover'] = urlLink
    
    const createData = await bookModel.create(data)

    return res.status(201).send({ status: true, data: createData });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// -------------------------------GET BOOK--------------------------------------

const getData = async (req, res) => {
  try {
    let data = req.query;
    
    let error = 0
    const validation = await getJoi.validateAsync(data).then(() => true).catch((err) => { error= err.message; return null })
    if(!validation) return res.status(400).send({ status: false, message: `${error}` })

    let filter = {
      isDeleted: false,
      ...data
    };
    
    if (Object.keys(data).includes("userId")) {
      if (!mongoose.Types.ObjectId.isValid(data.userId))
        return res.status(400).send({ msg: "objectId is not valid" });
    }
    const findInDb = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 });

    if (findInDb.length == 0)
      return res.status(404).send({ msg: "no book found" });

    return res.status(200).send({ status: true, message: "Books list", data: findInDb });
  }catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// ----------------------------------GET BOOK BY ID---------------------------------------

const getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" });

    const findData = await bookModel.findOne({_id:bookId,isdeleted:false}).lean();

    if (!findData) return res.status(404).send({ status: false, message: "no book found" });

    const findInReviw = await reviewModel.find({ bookId: bookId,isDeleted:false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0 });

    findData["reviewsData"] = findInReviw;

    return res.status(200).send({ status: true, message: "Books list", data: findData });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// -----------------------------------------UPDATE BOOK----------------------------------------------------

const updateData = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "please send some data" });

    let { title, ISBN, releasedAt, excerpt } = data;

    let error = 0;
    const validation = await updateJoi.validateAsync(data).then(() => true).catch((err) => { error = err.message; return null; });

    if (!validation) return res.status(400).send({ status: false, message: `${error}` });

    if (title || ISBN) {
      const existingData = await bookModel.findOne({ $or: [{ title: title.trim()}, { ISBN: ISBN }] });
      if (existingData) {
        if (existingData.title == title.trim()) return res.status(400).send({ status: false, message: "title is already present" });

        if (existingData.ISBN == ISBN.trim()) return res.status(400).send({ status: false, message: "ISBN is already present" })
      }
    }

    const updateBook = await bookModel.findByIdAndUpdate(bookId, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }}, { new: true });

    return res.status(200).send({ status: true, data: updateBook });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// --------------------------------------DELETE BOOK-------------------------------------------------
const deleteData = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: Date.now() });

    res.status(200).send({ status: true, message: "book deleted successfully" });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// --------------------------------------EXPORTS--------------------------------------------

module.exports = { createBook, getData, getBookById, updateData, deleteData }



