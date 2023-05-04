import ReactECharts from 'echarts-for-react';
import { GeoComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import {
    // CanvasRenderer,
    SVGRenderer,
} from 'echarts/renderers';
import { useEffect, useState } from 'react';

const EChartWorldMap = ({ pinsGeoLocation = [{}] }) => {
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [options, setOptions] = useState({}); // You can only set the map options once the map is loaded <3
    const initMapOptions = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        geo: {
            name: 'World Map',
            type: 'map',
            map: 'world',
            roam: true,
            label: {
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#a1afbe',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: []
    };

    useEffect(() => {
        fetchMap();
    }, [])

    useEffect(() => {
        if (!isMapLoading) {
            let { series } = initMapOptions;
            const foundData = onlyWithName(pinsGeoLocation)
            const geoDots = makeGeoDots(foundData);
            const geoLines = makeGeoLines(foundData);
            series = [
                {
                    name: 'geo-dots',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: geoDots
                },
                {
                    name: 'geo-lines',
                    type: 'lines',
                    coordinateSystem: 'geo',
                    polyline: false,
                    data: geoLines
                }
            ]
            initMapOptions.series = series
            setOptions(initMapOptions)
        }
    }, [pinsGeoLocation])

    const makeGeoLines = (data) => {
        const forEachData = data.map((point, i) => {
            const geoPoint = {
                name: `${point.host}`,
                fromName: `${point.host}`,
                toName: (i < data.length - 1) ? `${data[i + 1].host}` : '',
                coords: [[point.ipaddr.longitude, point.ipaddr.latitude], (i < data.length - 1) ? [data[i + 1].ipaddr.longitude, data[i + 1].ipaddr.latitude] : [0, 0]],
                label: {
                    formatter: point.host,
                    emphasis: {
                        // position: 'top',
                        show: true
                    }
                },
                lineStyle: {
                    color: '#FFA500',
                    curveness: 0.3,
                    width: 5,
                    opacity: 1,
                    type: `solid`
                }
            }
            return geoPoint;
        })
        forEachData.pop()
        console.log('makeGeoLines', forEachData)
        return forEachData
    }

    const fetchMap = async () => {
        fetch('assets/world.json')
            .then((response) => {
                if (response.status !== 200) {
                    console.log(`Houston we have a problem: ${response.status}`)
                    setIsMapLoading(false)
                    return
                }
                response.json().then(async (worldData) => {
                    echarts.use(
                        [GeoComponent, SVGRenderer]
                    );
                    await echarts.registerMap('world', worldData, {})
                    setIsMapLoading(false)
                    setOptions(initMapOptions)
                })
            })
    }
    const onlyWithName = (data) => {
        return data?.filter(point => {
            return point.host && point.ipaddr.success
        })
    }
    const makeGeoDots = (data) => {
        const forEachData = data.map(point => {
            const geoPoint = {
                name: `${point.host}`,
                value: [point.ipaddr.longitude, point.ipaddr.latitude],
                zIndex: 2,
                label: {
                    formatter: point.host,
                    emphasis: {
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#FFA500',
                        opacity: 1
                    }
                }
            }
            return geoPoint;
        })
        console.log('makeGeoDots', forEachData)
        return forEachData
    }

    const onChartReadyCallback = (echartsInstance) => {
        console.log('map is ready!!!', echartsInstance)
    }

    return (
        <ReactECharts
            // ref={e=>{}}
            style={{ zIndex: 0, background: 'transparent', height: '100vh' }}
            echarts={echarts}
            option={options}
            notMerge={true}
            lazyUpdate={true}
            onChartReady={onChartReadyCallback}
            showLoading={isMapLoading}
            opts={{}}
        />
    )
}
export default EChartWorldMap;