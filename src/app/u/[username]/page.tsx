"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schema/message.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


function page() {
  const params=useParams<{username:string}>()
  const username=params.username

  const form=useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema)
  })

  const messageContent = form.watch("content");
  const [isLoading,setIsLoading]=useState(false)
  const {toast}=useToast()
  
  const [suggestedContent, setSuggestedContent] = useState<Array<string>>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const handleMessageClick=(message:string)=>{
    form.setValue('content',message)
  }

  const onSubmit=async (data:z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-message",{...data,username});
      console.log(response.data)
      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
  }

  const fetchSuggestMessage = useCallback(async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.get("/api/suggest-messages");

      const parsedStringResponse = response.data.message.split("||");
      setSuggestedContent(parsedStringResponse || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:axiosError.response?.data.message ?? "suggesstions are not working",
        variant: "destructive",
      });
    }
    finally{
      setIsSuggestLoading(false)
    }
  }, [setIsSuggestLoading,setSuggestedContent]);

    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
        <div className="space-y-4 my-8">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="my-4"
              onClick={(e) => {
                e.preventDefault();
                fetchSuggestMessage();
              }}
            >
              {isSuggestLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>Suggest message</p>
              )}
            </Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4"> 
              {
                suggestedContent.map((content, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(content)}
                  >
                    {content}
                  </Button>
                ))
              }
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Own Message Board</div>
          <Link href={"/sign-up"}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    );


}

export default page;
