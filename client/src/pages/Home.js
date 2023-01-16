import { Col, message, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Bus from "../components/Bus";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Home() {
  const { user } = useSelector((state) => state.users);
  const [filters = {}, setFilters] = useState({});
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);

  const getBuses = async () => {
    const tempFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        tempFilters[key] = filters[key];
      }
    });
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/buses/get-all-buses",
        tempFilters,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBuses();
  }, [dispatch]);
  return (
    <div>
      <div className="my-3 py-1">
        <Row gutter={10} align="center">
          <Col lg={6} sm={24}>
            <input
              className="m-1"
              type="text"
              placeholder="Od"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              required
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
            className="m-1"
              type="text"
              placeholder="Do"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              required
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
            className="m-1"
              type="date"
              placeholder="Datum"
              value={filters.journeyDate}
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24} >
            <div className="d-flex gap-3 p-0 ml-10">
              <button className="buttonsearch p-1" onClick={() => getBuses()}>
              <i className="ri-search-eye-line"></i>
              </button>
              <button
                className="buttonsearch p-1"
                onClick={() =>
                  setFilters({
                    from: "",
                    to: "",
                    journeyDate: "",
                  })
                }
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15, 15]}>
          {buses
            .filter((bus) => bus.status === "Treba da krene")
            .map((bus) => (
              // Raspored kartica
              <Col key={bus._id} lg={12} xs={24} sm={24}>
                <Bus bus={bus} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
