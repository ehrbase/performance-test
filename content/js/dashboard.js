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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9044535332878891, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.475, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.836, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.369, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.992, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.602, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.528, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 229.66698477618615, 1, 5834, 14.0, 701.9000000000015, 1635.9000000000015, 2897.0, 21.242274878222542, 142.27998527828538, 187.11591026659272], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.468000000000004, 4, 49, 8.0, 15.900000000000034, 21.0, 34.0, 0.49224856189582644, 5.256099390399381, 0.17786324990376542], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 10.061999999999996, 5, 46, 8.0, 17.0, 20.0, 33.97000000000003, 0.4922296625470326, 5.285142952108023, 0.20765938888702937], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.30799999999998, 14, 393, 22.0, 45.0, 58.0, 81.99000000000001, 0.48797055000136635, 0.2629703792116738, 5.432484638687086], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 57.806000000000026, 26, 266, 52.0, 84.0, 110.89999999999998, 191.99, 0.4918974649572246, 2.045889944582832, 0.2046370313200954], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.189999999999998, 1, 24, 3.0, 5.0, 7.0, 17.0, 0.4919284381862402, 0.3074552738664001, 0.2080127087252363], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 51.80600000000001, 24, 184, 45.0, 82.0, 118.89999999999998, 148.97000000000003, 0.49189407749692815, 2.0184181744039966, 0.17869589534068092], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 937.5420000000004, 570, 2674, 887.0, 1221.7, 1536.8499999999995, 2158.5800000000004, 0.4916590049805057, 2.0794679204790723, 0.239107602031535], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.152, 5, 63, 9.0, 17.900000000000034, 26.0, 40.97000000000003, 0.4915459020309694, 0.7310785242120765, 0.251053229259958], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.327999999999997, 2, 36, 3.0, 7.0, 10.0, 21.0, 0.48913580464307266, 0.4719396240110897, 0.2674961431641804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 16.008, 8, 91, 14.0, 22.0, 31.94999999999999, 59.91000000000008, 0.49189165791099515, 0.8017257588412606, 0.3213628116625544], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.5275127472187886, 1462.0396032911], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.170000000000001, 2, 24, 4.0, 8.0, 10.0, 22.950000000000045, 0.4891453749837359, 0.4909796701399249, 0.2870862991847903], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.36800000000002, 9, 115, 15.0, 24.0, 33.0, 63.98000000000002, 0.49188778662301325, 0.7723406824647907, 0.29253873247403817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.562, 5, 40, 9.0, 16.0, 22.0, 36.0, 0.49188730271630005, 0.7613685300833355, 0.28100983602444873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2350.4839999999967, 1467, 5746, 2244.0, 3082.4000000000005, 3480.5, 4281.670000000001, 0.49084813649504977, 0.7496938334748612, 0.27034995017891417], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.477999999999987, 12, 78, 19.0, 38.0, 48.94999999999999, 71.99000000000001, 0.48794197784353066, 0.2635077282690161, 3.934032196363466], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.84600000000001, 11, 88, 20.0, 37.900000000000034, 44.0, 73.97000000000003, 0.49189359357783724, 0.8905964086848732, 0.4102315712065166], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.386000000000017, 8, 98, 15.0, 28.900000000000034, 38.94999999999999, 61.99000000000001, 0.49189407749692815, 0.8329534476363998, 0.35258813758080587], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 3.9144564075630255, 1146.0740546218487], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.593274368523316, 2477.258237532383], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9419999999999966, 1, 48, 2.0, 5.0, 7.0, 17.960000000000036, 0.4890860449078806, 0.41123348111883323, 0.2068107982862425], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 497.05400000000003, 313, 1916, 458.0, 633.6000000000001, 808.0999999999998, 1382.2800000000007, 0.48890957519624834, 0.4301067399607308, 0.22631165883107587], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.047999999999999, 1, 22, 3.0, 7.0, 10.0, 16.99000000000001, 0.48912767014795133, 0.4432719510715809, 0.23883187018942936], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1395.3839999999984, 906, 3724, 1298.0, 1899.5000000000005, 2309.849999999999, 3296.170000000002, 0.4887017052757304, 0.4624530785275222, 0.2581910376505568], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.724984217171717, 665.1179766414141], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 53.56799999999999, 28, 731, 45.0, 77.80000000000007, 107.94999999999999, 173.7800000000002, 0.48760222580664037, 0.26332424889753137, 22.303040090167404], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 55.10999999999998, 28, 220, 46.0, 83.90000000000003, 114.74999999999994, 189.87000000000012, 0.4883828374456796, 110.51903298122558, 0.1507118912430027], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.2426873518957346, 0.9719342417061612], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.821999999999999, 1, 20, 2.0, 5.0, 6.0, 13.990000000000009, 0.49227715597703237, 0.5350629634789423, 0.21104460104874725], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.200000000000001, 2, 27, 3.0, 7.0, 9.0, 18.99000000000001, 0.4922732786187994, 0.5052531404573809, 0.18123733011649154], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.846000000000001, 1, 15, 2.0, 5.0, 8.0, 13.0, 0.4922592237072042, 0.2792994228260602, 0.19084659356617195], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 158.42799999999983, 84, 931, 137.0, 225.0, 315.24999999999983, 591.6100000000004, 0.49221221828233686, 0.4484707027904495, 0.1605457821350591], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 206.90200000000016, 112, 806, 187.0, 299.90000000000003, 339.79999999999995, 506.9100000000001, 0.4880586685564298, 0.26357074581221257, 144.37671461110995], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.8040000000000003, 1, 17, 2.0, 5.0, 6.949999999999989, 12.0, 0.49226940132164493, 0.27394023012609975, 0.20623395817088444], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.9339999999999966, 1, 23, 3.0, 7.0, 9.0, 13.0, 0.4923135091811547, 0.26434927723453716, 0.2096178613310385], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.591999999999977, 6, 344, 11.0, 29.0, 34.0, 57.99000000000001, 0.487470544592343, 0.20612768145359817, 0.35370177210167075], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.3519999999999985, 2, 62, 4.0, 8.0, 11.0, 17.99000000000001, 0.49228442618834994, 0.2533534107434184, 0.19806756209921894], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.505999999999999, 2, 38, 4.0, 7.0, 9.0, 19.99000000000001, 0.489080782450999, 0.300421691564139, 0.2445403912254995], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.036000000000002, 2, 41, 4.0, 8.0, 10.0, 16.99000000000001, 0.48906212556181017, 0.2865598391963731, 0.23068067055308036], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 642.1139999999996, 370, 2262, 610.0, 820.7, 1005.9, 1663.97, 0.48831415398107875, 0.44579648799577315, 0.2150680502397134], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 20.041999999999998, 6, 139, 16.0, 39.0, 48.94999999999999, 74.0, 0.4884820810118223, 0.43266918698996365, 0.20083101182224333], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.377999999999988, 4, 47, 8.0, 16.0, 22.0, 37.98000000000002, 0.48915303152591283, 0.3262612505197251, 0.22881279502042215], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 654.174, 375, 4672, 623.5, 781.9000000000001, 848.6999999999999, 1009.8600000000001, 0.4889922944594239, 0.367699283919684, 0.27028285025784565], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 16.503999999999998, 8, 81, 14.0, 23.0, 33.0, 59.99000000000001, 0.4915299558016264, 0.4012881279786715, 0.3033661445963163], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 15.832, 8, 86, 14.0, 22.0, 32.0, 51.99000000000001, 0.4915367207422598, 0.4084170932386175, 0.3110505810947113], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.863999999999997, 8, 87, 15.0, 29.0, 42.89999999999998, 77.95000000000005, 0.49151159475852035, 0.3979131953660287, 0.2999948698477297], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.019999999999996, 10, 110, 18.0, 35.0, 46.0, 69.99000000000001, 0.4915207751086015, 0.4396806933588662, 0.3417605389426995], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.298000000000002, 8, 92, 14.0, 28.800000000000068, 44.94999999999999, 66.98000000000002, 0.4912320000314388, 0.36890371877360983, 0.27104109376734664], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2691.483999999998, 1653, 5834, 2531.0, 3634.3000000000006, 4189.0, 5099.63, 0.49047016469988136, 0.409446792570358, 0.31229155018000254], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
