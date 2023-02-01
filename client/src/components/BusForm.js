import React from "react";
import { Col, Form, message, Modal, Row } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

const defaultForma = {
    type: 'Ima klimu',
    status: 'Treba da krene',
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
    selectedBus = { ...defaultForma, ...selectedBus }

    const onFinish = async (values) => {
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
            title={type === "add" ? "Dodavanje rute" : "Izmena rute"}
            open={showBusForm}
            onCancel={() => {
                setSelectedBus(null);
                setShowBusForm(false);
            }}
            footer={false}
        >
            <Form layout="vertical" onFinish={onFinish} initialValues={selectedBus}>
                <Row gutter={[10, 10]}>
                    <Col lg={24} xs={24}>
                        <Form.Item label="Ime agencije:" name="name">
                            <input type="text" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Broj autobusa:" name="number">
                            <input type="number" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Kapacitet:" name="capacity">
                            <input type="number" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Od grada:" name="from">
                            <input type="text" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Do grada:" name="to">
                            <input type="text" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={8} xs={24}>
                        <Form.Item label="Datum polaska:" name="journeyDate">
                            <input type="date" required/>
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Vreme polaska:" name="departure">
                            <input type="time" />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                        <Form.Item label="Vreme dolaska:" name="arrival">
                            <input type="time" />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Oprema:" name="type">
                            <select name="" id="">
                                <option value="Ima klimu">Klimatizovano</option>
                                <option value="Nema klimu">Neklimatizovano</option>
                            </select>
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Cena:" name="price">
                            <input type="number" required/>
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item label="Status:" name="status">
                            <select name="" id="">
                                <option value="Treba da krene">Treba da krene</option>
                                <option value="U pokretu">U pokretu</option>
                                <option value="Završio">Završio rutu</option>
                            </select>
                        </Form.Item>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <button title="Sačuvaj" className="dugme mt-2" type="submit">
                        Sačuvaj
                    </button>

                </div>
            </Form>
        </Modal>
    );
}

export default BusForm;
