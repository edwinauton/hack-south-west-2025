import {getDamageColor, map} from "./main.js";

export function loadMiscData() {
    fetch('src/resources/trimmed_fire_data.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
            // Pre-process coordinates and colors
            const processedGeoJsonData = {
                type: "FeatureCollection", features: geoJsonData.features.map(feature => ({
                    type: "Feature", geometry: {
                        type: "Point", coordinates: [feature.properties.Longitude, feature.properties.Latitude]
                    }, properties: {
                        ...feature.properties, DamageColor: getDamageColor(feature.properties.DAMAGE)
                    }
                }))
            };

            // Add data to map
            map.addSource('miscDataPoints', {
                type: 'geojson', data: processedGeoJsonData
            });

            // Create layer with settings
            map.addLayer({
                id: 'miscDataLayer', type: 'circle', source: 'miscDataPoints', paint: {
                    'circle-radius': 5, 'circle-color': ['get', 'DamageColor'], 'circle-opacity': 0.7
                }, layout: {
                    'visibility': 'none'
                }
            });

            // Handle clicks to show popups
            map.on('click', 'pointsLayer1', event => {
                const feature = event.features[0].properties;
                const popupContent = `
                    <strong>Year Built:</strong> ${feature.YEARBUILT || "N/A"}<br>
                    <strong>CAL FIRE Unit:</strong> ${feature.CALFIREUNIT || "N/A"}<br>
                    <strong>Community:</strong> ${feature.COMMUNITY || "N/A"}<br>
                    <strong>Distance to Utility:</strong> ${feature.UTILITYMISCSTRUCTUREDISTANCE || "N/A"}
                `; // Default to 'N/A' if no value found
                new mapboxgl.Popup()
                    .setLngLat(event.lngLat)
                    .setHTML(popupContent)
                    .addTo(map);
            });

            // Change cursor style on hover
            map.on('mouseenter', 'miscDataLayer', () => map.getCanvas().style.cursor = 'pointer');
            map.on('mouseleave', 'miscDataLayer', () => map.getCanvas().style.cursor = '');
        })
}

export function showMiscData() {
    map.setLayoutProperty('miscDataLayer', 'visibility', 'visible');
}

export function hideMiscData() {
    map.setLayoutProperty('miscDataLayer', 'visibility', 'none');
}