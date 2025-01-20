'use client'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schema/signIn.schema"
import { signIn } from "next-auth/react"


function page() {

  //i will wait for 300 ms and then send the reuqest to check for username or else for each key pressedn it will send a request

  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier:'',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result=await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    console.log(result)
    if(result?.error){
      
      toast({
        title:"login failed",
        description:"incorrect username or password",
        variant:"destructive"
      })
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username"
                      {...field}
                    />
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
                    <Input type="password" placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" >
              SignIn
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">

        </div>
      </div>
    </div>
  )
}

export default page