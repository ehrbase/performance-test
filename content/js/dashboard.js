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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8620506275260583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.456, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.98, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.625, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.687, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.28, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 496.1649861731548, 1, 33417, 14.0, 1230.9000000000015, 2338.9000000000015, 9768.980000000003, 9.977011064910632, 62.847831550047836, 82.5606179759274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9996.051999999998, 8520, 33417, 9727.0, 10372.300000000001, 10677.199999999999, 32158.75000000019, 0.2152429921186626, 0.12503137502927303, 0.10846228899729482], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.446000000000001, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.2160281666164761, 0.11090641354682389, 0.07805705239071892], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.077999999999999, 3, 16, 5.0, 6.0, 7.0, 10.0, 0.2160267665804864, 0.12398544041700944, 0.0911362921511427], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.950000000000006, 12, 594, 18.0, 23.0, 28.94999999999999, 92.97000000000003, 0.21452589134435224, 0.11160164802543934, 2.3604132986101725], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.51200000000002, 31, 78, 55.0, 67.0, 70.0, 75.0, 0.21597245919200384, 0.8982071012554479, 0.08984791759354846], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4160000000000004, 1, 12, 3.0, 4.0, 5.0, 9.0, 0.21597852309566334, 0.13492541114211604, 0.0913268559574436], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.36000000000001, 28, 83, 47.0, 59.0, 62.0, 66.0, 0.2159720860398235, 0.8863945758988542, 0.07845860938165464], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1203.4239999999998, 845, 1763, 1149.0, 1476.6000000000001, 1709.2499999999998, 1760.0, 0.21589235434498474, 0.9130538846536805, 0.10499452389043204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.054000000000013, 5, 43, 9.0, 12.0, 13.0, 18.980000000000018, 0.2159520310072564, 0.32112530970220643, 0.11029581271171396], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.52, 3, 33, 5.0, 7.0, 8.0, 14.990000000000009, 0.2147228593526621, 0.20711319864376748, 0.11742656370848709], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.23799999999999, 8, 48, 12.0, 15.0, 16.0, 20.99000000000001, 0.215973392078096, 0.35195015536585894, 0.1410998040041467], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.6456972947761194, 1765.3582672574626], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.994000000000008, 4, 19, 6.0, 8.0, 9.0, 15.990000000000009, 0.2147247036047554, 0.2157123533644999, 0.12602494811177536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.438000000000004, 8, 36, 12.0, 15.0, 16.0, 22.0, 0.21597245919200384, 0.3392939988542661, 0.12844455824993195], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.65, 7, 26, 9.0, 11.0, 13.0, 20.0, 0.21597171288893266, 0.3342309893869341, 0.12338227738283751], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2312.574, 1845, 2962, 2283.0, 2641.6000000000004, 2743.85, 2919.84, 0.2157655577755434, 0.3294992917495566, 0.11883962361856101], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.912, 12, 94, 17.0, 23.0, 30.94999999999999, 81.87000000000012, 0.21452092115283544, 0.11159906240949898, 1.7295749267947356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.472000000000005, 12, 59, 17.0, 21.0, 22.0, 29.980000000000018, 0.21597460484206427, 0.3909709811931474, 0.18011944583508094], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.329999999999997, 8, 38, 12.0, 15.0, 17.0, 21.0, 0.2159741383927723, 0.36566066745403636, 0.1548095874807567], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.126953125, 1482.421875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.7433769030448718, 3064.813075921474], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.5120000000000027, 2, 25, 3.0, 4.0, 5.0, 10.990000000000009, 0.21470017764292698, 0.18046346669828484, 0.09078630558533923], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 760.8859999999995, 552, 979, 723.0, 936.0, 949.95, 966.98, 0.21464524507120858, 0.18902364585681014, 0.0993572716442899], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.577999999999996, 3, 18, 4.0, 6.0, 6.0, 12.990000000000009, 0.21470681569609884, 0.1945172460834256, 0.10483731235161074], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1058.4539999999988, 831, 1372, 1012.0, 1309.0, 1331.9, 1352.96, 0.2146300421962663, 0.20304127751557138, 0.11339341096501959], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.985608552631579, 693.1229440789474], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.28200000000002, 24, 1803, 34.0, 41.0, 47.0, 97.0, 0.2143562987526607, 0.11151342178567371, 9.777912807360138], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.329999999999956, 30, 571, 44.0, 56.0, 72.89999999999998, 224.8900000000001, 0.21462718613886123, 48.54236273504896, 0.0662326082225392], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.8513215300324676, 0.6658380681818182], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.959999999999999, 2, 12, 4.0, 5.0, 5.0, 8.990000000000009, 0.216004648420034, 0.2347173167416563, 0.09260355532851068], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.903999999999996, 3, 15, 5.0, 6.0, 7.0, 10.0, 0.2160039952098954, 0.2216382400458879, 0.07952490839270564], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.6980000000000013, 1, 14, 2.0, 4.0, 4.0, 8.0, 0.21602881997281492, 0.12250985942032555, 0.08375336086836674], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.84199999999993, 80, 173, 131.0, 163.0, 168.0, 171.0, 0.21601827341778496, 0.19676015996045138, 0.07045908527494157], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.83000000000004, 81, 694, 120.0, 141.90000000000003, 161.95, 604.94, 0.2145727513204807, 0.11162602573821609, 63.447737668289406], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.1580000000003, 16, 543, 282.0, 486.0, 498.95, 521.0, 0.21600128909569333, 0.120384859081839, 0.09049272756059809], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 579.0879999999997, 439, 771, 555.5, 697.0, 707.0, 729.99, 0.2159728323454736, 0.11615077978610913, 0.09195718252209617], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.868000000000002, 6, 424, 9.0, 13.0, 17.0, 34.0, 0.21432046481822412, 0.09663466973752173, 0.1555079153905669], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 544.476, 406, 695, 547.0, 643.0, 654.0, 676.99, 0.21596490311166552, 0.11108483800580601, 0.08689212898633418], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.037999999999996, 3, 18, 5.0, 6.0, 8.0, 14.980000000000018, 0.2146987947668457, 0.13181960865025738, 0.10734939738342285], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.765999999999998, 3, 40, 5.0, 7.0, 8.0, 15.970000000000027, 0.21469566031367895, 0.12573743598312148, 0.10126758196436222], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 950.2959999999994, 660, 1435, 903.5, 1238.0, 1369.0, 1409.94, 0.21461327546214823, 0.1961091679518425, 0.09452205784514536], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 331.30199999999996, 224, 418, 334.0, 393.0, 398.0, 406.0, 0.214653077695828, 0.19006649616951582, 0.08825092354486679], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.911999999999996, 4, 72, 7.0, 8.0, 9.0, 15.990000000000009, 0.21472562574268225, 0.14315950385819004, 0.10044294407299298], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1590.5299999999997, 1267, 14286, 1461.5, 1771.8000000000002, 1808.95, 5524.080000000034, 0.21461051196625291, 0.1613284224367564, 0.11862260720009682], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.11999999999998, 128, 219, 193.0, 206.0, 209.0, 212.98000000000002, 0.21601939335705803, 4.176665354933904, 0.10885352243383002], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 237.8200000000001, 179, 304, 251.0, 283.0, 285.95, 293.0, 0.21600595485216337, 0.41866130727991907, 0.15441050678885115], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.152, 7, 26, 11.0, 14.0, 15.0, 19.99000000000001, 0.21594932619491242, 0.17624122206479514, 0.1332812247609225], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.078000000000003, 7, 30, 11.0, 14.0, 15.0, 21.99000000000001, 0.21595035215023925, 0.17961628362292995, 0.13665608222007328], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.388000000000007, 8, 26, 12.0, 15.0, 16.0, 21.99000000000001, 0.21594606185645376, 0.17476236418072438, 0.1318030162698082], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.186, 11, 30, 15.0, 18.0, 20.0, 25.99000000000001, 0.2159472743135036, 0.19311042828283045, 0.15015083917110797], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.383999999999997, 7, 40, 11.0, 13.0, 15.0, 36.88000000000011, 0.2159336582703023, 0.16209996332906648, 0.11914308293234453], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2634.2639999999988, 2180, 3319, 2593.0, 3007.8, 3145.9, 3258.94, 0.2157206883043146, 0.18026792010633305, 0.1373534070062628], "isController": false}]}, function(index, item){
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
