"use client"
import BasePageComponent from '@/components/BasePageComponent/BasePageComponent'
import { CONTAINER_MAX_WIDTH_MAIN, MIN_HEIGHT } from '@/config/constants'
import Box from '@mui/material/Box'
import Privacy_Policy_Content from './content'

const Page = () => {

    return (
        <BasePageComponent
            maxWidth={CONTAINER_MAX_WIDTH_MAIN}
        >
            <Box sx={{ minHeight: MIN_HEIGHT }}>
                <Privacy_Policy_Content />
            </Box>
        </BasePageComponent>
    )
}

export default Page