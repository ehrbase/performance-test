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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8894065092533503, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.188, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.574, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.947, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.098, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.34647947245264, 1, 17905, 9.0, 845.0, 1513.9500000000007, 6044.980000000003, 15.230468972738723, 95.94066066249462, 126.03343048049035], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6170.448000000005, 5124, 17905, 6036.0, 6448.7, 6619.4, 14957.75000000007, 0.328433327049309, 0.19074471086864705, 0.16549960620844087], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4379999999999984, 1, 10, 2.0, 3.0, 4.0, 8.0, 0.3295394554294591, 0.16918182335334078, 0.11907187354384753], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6860000000000004, 2, 13, 4.0, 5.0, 5.0, 7.0, 0.32953706632922075, 0.18913303637924445, 0.13902344985763998], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.249999999999995, 8, 339, 10.5, 14.0, 16.0, 62.76000000000022, 0.32757628924200155, 0.17041324711143227, 3.604298877821906], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 32.61600000000001, 23, 55, 32.0, 39.0, 40.0, 43.99000000000001, 0.32949493698079835, 1.3703353350288046, 0.13707504214240246], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3200000000000016, 1, 25, 2.0, 3.0, 4.0, 7.980000000000018, 0.3295031882728497, 0.20584617633791474, 0.1393309380099062], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.744000000000014, 21, 42, 29.0, 34.0, 35.0, 37.0, 0.3294960226535106, 1.3523205364903665, 0.11969972697959562], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.0479999999998, 690, 1103, 859.0, 1019.4000000000002, 1058.95, 1074.98, 0.3293430133831827, 1.3928604311412922, 0.16016877018049314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.635999999999995, 4, 16, 5.0, 7.0, 8.0, 12.0, 0.3294712710935745, 0.4899308586004851, 0.16827487771673771], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.046, 2, 22, 4.0, 5.0, 5.949999999999989, 12.990000000000009, 0.32772658688490636, 0.3161121358711825, 0.17922547720268317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.920000000000002, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.32949645692459867, 0.5369472974947725, 0.2152667282056216], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.9243956997863247, 2527.32914329594], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.126000000000001, 2, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.3277306683149334, 0.3292381013693898, 0.1923497379465576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.150000000000006, 5, 23, 8.0, 10.0, 11.0, 14.990000000000009, 0.3294962397889115, 0.51764052335041, 0.19596016604633507], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.6380000000000035, 5, 28, 6.0, 8.0, 8.949999999999989, 11.0, 0.3294947198471144, 0.5099156030165242, 0.18823672960015816], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.9800000000002, 1337, 1935, 1537.5, 1763.0, 1824.6, 1887.8500000000001, 0.3291671741327268, 0.5026582049444202, 0.18129910762779095], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.710000000000008, 7, 85, 10.0, 13.0, 16.0, 37.99000000000001, 0.3275662027674103, 0.17040799987912805, 2.6410025098122456], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.131999999999987, 8, 28, 11.0, 13.0, 15.0, 22.99000000000001, 0.329499062575167, 0.5964801828966921, 0.27479706976483653], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.808000000000002, 5, 26, 8.0, 9.0, 11.0, 15.0, 0.32949841115866135, 0.5578659086034011, 0.2361834314359936], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.626116071428571, 2783.3227040816328], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.8327956687612208, 3433.471022217235], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.361999999999999, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.3277502176261445, 0.2754862205205067, 0.13858969163293025], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 572.8739999999996, 440, 714, 571.5, 656.9000000000001, 670.0, 696.9100000000001, 0.327643691417308, 0.28851522752724684, 0.15166319309746482], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3440000000000016, 1, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.3277476395614999, 0.29692847919687404, 0.1600330271296386], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 769.5900000000003, 610, 951, 758.0, 883.9000000000001, 901.95, 937.96, 0.32758530321295665, 0.309897616284593, 0.1730699697638765], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.315104166666667, 877.9557291666667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.29599999999999, 15, 624, 20.0, 25.0, 31.0, 56.99000000000001, 0.3274340629655703, 0.17033925750233295, 14.935981524532997], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.284000000000006, 20, 291, 29.0, 36.0, 40.94999999999999, 92.99000000000001, 0.3276907176361178, 74.11401121435462, 0.10112330739552074], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 1.222410402097902, 0.9560751748251748], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.793999999999998, 1, 14, 3.0, 4.0, 4.0, 7.990000000000009, 0.3294895087245527, 0.35803346802040725, 0.14125575618171743], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.402000000000001, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.3294875545960878, 0.3380819028219291, 0.12130547664328623], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9039999999999997, 1, 9, 2.0, 3.0, 3.0, 5.0, 0.3295411929786635, 0.18688268181117157, 0.12776157579348577], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.734, 66, 126, 92.0, 111.0, 115.0, 118.0, 0.3295233839678965, 0.3001462455670867, 0.10748126000515373], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 85.89400000000005, 58, 368, 83.0, 96.0, 109.89999999999998, 299.82000000000016, 0.32763510361132514, 0.17044384379373928, 96.87952443600894], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.83599999999993, 12, 360, 261.0, 333.0, 337.0, 347.0, 0.3294847320070035, 0.18363303848019238, 0.13803608401465284], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 437.06799999999987, 348, 543, 429.0, 501.0, 513.0, 530.99, 0.3294293756127386, 0.17716801898797976, 0.14026485133511138], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.3580000000000005, 4, 284, 6.0, 8.0, 10.0, 33.99000000000001, 0.32737617814502107, 0.14761021016732195, 0.23753955113452213], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 408.79600000000005, 315, 510, 411.0, 468.0, 473.0, 491.99, 0.3294235154364565, 0.16944400372610938, 0.13254149253888678], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5339999999999976, 2, 20, 3.0, 5.0, 5.0, 8.990000000000009, 0.32774678021563114, 0.20122820135680614, 0.16387339010781557], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.304000000000005, 2, 40, 4.0, 5.0, 6.0, 10.990000000000009, 0.32773883147997024, 0.19194165490903609, 0.15458774961408753], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.4659999999998, 533, 882, 678.0, 787.5000000000002, 826.9, 849.95, 0.32758766409685064, 0.2993428253633439, 0.1442793325270309], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.74600000000004, 174, 341, 236.0, 293.0, 298.95, 312.99, 0.32770210043938297, 0.2901667690326103, 0.134729086215801], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.591999999999999, 3, 51, 4.0, 5.0, 6.0, 14.960000000000036, 0.32773303129457165, 0.21850255644054398, 0.15330480663095686], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.7020000000005, 824, 8687, 927.0, 1090.5000000000002, 1108.9, 1132.99, 0.32756105246676404, 0.2462177907169853, 0.181054253609559], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.43599999999986, 117, 172, 133.0, 150.0, 151.0, 160.96000000000004, 0.32950644547557995, 6.370900934669745, 0.16604035729042896], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.602, 160, 251, 179.0, 203.0, 204.0, 212.99, 0.3294875545960878, 0.6386105903148451, 0.23553211910579713], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.077999999999992, 5, 17, 7.0, 9.0, 10.0, 12.0, 0.3294658436170605, 0.2688846681339977, 0.20334220035740455], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.042000000000005, 5, 24, 7.0, 9.0, 10.0, 14.990000000000009, 0.3294680145862079, 0.2740343776398625, 0.2084914779803347], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.552000000000003, 6, 38, 8.0, 10.0, 11.0, 16.99000000000001, 0.3294615017645958, 0.2666289464134162, 0.20108734238561757], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.817999999999998, 7, 25, 9.0, 12.0, 13.0, 16.0, 0.32946345558404316, 0.29462205167271893, 0.22908005896078001], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.926000000000001, 5, 33, 8.0, 9.0, 11.0, 15.0, 0.3294343677792104, 0.24730419224175476, 0.18176798612817766], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1625.3520000000005, 1378, 1959, 1605.5, 1813.9, 1870.75, 1944.96, 0.3291199398632046, 0.27503049193392853, 0.2095568367097748], "isController": false}]}, function(index, item){
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
