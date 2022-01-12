import React, { useEffect, useState } from "react";
import "./App.css";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const App = () => {
  const [option, setOption] = useState([]);
  let map = null;
  let color = [
    "#FF0000",
    "#4286f4",
    "#ffff00",
    "#ff00b2",
    "#bb00ff",
    "#00ffff",
    "#26ff00",
    "#00ff87",
  ];
  const initMap = () => {
    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 22.3850051, lng: 71.745261 },
      mapTypeId: "roadmap",
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT,
      },
      scrollwheel: true,
      streetViewControl: false,
      mapTypeControl: false,
    });
  };

  const onSearchHandler = (query) => {
    if (!query) {
      return;
    }
    setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`
      )
        .then((resp) => resp.json())
        .then((data) => {
          const searchResults = data.map((i, index) => ({
            id: index,
            boundingbox: i.boundingbox,
            display_name: i.display_name,
            lat: i.lat,
            lon: i.lon,
          }));
          setOption(searchResults);
        });
    }, 1000);
  };
  const onChangeHandler = (e) => {
    initMap();
    e.map((val, index) => {
      let bounds = {
        south: parseFloat(val.boundingbox[0]),
        north: parseFloat(val.boundingbox[1]),
        west: parseFloat(val.boundingbox[2]),
        east: parseFloat(val.boundingbox[3]),
      };

      const rectangle = new window.google.maps.Rectangle({
        strokeColor: color[index],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        editable: true,
        fillColor: color[index],
        fillOpacity: 0.35,
        map,
        bounds: bounds,
      });
      map.setCenter({ lat: parseFloat(val.lat), lng: parseFloat(val.lon) });
    });
  };

  useEffect(() => {
    initMap();
  }, []);

  return (
    <div style={{ height: `100vh` }}>
      <AsyncTypeahead
        id="React_Map_3863"
        align="justify"
        multiple
        labelKey="display_name"
        onSearch={(e) => {
          onSearchHandler(e);
        }}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        options={option}
        placeholder="Search city here"
        renderMenuItemChildren={(option, props, index) => {
          return (
            <div key={index}>
              <span>{option.display_name}</span>
            </div>
          );
        }}
      />

      <div className="maps" id="map"></div>
    </div>
  );
};

export default App;
