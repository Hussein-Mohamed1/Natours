import axios from "axios"
import { showAlert } from "./alert"

export const signUp = async (data) => {
    try {
        const res =  await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data
        })
        if (res.data.status === 'success') {
            showAlert('success', 'signed Up successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }
    } catch (e) {
        showAlert('error', e.response.data.message)
    }
}