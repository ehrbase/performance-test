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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8790257392044246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.109, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.525, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.855, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.85, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.132, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 355.69342693043984, 1, 23395, 10.0, 861.9000000000015, 1522.9500000000007, 6249.960000000006, 13.945971154000189, 87.84931050544579, 115.40410141451781], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6873.248, 5262, 23395, 6295.5, 8243.400000000001, 8560.8, 21946.040000000117, 0.30108656118199356, 0.17489659652503955, 0.15171939997061396], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4060000000000006, 1, 17, 2.0, 3.0, 4.0, 6.0, 0.30194403648450185, 0.15501464787135494, 0.10910087255787664], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.641999999999999, 2, 13, 3.0, 5.0, 5.0, 7.990000000000009, 0.30194184841552996, 0.17329515989481553, 0.1273817173003017], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.775999999999993, 7, 381, 11.0, 15.0, 20.0, 39.97000000000003, 0.2999749220965128, 0.15605433666995439, 3.3006029758412194], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.10000000000002, 24, 53, 34.0, 40.0, 42.0, 45.99000000000001, 0.3018749452851662, 1.2554666486673731, 0.1255846940346492], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4120000000000013, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.30188223573983786, 0.18859090334485515, 0.1276513750735838], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.096000000000025, 22, 50, 30.0, 36.0, 37.0, 40.0, 0.3018736694918017, 1.238952626474502, 0.1096650439950686], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 930.9159999999996, 723, 1323, 924.0, 1134.9, 1235.0, 1267.98, 0.3017446877847716, 1.276141344566785, 0.14674692823907837], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.463999999999998, 4, 19, 5.0, 7.0, 8.0, 11.990000000000009, 0.30173339802497384, 0.44868404541660933, 0.15410797574908333], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8360000000000016, 2, 20, 4.0, 5.0, 5.0, 13.960000000000036, 0.30017356035259585, 0.2895355735311157, 0.16415741581782586], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.961999999999993, 6, 17, 8.0, 10.0, 10.0, 15.0, 0.3018740340030912, 0.4919338078918929, 0.19722043823053517], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.9364008387445887, 2560.1515997023807], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9139999999999997, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.3001760832904582, 0.30155677601731173, 0.17617756450934116], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.296, 6, 23, 13.0, 15.0, 16.0, 19.0, 0.3018734872364871, 0.47424501723848544, 0.1795321813740436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.682, 4, 13, 7.0, 8.0, 9.0, 11.990000000000009, 0.30187330498139253, 0.46716957532916265, 0.1724569173965963], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1789.8960000000002, 1370, 2623, 1674.5, 2298.7000000000003, 2376.0, 2531.99, 0.3014745118373967, 0.46036983291528866, 0.16604650847294114], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.943999999999994, 7, 85, 10.0, 15.0, 31.0, 45.97000000000003, 0.29996124500714505, 0.1560472215114807, 2.418437537870107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.152000000000001, 8, 25, 11.0, 13.0, 15.0, 18.99000000000001, 0.3018756743147875, 0.5464745666348289, 0.2517595955711216], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.9319999999999915, 5, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.3018753097995367, 0.5110978938989792, 0.21638327870396476], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.070763221153847, 2622.7463942307695], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.9932916220556745, 4095.1677930942183], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2360000000000015, 1, 19, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.30022402716907354, 0.2523494359616146, 0.1269501989884852], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 591.8239999999993, 471, 744, 585.0, 679.0, 696.95, 721.0, 0.30009771181496697, 0.26425889425847054, 0.13891241738309992], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2979999999999987, 2, 16, 3.0, 4.0, 5.0, 8.0, 0.30021843893616995, 0.2719879374858147, 0.14659103463680173], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 785.4999999999998, 635, 972, 766.0, 909.0, 930.95, 963.95, 0.30005430983007925, 0.2838531352299766, 0.15852478673639928], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.310000000000013, 15, 1003, 20.0, 25.0, 35.94999999999999, 70.99000000000001, 0.29978247783408357, 0.15595422242870574, 13.674647987919965], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.666000000000015, 19, 309, 28.0, 33.900000000000034, 39.0, 70.98000000000002, 0.30008096184350536, 67.86949576026862, 0.09260310931889423], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 0.5706355413492927, 0.44630712731229594], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.612000000000002, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3018805953568349, 0.32803277076123416, 0.12941951304848684], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.28, 2, 12, 3.0, 4.0, 5.0, 8.0, 0.3018787727299622, 0.3097529739209947, 0.1111409153507771], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.736000000000002, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.301944765847873, 0.17123275876515462, 0.11706257035313045], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 158.19000000000008, 67, 260, 165.5, 245.0, 250.0, 258.99, 0.3019132241011288, 0.27499754223766004, 0.09847560239236039], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.53599999999994, 57, 297, 79.0, 94.0, 107.94999999999999, 187.96000000000004, 0.3000314432952573, 0.1560837403884927, 88.71730538610447], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 229.08400000000006, 14, 419, 296.5, 384.90000000000003, 397.0, 404.99, 0.301874216259066, 0.1682447597277457, 0.126468787866347], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 448.12199999999973, 298, 813, 405.0, 673.0, 710.95, 774.95, 0.30191285949518964, 0.16236956137948816, 0.1285488347069362], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.426000000000003, 4, 271, 6.0, 9.0, 11.949999999999989, 34.98000000000002, 0.29973629201028934, 0.13514769861725653, 0.21748443844105955], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 445.8019999999998, 280, 829, 399.5, 693.8000000000001, 720.0, 756.98, 0.3018259261226717, 0.15524876323053946, 0.12143777496341869], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.341999999999999, 2, 15, 3.0, 4.0, 5.0, 10.0, 0.3002224047574443, 0.18432893368657502, 0.15011120237872216], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.033999999999994, 2, 25, 4.0, 5.0, 5.0, 8.990000000000009, 0.300218258674056, 0.17582411319279118, 0.14160685443317292], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 752.7919999999999, 588, 1112, 744.5, 926.7, 1036.6, 1096.8300000000002, 0.3000584513863301, 0.27418720072920205, 0.13215464997581527], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 417.5860000000005, 229, 830, 333.0, 737.9000000000001, 769.95, 803.99, 0.30008762558667135, 0.26571528417547924, 0.12337586950389513], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.627999999999997, 3, 42, 4.0, 5.0, 6.0, 13.980000000000018, 0.3001791469148788, 0.20013213417017275, 0.14041583141819036], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 996.3640000000007, 819, 9547, 935.5, 1094.0, 1108.95, 1139.99, 0.2999880604751931, 0.22549200198082117, 0.16581371311421805], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.23599999999996, 117, 168, 131.0, 149.0, 150.0, 156.99, 0.3020273890517488, 5.839602234270262, 0.15219348901435778], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.83799999999994, 160, 245, 175.5, 201.0, 203.0, 213.0, 0.3020038559852332, 0.5853418681762229, 0.21588556892694408], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.232000000000001, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.3017301205110101, 0.24624890528540655, 0.18622405875288908], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.138000000000001, 5, 17, 7.0, 9.0, 10.0, 13.990000000000009, 0.3017315771750924, 0.25096464999589646, 0.19093951368111317], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.541999999999998, 6, 25, 8.0, 10.0, 11.0, 16.0, 0.3017261147573036, 0.24418305523488773, 0.18415900558917453], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.75599999999998, 7, 24, 10.0, 11.0, 12.0, 19.0, 0.30172757138270884, 0.2698192913973245, 0.20979495197703973], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.175999999999998, 5, 43, 8.0, 9.0, 11.0, 22.930000000000064, 0.3017151905150399, 0.22649558994220342, 0.16647371351659918], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.2439999999995, 1416, 2013, 1596.5, 1830.9, 1892.95, 1962.8700000000001, 0.3014416143765946, 0.2519009803107381, 0.19193352790384738], "isController": false}]}, function(index, item){
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
