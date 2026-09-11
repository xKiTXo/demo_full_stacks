'use client'
import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import BreadcrumbImpl from '@/components/Breadcrumbs/BreadcrumbImpl'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import RHFSelectField from '@/components/RHFComponents/RHFSelectField'
import { CONTAINER_MAX_WIDTH_MAIN, SMALL_ICON_WIDTH } from '@/config/constants'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { findNavigationByName } from '@/utils/navigation'
import RHFTextField from '@/components/RHFComponents/RHFTextField'
import RHFCheckboxField from '@/components/RHFComponents/RHFCheckboxField'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import RHFSliderField from '@/components/RHFComponents/RHFSliderField'
import PaginationImpl from '@/components/PaginationComponent/PaginationImpl'
import axios from 'axios'
import useSWR from 'swr'
import { Products_API } from '@/services/products'
import Image from 'next/image'
import { MIN_HEIGHT } from '@/config/constants'

// Filters
const Left_Content = ({ max_price }: { max_price: number }) => {

  const router = useRouter()

  // Accordin
  const ExpandMoreIcon = <IconifyImpl icon={"ic:round-expand-more"} width={SMALL_ICON_WIDTH} />
  interface AccordinItemProps {
    index: number,
    title: string,
    content?: string | ReactNode,
    buttons?: [] | ReactNode,
    expanded?: boolean,
  }
  const Accordin_item = ({ index, title, content, buttons, expanded }: AccordinItemProps) => {
    return <Accordion
      disableGutters
      defaultExpanded
      expanded={expanded}
      slotProps={{
        root: {
          style: {
            borderTop: index == 0 ? 0 : "1px solid gray",
            borderRadius: 0,
            boxShadow: "none",
          }
        }
      }}
    >
      <AccordionSummary
        onClick={(e) => {
          if (title === "All Products") {
            const productsPage = findNavigationByName("Products")?.url;
            productsPage && router.push(productsPage);
          } else {
            console.log("123")
          }
        }}
        expandIcon={content ? ExpandMoreIcon : null}
      >
        <Typography component="span">{title}</Typography>
      </AccordionSummary>
      {content ? <AccordionDetails>
        {content}
      </AccordionDetails> : null}
      {buttons ? <AccordionActions>
        {buttons}
      </AccordionActions> : null}
    </Accordion>
  }

  // Filters
  // brands
  const brands_checkbox_list = [
    { name: "msi", label: "Msi" },
    { name: "gigabyte", label: "Gigabyte" },
    { name: "nvidia ", label: "Nvidia" },
  ].map((m, i) => <Grid size={12}>
    <RHFCheckboxField name={`brands_cb.${m.name}`} label={m.label} />
  </Grid>)

  // computer types
  const computer_types_checkbox_list = [
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
    { name: "desktop", label: "Desktop" },
    { name: "laptop", label: "Laptop" },
    { name: "gaming_laptop ", label: "Gaming Laptop" },
  ].map((m, i) => <Grid size={12}>
    <RHFCheckboxField name={`computer_types_cb.${m.name}`} label={m.label} />
  </Grid>)


  // price range
  const price_range = <RHFSliderField
    name='price_range'
    max={max_price}
    step={500}
    valueLabelDisplay={"auto"}
    size='small'
  />

  // Filter element height
  const FilterCheckboxHeight = 42;
  const FilterInputboxHeight = 40;
  const FilterContentPaddingX = 8

  // Filter Content Item
  // limit the content height if content is too long
  const FilterContentItem = ({ maxHeight, content }: {
    maxHeight: number | string,
    content: ReactNode
  }) => {
    let maxHeightValue = typeof maxHeight == "number" ? `${maxHeight}px` : maxHeight;
    return <Grid container
      sx={{
        maxHeight: maxHeightValue,
        overflow: "auto"
      }}>
      {content}
    </Grid>
  }

  // Filter List
  const filter_list = [
    {
      title: "Test",
      content: <Button fullWidth variant="contained"
        // type='submit' 
        // Test API
        onClick={() => {
          axios({
            method: "get",
            url: "http://localhost:8000/api/products/",
            headers: {
              "Content-Type": "application/json;",
              "Accept": "application/json"
            }
          }).then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }}

      >Submit</Button>,
      expanded: true
    },
    {
      title: "All Products"
    },
    {
      title: "Filters",
      content: <Button fullWidth variant="contained">Clear Filters</Button>,
      expanded: true
    },
    {
      title: "Brands",
      content: <FilterContentItem
        maxHeight={FilterContentPaddingX + FilterInputboxHeight + FilterCheckboxHeight * 3}
        content={
          <>
            <RHFTextField name='search_brands' placeholder='Search Brands' />
            {brands_checkbox_list}
          </>
        }
      />
    },
    {
      title: "Computer Types",
      content: <FilterContentItem
        maxHeight={FilterContentPaddingX + FilterCheckboxHeight * 3}
        content={computer_types_checkbox_list}
      />
    },
    {
      title: "Price",
      content: <Grid container>
        {price_range}
      </Grid>
    },
  ];


  const Filter_Box = filter_list.map((m, i) => <Accordin_item {...m} index={i} />)

  return <Box>
    {Filter_Box}
  </Box>
}

