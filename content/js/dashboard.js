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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8901935758349288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.2, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.581, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.959, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.107, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.66249734098955, 1, 18990, 9.0, 849.9000000000015, 1504.9500000000007, 6033.0, 15.218418786540715, 95.86475342503448, 125.93371416136833], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6189.346000000002, 5384, 18990, 6020.0, 6518.0, 6710.8, 16507.270000000084, 0.328264060862783, 0.19064640589424384, 0.16541431191913675], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3860000000000015, 1, 10, 2.0, 3.0, 4.0, 5.990000000000009, 0.32938358497141285, 0.16910180122589982, 0.11901555316349875], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.710000000000001, 2, 14, 4.0, 5.0, 5.0, 7.0, 0.32938119813069583, 0.18904357807948363, 0.1389576929613873], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.628000000000004, 8, 363, 12.0, 16.0, 20.0, 43.92000000000007, 0.32742419966065756, 0.1703341263683876, 3.602625446852177], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.38799999999996, 23, 54, 33.0, 40.0, 41.0, 46.0, 0.3293158989105572, 1.369590734227909, 0.13700055950771226], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.306000000000002, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.32932717798882527, 0.2057362197570619, 0.13925651178629037], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.514000000000014, 21, 54, 29.0, 35.0, 36.0, 40.99000000000001, 0.3293135130506945, 1.3515714789387543, 0.11963342466294763], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 870.6300000000006, 687, 1125, 877.0, 1019.5000000000002, 1067.95, 1088.95, 0.32917410874464187, 1.3921460981264726, 0.16008662710432778], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.673999999999992, 4, 18, 5.0, 7.0, 8.0, 13.980000000000018, 0.32926038240300814, 0.48961726258680127, 0.16816716796559886], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.003999999999996, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.3275840154724482, 0.3159746171116131, 0.17914750846149513], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.857999999999998, 5, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.3293126454738612, 0.536647758426452, 0.21514664045118465], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.942521105664488, 2576.8846166938997], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.205999999999997, 2, 25, 4.0, 5.0, 6.0, 10.0, 0.32758637633778087, 0.3290931457055064, 0.19226505095606083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.198000000000008, 6, 26, 8.0, 10.0, 11.0, 14.0, 0.3293111272254023, 0.5173497104284931, 0.19585007468776366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.598000000000006, 4, 15, 6.0, 8.0, 9.0, 11.990000000000009, 0.32930982588072266, 0.5096294669642969, 0.18813110169943628], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.7299999999984, 1346, 1952, 1540.5, 1764.8000000000002, 1828.95, 1909.98, 0.32896403304641086, 0.5023479962060579, 0.18118722132634352], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.045999999999998, 8, 75, 11.0, 14.0, 18.0, 68.79000000000019, 0.3274160521613061, 0.1703298878387201, 2.6397919205505307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.074, 8, 25, 11.0, 13.0, 15.0, 20.99000000000001, 0.3293154651152835, 0.5961478230848165, 0.274643952352004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.812000000000004, 5, 17, 8.0, 10.0, 11.0, 16.980000000000018, 0.32931416373631944, 0.5575539636829047, 0.23605136345943212], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.461365582191781, 1868.2577054794522], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.8166675836267606, 3366.9777453785214], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.329999999999997, 1, 16, 2.0, 3.0, 4.0, 6.990000000000009, 0.32762522819097145, 0.2753811622619639, 0.13853683965497132], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.3260000000005, 444, 714, 567.0, 653.0, 664.9, 685.99, 0.3274921827615975, 0.2883818126151954, 0.15159306116113008], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3859999999999992, 2, 15, 3.0, 4.0, 5.0, 9.990000000000009, 0.32759131280253057, 0.2967868523437848, 0.15995669570436064], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 766.8819999999997, 599, 942, 744.0, 889.0, 906.8499999999999, 923.98, 0.32744435574340675, 0.3097642791525347, 0.17299550435271782], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.181999999999977, 16, 980, 21.0, 26.0, 32.94999999999999, 53.99000000000001, 0.3272079995811738, 0.1702216537664913, 14.925669590270143], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 32.917999999999964, 21, 302, 29.0, 41.0, 51.0, 170.54000000000042, 0.32755718984756144, 74.08381115226594, 0.10108210155452091], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 1.1864571549773755, 0.9279553167420814], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6860000000000013, 1, 8, 3.0, 3.0, 4.0, 7.0, 0.32933628857762953, 0.3578669742804826, 0.1411900690288861], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.419999999999999, 1, 20, 3.0, 4.0, 5.0, 7.0, 0.32933563780456965, 0.3379260234351946, 0.12124954634015891], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8560000000000003, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.3293842359339756, 0.1867936715324404, 0.1277007242829964], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.628, 66, 123, 91.0, 110.0, 113.94999999999999, 117.0, 0.3293677456754015, 0.30000448248916384, 0.10743049517146885], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 87.53399999999992, 59, 590, 82.0, 101.90000000000003, 112.94999999999999, 427.4300000000005, 0.3274838173871638, 0.17036514097687114, 96.83479010415951], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.2080000000001, 12, 346, 258.0, 332.0, 336.0, 341.99, 0.32933173322021886, 0.1835477670567491, 0.1379719858901112], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 427.3000000000002, 322, 533, 415.0, 497.90000000000003, 507.0, 524.0, 0.32930331931159795, 0.17710022556454114, 0.14021117892564133], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.253999999999998, 4, 285, 6.0, 8.0, 10.0, 25.980000000000018, 0.3271512649303659, 0.14750879934667893, 0.23737635726881037], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.26600000000013, 306, 503, 403.5, 466.0, 474.0, 491.0, 0.329271223999921, 0.16936567030566246, 0.1324802190312182], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.616000000000002, 2, 27, 3.0, 5.0, 6.0, 9.990000000000009, 0.3276220080739168, 0.20115159442983616, 0.1638110040369584], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2700000000000005, 2, 27, 4.0, 5.0, 6.0, 9.990000000000009, 0.3276168560182889, 0.19187021945578908, 0.154530216266439], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.3720000000001, 534, 875, 683.0, 803.8000000000001, 837.95, 858.98, 0.32746751685966513, 0.299233037305427, 0.1442264161169033], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.74399999999997, 162, 321, 242.5, 285.0, 291.0, 298.0, 0.32756770496894, 0.29004776735584725, 0.13467383182805054], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.638000000000005, 3, 46, 4.0, 5.0, 6.0, 11.990000000000009, 0.3275880933521238, 0.21840592501213713, 0.15323700851139385], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.3820000000005, 822, 8558, 929.5, 1071.9, 1103.75, 1139.95, 0.32738560983099696, 0.24608591576466476, 0.18095728043392997], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.46599999999984, 117, 166, 129.5, 149.90000000000003, 151.0, 160.99, 0.3293942176821451, 6.368731046450843, 0.16598380500389343], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.23200000000006, 161, 254, 174.5, 202.0, 204.0, 212.0, 0.3293634064080945, 0.638369967121298, 0.23544337254953626], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.074, 5, 23, 7.0, 9.0, 10.0, 14.0, 0.32925561232653994, 0.26871309353262957, 0.20321244823278636], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.059999999999998, 5, 26, 7.0, 9.0, 10.0, 14.990000000000009, 0.3292575637047534, 0.27385933553024955, 0.20835830203191427], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.399999999999993, 5, 19, 8.0, 10.0, 11.949999999999989, 15.990000000000009, 0.32925084238828023, 0.26645846249569505, 0.2009587661061281], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.790000000000001, 7, 25, 9.0, 12.0, 13.949999999999989, 18.0, 0.32925279370995464, 0.29443366770326423, 0.22893358312645284], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.878000000000005, 5, 33, 8.0, 9.0, 11.0, 20.940000000000055, 0.32922937937628155, 0.2471503088089271, 0.1816548821753897], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1626.0100000000011, 1437, 1982, 1603.5, 1811.8000000000002, 1867.8, 1955.0, 0.32892118456359726, 0.2748644012137849, 0.20943028548385292], "isController": false}]}, function(index, item){
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
