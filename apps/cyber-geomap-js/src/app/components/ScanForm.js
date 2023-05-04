import { useEffect, useState } from 'react';
import { fetchGeoLocation } from '../utilities/util';
import IpAddressInput from './IpAddressInput';
import SidePanel from './SidePanel';
import EChartWorldMap from './map/echarts/EChartWorldMap';

const ScanForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [ipGeoLocation, setIpGeoLocation] = useState([]);


  useEffect(() => {
    const fetchAllGeoLocations = async () => {
      if (data) {
        const hops = await Promise.all(
          data.nmaprun.host.trace.hop.map(async (hop) => {
            const ipaddr = await fetchGeoLocation(hop._attributes.ipaddr);
            return {
              ipaddr,
              host: hop._attributes.host,
            };
          })
        );

        setIpGeoLocation(hops);
      }
    };

    fetchAllGeoLocations();
  }, [data]);

  useEffect(() => {
    console.log('ipGeoLocation:', ipGeoLocation);
  }, [ipGeoLocation]);

  return (
    <div>
      <IpAddressInput setIsLoading={setIsLoading} setData={setData} setError={setError}>
        <EChartWorldMap pinsGeoLocation={ipGeoLocation} />
        <SidePanel data={data} />

      </IpAddressInput>
    </div>
  );
};

export default ScanForm;