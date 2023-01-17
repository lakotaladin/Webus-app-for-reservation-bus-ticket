import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from 'axios';
import { useDispatch } from 'react-redux';

function VerifyEmail() {
    const dispatch = useDispatch();
    const [emailVerified, setEmailVerified] = useState('');
    const params = useParams();


    const verifyToken = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/users/verifyemail', { token: params.token })
            if (response.data.success) {
                setEmailVerified('true')
            } else {
                setEmailVerified('false')
            }
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            setEmailVerified('false')
        }
    }


    useEffect(() => {
        verifyToken();
    }, [dispatch]);
    return (
        <div className='d-flex justify-content-center items-center w-100 h-100 m-0 p-0'>
            {emailVerified === 'true' && <h1>Molimo Vas sačelajte, verifikujemo e-mail</h1>}
            {emailVerified === 'false' && <h1>Vaš token je neispravan ili je istekao</h1>}
        </div>
    )
}

export default VerifyEmail