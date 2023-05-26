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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8935971069985109, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.225, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.673, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.983, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.123, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.22705807274826, 1, 17958, 9.0, 832.0, 1486.0, 6047.0, 15.386307266618095, 96.92232635499985, 127.32300566120209], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6175.463999999999, 5309, 17958, 6029.0, 6492.7, 6681.849999999999, 15515.970000000076, 0.3318882917112227, 0.1927512558238098, 0.1672405844951083], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.222000000000001, 1, 7, 2.0, 3.0, 3.0, 5.0, 0.3330548994374037, 0.17098661248363037, 0.12034210233578063], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5860000000000003, 2, 11, 3.0, 4.900000000000034, 5.0, 7.0, 0.33305334648672014, 0.1911511545544046, 0.14050688054908508], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.27000000000001, 8, 408, 10.0, 14.0, 16.0, 42.8900000000001, 0.33096976789752114, 0.17217861821942237, 3.64163708486462], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.639999999999965, 24, 53, 34.0, 40.0, 41.0, 43.99000000000001, 0.3330092043744089, 1.3849508093372451, 0.13853703228857245], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.274, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3330174108162723, 0.2080415701887476, 0.14081693250336513], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.722, 21, 43, 30.0, 35.0, 37.0, 38.99000000000001, 0.33300831721573076, 1.3667357273884022, 0.1209756777385272], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 840.8020000000006, 676, 1086, 847.0, 984.5000000000002, 1058.9, 1075.97, 0.33285557463187837, 1.4077157867324432, 0.16187702750651897], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.449999999999997, 3, 14, 5.0, 7.0, 8.0, 11.0, 0.3329621914772334, 0.4951219322112285, 0.17005783802987604], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8000000000000003, 2, 25, 4.0, 5.0, 5.0, 10.0, 0.33119382124807084, 0.31945649334466014, 0.1811216209950387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.492000000000009, 5, 17, 7.0, 9.0, 10.0, 15.0, 0.33300654291255516, 0.542667332249619, 0.2175599386801752], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.0349693480861244, 2829.641241776316], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.854000000000005, 2, 14, 4.0, 5.0, 6.0, 9.0, 0.33119667319565704, 0.33272004851865666, 0.19438398495174797], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.761999999999996, 5, 18, 8.0, 9.0, 11.0, 14.990000000000009, 0.3330043250601739, 0.5231517458667503, 0.19804651754066982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4900000000000055, 4, 17, 6.0, 8.0, 9.0, 12.0, 0.33300210723733464, 0.5153435247656998, 0.19024046165414135], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1547.1099999999994, 1319, 1942, 1522.0, 1759.6000000000001, 1828.8, 1899.98, 0.3326569309071555, 0.5079872748328399, 0.18322120022620672], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.430000000000003, 7, 79, 9.0, 13.0, 15.0, 32.940000000000055, 0.33095749976171057, 0.17217223603326254, 2.668344841828792], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.783999999999999, 8, 26, 11.0, 13.0, 14.0, 18.0, 0.33301009153781397, 0.602836071078673, 0.2777252130598566], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.585999999999999, 5, 21, 7.0, 9.0, 10.949999999999989, 14.0, 0.33300898258429623, 0.5638095734338088, 0.23869979806335295], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.8654238572761194, 3567.991342117537], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2159999999999984, 1, 18, 2.0, 3.0, 4.0, 6.990000000000009, 0.3311786848099597, 0.2783679744167778, 0.1400394243385865], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 547.8719999999992, 427, 694, 537.0, 638.9000000000001, 648.95, 669.0, 0.33107934515154164, 0.2915405823404264, 0.15325352500178782], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2239999999999998, 2, 14, 3.0, 4.0, 4.949999999999989, 9.980000000000018, 0.33120391297550944, 0.30005974815088854, 0.16172066063257298], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 747.746, 598, 929, 728.0, 868.0, 885.0, 906.99, 0.33105238241847007, 0.3131774935279259, 0.17490169813319562], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.893880208333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 21.917999999999985, 15, 628, 20.0, 24.0, 29.0, 47.97000000000003, 0.33082239138273833, 0.17210194932958842, 15.09054091942159], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.086000000000002, 21, 279, 28.0, 35.0, 41.0, 91.94000000000005, 0.3311001730329504, 74.88512983907042, 0.10217544402188705], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 1.038443688118812, 0.812190594059406], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.616, 1, 24, 2.0, 3.0, 4.0, 5.990000000000009, 0.33300166367631173, 0.36184988397389534, 0.1427614554237313], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3340000000000014, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.3329998894440367, 0.3416858533571717, 0.12259859210976742], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.6800000000000006, 1, 9, 2.0, 2.0, 3.0, 6.0, 0.33305578684429643, 0.18887580661948378, 0.1291241673605329], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.44799999999996, 65, 128, 90.0, 111.0, 114.0, 118.99000000000001, 0.3330364868114221, 0.3033461539198061, 0.10862713534669431], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.38999999999997, 58, 390, 78.0, 92.90000000000003, 100.94999999999999, 311.7800000000002, 0.3310425191011534, 0.17221646518591346, 97.88707456898263], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.7559999999999, 12, 384, 261.0, 335.0, 340.0, 348.98, 0.3329958974905429, 0.18558993032893334, 0.13950707033539347], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.3440000000004, 320, 531, 399.0, 484.0, 496.95, 520.97, 0.33294268058810994, 0.17905748401042776, 0.1417607507191562], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.059999999999993, 4, 307, 6.0, 8.0, 10.0, 23.99000000000001, 0.33075914515960453, 0.14913555167152442, 0.23999418442733023], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 391.0840000000002, 283, 497, 391.5, 457.0, 467.0, 485.98, 0.33292915733632705, 0.17124718404357112, 0.13395196564703785], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2499999999999964, 2, 19, 3.0, 4.0, 5.0, 8.980000000000018, 0.33117473640146855, 0.20333287941696024, 0.16558736820073428], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.071999999999997, 2, 46, 4.0, 5.0, 5.949999999999989, 9.0, 0.33116508513260845, 0.19394825508288732, 0.15620384386625966], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 665.318, 519, 870, 670.0, 783.7, 833.9, 849.99, 0.33101643893839056, 0.3024759688271889, 0.14578946675899818], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.99000000000007, 167, 305, 235.0, 278.0, 283.0, 297.95000000000005, 0.331102804109648, 0.2931779526506435, 0.13612722708023614], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.3199999999999985, 3, 37, 4.0, 5.0, 6.0, 9.0, 0.33119886703491563, 0.2208132602669993, 0.15492603252902792], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.3640000000009, 776, 8671, 929.5, 1072.9, 1108.95, 1131.0, 0.3310238899941409, 0.24882070153065447, 0.18296828294598022], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.08000000000007, 117, 161, 134.0, 149.90000000000003, 151.0, 154.0, 0.33302805761385396, 6.438990170468737, 0.1678149196569811], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.582, 159, 229, 174.0, 202.0, 203.0, 210.99, 0.33300898258429623, 0.645435798657108, 0.238049389894243], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.906000000000001, 5, 21, 7.0, 9.0, 10.0, 15.980000000000018, 0.3329575352618678, 0.2717343181579058, 0.20549722879443402], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.685999999999999, 4, 16, 6.0, 8.0, 9.949999999999989, 14.980000000000018, 0.33295953076679247, 0.2769384394036961, 0.21070095306336087], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.392000000000003, 5, 29, 8.0, 10.0, 12.0, 15.0, 0.33295265746163555, 0.26945429371585156, 0.20321817472023654], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.478000000000002, 7, 27, 9.0, 11.0, 13.0, 15.990000000000009, 0.33295420947347953, 0.29774365152046867, 0.23150722377452873], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.618000000000003, 5, 33, 7.0, 9.0, 10.0, 14.990000000000009, 0.3329331476898102, 0.2499307030865566, 0.18369846527806907], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1626.1460000000006, 1425, 1979, 1605.0, 1829.0, 1903.35, 1951.95, 0.3326058135504939, 0.2779434772590753, 0.21177635784660354], "isController": false}]}, function(index, item){
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
