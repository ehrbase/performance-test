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

    var data = {"OkPercent": 97.79621357158051, "KoPercent": 2.2037864284194852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9003403531163582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.989, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.973, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.711, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.655, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 518, 2.2037864284194852, 185.14733035524387, 1, 3603, 17.0, 546.9000000000015, 1210.9000000000015, 2178.9900000000016, 26.680333172150295, 176.56114675772375, 221.0497447958878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.229999999999976, 17, 63, 29.0, 32.0, 34.0, 40.99000000000001, 0.5782566256644168, 0.335671194753362, 0.29251653524821086], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.476000000000002, 4, 37, 7.0, 9.0, 12.0, 20.0, 0.5779879084929543, 6.18082545885015, 0.20997216988220604], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.680000000000006, 5, 32, 7.0, 9.0, 11.0, 18.0, 0.5779692011772077, 6.206199416857975, 0.24495960284268373], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.79800000000001, 13, 251, 20.0, 28.0, 33.94999999999999, 54.0, 0.5750464349996263, 0.31051496666168293, 6.403007277212635], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.28399999999999, 27, 79, 45.0, 55.0, 56.0, 66.96000000000004, 0.5778296026728087, 2.4032316890132637, 0.24151471674215047], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.408000000000001, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.577881693748129, 0.3611433270122707, 0.24548685232464468], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.99000000000001, 24, 85, 39.0, 49.0, 50.94999999999999, 54.0, 0.5778035606566622, 2.371459292005741, 0.2110337223492106], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.0380000000004, 584, 1049, 757.0, 907.0, 924.95, 967.96, 0.5774872375320506, 2.4421179579040677, 0.2819761902011965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.319999999999983, 8, 37, 13.0, 15.0, 16.0, 24.99000000000001, 0.5776540314474855, 0.8590821113543676, 0.2961605141698534], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.1900000000000017, 1, 21, 3.0, 4.0, 6.0, 9.0, 0.5754196823453186, 0.5551248998769752, 0.31580650534967675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 19.915999999999993, 13, 66, 21.0, 25.0, 27.0, 34.98000000000002, 0.5777735150931775, 0.9413104163320396, 0.3785996373315646], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.7077243988391376, 1961.5124248548923], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.242000000000001, 2, 22, 4.0, 5.900000000000034, 7.0, 11.990000000000009, 0.5754322647172556, 0.5782093997292016, 0.3388531793208058], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.596000000000004, 13, 63, 22.0, 25.0, 27.0, 36.98000000000002, 0.5777581596784891, 0.9077923524896755, 0.344736558167536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.50199999999999, 7, 27, 12.0, 15.0, 16.0, 20.99000000000001, 0.5777514836658101, 0.8942080883185584, 0.3311915243279595], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1880.152, 1493, 2423, 1859.5, 2139.5, 2216.0, 2285.92, 0.5765941964640937, 0.8805269076330694, 0.3187034328112081], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.770000000000003, 12, 232, 17.0, 23.0, 29.0, 61.840000000000146, 0.5750133690608307, 0.31043197340275663, 4.637168361039395], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.474000000000004, 16, 76, 25.0, 30.0, 32.0, 39.99000000000001, 0.5777975512939776, 1.0460640972491058, 0.4830026405348094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.85600000000001, 13, 54, 21.0, 26.0, 27.94999999999999, 35.0, 0.5777882036449191, 0.9781739874117283, 0.4152852713697856], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.852294921875, 1420.6746419270833], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.7646207220367279, 3192.730070951586], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1999999999999993, 1, 32, 2.0, 3.0, 4.0, 8.990000000000009, 0.5756250424523468, 0.4835733791693961, 0.24452821627614346], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.71599999999967, 317, 680, 424.0, 474.0, 484.95, 545.8600000000001, 0.5753408894770152, 0.5064033643058512, 0.2674436165928313], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9440000000000017, 1, 16, 3.0, 4.0, 5.0, 12.990000000000009, 0.5755945604011663, 0.5215347642566138, 0.28217623957166554], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1162.5540000000008, 927, 1564, 1158.0, 1337.9, 1361.9, 1405.0, 0.5747787101965743, 0.5437440276899643, 0.3047898824577538], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 44.068, 13, 613, 43.0, 51.0, 58.0, 89.97000000000003, 0.5746181949403718, 0.30908398461517245, 26.28429321387404], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.630000000000045, 10, 186, 46.0, 54.0, 63.94999999999999, 102.98000000000002, 0.5753402274434988, 127.00657545558315, 0.17867010969436775], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.9494946561338289, 1.5320051115241635], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.165999999999999, 1, 28, 2.0, 3.0, 4.0, 7.0, 0.5780346820809249, 0.6280775830924855, 0.24893876445086704], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.041999999999998, 2, 34, 3.0, 4.0, 5.0, 13.960000000000036, 0.5780286679098137, 0.5929422591267837, 0.21393834486115174], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.047999999999997, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.57800060343263, 0.32784939305601635, 0.22521703200158139], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 120.53, 84, 193, 119.0, 147.0, 152.0, 170.92000000000007, 0.5779391383852149, 0.5265138429427274, 0.18963627978264863], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, 2.6, 168.00599999999983, 31, 806, 167.0, 202.90000000000003, 223.95, 318.9000000000001, 0.5750907493202427, 0.30750169759600565, 170.12352517977337], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.154000000000003, 1, 20, 2.0, 3.0, 4.0, 8.990000000000009, 0.5780239903076937, 0.32228337214282743, 0.24328939435802344], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0500000000000016, 1, 29, 3.0, 4.0, 5.0, 9.990000000000009, 0.5780861417721577, 0.310961794070108, 0.2472673145470753], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.501999999999986, 6, 307, 10.0, 15.0, 20.0, 43.86000000000013, 0.5744445695457063, 0.2427420993048072, 0.4179308635854992], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.1220000000000026, 2, 76, 4.0, 5.0, 6.0, 9.0, 0.5780373550860352, 0.2974205408175298, 0.23369869629454934], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4900000000000015, 2, 40, 3.0, 4.0, 5.0, 11.0, 0.5756184156448481, 0.3535455054418965, 0.28893346254048036], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.863999999999998, 2, 52, 4.0, 5.0, 6.0, 9.990000000000009, 0.5756025119293621, 0.3372018918615561, 0.27262423660716856], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 526.2000000000002, 383, 766, 525.0, 633.9000000000001, 647.0, 711.9100000000001, 0.5751258087706687, 0.5255054816678648, 0.25442577282530554], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.853999999999987, 6, 112, 14.0, 26.0, 36.0, 51.97000000000003, 0.575457431111991, 0.5095765467720291, 0.23771337242223842], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.789999999999996, 7, 51, 11.0, 13.0, 15.0, 20.0, 0.5754421985574815, 0.38342432992633185, 0.2703004858458482], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 536.4340000000001, 435, 3603, 515.0, 606.0, 645.0, 704.98, 0.5751383782938175, 0.43215133889338775, 0.3190220692098519], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.40799999999996, 144, 247, 177.5, 189.0, 193.0, 207.99, 0.5781202305080982, 11.177899328961397, 0.2924475384796826], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 268.54999999999984, 214, 474, 270.5, 294.0, 299.95, 346.84000000000015, 0.5779471548239515, 1.1203042787017226, 0.4142707144929496], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.256000000000004, 13, 40, 21.0, 24.0, 26.0, 32.98000000000002, 0.5776193303774627, 0.47117943080235947, 0.35762759322198373], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 19.929999999999996, 13, 49, 21.0, 24.0, 26.0, 35.98000000000002, 0.5776346784134455, 0.48031564522082393, 0.36666263766478474], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.95999999999999, 13, 43, 22.0, 25.0, 26.0, 35.950000000000045, 0.5775926400835429, 0.46753642371387444, 0.3536626809886538], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.858000000000004, 15, 56, 24.0, 28.0, 29.0, 37.98000000000002, 0.5776026486547057, 0.5166509035293831, 0.40274247181587874], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.003999999999984, 13, 69, 21.0, 25.0, 26.0, 32.98000000000002, 0.5775219227321868, 0.4336400058964988, 0.3197802052628418], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2143.2679999999973, 1677, 2760, 2117.5, 2467.7000000000003, 2582.95, 2719.86, 0.5762811883379129, 0.48160449216949125, 0.3680545870830029], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.52509652509653, 2.1272069772388855], "isController": false}, {"data": ["500", 18, 3.474903474903475, 0.07657945118059988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 518, "No results for path: $['rows'][1]", 500, "500", 18, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 13, "500", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
