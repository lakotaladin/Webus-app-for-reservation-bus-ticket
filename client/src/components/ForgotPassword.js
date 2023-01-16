import React, { useEffect, useState } from 'react'
import Message from './Message'
import '../resources/auth.css';
import { MailOutlined } from '@ant-design/icons';
import {  Form, Input, message } from 'antd';
import {  NavLink, useNavigate, useParams } from 'react-router-dom';



function ForgotPassword() {

    const {id, token} = useParams();
    const history = useNavigate();
    const [password, setPassword] = useState("");
    const [messagee, setMessage] = useState("");


    const userValid = async() => {
        const res = await fetch(`/api/users/forgotpassword/${id}/${token}`,{
            method: "GET",
            headers: {
                "Content-Type":"application/json"
            }
        });

        const data = await res.json();

        if(data.status === 201){
            console.log("Korisnik je validan")
        }else{
            history("*")
        }
    }

    const setval = (e) =>{
        setPassword(e.target.value)
    }

    const sendpassword = async(e) => {
        e.preventDefault();

        const res = await fetch(`/${id}/${token}`,{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({password})
        });

        const data = await res.json();

        if(data.status === 201){
            setPassword("");
            setMessage(true);
        }else{
            message.error("Token sesija je istekla, generiši novi link!")
        } 

    }

    useEffect(()=> {
        userValid();
    },[setval]);

  return (
    <>
    {/* // css je u global.css */}
    {/* //  ovo je glavni div od cele stranice */}
    <div id="pozadina" className='d-flex  justify-content-center align-items-center auth'>

        {/* Div u kome je smestena forma */}
        <div className='odforme card bg-light p-4'>
            <h1 className='text-lg'> UPIŠITE VAŠU NOVU LOZINKU</h1>

            <hr />
            { messagee ? <p className='bg-success text-white p-2 rounded'>Uspešno ste restartovali lozinku!</p> : ""}
            <Form layout='vertical'>
                {/* Email */}
                <Form.Item label='Nova lozinka:' name='password' rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}>
                    <Input type="password" value={password} onChange={setval} name="password" id="password" prefix={<MailOutlined className="site-form-item-icon" />} rules={[{ required: true, message: 'Molimo Vas, upišite vašu novu lozinku!' }]} placeholder="Nova lozinka" />
                </Form.Item>
            </Form>
            <div className='d-flex justify-content-between align-items-center'>
            <NavLink to="/login"><p className='linkboja'>Vratite se nazad</p></NavLink>
            </div>
            <button className='sendemail w-100' onClick={sendpassword} type='submit'>Pošalji</button>
        </div>
    </div>
    <div id="staza">
        <img id="bus" src="bus.png" alt="Autobus" />
        <img id="bus1" src="bus.png" alt="Autobus" />
    </div>
    {/* Dugme za info */}
    <Message />
</>
  )
}

export default ForgotPassword