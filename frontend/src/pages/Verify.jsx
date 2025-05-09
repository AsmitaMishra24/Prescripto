import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {
    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/verifyStripe`,
                { success, appointmentId },
                { headers: { Authorization: `Bearer ${token}` } } // Fix: Add token in Authorization header
            )

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-appointments")
        } catch (error) {
            toast.error(error.message || "Something went wrong!")
            console.log(error)
        }
    }

    useEffect(() => {
        // Fix: Check if all required parameters are present before calling the function
        if (token && appointmentId && success) {
            verifyStripe()
        }
    }, [token, appointmentId, success]) // Fix: Add proper dependencies to trigger re-run of useEffect

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify;
