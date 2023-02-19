let OFFSET_X = 0;
let OFFSET_Y = 0;

function drawFull(data, station_decode) {
    const c = document.getElementById("canvas_full");

    OFFSET_X = data["spec"]["center"][0];
    OFFSET_Y = data["spec"]["center"][1];

    for (const lineData of data["full"]["lines"]) {
        const lineID = lineData["line"];
        for (const data of lineData["data"]) {
            drawLine(lineID, data, c);
        }
    }
    for (const lineData of data["full"]["stations"]) {
        const lineID = lineData["line"];
        for (const station of lineData["data"]) {
            drawStation(lineID, station, station_decode, c);
        }
    }
}

function drawSingle(data) {
    for (const lineData of data["single"]) {
        const singleLineID = lineData["line"];
        const stations = lineData["stations"];
        const c = document.getElementById(`canvas_${singleLineID}`);
        for (const station of stations) {
            const lineID = station["line"];
            for (const data of station["data"]) {
                drawSingleStation(lineID, data, c);
            }
        }
    }
}


const SCALE = 24 //* 2;
// const OFFSET = 1000;

const COLOR = {
    "TRTC_R": "#e3002c",
    "TRTC_G": "#008659",
    "TRTC_BL": "#0070bd",
    "TRTC_O": "#f8b61c",
    "TRTC_BR": "#c48c31",
    "TRTC_Y": "#ffdb00",
    "TRTC_R22A": "#fd92a3",
    "TRTC_G03A": "#cfdb00",
    "TYMC_A": "#8246AF",
    "NTDLRT_V": "#E5554F",
    "KRTC_R": "#e20b65",
    "KRTC_O": "#faa73f",
    "KLRT_C": "#7cbd52",
    "External": "#CCCCCC"
}

const CIRCLE_INNER_RADIUS = 10.8 //* 2
const CIRCLE_CENTER_RADIUS = 12.6 //* 2
const TERMINAL_CIRCLE_RADIUS = 16 //* 2
const TRANSFER_OFFSET = 10 //* 2
const TERMINAL_TRANSFER_TEXT_OFFSET = 1.6 //* 2
const STROKE = 3.6 //* 2
const SPACE = 3.2 //* 2

const NAME_SPACE = 20 //* 2
const NAME_SPACE_LARGE = 32 //* 2

const LINE_WIDTH = 6 //* 2

const TEXT_SIZE = ((DRAW == "ZH" || DRAW == "JA") ? 26 : 16) / 2;

