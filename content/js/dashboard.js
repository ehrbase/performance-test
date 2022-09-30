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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8932567538821528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.908, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.431, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.988, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.973, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.684, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.572, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.962, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 217.39672410125516, 1, 6260, 20.0, 561.0, 1228.9500000000007, 2278.9900000000016, 22.673210596072487, 151.07042699495074, 187.8502559779432], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 33.462, 20, 149, 33.0, 41.0, 54.0, 76.98000000000002, 0.4997101681025006, 0.29024571998241017, 0.25278307331747585], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.225999999999994, 5, 59, 7.0, 13.0, 22.94999999999999, 38.950000000000045, 0.4994516021408494, 5.339981426955703, 0.18144140234023043], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.414000000000003, 5, 98, 8.0, 13.0, 19.0, 35.0, 0.499406206021041, 5.362594578171554, 0.2116623959112615], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 26.508000000000003, 14, 632, 21.0, 39.0, 53.0, 88.99000000000001, 0.4900375368753246, 0.26452838787451116, 5.4564531205590345], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 47.70399999999999, 28, 118, 48.0, 57.0, 62.0, 91.94000000000005, 0.4988197923712496, 2.07456813429426, 0.20849108509267075], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.2760000000000034, 1, 40, 3.0, 4.0, 7.0, 18.980000000000018, 0.49886060238415453, 0.3117596207137897, 0.21191832230186256], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 42.15599999999998, 25, 100, 43.0, 51.900000000000034, 59.94999999999999, 75.97000000000003, 0.49880088267804196, 2.047154811707655, 0.182179228634363], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 874.9220000000007, 589, 1796, 834.5, 1089.5000000000002, 1521.95, 1724.94, 0.49857855254668937, 2.108592893847142, 0.24344655886068817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 15.533999999999981, 9, 84, 15.0, 19.0, 29.0, 39.0, 0.4970065296717868, 0.7390875382570776, 0.25481291804461725], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.276, 2, 50, 3.0, 6.0, 10.949999999999989, 23.980000000000018, 0.4923964145662677, 0.47494615491332837, 0.27024100096312736], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.068000000000005, 15, 86, 25.0, 34.0, 45.0, 67.98000000000002, 0.49872227353520276, 0.8126893741983039, 0.32679945853722764], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1497.0, 1497, 1497, 1497.0, 1497.0, 1497.0, 1497.0, 0.6680026720106881, 0.28507535905143616, 790.1082112140948], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.501999999999999, 2, 44, 4.0, 8.0, 14.949999999999989, 29.980000000000018, 0.49241290200589316, 0.4947335901553858, 0.28996580069292344], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 26.572000000000042, 15, 81, 26.0, 36.0, 50.0, 68.0, 0.49870088419666764, 0.7835467513377651, 0.29756468773844136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 14.680000000000009, 9, 61, 14.0, 19.0, 27.899999999999977, 40.0, 0.4986939206218913, 0.7717911789024544, 0.2858723939502443], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2273.869999999998, 1574, 5131, 2054.5, 3129.7000000000016, 4137.099999999999, 4915.93, 0.4962720047006885, 0.7578092897404697, 0.2743065963482321], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 22.832, 13, 297, 18.0, 36.0, 48.94999999999999, 90.99000000000001, 0.48999431606593363, 0.264449549572725, 3.9515361934301563], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 30.587999999999955, 18, 91, 30.0, 41.0, 51.94999999999999, 76.0, 0.4987755061324449, 0.9029434301290332, 0.4169451496575906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 25.733999999999995, 15, 77, 25.0, 33.900000000000034, 45.94999999999999, 70.94000000000005, 0.49875709731349477, 0.8444055071013036, 0.35848166369407436], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 2.823153409090909, 826.5743371212121], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1652.0, 1652, 1652, 1652.0, 1652.0, 1652.0, 1652.0, 0.6053268765133172, 0.27724443855932207, 1157.65454751816], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9780000000000006, 1, 38, 2.0, 4.0, 7.0, 23.970000000000027, 0.4916169478060119, 0.4131109062638882, 0.2088411838824367], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 470.41600000000017, 324, 1020, 440.0, 684.3000000000002, 884.95, 973.96, 0.49140870166872563, 0.43269495964551746, 0.2284282636663217], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8099999999999956, 1, 32, 3.0, 5.0, 10.0, 21.99000000000001, 0.49186794722847166, 0.4456438883440085, 0.2411305756920828], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1315.6039999999998, 951, 2987, 1197.0, 1835.3000000000013, 2525.7, 2804.5200000000004, 0.4912131786601276, 0.4646070773503568, 0.26047730079340753], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.773198341836735, 671.9248246173469], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 55.71799999999999, 10, 1353, 45.0, 76.0, 109.0, 199.92000000000007, 0.48935314365353016, 0.263164945285425, 22.384083250714212], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 56.42399999999994, 10, 545, 50.0, 86.0, 112.79999999999995, 199.6700000000003, 0.4907503376362323, 109.38004169292181, 0.15240098375812683], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.9120244565217392, 0.7167119565217391], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9779999999999966, 1, 26, 2.0, 4.900000000000034, 9.0, 18.99000000000001, 0.4995738634944393, 0.5428523766102514, 0.21514850957133566], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.92, 2, 31, 3.0, 6.0, 9.0, 20.99000000000001, 0.4995603868595636, 0.5126192075973144, 0.18489588537087362], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8360000000000003, 1, 23, 2.0, 4.0, 6.0, 17.0, 0.49948054023815236, 0.28322692836949576, 0.19462181206545193], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 137.07999999999976, 92, 266, 133.0, 170.80000000000007, 228.89999999999998, 251.0, 0.49943214565039545, 0.4549641510727303, 0.16387617279153605], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 200.54000000000002, 29, 1108, 176.0, 319.80000000000007, 412.74999999999994, 627.98, 0.49024125752765446, 0.2631283774558636, 145.02332200222375], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.7179999999999995, 1, 39, 2.0, 4.0, 6.0, 13.990000000000009, 0.4995558948095143, 0.2785326579046228, 0.21026229556923895], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.824000000000006, 2, 25, 3.0, 6.0, 8.0, 14.990000000000009, 0.4996307728588574, 0.268674496422144, 0.2137092563595503], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 14.693999999999985, 7, 652, 10.0, 22.0, 33.0, 60.98000000000002, 0.4890606904754452, 0.20666157360901358, 0.3558107562541081], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.511999999999997, 2, 101, 5.0, 7.0, 9.0, 19.0, 0.49958284832165145, 0.2569963455514645, 0.20197978438004266], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.517999999999997, 2, 39, 4.0, 6.0, 9.949999999999989, 18.980000000000018, 0.491609697296245, 0.3018637169429349, 0.2467650238381542], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.7079999999999975, 2, 36, 4.0, 6.0, 10.0, 24.980000000000018, 0.49159326359919026, 0.2879037071416703, 0.23283470004453835], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 595.0060000000001, 384, 1453, 553.5, 849.0, 1098.55, 1280.96, 0.49089391782435815, 0.44848528545481325, 0.21716303200628345], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.709999999999983, 6, 175, 16.0, 32.900000000000034, 45.89999999999998, 65.98000000000002, 0.491008167429857, 0.43476759325227116, 0.20282856916291947], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 14.241999999999994, 8, 104, 13.0, 17.0, 25.899999999999977, 52.98000000000002, 0.49242454086335813, 0.3282480830528155, 0.23130488687038597], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 646.4960000000003, 462, 6260, 541.0, 874.7000000000005, 1164.35, 1731.3600000000006, 0.49222190938785315, 0.3699605244181445, 0.2730293403635748], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 194.07599999999996, 143, 542, 183.0, 258.60000000000014, 352.84999999999997, 412.97, 0.4994620793405502, 9.657051503967727, 0.25265757529141114], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 307.63799999999986, 28, 749, 286.0, 429.60000000000014, 553.95, 631.96, 0.4995209593999355, 0.9666354965588002, 0.35805506269487564], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 25.76, 15, 83, 25.0, 31.900000000000034, 42.0, 66.98000000000002, 0.49695861328668545, 0.4055512295998489, 0.30768726642945177], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 25.41999999999998, 15, 70, 25.0, 33.0, 46.0, 63.0, 0.49698232333272374, 0.41333592737398517, 0.3154672950842484], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.432000000000006, 15, 84, 25.0, 33.900000000000034, 44.0, 56.99000000000001, 0.4969146568953368, 0.4021466262848971, 0.304263173704469], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 27.915999999999993, 17, 75, 28.0, 35.0, 46.94999999999999, 64.99000000000001, 0.49694626520034385, 0.44444952175133806, 0.34650354819633356], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 26.057999999999996, 15, 205, 25.0, 32.900000000000034, 47.94999999999999, 85.85000000000014, 0.4952500567061315, 0.3718089800721282, 0.27422537319568024], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2524.4899999999993, 1777, 5389, 2250.5, 3722.4000000000015, 4712.8, 5221.87, 0.49442975438707515, 0.41311633913579615, 0.3157783782901828], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
