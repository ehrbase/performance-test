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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8892363326951712, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.17, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.635, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.969, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.023, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 331.5592427143181, 1, 19594, 9.0, 848.0, 1531.9500000000007, 6309.980000000003, 14.948590965721587, 94.16503823958321, 123.70086591764189], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6470.473999999998, 5322, 19594, 6296.5, 6809.200000000001, 7039.349999999999, 16480.54000000008, 0.32222889594068926, 0.1871413542039915, 0.16237315459511295], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2540000000000013, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.32334394548162404, 0.16600111872963338, 0.11683326155097744], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5799999999999987, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.3233414362697262, 0.18557714405281328, 0.13640966842629076], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.419999999999991, 8, 381, 12.0, 16.0, 18.0, 59.80000000000018, 0.32144811088159714, 0.16722521791771056, 3.536870962209917], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.858000000000004, 24, 49, 34.0, 41.0, 42.0, 44.99000000000001, 0.32329920371406123, 1.3445679217276463, 0.1344975202951075], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3080000000000025, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.32330672950025185, 0.20197514446152942, 0.13671075573594635], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.897999999999996, 21, 47, 30.0, 36.0, 37.0, 40.0, 0.3232981584936892, 1.326883206721692, 0.11744815914028554], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 854.0579999999995, 660, 1110, 863.5, 994.6000000000001, 1044.8, 1073.93, 0.3231558625967125, 1.3666936774474694, 0.1571597847394168], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.46, 3, 21, 5.0, 7.0, 8.0, 13.990000000000009, 0.32328164490873434, 0.48072675148337785, 0.16511357449928524], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8300000000000027, 2, 25, 4.0, 5.0, 5.0, 10.980000000000018, 0.3216354519460553, 0.3102368674234749, 0.17589438778299898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.608000000000007, 5, 22, 7.0, 9.0, 10.949999999999989, 14.0, 0.323298576581027, 0.5268472341079352, 0.21121752708272176], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.9529012940528634, 2605.2644032213657], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9119999999999986, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.3216397968780355, 0.3231192143031288, 0.1887749198473626], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.819999999999997, 5, 19, 7.0, 10.0, 11.0, 15.0, 0.3232966951965224, 0.50790100247031, 0.192273132201838], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.568000000000006, 4, 17, 6.0, 8.0, 9.0, 12.0, 0.32329502287312284, 0.5003211481418618, 0.1846949105281024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1583.7099999999987, 1315, 1984, 1553.5, 1797.9, 1850.95, 1944.9, 0.32298531450372014, 0.49321813099864475, 0.1778942552540021], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.537999999999995, 8, 53, 11.0, 14.0, 18.0, 34.98000000000002, 0.3214392248428805, 0.16722059518169033, 2.5916037502957243], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.89200000000001, 8, 27, 11.0, 13.0, 15.0, 20.0, 0.3233025484646685, 0.585262858510196, 0.2696292738172138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.687999999999994, 5, 20, 7.0, 9.900000000000034, 11.0, 15.0, 0.3233010851277621, 0.547373363571145, 0.23174120750368885], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.9684074895615867, 3992.574862995825], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.217999999999998, 1, 18, 2.0, 3.0, 3.0, 6.0, 0.3216377278481664, 0.2703484460314407, 0.1360050157795469], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.8120000000005, 431, 733, 546.5, 643.0, 655.0, 688.94, 0.32153927280678063, 0.28313982195566617, 0.14883751495157618], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2380000000000004, 1, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.32163917616627974, 0.2913944141808783, 0.15705037898744129], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 763.4280000000008, 606, 946, 755.0, 875.0, 890.8499999999999, 909.0, 0.3214956491993794, 0.30413676790618244, 0.16985268185240648], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.246, 16, 591, 22.0, 27.0, 32.0, 63.960000000000036, 0.3213187951573402, 0.16715794469557294, 14.657032150194688], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.660000000000014, 21, 254, 29.0, 35.0, 40.0, 107.94000000000005, 0.3215762897942619, 72.73110730755589, 0.09923643317869803], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.2339154411764706, 0.9650735294117647], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5860000000000007, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3232952319126017, 0.35130257568503026, 0.13860020196253137], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3300000000000005, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.32329376864192694, 0.3317265582517178, 0.11902514724414694], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7520000000000002, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.32334499099807545, 0.18336881808837147, 0.12535933733030855], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.4400000000001, 66, 121, 90.5, 110.0, 114.0, 117.99000000000001, 0.32332345472404667, 0.2944990424371734, 0.1054590174588199], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.22600000000006, 59, 347, 79.5, 91.0, 100.89999999999998, 322.8600000000001, 0.32151053364961396, 0.1672576917778182, 95.06852976930332], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.80200000000002, 13, 406, 262.0, 332.0, 338.0, 353.98, 0.32328958794155704, 0.1801802741544199, 0.13544065744817183], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 421.19800000000015, 332, 541, 409.0, 488.80000000000007, 504.95, 520.97, 0.3232383831357485, 0.17383848630535942, 0.1376288428195179], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.247999999999998, 4, 272, 6.0, 8.0, 11.0, 29.99000000000001, 0.3212661484429515, 0.144855266989839, 0.23310619950499312], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.6380000000003, 281, 494, 392.5, 451.0, 460.0, 474.0, 0.32322730831166097, 0.16625689019612788, 0.13004848732851984], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.354000000000004, 2, 21, 3.0, 4.0, 5.0, 10.0, 0.3216360726434368, 0.19747638206216325, 0.16081803632171843], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1160000000000005, 2, 30, 4.0, 5.0, 6.0, 10.980000000000018, 0.3216300726690986, 0.1883640340628761, 0.15170637216716273], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.2159999999993, 533, 859, 677.0, 806.9000000000001, 831.0, 844.0, 0.32148758736425187, 0.2937687015357462, 0.1415926776379664], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.38599999999994, 177, 308, 231.0, 279.0, 286.0, 301.0, 0.32157380794197266, 0.2847404173819004, 0.13220954408551805], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.412000000000004, 3, 53, 4.0, 5.0, 6.0, 9.0, 0.32164207284163693, 0.21444165971651755, 0.15045561805775792], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1000.46, 831, 8588, 946.0, 1116.7, 1147.85, 1166.99, 0.3214708448446685, 0.2416399648294822, 0.1776879865059398], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.83200000000008, 118, 164, 133.0, 148.0, 149.0, 157.97000000000003, 0.3233081928882543, 6.251059718377549, 0.16291701907259692], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.7480000000001, 160, 239, 180.0, 200.90000000000003, 203.0, 208.98000000000002, 0.3232828990458629, 0.6265847681301899, 0.231096759864816], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.838000000000002, 5, 16, 7.0, 9.0, 10.0, 14.0, 0.32327725550541164, 0.2638340187484644, 0.19952268113224625], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.578000000000005, 4, 14, 6.0, 8.0, 9.949999999999989, 12.0, 0.3232797637212863, 0.26888731206939137, 0.2045754754798765], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.108000000000002, 5, 23, 8.0, 10.0, 12.0, 14.990000000000009, 0.32327370226621327, 0.2616212400439782, 0.1973106092933431], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.368000000000004, 6, 19, 9.0, 11.0, 12.949999999999989, 15.0, 0.32327516535524703, 0.2890881852221224, 0.2247772634110702], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.595999999999998, 5, 33, 7.0, 9.0, 10.0, 17.970000000000027, 0.3232544743268064, 0.24266498726539, 0.1783581816353961], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1662.9740000000002, 1446, 2063, 1634.0, 1870.9000000000003, 1950.85, 2026.98, 0.3229317031740957, 0.26985926535459515, 0.20561667038038126], "isController": false}]}, function(index, item){
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
