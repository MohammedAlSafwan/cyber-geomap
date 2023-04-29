import React, { useState, useEffect } from 'react';
import Geomap from './components/Geomap';
import InputBox from './components/InputBox';
import SidePanel from './components/SidePanel';
import nmap from 'node-sudo-nmap';

const App = () => {
  const [geoJSON, setGeoJSON] = useState(null);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('https://geojson-maps.ash.ms/simple/110m.json')
      .then((res) => res.json())
      .then(setGeoJSON);
  }, []);

  const handleSearch = (value) => {
    nmap.scan({ targets: value }, (err, report) => {
      if (!err) {
        setData(report);
        const newLocations = report.map((item) => ({
          name: item.host,
          location: [item.geo.longitude, item.geo.latitude],
          value: item.scan.ports,
        }));
        setLocations((prevLocations) => [...prevLocations, ...newLocations]);
      }
    });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {geoJSON && <Geomap geoJSON={geoJSON} locations={locations} />}
      <InputBox onSearch={handleSearch} />
      {data && <SidePanel data={data} />}
    </div>
  );
};

export default App;