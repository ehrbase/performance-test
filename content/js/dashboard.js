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

    var data = {"OkPercent": 97.800467985535, "KoPercent": 2.1995320144650075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8787279302276112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.396, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.833, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.319, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.886, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.564, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.957, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.858, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 517, 2.1995320144650075, 289.1486492235682, 1, 7671, 30.0, 791.9000000000015, 1815.0, 3869.8600000000224, 16.932083651192592, 112.35487921055466, 140.25126352432622], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 43.924000000000035, 17, 107, 37.0, 73.0, 80.0, 94.96000000000004, 0.36762273084869385, 0.21342150956002912, 0.18524739171672464], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.720000000000002, 4, 66, 12.0, 25.0, 32.0, 49.97000000000003, 0.3674930360069677, 3.926731994678701, 0.13278556965095512], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.710000000000006, 5, 61, 14.0, 26.900000000000034, 30.94999999999999, 40.0, 0.3674830424950041, 3.945969749163425, 0.15503190855257984], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 70.81800000000007, 15, 260, 65.0, 131.0, 146.95, 182.97000000000003, 0.3640835906797513, 0.19643020817935633, 4.053274349364419], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 66.50399999999999, 26, 168, 60.0, 109.80000000000007, 120.0, 143.93000000000006, 0.3671519436289592, 1.5270093147365977, 0.15274094529876622], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.448000000000004, 1, 36, 6.0, 15.0, 17.0, 21.99000000000001, 0.3671632672243632, 0.22941465294442911, 0.15525556123842701], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 58.84200000000001, 23, 150, 49.0, 99.0, 108.94999999999999, 131.96000000000004, 0.36714304700826145, 1.5068941777170606, 0.13337618504596999], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1125.828, 588, 2500, 893.0, 2192.5, 2335.95, 2447.91, 0.36700695551582097, 1.5520659635822667, 0.17848580453796759], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 21.982, 7, 91, 18.5, 39.0, 43.0, 52.0, 0.36702338893248315, 0.5458132414790016, 0.18745432852703972], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.393999999999997, 2, 44, 8.0, 24.0, 28.0, 36.99000000000001, 0.3646478304183386, 0.3517868723681543, 0.19941678226002893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 35.18000000000004, 12, 84, 28.0, 60.900000000000034, 68.0, 80.0, 0.36712255946100536, 0.5981380151830877, 0.23984862527286385], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.3165859143175074, 877.4406817971068], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.124000000000002, 3, 59, 9.0, 21.0, 24.94999999999999, 31.99000000000001, 0.3646576703188348, 0.3663762620346148, 0.214022714708613], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 34.883999999999965, 13, 103, 29.0, 60.0, 66.0, 77.99000000000001, 0.36711878568853495, 0.5767873510782645, 0.21833529344171657], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.349999999999973, 7, 76, 19.0, 43.0, 46.0, 57.98000000000002, 0.36711609018427027, 0.5681996264410224, 0.2097294069900372], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2850.489999999998, 1614, 5945, 2524.5, 4319.0, 4846.599999999999, 5617.97, 0.3665116810937881, 0.5597270470685296, 0.20186776185243802], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 70.89000000000001, 13, 191, 62.0, 133.90000000000003, 155.0, 178.98000000000002, 0.3640698052881867, 0.1965706740497596, 2.9353128051360056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 40.871999999999986, 15, 100, 36.0, 68.0, 74.94999999999999, 88.96000000000004, 0.3671411599017237, 0.6646638944296609, 0.30618999077741405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 36.00400000000001, 12, 88, 28.0, 64.0, 68.0, 80.0, 0.36713792490707736, 0.621530087687222, 0.26316331726737774], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 3.1688456632653064, 927.7742346938776], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1343.0, 1343, 1343, 1343.0, 1343.0, 1343.0, 1343.0, 0.7446016381236039, 0.3410333674609084, 1424.0084582092331], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.804000000000002, 1, 44, 6.0, 19.0, 22.0, 29.99000000000001, 0.3646252272526729, 0.3063158137140653, 0.15418234707071032], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 583.6440000000007, 326, 1405, 470.0, 1182.9, 1221.9, 1299.88, 0.3645468027058122, 0.32092863536096694, 0.1687452973462451], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.722000000000003, 1, 49, 8.0, 21.0, 27.0, 36.0, 0.3646406502855501, 0.33039362889828205, 0.17804719252224127], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1733.7160000000001, 946, 3736, 1346.0, 3304.7000000000025, 3489.7, 3607.83, 0.3643887269788312, 0.34473451001741046, 0.19251396610893326], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 3.4649884259259256, 487.7531828703703], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 104.61200000000004, 21, 1142, 92.0, 180.0, 196.0, 220.98000000000002, 0.36379034616834177, 0.19572204835064735, 16.639855697102337], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 126.012, 20, 356, 115.5, 232.0, 256.0, 294.97, 0.36424936219936677, 80.71890650201503, 0.11240507661621085], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 1.263648343373494, 0.9883283132530121], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.934000000000001, 1, 38, 6.0, 20.0, 22.94999999999999, 32.99000000000001, 0.36748790413563537, 0.39930288233625294, 0.15754608390189836], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.893999999999991, 2, 68, 9.0, 20.0, 24.94999999999999, 41.98000000000002, 0.3674846630275886, 0.3769868689920851, 0.13529464644668054], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.496000000000002, 1, 53, 5.0, 12.0, 15.0, 20.0, 0.3675027599457272, 0.20847311836749394, 0.14247909736177117], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 186.63799999999978, 77, 456, 137.0, 358.90000000000003, 384.0, 431.99, 0.36744847453765794, 0.33475273703182473, 0.11985135790583766], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 329.74399999999986, 52, 1611, 289.5, 532.0, 568.95, 683.96, 0.36412071038494115, 0.19495037057474998, 107.7135911605328], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.678000000000005, 1, 24, 5.0, 13.0, 16.0, 20.0, 0.367482502320652, 0.20485211608368017, 0.15395507177300755], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.856000000000002, 1, 40, 8.0, 20.0, 24.0, 29.0, 0.36753085421521137, 0.19772154989598875, 0.15648774652132047], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 60.98199999999997, 7, 356, 50.0, 129.0, 147.0, 176.98000000000002, 0.3637046078464177, 0.1536900594347885, 0.26389894885731285], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 10.984000000000014, 2, 152, 9.0, 20.0, 23.0, 31.99000000000001, 0.36749006490609526, 0.18912818770069553, 0.1478573308020618], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.438000000000004, 2, 40, 8.0, 20.0, 24.0, 30.980000000000018, 0.36461857979604695, 0.2239078545496377, 0.18230928989802347], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.857999999999995, 2, 71, 9.0, 24.0, 28.0, 41.99000000000001, 0.3646002340733503, 0.21359164728208754, 0.17197452447014472], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 787.0259999999993, 377, 2408, 622.0, 1561.8000000000002, 1644.95, 1754.97, 0.36410692218234036, 0.33273399058273856, 0.160363497953355], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 32.65999999999998, 7, 202, 29.0, 56.0, 68.0, 96.99000000000001, 0.36431810216499677, 0.32258873673244554, 0.14978312598775748], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 20.944, 6, 70, 16.5, 36.900000000000034, 40.0, 49.99000000000001, 0.36466963848110723, 0.24296328337420064, 0.17058277034418978], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 841.2060000000004, 449, 7671, 794.5, 999.6000000000001, 1062.9, 1242.4500000000005, 0.3645569029578689, 0.27394386384200686, 0.2015031319083533], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 258.3019999999999, 143, 573, 195.0, 496.0, 516.0, 563.9000000000001, 0.3675738143355258, 7.106962882993536, 0.18522274238001105], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 410.3120000000003, 212, 877, 323.0, 714.9000000000001, 751.95, 850.8000000000002, 0.3674757502752393, 0.7123015010833185, 0.26268774336081563], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 34.43800000000001, 13, 86, 28.0, 61.0, 67.89999999999998, 82.98000000000002, 0.3670080330718279, 0.2993782012275685, 0.22651277041151877], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 34.87600000000002, 12, 98, 29.0, 60.0, 66.94999999999999, 80.98000000000002, 0.36700345350249747, 0.305171256427148, 0.23224437291954916], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 35.84200000000005, 12, 99, 28.0, 64.0, 68.0, 82.0, 0.3670080330718279, 0.29707723289522364, 0.22400392643544184], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 38.17799999999997, 14, 108, 32.0, 64.0, 70.0, 87.98000000000002, 0.3670177313606375, 0.32824646566512417, 0.25519201633669325], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 35.75400000000003, 12, 88, 28.0, 64.0, 69.0, 78.98000000000002, 0.3666038552061413, 0.2752486089674969, 0.2022765412026073], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3295.5879999999984, 1714, 7036, 2989.0, 5009.200000000001, 5498.4, 6655.2300000000005, 0.36616168088716583, 0.30600532161078914, 0.2331420077523751], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.71179883945841, 2.1272069772388855], "isController": false}, {"data": ["500", 17, 3.288201160541586, 0.0723250372261221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 517, "No results for path: $['rows'][1]", 500, "500", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
