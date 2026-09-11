'use client'
import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import { ACCESS_TOKEN, CONTAINER_MAX_WIDTH_MAIN, MIN_HEIGHT, } from '@/config/constants'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ButtonGroup from '@mui/material/ButtonGroup'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper';
import RouterLink from '@/components/RouterLink/RouterLink'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { Product_API } from '@/services/products'
import { CustomToast, ErrorToast, SuccessToast } from '@/components/ToastImpl/ToastImpl'
import { AddCartItem_API } from '@/services/cart'
import Image from 'next/image'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import { getCookie } from 'cookies-next'
import { findNavigationByName } from '@/utils/navigation'

const Main_Content = ({ product }: { product: any }) => {
  // console.log("🚀 ~ Main_Content ~ product:", product)
  const mainImg = product.images.find((f: any) => f?.isMain);
  const img = mainImg ? mainImg : product.images.length > 0 ? product.images[0] : null;
  const productStockQuantity = product.stock_quantity;

  const { setValues, getValues, watch, setValue } = useFormContext()

  const countValue = getValues("count");
  const isStockEnough = Boolean(countValue < productStockQuantity);
  const isValidCount = (number: number) => number > 1

  const checkStock = (number: number) => {
    if (!isValidCount(number)) {
      setValue("count", 1)
      return;
    }
    if (!(number > productStockQuantity)) {
      setValue("count", number)
    } else {
      setValue("count", productStockQuantity)
    }
  }

  const countOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    let newValue = Number(event.target.value);
    checkStock(newValue)
  }

  return <>
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ textAlign: "center" }}>
        {img?.image ?
          <CardMedia
            component={"img"}
            image={img.image}
            alt=""
            width={350}
            height={350}
            sx={{ objectFit: "contain" }}
          /> :
          <Image src={"/images/no_image.png"}
            width={350}
            height={350}
            style={{
              objectFit: "contain",
            }}
            alt={product.name}
          />
        }
      </Box>

    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid size={12}>
          <Chip variant="filled" label="Computer" color="info" />
        </Grid>
        <Grid size={12}>
          <Typography variant='subtitle2'>{product?.brand_name}</Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant='h6'>{product?.name}</Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant='h6'>${product?.price}</Typography>
        </Grid>
        {/* <Grid size={12}>
          <Typography variant='body1'>{product?.description}</Typography>
        </Grid> */}
        <Grid size={12} container>
          <Grid>Quantity</Grid>
          <Grid sx={{ textAlign: "right", flexGrow: 1 }}>
            <ButtonGroup color="inherit" size="small" sx={{ bgcolor: "white", border: "1px solid #d3d3d3", borderRadius: "6px" }}>
              <Button
                variant="text"
                onClick={() => setValues((data) => {
                  let tempData = { ...data };
                  tempData.count = Number(tempData.count);
                  if (data.count > 0) {
                    tempData.count = Number(tempData.count) - 1
                  }
                  return tempData
                })}
                disabled={!isValidCount(Number(countValue))}
              ><IconifyImpl icon={"ri:subtract-fill"} width={16} /></Button>
              <Typography variant='subtitle1' sx={{ px: 2, bgcolor: "#d3d3d3" }}>{watch("count")}</Typography>
              <Button
                variant="text"
                onClick={() => checkStock(Number(countValue) + 1)}
                disabled={!isStockEnough}
              >
                <IconifyImpl icon={"material-symbols:add"} width={16} />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid size={12}>
          <RHFTextField name='count' type="number" onChange={countOnChange} />
        </Grid>
        <Grid size={12} sx={{ textAlign: "right" }}>
          <Typography variant='caption'>Available: {product?.stock_quantity}</Typography>
        </Grid>
        <Grid size={12}>
          <Button fullWidth size='large' variant="contained"
            type='submit'
          >Add to cart</Button>
        </Grid>
        {/* <Grid size={12}>
          <RouterLink href='#'>
            <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
              <IconifyImpl icon={"icon-park-solid:like"} width={16} />
              <Typography sx={{ pl: "4px" }} variant='subtitle2'>Add favorite</Typography>
            </Grid>
          </RouterLink>
        </Grid> */}
      </Grid>
    </Grid>
  </>
}



const Description_Content = ({ product }: { product: any }) => {

  const [value, setValue] = useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const Description_Tab = () => {

    return <Grid container spacing={3} sx={{ pb: { xs: 10, md: 0 } }}>
      <Grid size={12}>
        {/* <Grid size={6} sx={{ pt: 2 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>Specifications</Typography>
          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableRow >
                <TableCell sx={{
                  border: "1px solid #dddddd"
                }}>
                  Category
                </TableCell>
                <TableCell>
                  Mobile
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Manufacturer
                </TableCell>
                <TableCell>
                  Apple
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Warranty
                </TableCell>
                <TableCell>
                  12 Months
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </Grid> */}
      </Grid>
      <Grid size={12}>
        <Typography variant='h6' sx={{ mb: 2 }}>Product details</Typography>
        <Typography variant='body1'>
          {product.description}
        </Typography>
      </Grid>
    </Grid>
  }

  return <Box sx={{ width: "100%" }}>
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="inherit"
      slotProps={{
        indicator: {
          style: { backgroundColor: "black" }
        }
      }}
    >
      <Tab value={1} label="Description" />
    </Tabs>
    <Box sx={{ width: "100%" }}>
      {value === 1 ? <Description_Tab /> : null}
    </Box>
  </Box>
}

const Page = () => {

  const isAuthed = Boolean(getCookie(ACCESS_TOKEN))

  const params = useParams()
  const { product_id } = params

  const { data: product } = useSWR('/api/product/' + product_id, async () => (await Product_API(product_id as string))?.data?.data)



  const submitHandler = async (data: any) => {
    // console.log(data)
    // console.log(product)

    // Validation

    if (!isAuthed) {
      CustomToast({
        message: <Box>
          <Typography variant='body1'>
            Error! You need to&nbsp;<RouterLink href={findNavigationByName("login")?.url + "/"} >Login</RouterLink>
            &nbsp;firstly.
          </Typography>
        </Box>,
        type: "error"
      })
      return;
    }

    if (!data.count) {
      ErrorToast({ message: "Product count can not zero!" })
      return;
    }

    try {

      const productId = product?.id || undefined;

      if (!productId) {
        throw new Error("Product not found")
      }

      const result = await AddCartItem_API({
        product_id: productId,
        quantity: data.count
      })
      // console.log("🚀 ~ submitHandler ~ result:", result)
      if (result.data?.success) {
        SuccessToast({ message: result?.data?.message })
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ErrorToast({ message });
    }




  }
  const methods = useForm({
    defaultValues: { count: 1 }
  })

  return (
    <BasePageComponent
      maxWidth={CONTAINER_MAX_WIDTH_MAIN}
      outerStyles={{ bgcolor: "yellowgreen" }}
      innerStyles={{
        bgcolor: "white",
      }}
    >
      <Box sx={{ minHeight: MIN_HEIGHT }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submitHandler)}>
            <Grid
              container
              spacing={3}
              sx={{
                py: 2
              }}
            >
              {product ? <Main_Content product={product} /> : null}
              {product ? <Description_Content product={product} /> : null}
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </BasePageComponent>
  )
}

export default Page
