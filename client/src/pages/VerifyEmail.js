import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import '../resources/verify.css';
import Message from '../components/Message';

function VerifyEmail() {
    const dispatch = useDispatch();
    const [emailVerified, setEmailVerified] = useState('');
    const params = useParams();


    const verifyToken = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/users/verify-email', { token: params.token })
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
    }, []);
    return (
        <div className='stranicabody d-flex justify-content-center items-center w-100 m-0 p-0'>
            {emailVerified === 'true' && <><div className='glavni d-flex wh-100  bg-success'><h1 id='naslovverify'>Vaša e-pošta je uspešno verifikovana, idite na stranicu za logovanje.</h1></div><Message /></>}
            {emailVerified === 'false' && <><div className='glavni d-flex wh-100  bg-danger'><h1 id='naslovverify'>Vaš token je neispravan ili je istekao.</h1></div><Message /></>}
        </div>
    )
}

export default VerifyEmail