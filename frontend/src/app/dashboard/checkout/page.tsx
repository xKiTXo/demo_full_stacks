"use client"
import { Suspense, useCallback, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { CreateCheckoutSession_API } from '@/services/payment';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import { GetOrderById_API } from '@/services/order';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl';
import { findNavigationByName } from '@/utils/navigation';
import Typography from '@mui/material/Typography';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY || "")


const CheckoutContent = () => {
  const searchParams = useSearchParams()
  const order_id = searchParams.get("id")
  type Order = {
    id: string;
  } | null;
  const [order, setOrder] = useState<Order>(null);
  const [isLoading, setLoading] = useState(true)


  const { data, mutate } = useSWR(`/api/orders/order/${order_id}`, async () => {
    const res = (await GetOrderById_API(order_id))?.data;
    const tempData = {
      id: res.data.id
    }
    setOrder(tempData);
    return tempData;
  })



  const fetchClientSecret = useCallback(async () => {
    if (!order) { throw new Error("Not loaded Order data!"); }
    const res = await CreateCheckoutSession_API(order).then((res) => {
      return res?.data?.data.clientSecret;
    });
    setLoading(false)
    return res
  }, [order]);

  // Performance
  useEffect(() => {
    if (data) {
      fetchClientSecret()
    }
  }, [data])

  useEffect(() => {
    mutate()
  }, [])

  return <Box sx={{ p: 3 }}>
    <Typography variant='h6'>Checkout</Typography>
    <BreadcrumbImpl breadcrumbs={[
      { name: "Dashboard" },
      { name: "Orders" },
      { name: `Order#${order_id}`, url: findNavigationByName("Orders")?.url + "/" + order_id },
      { name: `Cehckout#${order_id}` },
    ]} />
    <Box sx={{
      mt: 2,
      mb: 3,
      p: 3,
      borderRadius: "10px",
      boxShadow: "5px 5px 15px #d3d3d3"
    }}>
      {!isLoading ? <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider> : null}
    </Box>
  </Box>
}


const Page = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}

export default Page