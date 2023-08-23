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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8879387364390555, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.158, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.567, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.916, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.1, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.75988087640997, 1, 18115, 9.0, 845.0, 1516.9500000000007, 6052.920000000013, 15.180195802244771, 95.62397696749998, 125.61741570446314], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6196.921999999998, 5175, 18115, 6044.0, 6527.9, 6707.0, 15754.220000000076, 0.3274407103105841, 0.19016822737188227, 0.16499942042994276], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4440000000000044, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3285332436218556, 0.16866524560981028, 0.1187083009180533], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.716000000000001, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.3285310849541962, 0.1885556679086237, 0.13859905146505153], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.074, 8, 352, 11.0, 16.0, 18.0, 33.97000000000003, 0.3264027156705944, 0.16980272525867415, 3.5913861303326047], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.98599999999999, 24, 64, 34.0, 41.0, 42.0, 46.99000000000001, 0.3284738905958582, 1.366088908808093, 0.13665027089241757], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.389999999999999, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.32848727013282053, 0.2052115152115885, 0.13890135543702276], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.128000000000004, 22, 63, 30.0, 35.0, 37.0, 41.98000000000002, 0.3284717327080983, 1.3481166364938006, 0.11932762164786385], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 863.6799999999997, 674, 1123, 862.0, 1013.8000000000001, 1061.95, 1086.99, 0.3283317463965591, 1.3885835717158619, 0.1596769626030141], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.7180000000000035, 3, 31, 5.0, 7.0, 8.0, 12.990000000000009, 0.3284262078859074, 0.4883768271581543, 0.16774111984797807], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9780000000000015, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.32662297322279543, 0.315047633673718, 0.17862193848121624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.031999999999996, 5, 19, 8.0, 10.0, 10.0, 15.0, 0.3284717327080983, 0.5352774073118465, 0.21459725506027127], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.9743630349099099, 2663.941529420045], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.328000000000002, 2, 25, 4.0, 5.0, 7.0, 12.990000000000009, 0.3266253202561265, 0.32812766914128894, 0.19170099362688675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.361999999999998, 6, 32, 8.0, 10.0, 11.0, 16.980000000000018, 0.328470869560933, 0.5160296607142271, 0.19535035113535956], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.7840000000000025, 5, 14, 7.0, 8.0, 9.0, 11.990000000000009, 0.32847022220353594, 0.5083301228790678, 0.1876514453018247], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1580.4319999999998, 1357, 1926, 1556.0, 1785.2000000000003, 1841.85, 1906.96, 0.32812834280749237, 0.5010718466127967, 0.18072693881193913], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.808000000000002, 8, 80, 11.0, 15.0, 18.0, 34.99000000000001, 0.3263880139876847, 0.1697950770814253, 2.631503362775708], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.340000000000003, 8, 46, 11.0, 14.0, 15.0, 20.99000000000001, 0.3284745379677149, 0.5946255232188796, 0.2739426322504185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.976000000000015, 6, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.3284738905958582, 0.5561313172509231, 0.23544905829820303], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.89961674528302, 2573.260613207547], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 1.0128104530567685, 4175.640522652839], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4139999999999997, 1, 28, 2.0, 3.0, 4.0, 6.990000000000009, 0.326618065898461, 0.27453460497994564, 0.1381109595058922], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.7540000000001, 429, 712, 556.0, 662.9000000000001, 673.95, 696.9300000000001, 0.3265169651684762, 0.2875230592402995, 0.1511416420799392], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4599999999999995, 2, 23, 3.0, 4.0, 5.0, 9.0, 0.32663001442398143, 0.2959159479309295, 0.15948731173045969], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 774.8759999999996, 629, 963, 757.0, 903.0, 920.95, 957.95, 0.3264837051982736, 0.3088554981080269, 0.17248797315650977], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.151075487012987, 855.1516842532468], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.686, 17, 635, 22.0, 27.0, 35.0, 71.97000000000003, 0.3262549068737994, 0.1697258314850993, 14.882194043042157], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.69599999999999, 20, 230, 29.0, 36.0, 40.0, 103.98000000000002, 0.3265318917168002, 73.85191884323302, 0.10076570095948131], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 1.1017102153361344, 0.8616727941176471], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.795999999999999, 1, 13, 3.0, 4.0, 4.0, 6.990000000000009, 0.3284842488517833, 0.35694112162096464, 0.1408247902792313], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.476, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.3284831698363103, 0.33705131970577107, 0.12093569826981346], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.89, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.32853432296632323, 0.186311686220482, 0.12737121700940462], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.23200000000003, 66, 119, 91.0, 111.0, 114.0, 118.0, 0.32851727015289195, 0.299229827191703, 0.1071530939756503], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.23200000000001, 58, 355, 80.0, 93.0, 96.94999999999999, 305.6500000000003, 0.32646089618739377, 0.16983299219529935, 96.5323190982236], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.84200000000007, 12, 363, 261.0, 334.0, 337.0, 343.0, 0.32847885384530484, 0.18307242839653706, 0.13761467607386307], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 437.29600000000005, 348, 554, 421.5, 512.0, 521.0, 545.96, 0.32844087801443034, 0.17663640227668648, 0.13984396759208167], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.491999999999998, 4, 267, 6.0, 8.0, 12.0, 30.0, 0.3262021200528186, 0.14708084067342472, 0.23668767109301198], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 412.576, 312, 514, 411.0, 474.0, 481.0, 497.99, 0.3284193047494686, 0.168927472660735, 0.13213745464529403], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.690000000000004, 2, 23, 3.0, 5.0, 5.0, 9.0, 0.3266135854267631, 0.20053244852896507, 0.16330679271338155], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.296000000000005, 2, 52, 4.0, 5.0, 5.0, 9.0, 0.3266029181317529, 0.19127640237577495, 0.1540519623609733], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.8060000000003, 546, 889, 677.0, 778.0, 837.0, 860.94, 0.3264521571305639, 0.2983052226060937, 0.14377922154871517], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.84399999999994, 176, 325, 239.5, 293.0, 298.0, 311.99, 0.32653530369089384, 0.28913361836872103, 0.13424937778697882], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.6119999999999965, 3, 67, 4.0, 5.0, 6.0, 12.970000000000027, 0.32662788069459375, 0.2177657426064513, 0.15278784653585], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 990.6780000000001, 830, 9073, 933.0, 1087.6000000000001, 1118.0, 1176.8700000000001, 0.3264626014237687, 0.24539211810731348, 0.1804471019588409], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.16, 116, 160, 131.0, 151.0, 152.0, 155.0, 0.32851964448918153, 6.351821455609769, 0.1655431021058766], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.10000000000014, 159, 227, 180.5, 204.90000000000003, 206.0, 216.0, 0.32849503939641006, 0.636686903945751, 0.2348226258185275], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.383999999999998, 5, 24, 7.0, 9.0, 10.0, 15.990000000000009, 0.32842189339162603, 0.26803267629523025, 0.20269788732764418], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.189999999999993, 5, 30, 7.0, 9.0, 10.0, 13.0, 0.32842383490002447, 0.27316588322529284, 0.20783070802267176], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.621999999999998, 6, 22, 9.0, 10.0, 11.0, 17.0, 0.3284175790107012, 0.265784113185506, 0.20045018250164864], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.102000000000007, 7, 29, 10.0, 12.0, 13.949999999999989, 18.99000000000001, 0.3284197361869943, 0.29368870764042243, 0.22835434781751948], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.034000000000006, 6, 27, 8.0, 9.0, 11.0, 17.99000000000001, 0.3284059307483846, 0.2465321513921784, 0.18120053796175514], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.6319999999998, 1420, 1958, 1588.0, 1828.6000000000001, 1878.0, 1945.99, 0.32809044797469766, 0.27417019261369974, 0.2089013399213895], "isController": false}]}, function(index, item){
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
