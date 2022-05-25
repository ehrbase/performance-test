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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9094069529652352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.97, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.789, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.692, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.573, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 203.66453078845745, 1, 3857, 13.0, 614.9000000000015, 1342.0, 2277.0, 24.1477241551863, 162.35222053028426, 212.71330258192998], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.181999999999995, 4, 69, 7.0, 10.0, 13.0, 41.91000000000008, 0.5595451122055813, 5.983138291644425, 0.20217938624615733], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.052000000000007, 4, 79, 7.0, 10.0, 12.0, 19.0, 0.5594994046926335, 6.00742815887769, 0.23603881135470473], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.702, 13, 311, 19.0, 26.0, 32.94999999999999, 89.98000000000002, 0.5553439078217968, 0.29927830282459017, 6.182539598797348], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.766000000000034, 26, 93, 44.0, 54.0, 56.0, 67.97000000000003, 0.5592691023954613, 2.326100690529561, 0.23266468517623687], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4820000000000024, 1, 16, 2.0, 3.0, 4.949999999999989, 11.980000000000018, 0.559302259245546, 0.34956391202846626, 0.2365018342317592], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.58400000000004, 24, 116, 39.0, 47.0, 49.0, 67.98000000000002, 0.5592490850684968, 2.2947999761759887, 0.20316470668503986], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 767.2299999999997, 584, 1319, 764.0, 909.8000000000001, 934.8499999999999, 1016.5400000000004, 0.5589408741164542, 2.364036060349964, 0.2718286672949162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.968, 5, 76, 9.0, 11.0, 13.0, 27.99000000000001, 0.5588096906541316, 0.8311202723303146, 0.2854076838008894], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7899999999999956, 1, 26, 3.0, 5.0, 7.949999999999989, 17.99000000000001, 0.5563468043439558, 0.5367877370037386, 0.30425215862560084], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.472000000000001, 8, 76, 13.0, 17.0, 19.0, 27.980000000000018, 0.5592328220454053, 0.9114839648376771, 0.36535816205896104], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7077243988391376, 1961.5091858416254], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.867999999999997, 2, 27, 4.0, 6.0, 9.0, 13.990000000000009, 0.5563554710884316, 0.5584418041050132, 0.3265328497306127], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.897999999999985, 9, 68, 15.0, 18.0, 21.0, 33.99000000000001, 0.5592234399623307, 0.8780681794033534, 0.3325850341182221], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.650000000000006, 5, 39, 9.0, 11.0, 12.0, 18.980000000000018, 0.5592109310079106, 0.8655755133276741, 0.31947108851526146], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2022.887999999999, 1561, 3625, 2007.0, 2298.4, 2375.3999999999996, 2495.86, 0.5578601377691396, 0.8520441947958343, 0.3072589040056589], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.286, 12, 210, 16.0, 24.0, 34.94999999999999, 123.96000000000004, 0.5552230386468547, 0.29984212926924875, 4.476485749090267], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.57599999999998, 11, 130, 18.0, 22.0, 25.0, 41.91000000000008, 0.5592497105882748, 1.0125478158502554, 0.46640552035389327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.833999999999996, 8, 100, 14.0, 17.0, 19.0, 32.99000000000001, 0.5592459574905962, 0.9470043850475527, 0.40086575468564223], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 4.955535239361702, 1450.880984042553], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.7869550042955327, 3285.9851535652924], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.453999999999999, 1, 44, 2.0, 3.0, 4.0, 13.980000000000018, 0.5561840435247385, 0.46765084128398426, 0.2351832918420037], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 424.3680000000002, 318, 1078, 420.5, 491.0, 507.95, 678.3800000000006, 0.5559917001559, 0.4891206671566807, 0.2573633455799772], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2639999999999993, 1, 28, 3.0, 4.0, 6.0, 20.99000000000001, 0.5563133780015888, 0.5041589988139399, 0.2716373916023383], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1206.9780000000007, 939, 2395, 1210.5, 1384.0, 1411.0, 1525.5500000000004, 0.5557358609682252, 0.5258867668732522, 0.2936065437341893], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.706000000000024, 26, 928, 40.0, 49.900000000000034, 58.94999999999999, 135.9000000000001, 0.5546600876584803, 0.2995381137452535, 25.370282407956932], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.07800000000002, 29, 203, 42.0, 51.0, 61.0, 114.8900000000001, 0.5557086841707493, 125.75459595394065, 0.17148822675581718], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.956768889925373, 1.5304337686567164], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.573999999999997, 1, 43, 2.0, 4.0, 5.0, 11.990000000000009, 0.5595764230308226, 0.6082114832356499, 0.23989653292044055], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.688000000000001, 1, 42, 3.0, 5.0, 8.0, 18.99000000000001, 0.55957203930434, 0.5743263801844349, 0.2060143152516955], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.212000000000002, 1, 19, 2.0, 3.0, 4.0, 9.0, 0.5595826856163747, 0.317497597991322, 0.21694758416962964], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.22599999999993, 87, 192, 120.0, 147.0, 155.0, 169.94000000000005, 0.5595144309962042, 0.5097919571479088, 0.18249787104759008], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 163.25400000000005, 111, 741, 157.0, 193.90000000000003, 231.74999999999994, 382.95000000000005, 0.5554648296333822, 0.29997270584693386, 164.31669459266098], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.396000000000001, 1, 18, 2.0, 3.0, 5.0, 11.990000000000009, 0.5595682818791646, 0.3113910056113507, 0.23442850871695467], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 477.1660000000001, 360, 992, 478.5, 552.0, 567.0, 695.4200000000005, 0.5593460573374456, 0.6078736977025421, 0.2403440090121837], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.285999999999998, 6, 436, 10.0, 16.900000000000034, 25.94999999999999, 71.97000000000003, 0.5544103900942386, 0.23443329971758334, 0.40227238265626886], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.2419999999999964, 1, 75, 3.0, 4.0, 5.0, 14.950000000000045, 0.5595783017917698, 0.5956448720244424, 0.22732868510290646], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.97, 2, 26, 4.0, 5.0, 7.0, 15.990000000000009, 0.5561766194472717, 0.34163583362532607, 0.27808830972363585], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1880000000000015, 2, 32, 4.0, 5.0, 7.0, 14.990000000000009, 0.5561617718869123, 0.3258760382149877, 0.26233021076306506], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 538.9019999999994, 387, 823, 546.5, 648.0, 661.0, 739.8300000000002, 0.5556543385490754, 0.5072733416496266, 0.24472666668518847], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.103999999999996, 6, 124, 15.5, 28.0, 36.0, 49.98000000000002, 0.5558242039207839, 0.4923169462462412, 0.22851756821352542], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.672000000000004, 4, 72, 7.0, 10.0, 11.0, 16.0, 0.5563622808628067, 0.37108929475517277, 0.2602514966145355], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 571.7920000000004, 376, 3857, 544.5, 648.9000000000001, 705.0, 774.99, 0.5561741447988262, 0.4182168862256799, 0.30741656831653874], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.333999999999994, 8, 45, 13.0, 16.0, 18.0, 27.940000000000055, 0.5587847103092426, 0.4561953299009051, 0.3448749383939857], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.136000000000005, 8, 34, 13.0, 16.0, 17.0, 24.99000000000001, 0.5587928286763539, 0.4643000882333877, 0.35361108689675524], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.306, 8, 70, 13.5, 16.0, 18.0, 26.0, 0.5587697231743037, 0.4523633794057596, 0.34104597361712874], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.212000000000035, 11, 84, 16.0, 20.0, 21.0, 34.930000000000064, 0.5587753432556933, 0.49984200627169445, 0.3885234808574743], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.440000000000001, 8, 54, 13.5, 16.0, 18.0, 28.970000000000027, 0.5585637315632077, 0.4194682710665104, 0.30819190266915264], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2213.888, 1703, 3097, 2183.0, 2568.7000000000003, 2664.85, 2821.5700000000006, 0.5575217489234255, 0.46542176938447366, 0.35498455107233734], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
