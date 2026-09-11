import { CONTAINER_MAX_WIDTH_MAIN, FOOTER_CONFIG, PAYMENT_GATEWAY, SMALL_ICON_WIDTH } from '@/config/constants'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import RouterLink from '../RouterLink/RouterLink'
import IconifyImpl from '../IconifyImpl/IconifyImpl'
import { Navigation } from '@/config/navigation'
import { findNavigationsByName } from '@/utils/navigation'

// Performance 
const Footer = () => {

  // Footer Bottom 
  const bottom_line = <Box sx={{ pb: ".8rem", pt: "1rem", color: "#d3d3d3", bgcolor: "rgba(0,0,0,.8)" }}>
    <Container maxWidth={CONTAINER_MAX_WIDTH_MAIN}>
      <Typography variant="caption" sx={{
        fontWeight: 'bold'
      }}>
        Copyright &copy; xKiTXo Ltd. All Rights Reserved
      </Typography>
    </Container>
  </Box>

  // Footer Left
  const footer_left_list_1 = findNavigationsByName([
    "About US",
    "Contact US",
  ]).map(m => {
    return <Box sx={{ mb: "1.5rem" }}>
      <RouterLink key={m.url} href={m.url}>
        {m.name}
      </RouterLink>
    </Box>
  })
  const footer_left_list_2 = findNavigationsByName([
    "Privacy Policy",
    "Terms and Conditions",
  ]).map(m => {
    return <Box sx={{ mb: "1.5rem" }}>
      <RouterLink key={m.url} href={m.url}>
        {m.name}
      </RouterLink>
    </Box>
  })

  // Footer Right
  const payment_gateway = PAYMENT_GATEWAY.map(m => {
    let iconWidth = 54;
    if (m.name === "PayPal") {
      iconWidth = FOOTER_CONFIG.ICON_WIDTH
    }
    return <Box >
      <IconifyImpl icon={m.icon} width={iconWidth} />
    </Box>
  })
  const socials_app = Navigation.social_urls.map(m => {
    let iconWidth = SMALL_ICON_WIDTH;

    return <Box sx={{
      "&:hover": {
        opacity: 0.5
      }
    }}>
      <RouterLink key={m.hyperlink} href={m.hyperlink}>
        <IconifyImpl icon={m.icon} width={iconWidth} />
      </RouterLink>
    </Box>
  })
  const footer_right_1 = <Box>
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      {payment_gateway}
    </Grid>
  </Box>
  const footer_right_2 = <Box>
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      {socials_app}
    </Grid>
  </Box>


  return (
    <Box sx={{ borderTop: "1px solid #d3d3d3", bgcolor: "white", pt: 2 }}>
      <Container maxWidth={CONTAINER_MAX_WIDTH_MAIN} >
        <Grid container sx={{ minHeight: 200 }}>
          <Grid container spacing={12}
            size={{
              sm: 12, md: 5, lg: 4
            }}
          >
            <Grid>
              <Typography variant='h6' sx={{ fontWeight: "bold", mb: "1rem" }}>About US</Typography>
              {footer_left_list_1}
            </Grid>
            <Grid>
              <Typography variant='h6' sx={{ fontWeight: "bold", mb: "1rem" }}>Customer Care</Typography>
              {footer_left_list_2}
            </Grid>
          </Grid>
          <Grid
            size={{
              sm: 12, md: 7, lg: 8
            }}
          >
            <Grid>
              <Typography variant='h6' sx={{ fontWeight: "bold" }}>Payment methods</Typography>
              {footer_right_1}
            </Grid>
            <Grid sx={{ mt: 2, mb: 2 }}>
              <Typography variant='h6' sx={{ fontWeight: "bold", mb: 1 }}>Connect with us</Typography>
              {footer_right_2}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {bottom_line}
    </Box>
  )
}

export default Footer