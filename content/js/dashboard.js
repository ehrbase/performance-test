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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8922995107423952, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.186, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.656, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.968, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.132, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.6311423101472, 1, 17923, 9.0, 832.9000000000015, 1502.0, 6072.0, 15.282457260483811, 96.26814832435869, 126.46363799813463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6219.77, 5283, 17923, 6057.5, 6634.7, 6827.7, 15293.090000000075, 0.32959180713869485, 0.19141752306977855, 0.16608337156598296], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.436000000000001, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.3307641777103313, 0.16981058189853346, 0.1195144001492408], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7260000000000013, 2, 13, 4.0, 4.900000000000034, 5.0, 9.990000000000009, 0.3307619896259809, 0.18983606340145046, 0.1395402143734607], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.564000000000021, 8, 373, 12.0, 16.0, 20.0, 34.99000000000001, 0.3289051733494716, 0.17110456532714555, 3.618920496219235], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.22400000000002, 24, 48, 34.0, 41.0, 43.0, 46.0, 0.3307366099629774, 1.375499324429132, 0.13759159750412925], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2880000000000016, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.3307447047772765, 0.2066217725518277, 0.13985591520367258], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.41799999999999, 22, 51, 30.0, 36.0, 38.0, 42.98000000000002, 0.33073770383364687, 1.3574166555456115, 0.12015080647081704], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 852.1600000000001, 666, 1112, 852.0, 1010.1000000000004, 1061.0, 1085.99, 0.33054966442598066, 1.3979636105724988, 0.16075559851966637], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.600000000000002, 3, 21, 5.0, 7.0, 8.0, 11.0, 0.3307064219880086, 0.4917675545169537, 0.1689057213864536], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.803999999999998, 2, 25, 4.0, 5.0, 5.0, 8.990000000000009, 0.3290809493063961, 0.31741850042912156, 0.17996614415193535], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.508000000000008, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.3307372662845108, 0.5389693199429941, 0.21607737416439232], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.8433083576998051, 2305.6336044103314], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.961999999999996, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.32908571432332406, 0.3305993800601042, 0.19314503350421655], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.02999999999999, 5, 27, 8.0, 10.0, 11.0, 17.980000000000018, 0.3307333283943823, 0.5195839967981707, 0.19669589550017463], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.658, 4, 32, 6.0, 8.0, 9.0, 11.990000000000009, 0.3307326720884776, 0.5118314187356752, 0.18894395817554627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.1379999999988, 1314, 1951, 1550.0, 1749.9, 1854.1999999999998, 1913.96, 0.33039720351806945, 0.5045365342902738, 0.1819765847501867], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.786000000000012, 8, 48, 11.0, 15.0, 18.0, 33.99000000000001, 0.3288969519803872, 0.1711002883686251, 2.651731675341872], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.758000000000001, 8, 21, 11.0, 13.0, 14.0, 17.99000000000001, 0.3307412042684137, 0.598728786879298, 0.2758329965285403], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.665999999999999, 5, 26, 7.0, 9.0, 11.0, 14.0, 0.3307401103745896, 0.5599681999585252, 0.23707347755366093], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.999713766163793, 4121.64517106681], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.358000000000001, 1, 15, 2.0, 3.0, 3.9499999999999886, 8.0, 0.3291199398632046, 0.2766375228902918, 0.1391688808210621], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 551.8419999999994, 426, 683, 544.5, 637.0, 649.9, 672.99, 0.32899000725751953, 0.289700761175955, 0.15228639007818776], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2760000000000016, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.329095677986461, 0.2981497572508005, 0.16069124901682666], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 748.1840000000001, 615, 940, 729.5, 870.9000000000001, 890.0, 914.99, 0.3289434730378193, 0.31118245289693935, 0.173787518470176], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.755999999999993, 16, 895, 22.0, 27.0, 30.94999999999999, 66.96000000000004, 0.32870559680445566, 0.1710007406969742, 14.993982838609497], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.001999999999995, 22, 286, 29.0, 35.0, 40.0, 113.8900000000001, 0.32902637804472784, 74.41609835071415, 0.10153548384974023], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.1400305706521738, 0.8916440217391304], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.636, 1, 7, 2.0, 4.0, 4.0, 6.0, 0.3306959231145207, 0.3593443951257405, 0.14177295922585406], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.334000000000002, 2, 16, 3.0, 4.0, 5.0, 6.990000000000009, 0.3306930797843352, 0.3393188729103504, 0.12174930769403747], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8239999999999996, 1, 9, 2.0, 3.0, 3.0, 6.990000000000009, 0.33076549057483734, 0.18757698049972052, 0.12823623023262737], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.42, 65, 122, 91.0, 111.0, 114.0, 118.0, 0.33074098548907, 0.30125529743702195, 0.10787840737631775], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.34000000000005, 58, 373, 81.0, 93.0, 101.0, 298.7800000000002, 0.32897225776950234, 0.17113946429335114, 97.27491204104258], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.91799999999998, 12, 369, 260.0, 334.0, 337.0, 356.99, 0.3306893616570976, 0.18430441952277557, 0.1385407579598583], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 421.7200000000002, 328, 530, 414.0, 491.90000000000003, 504.0, 524.98, 0.3306305388881027, 0.17781400788190144, 0.14077628413595], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.279999999999994, 5, 286, 6.0, 8.0, 11.0, 24.0, 0.3286468295440354, 0.1481831324890396, 0.2384615179211116], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.1939999999999, 288, 498, 391.0, 459.90000000000003, 471.95, 484.98, 0.3306126119454304, 0.17005563363064222, 0.13301991808741925], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5079999999999982, 2, 12, 3.0, 5.0, 5.0, 10.0, 0.3291179901159285, 0.20207008941971233, 0.16455899505796426], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.238000000000001, 2, 25, 4.0, 5.0, 6.0, 12.0, 0.3291132241642828, 0.1927465738901973, 0.15523602272592638], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.3340000000002, 526, 887, 682.0, 791.6000000000001, 838.95, 861.97, 0.32896057012814334, 0.3005973584712939, 0.14488400110136], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.91200000000003, 176, 337, 239.0, 287.90000000000003, 293.0, 313.99, 0.3290393695605679, 0.29135086599049076, 0.13527888143066316], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.529999999999998, 3, 63, 4.0, 5.0, 6.0, 11.0, 0.329088530080008, 0.21940627965910378, 0.1539388729573475], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 981.9239999999998, 799, 8471, 927.0, 1083.0, 1108.0, 1141.91, 0.328861258696736, 0.2471951166322897, 0.1817729222874537], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.58199999999988, 117, 162, 137.0, 149.0, 151.0, 154.99, 0.330713640350239, 6.394241658533867, 0.16664867033273761], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.894, 159, 230, 179.5, 202.0, 204.0, 210.99, 0.3306880493968581, 0.6409373813656623, 0.23639028531103526], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.041999999999999, 5, 15, 7.0, 9.0, 10.0, 12.0, 0.3307031410184334, 0.26989445505909665, 0.20410584484731434], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.8219999999999965, 5, 16, 7.0, 9.0, 9.0, 11.0, 0.3307044533984512, 0.27506278320702626, 0.20927391191620742], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.40399999999999, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.33069876649360097, 0.26763024880948444, 0.201842508846192], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.781999999999996, 7, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.33070051628964603, 0.29572829079257007, 0.2299402027326445], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.750000000000004, 5, 29, 7.0, 9.0, 10.0, 14.980000000000018, 0.3307022661042083, 0.2482559950946933, 0.18246755893445085], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.523999999999, 1380, 1968, 1590.5, 1827.9, 1867.0, 1954.9, 0.33034917908229, 0.2760577109692445, 0.21033951636880183], "isController": false}]}, function(index, item){
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
