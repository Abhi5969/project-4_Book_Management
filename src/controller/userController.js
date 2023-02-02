const userModel = require("../models/userModel")
const {userJOI,loginJoi}=require("../validation/joiValidation")
const jwt = require("jsonwebtoken")

// -------------------------------------CREATE USER---------------------------------------

const createUser = async function (req, res) {
    try {

        let data=req.body

        if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "please send some data" });

	    let error=0
	    const validation = await userJOI.validateAsync(data).then(()=>true).catch((err)=>{error=err.message; return null})
	
	    if(!validation) return res.status(400).send({status :false,message:`${error}`})


	    let isExisting = await userModel.findOne({ $or: [{ email: data.email.trim() }, { phone: data.phone.trim() }] })           
	    if (isExisting) {
	        if (isExisting.email == data.email.trim()) {
	            return res.status(400).send({ status: false, message: "email is already there" })
	        } else {
	            (isExisting.phone == data.phone.trim())
	            return res.status(400).send({ status: false, message: "phone is already there" })
	        }
	    }
        
	    let create = await userModel.create(data)
	    return res.status(201).send({ status: true, message: "Success", data: create })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

// _____________________________________LOGIN USER______________

const loginUser = async function (req, res) {
   try {
    let data=req.body

    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "please send some data" });
    
       let error=0
       const validation = await loginJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message; return null})
   
       if(!validation) return res.status(400).send({status :false,message:`${error}`})

       let email = data.email
       let password = data.password

       let getUser = await userModel.findOne({ email: email, password: password })
       if (!getUser) {
           return res.status(404).send({ status: false, message: "no user found with this credential" })
       } else {
           let token = jwt.sign({ userId: getUser._id },"groupseven",{expiresIn:"4h"})
           res.setHeader("x-api-key",token)
           return res.status(200).send({ status: true, message:"Success" ,data:token})
       }

	
} catch (error) {
	return res.status(500).send({ error: error.message })
}}
// ---------------------------------EXPORTS----------------------------------------

module.exports.createUser = createUser;
module.exports.loginUser=loginUser;