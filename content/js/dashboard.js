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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909168262071899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.194, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.617, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.96, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.11, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.9097213358844, 1, 18722, 9.0, 839.0, 1510.9500000000007, 6050.0, 15.259558566711636, 96.12390353368659, 126.2741493530512], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6205.135999999997, 5413, 18722, 6045.0, 6543.8, 6744.0, 16289.400000000081, 0.32919448085701175, 0.19118676729538425, 0.16588315636935358], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3700000000000014, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.33046577167723273, 0.1696573836215215, 0.11940657765681262], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6200000000000006, 2, 14, 3.0, 5.0, 5.0, 8.980000000000018, 0.3304631507149901, 0.18966454912764338, 0.13941414170788644], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.45999999999999, 8, 332, 11.0, 14.0, 18.0, 40.99000000000001, 0.3283567583044708, 0.1708192663245846, 3.6128863240395237], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.73599999999998, 24, 50, 34.0, 41.0, 42.0, 45.0, 0.3303635849470493, 1.3739479520018052, 0.1374364132689873], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.241999999999998, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.3303727529697207, 0.20638940801001954, 0.1396986348006729], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.823999999999998, 21, 46, 30.0, 35.0, 36.0, 39.99000000000001, 0.330363366666997, 1.3558802975830617, 0.12001481679699502], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.87, 673, 1110, 862.0, 1007.9000000000001, 1056.0, 1082.97, 0.3302224180074247, 1.3965796170790374, 0.1605964493825171], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.832, 4, 22, 5.0, 8.0, 9.0, 12.0, 0.3303306279254906, 0.4912087406722889, 0.16871378750491367], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9219999999999975, 2, 18, 4.0, 5.0, 6.0, 9.990000000000009, 0.3285433897398528, 0.31689999167963867, 0.179672166263982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.971999999999999, 6, 25, 8.0, 10.0, 11.0, 15.990000000000009, 0.33036031077655154, 0.538355033394472, 0.21583110147413379], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.8846977249488752, 2418.793535915133], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.108000000000001, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.32854662799453827, 0.3300578141447865, 0.19282863615695067], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.303999999999984, 6, 21, 8.0, 10.0, 11.949999999999989, 14.0, 0.33035900112652417, 0.5189959264670417, 0.19647327313091134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.753999999999991, 4, 24, 7.0, 8.0, 9.0, 13.0, 0.33035812803227466, 0.5112517862051035, 0.18872998525281318], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1559.6559999999981, 1333, 1933, 1529.5, 1750.8000000000002, 1812.95, 1889.99, 0.3300295178400756, 0.5039750559977584, 0.18177407037285415], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.818000000000001, 7, 58, 10.0, 13.0, 17.0, 35.99000000000001, 0.3283461924647175, 0.17081376971472628, 2.6472911767467857], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.222, 8, 34, 11.0, 14.0, 15.0, 18.99000000000001, 0.33036598604666223, 0.5980495429634358, 0.2755200703943843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.9679999999999795, 6, 22, 8.0, 10.0, 11.0, 16.0, 0.330363366666997, 0.5593303441642964, 0.23680342884138264], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.734809027777779, 2525.607638888889], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.794293129280822, 3274.7317797517126], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.322000000000002, 1, 23, 2.0, 3.0, 4.0, 6.980000000000018, 0.3285446850340668, 0.2761539998590543, 0.1389256334177255], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.9980000000005, 443, 684, 553.0, 644.9000000000001, 657.0, 674.97, 0.3284352686928933, 0.28921227161432506, 0.15202960679729632], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2680000000000016, 2, 17, 3.0, 4.0, 5.0, 8.990000000000009, 0.32855159344237306, 0.297656834719164, 0.16042558273553373], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 761.6160000000002, 599, 942, 743.5, 884.0, 900.0, 918.99, 0.3284085191797143, 0.31067638341267684, 0.17350489148068893], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.670884683098592, 927.4180237676057], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.82, 15, 726, 20.0, 25.0, 30.94999999999999, 64.93000000000006, 0.32819144851234094, 0.17073326810254802, 14.97052984376118], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.456000000000017, 19, 303, 28.0, 35.0, 44.0, 102.96000000000004, 0.3284663381127375, 74.28943377474008, 0.1013626590269776], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 1.0467346556886228, 0.8186751497005988], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6959999999999984, 1, 10, 3.0, 4.0, 4.0, 6.0, 0.33041947413079853, 0.35904399712898516, 0.14165444252287163], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3600000000000008, 2, 23, 3.0, 4.0, 5.0, 7.0, 0.33041794565946464, 0.33903656219126577, 0.12164801319689275], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8319999999999999, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.33046708217394466, 0.18740775321214004, 0.12812053869439066], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.95199999999998, 67, 139, 89.0, 110.0, 115.0, 118.99000000000001, 0.33045092010754196, 0.3009910914975639, 0.10778379620695215], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.99399999999996, 57, 386, 79.0, 93.0, 101.0, 290.94000000000005, 0.32841110765184744, 0.1708475401925934, 97.10898367763954], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.89799999999997, 12, 368, 260.0, 334.90000000000003, 337.95, 346.98, 0.33041423371652573, 0.18415108137144376, 0.1384254943988179], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 422.72200000000015, 324, 540, 412.0, 496.0, 507.0, 527.9300000000001, 0.33032822733981393, 0.17765142390459857, 0.14064756554703015], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.1019999999999905, 4, 290, 6.0, 8.0, 9.0, 26.970000000000027, 0.328132218908816, 0.14795110038319279, 0.23808812368090848], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.8800000000002, 307, 511, 392.0, 457.90000000000003, 465.0, 489.99, 0.3303312826367307, 0.16991092761483637, 0.1329067269983721], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5340000000000007, 2, 14, 3.0, 4.0, 5.949999999999989, 9.0, 0.3285433897398528, 0.2017172993782645, 0.1642716948699264], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.215999999999999, 2, 39, 4.0, 5.0, 6.0, 9.990000000000009, 0.328535618189046, 0.19240829646889918, 0.15496357772002853], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 681.6500000000004, 540, 859, 686.0, 809.0, 835.95, 850.97, 0.3283806956810714, 0.3000674812067728, 0.14462860717984688], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.01599999999982, 175, 312, 234.5, 283.0, 290.0, 305.99, 0.3284728116484342, 0.29084920219702326, 0.13504595088280352], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.568000000000002, 3, 47, 4.0, 5.0, 6.0, 10.980000000000018, 0.3285490027552119, 0.21904657194434643, 0.15368649640600246], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.7199999999996, 811, 8890, 937.0, 1087.0, 1109.95, 1159.9, 0.3283746570947643, 0.24682935284415142, 0.18150396085511386], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.7020000000001, 118, 167, 133.0, 150.0, 152.0, 154.0, 0.3303998234343344, 6.388174109597256, 0.16649053602745756], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.75800000000007, 158, 249, 178.0, 203.0, 205.0, 210.99, 0.3303703517717432, 0.6403216219383754, 0.23616318114933202], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.3660000000000005, 5, 16, 7.0, 10.0, 11.0, 13.990000000000009, 0.3303266997125497, 0.26958723263356926, 0.20387350997883927], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.1619999999999955, 5, 20, 7.0, 9.0, 10.949999999999989, 14.0, 0.33032844557343366, 0.27475003943295817, 0.2090359694644385], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.591999999999995, 6, 28, 8.0, 10.0, 11.949999999999989, 15.990000000000009, 0.33032146224062336, 0.26732490134123726, 0.2016122206058492], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.924000000000008, 7, 20, 10.0, 12.0, 13.0, 18.0, 0.3303236445004086, 0.29539127393112224, 0.22967815906669037], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.029999999999987, 5, 35, 8.0, 9.0, 10.0, 26.860000000000127, 0.33030160500155903, 0.24795522146557464, 0.18224649104089927], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1629.6400000000003, 1388, 1977, 1601.0, 1841.5000000000002, 1904.95, 1944.98, 0.329986173579327, 0.27575436386090424, 0.21010838395871215], "isController": false}]}, function(index, item){
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
