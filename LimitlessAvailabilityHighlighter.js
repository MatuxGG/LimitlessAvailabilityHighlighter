// ==UserScript==
// @name         LimitlessAvailabilityHighlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights table rows based on configured availability times
// @author       MatuxGG
// @match        https://play.limitlesstcg.com/tournaments/upcoming
// @match        https://play.limitlesstcg.com/tournaments/upcoming/
// @match        https://play.limitlesstcg.com/tournaments
// @match        https://play.limitlesstcg.com/tournaments/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Availability configuration by day
    const availability = {
        monday: [
            { start: "08:00", end: "20:00" },
        ],
        tuesday: [
            { start: "18:00", end: "20:00" },
        ],
        wednesday: [
            { start: "8:00", end: "20:00" },
        ],
        thursday: [
            { start: "18:00", end: "20:00" },
        ],
        friday: [
            { start: "08:00", end: "20:00" },
        ],
        saturday: [
            { start: "08:00", end: "20:00" },
        ],
        sunday: [
            { start: "08:00", end: "20:00" },
        ],
    };

    // Convert a time in HH:mm format to minutes since midnight
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // Check if a given date falls within an interval
    const isInInterval = (dateStr, intervals) => {
        const date = new Date(dateStr);
        const day = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const time = date.getHours() * 60 + date.getMinutes();

        if (!availability[day]) {
            console.log(`No availability configured for ${day}`);
            return false;
        }

        const isInInterval = availability[day].some(({ start, end }) => {
            const startMinutes = timeToMinutes(start);
            const endMinutes = timeToMinutes(end);
            return time >= startMinutes && time <= endMinutes;
        });

        //console.log(`Date: ${dateStr}, Day: ${day}, Time: ${time}, In Interval: ${isInInterval}`);
        return isInInterval;
    };

    // Apply styles to tables
    const highlightRows = () => {
        document.querySelectorAll("table").forEach((table, tableIndex) => {
            //console.log(`Processing table #${tableIndex + 1}`);
            table.querySelectorAll("tr[data-date]").forEach((row, rowIndex) => {
                const date = row.getAttribute("data-date");
                if (!date) {
                    //console.log(`Row #${rowIndex + 1} has no data-date attribute. Skipping.`);
                    return;
                }

                const isInTimeRange = isInInterval(date, availability);
                //console.log(`Row #${rowIndex + 1}, Data-Date: ${date}, In Time Range: ${isInTimeRange}`);

                row.querySelectorAll("td").forEach((cell) => {
                    cell.style.backgroundColor = isInTimeRange ? "lightgreen" : "lightcoral";
                });
            });
        });
    };

    // Execute the script after the page fully loads
    window.addEventListener("load", () => {
        //console.log("Page loaded. Starting row highlighting...");
        highlightRows();
        console.log("[Limitless availability highlighter] Script loaded");
    });
})();
