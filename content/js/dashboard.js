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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9113610543058396, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.973, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.822, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.585, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.9617359690985, 1, 3673, 13.0, 605.0, 1318.800000000003, 2286.9900000000016, 24.49258989242405, 164.6876919570559, 215.7511677423798], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.798000000000012, 4, 67, 8.0, 12.0, 15.949999999999989, 24.980000000000018, 0.5669442047530334, 6.079409146340772, 0.20485288648302966], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.999999999999999, 4, 40, 8.0, 10.0, 11.949999999999989, 20.0, 0.5669229914485336, 6.087136311814449, 0.2391706370173501], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.069999999999993, 12, 328, 19.0, 27.0, 31.94999999999999, 47.0, 0.5632692145210804, 0.30354930013800097, 6.270770552285465], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.15199999999997, 26, 182, 44.0, 53.0, 55.0, 63.0, 0.56684200979503, 2.3575977731611646, 0.2358151329811355], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4340000000000006, 1, 16, 2.0, 4.0, 5.0, 8.0, 0.5668779987846135, 0.35429874924038346, 0.23970524753294695], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.09199999999999, 22, 69, 39.0, 47.0, 48.0, 62.930000000000064, 0.5668323706630238, 2.325916922213594, 0.20591957215492662], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 764.5140000000002, 568, 1014, 754.5, 904.0, 926.9, 968.9300000000001, 0.5665022677085776, 2.3960169154744624, 0.2755059856629606], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.551999999999984, 5, 23, 8.0, 10.0, 12.949999999999989, 19.99000000000001, 0.5665658179510713, 0.8426559968159001, 0.28936906522305694], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.698000000000001, 2, 38, 3.0, 5.0, 6.0, 21.930000000000064, 0.5643366335739665, 0.5444966737998818, 0.30862159648576293], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.804000000000007, 8, 34, 13.0, 16.0, 17.0, 23.99000000000001, 0.5668265873411751, 0.9238609123754115, 0.3703193231750451], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.6927886566558442, 1920.1136997767858], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.584000000000003, 2, 25, 4.0, 6.0, 7.0, 12.990000000000009, 0.5643442770975547, 0.5664605681366706, 0.3312215923199516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.786000000000007, 9, 50, 14.0, 17.0, 18.0, 31.99000000000001, 0.5668137359373512, 0.8899861300678816, 0.3370991847518036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.337999999999992, 5, 33, 8.0, 11.0, 12.0, 17.99000000000001, 0.5668105231774491, 0.877338553941657, 0.3238126524011794], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1986.2479999999996, 1513, 3673, 1968.0, 2254.8, 2324.85, 2453.51, 0.5656108597285069, 0.8638822115384616, 0.31152785633484165], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.450000000000035, 11, 228, 16.0, 23.0, 30.94999999999999, 60.950000000000045, 0.5632209932740149, 0.3041613371880178, 4.540969258271745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.30400000000002, 11, 55, 18.0, 21.0, 22.0, 28.99000000000001, 0.5668362262764869, 1.026283558121686, 0.47273255589855445], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.86, 8, 40, 13.0, 16.0, 18.0, 27.0, 0.5668317280658794, 0.9598498207678076, 0.4063032113284722], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.0496144480519485, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.7304749800637959, 3050.148898524721], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3620000000000005, 1, 24, 2.0, 3.0, 4.0, 8.990000000000009, 0.5642856820408181, 0.47446286351283634, 0.23860908234733816], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 418.4319999999997, 321, 646, 422.5, 489.0, 502.95, 563.9300000000001, 0.5640966049281736, 0.49625076717138267, 0.26111503001558034], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.096000000000002, 2, 25, 3.0, 4.0, 5.949999999999989, 11.980000000000018, 0.5643309010671498, 0.5114248790921044, 0.2755521977866942], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1188.0340000000006, 938, 1764, 1181.5, 1373.0, 1401.85, 1482.9, 0.5637410759787672, 0.533462014280689, 0.29783586143018853], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 8.995643028846155, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.53599999999998, 26, 779, 39.0, 48.0, 56.0, 84.99000000000001, 0.5627379678181411, 0.3039004845736641, 25.73976653971298], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.564, 28, 203, 41.0, 50.0, 57.94999999999999, 110.94000000000005, 0.5637499746312511, 127.57430700329681, 0.17396971873386266], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 1.6037127293577982, 1.2543004587155964], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3219999999999983, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.5670779494007687, 0.616364997737359, 0.24311251932318115], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3880000000000003, 2, 25, 3.0, 4.0, 6.0, 15.990000000000009, 0.5670734473529011, 0.5820255792655264, 0.20877606411332394], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.123999999999999, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.5669589907222831, 0.32168278672817036, 0.21980734308276012], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.11999999999999, 86, 274, 119.5, 146.90000000000003, 151.0, 160.99, 0.5668940667733183, 0.5165157854487363, 0.18490490068582843], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 156.30200000000013, 108, 594, 154.5, 182.0, 199.84999999999997, 322.97, 0.5634063094745786, 0.3042614151752363, 166.66593013029336], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2939999999999996, 1, 32, 2.0, 3.0, 4.0, 7.0, 0.5670695885116238, 0.3155653655443981, 0.23757114596824863], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 467.60200000000003, 354, 814, 467.0, 540.0, 557.8499999999999, 610.94, 0.5668638597079971, 0.6160437281615698, 0.24357431471827998], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.49999999999999, 7, 358, 10.0, 15.900000000000034, 22.0, 47.950000000000045, 0.5625309392016561, 0.23786708659601277, 0.4081645388933891], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.0580000000000003, 1, 15, 3.0, 4.0, 5.0, 10.990000000000009, 0.5670843810217272, 0.6036347415172683, 0.2303780297900767], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.912000000000001, 2, 27, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.5642780401043689, 0.3466121945562969, 0.28213902005218444], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.164000000000002, 2, 26, 4.0, 5.0, 6.0, 15.0, 0.5642640304251165, 0.3306234553272167, 0.26615188153840946], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.1059999999999, 375, 851, 514.5, 639.0, 662.95, 711.8700000000001, 0.5637239150851392, 0.5146402976349527, 0.24828074775722442], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.81999999999999, 6, 158, 16.0, 31.900000000000034, 36.0, 57.0, 0.5638733134549194, 0.49944638213243353, 0.23182682125441512], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.228000000000006, 4, 38, 7.0, 9.0, 10.0, 14.990000000000009, 0.5643538317932117, 0.3764195967917613, 0.26398973186420743], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 562.7219999999993, 377, 3506, 544.0, 628.8000000000001, 663.8, 744.98, 0.5641379746092781, 0.4242053129386173, 0.31181845080942516], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.002000000000004, 8, 47, 13.0, 15.0, 17.0, 23.99000000000001, 0.5665427071223482, 0.46252900698660465, 0.34966307705207433], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.577999999999994, 8, 28, 13.0, 15.0, 16.0, 24.970000000000027, 0.5665529783690072, 0.4707479844877795, 0.3585218066241374], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.828, 8, 33, 13.0, 16.0, 17.0, 21.0, 0.5665350039317529, 0.45864992017521794, 0.34578552486068903], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.839999999999971, 10, 52, 16.0, 19.0, 21.0, 28.0, 0.5665382135690434, 0.5067861363566833, 0.39392110162222554], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.000000000000002, 8, 55, 13.0, 15.0, 17.0, 32.98000000000002, 0.5663707190869197, 0.42533113572054815, 0.31249946902745085], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2214.31, 1706, 3208, 2196.0, 2552.7000000000003, 2638.8, 2821.6000000000004, 0.5652284992731161, 0.4718554007017877, 0.3598915835215544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
