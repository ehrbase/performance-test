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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8897894065092533, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.183, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.602, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.935, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.105, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.73350350989256, 1, 18428, 9.0, 847.0, 1514.0, 6101.0, 15.209073809140198, 95.80588699700218, 125.85638367590145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6226.870000000002, 5408, 18428, 6083.0, 6537.0, 6797.349999999999, 14946.25000000007, 0.32792024454980157, 0.19044672718380126, 0.16524106073017344], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.333999999999999, 1, 8, 2.0, 3.0, 4.0, 5.0, 0.3291056422529519, 0.16895910858281185, 0.11891512464217989], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6240000000000028, 2, 23, 3.0, 4.0, 5.0, 8.0, 0.3291034760567348, 0.18888418350908556, 0.138840528961435], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.208, 8, 333, 11.0, 15.0, 19.0, 38.960000000000036, 0.3271803791235361, 0.17020728492470596, 3.5999427066258605], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.520000000000024, 23, 46, 34.0, 40.0, 41.0, 42.99000000000001, 0.32903373977774425, 1.3684172636024192, 0.13688317689972565], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.180000000000003, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.3290421845242248, 0.2055581795527264, 0.13913600185448177], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.488000000000014, 21, 45, 29.0, 35.0, 36.0, 39.0, 0.32903135800454325, 1.3504134556633536, 0.11953092302508797], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 863.598, 679, 1115, 867.0, 1017.5000000000002, 1063.0, 1077.98, 0.3288900290409896, 1.3909446656915077, 0.15994847115469998], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6039999999999965, 3, 15, 5.0, 7.0, 8.0, 12.0, 0.32901187206439153, 0.4892477223741892, 0.1680402432516375], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7959999999999976, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.3273654609796739, 0.3157638080705407, 0.17902798647325915], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.706000000000008, 5, 22, 8.0, 9.0, 11.0, 13.990000000000009, 0.32903157452795484, 0.5361897253227964, 0.2149630110929705], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.9635126670378619, 2634.2762562639195], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.133999999999999, 3, 20, 4.0, 5.0, 6.0, 12.0, 0.32736760435660806, 0.328873367458678, 0.19213665060382953], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.111999999999998, 5, 24, 8.0, 10.0, 11.0, 15.0, 0.32902984234864135, 0.516907810238948, 0.1956827870999244], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.608000000000006, 4, 32, 6.0, 8.0, 9.0, 12.990000000000009, 0.3290289762658238, 0.5091948329865368, 0.18797065538623725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.9520000000005, 1336, 1962, 1541.0, 1754.8000000000002, 1831.0, 1908.99, 0.32870494852151805, 0.501952358449788, 0.18104452242786734], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.723999999999991, 8, 75, 10.0, 14.0, 18.0, 40.92000000000007, 0.32716796214274074, 0.1702008253057221, 2.6377916947758475], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.009999999999996, 8, 26, 11.0, 13.0, 14.949999999999989, 20.0, 0.3290333067255066, 0.5956370420020887, 0.2744086366636549], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.645999999999999, 5, 19, 7.0, 9.0, 10.0, 14.0, 0.3290328736744088, 0.5570777181816985, 0.235849735622086], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.89599609375, 1704.78515625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.8590133101851851, 3541.56177662037], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.313999999999998, 1, 14, 2.0, 3.0, 4.0, 8.990000000000009, 0.32737982214109024, 0.2751748893701736, 0.1384330693233321], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.0839999999996, 440, 739, 556.0, 652.0, 664.0, 692.0, 0.3272763213617837, 0.28819173021009176, 0.1514931409428569], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.278, 2, 15, 3.0, 4.0, 5.0, 7.990000000000009, 0.32737403465581527, 0.29659000555717424, 0.15985060285928482], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 765.7040000000003, 611, 920, 749.5, 884.9000000000001, 897.95, 914.0, 0.32723091311168456, 0.30956236117228514, 0.17288273827482553], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.572150735294117, 774.6668198529411], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.989999999999995, 17, 696, 22.0, 28.0, 33.0, 89.94000000000005, 0.32702052904073103, 0.17012412697782017, 14.917118077629443], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.683999999999987, 21, 253, 29.0, 36.0, 42.0, 96.7800000000002, 0.3272913174195567, 74.02367862165025, 0.10100005498494133], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 1.1086978065539113, 0.8671379492600423], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7500000000000004, 2, 18, 3.0, 4.0, 4.0, 6.0, 0.32905344486051424, 0.35755962756908477, 0.1410688108337556], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.362000000000001, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.32905236210238137, 0.3376353587740167, 0.12114525440683376], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7860000000000018, 1, 9, 2.0, 2.0, 3.0, 5.0, 0.3291060754956173, 0.18663592685650382, 0.12759288278492192], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.9660000000001, 67, 119, 91.0, 111.0, 113.94999999999999, 117.0, 0.32908896327762077, 0.2997505536510446, 0.1073395641940677], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.63199999999999, 57, 364, 81.0, 94.0, 102.94999999999999, 239.83000000000015, 0.327234553874588, 0.17023546796340996, 96.76108453875636], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.79000000000002, 12, 345, 259.0, 334.0, 337.0, 342.99, 0.32904781459603455, 0.18338952955869423, 0.13785303951337777], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 432.0760000000002, 338, 534, 418.0, 505.0, 513.0, 531.96, 0.32898567793749667, 0.1769293971649988, 0.14007593318432474], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.242000000000006, 4, 255, 6.0, 8.0, 11.0, 25.99000000000001, 0.3269700600055454, 0.14742709609878943, 0.23724487752355491], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 404.70600000000024, 314, 501, 399.5, 468.0, 474.0, 494.0, 0.3289811322741018, 0.16921645720712125, 0.13236350243840814], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5299999999999985, 2, 23, 3.0, 5.0, 5.0, 9.990000000000009, 0.32737724990014994, 0.20100131912570632, 0.16368862495007497], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1360000000000054, 2, 46, 4.0, 5.0, 5.949999999999989, 10.0, 0.32736803303536294, 0.19172449520667725, 0.15441285151960965], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.0340000000004, 535, 887, 675.0, 811.5000000000002, 837.95, 860.99, 0.32721356705980287, 0.2990009832358673, 0.14411456908590925], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.67, 172, 349, 237.0, 287.0, 294.0, 313.94000000000005, 0.3273007442164322, 0.28981138455906374, 0.1345640755030449], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.547999999999998, 3, 60, 4.0, 5.0, 6.0, 9.0, 0.3273699621036532, 0.21826049494900884, 0.15313497250747057], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.5780000000004, 808, 8403, 937.5, 1083.7, 1106.9, 1132.97, 0.32719172649912703, 0.2459401794957452, 0.18085011445166593], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.33, 118, 177, 137.0, 150.0, 152.0, 156.99, 0.32906145749217, 6.362297235414845, 0.1658161250644138], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.73600000000005, 159, 240, 180.0, 203.90000000000003, 206.0, 210.0, 0.3290350389412968, 0.6377335274777161, 0.23520864111819267], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.998, 5, 24, 7.0, 9.0, 9.0, 14.0, 0.32900775866096477, 0.26851081444390124, 0.20305947604856417], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.9259999999999975, 5, 30, 7.0, 9.0, 9.0, 14.960000000000036, 0.32900970710239835, 0.27365318128533567, 0.20820145527573647], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.226000000000003, 6, 20, 8.0, 10.0, 10.0, 13.0, 0.32900407833455503, 0.2662587595279581, 0.20080815328036805], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.754, 7, 22, 10.0, 12.0, 13.0, 18.0, 0.329005593753105, 0.29421260962466383, 0.2287617019064558], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.670000000000001, 5, 32, 7.0, 9.0, 10.0, 13.0, 0.32899974864419207, 0.2469779265432391, 0.18152818162496923], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1610.8639999999982, 1405, 1982, 1589.5, 1784.8000000000002, 1825.0, 1954.8500000000001, 0.32868398875111915, 0.2746661875138869, 0.20927925846262665], "isController": false}]}, function(index, item){
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
