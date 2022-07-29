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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.879536268878962, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.367, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.836, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.325, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.942, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.557, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.961, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.857, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 509, 2.165496702829185, 283.96609232078197, 1, 6818, 30.0, 800.9000000000015, 1844.0, 3733.950000000008, 17.26080149454087, 115.00911868343154, 142.97408806395933], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 49.70600000000001, 20, 113, 41.0, 85.0, 92.94999999999999, 103.99000000000001, 0.37374151887058304, 0.217016078780601, 0.18833068724337973], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 12.658, 4, 67, 10.0, 23.0, 26.94999999999999, 44.960000000000036, 0.37350532506541945, 3.9930498654353688, 0.13495797878340351], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 12.772000000000006, 5, 59, 10.0, 22.900000000000034, 26.94999999999999, 33.99000000000001, 0.3734905379907105, 4.0104983579955364, 0.157566320714831], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 54.18399999999998, 10, 271, 46.0, 104.0, 126.89999999999998, 159.91000000000008, 0.371156672654661, 0.20026729659686446, 4.132017644788218], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 65.77599999999998, 27, 163, 55.0, 109.90000000000003, 124.0, 139.0, 0.37339263804139133, 1.5529436280266273, 0.15533717168518818], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.602000000000001, 1, 22, 4.0, 12.0, 15.0, 17.0, 0.37340713849894813, 0.23333716153443448, 0.15789579196293413], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 60.88599999999999, 24, 150, 52.0, 105.0, 115.0, 138.97000000000003, 0.37337311997299766, 1.5324224616041753, 0.13563945374019054], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1165.6559999999997, 577, 2613, 909.5, 2075.2000000000003, 2228.35, 2411.78, 0.373244909126062, 1.5784673005733787, 0.1815194968210731], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.83000000000001, 9, 108, 19.0, 40.0, 44.94999999999999, 58.98000000000002, 0.37336559212049253, 0.5552026570095656, 0.1906935592568531], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 8.388, 2, 44, 6.0, 20.0, 24.0, 32.0, 0.3715847644301227, 0.35845809717573285, 0.20321041804772338], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 39.93600000000001, 15, 101, 30.0, 71.90000000000003, 76.0, 88.99000000000001, 0.3733438466960563, 0.6082952545943694, 0.24391311859341958], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.41675567626953125, 1155.0683975219727], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.552000000000001, 2, 38, 6.0, 18.0, 20.0, 32.0, 0.3715916683202496, 0.3733639863945426, 0.21809237564499023], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 40.715999999999994, 16, 156, 31.0, 71.0, 76.94999999999999, 102.97000000000003, 0.373317365305228, 0.5865472030876332, 0.222021753389535], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.43600000000001, 9, 75, 19.0, 40.0, 44.0, 61.0, 0.373305937654922, 0.5777587460448236, 0.21326559914856383], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2848.0840000000007, 1586, 6157, 2569.5, 4175.9, 4658.049999999999, 5405.860000000001, 0.3726871038336086, 0.5691368818239009, 0.20526906890835475], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 54.079999999999956, 12, 967, 41.0, 108.90000000000003, 126.84999999999997, 173.8900000000001, 0.37113986702800844, 0.2003669610640877, 2.992315177913318], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 45.745999999999995, 18, 125, 39.0, 76.0, 85.0, 99.98000000000002, 0.37335945853917885, 0.6758790643443957, 0.31137595468013546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 39.82599999999999, 15, 94, 32.0, 69.0, 76.94999999999999, 89.97000000000003, 0.3733563918240924, 0.6320785163358356, 0.267620694920785], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.903371710526316, 1435.608552631579], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 966.0, 966, 966, 966.0, 966.0, 966.0, 966.0, 1.0351966873706004, 0.4741281702898551, 1979.7550304089027], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 6.452000000000003, 1, 41, 4.0, 16.0, 20.0, 31.99000000000001, 0.3713923871988472, 0.31206390409534385, 0.15704385122763753], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 577.0400000000004, 316, 1334, 463.0, 1088.2000000000003, 1183.55, 1294.99, 0.37131460967036917, 0.3268656400869767, 0.17187805174194823], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 8.605999999999995, 2, 38, 6.0, 20.0, 24.0, 31.99000000000001, 0.3714332196500059, 0.33650616425928415, 0.18136387678222946], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1648.5360000000007, 922, 3624, 1299.0, 2996.7000000000003, 3251.8, 3539.7000000000003, 0.37117210211093, 0.35115200685332165, 0.19609776097852843], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.682477678571428, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 87.62200000000009, 29, 955, 76.0, 148.90000000000003, 164.0, 211.95000000000005, 0.3708937426516677, 0.20021307845515338, 16.964766717108215], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 107.77999999999993, 9, 313, 90.0, 200.0, 222.79999999999995, 275.9200000000001, 0.3712845554535761, 82.75307503670149, 0.114576093284502], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 1.1375576193058567, 0.8897098698481561], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.465999999999996, 1, 36, 4.0, 16.0, 19.94999999999999, 26.980000000000018, 0.373531833129883, 0.405870059761358, 0.1601371823672057], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 8.221999999999994, 2, 39, 6.0, 18.0, 24.0, 32.0, 0.3735284845351737, 0.38320812502894847, 0.13751976432593796], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.077999999999998, 1, 26, 3.0, 11.900000000000034, 14.0, 19.99000000000001, 0.37351146344032443, 0.2118393609368265, 0.14480864354082892], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 195.63, 89, 473, 143.0, 373.0, 395.9, 442.94000000000005, 0.3734888640560293, 0.3402344952167281, 0.12182156308077517], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 296.85599999999977, 28, 871, 260.0, 489.90000000000003, 520.9, 627.99, 0.3711833994905879, 0.19920514090864214, 109.80286426454093], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.730000000000005, 1, 34, 4.0, 12.0, 16.0, 20.0, 0.37352625217205515, 0.20824234467284328, 0.15648707244317545], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 7.730000000000005, 1, 29, 5.0, 17.0, 20.0, 27.99000000000001, 0.37355332137464636, 0.20094031425733488, 0.15905200011654863], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 42.11800000000002, 8, 376, 29.5, 98.0, 124.0, 172.98000000000002, 0.37080902371175384, 0.1566711579364626, 0.26905381310335263], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 8.889999999999997, 3, 71, 7.0, 18.0, 20.0, 28.0, 0.3735340655597109, 0.19215409438159942, 0.15028909669003992], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 7.9840000000000035, 2, 42, 5.0, 17.0, 20.94999999999999, 26.0, 0.37138935271292495, 0.2280867399331202, 0.18569467635646247], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 9.239999999999995, 2, 40, 7.0, 19.900000000000034, 22.0, 35.940000000000055, 0.3713819046395256, 0.21754347884014458, 0.17517330072352622], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 796.2019999999998, 386, 1830, 629.0, 1484.8000000000004, 1605.5, 1754.8700000000001, 0.3711225119946796, 0.33914508867601306, 0.16345337198203175], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.47199999999997, 7, 250, 26.0, 52.0, 60.0, 87.0, 0.37134466875312855, 0.3287894400530874, 0.1526719780713546], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 21.431999999999984, 8, 71, 16.0, 37.0, 42.0, 53.98000000000002, 0.37159470611317885, 0.24764029232983936, 0.17382213303536392], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 809.6900000000004, 462, 5819, 779.5, 969.6000000000001, 1049.0, 1222.7600000000002, 0.3714177684774768, 0.27912045301082383, 0.20529536812329288], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 255.81600000000006, 143, 640, 193.5, 485.80000000000007, 520.0, 591.8500000000001, 0.3735748120918695, 7.223012080008517, 0.1882466826556686], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 434.13799999999986, 222, 1047, 375.0, 727.8000000000001, 787.95, 897.9100000000001, 0.37349472289306024, 0.7239684565965517, 0.26699036831808604], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 39.263999999999974, 15, 115, 30.0, 71.90000000000003, 77.94999999999999, 91.96000000000004, 0.3733385501173403, 0.30458446439358244, 0.23041988640054595], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 37.865999999999985, 15, 107, 30.0, 69.0, 73.94999999999999, 82.98000000000002, 0.37335890095087043, 0.3104770948047856, 0.2362661795079727], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 38.38600000000002, 15, 114, 29.0, 70.0, 79.0, 93.99000000000001, 0.3733307449068353, 0.3021740507599147, 0.22786300348317584], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 42.40599999999999, 16, 98, 35.0, 73.0, 80.0, 91.97000000000003, 0.3733310236587336, 0.3339139758522027, 0.25958172738771323], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 42.42200000000002, 15, 131, 31.5, 76.0, 80.0, 91.99000000000001, 0.3730260394557102, 0.28002817069335845, 0.2058200315356214], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3207.105999999999, 1725, 6818, 2846.5, 4958.1, 5388.499999999999, 6311.77, 0.3725626948502894, 0.31135471899086176, 0.2372176533617077], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 509, "No results for path: $['rows'][1]", 500, "500", 9, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
