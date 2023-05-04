import { geoEqualEarth, geoPath } from 'd3-geo'
import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { feature } from 'topojson-client'

const WorldMapAtlas = ({ scale = 200, cx = 400, cy = 150 }) => {

  const [geographies, setGeographies] = useState([])
  const projection = geoEqualEarth().scale(scale).translate([cx, cy]).rotate([0, 0])
  // const link = [
  //   { type: "LineString", coordinates: [[100, 60], [-60, -30]] },
  //   { type: "LineString", coordinates: [[10, -20], [-60, -30]] },
  //   { type: "LineString", coordinates: [[10, -20], [130, -30]] }
  // ]

  useEffect(() => {
    fetch('assets/world-110m.v1.json').then((response) => {
      if (response.status !== 200) {
        console.log(`Houston we have a problem: ${response.status}`)
        return
      }
      response.json().then((worldData) => {
        const mapFeatures= (feature(worldData, worldData.objects.countries)).features
        setGeographies(mapFeatures)
      })
    })
  }, [])

  return (
    <div>
      <svg width={scale * 3} height={scale * 3} viewBox="0 0 800 450">
        <g>
          {(geographies).map((d, i) => (
            <path
              key={`path-${uuid()}`}
              d={geoPath().projection(projection)(d)}
              fill={`rgba(38,50,56,${(1 / (geographies ? geographies.length : 0)) * i})`}
              stroke="aliceblue"
              strokeWidth={0.5}
            />
          ))}
        </g>
      </svg>
    </div>
  )

}

export default WorldMapAtlas