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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8778345032971708, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.372, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.825, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.332, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.882, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.549, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.957, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.852, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 292.1859604339506, 1, 6964, 33.0, 807.9000000000015, 1890.9500000000007, 3775.980000000003, 16.834691281628164, 111.7170380724189, 139.44454633756834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 52.02800000000001, 19, 152, 42.0, 88.0, 96.0, 112.99000000000001, 0.36451942852102076, 0.21164054976091168, 0.1836836182781706], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.324000000000009, 5, 69, 13.0, 26.900000000000034, 32.94999999999999, 52.0, 0.364301644676205, 3.900876550741026, 0.1316324302052694], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.258000000000013, 5, 48, 14.0, 28.0, 33.0, 40.0, 0.3642923548149249, 3.9117086932541802, 0.15368583718754647], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 68.41000000000005, 14, 571, 60.0, 125.0, 140.0, 183.8800000000001, 0.36219154862240444, 0.19540941453547125, 4.032210599897862], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 71.55800000000004, 27, 161, 61.0, 117.0, 127.94999999999999, 152.8800000000001, 0.3643850092007215, 1.5154808117131562, 0.1515898573432689], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.278000000000003, 1, 31, 6.0, 14.0, 16.0, 19.0, 0.3644043955915814, 0.2277321071520193, 0.15408896805776828], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 62.47599999999998, 24, 145, 52.5, 100.0, 112.94999999999999, 131.99, 0.3643775738720874, 1.4955229895376267, 0.13237154050821925], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1189.8839999999993, 586, 2541, 918.0, 2271.5, 2361.75, 2494.71, 0.36409552118817473, 1.5397329363903278, 0.1770698921403428], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 25.064000000000007, 9, 77, 22.0, 41.900000000000034, 49.0, 66.94000000000005, 0.36459970234080297, 0.5421882417325194, 0.1862164495353906], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.140000000000004, 1, 59, 6.0, 23.0, 26.0, 34.98000000000002, 0.3628410161290089, 0.35002323202993585, 0.19842868069555172], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 40.62999999999998, 15, 116, 32.5, 72.0, 76.94999999999999, 94.99000000000001, 0.36438049485786245, 0.5936704796504425, 0.23805717876944335], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 0.460861568574514, 1277.3110573029157], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.334000000000003, 2, 47, 8.0, 20.0, 24.0, 36.97000000000003, 0.3628454924067324, 0.3645966471171563, 0.21295912200824818], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 43.19399999999997, 15, 110, 34.0, 72.0, 77.0, 92.95000000000005, 0.36438102595121663, 0.5725272818906274, 0.21670707500419037], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 25.95399999999999, 8, 88, 23.0, 44.0, 48.0, 67.95000000000005, 0.36438474364804513, 0.5639515778679266, 0.20816901858799455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2938.791999999999, 1513, 6165, 2660.5, 4395.200000000001, 5047.4, 6019.330000000001, 0.3638194640502711, 0.5556155636600384, 0.2003849391839384], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 68.7740000000001, 13, 198, 64.0, 132.0, 141.0, 171.98000000000002, 0.36215796896016483, 0.19551791147301958, 2.9198986247413283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 47.82999999999998, 18, 138, 39.0, 78.90000000000003, 87.0, 104.0, 0.3643828847901483, 0.6596703767372865, 0.3038896324324088], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 41.23200000000003, 15, 100, 32.5, 72.0, 77.94999999999999, 92.0, 0.36438235369137545, 0.616823886265336, 0.26118813243112265], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 2.724095394736842, 797.5603070175438], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 0.2875127510985562, 1200.5294158035153], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.418, 1, 51, 6.0, 17.900000000000034, 20.0, 31.970000000000027, 0.362805999650255, 0.304828608858489, 0.1534130838364848], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 577.2859999999996, 318, 1397, 468.0, 1127.5000000000002, 1209.9, 1302.89, 0.36273414489052686, 0.31929177178399903, 0.16790623503721652], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.538000000000004, 1, 63, 8.0, 21.0, 27.0, 36.0, 0.3628328537892449, 0.3287145183484574, 0.17716447938927973], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1672.2420000000004, 917, 3722, 1317.0, 3078.7000000000003, 3503.0499999999997, 3651.98, 0.3625952537731662, 0.34305830989457176, 0.19156643778445595], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 4.631420173267326, 651.9473236386139], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 101.54600000000002, 31, 1189, 90.5, 168.0, 183.95, 214.8800000000001, 0.3618500088291402, 0.1952251471463061, 16.55110421244069], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 128.07200000000006, 15, 386, 112.0, 235.7000000000001, 260.9, 303.99, 0.36243545024631113, 80.31697845629319, 0.11184531472444757], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 1.1679600501113585, 0.9134883073496659], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.544000000000004, 1, 32, 6.0, 19.0, 20.0, 27.980000000000018, 0.3644022709549526, 0.39595011287360343, 0.15622323920822676], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.512000000000002, 2, 84, 8.0, 20.0, 24.0, 37.99000000000001, 0.36438049485786245, 0.37380243503642346, 0.134151803282631], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.16, 1, 32, 5.0, 13.0, 15.0, 18.99000000000001, 0.36430907690637476, 0.20664080459299025, 0.1412409214178035], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 191.2459999999999, 88, 446, 141.0, 366.0, 388.0, 423.96000000000004, 0.36428465786020653, 0.33187043824537193, 0.11881940988799702], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 333.25800000000015, 44, 957, 283.0, 543.9000000000001, 588.8499999999999, 728.97, 0.3623093890304311, 0.194021631274474, 107.17776904914074], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.887999999999996, 1, 32, 6.0, 13.900000000000034, 15.0, 19.99000000000001, 0.36437571508734085, 0.20316152297206697, 0.15265349782467696], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.796000000000014, 1, 44, 7.0, 20.0, 24.0, 30.99000000000001, 0.36443175250127735, 0.19603367627272322, 0.1551682071196845], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 58.217999999999954, 8, 395, 49.0, 124.0, 138.0, 158.93000000000006, 0.3617609946401491, 0.15284825962211895, 0.2624886904469051], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.079999999999991, 2, 111, 9.0, 20.0, 26.0, 36.0, 0.3644043955915814, 0.18749887262390114, 0.14661583103880033], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.402, 2, 41, 7.0, 20.0, 23.0, 31.0, 0.3628007345989274, 0.2227915378270558, 0.1814003672994637], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.187999999999997, 2, 50, 9.0, 22.900000000000034, 27.0, 33.0, 0.36278836232979783, 0.21250966037386068, 0.17111990137235583], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 773.6960000000007, 381, 1783, 626.5, 1544.7, 1628.35, 1736.8600000000001, 0.3625150715641003, 0.3312998333608845, 0.15966239968301682], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 32.122, 7, 306, 29.0, 56.0, 63.0, 92.93000000000006, 0.3625345223498908, 0.32100944996081, 0.1490498378020547], "isController": false}, {"data": ["Query magnitude #1", 500, 1, 0.2, 22.178000000000008, 7, 89, 18.0, 38.0, 42.89999999999998, 59.97000000000003, 0.3628523386921786, 0.2415618575245778, 0.16973268577495462], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 834.038, 460, 5913, 804.5, 1017.7, 1111.35, 1301.7300000000002, 0.3627359869647196, 0.27253445742495175, 0.20049664904495243], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 253.81800000000004, 144, 598, 196.0, 494.7000000000001, 520.0, 572.9000000000001, 0.36446602083287777, 7.046915632266542, 0.18365670581031732], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 439.33400000000023, 221, 945, 372.0, 742.9000000000001, 795.8499999999999, 875.9200000000001, 0.3643462426065039, 0.7062353783298514, 0.260450634363243], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 40.07199999999988, 15, 111, 32.0, 72.0, 76.0, 89.96000000000004, 0.36457152273504473, 0.29741132458495356, 0.22500898668803543], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 41.163999999999994, 15, 121, 32.0, 72.0, 78.0, 90.97000000000003, 0.3645917265387047, 0.30314520293904684, 0.23071820195027407], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 40.506000000000036, 15, 94, 34.0, 72.90000000000003, 77.94999999999999, 88.0, 0.3645534475454981, 0.2950697028470166, 0.22250576632415656], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 43.99199999999999, 17, 120, 36.0, 73.90000000000003, 80.0, 96.0, 0.36456540886739736, 0.3260945016883024, 0.2534868858531122], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 41.70199999999998, 14, 96, 34.0, 76.0, 80.0, 91.98000000000002, 0.3642828000233141, 0.273464678912033, 0.20099588087223874], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3277.0059999999994, 1687, 6964, 2904.5, 5055.700000000001, 5663.9, 6830.000000000002, 0.36385600034930177, 0.30409904819818506, 0.23167393772240696], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query magnitude #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
