import AxiosImpl from "@/lib/AxiosImpl";

const API_PREFIX = '/orders'

type CreateOrderProps = {
    shipping_address: string
}
export const CreateOrder_API = (data: CreateOrderProps) => AxiosImpl.post(`${API_PREFIX}/order/`, data)

type SendOrderCommentProps = {
    id: string,
    content: string
}
export const SendOrderComment_API = (data: SendOrderCommentProps) => AxiosImpl.post(`${API_PREFIX}/order/${data.id}/comments/`, data)

export const GetOrderById_API = (id: string | null | undefined) => AxiosImpl.get(`${API_PREFIX}/order/${id}`)

export const GetOrders_API = () => AxiosImpl.get(`${API_PREFIX}/`)

export const CancelOrder_API = (id: string) => AxiosImpl.post(`${API_PREFIX}/order/${id}/cancel/`)
