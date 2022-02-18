import React, { useState, useEffect } from "react";
import { Card, Dimmer, Loader, Select } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import Chart from "react-apexcharts";
import "./App.css";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

const currencys = [
  { value: "USD", text: "USD" },
  { value: "EUR", text: "EUR" },
  { value: "GBP", text: "GBP" },
];

function App() {
  const [display, setDisplay] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [coinPrice, setCoinPrice] = useState(null);
  const [chartValue, setChartValue] = useState(null);
  const [spade, setSapde] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date() - 10 * 86400000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        // api from coinDesk
        `https://api.coindesk.com/v1/bpi/currentprice.json`
      );
      const data = await res.json();
      setCoinPrice(data.bpi);
      getChartValue();
    }
    fetchData();
  }, [startDate, endDate]);

  const handleCurrency = (e, data) => {
    setCurrency(data.value);
  };

  const handleStartDateChange = (event, data) =>
    setStartDate(data.value.toISOString().slice(0, 10));

  const handleEndtDateChange = (event, data) =>
    setEndDate(data.value.toISOString().slice(0, 10));

  const getChartValue = async () => {
    const params = endDate
      ? `start=${startDate}&end=${endDate}&index=${currency}`
      : ``;
    const res = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?${params}`
    );
    const data = await res.json();
    const categories = Object.keys(data.bpi);
    const spade = Object.values(data.bpi);
    // console.log(spade);

    setChartValue({
      xaxis: {
        categories: categories,
        min: 2,
        max: 10,
      },
    });

    setSapde([
      {
        name: "Bitcoin Value",
        data: spade,
      },
    ]);

    setDisplay(false);
  };

  return (
    <div className="App">
      <div className="nav" style={{ padding: 15, backgroundColor: "#FFBD35" }}>
        Bitcoin Price
      </div>
      {display ? (
        <div>
          <Dimmer active inverted>
            <Loader>Loading...</Loader>
          </Dimmer>
        </div>
      ) : (
        <>
          <div
            className="price-box"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 150,
            }}
          >
            <div className="form" style={{ paddingRight: 40 }}>
              <Select
                placeholder="Select Currency"
                onChange={handleCurrency}
                options={currencys}
              ></Select>
            </div>
            <div className="value" style={{ paddingRight: 40 }}>
              <Card>
                <Card.Content>
                  <Card.Header>{currency} Currency</Card.Header>
                  <Card.Description>
                    {coinPrice[currency].rate}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
            <div className="startdate" style={{ marginRight: 20 }}>
              <SemanticDatepicker
                placeholder={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="startdate">
              <SemanticDatepicker
                placeholder={endDate}
                onChange={handleEndtDateChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chart
              options={chartValue}
              series={spade}
              type="line"
              width="1000"
              height="490"
            />
          </div>
        </>
      )}
      <div style={{ padding: 30, backgroundColor: "#313552", height: 85 }}>
        <div
          className="footer"
          style={{
            textAlign: "center",
            justifyContent: "center",
            fontSize: 25,
          }}
        >
          Bitcoin Price radar powered by coinDesk
        </div>
      </div>
    </div>
  );
}

export default App;
