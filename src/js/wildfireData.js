import {map} from "./main.js";

export function loadWildfireData() {
    map.on('load', () => {
        // Preload detailed GeoJSON data to be rendered later
        fetch('src/resources/detailed_data.geojson')  // Path to detailed GeoJSON file
            .then(response => response.json())
            .then(detailedGeoJsonData => {
                map.addSource('detailed-geojson-data', {
                    type: 'geojson', data: detailedGeoJsonData
                });

                // Add polygon fill layer for detailed data (initially hidden)
                map.addLayer({
                    id: 'detailed-polygon-layer', type: 'fill', source: 'detailed-geojson-data', paint: {
                        'fill-color': '#FF5733', 'fill-opacity': 0.5
                    }, layout: {
                        'visibility': 'none'
                    }
                }, 'financialDataLayer');

                // Add polygon outline layer for detailed data (initially hidden)
                map.addLayer({
                    id: 'detailed-polygon-outline', type: 'line', source: 'detailed-geojson-data', paint: {
                        'line-color': '#FF5733', 'line-width': 1
                    }, layout: {
                        'visibility': 'none'
                    }
                }, 'financialDataLayer');
            })
    });
}

export function showWildfireData() {
    map.setLayoutProperty('detailed-polygon-layer', 'visibility', 'visible');
    map.setLayoutProperty('detailed-polygon-outline', 'visibility', 'visible');
}

export function hideWildfireData() {
    map.setLayoutProperty('detailed-polygon-layer', 'visibility', 'none');
    map.setLayoutProperty('detailed-polygon-outline', 'visibility', 'none');
}