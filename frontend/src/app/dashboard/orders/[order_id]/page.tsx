'use client'
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import RouterLink from '@/components/RouterLink/RouterLink'
import { ErrorToast, SuccessToast } from '@/components/ToastImpl/ToastImpl'
import { NORMAL_ICON_WIDTH, PAYMENT_GATEWAY, SMALL_ICON_WIDTH } from '@/config/constants'
import { CancelOrder_API, GetOrderById_API, SendOrderComment_API } from '@/services/order'
import { findNavigationByName } from '@/utils/navigation'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { redirect, useParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm, useFormContext, } from 'react-hook-form'
import useSWR from 'swr'

const Left_Content = ({ order, mutate }: any) => {

    const { getValues, reset } = useFormContext()

    const { order_status, id, order_items, created_datetime, comments } = order;

    const sendCommentHandler = async () => {
        const data = {
            "id": id,
            "content": getValues("comment")
        }

        try {
            const res = await SendOrderComment_API(data)
            if (res?.data?.data?.id) {
                SuccessToast({ message: "Send Comment Successfully!" })
                mutate();
                reset()
            }

        } catch (error) {

            const message = error instanceof Error ? error.message : String(error);
            ErrorToast({ message: message })
        }

    }

    const [confirm, setConfirm] = useState(false)
    const showCancelButton = order_status === "Pending"
    const cancelOrderHandler = async () => {
        try {
            const result = await CancelOrder_API(id);
            if (result?.data?.success) {
                await mutate()
                SuccessToast({ message: result.data?.message || "Order cancelled" });

            }
        } catch (error: any) {
            const message = typeof error === "object" ? String(error?.message) : String(error);
            ErrorToast({ message: message })
        } finally {
            setConfirm(false)
        }
    }

    const isExpired = order_status === "Expired"

    return <Box>
        <ConfirmDialog
            open={confirm}
            title={"Cancel order, Sure?"}
            okHandler={cancelOrderHandler}
            closeHandler={() => setConfirm(false)}
        />

        <Grid container sx={{
            borderRadius: "8px",
            boxShadow: "5px 5px 15px #d3d3d3",
            p: 3, mt: 2
        }}>
            <Grid size={12} container spacing={1}>
                <Grid size={12} container >
                    <Grid container sx={{ alignItems: "center", flexGrow: 1 }}>
                        <Typography variant='h6'>Order: #{id}</Typography>
                        <Chip size='small' color={isExpired ? 'error' : 'success'} label={order_status} />
                    </Grid>
                    {showCancelButton ? <Grid sx={{ textAlign: "right" }}>
                        <Button variant="contained" color="error" onClick={() => { setConfirm(true) }}>
                            Cancel Order
                        </Button>
                    </Grid> : null}
                </Grid>
                <Grid size={12}>
                    <Typography variant='caption' sx={{ pl: 1 }}>{new Date(created_datetime).toLocaleString()}</Typography>
                </Grid>
                <Grid size={12}>
                    <Typography variant='h6'>Order Detail:</Typography>
                </Grid>
            </Grid>
            <Grid size={12} container spacing={1}>
                <Grid size={12} sx={{ pt: 1 }}><Divider /></Grid>
                {order_items ? order_items.map((m: any, i: number) => {
                    const product_info = m.product;
                    const mainImg = product_info?.images.find((f: any) => f?.isMain);
                    const img = mainImg ? mainImg : product_info.images.length > 0 ? product_info.images[0] : null;
                    const imgUrl = img ? String(img?.image).startsWith("http") ? img.image : process.env.NEXT_PUBLIC_IMAGE_URL + img.image : null;
                    return <>
                        <Grid key={m.id + i} size={12}
                            container
                            sx={{
                                alignItems: "center",
                                textAlign: "center",
                                pt: 1
                            }}
                        >
                            <Grid
                                size={{ xs: 12, md: 9 }}
                                container
                            >
                                <Grid size={4}>
                                    {mainImg ?
                                        <CardMedia
                                            component={"img"}
                                            image={imgUrl}
                                            alt={product_info.name}
                                            sx={{
                                                objectFit: "contain",
                                            }}
                                            height={80}
                                            width={80}
                                        /> :
                                        <Image src={"/images/no_image.png"}
                                            height={80}
                                            width={80}
                                            style={{
                                                objectFit: "contain",

                                            }}
                                            alt={product_info.name}
                                        />
                                    }
                                </Grid>
                                <Grid size={8} container sx={{ alignItems: "center" }}>
                                    <Grid sx={{ textAlign: "left" }}>
                                        <Typography variant='h6' >
                                            {product_info.name}
                                        </Typography>
                                        <Typography variant='body2' noWrap>
                                            {product_info.description}
                                        </Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant={'subtitle1'} sx={{ display: { xs: "none", md: "block" } }}>
                                            ${m.priceAtPurchase}
                                        </Typography>
                                        <Typography variant={'h6'} sx={{ display: { xs: "block", md: "none" } }}>
                                            ${m.priceAtPurchase}
                                        </Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant='subtitle1'>
                                            &nbsp;  &times; {m.quantity}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                size={{ xs: 12, md: 3 }}
                                sx={{ display: { xs: "none", md: "block" } }}
                            >
                                <Typography variant='h6'>
                                    ${m.sub_total}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12} sx={{ pt: 1 }}><Divider /></Grid>
                    </>
                }) : null}


            </Grid>
        </Grid>
        <Grid container spacing={1} sx={{
            borderRadius: "8px",
            boxShadow: "5px 5px 15px #d3d3d3",
            p: 3, mt: 2
        }}>
            <Grid size={12} container sx={{ alignItems: "center" }}>
                <Grid size={6}>
                    <Typography variant='h6'>Comments:</Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                    <Button onClick={sendCommentHandler} variant="contained" size='large' color="success">Send Comment</Button>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Divider />
            </Grid>
            <Grid size={12}>
                <RHFTextField
                    name="comment"
                    multiline
                    fullWidth
                    minRows={4}
                />
            </Grid>
            <Grid size={12} container>
                {comments?.length > 0 ?
                    comments.map((m: any, i: number) => {
                        const isStaffReply = Boolean(m?.is_staff_reply);
                        return <Grid size={12} key={'comments' + m.id} sx={{ textAlign: isStaffReply ? "left" : "right" }}>
                            <Typography variant='h6'>
                                {isStaffReply ? "[Staff]" : null} {m?.username || "None"}:
                            </Typography>
                            <Typography variant='caption' sx={{ color: "gray" }}>
                                {new Date(m?.created_datetime).toLocaleString()}
                            </Typography>
                            <Typography variant='body1'>
                                {m.content}
                            </Typography>
                        </Grid>
                    })
                    : null}
            </Grid>
        </Grid>
    </Box >
}


