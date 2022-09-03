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

    var data = {"OkPercent": 97.74941501808127, "KoPercent": 2.250584981918741};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8986598596043395, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.967, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.493, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.959, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.683, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.658, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 529, 2.250584981918741, 188.35252074026823, 1, 3748, 16.0, 561.0, 1220.9500000000007, 2233.0, 26.113997235838113, 171.1492050517475, 216.3575839678055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.71599999999999, 16, 73, 25.0, 30.0, 31.0, 40.99000000000001, 0.5659943785438324, 0.3286492788241127, 0.28631356258369645], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.396000000000003, 4, 33, 7.0, 10.0, 13.0, 20.99000000000001, 0.5657689422270703, 6.046949504697579, 0.20553324854342786], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.6540000000000035, 4, 34, 7.0, 9.0, 11.0, 16.0, 0.5657516576523569, 6.075008150359818, 0.23978146427844035], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.700000000000006, 14, 287, 20.0, 29.0, 35.0, 59.98000000000002, 0.5621046998698165, 0.3035266571830235, 6.2589040897613755], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.660000000000025, 26, 156, 43.0, 52.0, 54.0, 64.99000000000001, 0.5656370940281167, 2.3525542739397416, 0.2364186291445644], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4519999999999995, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.5656780499946261, 0.3535487812466413, 0.2403026872535765], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.40399999999999, 24, 104, 38.0, 46.0, 48.0, 55.99000000000001, 0.5656242965047813, 2.321472356809381, 0.20658543641873844], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 778.2659999999993, 571, 1855, 779.5, 908.9000000000001, 931.9, 978.99, 0.5653096596722786, 2.3906205746853204, 0.27603010726185484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.128, 7, 35, 11.0, 14.0, 16.0, 26.960000000000036, 0.5654157784927146, 0.8408494612294402, 0.2898860192467531], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.783999999999998, 2, 53, 3.0, 5.0, 7.0, 21.0, 0.5630212168915373, 0.5431318326143553, 0.30900187880180074], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.900000000000016, 11, 55, 18.0, 22.0, 23.94999999999999, 36.98000000000002, 0.5655788699734178, 0.9213467581726147, 0.37060881030484705], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.6647317951713395, 1842.3551280179126], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.440000000000003, 2, 21, 4.0, 6.0, 7.0, 14.0, 0.5630294588273448, 0.5657467357663337, 0.33154957389930556], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.542000000000016, 12, 56, 19.0, 22.900000000000034, 24.0, 35.940000000000055, 0.5655532807745818, 0.8886476843420918, 0.3374541548371772], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.713999999999992, 7, 54, 11.0, 13.900000000000034, 15.0, 21.0, 0.5655481632126755, 0.8753525750963129, 0.32419606621664115], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1949.255999999999, 1509, 3088, 1940.5, 2210.7000000000003, 2295.75, 2667.7200000000003, 0.5644525825963463, 0.861985240411644, 0.31199234545852744], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.19200000000001, 12, 133, 17.0, 25.0, 31.0, 59.960000000000036, 0.5620737373294528, 0.30344626553993365, 4.532817307486934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.537999999999986, 14, 78, 23.0, 27.0, 30.0, 53.92000000000007, 0.565591665441218, 1.0239661514597922, 0.47279928282976824], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.871999999999986, 11, 60, 19.0, 22.0, 24.0, 29.99000000000001, 0.5655871869616317, 0.9574860837272647, 0.40651579062867277], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.063264266304348, 1482.4431046195652], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.673540900735294, 2812.419577205882], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3620000000000014, 1, 24, 2.0, 3.0, 5.0, 9.990000000000009, 0.5628779725585731, 0.4727372428632702, 0.2391132012333782], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 417.61600000000016, 315, 729, 424.0, 483.90000000000003, 515.95, 564.98, 0.5626740069366452, 0.49538171241956575, 0.26155549541195616], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1179999999999994, 1, 39, 3.0, 4.0, 5.0, 11.0, 0.5629565577683502, 0.5100518356324479, 0.2759806562497185], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.7, 926, 2164, 1169.0, 1347.9, 1383.9, 1536.8100000000002, 0.5623714981126813, 0.531974879286958, 0.29821066745623626], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, 1.8, 44.48800000000001, 12, 728, 43.0, 53.0, 61.0, 100.98000000000002, 0.561622955552036, 0.3011812791131299, 25.689862537165396], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.212, 10, 204, 45.0, 56.0, 60.94999999999999, 90.98000000000002, 0.562440451617185, 122.47979002059095, 0.17466412462330552], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.8400493421052633, 1.4459978070175439], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2260000000000013, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.5658041548130697, 0.6148523024834276, 0.2436715158911755], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3740000000000023, 1, 30, 3.0, 5.0, 6.949999999999989, 18.960000000000036, 0.5657983924536073, 0.5803964330089045, 0.2094117097069504], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.350000000000001, 1, 58, 2.0, 3.0, 4.0, 9.0, 0.5657817462966757, 0.32091869977979776, 0.22045597341052106], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.92200000000005, 82, 342, 122.0, 152.0, 157.0, 171.0, 0.565716451600129, 0.5154107790905542, 0.18562571068129233], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 20, 4.0, 177.46199999999996, 37, 602, 178.0, 210.0, 238.95, 349.85000000000014, 0.562209618731925, 0.2990472022762743, 166.3130251037839], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.274, 1, 16, 2.0, 3.0, 4.0, 9.990000000000009, 0.5657926302115159, 0.31549569516677306, 0.23814123400504233], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2219999999999995, 2, 22, 3.0, 4.0, 6.0, 9.0, 0.5658553809451595, 0.30438267193798674, 0.24203579770896472], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.451999999999991, 6, 312, 10.0, 16.0, 21.0, 53.91000000000008, 0.5614419626214399, 0.23727940945288606, 0.40847095913376247], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.351999999999997, 2, 77, 4.0, 5.0, 6.0, 12.0, 0.5658073561745991, 0.29112777641669674, 0.22875414595340238], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7599999999999976, 2, 29, 3.0, 5.0, 6.0, 13.980000000000018, 0.5628703687026063, 0.34571564007085415, 0.28253454054017546], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.128000000000001, 2, 46, 4.0, 5.0, 7.0, 17.960000000000036, 0.5628545279958214, 0.3297019337008023, 0.26658637312302086], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 539.6800000000004, 377, 935, 545.0, 643.0, 658.8499999999999, 759.7200000000003, 0.5623670704837144, 0.5137838277852073, 0.24878152629797132], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.901999999999994, 7, 108, 14.0, 27.0, 35.0, 56.98000000000002, 0.5625606862340276, 0.4981562776709538, 0.23238590847362658], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.71, 6, 67, 10.0, 12.0, 13.0, 21.99000000000001, 0.5630370669822676, 0.37503107260813406, 0.26447346603366284], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 538.7659999999997, 354, 3520, 523.0, 603.0, 643.9, 756.7500000000002, 0.562840588911365, 0.4229747025668908, 0.31220063916177276], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 175.00200000000015, 141, 930, 175.0, 192.0, 202.95, 238.83000000000015, 0.5658662676932236, 10.941002181697396, 0.28624875650887677], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 264.04400000000015, 212, 893, 265.0, 288.0, 299.0, 346.96000000000004, 0.5657215722081357, 1.0966059658026968, 0.4055074550788786], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.87199999999998, 11, 55, 18.0, 21.900000000000034, 23.0, 37.97000000000003, 0.5653876467322291, 0.46110564981981095, 0.3500544609650715], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.750000000000007, 11, 88, 18.0, 22.0, 23.0, 32.97000000000003, 0.565397876139418, 0.47017250571899954, 0.3588951362213103], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.511999999999976, 11, 40, 19.0, 22.0, 23.0, 32.99000000000001, 0.5653710247349824, 0.4576435512367491, 0.34617932862190814], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.35199999999998, 13, 45, 21.0, 25.0, 27.0, 32.99000000000001, 0.5653786963045718, 0.5057168885259785, 0.3942191300404924], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.305999999999997, 10, 127, 18.0, 22.0, 23.0, 36.960000000000036, 0.5650719958229877, 0.42425980689512155, 0.31288654456214265], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2190.409999999997, 1689, 3748, 2175.0, 2512.8, 2573.95, 2790.5000000000005, 0.5640227910329401, 0.47136001546550493, 0.360225493491741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 94.5179584120983, 2.1272069772388855], "isController": false}, {"data": ["500", 29, 5.482041587901701, 0.12337800467985535], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 529, "No results for path: $['rows'][1]", 500, "500", 29, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 20, "500", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
