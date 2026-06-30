console.log("psychrometric.js loaded");

"use strict";

/* ===========================
   SET UNIT SYSTEM
=========================== */

psychrolib.SetUnitSystem(psychrolib.SI);

console.log("PsychroLib Loaded:", psychrolib);

/* ===========================
   ELEMENTS
=========================== */

const mode = document.getElementById("mode");
const secondaryLabel = document.getElementById("secondaryLabel");
const secondaryInput = document.getElementById("secondaryInput");

const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const pdfBtn = document.getElementById("pdfBtn");

const statusBar = document.getElementById("statusBar");
const resultsTable = document.getElementById("resultsTable");

let reportData = [];

/* ===========================
   PRESSURE FROM ALTITUDE
=========================== */

function pressureFromAltitude(h) {

    return (
        101325 *
        Math.pow(
            (1 - 2.25577e-5 * h),
            5.25588
        )
    );

}

/* ===========================
   RH / WBT SWITCH
=========================== */

mode.addEventListener("change", function () {

    if (this.value === "rh") {

        secondaryLabel.textContent =
            "Relative Humidity (%)";

        secondaryInput.placeholder =
            "Enter Relative Humidity";

    } else {

        secondaryLabel.textContent =
            "Wet Bulb Temperature (°C)";

        secondaryInput.placeholder =
            "Enter Wet Bulb Temperature";

    }

});

mode.dispatchEvent(new Event("change"));

/* ===========================
   CALCULATE
=========================== */

calculateBtn.addEventListener("click", calculate);

function calculate() {

    statusBar.textContent = "Calculating...";

    try {

        const dbt =
            parseFloat(document.getElementById("dbt").value);

        const altitude =
            parseFloat(
                document.getElementById("altitude").value || 0
            );

        let pressureInput =
            document.getElementById("pressure").value;

        let pressure =
            pressureInput
                ? parseFloat(pressureInput)
                : pressureFromAltitude(altitude);

        let rh;
        let wbt;
        let dew;
        let w;

        if (mode.value === "rh") {

            rh =
                parseFloat(secondaryInput.value) / 100;

            w =
                psychrolib.GetHumRatioFromRelHum(
                    dbt,
                    rh,
                    pressure
                );

            wbt =
                psychrolib.GetTWetBulbFromRelHum(
                    dbt,
                    rh,
                    pressure
                );

            dew =
                psychrolib.GetTDewPointFromRelHum(
                    dbt,
                    rh
                );

        } else {

            wbt =
                parseFloat(secondaryInput.value);

            w =
                psychrolib.GetHumRatioFromTWetBulb(
                    dbt,
                    wbt,
                    pressure
                );

            rh =
                psychrolib.GetRelHumFromTWetBulb(
                    dbt,
                    wbt,
                    pressure
                );

            dew =
                psychrolib.GetTDewPointFromHumRatio(
                    dbt,
                    w,
                    pressure
                );
        }

        const enthalpy =
            psychrolib.GetMoistAirEnthalpy(
                dbt,
                w
            );

        const sv =
            psychrolib.GetMoistAirVolume(
                dbt,
                w,
                pressure
            );

        const density = 1 / sv;

        const vapPressure =
            psychrolib.GetVapPresFromRelHum(
                dbt,
                rh
            );

        const satRatio =
            psychrolib.GetSatHumRatio(
                dbt,
                pressure
            );

        const degreeSat =
            w / satRatio;

        reportData = [

            ["Dry Bulb Temperature", dbt.toFixed(2), "°C"],
            ["Pressure", pressure.toFixed(2), "Pa"],
            ["Relative Humidity", (rh * 100).toFixed(2), "%"],
            ["Wet Bulb Temperature", wbt.toFixed(2), "°C"],
            ["Dew Point", dew.toFixed(2), "°C"],
            ["Humidity Ratio", w.toFixed(6), "kg/kg"],
            ["Enthalpy", (enthalpy / 1000).toFixed(2), "kJ/kg"],
            ["Specific Volume", sv.toFixed(4), "m³/kg"],
            ["Density", density.toFixed(4), "kg/m³"],
            ["Vapor Pressure", vapPressure.toFixed(2), "Pa"],
            ["Degree of Saturation", degreeSat.toFixed(4), "-"]

        ];

        resultsTable.innerHTML = `

            <tr><td>Dry Bulb Temperature</td><td>${dbt.toFixed(2)}</td><td>°C</td></tr>

            <tr><td>Pressure</td><td>${pressure.toFixed(2)}</td><td>Pa</td></tr>

            <tr><td>Relative Humidity</td><td>${(rh * 100).toFixed(2)}</td><td>%</td></tr>

            <tr><td>Wet Bulb Temperature</td><td>${wbt.toFixed(2)}</td><td>°C</td></tr>

            <tr><td>Dew Point</td><td>${dew.toFixed(2)}</td><td>°C</td></tr>

            <tr><td>Humidity Ratio</td><td>${w.toFixed(6)}</td><td>kg/kg</td></tr>

            <tr><td>Enthalpy</td><td>${(enthalpy / 1000).toFixed(2)}</td><td>kJ/kg</td></tr>

            <tr><td>Specific Volume</td><td>${sv.toFixed(4)}</td><td>m³/kg</td></tr>

            <tr><td>Density</td><td>${density.toFixed(4)}</td><td>kg/m³</td></tr>

            <tr><td>Vapor Pressure</td><td>${vapPressure.toFixed(2)}</td><td>Pa</td></tr>

            <tr><td>Degree of Saturation</td><td>${degreeSat.toFixed(4)}</td><td>-</td></tr>

        `;

        statusBar.textContent =
            "Calculation completed successfully";

    }
    catch (error) {

        statusBar.textContent =
            "Error: " + error.message;

        console.error(error);

    }
}

/* ===========================
   CLEAR
=========================== */

clearBtn.addEventListener("click", function () {

    document.getElementById("dbt").value = "";
    document.getElementById("secondaryInput").value = "";
    document.getElementById("altitude").value = "0";
    document.getElementById("pressure").value = "";

    resultsTable.innerHTML = "";

    reportData = [];

    statusBar.textContent = "Ready";

});

/* ===========================
   PDF EXPORT
=========================== */

pdfBtn.addEventListener("click", function () {

    if (reportData.length === 0) {

        alert(
            "Please perform a calculation first."
        );

        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
        "Performance Analyst",
        20,
        20
    );

    doc.setFontSize(14);
    doc.text(
        "Psychrometric Calculation Report",
        20,
        30
    );

    doc.setFontSize(10);
    doc.text(
        "Generated: " +
        new Date().toLocaleString(),
        20,
        40
    );

    let y = 55;

    reportData.forEach(function (item) {

        doc.text(
            `${item[0]} : ${item[1]} ${item[2]}`,
            20,
            y
        );

        y += 8;

    });

    doc.save(
        "Psychrometric_Report.pdf"
    );

});