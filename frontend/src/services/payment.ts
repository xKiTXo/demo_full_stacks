import AxiosImpl from "@/lib/AxiosImpl";

const API_PREFIX = '/payments'

type CreatePaymentProps = {
    order_id: string,
    payment_method?: string
}
export const CreatePayment_API = (data: CreatePaymentProps) => AxiosImpl.post(`${API_PREFIX}/payment/`, data)


// Checkout 
export const CreateCheckoutSession_API = (data:any) => AxiosImpl.post(`${API_PREFIX}/payment/create-checkout-session/`,data)

export const SessionStatus_API = (session_id:string) => AxiosImpl.get(`${API_PREFIX}/payment/session-status/${session_id}`)


