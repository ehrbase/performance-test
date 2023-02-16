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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8672197404807488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.449, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.741, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.756, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.0675175494606, 1, 23737, 13.0, 1066.9000000000015, 1917.7500000000036, 10689.920000000013, 9.800941440782173, 61.73879327120337, 81.20196964053625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11340.877999999999, 9000, 23737, 10809.5, 13123.800000000001, 13600.9, 20575.530000000053, 0.21090941609306335, 0.1225499048587624, 0.10669050540645196], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.242000000000001, 1, 14, 3.0, 4.0, 5.0, 7.0, 0.21162068431357445, 0.10864366206102465, 0.07687782672329073], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.611999999999998, 2, 19, 4.0, 6.0, 6.0, 8.0, 0.21161916169185288, 0.1213958280869416, 0.08969015251392982], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.396, 10, 424, 14.0, 19.0, 22.0, 45.99000000000001, 0.2104944978843198, 0.10950441793745704, 2.3438068992939596], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.082000000000015, 27, 73, 47.0, 56.0, 58.0, 59.99000000000001, 0.21156955412562745, 0.8798958748538582, 0.08842946207594585], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7100000000000004, 1, 10, 3.0, 4.0, 4.949999999999989, 7.0, 0.21157420944238772, 0.1321739624242088, 0.08987771592523305], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.456000000000046, 24, 58, 41.0, 49.0, 51.0, 53.0, 0.21156830080611755, 0.8683205209774202, 0.07727201611473435], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1168.364, 824, 1723, 1177.5, 1502.0, 1608.85, 1669.91, 0.2115007330615408, 0.8945406981343097, 0.10327184231520546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.768, 4, 16, 7.0, 9.0, 9.0, 13.990000000000009, 0.2114717503347598, 0.3144630360861739, 0.10842057512280165], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.473999999999995, 3, 17, 4.0, 5.0, 6.0, 13.970000000000027, 0.21064906876259681, 0.20318378096435985, 0.11561013344197207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.261999999999995, 6, 26, 10.0, 12.0, 14.0, 18.0, 0.2115674951085595, 0.344830223961119, 0.13863455978305023], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.7484726427335641, 2046.3529276600348], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.944000000000007, 3, 15, 5.0, 6.0, 7.0, 12.990000000000009, 0.21065022246769993, 0.21161913120580822, 0.12404500405080378], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.896000000000006, 7, 26, 17.0, 20.0, 21.0, 22.0, 0.21156659989624774, 0.33237236808505144, 0.12623749271153062], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.921999999999993, 5, 21, 8.0, 10.0, 10.949999999999989, 15.0, 0.21156651037543325, 0.32741363736040313, 0.1212788492093548], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2358.232, 1642, 3684, 2277.5, 3017.4000000000005, 3227.85, 3532.8900000000003, 0.21132641985994974, 0.32270823828047074, 0.11680737660227693], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.824000000000002, 9, 61, 13.0, 17.0, 20.0, 38.99000000000001, 0.2104905102458361, 0.1095023434697845, 1.6974908531348774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.104000000000003, 10, 27, 15.0, 18.0, 20.0, 24.99000000000001, 0.2115691960328237, 0.3829960296660211, 0.17685862480868855], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.367999999999999, 6, 23, 10.0, 13.0, 14.0, 17.0, 0.21156856937333388, 0.3581417866436762, 0.15206490923708374], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.461365582191781, 1868.2844606164385], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.6801571664222873, 2804.172012463343], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9959999999999996, 2, 18, 3.0, 4.0, 4.0, 8.990000000000009, 0.2106383310366734, 0.17710898732673416, 0.08948015039155559], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 747.9599999999998, 571, 1080, 729.5, 896.9000000000001, 912.0, 974.97, 0.2105875856933533, 0.185378770991897, 0.09789032303714469], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.88, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.2106537724088217, 0.1908453234388554, 0.10326972045823093], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 992.974, 753, 1329, 939.5, 1203.9, 1231.85, 1282.97, 0.2105826189317986, 0.1992123913920143, 0.11166636921871743], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.483999999999995, 20, 677, 27.0, 33.0, 37.0, 64.93000000000006, 0.21043151085616166, 0.10947165053533775, 9.625597625490832], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.25000000000003, 26, 264, 35.0, 42.0, 46.0, 132.7900000000002, 0.21055450792990388, 47.621182969182826, 0.06538704445479437], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.506191180019305, 0.397788972007722], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2900000000000005, 2, 26, 3.0, 4.0, 5.0, 8.0, 0.21158844523964082, 0.2298586115756653, 0.09112353940496251], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9, 2, 18, 4.0, 5.0, 5.0, 9.970000000000027, 0.211587191696303, 0.21716615085235783, 0.07831205630165901], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.278000000000001, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.21162149041629758, 0.12001046455043766, 0.08245798308213158], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.92799999999983, 91, 337, 197.0, 276.0, 313.0, 325.98, 0.21160250385010754, 0.1927380579746424, 0.06943207157581655], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.86599999999999, 81, 369, 110.0, 129.90000000000003, 139.95, 247.97000000000003, 0.2105244543100882, 0.1095796231907002, 62.27740986290226], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.112, 18, 514, 320.5, 430.0, 458.9, 491.97, 0.21158432651016196, 0.11793511999370326, 0.08905551242761701], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 536.9860000000003, 326, 1063, 506.0, 853.7, 905.0, 994.97, 0.2116212217147075, 0.11381047168994782, 0.09051767100687684], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.29800000000001, 5, 268, 7.0, 10.0, 13.0, 27.99000000000001, 0.2104097266525159, 0.0948713621999347, 0.1530812952696527], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 543.9720000000002, 321, 1042, 495.5, 881.9000000000001, 925.9, 1001.9100000000001, 0.21155872235456394, 0.10881845180798085, 0.08553253032694286], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.233999999999999, 2, 16, 4.0, 5.0, 6.0, 10.990000000000009, 0.21063744367028162, 0.12932604219720972, 0.10573012309230934], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.766, 3, 26, 5.0, 6.0, 6.949999999999989, 11.0, 0.21063540275595363, 0.12335952869802044, 0.09976383821937256], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 891.6299999999993, 588, 1442, 896.5, 1155.0, 1293.95, 1414.97, 0.21054945406632056, 0.1923957320941375, 0.09314345966019845], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 508.9939999999988, 260, 1098, 420.0, 928.8000000000001, 983.9, 1068.8000000000002, 0.21055255728713979, 0.1864356535330298, 0.08697630051998059], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.691999999999998, 3, 37, 5.0, 7.0, 7.949999999999989, 11.0, 0.2106511099417634, 0.14050264461935977, 0.0989484217597541], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1243.9339999999982, 962, 9931, 1148.5, 1479.0, 1496.95, 1548.95, 0.21056683328118295, 0.15821712193672635, 0.11679879033565616], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.2140000000001, 144, 215, 173.0, 190.0, 192.0, 197.0, 0.21169379593226137, 4.09309127506137, 0.10708729130167127], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.264, 195, 316, 223.5, 259.0, 263.0, 271.0, 0.21167856017936795, 0.41027397966171225, 0.15173053044107038], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.341999999999997, 5, 33, 9.0, 11.0, 12.0, 17.99000000000001, 0.21146978265981617, 0.17264525224961555, 0.13092953340461275], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.059999999999999, 6, 32, 9.0, 11.0, 12.0, 17.980000000000018, 0.2114704087342354, 0.1758302103559597, 0.1342341461691924], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.094000000000007, 7, 22, 10.0, 12.0, 13.949999999999989, 18.0, 0.2114677255842536, 0.17113810436418633, 0.12948267963020216], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.304000000000002, 8, 23, 12.0, 15.0, 16.0, 19.0, 0.2114684410842579, 0.18910524041529866, 0.14744967474039078], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.543999999999997, 6, 47, 10.0, 11.0, 12.0, 18.960000000000036, 0.21145028676887892, 0.15873432611533683, 0.1170823365214398], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2068.573999999997, 1661, 2733, 2003.0, 2584.7000000000003, 2651.9, 2721.0, 0.2113000744198862, 0.1765738151189852, 0.13495141471738828], "isController": false}]}, function(index, item){
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
