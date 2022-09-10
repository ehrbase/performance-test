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

    var data = {"OkPercent": 97.8557753669432, "KoPercent": 2.1442246330567962};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9019357583492874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.992, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.724, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.688, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 504, 2.1442246330567962, 186.91916613486563, 1, 3900, 18.0, 530.0, 1190.9500000000007, 2175.980000000003, 26.398959540688427, 177.09451189722094, 218.7185306755236], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.693999999999992, 19, 128, 31.0, 34.0, 36.0, 51.92000000000007, 0.5727317816883903, 0.3326911667720493, 0.2897217411275256], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.6220000000000026, 5, 41, 7.0, 10.0, 13.949999999999989, 20.0, 0.5725029140398324, 6.11933493159449, 0.2079795742410329], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.737999999999993, 5, 32, 7.0, 9.0, 11.0, 15.990000000000009, 0.5724878374958924, 6.147308428752744, 0.24263644675118878], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.084000000000024, 14, 266, 20.0, 26.900000000000034, 31.899999999999977, 68.97000000000003, 0.5686697109451859, 0.30697501833959817, 6.332003949411143], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.711999999999954, 27, 70, 45.0, 53.0, 55.0, 58.0, 0.5722683343328954, 2.3800047637762156, 0.23919028036570236], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4820000000000007, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.5723017403695925, 0.35762375667446905, 0.24311646197341086], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.08599999999995, 24, 105, 40.0, 47.0, 49.0, 57.0, 0.5722558899437472, 2.3486253519373723, 0.2090075223036733], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 773.4379999999998, 585, 1046, 772.5, 914.0, 929.0, 960.96, 0.5719194417151178, 2.418831628989567, 0.27925753989995983], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.068000000000003, 8, 66, 13.0, 16.0, 18.0, 24.980000000000018, 0.571925983626903, 0.8504338308803427, 0.2932237709024649], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2940000000000014, 1, 40, 3.0, 4.0, 5.0, 10.980000000000018, 0.569426143720881, 0.5492459925923353, 0.3125170827843116], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 21.865999999999996, 14, 113, 23.0, 26.0, 28.0, 42.0, 0.5722074274812917, 0.9325338206776309, 0.374952327968698], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.628509296759941, 1741.961696888807], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.395999999999998, 2, 32, 4.0, 5.0, 7.0, 15.970000000000027, 0.5694365197862108, 0.5721524650622223, 0.335322481866294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 22.12599999999999, 14, 63, 24.0, 27.0, 29.0, 40.960000000000036, 0.5721773063036774, 0.8989911262452008, 0.34140657631987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.425999999999995, 8, 32, 13.0, 16.0, 17.0, 22.0, 0.5721746872207073, 0.8854794419780536, 0.3279946693345265], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1958.261999999999, 1539, 3900, 1956.0, 2181.0, 2237.8, 2393.92, 0.5709391949757351, 0.8718263809591779, 0.3155777190979161], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.052000000000035, 12, 159, 17.0, 23.0, 30.0, 55.99000000000001, 0.5686283206472355, 0.30692046787591165, 4.5856764374071], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.388000000000005, 17, 56, 28.0, 31.900000000000034, 33.0, 43.960000000000036, 0.5722473756735351, 1.0358862230585935, 0.4783630406020958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 21.837999999999997, 14, 91, 23.0, 27.0, 28.0, 36.99000000000001, 0.5722211795080729, 0.9687492221368341, 0.41128397277142736], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.129214638157895, 1794.5363898026317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.6552329220314735, 2735.9732653791134], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2520000000000007, 1, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.5693450937255893, 0.4785556793169453, 0.2418604646197572], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 403.6599999999998, 317, 1650, 400.0, 470.0, 477.0, 532.96, 0.5691299369176378, 0.5010977893997273, 0.2645564941140582], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9280000000000004, 1, 14, 3.0, 4.0, 4.949999999999989, 9.0, 0.5694235497636323, 0.5158465769388018, 0.2791509980286557], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1144.762, 922, 1734, 1138.0, 1312.8000000000002, 1344.0, 1427.7500000000002, 0.568808800609763, 0.5380320228689578, 0.30162419797959117], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.868443080357], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 44.97199999999995, 20, 679, 44.0, 50.900000000000034, 60.0, 91.0, 0.568197960169323, 0.30642516477740844, 25.990617631182705], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.494, 10, 194, 48.0, 55.0, 63.94999999999999, 97.99000000000001, 0.5690029929557429, 128.03474190024238, 0.17670210132805297], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.9640976123595504, 1.5434808052434457], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.264000000000003, 1, 17, 2.0, 3.0, 4.0, 8.980000000000018, 0.572531102752157, 0.622097535683001, 0.24656857061884885], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1220000000000017, 2, 19, 3.0, 4.0, 5.0, 9.990000000000009, 0.5725258581303825, 0.5875244701130051, 0.21190166038224117], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.280000000000001, 1, 22, 2.0, 3.0, 4.0, 6.0, 0.5725140580826962, 0.3246724987003931, 0.22307920817870683], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.59799999999998, 86, 218, 121.5, 148.0, 152.89999999999998, 167.96000000000004, 0.5724445787781056, 0.5214109209688739, 0.1878333774115659], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 3, 0.6, 172.554, 45, 560, 173.5, 204.90000000000003, 236.0, 394.62000000000035, 0.5687615671883727, 0.3063958553491457, 168.25122454365416], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3040000000000003, 1, 22, 2.0, 3.0, 4.0, 8.0, 0.5725212691651494, 0.3191828439707785, 0.24097330762712835], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.346, 1, 18, 3.0, 5.0, 6.0, 9.990000000000009, 0.5725645394748896, 0.30792677493575826, 0.24490553543945473], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.38799999999999, 7, 449, 10.0, 16.0, 20.0, 45.99000000000001, 0.5679275415325411, 0.23995604169837595, 0.41318947113451476], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.533999999999996, 2, 47, 4.0, 5.0, 6.0, 10.990000000000009, 0.5725343806895604, 0.29445935220597497, 0.23147386094284964], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6739999999999973, 2, 12, 3.0, 5.0, 6.0, 9.990000000000009, 0.5693379624305265, 0.34962354840169757, 0.2857809694231354], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8600000000000003, 2, 23, 4.0, 5.0, 6.0, 9.980000000000018, 0.5693243486360127, 0.3334272510942414, 0.26965069246920526], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 520.6919999999998, 380, 732, 525.5, 632.0, 644.0, 678.8600000000001, 0.5688521587370572, 0.5197408853529671, 0.25165041787879583], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.603999999999978, 7, 115, 15.0, 25.0, 35.94999999999999, 57.97000000000003, 0.5691234588136735, 0.5039032443167332, 0.23509689753728896], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.472000000000007, 7, 65, 12.0, 14.0, 15.0, 22.99000000000001, 0.569446896229692, 0.37965536184079407, 0.2674843330922675], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 525.2679999999993, 433, 3741, 510.0, 581.8000000000001, 611.95, 675.9000000000001, 0.5692063896832481, 0.4277908420526265, 0.31573166927742663], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 176.4140000000001, 143, 302, 183.0, 192.0, 198.0, 256.99, 0.5726071605670644, 11.071272216442072, 0.2896587003649798], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 272.25999999999965, 218, 416, 274.5, 298.0, 303.95, 359.98, 0.5724275392599428, 1.1095076779705841, 0.4103142713054668], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 21.879999999999995, 14, 90, 23.0, 26.0, 27.0, 37.98000000000002, 0.5719076666510344, 0.4667470274384141, 0.35409127017261316], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 21.36599999999998, 14, 55, 23.0, 26.0, 27.94999999999999, 38.98000000000002, 0.5719128999529888, 0.4756226505103179, 0.36303064938422136], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 21.218, 14, 56, 23.0, 26.0, 27.0, 46.940000000000055, 0.5718677658727617, 0.46280521118790663, 0.3501573136740445], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.010000000000012, 16, 61, 25.0, 29.0, 31.0, 40.99000000000001, 0.5718821556754728, 0.5115016760436277, 0.3987537687034059], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.81399999999999, 14, 123, 22.0, 25.0, 26.94999999999999, 45.99000000000001, 0.5716304386349008, 0.42908679679452516, 0.3165180260800671], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2143.9539999999974, 1666, 3461, 2129.0, 2411.8, 2484.95, 2661.7200000000003, 0.5705326721240018, 0.4767357636408656, 0.36438317145419646], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 99.2063492063492, 2.1272069772388855], "isController": false}, {"data": ["500", 4, 0.7936507936507936, 0.017017655817911082], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 504, "No results for path: $['rows'][1]", 500, "500", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
