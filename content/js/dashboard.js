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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8893001489044884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.188, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.577, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.953, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.086, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.4374388427981, 1, 23439, 9.0, 840.0, 1522.9500000000007, 6019.0, 15.155374016319188, 95.46761812229397, 125.41201330769826], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6222.679999999999, 4909, 23439, 6004.0, 6587.5, 6803.849999999999, 21644.020000000135, 0.3270346460504026, 0.18993239682874502, 0.16479480211133565], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.352000000000001, 1, 7, 2.0, 3.0, 4.0, 5.0, 0.32804933337094966, 0.16841681156879096, 0.11853345053442517], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.669999999999997, 2, 14, 4.0, 5.0, 5.0, 7.0, 0.3280465353693213, 0.18827756767764048, 0.13839463210893244], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.440000000000003, 8, 366, 12.0, 15.0, 18.0, 62.820000000000164, 0.3258417959878448, 0.169510921035825, 3.5852143705029755], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.827999999999996, 24, 64, 34.0, 40.0, 42.0, 47.0, 0.32797746138885336, 1.3640243111243395, 0.1364437485855972], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3019999999999983, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3279875732068263, 0.2048993461485731, 0.13869005781108965], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.676000000000002, 21, 52, 30.0, 35.0, 36.0, 41.0, 0.32797746138885336, 1.3460880437046367, 0.11914806214516939], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 852.816, 661, 1119, 854.0, 986.9000000000001, 1055.0, 1083.95, 0.3278430549727234, 1.386516793555589, 0.15943929821915653], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.642000000000001, 3, 14, 5.0, 7.0, 8.0, 11.0, 0.3279213198701956, 0.4876260478315875, 0.16748325223839092], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.982000000000004, 2, 19, 4.0, 5.0, 6.0, 9.990000000000009, 0.3260555559540679, 0.3145003253626879, 0.17831163216238088], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.931999999999997, 5, 25, 8.0, 10.0, 11.0, 16.0, 0.3279789673647808, 0.5344743971008626, 0.21427532145218592], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.824032738095238, 2252.933407738095], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.205999999999998, 2, 17, 4.0, 5.0, 7.0, 11.990000000000009, 0.32605768221244485, 0.32755742018434, 0.19136783887664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.318000000000005, 5, 19, 8.0, 10.0, 11.949999999999989, 16.0, 0.32797939764615747, 0.5152575554563964, 0.19505805973291981], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.791999999999998, 4, 15, 7.0, 8.0, 10.0, 12.990000000000009, 0.32797918250532804, 0.5075702053789242, 0.18737091969298525], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.0320000000002, 1329, 1936, 1546.5, 1758.5000000000002, 1805.75, 1873.91, 0.3276256575446947, 0.5003042157804829, 0.18045006919453888], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.909999999999998, 8, 89, 11.0, 14.0, 17.0, 37.98000000000002, 0.32582459688980875, 0.16950197364176758, 2.626960812424083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.13800000000001, 8, 29, 11.0, 13.900000000000034, 15.0, 19.99000000000001, 0.32797961278726917, 0.5937295781444226, 0.2735298723831327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.04800000000001, 6, 30, 8.0, 10.0, 11.0, 15.0, 0.32797961278726917, 0.5552944672709145, 0.23509476150962458], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.82666015625, 2841.30859375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.8590133101851851, 3541.56177662037], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4039999999999973, 1, 39, 2.0, 3.0, 4.0, 7.990000000000009, 0.326027917118487, 0.27403856303032514, 0.13786141417217274], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 569.6860000000006, 443, 741, 571.0, 652.0, 665.9, 696.97, 0.3259324928620784, 0.2870083868541648, 0.15087109532873552], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.346, 2, 15, 3.0, 4.0, 5.0, 9.0, 0.3260544928352786, 0.2953945444806799, 0.15920629532972586], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 762.2819999999999, 599, 968, 737.0, 880.9000000000001, 901.8499999999999, 928.99, 0.3259195330746401, 0.3083217879733737, 0.17218990956384794], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.20600000000002, 15, 618, 21.0, 27.0, 32.94999999999999, 48.99000000000001, 0.3256955554281724, 0.16943484309779466, 14.856679095751888], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.555999999999994, 21, 256, 28.0, 34.0, 39.94999999999999, 98.95000000000005, 0.32597966669231043, 73.72702176969635, 0.10059528776833017], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.1400305706521738, 0.8916440217391304], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.736000000000002, 2, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.3280009131545422, 0.356415914136905, 0.14061757897933988], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.414000000000003, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.32800026764821844, 0.3365558215045504, 0.12075791103845541], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8279999999999987, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.32804997907041133, 0.1860370149863072, 0.1271834391513216], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.52999999999999, 67, 120, 90.0, 111.0, 114.0, 117.0, 0.32803405255892804, 0.29878968863499783, 0.10699548198699411], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.76800000000011, 57, 388, 79.0, 92.0, 102.0, 335.6400000000003, 0.3259023257693576, 0.16954241011776808, 96.36715353486699], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.87200000000004, 13, 368, 263.0, 335.0, 338.95, 354.97, 0.32799725531896745, 0.18280401717098432, 0.1374129126287471], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 434.06600000000014, 331, 552, 429.0, 499.0, 511.95, 533.95, 0.32795616406728606, 0.17637572179052258, 0.13963758548177416], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.383999999999998, 4, 280, 6.0, 8.0, 10.0, 26.980000000000018, 0.32563913192422766, 0.14682699570384294, 0.2362791748239269], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 407.94599999999974, 312, 501, 408.0, 465.90000000000003, 476.95, 491.99, 0.32793508459413445, 0.1686784066470474, 0.13194263169217127], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.638000000000001, 2, 22, 3.0, 4.900000000000034, 5.0, 10.0, 0.3260234528231023, 0.20017012209415297, 0.16301172641155112], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2700000000000005, 3, 60, 4.0, 5.0, 6.0, 9.0, 0.32601133606617766, 0.19092993979711662, 0.15377292511715215], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.5560000000005, 541, 875, 686.5, 793.0, 825.95, 859.95, 0.3258600587460514, 0.297764175360613, 0.14351844384225504], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.89, 172, 314, 244.0, 288.0, 293.0, 304.0, 0.3259760537990879, 0.28863842552751073, 0.13401945180607033], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.610000000000005, 3, 56, 4.0, 5.0, 7.0, 12.970000000000027, 0.32606002112868937, 0.21738714553199953, 0.15252221691468965], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.2599999999999, 828, 9326, 928.0, 1092.7, 1120.0, 1180.6100000000004, 0.3258900056053081, 0.24496171505318526, 0.18013060856699648], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.01599999999996, 115, 184, 132.0, 150.0, 151.0, 159.0, 0.32805234665685135, 6.342786402615693, 0.165307627807554], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.00799999999992, 159, 258, 177.0, 203.0, 205.0, 212.99, 0.3280209251108547, 0.6357679787859027, 0.23448370818471254], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.240000000000006, 5, 17, 7.0, 9.0, 10.0, 12.990000000000009, 0.3279172336902166, 0.2676208118820809, 0.20238641766818055], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.147999999999995, 4, 41, 7.0, 9.0, 10.0, 13.0, 0.3279187391130979, 0.2727457707910318, 0.20751107709500724], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.467999999999998, 6, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.3279133626662767, 0.2653760573976271, 0.20014243326799114], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.838, 7, 26, 10.0, 12.0, 13.0, 16.980000000000018, 0.32791508311007783, 0.2932374226120404, 0.22800345622497598], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.010000000000002, 5, 31, 8.0, 9.0, 11.0, 25.960000000000036, 0.3278813226994863, 0.2461383316135958, 0.18091108137227513], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1626.8199999999995, 1420, 2038, 1607.0, 1809.8000000000002, 1866.75, 1964.89, 0.3275745723513958, 0.2737390989324345, 0.2085728722393653], "isController": false}]}, function(index, item){
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
