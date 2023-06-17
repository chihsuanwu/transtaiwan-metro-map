
async function load() {

    const data = await loadData();

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
    if (company.toLowerCase() == 'trtc') {
        let trtc = await loadStation('trtc');
        let tymc = await loadStation('tymc');
        let ntdlrt = await loadStation('ntdlrt');
        let ntalrt = await loadStation('ntalrt');
        return trtc.concat(tymc).concat(ntdlrt).concat(ntalrt);
    } else if (company.toLowerCase() == 'krtc') {
        let krtc = await loadStation('krtc');
        let klrt = await loadStation('klrt');
        return krtc.concat(klrt);
    } else if (company.toLowerCase() == 'tmrt') {
        let tmrt = await loadStation('tmrt');
        return tmrt;
    }
}

async function loadStation(op) {
    const path = `${MODE == 'LOCAL' ? '' : 'https://api.transtaiwan.com/'}station_list/${op}.json`;
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
            }
            station_decode[`${station_data["operator"]}_${id}`] = station_data[key];
        }
    }
    return station_decode;
}
