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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8913848117421825, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.183, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.653, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.974, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.995, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.095, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.8246756009359, 1, 19377, 9.0, 839.9000000000015, 1511.9500000000007, 6038.910000000014, 15.239751340164476, 95.99913269411313, 126.11024286307305], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6183.327999999995, 5022, 19377, 6015.0, 6467.6, 6664.6, 16676.790000000085, 0.328705380709859, 0.19090271187691432, 0.1656366957483274], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3040000000000025, 1, 10, 2.0, 3.0, 3.9499999999999886, 5.990000000000009, 0.3297613583002253, 0.16929574577344866, 0.1191520532920736], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7060000000000017, 2, 15, 4.0, 5.0, 5.0, 9.0, 0.3297587484995977, 0.18926026765693219, 0.13911697202326778], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.418, 8, 359, 11.0, 14.0, 16.0, 42.99000000000001, 0.3276565739704375, 0.17045501320292164, 3.6051822450438666], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.72200000000002, 24, 56, 34.0, 40.0, 42.0, 45.99000000000001, 0.3296924299321163, 1.3711566877697297, 0.13715720229597808], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2780000000000027, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.3297019955542983, 0.20597037458597672, 0.1394150039795031], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.805999999999976, 21, 59, 30.0, 35.0, 37.0, 46.960000000000036, 0.3296963430741019, 1.3531426933603112, 0.11977249963238858], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.5640000000004, 668, 1080, 851.0, 1003.0, 1054.0, 1075.0, 0.32955270470495807, 1.3937472595632898, 0.1602707489678409], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.852000000000004, 4, 38, 5.0, 8.0, 9.0, 13.0, 0.3296693877577932, 0.4902254623365911, 0.16837606425520102], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7380000000000027, 2, 16, 4.0, 5.0, 5.0, 8.990000000000009, 0.32787960260992166, 0.3162597288025837, 0.17930915767730088], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.14400000000001, 5, 39, 8.0, 10.0, 12.0, 15.0, 0.32970069111858874, 0.5372801174575197, 0.21540015855306235], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.9508070054945055, 2599.5385473901097], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.903999999999994, 2, 18, 4.0, 5.0, 6.0, 9.980000000000018, 0.32788196773772593, 0.3293900967104258, 0.19243853770544264], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.420000000000002, 6, 36, 8.0, 10.0, 12.0, 15.990000000000009, 0.32969916928997306, 0.5179593267856177, 0.19608085361093122], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.823999999999998, 4, 23, 7.0, 8.0, 9.0, 16.980000000000018, 0.32969808227813463, 0.5102303202802566, 0.1883529083327234], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1563.4999999999998, 1298, 1920, 1546.0, 1746.7, 1800.95, 1892.98, 0.3293898777173018, 0.5029982868020723, 0.18142176858648262], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.728000000000002, 7, 64, 9.0, 13.0, 17.94999999999999, 36.99000000000001, 0.3276449796270352, 0.1704489815401542, 2.641637648242971], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.464000000000006, 8, 37, 11.0, 14.0, 15.949999999999989, 24.99000000000001, 0.3297013433351533, 0.5968463644080146, 0.27496576875802825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.055999999999992, 6, 26, 8.0, 10.0, 11.0, 16.99000000000001, 0.32970112592934503, 0.5582091201513328, 0.236328736750136], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.89599609375, 1704.78515625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.9544592335390947, 3935.0686406893005], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.303999999999999, 1, 23, 2.0, 3.0, 3.9499999999999886, 7.0, 0.32787379744087947, 0.27559009394076106, 0.13864194755068437], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.0339999999999, 436, 728, 549.0, 643.0, 662.0, 674.98, 0.32777256255211584, 0.28862870837780114, 0.1517228463376005], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2760000000000007, 2, 18, 3.0, 4.0, 5.0, 10.980000000000018, 0.3278839028676726, 0.29705192922789897, 0.16009956194710576], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.9180000000003, 609, 934, 747.5, 872.9000000000001, 888.0, 908.98, 0.3277431280459627, 0.3100469195013716, 0.17315335182897051], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.285999999999984, 15, 651, 20.0, 24.0, 30.94999999999999, 61.99000000000001, 0.3275067695649269, 0.17037708126458226, 14.939298053103258], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.99799999999995, 20, 272, 29.0, 41.900000000000034, 51.94999999999999, 112.96000000000004, 0.32778395104218905, 74.13509787116615, 0.10115207864192553], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 1.0530402861445782, 0.8236069277108434], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6799999999999993, 1, 11, 3.0, 3.900000000000034, 4.0, 6.0, 0.3297072134003562, 0.3582700326393656, 0.14134908855737927], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3779999999999992, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.32970590892335855, 0.33830595270006064, 0.12138586685947869], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8099999999999998, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.32976266321603015, 0.1870082774962704, 0.12784743876637106], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.99399999999993, 66, 119, 91.0, 111.0, 113.94999999999999, 118.99000000000001, 0.329740481051793, 0.3003439883611502, 0.1075520709680653], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 86.18800000000002, 58, 562, 80.0, 98.0, 118.94999999999999, 466.94000000000096, 0.3277147727920709, 0.17048528966217194, 96.90308208370227], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.79399999999987, 12, 359, 261.0, 334.0, 338.0, 343.0, 0.3297019955542983, 0.1837541268386656, 0.1381271055593691], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 417.284, 310, 549, 404.0, 492.90000000000003, 501.95, 521.99, 0.3296685183048445, 0.17729663058170012, 0.14036667380948456], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.353999999999997, 4, 280, 6.0, 8.0, 10.0, 32.99000000000001, 0.32745229020131766, 0.1476445282312992, 0.23759477697224513], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.5999999999997, 295, 534, 383.5, 457.90000000000003, 472.9, 503.85000000000014, 0.3296446101458018, 0.16955772715810083, 0.13263044861334994], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4320000000000004, 2, 18, 3.0, 4.0, 5.0, 8.990000000000009, 0.3278703574377063, 0.20130407463345734, 0.16393517871885313], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.161999999999999, 2, 46, 4.0, 5.0, 5.0, 10.0, 0.3278611127868457, 0.19201326948183517, 0.1546454272227016], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.6659999999996, 529, 910, 675.0, 800.9000000000001, 832.95, 848.97, 0.32770725517646376, 0.2994521052159853, 0.1443320039888527], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.27600000000012, 175, 323, 234.0, 283.90000000000003, 290.0, 306.97, 0.32779469562623537, 0.2902487582727186, 0.13476715513539558], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.554000000000004, 3, 38, 4.0, 5.0, 6.0, 10.0, 0.32788433289965163, 0.21860343058000115, 0.1533755815028644], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.2999999999995, 820, 8916, 925.5, 1072.0, 1104.95, 1146.96, 0.32771241007571467, 0.2463315616790804, 0.18113791416294384], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.70000000000007, 117, 167, 136.0, 150.0, 152.0, 156.0, 0.32975809605589534, 6.375766517541812, 0.16616716559066602], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.58000000000024, 158, 274, 182.0, 204.0, 207.0, 218.0, 0.32972330279875733, 0.6390675159157438, 0.2357006422350492], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.456000000000002, 5, 41, 7.0, 10.0, 10.0, 14.990000000000009, 0.32966656205247763, 0.2690484790750743, 0.20346608126676355], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.233999999999995, 5, 18, 7.0, 9.0, 10.949999999999989, 14.0, 0.3296672141340203, 0.2742000614746937, 0.2086175339441847], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.739999999999986, 6, 21, 9.0, 10.0, 12.0, 16.0, 0.32966482318097545, 0.2667934918147521, 0.20121143992979457], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.058000000000005, 7, 22, 10.0, 13.0, 13.0, 16.0, 0.32966569261443357, 0.2948029017421513, 0.2292206768959733], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.271999999999997, 5, 33, 8.0, 10.0, 11.0, 20.960000000000036, 0.329636351769455, 0.24745582028193136, 0.18187943237279497], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1623.7759999999992, 1399, 1968, 1591.5, 1816.0, 1862.6499999999999, 1936.97, 0.32933086554738084, 0.2752067528882317, 0.2096911370477464], "isController": false}]}, function(index, item){
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
