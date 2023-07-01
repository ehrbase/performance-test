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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8847266539034248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.106, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.566, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.92, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.995, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 343.47985534992876, 1, 19357, 10.0, 861.8000000000029, 1582.0, 6605.94000000001, 14.376612819865109, 90.5620000602466, 118.96769794945953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6759.018000000004, 5348, 19357, 6559.0, 7272.7, 7493.85, 16439.92000000008, 0.3098934090630187, 0.17997725517955843, 0.15615722566066176], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4739999999999993, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3109307712637781, 0.15962833570418045, 0.11234803258554482], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.777999999999998, 2, 26, 4.0, 5.0, 5.0, 7.990000000000009, 0.3109284510104242, 0.17845289056966446, 0.13117294027002271], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.991999999999985, 8, 386, 12.0, 16.0, 18.0, 72.92000000000007, 0.30907143197121434, 0.16078656496619687, 3.400691234394211], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.045999999999985, 24, 54, 34.0, 40.0, 42.0, 46.99000000000001, 0.3108654307071629, 1.29285714688174, 0.12932487644653456], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.42, 1, 9, 2.0, 3.0, 4.0, 7.990000000000009, 0.3108723887496526, 0.19420720293656277, 0.13145287532089803], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.972000000000012, 21, 44, 30.0, 35.0, 36.0, 38.99000000000001, 0.3108685231320377, 1.2758693855978966, 0.11293270566906057], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.2579999999994, 668, 1102, 876.0, 1012.0, 1060.85, 1078.99, 0.3107282662667801, 1.3141347753947337, 0.15111589511802392], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.9719999999999995, 3, 21, 6.0, 8.0, 9.0, 12.0, 0.31081943815035085, 0.46219518229093814, 0.1587485997584311], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.936, 2, 14, 4.0, 5.0, 5.0, 9.990000000000009, 0.30925054984747763, 0.2982908794822775, 0.16912139444783933], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.234000000000007, 5, 23, 8.0, 10.0, 11.0, 15.990000000000009, 0.3108712290542738, 0.5065956334327707, 0.20309848851299722], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.8400333737864077, 2296.6796875], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.227999999999998, 3, 12, 4.0, 5.0, 6.0, 10.0, 0.3092524625773595, 0.3106749031034722, 0.1815046191494073], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.348, 5, 18, 8.0, 10.0, 11.949999999999989, 15.0, 0.310870649209829, 0.48837961141635156, 0.18488303258670494], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.695999999999998, 5, 19, 6.0, 8.0, 9.0, 12.980000000000018, 0.3108702626480675, 0.4810929823447452, 0.17759678090734327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1628.953999999999, 1330, 2012, 1607.5, 1823.9, 1885.95, 1990.0, 0.3105651789352335, 0.47425183198516985, 0.17105347746042157], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.13399999999999, 8, 76, 11.0, 14.0, 17.94999999999999, 40.99000000000001, 0.30906436327178005, 0.16078288765479487, 2.4918314288787267], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.589999999999996, 8, 22, 11.0, 14.0, 15.0, 21.0, 0.3108720021835649, 0.5627602921559534, 0.2592623924460591], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.225999999999992, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.3108718089008816, 0.5263296521577612, 0.2228319411457491], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.486979166666667, 2164.8065476190477], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.7929353632478633, 3269.1339476495727], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.417999999999999, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.3092501673043405, 0.2599362416997255, 0.1307669164480268], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 579.274, 439, 743, 579.5, 667.0, 676.0, 709.9300000000001, 0.3091518850845345, 0.2722317834956793, 0.14310350930670834], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4019999999999997, 2, 15, 3.0, 4.0, 5.0, 9.0, 0.30925227130330657, 0.2801722896589751, 0.15100208559731765], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 780.6219999999993, 619, 1032, 759.5, 903.9000000000001, 916.95, 941.9300000000001, 0.30912493531560725, 0.2924340000874823, 0.1633169824274839], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.848, 16, 645, 21.0, 26.0, 32.0, 86.94000000000005, 0.30894309947782433, 0.16071980324495294, 14.092511891219898], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.388000000000055, 20, 241, 28.0, 38.900000000000034, 52.0, 121.93000000000006, 0.3091792219195701, 69.92725483923454, 0.09541077551424235], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.9894604952830188, 0.773879716981132], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.740000000000001, 1, 7, 3.0, 4.0, 4.0, 6.0, 0.310880120273301, 0.33781193225518036, 0.1332777078124796], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4719999999999995, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.31087934710363035, 0.3189883191359917, 0.11445460337702018], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9039999999999995, 1, 11, 2.0, 3.0, 3.0, 5.990000000000009, 0.31093231811858585, 0.17632959614711327, 0.12054700223933455], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.3459999999999, 66, 117, 89.0, 109.0, 112.0, 115.0, 0.31091762361929254, 0.2831991960214359, 0.10141258426644895], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.96999999999991, 57, 437, 80.0, 96.90000000000003, 113.0, 384.0400000000009, 0.3091308600391483, 0.16081748090962372, 91.40794249145871], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 205.45799999999977, 12, 356, 261.0, 332.0, 338.0, 347.99, 0.31087625446340583, 0.17326190154766635, 0.13024014957500107], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 441.0780000000004, 319, 550, 435.0, 513.0, 520.95, 536.0, 0.3108209838976081, 0.1671603750412615, 0.13234174705015345], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.232000000000002, 4, 255, 6.0, 8.0, 10.0, 23.980000000000018, 0.30889748310330767, 0.13927837590198064, 0.2241316698689039], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 413.53400000000005, 310, 524, 416.5, 475.0, 483.0, 500.98, 0.31081480100082365, 0.15987232796400766, 0.12505439259017515], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.697999999999998, 2, 17, 3.0, 5.0, 6.0, 10.0, 0.3092486371412561, 0.18987081118855387, 0.15462431857062808], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.304000000000006, 2, 40, 4.0, 5.0, 6.0, 9.990000000000009, 0.30924194285579987, 0.1811088726074724, 0.14586314296811653], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.6440000000003, 538, 869, 689.0, 791.0, 826.9, 857.95, 0.30910525157458213, 0.2824539794441917, 0.1361391293556021], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.94000000000008, 169, 338, 240.0, 292.90000000000003, 298.0, 309.99, 0.3091859134897814, 0.27377144494171846, 0.12711647419843553], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.601999999999999, 3, 40, 4.0, 5.0, 6.0, 9.990000000000009, 0.3092541840544831, 0.2061825429646838, 0.1446608927364233], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1036.486, 851, 8759, 985.5, 1170.9, 1204.85, 1233.91, 0.3090993278326017, 0.2323406676035467, 0.1708498237824732], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.14000000000007, 118, 167, 136.0, 148.0, 150.95, 154.0, 0.3108942312953595, 6.011039771572018, 0.15666154623867723], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.81200000000027, 161, 252, 175.5, 202.0, 204.0, 211.0, 0.310867750020051, 0.6025218087327103, 0.22222186817839581], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.511999999999998, 5, 17, 7.0, 9.0, 10.0, 13.990000000000009, 0.3108151874246662, 0.2536634377760427, 0.19183124848866115], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.320000000000004, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.3108173127729753, 0.2585216928338582, 0.19668908073914843], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.518, 6, 17, 8.0, 10.0, 11.0, 15.0, 0.3108115164369562, 0.25153575369772463, 0.18970429470029068], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.239999999999993, 7, 20, 10.0, 12.0, 13.949999999999989, 17.99000000000001, 0.3108130621054228, 0.27794397373101243, 0.2161122072451768], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.946000000000003, 5, 29, 8.0, 9.0, 10.0, 15.0, 0.31078079946495973, 0.23330108237959885, 0.17147573407978736], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1726.383999999999, 1495, 2150, 1692.0, 1983.8000000000002, 2046.95, 2130.9300000000003, 0.3104959427495161, 0.2594672687208871, 0.19769858854754344], "isController": false}]}, function(index, item){
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
