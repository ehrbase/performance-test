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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8880876409274623, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.173, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.543, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.907, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.992, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.13, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 328.59638374813795, 1, 22779, 10.0, 847.0, 1510.0, 6045.990000000002, 15.03637709353004, 94.7180257486363, 124.42730361671087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6242.156, 4980, 22779, 6034.0, 6580.7, 6734.8, 20641.31000000012, 0.32435223614918646, 0.18837452964871354, 0.16344311899705097], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.512000000000002, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.32537466893127437, 0.16704366914439475, 0.11756701904743312], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.772000000000001, 2, 25, 4.0, 5.0, 5.0, 9.0, 0.32537170463537546, 0.18674238723755518, 0.13726618789304904], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 14.197999999999997, 9, 385, 12.0, 16.900000000000034, 22.94999999999999, 38.99000000000001, 0.3232390100352783, 0.16815688773036436, 3.556576099675274], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.39600000000003, 24, 66, 34.0, 40.0, 42.0, 55.98000000000002, 0.3252999428122701, 1.3528887885293386, 0.1353298590215108], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6339999999999986, 1, 49, 2.0, 3.0, 4.0, 10.980000000000018, 0.325307985335116, 0.20322536259641313, 0.1375569898926809], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.43600000000001, 21, 83, 30.0, 36.0, 37.0, 52.960000000000036, 0.32530481060753924, 1.3351189263558705, 0.11817713822852012], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 865.7800000000001, 676, 1101, 867.0, 1011.0, 1059.0, 1091.98, 0.3251634922038801, 1.3751843626194, 0.1581361514819651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.055999999999998, 4, 21, 6.0, 8.0, 9.949999999999989, 13.0, 0.32525571604395376, 0.48366223767313365, 0.1661218159091678], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.011999999999998, 3, 25, 4.0, 5.0, 5.0, 10.0, 0.32350063923726313, 0.3120359534971066, 0.17691441208287825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.336000000000002, 5, 53, 8.0, 10.0, 11.0, 16.99000000000001, 0.3253086202880673, 0.5301228005477546, 0.21253072946554397], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.8810940682281059, 2408.94101642057], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.235999999999997, 2, 20, 4.0, 5.0, 7.0, 11.0, 0.3235052440200056, 0.32499324177326167, 0.1898697770078353], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.556000000000003, 6, 21, 8.0, 10.0, 11.0, 17.99000000000001, 0.32530735038464337, 0.5110597535520309, 0.19346892225024204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.786000000000002, 4, 23, 6.0, 8.0, 9.0, 14.0, 0.3253069270857054, 0.5034347074433478, 0.18584428939954847], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1585.3240000000003, 1337, 1960, 1559.0, 1800.0, 1862.9, 1938.99, 0.3249747657094426, 0.49625614344483654, 0.17899000767590398], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.734, 8, 88, 11.0, 15.0, 23.0, 62.77000000000021, 0.3232235472232835, 0.16814884359503451, 2.605989849487723], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.59999999999999, 8, 30, 11.0, 14.0, 15.0, 21.99000000000001, 0.3253092552434972, 0.5888955268920149, 0.2713028359159635], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.491999999999987, 6, 46, 8.0, 10.0, 12.0, 16.99000000000001, 0.3253090435914119, 0.5507729902000651, 0.2331805058555628], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.248621323529413, 2674.1727941176473], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.9203714037698413, 3794.5304749503966], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4499999999999993, 1, 18, 2.0, 3.0, 4.0, 8.990000000000009, 0.32347719873921527, 0.2718945895769824, 0.1367828389200002], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 581.0519999999997, 460, 728, 567.5, 672.0, 687.0, 706.99, 0.3233834707066317, 0.2847637786824969, 0.14969117687006192], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4399999999999995, 2, 35, 3.0, 4.0, 5.0, 9.990000000000009, 0.3234972903866957, 0.29307780396937644, 0.15795766132162878], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 782.378, 630, 962, 762.5, 903.0, 924.95, 954.99, 0.3233617201808756, 0.3059020819886875, 0.17083856505649775], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.230000000000004, 15, 667, 21.0, 27.0, 35.94999999999999, 80.99000000000001, 0.32308590983576896, 0.16807724123887938, 14.73763950041872], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 32.576, 20, 282, 29.0, 45.0, 53.0, 114.93000000000006, 0.32337447734600094, 73.13780449243951, 0.0997913426184925], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 1.2575876798561152, 0.983588129496403], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7960000000000025, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3253274583532054, 0.3535108556486281, 0.1394714396650949], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.477999999999998, 2, 11, 3.0, 5.0, 5.0, 7.0, 0.32532639997709706, 0.33381220871087464, 0.11977348905406796], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9800000000000018, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.32537551588288044, 0.1845203279573706, 0.12614656231006205], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.52799999999999, 65, 128, 89.0, 109.0, 113.0, 116.0, 0.32535455512644906, 0.296349069445303, 0.10612150528538475], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 86.86400000000003, 57, 431, 82.0, 100.90000000000003, 120.94999999999999, 378.6800000000003, 0.32330672950025185, 0.1681921170625773, 95.59965295447388], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 206.602, 12, 371, 260.0, 332.0, 336.0, 344.99, 0.3253228015498378, 0.18131345319580855, 0.1362924627586723], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 444.0780000000003, 350, 564, 434.0, 515.0, 532.95, 553.0, 0.3252906309141903, 0.17494219077222045, 0.1385026514439326], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.726, 4, 267, 6.0, 9.0, 13.949999999999989, 31.0, 0.3230335173116892, 0.14565215359177738, 0.2343885775025245], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 413.8720000000002, 300, 578, 411.0, 477.0, 487.84999999999997, 509.98, 0.32525423497276645, 0.16729947080322835, 0.130864008602324], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.652, 2, 15, 3.0, 5.0, 5.0, 9.0, 0.3234742689158048, 0.19860498790044495, 0.16173713445790242], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.243999999999998, 2, 47, 4.0, 5.0, 6.0, 9.0, 0.3234650612448747, 0.18943870300699592, 0.15257189900515086], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.973999999999, 527, 875, 679.0, 798.8000000000001, 831.95, 853.97, 0.32331404657274176, 0.295437682147051, 0.14239710449639312], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 249.36000000000007, 179, 319, 244.0, 296.90000000000003, 301.0, 309.99, 0.32338869963463546, 0.28634742953683623, 0.1329557056115054], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.686000000000002, 3, 38, 4.0, 6.0, 7.0, 12.980000000000018, 0.32350670920564223, 0.21568482953299217, 0.15132784541943614], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 987.6599999999991, 816, 8933, 930.0, 1094.8000000000002, 1111.0, 1149.89, 0.3233326543347592, 0.24303943102344486, 0.17871707261081418], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.51599999999993, 118, 171, 133.5, 151.0, 153.0, 161.99, 0.32536895212326017, 6.290903834074523, 0.16395544853086155], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.8760000000001, 161, 242, 182.0, 205.0, 208.0, 213.99, 0.325345451800722, 0.6305823941830185, 0.2325711628106724], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.612, 5, 21, 7.0, 9.0, 11.0, 15.0, 0.3252529654939129, 0.2654464412040214, 0.20074206464077435], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.490000000000006, 5, 21, 7.0, 9.0, 11.0, 15.990000000000009, 0.325253600232101, 0.27052904673211203, 0.2058245438968764], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.688000000000006, 6, 22, 9.0, 10.0, 12.0, 15.990000000000009, 0.32524852239596275, 0.26321943651831864, 0.1985159438451921], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.187999999999992, 7, 27, 10.0, 12.0, 14.0, 20.99000000000001, 0.3252508497178449, 0.2908549371046169, 0.22615098144443901], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.068000000000007, 6, 29, 8.0, 10.0, 11.0, 14.0, 0.32520980910834624, 0.24413284410124692, 0.1794370528771637], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.1780000000006, 1398, 1998, 1593.0, 1829.5000000000002, 1903.6, 1955.98, 0.32490909043649585, 0.2715116775170057, 0.2068757099263626], "isController": false}]}, function(index, item){
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
