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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8899383109976601, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.175, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.566, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.97, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.125, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.6070197830236, 1, 18588, 9.0, 843.0, 1506.0, 6031.960000000006, 15.168538238203809, 95.55054295848771, 125.52094836719608], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6193.763999999999, 4948, 18588, 6012.5, 6574.9, 6754.25, 16344.820000000082, 0.32723198391589353, 0.1900470050338096, 0.16489424189511823], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3699999999999988, 1, 10, 2.0, 3.0, 4.0, 5.0, 0.32825953511884637, 0.16852472676496946, 0.11860940233786442], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7020000000000004, 2, 18, 4.0, 5.0, 5.0, 7.0, 0.3282560870167496, 0.18839783681700575, 0.13848303671019124], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.306, 8, 380, 11.0, 14.0, 17.0, 29.99000000000001, 0.3261412661325777, 0.16966671277488818, 3.588509419448978], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.702, 24, 57, 34.0, 40.0, 42.0, 44.0, 0.3281796008810966, 1.3648649883479833, 0.13652784177279995], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2439999999999998, 1, 12, 2.0, 3.0, 3.9499999999999886, 5.0, 0.32818778642589064, 0.205024422709479, 0.13877471828360413], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.814000000000007, 22, 54, 29.5, 35.0, 37.0, 41.99000000000001, 0.3281800316890639, 1.346919434550728, 0.11922165213704272], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.9319999999996, 677, 1137, 857.5, 1005.6000000000001, 1057.0, 1082.99, 0.32803383734638997, 1.38732365208436, 0.1595320810532248], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.587999999999999, 3, 15, 5.0, 7.900000000000034, 8.0, 11.990000000000009, 0.328129634831092, 0.48793581665395713, 0.16758964747720811], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.95, 2, 27, 4.0, 5.0, 5.0, 10.0, 0.3263724614749946, 0.3148059999252607, 0.17848493986913772], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.821999999999992, 5, 15, 8.0, 10.0, 11.0, 13.990000000000009, 0.3281806779031355, 0.5348031045153724, 0.21440710304413835], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.8810940682281059, 2408.94101642057], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.096000000000008, 2, 13, 4.0, 5.0, 6.0, 11.990000000000009, 0.3263743788279635, 0.3278755734805804, 0.19155371257383405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.152000000000001, 6, 19, 8.0, 10.0, 11.0, 15.0, 0.3281785238661268, 0.5155703839147235, 0.1951764853852258], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.623999999999995, 5, 15, 6.0, 8.0, 9.0, 12.0, 0.3281768006568787, 0.5078760329775022, 0.18748381678151763], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1574.3479999999997, 1351, 2167, 1551.5, 1762.8000000000002, 1841.0, 1933.99, 0.3278357464229842, 0.500625034217856, 0.18056578220953426], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.697999999999995, 7, 65, 10.0, 13.0, 16.0, 33.97000000000003, 0.3261333950812561, 0.169662618060289, 2.6294504978426274], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.141999999999996, 8, 36, 11.0, 13.0, 14.0, 19.99000000000001, 0.3281832627848713, 0.5940982383368592, 0.27369971329910164], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.883999999999996, 6, 26, 8.0, 10.0, 11.0, 14.990000000000009, 0.32818089330839156, 0.5556352505250894, 0.23523903875816352], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.275082236842104, 2392.6809210526317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.8181079144620812, 3372.9159777336863], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.367999999999998, 1, 17, 2.0, 3.0, 4.0, 6.0, 0.32635435425242987, 0.27431294555528213, 0.13799944862431848], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.7419999999998, 460, 706, 560.5, 656.8000000000001, 668.0, 685.98, 0.3262551197584668, 0.2872924844115304, 0.15102043629444656], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3700000000000023, 2, 22, 3.0, 4.0, 5.0, 9.0, 0.32637139628863504, 0.29568164848723594, 0.15936103334406007], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 770.708, 608, 951, 750.0, 893.0, 908.95, 936.98, 0.3262378770004907, 0.3086229431925247, 0.1723580971262358], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.309347587719298, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.798000000000027, 15, 825, 20.0, 25.0, 28.94999999999999, 58.930000000000064, 0.3259605405208067, 0.1695726948641005, 14.868766452858281], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.18199999999999, 20, 254, 28.0, 34.0, 39.0, 121.96000000000004, 0.326262996686473, 73.79110268879045, 0.10068272163371628], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.9988839285714285, 0.78125], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.737999999999999, 1, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.32821342274742205, 0.3566468336184414, 0.14070868416613114], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.418000000000001, 2, 14, 3.0, 4.0, 5.0, 8.0, 0.328212345510449, 0.33677343120242564, 0.12083599048578053], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8280000000000003, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.32826018164605414, 0.18615622078484384, 0.1272649337045737], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.48800000000008, 65, 124, 92.0, 112.0, 115.0, 117.99000000000001, 0.3282433727663039, 0.29898034786412037, 0.10706375635150926], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.55599999999991, 57, 365, 80.0, 92.0, 103.0, 302.94000000000005, 0.326202758501007, 0.16969870261823383, 96.4559894985546], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.59400000000002, 12, 364, 263.0, 336.0, 340.0, 346.97, 0.3282080366332682, 0.18292149276071534, 0.137501218472336], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 428.9780000000002, 334, 526, 420.5, 492.0, 503.0, 521.99, 0.3281718465310923, 0.1764917164093143, 0.13972941903081665], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.173999999999986, 4, 272, 6.0, 8.0, 10.0, 25.980000000000018, 0.3259057245992337, 0.14694719932100803, 0.23647261071995182], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.6320000000004, 301, 516, 401.5, 460.90000000000003, 471.0, 488.9200000000001, 0.32814987786261546, 0.16878888883693183, 0.13202905242128668], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.575999999999999, 2, 16, 3.0, 5.0, 5.0, 10.0, 0.32635201111163326, 0.2003718485410107, 0.16317600555581663], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.225999999999997, 2, 38, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.32634476888916153, 0.1911252161626163, 0.15393019860689944], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.9220000000007, 544, 865, 678.0, 786.5000000000002, 824.95, 844.98, 0.32619360764910965, 0.298068965442723, 0.14366534868139494], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.03799999999998, 167, 320, 239.0, 289.0, 295.0, 313.95000000000005, 0.326270873994841, 0.2888994767186155, 0.13414066206233208], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.575999999999992, 3, 39, 4.0, 5.900000000000034, 6.0, 9.990000000000009, 0.3263754440337916, 0.21759744081670884, 0.15266976337127555], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.0939999999999, 806, 8801, 939.0, 1086.9, 1110.0, 1133.0, 0.3262087174712822, 0.24520128117658266, 0.18030677157104075], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.57799999999997, 117, 170, 133.5, 150.0, 152.0, 160.0, 0.32825824207207105, 6.346767324115951, 0.16541137979412956], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.246, 158, 243, 177.5, 203.0, 206.0, 218.95000000000005, 0.3282345380197348, 0.636182001907371, 0.2346364080375448], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.263999999999999, 5, 21, 7.0, 9.0, 10.0, 15.990000000000009, 0.32812403613564384, 0.26778958812394427, 0.20251405355246768], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.132000000000001, 5, 22, 7.0, 9.0, 10.0, 14.0, 0.3281264047911705, 0.2729184963131717, 0.20764249053191258], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.534000000000002, 6, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.3281205908795601, 0.26554376451933615, 0.20026891533176275], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.981999999999989, 7, 21, 10.0, 12.0, 13.0, 17.99000000000001, 0.328121882842113, 0.2934223528685071, 0.22814724666365668], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.079999999999993, 5, 39, 8.0, 9.0, 10.0, 18.950000000000045, 0.3280900174018945, 0.2462949973408304, 0.18102623030475626], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.431999999998, 1413, 1976, 1589.5, 1808.0, 1871.9, 1950.96, 0.32779211686182314, 0.2739208909373347, 0.20871138690811397], "isController": false}]}, function(index, item){
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
