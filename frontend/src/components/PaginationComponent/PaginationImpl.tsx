import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import IconifyImpl from '../IconifyImpl/IconifyImpl'
import Box from '@mui/material/Box';
import { ChangeEvent } from 'react';

type PaginationImplProps = {
    count: number,
    onChange?: ((event: ChangeEvent<unknown, Element>, page: number) => void),
    page: number,
}

const PaginationImpl = ({ count = 1, onChange, page = 1 }: PaginationImplProps) => {
    const iconWidth = 20;

    return (
        <Pagination
            count={count}
            showFirstButton
            showLastButton
            onChange={onChange}
            page={page}
            renderItem={(item) => (
                <PaginationItem
                    slots={{
                        previous: () => <IconifyImpl icon={"uil:arrow-left"} width={iconWidth} />,
                        next: () => <IconifyImpl icon={"uil:arrow-right"} width={iconWidth} />
                    }}
                    {...item}
                />
            )}
        />
    )
}

export default PaginationImpl