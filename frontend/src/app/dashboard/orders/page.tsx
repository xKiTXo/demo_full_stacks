'use client'
import Box from '@mui/material/Box';
import useSWR from 'swr';
import { GetOrders_API } from '@/services/order';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RouterLink from '@/components/RouterLink/RouterLink';
import { findNavigationByName } from '@/utils/navigation';
import Alert from '@mui/material/Alert';
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl';


const Order_List_Content = ({ list }: any) => {
  const OrderItem = ({ item }: any) => {


    const renderOrderStatus = (status: string) => {
      switch (status) {
        case "Pending":
          return <Alert severity="info" variant="filled" >Wait Payment</Alert>;
        case "Expired":
          return <Alert severity="error" variant="filled">Expired</Alert>;
        default:
          return <Alert severity="success" variant="filled">Success</Alert>;
      }
    }

    return <Box
      sx={{
        boxShadow: "5px 5px 15px #d3d3d3",
        p: 3,
        borderRadius: "10px",
        "&:hover": {
          opacity: .5
        }
      }}
    >
      <Grid container
        sx={{
          justifyContent: "space-between",
          flexFlow: { xs: "column-reverse", sm: 'row' }
        }}
        spacing={1}
      >
        <Grid size={{ xs: 12, sm: 7 }}>
          <Typography variant='h6'>Order: #{item.id}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          {renderOrderStatus(item?.order_status)}
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid size={12} >
          <Typography variant='h6'>Total: ${item.total_amount}</Typography>
        </Grid>
        <Grid size={7}>
          <Typography variant='subtitle1'>Order:</Typography>
        </Grid>
        <Grid size={5} sx={{ textAlign: { xs: "right" } }}>
          <Typography variant='subtitle1'>{item.order_status}</Typography>
        </Grid>
        <Grid size={7}>
          <Typography variant='subtitle1'>Payment:</Typography>
        </Grid>
        <Grid size={5} sx={{ textAlign: { xs: "right" } }}>
          <Typography variant='subtitle1'>{item?.payment?.status || "N/A"}</Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant='caption'>Updated at: {new Date(item.updated_datetime).toLocaleString()}</Typography>
        </Grid>
      </Grid>
    </Box>
  }

  return <Grid container spacing={3} sx={{ p: { xs: 2, md: 3 }, height: "100%", overflowY: "auto" }}>
    {list?.map((m: any, i: number) => {
      const nextUrl = `${findNavigationByName("Orders")?.url}/${m.id}`
      return <Grid key={m.id + i} size={{ xs: 12, sm: 12, md: 10, lg: 9 }} >
        <RouterLink href={nextUrl} hover={"none"}>
          <OrderItem item={m} />
        </RouterLink>
      </Grid>
    })}

  </Grid>
}

const Page = () => {

  const { data: order_list } = useSWR(`/api/orders/`, async () => {
    return (await GetOrders_API())?.data?.data;
  })



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h6'>Orders</Typography>
      <BreadcrumbImpl breadcrumbs={[{ name: "Dashboard" }, { name: "Orders" }]} />
      {order_list ?
        <Order_List_Content list={order_list} />
        : null}
    </Box>
  )
}

export default Page