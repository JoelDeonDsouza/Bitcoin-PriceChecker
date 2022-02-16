import React, { useState, useEffect } from "react";
import { Card, Dimmer, Input, Loader, Select } from "semantic-ui-react";
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
    const categories = Object.keys(data.bpi);
    const spade = Object.values(data.bpi);

    setChartValue({
      xaxis: {
        categories: categories,
        min: 22,
        max: 31,
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
            <div className="startdate">
              <Input
                type="date"
                id="startDate"
                style={{ paddingRight: 40 }}
              ></Input>
            </div>
            <div className="enddate">
              <Input type="date" id="startDate"></Input>
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
