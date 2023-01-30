const userModel = require("../models/userModel")
const { isValidEmail, isValidMobile, isValidName, isValidpassword } = require("../validator/validation");
const check = require("check-types")
const jwt = require("jsonwebtoken")

const createUser = async function (req, res) {
    try {
        let data = req.body
        let { title, name, phone, email, password } = data
        // if (typeof phone != "string" ) return res.status(400).send({ status: false, message: "type should be string" })
        if (!name) return res.status(400).send({ status: false, message: "name is required" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "name is not valid" })

        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (title != ("Mr" || "Mrs" || "Miss")) return res.status(400).send({ status: false, message: "title can only be Mr,Mrs,Miss" })

        if (!phone) return res.status(400).send({ status: false, message: "phone no is required" })
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        if (!check.string(phone)) return res.status(400).send({ status: false, message: "phone type should be string" })
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!isValidpassword(password)) return res.status(400).send({ status: false, message: "password is not valid" })

        let isExisting = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })           //checkk
        if (isExisting) {
            if (isExisting.email == email.trim()) {
                return res.status(400).send({ status: false, message: "email is already there" })
            } else {
                (isExisting.phone == phone.trim())
                return res.status(400).send({ status: false, message: "phone is already there" })
            }
        }
        let create = await userModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: create })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

// ___________________________________________________

const loginUser = async function (req, res) {
   try {
	 let email = req.body.email
	    let password = req.body.password
	    if (!email) return res.status(404).send({ status: false, message: "email is missing" })
	    if (!password) return res.status(404).send({ status: false, message: "password is missing" })
	    let getUser = await userModel.findOne({ email: email, password: password })
	    if (!getUser) {
	        return res.status(404).send({ status: false, message: "no user with this" })
	    } else {
	        let token = jwt.sign({ userId: getUser._id },"groupseven",{expiresIn:"30000"})
	        return res.status(200).send({ status: true, message:"Success" ,data:token})
        }
	
} catch (error) {
	return res.status(500).send({ error: error.message })
}}

module.exports = {createUser,loginUser}
