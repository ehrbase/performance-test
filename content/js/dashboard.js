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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8727292065517975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.772, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.792, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.457, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 464.5253775792382, 1, 21157, 11.0, 1012.0, 1862.0, 10459.950000000008, 10.65986394557823, 67.14927676799887, 88.21128383645124], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10561.282000000003, 8963, 21157, 10435.5, 11366.1, 11656.1, 20825.420000000075, 0.2294684272096318, 0.13330771079313924, 0.11563057464860352], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.908, 2, 8, 3.0, 4.0, 4.0, 6.0, 0.23038363944407508, 0.11827635067592256, 0.08324408847100367], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.135999999999998, 2, 17, 4.0, 5.0, 6.0, 8.0, 0.23038204715644045, 0.1322244462249137, 0.09719242614412332], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.118000000000006, 9, 431, 14.0, 18.0, 21.0, 81.94000000000005, 0.22909643906240906, 0.11918160552044525, 2.5207320106603155], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.675999999999995, 25, 58, 44.0, 54.0, 56.0, 58.0, 0.23031635794294328, 0.9578618913429608, 0.09581520359735725], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5779999999999985, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.230322193109497, 0.14388614272859018, 0.09739209923477755], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.47200000000002, 23, 54, 39.0, 48.0, 49.0, 51.0, 0.2303145544058253, 0.945259063424713, 0.08366895921774123], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1029.1899999999998, 750, 1461, 1002.0, 1267.9, 1382.95, 1412.0, 0.23024233005238015, 0.9737429308409601, 0.11197332067000518], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.8500000000000005, 4, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.23025568973322116, 0.342395157532884, 0.11760129465866667], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.411999999999999, 3, 14, 4.0, 5.0, 6.0, 11.990000000000009, 0.22920229807392142, 0.22107949397518842, 0.1253450067591758], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.584000000000009, 6, 26, 10.0, 12.0, 13.0, 17.0, 0.2303091439639428, 0.37531169103913187, 0.1504656419061306], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.7656941371681417, 2093.4336974557523], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.055999999999998, 3, 16, 5.0, 6.0, 7.0, 12.990000000000009, 0.22920334875260662, 0.2302575946243105, 0.13452266855499664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.877999999999998, 6, 27, 10.0, 12.0, 13.0, 18.0, 0.23030808312279336, 0.3618153480473329, 0.13697033459158314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.682000000000004, 5, 24, 8.0, 9.0, 11.0, 16.99000000000001, 0.23030755270588343, 0.3564166814927153, 0.13157218587201347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2054.8539999999994, 1628, 2771, 1987.0, 2438.1000000000004, 2598.85, 2661.9, 0.23007832326280514, 0.3513435301457823, 0.1267228264845919], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.310000000000011, 9, 97, 13.0, 17.0, 19.94999999999999, 39.98000000000002, 0.2290909807339067, 0.11917876596363225, 1.8470460321671227], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.266000000000004, 9, 47, 14.0, 17.0, 18.0, 26.0, 0.23031328133780696, 0.4169277663561583, 0.19207767799071007], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.707999999999998, 6, 38, 10.0, 12.0, 13.949999999999989, 18.0, 0.2303103109004949, 0.389932899522751, 0.16508571113375317], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.256610576923077, 2098.1971153846152], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.8418642241379309, 3470.859091424682], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8320000000000007, 2, 16, 3.0, 4.0, 4.0, 8.0, 0.22920755156367684, 0.1926574528382542, 0.09692077131550006], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 682.3639999999998, 502, 887, 651.0, 825.8000000000001, 844.95, 871.97, 0.22914683591757495, 0.20178124356956692, 0.10606992209465872], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.750000000000001, 2, 12, 3.0, 5.0, 5.949999999999989, 11.0, 0.22920439944092463, 0.20765157559115255, 0.11191621066451399], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 949.3880000000003, 768, 1229, 916.0, 1149.8000000000002, 1174.9, 1202.98, 0.22912047979661435, 0.21674931639040848, 0.12104900348629723], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.151075487012987, 855.1516842532468], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.448, 19, 1279, 27.0, 33.0, 37.0, 90.92000000000007, 0.22895796194443924, 0.11910956631584202, 10.443971096117927], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.00000000000008, 27, 274, 37.0, 45.0, 50.0, 123.92000000000007, 0.22916763108044746, 51.830984113269075, 0.07071969865373183], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 1.0182797330097086, 0.7964199029126213], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2799999999999985, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.23035816548285604, 0.25031429132268435, 0.09875706508493537], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8720000000000003, 2, 12, 4.0, 5.0, 6.0, 8.0, 0.2303572103188973, 0.23636584419352402, 0.08480924637717216], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2539999999999987, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.2303843825191703, 0.13065089333272203, 0.08931894517588926], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.32600000000005, 87, 180, 123.0, 154.90000000000003, 158.0, 166.0, 0.23037344918353347, 0.20983556619919286, 0.07514133987041033], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 102.19999999999995, 71, 488, 99.5, 116.90000000000003, 125.0, 412.51000000000045, 0.22913234455088916, 0.11920028443916422, 67.7529127017224], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.04599999999985, 15, 446, 318.5, 410.0, 424.95, 437.0, 0.23035519388766315, 0.12838477803088694, 0.09650622868926512], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 498.6199999999997, 359, 676, 481.0, 602.0, 620.0, 643.98, 0.23033418265224284, 0.12387435325040688, 0.09807197620740027], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.411999999999999, 5, 294, 7.0, 9.0, 12.0, 28.980000000000018, 0.2289292384302597, 0.103221600269175, 0.16610783608758098], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 462.2860000000002, 326, 603, 466.5, 550.0, 564.95, 586.99, 0.23032187482006103, 0.1184695651235101, 0.09266856682213394], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.169999999999992, 2, 12, 4.0, 5.0, 6.0, 11.0, 0.2292063957752677, 0.14072690731237164, 0.11460319788763386], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.5840000000000005, 3, 37, 4.0, 5.900000000000034, 6.0, 10.980000000000018, 0.22920271834423955, 0.13423355685373428, 0.10811026656276145], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 765.0080000000003, 547, 1148, 710.0, 972.0, 1076.9, 1133.92, 0.22912866949564198, 0.209373034505632, 0.10091506830325639], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 281.3400000000001, 195, 381, 276.0, 340.0, 349.0, 364.99, 0.2291693116624721, 0.20292002595457037, 0.0942190236424812], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.347999999999989, 3, 40, 5.0, 7.0, 7.0, 13.0, 0.22920471464929845, 0.15281284251779545, 0.10721587726270894], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1256.5859999999993, 955, 10833, 1172.5, 1496.0, 1516.95, 1564.7600000000002, 0.22910263248088827, 0.1722095578582661, 0.12663290037517846], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.478, 144, 222, 172.5, 185.0, 188.0, 194.96000000000004, 0.23039276898470976, 4.454569940649671, 0.1160963562462014], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.0339999999998, 196, 329, 226.0, 254.0, 256.0, 261.99, 0.23037313075241708, 0.4465076722027634, 0.16468079268629815], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.445999999999994, 5, 17, 8.0, 11.0, 12.0, 15.990000000000009, 0.2302540992137283, 0.18791567700576647, 0.14210995185847292], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.321999999999997, 5, 26, 8.0, 11.0, 11.0, 15.990000000000009, 0.23025473541888863, 0.1915139264683805, 0.14570807475726547], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.447999999999993, 6, 25, 9.0, 12.0, 12.949999999999989, 17.0, 0.23025144839673614, 0.18633952910240156, 0.140534331296836], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.764, 8, 29, 11.0, 15.0, 16.0, 21.99000000000001, 0.23025229665153293, 0.20590266656911646, 0.160097300015519], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.023999999999997, 5, 56, 9.0, 11.0, 11.0, 17.0, 0.23024487463396823, 0.17284329841784932, 0.12703940836737504], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2075.2019999999998, 1700, 2742, 1988.5, 2526.9, 2686.65, 2720.99, 0.230067418956451, 0.19225682722189913, 0.1464882394136778], "isController": false}]}, function(index, item){
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
