import React, { useRef, useState } from 'react'
import autobus from '../resources/bus.png';
import '../resources/auth.css'
import emailjs from '@emailjs/browser';
import { Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';

function Applaying() {

    const form = useRef(null);

    const [username, setUsername] = useState('')
    const [jobname, setJobname] = useState('')
    const [email, setEmail] = useState('')
    const [adress, setAdress] = useState('')
    const [kont, setKont] = useState('')
    const [pib, setPib] = useState('')

    const sendEmail = () => {

        // const f formirano kako bi moglo da radi slanje mejla preko ant design forme
        const f = document.getElementById("mail-form")

        // Email config
        emailjs.sendForm('service_5z34592', 'template_zpfyryi', f, 'Fam7t3ec-5rGwrY8o')
            .then(() => {
                message.success('Podaci su poslati, sačekajte odgovor administratora');
                console.log(emailjs);
            }, (error) => {
                message.error({ success: false, message: error.message });
                console.log(error)
            });

        setTimeout(() => {
            setUsername('')
            setJobname('')
            setEmail('')
            setAdress('')
            setKont('')
            setPib('')
        }, 800);
    };

    return (
        <>

            {/* Cela stranica */}
            <div id="pozadina" className='d-flex  justify-content-center align-items-center'>

                {/* Div od forme */}
                <div className='applayingdiv'>

                    {/* div sa naslovom */}
                    <div style={{ textAlign: "center" }} className='w-100'>
                        <h5 style={{ fontWeight: "bold" }}>Aplicirajte kao agencija</h5>
                        <Link to="/register"><i className="ri-arrow-left-circle-line"></i></Link>
                    </div>

                    {/* Forma */}

                    <Form id="mail-form" ref={form} onFinish={sendEmail} layout="vertical">


                        <Form.Item label='Ime i prezime:' name="user_namee" rules={[{ required: true, message: 'Molimo Vas, upišite ime i prezime.' }, { min: 3, message: "Ime mora sadržati 3 ili više karaktera" }, { max: 64, message: "Ime mora sadržati najvise 64 slova" },]}>
                            <Input value={username} name="user_name" onChange={e => setUsername(e.target.value)} prefix={<i className="ri-user-line"></i>} className='forName' type="text" placeholder='Upišite Vaše ime i prezime' required />
                        </Form.Item>


                        <Form.Item label='Ime Vaše agencije:' name="job_namee" rules={[{ required: true, message: 'Molimo Vas, upišite ime agnecije.' }, { min: 3, message: "Ime mora sadržati 3 ili više karaktera." }, { max: 64, message: "Ime mora sadržati najvise 64 slova." },]}>
                            <Input value={jobname} name="job_name" onChange={e => setJobname(e.target.value)} prefix={<i className="ri-community-fill"></i>} className='forJob' type="text" placeholder='Upišite ime Vaše agencije' required />
                        </Form.Item>

                        <Form.Item label='Pib:' name="job_pibb" rules={[{ required: true, message: 'Upišite poreski identifikacioni broj!' }, { min: 8, message: "Mora sadržati najmanje 8 cifara." }, { max: 8, message: "Mora sadržati najviše 8 cifara." },]}>
                            <Input value={pib} name="job_pib" onChange={e => setPib(e.target.value)} suffix="PIB/CID" prefix={<i className="ri-profile-line"></i>} className='forPib' type="number" placeholder='Upišite poreski identifikacioni broj' required />
                        </Form.Item>


                        <Form.Item label='Email:' name="user_emaill" rules={[{ required: true, message: 'Molimo Vas, upišite Vašu email adresu!' }]}>
                            <Input value={email} name="user_email" onChange={e => setEmail(e.target.value)} prefix={<i className="ri-mail-line"></i>} className='forEmail' placeholder='primer@gmail.com' type="email" required />
                        </Form.Item>


                        <Form.Item label='Kontakt telefon:' name="job_kontt" rules={[{ required: true, message: 'Upišite kontakt telefon sa pozivnim brojem!' }, { min: 6, message: "Kontakt telefon mora sadržati najmanje 6 cifara." }, { max: 25, message: "Kontakt telefon mora sadržati najvise 25 cifara." },]}>
                            <Input value={kont} name="job_kont" onChange={e => setKont(e.target.value)} prefix={<i className="ri-phone-line"></i>} className='forKont' type="number" placeholder='Upišite kontakt telefon' required />
                        </Form.Item>


                        <Form.Item label='Adresa agencije:' name="job_adresss" rules={[{ required: true, message: 'Molimo Vas, upišite adresu Vaše agencije!' }, { min: 3, message: "Adresa mora sadržati 3 ili više karaktera." }, { max: 64, message: "Adresa mora sadržati najvise 64 slova." },]}>
                            <Input value={adress} name="job_adress" onChange={e => setAdress(e.target.value)} prefix={<i className="ri-building-line"></i>} className='forAdress' type="text" placeholder='Upišite adresu agencije' required />
                        </Form.Item>

                        <hr />

                        {/* Dugme */}
                        <Input className='send-message' type="submit" value="Pošalji" disabled={!username || !jobname || !email || !pib || !kont || !adress} />

                    </Form>
                </div>
            </div>

            {/* Staza */}
            <div id="staza">
                <img id="bus" src={autobus} alt="Autobus" />
                <img id="bus1" src={autobus} alt="Autobus" />
            </div>
        </>
    )
}

export default Applaying