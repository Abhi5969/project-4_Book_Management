const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const valid = require("../validator/validation");
const mongoose = require("mongoose");

// ***********************************************CREATE BOOK********************************************************
const createBook = async (req, res) => {
    let data = req.body;
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
        data;
    if (!title)
        return res.status(400).send({ status: false, message: "title is required" });
    if (!excerpt)
        return res.status(400).send({ status: false, message: "excerpt is required" });

    if (!userId)
        return res.status(400).send({ status: false, message: "userId is required" });
    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).send({ status: false, message: "userId is not a valid object id" });

    const findUser = await userModel.findById(userId);
    if (!findUser)
        return res.status(400).send({ status: false, message: "userId doesnt exist" });

    if (!ISBN)
        return res.status(400).send({ status: false, message: "ISBN is required" });
    if (typeof ISBN != "string")
        return res
            .status(400)
            .send({ status: false, message: "ISBN should be string" });
    if (!valid.isValidIsbn(ISBN))
        return res
            .status(400)
            .send({ status: false, message: "ISBN is not valid" });
    const existingData = await bookModel.findOne({
        $or: [{ title: title }, { ISBN: ISBN }],
    });
    if (existingData) {
        if (existingData.title == title)
            return res.status(400).send({ status: false, message: "title is already in use" });
        if (existingData.ISBN == ISBN)
            return res.status(400).send({ status: false, message: "ISBN is already in use" });
    }

    if (!category.trim())
        return res.status(400).send({ status: false, message: "category is required" });
    if (!valid.isValidName(category))
        return res.status(400).send({ status: false, message: "category is not valid" });

    if (!subcategory)
        return res.status(400).send({ status: false, message: "subcatagory is required" });
    if (!valid.isValidName(subcategory))
        return res.status(400) .send({ status: false, message: "subcategory is not valid" });
    if (!releasedAt)
        return res.status(400).send({ status: false, message: "releasedAt is required" });

    const createData = await bookModel.create(data);

    return res.status(201).send({ status: true, data: createData });
};

// *************************************************GET API FOR ALL DATA*********************************************
const getData = async (req, res) => {
    try {
        let data = req.query;
        let filter = {
            isDeleted: false,
            ...data,
        };
        console.log(filter);
        if (Object.keys(data).includes("userId")) {
            if (!mongoose.Types.ObjectId.isValid(data.userId))
                return res.status(400).send({ msg: "objectId is not valid" });
        }
        const findInDb = await bookModel
            .find(filter)
            .select({
                title: 1,
                excerpt: 1,
                userId: 1,
                category: 1,
                reviews: 1,
                releasedAt: 1,
            })
            .sort({ title: 1 });

        if (findInDb.length == 0)
            return res.status(404).send({ msg: "no book found" });

        return res
            .status(200)
            .send({ status: true, message: "Books list", data: findInDb });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

/***********************************************GET BOOK BY ID************************************************** */
const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId;

        if (!bookId)
            return res.status(400).send({ status: false, message: "please provide param" });

        if (!mongoose.Types.ObjectId.isValid(bookId))
            return res
                .status(400)
                .send({ status: false, message: "bookId is not valid" });

        const findData = await bookModel.findById(bookId).lean();

        if (!findData)
            return res.status(404).send({ status: false, message: "no book found" });

        const findInReviw = await reviewModel
            .find({ bookId: bookId })
            .select({ isDeleted: 0, createdAt: 0, updatedAt: 0 });

        findData["reviewsData"] = findInReviw;

        // findData._doc.reviewsData=findInReviw

        return res
            .status(200)
            .send({ status: true, message: "Books list", data: findData });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// ***********************************************UPDATE BOOK API******************************************************

const updateData = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        if (!bookId)
        return res
            .status(400)
            .send({ status: false, message: "please provide param" });

    if (!mongoose.Types.ObjectId.isValid(bookId))
        return res
            .status(400)
            .send({ status: false, message: "bookId is not valid" });
        let data = req.body;

        const { title, ISBN, releasedAt, excerpt } = data;

        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .send({ status: false, msg: "please send some data" });

        let error = 0;
        const validation = await updateJoi
            .validateAsync(data)
            .then(() => true)
            .catch((err) => {
                error = err.message;
                return null;
            });

        if (!validation)
            return res.status(400).send({ status: false, message: `${error}` });

        const existingData = await bookModel.findOne({
            $or: [{ title: title }, { ISBN: ISBN }],
        });
        if (existingData) {
            if (existingData.title == title)
                return res
                    .status(400)
                    .send({ status: false, message: "title is already present" });
            if (existingData.ISBN == ISBN)
                return res
                    .status(400)
                    .send({ status: false, message: "ISBN is already present" });
        }

        

        const isExist = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!isExist)
            return res
                .status(404)
                .send({ status: false, message: "no book found with this id" });

        const updateBook = await bookModel.findByIdAndUpdate(
            bookId,
            {
                $set: {
                    title: title,
                    excerpt: excerpt,
                    releasedAt: releasedAt,
                    ISBN: ISBN,
                },
            },
            { new: true }
        );

        return res.status(200).send({ status: true, data: updateBook });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// ************************************************DELETE BY ID*****************************************

const deleteData = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        if(!bookId) return res.status(400).send({status:false,msg:"please enter ib first"})
        if (!mongoose.Types.ObjectId.isValid(bookId))
            return res
                .status(400)
                .send({ status: false, message: "bookId is not valid" });

        const checkBook = await bookModel.findOne({
            _id: bookId,
            isDeleted: false,
        });

        if (!checkBook)
            return res
                .status(404)
                .send({ status: false, message: "no book found with this id" });

        let deleteBook = await bookModel.findByIdAndUpdate(bookId, {
            isDeleted: true,
            deletedAt: Date.now(),
        });

        res.status(200).send({ status: true, message: "book deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};
module.exports = { createBook, getData, getBookById, updateData, deleteData };
