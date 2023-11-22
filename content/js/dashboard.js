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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8605403105722187, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.44, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.968, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.567, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.68, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.295, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 499.70984896830413, 1, 29280, 14.0, 1224.800000000003, 2352.0, 9846.970000000005, 9.924165945734382, 62.51498203896961, 82.12332010507035], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10075.541999999998, 8573, 29280, 9801.0, 10654.0, 10931.65, 27823.25000000015, 0.21407060391029928, 0.12436247767243602, 0.10787151525167425], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.8479999999999994, 2, 17, 4.0, 5.0, 5.0, 10.0, 0.21483181676392818, 0.11029222108492645, 0.07762477754165374], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.389999999999999, 3, 27, 5.0, 7.0, 7.0, 11.990000000000009, 0.21483070910461138, 0.12328681236986629, 0.09063170540350791], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.831999999999997, 13, 597, 18.0, 24.0, 27.0, 89.96000000000004, 0.21343569139931, 0.11103449918488908, 2.348417905269556], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.686, 32, 74, 56.0, 68.0, 70.0, 73.0, 0.21479443957338387, 0.8933078396050447, 0.08935784302564603], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4740000000000024, 2, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.21480034522711483, 0.13418938363792737, 0.09082866160482493], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.02400000000003, 29, 74, 49.0, 60.0, 62.0, 65.98000000000002, 0.21479434730012098, 0.881548723896043, 0.07803075898012207], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1225.0659999999996, 857, 1791, 1191.5, 1551.9, 1714.6, 1769.99, 0.21471797223782507, 0.9081115008152841, 0.10442338884222352], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.856, 5, 34, 8.0, 12.0, 13.0, 20.970000000000027, 0.21478170661248439, 0.3193850121834923, 0.10969807867024349], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.407999999999997, 3, 21, 5.0, 6.0, 7.0, 12.990000000000009, 0.21351507736718828, 0.20594821979135305, 0.11676605793518109], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.426000000000005, 8, 37, 13.0, 15.0, 17.0, 22.0, 0.21479443957338387, 0.35005326700731637, 0.14032957038534552], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.5662528632198953, 1548.1545013907069], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.0920000000000005, 4, 22, 6.0, 7.0, 9.0, 15.980000000000018, 0.2135164450365967, 0.21449853727890375, 0.12531580416698695], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.606000000000007, 8, 24, 13.0, 15.0, 17.0, 22.99000000000001, 0.21479342457185227, 0.33744172855760196, 0.1277433550432207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.628000000000013, 7, 26, 9.0, 11.0, 13.0, 19.99000000000001, 0.2147924095799133, 0.3324059368997894, 0.12270855430102467], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2371.0779999999995, 1960, 3032, 2339.0, 2753.8, 2844.75, 2935.95, 0.21459291937786937, 0.327696380820672, 0.11819375637609213], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.578000000000003, 12, 105, 17.0, 22.0, 26.0, 77.98000000000002, 0.2134275829539658, 0.11103028097207726, 1.7207598875663492], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.722000000000016, 12, 36, 18.0, 21.0, 23.0, 27.99000000000001, 0.2147957314073889, 0.38883690944061605, 0.1791362838104591], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.668000000000001, 8, 26, 13.0, 15.0, 17.0, 23.0, 0.21479563913301605, 0.363653212279523, 0.15396484289417364], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.421605603448276, 1567.6185344827588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.6451560326842838, 2659.8655902294854], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.540000000000001, 2, 26, 3.0, 4.0, 5.0, 9.990000000000009, 0.2135334055930378, 0.1794948461577226, 0.09029293420096227], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 777.13, 587, 1028, 757.0, 947.0, 959.95, 979.99, 0.21347606058109037, 0.18798193221345216, 0.09881606710491879], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.635999999999998, 3, 17, 4.0, 6.0, 7.0, 12.980000000000018, 0.21353696218046864, 0.19345739764105718, 0.10426609481468195], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1055.5360000000003, 813, 1361, 1005.5, 1309.9, 1334.85, 1356.0, 0.2134332314687664, 0.2018969985631675, 0.1127611115474635], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.400443412162162, 889.8199957770271], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.048000000000044, 25, 1289, 34.0, 41.0, 47.0, 100.93000000000006, 0.2133117632478337, 0.11097002871069676, 9.730266075494447], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.10399999999997, 31, 500, 45.0, 54.0, 61.89999999999998, 164.8900000000001, 0.213517265646652, 48.29133133446476, 0.06589009369564651], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.8105317812982998, 0.6339354714064915], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.087999999999994, 3, 12, 4.0, 5.0, 6.0, 9.990000000000009, 0.21481363413543314, 0.23341095668755657, 0.09209295447798353], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.9679999999999955, 3, 15, 5.0, 6.0, 7.0, 11.0, 0.21481271124144993, 0.22045238402369127, 0.07908632044729162], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8239999999999994, 1, 16, 3.0, 4.0, 4.0, 8.0, 0.21483246290380445, 0.12181923754884753, 0.08328953884063513], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.01800000000003, 83, 178, 128.0, 162.90000000000003, 169.0, 174.0, 0.21482267891614226, 0.1956711531756592, 0.07006911597460108], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.266, 85, 503, 121.0, 142.90000000000003, 152.0, 437.9200000000001, 0.21347897723075926, 0.11106910912234097, 63.12431593330234], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.974, 15, 555, 283.0, 487.90000000000003, 506.0, 520.99, 0.21480994260707956, 0.11972088119656871, 0.08999361853363], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 591.228, 447, 747, 573.0, 706.0, 717.0, 734.9100000000001, 0.21478198339993007, 0.11549817258118973, 0.09145014136950147], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.769999999999989, 6, 407, 9.0, 12.0, 15.949999999999989, 35.960000000000036, 0.21327746032612682, 0.09616439082732033, 0.15475112599835178], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 547.4320000000005, 387, 737, 542.0, 644.0, 654.0, 682.97, 0.21477690907677285, 0.11047377517561234, 0.08641414701135784], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.187999999999997, 3, 25, 5.0, 6.0, 7.0, 14.0, 0.2135323112822786, 0.13110341740847792, 0.10676615564113931], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.770000000000006, 3, 46, 5.0, 7.0, 7.0, 14.0, 0.21352839009416175, 0.12505381916344702, 0.10071700431199232], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 945.8880000000004, 661, 1436, 891.5, 1197.6000000000008, 1350.75, 1411.95, 0.21344790078258538, 0.1950442726965556, 0.09400879223920508], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 328.4820000000002, 230, 458, 326.0, 400.0, 405.0, 411.0, 0.21352656633480366, 0.18906901656389632, 0.08778777776069566], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.942000000000003, 4, 91, 7.0, 8.0, 9.949999999999989, 20.960000000000036, 0.21351781272352646, 0.14237843163159636, 0.09987796122516521], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1584.4900000000002, 1262, 14842, 1438.5, 1779.8000000000002, 1806.0, 5564.400000000034, 0.21340681356738087, 0.16041148288178583, 0.11795728171790777], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.94200000000004, 129, 217, 175.0, 209.0, 212.0, 215.0, 0.21484123232930863, 4.15388599114317, 0.10825983972844068], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 237.7379999999999, 180, 338, 230.5, 286.0, 289.0, 297.0, 0.21482184824125353, 0.41636627970986156, 0.15356405557870856], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.994000000000002, 8, 26, 10.0, 13.900000000000034, 15.949999999999989, 20.980000000000018, 0.21477930781783794, 0.17531067357046115, 0.13255910404382185], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.720000000000002, 7, 28, 10.0, 13.0, 14.0, 20.0, 0.21478041494717046, 0.17863102534237074, 0.1359157313337563], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.164000000000003, 7, 26, 11.0, 15.0, 16.0, 22.99000000000001, 0.21477737036897035, 0.17381655722506778, 0.13108970359434224], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.065999999999997, 11, 38, 15.0, 18.0, 19.94999999999999, 26.0, 0.21477820069991918, 0.1920649864872295, 0.14933796767416255], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.560000000000002, 8, 45, 12.0, 14.0, 15.0, 41.76000000000022, 0.21476583865845228, 0.16122328890150278, 0.11849872933791557], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2623.347999999999, 2194, 3320, 2555.5, 3091.100000000001, 3187.9, 3299.7700000000004, 0.2145558093989176, 0.179294484043699, 0.13661170676571707], "isController": false}]}, function(index, item){
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
