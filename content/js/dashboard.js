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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8743033397149542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.792, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.826, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 459.67977026164857, 1, 19242, 11.0, 1005.0, 1861.0, 10322.980000000003, 10.795758307291237, 68.00529796069021, 89.33582127651977], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10433.133999999993, 9017, 19242, 10287.5, 11146.8, 11443.65, 17923.49000000005, 0.232332075022815, 0.1349581629467978, 0.11707358467946537], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8279999999999967, 1, 12, 3.0, 4.0, 4.0, 7.0, 0.23329959821143195, 0.11977337087473819, 0.08429770638499007], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.1040000000000045, 2, 17, 4.0, 5.0, 6.0, 8.0, 0.23329861849890068, 0.13389837019334858, 0.09842285467922374], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.881999999999985, 10, 453, 14.0, 18.0, 21.94999999999999, 72.72000000000025, 0.23225307781778723, 0.12082376668389984, 2.555464284934579], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.15200000000001, 24, 57, 42.0, 51.0, 52.0, 54.99000000000001, 0.23326172198468406, 0.9701113555013612, 0.09704052106003458], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.470000000000001, 1, 9, 2.0, 3.0, 4.0, 7.990000000000009, 0.23326607494838988, 0.14572523516136182, 0.09863692427016878], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 34.73999999999998, 21, 50, 36.0, 44.0, 46.0, 48.0, 0.23326270138735322, 0.957358874753558, 0.08473996573837443], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1015.8879999999996, 721, 1444, 984.0, 1241.7, 1377.95, 1416.96, 0.2331819826811078, 0.9861753361493166, 0.11340295642108562], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.760000000000002, 4, 21, 6.0, 9.0, 10.0, 15.0, 0.23327097222675805, 0.3468789473822332, 0.11914132663534616], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.373999999999996, 2, 19, 4.0, 5.0, 6.0, 11.990000000000009, 0.23239751501985137, 0.2241614741799389, 0.12709239102648123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.287999999999995, 6, 22, 9.0, 12.0, 12.949999999999989, 16.0, 0.2332625925644283, 0.3801246297247921, 0.15239518986875247], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.8846977249488752, 2418.793535915133], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.846000000000001, 3, 25, 5.0, 6.0, 7.0, 12.0, 0.23239870321523604, 0.23346764646928272, 0.136398067023786], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.590000000000003, 6, 25, 10.0, 12.0, 13.0, 16.0, 0.2332616131626729, 0.36645536104582377, 0.13872687735944123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.418000000000006, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.23326096023273846, 0.3609872815336162, 0.13325943528921094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2047.4779999999973, 1603, 2737, 2002.0, 2414.9000000000005, 2528.7, 2615.99, 0.23305340511999686, 0.3558866602736233, 0.12836144578874828], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.264000000000019, 9, 87, 13.0, 17.0, 19.0, 75.77000000000021, 0.23224865469966766, 0.12082146566900387, 1.8725047785160707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.819999999999988, 9, 31, 13.0, 17.0, 19.0, 22.99000000000001, 0.2332645513926127, 0.4222703433222657, 0.19453899110282347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.274000000000004, 6, 30, 9.0, 12.0, 13.0, 15.0, 0.23326389844622916, 0.3949335482179805, 0.16720283345657444], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.835937499999999, 1976.5624999999998], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.8590133101851851, 3541.56177662037], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7659999999999982, 2, 19, 3.0, 4.0, 4.0, 8.0, 0.23239189826068607, 0.19533401440620615, 0.09826727729187214], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 679.44, 534, 907, 651.5, 827.0, 847.95, 874.99, 0.23233326254913267, 0.20458713493474454, 0.10754488910965711], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6879999999999993, 2, 13, 3.0, 5.0, 6.0, 9.990000000000009, 0.232393518451813, 0.2105408115263002, 0.11347339768154929], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 934.2860000000003, 739, 1229, 903.5, 1131.9, 1150.85, 1194.97, 0.23231005400744134, 0.21976667228276225, 0.12273412033010331], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.00399999999998, 19, 1774, 27.0, 32.0, 35.0, 80.93000000000006, 0.23205861986384657, 0.12072260487077119, 10.585408333828392], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.89000000000003, 26, 417, 36.0, 43.0, 50.0, 172.96000000000004, 0.23232333088464543, 52.544710679479536, 0.07169352789018356], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 1.211117927251732, 0.9472430715935335], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2159999999999997, 2, 17, 3.0, 4.0, 5.0, 8.0, 0.23327162521274372, 0.2534801465727266, 0.100006097137104], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8880000000000012, 2, 11, 4.0, 5.0, 6.0, 9.0, 0.23327086339611586, 0.23935549695208289, 0.08588194873079656], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1519999999999997, 1, 17, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.23330079564903347, 0.1323047900794436, 0.09044962487565068], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.58799999999998, 88, 169, 125.0, 155.0, 158.0, 164.99, 0.23328991030469529, 0.2124920236721605, 0.07609260746266429], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.95999999999992, 70, 427, 98.0, 113.90000000000003, 124.0, 352.9100000000001, 0.23229073508403117, 0.12084335692052173, 68.68682780868535], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 248.36400000000006, 14, 453, 314.0, 410.0, 421.95, 437.99, 0.23326814266306375, 0.13000826337816124, 0.09772659492427183], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 481.27, 354, 645, 458.0, 585.9000000000001, 602.95, 623.99, 0.2332449645910819, 0.12543977973628392, 0.0993113325797966], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.339999999999998, 5, 307, 7.0, 9.0, 12.0, 24.980000000000018, 0.23202814408576503, 0.10461886172445173, 0.1683563584528549], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 450.2419999999998, 325, 599, 450.5, 536.0, 551.0, 576.99, 0.2332373483898926, 0.11996918336957064, 0.09384158939124586], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9940000000000024, 2, 23, 4.0, 5.0, 6.0, 10.990000000000009, 0.23239092615685364, 0.1426821281094487, 0.11619546307842682], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.610000000000005, 3, 28, 4.0, 6.0, 7.0, 11.0, 0.23238822591110128, 0.13609916304799466, 0.10961280577642765], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 774.1699999999994, 529, 1141, 747.5, 971.9000000000001, 1100.9, 1127.99, 0.23230703184093102, 0.21227735621472418, 0.1023149134377538], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 275.0359999999998, 185, 406, 268.5, 334.0, 344.9, 364.95000000000005, 0.23234308709612964, 0.20573027392669113, 0.09552386686276425], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.153999999999999, 3, 37, 5.0, 6.0, 7.0, 13.980000000000018, 0.23239935132693057, 0.1549427354925867, 0.1087102434429685], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1251.336, 962, 10092, 1161.0, 1482.8000000000002, 1499.0, 1554.98, 0.23226267980034698, 0.17458487038000495, 0.1283795671552699], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.422, 144, 212, 169.5, 185.0, 187.0, 191.0, 0.23329056339671062, 4.51059786174618, 0.1175565729616237], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 225.46000000000006, 194, 312, 221.5, 252.0, 255.0, 261.98, 0.23327347535955606, 0.45212910086021924, 0.16675408590155766], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.490000000000009, 5, 28, 8.0, 11.0, 12.0, 17.99000000000001, 0.23326879563320815, 0.19037604023303553, 0.14397058480487065], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.153999999999998, 5, 20, 8.0, 10.0, 12.0, 15.990000000000009, 0.23326977509527905, 0.19402167983046886, 0.1476160295524813], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.477999999999996, 6, 20, 9.0, 12.0, 13.0, 16.99000000000001, 0.23326727204189107, 0.18878019630257378, 0.14237504397088077], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.710000000000004, 8, 25, 12.0, 14.900000000000034, 15.0, 20.0, 0.23326770735166505, 0.20859919169823557, 0.16219395276795462], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.823999999999996, 6, 34, 9.0, 11.0, 12.0, 23.930000000000064, 0.23335578215957709, 0.17517863603895362, 0.1287558758985948], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2063.134, 1662, 2723, 1989.0, 2509.4, 2654.75, 2698.99, 0.2330636165786541, 0.19476061263917976, 0.1483959746184399], "isController": false}]}, function(index, item){
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
