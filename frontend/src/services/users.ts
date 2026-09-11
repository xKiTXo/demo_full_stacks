import AxiosImpl from "@/lib/AxiosImpl";


const API_PREFIX = '/users'

type LoginProps = {
    username: string, password: string
}
export const Login_API = (data: LoginProps) => AxiosImpl.post(API_PREFIX + "/login/", data);

type registerProps = {
    username: string,
    // email: string,
    password: string,
    re_password: string,
}
export const Register_API = (data: registerProps) => AxiosImpl.post(API_PREFIX + "/register/", data);


export const GetAccountDetail_API = (id: string) => AxiosImpl.get(`${API_PREFIX}/account/${id}`);


export const UpdateAccountDetail_API = (id: string, data: FormData) => AxiosImpl.patch(`${API_PREFIX}/account/update/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });


type changePasswordProps = {
    id: string,
    // security_info
    old_password: string,
    new_password: string,
    re_password: string,
}

export const ChangePassword_API = (data: changePasswordProps) => AxiosImpl.post(`${API_PREFIX}/account/changePassword/`, data);


type ContactUsProps = {
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
}
export const ContactUs_API = (data: ContactUsProps) => AxiosImpl.post(`${API_PREFIX}/contact/`, data);





