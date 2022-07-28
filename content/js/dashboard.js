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

    var data = {"OkPercent": 97.84726653903425, "KoPercent": 2.152733460965752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8775579663901297, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.381, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.828, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.335, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.912, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.518, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.934, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.845, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 506, 2.152733460965752, 293.25713677940786, 1, 7539, 33.0, 807.0, 1862.9000000000015, 3818.970000000005, 16.731025891983272, 112.1030201752825, 138.58586868271198], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 53.65599999999998, 20, 149, 43.0, 91.0, 98.0, 112.99000000000001, 0.3624144339521439, 0.21047996876531203, 0.18262289835869752], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.446000000000007, 4, 95, 14.0, 25.900000000000034, 32.94999999999999, 60.0, 0.36232041588586616, 3.8898981682619636, 0.13091655652126025], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.686000000000003, 4, 46, 13.0, 27.0, 31.0, 44.0, 0.362310439178222, 3.890427223789014, 0.1528497165283124], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 70.86000000000004, 15, 333, 65.0, 128.90000000000003, 143.0, 186.97000000000003, 0.3599623911293748, 0.19435297525114575, 4.007393807494992], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 65.06399999999996, 26, 156, 55.0, 108.0, 122.94999999999999, 140.99, 0.3624118070867455, 1.5072537176203171, 0.15076897443257184], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.432000000000002, 1, 41, 6.0, 14.0, 16.0, 21.0, 0.3624341366565161, 0.22648027841827945, 0.15325584098854636], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 57.05399999999995, 22, 146, 48.0, 96.0, 107.0, 120.0, 0.36241285782833516, 1.4874181071520727, 0.13165779600794988], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1160.2740000000013, 594, 2514, 906.0, 2249.8, 2347.0, 2465.9, 0.3621254445995146, 1.531483672759548, 0.1761117884868733], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 27.387999999999987, 9, 91, 24.0, 45.0, 51.94999999999999, 69.99000000000001, 0.36222644658753705, 0.538638508284481, 0.1850043277004706], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.398000000000005, 2, 47, 7.0, 21.0, 25.0, 40.0, 0.36051573939615056, 0.3477596785857977, 0.19715704498226982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 42.45999999999998, 15, 117, 33.0, 76.0, 80.0, 95.97000000000003, 0.36240261335772544, 0.5905506304537063, 0.23676498860968587], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1227.0, 1227, 1227, 1227.0, 1227.0, 1227.0, 1227.0, 0.8149959250203749, 0.3478058781581092, 963.9690619906274], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.390000000000004, 2, 55, 8.0, 20.0, 23.0, 32.0, 0.36051989853527977, 0.3622394094575906, 0.21159419826142883], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 43.538, 16, 123, 35.0, 76.0, 82.94999999999999, 103.98000000000002, 0.36240024933137155, 0.5693944948684124, 0.21552905453398952], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 26.500000000000007, 9, 74, 21.0, 48.0, 51.0, 60.0, 0.3624041893924294, 0.5608657836084585, 0.20703754960407342], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2981.647999999999, 1528, 6291, 2682.5, 4529.7, 5120.949999999999, 6036.52, 0.36183377356442453, 0.552542080137135, 0.1992912580960307], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 70.21, 13, 285, 63.5, 136.0, 148.89999999999998, 195.99, 0.3598934715324264, 0.19427499460159794, 2.901641114230188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 46.996000000000016, 19, 118, 39.0, 80.0, 87.94999999999999, 103.99000000000001, 0.36241101903455153, 0.6560595020454478, 0.30224512720264357], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 42.58199999999997, 15, 109, 33.0, 76.90000000000003, 84.0, 94.99000000000001, 0.36240602811690925, 0.6135194300367915, 0.25977150843536273], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 3.47627098880597, 1017.7821828358209], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1087.0, 1087, 1087, 1087.0, 1087.0, 1087.0, 1087.0, 0.9199632014719411, 0.42135033348666057, 1759.377515524379], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.61599999999999, 1, 54, 6.0, 19.0, 22.899999999999977, 32.0, 0.3605043022583431, 0.30299682494848396, 0.1524398074979127], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.9760000000005, 323, 1352, 472.0, 1178.6000000000001, 1230.75, 1296.97, 0.36042556166917405, 0.31732091715330124, 0.16683761350702], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.397999999999993, 1, 40, 7.0, 22.0, 25.0, 36.0, 0.36050898099973466, 0.3265887473069979, 0.1760297758787767], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1659.4759999999985, 917, 3662, 1309.5, 3096.3000000000006, 3478.85, 3595.95, 0.36027415422039555, 0.34082146087386656, 0.19034015374339255], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 4.41295695754717, 621.1950913915094], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 100.47200000000004, 18, 1234, 90.0, 168.90000000000003, 190.89999999999998, 231.95000000000005, 0.35957745334302754, 0.19381224735189184, 16.44715699187571], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 133.4299999999999, 11, 326, 123.5, 235.90000000000003, 255.95, 301.98, 0.3601381778160645, 80.88318224373828, 0.11113639081042614], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.2606107271634617, 0.9859525240384616], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.570000000000013, 1, 44, 6.0, 19.0, 20.94999999999999, 28.0, 0.3623065011553955, 0.39363186090763574, 0.1553247597726744], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.491999999999999, 2, 64, 8.0, 21.0, 24.0, 38.99000000000001, 0.3622991504084923, 0.37172883493650705, 0.13338552705468906], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.653999999999996, 1, 41, 6.0, 13.0, 16.0, 20.0, 0.3623256670053204, 0.20549526657748626, 0.14047196269639864], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 192.79800000000034, 87, 429, 144.0, 363.90000000000003, 385.95, 412.0, 0.3622734251430799, 0.33001764656495963, 0.1181634023415905], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 326.29200000000014, 73, 749, 292.0, 528.9000000000001, 565.9, 690.8500000000001, 0.3600093026403802, 0.19379328886858435, 106.49736126681513], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.611999999999999, 1, 28, 5.0, 12.0, 16.0, 19.99000000000001, 0.36229783780650393, 0.2019824598030549, 0.15178298087792014], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.011999999999992, 1, 36, 7.5, 20.0, 24.0, 28.99000000000001, 0.3623246167692528, 0.19487969192262483, 0.15427102823378344], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.44400000000002, 8, 421, 51.0, 124.0, 145.0, 175.0, 0.35947585544469324, 0.15184203965881427, 0.2608306255814522], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 10.877999999999991, 2, 64, 9.0, 20.0, 24.0, 32.0, 0.36230860142358295, 0.1863589486873197, 0.1457726013540197], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.936000000000009, 2, 61, 8.0, 20.0, 23.94999999999999, 32.99000000000001, 0.36050066332122055, 0.22139951089072504, 0.18025033166061025], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.416000000000004, 2, 47, 8.0, 24.0, 28.0, 36.0, 0.3604928658461849, 0.2111446144168307, 0.17003716230830793], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 809.2160000000003, 384, 1802, 632.0, 1583.0, 1647.95, 1717.98, 0.36017112450467464, 0.3291169169045597, 0.15863005581211745], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.51999999999998, 6, 304, 28.0, 57.0, 66.84999999999997, 96.91000000000008, 0.36019421672165636, 0.3188964020649934, 0.14808766136700907], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.978, 8, 73, 19.0, 40.0, 44.0, 53.99000000000001, 0.360521198285938, 0.24034230180887906, 0.1686422402138323], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 851.0340000000004, 448, 7539, 805.5, 1018.7, 1091.85, 1419.6200000000003, 0.3603871134217531, 0.27083091573644746, 0.19919834589522684], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 265.11799999999994, 143, 636, 197.0, 513.9000000000001, 533.9, 569.97, 0.36235533868991154, 7.006085270998311, 0.1825931198867132], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 453.46999999999974, 221, 979, 387.0, 776.9000000000001, 831.9, 876.8800000000001, 0.3622379932594754, 0.7021283078215153, 0.25894356549407815], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 42.943999999999996, 15, 112, 34.0, 75.0, 83.0, 92.99000000000001, 0.36221883668349536, 0.2955946243283557, 0.22355693826559478], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 42.992000000000054, 15, 115, 34.0, 76.0, 82.0, 91.0, 0.36222277280083687, 0.3012165342380209, 0.2292190984130296], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 42.37199999999994, 15, 119, 33.0, 77.0, 84.0, 103.95000000000005, 0.3621681996039328, 0.29311856879819553, 0.22104992651607228], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 46.903999999999975, 17, 126, 39.0, 80.90000000000003, 88.0, 100.99000000000001, 0.3621910238922931, 0.3239501598892275, 0.25183594630011], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 44.062, 14, 118, 36.0, 80.0, 84.0, 99.99000000000001, 0.36234037094957816, 0.2720065103053225, 0.1999241304555778], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3228.4140000000007, 1722, 7241, 2793.5, 4948.6, 5643.85, 6871.6900000000005, 0.3616021869700268, 0.30217442130090005, 0.23023889248482177], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.81422924901186, 2.1272069772388855], "isController": false}, {"data": ["500", 6, 1.1857707509881423, 0.025526483726866625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 506, "No results for path: $['rows'][1]", 500, "500", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
