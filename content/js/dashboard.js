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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8942352690916826, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.218, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.696, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.99, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.13, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 320.93324824505305, 1, 15850, 9.0, 826.0, 1494.0, 6030.980000000003, 15.468934785656042, 97.44281845406736, 128.00675543247206], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6134.026000000001, 5260, 15850, 6019.0, 6479.7, 6749.5, 12704.96000000005, 0.333555703802535, 0.1937196412191461, 0.16808080386924618], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.367999999999998, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.33475402943425225, 0.17185892657605545, 0.1209560457916732], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.738, 2, 11, 4.0, 5.0, 5.949999999999989, 9.0, 0.33475246059796165, 0.192126336541043, 0.14122369431476506], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.507999999999997, 8, 395, 11.0, 15.0, 19.94999999999999, 62.8900000000001, 0.332761427360177, 0.1731106835635155, 3.661350587956166], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.48000000000006, 24, 50, 34.0, 40.0, 41.0, 43.0, 0.33470092129775597, 1.3919864849023107, 0.13924081296176175], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2899999999999974, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.33470965945300407, 0.20909874633660278, 0.14153250248354565], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.450000000000003, 21, 43, 30.0, 34.900000000000034, 36.0, 38.0, 0.3347006972484925, 1.3736816087238397, 0.12159048767230392], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 845.9919999999996, 665, 1088, 845.0, 1000.8000000000001, 1052.85, 1077.0, 0.3345372212803141, 1.4148278218465518, 0.16269485956796523], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.541999999999996, 3, 24, 5.0, 7.0, 8.0, 12.980000000000018, 0.33466395722726894, 0.497652494442905, 0.17092700159166177], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.829999999999997, 2, 24, 4.0, 5.0, 5.0, 10.0, 0.3329750521771907, 0.32117459842376267, 0.18209573165940116], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.421999999999998, 5, 17, 7.0, 9.0, 10.0, 13.0, 0.33470092129775597, 0.5454284906042757, 0.2186669104962878], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.8739741161616161, 2389.4748263888887], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.8719999999999994, 2, 17, 4.0, 5.0, 6.0, 9.0, 0.33297993063362086, 0.3345115082442501, 0.1954306038191466], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.7119999999999935, 5, 21, 7.0, 9.0, 10.0, 14.0, 0.3346991289120471, 0.5258142926485345, 0.19905446240960614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.550000000000001, 4, 19, 6.0, 8.0, 9.0, 12.0, 0.3346977846353635, 0.5179677014545966, 0.19120918360516373], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1546.9640000000015, 1306, 1939, 1535.0, 1746.2000000000003, 1827.95, 1873.0, 0.3343506509138472, 0.5105736878325118, 0.1841540694486424], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.434000000000017, 7, 72, 10.0, 14.0, 17.0, 33.98000000000002, 0.33275323352954683, 0.17310642093117665, 2.682822945331971], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.915999999999999, 8, 29, 11.0, 13.0, 14.0, 22.0, 0.33470405801894026, 0.6059025970608298, 0.2791379546368896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.611999999999997, 5, 17, 7.0, 9.0, 10.949999999999989, 15.0, 0.3347031618068883, 0.5666779479064652, 0.23991418043579688], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.994570974576272, 2311.573093220339], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.8903400911708254, 3670.7166206813818], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2760000000000007, 1, 23, 2.0, 3.0, 3.9499999999999886, 7.0, 0.3329697303877499, 0.27987341468949245, 0.1407967707596638], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 542.58, 430, 708, 529.0, 632.9000000000001, 647.9, 685.8800000000001, 0.3328624439293213, 0.2931107366362386, 0.154078904709471], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.107999999999999, 2, 12, 3.0, 4.0, 4.0, 8.990000000000009, 0.332970395602127, 0.3016601227578606, 0.1625832009776011], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 741.9640000000002, 588, 931, 718.0, 867.9000000000001, 887.9, 907.99, 0.33282632789384176, 0.31485565634183926, 0.1758389095611019], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.457728794642858, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.70800000000001, 16, 558, 21.0, 25.0, 30.0, 51.98000000000002, 0.3326319234840134, 0.17304331246012575, 15.173083150330337], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.105999999999995, 21, 224, 28.0, 34.0, 41.94999999999999, 91.97000000000003, 0.3328890374313749, 75.28971840063296, 0.10272747639483835], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 1.211117927251732, 0.9472430715935335], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6659999999999986, 1, 7, 3.0, 3.0, 4.0, 6.0, 0.3347042820727031, 0.3637000016651538, 0.143491386552653], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.381999999999998, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.334702489650999, 0.3434328641613293, 0.123225428318776], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.782000000000001, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.3347549259187349, 0.1898393877248716, 0.12978291561497826], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.42399999999999, 67, 119, 92.0, 109.0, 112.0, 117.0, 0.33473610075288845, 0.3048942466144791, 0.10918150161275854], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.41599999999995, 59, 501, 79.0, 92.90000000000003, 101.94999999999999, 407.8000000000011, 0.33283098044018894, 0.17314686678739558, 98.41591071043439], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.23399999999998, 13, 351, 260.0, 331.0, 335.0, 342.98, 0.3346980086807276, 0.18653857474040822, 0.14022016183987512], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 411.4979999999999, 333, 520, 400.5, 477.90000000000003, 488.0, 506.0, 0.3346357356163522, 0.17996801363406378, 0.14248162180539994], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.941999999999996, 4, 288, 6.0, 8.0, 9.949999999999989, 23.950000000000045, 0.3325724076645967, 0.1499531311941611, 0.2413098622019486], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 386.6280000000002, 296, 487, 393.0, 446.0, 452.0, 472.99, 0.3346326001756152, 0.172123375818846, 0.13463733522690768], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.373999999999999, 2, 18, 3.0, 4.0, 5.0, 9.990000000000009, 0.33296773476056624, 0.20443373488409727, 0.16648386738028312], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.129999999999997, 2, 26, 4.0, 5.0, 5.949999999999989, 10.970000000000027, 0.3329626349331078, 0.19500099784739655, 0.15705171159442485], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.866000000001, 533, 862, 675.5, 787.0, 826.95, 847.97, 0.3328092696700263, 0.30411422043255887, 0.1465790826378729], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.04399999999995, 174, 319, 233.0, 278.0, 283.95, 294.0, 0.33288992395462574, 0.2947603739735339, 0.1368619706883764], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.349999999999998, 3, 49, 4.0, 5.0, 6.0, 8.990000000000009, 0.33298281342506786, 0.22200263335295714, 0.15576051526426515], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 973.9280000000008, 799, 8369, 925.5, 1087.7, 1113.85, 1133.95, 0.3328032886289769, 0.2501582219634862, 0.18395181773828218], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.36799999999994, 116, 168, 134.5, 152.0, 153.0, 157.0, 0.33472108695986896, 6.471724347268776, 0.16866804772587146], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.82400000000018, 158, 241, 176.5, 203.0, 206.0, 216.96000000000004, 0.3346933037910711, 0.6487003388351334, 0.23925341638189845], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.105999999999999, 4, 42, 7.0, 9.0, 10.0, 16.0, 0.3346583573227599, 0.27312239824043333, 0.20654695491014088], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.810000000000001, 5, 18, 7.0, 9.0, 10.0, 13.990000000000009, 0.33466104525353585, 0.27835367075477446, 0.21177769269950317], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.160000000000005, 5, 20, 8.0, 10.0, 11.0, 15.990000000000009, 0.3346532055761256, 0.2708305253837803, 0.20425610691902193], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.437999999999988, 7, 39, 9.0, 11.0, 12.0, 17.0, 0.33465544544647724, 0.29926497846659533, 0.23269011441200368], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.548000000000002, 5, 28, 7.0, 9.0, 10.0, 26.88000000000011, 0.33466552523411525, 0.25123118740499684, 0.18465431812233898], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.5779999999993, 1339, 1959, 1597.0, 1827.0, 1879.95, 1940.98, 0.3343023644537633, 0.2793612073112596, 0.2128565836170446], "isController": false}]}, function(index, item){
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
