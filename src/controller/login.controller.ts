import { validationResult } from "express-validator";
import { hashPassword, decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail, sendOtp, sendEmailOtp, } from "../helper/commonResponseHandler";
import { Users, UsersDocument } from "../model/users.model";

import *  as TokenManager from "../utils/tokenManager"



var activity = "Login"

/**
 * @author Manibharathi 
 * @date 02-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login USER
 * @purpose This Function is used to Login USER also used to resend OTP on USER
 */

export let userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { mobileNumber:req.body.mobileNumber }] });
            if(userDetails) {
                if(userDetails.status === 2) {
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                } else {
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    //console.log(otp);
                    userDetails.otp = otp;
                    let insertData = await Users.findByIdAndUpdate({ _id: userDetails._id }, {
                        $set: {
                            otp: userDetails.otp,
                            modifiedOn: userDetails.modifiedOn,
                            modifiedBy: userDetails.modifiedBy
                        }
                    });
                    const userData= await Users.findOne({ $and: [{ isDeleted: false }, {_id:userDetails._id }]});
                    const result = {};
                    result['_id'] = userData._id;
                    result['mobileNumber'] = userData.mobileNumber;
                    result['otp'] = userData.otp;
                    result['name'] = userData.name;
                    let finalResult = {};
                    finalResult["loginType"] = 'User';
                    finalResult["usersDetails"] = result;
                    sendOtp(req.body.mobileNumber,otp);
                    response(req, res, activity, 'Level-2', 'Login-User', true, 200, finalResult, clientError.otp.otpSent,"Otp has been sent successfully");
                   console.log(finalResult);      
                   
                }
            } else {
                const usersDetails: UsersDocument = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                console.log(otp);
                usersDetails.otp = otp;
                const createData = new Users(usersDetails);
                const insertData = await createData.save();
                sendOtp(req.body.mobileNumber,otp);
                console.log(insertData);
                
                const result = {};
                result['_id'] = insertData._id;
                result['mobileNumber'] = insertData.mobileNumber;
                result['otp'] = insertData.otp;
                result['name'] = insertData.name;
                let finalResult = {};
                finalResult["loginType"] = 'users';
                finalResult["usersDetails"] = result;
                response(req, res, activity, 'Level-2', 'Login-User', true, 200, finalResult, clientError.success.registerSuccessfully,"Otp has been sent successfully");
            }
        } catch (err:any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let   resendotp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { mobileNumber:req.body.mobileNumber }] },{status:1});
            if(userDetails) {
                if(userDetails.status === 2) {
                    response(req,res,activity,'Level-1','resendotp-User',false,499,{},clientError.account.inActive);
                } else {
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    console.log(otp);
                    userDetails.otp = otp;
                    let insertData = await Users.findByIdAndUpdate({ _id: userDetails._id }, {
                        $set: {
                            otp: userDetails.otp,
                            modifiedOn: userDetails.modifiedOn,
                            modifiedBy: userDetails.modifiedBy
                        }
                    });
                    const userData= await Users.findOne({ $and: [{ isDeleted: false }, {_id:userDetails._id }]},{name:1,email:1,mobileNumber:1,otp:1});
                    sendOtp(req.body.mobileNumber,otp);
                    response(req, res, activity, 'Level-2', 'resendotp-User', true, 200, userData, clientError.otp.otpSent);
                }
            } 
        } catch (err:any) {
            response(req, res, activity, 'Level-3', 'resendotp-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'resendotp-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



/**
 * @author Manibharathi M 
 * @date 02-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to forgetpassword to the user
 */
export let forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const user = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (user) {
                var _id = user._id
                sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                    .then(doc => {
                        response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                    })
                    .catch(error => {
                        console.error(error);

                    })
            }
            else {
                response(req, res, activity, 'Level-1', 'Forgot-Password', false, 404, {}, "User Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-1', 'Forgot-Password', false, 500, {}, errorMessage.internalServer, err.message);

        }
    } else {
        response(req, res, activity, 'Level-1', 'Forgot-Password', false, 400, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}
/**
* @author Manibharathi 
* @date 02-05-2024
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to reset password
*/

export let resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const user = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (user) {
                var _id = user._id
                const hash = await encrypt(req.body.password);
                const updateData = await Users.findByIdAndUpdate({ _id }, {
                    $set: {
                        password: hash,
                        modifiedOn: user.modifiedOn,
                        modifiedBy: user.modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Reset-Password', true, 200, {}, "Password Reset Successfully");
            } else {
                response(req, res, activity, 'Level-1', 'Reset-Password', false, 404, {}, "User Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-1', 'Reset-Password', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-1', 'Reset-Password', false, 400, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}
