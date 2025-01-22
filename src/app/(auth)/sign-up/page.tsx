'use client'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useDebounceCallback } from "@/app/hooks/useDebounceCallback"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schema/signUp.schema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


function page() {
  const [username, setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)
  const[isSubmitting,setIsSubmitting]=useState(false)
  //i will wait for 300 ms and then send the reuqest to check for username or else for each key pressedn it will send a request
  const debounced=useDebounceCallback(setUsername,300)
  const { toast } = useToast()
  const router=useRouter()

  //zod implementation
  const form=useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique=async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage("")
      }
      try {
        //we can also use react-query instead
        const response=await axios.get(`/api/check-username-unique?username=${username}`)

        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? "error checking username")
      }
      finally{
        setIsCheckingUsername(false)
      }    
    }
    checkUsernameUnique()
  },[username])

  const onSubmit=async (data:z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      console.log(data)
      const response=await axios.post<ApiResponse>('/api/sign-up',data)
      toast({
        title:'Success',
        description:response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("error in signup of user",error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage=axiosError.response?.data.message
      toast({
        title:"Signup failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {username.length > 0 && (
                    <p
                      className={`text-sm ${usernameMessage === "username is available" ? "text-green-500" : "text-red-500"}`}
                    >
                      {usernameMessage}
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "SignUp"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page