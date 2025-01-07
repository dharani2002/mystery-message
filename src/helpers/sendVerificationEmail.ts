import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(email:string,username:string,verifyCode:string) :Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery message | Verifciation code',
            react: VerificationEmail({username,otp:verifyCode}),
        });
        return { success: true, message: "VErification email sent successfully" }
        
    } catch (emailError) {
        console.error("Error sending verification email",emailError)
        return {success:false, message:"Failed to send verifcation email"}
    }
}