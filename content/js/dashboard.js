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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8884067219740481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.838, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.376, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.596, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.53, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.985, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.979, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 225.55532865347894, 1, 7177, 16.0, 658.0, 1483.8500000000022, 2838.0, 21.445091715288008, 144.44422981739055, 177.6332595222183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.638000000000012, 13, 147, 23.0, 39.0, 51.0, 96.91000000000008, 0.46470172190576037, 0.26988550882282686, 0.23416610205407454], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.868000000000011, 4, 34, 8.0, 14.0, 17.0, 28.0, 0.46446214354852794, 4.962345292014317, 0.16782323546187047], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.503999999999996, 5, 68, 8.0, 13.900000000000034, 16.94999999999999, 27.960000000000036, 0.46443582657966237, 4.987110998711191, 0.19593386433829504], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.91600000000001, 15, 516, 23.0, 46.0, 58.0, 81.98000000000002, 0.4608825901601567, 0.2487640785228713, 5.13091946076737], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.47000000000004, 26, 222, 49.0, 77.0, 103.94999999999999, 162.87000000000012, 0.46419867703377043, 1.930554245967274, 0.19311390275037715], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.1499999999999995, 1, 35, 2.0, 4.900000000000034, 8.0, 15.980000000000018, 0.4642215190813613, 0.29000698044095474, 0.19629679468967723], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 49.58600000000003, 24, 306, 44.0, 74.0, 99.94999999999999, 141.96000000000004, 0.4642029866820163, 1.9051860685140398, 0.16863624125557625], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 929.492, 570, 2560, 877.5, 1229.4, 1582.85, 2190.71, 0.46397985213890075, 1.962267759234823, 0.2256464515284888], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.778000000000002, 6, 51, 10.0, 18.0, 27.0, 41.99000000000001, 0.4640405682826415, 0.6900382946578721, 0.23700509493341948], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.188000000000005, 2, 36, 3.0, 7.0, 9.949999999999989, 17.99000000000001, 0.461890350925813, 0.44552120948528784, 0.252596285662554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.632000000000026, 9, 104, 16.0, 28.0, 42.0, 72.96000000000004, 0.4641978151137238, 0.7564565781820528, 0.30326986163191527], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.5374783532745592, 1489.6599988192695], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.292000000000004, 2, 39, 4.0, 8.0, 10.949999999999989, 17.99000000000001, 0.46189675129538943, 0.4640212959229298, 0.27109369875832917], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.79399999999997, 10, 84, 17.0, 31.0, 41.0, 69.98000000000002, 0.46419091986857824, 0.7292466549822075, 0.2760666701171525], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.918000000000013, 5, 71, 10.0, 19.0, 27.0, 43.99000000000001, 0.4641870413832031, 0.7183611780765389, 0.2651849796964588], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2390.742000000001, 1460, 7177, 2239.0, 3257.0000000000014, 3723.65, 4705.280000000001, 0.4634242417220845, 0.7076768759992585, 0.2552453831359919], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.717999999999982, 12, 191, 19.0, 38.0, 48.94999999999999, 105.99000000000001, 0.4608515799835568, 0.24874734059835124, 3.7156158636174266], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.472000000000005, 12, 121, 21.0, 36.0, 42.94999999999999, 71.90000000000009, 0.4642047105637209, 0.840332923846753, 0.38713947541154065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.303999999999988, 9, 95, 16.0, 29.0, 39.89999999999998, 63.960000000000036, 0.4642016937791403, 0.7859288266814778, 0.3327383234705947], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.6876994181681682, 2871.536575638138], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.356000000000001, 1, 40, 2.0, 6.0, 9.0, 21.970000000000027, 0.4616600556946691, 0.3880424087274987, 0.19521367589432786], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 494.48000000000013, 300, 1795, 457.0, 653.5000000000002, 813.8, 1404.3700000000006, 0.46154925469026353, 0.40642927582691163, 0.21364682297186027], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.898000000000002, 1, 29, 3.0, 6.0, 9.0, 14.990000000000009, 0.46180844185831715, 0.4183831148402143, 0.22549240325113143], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1373.334, 901, 4081, 1284.5, 1772.7, 2144.5499999999997, 3234.5600000000004, 0.46142828666140023, 0.4365138628630517, 0.24378193660529052], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.662471064814815, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 54.47599999999999, 29, 802, 46.0, 73.0, 95.0, 211.7800000000002, 0.46052049868843764, 0.2485686375293812, 21.064315544501017], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 57.400000000000006, 30, 204, 48.0, 86.80000000000007, 129.0, 187.97000000000003, 0.46119462320860477, 104.36632100177698, 0.14232177825578038], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.2281359777517564, 0.9605532786885246], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.757999999999998, 1, 19, 2.0, 5.0, 6.0, 12.0, 0.46450788176973784, 0.5047485987539112, 0.19913960946964349], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8599999999999994, 2, 31, 3.0, 6.0, 8.0, 14.0, 0.4645018403562915, 0.47661789910230373, 0.17101288458429872], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.658000000000002, 1, 21, 2.0, 4.0, 6.0, 12.990000000000009, 0.4644703412463597, 0.26340094908708356, 0.1800729740964891], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 158.908, 87, 755, 137.0, 209.0, 280.95, 695.8800000000001, 0.46442719871446553, 0.4230233325321964, 0.1514830902056948], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 211.25599999999997, 113, 713, 190.0, 302.80000000000007, 368.0, 596.99, 0.4610351530083466, 0.24884642521410472, 136.38266257713119], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.702, 1, 27, 2.0, 4.0, 5.949999999999989, 12.0, 0.46449536758769905, 0.25887905394138255, 0.19459815692883098], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.899999999999999, 1, 38, 3.0, 6.0, 7.0, 15.990000000000009, 0.46456269320001004, 0.24984308669157962, 0.19780208421406678], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.66600000000001, 7, 403, 11.0, 29.0, 38.94999999999999, 73.81000000000017, 0.4603695478434449, 0.19453760453841507, 0.33403766996843703], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.621999999999998, 2, 121, 5.0, 8.0, 11.949999999999989, 26.930000000000064, 0.4645117656185114, 0.2389287031923107, 0.18689340569807295], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.7759999999999945, 2, 34, 4.0, 8.0, 10.0, 27.950000000000045, 0.4616511044079371, 0.28344205649640053, 0.23082555220396855], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.259999999999996, 2, 39, 4.0, 9.0, 11.949999999999989, 20.99000000000001, 0.46163533393776784, 0.27035871690997926, 0.2177440100507245], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 658.0039999999995, 362, 2158, 616.0, 882.5000000000002, 1041.55, 1906.3900000000015, 0.4611907946317391, 0.4214266000438131, 0.20312211755753354], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 20.262000000000008, 6, 165, 16.0, 36.900000000000034, 48.89999999999998, 71.95000000000005, 0.46127588910927625, 0.40844088028737485, 0.18964565362793487], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.409999999999998, 5, 54, 8.0, 18.0, 25.0, 43.0, 0.4619035785517845, 0.30795526573543824, 0.21606622473271947], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 638.644, 394, 4665, 613.5, 759.7, 800.9, 866.98, 0.4617257090721714, 0.34706532766595805, 0.2552116712254385], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 212.3320000000001, 140, 974, 187.0, 258.80000000000007, 355.5499999999999, 774.860000000001, 0.46460413404758477, 8.982971205868415, 0.23411692692241576], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 305.17399999999986, 202, 1124, 276.0, 371.90000000000003, 472.4499999999999, 915.94, 0.4644733615237699, 0.9002391849119544, 0.3320258795267574], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.746, 9, 121, 16.0, 27.0, 43.89999999999998, 85.97000000000003, 0.464028509911649, 0.3787043613459611, 0.28639259596109584], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.399999999999995, 9, 106, 15.5, 29.900000000000034, 41.0, 73.99000000000001, 0.46403798429324233, 0.3859626871117162, 0.2936490369355674], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.204000000000008, 9, 99, 16.0, 29.0, 44.0, 87.0, 0.46401817466386525, 0.37552392727118333, 0.28321421793448803], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.968000000000004, 11, 102, 19.0, 34.0, 45.89999999999998, 87.96000000000004, 0.4640224809611576, 0.41495119730560703, 0.3226406312933049], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.18399999999999, 9, 102, 16.0, 32.0, 44.94999999999999, 88.96000000000004, 0.46371822254950423, 0.34811019028909124, 0.25586015209030266], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2612.1959999999995, 1666, 5431, 2485.0, 3365.0, 3841.2, 4605.74, 0.4630139802441195, 0.3869196221041948, 0.29480968273356045], "isController": false}]}, function(index, item){
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
