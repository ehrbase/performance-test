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

    var data = {"OkPercent": 97.82599446926186, "KoPercent": 2.1740055307381407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8968304616039141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.962, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.462, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.985, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.678, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.582, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.994, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 511, 2.1740055307381407, 197.69300148904566, 1, 4466, 19.0, 582.9000000000015, 1269.8500000000022, 2369.0, 24.922227382323193, 166.29465646583625, 206.48362848624905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 32.42199999999999, 20, 76, 33.0, 38.0, 41.0, 60.0, 0.539372580239762, 0.31322166365696763, 0.2728466763322233], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.428, 4, 23, 7.0, 10.0, 13.0, 20.0, 0.5393626890466225, 5.779417641677094, 0.19594035188021833], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.780000000000006, 5, 35, 7.0, 10.0, 11.0, 16.99000000000001, 0.5393463984604897, 5.791470024340703, 0.2285901727850122], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.284, 13, 273, 20.0, 29.0, 33.0, 47.98000000000002, 0.5363874519665036, 0.28954865141466823, 5.9725485618379635], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.85999999999999, 26, 88, 44.0, 54.0, 59.94999999999999, 77.97000000000003, 0.5392614706307418, 2.242763178471819, 0.22539444280269286], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.700000000000001, 1, 20, 2.0, 4.0, 5.0, 12.0, 0.5392952058813377, 0.3369984116407949, 0.22909513140466986], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.007999999999996, 23, 84, 39.0, 47.0, 54.94999999999999, 73.96000000000004, 0.5392387889559582, 2.2131486823565383, 0.1969485420600863], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 803.7760000000001, 576, 1699, 796.0, 924.9000000000001, 1026.2499999999995, 1494.7700000000002, 0.5389504909300022, 2.2793037318818317, 0.2631594193994151], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 14.23799999999999, 9, 35, 15.0, 18.0, 20.0, 28.0, 0.5390103339061216, 0.8015199468185454, 0.2763480715827284], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7459999999999987, 2, 66, 3.0, 5.0, 7.0, 15.980000000000018, 0.5371538580538701, 0.5181478438106983, 0.2948051447522217], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 23.93999999999999, 15, 83, 25.0, 29.900000000000034, 34.0, 47.0, 0.5391992459837744, 0.8785872588835771, 0.3533229434131959], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.6545365222392637, 1814.0981475268404], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.588000000000006, 2, 25, 4.0, 6.0, 7.949999999999989, 15.990000000000009, 0.5371625142213776, 0.539724527619285, 0.31631737897997136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 25.025999999999993, 16, 57, 26.0, 31.0, 36.0, 52.98000000000002, 0.539185872467444, 0.8471557844129992, 0.3217212578882893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 14.059999999999993, 9, 37, 14.0, 18.0, 20.94999999999999, 28.99000000000001, 0.5391829652690685, 0.8344530366245422, 0.30908242247357737], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2061.3639999999987, 1518, 3834, 1991.0, 2384.7000000000003, 2699.1499999999996, 3489.2700000000004, 0.5381459365676622, 0.8217814281935732, 0.2974517579075164], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.76799999999998, 11, 85, 17.0, 25.900000000000034, 29.0, 43.99000000000001, 0.5363471753812356, 0.2895269096104832, 4.325346654588128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 29.526000000000003, 18, 74, 30.0, 37.0, 44.0, 63.0, 0.5392329734492468, 0.976153862512308, 0.4507650637427298], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.047999999999995, 15, 61, 25.0, 29.0, 31.94999999999999, 53.97000000000003, 0.5392143646706749, 0.9129004509180125, 0.38756032460704753], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.354256465517242, 1567.6409841954023], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.6908111802413273, 2884.5328996983408], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5020000000000007, 1, 27, 2.0, 3.0, 4.949999999999989, 10.990000000000009, 0.5371007729954326, 0.45136186600624756, 0.22816292602833316], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 431.086, 321, 895, 435.0, 491.80000000000007, 527.4499999999998, 826.7500000000002, 0.5369133282290772, 0.4727018498811811, 0.24958080491898516], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.385999999999999, 2, 21, 3.0, 4.0, 7.0, 13.980000000000018, 0.5371573204873951, 0.4866466970599231, 0.2633329832858128], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1225.172000000001, 932, 2556, 1193.0, 1403.0, 1712.0499999999997, 2325.750000000002, 0.5366182958934749, 0.5076440521630547, 0.28455442838882505], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3089599609375, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 45.428, 15, 765, 43.0, 55.0, 68.94999999999999, 102.96000000000004, 0.5359148709945722, 0.28861004549649294, 24.513918513072035], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.76199999999998, 9, 207, 49.0, 63.0, 74.0, 96.93000000000006, 0.5366960561427011, 119.84948623260568, 0.16666928305994036], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.7837213010204083, 1.401732568027211], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.34, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5393929456033002, 0.5861210200217267, 0.2322971572373588], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.358, 2, 14, 3.0, 4.0, 6.0, 9.990000000000009, 0.5393871267710776, 0.5534259409338733, 0.19963644633421723], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2959999999999994, 1, 21, 2.0, 3.0, 4.0, 8.990000000000009, 0.5393743257820928, 0.30590951995685006, 0.2101663632686084], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 128.24199999999996, 84, 280, 124.0, 154.0, 168.95, 263.99, 0.5393120750894989, 0.4912627398994938, 0.17696177463874183], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 178.07200000000006, 38, 696, 175.0, 219.0, 251.5999999999999, 367.85000000000014, 0.5364720524884256, 0.2881598857716882, 158.69933021464246], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.5599999999999996, 1, 22, 2.0, 4.0, 5.0, 10.990000000000009, 0.5393836355320049, 0.300708483776419, 0.22702572940849033], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4579999999999993, 2, 24, 3.0, 5.0, 6.0, 10.990000000000009, 0.5394284431987244, 0.29013664531608885, 0.23073208800882936], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.135999999999997, 7, 297, 10.0, 16.0, 22.0, 44.99000000000001, 0.5357644179562516, 0.22639709110727504, 0.3897895423607495], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.813999999999999, 2, 59, 4.0, 6.0, 7.0, 13.990000000000009, 0.5393958550664913, 0.27744647541217937, 0.21807605859133536], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.044, 2, 25, 4.0, 5.0, 7.0, 14.980000000000018, 0.5370926957541748, 0.32985254187174656, 0.2695953570484823], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.301999999999997, 2, 27, 4.0, 5.0, 7.0, 19.99000000000001, 0.5370782727133088, 0.3145726186217927, 0.2543778928378464], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 548.5060000000001, 381, 1249, 549.5, 637.9000000000001, 702.95, 1017.8900000000001, 0.5366517012395582, 0.49032042164992495, 0.23740548892726546], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.108000000000004, 7, 123, 16.0, 26.0, 34.0, 55.91000000000008, 0.5368107216131807, 0.47532387636121776, 0.22174896019763224], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.623999999999993, 7, 61, 13.0, 15.0, 16.94999999999999, 25.99000000000001, 0.5371677080557967, 0.3580432605327844, 0.25232194099105293], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 564.3139999999994, 368, 3440, 537.5, 648.9000000000001, 687.9, 759.99, 0.5369905972946414, 0.40354843386692296, 0.29786197193687136], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 181.03200000000007, 142, 371, 181.5, 198.0, 240.84999999999997, 348.96000000000004, 0.5392335549942734, 10.425998636952382, 0.27277634910843124], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 287.0480000000001, 22, 546, 285.0, 324.80000000000007, 363.0, 496.93000000000006, 0.5393004410399007, 1.043613765967338, 0.3865688708235226], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 23.72200000000001, 15, 55, 25.0, 29.0, 32.0, 45.0, 0.5389940645973607, 0.4397938913646683, 0.33371312202610026], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 23.65399999999999, 15, 55, 25.0, 29.0, 33.0, 51.98000000000002, 0.5389940645973607, 0.44821567362400205, 0.342134904285434], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 23.422, 15, 57, 25.0, 29.0, 32.0, 48.960000000000036, 0.5389870923371126, 0.43622583451371505, 0.3300243231400094], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 26.109999999999978, 17, 60, 27.0, 32.0, 36.0, 53.950000000000045, 0.5389888353852638, 0.4820812993242158, 0.3758183871729281], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 23.83800000000003, 15, 52, 25.0, 29.900000000000034, 37.0, 50.99000000000001, 0.5389737293424844, 0.40460399949498166, 0.2984356489620983], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2277.1300000000033, 1732, 4466, 2228.5, 2580.7000000000003, 2752.6, 3733.1800000000017, 0.537848969857868, 0.44945580273151975, 0.34350901004594303], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.84735812133073, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19569471624266144, 0.0042544139544777706], "isController": false}, {"data": ["500", 10, 1.9569471624266144, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 511, "No results for path: $['rows'][1]", 500, "500", 10, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
