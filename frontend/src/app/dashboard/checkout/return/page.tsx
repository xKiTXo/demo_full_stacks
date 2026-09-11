'use client'
import BreadcrumbImpl from "@/components/Breadcrumbs/BreadcrumbImpl";
import IconifyImpl from "@/components/IconifyImpl/IconifyImpl";
import { ErrorToast, SuccessToast } from "@/components/ToastImpl/ToastImpl";
import { SessionStatus_API } from "@/services/payment";
import { findNavigationByName } from "@/utils/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";


const ReturnContent = () => {

    type OrderReturnData = {
        order_detail: {
            id: string | number;
            payment: any;
            total_amount: string;
            payment_method: string;
            created_datetime: string;
        };
        status: string
    } | null;

    const [data, setData] = useState<OrderReturnData>(null);
    const searchParams = useSearchParams();

    const router = useRouter()
    const viewOrderHandler = useCallback(() => {
        const orderUrl = `${findNavigationByName("orders")?.url}/${data?.order_detail?.id}`
        router.push(orderUrl)
    }, [data])

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        SessionStatus_API(sessionId || "").then((res) => {
            setData(res?.data?.data);
        });
    }, []);

    if (data?.status === 'open') {
        if (data?.order_detail?.id) {
            ErrorToast({ message: "The payment is open." })
            redirect(`${findNavigationByName("checkout")?.url}?id=${data?.order_detail?.id}`)
        }
        ErrorToast({ message: "Not found the payment! back to orders page." })
        redirect(`${findNavigationByName("orders")?.url}`)
    }

    if (data?.status === 'complete') {

        // SuccessToast({ message: "Payment Successfully!" })
        const order_detail = data?.order_detail || {};
        const payment_info = order_detail?.payment || {};
        return (
            <Box sx={{ height: "100%", p: 3 }}>
                <Typography variant='h6'>Checkout</Typography>
                <BreadcrumbImpl
                    breadcrumbs={[
                        { name: "Dashboard" },
                        { name: "Checkout" }
                    ]}
                />
                <Box sx={{
                    maxWidth: 460,
                    mt: 3, pt: 3, pb: 6, px: 6, textAlign: "center",
                    boxShadow: "5px 5px 15px #d3d3d3", borderRadius: "10px"
                }}>
                    <Grid container spacing={3}>
                        <Grid size={12} sx={{ display: { xs: "none", md: "block" } }}>
                            <IconifyImpl icon={"ep:success-filled"} width={200} color="green" />
                        </Grid>
                        <Grid size={12} sx={{ display: { xs: "block", md: "none" } }}>
                            <IconifyImpl icon={"ep:success-filled"} width={140} color="green" />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="h4">
                                ${order_detail?.total_amount}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="h6">
                                Order #{order_detail?.id} Paid.
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Divider />
                        </Grid>
                        <Grid size={12} container sx={{ justifyContent: "space-between" }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body1" sx={{ textAlign: { xs: "center", md: "left" } }}>
                                    Transaction id:
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "right" } }}>
                                <Typography variant="subtitle2" noWrap>
                                    {payment_info?.transaction_id || "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12} container sx={{ justifyContent: "space-between" }}>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                                <Typography variant="body1">
                                    Payment method:
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "right" } }}>
                                <Typography variant="subtitle2">
                                    {order_detail?.payment_method || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12} container sx={{ justifyContent: "space-between" }}>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                                <Typography variant="body1">
                                    Created at:
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: "center", md: "right" } }}>
                                <Typography variant="subtitle2">
                                    {new Date(order_detail?.created_datetime)?.toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Button size="large" fullWidth variant="contained" color="success" onClick={viewOrderHandler}>
                                View Order
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }

    return null;
}


const Return = () => {

    return <Suspense fallback={<div>Loading...</div>}>
        <ReturnContent />
    </Suspense>;
}

export default Return