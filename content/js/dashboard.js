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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8776430546692193, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.382, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.801, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.317, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.933, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.513, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.947, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.861, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 287.1492873856629, 1, 6932, 24.0, 820.9000000000015, 1902.9000000000015, 3642.9900000000016, 17.131524629163167, 115.39072456149894, 141.90326629818037], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 32.804, 13, 81, 29.0, 52.0, 59.94999999999999, 69.99000000000001, 0.37140259446996393, 0.2157000360910471, 0.18715208861963026], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.833999999999996, 4, 108, 12.0, 25.0, 34.0, 67.99000000000001, 0.3710897346931051, 3.9654504092377594, 0.1340851580434071], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.322000000000003, 5, 44, 15.0, 28.0, 31.0, 37.99000000000001, 0.3710795446111828, 3.9846514252701457, 0.15654918288284275], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 69.16800000000009, 15, 450, 62.5, 124.0, 138.84999999999997, 160.0, 0.3680034268479108, 0.19863200591123906, 4.096913150455257], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 72.14000000000003, 28, 167, 61.0, 118.90000000000003, 132.0, 152.99, 0.3709564816113162, 1.5427696072294226, 0.15432369254533274], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.601999999999999, 1, 81, 6.0, 14.0, 16.0, 21.0, 0.37098951064257607, 0.23176337876285386, 0.15687349424632366], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.833999999999996, 26, 148, 55.0, 104.90000000000003, 116.94999999999999, 140.99, 0.37094987651078615, 1.522455815928365, 0.134759134826184], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1165.7620000000009, 574, 2530, 926.5, 2210.0, 2354.95, 2465.98, 0.3708343253151536, 1.568335860337489, 0.18034716211615867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 17.041999999999994, 5, 64, 15.0, 28.0, 32.0, 44.0, 0.370657286566268, 0.5511753484641816, 0.18931031335367007], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.215999999999996, 2, 73, 8.0, 24.0, 28.0, 36.99000000000001, 0.3688107108531403, 0.3557402609538625, 0.2016933574978111], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 24.357999999999993, 8, 71, 20.0, 41.0, 45.0, 56.97000000000003, 0.3709330896055646, 0.6044724179254899, 0.24233812201769797], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.5179099666262136, 1435.4248046875], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.93, 2, 62, 9.0, 20.0, 24.0, 36.960000000000036, 0.3688297548241088, 0.37052622762217674, 0.21647136977469666], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.961999999999996, 9, 82, 21.0, 41.0, 47.94999999999999, 64.99000000000001, 0.370919055818125, 0.5827160100441171, 0.22059541503245914], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 16.994000000000007, 5, 56, 14.0, 30.0, 35.0, 44.0, 0.3709124520502928, 0.5740123748912299, 0.21189822700138794], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2825.0240000000017, 1490, 5934, 2529.0, 4169.900000000001, 4985.0, 5638.66, 0.37026614730668406, 0.5654188253954442, 0.20393565144625955], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 66.25199999999992, 13, 229, 57.0, 131.0, 144.0, 187.8800000000001, 0.36796226179043073, 0.19860978683026267, 2.966695735685348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 30.444, 12, 90, 27.0, 48.0, 55.94999999999999, 66.0, 0.37094850047778166, 0.6715145945514343, 0.30936525332814996], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.515999999999977, 8, 63, 21.0, 41.0, 44.94999999999999, 56.0, 0.37094409724076943, 0.6280366121360297, 0.26589156970187966], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 3.63922119140625, 1065.49072265625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.4438060198643411, 1853.1427900920542], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.809999999999995, 1, 39, 7.0, 20.0, 20.94999999999999, 25.0, 0.3687835085915494, 0.3099762242967114, 0.15594068283216883], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 616.1400000000007, 320, 1358, 480.5, 1192.4, 1248.85, 1317.91, 0.36862826051696423, 0.3246052624909686, 0.1706345659033604], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 11.080000000000009, 2, 62, 8.0, 23.900000000000034, 27.94999999999999, 40.0, 0.3687242215678596, 0.3340519019440616, 0.18004112381243145], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1761.8459999999995, 936, 3723, 1360.0, 3344.6000000000004, 3516.75, 3639.9300000000003, 0.36847422928087836, 0.34857877992839814, 0.1946724199618703], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 99.10999999999991, 29, 1268, 88.0, 167.0, 181.95, 207.98000000000002, 0.36762489320496855, 0.19842769015949036, 16.815248777279603], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 114.18799999999999, 29, 358, 96.5, 211.0, 231.0, 267.95000000000005, 0.36823867758126105, 83.33079809634413, 0.11363615440984227], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.8513215300324676, 0.6658380681818182], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.12600000000001, 1, 41, 7.0, 20.0, 22.0, 31.960000000000036, 0.3711090147575211, 0.40325850762777465, 0.1590984936313982], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.39, 2, 71, 10.0, 23.0, 26.94999999999999, 40.0, 0.3711062603399482, 0.38078619023612004, 0.13662798842593793], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.420000000000003, 1, 28, 5.0, 12.0, 14.949999999999989, 17.99000000000001, 0.37109662020042183, 0.210448748356042, 0.14387242013629636], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.47400000000007, 87, 460, 143.0, 367.0, 394.0, 423.99, 0.37107100740583515, 0.3379898821459927, 0.12103292624370014], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 329.02600000000024, 117, 1021, 296.0, 512.9000000000001, 541.95, 729.2600000000007, 0.3680857846006159, 0.1986764589908266, 108.88653290981384], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.200000000000005, 1, 32, 6.0, 14.900000000000034, 16.0, 20.99000000000001, 0.37110378139909095, 0.20682874910378435, 0.15547218966817383], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.334000000000003, 1, 32, 8.0, 20.0, 24.0, 32.0, 0.37114014251781474, 0.19960018348240796, 0.1580245138064133], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 61.42399999999997, 7, 469, 48.0, 129.80000000000007, 147.0, 173.96000000000004, 0.3675057312518789, 0.15529629391601613, 0.2666569905470176], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.558000000000002, 2, 114, 10.0, 20.0, 24.0, 35.960000000000036, 0.3711095656459422, 0.1908858587122795, 0.14931361430285955], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.903999999999987, 2, 36, 9.0, 22.0, 24.94999999999999, 31.99000000000001, 0.36878051658774763, 0.22642187361707308, 0.18439025829387382], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 12.638000000000003, 2, 44, 11.0, 24.900000000000034, 28.0, 39.99000000000001, 0.3687712688829328, 0.21597247818533558, 0.17394191686568022], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 856.0219999999994, 384, 1745, 643.0, 1599.8000000000002, 1652.95, 1728.0, 0.3684142272732632, 0.33664929355650886, 0.16226056298851727], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 34.53199999999998, 7, 683, 30.0, 59.0, 65.0, 101.93000000000006, 0.3683328078451941, 0.32614359394659764, 0.15143370322541672], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 14.888000000000005, 4, 111, 12.0, 27.900000000000034, 29.0, 48.940000000000055, 0.36884553560429073, 0.2459126324339896, 0.1725361440961477], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 827.2320000000005, 477, 6179, 805.0, 1003.8000000000001, 1051.85, 1303.1300000000008, 0.36870953873699286, 0.2771478701770027, 0.20379843645033005], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 260.7499999999997, 144, 598, 195.0, 505.80000000000007, 537.9, 571.94, 0.3712511982132422, 7.178022275953614, 0.1870757990996416], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 390.49200000000025, 200, 809, 295.5, 695.8000000000001, 724.0, 763.96, 0.37108587892061506, 0.7192361862817714, 0.26526842125965844], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 24.418, 8, 80, 21.0, 40.0, 44.0, 63.92000000000007, 0.370621844154997, 0.3024730286902076, 0.22874316943941223], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 23.855999999999987, 9, 79, 20.0, 42.0, 45.94999999999999, 55.98000000000002, 0.37063722917537667, 0.3082767914657813, 0.23454387158754303], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.851999999999997, 8, 68, 21.0, 45.0, 49.0, 59.99000000000001, 0.37060508692542316, 0.2999259195175463, 0.22619939387538035], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 28.474000000000004, 11, 108, 26.0, 47.0, 52.0, 64.98000000000002, 0.37061140504713436, 0.3314185251129994, 0.2576907425718356], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 26.12199999999999, 9, 92, 23.0, 44.0, 49.94999999999999, 58.99000000000001, 0.37039286830755647, 0.27805146659834157, 0.20436715878297795], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3211.0639999999976, 1670, 6932, 2802.0, 4921.700000000001, 5561.65, 6420.72, 0.36994945010713737, 0.3091498476085727, 0.23555375143540386], "isController": false}]}, function(index, item){
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
