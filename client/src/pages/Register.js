import React from 'react';
import { Form, message, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // odnosi se na formu povezano sa serverom i obradjuje podatke korisnika
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post("/api/users/register", values);
            dispatch(HideLoading());
            if (response.data.success) {
                // message je entity od komponente sa antdesign-a
                message.success(response.data.message);
                navigate("/login");
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }

        // test   console.log(values);
    };


    return (
        <>
         {/* css je u global.css */}
         {/* ovo je glavni div od cele stranice */}
        <div id="pozadina" className='forma d-flex  justify-content-center align-items-center auth'>

            {/* Div u kome je smestena forma */}
            <div className='od-forme card p-3 bg-light'>
                <h1 className='naslovi-forme text-lg'> WEBUS - Registracija</h1>
                <hr />
                <Form layout='vertical' onFinish={onFinish}>

                    {/* Ime */}
                    <Form.Item label='Ime:' name='ime' rules={[{ required: true, message: 'Molimo Vas, upišite ime!' }]}>
                        <Input  prefix={<UserOutlined className="site-form-item-icon" />} type="text" placeholder="Vaše ime..." />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item label='Email:' name='email' rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}>
                        <Input prefix={<MailOutlined />} type="text" placeholder="webus2022@example.com" />
                    </Form.Item>

                    {/* Lozinka */}
                    <Form.Item
                        label="Lozinka:"
                        name="lozinka"
                        rules={[
                            { required: true, message: 'Molimo Vas, upišite lozinku!' },
                            { min: 8, message: "Lozinka mora sadrzati 8 ili vise karaktera"},
                            { max: 64, message: "Lozinka mora sadrzati najvise 64 karaktera"},
                        ]}
                    >
                        <Input.Password type="text" placeholder="minimalno 8 karaktera" />
                    </Form.Item>

                    {/* Link i dugme */}
                    <div className='d-flex justify-content-between align-items-center'>
                        <Link className="prijavi-se text-black" to="/login">Kliknite ovde da se ulogujete!</Link>
                        <button className='dugme mt-2' type='submit'>Registruj se</button>
                    </div>

                </Form>
            </div>



        </div>
        <div id="staza">
        <img id="bus" src="bus.png" alt="Autobus" />
        <img id="bus1" src="bus.png" alt="Autobus" />
        </div>
        </>
    );
}

export default Register;