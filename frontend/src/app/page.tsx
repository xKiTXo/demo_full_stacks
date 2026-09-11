'use client'
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { Summary_API } from "@/services/products";
import { useRouter } from "next/navigation";
import { findNavigationByName } from "@/utils/navigation";
import Image from "next/image";
import Container from "@mui/material/Container";
import { CONTAINER_MAX_WIDTH_CONTENT, CONTAINER_MAX_WIDTH_MAIN } from "@/config/constants";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Grid from "@mui/material/Grid";
import RouterLink from "@/components/RouterLink/RouterLink";


const CarouselContent = () => {
  const banners = [
    'banner_01.png',
    'banner_02.png',
    'banner_03.png',
    'banner_04.png',
    'banner_05.png',
  ]

  return (
    <Container maxWidth={CONTAINER_MAX_WIDTH_MAIN} disableGutters>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop
          speed={500}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation
          style={{ width: '100%' }}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={`${banner}-${index}`}>
              <CardMedia
                component="img"
                image={`/images/${banner}`}
                alt={banner}
                sx={{
                  width: '100%',
                  height: { xs: 220, sm: 320, md: 500, lg: 700 },
                  objectFit: 'cover',
                  objectPosition: 'center',
                  cursor: 'pointer',
                  display: 'block',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  )
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
const Product_item = ({ product, index }: ProductItemProps) => {
  const router = useRouter()

  const mainImg = product.images.find((f: any) => f?.isMain);
  const img: any = mainImg ? mainImg : product.images.length > 0 ? product.images[0] : null;
  const img_path = img?.image ? (String(img.image).startsWith("http") ? img?.image : process.env.NEXT_PUBLIC_IMAGE_URL + img?.image) : null;
  const key = String(`${product.name}_${index}`);
  return <Card key={key}
    sx={{
      mb: 3,
      width: { xs: 360, md: 240 },
      mx: { xs: "auto", sm: "auto", md: "auto", lg: 0 },
      height: 320,
      textAlign: "center",
      boxShadow: "5px 5px 15px #d3d3d3"
    }}
  >
    <CardActionArea
      sx={{ height: "100%", pt: 3, }}
      onClick={() => {
        const productUrl = `${findNavigationByName("Products")?.url}/${product.id}`
        router.push(productUrl)
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {img_path ?
            <CardMedia
              component={"img"}
              image={img_path}
              alt={product.name}
              sx={{
                objectFit: "contain",
                py: 2
              }}
              height={130}
              width={130}
            /> :
            <Image src={"/images/no_image.png"}
              height={130}
              width={130}
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
        </CardContent>
      </Box>
    </CardActionArea>
  </Card>
}



// Popular Products
const Popular_products = ({ data }: { data: any[] }) => {
  if (!data?.length) return null

  return (
    <Box sx={{ bgcolor: "white", py: 5, mt: 3 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
        Popular Products
      </Typography>

      <Container maxWidth={CONTAINER_MAX_WIDTH_CONTENT} disableGutters>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={4}
          slidesPerGroup={1}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            765: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            900: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1200: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          style={{ paddingBottom: 8 }}
        >
          {data.map((product, index) => (
            <SwiperSlide key={`${product?.id}-${index}`}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Product_item product={product} index={index} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  )
}

// Latest Products
const Latest_products = ({ data }: { data: any[] }) => {
  if (!data?.length) return null

  return (
    <Box sx={{ bgcolor: "whitesmoke", py: 5 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
        Latest Products
      </Typography>

      <Container maxWidth={CONTAINER_MAX_WIDTH_CONTENT} disableGutters>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={4}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            765: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {data.map((product, index) => (
            <SwiperSlide key={`${product?.id}-${index}`}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Product_item product={product} index={index} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  )
}

const Contact_Us_Content = () => <Grid size={12} container sx={{
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "white",
  minHeight: 400
}}>
  <Grid size={12} sx={{ width: { xs: "100%", md: "50%" }, px: { xs: 3, md: 0 } }}>
    <Typography variant='h4' sx={{ mb: 1 }}>Contact Us</Typography>
    <Typography variant='h6'>
      If you have any questions about products, orders,
      or technical support, please reach out through &nbsp;
      <RouterLink href={findNavigationByName("Contact Us")?.url} hover="underline">
        <Typography variant='h6' component={"span"}>
          Contact
        </Typography>
      </RouterLink> &nbsp;&nbsp;page.
      We will get back to you as soon as possible.
    </Typography>
  </Grid>
</Grid>

export default function Home() {


  // data: API Response
  const { data } = useSWR(`/api/products/summary`, async () => {
    return (await Summary_API())?.data?.data;
  })



  return (
    <Box sx={{ width: "100%" }}>
      <CarouselContent />
      <Popular_products data={data?.popular_products || []} />
      <Latest_products data={data?.latest_products || []} />
      <Contact_Us_Content />
    </Box>
  );
}
