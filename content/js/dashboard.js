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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8668581152946182, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.995, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.746, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.743, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 506.2313550308464, 1, 23545, 13.0, 1068.0, 1916.0, 10689.94000000001, 9.794623353915723, 61.698993925265626, 81.14962353674453], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11337.163999999988, 9304, 23545, 10806.5, 13272.7, 13625.85, 20708.550000000054, 0.21079791225747702, 0.12247317530692176, 0.10663410014587216], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.175999999999998, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.2115414475273555, 0.10860298279258403, 0.0768490414845471], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.654, 3, 18, 4.0, 6.0, 6.0, 8.990000000000009, 0.21154010504235457, 0.12136245881843005, 0.08965664608240419], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.532, 11, 421, 15.0, 20.0, 23.0, 40.99000000000001, 0.2103980394269094, 0.1094542378741298, 2.3427328569781456], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.388000000000034, 26, 60, 44.0, 54.0, 56.0, 58.0, 0.21148847705032792, 0.8795586836904316, 0.08839557439212924], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.688000000000002, 1, 9, 3.0, 4.0, 4.0, 7.0, 0.2114930393410892, 0.13213523319645504, 0.08984323448571661], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.96200000000002, 24, 61, 38.0, 48.0, 50.0, 53.0, 0.21148740359875426, 0.8679765231534295, 0.07724246967376376], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1160.4400000000003, 813, 1850, 1158.5, 1489.8000000000002, 1596.8, 1725.94, 0.21141640109243082, 0.8941840167298025, 0.10323066459591348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.735999999999999, 4, 19, 7.0, 8.0, 10.0, 13.0, 0.21138118580617613, 0.3143283646864477, 0.10837414311351803], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.53, 3, 30, 4.0, 6.0, 6.0, 12.990000000000009, 0.210543779841949, 0.20308222342547994, 0.11555234792106966], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.161999999999999, 7, 29, 10.0, 12.0, 14.0, 18.0, 0.21148633015807758, 0.344697934603351, 0.13858137454694341], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.7320087774957699, 2001.3400883037225], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.229999999999996, 3, 28, 5.0, 6.0, 8.0, 14.990000000000009, 0.21054502105239667, 0.2115134459050888, 0.1239830543892531], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.613999999999997, 7, 25, 16.0, 20.0, 20.0, 21.99000000000001, 0.21148534618036316, 0.3322566966834868, 0.1261890102697284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.8819999999999935, 5, 28, 8.0, 9.0, 10.0, 14.990000000000009, 0.21148534618036316, 0.32728803022019853, 0.12123232246862614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2357.6900000000005, 1657, 3640, 2253.5, 2985.1000000000004, 3180.3999999999996, 3557.78, 0.21122437901088692, 0.32255241572569726, 0.11675097511734571], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.428, 9, 93, 13.0, 18.0, 25.94999999999999, 44.98000000000002, 0.21039308160221906, 0.10945165869171691, 1.6967051444053955], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.68799999999999, 9, 26, 15.0, 18.0, 19.0, 24.0, 0.2114880297775146, 0.38284909734265293, 0.17679077489214112], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.188000000000006, 6, 33, 10.0, 12.0, 13.0, 20.99000000000001, 0.21148722469121808, 0.3580160657063314, 0.152006442746813], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.486979166666667, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.6311118197278912, 2601.966411564626], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9219999999999993, 2, 19, 3.0, 4.0, 4.0, 7.990000000000009, 0.2105336733873226, 0.17702098904930152, 0.08943569133152864], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 746.214, 562, 993, 727.5, 902.0, 924.95, 974.96, 0.21047970007484657, 0.1852838000404963, 0.09784017308166697], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.805999999999998, 2, 14, 4.0, 5.0, 5.949999999999989, 10.980000000000018, 0.21054280461543515, 0.19074479030252475, 0.10321532023139497], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1013.3619999999995, 779, 1342, 973.5, 1232.7, 1265.9, 1310.97, 0.21047394101088948, 0.1991095814420496, 0.11160874020401661], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.720000000000013, 20, 628, 27.0, 35.0, 40.0, 68.98000000000002, 0.2103384724631182, 0.10942324967365985, 9.62134184587154], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.455999999999996, 27, 257, 35.0, 43.0, 48.0, 112.96000000000004, 0.21045737438430695, 47.59921424292379, 0.06535687993575158], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1055.0, 1055, 1055, 1055.0, 1055.0, 1055.0, 1055.0, 0.9478672985781991, 0.4970749407582939, 0.390625], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1440000000000023, 2, 9, 3.0, 4.0, 5.0, 8.0, 0.21150726421698954, 0.22978240066561334, 0.09108857765594959], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8740000000000014, 2, 16, 4.0, 5.0, 5.0, 7.990000000000009, 0.21150601163536872, 0.2170708504688454, 0.07828201016582495], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2519999999999993, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.21154216352632327, 0.11995349642176431, 0.08242707348340135], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 209.11799999999994, 94, 338, 226.5, 309.90000000000003, 318.0, 330.97, 0.21152220687041048, 0.19266491950205133, 0.06940572412935343], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.3779999999999, 82, 370, 109.0, 128.90000000000003, 139.95, 259.7900000000002, 0.21042699424818856, 0.1095288944670747, 62.248579196934834], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 275.0620000000001, 18, 531, 353.0, 457.0, 477.95, 504.9100000000001, 0.21150323811457555, 0.11788992208220707, 0.08902138244861528], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 539.9979999999995, 324, 1056, 503.5, 860.9000000000008, 947.8499999999999, 1017.95, 0.21154368504022292, 0.11375679028786019, 0.0904845059058766], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.488000000000005, 5, 268, 7.0, 11.0, 14.949999999999989, 29.950000000000045, 0.2103168844498005, 0.09482950070245841, 0.15301374894052872], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 549.0620000000001, 323, 1120, 504.0, 918.9000000000001, 968.95, 1036.92, 0.2114776535793016, 0.10877675284839253, 0.0854997544744442], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.297999999999998, 2, 14, 4.0, 5.0, 6.0, 11.0, 0.21053252095851244, 0.1292616223162367, 0.10567745680925333], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.713999999999998, 3, 37, 5.0, 5.900000000000034, 6.0, 11.0, 0.2105294183282701, 0.12329745846254575, 0.09971364051680762], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 921.1799999999996, 618, 1584, 924.5, 1294.0, 1387.55, 1466.8100000000002, 0.2104510850647495, 0.19230584453704758, 0.09309994290462062], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 520.2419999999997, 272, 1061, 426.0, 945.9000000000001, 986.95, 1030.99, 0.21045515979228918, 0.1863494120461587, 0.08693606698451008], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.714000000000005, 3, 37, 5.0, 7.0, 8.0, 13.970000000000027, 0.21054590764024778, 0.14043247550614182, 0.09889900544429608], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1245.6200000000001, 952, 9957, 1172.5, 1494.9, 1507.95, 1593.7900000000002, 0.21046171511986425, 0.1581381375464121, 0.11674048260554971], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.10399999999998, 145, 215, 170.5, 190.0, 193.0, 203.97000000000003, 0.2116096681918081, 4.091464668485946, 0.10704473449546542], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.17800000000014, 196, 338, 224.5, 259.0, 262.0, 267.0, 0.21159238504397312, 0.41010695558654675, 0.15166876037331667], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.040000000000006, 6, 20, 9.0, 11.0, 12.0, 15.990000000000009, 0.21137868364347517, 0.17257087844330593, 0.1308731303026985], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.93800000000001, 6, 30, 9.0, 11.0, 12.0, 16.0, 0.21137975599166486, 0.17575483578752277, 0.13417660292439665], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.939999999999998, 7, 21, 10.0, 12.0, 13.0, 17.99000000000001, 0.21137636025972234, 0.17106416358479934, 0.12942673621371673], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.18, 8, 39, 12.0, 15.0, 16.0, 21.980000000000018, 0.2113773432235383, 0.18902377633127565, 0.14738615533359994], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.364000000000004, 6, 34, 9.0, 11.0, 12.0, 16.99000000000001, 0.2113466075910629, 0.15865649484504488, 0.11702492822669205], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2051.3959999999993, 1692, 2742, 1991.5, 2530.7000000000003, 2636.8, 2691.99, 0.2111971669167241, 0.1764878200217871, 0.13488569058939215], "isController": false}]}, function(index, item){
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
