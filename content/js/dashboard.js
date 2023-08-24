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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8920867900446714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.215, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.637, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.964, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.117, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.1032546266737, 1, 18605, 9.0, 836.0, 1500.0, 6045.0, 15.320298858261326, 96.50652232963704, 126.77678044905323], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6199.599999999999, 4990, 18605, 6043.0, 6516.7, 6689.25, 15147.030000000073, 0.330297677478851, 0.1918274724350073, 0.16643906404207728], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.246, 1, 6, 2.0, 3.0, 4.0, 5.0, 0.3313472379888283, 0.1701099184405341, 0.1197250762264321], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5819999999999994, 2, 14, 3.0, 4.0, 5.0, 7.990000000000009, 0.33134482260460885, 0.19017057196577605, 0.13978609703631936], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.98200000000001, 8, 366, 11.0, 15.0, 18.0, 41.950000000000045, 0.3295453197314601, 0.17143758522865832, 3.6259639818499623], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.197999999999944, 25, 64, 34.0, 41.0, 42.0, 44.99000000000001, 0.3312699631561547, 1.3777174851491676, 0.13781348076613467], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2320000000000007, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.3312769866515251, 0.2069542979793429, 0.14008099142588903], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.16, 22, 46, 30.0, 36.0, 37.0, 39.98000000000002, 0.3312741333206124, 1.359618274265499, 0.12034568124537873], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 846.8479999999996, 684, 1079, 853.0, 981.9000000000001, 1042.85, 1072.99, 0.33111661794837494, 1.4003613755031319, 0.16103132396317454], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.524000000000003, 3, 20, 5.0, 7.0, 8.0, 11.0, 0.33124253048093766, 0.49256475936389504, 0.16917953461086951], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9140000000000046, 2, 32, 4.0, 5.0, 6.0, 9.0, 0.3296689530307456, 0.31798566562304464, 0.18028770868868899], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.510000000000006, 5, 15, 7.0, 9.0, 11.0, 14.990000000000009, 0.33127808409957954, 0.5398506364431732, 0.2164307014283386], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.8687092118473896, 2375.0803997238954], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.063999999999999, 2, 24, 4.0, 5.0, 6.0, 10.990000000000009, 0.3296752566851549, 0.3311916340865094, 0.1934910442068145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.853999999999997, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.33127654767433923, 0.5204373974699085, 0.19701896243522715], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.488000000000002, 4, 15, 6.0, 8.0, 8.949999999999989, 12.0, 0.33127654767433923, 0.5126731033837911, 0.1892546683491098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1546.164000000001, 1334, 1910, 1529.5, 1733.0, 1770.95, 1861.93, 0.33094786115016295, 0.5053774218350795, 0.18227987664911321], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.50800000000001, 7, 78, 10.0, 14.0, 17.0, 39.950000000000045, 0.32953446007755927, 0.1714319357694498, 2.6568715843753212], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.846000000000004, 8, 21, 10.0, 13.0, 15.0, 18.99000000000001, 0.33127962053907145, 0.5997034622944162, 0.27628202728551465], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.654000000000005, 5, 17, 7.0, 10.0, 11.0, 14.0, 0.3312798400315909, 0.5608820033800482, 0.2374603540851442], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 1.0354178292410714, 4268.846784319197], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2720000000000042, 1, 26, 2.0, 3.0, 3.0, 7.0, 0.3297546163997523, 0.27717099207170975, 0.13943725478622337], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.302, 413, 711, 552.0, 640.9000000000001, 655.9, 677.98, 0.3296224438603535, 0.29025766977863215, 0.15257913905254644], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2500000000000013, 1, 19, 3.0, 4.0, 5.0, 9.0, 0.3297222156277779, 0.298717379550826, 0.1609971755995009], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 749.7540000000008, 613, 998, 728.5, 878.7, 894.9, 916.97, 0.3295322882326656, 0.31173947552135306, 0.17409860149792197], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.936468160377359, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.39000000000001, 15, 643, 22.0, 27.0, 36.0, 61.0, 0.32939638770745383, 0.17136010712464622, 15.025493427553876], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.122000000000018, 20, 248, 29.0, 35.0, 41.94999999999999, 101.99000000000001, 0.3296691703941261, 74.5614790918455, 0.10173384555131235], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 1.1205428685897436, 0.8764022435897435], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5580000000000025, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.3313020102743379, 0.36000298813706894, 0.14203279542034605], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3259999999999996, 2, 17, 3.0, 4.0, 5.0, 8.990000000000009, 0.3313006931473102, 0.3399423352507913, 0.12197300909817964], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7759999999999987, 1, 11, 2.0, 3.0, 3.0, 6.990000000000009, 0.33134811631909356, 0.1879073873317, 0.1284621115026173], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.69000000000001, 64, 118, 90.5, 110.0, 113.0, 117.0, 0.3313318679629253, 0.3017935025075196, 0.10807113662071978], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 85.62800000000007, 58, 461, 82.0, 95.90000000000003, 102.0, 405.1000000000008, 0.32960679886536154, 0.1714695681870769, 97.46254162933869], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.9379999999998, 11, 353, 262.0, 334.0, 336.95, 343.98, 0.3312967418290628, 0.1846429331340473, 0.13879521703580855], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 417.63000000000017, 311, 562, 404.5, 496.0, 505.95, 526.98, 0.3312660125708826, 0.1781557673661238, 0.14104685691494612], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.239999999999996, 4, 306, 6.0, 8.0, 11.0, 24.99000000000001, 0.32933585472863713, 0.14849380613941313, 0.23896146490564196], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 387.7499999999998, 280, 506, 384.0, 452.0, 464.95, 484.98, 0.3312420915950632, 0.17037941607815987, 0.13327318529020118], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3220000000000014, 2, 20, 3.0, 4.0, 5.0, 9.990000000000009, 0.3297504844034616, 0.20245842485283236, 0.1648752422017308], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.103999999999997, 2, 25, 4.0, 5.0, 5.0, 11.990000000000009, 0.32974570011607046, 0.1931169861490319, 0.15553434878521685], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.46, 533, 879, 674.0, 809.9000000000001, 830.0, 849.96, 0.3295994114672909, 0.3011811184609949, 0.14516536579272285], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.89200000000005, 169, 306, 233.5, 283.0, 289.0, 297.98, 0.3296785172906492, 0.2919168050904341, 0.1355416560345345], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.352000000000001, 3, 44, 4.0, 5.0, 6.0, 10.0, 0.32967916941948777, 0.21980006421326023, 0.15421515835149865], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 973.6640000000009, 809, 8248, 927.0, 1082.9, 1102.95, 1228.990000000001, 0.329449996408995, 0.24763765306246832, 0.1820983378588781], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.79600000000002, 116, 164, 137.0, 149.0, 151.0, 153.0, 0.33135514312885406, 6.406644908024097, 0.16697192759227414], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.81599999999995, 159, 244, 175.0, 202.0, 203.95, 213.99, 0.3313263790135221, 0.6421745875897729, 0.23684659124794744], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.0100000000000025, 5, 23, 7.0, 9.0, 10.0, 14.990000000000009, 0.331239019426506, 0.2703317977782474, 0.2044365823022967], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.832000000000001, 5, 28, 7.0, 9.0, 10.0, 12.990000000000009, 0.33124099438546517, 0.2755090501250435, 0.20961344175955218], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.287999999999998, 6, 23, 8.0, 10.0, 11.0, 14.0, 0.331235727880575, 0.2680648047381946, 0.20217024406773373], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.521999999999993, 7, 19, 9.0, 12.0, 13.0, 15.990000000000009, 0.33123704449109737, 0.2962080800888113, 0.23031325749771614], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.664000000000004, 5, 28, 7.0, 9.0, 10.949999999999989, 18.99000000000001, 0.33124823610314275, 0.24866585114731138, 0.18276880214675356], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.2600000000007, 1371, 1973, 1595.5, 1795.0, 1882.55, 1948.97, 0.33091347340680055, 0.2765292659462239, 0.21069881314573627], "isController": false}]}, function(index, item){
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
