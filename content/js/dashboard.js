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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8882578174856414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.182, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.575, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.899, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.097, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.72065517974653, 1, 18019, 9.0, 844.0, 1513.0, 6066.990000000002, 15.16765730193156, 95.54499371321415, 125.51365854436628], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6219.326000000002, 4974, 18019, 6054.5, 6588.1, 6728.25, 15081.460000000068, 0.3270481225148431, 0.18994022357500226, 0.16480159298599514], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.465999999999998, 1, 9, 2.0, 3.0, 4.0, 5.990000000000009, 0.3280872187062209, 0.1684362614707494, 0.11854713957158372], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.748000000000001, 2, 13, 4.0, 5.0, 5.0, 8.0, 0.32808485061640585, 0.18829955815992955, 0.1384107963537962], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.429999999999996, 8, 363, 12.0, 16.0, 19.94999999999999, 36.99000000000001, 0.3261180795297638, 0.16965465053349657, 3.5882542988885247], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.912, 24, 57, 34.0, 40.0, 42.0, 46.99000000000001, 0.3280323308665302, 1.3642525076021492, 0.13646657514564636], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.366, 1, 22, 2.0, 3.0, 4.0, 5.0, 0.3280398634042009, 0.20493201271318492, 0.13871216880275292], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.81600000000001, 21, 49, 30.0, 35.0, 36.94999999999999, 38.99000000000001, 0.32803276128793535, 1.346315006047284, 0.11916815156163275], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.338, 680, 1101, 859.0, 1003.9000000000001, 1071.0, 1086.0, 0.3278886332814832, 1.3867095537484886, 0.15946146423259633], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.7379999999999916, 4, 17, 5.0, 8.0, 9.0, 13.0, 0.3279789673647808, 0.48771177089455603, 0.16751269524587928], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9800000000000026, 2, 26, 4.0, 5.0, 5.0, 8.990000000000009, 0.3263140995101373, 0.31474970627652116, 0.17845302316960632], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.938000000000001, 6, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.32802695069426907, 0.5345525907158531, 0.21430666993600192], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.9487219024122807, 2593.8378049616226], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.244000000000004, 2, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.32631878473663467, 0.3278197236781479, 0.19152108361984124], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.229999999999997, 6, 31, 8.0, 10.0, 11.0, 15.0, 0.32802436827427034, 0.5153282045766616, 0.19508480495999087], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.718000000000003, 4, 26, 7.0, 8.0, 8.0, 12.0, 0.3280228618813817, 0.507637802199262, 0.1873958732427815], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1574.950000000002, 1337, 1957, 1550.0, 1775.0, 1852.85, 1913.99, 0.3276776176526486, 0.5003835620113507, 0.18047868784774787], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.121999999999996, 8, 85, 11.0, 15.0, 17.94999999999999, 62.99000000000001, 0.32610212735983807, 0.16964635182212826, 2.6291984018386945], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.301999999999998, 8, 50, 11.0, 13.0, 14.949999999999989, 18.99000000000001, 0.3280297483618194, 0.5938203367536995, 0.2735716846689393], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.939999999999992, 5, 24, 8.0, 10.0, 11.0, 14.0, 0.328028887535952, 0.5553778931737844, 0.2351300814954968], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 4.5794144417475735, 1324.1049757281555], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 1.1341496026894866, 4675.9006341687045], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4139999999999993, 1, 29, 2.0, 3.0, 4.0, 6.990000000000009, 0.32631303470469647, 0.27427821494206966, 0.13798197658899763], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 573.0019999999998, 451, 715, 561.5, 660.9000000000001, 675.95, 694.96, 0.326214463827383, 0.28725668376737257, 0.1510016170450972], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.406000000000001, 2, 15, 3.0, 4.0, 5.0, 10.0, 0.32632772963356005, 0.29564208794760743, 0.15933971173513675], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.8399999999993, 603, 982, 760.0, 888.9000000000001, 903.95, 937.9300000000001, 0.3261799887272196, 0.30856818054682117, 0.17232751357561113], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.766183035714285, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.656000000000034, 17, 647, 22.0, 27.0, 32.94999999999999, 56.960000000000036, 0.3259664906447617, 0.16957579026501074, 14.869037869157049], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.212, 21, 303, 29.0, 37.0, 41.94999999999999, 98.96000000000004, 0.32624043136814795, 73.78599907686191, 0.1006757581175144], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 1.0879959802904564, 0.8509465767634855], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.809999999999998, 1, 20, 3.0, 4.0, 4.0, 7.990000000000009, 0.32803900252524426, 0.35645730322252395, 0.1406339083091623], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4640000000000026, 2, 11, 3.0, 4.0, 5.0, 6.0, 0.3280374959979425, 0.33659402091796703, 0.12077161717893004], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9140000000000026, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.3280876492716782, 0.18605837774273074, 0.12719804371177368], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.1919999999999, 67, 121, 92.0, 111.0, 115.0, 118.0, 0.3280665528931861, 0.2988192915517614, 0.1070060826819572], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.88400000000003, 59, 376, 82.0, 96.0, 104.94999999999999, 307.9200000000001, 0.32618147824141214, 0.1696876321034987, 96.44969706710663], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.68000000000004, 13, 381, 262.0, 334.0, 336.0, 346.97, 0.3280329764990615, 0.18282392579861267, 0.13742787784970448], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 439.2900000000001, 338, 551, 427.5, 514.0, 524.0, 536.99, 0.32799359756497554, 0.17639585362793717, 0.13965352396321223], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.3799999999999955, 5, 270, 6.0, 8.0, 10.0, 33.91000000000008, 0.3259135846648533, 0.14695074333555608, 0.2364783138730332], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 411.43399999999997, 322, 503, 411.5, 470.90000000000003, 481.95, 497.98, 0.3279712224930536, 0.16869699472589478, 0.13195717154993952], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6020000000000025, 2, 13, 3.0, 5.0, 5.0, 8.0, 0.3263104791999911, 0.20034634900178364, 0.16315523959999556], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.297999999999999, 2, 42, 4.0, 5.0, 6.0, 10.990000000000009, 0.3263019611400469, 0.1911001456204077, 0.15391000706117444], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.0019999999997, 538, 867, 675.5, 812.6000000000001, 837.0, 851.0, 0.3261493503104942, 0.2980285240029614, 0.14364585643557898], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.61799999999997, 175, 321, 240.0, 290.0, 295.95, 312.95000000000005, 0.32625469398940976, 0.2888851499874392, 0.13413400993119287], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.554000000000002, 3, 72, 4.0, 5.0, 6.0, 9.0, 0.3263217663144567, 0.21756165339896752, 0.15264465435998512], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.5239999999995, 820, 8329, 938.0, 1090.0, 1119.0, 1136.98, 0.32615360530195303, 0.24515985501656862, 0.1802763091805717], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.59799999999987, 117, 165, 134.5, 150.0, 152.0, 157.0, 0.3280809756340821, 6.343339934664314, 0.16532205412811168], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.23199999999986, 160, 246, 181.0, 204.0, 207.0, 218.0, 0.328053207605848, 0.6358305485033229, 0.2345067851244929], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.213999999999998, 5, 24, 7.0, 9.0, 10.0, 13.980000000000018, 0.32797574029044224, 0.2676685604669194, 0.2024225272105073], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.007999999999996, 5, 18, 7.0, 9.0, 10.0, 13.0, 0.32797746138885336, 0.27279461292919954, 0.20754823728513377], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.624000000000008, 6, 27, 8.0, 10.0, 11.0, 17.99000000000001, 0.3279718678850603, 0.2654234049170198, 0.20017814201969011], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.831999999999994, 7, 21, 10.0, 12.0, 12.949999999999989, 17.980000000000018, 0.3279738040763208, 0.2932899337214138, 0.22804428564681684], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.891999999999999, 5, 27, 8.0, 9.0, 10.0, 14.990000000000009, 0.3279333639404473, 0.24617739862759885, 0.18093979553354758], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1608.9580000000008, 1437, 1973, 1585.0, 1783.0, 1858.95, 1951.89, 0.3276258722219783, 0.27378196788971587, 0.20860553582883776], "isController": false}]}, function(index, item){
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
