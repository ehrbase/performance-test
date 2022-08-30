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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9026164645820038, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.698, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.756, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 183.50240374388392, 1, 3636, 16.0, 536.0, 1172.9000000000015, 2141.980000000003, 26.852760504907295, 179.65119222315266, 222.42587903019896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.801999999999996, 16, 73, 27.0, 30.0, 32.0, 38.98000000000002, 0.5823406366613713, 0.3382068359657071, 0.2934450864426441], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.298000000000003, 4, 35, 7.0, 9.0, 11.0, 20.980000000000018, 0.5821250358006897, 6.22276655359858, 0.2103381477014211], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.626000000000012, 5, 35, 7.0, 9.0, 10.949999999999989, 17.980000000000018, 0.5821060597240817, 6.250620761540253, 0.24557599394609697], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.13399999999999, 14, 254, 20.0, 28.0, 34.94999999999999, 49.0, 0.5783041116265729, 0.31220854376374196, 6.438151242717706], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.69999999999999, 26, 80, 44.0, 53.0, 55.0, 58.0, 0.5818838606364878, 2.4200277005811857, 0.24207277796010138], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5560000000000014, 1, 28, 2.0, 3.0, 4.0, 8.980000000000018, 0.5819143352268826, 0.3636634995251579, 0.2460633858918361], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.06999999999997, 22, 84, 39.0, 46.0, 48.0, 60.950000000000045, 0.581867608826699, 2.3881062678633356, 0.2113815922690742], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 773.9959999999998, 587, 1016, 782.0, 917.0, 933.8499999999999, 965.9100000000001, 0.5815326175829876, 2.4593900326181646, 0.2828156675354764], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.316, 7, 33, 12.0, 14.0, 16.0, 21.0, 0.5815806431351384, 0.8648229112385807, 0.29703776988249747], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2979999999999983, 1, 21, 3.0, 5.0, 6.0, 10.0, 0.5791367156461892, 0.5586124271590795, 0.31671539136900967], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.11800000000002, 11, 77, 18.0, 22.0, 24.0, 36.960000000000036, 0.5818107346407785, 0.9480855917771526, 0.38010877097136797], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.6027652718926554, 1670.6073998057911], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.274000000000001, 2, 24, 4.0, 6.0, 7.0, 12.0, 0.5791487902740069, 0.5818782551781694, 0.33991056929167784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.84999999999997, 12, 65, 20.0, 23.0, 24.94999999999999, 34.98000000000002, 0.5817965178314815, 0.9141375517508002, 0.34600984312438693], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.739999999999997, 6, 53, 11.0, 13.900000000000034, 15.0, 20.99000000000001, 0.5817924560135813, 0.9003965497380189, 0.3323716667655714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1912.2000000000003, 1506, 2445, 1905.0, 2144.3, 2204.9, 2321.9700000000003, 0.5805764659846054, 0.8865425314353128, 0.31977063165558345], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.91800000000002, 11, 192, 17.0, 23.900000000000034, 29.94999999999999, 50.98000000000002, 0.5782686636211184, 0.31212389948244956, 4.662291100445267], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.81999999999999, 15, 75, 24.0, 28.0, 30.0, 35.99000000000001, 0.5818378161997612, 1.0532798615895111, 0.4852436474947227], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.18199999999999, 12, 43, 19.0, 22.0, 24.0, 29.0, 0.5818256291862355, 0.9849762440595603, 0.4170507927956023], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.0496144480519485, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.6599536203170029, 2755.682074027378], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.194000000000001, 1, 25, 2.0, 3.0, 3.9499999999999886, 7.990000000000009, 0.5791018362161022, 0.4867237827568954, 0.24487411629059794], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 405.8620000000002, 312, 558, 409.0, 471.90000000000003, 485.95, 530.8300000000002, 0.5789000204930608, 0.5096671961672188, 0.2679673922985457], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9719999999999995, 1, 24, 3.0, 4.0, 4.949999999999989, 10.980000000000018, 0.5791461069798689, 0.5246871434631779, 0.28278618504876407], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1131.284, 910, 1439, 1116.5, 1310.7, 1354.0, 1392.93, 0.5784954721159397, 0.5471945735533853, 0.3056309086081283], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 44.97600000000002, 15, 664, 44.0, 51.900000000000034, 58.0, 96.93000000000006, 0.5778376160731311, 0.3111869994481651, 26.430427989876286], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.62399999999999, 10, 186, 45.0, 53.900000000000034, 61.0, 90.98000000000002, 0.5786387407895178, 129.70930224883608, 0.17856429891551528], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.8336156031468533, 1.4341127622377623], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.125999999999999, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.5821623138390462, 0.6325625613453538, 0.2495793513431067], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2259999999999964, 2, 20, 3.0, 4.0, 6.0, 12.960000000000036, 0.5821548578494268, 0.5973397760654016, 0.21432849746995497], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3199999999999994, 1, 44, 2.0, 3.0, 4.0, 14.950000000000045, 0.5821385908986124, 0.330130567500716, 0.2256924029167472], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.83999999999997, 84, 239, 122.0, 150.0, 154.0, 171.99, 0.5820721769499417, 0.5302461528667055, 0.1898555733410943], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, 1.0, 171.10200000000006, 42, 632, 172.0, 203.0, 225.95, 340.83000000000015, 0.5783890707601189, 0.31114507841509825, 171.09810599268917], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.239999999999998, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5821494354314776, 0.32458355758214713, 0.24388877714853893], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2999999999999994, 2, 16, 3.0, 5.0, 6.0, 8.0, 0.5821982408297954, 0.3131078058665788, 0.2478890947283114], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.763999999999996, 7, 325, 10.0, 15.0, 21.0, 39.0, 0.5776400170519334, 0.24405967642339166, 0.419127473310143], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.497999999999997, 2, 52, 4.0, 5.0, 6.0, 10.990000000000009, 0.5821636694940416, 0.2994447523039127, 0.23422991389799327], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.544000000000002, 2, 24, 3.0, 4.0, 5.949999999999989, 9.990000000000009, 0.5790937877134829, 0.35561448257101425, 0.2895468938567415], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.96, 2, 27, 4.0, 5.0, 6.0, 10.0, 0.5790770207182176, 0.33913894540519757, 0.2731388681707999], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 530.1860000000003, 375, 787, 536.0, 633.0, 642.0, 711.8800000000001, 0.5785717839798101, 0.5286213766218814, 0.2548201900145453], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.657999999999982, 5, 123, 14.0, 28.0, 37.0, 51.99000000000001, 0.5787579622626658, 0.5124336562513384, 0.23794638878181867], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.913999999999994, 6, 45, 10.0, 12.0, 14.0, 22.0, 0.5791601945514926, 0.38609850110445854, 0.27091575506852045], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 516.1400000000006, 429, 3636, 500.0, 563.0, 593.0, 654.9100000000001, 0.5788986799952298, 0.4350423580164153, 0.3199772000754884], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.99399999999997, 142, 260, 179.0, 192.0, 196.95, 224.92000000000007, 0.5822334942626712, 11.257428890003867, 0.29339109671829916], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 263.2960000000003, 213, 399, 268.0, 288.90000000000003, 293.0, 337.9000000000001, 0.5820586249447045, 1.1282080979633768, 0.4160809701753161], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.36199999999998, 12, 37, 19.0, 22.0, 23.94999999999999, 32.97000000000003, 0.5815637318246795, 0.47459462463550495, 0.35893386573554437], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.991999999999997, 11, 31, 19.0, 22.0, 24.0, 28.0, 0.5815671140080908, 0.48361849022850933, 0.3680229393332449], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.93600000000001, 12, 36, 19.0, 22.0, 24.0, 30.0, 0.5815346466711794, 0.47062849320593075, 0.3549405802436398], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.932, 13, 85, 22.0, 25.0, 27.0, 40.960000000000036, 0.581544115936635, 0.5201764459367513, 0.4043548931121915], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.486, 11, 48, 19.0, 22.0, 23.0, 33.0, 0.5813378910223989, 0.4364064943435823, 0.32075772307388223], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2100.1819999999975, 1677, 2608, 2096.0, 2373.0, 2469.75, 2570.9700000000003, 0.5802173726364845, 0.4848282766905794, 0.3694352802333866], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["500", 8, 1.5748031496062993, 0.034035311635822164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
