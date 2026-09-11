import AxiosImpl from "@/lib/AxiosImpl";

const API_PREFIX = '/cart'

type AddCartItemProps = {
    product_id: string,
    quantity: number
}
export const AddCartItem_API = (data: AddCartItemProps) => AxiosImpl.post(`${API_PREFIX}/items/`, data)


export const GetCart_API = () => AxiosImpl.get(`${API_PREFIX}/`)

export const RemoveCartItem_API = (id: string) => AxiosImpl.delete(`${API_PREFIX}/items/${id}/`)