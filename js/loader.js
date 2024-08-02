
async function load() {

    const data = parseData(await loadData());

    let htmlStr = `<canvas id="canvas_full" width="${data["spec"]['width']}" height="${data["spec"]['height']}" style="border:1px solid #d3d3d3;"></canvas>`;
    for (const line of data['lines']) {
        if (line['expandable']) {
            htmlStr += `<canvas id="canvas_${line['company']}_${line['name']}" width="2000" height="2000" style="border:1px solid #d3d3d3;"></canvas>`;
        }
    }
    document.querySelector('#content').innerHTML = htmlStr

    let stations = await loadStations();
    let station_decode = decode_station(stations);

    drawFull(data, station_decode);
    drawSingle(data);
}

async function loadStations() {
    let stations = await loadStation();
    // flatten
    stations = stations.reduce((acc, val) => acc.concat(val['stations']), []);
    return stations;
}

async function loadStation() {
    const path = `${MODE == 'LOCAL' ? '' : 'https://api.transtaiwan.com/'}station_list/all_stations.json`;
    const result = await fetch(path);
    const jsonData = await result.json();
    return jsonData;
}

async function loadData() {
    const prefix = company == 'trtc' ? 'Taipei' : company == 'krtc' ? 'Kaohsiung' : 'Taichung';
    const specResult = await fetch(`${prefix}/data/spec.json`);
    const linesResult = await fetch(`${prefix}/data/lines.json`);
    const fullResult = await fetch(`${prefix}/data/full.json`);
    const singleResult = await fetch(`${prefix}/data/single.json`);
    return {
        "spec": await specResult.json(),
        "lines": await linesResult.json(),
        "full": await fullResult.json(),
        "single": await singleResult.json()
    };
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function parseData(data) {
    const full = data['full'];
    // get station map
    // { line: [id1, id2, ...] }
    let stationMap = {};
    for (const line of full['stations']) {
        let stations = [];
        for (const station of line['data']) {
            stations.push({
                "id": station['id'],
                "pos": station['pos']
            });
        }
        stationMap[line['line']] = stations;
    }

    // add default line data (line type 'L' is not included in raw data)
    for (const line of full['lines']) {
        const lineID = line['line'];
        const lineData = line['data'];

        const stationList = stationMap[lineID];
        if (stationList == undefined) {
            continue;
        }
        for (const stationIDs of zip(stationList.slice(0, -1), stationList.slice(1))) {
            const station1 = stationIDs[0];
            const station2 = stationIDs[1];
            const lineDataID = `${station1['id']}-${station2['id']}`;
            // check if lineDataID exists
            if (lineData.find(element => element['id'] == lineDataID) == undefined) {
                lineData.push({
                    "id": lineDataID,
                    "type": "L",
                    "pts": [station1['pos'][0], station1['pos'][1], station2['pos'][0], station2['pos'][1]]
                });
            }
        }
    }

    return data
}

function decode_station(stations) {
    let station_decode = {};
    for (station_data of stations) {
        for (id of station_data["ids"]) {
            let key = "";
            switch (DRAW) {
                case "ZH":
                    key = "name";
                    break;
                case "EN":
                    key = "name_en";
                    break;
                case "JA":
                    key = "name_ja";
                    break;
                case "KO":
                    key = "name_ko";
                    break;
            }
            station_decode[`${station_data["operator"]}_${id}`] = station_data[key];
        }
    }
    return station_decode;
}
