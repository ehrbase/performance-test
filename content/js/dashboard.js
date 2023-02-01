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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8673048287598384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.451, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.984, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.755, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.754, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.84, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.482, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 503.09380982769665, 1, 22864, 13.0, 1059.0, 1917.8500000000022, 10669.990000000002, 9.861308178781467, 62.119059756858235, 81.70211527000811], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11281.958000000004, 9167, 22864, 10772.5, 13080.5, 13714.099999999999, 19436.520000000044, 0.21222924323720904, 0.12331679660755798, 0.10735815234069754], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.1639999999999997, 2, 10, 3.0, 4.0, 5.0, 6.990000000000009, 0.2129760333810116, 0.1093394829186832, 0.07737019962669561], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.627999999999999, 3, 18, 4.0, 6.0, 6.0, 9.990000000000009, 0.212974672625982, 0.12217342011128351, 0.09026465617155877], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.31999999999997, 10, 425, 14.0, 19.0, 22.0, 50.960000000000036, 0.21184035033309778, 0.11020456350189893, 2.3587926508769343], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.06999999999999, 28, 62, 47.0, 55.0, 57.0, 59.99000000000001, 0.21292352085223917, 0.8855268823131245, 0.08899537785620934], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.689999999999997, 1, 11, 2.0, 4.0, 4.0, 7.0, 0.21292850797587604, 0.13302001546606218, 0.09045302829053328], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.43399999999998, 24, 70, 41.0, 49.0, 51.0, 53.99000000000001, 0.212922160768155, 0.8738770451972, 0.07776649231180663], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1170.2479999999996, 798, 1782, 1158.5, 1497.7, 1615.9, 1682.98, 0.2128522758378185, 0.9002570377476483, 0.10393177531143481], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.790000000000002, 4, 19, 7.0, 8.0, 9.0, 14.990000000000009, 0.21284412105381678, 0.3165037808299388, 0.10912418315747442], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.497999999999998, 2, 17, 4.0, 5.0, 6.0, 12.0, 0.2119945678511934, 0.20448159630107637, 0.11634858118395575], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.342000000000002, 6, 32, 10.0, 13.0, 14.0, 17.0, 0.21292034734973786, 0.3470352145768677, 0.13952104792155676], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.6888808718152866, 1883.42673915207], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.992000000000001, 3, 14, 5.0, 6.0, 7.0, 12.990000000000009, 0.21199591611067206, 0.2129710145138764, 0.12483743888157738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.00799999999999, 7, 31, 17.0, 20.0, 21.0, 23.0, 0.21291953132152766, 0.3344978312814988, 0.1270447594115756], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.041999999999993, 5, 20, 8.0, 10.0, 10.949999999999989, 15.0, 0.21292034734973786, 0.32950879262558896, 0.12205492567802356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2362.6220000000026, 1663, 3709, 2266.0, 3062.9, 3236.1499999999996, 3605.99, 0.2126949082965903, 0.32479800298091915, 0.11756378720299815], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.718000000000004, 10, 61, 13.0, 17.0, 20.0, 37.99000000000001, 0.21183595254366258, 0.1102022756636079, 1.7083411094780914], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.75, 10, 28, 15.0, 18.0, 19.0, 24.0, 0.2129224327835818, 0.38544574499536466, 0.17798984615502542], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.144000000000004, 6, 21, 10.0, 12.0, 13.949999999999989, 17.0, 0.212922160768155, 0.3604331366393899, 0.15303780305211143], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6583180147056], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6524151722925458, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9920000000000027, 1, 16, 3.0, 4.0, 4.0, 9.0, 0.2119805469691657, 0.17823754974653486, 0.09005033001131553], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 747.3220000000002, 576, 1003, 718.0, 903.0, 919.0, 963.9000000000001, 0.2119266377796531, 0.18655752912825674, 0.09851277303038562], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8559999999999963, 2, 12, 4.0, 5.0, 5.0, 9.990000000000009, 0.21199348925595796, 0.19205906241957496, 0.10392649570946377], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1005.2699999999996, 779, 1355, 968.0, 1215.7, 1248.85, 1291.95, 0.21191603886540153, 0.20047381446221005, 0.11237344639054006], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.286658653846153, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.241999999999994, 20, 675, 27.0, 33.0, 37.0, 67.94000000000005, 0.2117762863079854, 0.11017123581945987, 9.687110596353552], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.878, 25, 241, 35.0, 42.900000000000034, 48.0, 111.97000000000003, 0.21190328564520525, 47.92623647288888, 0.06580590315935085], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.48646944573283857, 0.3822907003710575], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.178000000000002, 2, 12, 3.0, 4.0, 5.0, 8.0, 0.21293775744174873, 0.23132443372397476, 0.09170463967950312], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.892, 2, 14, 4.0, 5.0, 5.0, 7.0, 0.21293685059583992, 0.2185513964611599, 0.07881158825763997], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.19, 1, 12, 2.0, 3.0, 3.9499999999999886, 7.0, 0.21297648696988555, 0.12077888256668187, 0.08298595537205501], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.89200000000005, 93, 346, 201.0, 300.80000000000007, 317.0, 334.97, 0.21295680299025424, 0.19397162081742192, 0.06987645098117717], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.45799999999988, 81, 394, 110.0, 128.0, 136.0, 276.94000000000005, 0.21187060130147872, 0.11028030321649235, 62.67562748656634], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 274.174, 17, 534, 335.0, 458.7000000000001, 488.0, 516.98, 0.2129342207863831, 0.11868753840801008, 0.08962368081926868], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 529.2860000000003, 331, 1044, 496.5, 833.5000000000002, 925.8, 965.94, 0.21296859479913655, 0.11453509261897703, 0.09109398879103692], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.28999999999999, 5, 265, 7.0, 10.0, 14.0, 27.980000000000018, 0.21175485056248441, 0.0954778633332077, 0.1540599254580575], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 539.2579999999999, 309, 1083, 497.0, 894.9000000000001, 944.8, 1041.99, 0.2129101021159432, 0.10951355457567229, 0.08607888894140671], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.310000000000001, 2, 16, 4.0, 6.0, 6.0, 11.990000000000009, 0.21197937864604532, 0.13014995619976089, 0.10640371154694073], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.697999999999992, 3, 28, 4.0, 6.0, 6.0, 10.990000000000009, 0.21197704203843906, 0.12414526550866435, 0.10039928260609662], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 893.0040000000002, 590, 1420, 903.0, 1147.4, 1313.55, 1392.98, 0.21189385643428407, 0.1936242191446523, 0.09373820016086981], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 511.7260000000007, 271, 1088, 423.0, 918.9000000000001, 977.0, 1019.98, 0.21189861583586164, 0.18762753316849032, 0.08753233837750925], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.710000000000003, 4, 46, 6.0, 7.0, 7.0, 10.990000000000009, 0.21199672507459105, 0.1414001594003376, 0.0995804929305452], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1231.7979999999998, 949, 9813, 1146.5, 1465.0, 1486.95, 1615.97, 0.21191226662631857, 0.15922806268322465, 0.11754508539428608], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.85799999999978, 144, 215, 176.0, 189.0, 192.0, 196.0, 0.21303882845687455, 4.1190974263844335, 0.10776768861392678], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.13800000000006, 196, 314, 218.5, 257.0, 260.0, 266.99, 0.21302367076424797, 0.41288106406495173, 0.1526947015048418], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.227999999999998, 6, 28, 9.0, 11.0, 12.949999999999989, 16.99000000000001, 0.21284212775721015, 0.17376564336428482, 0.13177920800592893], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.935999999999991, 6, 21, 9.0, 11.0, 12.0, 16.99000000000001, 0.2128428525880201, 0.17697134917040241, 0.13510532634981745], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.00400000000001, 7, 23, 10.0, 12.0, 13.0, 18.970000000000027, 0.21283959088825197, 0.17224833727051103, 0.13032267918645898], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.348000000000006, 8, 26, 12.0, 15.0, 16.0, 21.99000000000001, 0.2128405875081305, 0.19033227967487323, 0.14840642527422382], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.369999999999994, 6, 53, 9.0, 11.0, 12.0, 17.970000000000027, 0.21279683562593552, 0.1597451714004032, 0.11782793535147014], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2032.6160000000023, 1588, 2717, 1963.5, 2481.8, 2625.8, 2698.99, 0.21264380037000022, 0.1776967054830204, 0.13580961468943373], "isController": false}]}, function(index, item){
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
