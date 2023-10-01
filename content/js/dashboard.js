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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8899170389278876, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.197, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.595, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.945, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.093, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.0558179110801, 1, 22272, 9.0, 847.0, 1515.0, 6075.990000000002, 15.160613493687753, 95.50062294448075, 125.45537043004737], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6256.119999999998, 5138, 22272, 6063.5, 6540.8, 6730.65, 21037.230000000127, 0.3272075713214343, 0.19003282689508808, 0.16488194023619152], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.474000000000002, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.3282966067919315, 0.16854375894197884, 0.1186227973759909], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6479999999999984, 2, 12, 3.0, 5.0, 5.0, 7.990000000000009, 0.32829423567849225, 0.1884197316900456, 0.13849913067686392], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.160000000000013, 8, 378, 11.0, 16.0, 18.0, 34.98000000000002, 0.32609936247574633, 0.16964491346138166, 3.588048356459213], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.01400000000005, 23, 51, 34.0, 40.0, 41.94999999999999, 44.99000000000001, 0.3282246264311415, 1.3650522449497717, 0.13654657310514282], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2139999999999995, 1, 10, 2.0, 3.0, 3.9499999999999886, 6.0, 0.32823518444847954, 0.20505403305032896, 0.13879476061151527], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.00599999999999, 21, 45, 30.0, 35.0, 37.0, 41.99000000000001, 0.3282233336593685, 1.3470971548862936, 0.11923738293094246], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.2440000000001, 659, 1107, 865.5, 1033.8000000000002, 1068.95, 1092.0, 0.3280807603599702, 1.3875220993149673, 0.15955490103443862], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.816000000000001, 3, 25, 5.0, 8.0, 9.0, 13.0, 0.3281847706513549, 0.4880178048032467, 0.1676178076666588], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.890000000000002, 2, 15, 4.0, 5.0, 5.0, 10.0, 0.3262678933469409, 0.3147051376344795, 0.1784277541741083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.749999999999996, 5, 17, 8.0, 9.0, 10.0, 14.0, 0.3282229027377072, 0.5348719140892964, 0.21443468938625598], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.9635126670378619, 2634.2762562639195], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.179999999999998, 2, 13, 4.0, 5.0, 6.0, 10.990000000000009, 0.3262706610896135, 0.32777137868114875, 0.19149283917466572], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.088000000000006, 5, 24, 8.0, 10.0, 11.0, 15.0, 0.3282194554051508, 0.5156346876023634, 0.19520082845872738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.588, 4, 24, 6.0, 8.0, 9.0, 11.0, 0.3282185935833265, 0.5079407103881185, 0.18750769262328712], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1561.2820000000004, 1343, 1914, 1541.0, 1745.6000000000001, 1800.95, 1894.98, 0.327879387599995, 0.5006916769374885, 0.18058981895155976], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.345999999999995, 8, 54, 10.0, 14.0, 16.0, 30.99000000000001, 0.32609064276378774, 0.16964037725263414, 2.6291058072830387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.197999999999997, 8, 23, 11.0, 14.0, 15.0, 18.99000000000001, 0.3282252728208468, 0.5941742875788397, 0.2737347490126984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.9900000000000135, 5, 21, 8.0, 10.0, 12.0, 15.0, 0.3282241955060856, 0.555708564444195, 0.23527007763815122], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.682887801204819, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 1.1044456845238095, 4553.436569940476], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3319999999999994, 1, 17, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.3262991928663165, 0.2742665803632493, 0.1379761235460108], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.0000000000001, 424, 739, 559.0, 651.9000000000001, 667.0, 694.0, 0.3261755202662636, 0.2872223909954029, 0.15098359043575094], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.276000000000002, 1, 17, 3.0, 4.0, 5.0, 10.0, 0.32627619671583435, 0.2955954008352018, 0.15931454917765348], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 761.1239999999997, 633, 951, 743.5, 879.0, 901.0, 932.98, 0.32612999150105243, 0.3085208828779145, 0.17230109902545834], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.354000000000003, 17, 1108, 22.0, 27.0, 29.94999999999999, 64.85000000000014, 0.3258572979652167, 0.16951898554594783, 14.86405701948757], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.446, 21, 252, 29.0, 34.900000000000034, 38.94999999999999, 112.8900000000001, 0.32621616649029245, 73.78051107450875, 0.10066827012786368], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 1.085743400621118, 0.8491847826086957], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6560000000000015, 1, 10, 3.0, 3.0, 4.0, 6.990000000000009, 0.32824358825386885, 0.35667961238863516, 0.1407216164486801], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.340000000000002, 2, 13, 3.0, 4.0, 5.0, 6.0, 0.3282422953327228, 0.33680416223539567, 0.12084701693402], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.858000000000001, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3282974690234923, 0.18617736644202365, 0.1272793898460219], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.93200000000002, 66, 135, 93.0, 112.0, 115.0, 122.99000000000001, 0.3282733282516622, 0.29900763280625764, 0.10707352698833512], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.24800000000008, 59, 380, 80.0, 93.0, 100.94999999999999, 286.9100000000001, 0.32616254114540455, 0.16967778056012545, 96.44409749357133], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.36799999999985, 12, 369, 259.0, 334.0, 337.95, 349.98, 0.3282382011496215, 0.18293830447080123, 0.13751385575506603], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 430.38200000000006, 336, 547, 416.5, 501.0, 508.0, 530.0, 0.3281908022558523, 0.17650191084992228, 0.13973749002299962], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.377999999999997, 4, 274, 6.0, 8.0, 10.0, 32.99000000000001, 0.32580272905397967, 0.14690075979639935, 0.2363978786006903], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 407.89999999999975, 315, 499, 409.0, 469.90000000000003, 478.95, 493.99, 0.328177016057045, 0.16880284778067012, 0.13203997130420173], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.556000000000001, 2, 19, 3.0, 5.0, 6.0, 10.980000000000018, 0.3262974893365981, 0.200338373555481, 0.163148744668299], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.150000000000001, 2, 28, 4.0, 5.0, 6.0, 9.990000000000009, 0.3262923788541656, 0.19109453371350746, 0.15390548729156445], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.3339999999998, 528, 878, 677.0, 823.4000000000002, 843.95, 862.98, 0.3261355223549594, 0.29801588830347564, 0.143639766193444], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.70000000000005, 174, 351, 241.0, 290.0, 296.0, 314.0, 0.3262199975468256, 0.2888544277106272, 0.13411974508516952], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.607999999999999, 3, 44, 4.0, 6.0, 7.0, 10.0, 0.32627236433921364, 0.2175287166582271, 0.15262154542820638], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.0560000000005, 803, 9540, 933.0, 1073.9, 1099.95, 1136.96, 0.3261010639373312, 0.2451203612531281, 0.1802472677622358], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.45200000000003, 116, 166, 137.0, 152.0, 154.95, 157.99, 0.32827828544190857, 6.3471548562124696, 0.16542147977346172], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.36400000000006, 161, 243, 179.5, 205.0, 209.0, 221.0, 0.32825156149267803, 0.636214996689583, 0.23464857716078155], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.161999999999992, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.3281813241197521, 0.267836342168084, 0.20254941098015947], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.087999999999997, 5, 19, 7.0, 9.0, 10.0, 13.0, 0.32818240115310165, 0.2729650711778401, 0.20767792572969718], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.535999999999994, 6, 21, 8.0, 10.0, 12.0, 14.990000000000009, 0.3281796008810966, 0.26559152055290386, 0.20030493217840367], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.968000000000002, 7, 21, 10.0, 12.0, 13.0, 17.0, 0.3281800316890639, 0.29347435236132097, 0.2281876782838022], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.820000000000004, 5, 36, 7.5, 9.0, 11.0, 16.0, 0.3281412635013723, 0.24633346744740225, 0.18105450574050327], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1626.4960000000008, 1414, 2053, 1604.5, 1813.7, 1888.75, 1972.99, 0.32783209227030935, 0.2739542965592055, 0.20873684000023604], "isController": false}]}, function(index, item){
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
