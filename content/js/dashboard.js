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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.918064076346285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.856, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.746, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.794, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.36296296296325, 1, 3944, 13.0, 564.9000000000015, 1256.0, 2150.980000000003, 25.83292244840459, 173.68063748796692, 227.55793523352938], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.130000000000001, 4, 22, 7.0, 9.0, 12.0, 18.0, 0.5981948871086609, 6.394718531733641, 0.21614463694355912], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.487999999999997, 5, 32, 7.0, 9.0, 10.0, 16.99000000000001, 0.5981769957876376, 6.422715195669677, 0.2523559200979096], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.39599999999999, 13, 257, 19.0, 26.900000000000034, 30.94999999999999, 45.99000000000001, 0.5939314460567703, 0.3200733683515314, 6.612127426803889], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.585999999999984, 26, 78, 45.0, 53.0, 55.0, 64.99000000000001, 0.5980432026409588, 2.4873691406717224, 0.24879531672368013], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2760000000000007, 1, 8, 2.0, 3.0, 3.9499999999999886, 6.0, 0.598098286687648, 0.37381142917978, 0.2529067950544449], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.728, 24, 70, 40.0, 47.0, 49.0, 52.0, 0.5980217440706144, 2.453898129986006, 0.21725008671315288], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 739.668, 557, 1034, 737.0, 890.9000000000001, 899.0, 919.96, 0.5977043371817523, 2.5279858245450875, 0.2906804296059694], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.244000000000005, 5, 25, 8.0, 10.0, 12.0, 17.99000000000001, 0.5977750811479673, 0.8890736802620647, 0.3053089525785028], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0400000000000005, 1, 17, 3.0, 4.0, 5.0, 9.980000000000018, 0.5949512437455751, 0.5740349890826447, 0.3253639614233614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.816, 8, 25, 14.0, 16.0, 17.0, 22.99000000000001, 0.5980052935428584, 0.9746785497295222, 0.39068900525407446], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.713641826923077, 1977.9097643185619], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.8200000000000016, 2, 24, 4.0, 5.0, 6.0, 10.990000000000009, 0.594961154986191, 0.5971922593173892, 0.3491910685026375], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.597999999999997, 9, 43, 14.0, 17.0, 18.94999999999999, 24.0, 0.5979988566261861, 0.9389516422244601, 0.35564580438022203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.031999999999996, 5, 25, 8.0, 10.0, 11.0, 17.0, 0.5979974262190776, 0.9256112505441776, 0.3416293890021097], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1874.3779999999997, 1459, 2329, 1860.5, 2142.7000000000003, 2202.95, 2261.94, 0.5967470126844545, 0.9114378201547724, 0.32867706558010973], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.83399999999997, 11, 72, 16.0, 21.900000000000034, 25.0, 39.98000000000002, 0.5938905293465067, 0.3207240846959162, 4.78824239285621], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.197999999999997, 11, 33, 18.0, 21.0, 23.0, 26.0, 0.5980224593314826, 1.0827476949224304, 0.4987413869815294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.880000000000004, 8, 32, 13.0, 16.0, 17.94999999999999, 23.0, 0.5980167372924434, 1.012657248501071, 0.42865652848891933], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.654575892857142, 1948.3258928571427], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.7684694840604027, 3208.79758284396], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 1.979999999999999, 1, 16, 2.0, 2.0, 4.0, 7.990000000000009, 0.594833042261698, 0.5001477044798066, 0.2515260813469875], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 392.6480000000005, 302, 500, 395.0, 457.0, 462.95, 489.99, 0.5946264794306808, 0.5231087087210298, 0.2752470227052175], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.7940000000000023, 1, 15, 3.0, 4.0, 4.0, 9.0, 0.5949108942462598, 0.539137997910673, 0.29048383508118153], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1127.9899999999998, 914, 1422, 1117.0, 1325.9, 1343.95, 1369.0, 0.5942695773198204, 0.5623508011942441, 0.3139646887988504], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.662471064814815, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.49599999999999, 27, 606, 40.0, 47.900000000000034, 54.94999999999999, 78.96000000000004, 0.5934725145074357, 0.3204983403541132, 27.14557190869069], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.985999999999976, 28, 176, 41.0, 47.0, 52.0, 77.0, 0.5942554514023834, 134.47757127648447, 0.18338351820620427], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.9714814379699248, 1.541940789473684], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0399999999999996, 1, 22, 2.0, 3.0, 4.0, 8.0, 0.5982363990954666, 0.650231554876225, 0.2564704875028416], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.8719999999999986, 2, 25, 3.0, 4.0, 5.0, 9.990000000000009, 0.5982285256897275, 0.6140021293944372, 0.2202462443213157], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9720000000000009, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.5982077695225105, 0.3394128067310338, 0.23192234814495769], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.58600000000006, 81, 214, 116.0, 145.0, 150.0, 163.96000000000004, 0.5981362075771894, 0.5449815250678884, 0.19509520833084112], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 162.66399999999993, 113, 658, 163.0, 192.0, 213.79999999999995, 321.83000000000015, 0.594022470682021, 0.3207953381710523, 175.72275270903947], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0839999999999974, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.598223515448524, 0.33290203910467475, 0.2506229376244305], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 444.022, 341, 590, 448.5, 517.9000000000001, 525.95, 557.95, 0.5980002870401377, 0.6498814838181123, 0.2569532483375592], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.956000000000003, 6, 299, 9.0, 14.0, 18.94999999999999, 40.97000000000003, 0.5932859021030799, 0.25087187071350936, 0.4304799074829964], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.574000000000002, 1, 13, 2.0, 3.0, 4.0, 9.0, 0.5982399779847688, 0.6367984140658184, 0.24303499105631235], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.245999999999999, 2, 20, 3.0, 4.0, 5.0, 10.0, 0.5948266734556218, 0.365376931253502, 0.2974133367278109], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.6760000000000006, 2, 29, 3.0, 5.0, 5.0, 12.0, 0.5948082754485747, 0.3485204738956492, 0.2805589814859976], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 505.272, 372, 868, 504.0, 615.0, 624.0, 658.98, 0.5941975421612866, 0.5424605764785715, 0.2617022378073635], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.731999999999992, 5, 122, 14.0, 24.0, 32.0, 47.99000000000001, 0.5943755431106525, 0.5264634937513298, 0.24436728872029756], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.7940000000000005, 4, 37, 7.0, 9.0, 9.0, 13.980000000000018, 0.5949717745390158, 0.396841525400535, 0.2783119921915904], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 503.84000000000003, 374, 3944, 494.0, 547.9000000000001, 573.9, 636.9100000000001, 0.5947332799659336, 0.44721154841188376, 0.3287295277936704], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.789999999999997, 8, 38, 13.0, 16.0, 17.0, 24.0, 0.5977550710551454, 0.48801097597861476, 0.3689269579168475], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.437999999999997, 8, 24, 13.0, 15.0, 16.0, 20.0, 0.5977665052298592, 0.4966832551853255, 0.37827411659077026], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.718000000000007, 8, 43, 13.0, 16.0, 17.0, 24.99000000000001, 0.5977329185863856, 0.4839068256915172, 0.3648272208168857], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.357999999999986, 10, 32, 16.0, 19.0, 20.0, 27.970000000000027, 0.5977393497791353, 0.5346965277321172, 0.415615641643305], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.223999999999997, 8, 25, 13.0, 15.0, 16.94999999999999, 19.99000000000001, 0.5975314779582588, 0.4487321353026378, 0.3296926611781409], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2087.8420000000006, 1662, 2702, 2069.5, 2414.9, 2494.0, 2599.9300000000003, 0.5963548406718772, 0.49783981640619873, 0.3797103087090468], "isController": false}]}, function(index, item){
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
