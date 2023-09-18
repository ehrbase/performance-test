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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8928738566262497, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.202, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.651, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.983, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.133, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.9263560944505, 1, 18089, 9.0, 838.0, 1494.9500000000007, 6090.990000000002, 15.294012008776244, 96.34093467039631, 126.55925452630856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6203.350000000001, 5007, 18089, 6075.0, 6539.7, 6735.0, 15186.850000000075, 0.32972786899516093, 0.19149654391612514, 0.1661519339858428], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3199999999999994, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.33078737318439083, 0.16982249019215437, 0.1195227813263912], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5539999999999994, 2, 19, 3.0, 4.0, 5.0, 7.990000000000009, 0.3307849659556113, 0.18984925033376202, 0.13954990751252352], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.059999999999993, 8, 371, 11.0, 15.0, 19.0, 35.0, 0.32889089439247604, 0.17109713706232021, 3.6187633858594017], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.61200000000002, 24, 58, 33.0, 40.0, 41.0, 44.98000000000002, 0.33073967281908606, 1.3755120625306347, 0.1375928717001276], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2280000000000006, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.3307477677833152, 0.206623686063149, 0.139857210400562], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.61199999999999, 21, 58, 29.0, 35.0, 36.94999999999999, 39.99000000000001, 0.33074426720961647, 1.3574435930122335, 0.12015319082224347], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.7359999999999, 669, 1078, 866.0, 994.6000000000001, 1049.9, 1075.0, 0.3305920639391499, 1.3981429269745271, 0.1607762185954069], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.547999999999999, 3, 13, 5.0, 8.0, 9.0, 11.980000000000018, 0.33067558344399944, 0.4917216969394652, 0.16888997084102705], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7819999999999996, 2, 22, 4.0, 5.0, 5.0, 10.990000000000009, 0.32910109327383186, 0.31743793050536767, 0.1799771603841268], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.747999999999993, 5, 32, 7.0, 9.900000000000034, 11.0, 15.0, 0.3307390164880014, 0.5389721720739188, 0.21607851760788374], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 1.0084316724941724, 2757.086338141026], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9500000000000037, 2, 16, 4.0, 5.0, 6.0, 10.990000000000009, 0.3291049923910926, 0.33061874679945397, 0.19315634807328774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.917999999999997, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.33073595364404873, 0.519588121080779, 0.19669745680588446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.420000000000002, 4, 21, 6.0, 8.0, 9.0, 12.0, 0.3307344222433451, 0.5118341272199721, 0.1889449580198798], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.4020000000005, 1336, 1934, 1534.5, 1765.9, 1835.0, 1920.8100000000002, 0.3303727529697207, 0.504499196822541, 0.18196311784660396], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.658000000000001, 7, 72, 10.0, 14.0, 18.0, 45.99000000000001, 0.3288833227213648, 0.17109319809267406, 2.6516217894410037], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.819999999999991, 8, 23, 11.0, 13.0, 14.949999999999989, 17.0, 0.3307462362732043, 0.5987378961347672, 0.27583719314191063], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.6979999999999995, 5, 30, 8.0, 9.0, 11.0, 13.0, 0.33074426720961647, 0.5599752377968595, 0.23707645716001804], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 1.0285303492239468, 4240.4509077051], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2719999999999994, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.3291002268158763, 0.27662095334247355, 0.1391605451281977], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.8160000000001, 424, 694, 549.5, 649.0, 657.0, 673.99, 0.3289984497593047, 0.2897081954418581, 0.15229029803311567], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.26, 2, 18, 3.0, 4.0, 5.0, 10.980000000000018, 0.329098060690948, 0.29815191590195245, 0.16069241244675192], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.1980000000004, 607, 925, 734.5, 881.0, 895.95, 913.0, 0.32895905512432677, 0.31119719364207676, 0.17379575080298906], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.641999999999985, 17, 1117, 23.0, 27.0, 33.0, 58.940000000000055, 0.32864402134082815, 0.17096870762546149, 14.99117405940438], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.77400000000003, 21, 277, 29.0, 35.900000000000034, 41.0, 108.95000000000005, 0.32901122257280196, 74.41267062830451, 0.10153080696582562], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 1.1811127533783783, 0.9237753378378378], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.683999999999999, 1, 10, 2.0, 4.0, 4.0, 7.0, 0.3307394540417684, 0.35939169717462516, 0.1417916214104847], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.29, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.3307387977115521, 0.3393657833432665, 0.12176613939185073], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7779999999999998, 1, 10, 2.0, 3.0, 3.0, 5.990000000000009, 0.330788686233038, 0.18759013474842529, 0.12824522308058212], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.0740000000001, 66, 118, 91.0, 111.0, 114.0, 117.0, 0.3307718362335408, 0.3012833978255721, 0.10788847002148694], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.442, 59, 378, 80.0, 94.0, 104.0, 327.4600000000005, 0.3289566744322372, 0.17113135745780966, 97.2703041516964], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.6080000000001, 12, 379, 262.0, 333.0, 336.0, 347.97, 0.3307348597849562, 0.18432977717565657, 0.13855981918725216], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.43599999999964, 327, 518, 405.0, 488.0, 495.95, 512.99, 0.33069636055427354, 0.1778494069539492, 0.14080430976724928], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.145999999999997, 4, 247, 6.0, 9.0, 11.0, 26.0, 0.32859391378352887, 0.1481592733720636, 0.23842312298941598], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.29599999999994, 281, 504, 393.0, 456.0, 467.0, 488.96000000000004, 0.33067274046356354, 0.17008656164996439, 0.13304411042088687], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.36, 2, 17, 3.0, 4.0, 5.0, 9.0, 0.329098060690948, 0.2020578532587948, 0.16454903034547397], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.988000000000001, 2, 27, 4.0, 5.0, 5.0, 8.990000000000009, 0.32909264550337686, 0.1927345219090138, 0.15522631618958108], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.8159999999996, 538, 877, 676.0, 779.0, 829.95, 850.97, 0.32893763013594995, 0.30057639638135714, 0.144873897647767], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.17999999999972, 165, 310, 235.0, 283.90000000000003, 290.0, 300.0, 0.32902681107872755, 0.2913397459699151, 0.13527371822670342], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.487999999999999, 3, 44, 4.0, 5.0, 6.0, 11.990000000000009, 0.3291078084776855, 0.2194191327400397, 0.1539478908796986], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 969.4499999999999, 797, 7916, 918.5, 1083.7, 1112.95, 1134.99, 0.32893763013594995, 0.24725252274603712, 0.18181513540717545], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.50400000000002, 117, 169, 134.5, 150.0, 151.0, 159.99, 0.3307847471183687, 6.395616484980388, 0.16668450147761546], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.3800000000001, 160, 271, 180.0, 202.90000000000003, 204.0, 207.99, 0.33075017447071703, 0.6410577917712664, 0.23643469503180164], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.059999999999998, 5, 18, 7.0, 9.0, 10.0, 15.980000000000018, 0.33067317784198713, 0.2698700014202413, 0.20408735194935146], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.945999999999995, 4, 18, 7.0, 9.0, 10.0, 13.0, 0.3306740526023056, 0.2750374974042087, 0.2092546739123965], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.30399999999999, 6, 18, 8.0, 10.0, 12.0, 14.990000000000009, 0.3306688041098164, 0.26760600063852147, 0.20182422125843288], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.588, 6, 19, 9.0, 11.900000000000034, 13.0, 17.99000000000001, 0.3306705535888006, 0.29570149670585993, 0.2299193692922129], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.557999999999996, 5, 27, 7.0, 9.0, 10.0, 22.0, 0.33065852629462733, 0.24822315991010055, 0.1824434251527973], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.1860000000004, 1368, 2042, 1590.5, 1829.9, 1907.2999999999997, 1966.94, 0.3303411036167726, 0.27605096267178564, 0.21033437456849194], "isController": false}]}, function(index, item){
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
