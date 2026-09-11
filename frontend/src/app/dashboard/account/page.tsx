"use client"
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import { ErrorToast, SuccessToast } from '@/components/ToastImpl/ToastImpl'
import { NORMAL_ICON_WIDTH } from '@/config/constants'
import { ChangePassword_API, GetAccountDetail_API, UpdateAccountDetail_API } from '@/services/users'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { getCookie } from 'cookies-next'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import useSWR from 'swr'

const Avatar_Box = ({ field_Prefix }: { field_Prefix: string }) => {

    const { control, setValue } = useFormContext()

    const avatar_field_name = `${field_Prefix}.profile_image`

    const profileImage = useWatch({ control, name: avatar_field_name })

    const [preview, setPreview] = useState<string | undefined>();


    const displaySrc = useMemo(() => {

        if (preview) return preview
        if (!profileImage) return undefined
        if (typeof profileImage !== 'string') return undefined
        if (profileImage.startsWith('http') || profileImage.startsWith('data:')) {
            return profileImage
        }
        return `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}${profileImage}`
    }, [preview, profileImage])


    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Read the file as a data URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setValue(avatar_field_name, file, { shouldDirty: true })
        }
    };


    const avatar_resize = { xs: 140, sm: 130 }

    return <ButtonBase
        component="label"
        sx={{
            borderRadius: '50%',
        }}
    >
        <Avatar
            alt="Upload new avatar"
            src={displaySrc}
            sx={{
                width: avatar_resize,
                height: avatar_resize
            }}
        />
        <input
            type="file"
            accept="image/*"
            style={{
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
            }}
            onChange={handleAvatarChange}
        />
    </ButtonBase>
}

const General_Content = ({ field_Prefix }: { field_Prefix: string }) => {

    return <Grid container spacing={4} >
        <Grid
            size={{
                xs: 12, sm: 5, md: 4, lg: 3
            }}
            sx={{
                py: { xs: 4, sm: 5 },
                textAlign: "center",
                borderRadius: "10px",
                boxShadow: '0px 8px 30px #d3d3d3',
            }}
        >
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                <Grid size={12}>
                    <Avatar_Box field_Prefix={'general'} />
                </Grid>
                <Grid >
                    <Typography variant='caption' sx={{ color: "gray", }}>
                        Allowed *.jpeg, *.jpg, <br />*.png, *.gif
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid
            size={{
                xs: 12, sm: 7, md: 7, lg: 6
            }}
            sx={{
                borderRadius: "10px",
                px: 2, py: 3,
                boxShadow: '0px 8px 30px #d3d3d3'
            }}
        >
            <Grid container spacing={3}>
                <Grid size={{
                    xs: 12, sm: 12
                }}>
                    <RHFTextField disabled label={"Username"} name={`${field_Prefix}.username`} />
                </Grid>
                <Grid size={{
                    xs: 12, sm: 12
                }}>
                    <RHFTextField label={"Email"} name={`${field_Prefix}.email`} />
                </Grid>
                <Grid size={{
                    xs: 12, sm: 12
                }}>
                    <RHFTextField label={"Phone"} name={`${field_Prefix}.phone_number`} />
                </Grid>
                <Grid size={12}>
                    <RHFTextField
                        label={"Description"}
                        name={`${field_Prefix}.description`}
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid size={12} sx={{ display: { xs: "block", sm: "none" } }}>
                    <Button fullWidth color="success" size="large" variant="contained" type='submit'>Save </Button>
                </Grid>
            </Grid>
        </Grid>

    </Grid >
}

