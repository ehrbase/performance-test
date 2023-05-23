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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909593703467348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.195, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.601, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.965, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.121, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.94856413528964, 1, 19047, 9.0, 845.0, 1502.0, 6042.990000000002, 15.230340678843596, 95.93985250608922, 126.03236883755989], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6193.3539999999975, 4937, 19047, 6025.0, 6513.5, 6661.65, 16384.850000000082, 0.32852309813050645, 0.19079684735272803, 0.16554484241732553], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.34, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3295848549167469, 0.16920513093582323, 0.11908827765546517], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6919999999999997, 2, 21, 4.0, 4.900000000000034, 5.0, 8.0, 0.3295815961636702, 0.18915859363413146, 0.13904223588154838], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.248000000000006, 8, 407, 11.0, 16.0, 22.94999999999999, 38.0, 0.3274962583552483, 0.17037161307463314, 3.6034183036021314], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.519999999999996, 25, 68, 34.0, 41.0, 42.0, 46.98000000000002, 0.32952772745157094, 1.3704717072024215, 0.13708868349059494], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3140000000000014, 1, 7, 2.0, 3.0, 4.0, 5.990000000000009, 0.32953554601074153, 0.20586639076028462, 0.1393446205299327], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.557999999999993, 22, 66, 30.0, 36.0, 37.0, 41.0, 0.3295279446287604, 1.3524515509479862, 0.11971132363466687], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 868.5639999999995, 674, 1092, 872.5, 1027.9, 1058.0, 1082.97, 0.32938510388806175, 1.3930384406826835, 0.16018923997681128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.5399999999999965, 3, 13, 5.0, 7.0, 8.0, 11.0, 0.3294374065633156, 0.48988050131643185, 0.16825758167247465], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.949999999999996, 2, 19, 4.0, 5.0, 6.0, 12.980000000000018, 0.3276297364611926, 0.31601871777352003, 0.1791725121272147], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.839999999999997, 5, 29, 8.0, 10.0, 11.0, 15.990000000000009, 0.32953033359673795, 0.5370025029064576, 0.21528886052365007], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9165618379237289, 2505.9110997086864], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.186000000000004, 2, 20, 4.0, 5.0, 6.0, 11.0, 0.32763274204360265, 0.3291397246754634, 0.1922922636408254], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.032000000000002, 6, 25, 8.0, 10.0, 11.0, 13.990000000000009, 0.32952881334038087, 0.517691696590629, 0.19597953840262886], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.681999999999999, 4, 20, 6.0, 8.0, 9.0, 15.960000000000036, 0.3295281618062361, 0.5099673567343364, 0.18825583462563295], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1558.404000000001, 1295, 1957, 1538.0, 1758.9, 1831.6499999999999, 1928.8500000000001, 0.32915937304355897, 0.5026462922089293, 0.18129481093414773], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.034, 7, 62, 10.0, 13.900000000000034, 17.0, 34.98000000000002, 0.3274851043400291, 0.17036581048142274, 2.6403486537414844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.078000000000001, 8, 43, 11.0, 13.0, 15.0, 21.99000000000001, 0.3295327225993541, 0.5965411164156726, 0.27482514169907074], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.751999999999993, 5, 23, 7.0, 10.0, 11.0, 15.0, 0.3295316366847799, 0.5579221619499705, 0.23620724738928559], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.4228515625, 2435.4073660714284], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.8449311247723132, 3483.503386839708], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3260000000000014, 1, 25, 2.0, 3.0, 3.0, 7.0, 0.3276956572460719, 0.27544036049635406, 0.13856662069096595], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 562.4300000000002, 455, 711, 550.0, 653.0, 667.95, 690.97, 0.32755246899224555, 0.2884348992333962, 0.15162096709211365], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3340000000000005, 1, 17, 3.0, 4.0, 5.0, 10.0, 0.3276608683799398, 0.29684986738745506, 0.1599906583886425], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 765.8599999999999, 602, 944, 744.0, 889.0, 907.9, 935.99, 0.32749432779824256, 0.3098115530092144, 0.17302190560434494], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.754000000000005, 15, 584, 21.0, 25.0, 30.0, 81.87000000000012, 0.3273616029719196, 0.1703015620304407, 14.932676244939808], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.331999999999994, 20, 258, 28.0, 35.0, 41.0, 97.96000000000004, 0.32763317141702003, 74.10099595057686, 0.10110554899197102], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.2545790968899522, 0.98123504784689], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7640000000000002, 1, 29, 3.0, 3.0, 4.0, 6.990000000000009, 0.32953446007755927, 0.3580823135477548, 0.14127502731840674], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5360000000000005, 2, 39, 3.0, 4.0, 5.0, 9.980000000000018, 0.3295329397831278, 0.33812847183547873, 0.1213221858381242], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8599999999999994, 1, 15, 2.0, 3.0, 3.0, 8.990000000000009, 0.3295865929447376, 0.1869084281141978, 0.12777917714752032], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.17800000000003, 65, 122, 92.0, 110.0, 113.0, 116.99000000000001, 0.329563782785829, 0.3001830428146197, 0.10749443696334658], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.38400000000003, 57, 334, 81.0, 95.0, 102.0, 298.7800000000002, 0.3275683487738134, 0.17040911628447084, 96.85978547385055], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.95399999999998, 13, 383, 261.0, 334.0, 337.0, 347.99, 0.3295285961620464, 0.18365748546449362, 0.1380544606967948], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 420.8879999999999, 315, 538, 409.0, 493.0, 505.95, 522.99, 0.32949037723353286, 0.17720082582644425, 0.1402908246814652], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.31, 4, 265, 6.0, 8.0, 12.0, 30.99000000000001, 0.3273088859780219, 0.14757986889151609, 0.23749072488444362], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 399.14400000000006, 292, 513, 405.5, 460.0, 472.0, 492.0, 0.32947083688887274, 0.16946834423607243, 0.1325605320295074], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.550000000000001, 2, 18, 3.0, 5.0, 5.0, 9.990000000000009, 0.32769200621566197, 0.2011945715115711, 0.16384600310783098], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.215999999999995, 2, 27, 4.0, 5.0, 6.0, 11.990000000000009, 0.32768663720108426, 0.19191108710533422, 0.1545631306329333], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.7840000000001, 529, 924, 681.0, 805.9000000000001, 832.95, 861.99, 0.32753444515992525, 0.29929419500057974, 0.14425589332727176], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.30599999999995, 176, 315, 236.0, 285.0, 291.0, 302.99, 0.3276284483713262, 0.29010155314723163, 0.1346988054339144], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.612000000000001, 3, 41, 4.0, 6.0, 7.0, 12.0, 0.32763617706245335, 0.21843798285381594, 0.15325950079386244], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.1239999999997, 819, 8933, 934.0, 1092.9, 1109.0, 1142.97, 0.32746558664149983, 0.24614603192756723, 0.1810014863662978], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.10599999999988, 118, 158, 135.0, 150.0, 151.0, 152.99, 0.32956226222082785, 6.371980133451295, 0.16606848369721403], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.4539999999999, 159, 231, 176.5, 203.0, 206.0, 212.0, 0.32953706632922075, 0.6387065536272145, 0.23556751225877887], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.055999999999998, 5, 22, 7.0, 9.0, 10.949999999999989, 15.0, 0.3294343677792104, 0.26885897997730857, 0.20332277386373146], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.921999999999996, 5, 15, 7.0, 9.0, 10.949999999999989, 14.0, 0.3294354530528124, 0.2740072946480575, 0.20847087263498287], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.332, 6, 19, 8.0, 10.0, 12.0, 14.0, 0.3294319802024557, 0.2666050549937276, 0.20106932385403792], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.647999999999993, 7, 32, 9.0, 12.0, 14.0, 17.0, 0.32943284840818043, 0.2945946812654833, 0.229058777408813], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.711999999999997, 5, 27, 8.0, 9.0, 10.0, 15.990000000000009, 0.32939096269779106, 0.24727160833537007, 0.1817440370354023], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.7839999999997, 1397, 1986, 1590.5, 1840.9, 1914.9, 1964.94, 0.32908896327762077, 0.2750046062170829, 0.2095371133369226], "isController": false}]}, function(index, item){
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
