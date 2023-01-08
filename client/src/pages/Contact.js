import Link from 'antd/lib/typography/Link';
import React, { useEffect, useState } from 'react';
import { ContactUs } from './Contactus';
import '../resources/contact.css';
import { useNavigate } from 'react-router-dom';
import logo from '../resources/webuslogo.png';
import banner from '../resources/banner.jpg';
import kontakt from '../resources/kontaktadmin.png';
import sponsor1 from '../resources/drzavni.png';
import sponsor2 from '../resources/novipazar.png';
import sponsor3 from '../resources/sharpbus.png';
import { Card, Spin } from 'antd';


function Contact() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    const [loading, setLoading] = useState(false);

    // Za skrol da se pojavi kada krene da se skrola na dnu stranice
    function onScroll() {
        // console.log(window.scrollY)
        if (window.scrollY > 300 && !scrolled) {
            setScrolled(true)
        } else if (window.scrollY < 300) {
            setScrolled(false)
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', onScroll)
        return () => {
            document.removeEventListener('scroll', onScroll)
        }
    }, []);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 300)
    }, []);

    // Rutovanje za korisnika 

    const userMenu = [
        {
            name: 'Početna',
            path: '/',
            icon: 'ri-home-2-line',
        },
        {
            name: 'Rezervacije',
            icon: 'ri-file-list-line',
            path: '/bookings',
        },
        {
            name: 'Kontakt',
            icon: 'ri-information-line',
            path: '/contact',
        },
        {
            name: 'Odjava',
            icon: 'ri-logout-box-line',
            path: '/logout',
        }
    ];

    const menuToBeRendered = userMenu;


    if (loading) {
        return <div className='spinner-parent'>
            <Spin size="large" style={{ transform: 'scale(2)' }} />
        </div>
    }

    return (
        // Glavni div
        <div className='all-components' >
            {/* Navigacija */}
            <nav className='navigation'>

                <div className='links d-flex flex-row justify-content-center gap-2 menu'>
                    {menuToBeRendered.map((item, index) => {
                        return (
                            <div key={item.path} className="menu m-0 p-0 d-flex align-items-center gap-2">
                                <i className={item.icon}></i>
                                <span
                                    onClick={() => {
                                        if (item.path === "/logout") {
                                            localStorage.removeItem("token");
                                            navigate("/login");
                                        } else {
                                            navigate(item.path);
                                        }
                                    }}
                                >{item.name}</span>
                            </div>
                        );
                    })}
                </div>

            </nav>

            {/* Glavni div */}
            <div className='global'>

                {/* Baner */}
                <div className='div-banner'>
                    <img className='banner' src={banner} alt='banner' />
                </div>

                {/* Sekcija */}
                <div className='global-section' >
                    {/* Naslov */}
                    <h1 className='contact-admin-h1' >Kontaktirajte administratora</h1>
                    {/* Linija */}
                    <hr className='hr-line' />
                    <div className="section site-card-border-less-wrapper d-flex gap-4 flex-wrap justify-content-center  p-3">

                        {/* KARTICA OD FORME */}
                        <Card
                            className='section-card'
                            bordered={false}
                            style={{
                                width: 500,
                            }}
                        >
                            {/* FORMA */}
                            <ContactUs />
                        </Card>

                        {/* QR-KOD */}
                        <Card
                            title='Kontakt telefon:'
                            className='section-card justify-content-center'
                            bordered={false}
                            style={{
                                width: 300,
                            }}
                        >
                            <img className='contact-admin' src={kontakt} alt='kontakt' />

                        </Card>

                    </div>
                </div>

                {/* Sponzori */}

                <h1 className='contact-admin-h1' >Sponzori</h1>
                <hr className='hr-line' />

                {/* Div sa sponzorima */}

                <div className="sponsor justify-content-center site-card-border-less-wrapper d-flex flex-wrap gap-3 p-3">

                    <Card
                        className='sponsor-card justify-content-center'
                        bordered={false}
                        style={{
                            width: 400,
                        }}
                    >
                        <img className='sponsor2' src={sponsor2} alt='gradnovipazar' />

                    </Card>

                    <Card
                        className='sponsor-card justify-content-center'
                        bordered={false}
                        style={{
                            width: 400,
                        }}
                    >
                        <img className='sponsor1' src={sponsor1} alt='drzavniuniverzitet' />

                    </Card>

                    <Card
                        className='sponsor-card justify-content-center'
                        bordered={false}
                        style={{
                            width: 400,
                        }}
                    >
                        <img className='sponsor3' src={sponsor3} alt='sharpbus' />

                    </Card>
                </div>

                {/* Vrati na vrh strelica */}

                <Link className={'scroll-up' + (scrolled ? ' scrolled' : '')} style={{ transition: 'transform 200ms ease-in-out' }} href='#'><i className="ri-arrow-up-line"></i></Link>
                {/* Futer */}

                <footer className='footer'>
                    <div className="site-card-border-less-wrapper d-flex flex-wrap justify-content-center gap-5 w-100">
                        {/* Prva kartica */}

                        <Card
                            className='contact-card'
                            bordered={false}
                            style={{
                                width: 400,
                            }}
                        >
                            <h6 id='title-card'>WEBUS</h6>
                            <hr />
                            <p className='p-2'>
                                Webus predstavlja veb aplikaciju za
                                rezervaciju autobuskih karti. <br />
                                Svojim korisnicima nudi brzu i efikasnu
                                rezervaciju karte 24/7.
                            </p>

                        </Card>

                        {/* Druga kartica */}
                        <Card
                            className='contact-card'
                            bordered={false}
                            style={{
                                width: 400,
                            }}
                        >
                            <h6 id='title-card'>Kontakt:</h6>
                            <hr />
                            <p>
                                <b>Broj telefona</b><br />
                                +381 64 406-26-70<br />
                                <b>Email:</b><br />
                                <Link className='contact-link-card' href='mailto:webus.official2022@gmail.com'>webus.official2022@gmail.com</Link><br />
                            </p>

                        </Card>
                        {/* Treća kartica */}
                        <Card
                            className='contact-card'
                            bordered={false}
                            style={{
                                width: 400,
                            }}
                        >
                            <h6 id='title-card'>Gde se nalazimo   <i className="ri-map-pin-line"></i></h6>
                            <hr />
                            <p>
                                <b>Adresa:</b><br />
                                Šumadijska 23<br />
                                Novi Pazar, Srbija
                            </p>

                        </Card>
                    </div>

                    {/* Logo stranice */}
                    <img className='logo-footer' src={logo} alt='webus-logo' />
                </footer>

                {/* WEBUS 2022 */}
                <div className='reg' >
                    <p>WEBUS &copy; 2022</p>
                </div>
            </div>
        </div>
    )
}

export default Contact