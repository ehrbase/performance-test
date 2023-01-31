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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8668793873643905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.45, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.737, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.736, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.844, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.479, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.6849181025317, 1, 23285, 13.0, 1058.0, 1912.0, 10743.950000000008, 9.80214717274465, 61.83279553429417, 81.21195927375702], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11362.387999999994, 9043, 23285, 10822.5, 13331.7, 13854.449999999999, 21703.11000000006, 0.21094661025673045, 0.12255956855406223, 0.10670932042283826], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.188, 1, 9, 3.0, 4.0, 5.0, 8.0, 0.21166350582497967, 0.10866564613989266, 0.0768933829754809], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.7, 3, 17, 4.0, 6.0, 6.0, 12.0, 0.21166216179032324, 0.12143248387134327, 0.08970837716503934], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.128000000000018, 10, 454, 14.0, 19.0, 22.0, 35.0, 0.21051780643813975, 0.12370182549989558, 2.3440664345778024], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.11199999999998, 28, 73, 46.0, 55.0, 57.0, 60.0, 0.21159999644512006, 0.8800224813093723, 0.08844218601417127], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7119999999999997, 1, 10, 3.0, 4.0, 4.0, 7.0, 0.21160563818990843, 0.13220558196629037, 0.08989106700450213], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.180000000000014, 24, 60, 40.0, 49.0, 50.94999999999999, 53.99000000000001, 0.21159847412108343, 0.8684323734979683, 0.07728303644656757], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1164.9660000000008, 822, 1802, 1176.0, 1500.6000000000001, 1634.9, 1689.99, 0.21153267693333463, 0.8946758044905003, 0.1032874399088548], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.804, 4, 18, 7.0, 9.0, 9.0, 12.990000000000009, 0.21148624070517974, 0.31448458357830494, 0.10842800426779235], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.471999999999998, 3, 18, 4.0, 5.900000000000034, 6.0, 11.0, 0.21065847626510947, 0.2031928550701282, 0.11561529654393703], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.256000000000004, 6, 21, 10.0, 13.0, 14.0, 18.99000000000001, 0.2115976681936965, 0.34487940255398386, 0.13865433140426792], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.8582448010849909, 2138.8643620027124], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.082000000000001, 3, 20, 5.0, 6.0, 8.0, 12.0, 0.21065980758333175, 0.21162876040922776, 0.12405064841088775], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.9, 8, 31, 17.0, 20.0, 20.94999999999999, 22.99000000000001, 0.21159605635734002, 0.33241864435802393, 0.12625506878353004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.91200000000001, 5, 19, 8.0, 9.0, 10.949999999999989, 14.990000000000009, 0.2115959668115958, 0.32745922320898824, 0.12129573488125657], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2349.832000000002, 1668, 3770, 2209.5, 3073.9000000000005, 3308.95, 3621.6500000000005, 0.21133633459106632, 0.3227233786751917, 0.11681285681498392], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.796000000000005, 9, 76, 13.0, 16.0, 20.0, 39.960000000000036, 0.2105123111809825, 0.12369859644600487, 1.6976666657544468], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.036, 9, 31, 15.0, 18.0, 19.0, 23.99000000000001, 0.2115993696031581, 0.3830506517842482, 0.17688384802763996], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.344000000000003, 6, 23, 10.0, 12.0, 14.0, 17.99000000000001, 0.211598653216892, 0.3582046974424917, 0.15208653199964114], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.758840460526316, 1794.5363898026317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.7331295289855073, 2771.659873188406], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0159999999999996, 2, 21, 3.0, 4.0, 4.0, 8.0, 0.21065439366081948, 0.17712249310738823, 0.08948697386958639], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 740.7000000000003, 582, 976, 702.5, 903.0, 919.95, 941.95, 0.2106021325571943, 0.18539157649385357, 0.09789708505588328], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.811999999999997, 2, 14, 4.0, 5.0, 5.949999999999989, 10.0, 0.2106654880634828, 0.19085593743298204, 0.10327546387487144], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1004.7119999999998, 753, 1299, 975.5, 1216.0, 1239.95, 1275.97, 0.21059193180190883, 0.1992212014217061, 0.11167130758636375], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.8125, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.06600000000002, 19, 619, 27.0, 32.0, 37.94999999999999, 72.92000000000007, 0.21045826023416428, 0.1236668357084951, 9.626821200554936], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.98999999999994, 26, 300, 35.0, 42.0, 48.94999999999999, 106.87000000000012, 0.21057942613737107, 47.653141156706475, 0.06539478272625392], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 0.4951974150141643, 0.389149551463645], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.224000000000001, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.21163232861590764, 0.22991827116598407, 0.09114243839806178], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.924000000000002, 2, 12, 4.0, 5.0, 5.949999999999989, 8.0, 0.21163152243061345, 0.21719966352175168, 0.0783284638683618], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2639999999999985, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.21166404344362158, 0.12002260757190017, 0.08247456380273928], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.68400000000017, 92, 296, 195.0, 273.90000000000003, 279.0, 289.99, 0.21164728894638168, 0.19277885046208953, 0.0694467666855315], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.57000000000002, 81, 436, 109.0, 127.90000000000003, 135.0, 242.93000000000006, 0.21054909941833708, 0.12377984165023331, 62.28470038652604], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 256.94799999999987, 18, 468, 312.0, 417.90000000000003, 430.95, 450.96000000000004, 0.21162964135547938, 0.11797236489881141, 0.08907458537520666], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 546.9320000000002, 337, 1113, 512.0, 837.7, 964.6999999999999, 1040.94, 0.21166207218861968, 0.11382045251446075, 0.09053514415880413], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.591999999999999, 5, 283, 7.0, 10.0, 15.0, 33.99000000000001, 0.21043469916676277, 0.09899267474181767, 0.1530994637492561], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 558.2120000000006, 324, 1089, 508.0, 939.5000000000002, 993.95, 1057.0, 0.21160402623212793, 0.10884175454758213, 0.08555084654306734], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.3199999999999985, 2, 18, 4.0, 5.0, 7.0, 13.0, 0.21065323991002577, 0.12933574068733625, 0.10573805206421216], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.711999999999998, 3, 28, 5.0, 6.0, 6.0, 10.990000000000009, 0.21065102119402054, 0.12336867570338482, 0.09977123562412106], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 908.71, 605, 1500, 935.5, 1200.8000000000004, 1334.95, 1410.99, 0.21057490317765953, 0.1924189869652029, 0.0931547179096482], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 513.3040000000003, 275, 1144, 427.0, 897.8000000000004, 986.0, 1076.7800000000002, 0.21058049039142282, 0.18646038715117869, 0.08698783929255062], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.797999999999999, 3, 50, 6.0, 7.0, 8.0, 14.0, 0.2106608726500253, 0.14050915626949928, 0.09895300756314664], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1233.6659999999997, 937, 9637, 1154.0, 1468.9, 1491.0, 1546.7100000000003, 0.21057951482479786, 0.15822665068017183, 0.11680582462938005], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.102, 143, 206, 171.5, 189.0, 191.0, 196.99, 0.21173844035158745, 4.093954473165117, 0.1071098750997288], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.04600000000002, 194, 333, 219.0, 256.0, 259.0, 274.9200000000001, 0.21172095686016126, 0.4103561526268854, 0.1517609202493734], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.158000000000001, 6, 21, 9.0, 11.0, 12.0, 17.99000000000001, 0.21148400440732665, 0.17265686297316904, 0.13093833866625498], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.947999999999992, 6, 23, 9.0, 11.0, 12.0, 16.99000000000001, 0.21148498837255533, 0.1758423328126573, 0.13424340082242284], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.115999999999996, 7, 23, 10.0, 12.0, 14.0, 18.99000000000001, 0.2114813209123304, 0.17114910688794663, 0.1294910041133117], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.437999999999992, 8, 24, 12.0, 15.0, 17.0, 20.99000000000001, 0.2114825732015205, 0.1891178780335589, 0.14745952857996641], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.24400000000001, 6, 32, 9.0, 11.0, 13.0, 20.0, 0.2114371424862217, 0.15872445878963232, 0.1170750583883669], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2067.3440000000005, 1638, 2711, 2022.5, 2505.4, 2629.0, 2697.8, 0.211288020222799, 0.17656374197739386, 0.13494371604073294], "isController": false}]}, function(index, item){
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
