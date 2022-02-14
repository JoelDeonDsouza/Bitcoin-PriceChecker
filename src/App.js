import React, { useState, useEffect } from "react";
import { Card, Dimmer, Loader, Select } from "semantic-ui-react";
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

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        //api from coinDesk
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );
      const data = await res.json();
      setCoinPrice(data.bpi);
      setDisplay(false);
    }
    fetchData();
  }, []);

  const handleCurrency = (e, data) => {
    setCurrency(data.value);
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
        </>
      )}
    </div>
  );
}

export default App;
