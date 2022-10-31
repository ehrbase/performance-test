/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.84726653903425, "KoPercent": 2.152733460965752};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8991916613486493, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.489, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.696, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.612, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 506, 2.152733460965752, 188.1567326100828, 1, 2994, 16.0, 556.0, 1206.0, 2242.0, 26.108370006864487, 174.91465038609954, 216.31096170411405], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.581999999999983, 15, 73, 26.0, 29.0, 31.0, 42.99000000000001, 0.5653812535407001, 0.3283573098566306, 0.28600340755281506], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.687999999999997, 4, 30, 7.0, 10.0, 13.0, 18.99000000000001, 0.5651294768144329, 6.0475013047426796, 0.20530094274899321], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.13, 5, 39, 8.0, 10.0, 11.0, 20.0, 0.5651103151846272, 6.068153460721442, 0.23950964530285956], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.397999999999975, 14, 286, 19.0, 27.0, 33.0, 49.0, 0.5618943481295099, 0.30328576675259905, 6.25656187243425], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.44600000000003, 26, 94, 45.0, 53.0, 55.0, 63.99000000000001, 0.5648932408264162, 2.3493325133201823, 0.23610772175166614], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6060000000000003, 1, 33, 2.0, 3.0, 4.0, 10.970000000000027, 0.564928344488785, 0.3529522237274424, 0.23998420884045069], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.291999999999994, 22, 77, 39.0, 47.0, 49.0, 54.99000000000001, 0.5648906880029646, 2.318429436891542, 0.20631749737608276], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 775.5740000000001, 568, 1192, 775.0, 912.0, 930.95, 1096.8000000000002, 0.5645685792744616, 2.3876785077633826, 0.2756682515988582], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.782000000000004, 6, 61, 11.0, 13.0, 15.0, 19.0, 0.5646833481656827, 0.8396962705911782, 0.28951050565135095], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.529999999999999, 1, 20, 3.0, 5.0, 7.0, 13.990000000000009, 0.5628399553330211, 0.5428932151191195, 0.30890239736050573], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.08799999999999, 11, 53, 18.0, 21.0, 22.0, 31.99000000000001, 0.564874095212918, 0.9205186049050277, 0.37014699012487107], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.6636979976671851, 1839.4898789852255], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.429999999999998, 2, 21, 4.0, 6.0, 7.0, 12.0, 0.5628507263588624, 0.5654396198365481, 0.3314443242132754], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.200000000000017, 11, 56, 19.0, 22.900000000000034, 24.0, 34.0, 0.5648677136301449, 0.8874424823450596, 0.33704509084767437], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.46, 6, 37, 11.0, 13.0, 15.0, 22.99000000000001, 0.5648689899351644, 0.8741733760157757, 0.3238067354413491], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1974.089999999999, 1480, 2675, 1958.0, 2235.7000000000003, 2300.8, 2571.8900000000003, 0.5637798507336468, 0.8609259671784284, 0.3116205034328555], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.921999999999993, 12, 75, 16.0, 23.0, 27.94999999999999, 45.0, 0.5618577263865244, 0.3032659999522421, 4.531075297363202], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.30800000000001, 14, 39, 22.0, 26.0, 27.0, 32.99000000000001, 0.5648900498007068, 1.022599935757879, 0.47221277600527833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 16.928000000000004, 11, 55, 18.0, 21.0, 23.0, 28.980000000000018, 0.5648849442345583, 0.9563932389344688, 0.4060110536685888], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.680735518292683, 1663.2288490853657], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.8222761445242369, 3433.474528725314], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.394, 1, 23, 2.0, 3.0, 4.949999999999989, 9.990000000000009, 0.5627253011424449, 0.472959624881687, 0.2390483457001597], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.9039999999999, 313, 906, 418.0, 477.90000000000003, 497.84999999999997, 684.8200000000002, 0.5625385338895714, 0.4953580287046538, 0.26149252161273046], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1199999999999983, 1, 14, 3.0, 4.0, 5.0, 11.990000000000009, 0.5628165139370254, 0.5098930743598806, 0.2759120019495964], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1161.3000000000004, 914, 1778, 1153.0, 1340.0, 1368.85, 1593.93, 0.5622462863632786, 0.5318564353304321, 0.2981442709914651], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.544732862903226, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 42.864000000000054, 25, 736, 41.5, 49.0, 58.0, 88.98000000000002, 0.5614003570506271, 0.302594792450288, 25.67968039477673], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.61799999999999, 9, 187, 43.0, 51.0, 59.94999999999999, 81.99000000000001, 0.5622469186057626, 126.27473895226974, 0.17460402355139892], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.7137714460784315, 1.3467626633986929], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2899999999999987, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.5651799419899308, 0.6141419660660311, 0.24340268986089791], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2899999999999996, 2, 13, 3.0, 4.0, 6.0, 9.0, 0.5651735534948071, 0.579915531633329, 0.20918044606887884], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2300000000000013, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.5651454458319393, 0.320493761571353, 0.22020803992865606], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.43199999999997, 85, 277, 123.0, 147.0, 151.95, 169.95000000000005, 0.5650834910858079, 0.5147060771197695, 0.18541802051253073], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 165.7259999999999, 27, 566, 167.0, 195.90000000000003, 229.69999999999993, 359.7700000000002, 0.5619979251036605, 0.30252392214417945, 166.25040182851646], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.362, 1, 26, 2.0, 3.0, 4.0, 7.0, 0.565168442802693, 0.31505160305790036, 0.23787851449996156], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.1499999999999986, 1, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.5652342500302401, 0.3039845252286655, 0.24177011866527845], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.637999999999975, 7, 306, 10.0, 14.0, 19.94999999999999, 44.930000000000064, 0.5612339964125923, 0.23715972908954375, 0.40831965559314576], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.654000000000002, 2, 85, 4.0, 6.0, 6.949999999999989, 8.990000000000009, 0.565181858566631, 0.29074191139983113, 0.22850125922518089], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.825999999999999, 2, 27, 4.0, 5.0, 6.0, 10.0, 0.5627164348087382, 0.34549360325058776, 0.28245727294110495], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.163999999999999, 2, 29, 4.0, 5.0, 6.949999999999989, 12.990000000000009, 0.5626999695016617, 0.3295476549900796, 0.26651316914873624], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.5639999999996, 375, 996, 544.0, 635.9000000000001, 658.95, 775.94, 0.5621868619179117, 0.5136828727804863, 0.24870180512579493], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.929999999999993, 6, 119, 16.0, 27.0, 33.0, 52.99000000000001, 0.5623594804248289, 0.4979462543906216, 0.23230279318330332], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.483999999999991, 6, 41, 10.0, 11.0, 13.0, 20.0, 0.5628583296841352, 0.3752308246831389, 0.2643895083770205], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 541.3340000000001, 358, 2632, 527.0, 604.0, 640.8499999999999, 715.94, 0.5626575441123515, 0.42293275222531057, 0.31209910649982], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.8879999999997, 141, 373, 176.0, 188.0, 193.95, 280.6500000000003, 0.5652770649005904, 10.929545933425059, 0.28595070275244705], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 258.74400000000037, 206, 485, 263.0, 283.90000000000003, 292.95, 408.27000000000066, 0.5651052056361333, 1.0952831569121972, 0.4050656454462127], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.629999999999995, 11, 75, 18.0, 21.0, 24.0, 40.0, 0.5646278707092516, 0.46077383731828864, 0.34958405276334525], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.195999999999998, 11, 59, 18.0, 21.0, 22.0, 34.99000000000001, 0.5646642167768514, 0.46965835944434786, 0.35842943447749365], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.250000000000004, 11, 77, 18.0, 21.0, 24.0, 31.980000000000018, 0.5645794165636309, 0.45690684404340487, 0.3456946232279264], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.054, 13, 88, 21.0, 25.0, 27.0, 34.99000000000001, 0.5646163939757689, 0.5049071075464369, 0.39368760283076076], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.653999999999996, 10, 70, 18.0, 21.0, 22.0, 28.0, 0.5643194364028924, 0.423630853473894, 0.3124698441801172], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2208.804, 1658, 2994, 2190.5, 2536.7000000000003, 2629.9, 2778.9, 0.5632952320438379, 0.4706881756726308, 0.35976082202799803], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.81422924901186, 2.1272069772388855], "isController": false}, {"data": ["500", 6, 1.1857707509881423, 0.025526483726866625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 506, "No results for path: $['rows'][1]", 500, "500", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
