import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import '../resources/verify.css';

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
        <div className='stranicabody d-flex justify-content-center items-center w-100 h-100 m-0 p-0'>
            {emailVerified === 'true' && <><div className='glavnisuccess d-flex h-100'><h4 id='naslovverify'>Email je verifikovan, kliknite <a  style={{color: "white", fontWeight: "bold", fontSize: "24px"}} href='https://webus.herokuapp.com/register'>OVDE</a></h4></div></>}
            {emailVerified === 'false' && <><div className='glavnidanger d-flex h-100'><h4 id='naslovverify'>Vaš token je neispravan ili je istekao.<br/>Kliknite <a  style={{color: "white", fontWeight: "bold", fontSize: "24px"}} href='https://webus.herokuapp.com/register'>OVDE</a></h4></div></>}
        </div>
    )
}

export default VerifyEmail