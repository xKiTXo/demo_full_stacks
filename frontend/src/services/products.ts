import AxiosImpl from "@/lib/AxiosImpl";

const API_PREFIX = '/product'

type PaginationProps = {
    page?: string,
    page_size?: string
    ordering?: string
    search?: string
}
export const Products_API = ({ page = "1", page_size = "10", ordering = "-created_datetime", search = "" }: PaginationProps) => {
    const urlSearchParams = new URLSearchParams({ page, page_size, ordering, search })
    return AxiosImpl.get(`${API_PREFIX}s/?${urlSearchParams}`)
}

export const Product_API = (product_id: string | undefined) => AxiosImpl.get(`${API_PREFIX}/${product_id}`)


export const Summary_API = () => AxiosImpl.get(`/summary/`)