const AlertContent = ({ status }: { status: string }) => {
    switch (status) {
        case "Cancelled":
            return <Alert severity="error">
                <AlertTitle>Cancel</AlertTitle>
                Cancelled
            </Alert>
        case "Expired":
            return <Alert severity="error">
                <AlertTitle>Expired</AlertTitle>
                Expired
            </Alert>
        default:
            <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Paid
            </Alert>
    }
}
const Right_Content = ({ order }: any) => {

    const order_info = order

    const member_info = order_info.user;

    const payment_info = order.payment;

    const isPaid = Boolean(payment_info?.id);

    const sessionIsActive = Boolean(order?.is_payment_session_active)

    // Payment Content
    const payment_method_icon = () => {
        const findIcon = PAYMENT_GATEWAY.find(f => f.name === order_info.payment_method);
        if (findIcon) {
            let width = findIcon?.name === "PayPal" ? SMALL_ICON_WIDTH : NORMAL_ICON_WIDTH;
            if (findIcon?.name === "Stripe") { width = 48 }
            return <IconifyImpl icon={findIcon?.icon} width={width} />
        }
        return null;
    }

    const Payment_Content = () => {
        const checkout_url = `${findNavigationByName("checkout")?.url}/return?session_id=${payment_info?.transaction_id}`;
        if (!payment_info) {
            return <>
                <Grid size={12}>
                    <Typography variant='h6'>Payment:</Typography>
                </Grid>
                <Grid size={6}>
                    <Typography variant='body1'>Method:</Typography>
                </Grid>
                <Grid size={6}>
                    <Typography variant='body1' sx={{ textAlign: "right" }}>N/A</Typography>
                </Grid>
            </>
        }
        return <Grid size={12} spacing={3} container sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Grid size={12}>
                <Typography variant='h6'>Payment:</Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant='body1'>Method:</Typography>
            </Grid>
            <Grid size={6} sx={{ textAlign: "right" }}>
                {payment_method_icon()}
            </Grid>
            <Grid size={6}>
                <Typography variant='body1'>Transaction id:</Typography>
            </Grid>
            <Grid size={6} >
                <RouterLink href={checkout_url} hover='underline'>
                    <Typography variant='body1' sx={{}} noWrap>{payment_info?.transaction_id}</Typography>
                </RouterLink>
            </Grid>
        </Grid>
    }

    const userImg = member_info?.profile_image;
    const imgUrl = String(userImg).startsWith("http") ? userImg : process.env.NEXT_PUBLIC_IMAGE_URL + userImg;
    const avatarStyles = { width: { xs: 110, md: 80 }, height: { xs: 110, md: 80 } };
    const profileImg = imgUrl ? <Avatar src={imgUrl} sx={avatarStyles} /> : <Avatar sx={avatarStyles}>{String(member_info?.username).charAt(0)}</Avatar>;

    return <Grid
        container
        sx={{
            borderRadius: "8px",
            boxShadow: "5px 5px 15px #d3d3d3",
            px: 3, pt: 2, pb: 4
        }}
        spacing={3}
    >
        <Grid size={12} container >
            <Grid size={12}>
                {!isPaid && order_info.order_status !== "Cancelled" && order_info.order_status !== "Expired" ?
                    <Button fullWidth variant="contained"
                        size='large' color="success"
                        type='submit'>
                        {sessionIsActive ? "Continue to pay" : "Checkout"}
                    </Button>
                    : <AlertContent status={order_info.order_status} />
                }
            </Grid>
            <Grid size={12}>
                <Divider />
            </Grid>
            <Grid size={12}>
                <Typography variant='h6'>Customer:</Typography>
            </Grid>
            <Grid
                size={12}
                container
                sx={{
                    p: 2,
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Grid size={{ xs: 5, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
                    {profileImg}
                </Grid>
                <Grid size={{ xs: "auto", md: 12 }}>
                    <Typography variant='h6'>{member_info?.username}</Typography>
                    <Typography variant='body2'>{member_info?.email}</Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid size={12}>
            <Divider />
        </Grid>
        <Grid size={12} container >
            <Grid size={12}>
                <Typography variant='h6'>Shipping:</Typography>
            </Grid>
            <Grid size={12} container>
                <Grid size={5}>
                    <Typography variant='body1'>
                        Address:
                    </Typography>
                </Grid>
                <Grid size={7} sx={{ textAlign: "right" }}>
                    <Typography variant='body1'>{order_info.shipping_address || "N/A"}</Typography>
                </Grid>
            </Grid>
            <Grid size={12} container>
                <Grid size={5}>
                    <Typography variant='body1'>
                        Tracking No.
                    </Typography>
                </Grid>
                <Grid size={7} sx={{ textAlign: "right" }}>
                    <Typography variant='body1'>{order_info.tracking_number || "N/A"}</Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid size={12}>
            <Divider />
        </Grid>
        <Grid size={12} container >
            <Payment_Content />
        </Grid>
        <Grid size={12}>
            <Divider />
        </Grid>
        <Grid size={12} container >
            <Grid size={12}>
                <Typography variant='h6'>Total Amount:</Typography>
            </Grid>
            <Grid size={12} container>
                <Grid size={6}>
                    <Typography variant='body1'>
                        Shipping fee:
                    </Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                    <Typography variant='h6'>${order_info.shipping_fee}</Typography>
                </Grid>
            </Grid>
            <Grid size={12} container>
                <Grid size={6}>
                    <Typography variant='body1'>
                        Discount:
                    </Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                    <Typography variant='h6'>${order_info.discount_amount}</Typography>
                </Grid>
            </Grid>
            <Grid size={12} container>
                <Grid size={6}>
                    <Typography variant='body1'>
                        Total:
                    </Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                    <Typography variant='h6'>${order_info.total_amount}</Typography>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

const Page = () => {

    const { order_id } = useParams()

    const { data: order, mutate } = useSWR(`/api/orders/order/${order_id}`, async () => (await GetOrderById_API(order_id as string))?.data?.data)


    const methods = useForm()

    const onSubmit = async () => {

        if (order_id) {
            redirect(`/dashboard/checkout?id=${order.id}`)
        } else {
            ErrorToast({ message: "Order not exist!" })
        }
    }




    return (
        <Box sx={{ mb: 10, mt: 6 }}>
            <BreadcrumbImpl breadcrumbs={[
                { name: "Dashboard" },
                { name: "Orders" },
                { name: "order#" + order_id?.toString() },

            ]} />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {order ? <Grid
                        container
                        spacing={3}
                        sx={{
                            display: "flex",
                            flexFlow: { xs: "column-reverse", md: "row" }
                        }}
                    >
                        <Grid
                            size={{
                                xs: 12, md: 8
                            }}
                        >
                            <Left_Content order={order} mutate={mutate} />
                        </Grid>
                        <Grid
                            size={{
                                xs: 12, md: 4
                            }}
                            sx={{ pt: 2, }}
                        >
                            <Right_Content order={order} />
                        </Grid>
                    </Grid> : null}
                </form>
            </FormProvider >
        </Box>
    )
}

export default Page