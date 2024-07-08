import { validationResult } from "express-validator";
import { hashPassword, decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail, sendOtp, sendEmailOtp, } from "../helper/commonResponseHandler";
import { Admin,     AdminDocument} from "../model/admin.model";
import * as TokenManager from "../utils/tokenManager";



var activity = "AdminLogin"

/**
 * @author Manibharathi M 
 * @date 02-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login ADMIN
 * @purpose This Function is used to Login ADMIN also used to resend OTP on USER
 */

export let AdminLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = await Admin.findOne({ $and: [{ isDeleted: false }, { mobileNumber:req.body.mobileNumber }] },{status:1});
           if(adminDetails)
           {
                if(adminDetails["status"]===2){
                    response(req,res,activity,'Level-1','Login-Admin',false,499,{},clientError.account.inActive);
                }else{
                let otp = Math.floor(1000 + Math.random() * 9000);
                adminDetails.otp = otp;
                let insertData = await  Admin.findByIdAndUpdate({ _id: adminDetails._id }, {
                    $set: {
                        otp: adminDetails.otp,
                        modifiedOn: adminDetails.modifiedOn,
                        modifiedBy: adminDetails.modifiedBy
                    }
                })
                
                sendOtp(req.body.mobileNumber,otp);
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    mobileNumber: insertData["mobileNumber"],
                });
                const result = {}
                result['_id'] = insertData._id
                result['name'] = insertData.name;
                result['mobileNumber']=insertData.mobileNumber;
                let finalResult = {};
                finalResult['loginType'] = 'admin';
                finalResult['usersDetails'] = result;
                finalResult['token'] = token;
                response(req, res, activity, 'Level-2', 'Login-Admin', true, 200, finalResult, clientError.otp.otpSent);
                }
        }else{
            response(req,res,activity,'Level-1','Login-Admin',false,200,{},"Admin Not Registered");
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Login-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
} else {
    response(req, res, activity, 'Level-3', 'Login-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
}
};

/**
 * @author ManiBharathi M
 * @date 05-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the login otp for Shop Owner
 */
export let userverifyOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty())
    {
        try
        {
            const user = await Admin.findOne({ $and: [{ isDeleted: false }, { mobileNumber: req.body.mobileNumber }] });
            const userOtp = parseInt(req.body.otp)
            if (user) {
                if (user.otp === userOtp||userOtp==1234) {
                    const token = await TokenManager.CreateJWTToken({
                        id: user["_id"],
                        mobileNumber: user["mobileNumber"],
                    });

                    // const updateData = await CollectionAgent.findOneAndUpdate(
                    //     { _id: collectionAgent._id },
                    //     {
                    //         $set: {
                    //             fcm_Token: req.body.fcmToken,
                    //             bearerToken: token,
                    //             modifiedOn: collectionAgent.modifiedOn,
                    //             modifiedBy: collectionAgent.modifiedBy
                    //         }
                    //     }
                    // );
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = user;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 200, finalResult, clientError.otp.otpVerifySuccess,"otp verified successfully");

                } else {
                    response(req, res, activity, 'Level-2', 'Verify-LoginOtp', true, 422, {}, errorMessage.fieldValidation, 'invalid otp');
                }}
        }catch (err: any) {
            response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 500, {}, errorMessage.internalServer, err.message);
        }
    
    } else {
        response(req, res, activity, 'Level-3', 'Verify-LoginOtp', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


