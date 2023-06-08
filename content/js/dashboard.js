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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8922569666028505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.201, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.653, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.964, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.123, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.7878323760907, 1, 22576, 9.0, 838.9000000000015, 1501.0, 6041.980000000003, 15.260886163722917, 96.13228479768532, 126.28513533161345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6233.983999999997, 5105, 22576, 6036.5, 6490.400000000001, 6679.65, 21890.380000000136, 0.3294506476340831, 0.19135420194534017, 0.1660122404093622], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4039999999999995, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.33058200946257943, 0.16971705878376234, 0.1194485776378461], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7419999999999978, 2, 16, 4.0, 5.0, 5.0, 8.0, 0.33057938665622916, 0.18973126106614496, 0.13946317874559666], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.437999999999992, 8, 363, 11.0, 14.900000000000034, 17.94999999999999, 31.99000000000001, 0.32824401922984764, 0.17076061668352746, 3.6116458639284112], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.73600000000005, 24, 60, 34.0, 40.0, 41.0, 46.99000000000001, 0.33052125846630204, 1.3746036998467044, 0.13750200791664519], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1660000000000013, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.3305293427424019, 0.2064872322712324, 0.1397648490307227], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.823999999999998, 21, 49, 30.0, 35.0, 37.0, 42.97000000000003, 0.330521476955051, 1.3565292152478152, 0.12007225530007715], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.5900000000005, 657, 1094, 863.0, 1035.8000000000002, 1063.0, 1082.0, 0.33037406272878406, 1.3972209542970433, 0.16067019847552194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6239999999999934, 3, 19, 5.0, 7.0, 8.0, 13.980000000000018, 0.33044305805223645, 0.49137592668625096, 0.16877121031378875], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9440000000000004, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.3284242663494526, 0.3167850899570487, 0.1796070206598569], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.715999999999992, 5, 23, 7.0, 10.0, 11.0, 15.990000000000009, 0.33052409884257067, 0.5386219423628771, 0.21593810754460918], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.9991159064665127, 2731.6167183891457], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.038000000000005, 2, 17, 4.0, 5.0, 6.0, 11.0, 0.3284270707983668, 0.32993770703221476, 0.19275846635724458], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.000000000000004, 5, 28, 8.0, 10.0, 11.0, 15.0, 0.3305236618584288, 0.5192546094416728, 0.19657120124197572], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.551999999999995, 4, 14, 6.0, 8.0, 9.0, 12.0, 0.3305221324230313, 0.511505594211037, 0.1888236791674544], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1566.705999999999, 1319, 1925, 1547.0, 1779.9, 1834.6, 1897.99, 0.3301441409319309, 0.5041500923990915, 0.18183720262266506], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.746, 7, 65, 10.0, 13.0, 16.0, 38.960000000000036, 0.3282321678027876, 0.17075445127951464, 2.6463718529099753], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.835999999999997, 8, 24, 11.0, 13.0, 14.949999999999989, 19.0, 0.3305258467906932, 0.5983389330609139, 0.27565339175708203], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.675999999999998, 5, 18, 7.0, 10.0, 11.0, 14.990000000000009, 0.33052562829616683, 0.5596050654622533, 0.23691973747010397], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 10.969295058139537, 3171.6933139534885], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.9890558368869936, 4077.7043909914714], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.329999999999998, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.32842922809935376, 0.27605695402089336, 0.13887681227248067], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 550.3320000000001, 440, 681, 540.0, 641.0, 653.95, 675.98, 0.32831320554507876, 0.28910478571489545, 0.15197310491051497], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.329999999999998, 1, 16, 3.0, 4.0, 5.0, 10.970000000000027, 0.32842340345173, 0.2975406988439496, 0.16036298996666504], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 752.7700000000001, 616, 953, 731.5, 870.0, 884.95, 916.9300000000001, 0.32828669145450046, 0.3105611336707902, 0.17344052741883276], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.072215544871795, 844.1882011217949], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.72200000000001, 15, 717, 20.0, 25.0, 28.0, 79.81000000000017, 0.3280796839936484, 0.17067512544946917, 14.965431679046207], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.708000000000002, 21, 337, 28.0, 34.0, 38.94999999999999, 92.98000000000002, 0.3283617180147776, 74.2657717828186, 0.10133037391862278], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 1.3143209586466165, 1.0279605263157894], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6559999999999975, 1, 10, 2.0, 4.0, 4.0, 7.0, 0.3305302167418843, 0.35916433346763876, 0.14170191909149144], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.318, 2, 23, 3.0, 4.0, 5.0, 7.0, 0.33052956124183924, 0.339151089152747, 0.12168910604313808], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8080000000000003, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.33058288374061146, 0.18747342423536179, 0.12816543441896752], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.09000000000003, 66, 121, 92.0, 111.0, 114.0, 117.0, 0.33056583615305996, 0.30109576273273486, 0.10782127858898634], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.79400000000001, 58, 380, 80.0, 94.0, 105.0, 326.6600000000003, 0.3283045826066858, 0.17079212324258555, 97.07748492917813], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.00799999999995, 12, 367, 260.0, 334.0, 338.0, 350.0, 0.33052715776391767, 0.18421401778070848, 0.1384728033991413], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 419.76599999999974, 327, 537, 405.0, 494.0, 507.0, 527.97, 0.33046511643277443, 0.17772504323309884, 0.14070585035614225], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.134000000000002, 4, 298, 6.0, 8.0, 9.949999999999989, 27.99000000000001, 0.32801898836319837, 0.1479000460128636, 0.23800596518931288], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.87400000000025, 288, 510, 398.5, 456.90000000000003, 469.0, 489.96000000000004, 0.3304561616855908, 0.1699751610560718, 0.13295697130318693], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4899999999999998, 2, 18, 3.0, 5.0, 6.0, 9.990000000000009, 0.3284255607045385, 0.2016449553423344, 0.16421278035226927], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.172000000000006, 1, 32, 4.0, 5.0, 6.0, 9.980000000000018, 0.3284193047494686, 0.1923401770032264, 0.15490871503319661], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.7899999999993, 530, 888, 678.5, 796.0, 837.9, 850.99, 0.3282696643377028, 0.29996602306389836, 0.14457970567998435], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.36000000000007, 175, 310, 237.0, 281.0, 286.0, 296.0, 0.32837702937004154, 0.2907643909180765, 0.13500657164530025], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.389999999999996, 2, 46, 4.0, 5.0, 6.0, 8.990000000000009, 0.32842922809935376, 0.2189667171051854, 0.15363046900350633], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 996.4320000000008, 814, 10351, 931.5, 1081.0, 1110.95, 1155.0, 0.32822117906237713, 0.2467139880235374, 0.18141912827080608], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.59600000000017, 117, 166, 135.0, 153.0, 154.0, 161.99, 0.3305315277497744, 6.390720570092516, 0.16655690265515977], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.53400000000008, 158, 218, 176.5, 205.0, 207.95, 212.0, 0.33050946050279745, 0.6405912415571359, 0.2362626221562966], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.018000000000007, 5, 27, 7.0, 9.0, 9.949999999999989, 14.0, 0.33043759851170906, 0.269677739699434, 0.20394195533144543], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.952, 5, 27, 7.0, 9.0, 10.0, 14.0, 0.33044087421437685, 0.2748435517354755, 0.20910711571378532], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.299999999999999, 6, 16, 8.0, 10.0, 11.0, 14.990000000000009, 0.3304327942652728, 0.26741500091364667, 0.20168017228105029], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.618000000000002, 7, 26, 9.0, 12.0, 13.0, 16.0, 0.33043454124781335, 0.2954904431308937, 0.2297552669613702], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.778000000000007, 5, 32, 7.0, 9.0, 11.0, 19.980000000000018, 0.33046489801853246, 0.24807780444904892, 0.18233658923874108], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.64, 1365, 2069, 1583.5, 1811.0, 1882.95, 1952.98, 0.3301038176506511, 0.2758526736346081, 0.21018329014475054], "isController": false}]}, function(index, item){
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
