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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8805147840884918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.366, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.856, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.336, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.932, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.568, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.971, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.858, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 287.0670921080616, 1, 6874, 31.0, 797.0, 1856.0, 3810.9900000000016, 17.095241697116393, 113.28435310933573, 141.60272874067962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 50.67199999999997, 19, 147, 40.5, 85.0, 91.94999999999999, 110.97000000000003, 0.3702680666749113, 0.21499919027002168, 0.18658039297290452], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 13.548, 5, 68, 11.0, 24.0, 28.0, 48.97000000000003, 0.37010581325200875, 3.955964897082826, 0.13372963955394848], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 14.425999999999998, 5, 58, 12.0, 27.0, 30.0, 43.960000000000036, 0.37009156805576837, 3.973979648294581, 0.15613238027352727], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 55.957999999999984, 14, 302, 46.0, 112.0, 129.95, 160.0, 0.36823298248094766, 0.19883933769431655, 4.099468750276174], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 72.23399999999998, 26, 167, 62.0, 122.0, 134.95, 155.99, 0.37005486433418616, 1.5391037148605151, 0.15394860567027666], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.487999999999996, 1, 48, 5.0, 13.0, 16.0, 24.960000000000036, 0.37007184574813357, 0.23127394249194538, 0.15648545821185725], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 61.56999999999994, 26, 149, 53.0, 100.0, 115.0, 134.98000000000002, 0.37002994282297325, 1.5187221332762748, 0.13442494016615825], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1179.51, 584, 2580, 915.5, 2181.6000000000004, 2311.6, 2457.87, 0.36991852174640016, 1.564399878407782, 0.17990178108369853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 26.060000000000013, 8, 79, 23.0, 42.0, 47.94999999999999, 64.93000000000006, 0.36989717598302024, 0.550024096489158, 0.1889220928116402], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 8.634000000000004, 2, 76, 6.0, 20.0, 24.94999999999999, 32.0, 0.368380840954519, 0.35540908669364196, 0.20145827239700256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 38.880000000000024, 14, 127, 30.0, 68.0, 72.94999999999999, 86.97000000000003, 0.37001323907369404, 0.602910556514712, 0.241737164980763], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.4293338153923541, 1189.9296167630785], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.539999999999996, 3, 47, 6.0, 17.0, 20.0, 28.0, 0.36838789772078406, 0.3701658010318545, 0.21621203762713986], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 39.04200000000004, 15, 109, 30.0, 69.0, 76.0, 95.96000000000004, 0.3699998224000852, 0.5813557170430058, 0.2200487225016132], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 24.149999999999984, 8, 68, 19.0, 42.0, 48.0, 58.0, 0.3700052984758742, 0.5726923220478016, 0.2113799800863148], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2871.94, 1494, 5960, 2605.5, 4301.0, 4929.349999999999, 5675.02, 0.36951118842927444, 0.5643078161685533, 0.20351983425206133], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 54.34199999999997, 12, 426, 42.0, 112.0, 136.0, 167.99, 0.36820586537215305, 0.19880383952189207, 2.968659789562984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 47.76400000000001, 18, 117, 40.0, 79.0, 83.0, 97.99000000000001, 0.37003185974312386, 0.6698342742935167, 0.30860078927795687], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 39.272000000000006, 15, 112, 30.5, 70.0, 74.0, 93.95000000000005, 0.37001652493800374, 0.6264032876708274, 0.26522668877392064], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 4.313151041666667, 1262.8038194444446], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1253.0, 1253, 1253, 1253.0, 1253.0, 1253.0, 1253.0, 0.7980845969672786, 0.3655289804469274, 1526.2915876895452], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 7.068, 1, 53, 4.0, 17.0, 20.0, 42.950000000000045, 0.36863804462584715, 0.30968691732149073, 0.1558791731669842], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 560.7719999999996, 317, 1352, 464.0, 1105.8000000000002, 1184.0, 1287.97, 0.3685660348707697, 0.32446696482737475, 0.17060576223510238], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 8.12400000000001, 2, 36, 5.0, 19.0, 22.0, 30.970000000000027, 0.3687560383801285, 0.3340389537745868, 0.1800566593652971], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1612.3119999999992, 930, 3862, 1312.0, 3008.0, 3383.3999999999996, 3699.7400000000002, 0.3681296876714104, 0.34827369264263364, 0.19449039163108692], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.154913651315789, 866.4036800986843], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 92.27199999999999, 30, 963, 77.0, 158.90000000000003, 177.0, 221.98000000000002, 0.36794872266600925, 0.1984529998399423, 16.83006081272514], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 111.74600000000001, 10, 308, 98.0, 201.80000000000007, 227.0, 287.9200000000001, 0.36837215607486207, 81.47545483946156, 0.11367734503872695], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.9552168715846994, 0.747096994535519], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.880000000000003, 1, 37, 4.0, 16.900000000000034, 20.0, 25.99000000000001, 0.37012964901345646, 0.40213140546370585, 0.15867862882510486], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 8.588000000000008, 2, 40, 6.0, 20.0, 24.0, 36.0, 0.3701266351269423, 0.3797181198825366, 0.13626732562779031], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.320000000000001, 1, 31, 4.0, 12.0, 13.949999999999989, 20.980000000000018, 0.37011403213330024, 0.2099334500272034, 0.1434914753485549], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 190.32399999999996, 88, 488, 140.0, 370.90000000000003, 401.95, 448.96000000000004, 0.37009102018550444, 0.3371811099159227, 0.12071328197456882], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, 2.4, 305.74000000000007, 33, 1417, 276.0, 492.0, 527.9, 587.99, 0.3682685119374238, 0.19706321398057752, 108.94058701080132], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.601999999999998, 1, 29, 4.0, 12.0, 14.949999999999989, 18.99000000000001, 0.37012444324030624, 0.20636678698487007, 0.15506190053719862], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 8.242, 2, 39, 6.0, 17.0, 21.0, 30.99000000000001, 0.37014828140152944, 0.19910868872195203, 0.15760219794049496], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 48.392000000000024, 7, 379, 34.0, 114.90000000000003, 132.95, 174.98000000000002, 0.36785532985587427, 0.1553815165571684, 0.2669106543778463], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.095999999999991, 2, 67, 7.0, 19.0, 21.94999999999999, 28.99000000000001, 0.3701307449843583, 0.19036142295654518, 0.1489197919273004], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 8.032, 2, 32, 6.0, 17.0, 20.0, 28.99000000000001, 0.36863423963289926, 0.22641558197577633, 0.18431711981644966], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 9.402000000000003, 2, 61, 7.0, 20.0, 22.94999999999999, 32.98000000000002, 0.3686192922067246, 0.21596698770028008, 0.17387023255453907], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 755.8000000000002, 386, 1792, 615.0, 1481.7000000000005, 1597.95, 1727.9, 0.3681920371844502, 0.3364671154804869, 0.16216270387713577], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 28.527999999999977, 7, 167, 25.0, 52.0, 64.94999999999999, 81.0, 0.3684264432921703, 0.3261847684863494, 0.15147219983008173], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 22.01799999999998, 7, 105, 16.0, 39.0, 44.0, 56.99000000000001, 0.3683889834011292, 0.2454621845024649, 0.17232258110267665], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 823.8060000000005, 450, 5747, 796.5, 994.6000000000001, 1054.95, 1287.8500000000001, 0.36828641487170005, 0.2767672407760826, 0.20356456134509984], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 256.39800000000025, 145, 579, 194.0, 487.90000000000003, 511.95, 555.99, 0.37020501213161827, 7.157878479788287, 0.18654861939444825], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 428.0099999999998, 217, 920, 365.0, 724.9000000000001, 767.95, 856.96, 0.37007841961711685, 0.7173673812418351, 0.2645482452731734], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 39.70800000000003, 15, 108, 31.0, 70.0, 76.0, 88.99000000000001, 0.3698823995898744, 0.30174384871698895, 0.2282867934968756], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 41.69200000000002, 14, 133, 32.0, 71.90000000000003, 77.89999999999998, 99.94000000000005, 0.36989033491350487, 0.3075927111629944, 0.2340712275624523], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 40.34199999999998, 15, 102, 31.0, 72.0, 76.94999999999999, 88.99000000000001, 0.36985914284403926, 0.2994060328002184, 0.22574410573977008], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 43.43, 17, 116, 35.0, 73.0, 80.94999999999999, 99.98000000000002, 0.36986324676314175, 0.3308332831706305, 0.257170538764997], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 42.386, 14, 112, 32.0, 76.0, 83.0, 96.98000000000002, 0.36984601091489544, 0.27759904776672184, 0.20406542594425386], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3356.0040000000017, 1729, 6874, 3006.0, 5084.3, 5691.05, 6460.050000000001, 0.3688939747071535, 0.3082887294406165, 0.2348817104580704], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
