'use client'
import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import { ErrorToast, SuccessToast } from '@/components/ToastImpl/ToastImpl'
import { ACCESS_TOKEN, CONTAINER_MAX_WIDTH_MAIN, NORMAL_ICON_WIDTH, PAYMENT_GATEWAY } from '@/config/constants'
import { GetCart_API, RemoveCartItem_API } from '@/services/cart'
import { CreateOrder_API } from '@/services/order'
import { findNavigationByName } from '@/utils/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { redirect, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import z from 'zod'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'
import Badge from '@mui/material/Badge'
import { getCookie } from 'cookies-next'
import { useEffect } from 'react'


const Left_Content = ({ cart, mutate }: any) => {

  const router = useRouter();

  const products_list = cart.items;

  const removeCartItemHandler = async (id: any) => {
    try {
      const result = await RemoveCartItem_API(id)
      if (result.data?.success) {
        SuccessToast({ message: result.data?.message });
        mutate();
      } else {
        throw new Error(result.data?.message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ErrorToast({ message });
    }
  }

  return <Box>
    <Typography
      variant='h6'
      sx={{
        borderBottom: "3px solid black",
        py: 1, pl: 3, mb: 2, mt: 3
      }}
    >Cart
    </Typography>
    <Divider />
    <Grid container sx={{
      border: "1px solid #d3d3d3",
      p: 3,
      mt: 2
    }}>
      <Typography variant='h6'>Shopping Cart</Typography>
      <Grid size={12} container spacing={1}>
        <Grid
          size={12}
          container
          spacing={2}
          sx={{
            textAlign: "center",
            display: { xs: "none", md: "flex" }
          }}
        >
          <Grid size={6} sx={{ textAlign: "left" }}>Products</Grid>
          <Grid size={2}>Price</Grid>
          <Grid size={1}>Qty</Grid>
          <Grid size={2}>Total</Grid>
          <Grid size={1}></Grid>
        </Grid>
        <Grid size={12}><Divider /></Grid>
        <Grid size={12} container >
          {products_list ? products_list.map((m: any, i: number) => {
            const product = m.product;
            const product_url = `${findNavigationByName("products")?.url}/${product.id}`

            // check product is out of stock
            const isOutOfStock = Boolean(m.quantity > product.stock_quantity);

            // Performance
            const mainImg = product?.images.find((f: any) => f?.isMain);
            const img = mainImg ? mainImg : product.images.length > 0 ? product.images[0] : null;
            const imgUrl = img ? String(img.image).startsWith("http") ? img.image : process.env.NEXT_PUBLIC_IMAGE_URL + img.image : null;
            return <Box key={'left' + product?.name + i}
              sx={{ width: "100%" }}
            >
              <Grid
                container size={12}
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  display: { xs: "none", md: "flex" },
                  width: "100%"
                }}
                spacing={2}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <Grid container spacing={2} sx={{
                    alignItems: "center"
                    , textWrap: "wrap"
                  }}>
                    <ButtonBase
                      sx={{
                        width: "100%",
                        "&:hover": {
                          opacity: .5,
                          textDecoration: "underline"
                        }
                      }}
                      onClick={() => {
                        router.push(product_url)
                      }}
                    >
                      <Grid>

                        {mainImg ?
                          <CardMedia
                            component={"img"}
                            image={imgUrl}
                            alt={product.name}
                            sx={{
                              objectFit: "contain",
                            }}
                            height={154}
                            width={154}
                          /> :
                          <Image src={"/images/no_image.png"}
                            height={154}
                            width={154}
                            style={{
                              objectFit: "contain",

                            }}
                            alt={product.name}
                          />
                        }

                      </Grid>
                      <Grid sx={{ flex: 1, alignItems: "center", textAlign: "left" }}>
                        <Typography variant='subtitle2' >
                          {product.name}
                        </Typography>
                        <Typography variant='subtitle1' noWrap>
                          {product.description}
                        </Typography>
                      </Grid>
                    </ButtonBase>
                  </Grid>
                </Grid >
                <Grid size={{ xs: 12, md: 2 }}>${product.price}</Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Grid container sx={{
                    alignItems: "center", justifyContent: "center",
                    color: isOutOfStock ? "red" : "inherit"
                  }}>
                    {isOutOfStock ?
                      <Badge color="error">
                        <IconifyImpl
                          icon={"material-symbols:report-outline"}
                          width={NORMAL_ICON_WIDTH}
                        />
                      </Badge>
                      : null}
                    <Typography variant='body1' component={"span"}>
                      {m.quantity}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>${product.price * m.quantity}</Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <IconButton color="error" onClick={() => removeCartItemHandler(m.id)}>
                    <IconifyImpl icon={"material-symbols:delete"} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                container
                size={12}
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  display: { xs: "flex", md: "none" }
                }}
                spacing={2}
              >
                <Grid size={12} container spacing={2} sx={{
                  alignItems: "center"
                  , textWrap: "wrap"
                }}>
                  <Grid size={12} container>
                    <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
                      {mainImg ?
                        <CardMedia
                          component={"img"}
                          image={imgUrl}
                          alt={product.name}
                          sx={{
                            objectFit: "contain",
                          }}
                          height={154}
                          width={154}
                        /> :
                        <Image src={"/images/no_image.png"}
                          height={154}
                          width={154}
                          style={{
                            objectFit: "contain",
                          }}
                          alt={product.name}
                        />
                      }
                    </Grid>
                    <Grid size={12}>
                      <Typography variant='h6' >
                        {product.name}
                      </Typography>
                      <Typography variant='subtitle1' noWrap>
                        {product.description}
                      </Typography>
                    </Grid>
                    <Grid size={12} container sx={{ alignItems: "center", justifyContent: "center" }}>
                      <Grid >
                        <Typography variant='h6'>
                          ${product.price}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Grid container sx={{
                          alignItems: "center", justifyContent: "center",
                          color: isOutOfStock ? "red" : "inherit"
                        }}>
                          <Typography variant='h6' component={"span"}>
                            &times; {m.quantity}
                          </Typography>
                          {isOutOfStock ? <Badge color="error">
                            <IconifyImpl
                              icon={"material-symbols:report-outline"}
                              width={NORMAL_ICON_WIDTH}
                            />
                          </Badge> : null}
                        </Grid>
                      </Grid>
                      <Grid>
                        <IconButton color="error" onClick={() => removeCartItemHandler(m.id)}>
                          <IconifyImpl icon={"material-symbols:delete"} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid >
                <Grid size={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Box>
          })
            : null}
        </Grid>
      </Grid>
    </Grid>
  </Box >
}

