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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8614124654328866, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.978, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.588, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.69, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.286, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 493.2759838332255, 1, 26083, 14.0, 1215.9000000000015, 2327.0, 9714.0, 10.032948022030228, 63.20019323789228, 83.02350106961556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9895.075999999994, 8321, 26083, 9686.5, 10390.6, 10699.949999999999, 25835.020000000128, 0.21634476008664175, 0.12565912135469895, 0.1090174767624093], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.536000000000001, 2, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.21709671354653098, 0.11145499343608087, 0.07844314844943014], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.124, 3, 22, 5.0, 6.0, 7.0, 11.0, 0.2170949225839506, 0.1245984931170055, 0.09158692046510417], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.163999999999987, 12, 599, 18.0, 25.0, 32.0, 89.94000000000005, 0.21571100937221194, 0.11221817558854591, 2.3734530689421014], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.346000000000046, 31, 77, 54.0, 67.0, 69.0, 71.99000000000001, 0.21701275861410443, 0.9025458906030003, 0.09028069840782078], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4660000000000024, 2, 13, 3.0, 4.900000000000034, 5.0, 9.0, 0.21701718559092695, 0.13557428104919128, 0.09176605601647594], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 45.79400000000004, 28, 75, 45.0, 59.0, 61.94999999999999, 65.0, 0.21701294699241758, 0.8906664867719757, 0.0788367346495892], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1194.5680000000002, 861, 1768, 1155.0, 1481.1000000000004, 1665.95, 1753.99, 0.21693216270953478, 0.9174514515310639, 0.10550021194272297], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.670000000000005, 6, 24, 8.0, 11.0, 12.0, 16.980000000000018, 0.2169853530546981, 0.32266188178703065, 0.11082357387461632], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.416000000000003, 3, 21, 5.0, 6.0, 7.0, 13.0, 0.2158914221588365, 0.20824034822314885, 0.11806562149311373], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.788000000000007, 8, 37, 11.0, 14.0, 15.949999999999989, 21.0, 0.21701200510412236, 0.3536426787473633, 0.14177835099087682], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.6676191165123456, 1825.293270158179], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.986000000000001, 4, 17, 6.0, 7.0, 8.949999999999989, 14.0, 0.21589291366053776, 0.2168859367302068, 0.12671058702146795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.279999999999982, 9, 30, 12.0, 15.0, 17.0, 21.0, 0.2170109690364409, 0.3409255039048954, 0.12906218763983646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.398000000000003, 6, 22, 9.0, 11.0, 12.0, 19.0, 0.21701012135205988, 0.33583799746857695, 0.12397550878022952], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2328.0979999999995, 1950, 3114, 2266.5, 2725.4, 2792.8, 2958.92, 0.2167956817768921, 0.3310724118172725, 0.11940699660367886], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.22199999999999, 12, 86, 17.0, 22.0, 29.0, 52.960000000000036, 0.21570430908184166, 0.11221468993260536, 1.7391159919723485], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.09399999999999, 12, 39, 17.0, 20.0, 22.0, 32.960000000000036, 0.2170139830789857, 0.3928525298567838, 0.1809862710443885], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.068000000000005, 8, 26, 12.0, 15.0, 16.0, 22.99000000000001, 0.21701322956050048, 0.3674199279505227, 0.15555440478262436], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 4.287997159090909, 1239.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.7114527415644172, 2933.195336464724], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.5240000000000014, 2, 27, 3.0, 4.0, 5.0, 10.980000000000018, 0.21588284642396544, 0.18145754369684694, 0.09128639892732132], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 773.2820000000003, 598, 977, 744.5, 946.0, 957.95, 967.99, 0.2158285181990923, 0.19005345033721047, 0.09990499768200171], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.583999999999997, 3, 17, 4.0, 5.0, 6.0, 12.0, 0.2158889052964457, 0.19558818001227113, 0.10541450453928013], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1055.2319999999997, 814, 1373, 999.5, 1319.9, 1339.9, 1357.99, 0.2158057886018288, 0.20415354050437265, 0.11401458167342714], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 4.689433787128713, 651.9473236386139], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.232000000000056, 25, 1676, 33.5, 41.0, 47.0, 111.0, 0.2155499455089738, 0.11213438620320841, 9.832361283910316], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.94799999999997, 30, 482, 44.0, 53.0, 60.94999999999999, 195.87000000000012, 0.2158118431496789, 48.81029734002731, 0.06659818597197122], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.8130450581395349, 0.6359011627906976], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.006000000000001, 3, 12, 4.0, 5.0, 6.0, 9.0, 0.2170788994968111, 0.23588463111239913, 0.09306409851474617], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.827999999999997, 3, 14, 5.0, 6.0, 7.0, 9.990000000000009, 0.21707805128165053, 0.22274031177943654, 0.07992033723943578], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7619999999999982, 1, 14, 3.0, 4.0, 4.0, 7.0, 0.21709727911980078, 0.12311578218521438, 0.0841675974712509], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.41999999999997, 82, 172, 127.5, 161.0, 165.0, 169.99, 0.21708728775918595, 0.19773387125573275, 0.07080776768707822], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.284, 82, 623, 120.0, 138.0, 154.95, 550.6900000000003, 0.21575736444612065, 0.11224229063876262, 63.79801990296959], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 258.606, 15, 528, 279.0, 479.0, 499.9, 519.96, 0.21707484697308663, 0.12098318937110378, 0.09094248960102945], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 583.8200000000005, 398, 760, 553.0, 700.9000000000001, 711.95, 735.96, 0.2170490274684226, 0.11672956046595218, 0.09241540622678932], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.931999999999999, 7, 420, 9.0, 12.0, 17.94999999999999, 47.830000000000155, 0.21551296827735314, 0.09717235603841476, 0.15637317913093104], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 543.5800000000003, 393, 690, 545.5, 643.9000000000001, 657.0, 679.99, 0.21703791001174175, 0.11163675545144972, 0.08732384660628673], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.109999999999994, 3, 33, 5.0, 6.0, 7.949999999999989, 12.990000000000009, 0.215879956927631, 0.13254481222653408, 0.1079399784638155], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.673999999999999, 3, 42, 5.0, 7.0, 8.0, 13.970000000000027, 0.21587641506990077, 0.1264289500796584, 0.1018245199987911], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 945.1679999999996, 677, 1418, 899.0, 1241.8000000000006, 1377.55, 1405.99, 0.2157910728096343, 0.19718541478388954, 0.09504079476283697], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 329.0999999999999, 233, 454, 328.0, 394.0, 399.0, 409.0, 0.21583121998597096, 0.19110969284519505, 0.08873529649813845], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.776000000000001, 4, 75, 6.0, 8.0, 9.0, 15.990000000000009, 0.21589393907991186, 0.14393842885668615, 0.10098945001882594], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1566.5340000000006, 1272, 12638, 1455.0, 1759.9, 1803.0, 3717.9800000000173, 0.21578101506841985, 0.16220832071014393, 0.11926958450070861], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.85599999999997, 129, 236, 178.5, 205.0, 207.0, 212.98000000000002, 0.21710887402127318, 4.197730112474337, 0.10940251854978218], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 234.67800000000003, 180, 378, 234.0, 281.0, 283.0, 296.99, 0.2170928488747209, 0.42078021433142787, 0.1551874661877888], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.596000000000004, 7, 25, 11.0, 13.0, 15.0, 21.970000000000027, 0.21698073905375567, 0.1770829818697404, 0.13391779988473984], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.807999999999998, 7, 47, 11.0, 13.0, 15.0, 23.950000000000045, 0.2169816806706643, 0.18047408910548, 0.13730871979940476], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.110000000000001, 8, 36, 12.0, 15.0, 16.0, 23.0, 0.21697838504723838, 0.17559781003173527, 0.13243309634230857], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.616000000000001, 10, 28, 14.0, 18.0, 19.0, 25.0, 0.21697923248370052, 0.19403325486098574, 0.15086837258632302], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.291999999999993, 7, 46, 11.0, 13.900000000000034, 15.0, 43.76000000000022, 0.2169629440309372, 0.16287264131447432, 0.11971099939206982], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2632.139999999999, 2244, 3313, 2588.5, 3017.6000000000004, 3138.95, 3266.9700000000003, 0.21674859763657328, 0.18112689695663292, 0.1380078961514119], "isController": false}]}, function(index, item){
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
