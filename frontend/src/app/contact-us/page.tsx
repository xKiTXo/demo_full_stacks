"use client"
import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import { ErrorToast, SuccessToast } from '@/components/ToastImpl/ToastImpl'
import { CONTAINER_MAX_WIDTH_CONTENT, CONTAINER_MAX_WIDTH_MAIN, MIN_HEIGHT } from '@/config/constants'
import { ContactUs_API } from '@/services/users'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const ContactForm = () => {


        return <Grid
            container
            size={8}
            spacing={3}
            sx={{
                px: 5,
                pt: { xs: 0, md: 3 },
                flexFlow: { xs: "column-reverse", md: "row" }
            }}
        >

            <Grid
                container
                size={{ xs: 12, md: 6 }}
                sx={{ mb: { xs: 12, md: 0 } }}
            >
                <Grid size={12}>
                    <Typography variant='h6'>Contact Form</Typography>
                </Grid>
                <Grid size={12}>
                    <RHFTextField name='name' label="Name" />
                </Grid>
                <Grid size={12}>
                    <RHFTextField type="email" name='email' label="Email" />
                </Grid>
                <Grid size={12}>
                    <RHFTextField name='phone' label="Phone" />
                </Grid>
                <Grid size={12}>
                    <RHFTextField name='subject' label="Subject" />
                </Grid>
                <Grid size={12}>
                    <RHFTextField
                        name='message'
                        placeholder='Enter your message here.'
                        minRows={5}
                        multiline={true}
                    />
                </Grid>
                <Grid size={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        size="large"
                    >
                        Send
                    </Button>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: { xs: 200, sm: 400, md: "90%" } }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d922.7815362411285!2d114.22444336954922!3d22.311068539435073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34040145637bb059%3A0xa24056f12fd1e73f!2z5Lmd6b6N6KeA5aGY546L5a2Q5aSn5buI!5e0!3m2!1szh-TW!2shk!4v1787277575192!5m2!1szh-TW!2shk"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading={'lazy'}
                        referrerPolicy={'strict-origin-when-cross-origin'}
                    ></iframe>
                </Box>
            </Grid>
        </Grid>
    }

const Page = () => {

    const scheme = z.object({
        name: z.string().trim().min(1),
        email: z.email({ pattern: z.regexes.html5Email }),
        subject: z.string().trim().min(1),
        message: z.string().trim().min(1),
    })

    const methods = useForm({
        resolver: zodResolver(scheme),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        }
    })

    const {
        reset
    } = methods


    const submitHandler = async (data: any) => {
        try {
            const result = await ContactUs_API(data)
            if (result?.data?.id) {
                SuccessToast({
                    message: "Sent Successfully!"
                })
                reset()
            } else {
                throw new Error("")
            }

        } catch (error) {
            ErrorToast({
                message: "Send Contact Failed!"
            })
        }
    }

    

    return (
        <BasePageComponent
            maxWidth={CONTAINER_MAX_WIDTH_CONTENT}
        >
            <BreadcrumbImpl
                breadcrumbs={[
                    { name: "Home" },
                    { name: "Contact US" },
                ]}
                sx={{
                    pt: 3,
                    borderRadius: "4px",
                    pl: 2,
                }}
            />

            <Box sx={{
                minHeight: MIN_HEIGHT,
                display: "flex",
                justifyContent: "center",
                pt: 8
            }}>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(submitHandler)}>
                        <ContactForm />
                    </form>
                </FormProvider>
            </Box>
        </BasePageComponent>
    )
}

export default Page