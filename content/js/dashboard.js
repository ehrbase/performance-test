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

    var data = {"OkPercent": 97.83450329717081, "KoPercent": 2.165496702829185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8990002127206977, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.974, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.489, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.717, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.594, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 509, 2.165496702829185, 188.8242927036811, 1, 4055, 17.0, 555.0, 1226.0, 2231.9900000000016, 26.082701193556833, 174.75150913719855, 216.09829252212674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.711999999999993, 15, 69, 28.0, 32.0, 34.0, 44.99000000000001, 0.5658022340135408, 0.3286018033107352, 0.28621636447169346], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.375999999999996, 4, 45, 7.0, 10.0, 11.949999999999989, 18.0, 0.565541126716276, 6.061530547633267, 0.2054504874398971], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.6919999999999975, 5, 33, 7.0, 9.0, 11.0, 17.99000000000001, 0.565524495693531, 6.072504835234438, 0.2396851866513598], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.670000000000005, 14, 259, 20.0, 27.0, 33.0, 53.0, 0.561440701755962, 0.30313630952113596, 6.251510626388162], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.332000000000036, 27, 92, 43.0, 52.900000000000034, 54.0, 67.98000000000002, 0.5653019899760652, 2.351096496837701, 0.23627856612280848], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.645999999999999, 1, 19, 2.0, 3.900000000000034, 4.0, 13.0, 0.565335226829453, 0.3532704748872439, 0.2401570543660274], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.01599999999997, 22, 82, 38.0, 46.0, 47.0, 53.0, 0.5652975160827143, 2.320099144351547, 0.20646608497552263], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 778.8100000000006, 579, 1216, 779.5, 923.9000000000001, 935.95, 1033.0, 0.5649660059954194, 2.389327308394604, 0.2758623076149508], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.769999999999998, 7, 31, 12.0, 15.0, 17.0, 24.99000000000001, 0.5648677136301449, 0.8399704259978106, 0.2896050289607677], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4059999999999993, 2, 26, 3.0, 4.0, 5.949999999999989, 10.990000000000009, 0.562222262202472, 0.5423611019359561, 0.30856338999784105], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.451999999999998, 11, 42, 20.0, 23.0, 25.0, 32.97000000000003, 0.5652815384702351, 0.9211505563783543, 0.37041397686867944], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.7220944373942471, 2001.3400883037225], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.532000000000001, 2, 27, 4.0, 6.0, 7.0, 13.0, 0.5622317451785817, 0.564913327056953, 0.33107982650652806], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.313999999999997, 12, 49, 20.0, 24.0, 25.94999999999999, 37.99000000000001, 0.5652642836631838, 0.8881295524972245, 0.3372817161310599], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.191999999999998, 7, 31, 11.5, 14.0, 16.0, 22.970000000000027, 0.5652623665274237, 0.8748461868107332, 0.32403223549960714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1967.5379999999998, 1472, 3131, 1947.0, 2211.7000000000003, 2278.0, 2494.6400000000003, 0.5639477243017481, 0.8611503779295675, 0.3117132929245991], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 18.525999999999993, 6, 68, 17.0, 24.0, 29.94999999999999, 45.0, 0.5614066605286205, 0.3028580599048977, 4.527437697895848], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.93, 15, 44, 24.0, 28.0, 30.0, 33.99000000000001, 0.5652936813733471, 1.0233306153306516, 0.47255018677303234], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.40200000000001, 11, 42, 19.0, 23.0, 25.0, 30.980000000000018, 0.565289207611506, 0.9569816326230662, 0.40630161797077], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.4130969101125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.6524327813390314, 2724.281071937322], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.413999999999997, 1, 23, 2.0, 3.0, 4.949999999999989, 11.990000000000009, 0.5621584184909644, 0.47248317108504445, 0.23880753129254836], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 417.8319999999999, 319, 791, 420.0, 484.0, 504.9, 660.2100000000007, 0.5619638162737978, 0.49475645612130326, 0.26122536772102317], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.237999999999998, 1, 23, 3.0, 4.0, 6.0, 12.0, 0.5622127795462494, 0.509282422881273, 0.2756160305978683], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.9780000000005, 938, 1816, 1162.0, 1362.9, 1396.0, 1693.8700000000001, 0.5616204322006197, 0.5312644090742137, 0.29781239715325836], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2478693181818], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 43.916, 9, 692, 42.0, 50.0, 56.0, 92.99000000000001, 0.5609802344224204, 0.30191254991321637, 25.660463066744306], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.58799999999996, 9, 213, 46.0, 54.900000000000034, 62.94999999999999, 89.99000000000001, 0.5616778440557634, 126.14686717161504, 0.17442729922825465], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.8596243351063833, 1.4613807624113477], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3080000000000016, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.5655763109493311, 0.6144765690218018, 0.2435733917272022], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4219999999999993, 2, 27, 3.0, 4.900000000000034, 6.0, 14.0, 0.5655711929706287, 0.5802915088251729, 0.2093276192733089], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1880000000000024, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.5655526410742786, 0.3207246818342229, 0.22036670291859095], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.68200000000006, 87, 246, 122.0, 150.0, 155.0, 216.63000000000034, 0.5654861201431811, 0.515168900101222, 0.1855501331719813], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 168.2519999999999, 38, 642, 168.0, 197.0, 220.95, 355.82000000000016, 0.5614583543880217, 0.3022334708064114, 166.0907858508003], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2919999999999985, 1, 14, 2.0, 3.0, 4.0, 7.990000000000009, 0.5655673545473877, 0.31530600940764736, 0.23804641583000402], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.255999999999998, 1, 17, 3.0, 5.0, 6.0, 8.0, 0.5656153385829978, 0.30425354930695153, 0.24193312333921194], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.136000000000024, 7, 296, 10.0, 15.0, 19.94999999999999, 43.99000000000001, 0.5608109775383988, 0.2368856806450672, 0.40801189283799516], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.8020000000000005, 2, 62, 4.0, 6.0, 6.0, 13.980000000000018, 0.5655782302152251, 0.29091377894205195, 0.22866151104404608], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7219999999999986, 2, 15, 3.0, 5.0, 6.0, 10.990000000000009, 0.5621520981202758, 0.3452426367912808, 0.2821740023767791], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.104000000000002, 2, 25, 4.0, 5.0, 7.0, 10.990000000000009, 0.5621375618070249, 0.3292819581527935, 0.2662467944105538], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.0439999999998, 382, 830, 531.5, 636.9000000000001, 647.95, 697.8600000000001, 0.5616393578889549, 0.5131507943405849, 0.24845959875360996], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.680000000000001, 5, 118, 15.0, 26.900000000000034, 32.94999999999999, 47.97000000000003, 0.5618065902160259, 0.49739305063506617, 0.23207440201306537], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.19999999999999, 6, 42, 10.0, 13.0, 14.0, 21.99000000000001, 0.5622405962449075, 0.37481901123806505, 0.2640993425720708], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 544.2219999999999, 451, 4055, 528.0, 588.9000000000001, 610.0, 679.9000000000001, 0.561977080326756, 0.4223257758655571, 0.31172166174374744], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.776, 143, 366, 180.0, 190.0, 201.95, 339.3500000000006, 0.5656754900729608, 10.937249423435256, 0.28615224986112664], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 263.6480000000001, 214, 525, 265.0, 289.0, 302.84999999999997, 358.9000000000001, 0.5654835619583375, 1.0961125726505008, 0.40533685007560516], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 19.080000000000002, 13, 46, 20.0, 23.0, 24.0, 35.0, 0.5648549508971591, 0.46095914983116487, 0.3497246473328114], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.611999999999995, 12, 38, 20.0, 23.0, 24.0, 30.0, 0.5648600559211455, 0.46972526619030136, 0.3585537464343209], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.066000000000017, 12, 60, 20.0, 23.0, 25.94999999999999, 38.0, 0.5648287890974488, 0.45717264253172074, 0.3458473151993168], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.767999999999986, 14, 44, 23.0, 26.900000000000034, 28.0, 34.99000000000001, 0.5648428268350049, 0.505205573840773, 0.39384548667987646], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.27200000000001, 11, 54, 19.0, 22.0, 24.0, 33.960000000000036, 0.5645411691647613, 0.4237333548564654, 0.3125926200355661], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2201.3779999999992, 1676, 3482, 2166.0, 2563.2000000000003, 2639.6, 2817.86, 0.5634996483762195, 0.4708589854808681, 0.35989137699028073], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.23182711198429, 2.1272069772388855], "isController": false}, {"data": ["500", 9, 1.768172888015717, 0.03828972559029994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 509, "No results for path: $['rows'][1]", 500, "500", 9, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
