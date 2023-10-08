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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8724101255052117, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.771, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.78, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.453, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 466.5535417996157, 1, 20494, 11.0, 1011.9000000000015, 1889.9500000000007, 10432.910000000014, 10.562915067961269, 66.53857037918529, 87.40902360079012], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10554.655999999995, 9013, 20494, 10378.0, 11367.6, 11666.6, 19251.63000000006, 0.2273421699719187, 0.13207247992341298, 0.11455914033741216], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.850000000000002, 2, 10, 3.0, 4.0, 4.0, 6.0, 0.22825620023729515, 0.117184147487059, 0.0824753848513664], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.180000000000002, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.2282552624250752, 0.13100380886703217, 0.0962951888355786], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.26600000000001, 10, 430, 14.0, 19.0, 21.94999999999999, 51.940000000000055, 0.2269596261521038, 0.11806998285887424, 2.4972208084528846], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.77799999999998, 26, 62, 42.0, 53.0, 55.0, 58.0, 0.22822598571944364, 0.949168249651613, 0.09494557609031541], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.618, 1, 9, 2.0, 4.0, 4.0, 7.0, 0.22823150708567536, 0.142580056052517, 0.09650804938290766], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.94599999999998, 23, 54, 38.0, 47.900000000000034, 49.0, 51.0, 0.2282254648496268, 0.9366850032989992, 0.0829100321524035], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1024.3539999999991, 757, 1468, 984.5, 1281.6000000000001, 1405.95, 1436.94, 0.22815194189243823, 0.9649022424541027, 0.11095670611565843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.894000000000002, 4, 22, 7.0, 9.0, 10.0, 14.990000000000009, 0.22819817459716177, 0.3393355883211369, 0.11655043487726133], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.444, 2, 18, 4.0, 5.0, 6.0, 10.990000000000009, 0.22709559271041316, 0.2190474490976584, 0.1241929022635072], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.449999999999994, 6, 26, 9.0, 12.0, 13.0, 17.99000000000001, 0.22822567319726822, 0.37191646789161475, 0.14910446813376216], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.9012858072916667, 2464.145914713542], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.092, 3, 17, 5.0, 6.0, 7.0, 12.990000000000009, 0.22709703674702572, 0.22814159440628204, 0.13328644441890863], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.738, 6, 21, 10.0, 12.0, 13.949999999999989, 17.99000000000001, 0.22822473563587747, 0.3585423969382739, 0.13573131250219667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.531999999999996, 4, 18, 7.0, 9.0, 10.0, 14.0, 0.22822421477176666, 0.3531925736239906, 0.13038199769676123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2061.5759999999996, 1641, 2700, 2005.5, 2459.9, 2579.85, 2659.0, 0.22802510647632346, 0.34820814379696463, 0.12559195317641253], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.38999999999999, 9, 80, 13.0, 17.0, 21.0, 39.0, 0.22695612348047203, 0.11806816068289282, 1.8298337455613056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.035999999999992, 9, 25, 14.0, 17.900000000000034, 19.0, 23.0, 0.22822692329110528, 0.4131509081776902, 0.19033768797910536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.665999999999997, 6, 20, 10.0, 12.0, 13.0, 18.0, 0.22822629824247492, 0.3864045073495715, 0.16359189737302401], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.132408405172413, 2351.4278017241377], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.8268577317290552, 3408.989945409982], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9819999999999993, 1, 45, 3.0, 4.0, 4.0, 8.990000000000009, 0.22707733754546655, 0.19086692890503762, 0.09602000698944045], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 709.2919999999998, 539, 930, 698.5, 843.9000000000001, 861.9, 898.96, 0.22702289889171962, 0.19991095523403565, 0.10508677155729991], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.769999999999999, 2, 12, 4.0, 5.0, 6.0, 9.990000000000009, 0.22708734142490947, 0.20573359132158475, 0.1108824909301316], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 960.6859999999996, 741, 1271, 915.0, 1158.8000000000002, 1188.95, 1235.91, 0.2270068197388786, 0.21474978159106353, 0.1199323139440755], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.34799999999997, 20, 1136, 27.0, 34.0, 38.0, 75.96000000000004, 0.2268412134190188, 0.11800838164106008, 10.347415116017938], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.84999999999996, 27, 312, 37.0, 44.900000000000034, 50.0, 133.87000000000012, 0.22702485740568706, 51.3463516729405, 0.07005845209003624], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 1.0902579261954262, 0.8527156964656964], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.318000000000002, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.22823077783331394, 0.24800260625283863, 0.09784503073127424], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9560000000000017, 2, 10, 4.0, 5.0, 6.0, 7.990000000000009, 0.22823015276357045, 0.23418330450215927, 0.08402614022643169], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2559999999999993, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.22825672124741384, 0.12944429745662667, 0.0884940608742415], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.70400000000004, 87, 171, 127.0, 155.0, 159.0, 167.0, 0.22824567634215304, 0.2078974851377828, 0.0744473202131632], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.78399999999993, 70, 456, 100.0, 119.90000000000003, 126.0, 360.7000000000003, 0.22699373134111528, 0.11808772521750538, 67.12053897732059], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.29599999999996, 15, 442, 316.5, 413.0, 424.95, 437.98, 0.2282276525188345, 0.12719902692287502, 0.09561490520564453], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 503.26999999999964, 376, 688, 481.5, 609.0, 627.95, 661.97, 0.22819723726168792, 0.1227250981761564, 0.09716210492782806], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.65, 5, 311, 7.0, 10.0, 13.0, 27.99000000000001, 0.22681137232220824, 0.10226667843250661, 0.16457114222207103], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 472.518, 334, 609, 478.0, 560.0, 575.9, 598.98, 0.22819588334626442, 0.11737602902081147, 0.09181318744009859], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.272000000000001, 2, 14, 4.0, 5.0, 6.0, 10.0, 0.2270762031405547, 0.13941902312158022, 0.11353810157027736], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.727999999999998, 3, 35, 4.0, 6.0, 6.0, 9.990000000000009, 0.2270731093665841, 0.13298634220530678, 0.1071057732656837], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 779.0160000000003, 543, 1166, 750.0, 986.7, 1109.95, 1140.0, 0.2269993993595893, 0.20742735153785283, 0.09997727452263162], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 285.76999999999947, 192, 415, 274.0, 353.0, 364.95, 376.99, 0.22703403194732083, 0.201029323346636, 0.09334114008771686], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.302000000000003, 3, 42, 5.0, 6.0, 7.0, 11.980000000000018, 0.22709817136010457, 0.15140839118091504, 0.10623049226708017], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1275.630000000001, 960, 11355, 1193.0, 1498.9, 1517.0, 1557.99, 0.22700341867148519, 0.17063164197815317, 0.1254725927422467], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.1399999999999, 143, 198, 176.0, 186.0, 188.0, 190.0, 0.22825953474315552, 4.413324544057286, 0.11502140617916821], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.2240000000001, 197, 330, 233.5, 253.0, 256.0, 264.99, 0.2282406752272136, 0.44237456106465145, 0.16315642018195345], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.41800000000001, 6, 28, 8.0, 11.0, 12.0, 17.0, 0.22819525846764147, 0.18623540962303967, 0.14083926108549744], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.428000000000008, 5, 24, 8.0, 11.0, 12.0, 20.970000000000027, 0.22819640408106448, 0.1898019133983237, 0.14440553695754862], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.561999999999994, 6, 32, 9.0, 12.0, 13.0, 17.0, 0.22819338385230595, 0.18467396399633249, 0.1392781883864172], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.807999999999986, 8, 23, 11.5, 15.0, 16.0, 19.99000000000001, 0.2281938004308299, 0.20406186034425317, 0.15866600186206142], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.019999999999994, 5, 34, 9.0, 11.0, 12.0, 31.980000000000018, 0.228178908693297, 0.1712923915054925, 0.12589949551925078], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2081.9399999999996, 1619, 2758, 2033.5, 2535.7000000000003, 2659.8, 2730.96, 0.22800368636360113, 0.19053226021308312, 0.14517422217682416], "isController": false}]}, function(index, item){
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
