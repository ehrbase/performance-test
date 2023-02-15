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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8675388215273346, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.456, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.738, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.766, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.477, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 504.9315464794747, 1, 23857, 13.0, 1063.0, 1937.9000000000015, 10799.980000000003, 9.806919876150348, 61.776453060062536, 81.2515016911252], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11349.311999999996, 9137, 23857, 10925.5, 13130.7, 13597.449999999999, 21611.500000000065, 0.21105265890471267, 0.12262118261141364, 0.10676296612562614], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2019999999999973, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.21178507711518227, 0.10872805946310789, 0.07693754754574982], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.678000000000002, 3, 17, 4.0, 6.0, 6.949999999999989, 9.0, 0.21178391094571258, 0.1214903368825493, 0.08975997788128834], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.402000000000005, 10, 409, 14.0, 19.0, 23.0, 45.940000000000055, 0.21063912967281845, 0.10957965895313194, 2.3454173403608163], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.79799999999998, 27, 61, 45.0, 55.0, 57.0, 59.99000000000001, 0.2117428340931372, 0.8806165283015472, 0.08850188768736594], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6700000000000013, 1, 10, 2.0, 4.0, 4.0, 8.0, 0.21174624161008454, 0.13229342724843807, 0.08995079599647146], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.614000000000004, 24, 55, 40.0, 48.0, 50.0, 53.0, 0.21174247541352248, 0.8690353699659815, 0.07733563066861075], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1150.3079999999998, 815, 1808, 1145.0, 1462.9, 1564.0, 1675.7400000000002, 0.21167237688182033, 0.8952666643312147, 0.10335565277432635], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.865999999999995, 4, 33, 7.0, 9.0, 10.0, 13.990000000000009, 0.2116263271616042, 0.31469289514867804, 0.1084998259373459], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.559999999999996, 2, 17, 4.0, 5.900000000000034, 6.0, 11.0, 0.21080173380210018, 0.20333103563835192, 0.11569392030935577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.136000000000008, 6, 20, 10.0, 12.0, 14.0, 16.99000000000001, 0.21174130971316676, 0.3451135213977298, 0.13874845587649892], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.7780884667266187, 2127.323726955935], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.069999999999998, 3, 15, 5.0, 6.0, 7.0, 13.0, 0.21080288918007795, 0.21177250012542773, 0.12413490446834669], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.949999999999998, 7, 40, 17.0, 20.0, 21.0, 23.0, 0.21174032336135223, 0.33264528866664156, 0.1263411499744006], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.819999999999998, 5, 17, 8.0, 10.0, 10.0, 13.980000000000018, 0.21174014402564595, 0.3276823473035951, 0.12137838334282634], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2346.1899999999982, 1695, 3718, 2246.0, 3006.3, 3219.5499999999997, 3613.7300000000005, 0.21147577523847064, 0.3229363129864736, 0.11688993045407656], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.215999999999994, 9, 95, 13.0, 17.0, 22.0, 45.99000000000001, 0.21063203089719135, 0.1095759659953543, 1.6986321397939512], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.867999999999991, 10, 26, 15.0, 18.0, 19.0, 22.0, 0.21174301343340024, 0.3833106849918246, 0.17700392529198303], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.216, 7, 19, 10.0, 12.0, 14.0, 17.99000000000001, 0.21174229607417078, 0.35843586998133703, 0.15218977530331027], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6583180147056], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 730.0, 730, 730, 730.0, 730.0, 730.0, 730.0, 1.36986301369863, 0.6354345034246576, 2619.7880993150684], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9999999999999987, 2, 15, 3.0, 4.0, 4.0, 8.0, 0.21077880661255272, 0.17722710204434364, 0.08953982507466839], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 745.1080000000007, 566, 1052, 724.0, 901.0, 924.95, 969.97, 0.2107250627960687, 0.18549979111878148, 0.09795422840911006], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8959999999999972, 2, 14, 4.0, 5.0, 6.0, 11.0, 0.21079346877516347, 0.1909718837084052, 0.10333820441907429], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1000.2979999999995, 766, 1315, 964.5, 1200.0, 1232.0, 1278.96, 0.2107228425668571, 0.19934504377240247, 0.11174072608769864], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.893880208333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.94, 19, 691, 27.0, 33.900000000000034, 37.94999999999999, 66.96000000000004, 0.21057153325556224, 0.1095444936333697, 9.632002556338415], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.69599999999999, 27, 242, 35.0, 43.0, 49.0, 109.99000000000001, 0.21070383931893777, 47.65495729902331, 0.06543341885099825], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1044.0, 1044, 1044, 1044.0, 1044.0, 1044.0, 1044.0, 0.9578544061302682, 0.5023123204022988, 0.394740780651341], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.270000000000001, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.21175009761679497, 0.23003422225671397, 0.09119315727442051], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8920000000000003, 2, 21, 4.0, 5.0, 5.949999999999989, 8.990000000000009, 0.21174929053400204, 0.21732053016834493, 0.07837205186756523], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2899999999999996, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.21178561535157683, 0.12010353973712322, 0.08252193410671792], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.38800000000018, 91, 338, 193.0, 270.90000000000003, 280.0, 311.0, 0.21176525398065735, 0.19288629886747943, 0.06948547396240319], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 116.06400000000006, 85, 438, 113.0, 132.0, 141.0, 314.84000000000015, 0.21066752956086776, 0.10965409497650636, 62.31973442829889], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 256.89, 16, 518, 310.0, 425.0, 436.0, 496.8600000000001, 0.21174615193718085, 0.11803731340399724, 0.08912362449699701], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 544.8100000000002, 327, 1042, 505.5, 865.0000000000003, 923.9, 1010.9300000000001, 0.21178525652700983, 0.1138986900605367, 0.09058783433479521], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.411999999999994, 5, 263, 7.0, 10.0, 13.0, 32.0, 0.21054980871549878, 0.09493452361526654, 0.1531832104424283], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 545.5599999999996, 307, 1079, 486.5, 874.7, 927.9, 1059.88, 0.2117203293013314, 0.10890157680303149, 0.0855978675104992], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.43, 3, 15, 4.0, 6.0, 6.0, 11.980000000000018, 0.2107776514985448, 0.12941212624379891, 0.10580050084985548], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.8439999999999985, 3, 35, 5.0, 6.0, 6.0, 12.0, 0.21077489704700153, 0.12344122412896219, 0.09982990729276928], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 908.5559999999999, 609, 1483, 912.0, 1221.4, 1312.9, 1427.8200000000002, 0.2106944277644689, 0.19252820605809687, 0.09320759353252385], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 516.9539999999994, 260, 1073, 415.0, 932.0, 970.8499999999999, 1027.96, 0.21070028769017282, 0.18656646274566072, 0.08703732587201474], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.759999999999999, 3, 38, 5.0, 7.0, 8.0, 12.990000000000009, 0.21080351131192723, 0.14060429514262335, 0.09902000873148144], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1237.6800000000005, 967, 9958, 1148.5, 1481.0, 1498.9, 1552.98, 0.21072017835355897, 0.15833234338749544, 0.11688384893048973], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.87399999999988, 143, 198, 166.0, 188.90000000000003, 190.0, 196.0, 0.21185210858522197, 4.096152244022274, 0.1071673752413525], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.44799999999978, 197, 301, 221.0, 257.90000000000003, 260.95, 267.99, 0.21183765778727942, 0.41058234158885876, 0.1518445711092413], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.328000000000001, 6, 20, 9.0, 11.0, 12.0, 17.0, 0.2116242670393511, 0.17277137426259526, 0.13102518095991075], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.152000000000005, 6, 24, 9.0, 11.0, 13.0, 17.0, 0.21162516273975016, 0.17595888287097466, 0.1343323786922242], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.240000000000004, 7, 23, 10.0, 12.900000000000034, 14.0, 17.0, 0.21162166955107004, 0.17126268923209692, 0.1295769402426962], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.488000000000005, 9, 25, 13.0, 15.0, 16.0, 19.99000000000001, 0.21162274436607348, 0.1892432258236886, 0.14755726511462544], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.592000000000002, 6, 34, 10.0, 11.0, 13.0, 18.0, 0.2116076979494791, 0.15885249364330475, 0.1171694968138229], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2065.1800000000003, 1687, 2726, 2031.0, 2504.5000000000005, 2631.95, 2682.0, 0.21145896110212412, 0.17670658945771348, 0.13505289117264566], "isController": false}]}, function(index, item){
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
