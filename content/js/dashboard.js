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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8735162731333759, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.79, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.456, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 463.78310997659776, 1, 20502, 11.0, 1012.9000000000015, 1860.0, 10439.920000000013, 10.65507037196871, 67.11908079151578, 88.17161660576058], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10550.170000000006, 8891, 20502, 10407.5, 11218.5, 11528.3, 19314.41000000006, 0.229369477069704, 0.13325022655970098, 0.11558071305465553], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8260000000000014, 2, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.23029492950441913, 0.1182308079978205, 0.08321203507483894], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.166, 2, 16, 4.0, 5.0, 6.0, 9.0, 0.23029365665334495, 0.13217371577318102, 0.0971551364006299], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.208000000000002, 10, 463, 14.0, 18.0, 21.94999999999999, 42.97000000000003, 0.22896404302875467, 0.1191127298455546, 2.5192752664111127], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 39.96600000000003, 25, 68, 42.0, 51.0, 53.0, 57.98000000000002, 0.2302450866849727, 0.95756548155875, 0.09578555364042808], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6819999999999977, 1, 15, 2.0, 4.0, 4.0, 8.0, 0.23025144839673614, 0.14384194731823835, 0.09736218472244798], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.044000000000004, 21, 55, 36.0, 45.0, 47.0, 49.99000000000001, 0.23024487463396823, 0.9449730830790278, 0.08364364586312126], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1023.0599999999998, 731, 1453, 1006.0, 1258.6000000000001, 1392.85, 1421.97, 0.23017025693905782, 0.9734381185825656, 0.11193826948794024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.871999999999996, 4, 23, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.2301894366988257, 0.3422966378473329, 0.11756745643895102], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.417999999999996, 2, 16, 4.0, 5.0, 6.0, 10.990000000000009, 0.22909570427226833, 0.2209766777995724, 0.12528671327389673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.334000000000001, 6, 25, 9.0, 12.0, 14.0, 18.0, 0.2302462529724791, 0.37520920390400936, 0.15042455394393411], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.8901588220164609, 2433.7243602109056], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.064000000000002, 3, 19, 5.0, 6.0, 7.949999999999989, 13.990000000000009, 0.22909685894460577, 0.2301506150047904, 0.134460168189168], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.541999999999998, 6, 23, 9.0, 12.0, 13.0, 18.0, 0.23024551078815342, 0.3617170465429788, 0.13693312116209516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.374000000000001, 5, 16, 7.0, 9.0, 11.0, 13.990000000000009, 0.23024540476221175, 0.35632050330148884, 0.131536681431537], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2019.2239999999988, 1600, 2649, 1970.5, 2402.1000000000004, 2528.95, 2626.92, 0.23001587569574053, 0.35124816892986954, 0.1266884315355446], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.170000000000007, 10, 80, 13.0, 17.0, 19.0, 36.99000000000001, 0.22895901038420696, 0.11911011174001063, 1.8459820212226685], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.044000000000004, 9, 35, 14.0, 17.0, 19.0, 26.0, 0.2302467831070698, 0.4168073870248109, 0.19202221950531018], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.542, 6, 32, 9.0, 12.0, 14.0, 19.0, 0.23024710118899602, 0.3898258806663812, 0.16504040261008115], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.256610576923077, 2098.1971153846152], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.840339107789855, 3464.5713032155795], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.829999999999999, 1, 22, 3.0, 3.0, 4.0, 10.980000000000018, 0.2290920303922651, 0.19256035300676416, 0.0968719230076668], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 693.5939999999995, 530, 923, 680.0, 828.8000000000001, 851.8499999999999, 890.9300000000001, 0.22903662158157115, 0.20168419145148297, 0.10601890491178198], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.691999999999999, 2, 27, 3.0, 4.0, 5.0, 10.0, 0.22909706888628126, 0.20755433767235543, 0.1118638031671295], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 966.9459999999998, 745, 1221, 952.0, 1151.9, 1179.9, 1210.99, 0.22901668936222058, 0.2166511300313249, 0.12099416889156381], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.488, 20, 1406, 27.0, 32.0, 34.94999999999999, 75.97000000000003, 0.22881263631512808, 0.11903396434710145, 10.437342033476204], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.222000000000016, 26, 415, 37.0, 47.0, 57.94999999999999, 124.99000000000001, 0.22903924450030969, 51.801946841451475, 0.07068007935751743], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 1.1475143599562363, 0.8974972647702407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1900000000000026, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.23027064169059178, 0.25021918526908044, 0.09871954267790019], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.0080000000000044, 2, 23, 4.0, 5.0, 6.0, 9.0, 0.23027042959251345, 0.2362767998800291, 0.08477729683239997], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2239999999999993, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.23029567200737683, 0.13060058563613652, 0.08928455252629747], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.86800000000001, 87, 182, 126.0, 154.0, 158.0, 166.99, 0.23028517133907603, 0.20975515835905234, 0.0751125461203627], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.28200000000004, 69, 578, 99.0, 118.0, 130.89999999999998, 495.63000000000125, 0.22900431215119782, 0.11913367883404746, 67.71505437134881], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.67000000000004, 15, 446, 315.0, 410.90000000000003, 424.9, 442.0, 0.2302679904926952, 0.12833617661531846, 0.09646969523570924], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 488.7580000000003, 362, 653, 470.5, 589.0, 601.95, 625.99, 0.2302398915478015, 0.12382364323661108, 0.09803182882308735], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.398000000000012, 5, 307, 7.0, 9.0, 11.949999999999989, 28.99000000000001, 0.22878258836384302, 0.10315547741549799, 0.16600142886165561], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 455.4319999999997, 333, 632, 453.0, 547.0, 561.8499999999999, 579.99, 0.2302358628273148, 0.11842532354470213, 0.09263396043442744], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.136000000000007, 2, 23, 4.0, 5.0, 6.0, 13.990000000000009, 0.2290906658382748, 0.14065585206951345, 0.11454533291913742], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.627999999999999, 3, 35, 4.0, 6.0, 6.0, 14.980000000000018, 0.2290873070053982, 0.13416596570723374, 0.10805582937852279], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 771.1779999999999, 541, 1163, 742.0, 961.9000000000001, 1078.0, 1123.99, 0.22901742364559094, 0.20927138035099213, 0.10086607232828275], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 281.4279999999997, 184, 374, 274.0, 340.0, 347.95, 366.97, 0.22905655727078195, 0.20282018656542058, 0.0941726666123039], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.208000000000002, 3, 47, 5.0, 6.0, 7.0, 13.990000000000009, 0.22909780368517563, 0.15274156401748656, 0.10716586715351477], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1267.4280000000012, 943, 11134, 1164.5, 1497.0, 1511.95, 1586.98, 0.22900378772264893, 0.17213525922656261, 0.12657826547951104], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.22600000000003, 144, 193, 170.0, 185.0, 187.0, 191.99, 0.2302901563854394, 4.452585959111292, 0.11604464911610032], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.06199999999998, 196, 306, 220.0, 252.0, 255.0, 264.99, 0.23027308084657597, 0.446313756139656, 0.16460927263641953], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.359999999999996, 5, 20, 8.0, 11.0, 12.0, 15.0, 0.23018858890711982, 0.18786221253473545, 0.142069519716113], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.398000000000003, 5, 25, 8.0, 11.0, 12.0, 16.0, 0.23018858890711982, 0.1914589092364092, 0.14566621641778676], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.475999999999996, 6, 24, 9.0, 12.0, 13.0, 17.0, 0.2301872112589169, 0.1862875428148213, 0.1404951240593975], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.659999999999998, 8, 32, 11.0, 14.0, 16.0, 20.0, 0.23018774112165882, 0.20584493791261155, 0.16005241374865342], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.885999999999987, 6, 36, 9.0, 10.0, 12.0, 33.850000000000136, 0.230176402591418, 0.17279189691020405, 0.12700162838296014], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2069.798000000002, 1659, 2748, 2006.5, 2557.4000000000005, 2688.95, 2722.96, 0.23000434248198606, 0.19220411709498078, 0.14644807743970206], "isController": false}]}, function(index, item){
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
