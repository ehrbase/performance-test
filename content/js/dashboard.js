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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8795575409487343, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.386, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.834, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.334, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.939, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.514, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.956, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.879, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 286.8053180174438, 1, 7186, 27.0, 804.0, 1884.0, 3796.9600000000064, 17.128079119264772, 115.36854962133137, 141.87472656694052], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 37.34800000000003, 14, 97, 32.0, 60.0, 64.0, 77.99000000000001, 0.3713066131193023, 0.21564429285955106, 0.18710372301714842], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.881999999999984, 5, 85, 12.0, 26.0, 32.0, 43.0, 0.3712170201518872, 3.967862599913061, 0.1341311498595686], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.462000000000005, 5, 89, 13.0, 27.0, 30.0, 39.0, 0.3711944219871819, 3.985884978309254, 0.15659764677584237], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 68.41199999999999, 15, 305, 59.5, 130.90000000000003, 145.89999999999998, 182.93000000000006, 0.36845006322603086, 0.19887308051333935, 4.101885469508546], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 69.35599999999995, 27, 158, 58.5, 119.0, 133.0, 151.97000000000003, 0.3709322640592601, 1.5426688889373161, 0.15431361766527815], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.219999999999997, 1, 64, 5.0, 15.0, 16.94999999999999, 24.970000000000027, 0.37097189442733436, 0.23175237361729503, 0.1568660452021834], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 60.80800000000001, 23, 141, 52.0, 104.0, 114.94999999999999, 134.99, 0.3709286867344032, 1.5223688486577573, 0.1347514369777324], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1148.0699999999997, 579, 2626, 909.5, 2171.9, 2346.0499999999997, 2523.4800000000005, 0.3708175488663366, 1.5682649092294263, 0.18033900325726135], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.851999999999993, 6, 91, 17.0, 31.0, 35.0, 53.950000000000045, 0.37098455591293733, 0.5516620050138562, 0.18947746361568968], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.747999999999996, 2, 48, 8.0, 23.0, 27.94999999999999, 37.98000000000002, 0.3690649738886531, 0.3559855130464468, 0.20183240759535714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 29.444000000000006, 10, 87, 24.5, 51.0, 54.94999999999999, 63.98000000000002, 0.37091768001376846, 0.6044473064607183, 0.2423280546183702], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1262.0, 1262, 1262, 1262.0, 1262.0, 1262.0, 1262.0, 0.7923930269413629, 0.3381599148177496, 937.2345792888273], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.563999999999997, 2, 49, 8.0, 20.0, 24.0, 31.980000000000018, 0.36907042232728426, 0.370768002101856, 0.21661262091669709], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 30.796000000000003, 11, 93, 26.0, 51.0, 55.94999999999999, 71.96000000000004, 0.3709149284356737, 0.5827095259021022, 0.22059296036848172], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 18.932000000000002, 5, 79, 16.0, 32.0, 36.0, 55.960000000000036, 0.37091437812495365, 0.5740153556234329, 0.21189932734677527], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2859.878, 1590, 6034, 2517.0, 4217.8, 4683.75, 5631.93, 0.37016855995546133, 0.5652698036015179, 0.20388190216296892], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 67.83399999999997, 13, 207, 60.0, 133.0, 144.0, 176.0, 0.3684180277256671, 0.19885578916431002, 2.970370348538191], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 34.399999999999984, 13, 85, 31.0, 55.0, 60.0, 75.98000000000002, 0.3709306129776752, 0.6714822134598107, 0.3093503354325533], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 30.90799999999998, 10, 92, 27.5, 52.0, 53.0, 65.99000000000001, 0.370919055818125, 0.6279942151000406, 0.2658736200883826], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.118904532967033, 1498.7122252747254], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.4031758912852113, 1683.4888726892607], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.778, 1, 36, 7.0, 19.0, 21.0, 30.99000000000001, 0.36905979802095373, 0.3102084558150538, 0.1560575122490947], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 590.8380000000001, 323, 1340, 465.0, 1153.7, 1224.9, 1291.91, 0.3689064947464026, 0.324850268923612, 0.17076335791972153], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 9.834000000000007, 2, 51, 7.0, 20.0, 25.0, 35.0, 0.36900369003690037, 0.334305091097786, 0.18017758302583026], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1662.4599999999996, 927, 3801, 1321.0, 3023.4000000000005, 3447.65, 3654.87, 0.3687552224958386, 0.34884460115619514, 0.19482087438500847], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.321262668918919, 889.8199957770271], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 98.842, 29, 1041, 93.5, 166.90000000000003, 183.95, 219.8800000000001, 0.3681405295480633, 0.1987060078969825, 16.83883410446503], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 125.65199999999994, 30, 406, 120.0, 223.80000000000007, 242.84999999999997, 274.93000000000006, 0.3687459760595363, 83.44559751759287, 0.11379270354962252], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 1.304512593283582, 1.0202891791044775], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.903999999999996, 1, 48, 6.0, 19.0, 22.94999999999999, 29.99000000000001, 0.37124320439314357, 0.40340432222685035, 0.1591560221958887], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.684000000000006, 2, 65, 8.0, 20.0, 24.0, 42.97000000000003, 0.3712385185207185, 0.380921898237211, 0.1366766811350692], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.4159999999999995, 1, 28, 5.0, 13.0, 15.0, 18.0, 0.3712252884606104, 0.21052171607613385, 0.143922304217639], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 186.986, 85, 467, 143.0, 359.90000000000003, 379.9, 429.84000000000015, 0.37119910674646955, 0.33810656138037065, 0.12107470864582111], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 328.5900000000002, 116, 1035, 288.0, 510.90000000000003, 542.95, 702.7500000000002, 0.36850029959074354, 0.19890019588554675, 109.00915405412974], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.055999999999996, 1, 37, 6.0, 13.900000000000034, 16.0, 20.0, 0.3712360378126179, 0.20690246009769447, 0.155527597872669], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.270000000000005, 2, 51, 8.0, 20.0, 24.0, 32.0, 0.3712724248544612, 0.19967132528476594, 0.15808083714506355], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 60.73600000000001, 7, 375, 47.0, 131.0, 147.0, 172.95000000000005, 0.3680521868556786, 0.15552720876398507, 0.26705349104860276], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.008, 2, 98, 9.0, 20.0, 24.0, 30.0, 0.371245960843946, 0.19095601566026837, 0.1493684920583064], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.271999999999995, 2, 37, 8.0, 20.0, 22.94999999999999, 27.99000000000001, 0.3690554395081229, 0.22659066930971872, 0.18452771975406146], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.871999999999987, 2, 64, 9.5, 23.0, 25.94999999999999, 33.99000000000001, 0.36903855124321705, 0.21612901324811493, 0.17406798852585337], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 822.8259999999995, 397, 1826, 629.0, 1594.7, 1643.85, 1727.91, 0.3687427127221399, 0.33694945675901705, 0.16240523773211432], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 32.41199999999999, 7, 374, 28.0, 56.0, 64.0, 83.96000000000004, 0.3688545149268045, 0.3266055441692216, 0.15164819412518038], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 16.57799999999998, 5, 136, 14.5, 28.0, 32.0, 42.97000000000003, 0.3690805023628534, 0.24606928688295274, 0.17264605530449878], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 820.95, 448, 6010, 796.0, 1003.5000000000002, 1048.0, 1207.7900000000002, 0.3689957927099715, 0.277363038678508, 0.20395665886117567], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 256.50000000000006, 142, 623, 194.0, 495.7000000000001, 520.8499999999999, 567.96, 0.37125478176158905, 7.1780915627060455, 0.18707760487205075], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 384.3139999999998, 207, 836, 306.5, 695.7, 727.8499999999999, 785.95, 0.3712197762138701, 0.7194957051263966, 0.2653641369028837], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 28.041999999999987, 10, 79, 23.5, 48.0, 53.94999999999999, 64.0, 0.3709702429929285, 0.302757365011348, 0.2289581968471981], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 29.627999999999997, 10, 82, 24.0, 50.0, 56.0, 69.98000000000002, 0.3709716191872457, 0.3085549197050479, 0.23475547776692893], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 28.97800000000001, 10, 84, 22.0, 52.0, 56.0, 68.99000000000001, 0.3709487756835658, 0.3002040623991483, 0.22640916484592644], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 31.543999999999958, 12, 80, 27.0, 52.0, 57.94999999999999, 67.98000000000002, 0.37096143559107886, 0.33173153924326837, 0.257934123184422], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 30.27200000000002, 9, 84, 24.0, 53.0, 59.0, 72.0, 0.37063585546091166, 0.2782338754407787, 0.20450122884317878], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3311.6320000000014, 1676, 7186, 2864.0, 5199.6, 5647.099999999999, 6371.610000000001, 0.37018719626140545, 0.30934852120395245, 0.2357051288695668], "isController": false}]}, function(index, item){
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
