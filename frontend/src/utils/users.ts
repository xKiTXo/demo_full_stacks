import { ACCESS_TOKEN } from "@/config/constants"
import { getCookie } from "cookies-next"


export const isAuth = () => getCookie(ACCESS_TOKEN)