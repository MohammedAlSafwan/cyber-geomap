import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import nmap from "node-nmap";
import axios from "axios";
import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputHistory, setInputHistory] = useState([]);
  const [nmapData, setNmapData] = useState(null);
  const [geoData, setGeoData] = useState([]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue) {
      setInputHistory([...inputHistory, inputValue]);
      const res = await axios.get(`https://ipapi.co/${inputValue}/json/`);
      const location = {
        name: res.data.ip,
        value: [res.data.longitude, res.data.latitude],
      };
      setGeoData([...geoData, location]);
      nmap.nmapLocation = 'nmap'; //default
      let quickscan = new nmap.QuickScan(`${inputValue}`);

      quickscan.on("complete", (data) => {
        setNmapData(data);
      });
      quickscan.startScan();
      // const nmap = new Nmap.NmapScan(inputValue);
      // nmap.on("complete", (data) => {
      //   setNmapData(data);
      // });
      // nmap.startScan();
    }
  };

  const getOption = () => {
    return {
      backgroundColor: "transparent",
      geo: {
        map: "world",
        roam: true,
        label: {
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            areaColor: "#323c48",
            borderColor: "#111",
          },
          emphasis: {
            areaColor: "#2a333d",
          },
        },
      },
      series: [
        {
          name: "IP Locations",
          type: "scatter",
          coordinateSystem: "geo",
          data: geoData,
          symbolSize: 12,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            emphasis: {
              borderColor: "#fff",
              borderWidth: 1,
            },
          },
        },
      ],
    };
  };

  return (
    <div className="App">
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter IP address or domain name"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {nmapData && (
        <div className="side-panel">
          {/* Display nmapData as a tree here */}
        </div>
      )}
      <ReactECharts option={getOption()} style={{ height: "100vh" }} />
    </div>
  );
};

export default App;