// Product Interface
interface ProductProps {
  id: string,
  name: string,
  price: number,
  description: string,
  rating: number,
  category_name: string,
  images: object[]
}
interface ProductItemProps {
  product: ProductProps,
  index: number,
}

const Pagination_content = ({ page_count, mutate }: { page_count: number, mutate: any }) => {
  const {
    getValues,
    setValue,
    reset,
  } = useFormContext()


  return <Grid size={12} sx={{ p: 1, }}>
    <Grid container
      spacing={2}
      sx={{ borderRadius: "8px", p: 1 }}
    >
      <Grid size={12} container >
        {/* page size */}
        <Grid container
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant='body1'>
            Page size:
          </Typography>
          <RHFSelectField
            name="page_size"
            options={[
              { label: "10", value: "10" },
              { label: "25", value: "25" },
              { label: "50", value: "50" },
            ]}
            selectStyles={{
              container: { width: "80px" }
            }}
          />
        </Grid>
        {/* sort by */}
        <Grid container sx={{ alignItems: "center" }} >
          <Grid>
            <Typography variant='body1' >
              Sort by:
            </Typography>
          </Grid>
          <Grid>
            <RHFSelectField
              name="sort_by"
              options={[
                { label: "Latest", value: "-created_datetime" },
                { label: "Top Sales", value: "-sell_count" },
                { label: <Grid container sx={{ alignContent: "center" }}>Price<IconifyImpl icon={"mdi:arrow-down"} /></Grid>, value: "-price" },
                { label: <Grid container sx={{ alignContent: "center" }}>Price<IconifyImpl icon={"mdi:arrow-up"} /></Grid>, value: "price" },
              ]}
              selectStyles={{
                container: { width: "140px" }
              }}
            />
          </Grid>
        </Grid>
        {/* reset */}
        <Grid>
          <Button
            size="large"
            variant="contained"
            color="success"
            // fullWidth
            onClick={async () => {
              await reset();
              mutate()
            }}>
            Reset Filters
          </Button>
        </Grid>
        <Grid sx={{ flexGrow: 1 }}></Grid>
        {/* search */}
        <Grid
          size={{ xs: 12, md: "auto" }}
          container
          sx={{
            alignItems: "center"
          }}
        >
          <Grid>
            <Typography variant='body1'>
              Search:
            </Typography>
          </Grid>
          <Grid>
            <RHFTextField
              name='search'
              label="Search"
              placeholder='search name, description, sku'
              fullWidth
            />
          </Grid>

        </Grid>

      </Grid>

      <Grid size={{
        xs: 12
      }}
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <PaginationImpl
          count={page_count}
          page={getValues("page")}
          onChange={(e, newPage) => {
            setValue("page", newPage)
          }}
        />
      </Grid>
    </Grid>
  </Grid>
}

