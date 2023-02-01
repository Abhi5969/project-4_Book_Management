const mongoose=require("mongoose")
const objectId=mongoose.Schema.Types.ObjectId

const bookSchema=mongoose.Schema({
title:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
bookCover:{
    type:String,
    trim:true
},
excerpt:{
    type:String,
    required:true,
    trim:true
},
userId:{
    type:objectId,
    required:true,
    ref:"user"
  
},
ISBN:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
category:{
    type:String,
    required:true,
    trim:true
},
subcategory:{
    type:String,
    required:true,
    trim:true
},
reviews:{
    type:Number,
    default:0
},
deletedAt:{
    type:Date
},
isDeleted:{
    type:Boolean,
    default:false
},
releasedAt:{
    type:Date,
    required:true
}
},{timestamps:true},{ strict: false })


module.exports=mongoose.model("book",bookSchema)