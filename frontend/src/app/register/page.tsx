'use client'
import { FormProvider, useForm } from "react-hook-form"
import Grid from '@mui/material/Grid'
import RHFTextField from "@/components/RHFComponents/RHFTextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { Register_API } from "@/services/users"
import { ErrorToast, SuccessToast } from "@/components/ToastImpl/ToastImpl"
import { useRouter } from "next/navigation"
import RouterLink from "@/components/RouterLink/RouterLink"
import { MIN_HEIGHT } from '@/config/constants'

const Page = () => {
  const router = useRouter()

  const RegisterScheme = z.object({
    username: z.string(),
    password: z.string(),
    re_password: z.string(),
  });

  const methods = useForm({
    resolver: zodResolver(RegisterScheme),
    defaultValues: {
      username: "user" + new Date().getTime().toString(),
      password: "123456",
      re_password: "123456",
    }
  })

  const {
    formState: { errors },
    setError
  } = methods



  const onSubmit = async (data: any) => {
    try {
      const result = await Register_API(data);
      if (result?.data?.success) {
        const { user, message } = result.data;
        SuccessToast({ message: message })
        router.push("/login");
        return
      }
    } catch (error: any) {
      if (error?.message) {
        if (typeof error.message === "object") {
          const errorList = Object.entries(error?.message);
          if (errorList.length > 0) {
            for (const [key, value] of errorList) {
              setError(key as any, {
                type: "manual",
                message: value as string,
              })
            }
          }
        }
        ErrorToast({ message: "Register Failed!" })
      } else {
        ErrorToast({ message: "Register Failed!" })
      }
    }
  }


  return (
    <Box sx={{ width: "100%" }}>
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
                  <Typography variant="h6">Register</Typography>
                  <Grid size={12}>
                    <RHFTextField name="username" label="Username" />
                  </Grid>
                  <Grid size={12}>
                    <RHFTextField type="password" name="password" label="Password" />
                  </Grid>
                  <Grid size={12}>
                    <RHFTextField type="password" name="re_password" label="Confirm Password" placeholder="Confirm Password" />
                  </Grid>
                  <Grid size={12}>
                    <Button disabled size="large" fullWidth variant="contained" type="submit">Sign Up</Button>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption">Already have an account? </Typography><RouterLink href="/login"><Typography component={"span"} variant="subtitle1" color="info">Sign In.</Typography></RouterLink>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page