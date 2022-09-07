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

    var data = {"OkPercent": 97.79195915762604, "KoPercent": 2.208040842373963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9023611997447352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.975, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.743, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.711, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 519, 2.208040842373963, 182.4344607530314, 1, 3215, 15.0, 526.0, 1197.0, 2163.0, 26.92005071345865, 178.39369541617563, 223.03583323741526], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 23.60600000000003, 15, 64, 24.0, 28.0, 30.0, 41.930000000000064, 0.5829612097611024, 0.3385342278387296, 0.2948963932189952], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.412, 4, 25, 7.0, 10.0, 12.0, 18.0, 0.5829353827786897, 6.2374586917414385, 0.2117694945250709], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.7900000000000045, 5, 42, 7.0, 9.0, 11.0, 15.980000000000018, 0.5829122763657052, 6.2592448520830954, 0.24705461713155866], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 21.085999999999995, 7, 264, 19.0, 27.0, 30.94999999999999, 49.960000000000036, 0.5794065023315318, 0.3125683065946889, 6.451555605062622], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.06599999999995, 27, 69, 45.0, 55.0, 56.0, 58.0, 0.5826711275968195, 2.4233679126797396, 0.2435383228627332], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3479999999999994, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.5827077965137757, 0.3641923728211099, 0.24753700340184812], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.313999999999936, 25, 61, 40.0, 48.0, 50.0, 51.0, 0.582662979575332, 2.391436640426439, 0.2128085491808341], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 765.3879999999997, 553, 997, 765.0, 907.0, 924.95, 963.96, 0.5823365672424035, 2.462724090390282, 0.28434402697382977], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.563999999999984, 7, 54, 11.0, 13.0, 14.0, 21.980000000000018, 0.5825462163040704, 0.8662257435037358, 0.298668714413708], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.1800000000000015, 1, 19, 3.0, 4.0, 5.0, 10.990000000000009, 0.5802584471123439, 0.5597930036788386, 0.31846215554407936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 16.97999999999998, 11, 45, 18.0, 21.0, 22.0, 25.99000000000001, 0.5826297108525271, 0.9493541476826486, 0.3817817734199665], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.6961791394779772, 1929.5138534869495], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.012, 2, 20, 4.0, 5.0, 6.0, 11.0, 0.5802692217081037, 0.5830697007058395, 0.341701504580065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.878000000000004, 11, 33, 19.0, 22.0, 23.0, 30.0, 0.5826202062009435, 0.915464757595037, 0.34763764256716445], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.569999999999993, 6, 60, 11.0, 14.0, 15.0, 22.970000000000027, 0.5826120596035441, 0.901730987766312, 0.333977811511016], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1904.5380000000002, 1494, 2405, 1886.5, 2152.6000000000004, 2237.8, 2315.92, 0.5815474978918903, 0.8880911793783257, 0.3214412927800878], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.682000000000013, 12, 71, 16.0, 22.0, 28.0, 43.99000000000001, 0.579368905039119, 0.3127833928683164, 4.6722933767705515], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.26800000000002, 14, 50, 22.0, 26.0, 28.0, 33.98000000000002, 0.5826514369349738, 1.0547197279076055, 0.48706018556282965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 16.795999999999996, 11, 33, 18.0, 21.0, 22.0, 26.0, 0.5826432894641779, 0.9863604662544659, 0.41877486430237787], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.7557884694719472, 3155.850350660066], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0979999999999968, 1, 17, 2.0, 3.0, 3.9499999999999886, 7.990000000000009, 0.5801641864647695, 0.48748522394337596, 0.24645646592985815], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 397.8620000000002, 310, 532, 397.5, 465.90000000000003, 472.95, 494.98, 0.5799623024503407, 0.5105695864143831, 0.2695918515296506], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9680000000000017, 1, 23, 3.0, 4.0, 5.0, 13.990000000000009, 0.5802200658665818, 0.5256272505285805, 0.28444382135256263], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1145.5780000000002, 918, 1441, 1139.5, 1337.0, 1356.0, 1401.99, 0.5796100151973747, 0.5483144705291492, 0.30735179516813904], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 42.731999999999985, 9, 631, 42.0, 49.0, 55.0, 107.99000000000001, 0.578954986249819, 0.31131834382689244, 26.482667535099147], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.943999999999996, 10, 199, 43.0, 51.0, 58.0, 83.97000000000003, 0.5797121613176626, 128.21903972926862, 0.180027800096696], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.9789209905660377, 1.555129716981132], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.114, 1, 11, 2.0, 3.0, 4.0, 8.0, 0.5829754835490149, 0.6334461305876743, 0.25106659008312066], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.133999999999999, 2, 22, 3.0, 4.0, 6.0, 12.0, 0.5829686864199776, 0.5981087931061622, 0.21576673061833157], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0560000000000027, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5829476163271968, 0.3306554025399028, 0.22714462784624173], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.24400000000004, 82, 184, 120.0, 146.0, 151.0, 160.95000000000005, 0.582882376667918, 0.5310172295658925, 0.19125827984416055], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, 2.4, 163.4840000000001, 30, 625, 166.0, 194.0, 219.0, 370.49000000000046, 0.5794864127820795, 0.3101203028280096, 171.42385171869876], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1399999999999983, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.582964608218635, 0.3250710852469147, 0.24536889271702317], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 2.9819999999999975, 2, 12, 3.0, 4.0, 5.0, 9.990000000000009, 0.5830135504009384, 0.3136123260870579, 0.2493749365972764], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.347999999999988, 6, 307, 9.0, 14.0, 19.94999999999999, 39.930000000000064, 0.5787686812061076, 0.24453655025506335, 0.4210768237290529], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.262000000000004, 2, 53, 4.0, 5.0, 6.0, 9.990000000000009, 0.5829795619025189, 0.29983139866707553, 0.2356968150660574], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.450000000000002, 2, 29, 3.0, 4.0, 5.949999999999989, 12.980000000000018, 0.5801561084056498, 0.35623398043945664, 0.2912111716020547], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9019999999999992, 2, 45, 3.0, 5.0, 6.0, 14.970000000000027, 0.5801379335950916, 0.33982599234043886, 0.27477236112658143], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 510.45400000000006, 373, 724, 504.0, 624.9000000000001, 633.95, 658.99, 0.5796530197024061, 0.5296420968658161, 0.2564285331300683], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.736000000000013, 5, 104, 14.0, 22.0, 31.0, 47.0, 0.5798405670376873, 0.5133921970564973, 0.23952398423529464], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.120000000000013, 5, 56, 9.0, 11.0, 12.0, 15.990000000000009, 0.5802779763617963, 0.38674507104633404, 0.2725719791308829], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 517.815999999999, 358, 3215, 506.0, 571.9000000000001, 596.95, 672.7900000000002, 0.5800746672111635, 0.43589325661749184, 0.3217601669686922], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.30800000000002, 143, 261, 175.0, 188.0, 191.0, 203.98000000000002, 0.5827954131669802, 11.268326548137736, 0.2948125234575154], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 258.87599999999975, 21, 427, 264.0, 282.0, 288.0, 358.8700000000001, 0.5828728637709543, 1.1279648647880673, 0.4178014472733207], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.360000000000014, 11, 53, 18.0, 21.0, 22.0, 32.98000000000002, 0.5825054959393542, 0.47526418626603495, 0.3606528168218267], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.003999999999987, 11, 86, 18.0, 21.0, 22.94999999999999, 35.950000000000045, 0.5825339995968865, 0.4843895360437087, 0.36977255833786743], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.039999999999996, 11, 44, 18.0, 21.0, 22.0, 31.970000000000027, 0.5824702095611319, 0.47148460662291924, 0.35664923964338846], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.741999999999987, 13, 51, 21.0, 24.0, 25.0, 29.99000000000001, 0.5824892093873961, 0.5210548005848191, 0.4061497026392586], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.464000000000016, 10, 42, 17.0, 20.900000000000034, 22.0, 27.980000000000018, 0.5822382402431426, 0.4370494021868868, 0.32239168185338074], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2115.304, 1680, 2752, 2107.0, 2384.6000000000004, 2462.9, 2622.87, 0.5811304614640768, 0.48565708275995123, 0.3711516814428772], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.33911368015414, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1926782273603083, 0.0042544139544777706], "isController": false}, {"data": ["500", 18, 3.468208092485549, 0.07657945118059988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 519, "No results for path: $['rows'][1]", 500, "500", 18, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
