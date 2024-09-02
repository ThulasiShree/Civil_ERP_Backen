export let ErrorMessage = {
    email: {
        required: 'Field is Required',
        validation: 'Not a Valid Email'
    },
    name: {
        required: 'Field is Required',
        validation: 'Not a Valid Name'
    },
    mobileNumber: {
        required: 'Field is Required',
        validation: 'Not a Valid Mobile Number'
    },
    password: {
        required: 'Field is Required',
        validation: 'Not a Valid Password'
    },
    id: {
        required: 'Field is Required',
        validation: 'Not a Valid Id'
    },
    general: {
        required: 'Field is Required',
        validation: 'Not a valid value'
    }
}


export let responseErrors = {
    200: 'OK',
    201: 'Successfully created',
    204: 'No content Found',
    400: 'Bad Request',
    401: 'Invalid credentials',
    403: 'Forbidden',
    402: 'Email not found',
    422: 'Validation failed',
};


export let errorMessage = {
    internalServer: 'Internal Server Error',
    fieldValidation: 'Field Validation Failed',
    cantdelete: 'Cannot Delete as it is already in use !',
    cantChangestatus: 'Cannot Change the Status'
}




/** 
 * @author Santhosh Khan K
 * @description All the Error messages that needed to be sent to User
 * @type {Object}
*/
export let clientError = Object.freeze({
    user: {
        userNameExist: 'User already exist for given username, Please use the different one',
        userNameNotExist: 'User does not Exist for User Name',
        UserNotFound: 'You are not registered with us !',
        userDontExist: 'User does not exist',
        userExist: 'User already exist !',
        usermoboremail: 'User already registered with the Mobilenumber or email'
    },
    email: {
        emailExist: 'User already exist for given email',
        emailSend: 'Email Send Successfully',
        emailNotVerified: 'Your email is not verified !',
        emailUserNotFound: 'Invalid Email !',
        VerificationEmailLinkSendSuccess: "Verification link has been send to your email address.",
        password: "Invalid Password !",
    },
    mobile: {
        mobileExist: "User already exist for given mobile number",
        mobileNotExist: "No User found for this mobile number",
        alreadyVerifiedEmail: "Your Email is already verified!",
        phoneNotVerified: 'Your email is not verified !',
    },
    password: {
        invalidPassword: 'Invalid Password !',
    },
    otp: {
        OTPText: 'This is your OTP Dont share with anyone',
        otpSent: 'OTP has been sent successfully',
        otpExpired: 'Entered OTP has been expired',
        otpDoestMatch: 'Invalid OTP',
        otpVerifySuccess: 'OTP is successfully verified',
        changePasswod: 'Current password is wrong..!',
    },
    success: {
        savedSuccessfully: 'Saved Successfully',
        deleteSuccess: "Deleted successfully",
        updateSuccess: "Updated successfully",
        registerSuccessfully: 'Registered Successfully',
        loginSuccess: 'You have successfully Logged-in',
        passwordUpdateSuccess: 'Password has been updated Successfully',
        passwordNotUpdateSuccess: 'Password has not been updated !',
        success: "Everything is fine",
        exist: 'Already exist !',
        accountNumberExist: 'AccountNumber Already Exist !',
        dateExist: 'Date Already Exist !',
        emailExist: 'Email already exist !',
        mobileExist: 'Mobile already exist !',
        nameExist: 'Name already exist !',
        fetchedSuccessfully: 'Fetched Successfully !',
        sendSuccessfully: 'Send Successfully',
    },
    account: {
        deActive: 'Your account is deactived',
        inActive: 'Your account is blocked',
        inActiveStatus: 'Your account is inactive, Please check your email ',
        inActiveStatuss: 'Your account is inactive, Please Renewal your package ',
        isExpied: 'Your plan is expired, Please Renewal your package',
        verification: 'Your account is not active, Please check your email ',
        loggedOut: 'You have been Successfully logged out',
    },
    token: {
        tokenExpire: 'Your Token has been Expired',
        tokenUserd: 'Your Token is already used',
        sessionExpire: 'Session Expired!',
        unauthRoute: 'User is not authorized to Access the resource',
    },
    blog: {
        blogExist: 'Blog already exist',
        blogNotFound: 'Blog is not found'
    },
    data:{
        dataNotFound:"data is not found",
        dataExist: 'Data already exist'
    },

    code: {
        successCode: 200
    }
});
