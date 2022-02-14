import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [coinPrice, setCoinPrice] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );
      const data = await res.json();
      setCoinPrice(data.bpi);
      setDisplay(false);
    }
    fetchData();
  }, []);
  return (
    <div className="App">
      <div className="nav" style={{ padding: 15, backgroundColor: "#FFBD35" }}>
        Bitcoin Price
      </div>
      {display ? (
        <div></div>
      ) : (
        <>
          <div className="price-box"></div>
        </>
      )}
    </div>
  );
}

export default App;
