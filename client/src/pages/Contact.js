import Link from 'antd/lib/typography/Link';
import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { ContactUs } from './Contactus';
import '../resources/contact.css';
import ClockLoader from "react-spinners/ClockLoader";
import logo from '../resources/webuslogo.png';
import banner from '../resources/banner.jpg';
import kontakt from '../resources/kontaktadmin.png';
import sponsor1 from '../resources/drzavni.png';
import sponsor2 from '../resources/novipazar.png';
import { Card } from 'antd';


function Contact() {
    const [latitude] = useState(43.1382)
    const [longitude] = useState(20.5211)
    const [loading, setLoading] = useState(false);

    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });


    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 450)
    }, []);

    if (loading) {
        return <div className='spinnerglavni'>
            <ClockLoader
                color="#ffffff"
                size={100}
            />
        </div>
    }

    return (
        // Glavni div
        <div className='all-components' >
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
                            className='section-card justify-content-center text-center'
                            bordered={false}
                            style={{
                                width: 250,
                                
                            }}
                        >
                            <img title='QR kod - broj telefona' className='contact-admin' src={kontakt} alt='kontakt' />

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
                        <a href='https://www.novipazar.rs/' target="_blank"><img className='sponsor2' src={sponsor2} alt='gradnovipazar' /></a>

                    </Card>

                    <Card
                        className='sponsor-card justify-content-center'
                        bordered={false}
                        style={{
                            width: 400,
                        }}
                    >
                        <a href='http://www.dunp.np.ac.rs/' target="_blank"><img className='sponsor1' src={sponsor1} alt='drzavniuniverzitet' /></a>

                    </Card>

                </div>
                <div className='d-flex justify-content-center' style={{ width: '100%', height: "600px" }}>
                    <LeafletMap center={[latitude, longitude]} zoom={23} style={{ width: '100%', height: 'auto', margin: "3%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            cancelable={true}
                            draggable={false}
                            position={[latitude, longitude]}>
                            <Popup>
                                Državni univerzitet u Novom Pazaru
                                <br />
                                Latitude: {latitude}
                                <br />
                                Longitude: {longitude}
                            </Popup>
                        </Marker>
                    </LeafletMap>
                </div>




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
                            <h6 id='title-card'><i className="ri-bus-line"></i><br />WEBUS</h6>
                            <br />
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
                            <h6 id='title-card'><i className="ri-phone-line"></i><br />Kontakt</h6>
                            <p>
                                <br />
                                <b>Broj telefona:</b><br />
                                +381 64 406-26-70<br />
                                <b>Email:</b><br />
                                <Link title="webus.official@gmail.com" className='contact-link-card text-white' href='mailto:webus.official2022@gmail.com'>webus.official2022@gmail.com</Link><br />
                                <b>Društvene mreže:</b><br/>
                                <a title="Instagram" className='contact-link-card text-white m-2' href='https://www.instagram.com/lakota_aladin_/' target='_blank' ><i className="ri-instagram-line"></i></a>
                                <a title="Linkedin" className='contact-link-card text-white m-2' href='https://www.linkedin.com/in/aladin-lakota-450584203/' target='_blank' ><i className="ri-linkedin-box-fill"></i></a>
                                <a title="Facebook" className='contact-link-card text-white m-2' href='https://www.facebook.com/lakiilakota' target='_blank' ><i className="ri-facebook-circle-line"></i></a>
                                <a title="Github" className='contact-link-card text-white m-2' href='https://github.com/aladin99' target='_blank' ><i className="ri-github-line"></i></a>
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
                            <h6 id='title-card'><i className="ri-map-pin-line"></i><br />Gde se nalazimo?</h6>
                            <br />
                            <p>
                                <b>Adresa:</b><br />
                                Vuka Karadžića bb<br />
                                Novi Pazar, Srbija
                            </p>

                        </Card>
                    </div>

                    {/* Logo stranice */}
                    <img title='WEBUS LOGO' className='logo-footer' src={logo} alt='Webus logo' />
                    {/* WEBUS 2022 */}
                    <div className='reg' >
                        <p>Copyright &copy; 2023 WEBUS. All Rights Reserved.</p><br />
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Contact