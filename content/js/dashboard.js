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

    var data = {"OkPercent": 97.87279302276112, "KoPercent": 2.1272069772388855};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.892448415230802, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.209, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.669, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.979, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.093, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.44071474154447, 1, 18057, 9.0, 834.0, 1503.0, 6100.950000000008, 15.291444987880041, 96.32476434227596, 126.53801220932918], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6241.036, 5340, 18057, 6084.0, 6618.0, 6760.15, 16912.250000000087, 0.3300101313110313, 0.19166047382029627, 0.16629416773094935], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3260000000000005, 1, 29, 2.0, 3.0, 4.0, 5.990000000000009, 0.33116223372900594, 0.1700149393492927, 0.11965822898411348], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.514, 1, 15, 3.0, 4.0, 5.0, 7.0, 0.3311591630415777, 0.19006401534293518, 0.1397077719081656], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.33800000000001, 8, 381, 11.0, 15.0, 20.0, 48.92000000000007, 0.3289854614744865, 0.17114633318561887, 3.619803900813515], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.164, 24, 45, 33.0, 39.0, 41.0, 43.99000000000001, 0.33108877218377547, 1.376963930651139, 0.13773810249051596], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1280000000000014, 1, 14, 2.0, 3.0, 3.0, 6.990000000000009, 0.3310964457458742, 0.20684151104305976, 0.14000464942183938], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.263999999999992, 21, 47, 29.0, 35.0, 36.0, 40.99000000000001, 0.3310863605662901, 1.3588476156401885, 0.12027746692447257], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 852.7640000000002, 650, 1103, 854.0, 1008.6000000000001, 1064.0, 1083.95, 0.33094348014868624, 1.3996291395651534, 0.1609471221816853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.494000000000003, 3, 14, 5.0, 7.0, 9.0, 11.990000000000009, 0.3310271773312589, 0.4922445246035949, 0.16906954467211757], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8439999999999968, 2, 20, 4.0, 5.0, 6.0, 14.960000000000036, 0.32922200888636044, 0.31755456093471396, 0.1800432861097284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.537999999999997, 5, 23, 7.0, 9.0, 10.949999999999989, 15.990000000000009, 0.331083072053609, 0.5395328448892361, 0.21630329609752383], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.0179227941176472, 2783.0353860294117], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9579999999999993, 2, 21, 4.0, 5.0, 6.0, 9.0, 0.3292248269758922, 0.33073913257653326, 0.19322668067628046], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.872000000000009, 5, 21, 8.0, 10.0, 10.0, 15.0, 0.3310800028340448, 0.520128624374176, 0.19690207199798174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.466000000000004, 4, 19, 6.0, 8.0, 9.0, 13.0, 0.33107846824560194, 0.5123665619272343, 0.18914150773796598], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1553.232, 1343, 1923, 1528.5, 1734.0, 1799.9, 1885.89, 0.3307230465677893, 0.5050341163559744, 0.18215605299241522], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.821999999999983, 7, 96, 10.0, 15.0, 19.0, 58.75000000000023, 0.32896663028295736, 0.17113653673636153, 2.6522934566563436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.725999999999994, 8, 25, 10.0, 13.0, 14.0, 18.0, 0.3310885529443705, 0.5993575795688565, 0.2761226798969652], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.542, 5, 23, 7.0, 9.0, 11.0, 14.0, 0.33108657980279155, 0.560554799091697, 0.2373218257570791], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.017869015957447, 1450.880984042553], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.9765625, 4026.1965460526317], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.299999999999999, 1, 17, 2.0, 3.0, 3.0, 7.0, 0.32921593931891807, 0.2767182139952988, 0.1392094743409097], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 551.0939999999999, 448, 702, 536.5, 639.9000000000001, 650.9, 674.99, 0.3291158237571599, 0.28981155218756705, 0.1523446293563416], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.169999999999998, 1, 10, 3.0, 4.0, 4.949999999999989, 8.990000000000009, 0.3292259108693276, 0.298267743918539, 0.16075483929166387], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 743.5360000000002, 615, 939, 718.5, 868.8000000000001, 887.95, 913.99, 0.32907705075881877, 0.31130881820368683, 0.17385809029347749], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.356000000000023, 17, 1262, 22.0, 27.0, 34.89999999999998, 58.99000000000001, 0.3286952245842991, 0.17099534481279494, 14.993509707356068], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.05599999999999, 20, 264, 29.0, 37.0, 46.0, 102.97000000000003, 0.3291199398632046, 74.43725928476148, 0.10156435644216079], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 1.2083273329493087, 0.9450604838709677], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6419999999999977, 1, 7, 2.0, 4.0, 4.0, 6.0, 0.33111113612839693, 0.35979557839983256, 0.14195096558629516], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3780000000000006, 2, 23, 3.0, 4.0, 5.0, 8.0, 0.3311100397861824, 0.33974670889037084, 0.12190281738221755], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.803999999999999, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.33116311107873075, 0.18780247093215793, 0.12839038583814072], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.8379999999999, 65, 119, 91.0, 111.0, 113.94999999999999, 117.99000000000001, 0.33114468771069083, 0.3016230094478891, 0.10801008368688549], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.16000000000003, 58, 420, 79.0, 94.0, 106.79999999999995, 386.5300000000004, 0.32905431107215105, 0.17118215044066953, 97.29917465775061], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.08600000000015, 12, 383, 261.5, 334.0, 338.0, 345.99, 0.33110609301432364, 0.18453667807051236, 0.1387153456085399], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.5999999999999, 331, 526, 409.0, 485.0, 495.9, 511.97, 0.3310644383822867, 0.1780473602163175, 0.14096103040495803], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.2579999999999965, 4, 267, 6.0, 8.0, 11.0, 31.950000000000045, 0.32864099717565926, 0.14818050274020864, 0.2384572860366356], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.9739999999997, 285, 521, 388.0, 452.90000000000003, 466.0, 479.97, 0.3310405465082174, 0.17027574829232736, 0.1331920948841656], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3640000000000017, 2, 16, 3.0, 4.0, 5.0, 8.0, 0.32921268785699004, 0.20212823142828923, 0.164606343928495], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.050000000000004, 2, 25, 4.0, 5.0, 5.0, 9.0, 0.3292074856514917, 0.19280177853521105, 0.15528048395475635], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.5200000000004, 521, 880, 672.0, 806.9000000000001, 838.0, 851.0, 0.329049763511935, 0.30067886153882095, 0.14492328451551043], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.1640000000001, 177, 310, 237.5, 284.0, 288.0, 298.0, 0.3291286056861575, 0.2914298809196248, 0.1353155693299534], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.502000000000004, 3, 58, 4.0, 5.0, 7.0, 10.990000000000009, 0.32922851224269145, 0.21949960702461707, 0.15400435289477463], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.9979999999995, 814, 8878, 934.0, 1082.9, 1113.0, 1147.94, 0.3290426175998315, 0.2473314386648109, 0.18187316558740688], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.53199999999998, 116, 171, 129.0, 150.0, 151.0, 157.98000000000002, 0.33114490702444443, 6.402580060697206, 0.16686598830528646], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.47199999999995, 156, 250, 172.0, 202.0, 204.0, 211.98000000000002, 0.3311203456896409, 0.6417752551696163, 0.23669930961407923], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.814, 5, 16, 7.0, 9.0, 9.0, 12.0, 0.3310236708406545, 0.27015604683422206, 0.20430367184696643], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.746000000000004, 5, 17, 6.0, 8.0, 9.0, 14.980000000000018, 0.3310254240766708, 0.27532974994173953, 0.2094770261735182], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.177999999999999, 5, 17, 8.0, 10.0, 11.0, 13.0, 0.3310197261275194, 0.26788999730384433, 0.20203840706025356], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.581999999999995, 7, 28, 9.0, 12.0, 13.0, 17.0, 0.3310210410214515, 0.29601491940796226, 0.23016306758522798], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.604000000000001, 5, 32, 7.0, 9.0, 10.0, 18.970000000000027, 0.330975025948442, 0.24846075409846374, 0.1826180563094431], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.1919999999996, 1414, 1977, 1593.0, 1791.4, 1848.6499999999999, 1960.99, 0.33065699561085904, 0.27631493917399236, 0.21053550892410164], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 100.0, 2.1272069772388855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
