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

    var data = {"OkPercent": 97.82174005530739, "KoPercent": 2.1782599446926185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.900765794511806, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.989, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.759, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.622, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 512, 2.1782599446926185, 188.21106147628146, 1, 3517, 16.0, 536.0, 1186.9000000000015, 2260.0, 26.17226819643509, 174.85711441626546, 216.84036583135506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.957999999999995, 16, 79, 26.0, 29.0, 31.0, 38.99000000000001, 0.5672979936939155, 0.3294704978805747, 0.28697300852875807], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.351999999999998, 4, 33, 7.0, 10.0, 12.0, 20.99000000000001, 0.5672625949313953, 6.062314301271462, 0.2060758645649209], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.008, 5, 42, 7.0, 10.0, 12.0, 24.960000000000036, 0.5672445754401251, 6.09097475591466, 0.24041420482520928], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 20.990000000000038, 10, 271, 19.0, 26.0, 31.0, 45.99000000000001, 0.5634361491618324, 0.30395289370946077, 6.273729465569543], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.98399999999998, 26, 96, 44.0, 52.900000000000034, 55.0, 65.0, 0.5670432211684039, 2.3583704120532976, 0.2370063463477313], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5060000000000002, 1, 11, 2.0, 4.0, 4.0, 7.990000000000009, 0.5670882400643305, 0.3543337893431644, 0.24090174260545288], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.9, 24, 71, 39.0, 46.0, 48.0, 57.99000000000001, 0.5670310029871193, 2.3272458538693064, 0.20709921398162368], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 779.5400000000004, 573, 1304, 785.0, 912.0, 924.0, 1023.0, 0.5667122303299852, 2.3967123571318467, 0.27671495621581305], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.111999999999995, 7, 36, 11.0, 14.0, 16.0, 26.960000000000036, 0.5666531425449979, 0.8426574927411732, 0.29052040999621476], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.438000000000001, 1, 23, 3.0, 5.0, 6.0, 11.990000000000009, 0.564345551038283, 0.5444413479901398, 0.30972871062843266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.576, 11, 69, 18.0, 22.0, 23.0, 31.99000000000001, 0.5669969234746932, 0.9239458499510681, 0.37153802309718664], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.6456245272314675, 1789.397870177761], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.366000000000002, 2, 26, 4.0, 6.0, 7.0, 10.990000000000009, 0.5643576537620646, 0.5670174096576268, 0.3323317043149658], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.441999999999997, 11, 43, 19.0, 23.0, 24.0, 35.99000000000001, 0.5669802067209834, 0.8907934551348562, 0.33830557256496174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.738000000000007, 7, 34, 11.0, 13.0, 15.0, 22.0, 0.5669763491485716, 0.8775310001406101, 0.32501476264669094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2030.503999999999, 1575, 3081, 2023.5, 2289.6000000000004, 2358.0, 2564.8500000000004, 0.5656614109179441, 0.8637992235024397, 0.31266050642534793], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.29799999999999, 11, 158, 16.0, 23.0, 27.94999999999999, 54.97000000000003, 0.5633980565020643, 0.30416122459356465, 4.543497217376999], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.852, 14, 57, 23.0, 27.0, 29.0, 33.98000000000002, 0.5670355043610701, 1.0265158914535275, 0.474006241926832], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.27799999999999, 11, 39, 18.0, 22.0, 24.0, 31.980000000000018, 0.5670316460361653, 0.959931417522412, 0.4075539955884938], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4635416666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.7145207683307332, 2983.534028861154], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2980000000000023, 1, 24, 2.0, 3.0, 4.0, 10.990000000000009, 0.5642691247734459, 0.47419325737894735, 0.23970416921528223], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 405.57999999999964, 312, 635, 408.0, 472.90000000000003, 485.95, 527.97, 0.5640749678195232, 0.49661512713685696, 0.26220672332235645], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1019999999999976, 1, 21, 3.0, 4.0, 5.0, 10.990000000000009, 0.5643347227254207, 0.5112365568414863, 0.2766562800860949], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1155.3119999999997, 933, 2045, 1134.5, 1343.9, 1379.85, 1652.7100000000003, 0.563730270849846, 0.5332282792612654, 0.29893118854635387], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 43.154, 13, 683, 42.0, 49.900000000000034, 57.89999999999998, 98.99000000000001, 0.56297240421869, 0.3029847107954462, 25.75158927109711], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.37599999999996, 10, 193, 43.0, 52.0, 59.89999999999998, 108.92000000000007, 0.563774129532744, 126.13674702679619, 0.17507829413223885], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.001580391221374, 1.5729365458015268], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3339999999999996, 1, 19, 2.0, 3.0, 4.0, 8.990000000000009, 0.5672992810048912, 0.6163806408694883, 0.24431541301089554], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.384000000000001, 2, 36, 3.0, 5.0, 6.949999999999989, 11.970000000000027, 0.5672934881515083, 0.582058630774764, 0.20996507032170078], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2440000000000038, 1, 25, 2.0, 3.0, 4.0, 10.0, 0.5672741794946268, 0.32173309636399944, 0.22103749767417585], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.81599999999995, 86, 289, 122.0, 149.0, 154.0, 166.99, 0.5672117571653026, 0.5167409891322228, 0.18611635781986488], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 165.37800000000013, 31, 621, 168.0, 193.0, 240.5499999999999, 338.7700000000002, 0.5635352141884642, 0.3028616547112671, 166.7051631659859], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.378, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.567288339047818, 0.316233333423154, 0.23877077551719678], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2319999999999993, 1, 12, 3.0, 4.0, 5.0, 9.0, 0.5673482031515058, 0.3051856849112611, 0.24267432908238237], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.665999999999995, 6, 315, 10.0, 15.0, 19.94999999999999, 39.930000000000064, 0.5627905406165934, 0.23775372180419393, 0.4094521023040645], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.814000000000007, 2, 76, 4.0, 6.0, 7.0, 10.980000000000018, 0.5673018556443697, 0.29183248427155606, 0.22935836741871982], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.662000000000001, 2, 19, 3.0, 5.0, 6.0, 10.0, 0.5642602097242347, 0.346473401902234, 0.283232175584235], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.003999999999997, 2, 35, 4.0, 5.0, 6.0, 10.990000000000009, 0.5642385600631947, 0.33051265481295494, 0.2672418961236811], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 509.9280000000005, 380, 958, 494.5, 628.0, 642.0, 781.4900000000005, 0.5637194661351168, 0.5150513185539243, 0.24937980288985148], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.941999999999991, 7, 109, 15.0, 25.0, 33.0, 48.99000000000001, 0.5638923912871859, 0.4992716448684665, 0.232936017103984], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.386000000000006, 5, 50, 9.0, 12.0, 13.0, 17.0, 0.564368482954943, 0.37620560571693984, 0.26509886748176525], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 539.1600000000004, 409, 3517, 525.0, 591.9000000000001, 620.9, 730.4600000000005, 0.5641398841256678, 0.42395112292043935, 0.3129213419759564], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.71600000000004, 141, 363, 181.0, 188.0, 191.95, 216.94000000000005, 0.5671358392419436, 10.965452929214074, 0.28689098117903], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 262.6719999999998, 24, 493, 266.0, 285.0, 291.0, 470.60000000000036, 0.5672124006243874, 1.0976590240231467, 0.4065760762288089], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.883999999999983, 12, 47, 18.0, 21.900000000000034, 23.0, 31.99000000000001, 0.566630024591743, 0.4623756335631963, 0.3508236675694972], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.477999999999994, 11, 43, 18.0, 22.0, 23.0, 30.99000000000001, 0.566640299004753, 0.4712056773958119, 0.3596837835479389], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.75200000000001, 11, 48, 18.0, 22.0, 24.0, 31.99000000000001, 0.5666081927011799, 0.458644985545825, 0.34693685236683575], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.495999999999995, 13, 37, 22.0, 25.0, 26.94999999999999, 31.0, 0.5666165399900955, 0.506759921243134, 0.39508223589153146], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.901999999999983, 11, 50, 18.0, 21.0, 22.94999999999999, 30.99000000000001, 0.5663797009515179, 0.42517748038910286, 0.3136106351948346], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2185.5180000000014, 1711, 3108, 2175.0, 2465.0, 2545.0, 2699.96, 0.5653166904099677, 0.4723452816549081, 0.36105187063292854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.65625, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1953125, 0.0042544139544777706], "isController": false}, {"data": ["500", 11, 2.1484375, 0.04679855349925548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 512, "No results for path: $['rows'][1]", 500, "500", 11, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
