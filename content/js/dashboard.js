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

    var data = {"OkPercent": 97.82599446926186, "KoPercent": 2.1740055307381407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8878111040204212, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.475, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.814, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.343, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.979, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.634, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.503, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.985, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 511, 2.1740055307381407, 232.20327589874302, 1, 4794, 20.0, 664.0, 1502.7000000000044, 2905.970000000005, 21.112774823117075, 140.50724044305613, 174.92185935123914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.68800000000001, 16, 95, 28.0, 40.0, 46.0, 60.950000000000045, 0.4581133244092858, 0.2659553641290853, 0.23174091996485355], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.302, 5, 54, 8.0, 13.0, 16.0, 32.98000000000002, 0.45790103659636666, 4.920033057306772, 0.1663468609510238], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.582000000000004, 5, 44, 9.0, 14.0, 17.0, 21.0, 0.4578859406121935, 4.916674596201837, 0.19406493967352734], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 27.34200000000002, 14, 460, 23.0, 39.0, 49.0, 63.99000000000001, 0.4548638592469274, 0.24561848833956496, 5.064802463997525], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.30399999999998, 28, 106, 51.5, 72.0, 79.94999999999999, 91.99000000000001, 0.4575377514398713, 1.9029298916047312, 0.1912364820471337], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.6639999999999984, 1, 30, 3.0, 7.0, 10.0, 15.990000000000009, 0.45757501713618437, 0.28595846837516026, 0.19438001216234393], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.011999999999965, 25, 89, 45.0, 62.0, 69.0, 84.99000000000001, 0.45752560999601954, 1.8778584627368267, 0.16710408021338993], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 963.6780000000007, 565, 1903, 903.0, 1334.9, 1506.4499999999998, 1701.94, 0.45734272898235756, 1.9340943616387323, 0.2233118793859168], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.335999999999993, 7, 36, 13.0, 20.0, 24.0, 31.0, 0.45698283481075885, 0.6795432933541901, 0.23429295730043787], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.224000000000004, 2, 22, 3.0, 7.0, 10.0, 16.0, 0.4557856057436279, 0.4397102610785528, 0.25014795940226453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.354000000000003, 12, 67, 21.0, 32.0, 38.0, 49.98000000000002, 0.4574824921450256, 0.7454096421183085, 0.29977612522393765], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 874.0, 874, 874, 874.0, 874.0, 874.0, 874.0, 1.1441647597254005, 0.48828125, 1353.3089155463388], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.355999999999997, 2, 38, 5.0, 8.0, 12.0, 18.980000000000018, 0.45579183804439777, 0.4579915677940222, 0.26840085775466005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.00999999999999, 12, 67, 22.0, 33.0, 37.94999999999999, 49.0, 0.4574732835602401, 0.7187968552714646, 0.2729650158743229], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.97599999999999, 7, 40, 12.0, 18.0, 22.0, 34.98000000000002, 0.4574699350758668, 0.7080437310378711, 0.26224106629837285], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2508.882000000001, 1537, 4383, 2441.5, 3222.6000000000004, 3541.5, 3874.0, 0.45635344391689986, 0.6969051877803151, 0.2522422356025052], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.106, 13, 166, 20.0, 34.0, 41.0, 52.99000000000001, 0.45483241244930894, 0.24557574562951534, 3.667974669928118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.875999999999994, 15, 72, 26.0, 39.0, 43.0, 54.99000000000001, 0.4575092828633493, 0.8282901751482787, 0.38244916614358104], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.22600000000001, 12, 71, 21.0, 32.0, 39.0, 48.0, 0.45749337549592284, 0.7744415692892017, 0.32882336363769454], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 4.612082301980197, 1350.3442141089108], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.588698987789203, 2458.155928663239], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0160000000000005, 1, 31, 2.0, 4.0, 7.0, 20.99000000000001, 0.45562611685351895, 0.3828416244756882, 0.19355211018679758], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 498.908, 315, 963, 466.0, 703.7, 785.6999999999999, 901.95, 0.4555057434719194, 0.40095270307357056, 0.21173899794202505], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.109999999999998, 2, 23, 3.0, 6.900000000000034, 10.0, 18.99000000000001, 0.4557748034926935, 0.41286520807714994, 0.22343647593098842], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1428.3260000000002, 937, 2690, 1360.5, 1930.5000000000002, 2146.5499999999997, 2567.6000000000004, 0.45539124027625855, 0.4308285752538578, 0.24148187838868004], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 5.029821908602151, 708.049815188172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 53.079999999999984, 15, 805, 47.0, 72.0, 83.94999999999999, 119.91000000000008, 0.45450454913603233, 0.24502943882777825, 20.790032306183353], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 54.65000000000003, 10, 262, 51.0, 76.0, 85.0, 110.98000000000002, 0.4551292612614909, 101.24649984263907, 0.14133896980581456], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 1.5795604292168675, 1.2412932981927711], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.76, 1, 17, 2.0, 4.0, 5.0, 10.990000000000009, 0.4579274569639776, 0.49749435690270694, 0.1972128989464005], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.189999999999998, 2, 28, 3.0, 6.900000000000034, 9.949999999999989, 16.980000000000018, 0.45792368243908466, 0.46976440828246563, 0.16948542543399717], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7640000000000016, 1, 22, 2.0, 4.0, 5.949999999999989, 12.990000000000009, 0.4579140367137158, 0.25976068095938487, 0.17842548891481702], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 153.57399999999993, 90, 338, 140.0, 233.90000000000003, 261.0, 303.97, 0.4578729420900618, 0.41713119307494645, 0.1502395591233015], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 205.10199999999995, 44, 731, 191.5, 281.0, 327.79999999999995, 429.9000000000001, 0.4549578117621153, 0.24400578154700217, 134.58576204978513], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.958, 1, 32, 2.0, 5.0, 7.0, 11.0, 0.4579215855076977, 0.255319009641539, 0.19273847983771258], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 4.072000000000001, 2, 30, 3.0, 6.0, 8.0, 14.0, 0.4579526220535328, 0.24636598852279137, 0.19588207857367906], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 14.773999999999996, 8, 356, 12.0, 22.0, 26.0, 46.98000000000002, 0.4543699025376559, 0.19189940108367223, 0.33057185292046254], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.451999999999996, 2, 61, 5.0, 7.0, 9.0, 16.99000000000001, 0.4579287151527696, 0.23562042300249203, 0.18513914850902988], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.572, 2, 38, 4.0, 7.0, 9.0, 15.0, 0.4556203042632392, 0.27984252480852556, 0.22870003553838375], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.989999999999998, 2, 34, 4.0, 8.0, 11.0, 16.980000000000018, 0.45560992500660635, 0.26690732837174125, 0.21579181018379304], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 633.3580000000002, 381, 1273, 605.0, 905.6000000000001, 1019.95, 1183.97, 0.45513174698680026, 0.4159157466936954, 0.2013424622900591], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.577999999999992, 6, 133, 17.0, 33.0, 43.0, 59.97000000000003, 0.45523451405991794, 0.4029883514023499, 0.18805097602279813], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.333999999999996, 6, 54, 11.0, 15.0, 18.0, 30.980000000000018, 0.4557968240077303, 0.30375475453062045, 0.21409987533956862], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 660.4540000000005, 482, 4794, 632.0, 760.9000000000001, 817.95, 895.97, 0.4555787900738493, 0.34229004793827816, 0.2527038601190883], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 206.7739999999999, 144, 400, 187.5, 289.90000000000003, 335.0, 388.99, 0.45799121389655256, 8.855216289499452, 0.23167914921720142], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 316.0059999999996, 214, 574, 295.5, 423.0, 484.0, 538.94, 0.45786413705888224, 0.8875329647870428, 0.32819558261837845], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 21.755999999999993, 12, 53, 21.0, 30.0, 36.94999999999999, 46.0, 0.45695568809301423, 0.37280265717447847, 0.2829198303232139], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 21.341999999999995, 12, 57, 20.0, 30.900000000000034, 35.0, 49.950000000000045, 0.45697072279973167, 0.37995509063100347, 0.29006930646467344], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.98199999999998, 12, 64, 21.0, 28.0, 34.0, 46.0, 0.4569377312676092, 0.36987145941798927, 0.27978511475077245], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.27999999999998, 14, 66, 24.0, 34.0, 39.0, 46.0, 0.4569465007036976, 0.40872704272221305, 0.31861308740472666], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 22.304000000000002, 12, 78, 21.0, 33.0, 39.0, 51.960000000000036, 0.45757041093483464, 0.34344323478715655, 0.25336174121098753], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2700.1360000000004, 1751, 4740, 2581.5, 3542.000000000001, 3779.0499999999997, 4413.140000000001, 0.4559185984697548, 0.3810161593508449, 0.29118238613205044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.84735812133073, 2.1272069772388855], "isController": false}, {"data": ["500", 11, 2.152641878669276, 0.04679855349925548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 511, "No results for path: $['rows'][1]", 500, "500", 11, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
