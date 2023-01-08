import React from 'react';
import { Form, message, Input } from 'antd';
import { Link } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import '../resources/auth.css'

function Login() {

    // odnosi se na formu povezano sa serverom i obradjuje podatke korisnika
    // const navigacija = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            // Prikazi Loading
            dispatch(ShowLoading());
            const response = await axios.post("/api/users/login", values);
            // Skarij Loading
            dispatch(HideLoading());
            if (response.data.success) {
                // message je entity od komponente sa antdesign-a
                message.success(response.data.message);
                // Iz uspelog scenarija prijave ocekujem od bekenda token na kraju ovime proveravam je li se korisnik prijavio uspešno ili neuspešno
                localStorage.setItem("token", response.data.data);
                window.location.href = "/";

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
            {/* // css je u global.css */}
            {/* //  ovo je glavni div od cele stranice */}
            <div id="pozadina" className='d-flex  justify-content-center align-items-center auth'>

                {/* Div u kome je smestena forma */}
                <div className='od-forme card bg-light p-3'>
                    <h1 className='text-lg'> WEBUS - Logovanje</h1>
                    <hr />

                    <Form layout='vertical' onFinish={onFinish}>


                        {/* Email */}
                        <Form.Item label='Email:' name='email' rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}>
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} type="text" placeholder="webus2022@example.com" />
                        </Form.Item>

                        {/* Lozinka */}
                        <Form.Item
                            label="Lozinka:"
                            name="lozinka"
                            rules={[{ required: true, message: 'Molimo Vas, upišite lozinku!' }]}
                        >
                            <Input.Password type="text" />
                        </Form.Item>

                        {/* Link i dugme */}
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link className="prijavi-se text-black" to="/register">Kliknite ovde da se registrujete!</Link>
                            <button className='dugme mt-2' type='submit'>Uloguj se</button>
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

export default Login;