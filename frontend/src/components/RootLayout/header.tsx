'use client'
import { useCallback, useEffect, useState } from 'react';
import { CONTAINER_MAX_WIDTH_MAIN, TOP_BAR_CONFIG, NAV_BAR_CONFIG, ACCESS_TOKEN, REFRESH_TOKEN } from '@/config/constants'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RouterLink from '../RouterLink/RouterLink'
import IconifyImpl from '../IconifyImpl/IconifyImpl'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import { ModalProps } from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { SxProps } from '@mui/material/styles';
import { Navigation } from '@/config/navigation';
import { deleteCookie, hasCookie } from 'cookies-next';
import Button from '@mui/material/Button';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { findNavigationByName, findNavigationsByName } from '@/utils/navigation';
import ButtonBase from '@mui/material/ButtonBase';
import { useSWRConfig } from 'swr';

const TopBar = () => {
  return <Box sx={{
    bgcolor: TOP_BAR_CONFIG.BACKGROUND_COLOR,
    height: TOP_BAR_CONFIG.HEIGHT
  }}>
    <Container maxWidth={CONTAINER_MAX_WIDTH_MAIN}>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          textAlign: "center",
          lineHeight: TOP_BAR_CONFIG.HEIGHT + "px"
        }}
      >
        Welcome! to xKiTXo Shop
      </Typography>
    </Container>
  </Box>
}

const LogoBox = ({ sx }: { sx?: SxProps }) => {
  return <Typography
    variant="h5"
    noWrap
    component="a"
    href="/"
    sx={{
      mr: 2,
      display: { xs: "none", sm: 'flex', md: 'none' },
      flexGrow: 1,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.3rem',
      color: 'inherit',
      textDecoration: 'none',
      justifyContent: "center",
      ...sx
    }}
  >
    xKiTXo Shop
  </Typography>
}

// Performance
const My_Header_Drawer = ({ isAuth, open, onClose, LogoutHandler }: { isAuth: boolean, LogoutHandler: any, open: boolean | undefined, onClose: ModalProps['onClose'] }) => {


  const loginNav = Navigation.urls.find(f => f.name === "Login")

  const listSxProps = {
    bgcolor: "white",
    mb: 1
  }




  return <Drawer open={open} onClose={onClose}>
    <Box sx={{
      bgcolor: "#d3d3d3",
      width: {
        xs: NAV_BAR_CONFIG.DRAWER_WIDTH_XS,
        md: NAV_BAR_CONFIG.DRAWER_WIDTH_MD,
      }
    }}>
      <List sx={listSxProps}>
        <ListItemButton>
          <LogoBox sx={{
            mr: 0
          }} />
        </ListItemButton>
      </List>
      {isAuth ? <List sx={listSxProps}>
        <ListItem disablePadding sx={{ px: 2 }}
          secondaryAction={
            <Button variant="outlined" size="small" color="inherit" onClick={LogoutHandler}>
              Logout
            </Button>
          }
        >
          <ListItemText primary={"Welcome, Jerry"} />
        </ListItem>
      </List> :
        <List sx={listSxProps}>
          <RouterLink key={loginNav?.url} href={loginNav?.url} onClick={onClose}>
            <ListItem key={loginNav?.name} disablePadding>
              <ListItemButton >
                <ListItemText primary={"Log In / Sign Up"} />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </List>}
      <List sx={{ ...listSxProps, mb: 0 }}>
        {
          findNavigationsByName([
            "Home",
            "Products",
            "Carts",
            "About US",
            "Privacy Policy",
            "Terms and Conditions",
            "Dashboard",
            "Account",
            "Orders"
          ]).filter(f => {
            if (!isAuth) {
              if ([
                "Carts",
                "Dashboard",
                "Account",
                "Orders"
              ].includes(f.name)) {
                return false
              }
            }
            return true
          }).map((nav, index) => {

            return (
              <RouterLink key={nav.url} href={nav.url} onClick={onClose}>
                <ListItem key={nav.name} disablePadding>
                  <ListItemButton >
                    <ListItemText primary={nav.name} />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            )
          })
        }
      </List>
    </Box>
  </Drawer>
}

// Performance
const ResponseNavBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { mutate } = useSWRConfig()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(Boolean(hasCookie(ACCESS_TOKEN)))
  }, [pathname])

  const LogoutHandler = async () => {
    deleteCookie(ACCESS_TOKEN, { path: "/" });
    deleteCookie(REFRESH_TOKEN, { path: "/" });
    setIsAuthed(false)
    handleCloseNavMenu()
    await mutate(() => true, undefined, { revalidate: false })
    router.push('/')
    router.refresh()
  }


  const nav_left_list = findNavigationsByName(["home", "products"]).map((m, i) => {
    return <Box key={m.name + i} sx={{ ml: i === 0 ? 0 : 5 }}>
      <RouterLink key={m.url} href={m.url}>{m.name}</RouterLink>
    </Box>
  })
  const nav_right_list = () => {

    const Authed_UI = isAuthed ? <Box sx={{ ml: 5 }} suppressHydrationWarning={true}>
      <ButtonBase onClick={LogoutHandler}>
        <IconifyImpl icon={"material-symbols:logout-rounded"} width={NAV_BAR_CONFIG.ICON_WIDTH} />
      </ButtonBase>
    </Box>
      : null

    const nav_icons = NAV_BAR_CONFIG.NAV_RIGHT_LISTS.map((m, i) => {
      if (isAuthed) {
        if (m.name === "Login") {
          let dashboard_url = findNavigationByName("Dashboard")?.url
          return <Box key={m.name + i} sx={{ ml: 5 }}>
            <RouterLink key={m.url} href={dashboard_url}>
              {m?.icon ? <IconifyImpl icon={m?.icon} width={NAV_BAR_CONFIG.ICON_WIDTH} /> : m.name}
            </RouterLink>
          </Box>
        }
        if (m.name === "Carts") {
          let url = findNavigationByName("Carts")?.url
          return <Box key={m.name + i} sx={{ ml: 5 }}>
            <RouterLink key={m.url} href={url}>
              {m?.icon ? <IconifyImpl icon={m?.icon} width={NAV_BAR_CONFIG.ICON_WIDTH} /> : m.name}
            </RouterLink>
          </Box>
        }
      }
      return <Box key={m.name + i} sx={{ ml: 5 }}>
        <RouterLink key={m.url} href={m.url}>
          {m?.icon ? <IconifyImpl icon={m?.icon} width={NAV_BAR_CONFIG.ICON_WIDTH} /> : m.name}
        </RouterLink>
      </Box>
    })

    return <>
      {nav_icons}
      {Authed_UI}
    </>


  }

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };



  return (
    <AppBar sx={{
      bgcolor: "#d3d3d3",
      color: "black"
    }}>
      <TopBar />
      <Container maxWidth={CONTAINER_MAX_WIDTH_MAIN}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <IconifyImpl icon={"material-symbols:menu-rounded"} />
            </IconButton>

            <My_Header_Drawer
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              LogoutHandler={LogoutHandler}
              isAuth={isAuthed}
            />

          </Box>

          <LogoBox />

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            {nav_right_list()}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            <Grid container
              sx={{
                alignItems: "center",
                height: NAV_BAR_CONFIG.HEIGHT,
                fontSize: "20px",
              }}
            >
              <Grid size={8} container>
                {nav_left_list}
              </Grid>
              <Grid size={4} container sx={{ justifyContent: "flex-end" }}>
                {nav_right_list()}
              </Grid>
            </Grid>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  )
}

const Header = () => {

  return (
    <Box>
      <ResponseNavBar />
    </Box>
  )
}

export default Header