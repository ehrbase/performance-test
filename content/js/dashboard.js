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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8604552222931291, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.45, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.962, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.551, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.695, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.293, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 494.53367368644894, 1, 29754, 14.0, 1230.800000000003, 2327.9000000000015, 9677.980000000003, 10.022992544479827, 63.137481051645594, 82.9411186433098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9876.672, 8459, 29754, 9654.5, 10357.8, 10619.65, 29027.290000000165, 0.21627981417238368, 0.1256091487172444, 0.1089847501103027], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.4700000000000024, 2, 16, 3.0, 4.0, 5.0, 12.960000000000036, 0.21704629510656104, 0.11142910918014669, 0.07842493084905038], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.029999999999999, 3, 16, 5.0, 6.0, 7.0, 10.990000000000009, 0.21704507027702333, 0.12456988110596619, 0.09156588902311921], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.74200000000001, 13, 582, 18.0, 24.0, 28.0, 86.99000000000001, 0.21551529059435237, 0.11211635786378657, 2.371299588990789], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.914, 31, 82, 56.0, 68.0, 70.0, 73.99000000000001, 0.21698478806444796, 0.902417272244087, 0.09026906222212384], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.461999999999999, 2, 11, 3.0, 4.0, 5.0, 9.0, 0.21699109728926042, 0.13555798324893825, 0.09175502453735328], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.04799999999998, 28, 79, 49.0, 60.0, 62.0, 68.99000000000001, 0.21698196315733057, 0.8905393226376415, 0.078825478803249], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1217.6000000000004, 819, 1777, 1193.0, 1516.0000000000007, 1679.8, 1757.0, 0.21690468340592411, 0.9173352358133492, 0.1054868479845217], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.740000000000007, 5, 27, 8.0, 11.0, 12.0, 19.980000000000018, 0.21693573929530593, 0.32258810506089386, 0.11079823403461427], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.458000000000001, 3, 32, 5.0, 7.0, 7.0, 14.0, 0.21568011705391313, 0.20803653165558644, 0.11795006401385874], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.155999999999997, 8, 33, 12.0, 15.0, 16.0, 23.980000000000018, 0.21697989160552533, 0.353590346602594, 0.14175737058993795], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.7150697314049587, 1955.0248579545455], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.131999999999999, 4, 71, 6.0, 7.0, 8.949999999999989, 15.990000000000009, 0.21568272208849895, 0.21667477835904272, 0.1265872226320194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.376000000000008, 8, 34, 12.0, 15.0, 16.94999999999999, 21.99000000000001, 0.21697782009327443, 0.3408734267209488, 0.12904247308281655], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.437999999999995, 7, 24, 9.0, 11.0, 13.0, 18.99000000000001, 0.2169770668258989, 0.3357868433297561, 0.12395662509096764], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2334.3700000000013, 1936, 2946, 2288.5, 2712.9, 2813.0, 2918.99, 0.21674850367670487, 0.331012642100319, 0.11938101179068511], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.62400000000001, 13, 102, 16.0, 23.0, 29.94999999999999, 81.98000000000002, 0.21550785935612288, 0.11211249195078145, 1.7375321160587405], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.47600000000001, 12, 37, 17.0, 21.0, 23.0, 32.0, 0.21698271645870318, 0.39279592902994404, 0.1809601951716138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.338000000000001, 8, 43, 12.0, 15.0, 16.0, 24.970000000000027, 0.21698120986118843, 0.3673657161605869, 0.15553145316221906], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.299771769662922, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.7147414291217257, 2946.7540206086287], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.502000000000002, 2, 23, 3.0, 4.0, 5.0, 11.990000000000009, 0.2156603022436004, 0.18127048705477472, 0.09119229577292869], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 769.1439999999998, 572, 1006, 727.0, 947.9000000000001, 957.0, 979.99, 0.21560236714150932, 0.18986651895748496, 0.09980031447761271], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.6579999999999995, 3, 17, 4.0, 6.0, 7.0, 14.0, 0.21566393003517048, 0.1953843598954375, 0.10530465333748558], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1059.1440000000016, 818, 1374, 1018.0, 1319.9, 1339.9, 1361.96, 0.2155893523005971, 0.20394879049522596, 0.11390023397912405], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.933675130208333, 685.9029134114584], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.27600000000003, 25, 1680, 34.0, 42.0, 49.89999999999998, 127.94000000000005, 0.215353127444258, 0.11204419433810786, 9.823383381759074], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.870000000000005, 30, 494, 45.0, 63.900000000000034, 73.94999999999999, 212.84000000000015, 0.21560153042590358, 48.762730781899435, 0.06653328477986868], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.8696750621890548, 0.6801927860696517], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.034000000000001, 3, 14, 4.0, 5.0, 6.0, 10.0, 0.2170247212860017, 0.23582575939662784, 0.09304087172319798], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.939999999999998, 3, 13, 5.0, 6.0, 7.0, 11.0, 0.21702396769294408, 0.22268481747524732, 0.07990042560570304], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.785999999999999, 1, 23, 2.0, 4.0, 4.0, 9.990000000000009, 0.21704686041716406, 0.12308718975864388, 0.0841480503765763], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.60799999999995, 86, 181, 128.0, 163.0, 168.0, 172.0, 0.21703677948672537, 0.19768786581549183, 0.07079129330914675], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 126.94600000000003, 81, 673, 121.0, 154.90000000000003, 174.95, 600.8200000000011, 0.21555951706045798, 0.1121393655598404, 63.73951774485944], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 266.7859999999999, 16, 552, 297.0, 497.0, 511.0, 542.0, 0.2170211417655885, 0.12095325763382718, 0.09091999005609129], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 590.8019999999997, 458, 762, 565.5, 708.9000000000001, 719.95, 746.98, 0.21698855472169265, 0.11669703805740564, 0.0923896580650957], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.803999999999984, 6, 397, 9.0, 13.0, 17.0, 37.930000000000064, 0.21531909212857994, 0.09708493947918617, 0.15623250532376454], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 550.5700000000003, 411, 728, 544.0, 649.9000000000001, 663.95, 685.97, 0.2169816806706643, 0.11160783303324766, 0.0873012230823376], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.082000000000001, 3, 18, 5.0, 6.0, 7.0, 15.0, 0.21565918602459463, 0.13240926449758095, 0.10782959301229732], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.633999999999996, 3, 34, 5.0, 6.0, 7.0, 15.0, 0.21565620949706815, 0.12629998573973314, 0.10172065350301164], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 944.5760000000005, 675, 1440, 917.5, 1172.8000000000002, 1342.6999999999998, 1408.97, 0.21557717555096134, 0.19698995989725593, 0.09494658806004255], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 331.30800000000016, 225, 437, 327.0, 402.0, 405.95, 411.99, 0.2156201256375348, 0.19092277745782146, 0.08864850868496305], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.196000000000004, 4, 181, 7.0, 8.0, 9.0, 16.0, 0.2156844898263783, 0.1437987871575847, 0.10089147522151876], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1575.471999999999, 1262, 14421, 1440.0, 1774.8000000000002, 1800.0, 5627.620000000035, 0.2155756884086246, 0.16205397120598644, 0.11915609339773585], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.59800000000004, 129, 224, 178.5, 207.0, 209.0, 214.99, 0.21705543465567848, 4.196696879562234, 0.10937559011946296], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 236.15600000000006, 180, 401, 231.0, 282.90000000000003, 287.0, 292.99, 0.21702952556477592, 0.4206451852379555, 0.1551421999154453], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.700000000000008, 7, 24, 11.0, 13.0, 14.949999999999989, 20.99000000000001, 0.21693310390488266, 0.17704410572690377, 0.13388840006629474], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.697999999999997, 7, 24, 11.0, 13.0, 15.0, 20.99000000000001, 0.2169343274710447, 0.1804347031741831, 0.1372787541027705], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.054000000000006, 7, 53, 12.0, 15.0, 16.0, 24.0, 0.2169303744608738, 0.17555895568307686, 0.1324037930059044], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.560000000000008, 10, 38, 14.0, 18.0, 19.0, 28.99000000000001, 0.21693150387765064, 0.19399057364824557, 0.15083518628992895], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.128000000000004, 7, 48, 11.0, 13.0, 14.0, 43.79000000000019, 0.2169236923189056, 0.1628431753149081, 0.1196893419533024], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2633.866, 2181, 3316, 2583.5, 3078.9, 3186.0, 3281.95, 0.21670660569409608, 0.18109180620946774, 0.13798115909428776], "isController": false}]}, function(index, item){
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
