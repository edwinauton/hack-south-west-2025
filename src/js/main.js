import {hideMiscData, loadMiscData, showMiscData} from "./miscData.js";
import {hideFinancialData, loadFinancialData, showFinancialData} from "./financialData.js";
import {hideWildfireData, loadWildfireData, showWildfireData} from "./wildfireData.js";

mapboxgl.accessToken = 'pk.eyJ1IjoiZWE5OTQiLCJhIjoiY202d280MzVrMGdwbTJpc2t6dzN2YXRiNSJ9.RqG9eeFRV9-w08A_eOJ9Rw';

export const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-118.5, 36.5],
    zoom: 6,
    pitch: 30,
    bearing: 16
});

//366.119/-118.325/16.8/48

export function calculateLoss(damage, value) {
    const damageMap = {
        "Affected (1-9%)": 0.09, "Minor (10-25%)": 0.25, "Major (26-50%)": 0.50, "Destroyed (>50%)": 1
    };

    return value * (damageMap[damage] || 0); // Default to 0 if no match
}

export function getDamageColor(damageLevel) {
    const damageColorMap = {
        "No Damage": "green",
        "Affected (1-9%)": "yellow",
        "Minor (10-25%)": "orange",
        "Major (26-50%)": "red",
        "Destroyed (>50%)": "black"
    };

    return damageColorMap[damageLevel] || "gray"; // Default to "gray" if no match
}

async function main() {
    loadWildfireData();
    loadFinancialData();
    loadMiscData();

    document.getElementById('wildfireToggle').addEventListener('change', function () {
        if (this.checked) {
            showWildfireData();
        } else {
            hideWildfireData();
        }
    });
    document.getElementById('financialToggle').addEventListener('change', function () {
        if (this.checked) {
            showFinancialData();
        } else {
            hideFinancialData();
        }
    });
    document.getElementById('miscToggle').addEventListener('change', function () {
        if (this.checked) {
            showMiscData();
        } else {
            hideMiscData();
        }
    });
}

main()