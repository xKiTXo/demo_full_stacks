"use client"
import BasePageComponent from "@/components/BasePageComponent/BasePageComponent";
import IconifyImpl from "@/components/IconifyImpl/IconifyImpl";
import { CONTAINER_MAX_WIDTH_MAIN, DASHBOARD_CONFIG, NORMAL_ICON_WIDTH } from "@/config/constants";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter, usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";
import { MIN_HEIGHT } from '@/config/constants'
import RouterLink from "@/components/RouterLink/RouterLink";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";


const layout = (props: PropsWithChildren) => {


  const Nav_Box = () => {

    const router = useRouter();
    const pathname = usePathname();
    const is_active = (url: string) => (url === pathname || (url !== "/dashboard" && pathname.startsWith(url)));
    const finalColor = (url: string) => is_active(url) ? "green" : "inherit";

    const dashboard_list = DASHBOARD_CONFIG.DASHBOARD_LEFT_LIST;

    const dashboard_nav_list = dashboard_list.map(
      (m, i) => {
        return (
          <ListItem key={`${m.name}_${i}`} disablePadding sx={{ color: finalColor(m.url) }}>
            <ListItemButton onClick={() => router.push(m.url)}>
              {m?.icon ? (
                <ListItemIcon>
                  <IconifyImpl icon={m.icon} width={NORMAL_ICON_WIDTH} color={finalColor(m.url)} />
                </ListItemIcon>
              ) : null}
              <ListItemText primary={m.name} />
            </ListItemButton>
          </ListItem>
        );
      },
    );

    const xs_dashboard_nav_list = dashboard_list.map((m, i) => {
      return (
        <ButtonBase
          key={`${m.name}_${i}`}
          sx={{
            color: finalColor(m.url),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%"
          }}
        >
          <RouterLink href={`${m.url}`}>
            {m?.icon ? (
              <IconifyImpl icon={m.icon} width={NORMAL_ICON_WIDTH} color={finalColor(m.url)} />
            ) : null}
          </RouterLink>
          <Typography variant="caption">
            {m.name}
          </Typography>
        </ButtonBase>
      );
    },)

    return (
      <>
        <Grid
          size={{
            xs: 3, md: 2
          }}
          sx={{
            display: {
              xs: "none", md: "flex"
            }
          }}
        >
          <Box>
            <List>{dashboard_nav_list}</List>
          </Box>
        </Grid>

        <Grid
          size={{
            xs: 2, md: 2
          }}
          sx={{
            display: {
              xs: "flex", md: "none"
            },
            pt: 2
          }}
        >
          <Box>
            {xs_dashboard_nav_list}
          </Box>
        </Grid>

      </>
    );
  };

  return (
    <BasePageComponent
      maxWidth={CONTAINER_MAX_WIDTH_MAIN}
      outerStyles={{
        bgcolor: "whitesmoke"
      }}
      innerStyles={{
        bgcolor: "white"
      }}
    >
      <Grid container spacing={2} sx={{ minHeight: MIN_HEIGHT, width: "100%" }}>
        <Nav_Box />
        <Grid size={{
          xs: 10, md: 10,
        }}
          sx={{ pl: 1 }}
        >
          {props.children}
        </Grid>
      </Grid>
    </BasePageComponent >
  );
};

export default layout;
