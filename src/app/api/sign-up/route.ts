import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"

export async function POST(request:Request) {
    //connect to db
    await dbConnect()
    try {
        const {username,email,password}= await request.json()
        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        //verified username exists
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"username is already taken"
            },{status:400})
        }

        const existingUserByEmail=await UserModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*90000).toString()
        
        if(existingUserByEmail){
            //verified user exists
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 500 })
            }
            else{
                //register unverified user
                const hashedPassword=await bcrypt.hash(password,10)
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            //register new user
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                    username,
                    email,
                    password:hashedPassword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessage:true,
                    messages:[]
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse =await sendVerficationEmail(
            email,
            username,
            verifyCode
        )
        console.log(emailResponse);
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }

        return Response.json({
            success: true,
            message: "verification email sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("error registering user",error)
        return Response.json(
            {
                success:false,
                message:"error registering user"
            },
            {
                status:500
            }
        )
    }
}