const Address_Content = ({ field_Prefix }: { field_Prefix: string }) => {
    const { getValues } = useFormContext()
    const Address_list = getValues(field_Prefix);

    const Address_Box = ({ address_info }: { address_info: any }) => {

        // {
        //     "city": "Kowloon",
        //     "region": "Hong Kong",
        //     "state": "Kwun Tong",
        //     "address_line_1": "Kwun Tong, Wong Tze Building 8/F, 801 Room.",
        //     "address_line_2": "Kwun Tong, Wong Tze Building 8/F, 801 Room.",
        //     "zip_code": "000000"
        // }

        return (
            <Box sx={{ py: 2, px: 4 }}>
                <Grid container>
                    <Grid size={12} container sx={{ alignItems: "center" }}>
                        <Grid size={9}>
                            <Typography variant='h6'>{address_info.name}</Typography>
                        </Grid>
                        <Grid size={3} sx={{ textAlign: "right" }}>
                            <ButtonBase disableRipple sx={{
                                mt: 1,
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "green",
                                    opacity: .8
                                }
                            }}
                                onClick={() => { console.log(address_info) }}
                            >
                                <IconifyImpl icon={"qlementine-icons:menu-dots-24"} width={NORMAL_ICON_WIDTH} />
                            </ButtonBase>
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='caption'>{address_info.address_line_1}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='caption'>{address_info.city}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='caption'>{address_info.region}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='caption'>{address_info.zip_code}</Typography>
                    </Grid>

                </Grid>
            </Box>
        )
    }

    const render_Address_list = Address_list.map((m: any, i: number) => <Grid
        key={m + i}
        size={8}
        sx={{
            borderRadius: "10px",
            boxShadow: "0px 8px 30px #d3d3d3"
        }}
    >

        <Address_Box address_info={m} />
    </Grid>);

    return <Box>
        <Typography variant='h6'>
            Address Books:
        </Typography>
        <Grid container spacing={3} sx={{ justifyContent: "left", mt: 2 }}>


            {render_Address_list}
        </Grid>
    </Box>
}

const Security_Content = ({ field_Prefix }: { field_Prefix: string }) => {
    return <Box sx={{ height: "100%" }}>
        <Grid container size={{
            xs: 12, sm: 9, md: 7, lg: 6
        }} spacing={3}>
            <Grid size={12}>
                <RHFTextField size="medium" type='password' name={`${field_Prefix}.old_password`} label="Old Password" />
            </Grid>
            <Grid size={12}>
                <RHFTextField size="medium" type='password' name={`${field_Prefix}.new_password`} label="New Password" />
            </Grid>
            <Grid size={12}>
                <RHFTextField size="medium" type='password' name={`${field_Prefix}.re_password`} label="Confirm Password" />
            </Grid>
            <Grid size={12} sx={{ display: { xs: "block", sm: "none" } }}>
                <Button fullWidth color="success" size="large" variant="contained" type='submit'>Save </Button>
            </Grid>
        </Grid>
    </Box>
}

