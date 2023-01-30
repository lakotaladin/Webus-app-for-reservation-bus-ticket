import { AutoComplete, Col, Input, message, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Bus from "../components/Bus";
import '../resources/noresult.css';
import noresult from '../resources/noresult.png';
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import DisplayTimezone from "./DisplayTimezone";


function Home() {
  const { user } = useSelector((state) => state.users);
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([])

  // Dohvati sve gradove iz baze
  async function getCities() {
    try {
      const response = await axios.get("/api/buses/get-all-cities");
      setCities(response.data.data.map(c => ({ value: c })))
    } catch (error) {
      console.error(error)
    }
  }

  // Dugme koje menja vrednosti iz dva inputa
  function swapfilters() {
    setFilters(f => ({ ...f, from: f.to, to: f.from }))
  }

  // Dohvati sve rute
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
    getCities();
  }, [dispatch]);

  // console.log("Filteri", filters)

  return (
    <div>
      <div className="searchheader my-3 p-2">

        <Row gutter={10} align="center">

          {/* Od grada input */}
          <Col lg={4} sm={24}>

            <AutoComplete className="autocomplete m-1" type="text" placeholder="Od grada" options={cities}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              value={filters.from || ''}
              onChange={(data) => {
                setFilters({ ...filters, from: data });
              }}
              onSelect={(value) => {
                setFilters({ ...filters, from: value })
              }}
              required
            />

          </Col>

          {/* Zamena vrednosti iz inputa */}
          <button className="switcher" type="submit" onClick={swapfilters}><i className="ri-arrow-left-right-line"></i></button>

          {/* Do grada input */}
          <Col lg={4} sm={24}>
            <AutoComplete
              className="autocomplete m-1"
              type="text"
              prefix={<i className="ri-community-fill"></i>}
              placeholder="Do grada"

              options={cities}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              value={filters.to || ''}
              onChange={(data) => {
                setFilters({ ...filters, to: data });
              }}
              onSelect={(value) => {
                setFilters({ ...filters, to: value })
              }} required
            />
          </Col>

          {/* Cena input */}
          <Col lg={4} sm={24}>
            <Input
              className="m-1"
              type="number"
              placeholder="Cena karte"
              value={filters.price || ''}
              onChange={(e) =>
                setFilters({ ...filters, price: e.target.value })
              }
            />
          </Col>

          {/* Datum input */}
          <Col lg={4} sm={24}>
            <Input
              className="m-1"
              type="date"
              placeholder="Datum"
              value={filters.journeyDate || ''}
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />
          </Col>

          {/* Lupa i x */}
          <Col lg={3} sm={24} >
            <div className="d-flex gap-3 justify-content-center p-0 ml-10">
              <button className="buttonsearch p-1" onClick={() => getBuses()}>
                <i className="ri-search-eye-line"></i>
              </button>
              <button
                className="buttonsearch p-1"
                onClick={() =>
                  setFilters({
                    from: "",
                    to: "",
                    price: "",
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
      {buses.length > 0 ?
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
          {/* Vremenska zona */}
          <DisplayTimezone/>
        </div> : <div className="noresult d-flex w-100"><img style={{ width: "350px", opacity: "0.4", marginTop: "10%" }} src={noresult} alt="Nema rezultata, pokušajte ponovo." ></img><br /><h2>Nema rezultata, pokušajte ponovo.</h2></div>}
    </div>
  );
}

export default Home;
