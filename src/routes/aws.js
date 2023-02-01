const aws = require('aws-sdk')
require("dotenv").config()
const uploadFile = async (files) => {

    return new Promise(function (resolve, reject) {
        aws.config.update({
            accessKeyId: "AKIAY3L35MCRZNIRGT6N",
            secretAccessKey:process.env.secretAccessKey ,
            region: "ap-south-1"
        })
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });

        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "Group7/" + files.originalname,
            Body: files.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("file uploaded succesfully")
            // console.log(data)
            return resolve(data.Location)
        })
    })
}
module.exports = { uploadFile }