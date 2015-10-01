/**
 * Created by jerek0 on 29/09/15.
 */

export var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

export function log (msg) {
    console.log(msg);
}