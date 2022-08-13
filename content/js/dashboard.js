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

    var data = {"OkPercent": 97.79195915762604, "KoPercent": 2.208040842373963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8785364815996597, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.372, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.833, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.342, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.992, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.885, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.52, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.506, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.96, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.887, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 519, 2.208040842373963, 289.19085300999956, 1, 7063, 27.0, 819.0, 1844.7500000000036, 3873.7100000000464, 16.852675850735693, 111.2268967203155, 139.5935155130835], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 38.79200000000002, 15, 104, 32.5, 63.900000000000034, 69.94999999999999, 83.0, 0.3654343003943036, 0.2121303289456855, 0.18414462793306707], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.67599999999999, 5, 77, 14.0, 26.0, 34.94999999999999, 51.99000000000001, 0.36538195933883405, 3.9152082807335553, 0.13202277827672715], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.756000000000004, 5, 94, 15.0, 27.0, 32.0, 43.0, 0.3653584641499314, 3.923156392055938, 0.15413560206325233], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 69.304, 7, 475, 60.5, 131.0, 144.0, 178.94000000000005, 0.36208243748103597, 0.19539156409474684, 4.030995886019345], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 70.14999999999995, 28, 186, 60.0, 116.0, 125.94999999999999, 152.0, 0.3653934410415759, 1.5197369779258516, 0.15200938074581186], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.4300000000000015, 1, 44, 6.0, 15.0, 16.0, 20.99000000000001, 0.36540572459224374, 0.22835788106153285, 0.15451238159027494], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.268000000000015, 26, 153, 55.5, 104.0, 119.0, 137.99, 0.36539584427998384, 1.499743691943168, 0.1327414590548379], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1179.470000000001, 605, 2536, 919.0, 2251.9, 2366.9, 2473.88, 0.36509621745714865, 1.5439027688075666, 0.17755655888052738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 19.906000000000002, 6, 65, 18.5, 32.0, 38.0, 51.97000000000003, 0.3648048002474836, 0.5424932383430274, 0.1863212016889003], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.353999999999996, 2, 36, 8.0, 24.0, 28.0, 35.0, 0.36292213287885805, 0.3501631516448357, 0.1984730414181255], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 29.89000000000003, 10, 92, 24.0, 52.0, 56.0, 71.93000000000006, 0.3653881006249598, 0.5952500437552251, 0.2387154680840802], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1384.0, 1384, 1384, 1384.0, 1384.0, 1384.0, 1384.0, 0.722543352601156, 0.3083510205924856, 854.6170802474711], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.090000000000002, 2, 35, 9.0, 20.0, 24.0, 28.0, 0.3629284551877719, 0.36468001029083635, 0.21300781403110441], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 30.88200000000002, 11, 117, 25.0, 52.0, 56.0, 72.99000000000001, 0.36537127933291974, 0.5740832001098306, 0.21729600499389465], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 20.15799999999999, 6, 68, 18.0, 34.0, 40.0, 55.0, 0.36536887641763127, 0.5655367862519, 0.2087312428753069], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2948.779999999999, 1539, 6233, 2679.5, 4458.7, 5040.299999999999, 6027.750000000002, 0.36440625466895515, 0.5565116949354819, 0.20070813245438543], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 69.54599999999998, 13, 281, 64.0, 136.0, 149.89999999999998, 179.94000000000005, 0.362064083894593, 0.19552874843135737, 2.919141676400156], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 36.254000000000026, 13, 189, 31.0, 57.900000000000034, 64.94999999999999, 82.0, 0.36539637833725647, 0.6615051820971122, 0.3047348702148604], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 30.988000000000024, 10, 82, 26.0, 52.0, 57.94999999999999, 72.99000000000001, 0.36539290699288945, 0.6185552398713086, 0.2619124938796688], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 4.479041466346154, 1311.3731971153848], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.7910324913644214, 3303.0109833765114], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.258000000000001, 1, 46, 8.0, 20.0, 22.94999999999999, 30.99000000000001, 0.36288815424198106, 0.3048154180743703, 0.1534478230339627], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 593.7019999999994, 317, 1408, 471.0, 1180.9, 1222.75, 1326.91, 0.3628107383271087, 0.31933864228239883, 0.1679416894209468], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.586000000000002, 1, 55, 8.0, 21.0, 25.0, 43.97000000000003, 0.36290527446525905, 0.3287801290763335, 0.1771998410474898], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1664.878, 920, 3779, 1320.5, 3099.7000000000003, 3447.35, 3631.8900000000003, 0.36266889490435694, 0.34310744138545324, 0.19160534388989955], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.774980709876543, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 106.69000000000007, 29, 1015, 98.0, 181.0, 195.0, 240.0, 0.36180130740520444, 0.19492540086680357, 16.548876597895475], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 123.63000000000007, 11, 646, 113.5, 222.0, 252.0, 286.97, 0.3624236282809305, 79.69597122759588, 0.11184166653981839], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.9010550902061856, 0.704735824742268], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.65199999999999, 1, 32, 6.0, 19.0, 22.0, 28.0, 0.3653993156801616, 0.3969920830757268, 0.15665068318710054], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.113999999999997, 2, 52, 9.0, 22.0, 27.0, 36.99000000000001, 0.36539611130842503, 0.37482361644589435, 0.13452571676101194], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 7.145999999999997, 1, 29, 6.0, 13.0, 16.0, 20.0, 0.3653891686957945, 0.2072948383207737, 0.14165966794163126], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.36600000000004, 89, 455, 144.0, 360.0, 390.0, 423.93000000000006, 0.3653616678613993, 0.3328930040182476, 0.11917070025947984], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 15, 3.0, 325.7819999999999, 39, 996, 276.0, 540.0, 570.9, 665.95, 0.36217003593451097, 0.1933584794779971, 107.13654584493183], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.380000000000004, 1, 32, 6.5, 15.0, 16.0, 22.970000000000027, 0.3653934410415759, 0.20372896681167915, 0.15307986934261336], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.169999999999987, 2, 48, 8.0, 20.0, 21.0, 30.99000000000001, 0.36543002709298217, 0.19663275871897773, 0.15559325372318383], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.862000000000016, 7, 738, 47.0, 132.90000000000003, 143.0, 182.97000000000003, 0.3616150015260153, 0.15278657582054062, 0.26238275989631776], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.655999999999995, 3, 112, 10.0, 20.0, 24.0, 36.0, 0.3654006508516393, 0.18801148097979992, 0.14701666811608924], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.74400000000001, 2, 48, 9.0, 20.0, 24.0, 33.0, 0.36288446702069677, 0.22288406489934676, 0.18144223351034838], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.998, 2, 59, 11.0, 24.0, 28.0, 33.0, 0.36287182568798687, 0.2126202103640548, 0.1711592693430641], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 813.0579999999995, 385, 1827, 634.0, 1603.6000000000001, 1673.85, 1745.92, 0.3626005128621654, 0.33135737960937767, 0.15970003056722323], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 35.866000000000035, 9, 422, 31.0, 61.0, 69.94999999999999, 111.94000000000005, 0.3625910466118042, 0.32103896249285696, 0.14907307678082968], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 17.15200000000001, 5, 149, 14.0, 29.0, 35.0, 43.99000000000001, 0.3629331970640156, 0.24176525557937203, 0.16977050917349948], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 823.4920000000006, 467, 5830, 798.5, 980.0, 1048.0, 1307.7500000000002, 0.36284970547489404, 0.27259934552798626, 0.20055950517459964], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 246.8699999999998, 144, 582, 194.0, 493.90000000000003, 510.9, 564.0, 0.36538195933883405, 7.064625215621029, 0.18411825294808434], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 380.02199999999976, 210, 874, 305.5, 683.9000000000001, 730.95, 791.99, 0.3653339042284477, 0.7081912108334654, 0.26115665810080435], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 29.846, 10, 84, 24.0, 52.0, 56.0, 75.98000000000002, 0.36477233099733136, 0.2975131577939445, 0.22513292303741542], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 29.40000000000005, 10, 82, 24.0, 52.0, 55.0, 69.99000000000001, 0.36478670191965357, 0.30328665636691415, 0.23084158480853076], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 30.357999999999993, 10, 90, 26.0, 52.0, 56.0, 71.98000000000002, 0.3647385371796228, 0.2952814915253001, 0.2226187360715471], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 33.28400000000005, 12, 111, 28.0, 53.900000000000034, 62.89999999999998, 80.99000000000001, 0.36475503416660404, 0.32626411670373795, 0.2536187346939669], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 30.33999999999999, 10, 111, 24.0, 54.900000000000034, 60.94999999999999, 69.0, 0.3643799637660564, 0.2735376190884817, 0.20104949172638856], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3283.405999999998, 1687, 7063, 2847.0, 5101.6, 5648.5, 6397.780000000001, 0.3639436644322952, 0.30415170099989886, 0.23172975508775046], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.33911368015414, 2.1272069772388855], "isController": false}, {"data": ["500", 19, 3.6608863198458574, 0.08083386513507765], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 519, "No results for path: $['rows'][1]", 500, "500", 19, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 15, "500", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
