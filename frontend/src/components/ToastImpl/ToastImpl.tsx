import Box from "@mui/material/Box"
import { ReactNode } from "react"
import { toast, ToastContentProps, TypeOptions } from "react-toastify"

// Custom Toast
type ToastProps = { message?: string | ReactNode, type?: TypeOptions }

const ToastImpl = ({ message, type }: ToastProps) => toast(<Box>{message}</Box>, { type })

export const SuccessToast = (props?: ToastProps) => {
    let message = props?.message ? props.message : "Success";
    let type = props?.type ? props.type : 'success'
    return ToastImpl({ message, type })
}

export const ErrorToast = (props?: ToastProps) => {
    let message = props?.message ? props.message : "Error";
    let type = props?.type ? props.type : 'error'
    return ToastImpl({ message, type })
}

export const CustomToast = (props?: ToastProps) => {
    let message = props?.message ? props.message : "Info";
    let type = props?.type ? props.type : 'info'
    return ToastImpl({ message, type })
}
