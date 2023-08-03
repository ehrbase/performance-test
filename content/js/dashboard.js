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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8923845990214848, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.192, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.652, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.976, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.127, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.91874069346875, 1, 18871, 9.0, 836.0, 1499.0, 6043.0, 15.338344098342898, 96.62019396104498, 126.92610635066502], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6182.546000000003, 5078, 18871, 6021.5, 6485.3, 6690.4, 16307.730000000083, 0.3307407667100158, 0.19208480602550143, 0.16666233947496886], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.325999999999998, 1, 21, 2.0, 3.0, 4.0, 5.990000000000009, 0.33185855391971414, 0.17037242224720012, 0.11990982905302171], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.67, 2, 25, 4.0, 5.0, 5.0, 8.0, 0.33185679184747335, 0.19046440931316264, 0.14000208406065281], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.446000000000003, 8, 347, 11.0, 15.0, 18.0, 71.76000000000022, 0.3298601261121234, 0.17160135525506762, 3.6294277743215764], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.41400000000005, 25, 59, 34.0, 41.0, 42.0, 44.99000000000001, 0.33178566380689545, 1.379862230772523, 0.1380280202946655], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.350000000000001, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3317942504037936, 0.2072774413337996, 0.14029971721176038], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.485999999999997, 22, 50, 30.0, 36.0, 37.0, 41.0, 0.3317865444630466, 1.3617213166799713, 0.12053183060571615], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.7100000000006, 651, 1104, 857.0, 1006.9000000000001, 1058.9, 1077.97, 0.3316375599434889, 1.4025645480692062, 0.1612846727068921], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6599999999999975, 4, 29, 5.0, 7.0, 8.0, 11.990000000000009, 0.3317321727130384, 0.4932928678826862, 0.16942961555558503], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8399999999999976, 2, 23, 4.0, 5.0, 5.0, 9.0, 0.3299772447692007, 0.31828303167088595, 0.18045630573315663], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6659999999999995, 5, 27, 7.0, 9.0, 11.0, 14.0, 0.33178698479287533, 0.5406799408141787, 0.21676317658831407], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.9303595430107526, 2543.6344926075267], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9839999999999995, 2, 16, 4.0, 5.0, 6.0, 9.0, 0.32998138245040215, 0.33149916791069645, 0.19367071372333172], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.8399999999999945, 5, 20, 8.0, 10.0, 10.949999999999989, 14.0, 0.3317865444630466, 0.5212386054132302, 0.19732227107226114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.577999999999995, 4, 16, 6.0, 8.0, 9.0, 13.0, 0.33178478315541926, 0.5134596325334223, 0.18954501772062526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1563.7319999999997, 1320, 1923, 1540.5, 1759.7, 1813.6499999999999, 1887.89, 0.3314315789334134, 0.506116088177703, 0.1825462993344191], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.846000000000018, 7, 79, 10.0, 14.0, 17.0, 58.77000000000021, 0.32984467614200474, 0.1715933178003978, 2.659372701394913], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.945999999999994, 8, 37, 11.0, 13.0, 14.0, 20.0, 0.331790727643609, 0.6006287009181976, 0.27670828262465047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.709999999999992, 5, 17, 7.5, 10.0, 11.0, 14.0, 0.3317902873038456, 0.5617462294937012, 0.23782624109474867], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.719992897727273, 3099.609375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.9786227584388186, 4034.6906315928272], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.245999999999998, 1, 24, 2.0, 3.0, 3.9499999999999886, 7.0, 0.33001557673522186, 0.27739033891774695, 0.13954760227182725], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 548.8520000000001, 436, 716, 536.0, 636.9000000000001, 651.0, 683.9000000000001, 0.329879495020469, 0.29048402290518277, 0.1526981256247093], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.220000000000002, 2, 19, 3.0, 4.0, 4.0, 7.990000000000009, 0.32997768030970387, 0.29894882207042517, 0.1611219142137226], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 750.8299999999997, 592, 930, 739.0, 868.0, 884.95, 909.99, 0.3298364077384899, 0.312027174355813, 0.17425927401027638], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.839999999999993, 15, 609, 21.0, 25.0, 29.0, 68.82000000000016, 0.3297139533626207, 0.17152531259355636, 15.039979259343765], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.615999999999993, 20, 229, 28.0, 35.0, 40.0, 96.96000000000004, 0.3299807291254191, 74.63194452178368, 0.10182999062854729], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.2426873518957346, 0.9719342417061612], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.733999999999999, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.33181296632164753, 0.3605582087458598, 0.14225184786640943], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3720000000000017, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.33181164512877276, 0.34046661489575475, 0.12216112325541734], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7319999999999993, 1, 8, 2.0, 2.0, 3.0, 6.0, 0.3318598754861747, 0.1881976057554458, 0.1286605181328236], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.95000000000005, 65, 120, 91.0, 111.0, 114.0, 118.0, 0.33184247570415315, 0.30225858936916083, 0.10823768250506557], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.94000000000005, 57, 332, 79.0, 91.0, 97.89999999999998, 290.9200000000001, 0.32992215816600234, 0.1716336258560655, 97.55579128035531], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.0800000000002, 12, 348, 262.0, 332.90000000000003, 337.0, 343.98, 0.33180724122850963, 0.1849274517983621, 0.13900908836624087], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 412.5380000000001, 321, 545, 398.0, 486.90000000000003, 499.95, 515.99, 0.33175308281552207, 0.1784177150755236, 0.14125424229254652], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.092000000000002, 4, 313, 6.0, 8.0, 9.0, 22.99000000000001, 0.32964895682587614, 0.1486349803281985, 0.23918864738440035], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.26199999999955, 281, 507, 389.0, 453.90000000000003, 466.0, 492.94000000000005, 0.3317440581321748, 0.17063761021366972, 0.1334751483891172], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.299999999999998, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.33001383417992886, 0.20262011492896784, 0.16500691708996443], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.111999999999999, 2, 38, 4.0, 5.0, 6.0, 9.0, 0.3300062107168857, 0.19326955530178078, 0.15565722634399978], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 664.7700000000002, 526, 851, 672.0, 782.4000000000002, 833.95, 849.99, 0.3298522921435781, 0.3014121955875659, 0.14527674194995482], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.7860000000001, 172, 316, 236.0, 281.90000000000003, 287.9, 304.98, 0.3299696229965069, 0.2921745672530887, 0.1356613391421186], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.468, 3, 52, 4.0, 5.0, 6.0, 10.0, 0.32998399577620485, 0.22000329468395785, 0.15435774802422084], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 979.9059999999995, 816, 8549, 933.5, 1080.9, 1105.9, 1135.97, 0.32981747900711744, 0.24791387867828943, 0.1823014581230747], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.02800000000002, 117, 160, 134.5, 150.0, 151.0, 157.99, 0.3318200128613437, 6.415633014490249, 0.16720617835591148], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.42399999999998, 158, 232, 174.0, 202.0, 204.0, 209.99, 0.3317997548663411, 0.6430920815241952, 0.23718498101773602], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.961999999999994, 5, 19, 7.0, 9.0, 9.0, 13.0, 0.33172799100884454, 0.2707308587558608, 0.20473836945077123], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.899999999999996, 4, 31, 7.0, 9.0, 10.0, 13.0, 0.33172975171355, 0.2759155730780739, 0.2099227335062309], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.187999999999994, 6, 18, 8.0, 10.0, 10.0, 14.990000000000009, 0.3317233692479168, 0.26845944661078236, 0.20246787673823047], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.548000000000002, 7, 19, 9.0, 11.0, 12.0, 15.990000000000009, 0.3317249098205833, 0.2966443527068421, 0.23065247635962433], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.7980000000000045, 5, 63, 7.0, 9.0, 10.0, 31.910000000000082, 0.3316859597333245, 0.24899444736973034, 0.1830103195794222], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.2640000000017, 1399, 2051, 1588.5, 1819.0, 1885.55, 1965.99, 0.33137117415410877, 0.27691174554239495, 0.21099023979343645], "isController": false}]}, function(index, item){
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
