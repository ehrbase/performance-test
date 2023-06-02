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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8924058710912571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.21, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.657, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.951, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.132, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.6524143799156, 1, 24395, 9.0, 837.9000000000015, 1495.0, 6066.0, 15.289545151480656, 96.31279678174751, 126.52229090099686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6254.519999999997, 5371, 24395, 6050.5, 6537.400000000001, 6724.2, 22078.110000000135, 0.3298520745386524, 0.1915686789539863, 0.16621452193549283], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.278, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.33103243720645703, 0.1699483032849673, 0.11961132984998935], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.681999999999999, 2, 26, 3.0, 4.0, 5.0, 10.0, 0.3310298072479638, 0.18998977345478596, 0.13965319993273473], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.414000000000001, 7, 345, 11.0, 15.0, 19.0, 37.97000000000003, 0.3289317874416475, 0.1711184106328516, 3.6192133292041433], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.84000000000006, 24, 48, 34.0, 40.0, 41.0, 43.0, 0.3309592522968572, 1.376425270848778, 0.13768422019380974], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2499999999999982, 1, 19, 2.0, 3.0, 3.0, 5.990000000000009, 0.3309662626230533, 0.20676018345956385, 0.1399496012849434], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.770000000000003, 21, 57, 30.0, 36.0, 37.0, 46.98000000000002, 0.3309585950940022, 1.3583232394409315, 0.12023105212399299], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.0180000000005, 683, 1100, 857.0, 1006.9000000000001, 1045.0, 1081.99, 0.3307991909974985, 1.3990189105906023, 0.16087695030933033], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.554000000000006, 3, 22, 5.0, 7.0, 8.0, 13.990000000000009, 0.33094041351666553, 0.4921155049472282, 0.1690252307316563], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.830000000000001, 2, 21, 4.0, 5.0, 5.0, 8.0, 0.32914073860498305, 0.3174761708276639, 0.17999884142460013], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.644, 5, 26, 7.0, 9.0, 10.0, 17.980000000000018, 0.3309585950940022, 0.5393299972844847, 0.21622197277137448], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.865234375, 2365.580078125], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.963999999999996, 2, 15, 4.0, 5.0, 6.0, 9.0, 0.3291446386617242, 0.3306585754274437, 0.19317961702704714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.910000000000008, 5, 26, 8.0, 10.0, 11.949999999999989, 16.99000000000001, 0.330954651931683, 0.5199316973720877, 0.19682752248671384], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.546000000000005, 4, 22, 6.0, 8.0, 8.949999999999989, 12.990000000000009, 0.3309526803857584, 0.5121718966153469, 0.18906964650944208], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1555.8799999999994, 1328, 1919, 1531.0, 1766.0, 1822.95, 1897.95, 0.3306071468008138, 0.5048571303944341, 0.18209221757388575], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.662000000000008, 7, 66, 9.0, 13.0, 17.0, 34.99000000000001, 0.3289239975054404, 0.17111435811633122, 2.651949729887613], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.915999999999995, 8, 23, 11.0, 13.0, 15.0, 20.99000000000001, 0.33096188113437847, 0.5991282701929772, 0.2760170375866789], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.743999999999996, 5, 24, 7.0, 10.0, 11.0, 16.99000000000001, 0.3309601285713908, 0.560340707524908, 0.2372311859095711], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.82666015625, 2841.30859375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.8239204040852577, 3396.879856793961], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2699999999999956, 1, 28, 2.0, 3.0, 3.0, 8.0, 0.3291671741327268, 0.2766772250466595, 0.1391888539057331], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.6579999999999, 431, 713, 542.0, 648.0, 662.0, 685.9000000000001, 0.32906968708763457, 0.28977092533573334, 0.1523232731245496], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2019999999999995, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.32918299414317614, 0.2982288627896152, 0.16073388385897275], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.59, 616, 948, 737.0, 882.9000000000001, 892.0, 920.96, 0.3290016969907531, 0.31123753309757074, 0.17381827936718497], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.867350260416666, 1371.8058268229167], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.115999999999985, 15, 671, 20.0, 24.900000000000034, 29.94999999999999, 52.98000000000002, 0.32878059878837773, 0.17103975857476242, 14.997404071684691], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.974000000000025, 20, 323, 28.0, 35.900000000000034, 41.0, 94.91000000000008, 0.32905344486051424, 74.422220069093, 0.10154383649992432], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 1.1972923801369864, 0.936429794520548], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6439999999999997, 1, 10, 2.0, 4.0, 4.0, 6.990000000000009, 0.330985104346364, 0.35965862837621354, 0.14189693438286502], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3039999999999976, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.3309835706375207, 0.3396169409224115, 0.12185625598666534], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7799999999999998, 1, 14, 2.0, 3.0, 3.0, 6.0, 0.3310335330348294, 0.18772898727407789, 0.12834014903791724], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.55800000000008, 66, 135, 93.0, 110.0, 113.0, 116.0, 0.33101621979477, 0.30150599449685533, 0.10796818106587223], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.60999999999999, 56, 389, 78.0, 91.0, 97.0, 308.8700000000001, 0.3289913060757456, 0.17114937369102584, 97.28054449870608], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.43799999999996, 13, 374, 260.0, 334.0, 338.0, 341.99, 0.3309789695962719, 0.18446582786942217, 0.13866208784843811], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 421.72400000000016, 331, 538, 411.5, 499.90000000000003, 509.95, 527.99, 0.3309084363120387, 0.17796346187636997, 0.14089460764848524], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.195999999999996, 4, 269, 6.0, 8.0, 12.0, 29.950000000000045, 0.32872591096524445, 0.1482187894060186, 0.23851889828825845], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 393.45399999999995, 272, 519, 390.5, 461.0, 469.95, 493.99, 0.33091237837315535, 0.17020982305949672, 0.13314052723607422], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3600000000000003, 2, 21, 3.0, 4.0, 5.0, 11.0, 0.32916349023898583, 0.20209802533999296, 0.16458174511949294], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.106000000000002, 2, 46, 4.0, 5.0, 6.0, 9.0, 0.32915395583807205, 0.19277042856997087, 0.1552552350290906], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.1979999999993, 530, 868, 679.0, 796.0, 836.0, 856.0, 0.32900191347512875, 0.30063513716583273, 0.144902209938753], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.2699999999999, 163, 331, 236.5, 286.0, 291.0, 304.99, 0.32907900002106105, 0.2913859571377893, 0.13529517481334638], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.427999999999996, 3, 34, 4.0, 5.0, 6.0, 11.990000000000009, 0.32914723875089935, 0.2194454212574478, 0.15396633531414142], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 978.488, 814, 9025, 919.5, 1081.9, 1110.0, 1221.0, 0.3289724742151374, 0.24727871399231782, 0.18183439492750764], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.21400000000006, 118, 166, 135.0, 150.0, 151.0, 154.99, 0.330988610019952, 6.399558108484496, 0.16678722926786643], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.9799999999999, 160, 252, 174.5, 203.0, 205.0, 210.99, 0.3309583760269639, 0.6414613266449956, 0.23658352661302495], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.92, 4, 31, 7.0, 9.0, 9.0, 13.0, 0.33093515656542255, 0.27008380829422785, 0.20424904194272175], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.770000000000005, 4, 18, 7.0, 8.0, 9.949999999999989, 15.0, 0.33093734694147703, 0.2752564919565678, 0.20942128986140346], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.275999999999998, 5, 19, 8.0, 10.0, 11.0, 13.990000000000009, 0.3309314329926725, 0.26781854280796646, 0.20198451720744173], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.619999999999996, 7, 37, 9.0, 12.0, 13.0, 16.99000000000001, 0.33093296621836277, 0.29593615868732126, 0.23010182807370538], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.668000000000001, 5, 37, 7.0, 9.0, 10.0, 25.8900000000001, 0.330936032712365, 0.24843148213508015, 0.18259654148680293], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1606.478, 1403, 1955, 1581.5, 1804.7, 1857.95, 1936.99, 0.3305977471747117, 0.2762654279637427, 0.21049778433389843], "isController": false}]}, function(index, item){
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
