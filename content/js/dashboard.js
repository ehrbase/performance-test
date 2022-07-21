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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8788342905764731, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.371, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.824, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.341, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.932, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.536, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.947, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.863, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 286.5363965113801, 1, 7225, 24.0, 795.8000000000029, 1851.5500000000065, 3843.9900000000016, 17.073820940255064, 115.00411684948415, 141.42529705079798], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 33.03600000000002, 13, 83, 29.0, 52.900000000000034, 58.0, 68.99000000000001, 0.3706182728150756, 0.21524452443931014, 0.18675686403572167], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.327999999999989, 5, 97, 12.5, 25.0, 35.89999999999998, 51.960000000000036, 0.3703821677283054, 3.9599901376488287, 0.1338294941987041], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.657999999999998, 5, 52, 14.0, 27.0, 31.94999999999999, 40.0, 0.3703711934174669, 3.977045151535522, 0.15625034722299383], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 69.2, 15, 512, 64.0, 124.0, 136.95, 170.0, 0.36684889273998705, 0.1980088393616389, 4.084059938706887], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 68.69, 27, 278, 57.0, 113.0, 133.79999999999995, 155.96000000000004, 0.37035939675861457, 1.540286393134648, 0.15407529591715802], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.006000000000006, 1, 42, 6.0, 13.0, 16.0, 23.970000000000027, 0.3703777779259289, 0.23138121905956638, 0.15661482211125705], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 59.63599999999997, 24, 155, 51.0, 102.0, 113.94999999999999, 131.96000000000004, 0.37034897242974113, 1.5199895800001926, 0.13454083764049188], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1173.4559999999997, 576, 2656, 907.0, 2317.5000000000005, 2423.95, 2489.92, 0.3700592464853623, 1.565057889986937, 0.1799702194821391], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 17.780000000000022, 6, 69, 16.0, 29.0, 34.94999999999999, 51.99000000000001, 0.3699812049547883, 0.5501700005827204, 0.1889650099524944], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.918000000000005, 2, 50, 9.0, 23.0, 25.0, 32.99000000000001, 0.3678910571570262, 0.3548531992818031, 0.20119042188274872], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 24.307999999999993, 9, 89, 21.0, 41.0, 47.849999999999966, 55.98000000000002, 0.3703415660263461, 0.6035084713318594, 0.2419516676480718], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 897.0, 897, 897, 897.0, 897.0, 897.0, 897.0, 1.1148272017837235, 0.47576121794871795, 1318.606509545708], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.647999999999993, 3, 44, 8.0, 20.0, 24.0, 32.0, 0.36789701238194183, 0.36958919492912834, 0.2159239301186983], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.796, 10, 126, 21.5, 41.0, 47.0, 55.960000000000036, 0.37031358895339755, 0.5817648180519728, 0.22023532780529206], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 17.410000000000014, 6, 48, 15.0, 30.0, 35.0, 46.0, 0.3703081037484808, 0.5730771045813037, 0.21155296942662233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2912.3439999999982, 1515, 6084, 2611.0, 4461.500000000002, 4989.699999999999, 5822.66, 0.3695748263367891, 0.5643631364170903, 0.20355488481830963], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 72.63000000000002, 14, 292, 71.0, 132.90000000000003, 146.95, 176.0, 0.36677435161630123, 0.19796860535336508, 2.957118209906428], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 29.715999999999987, 12, 78, 27.0, 48.0, 52.0, 67.92000000000007, 0.3703514412967041, 0.6704337600059701, 0.30886731530018097], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.102000000000007, 9, 69, 20.0, 41.0, 45.94999999999999, 58.0, 0.3703514412967041, 0.6270332004790126, 0.26546675577322343], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.893578506097561, 554.4016768292684], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.43454251660341553, 1814.4623902988615], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.843999999999998, 1, 32, 7.0, 19.0, 21.0, 29.0, 0.3678066219904223, 0.30915511485681285, 0.15552760480649694], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 607.2760000000005, 320, 1340, 476.0, 1196.8000000000002, 1250.95, 1320.95, 0.36772547087246543, 0.32381028744180745, 0.17021667304057483], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.715999999999998, 1, 56, 8.0, 22.0, 24.0, 36.0, 0.3678602013519598, 0.3332691283166276, 0.17961923894138662], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1661.2560000000014, 938, 3724, 1334.5, 3145.2000000000007, 3502.0499999999997, 3696.9, 0.36761029779375004, 0.3477614956794762, 0.1942159874086121], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.3156072443181825, 748.257723721591], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 97.51999999999998, 29, 881, 87.0, 164.0, 174.89999999999998, 208.95000000000005, 0.3665409675508612, 0.19784263493655907, 16.765669763815662], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 111.68399999999995, 29, 331, 99.5, 207.0, 234.84999999999997, 272.9200000000001, 0.36714331659649335, 83.08292270839239, 0.11329813285594911], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.7827075559701492, 0.6121735074626865], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.406000000000002, 1, 36, 6.0, 19.0, 21.0, 28.0, 0.3703854601483764, 0.4024722708610351, 0.15878829785657936], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.323999999999995, 2, 72, 8.0, 20.0, 23.0, 33.940000000000055, 0.37038326519515863, 0.38004433649727065, 0.13636180759626446], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.329999999999995, 1, 24, 5.0, 13.0, 15.949999999999989, 18.980000000000018, 0.37040329510771325, 0.21005556396679703, 0.14360362124781462], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 188.73400000000007, 87, 505, 139.0, 372.0, 395.9, 443.97, 0.3703528129036846, 0.3373357149642535, 0.12079867139631899], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 322.1760000000003, 118, 1741, 284.0, 513.0, 555.8, 648.98, 0.3669108091190545, 0.19804225909003184, 108.53895359055248], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.9019999999999975, 1, 35, 6.0, 13.0, 15.949999999999989, 20.0, 0.3703818933626083, 0.20642641636813885, 0.1551697580591396], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.239999999999995, 1, 41, 8.0, 20.0, 24.0, 32.0, 0.3704093319445453, 0.1992071515577935, 0.15771334836701342], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 60.46799999999998, 7, 514, 48.5, 126.90000000000003, 140.95, 190.92000000000007, 0.3664090810826655, 0.15483288425320332, 0.2658612766058794], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.258000000000003, 2, 75, 9.0, 20.0, 24.0, 32.0, 0.3703903988882362, 0.19051594433439736, 0.1490242620526888], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.000000000000005, 2, 37, 8.0, 20.0, 22.0, 27.0, 0.36780337525801404, 0.2258219336508457, 0.18390168762900702], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.290000000000013, 2, 48, 8.0, 22.900000000000034, 27.0, 36.0, 0.3677922826880908, 0.21539913071374506, 0.17348014896323033], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 810.8719999999997, 373, 1836, 628.0, 1602.7, 1667.9, 1742.97, 0.3673413012110508, 0.3356688759337816, 0.16178801449822647], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.353999999999967, 5, 781, 25.0, 56.0, 64.0, 81.98000000000002, 0.3672309537501992, 0.325167947338714, 0.15098069485237683], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 15.40800000000002, 4, 85, 13.5, 27.0, 28.0, 36.99000000000001, 0.367902155685891, 0.24528367256671355, 0.1720948560288494], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 826.8820000000003, 466, 6773, 781.5, 990.4000000000002, 1055.0, 1200.88, 0.3677603614643041, 0.27643440217059523, 0.20327379354374622], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 254.44399999999985, 143, 724, 191.0, 502.90000000000003, 543.95, 593.8900000000001, 0.37056745735880264, 7.1648023668792, 0.18673125780970917], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 388.9260000000001, 200, 886, 300.0, 697.8000000000001, 729.6999999999999, 800.98, 0.37035829943320364, 0.7178259965508531, 0.26474831561045414], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 24.13800000000001, 9, 89, 20.0, 40.0, 44.0, 55.960000000000036, 0.36996888561671964, 0.3019401341784656, 0.22834017159156916], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 25.013999999999996, 9, 68, 22.0, 41.0, 45.94999999999999, 57.0, 0.369974908301719, 0.307725907372712, 0.23412474665968155], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 24.213999999999988, 9, 73, 20.0, 42.900000000000034, 47.94999999999999, 60.99000000000001, 0.3699431545348742, 0.2993902261665973, 0.22579538240653943], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 26.531999999999993, 11, 71, 23.0, 42.0, 49.0, 60.99000000000001, 0.36995437722620045, 0.33083097926738675, 0.2572339029150925], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 26.58599999999999, 9, 91, 23.0, 46.0, 51.94999999999999, 68.0, 0.3695988669577135, 0.2774554150576796, 0.2039290623350665], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3280.71, 1681, 7225, 2901.0, 4901.400000000001, 5672.8, 6613.330000000001, 0.36916497835216566, 0.3084943004157536, 0.235054263560168], "isController": false}]}, function(index, item){
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