const Right_Content = ({ cart }: any) => {

  // Performance
  const payment_gateway = PAYMENT_GATEWAY.map(m => {
    let iconWidth = 42;
    if (m.name === "PayPal") {
      iconWidth = 36
    }
    return <Box key={m.name}>
      <IconifyImpl icon={m.icon} width={iconWidth} />
    </Box>
  })

  return <Grid
    container
    sx={{
      border: "1px solid #d3d3d3",
      pt: 4, px: 6, pb: 10
    }}
    spacing={3}
  >
    {/* <Grid size={12} container >
      <Grid size={12}>
        <Typography variant='h6'>Promotions:</Typography>
      </Grid>
      <Grid size={12} container sx={{ display: "flex", alignItems: "center" }}>
        <Grid size={9}>
          <RHFTextField name='prom_code' label="Promotion Code" />
        </Grid>
        <Grid size={3} >
          <Button fullWidth variant="contained">Apply</Button>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Button variant='contained' fullWidth>View All Promos</Button>
      </Grid>
    </Grid>
    <Grid size={12}>
      <Divider />
    </Grid> */}
    <Grid size={12} container >
      <Grid size={12}>
        <Typography variant='h6'>Shipp Address:</Typography>
      </Grid>
      <Grid size={12}>
        <RHFTextField name='shipping_address' label="Shipp Address" />
      </Grid>
    </Grid>
    <Grid size={12}>
      <Divider />
    </Grid>
    <Grid size={12} container spacing={1}>
      <Grid size={12}>
        <Typography variant='h6'>Cart:</Typography>
      </Grid>
      {/* <Grid size={6}>
        <Typography variant='body1'>SubTotal:</Typography>
      </Grid>
      <Grid size={6} sx={{ textAlign: "right" }}>
        <Typography variant='subtitle2'>$1200</Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant='body1'>Discount:</Typography>
      </Grid>
      <Grid size={6} sx={{ textAlign: "right" }}>
        <Typography variant='subtitle2'>$300</Typography>
      </Grid> */}
      <Grid size={6}>
        <Typography variant='h6'>Total:</Typography>
      </Grid>
      <Grid size={6} sx={{ textAlign: "right", mb: 2 }}>
        <Typography variant='h6'>${cart.total}</Typography>
      </Grid>
      <Grid size={12} >
        <Button type='submit' size='large' variant="contained" fullWidth>Create Order</Button>
      </Grid>
      <Grid size={12} sx={{ mt: 2, mb: 1 }}>
        <Divider />
      </Grid>
      <Typography variant='h6'>
        Payment Methods:
      </Typography>
      <Grid size={12} container spacing={2} sx={{ alignItems: "center" }}>
        {payment_gateway}
      </Grid>
    </Grid>
  </Grid>
}

const Page = () => {

  const router = useRouter();

  const token = getCookie(ACCESS_TOKEN);
  const isLogin = Boolean(token)

  const { data: cart, mutate } = useSWR('/api/cart/', async () => (await GetCart_API())?.data?.data)

  useEffect(() => {
    if (token) {
      mutate() 
    }
  }, [token])

  const schema = z.object({
    shipping_address: z.string().nonempty(),
  });
  const methods = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: any) => {
    try {

      const cartItems = cart?.items || [];

      // Validation 
      // check the cart items count
      if (!cartItems.length) {
        ErrorToast({ message: "Can not Checkout! Cart is empty." });
        return;
      }

      // check product item is out of stock
      let hasProductIsOutOfStock = false;
      for (const item of cartItems) {
        if (item?.quantity > item?.product?.stock_quantity) {
          hasProductIsOutOfStock = true;
          break;
        }
      }
      if (hasProductIsOutOfStock) {
        ErrorToast({ message: "Error! have product is out of stock." });
        return;
      }

      const result = await CreateOrder_API(data)
      SuccessToast({ message: "Created Order!" })
      const nextUrl = `${findNavigationByName("Orders")?.url}/${result?.data?.data.id}`
      router.push(nextUrl);
      mutate()

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ErrorToast({ message });
    }

  }

  if(!isLogin) {
    redirect("/login")
  }

  return (
    <BasePageComponent
      maxWidth={CONTAINER_MAX_WIDTH_MAIN}
      innerStyles={{}}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={3}>
              {cart ?
                <>
                  <Grid size={{ xs: 12, md: 8 }} sx={{}}>
                    <Left_Content cart={cart} mutate={mutate} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ py: 2, }}>
                    <Right_Content cart={cart} />
                  </Grid>
                </>
                : null}
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </BasePageComponent >
  )
}

export default Page