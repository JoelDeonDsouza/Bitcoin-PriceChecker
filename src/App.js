import React, { useState, useEffect } from "react";
import { Card, Dimmer, Loader, Select } from "semantic-ui-react";
import Chart from "react-apexcharts";
import "./App.css";

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

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        //api from coinDesk
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );
      const data = await res.json();
      setCoinPrice(data.bpi);
      getChartValue();
    }
    fetchData();
  }, []);

  const handleCurrency = (e, data) => {
    setCurrency(data.value);
  };

  const getChartValue = async () => {
    const res = await fetch(
      "https://api.coindesk.com/v1/bpi/historical/close.json"
    );
    const data = await res.json();
    const list = Object.keys(data.bpi);
    const spade = Object.values(data.bpi);

    setChartValue({
      xaxis: {
        list: list,
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
              justifyContent: "space-around",
              alignItems: "center",
              width: 600,
              height: 300,
            }}
          >
            <div className="form">
              <Select
                placeholder="Select Currency"
                onChange={handleCurrency}
                options={currencys}
              ></Select>
            </div>
            <div className="value">
              <Card>
                <Card.Content>
                  <Card.Header>{currency} Currency</Card.Header>
                  <Card.Description>
                    {coinPrice[currency].rate}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chart
              options={chartValue}
              series={spade}
              type="line"
              width="1000"
              height="400"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
