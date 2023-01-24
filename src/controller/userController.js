const userModel = require("../models/userModel")
const {userJOI,loginJoi}=require("../validation/joiValidation")
const jwt = require("jsonwebtoken")

const createUser = async function (req, res) {
    try {

        let data=req.body

        if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "please send some data" });

	    let one=0
	    const validation = await userJOI.validateAsync(data).then(()=>true).catch((err)=>{one=err.message; return null})
	
	    if(!validation) return res.status(400).send({status :false,message:`${one}`})


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

// ___________________________________________________

const loginUser = async function (req, res) {
   try {
    let data=req.body

    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "please send some data" });
    
       let one=0
       const validation = await loginJoi.validateAsync(data).then(()=>true).catch((err)=>{one=err.message; return null})
   
       if(!validation) return res.status(400).send({status :false,message:`${one}`})

       let email = data.email.trim()
       let password = data.password.trim()

       let getUser = await userModel.findOne({ email: email, password: password })
       if (!getUser) {
           return res.status(404).send({ status: false, message: "no user found with this credential" })
       } else {
           let token = jwt.sign({ userId: getUser._id },"groupseven",{expiresIn:"30000"})
           res.setHeader("x-auth-key",token)
           return res.status(200).send({ status: true, message:"Success" ,data:token})
       }

	
} catch (error) {
	return res.status(500).send({ error: error.message })
}}

module.exports.createUser = createUser;
module.exports.loginUser=loginUser;