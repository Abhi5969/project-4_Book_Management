const Joi = require('joi');

//==============================book joi====================================

const bookJoi = Joi.object({
    
      title: Joi.string().required(),

      excerpt: Joi.string().required(),

      ISBN: Joi.string().trim().required().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).message("please enter valid ISBN"),

      userId:Joi.required(),

      category:Joi.string().required(),
    
      subcategory: Joi.string().required(),
      reviews: Joi.number(),
      deletedAt: Joi.date(),
      isDeleted: Joi.boolean(),
      releasedAt: Joi.string().regex(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).message("please enter in this format:YYYY-MM-DD")
    })

    // _______________________________________GET JOI-------------------------------

    const getJoi=Joi.object({
      category:Joi.optional(),
      userId:Joi.optional(),
      subcategory:Joi.optional()
    })

//==================================user joi======================================================

const userJOI=Joi.object({
  title: Joi.string().trim().required().valid("Mr", "Mrs", "Miss"),

  name: Joi.string().trim().required().regex(/^(?!-)(?!.*-$)[a-zA-Z-.]+$/).message("please enter valid name"),
 
  phone: Joi.string().trim().required().regex(/^[0]?[6789]\d{9}$/).message("phone is not valid"),

  email:Joi.string().trim().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("please enter valid email"),

  password: Joi.string().trim().required().min(8).max(15).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/).message("password  should contain Min 8 character and 1 Special Symbol"),

  address: Joi.object({
    street: Joi.string(),

    city: Joi.string().trim().regex(/^(?!-)(?!.*-$)[a-zA-Z-.]+$/).message("please enter valid city name"),

    pincode:Joi.string().trim().regex(/^([0-9]{4}|[0-9]{6})$/).message("please enter valid pin")
  })
  


  //====================review joi==========================

})
    const reviewJoi = Joi.object({
      bookId: Joi.string().required(),

      reviewedBy:Joi.string().trim().regex(/^(?!-)(?!.*-$)[a-zA-Z-.]+$/).message("please enter valid reviewer name"),

      reviewedAt:Joi.date().required(),

      rating:Joi.number().min(1).max(5).required(),

      review:Joi.string(),
    
      isDeleted:Joi.boolean()

    })

    //==========================login joi======================================

    const loginJoi=Joi.object({
      email:Joi.string().trim().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("please enter valid email"),
      password: Joi.string().trim().required().min(8).max(15).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z@#$%\d]{8,15}$/).message("please enter valid password"),
    })

//=============================update book joi==============================

    const updateJoi=Joi.object({
      title: Joi.string().trim(),

      excerpt: Joi.string(),

      ISBN: Joi.string().trim().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).message("please enter valid ISBN"),

      releasedAt: Joi.string().regex(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).message(" please enter date in this format:YYYY-MM-DD")
    })

    // ==========================update review Joi==========================

    const updatereviewJoi=Joi.object({
      review:Joi.string(),
      reviewedBy:Joi.string().trim().regex(/^(?!-)(?!.*-$)[a-zA-Z-.]+$/).message("please enter valid reveiewer's name"),
      rating:Joi.number().min(1).max(5)
    })




    module.exports={bookJoi,getJoi,reviewJoi,userJOI,loginJoi,updateJoi,updatereviewJoi}



    