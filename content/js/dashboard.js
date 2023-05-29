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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8902361199744735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.174, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.632, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.938, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.106, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.37706870878475, 1, 18954, 9.0, 845.0, 1517.0, 6042.980000000003, 15.23659011530673, 95.97921932165573, 126.08408345760398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6192.014, 4987, 18954, 6032.5, 6501.9, 6650.25, 16592.990000000085, 0.3286958728288816, 0.1908971899707658, 0.1656319046676786], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3699999999999983, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.3297493970532275, 0.1692896050047385, 0.1191477313571232], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6379999999999977, 2, 14, 3.0, 5.0, 5.0, 7.990000000000009, 0.3297465699761791, 0.1892532779694338, 0.13911183420870055], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.558000000000003, 8, 347, 11.0, 14.0, 18.0, 43.940000000000055, 0.3277968446275736, 0.17052798545073705, 3.6067256332215547], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.40399999999997, 24, 56, 34.0, 41.0, 42.0, 44.99000000000001, 0.32967264824719644, 1.3710744177898615, 0.13714897280596258], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2860000000000023, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3296846039268074, 0.20595950974415814, 0.13940764990264412], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.433999999999994, 21, 61, 30.0, 36.0, 37.0, 41.99000000000001, 0.32966830094232386, 1.353027602591127, 0.1197623124517036], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.9360000000007, 685, 1102, 862.5, 1007.7, 1055.0, 1080.0, 0.3295266415699177, 1.393637033118416, 0.1602580737322451], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.735999999999996, 3, 22, 5.0, 8.0, 9.0, 14.980000000000018, 0.3296626496173935, 0.4902154425770521, 0.1683726228026336], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.861999999999999, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.32793895613095, 0.3163169788672857, 0.17934161663411327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.018000000000004, 5, 34, 8.0, 10.0, 11.0, 15.990000000000009, 0.32966569261443357, 0.5372230839088197, 0.21537729331939065], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.8975460321576764, 2453.921242868257], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.061999999999999, 2, 21, 4.0, 5.0, 6.0, 10.990000000000009, 0.3279411070242361, 0.3294495080145527, 0.19247324738434174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.210000000000004, 5, 17, 8.0, 10.0, 11.0, 14.990000000000009, 0.3296635190393869, 0.5179033200330586, 0.19605965145994786], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.680000000000001, 5, 33, 6.0, 8.0, 9.0, 13.970000000000027, 0.329661997553908, 0.5101744767027867, 0.18833229352444938], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1572.416, 1338, 1938, 1557.0, 1766.8000000000002, 1830.0, 1906.95, 0.3293132961560576, 0.5028813421212782, 0.18137958889845363], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.507999999999987, 7, 46, 10.0, 13.0, 15.0, 29.0, 0.32779448072765127, 0.17052675569182335, 2.6428430008666886], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.160000000000005, 8, 37, 11.0, 14.0, 15.0, 23.960000000000036, 0.329669605121747, 0.5967889098732749, 0.27493929958395696], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.9299999999999935, 5, 22, 8.0, 10.0, 11.0, 15.0, 0.3296672141340203, 0.5581517048987229, 0.23630442888122155], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2890625, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.812376860770578, 3349.2878447898424], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2900000000000014, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.32797552515441086, 0.2756755998590361, 0.1386849632733007], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 561.3040000000003, 441, 744, 548.5, 657.0, 671.0, 697.98, 0.3278716474304371, 0.288715960160644, 0.15176871179885468], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.332000000000002, 2, 21, 3.0, 4.0, 5.0, 9.990000000000009, 0.32796928633227357, 0.2971292838118296, 0.16014125309193045], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 768.5679999999995, 609, 948, 748.5, 892.9000000000001, 911.9, 936.0, 0.3278043663541598, 0.3101048512997443, 0.17318570527109423], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.108, 15, 527, 20.0, 24.0, 26.94999999999999, 64.99000000000001, 0.3276829863716646, 0.17046875358403266, 14.947336224043411], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.444000000000024, 20, 275, 28.0, 36.0, 48.0, 106.98000000000002, 0.32791142718857924, 74.16392922962294, 0.10119141698397563], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 1.1500308388157894, 0.8994654605263157], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6800000000000006, 1, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.3296965604736025, 0.35825845684041235, 0.14134452153116359], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3679999999999986, 2, 13, 3.0, 4.0, 5.0, 7.990000000000009, 0.3296941690948642, 0.33829390665006326, 0.12138154467652716], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.811999999999999, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.3297504844034616, 0.1870013708964201, 0.1278427170978264], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.85600000000001, 66, 130, 89.0, 110.0, 113.0, 117.99000000000001, 0.3297287387611959, 0.30033329290034677, 0.10754824096312446], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.12800000000001, 58, 500, 79.0, 93.0, 105.94999999999999, 407.7700000000011, 0.32785638316706645, 0.17055895886418745, 96.94495533120707], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.07800000000003, 12, 348, 259.5, 333.0, 337.0, 343.0, 0.32968982122239754, 0.18374734166976026, 0.13812200518008647], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 430.154, 321, 570, 414.0, 505.90000000000003, 518.0, 552.96, 0.3296509128693079, 0.17728716233032865, 0.140359177745135], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.287999999999998, 4, 304, 6.0, 8.0, 9.949999999999989, 29.980000000000018, 0.3276209347156316, 0.14772056813237722, 0.23771714306026784], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.1100000000001, 299, 535, 396.5, 468.0, 476.0, 492.99, 0.32963287468215147, 0.16955169084358987, 0.1326257269228969], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.590000000000001, 2, 29, 3.0, 5.0, 6.0, 11.980000000000018, 0.32797208301629366, 0.20136653155583398, 0.16398604150814683], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.231999999999997, 2, 32, 4.0, 5.0, 6.0, 13.990000000000009, 0.32796605944843976, 0.19207473194514046, 0.15469492843124652], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.4479999999999, 521, 887, 680.0, 804.9000000000001, 832.95, 853.98, 0.3278129630358103, 0.2995486988693731, 0.14437856086831097], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 249.37600000000006, 181, 320, 242.0, 291.90000000000003, 298.9, 309.99, 0.32791250245114595, 0.29035307138425637, 0.13481558938665278], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.531999999999996, 3, 31, 4.0, 5.900000000000034, 6.949999999999989, 10.0, 0.32794282775917977, 0.2186424296283883, 0.15340294384438194], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.502, 797, 9149, 932.0, 1082.0, 1107.0, 1144.96, 0.32776611658771876, 0.24637193124876267, 0.18116759959828985], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.35399999999996, 116, 171, 139.0, 151.0, 152.0, 160.96000000000004, 0.32974113342579275, 6.375438550555251, 0.16615861801534088], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.1379999999999, 159, 239, 179.5, 204.0, 206.0, 213.99, 0.32971917158717573, 0.6390595088288903, 0.2356976890642702], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.196000000000004, 5, 15, 7.0, 9.0, 10.0, 12.990000000000009, 0.3296591719752782, 0.26904244786275366, 0.203461520203492], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.072000000000002, 5, 22, 7.0, 9.0, 10.0, 13.0, 0.3296606934346754, 0.27419463789574944, 0.20861340756413055], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.530000000000012, 5, 19, 8.0, 10.0, 11.0, 15.990000000000009, 0.32965482502581195, 0.26678540043666077, 0.20120533754016842], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.872000000000005, 7, 28, 10.0, 12.0, 13.0, 18.99000000000001, 0.32965656379184166, 0.2947947383103782, 0.2292143295115149], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.906000000000001, 5, 32, 8.0, 9.0, 10.0, 20.980000000000018, 0.32974200326180786, 0.2475351321556488, 0.181937726409103], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.2200000000005, 1424, 1990, 1593.5, 1792.9, 1860.95, 1937.96, 0.3293241412379031, 0.2752011336901231, 0.20968685555382113], "isController": false}]}, function(index, item){
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
