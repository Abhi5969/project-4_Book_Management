const mongoose = require("mongoose");
const isbn = require("node-isbn")

//______________________Name Validation____________

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
};

//____________________Email Validation_________________

const isValidEmail = function (email) {
    const emailRegex =
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

//_____________________mobile validation_____________________
const isValidMobile = function (mobile) {
    const mobileRegex = (/^[0]?[6789]\d{9}$/);
    return mobileRegex.test(mobile);
};

// _____________________password__________________________
const isValidpassword = function (password) {
    const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
};

// ____________________validation______________________
const isValidIsbn = function (ISBN) {
    const ISBNRegex=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    return ISBNRegex.test(ISBN);
}
// ____________________export_______________________________

module.exports = {
    isValidName,
    isValidEmail,
    isValidMobile,
    isValidpassword,
    isValidIsbn
};