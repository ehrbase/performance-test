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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8797489895766858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.385, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.827, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.321, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.946, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.546, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.955, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.873, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 287.1514996809151, 1, 7014, 25.0, 800.9000000000015, 1863.8500000000022, 3777.980000000003, 16.82092106082368, 113.30505733059032, 139.33048530960372], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 35.11600000000001, 14, 97, 32.0, 56.0, 61.94999999999999, 78.98000000000002, 0.3647015574215308, 0.21180826485757676, 0.18377539416944327], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.603999999999997, 5, 60, 12.0, 25.0, 29.94999999999999, 47.98000000000002, 0.3645943851006317, 3.9025905262792344, 0.1317382055539392], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.620000000000003, 5, 62, 13.0, 27.0, 31.0, 39.99000000000001, 0.36457923181697544, 3.9148510791818696, 0.1538068634227865], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 74.126, 15, 664, 66.5, 134.90000000000003, 152.0, 183.96000000000004, 0.3610293379660618, 0.19486770057345898, 4.019271926575297], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 65.502, 27, 149, 55.0, 115.0, 124.0, 144.0, 0.3645428159182724, 1.516095835526666, 0.15165550740350006], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.364000000000006, 1, 34, 6.0, 15.0, 17.0, 24.0, 0.36455716876153366, 0.22774498674652413, 0.1541535684313907], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 58.06600000000001, 23, 148, 49.0, 100.0, 109.0, 127.99000000000001, 0.36452102302096073, 1.496070457676193, 0.13242365289433336], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1157.366000000001, 575, 2558, 920.5, 2173.8, 2320.85, 2443.67, 0.3643980217560195, 1.5411153874990344, 0.17721700667431417], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.086000000000002, 6, 107, 16.0, 31.0, 35.0, 47.960000000000036, 0.36415094202207193, 0.5415002743422159, 0.1859872487085387], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.42, 2, 73, 9.0, 24.0, 27.0, 43.960000000000036, 0.3623401083686796, 0.34949897308284034, 0.19815474676412165], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.496000000000002, 9, 72, 22.0, 46.0, 52.0, 60.0, 0.364485947244304, 0.5939661572519946, 0.2381260729555072], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.5759214743589743, 1596.2078799763833], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.126000000000005, 3, 94, 8.0, 21.0, 24.0, 35.950000000000045, 0.3623556012928848, 0.3640222955136753, 0.21267159802443728], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 27.805999999999987, 10, 67, 24.0, 45.900000000000034, 50.0, 59.98000000000002, 0.3644769136678114, 0.5725953669790477, 0.21676410197626672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 18.949999999999996, 6, 48, 17.0, 32.0, 36.0, 44.0, 0.3644718656877438, 0.5640451272207271, 0.2082187904563771], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2867.8859999999972, 1506, 6210, 2582.5, 4288.9, 4715.95, 5666.280000000002, 0.3637601743720772, 0.5554838108079696, 0.20035228354087065], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 68.44600000000004, 12, 246, 61.5, 128.0, 144.0, 192.0, 0.36097564497323364, 0.19483871946597264, 2.9103661375966965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 32.09599999999998, 12, 115, 27.0, 52.0, 56.0, 68.99000000000001, 0.36450826741201314, 0.6598560745940654, 0.30399419957994067], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 26.404000000000032, 9, 79, 20.5, 46.900000000000034, 52.94999999999999, 67.99000000000001, 0.3644984355727145, 0.6171236159538778, 0.2612713395609106], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.17578125, 1515.3645833333335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 0.525238317087156, 2193.168990108945], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.532000000000004, 1, 45, 6.0, 19.0, 21.0, 31.0, 0.3620229261878696, 0.3042937039054309, 0.15308195999936286], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 583.6340000000004, 323, 1338, 474.5, 1156.0000000000005, 1221.95, 1303.97, 0.36194378289164125, 0.3187190707726776, 0.16754038387757614], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.399999999999995, 1, 39, 7.0, 23.0, 26.0, 35.0, 0.3620591025278967, 0.32801352539663575, 0.17678667115619953], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1713.3419999999999, 931, 3827, 1348.5, 3134.600000000001, 3470.6, 3696.9300000000003, 0.36182434730505986, 0.3422879526151217, 0.19115915223831778], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.724984217171717, 665.1179766414141], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 102.492, 28, 1331, 85.5, 171.0, 187.95, 254.8800000000001, 0.3606322315778237, 0.19465336007361225, 16.495402795548934], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 117.15599999999999, 30, 356, 104.5, 215.0, 243.69999999999993, 299.95000000000005, 0.3614265360808497, 81.78924034444492, 0.11153397011869971], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 1.5026190902578798, 1.1752328080229226], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.596, 1, 76, 6.0, 19.900000000000034, 23.0, 29.980000000000018, 0.36461857979604695, 0.3962058007078705, 0.15631597317428184], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.505999999999995, 2, 47, 8.0, 21.0, 25.0, 35.99000000000001, 0.3646063491091209, 0.37411673542230894, 0.13423495470130717], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.742000000000001, 1, 25, 5.5, 14.0, 16.0, 19.99000000000001, 0.3646002340733503, 0.2067646503210305, 0.1413538016866407], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 191.452, 89, 468, 143.5, 370.80000000000007, 400.0, 431.9100000000001, 0.3645491948201934, 0.3320494916999439, 0.11890569440424277], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 315.32399999999996, 114, 1780, 271.0, 502.0, 535.0, 727.910000000001, 0.36117224954690946, 0.19494483793659403, 106.84138231274483], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.286000000000006, 1, 24, 7.0, 13.0, 16.0, 20.0, 0.36460342450120425, 0.20320587929402567, 0.15274889561622718], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.044000000000002, 2, 36, 7.0, 20.0, 24.0, 32.99000000000001, 0.3646659149686606, 0.19611832620350692, 0.15526790910775004], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 59.15199999999999, 7, 392, 50.0, 125.90000000000003, 140.95, 166.97000000000003, 0.3605362760784902, 0.15235122267765966, 0.26160005188117014], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.260000000000005, 3, 163, 9.0, 20.0, 24.0, 32.0, 0.3646228341403652, 0.1875493095410857, 0.14670371842366256], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.634000000000002, 2, 41, 7.0, 20.0, 23.94999999999999, 35.92000000000007, 0.36201375217841775, 0.22226725208212209, 0.18100687608920887], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.02999999999998, 2, 44, 8.0, 23.900000000000034, 26.94999999999999, 35.97000000000003, 0.36200615120852137, 0.21201045795045148, 0.17075094827511308], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 791.9719999999999, 381, 1840, 630.0, 1527.0, 1625.9, 1723.6800000000003, 0.36153002398390177, 0.3303586511152117, 0.15922855548509737], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 30.568000000000005, 6, 439, 27.0, 54.0, 67.0, 89.0, 0.3615179996196831, 0.3201093607765262, 0.14863191195301423], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 15.80200000000002, 5, 181, 14.0, 28.0, 30.0, 38.97000000000003, 0.3623787118451454, 0.2416011429333977, 0.16951113571662565], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 849.1900000000007, 468, 6082, 808.0, 996.0, 1058.95, 1412.4200000000014, 0.36229153744935166, 0.2723236516505278, 0.20025098651985646], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 256.8660000000003, 143, 604, 195.0, 497.80000000000007, 525.95, 556.0, 0.3646571384187446, 7.050528254865802, 0.18375301115632048], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 385.26000000000016, 202, 865, 302.5, 694.0, 728.75, 800.8500000000001, 0.3645850803035098, 0.7066363815714638, 0.26062136599821206], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 25.98000000000001, 10, 68, 21.0, 44.0, 48.0, 56.99000000000001, 0.3641379471067784, 0.29718137087559154, 0.22474138922996476], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 25.32200000000002, 9, 88, 21.0, 44.0, 48.0, 60.960000000000036, 0.36414484225245436, 0.3028767613230839, 0.23043540798788129], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 27.89999999999999, 9, 90, 23.0, 48.0, 52.0, 65.98000000000002, 0.3641276048778534, 0.2946837767952401, 0.22224585258658044], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 28.682, 11, 71, 24.0, 47.0, 51.94999999999999, 68.99000000000001, 0.3641339692568972, 0.32562609080882166, 0.25318690049893633], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 27.823999999999998, 9, 113, 23.0, 49.0, 55.0, 63.99000000000001, 0.36388910115753126, 0.2731691317878963, 0.20077865444727064], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3316.2619999999984, 1675, 7014, 2932.0, 5039.5, 5719.85, 6511.420000000002, 0.36346110929784403, 0.30372783773169737, 0.23142250318573662], "isController": false}]}, function(index, item){
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