function drawStation(lineID, station, station_decode, c) {
    const pos = station["pos"];
    const posX = scaleX(pos[0]), posY = scaleY(pos[1]);

    let ctx = c.getContext("2d");

    ctx.beginPath();

    switch (station["type"]) {
        case "TR": {
            ctx.moveTo(posX, posY - CIRCLE_CENTER_RADIUS);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - CIRCLE_CENTER_RADIUS);
            ctx.arc(posX + TRANSFER_OFFSET, posY, CIRCLE_CENTER_RADIUS, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + CIRCLE_CENTER_RADIUS);
            break;
        }
        case "LTR": {
            ctx.moveTo(posX, posY - TERMINAL_CIRCLE_RADIUS + STROKE / 2);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - TERMINAL_CIRCLE_RADIUS + STROKE / 2);
            ctx.arc(posX + TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS - STROKE / 2, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + TERMINAL_CIRCLE_RADIUS - STROKE / 2);
            break;
        }
        case "TER-TR": {
            ctx.moveTo(posX, posY - TERMINAL_CIRCLE_RADIUS);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - TERMINAL_CIRCLE_RADIUS);
            ctx.arc(posX + TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + TERMINAL_CIRCLE_RADIUS);
            break;
        }
        // case "LTL":
        case "TL": {
            ctx.moveTo(posX, posY + CIRCLE_CENTER_RADIUS);
            ctx.lineTo(posX - TRANSFER_OFFSET, posY + CIRCLE_CENTER_RADIUS);
            ctx.arc(posX - TRANSFER_OFFSET, posY, CIRCLE_CENTER_RADIUS, 0.5 * Math.PI, 1.5 * Math.PI);
            ctx.lineTo(posX, posY - CIRCLE_CENTER_RADIUS);
            break;
        }
        case "TER-TL": {
            ctx.moveTo(posX, posY + TERMINAL_CIRCLE_RADIUS);
            ctx.lineTo(posX - TRANSFER_OFFSET, posY + TERMINAL_CIRCLE_RADIUS);
            ctx.arc(posX - TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS, 0.5 * Math.PI, 1.5 * Math.PI);
            ctx.lineTo(posX, posY - TERMINAL_CIRCLE_RADIUS);
            break;
        }
        case "TER-T":
        case "TER": {
            ctx.arc(posX, posY, TERMINAL_CIRCLE_RADIUS, 0, 2 * Math.PI);
            break;
        }
        default: {
            ctx.arc(posX, posY, CIRCLE_CENTER_RADIUS, 0, 2 * Math.PI);
        }
    }


    switch (station["type"]) {
        case "T":
        case "LTR":
        case "LTL":
        case "TR":
        case "TL": {
            ctx.lineWidth = STROKE + SPACE * 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            break
        }

        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.lineWidth = SPACE * 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            break
        }
    }

    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.fillStyle = COLOR[lineID];
            break
        }
        default: {
            ctx.fillStyle = "#FFFFFF";
        }
    }
    ctx.fill();

    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            break
        }
        default: {
            ctx.lineWidth = STROKE;
            ctx.strokeStyle = COLOR[lineID];
            ctx.stroke();
        }
    }


    ctx.font = `bold ${13}px Arial`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.fillStyle = "#FFFFFF";
            break
        }
        default: {
            ctx.fillStyle = COLOR[lineID];
        }
    };

    // Draw station ID text
    const id = station["id"]
    const lineCode = lineID.split("_")[1]
    switch (station["type"]) {
        case "TR":
        case "LTR": {
            ctx.fillText(id, posX + TRANSFER_OFFSET, posY + 1);
            break;
        }
        case "TER-TR": {
            if (lineID != "TRTC_R22A" && lineID != "TRTC_G03A") {
                ctx.fillText(lineCode, posX + TRANSFER_OFFSET + 1, posY - 6);
                ctx.fillText(id, posX + TRANSFER_OFFSET + 1, posY + 8);
            } else {
                ctx.fillText(id, posX + TRANSFER_OFFSET + 1, posY + 1);
            }

            break;
        }
        case "TL": {
            ctx.fillText(id, posX - TRANSFER_OFFSET, posY + 2);
            break;
        }
        case "TER-TL": {
            if (lineID != "TRTC_R22A" && lineID != "TRTC_G03A") {
                ctx.fillText(lineCode, posX - TRANSFER_OFFSET - 1, posY - 6);
                ctx.fillText(id, posX - TRANSFER_OFFSET - 1, posY + 8);
            } else {
                ctx.fillText(id, posX - TRANSFER_OFFSET - 1, posY + 1);
            }
            break;
        }
        case "TER-T":
        case "TER": {
            if (lineID != "TRTC_R22A" && lineID != "TRTC_G03A") {
                ctx.fillText(lineCode, posX, posY - 6);
                ctx.fillText(id, posX, posY + 8);
            } else {
                ctx.fillText(id, posX, posY + 1);
            }
            break;
        }
        default: {
            ctx.fillText(id, posX, posY + 1);
        }
    };

    // Draw station name
    let line = lineID;
    if (line == "TRTC_G03A") {
        line = "TRTC_G";
    }
    if (line == "TRTC_R22A") {
        line = "TRTC_R";
    }
    const name = station_decode[line+id];

    let break_key = "";
    switch (DRAW) {
        case "ZH":
            break_key = "break";
            break;
        case "EN":
            break_key = "break_en";
            break;
        case "JA":
            break_key = "break_ja";
            break;
    }

    const slice = station[break_key];
    let name_line_1 = "";
    let name_line_2 = "";
    if (slice != null) {
        name_line_1 = name.slice(0, slice);
        name_line_2 = name.slice(slice);
    } else {
        name_line_1 = name;
    }

    ctx.fillStyle = "#000000";
    ctx.font = `bold ${TEXT_SIZE}px Arial`;
    switch (station["dir"]) {
        case "B": {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            if (slice != null) {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                }
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                }
                ctx.fillText(name_line_1, posX, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                }
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                }
                ctx.fillText(name_line_1, posX, posY + NAME_SPACE);
            }

            break;
        }
        case "R": {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - 5);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY + 5);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY);
            }
            break;
        }
        case "RR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE_LARGE, posY - 5);
                ctx.fillText(name_line_2, posX+NAME_SPACE_LARGE, posY + 5);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE_LARGE, posY);
            }
            break;
        }
        case "TR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - NAME_SPACE - TEXT_SIZE);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY - NAME_SPACE);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - NAME_SPACE);
            }
            break;
        }
        case "BR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY + NAME_SPACE);
            }
            break;
        }
        case "BL": {
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX-NAME_SPACE, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY + NAME_SPACE);
            }
            break;
        }
        case "L": {
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY - 5);
                ctx.fillText(name_line_2, posX-NAME_SPACE, posY + 5);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY);
            }
            break;
        }
        case "LL": {
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE_LARGE, posY - 5);
                ctx.fillText(name_line_2, posX-NAME_SPACE_LARGE, posY + 5);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE_LARGE, posY);
            }
            break;
        }
        case "T": {
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            if (slice != null) {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                }
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                }
                ctx.fillText(name_line_1, posX, posY - NAME_SPACE - TEXT_SIZE);
                ctx.fillText(name_line_2, posX, posY - NAME_SPACE);
            } else {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                }
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                }
                ctx.fillText(name_line_1, posX, posY - NAME_SPACE);
            }

            break;
        }
        default: {

        }
    };
}

