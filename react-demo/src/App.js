import React from "react";
import "./App.css";
import { useState } from "react";

function App() {
  const [inputarr, SetInputarr] = useState([]);

  const [inputdata, SetInputdata] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  function changehandle(e) {
    SetInputdata({ ...inputdata, [e.target.name]: e.target.value });
  }
  let { name, phoneNumber, address } = inputdata;
  function changehandle() {
    SetInputarr(...inputarr, { name, phoneNumber, address });
  }
  return (
    <div className="App">
      <input
        type="text"
        autoComplete="off"
        name="name"
        value={inputdata.name}
        onChange={changehandle}
        placeholder="Enter A Name"
      />
      <br /> <br />
      <input
        type="text"
        autoComplete="off"
        name="phoneNumber"
        value={inputdata.phoneNumber}
        onChange={changehandle}
        placeholder="Enter phoneNumber"
      />
      <br /> <br />
      <input
        type="text"
        autoComplete="off"
        name="address"
        value={inputdata.address}
        onChange={changehandle}
        placeholder="Enter address "
      />
      <br /> <br />
      <button onClick={changehandle}>Add It</button>
    </div>
  );
}

export default App;
