function parseMobileNumber(mobileNumber) {
    if (mobileNumber.length == 10 && mobileNumber.charAt(0) == "0") {
        mobileNumber = "94" + mobileNumber.substring(1);
    }

    return mobileNumber;
}

function validateMobileNumber(mobileNumber) {
    if (!mobileNumber || mobileNumber == "") {
        return false;
    }

    if (mobileNumber.length == 10 && mobileNumber.charAt(0) == "0") {
        mobileNumber = "94" + mobileNumber.substring(1);
    }


    const mobileNumberRegExp = new RegExp("947[0-9]{8}");

    return mobileNumberRegExp.test(mobileNumber);
}


module.exports = {
    parseMobileNumber,
    validateMobileNumber
}