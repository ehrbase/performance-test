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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8904701127419697, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.176, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.608, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.965, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.111, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.5164007657925, 1, 18423, 9.0, 840.0, 1512.9500000000007, 6074.980000000003, 15.215177762860726, 95.84433737917026, 125.90689441383536], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6214.777999999997, 5068, 18423, 6064.5, 6502.200000000001, 6764.9, 15384.530000000075, 0.32805449903781614, 0.19052469836208952, 0.16530871240577455], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3379999999999974, 1, 11, 2.0, 3.0, 4.0, 5.990000000000009, 0.3291403052710503, 0.1689769041836366, 0.11892764936551624], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6699999999999995, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.3291381386185019, 0.18890407758542946, 0.1388551522296805], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.031999999999988, 8, 342, 11.0, 16.0, 20.0, 33.0, 0.32712943268559525, 0.17018078133392917, 3.599382146551369], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 32.06799999999999, 22, 51, 32.0, 38.0, 40.0, 43.0, 0.32908138248405105, 1.3686154046861847, 0.13690299700996655], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.210000000000002, 1, 21, 2.0, 3.0, 4.0, 6.0, 0.329088530080008, 0.2055871323998847, 0.13915559914515963], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.22599999999998, 20, 59, 28.0, 33.0, 34.94999999999999, 39.0, 0.3290833317976111, 1.3506267669718146, 0.11954980412960091], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.7860000000003, 683, 1115, 854.0, 985.9000000000001, 1050.6, 1079.98, 0.32893135465773377, 1.3911194403611271, 0.15996856896440567], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.612000000000002, 3, 28, 5.0, 8.0, 8.0, 10.990000000000009, 0.32900970710239835, 0.48924450302919237, 0.16803913751421323], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.882000000000002, 2, 32, 4.0, 5.0, 5.0, 11.0, 0.327318528061672, 0.3157185384294864, 0.1790023200337269], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.721999999999993, 5, 22, 8.0, 9.0, 10.0, 13.990000000000009, 0.32908073271799626, 0.5362698334900855, 0.21499512713705027], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.9656633649553571, 2640.15633719308], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.094000000000002, 2, 20, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.3273251707164428, 0.3288307386403436, 0.1921117457036935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.091999999999995, 5, 21, 8.0, 10.0, 11.0, 15.980000000000018, 0.3290779170947422, 0.5169833359467605, 0.19571137842841602], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.569999999999997, 4, 19, 6.0, 8.0, 9.0, 12.0, 0.3290764010098697, 0.5092682260198735, 0.1879977486238025], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1572.0440000000006, 1344, 2009, 1551.0, 1769.0, 1833.95, 1915.96, 0.32871402471535005, 0.5019662183473048, 0.18104952142525144], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.823999999999995, 7, 83, 10.0, 14.0, 17.0, 67.92000000000007, 0.327115521500649, 0.17017354439317456, 2.6373688920989826], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.985999999999995, 8, 31, 11.0, 13.0, 15.0, 19.980000000000018, 0.3290835483894322, 0.5957279926611078, 0.27445053742634284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.765999999999993, 5, 32, 7.0, 9.0, 11.0, 14.990000000000009, 0.32908311520607514, 0.5571627809218013, 0.23588574859497963], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.861328125, 2273.046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.8903400911708254, 3670.7166206813818], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3300000000000005, 1, 15, 2.0, 3.0, 4.0, 7.990000000000009, 0.3273333136933345, 0.2751357972939355, 0.13841340315352915], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.8879999999997, 449, 694, 567.0, 649.0, 659.0, 671.99, 0.3272317697544911, 0.28815249912629115, 0.15147251842151246], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.282000000000003, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.32733224222585927, 0.2965521430032733, 0.15983019639934534], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 762.1920000000001, 612, 945, 742.5, 886.9000000000001, 901.95, 918.98, 0.3271793086570336, 0.30951354305581547, 0.17285547459321798], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.072215544871795, 844.1882011217949], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.052000000000007, 16, 549, 22.0, 27.0, 33.94999999999999, 61.0, 0.3269995696685663, 0.170113223396623, 14.916162010955793], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.12399999999999, 21, 259, 29.0, 36.900000000000034, 48.0, 114.96000000000004, 0.32724954610487955, 74.01423117771057, 0.10098716461830268], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 1.334386927480916, 1.0436545801526718], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.692, 1, 17, 2.5, 4.0, 4.0, 6.0, 0.32908961307617834, 0.3575989290683539, 0.14108431654340067], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4200000000000017, 2, 16, 3.0, 4.0, 5.0, 8.0, 0.3290880968835357, 0.33767202566064436, 0.12115841066903611], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.833999999999999, 1, 12, 2.0, 3.0, 3.0, 7.980000000000018, 0.32914160527627156, 0.18665607578123405, 0.12760665751433575], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.93800000000006, 66, 118, 90.5, 111.90000000000003, 115.0, 117.0, 0.3291247060093564, 0.2997831099042839, 0.10735122246789552], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.44000000000003, 56, 379, 79.0, 95.0, 105.0, 302.38000000000056, 0.3271891572130813, 0.17021185150291068, 96.74766104741103], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 215.14800000000017, 13, 376, 265.0, 336.0, 341.0, 358.97, 0.32908463135281424, 0.18341004878844203, 0.13786846372105208], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.428, 307, 538, 410.0, 495.90000000000003, 510.95, 529.99, 0.32903590505603153, 0.17695640944668664, 0.14009731894963842], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.2720000000000065, 4, 291, 6.0, 8.0, 10.0, 23.970000000000027, 0.3269405556681684, 0.14741379292729498, 0.23722346959125892], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.2480000000003, 280, 516, 393.0, 464.90000000000003, 471.95, 496.9000000000001, 0.3290224807900225, 0.16923772544620383, 0.1323801387553606], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.411999999999998, 2, 18, 3.0, 4.0, 5.0, 9.0, 0.32733031360208026, 0.20097250143043346, 0.16366515680104013], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.182000000000003, 2, 27, 4.0, 5.0, 6.0, 9.990000000000009, 0.3273251707164428, 0.19169939270542766, 0.1543926342344159], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.5920000000001, 531, 879, 681.0, 797.0, 836.9, 850.98, 0.3271688184559856, 0.29896009288813513, 0.144094860472314], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.44200000000006, 170, 326, 242.0, 289.0, 294.95, 306.98, 0.32725682854098437, 0.2897724990296835, 0.13454602032788515], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.447999999999998, 2, 58, 4.0, 5.0, 6.0, 9.990000000000009, 0.32732795642610246, 0.218232489386391, 0.15311532336728814], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 987.9699999999998, 817, 8481, 941.0, 1102.9, 1117.0, 1211.3200000000006, 0.327156188290164, 0.24591346649299037, 0.18083047126194612], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.04200000000003, 117, 162, 129.0, 150.90000000000003, 152.0, 156.0, 0.32911820675337394, 6.363394464091887, 0.16584472137181736], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.54199999999997, 160, 223, 174.0, 204.0, 206.0, 212.0, 0.329095461378673, 0.6378506378445958, 0.2352518337199108], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.962000000000003, 5, 18, 7.0, 8.0, 10.0, 12.990000000000009, 0.3290051607749519, 0.268508694249253, 0.20305787266579065], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.874000000000005, 5, 20, 7.0, 9.0, 10.0, 15.0, 0.3290073256771135, 0.2736512005395062, 0.2081999482800484], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.294000000000002, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.32900061457314805, 0.2662559563505015, 0.20080603916818118], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.731999999999989, 7, 20, 9.0, 11.0, 13.0, 16.99000000000001, 0.3290023464447348, 0.2942097057254962, 0.22875944401235468], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.524000000000001, 5, 25, 7.0, 9.0, 10.0, 13.980000000000018, 0.3289806993603299, 0.24696362637234298, 0.18151767103377578], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1616.5219999999988, 1395, 1977, 1596.0, 1819.3000000000002, 1884.9, 1944.98, 0.32866951294464875, 0.27465409074400915, 0.20927004144522557], "isController": false}]}, function(index, item){
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
