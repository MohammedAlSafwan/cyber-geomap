import React, { useEffect, useRef } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';

const Map = ({ nmapData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Register the world map data
        fetch(process.env.PUBLIC_URL + "/World.geo.json")
            .then((res) => res.json())
            .then((mapData) => {
                echarts.registerMap("world", mapData);
            });

        if (nmapData) {
            // Update the map with the new nmapData
        }
    }, [nmapData]);

    const getOption = () => {
        return {
            title: {
                text: "Nmap Geomap Locator",
            },
            geo: {
                map: "world",
                roam: true,
            },
            series: [],
        };
    };

    return (
        <ReactEcharts
            ref={chartRef}
            style={{
                height: "100vh",
                width: "100vw",
            }}
            option={getOption()}
        />
    );
};

export default Map;