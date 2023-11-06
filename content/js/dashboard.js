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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.863624760689215, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.449, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.963, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.671, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.723, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.293, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 492.6226760263783, 1, 24904, 14.0, 1196.0, 2352.0, 9752.990000000002, 10.039847580548367, 63.24366747852891, 83.08059550514466], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9906.312000000007, 8470, 24904, 9729.0, 10468.800000000001, 10780.7, 23865.880000000114, 0.2163241678225588, 0.1256716662606983, 0.10900710019183628], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.482000000000001, 2, 10, 3.0, 4.0, 5.0, 8.990000000000009, 0.21709002115325168, 0.11145155763718352, 0.07844073029951476], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.024000000000002, 3, 16, 5.0, 6.0, 7.0, 9.0, 0.2170888900852899, 0.12458273480117261, 0.09158437550473167], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.28599999999999, 13, 542, 18.0, 23.0, 31.0, 109.0, 0.21584314592248555, 0.11228691627379618, 2.374906958113911], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 51.69599999999999, 30, 72, 54.0, 64.0, 67.0, 69.99000000000001, 0.21703725053738424, 0.9026354582383433, 0.0902908874305915], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.397999999999997, 2, 22, 3.0, 4.0, 5.0, 8.990000000000009, 0.21704262065941887, 0.13559017076370786, 0.09177681127493005], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 44.687999999999995, 27, 66, 46.5, 56.0, 59.0, 61.0, 0.21703677948672537, 0.8907643003092339, 0.07884539254791195], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1195.6539999999986, 867, 1796, 1159.5, 1504.6000000000001, 1717.1, 1758.99, 0.21695795441626595, 0.9175728186830305, 0.10551275517509809], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.716000000000005, 6, 32, 8.0, 11.0, 12.0, 19.0, 0.2169974068809878, 0.32267980608569224, 0.11082973027222323], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.367999999999998, 3, 18, 5.0, 7.0, 7.0, 12.0, 0.21598589352932182, 0.20833147157992818, 0.11811728552384787], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.10999999999999, 8, 35, 12.0, 15.0, 16.0, 23.980000000000018, 0.21703536634701698, 0.3536930412384559, 0.14179361336538512], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.7739126788908764, 2115.9034688059032], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.898000000000001, 4, 18, 6.0, 7.0, 8.0, 15.0, 0.21598729303557615, 0.21698075021350344, 0.12676597960388794], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.469999999999997, 8, 26, 13.0, 15.0, 16.0, 21.0, 0.21703414164082152, 0.34096190820215433, 0.1290759690031839], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.532000000000014, 6, 19, 9.0, 11.0, 12.0, 17.0, 0.21703329377539832, 0.3358738583777456, 0.1239887469322344], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2344.017999999998, 1954, 3021, 2294.5, 2730.0000000000005, 2882.5, 2990.0, 0.2168120391389093, 0.3310973914259511, 0.11941600593197739], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.743999999999996, 12, 158, 16.5, 22.0, 32.94999999999999, 94.90000000000009, 0.21583736913240714, 0.11228391104543418, 1.7401887886300327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.432000000000013, 12, 38, 17.0, 21.0, 22.0, 30.99000000000001, 0.21703791001174175, 0.39289584391393145, 0.1810062257324487], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.37599999999999, 8, 27, 13.0, 15.0, 16.0, 22.99000000000001, 0.21703668527683898, 0.3674473471714477, 0.1555712177667967], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 4.21142578125, 1217.7036830357142], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.6801571664222873, 2804.169148643695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.487999999999998, 2, 25, 3.0, 4.0, 5.0, 9.990000000000009, 0.21598076216155276, 0.1815520787932377, 0.09132780274995345], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 754.4320000000005, 550, 970, 713.5, 926.0, 938.95, 959.99, 0.21592517242704645, 0.19012633161053835, 0.09994973801798829], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.527999999999994, 2, 20, 4.0, 5.0, 6.0, 12.990000000000009, 0.2159852404326098, 0.19567545644700823, 0.10546154317998525], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1041.1579999999988, 810, 1362, 1002.0, 1299.0, 1320.0, 1344.99, 0.21590475318632232, 0.20424716158117415, 0.11406686667363321], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.933675130208333, 685.9029134114584], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.88800000000004, 24, 1425, 34.0, 41.0, 46.94999999999999, 132.95000000000005, 0.21570579799928558, 0.11221546450410098, 9.839470531783817], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.88400000000001, 32, 450, 45.0, 53.0, 59.94999999999999, 183.92000000000007, 0.2159194844879124, 48.834630417905686, 0.06663140341619173], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.8130450581395349, 0.6359011627906976], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.006, 2, 10, 4.0, 5.0, 5.949999999999989, 8.0, 0.2170708888401685, 0.2358636314548742, 0.09306066425862694], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.936000000000004, 3, 11, 5.0, 6.0, 7.0, 9.0, 0.21707013492645447, 0.22274448392226634, 0.07991742272194663], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.734000000000002, 1, 12, 2.5, 4.0, 5.0, 8.980000000000018, 0.21709058669165235, 0.12311198691182561, 0.08416500284822849], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 129.00600000000006, 83, 176, 134.0, 162.0, 168.0, 172.99, 0.21708144418206532, 0.1977285486357951, 0.0708058616765721], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.91600000000007, 81, 806, 120.0, 136.90000000000003, 147.95, 574.3600000000015, 0.21588536314508705, 0.11232110659382984, 63.83586826826261], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 281.6699999999999, 15, 527, 292.0, 491.90000000000003, 505.0, 520.98, 0.21706843863974498, 0.12097961778914929, 0.09093980485981504], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 562.2740000000005, 427, 739, 537.5, 685.0, 697.95, 719.99, 0.21704158429938541, 0.11672555750929155, 0.0924122370649727], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.042, 6, 417, 9.0, 12.900000000000034, 19.0, 45.98000000000002, 0.21566923241163494, 0.09724281376638279, 0.15648656218930151], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 529.8859999999993, 392, 694, 529.0, 632.0, 648.0, 678.97, 0.21703150385903716, 0.11163346034921237, 0.08732126913078449], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.832000000000002, 3, 18, 4.0, 6.0, 7.0, 14.980000000000018, 0.2159797359172573, 0.1326060739927137, 0.10798986795862864], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.537999999999995, 4, 34, 5.0, 7.0, 7.0, 13.0, 0.21597693711874671, 0.1264878212494957, 0.1018719342073776], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 936.0839999999992, 675, 1437, 897.5, 1190.8000000000002, 1360.9, 1407.98, 0.21589403230033796, 0.19727949703491135, 0.09508614117915275], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 323.9320000000001, 235, 404, 329.0, 389.0, 393.0, 400.0, 0.21593543012394262, 0.191201966648125, 0.08877814070525375], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.956000000000003, 4, 82, 7.0, 8.0, 8.0, 18.99000000000001, 0.21598831935168947, 0.14401358674522882, 0.10103359860298755], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1552.95, 1272, 11787, 1439.5, 1785.9, 1821.95, 2276.760000000004, 0.21587483059222667, 0.16225438976071138, 0.1193214395656253], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.26599999999993, 127, 228, 179.0, 209.0, 211.0, 215.99, 0.21709831601178234, 4.197538273347622, 0.1093971983028122], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 235.19200000000004, 180, 305, 224.0, 286.0, 289.0, 296.99, 0.21708134993339945, 0.4207456308850754, 0.1551792462414535], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.059999999999997, 7, 26, 11.0, 14.0, 15.0, 21.99000000000001, 0.2169935457439754, 0.1771057243548348, 0.1339257040138598], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.806000000000004, 7, 32, 11.0, 13.0, 14.0, 22.0, 0.21699495833913796, 0.1804728420502378, 0.13731712207398572], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.397999999999996, 8, 25, 13.0, 15.0, 17.0, 23.0, 0.21699072060882388, 0.1756200835327478, 0.1324406253715966], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.994000000000002, 10, 29, 15.0, 18.0, 19.0, 26.980000000000018, 0.21699185065405682, 0.19404453863518203, 0.1508771461578989], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.54599999999999, 7, 60, 12.0, 13.0, 14.0, 48.710000000000264, 0.21697810256988864, 0.16288402072900302, 0.11971936323436239], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2638.397999999996, 2222, 3344, 2578.5, 3015.6000000000004, 3142.9, 3307.8100000000004, 0.21676635751448756, 0.181141738074924, 0.13801920419867764], "isController": false}]}, function(index, item){
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
