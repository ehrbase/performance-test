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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8709848968304617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.825, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.841, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.492, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.9993618379073, 1, 24247, 13.0, 1017.9000000000015, 1824.8500000000022, 10542.840000000026, 10.195450759941703, 68.72253100275869, 84.47052643692744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11042.73000000001, 8958, 24247, 10689.0, 12584.7, 13107.199999999999, 22394.600000000075, 0.21947825628914944, 0.12752886962113663, 0.11102513355251895], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.827999999999997, 5, 18, 8.0, 9.0, 10.949999999999989, 14.0, 0.22027654398437974, 2.3519795661014666, 0.08002233824432546], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.092, 6, 34, 9.0, 11.0, 13.0, 19.0, 0.22027382679957108, 2.36522506326815, 0.09335824299903696], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.54999999999999, 10, 410, 14.0, 20.0, 25.0, 42.98000000000002, 0.21901065004989062, 0.12870468833908455, 2.4386322576844264], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.166, 27, 81, 47.0, 56.0, 58.0, 65.99000000000001, 0.2202163934368468, 0.9158696576604034, 0.09204357069430705], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.652, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.22022095208564657, 0.1375882012440722, 0.09355089273169556], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.93200000000002, 24, 72, 41.0, 50.0, 52.0, 67.96000000000004, 0.22021493858866006, 0.9038081294491676, 0.08043006546109265], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1108.4539999999995, 770, 1686, 1096.5, 1429.0, 1501.95, 1593.93, 0.22013834374074043, 0.9310734050206512, 0.10748942565465841], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.761999999999998, 4, 25, 6.0, 8.0, 10.0, 19.0, 0.22008165909879202, 0.32725368983407604, 0.11283483498717364], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.360000000000001, 2, 22, 4.0, 5.0, 6.0, 14.970000000000027, 0.21918480786259745, 0.21142943290314664, 0.12029478712771462], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.154000000000003, 6, 20, 10.0, 12.0, 13.0, 18.0, 0.22021435665476774, 0.358923594977351, 0.14430061847202066], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.8520814631956911, 2123.5044743043086], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.798000000000001, 3, 21, 4.0, 6.0, 7.0, 13.0, 0.2191864413020902, 0.22020702816940307, 0.1290717032276957], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.675999999999997, 8, 31, 17.0, 20.0, 20.0, 23.99000000000001, 0.22021328978395316, 0.3459688415812019, 0.1313967969316361], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.765999999999996, 5, 24, 8.0, 9.0, 11.0, 16.980000000000018, 0.22021338677178187, 0.3408077427026789, 0.1262356035498398], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2205.4820000000013, 1585, 3472, 2162.5, 2801.8, 3116.75, 3329.94, 0.2199246450196305, 0.3358382486949672, 0.12155991121202232], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.136, 9, 65, 13.0, 18.0, 24.0, 40.98000000000002, 0.2190063332251442, 0.12870215149631695, 1.7661663083723054], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.788000000000007, 10, 38, 15.0, 18.0, 19.0, 25.0, 0.22021590848531536, 0.3986363859332244, 0.1840867359994433], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.165999999999997, 6, 25, 10.0, 12.0, 14.0, 19.0, 0.22021542353591977, 0.37276664743268456, 0.15827983566644235], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.706302966101696, 2311.6061970338983], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.7045395194986073, 2663.5728586350974], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7540000000000013, 1, 15, 3.0, 3.0, 4.0, 8.990000000000009, 0.2191654966881902, 0.1842788014145818, 0.09310253033140892], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 693.53, 528, 1144, 679.0, 833.0, 850.0, 950.7300000000002, 0.21911200041368345, 0.1928703426922642, 0.10185284394229817], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.725999999999999, 2, 23, 3.0, 5.0, 6.0, 11.0, 0.21918230970811053, 0.19855948043491028, 0.107450702610812], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 945.868000000001, 735, 1341, 903.5, 1145.0, 1175.0, 1267.9, 0.21910729552797625, 0.20727678540127528, 0.11618677878094835], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.8125, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.097999999999992, 20, 684, 28.0, 35.0, 40.94999999999999, 78.86000000000013, 0.21894188888173677, 0.1286518788662401, 10.01488093283257], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.19799999999999, 25, 260, 35.0, 44.0, 57.0, 104.93000000000006, 0.21907225528752797, 49.57501634073645, 0.06803220427874404], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.5228455259222333, 0.41087674476570296], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0800000000000014, 2, 23, 3.0, 4.0, 4.0, 7.990000000000009, 0.2202419048986645, 0.2392468025555549, 0.09485027349639749], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.755999999999995, 2, 13, 4.0, 5.0, 5.0, 8.0, 0.2202408377609083, 0.22604796922530723, 0.08151491944471118], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3380000000000014, 1, 11, 2.0, 3.0, 4.0, 8.0, 0.22027819373643362, 0.12491967762176208, 0.08583105400472364], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 202.20800000000008, 87, 444, 216.5, 299.0, 308.95, 332.93000000000006, 0.22025752509834498, 0.20063395622161428, 0.07227200042289444], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 115.84400000000001, 80, 348, 113.0, 139.90000000000003, 165.95, 292.50000000000045, 0.21904116046254485, 0.12877224472505078, 64.79682453839266], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.312, 17, 553, 336.0, 450.0, 471.9, 500.0, 0.2202383154764107, 0.12277124674818127, 0.09269796286165334], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 503.3720000000002, 306, 1163, 466.0, 813.4000000000002, 868.8499999999999, 945.9200000000001, 0.22026965411056215, 0.11847409849137314, 0.09421690283244748], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.128000000000004, 5, 273, 7.0, 10.0, 14.0, 28.950000000000045, 0.21891801958002766, 0.10297099801441356, 0.15927141072960999], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 514.866, 292, 1095, 452.5, 857.9000000000001, 915.0, 1031.88, 0.22021270785877495, 0.11325728810472611, 0.08903130962259065], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9460000000000046, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.21916453602210229, 0.1345738740093215, 0.11001032374546932], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.415999999999995, 3, 28, 4.0, 5.0, 6.0, 10.990000000000009, 0.21916213439372742, 0.12836565920025106, 0.10380237810640408], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 862.5140000000004, 585, 1574, 849.5, 1130.5000000000002, 1256.8, 1369.95, 0.2190675521085033, 0.20017939373383556, 0.09691171982925], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 473.2040000000002, 245, 1060, 384.0, 857.0, 890.0, 965.94, 0.21907177536204897, 0.19396666335503165, 0.0904954697052214], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.622000000000003, 3, 56, 5.0, 6.0, 8.0, 14.970000000000027, 0.21918740216022337, 0.14619628483928962, 0.10295814496002681], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1185.3240000000003, 894, 10029, 1106.5, 1411.0, 1435.0, 1652.2200000000007, 0.21910115067542313, 0.16461728465424305, 0.12153266951527376], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.15999999999997, 142, 285, 168.0, 185.0, 188.0, 227.86000000000013, 0.22032497934453318, 4.259974869182043, 0.11145345634811346], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.80199999999996, 194, 391, 226.0, 256.0, 260.95, 298.99, 0.22030760228661667, 0.42701121013203475, 0.15791580085778967], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.225999999999999, 6, 31, 9.0, 11.0, 12.0, 19.0, 0.22007933419839185, 0.17967414393540584, 0.1362600565251762], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.04800000000001, 6, 44, 9.0, 11.0, 12.949999999999989, 17.99000000000001, 0.2200802060302857, 0.1829764886390196, 0.13969934953094307], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.98999999999999, 6, 29, 10.0, 12.0, 13.0, 19.0, 0.2200769124793733, 0.17811787363447779, 0.1347541251216475], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.186, 8, 33, 12.0, 14.0, 16.0, 22.0, 0.22007807489785078, 0.19681685399712404, 0.15345287644244673], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.449999999999994, 6, 36, 9.0, 11.0, 13.0, 20.960000000000036, 0.22006732299545076, 0.16519061323740158, 0.12185368372892634], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2006.5760000000007, 1616, 2880, 1944.5, 2506.5, 2600.7, 2764.6200000000003, 0.21990897527695338, 0.18376788011156422, 0.14044967756946045], "isController": false}]}, function(index, item){
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