const Account = () => {

    // get user info from token
    // can set to redux
    const jwtPayload = getCookie("access_token")?.toString().split(".")[1]
    const payload = jwtPayload ? atob(jwtPayload?.toString()) : null;
    const user_info = payload ? JSON.parse(payload) : null;

    const methods = useForm({
        defaultValues: {
            "general": user_info,
            "main_address": {},
            "address_list": {},
            "security_info": {}
        }
    })

    const { reset, setError,getValues } = methods

    const { data, error, isLoading, mutate } = useSWR(`/api/users/account/${user_info?.user_id}/`, async () => {
        const res = (await GetAccountDetail_API(user_info?.user_id))?.data;
        return res;
    },
        { revalidateOnFocus: true }
    )

    useEffect(() => {
        if (!data) return;
        const {
            id, username, email, phone_number, description, profile_image
        } = data.data
        reset({
            general: {
                id: id,
                username: username,
                email: email,
                phone_number: phone_number,
                description: description,
                profile_image: profile_image,
            },
            security_info: {},
        })
    }, [data, reset])



    const onSubmit = async (data: any) => {
        try {
            let successMsg = "Update Successed!"
            let isSuccess = false;

            switch (selectedTab) {
                // general
                case Account_Page_Tabs[0].name:


                    const formData = new FormData()
                    formData.append("id", data.general.id)
                    formData.append("username", data.general.username)
                    formData.append("email", data.general.email)
                    formData.append("phone_number", data.general.phone_number)
                    formData.append("description", data.general.description)
                    const profile_image = data.general.profile_image;
                    if (typeof profile_image !== "string" && profile_image) {
                        formData.append("profile_image", data.general.profile_image)
                    }


                    const result = await UpdateAccountDetail_API(data.general.id, formData)
                    if (result?.data?.id) {
                        isSuccess = true;
                        successMsg = "Update Account Success!"
                    }
                    break
                //security
                case Account_Page_Tabs[1].name:
                    const temp_data = {
                        id: data.general.id,
                        ...data.security_info
                    }
                    const res = await ChangePassword_API(temp_data)
                    if (res?.data?.success) {
                        isSuccess = true;
                        successMsg = "Change Password Success!"
                    }
                    break
            }

            if (isSuccess) {
                SuccessToast({ message: successMsg })
                await mutate()
            }

        } catch (error: any) {

            let errorMsg = "Changes Failed!";
            if (error?.message && typeof error.message === "object") {
                const errorList = Object.entries(error?.message);
                if (errorList.length > 0) {
                    for (const [key, value] of errorList) {
                        const keyName = selectedTab + "_info." + key;
                        const errStr = value && Array.isArray(value) ? value[0] : null;
                        setError(keyName as any, {
                            type: "manual",
                            message: errStr as string,
                        })
                    }
                }
            } else {
                errorMsg = error?.message || "Something went wrong";
            }
            ErrorToast({ message: errorMsg })

        }

    }


    const Account_Page_Tabs = [
        { label: "General", name: "general", icon: "bi:person-vcard-fill", iconWidth: NORMAL_ICON_WIDTH },
        // { label: "Address", name: "address", icon: "fa-solid:address-book", iconWidth: SMALL_ICON_WIDTH },
        { label: "Security", name: "security", icon: "mynaui:lock-password", iconWidth: NORMAL_ICON_WIDTH },
    ]

    const [selectedTab, setSelectedTab] = useState(Account_Page_Tabs[0].name);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    const renderContentByValue = (tabVal: string) => {
        let field_Prefix = tabVal;

        switch (tabVal) {
            case Account_Page_Tabs[0].name:
                return <General_Content field_Prefix={field_Prefix}
                />

            // case Account_Page_Tabs[1].name:
            //     field_Prefix += "_list";
            //     return <Address_Content field_Prefix={field_Prefix} />

            case Account_Page_Tabs[1].name:
                field_Prefix += "_info";
                return <Security_Content field_Prefix={field_Prefix} />

            default:
                return <Typography variant='h6' color='error'>Not Found!</Typography>

        }
    }


    return (
        <Box sx={{ p: 3, height: "100%" }}>
            <Typography variant='h6'>Account</Typography>
            <BreadcrumbImpl breadcrumbs={[{ name: "Dashboard" }, { name: "Account" }]} />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Tabs value={selectedTab} onChange={handleChange}
                        textColor="inherit"
                        slotProps={{
                            indicator: {
                                style: {
                                    backgroundColor: "black"
                                }
                            }
                        }}
                    >
                        {Account_Page_Tabs.map((m, i) => <Tab key={m.name + i}
                            icon={<IconifyImpl icon={m.icon} width={m.iconWidth} />}
                            label={m.label}
                            value={m.name}
                            iconPosition="top"
                            color="success"
                        />
                        )}
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Button sx={{ display: { xs: "none", sm: "block" } }} color="success" size="large" variant="contained" type='submit'>Save Changes</Button>
                        </Box>

                    </Tabs>

                    <Box sx={{ py: 2, height: "100%" }}>
                        {isLoading ? <Typography>Loading...</Typography> : renderContentByValue(selectedTab)}
                    </Box>
                </form>
            </FormProvider>
        </Box>
    )
}

export default Account