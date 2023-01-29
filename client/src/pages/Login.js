import React, { useState } from 'react';
import { Form, message, Input } from 'antd';
import { Link } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import Message from '../components/Message';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import '../resources/auth.css'

function Login() {

    // odnosi se na formu povezano sa serverom i obradjuje podatke korisnika
    // const navigacija = useNavigate();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();



    const onFinish = async (values) => {
        const userObj = {
            password,
            email,
        };
        try {
            // Prikazi Loading
            dispatch(ShowLoading());
            const response = await axios.post("/api/users/login", values, userObj);
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

    };

    const sendResetPasswordLink = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post("/api/users/send-password-reset-link", {
                email,
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success("Mejl za resetovanje lozinke je poslat", response.data.message);
                setShowForgotPassword(false);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error("Nešto nije u redu");
        }
    };

    return (
        <>
            <div id="pozadina" className='d-flex  justify-content-center align-items-center auth'>
                {!showForgotPassword && (
                    <div className='odforme card bg-light p-3'>
                        <h1 className='text-lg'> WEBUS - Logovanje</h1>

                        <hr />

                        <Form layout='vertical' onFinish={onFinish}>


                            {/* Email */}
                            <Form.Item label='Email:' name='email' rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}>
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} type="text" onChange={(e) => setEmail(e.target.value)} placeholder="webus2022@primer.com" />
                            </Form.Item>

                            {/* Lozinka */}
                            <Form.Item
                                label="Lozinka:"
                                name="lozinka"
                                rules={[{ required: true, message: 'Molimo Vas, upišite lozinku!' }]}
                            >
                                <Input.Password type="password" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Item>
                            {/* Zaboravljena lozinka */}
                            <div className='d-flex justify-content-between align-items-center'>
                                <p style={{ color: "red", fontWeight: "bold", cursor: "pointer", marginTop: "4px" }}
                                    title="Zaboravili ste lozinku?"
                                    className="text-black"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Zaboravili ste lozinku?
                                </p>

                            </div>
                            <hr />
                            {/* Link i dugme */}
                            <div className='d-flex flex-column'>
                                <button title="Uloguj se" className='dugme mt-2 mb-2' type='submit'>Uloguj se</button>
                                <Link title="Registracija" className="prijavi-se text-black" to="/register"><button className='registracijadugme' >Registracija</button></Link>
                            </div>

                        </Form>
                    </div>)}
                {/* Forma za slanje reset lozinke na mejl */}
                {showForgotPassword && (
                    <div className="odforme card bg-light p-3">

                        <h1 className="text-lg">
                            WEBUS - SLANJE MEJLA
                        </h1>

                        <hr />
                        <Form layout='vertical'>
                            <Form.Item
                                label="Vaš email:"
                                name="email"
                                rules={[{ required: true, message: 'Molimo Vas, upišite ispravan mail!' }]}
                            >
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="webus2022@primer.com" />
                            </Form.Item>
                            <div className="flex flex-col justify-between items-end">
                                <button
                                    title="Slanje tokena na mejl"
                                    className="dugme mt-3 w-100"
                                    onClick={sendResetPasswordLink}
                                >
                                    POŠALJI
                                </button>
                                <h1
                                    title="Froma za logovanje"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="cursor-pointer mt-3 mb-2 text-md text-lg text-left"
                                >
                                    <i className="ri-arrow-left-circle-line"></i>
                                </h1>
                            </div>
                        </Form>
                    </div>
                )}

            </div>
            <div id="staza">
                <img id="bus" src="bus.png" alt="Autobus" />
                <img id="bus1" src="bus.png" alt="Autobus" />
            </div>
            {/* Dugme za info */}
            <Message />
        </>
    );
}

export default Login;