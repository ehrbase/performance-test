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

    var data = {"OkPercent": 97.82599446926186, "KoPercent": 2.1740055307381407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8778345032971708, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.403, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.827, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.316, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.892, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.524, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.949, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.862, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 511, 2.1740055307381407, 289.48262071899785, 1, 6996, 31.0, 816.9000000000015, 1851.7500000000036, 3748.930000000011, 16.983909182149446, 113.30940395795352, 140.68054301226482], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 45.12999999999999, 18, 102, 39.0, 73.0, 78.0, 92.95000000000005, 0.3681277904086513, 0.21371471932280686, 0.18550189438560946], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.184000000000005, 5, 92, 13.0, 24.0, 32.0, 63.99000000000001, 0.3680269925717432, 3.9295902431167913, 0.13297850317533688], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.082000000000004, 5, 69, 14.0, 27.900000000000034, 32.0, 43.99000000000001, 0.3680120943494687, 3.95167146148091, 0.1552551023036821], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, 0.6, 73.64799999999998, 15, 619, 68.5, 135.0, 156.0, 172.0, 0.3649600405251629, 0.1966065399561902, 4.063031701159041], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 68.81199999999995, 27, 174, 59.0, 116.0, 128.0, 149.99, 0.36789971936609406, 1.5301193636843244, 0.15305203168941023], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.308000000000002, 1, 42, 6.0, 14.0, 16.0, 24.0, 0.3679286865902503, 0.22989290998661474, 0.15557922001326013], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 61.366000000000014, 26, 149, 54.0, 103.0, 113.0, 134.98000000000002, 0.3678861848436778, 1.5099442969731796, 0.13364615308774233], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1106.3280000000002, 592, 2577, 901.0, 2062.7000000000003, 2299.6, 2459.83, 0.36770870410627665, 1.5550336460358796, 0.17882708461418534], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.686000000000014, 7, 91, 20.0, 40.0, 45.94999999999999, 56.99000000000001, 0.36758975806712485, 0.5466138676820231, 0.18774359713779912], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.357999999999997, 2, 55, 9.0, 23.0, 26.0, 35.960000000000036, 0.36548291623204654, 0.35259250509665924, 0.19987346981440046], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 34.48799999999997, 12, 104, 28.0, 60.0, 64.0, 72.0, 0.3678618252126609, 0.599384142975752, 0.24033160260475603], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.6398168103448275, 1773.2984093890555], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.038000000000002, 3, 42, 9.0, 20.0, 24.0, 32.0, 0.36549707602339176, 0.36719892178362573, 0.21451537372076024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 36.70600000000002, 13, 105, 31.0, 61.0, 67.0, 85.99000000000001, 0.3678472109824463, 0.5779109589041096, 0.21876850731280256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.746000000000002, 7, 68, 19.5, 41.0, 47.0, 57.0, 0.3678442341519829, 0.5693266027341126, 0.21014538767471683], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2940.497999999998, 1506, 6197, 2618.0, 4504.6, 5008.9, 5984.130000000001, 0.3671907702927979, 0.5607641343202197, 0.20224179145033008], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 72.25599999999996, 13, 197, 68.0, 136.90000000000003, 151.0, 175.99, 0.36495977413369496, 0.19705119117395883, 2.942488178952916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 41.620000000000005, 15, 117, 36.0, 67.90000000000003, 74.0, 92.96000000000004, 0.36787941795590007, 0.6659587459560855, 0.3068056864593151], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 35.62600000000002, 12, 91, 29.0, 61.0, 66.0, 74.99000000000001, 0.3678731926390046, 0.6227956635935766, 0.2636903548799115], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 4.39453125, 1286.6303066037735], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.6876994181681682, 2871.536575638138], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.998000000000015, 1, 38, 6.0, 20.0, 21.0, 30.0, 0.3656280392830765, 0.30724109764279606, 0.1546063877046603], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 592.0999999999995, 317, 1403, 473.0, 1162.9, 1226.6999999999998, 1310.95, 0.3655467775589371, 0.32185037242819564, 0.16920817633099236], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 11.087999999999996, 1, 49, 8.0, 22.900000000000034, 26.0, 39.99000000000001, 0.36564782556551095, 0.33124407879052475, 0.17853897732690965], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1710.6919999999984, 933, 3634, 1333.0, 3222.7000000000025, 3487.9, 3614.96, 0.36510554836297626, 0.34541266784814817, 0.19289267740661145], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 3.9641816737288136, 558.0227092161017], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 103.62599999999992, 18, 840, 96.0, 176.0, 195.95, 221.98000000000002, 0.3647396014563323, 0.19672216156906602, 16.68327485645673], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 126.46199999999995, 10, 419, 120.5, 224.0, 240.95, 283.94000000000005, 0.36522769390120885, 81.55502376057242, 0.11270698366482616], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 1.0143405464216635, 0.7933389748549323], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.150000000000006, 1, 44, 7.0, 19.0, 20.94999999999999, 28.0, 0.368043246553643, 0.3999063030902383, 0.15778416527055594], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.106000000000003, 2, 74, 9.0, 20.900000000000034, 24.0, 39.960000000000036, 0.3680402665494827, 0.37755683898864006, 0.1354991996964404], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.864000000000002, 1, 37, 6.0, 13.0, 16.0, 21.99000000000001, 0.368034306685932, 0.20877464863764741, 0.14268517554132326], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 186.51200000000009, 85, 444, 140.0, 366.90000000000003, 380.0, 418.97, 0.3679831139908652, 0.33523980401587333, 0.12002574225873923], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 333.6639999999997, 96, 1125, 282.5, 544.0, 580.9, 656.98, 0.3649786888943555, 0.19602349559434226, 107.96739695556677], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.285999999999999, 1, 26, 7.0, 14.900000000000034, 16.0, 19.0, 0.3680383702083245, 0.20516198311771192, 0.15418795001891716], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.732000000000005, 2, 41, 10.0, 20.0, 24.0, 35.97000000000003, 0.36806437887663807, 0.19800857157527135, 0.15671491131856854], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 62.51400000000003, 7, 405, 53.0, 131.90000000000003, 151.0, 186.94000000000005, 0.3646395865862223, 0.15406449845283424, 0.2645773562827765], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.182000000000006, 2, 75, 9.0, 20.0, 24.0, 32.99000000000001, 0.3680443302034843, 0.18930920816550512, 0.14808033598030818], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.502000000000004, 2, 36, 9.0, 20.0, 24.0, 29.99000000000001, 0.36562616771857315, 0.2245058927969451, 0.18281308385928657], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 12.504000000000001, 2, 90, 10.0, 24.0, 28.0, 37.0, 0.36562269200675673, 0.21419062790213012, 0.17245679710865575], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 827.538, 381, 1772, 626.5, 1598.6000000000001, 1663.0, 1709.94, 0.36528879732316366, 0.3337933403742749, 0.16088403085229183], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.92399999999999, 6, 231, 30.0, 54.0, 64.0, 93.97000000000003, 0.3653365736251837, 0.32346985854533206, 0.15020185302363506], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 21.105999999999984, 6, 124, 17.5, 36.0, 40.0, 55.960000000000036, 0.36550535867406353, 0.24360289665738039, 0.17097369805163712], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 856.7600000000009, 459, 6877, 820.5, 1007.9000000000001, 1114.9, 1609.790000000003, 0.36541613955388536, 0.27463092627327423, 0.2019780615112296], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 262.79999999999984, 144, 623, 198.0, 502.0, 527.95, 568.99, 0.36806708832432306, 7.116500232480374, 0.1854713062259284], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 415.1759999999998, 212, 940, 340.0, 717.9000000000001, 780.8499999999999, 850.8100000000002, 0.36800586454145734, 0.7133290551118223, 0.2630666922308074], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 35.388000000000055, 12, 104, 29.0, 60.0, 65.0, 77.98000000000002, 0.3675489556831522, 0.2998819007775866, 0.2268466210856955], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 35.18399999999998, 12, 89, 29.0, 63.0, 67.94999999999999, 75.0, 0.36757327389428446, 0.3056867134850872, 0.2326049623862269], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 35.53599999999999, 12, 102, 28.0, 64.0, 68.0, 85.97000000000003, 0.3675335558136458, 0.29750262097366986, 0.22432468006203965], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 38.255999999999965, 14, 103, 32.0, 64.0, 70.0, 86.97000000000003, 0.36753976964077395, 0.3286925388324144, 0.2555549960783507], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 35.86400000000001, 12, 96, 29.0, 66.0, 70.94999999999999, 83.99000000000001, 0.36725442064146124, 0.2756746532567388, 0.20263549576408751], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3169.036000000001, 1671, 6996, 2833.0, 4729.900000000001, 5402.599999999999, 6778.4000000000015, 0.3668265541340619, 0.30658174074056416, 0.23356534501504725], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.84735812133073, 2.1272069772388855], "isController": false}, {"data": ["500", 11, 2.152641878669276, 0.04679855349925548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 511, "No results for path: $['rows'][1]", 500, "500", 11, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
