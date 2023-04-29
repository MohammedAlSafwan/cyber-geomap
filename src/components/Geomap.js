import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const Geomap = ({ geoJSON, locations }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (geoJSON) {
      echarts.registerMap('world', geoJSON);

      const chart = echarts.init(chartRef.current);
      chart.setOption({
        series: [
          {
            type: 'lines',
            coordinateSystem: 'geo',
            data: locations.map((item, index) => {
              if (index < locations.length - 1) {
                return {
                  coords: [item.location, locations[index + 1].location],
                };
              }
              return null;
            }),
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: locations.map((item) => ({
              name: item.name,
              value: item.location.concat(item.value),
            })),
          },
        ],
        geo: {
          map: 'world',
          roam: true,
        },
      });

      return () => {
        chart.dispose();
      };
    }
  }, [geoJSON, locations]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default Geomap;