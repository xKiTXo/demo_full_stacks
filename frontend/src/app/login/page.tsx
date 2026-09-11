'use client'
import { FormProvider, useForm } from "react-hook-form"
import Grid from '@mui/material/Grid'
import RHFTextField from "@/components/RHFComponents/RHFTextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from "next/navigation"
import { Login_API } from "@/services/users"
import { setCookie } from 'cookies-next'
import { ErrorToast } from "@/components/ToastImpl/ToastImpl"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/config/constants"
import RouterLink from "@/components/RouterLink/RouterLink"
import { MIN_HEIGHT } from '@/config/constants'
import { useSWRConfig } from "swr"
import { Suspense } from "react"



const LoginContent = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const { mutate } = useSWRConfig()

  const RegisterScheme = z.object({
    username: z.string(),
    password: z.string(),
  });

  const methods = useForm({
    resolver: zodResolver(RegisterScheme),
    defaultValues: {
      username: "user",
      password: "123456"
    }
  })

  const {
    formState: { errors }
  } = methods

  const onSubmit = async (data: any) => {
    // console.log(data);
    try {
      const result = (await Login_API(data))?.data;
      if (result) {
        const { access, refresh } = result.data;
        if (access) {
          setCookie(ACCESS_TOKEN, access, {
            // httpOnly: true, // Blocks client-side JS access
            // secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "lax", // Protects against CSRF attacks
            maxAge: 60 * 60,
            path: "/"
          })
          setCookie(REFRESH_TOKEN, refresh, {
            // httpOnly: true, // Blocks client-side JS access
            // secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "lax", // Protects against CSRF attacks
            maxAge: 60 * 60 * 24,
            path: "/"
          })

          // refresh cart API cache 
          await mutate('/api/cart/')

          const redirectTo = searchParams.get('redirect') || '/dashboard'

          router.refresh()
          router.push(redirectTo)
        }
      } else {
        throw new Error("")
      }
    } catch (error) {
      ErrorToast({ message: "Username or password invalid!" })
    }


  }

  return <Box sx={{ width: "100%" }}>
    <Grid container >
      <Grid size={12}
        sx={{ bgcolor: "yellowgreen", height: MIN_HEIGHT }}
      >
        <FormProvider {...methods} >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box sx={{
              width: {
                xs: 240,
                md: 300,
                lg: 400
              },
              p: "30px 40px 60px 40px",
              margin: "150px auto",
              boxShadow: "2px 3px 10px gray",
              bgcolor: "white",
            }}>
              <Grid container spacing={2} >
                <Typography variant="h6">Login</Typography>
                <Grid size={12}>
                  <RHFTextField name="username" label="Username" />
                </Grid>
                <Grid size={12}>
                  <RHFTextField type="password" name="password" label="Password" />
                </Grid>
                <Grid size={12}>
                  <Button size="large" fullWidth variant="contained" type="submit">Sign In</Button>
                </Grid>
                <Grid size={12}>
                  <Typography variant="caption">Hello, Do not have an account?</Typography>
                  <RouterLink href="/register">
                    <Typography sx={{ pl: "4px" }} component={"span"} variant="subtitle1" color="info">
                      Sign Up.
                    </Typography>
                  </RouterLink>
                </Grid>
              </Grid>
            </Box>
          </form>
        </FormProvider>
      </Grid>
    </Grid>
  </Box>
}


const Page = () => {

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <LoginContent />
    </Suspense>
  )
}

export default Page
