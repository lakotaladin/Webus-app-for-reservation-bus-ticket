import React, { useEffect, useState } from 'react'
import Message from './Message'
import '../resources/auth.css';
import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { NavLink } from 'react-router-dom';

function PasswordReset() {

    const [email, setEmail] = useState("");

    useEffect(() => {
        console.log({ email })
    }, [email, setEmail])

    const [messagee, setMessage] = useState("");

    const setVal = (e) => {
        setEmail(e.target.value)
    }
    const sendLink = async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/users/sendpasswordlink`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.status === 201) {
            setEmail("");
            setMessage(true);
        } else {
            message.error("Nevažeći korisnik");
        }
    }


    return (
        <>
            {/* // css je u global.css */}
            {/* //  ovo je glavni div od cele stranice */}
            <div id="pozadina" className='d-flex  justify-content-center align-items-center auth'>

                {/* Div u kome je smestena forma */}
                <div className='odforme card bg-light p-4'>
                    <div className='d-flex flex-column'>
                    <NavLink to="/login"><p className='linkstrelica'><i className="ri-arrow-left-circle-line"></i></p></NavLink>

                    <h1 className='text-lg'> UPIŠITE VAŠ EMAIL</h1>
                    </div>
                    <hr />
                    {messagee ? <p className='bg-success text-white p-2 rounded'>Link je poslat na Vaš  <a className='mailporuka' href="https://gmail.com" target="_blank" >email</a>! </p> : ""}
                    <Form layout='vertical'>
                        {/* Email */}
                        <Form.Item label='Email:' name='email' rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}>
                            <Input type="email" value={email} onChange={setVal} name="email" id="email" prefix={<MailOutlined className="site-form-item-icon" />} rules={[{ required: true, message: 'Molimo Vas, upišite vaš email!' }]} placeholder="webus2022@primer.com" />
                        </Form.Item>
                    </Form>
                    <Button className='sendmail btn w-100 p-2' onClick={sendLink} type='submit'>Pošalji</Button>
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

export default PasswordReset