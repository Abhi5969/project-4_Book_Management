const Joi = require('joi');

const schema = Joi.object({
    
      title: Joi.string().required(),

      excerpt: Joi.string().required(),

      ISBN: Joi.string().required().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/),

      userId:Joi.required(),

      category:Joi.string().required(),
    
      subcategory: Joi.string().required(),
      reviews: Joi.number(),
      deletedAt: Joi.date(),
      isDeleted: Joi.boolean(),
      releasedAt: Joi.date().required()
    })



const userJOI=Joi.object({
  title: Joi.string().required().valid("Mr", "Mrs", "Miss"),

  name: Joi.string().required().regex(/^[a-zA-Z ]+$/),
 
  phone: Joi.string().required().regex(/^[0]?[6789]\d{9}$/),

  email:Joi.string().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),

  password: Joi.string().required().min(8).max(15).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/),

  address: Joi.object({
    street: Joi.string(),

    city: Joi.string(),

    pincode:Joi.string().regex(/^([0-9]{4}|[0-9]{6})$/)
  })
  


  

})
    const reviewJoi = Joi.object({
      bookId: Joi.string().required(),


      reviewedBy:Joi.string().required(),

      reviewedAt:Joi.date().required(),

      rating:Joi.number().min(1).max(5).required(),

      review:Joi.string(),
    
      isDeleted:Joi.boolean()

    })

    const loginJoi=Joi.object({
      email:Joi.string().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      password: Joi.string().required().min(8).max(15).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/),
    })

//const {title,excerpt,releasedAt,ISBN}=data
    const updateJoi=Joi.object({
      title: Joi.string(),

      excerpt: Joi.string(),

      ISBN: Joi.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/),
      releasedAt: Joi.date()
    })





    module.exports={schema,reviewJoi,userJOI,loginJoi,updateJoi}