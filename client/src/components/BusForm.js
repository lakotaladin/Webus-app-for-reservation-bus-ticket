import React from 'react'
import { Form, Row, Col, message, Modal, Select, Input } from 'antd'
import { axiosInstance } from "./helpers/axiosInstance"
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../redux/alertsSlice'


// Default vrednosti forme
const defaultForma = {
    type: 'Ima klimu',
    status: 'Tek treba da krene',
}



function BusForm({
    showBusForm,
    setShowBusForm,
    type = "add",
    getData,
    selectedBus,
    setSelectedBus,
}) {
    const dispatch = useDispatch();

    // Kupi default vrednosti za formu
    selectedBus = {...defaultForma, ...selectedBus}

    const onFinish = async (values) => {
        console.log('values', values)
        try {
            dispatch(ShowLoading());
            let response = null;
            if (type === "add") {
                response = await axiosInstance.post("/api/buses/add-bus", values);
            } else {
                response = await axiosInstance.post("/api/buses/update-bus", {
                    ...values,
                    _id: selectedBus._id,
                });
            }
            if (response.data.success) {
                message.success(response.data.message);
            } else {
                message.error(response.data.message);
            }
            getData();
            setShowBusForm(false);
            setSelectedBus(null);

            dispatch(HideLoading());
        } catch (error) {
            message.error(error.message);
            dispatch(HideLoading());
        }
    };
    return (
        <Modal
            width={800}
            title={type === "add" ? "Dodaj rutu" : "Izmeni rutu"}
            open={showBusForm}
            onCancel={() => {
                setSelectedBus(null);
                setShowBusForm(false);
            }}
            footer={false}
        >
            <Form layout="vertical" onFinish={onFinish} initialvalues={selectedBus}>
                <Row gutter={[10, 10]}>
                    <Col lg={24} xs={24}>
                        <Form.Item label="Ime autobusa" name="name">
                            <Input type="text"  required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Broj autobusa" name="number">
                            <Input type="text" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Kapacitet" name="capacity">
                            <Input type="text" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Od" name="from">
                            <Input type="text" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Do" name="to">
                            <Input type="text" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label="Datum polaska" name="journeyDate">
                            <Input type="date" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Vreme polaska" name="departure">
                            <Input type="time" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Vreme dolaska" name="arrival">
                            <Input type="time" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Tip" name="type">
                            <Select
                                initialvalues="Ima klimu"
                                className='inputizabusformu'
                                options={[
                                    {
                                        value: 'Ima klimu',
                                        label: 'Ima klimu',
                                    },
                                    {
                                        value: 'Nema klimu',
                                        label: 'Nema klimu',
                                    },

                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Cena karte" name="price">
                            <Input type="text" />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Status" name="status">
                            <Select
                                initialvalues="Tek treba da krene"
                                className='inputizabusformu'
                                options={[
                                    {
                                        value: 'Tek treba da krene',
                                        label: 'Tek treba da krene',
                                    },
                                    {
                                        value: 'U pokretu',
                                        label: 'U pokretu',
                                    },
                                    {
                                        value: 'Završio',
                                        label: 'Završio',
                                    },

                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <button className="dugme" type="submit">
                        Sačuvaj
                    </button>
                </div>
            </Form>
        </Modal>
    );
}

export default BusForm;