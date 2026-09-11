import { CONTAINER_MAX_WIDTH_CONTENT } from '@/config/constants'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Breakpoint, SxProps } from '@mui/material/styles'
import { PropsWithChildren } from 'react'

interface BasePageProps extends PropsWithChildren {
    maxWidth?: Breakpoint,
    outerStyles?: SxProps,
    innerStyles?: SxProps,
}

const BasePageComponent = (props: BasePageProps) => {
    return (
        <Box sx={{ width: "100%", ...props.outerStyles }}>
            <Container
                maxWidth={props?.maxWidth ?? CONTAINER_MAX_WIDTH_CONTENT}
                sx={{ ...props.innerStyles }}
            >
                {props.children}
            </Container>
        </Box>
    )
}

export default BasePageComponent