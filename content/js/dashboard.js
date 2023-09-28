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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.890044671346522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.193, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.598, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.924, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.124, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.3730270155264, 1, 18143, 9.0, 846.0, 1499.0, 6070.970000000005, 15.22752862490331, 95.92213865149076, 126.00909885123019], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6190.348000000001, 5175, 18143, 6049.0, 6553.6, 6753.65, 15962.93000000008, 0.3284995716365586, 0.1907831838359158, 0.1655329872699846], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3640000000000017, 1, 10, 2.0, 3.0, 4.0, 6.980000000000018, 0.329602670572678, 0.16921427729176033, 0.11909471495301843], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.54, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.3296007151017115, 0.18916956667229184, 0.13905030168353452], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.351999999999995, 8, 359, 11.0, 16.0, 19.0, 42.98000000000002, 0.32775322541949137, 0.17050529366525122, 3.606245694142001], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.48400000000001, 24, 46, 33.0, 40.0, 42.0, 43.0, 0.3295312023209541, 1.370486158824483, 0.1370901290905532], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.247999999999998, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.32953815227958017, 0.2058680189402053, 0.1393457225947834], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.909999999999968, 21, 60, 30.0, 35.0, 36.0, 43.0, 0.32953098513947066, 1.3524640298393602, 0.11971242819519834], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.6639999999995, 692, 1095, 857.5, 992.7, 1054.5, 1080.0, 0.3293822830540062, 1.3930265107859523, 0.1601878681258741], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.632, 3, 20, 5.0, 8.0, 9.0, 12.0, 0.32954922938208203, 0.490046784250381, 0.16831469430354384], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.861999999999997, 2, 17, 4.0, 5.0, 5.0, 9.0, 0.32796433846969214, 0.31634146166982385, 0.1793554976006129], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.657999999999993, 5, 16, 7.0, 9.0, 11.0, 13.990000000000009, 0.32953424289178157, 0.5370088734921338, 0.21529141454550968], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 1.032499254176611, 2822.887921390215], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.16, 3, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.3279664896959488, 0.32947500743664015, 0.1924881448313137], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.037999999999998, 5, 18, 8.0, 10.0, 11.0, 16.0, 0.32953359133616644, 0.5176992028500041, 0.19598238000363805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.583999999999992, 4, 33, 6.0, 8.0, 9.0, 12.990000000000009, 0.3295329397831278, 0.5099747509801957, 0.18825856423157203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1568.5280000000005, 1347, 1939, 1542.5, 1770.0, 1851.0, 1918.8300000000002, 0.3292003328873766, 0.5027088403704294, 0.18131737084812538], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.554000000000004, 8, 65, 10.0, 14.0, 17.0, 34.99000000000001, 0.3277452763712043, 0.17050115837471116, 2.6424462907428348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.859999999999996, 8, 24, 11.0, 13.0, 15.0, 17.0, 0.32953706632922075, 0.5965489797120506, 0.27482876430190867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.6839999999999975, 5, 20, 7.0, 10.0, 10.0, 15.0, 0.32953511163660976, 0.557928045308112, 0.236209738223898], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 11.23046875, 3247.209821428571], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 1.0737666377314814, 4426.952220775463], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3119999999999994, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.32796347798709136, 0.27566547376784123, 0.13867986910977595], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.512, 416, 710, 554.5, 653.0, 664.95, 687.0, 0.3278432699350018, 0.28869097161434615, 0.1517555761222567], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2559999999999976, 2, 19, 3.0, 4.0, 5.0, 8.0, 0.32794024666353594, 0.29710297483616105, 0.16012707356617967], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 769.294, 630, 958, 748.0, 890.8000000000001, 902.9, 928.99, 0.32780887955580584, 0.31010912081494596, 0.1731880896871982], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.286917892156863, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.13599999999999, 17, 1503, 22.0, 27.0, 37.94999999999999, 51.97000000000003, 0.3274250573157563, 0.1703345725416763, 14.935570729706031], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.008000000000038, 20, 260, 28.0, 34.0, 38.0, 102.99000000000001, 0.32786885245901637, 74.15430007684427, 0.1011782786885246], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.2606107271634617, 0.9859525240384616], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6699999999999986, 1, 10, 3.0, 3.0, 4.0, 6.990000000000009, 0.3295531391254714, 0.35810261077764, 0.1412830352305488], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3120000000000016, 2, 8, 3.0, 4.0, 5.0, 6.990000000000009, 0.32955227028559003, 0.3381483065544651, 0.12132930263444085], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8460000000000012, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3296041915105826, 0.1869184082540141, 0.12778600002900517], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.26800000000004, 66, 129, 90.0, 112.0, 114.94999999999999, 118.98000000000002, 0.3295870274545994, 0.3002042152120893, 0.10750201872054316], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.32599999999992, 58, 357, 80.0, 91.90000000000003, 102.0, 292.95000000000005, 0.327812533191019, 0.1705361470275271, 96.9319891844811], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.49799999999996, 12, 370, 261.0, 334.0, 338.0, 348.0, 0.3295485777672029, 0.18366862189210975, 0.13806283189661137], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 432.362, 331, 542, 419.0, 507.90000000000003, 517.95, 527.99, 0.3295068797741428, 0.17720970093790836, 0.14029785115383422], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.318000000000003, 4, 260, 6.0, 8.0, 11.0, 32.960000000000036, 0.3273736059613424, 0.14760905039883926, 0.23753768479421622], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 403.13199999999983, 308, 512, 397.0, 466.0, 473.0, 483.0, 0.32948256081753846, 0.16947437461738837, 0.1325652490789315], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4580000000000006, 2, 13, 3.0, 4.0, 6.0, 8.980000000000018, 0.32796132680034373, 0.20135992751234774, 0.16398066340017187], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.125999999999994, 2, 23, 4.0, 5.0, 6.0, 11.970000000000027, 0.32795680940002925, 0.19206931461454255, 0.15469056537130288], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.3219999999994, 528, 862, 682.0, 805.9000000000001, 839.0, 851.0, 0.3277966297261718, 0.299533773829176, 0.14437136719385105], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.02600000000018, 174, 355, 241.0, 288.0, 295.0, 311.97, 0.3278774525233449, 0.2903220361107832, 0.134801179211258], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.456000000000003, 3, 47, 4.0, 5.0, 6.0, 9.990000000000009, 0.3279679955711202, 0.21865920923472604, 0.15341471667828765], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 989.58, 774, 8457, 940.5, 1084.8000000000002, 1111.0, 1147.8700000000001, 0.32775580357201384, 0.2463641792650535, 0.18116189923999984], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.20599999999993, 117, 161, 134.0, 150.0, 151.0, 153.0, 0.32958550667509523, 6.372429557483668, 0.16608019672299723], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.91199999999998, 158, 248, 174.5, 202.0, 204.0, 209.0, 0.3295616105544083, 0.6387541250814841, 0.23558505754475284], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.010000000000001, 5, 21, 7.0, 9.0, 10.0, 14.990000000000009, 0.3295440165352006, 0.26894846685413326, 0.2033904477053191], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.918000000000005, 5, 21, 7.0, 9.0, 10.0, 12.990000000000009, 0.32954575413250375, 0.27409903735565894, 0.20854067253697503], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.267999999999994, 5, 25, 8.0, 10.0, 11.0, 16.0, 0.329540324201771, 0.26669273639575153, 0.20113545178330744], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.59, 7, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.3295411929786635, 0.2946915681860273, 0.229134110742977], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.711999999999999, 5, 40, 7.0, 9.0, 10.0, 14.990000000000009, 0.3295815961636702, 0.2474147156122802, 0.18184922053952507], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1612.7620000000009, 1397, 1975, 1583.0, 1803.0, 1868.0, 1949.93, 0.32921854053470356, 0.2751128880087414, 0.2096196176060808], "isController": false}]}, function(index, item){
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
