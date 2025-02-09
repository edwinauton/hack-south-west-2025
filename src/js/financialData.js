import {calculateLoss, getDamageColor, map} from "./main.js";

export function loadFinancialData() {
// Fetch GeoJSON and process data
    fetch('src/resources/trimmed_fire_data.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
            // Pre-process coordinates and colors
            const processedGeoJsonData = {
                type: "FeatureCollection", features: geoJsonData.features.map(feature => {
                    const damage = feature.properties.DAMAGE;
                    const propertyValue = feature.properties.ASSESSEDIMPROVEDVALUE || 0;  // Default is 0
                    const loss = calculateLoss(damage, propertyValue);
                    const color = getDamageColor(damage);

                    return {
                        type: "Feature", geometry: {
                            type: "Point", coordinates: [feature.properties.Longitude, feature.properties.Latitude]
                        }, properties: {
                            ...feature.properties, Loss: loss, DamageColor: color
                        }
                    };
                })
            };

            // Add data to map
            map.addSource('financialDataPoints', {
                type: 'geojson', data: processedGeoJsonData
            });

            // Create layer with settings
            map.addLayer({
                id: 'financialDataLayer', type: 'circle', source: 'financialDataPoints', paint: {
                    'circle-radius': 5, 'circle-color': ['get', 'DamageColor'], 'circle-opacity': 0.7
                }, layout: {
                    'visibility': 'none'
                }
            }, 'miscDataLayer');

            // Handle point clicks for popups
            map.on('click', 'financialDataLayer', event => {
                if (event.features.length) {
                    const feature = event.features[0].properties;
                    const popupContent = `
                    <strong>Value:</strong> $${feature.ASSESSEDIMPROVEDVALUE || "N/A"}<br>
                    <strong>Damage Level:</strong> ${feature.DAMAGE || "N/A"}<br>
                    <strong>Estimated Loss:</strong> $${feature.Loss.toFixed(0) || "N/A"}
                `; // Default to 'N/A' if no value found
                    new mapboxgl.Popup()
                        .setLngLat(event.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                }
            });

            // Change cursor on hover
            map.on('mouseenter', 'financialDataLayer', () => map.getCanvas().style.cursor = 'pointer');
            map.on('mouseleave', 'financialDataLayer', () => map.getCanvas().style.cursor = '');
        })
}

export function showFinancialData() {
    map.setLayoutProperty('financialDataLayer', 'visibility', 'visible');
}

export function hideFinancialData() {
    map.setLayoutProperty('financialDataLayer', 'visibility', 'none');
}