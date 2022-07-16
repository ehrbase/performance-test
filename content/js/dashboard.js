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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8811316741118911, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.388, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.838, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.322, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.956, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.575, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.503, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.965, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.869, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 280.2505424377817, 1, 6620, 22.0, 781.9000000000015, 1883.8500000000022, 3800.8100000000304, 17.30807039867102, 116.60214151818948, 143.3656242544386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 32.936000000000014, 13, 90, 29.0, 51.900000000000034, 58.0, 72.0, 0.37489296805761957, 0.21772714554057318, 0.18891090968528487], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 13.097999999999995, 4, 123, 10.0, 22.900000000000034, 28.94999999999999, 54.930000000000064, 0.3746606511152523, 4.02628044258288, 0.13537543057875331], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 13.74399999999999, 5, 73, 11.0, 24.0, 28.94999999999999, 38.99000000000001, 0.37464493026733914, 4.022936529482308, 0.1580533299565337], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 53.30200000000004, 14, 279, 45.0, 106.90000000000003, 123.94999999999999, 175.95000000000005, 0.37328029766864057, 0.2014802278558929, 4.155659563889162], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 70.592, 27, 163, 61.0, 114.0, 130.95, 154.99, 0.3745234189493869, 1.5576041303847106, 0.15580759421136603], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.480000000000001, 1, 74, 4.0, 11.0, 13.0, 16.99000000000001, 0.3745377268106839, 0.23398000900201427, 0.15837386299709583], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 62.671999999999976, 26, 148, 56.0, 106.0, 116.0, 134.95000000000005, 0.37451977202232434, 1.5371074131601006, 0.13605601092998504], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1152.142, 583, 2586, 908.5, 2160.5, 2319.0, 2448.91, 0.37438012011611776, 1.5833317675664769, 0.18207158185334632], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 15.075999999999988, 5, 49, 13.0, 27.0, 30.0, 38.99000000000001, 0.3748148414683146, 0.5573577219259935, 0.19143375203899274], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 7.640000000000002, 2, 38, 6.0, 16.0, 20.0, 31.960000000000036, 0.373553042290687, 0.36031452675872505, 0.20428682000271947], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 23.081999999999994, 8, 58, 18.0, 39.0, 44.0, 56.99000000000001, 0.37450518502428665, 0.6102935032244896, 0.24467184451293728], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.5288200898389095, 1465.6629975991325], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.123999999999992, 2, 40, 6.0, 16.0, 20.0, 29.980000000000018, 0.3735575076840779, 0.37527572629852324, 0.21924615441223716], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.693999999999996, 9, 83, 20.0, 40.0, 45.0, 63.960000000000036, 0.37449733095752225, 0.5883375012545661, 0.22272351030579204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 16.20600000000002, 5, 56, 13.0, 29.0, 36.0, 47.97000000000003, 0.3744939650297535, 0.5795550110569343, 0.21394430619375568], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2907.9779999999987, 1595, 6222, 2636.5, 4342.0, 5029.75, 5942.64, 0.37392487251031475, 0.5710059203057659, 0.2059508086873218], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 50.26400000000001, 13, 228, 40.0, 111.0, 131.79999999999995, 175.96000000000004, 0.37325856217815784, 0.20146849599754843, 3.009397157561397], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 29.496000000000006, 12, 71, 27.0, 46.0, 53.94999999999999, 63.99000000000001, 0.3745178083217857, 0.6779759828751732, 0.31234200029961423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.604, 8, 62, 18.0, 40.0, 44.0, 52.99000000000001, 0.37451500307102303, 0.6340824277092415, 0.26845118384192473], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 2.127033390410959, 622.7525684931506], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1362.0, 1362, 1362, 1362.0, 1362.0, 1362.0, 1362.0, 0.7342143906020557, 0.3362759269456681, 1404.1434356644638], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 5.902, 1, 42, 3.0, 15.0, 19.0, 26.99000000000001, 0.37358067362572744, 0.3140084195277343, 0.15796917156244142], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 576.8159999999995, 315, 1342, 461.0, 1148.0000000000005, 1214.95, 1273.98, 0.3734975128800617, 0.3288930100967583, 0.17288849717299734], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 7.524000000000007, 1, 60, 5.0, 18.0, 23.0, 32.0, 0.3736915191457113, 0.3385521086197928, 0.18246656208286685], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1685.598, 923, 3967, 1328.5, 3082.0, 3473.5499999999997, 3722.98, 0.3731761018024406, 0.35302677888383033, 0.19715651472179724], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 4.214175112612613, 593.213330518018], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 83.822, 29, 788, 69.0, 141.80000000000007, 160.95, 207.92000000000007, 0.3730438513047209, 0.20135260454553933, 17.06311319083058], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 96.04599999999992, 29, 287, 83.0, 168.80000000000007, 207.95, 251.96000000000004, 0.37339654189994614, 84.4980001756364, 0.11522783910193651], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.7406978283898306, 0.5793167372881356], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.300000000000002, 1, 40, 4.0, 16.0, 19.0, 26.970000000000027, 0.37472523272310576, 0.40718800166340535, 0.16064880582562838], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 7.9639999999999995, 2, 80, 5.0, 16.0, 21.899999999999977, 34.98000000000002, 0.3747061367122834, 0.38447996572750326, 0.13795333353567465], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.178000000000001, 1, 30, 3.0, 12.0, 15.0, 20.99000000000001, 0.37469462388153657, 0.2124891748381319, 0.14526734929782226], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 186.022, 85, 487, 137.0, 370.90000000000003, 392.95, 423.98, 0.3746676697769079, 0.341265900661738, 0.12220605635301487], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 311.04200000000003, 119, 837, 267.5, 495.90000000000003, 530.95, 734.98, 0.37329729770086195, 0.20148940372289395, 110.42819416498995], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.097999999999997, 1, 32, 4.0, 11.900000000000034, 15.0, 19.0, 0.37470417105695053, 0.2088353686171018, 0.1569805560385076], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 7.592, 2, 40, 5.0, 17.0, 20.0, 27.99000000000001, 0.37475977898167273, 0.20154683387011424, 0.15956568714454034], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 41.28399999999999, 8, 404, 31.0, 94.90000000000003, 120.79999999999995, 149.95000000000005, 0.3729392310440583, 0.15759231900886178, 0.27059946158763215], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.097999999999999, 2, 113, 7.0, 18.0, 22.0, 33.940000000000055, 0.3747288836526773, 0.19274751006709145, 0.15076982428213187], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 7.6579999999999995, 2, 85, 5.0, 16.0, 20.0, 29.0, 0.37357788239618833, 0.22936733441533938, 0.18678894119809414], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 8.463999999999999, 2, 49, 6.0, 19.0, 24.0, 34.99000000000001, 0.3735656014817106, 0.21878029967245768, 0.1762033061676428], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 762.3020000000001, 377, 1788, 623.5, 1438.8000000000002, 1560.6499999999999, 1687.8600000000001, 0.37327472422463376, 0.3410907150431953, 0.16440127014190412], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 28.195999999999984, 6, 156, 25.0, 50.0, 58.94999999999999, 88.99000000000001, 0.37345734108829953, 0.3306811579474337, 0.1535405669904044], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 13.146000000000011, 4, 48, 10.0, 24.900000000000034, 28.0, 40.0, 0.37356197318422735, 0.2490571237427772, 0.17474236831566883], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 800.9519999999994, 429, 5490, 771.5, 980.0, 1035.95, 1151.8200000000002, 0.3734060230391516, 0.2806780761654935, 0.20639434476578106], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 255.73400000000007, 144, 608, 192.0, 487.60000000000014, 509.9, 567.99, 0.37483001458838416, 7.247217537237487, 0.18887918703867795], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 384.6379999999997, 201, 870, 292.5, 683.9000000000001, 727.0, 827.8500000000001, 0.37470782157612603, 0.7262562114847197, 0.2678575443298088], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.39199999999998, 8, 80, 18.0, 38.0, 43.0, 52.99000000000001, 0.37480950307006466, 0.30589067364324585, 0.23132774017605554], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 22.801999999999992, 8, 69, 18.0, 38.0, 42.94999999999999, 52.0, 0.37481231273439825, 0.3117494090615374, 0.2371859166522364], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 23.264000000000003, 9, 74, 19.0, 39.0, 44.0, 59.97000000000003, 0.37479405066915733, 0.3033159938769896, 0.22875613444162432], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 26.534000000000013, 11, 83, 24.0, 42.0, 47.94999999999999, 63.0, 0.37479882672975284, 0.33516311877412297, 0.26060230921053124], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 24.786000000000012, 8, 79, 20.0, 43.900000000000034, 48.0, 60.0, 0.37493710430075355, 0.28146279438186744, 0.20687447649406812], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3242.8800000000006, 1694, 6620, 2894.5, 5107.6, 5601.5, 6310.6, 0.3739016638624042, 0.31245253201532996, 0.23807020003739016], "isController": false}]}, function(index, item){
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
