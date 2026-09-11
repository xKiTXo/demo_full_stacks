import { findNavigationByName } from '@/utils/navigation'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { SxProps } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

interface Breadcrumb {
    name: string,
    url?: string,
}

interface BreadcrumbListProps {
    breadcrumbs: Breadcrumb[],
    sx?: SxProps
}

const BreadcrumbImpl = ({ breadcrumbs, sx }: BreadcrumbListProps) => {

    if (breadcrumbs.length == 0) return;

    const currentPage = breadcrumbs[breadcrumbs.length - 1]
    const breadcrumbList = breadcrumbs.slice(0, breadcrumbs.length - 1).map((m, index) => {
        let path = m?.url ? m.url : findNavigationByName(m.name)?.url || "#";
        return <Link underline="hover" color="inherit" href={path}>
            {m.name}
        </Link>
    })

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={sx}>
            {breadcrumbList}
            <Typography variant="body1" sx={{ color: 'text.primary' }}>{currentPage?.name}</Typography>
        </Breadcrumbs>
    )
}

export default BreadcrumbImpl