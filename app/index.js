import * as document from "document";
import * as clock from "./simple/clock";
import * as activity from "./simple/activity";
import * as hrm from "./simple/hrm";



/**
 * Datetime code
 */
const timeElem = document.getElementById("timeElem");
const dateElem = document.getElementById("dateElem");

function clockCallback(data) {
    timeElem.text = data.time;
    dateElem.text = data.date;
}

clock.initialize("minutes", "shortDate", clockCallback);

/**
 * STEPS, DISTANCE, AZM, CALORIES
 * Gets your current steps, and alters the arc based on your steps & steps goal.
 */

const stepsArc = document.getElementById("stepsArc");
const distanceArc = document.getElementById("distArc");
const AZMArc = document.getElementById("azmArc");
const caloriesArc = document.getElementById("calArc");
const floorsArc = document.getElementById("floorsArc");

const stepsCircle = document.getElementById("stepsCircle");
const distCircle = document.getElementById("distCircle");
const azmCircle = document.getElementById("azmCircle");
const calCircle = document.getElementById("calCircle");
const floorsCircle = document.getElementById("floorsCircle");

const distImage = document.getElementById("distImage");
const stepsImage = document.getElementById("stepsImage");
const azmImage = document.getElementById("azmImage");
const calImage = document.getElementById("calImage");
const floorsImage = document.getElementById("floorsImage");


function activityCallback(data) {
    stepsArc.sweepAngle = (data.steps.raw / data.steps.goal) * 360;
    distanceArc.sweepAngle = (data.distance.raw / (data.distance.goal / 1000)) * 360;
    AZMArc.sweepAngle = (data.activeMinutes.raw / data.activeMinutes.goal) * 360;
    caloriesArc.sweepAngle = (data.calories.raw / data.calories.goal) * 360;
    floorsArc.sweepAngle = (data.elevationGain.raw / data.elevationGain.goal) * 360;

    calculateArcEndPoint(stepsArc, stepsCircle, stepsImage);
    calculateArcEndPoint(distanceArc, distCircle, distImage);
    calculateArcEndPoint(AZMArc, azmCircle, azmImage);
    calculateArcEndPoint(caloriesArc, calCircle, calImage);
    calculateArcEndPoint(floorsArc, floorsCircle, floorsImage);
}

activity.initialize("seconds", activityCallback);

/**
 * Heart Rate code
 * Gets your current hr.
 */

const heartArc = document.getElementById("hrArc");
const heartCircle = document.getElementById("hrCircle");
const hrImage = document.getElementById("hrImage");

function hrmCallback(data) {
    let hr = data.bpm;
    if (hr === null) hr = "--";
    if (hr === "--") {
        return
    }

    heartArc.sweepAngle = (hr / 180) * 360;
    calculateArcEndPoint(heartArc, heartCircle, hrImage);
}

hrm.initialize(hrmCallback);

const arcWidth = 6;

function calculateArcEndPoint(arc, circle, image) {

    // We can cheat a lil since each arc is a full circle
    const width = arc.getBBox().width, x = arc.getBBox().x;
    const midPoint = (width / 2) + x, radius = width / 2;

    // Convert degrees to radians
    const sweepAngleRadians = ((arc.sweepAngle - 90) * Math.PI) / 180;

    // Calculate the endpoint coordinates
    const endpointX = midPoint + radius * Math.cos(sweepAngleRadians);
    const endpointY = midPoint + radius * Math.sin(sweepAngleRadians);

    // Finally to counter some sadness we calc an offset. The closer the point is to the max, the more one is added
    const offsetX = arcWidth * ((endpointX - x) / width);
    const offsetY = arcWidth * ((endpointY - x) / width);

    circle.cx = endpointX - offsetX;
    circle.cy = endpointY - offsetY;

    image.x = circle.cx - image.width / 2;
    image.y = circle.cy - image.height / 2;
}