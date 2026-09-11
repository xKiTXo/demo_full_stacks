import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import IconifyImpl from '@/components/IconifyImpl/IconifyImpl'
import RouterLink from '@/components/RouterLink/RouterLink'
import { CONTAINER_MAX_WIDTH_MAIN } from '@/config/constants'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function NotFound() {
    return (
        <BasePageComponent maxWidth={CONTAINER_MAX_WIDTH_MAIN}>
            <Grid container spacing={6} sx={{ justifyContent: "center" }}>
                <Grid sx={{ width: 200, color: "green" }}>
                    <IconifyImpl
                        icon={"streamline-sharp:browser-error-404"}
                        width={200}
                    />
                </Grid>
                <Grid
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexFlow: "column"
                    }}
                    container
                    spacing={1}
                >
                    <Typography variant='h3' >
                        Not Found
                    </Typography>
                    <Typography variant="caption" >
                        Could not find requested resource
                    </Typography>
                    <Box >
                        <Button variant="contained" color="error">Return Home</Button>
                    </Box>
                </Grid>
            </Grid>
        </BasePageComponent>
    )
}