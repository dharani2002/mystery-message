import dbConnect from "@/lib/dbConnect";
import UserModel,{Message} from "@/model/User.model";

export async function POST(request:Request) {
   await dbConnect()
   
   const {username,content}=await request.json()
   try {
    const user =await UserModel.findOne({username})
    if(!user){
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {
                status: 404
            }
        )
    }

    if(!user.isAcceptingMessage){
        return Response.json(
            {
                success: false,
                message: "user is not accepting the messages"
            },
            {
                status: 403
            }
        )
    }

    const newMessage={content,createdAt:new Date()}

    user.messages.push(newMessage as Message)
    await user.save()

       return Response.json(
           {
               success: true,
               message: "message sent successfully"
           },
           {
               status: 200
           }
       )

   } catch (error) {
    console.error("failed to send message", error);
       return Response.json(
           {
               success: false,
               message: "failed to send message"
           },
           {
               status: 500
           }
       )
    
   }
}