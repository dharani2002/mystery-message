// import { openai } from '@ai-sdk/openai';
// import OpenAI from 'openai';
// import { streamText } from 'ai';

import { NextResponse } from 'next/server';

import {GoogleGenerativeAI} from "@google/generative-ai";

export async function GET(request:Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
        const result = await model.generateContent(prompt);
        // console.log(result.response);
        // console.log(result.response.text());

        return Response.json(
            {
                success:true,
                message:result.response.text()
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.error("unexpectred error occured",error)
                return Response.json(
            {
                success:false,
                message:"Unexpected error occurred"
            },
            {
                status:500
            }
        )
        
    }     
}























/*
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    
        const result = streamText({
            model: openai('gpt-4o'),
            prompt,
        });
        return result.toDataStreamResponse();
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status, headers, message}=error
            return NextResponse.json({
                name,status,headers,message
            })
        }
        else{
            console.error("unexpectred error occured")
        }
        
    }
}
*/