"use client"
import RouterLink from '@/components/RouterLink/RouterLink'
import { CONTAINER_MAX_WIDTH_CONTENT, MIN_HEIGHT } from '@/config/constants'
import { findNavigationByName } from '@/utils/navigation'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

const Top_Img = () => <Box >
    <Box sx={{
        backgroundImage: "url('/images/about_us_bg_01.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: { xs: 300, lg: 500 },
        position: "relative",
    }} />
    <Container
        maxWidth={CONTAINER_MAX_WIDTH_CONTENT}
        sx={{
            top: 0,
            left: 0,
            position: "absolute",
            height: { xs: 300, lg: 500 },
            pt: { xs: "60px", lg: "200px" },
            width: "40%",
            bgcolor: "black",
            background: "linear-gradient(90deg,rgba(0, 0, 0, .8) 50%, rgba(0, 0, 0, .6) 75%, rgba(94, 94, 94, 0) 100%)"
        }}
    >
        <Box sx={{
            width: {
                xs: "75%",
                lg: "50%"
            },
            pl: 2
        }}>
            <Typography variant='h2' color='success'>
                Who
            </Typography>
            <Box sx={{
                pl: 1,
                color: "#d3d3d3"
            }}>
                <Typography variant='h5'>
                    we are?
                </Typography>
                <Typography variant='body1' >
                    Let's store our product.
                </Typography>
            </Box>
        </Box>

    </Container>
</Box>

const About_Content = () => <Grid
    container
    spacing={1}
    sx={{
        Height: { xs: 200, md: 300 },
        alignItems: "center",
        py: 3
    }}
>
    <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{
            height: "100%",
            scale: { xs: .8, md: 1 }
        }}>
            <CardMedia
                src='/images/motherboard_01.jpg'
                component="img"
                height={"100%"}
                sx={{
                    objectFit: "contain",
                }}
            />
        </Box>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }} sx={{
        height: "100%",
        textAlign: { xs: "center", md: "left" },
        px: { xs: 3, md: 0 }
    }}>
        <Typography variant='h3' sx={{ mb: 1 }}>About US</Typography>
        <Typography variant='h6'>
            We are an online store specializing in computer components
            and peripherals. We offer a wide range of products
            including CPUs, graphics cards, memory, motherboards, SSDs, power supplies, and more.
        </Typography>
    </Grid>
</Grid >

const Company_Content = () => <Grid container>
    <Grid size={12} container sx={{
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "gold",
        minHeight: 300
    }}>
        <Box sx={{
            width: { xs: "100%", md: "50%" },
            px: { xs: 3, md: 0 },
            color: "black"
        }}>
            <Typography variant='h4' color="error">Our Goal</Typography>
            <Typography variant='h6'>
                To make buying computer parts simpler, more transparent,
                and more reliable. Whether you are a gamer, content creator, or office user,
                you can quickly find the right products for your needs.
            </Typography>
        </Box>
    </Grid>
    <Grid size={12} container sx={{ minHeight: 300, pb: { xs: 3, md: 0 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant='h4' color="success">
                    What We Offer
                </Typography>
            </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                pl: { xs: 3, md: 0 }
            }}>
                <Typography variant='body1'>
                    Carefully selected PC components and peripherals.
                </Typography>
                <Typography variant='body1'>
                    Clear product specifications and categories.
                </Typography>
                <Typography variant='body1'>
                    Convenient online ordering and order tracking.
                </Typography>
                <Typography variant='body1'>
                    A smooth and practical shopping and checkout experience.
                </Typography>
            </Box>
        </Grid>
    </Grid>
    <Grid size={12}><Divider /></Grid>
    <Grid size={12} container sx={{ minHeight: 300, pb: { xs: 3, md: 0 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant='h4' color="secondary">
                    Why Choose Us
                </Typography>
            </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                pl: { xs: 3, md: 0 }
            }}>
                <Typography variant='body1'>
                    Clear product information for easy comparison.
                </Typography>
                <Typography variant='body1'>
                    Focus on stock availability and shipping efficiency.
                </Typography>
                <Typography variant='body1'>
                    Regular updates with popular and new products.
                </Typography>
                <Typography variant='body1'>
                    A customer-oriented shopping experience.
                </Typography>
            </Box>
        </Grid>
    </Grid>
</Grid>

const Contact_Us_Content = () => <Grid size={12} container sx={{
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "green",
    minHeight: 300
}}>
    <Grid size={12} sx={{ width: { xs: "100%", md: "50%" }, px: { xs: 3, md: 0 }, color: "white" }}>
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

const Page = () => {


    return (
        <Box sx={{ minHeight: MIN_HEIGHT, width: "100%" }}>
            <Top_Img />
            <About_Content />
            <Company_Content />
            <Contact_Us_Content />
        </Box>
    )
}

export default Page