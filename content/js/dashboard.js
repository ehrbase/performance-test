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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8681344394809615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.453, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.745, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.777, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.485, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 502.3476281642206, 1, 25554, 13.0, 1055.0, 1890.9000000000015, 10676.87000000002, 9.875896887317298, 62.21096989511088, 81.82298446148107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11322.855999999996, 9214, 25554, 10764.0, 13057.7, 13533.75, 23679.76000000008, 0.21256036182875032, 0.12350919461729144, 0.10752565178446549], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9499999999999993, 1, 8, 3.0, 4.0, 5.0, 7.0, 0.21330939717484504, 0.10951062811405056, 0.07749130444242416], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.410000000000003, 3, 17, 4.0, 6.0, 6.0, 9.0, 0.21330794115601812, 0.12236460038463688, 0.0904059047477655], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.664000000000016, 10, 415, 14.0, 19.0, 23.0, 49.950000000000045, 0.2121382988969233, 0.1103595636771289, 2.362110238303437], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.91000000000004, 27, 60, 45.0, 55.0, 57.0, 59.0, 0.21326763552731703, 0.8869580196255276, 0.08913920703680828], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.695999999999998, 1, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.21327282072499962, 0.13324719332967927, 0.090599293960327], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.635999999999996, 24, 67, 39.0, 49.0, 50.0, 52.99000000000001, 0.21326454272243278, 0.8752701728530445, 0.07789154197088854], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1154.03, 817, 1724, 1149.0, 1497.7, 1594.0, 1695.98, 0.21319879636487524, 0.9017226436096433, 0.10410097478753674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.724000000000004, 4, 19, 7.0, 8.0, 9.0, 12.990000000000009, 0.2131382691893712, 0.31694118542709715, 0.1092749915277538], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.397999999999998, 3, 16, 4.0, 5.0, 6.0, 12.0, 0.21230259573891705, 0.2047787078489119, 0.11651763555202284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.033999999999995, 6, 29, 10.0, 12.0, 14.0, 17.0, 0.21326490657717503, 0.34759680573955576, 0.13974682843094183], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.7629932760141094, 2086.0528962742505], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.827999999999998, 3, 25, 4.0, 6.0, 7.0, 12.990000000000009, 0.21230358733617594, 0.21328010090683355, 0.12501861637081454], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.738, 7, 24, 16.5, 20.0, 20.0, 22.0, 0.2132640879057509, 0.3350512111054288, 0.127250349326576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.88999999999999, 6, 17, 8.0, 9.0, 11.0, 15.0, 0.21326454272243278, 0.33004145849381494, 0.12225223298639458], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2336.4939999999992, 1639, 3872, 2277.5, 2975.0, 3216.6499999999996, 3588.9300000000003, 0.21297929926402873, 0.325232285207182, 0.11772097986664087], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.137999999999996, 9, 90, 13.0, 17.0, 22.94999999999999, 40.97000000000003, 0.21213172871236888, 0.11035614570543559, 1.7107263825261156], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.879999999999995, 9, 33, 15.0, 18.0, 19.0, 24.0, 0.2132656342903842, 0.3860670302152618, 0.17827674116461803], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.064000000000005, 6, 27, 10.0, 13.0, 14.0, 18.0, 0.21326545236161631, 0.36101425823503214, 0.15328454388491172], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.823206018518518, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.6913072839046199, 2850.1420454545455], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8079999999999994, 2, 16, 3.0, 4.0, 4.0, 7.0, 0.2122833966362422, 0.1784921918982466, 0.09017898196949742], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 745.166, 571, 965, 738.0, 890.9000000000001, 910.95, 939.0, 0.21223077465081672, 0.18682525867747968, 0.09865414915409058], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8059999999999996, 2, 15, 4.0, 5.0, 5.0, 9.990000000000009, 0.21230250559417102, 0.19233902096168787, 0.10407798614089243], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 996.4959999999999, 784, 1292, 961.0, 1203.9, 1227.9, 1272.95, 0.21223032423275554, 0.2007711302612428, 0.11254010357264282], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.893880208333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.451999999999984, 19, 651, 27.0, 34.0, 40.0, 77.98000000000002, 0.21207414451410844, 0.11032618898838936, 9.700735282266445], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.367999999999995, 26, 253, 36.0, 42.0, 47.94999999999999, 114.90000000000009, 0.21220087104213545, 47.99354146092024, 0.06589831737441317], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.545696214880333, 0.4288338969823101], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.213999999999999, 2, 24, 3.0, 4.0, 4.949999999999989, 8.0, 0.21327518598662595, 0.23169099843285393, 0.09184995802744339], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8399999999999994, 2, 13, 4.0, 5.0, 6.0, 7.990000000000009, 0.21327436723627985, 0.21889781246614268, 0.07893650896733403], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1580000000000004, 1, 13, 2.0, 3.0, 4.0, 6.0, 0.21330994318702973, 0.12095590344866718, 0.08311588606603991], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.4220000000002, 90, 295, 195.0, 272.0, 277.0, 286.99, 0.2132934730490899, 0.19427827660900063, 0.06998692084423262], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.56799999999991, 83, 404, 111.0, 129.0, 135.95, 289.7600000000002, 0.2121668344199104, 0.11043449486895728, 62.76325926023365], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 263.392, 18, 507, 315.0, 432.0, 446.95, 484.99, 0.21327145617484847, 0.1188875900805313, 0.08976562266734345], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 534.9519999999997, 333, 1072, 504.0, 851.0, 928.95, 980.95, 0.21330102533802878, 0.11470179316839475, 0.09123618075982091], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.499999999999993, 5, 273, 7.0, 11.0, 14.949999999999989, 30.99000000000001, 0.21205174910885252, 0.09561173152446123, 0.15427593074813978], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 535.7280000000002, 307, 1120, 489.0, 897.5000000000002, 937.9, 992.98, 0.21324544209192073, 0.1096860418010113, 0.08621446584575701], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.196000000000001, 2, 15, 4.0, 5.0, 6.0, 11.0, 0.21228231509998072, 0.13033595149073135, 0.10655577144667001], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.657999999999997, 2, 47, 4.0, 5.0, 6.0, 10.990000000000009, 0.21227843968553922, 0.12432178033575657, 0.10054203442137355], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 897.3379999999996, 593, 1442, 896.5, 1171.0, 1326.0, 1402.94, 0.21219006458216805, 0.19389488801775434, 0.09386923755441613], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 508.4560000000006, 272, 1124, 423.0, 918.7000000000005, 961.8499999999999, 1020.9300000000001, 0.21219627816215952, 0.18789110094962078, 0.08765529849862645], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.654000000000001, 3, 48, 5.0, 7.0, 8.0, 12.0, 0.21230457894269772, 0.1416054955252564, 0.09972510006976329], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1223.1420000000005, 950, 9860, 1132.0, 1466.9, 1488.95, 1523.95, 0.21222302772651414, 0.15946156444661572, 0.1177174606920508], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.52199999999985, 144, 213, 166.5, 187.0, 189.0, 193.97000000000003, 0.21337675977148202, 4.125631315151926, 0.10793863433752704], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.23400000000012, 195, 335, 222.0, 256.0, 258.0, 264.99, 0.21335909573294612, 0.413531182511851, 0.1529351330742016], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.277999999999999, 6, 21, 9.0, 11.900000000000034, 12.0, 16.0, 0.21313627037955735, 0.17400578323956048, 0.13196132365296812], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.936000000000007, 5, 22, 9.0, 11.0, 12.0, 17.970000000000027, 0.213136997215152, 0.17721592008684053, 0.1352920392478992], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.943999999999988, 6, 28, 10.0, 12.0, 13.0, 19.0, 0.21313463501759428, 0.17248711268108452, 0.1305033360898746], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.285999999999994, 8, 26, 12.0, 15.0, 16.0, 18.99000000000001, 0.21313554354891995, 0.19060811566865946, 0.14861208798235237], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.572000000000003, 6, 44, 10.0, 11.0, 12.0, 20.980000000000018, 0.21311401343982214, 0.159983274679029, 0.11800356017615153], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2036.2560000000003, 1628, 2704, 1970.0, 2514.7000000000003, 2626.8, 2682.99, 0.21296079391783973, 0.17796160250335413, 0.1360120695529953], "isController": false}]}, function(index, item){
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