function drawLine(lineID, line, c) {
    const alpha = line["note"] == "out_of_service" ? 0.2 : 1;
    switch (line["type"]) {
        case "L": {
            drawSimpleLine(lineID, line["pts"], alpha, c);
            break;
        }
        case "Q": {
            drawQLine(lineID, line["pts"], alpha, c);
            break;
        }
        case "2Q": {
            drawDoubleQLine(lineID, line["pts"], alpha, c);
            break;
        }
    }
}

function drawSimpleLine(lineID, args, alpha, c) {
    const fromX = scaleX(args[0]), fromY = scaleY(args[1]);
    const toX = scaleX(args[2]), toY = scaleY(args[3]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.globalAlpha = 1;

}

function drawQLine(lineID, args, alpha, c) {
    const fromX = scaleX(args[0]), fromY = scaleY(args[1]);
    const qStartX = scaleX(args[2]), qStartY = scaleY(args[3]);
    const qCtrX = scaleX(args[4]), qCtrY = scaleY(args[5]);
    const qEndX = scaleX(args[6]), qEndY = scaleY(args[7]);
    const toX = scaleX(args[8]), toY = scaleY(args[9]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(qStartX, qStartY);
    ctx.quadraticCurveTo(qCtrX, qCtrY, qEndX, qEndY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawDoubleQLine(lineID, args, alpha, c) {
    const fromX = scaleX(args[0]), fromY = scaleY(args[1]);
    const q1StartX = scaleX(args[2]), q1StartY = scaleY(args[3]);
    const q1CtrX = scaleX(args[4]), q1CtrY = scaleY(args[5]);
    const q1EndX = scaleX(args[6]), q1EndY = scaleY(args[7]);
    const q2StartX = scaleX(args[8]), q2StartY = scaleY(args[9]);
    const q2CtrX = scaleX(args[10]), q2CtrY = scaleY(args[11]);
    const q2EndX = scaleX(args[12]), q2EndY = scaleY(args[13]);
    const toX = scaleX(args[14]), toY = scaleY(args[15]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(q1StartX, q1StartY);
    ctx.quadraticCurveTo(q1CtrX, q1CtrY, q1EndX, q1EndY);
    ctx.lineTo(q2StartX, q2StartY);
    ctx.quadraticCurveTo(q2CtrX, q2CtrY, q2EndX, q2EndY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function scaleX(value) {
    return value * SCALE + OFFSET_X;
}

function scaleY(value) {
    return value * SCALE + OFFSET_Y;
}

function drawSingleStation(lineID, station, c) {
    const pos = station["pos"];
    const type = station["type"];
    let off = 0;
    if (type == "R") off = 200;
    if (type == "L") off = -200;
    const posX = sinle_scale(pos[0]) + off, posY = sinle_scale(pos[1]);

    let ctx = c.getContext("2d");

    ctx.beginPath();

    ctx.arc(posX, posY, CIRCLE_CENTER_RADIUS, 0, 2 * Math.PI);

    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    ctx.lineWidth = STROKE;
    ctx.strokeStyle = COLOR[lineID];
    ctx.stroke();


    ctx.font = `bold ${13}px Arial`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = COLOR[lineID];

    const id = station["id"]
    ctx.fillText(id, posX, posY + 2);

}


const SINGLE_SCALE = 36;// * 2;
const SINGLE_OFFSET = 800;
function sinle_scale(value) {
    return value * SINGLE_SCALE + SINGLE_OFFSET
}
