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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8666453945968943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.452, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.99, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.729, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.746, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.845, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 507.16800680706086, 1, 24858, 13.0, 1073.0, 1927.9500000000007, 10701.81000000003, 9.723610357289418, 61.25167547931339, 80.56127238385032], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11322.42199999999, 9044, 24858, 10808.0, 13199.7, 13687.199999999999, 23162.31000000007, 0.2093251858389, 0.12160566782479314, 0.10588910768022479], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.244000000000002, 2, 9, 3.0, 4.0, 5.0, 7.990000000000009, 0.21004052521893574, 0.1078443231087006, 0.0763037845521915], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.589999999999998, 2, 18, 4.0, 6.0, 6.0, 9.0, 0.2100392017166084, 0.12048948034411143, 0.08902052104004692], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.621999999999986, 10, 451, 14.0, 19.0, 24.0, 46.0, 0.20878718447558714, 0.1086162314863184, 2.3247963646393015], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.79399999999998, 28, 63, 46.0, 56.0, 57.0, 60.99000000000001, 0.2099797495529531, 0.8732840422057198, 0.08776497344596088], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.678000000000002, 1, 9, 3.0, 4.0, 4.0, 7.0, 0.20998451154242864, 0.13120463875209565, 0.08920240480562153], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.664000000000016, 24, 57, 41.0, 49.0, 51.0, 54.0, 0.20997886772675198, 0.8617852621187204, 0.07669150051738793], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1158.4979999999998, 778, 1734, 1153.0, 1486.3000000000002, 1625.8, 1699.95, 0.2099137212622868, 0.8878165544835261, 0.10249693421010096], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.999999999999999, 4, 25, 7.0, 9.0, 10.0, 13.0, 0.20982862456916937, 0.3120315575956493, 0.10757815224493547], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.5639999999999965, 3, 17, 4.0, 6.0, 6.0, 11.0, 0.20895907870778033, 0.20155368323287276, 0.1146826193689185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.41799999999999, 6, 25, 10.0, 13.0, 14.0, 16.99000000000001, 0.20997851499834536, 0.3422284792757505, 0.13759334332411108], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.7923391712454212, 2166.285699977106], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.248000000000003, 3, 25, 5.0, 7.0, 8.0, 13.0, 0.20896038863288918, 0.2099215247954487, 0.12304991635315644], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.119999999999994, 7, 28, 17.0, 20.0, 21.0, 23.0, 0.2099777213637633, 0.3298881238700574, 0.12528944116529236], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.008000000000003, 5, 18, 8.0, 10.0, 10.0, 13.990000000000009, 0.2099779859079574, 0.3249552871564445, 0.12036823996872167], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2362.620000000003, 1613, 3720, 2283.0, 3044.0, 3272.45, 3534.0, 0.20968809315519352, 0.3202064142067457, 0.11590181711507766], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.927999999999988, 9, 64, 13.0, 17.0, 20.0, 47.98000000000002, 0.20878352280438028, 0.10861432659484514, 1.6837249329282935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.18, 9, 32, 15.0, 18.0, 19.0, 24.0, 0.2099797495529531, 0.38013060582937386, 0.17552994689192175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.413999999999996, 6, 27, 10.0, 13.0, 14.0, 18.0, 0.2099794850043151, 0.35545179579705066, 0.15092275484685147], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.421605603448276, 1567.6409841954023], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.7049653305471124, 2906.451842705167], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9979999999999984, 2, 18, 3.0, 4.0, 4.0, 8.0, 0.20893174868352105, 0.17566222419442185, 0.08875518620833169], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 754.2259999999999, 533, 1020, 736.0, 905.9000000000001, 923.95, 964.8900000000001, 0.2088843528491199, 0.1838675957546762, 0.09709858589470809], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.9800000000000004, 2, 28, 4.0, 5.0, 6.0, 12.990000000000009, 0.20895637158126482, 0.18931937006758484, 0.10243759622440911], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1013.1099999999997, 771, 1317, 984.5, 1222.8000000000002, 1245.95, 1297.0, 0.2088902870612103, 0.19762326720284626, 0.11076897058030974], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.670884683098592, 927.4455325704226], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.653999999999982, 19, 651, 27.0, 33.0, 38.849999999999966, 73.97000000000003, 0.2087277417954343, 0.10859713041100579, 9.547663501658342], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.04200000000005, 26, 331, 36.0, 44.0, 47.94999999999999, 132.85000000000014, 0.2088470971924267, 47.23500548654377, 0.06485681338592938], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.5042442908653846, 0.3962590144230769], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.3120000000000007, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.21000726625141228, 0.2281527964305065, 0.09044258243835238], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9980000000000087, 2, 11, 4.0, 5.0, 6.0, 9.0, 0.21000647239947937, 0.2155199626377485, 0.07772700492129168], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.33, 1, 16, 2.0, 3.0, 4.0, 7.990000000000009, 0.21004114285906322, 0.11910235320644609, 0.08184220312574828], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 206.26000000000005, 89, 350, 218.5, 309.0, 320.95, 340.9100000000001, 0.21002226235981014, 0.19129869563048685, 0.0689135548368127], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.79799999999997, 81, 414, 112.0, 130.0, 142.95, 363.40000000000055, 0.20881840107750296, 0.10867978154985017, 61.772724662497254], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 272.2180000000003, 18, 526, 343.0, 455.0, 475.95, 513.98, 0.21000409087969035, 0.11706620623094738, 0.08839039371986966], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 554.96, 320, 1103, 514.0, 853.9000000000001, 935.8499999999999, 1008.98, 0.2100326726825625, 0.11294424929492032, 0.08983819397945544], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.591999999999995, 5, 270, 7.0, 10.0, 13.0, 35.97000000000003, 0.20870613466638113, 0.09411505311779833, 0.1518418655531777], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 557.5939999999995, 328, 1124, 503.0, 909.8000000000001, 970.8499999999999, 1083.94, 0.20997860318033593, 0.10801758675790936, 0.08489369308267487], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.407999999999995, 2, 15, 4.0, 5.900000000000034, 6.0, 11.990000000000009, 0.20893070102935976, 0.12827814555094608, 0.10487341829012786], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.816000000000002, 3, 34, 5.0, 6.0, 6.0, 12.980000000000018, 0.20892790733629454, 0.12235952666860272, 0.09895511236142857], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 916.3199999999997, 609, 1531, 945.0, 1159.0, 1332.85, 1406.94, 0.2088476205990585, 0.19085246116478494, 0.09239059778454443], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 521.0479999999999, 263, 1130, 421.0, 937.8000000000001, 986.3499999999999, 1051.95, 0.208853029287878, 0.1849426207629986, 0.08627424940309805], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.873999999999998, 3, 36, 6.0, 7.0, 8.0, 13.990000000000009, 0.2089609999368938, 0.1393635187684591, 0.09815453219691983], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1262.519999999999, 921, 10616, 1195.5, 1488.8000000000002, 1502.95, 1545.97, 0.20888374199348617, 0.1569406381910083, 0.11586520063701186], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.54399999999993, 145, 211, 163.0, 190.0, 192.0, 195.99, 0.21010416123897582, 4.062343849930792, 0.10628315968924755], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.38, 198, 321, 221.0, 259.0, 262.0, 268.99, 0.21008871205955426, 0.40719254659347454, 0.1505909322770633], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.612000000000004, 6, 23, 9.0, 12.0, 13.0, 15.990000000000009, 0.2098271276260914, 0.17129229367383797, 0.129912498940373], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.444000000000011, 6, 20, 9.0, 12.0, 13.0, 16.0, 0.20982800817825645, 0.17446461203430771, 0.13319160675377606], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.432000000000002, 7, 24, 10.0, 13.0, 14.0, 19.0, 0.20982545459733865, 0.16980903562437552, 0.12847710940676887], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.91600000000001, 8, 24, 13.0, 16.0, 17.0, 20.99000000000001, 0.20982651124397328, 0.18764883256725676, 0.14630481350409855], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.746000000000011, 6, 40, 10.0, 11.0, 13.0, 21.940000000000055, 0.20981330392590067, 0.1575173379223699, 0.11617592121678288], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2059.0200000000023, 1677, 2757, 1984.5, 2535.0000000000005, 2631.95, 2723.82, 0.20966910022602328, 0.17522276031467138, 0.1339097573709172], "isController": false}]}, function(index, item){
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
