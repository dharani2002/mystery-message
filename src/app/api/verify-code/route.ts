import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function POST(request:Request) {
    await dbConnect()
    
    try {
        const {username,code}=await request.json()

        const decodedUsername=decodeURIComponent(username)

        const user=await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 404
                }
            )

        }

        const isCodeValid=user.verifyCode===code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "user verified successfully"
                },
                {
                    status: 200
                }
            )
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please signup again"
                },
                {
                    status: 400
                }
            )
        }
        else{
            return Response.json(
                {
                    success: false,
                    message: "incorrect verfication code"
                },
                {
                    status: 400
                }
            )
        }
        
    } catch (error) {
        console.error("error checking username", error)
        return Response.json(
            {
                success: false,
                message: "error verifying user"
            },
            {
                status: 500
            }
        )
        
    }
    
}