// Products
const Right_Content = () => {

  const {
    getValues,
    watch,
    setValue,
    reset,
    control
  } = useFormContext()

  const router = useRouter()

  const Product_item = ({ product, index }: ProductItemProps) => {
    const mainImg = product.images.find((f: any) => f?.isMain);
    const img: any = mainImg ? mainImg : product.images.length > 0 ? product.images[0] : null

    const key = String(`${product.name}_${index}`);
    return <Card key={key}
      sx={{
        width: "100%",
        height: 320,
      }}
    >
      <CardActionArea
        sx={{ height: "100%" }}
        onClick={() => {
          const productUrl = `${findNavigationByName("Products")?.url}/${product.id}`
          router.push(productUrl)
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            height: "100%"
          }}
        >
          <Box
            sx={{
              textAlign: "center"
            }}
          >
            {img?.image ?
              <CardMedia
                component={"img"}
                image={img?.image}
                alt={product.name}
                sx={{
                  objectFit: "contain",
                  py: 2
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
          </Box>
          <CardContent
            sx={{
              display: "flex", flexDirection: "column",
              flexGrow: 1, justifyContent: "space-around"
            }}
          >
            <Typography variant="h6" noWrap>{product.name}</Typography>
            <Typography variant='subtitle1' noWrap>{product.description}</Typography>
            <Typography variant='caption'>{product.category_name}</Typography>
            <Typography variant='subtitle2'>${product.price}</Typography>
            {/* <Rating readOnly defaultValue={product.rating} precision={0.5} size="small" /> */}
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  }


  // Pagination with Products API

  const search = useWatch({ control, name: 'search' }) || '';
  const page = useWatch({ control, name: 'page' }) || 1;
  const pageSize = useWatch({ control, name: 'page_size' }) || '10';
  const sortBy = useWatch({ control, name: 'sort_by' }) || '-created_datetime';

  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setValue('page', 1)
  }, [debouncedSearch, sortBy, pageSize, setValue])

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: Number(page) || 1,
      page_size: Number(pageSize) || 10,
    }
    if (debouncedSearch) params.search = debouncedSearch
    if (sortBy) params.ordering = sortBy
    return params
  }, [page, pageSize, sortBy, debouncedSearch])

  const swrKey = useMemo(() => {
    const qs = new URLSearchParams()
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) qs.set(k, String(v))
    })
    return `/api/products/?${qs.toString()}`
  }, [queryParams])


  // data: API Response
  const { data, error, isLoading, mutate } = useSWR(swrKey, async (url) => {
    return (await Products_API(queryParams))?.data?.data;
  }, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  })


  // data: Products
  const products = data?.results || [];


  return (<Box sx={{ height: "100%" }}>
    <Grid container >
      <Grid size={12}>
        <BreadcrumbImpl
          breadcrumbs={[
            { name: "Home" },
            { name: "Products" },
          ]}
          sx={{
            pt: 1,
            borderRadius: "4px",
            pl: 2,
          }}
        />
      </Grid>

      <Pagination_content page_count={data?.page_count} mutate={mutate} />

      <Grid size={12} container spacing={4} sx={{ p: 2 }}>
        {products ?
          <>
            {products.map((m: any, i: number) => <Grid key={m.name + i}
              size={{
                lg: 3, md: 4, sm: 6, xs: 12
              }}
            >
              <Product_item product={m} index={i} />
            </Grid>
            )}
          </>
          : null}
      </Grid>

      <Grid size={12} sx={{ mt: 3, mb: 5 }}>
        <Grid container sx={{ justifyContent: "center" }}>
          {data ? <PaginationImpl
            count={data.page_count}
            page={getValues("page")}
            onChange={(e, newPage) => {
              setValue("page", newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }} /> :
            null}
        </Grid>
      </Grid>
    </Grid>
  </Box>)
}

const Page = () => {

  // Slider
  // max_price by backend Response
  // const max_price = 30000


  // Form
  const submitHandler = (data: any) => {
    console.log(data)
  }
  const methods = useForm({
    defaultValues: {
      sort_by: "-created_datetime",
      // price_range: [0, max_price],
      page_size: "10",
      page: "1"
    }
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
                pt: 2
              }}
            >
              {/* <Grid
              size={{
                xs: 3, xl: 3
              }}
              sx={{}}
            >
              <Left_Content max_price={max_price} />
            </Grid> */}
              <Grid
                size={12}
                // size={{
                //   xs: 9, xl: 9
                // }}
                sx={{
                  p: 2,
                  bgcolor: "white"
                }}
              >
                <Right_Content />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </BasePageComponent>
  )
}

export default Page