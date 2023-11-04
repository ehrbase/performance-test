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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8609870240374389, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.452, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.963, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.561, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.697, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.302, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 495.68538608806665, 1, 25872, 14.0, 1227.7000000000044, 2347.0, 9740.990000000002, 10.016218561090623, 63.09480993860405, 82.88506335268893], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9937.014000000005, 8427, 25872, 9723.5, 10460.900000000001, 10779.199999999999, 24801.94000000012, 0.21587091610004147, 0.12539612650402662, 0.10877870381603653], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.5439999999999974, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.21663834481372135, 0.1112196721211147, 0.0782775269346454], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.091999999999999, 3, 19, 5.0, 6.0, 7.0, 10.0, 0.21663693685769858, 0.12433563882874807, 0.09139370773684158], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.909999999999997, 14, 575, 18.0, 24.0, 28.0, 89.99000000000001, 0.21557652492366436, 0.11214821346883323, 2.37197334601067], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.094000000000065, 30, 85, 55.0, 68.0, 69.94999999999999, 72.99000000000001, 0.21662811408329696, 0.9009339020778102, 0.09012068027293409], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.515999999999999, 2, 26, 3.0, 4.0, 5.0, 10.0, 0.21663374555846662, 0.13533473962031903, 0.09160391779962504], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.782000000000004, 28, 80, 47.5, 60.0, 62.0, 65.99000000000001, 0.21663036663823032, 0.8890962970450751, 0.0786977503802946], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1219.8540000000005, 862, 1783, 1174.5, 1485.6000000000001, 1719.6499999999999, 1765.99, 0.2165142334291914, 0.9156839412638023, 0.10529696117943098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.876000000000001, 6, 28, 9.0, 11.0, 12.0, 18.99000000000001, 0.21670885988168562, 0.3222507304984781, 0.11068235714660311], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.416000000000001, 3, 19, 5.0, 6.900000000000034, 7.0, 13.990000000000009, 0.21571547646371578, 0.2080706379472429, 0.11796940119109457], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.178000000000006, 8, 25, 12.0, 14.0, 15.0, 22.99000000000001, 0.21663261924000946, 0.3530244316914025, 0.1415304904995765], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.6696860487616099, 1830.9443329140865], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.084000000000003, 4, 28, 6.0, 8.0, 8.0, 16.0, 0.2157167794002556, 0.21670899232112983, 0.12660721134722033], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.472000000000001, 8, 37, 13.0, 15.0, 16.0, 22.0, 0.21663186836754458, 0.3403299345327662, 0.12883672640218224], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.467999999999998, 7, 31, 9.0, 11.0, 12.0, 19.980000000000018, 0.21663168065024166, 0.3352523346125434, 0.12375930974647593], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2335.872000000001, 1950, 2978, 2297.5, 2664.6000000000004, 2805.95, 2938.98, 0.21643203990660526, 0.33051708806706276, 0.11920670947980992], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.416000000000007, 12, 96, 17.0, 22.900000000000034, 30.0, 55.98000000000002, 0.2155690894620344, 0.11214434535871128, 1.7380257837876523], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.526000000000007, 12, 40, 17.0, 21.0, 23.0, 29.0, 0.21663374555846662, 0.39216419968670424, 0.1806691588934868], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.27, 8, 40, 12.0, 15.0, 16.0, 21.0, 0.21663365169814788, 0.3667772737164023, 0.15528232455707083], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.126953125, 1482.421875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.7386420183121019, 3045.2919735270702], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.512000000000002, 2, 26, 3.0, 4.0, 5.0, 9.990000000000009, 0.21571175387461453, 0.18131373405997994, 0.09121405217549619], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 777.9739999999995, 579, 980, 765.5, 948.0, 956.0, 971.97, 0.21565341907713276, 0.18989926222269668, 0.09982394594000091], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.608000000000002, 3, 17, 4.0, 6.0, 6.0, 13.990000000000009, 0.2157147319356169, 0.19543038473046012, 0.10532945895293794], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1064.3880000000017, 828, 1370, 1020.0, 1320.8000000000002, 1338.0, 1356.97, 0.2156287735035363, 0.2039860831841901, 0.11392106100138001], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.262586805555555, 731.6297743055555], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.09200000000001, 24, 1774, 34.0, 40.0, 44.0, 123.98000000000002, 0.21540573177419794, 0.11205936266936814, 9.825782940598422], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.694, 31, 616, 45.0, 53.0, 63.0, 210.98000000000002, 0.21566104639602354, 48.77619154547774, 0.06655165103627289], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.8350542396496815, 0.6531150477707006], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.080000000000001, 3, 15, 4.0, 5.0, 5.0, 8.0, 0.2166104706902206, 0.23537562191573763, 0.09286327796192075], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.900000000000007, 3, 12, 5.0, 6.0, 7.0, 9.990000000000009, 0.21660981381086844, 0.22225986080978283, 0.07974794902997794], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.797999999999998, 1, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.21663890800125477, 0.12285584010293815, 0.08398988913720523], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.9099999999999, 81, 174, 133.0, 162.0, 166.0, 171.0, 0.21662783251722406, 0.19732764656389262, 0.07065790630932894], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 122.03800000000003, 84, 534, 119.5, 137.0, 147.0, 481.97, 0.215617987024972, 0.11216978307428987, 63.75680692508913], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 271.3720000000001, 15, 527, 285.0, 493.0, 506.9, 516.0, 0.2166080308727094, 0.12072301689391016, 0.0907469191839769], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 587.6260000000001, 390, 771, 572.0, 697.9000000000001, 706.95, 727.99, 0.2165724720794769, 0.11647326767469603, 0.09221249787758978], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.966000000000001, 7, 407, 9.0, 12.0, 18.899999999999977, 38.960000000000036, 0.21537075213497026, 0.09710823239085656, 0.15626998909793252], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 544.0619999999999, 397, 694, 542.5, 640.0, 653.0, 686.98, 0.21656599957119932, 0.1113940211270961, 0.08713397638997473], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.117999999999996, 3, 44, 5.0, 6.0, 8.0, 15.0, 0.2157106371229378, 0.1324408541655881, 0.1078553185614689], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.686000000000005, 3, 35, 5.0, 7.0, 7.949999999999989, 15.970000000000027, 0.21570765917499585, 0.12633011746468434, 0.10174492127101854], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 943.4799999999996, 673, 1451, 888.0, 1212.4000000000012, 1378.0, 1420.0, 0.215624310002208, 0.19703303038297465, 0.0949673474716756], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 331.4819999999998, 224, 433, 329.0, 400.90000000000003, 407.9, 419.0, 0.21568374551216046, 0.19097911024739359, 0.08867466490294879], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.947999999999999, 4, 75, 7.0, 8.0, 9.0, 18.0, 0.2157178962155315, 0.14382105949736868, 0.10090710184300741], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1551.4499999999991, 1268, 11978, 1452.0, 1753.9, 1790.6999999999998, 3304.270000000013, 0.215571412988695, 0.16203854715969573, 0.11915373022617322], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.90399999999997, 130, 231, 188.5, 206.0, 208.0, 211.99, 0.21663750003791157, 4.1886162484136715, 0.10916499025347887], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 237.62, 181, 369, 251.0, 281.0, 284.95, 292.97, 0.21661666431998614, 0.41984498031496065, 0.1548470686349901], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.893999999999995, 7, 24, 11.0, 13.0, 14.0, 21.99000000000001, 0.21670594823154943, 0.17685871874666814, 0.1337482024241594], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.945999999999996, 7, 29, 11.0, 13.0, 14.0, 22.0, 0.21670735708474861, 0.18024592099868286, 0.1371351244051925], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.207999999999984, 8, 28, 12.0, 15.0, 16.0, 21.99000000000001, 0.21670275489878246, 0.1753747461056348, 0.13226486505052643], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.01799999999999, 10, 31, 15.0, 18.0, 19.0, 25.99000000000001, 0.21670397586784523, 0.19378710716986774, 0.15067698322061115], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.44199999999999, 7, 44, 11.0, 13.0, 14.0, 40.0, 0.21668960687304764, 0.16266744892517623, 0.11956018347975773], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2640.4020000000023, 2189, 3303, 2589.5, 3021.2000000000003, 3140.65, 3273.99, 0.2164743003875323, 0.18090994052152123, 0.1378332459498741], "isController": false}]}, function(index, item){
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
