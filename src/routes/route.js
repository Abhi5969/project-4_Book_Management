const express=require("express")
const router=express.Router()
const {createUser,loginUser}=require("../controller/userController")
const {createBook,getData,getBookById,updateData,deleteData}=require("../controller/bookController")
const {authentication,authForCreation,authForDltAndPut}=require("../middleware/middle")


router.post("/register",createUser) //create user

router.post("/login",loginUser) //login user

router.post("/books",authentication,authForCreation,createBook)   //create book

router.get("/books",authentication,getData)      // get all book

router.get("/books/:bookId",authentication,getBookById)     //get book by id

router.put("/books/:bookId",authentication,authForDltAndPut,updateData)    //update book

router.delete("/books/:bookId",authentication,authForDltAndPut,deleteData)   //delete book

router.all("/*", (req, res) => {
    res.status(404).send({ message: "page not found" });
  });

module.exports=router