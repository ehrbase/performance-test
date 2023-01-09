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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8715166985747713, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.818, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 481.17553711976245, 1, 22923, 12.0, 1000.0, 1812.0, 10361.930000000011, 10.309563221899698, 65.03360761217928, 85.4159618042854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10910.83, 9109, 22923, 10464.5, 12626.5, 13053.6, 19676.750000000047, 0.22187136962971443, 0.1289193993453907, 0.11223571237128133], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9539999999999984, 1, 14, 3.0, 4.0, 4.0, 7.0, 0.22271873652551644, 0.11434127634651294, 0.08090954100341027], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.504000000000008, 2, 20, 4.0, 5.0, 6.0, 14.980000000000018, 0.22271754604462546, 0.12776244228274794, 0.09439395994469478], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.812, 10, 431, 14.0, 20.0, 26.0, 52.99000000000001, 0.22150523439019387, 0.1301581197118394, 2.4664088696454987], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.94200000000001, 27, 88, 46.0, 55.900000000000034, 57.0, 61.99000000000001, 0.2226627976778942, 0.9260315264636962, 0.09306609121693235], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6659999999999986, 1, 11, 2.0, 4.0, 4.0, 6.0, 0.222667755660437, 0.13910428708353337, 0.0945903063596583], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.26400000000001, 24, 75, 41.0, 49.0, 50.0, 56.0, 0.2226606162355215, 0.9138457016203012, 0.08132331100789554], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1103.2340000000015, 787, 1674, 1103.5, 1399.9, 1497.8, 1570.97, 0.2225901389897346, 0.9414432538716216, 0.10868659130358134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.542, 4, 22, 6.0, 8.0, 9.0, 13.0, 0.2225540750763917, 0.33094269107380114, 0.1141024310694391], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.1519999999999975, 2, 21, 4.0, 5.0, 6.0, 11.990000000000009, 0.2216692313796737, 0.21381339504493901, 0.1216583086282975], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.365999999999996, 6, 28, 10.0, 12.0, 15.0, 22.980000000000018, 0.22265912891295586, 0.3629082872614486, 0.14590261279354821], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.8692479395604394, 2166.285699977106], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.542000000000003, 3, 24, 4.0, 5.900000000000034, 7.0, 14.990000000000009, 0.22167100033472323, 0.22269060034602844, 0.13053477851742], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.937999999999994, 7, 44, 17.0, 20.0, 21.0, 25.970000000000027, 0.2226580382223695, 0.34979708268428517, 0.13285552866588649], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.7580000000000044, 5, 24, 8.0, 9.0, 10.0, 14.0, 0.2226581373756176, 0.3445786883598779, 0.12763703773387455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2160.9340000000025, 1585, 3344, 2106.0, 2734.9, 2956.95, 3277.98, 0.2223963833010562, 0.33961274270673303, 0.12292612592616975], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.969999999999992, 9, 101, 12.0, 16.900000000000034, 22.94999999999999, 42.99000000000001, 0.22150081866702578, 0.13015552500013292, 1.7862829692893545], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.547999999999996, 10, 33, 14.0, 17.0, 18.0, 26.0, 0.22266101285822817, 0.4030751427201428, 0.18613069043617514], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.198000000000004, 6, 39, 10.0, 12.0, 13.949999999999989, 20.0, 0.22266012045912517, 0.37691748633423516, 0.16003696157999622], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.026123046875, 2131.011962890625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.7941277472527473, 3002.268936420722], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6919999999999984, 2, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.22165812691789694, 0.18637465554327076, 0.09416141133719254], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 688.4740000000007, 522, 941, 666.0, 836.0, 851.0, 894.96, 0.22160360345187502, 0.1950760939683488, 0.10301105004208252], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7080000000000015, 2, 13, 3.0, 5.0, 6.0, 11.0, 0.22167129516330966, 0.20082683323823633, 0.10867088883982563], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 936.9699999999997, 728, 1289, 899.0, 1141.8000000000002, 1161.0, 1247.7900000000002, 0.22159270197731598, 0.2096279944652791, 0.11750472380242441], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.056640625, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.507999999999978, 20, 593, 27.0, 34.0, 42.0, 75.96000000000004, 0.2214435283571725, 0.13012186078886157, 10.129311394775351], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.47800000000001, 24, 237, 35.0, 42.0, 49.94999999999999, 107.84000000000015, 0.22157070587109196, 50.14041645349718, 0.06880809029981175], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.5302467770475228, 0.41669299797775533], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.997999999999997, 2, 14, 3.0, 4.0, 4.0, 8.0, 0.2226875897987706, 0.24191614125385585, 0.0959035420910721], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7919999999999994, 2, 19, 4.0, 5.0, 5.0, 8.0, 0.22268669718662082, 0.2285583190850962, 0.08242017405637626], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0339999999999976, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.22271943097858019, 0.1263041023081751, 0.08678227828169287], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.73199999999989, 88, 348, 199.5, 299.0, 310.0, 326.0, 0.2226987976491915, 0.20284511284704823, 0.07307304297864096], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.58599999999996, 80, 369, 113.0, 130.90000000000003, 143.0, 253.94000000000005, 0.2215372291098147, 0.13023966008213714, 65.53521234564948], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.34, 17, 549, 326.0, 442.0, 463.0, 495.94000000000005, 0.22268253175786928, 0.12412115555310109, 0.0937267296754313], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 501.2239999999998, 265, 994, 468.0, 797.0, 895.8499999999999, 972.99, 0.22271050262642494, 0.11977431728652196, 0.09526093764684974], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.174000000000001, 5, 274, 7.0, 10.0, 15.0, 28.0, 0.2214185221907857, 0.10415968391066738, 0.1610906240548197], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 505.60799999999995, 289, 1094, 456.0, 856.9000000000001, 916.0, 977.9300000000001, 0.22265912891295586, 0.11452811502904588, 0.09002039000973021], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.940000000000001, 2, 15, 4.0, 5.0, 6.0, 11.0, 0.22165704601201294, 0.13609179824044204, 0.11126144692399867], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.465999999999999, 3, 54, 4.0, 5.0, 6.0, 10.990000000000009, 0.2216519364178121, 0.12981140897375595, 0.10498163004163952], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 854.3339999999993, 583, 1413, 850.0, 1100.9000000000003, 1232.95, 1293.99, 0.22155627329941158, 0.20245353563378166, 0.09801268730921235], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 464.78799999999995, 245, 1085, 382.5, 835.6000000000001, 890.0, 965.95, 0.22156020034359558, 0.19618246997416167, 0.09152340307162199], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.532, 3, 44, 5.0, 6.0, 8.0, 17.980000000000018, 0.22167217965377464, 0.14785361201516414, 0.10412531095065], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1174.0780000000002, 890, 9584, 1092.0, 1414.0, 1438.6999999999998, 1612.3200000000006, 0.22158720254133932, 0.1664976810345286, 0.12291165140964916], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.96799999999993, 141, 248, 168.0, 188.0, 190.0, 212.98000000000002, 0.22277132879533287, 4.3072623223454345, 0.11269096515232657], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.00999999999993, 196, 329, 231.0, 257.0, 261.0, 305.9000000000001, 0.2227531667703954, 0.4317387086141322, 0.15966877383737324], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.064000000000002, 6, 51, 9.0, 11.0, 12.0, 18.99000000000001, 0.2225514004714529, 0.18169235429114708, 0.13779061318252064], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.863999999999997, 6, 20, 9.0, 11.0, 12.0, 18.99000000000001, 0.2225526882361765, 0.18504473615043493, 0.1412687962436667], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.97, 6, 29, 10.0, 12.0, 14.0, 24.0, 0.22254832970802105, 0.18010549444563878, 0.13626738547551678], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.795999999999996, 8, 26, 12.0, 14.0, 16.0, 20.99000000000001, 0.22254981555071288, 0.19901473788861648, 0.15517633623360252], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.267999999999995, 6, 29, 9.0, 11.0, 12.0, 22.960000000000036, 0.22253168962526107, 0.16705306165218206, 0.12321823048586233], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1981.9119999999984, 1613, 2941, 1927.5, 2437.5, 2573.0, 2652.84, 0.22236700785177904, 0.18582194559457604, 0.14201955384283546], "isController": false}]}, function(index, item){
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
