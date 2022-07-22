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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8790682833439694, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.389, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.829, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.312, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.948, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.523, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.505, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.952, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.863, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 285.38472665390304, 1, 7027, 25.0, 803.0, 1890.0, 3703.970000000005, 17.195014360269386, 115.81525196584992, 142.42916229491078], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 35.562000000000054, 13, 99, 33.0, 56.0, 60.94999999999999, 77.97000000000003, 0.37284996070161414, 0.21654062512583688, 0.18788142550979775], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.539999999999996, 4, 72, 12.0, 24.0, 28.94999999999999, 48.940000000000055, 0.37269904924472536, 3.979475900114791, 0.13466664865287928], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.095999999999993, 5, 68, 15.0, 28.0, 30.0, 41.99000000000001, 0.3726818258726159, 4.001856718325958, 0.15722514529000983], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 70.23000000000006, 14, 293, 66.5, 125.90000000000003, 139.0, 166.94000000000005, 0.3695843875727989, 0.19948533872593913, 4.1145136897753], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 68.20599999999997, 28, 176, 58.0, 114.0, 124.0, 147.99, 0.3726129482999534, 1.5496586807172799, 0.1550128085700978], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.817999999999997, 1, 32, 6.0, 14.0, 16.0, 20.0, 0.3726384966868711, 0.23279352804253745, 0.15757077057169455], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 60.61200000000004, 25, 169, 51.0, 103.0, 114.0, 141.0, 0.37260961615993005, 1.529267734308105, 0.13536208712059958], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1141.6900000000003, 599, 2557, 900.0, 2234.8, 2369.85, 2498.7200000000003, 0.3724719398264132, 1.575261674341451, 0.18114358011089235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 17.752000000000013, 5, 100, 16.0, 28.0, 32.0, 52.0, 0.37240313980535233, 0.5537714697392656, 0.19020199425605397], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.161999999999983, 2, 40, 9.0, 23.0, 27.0, 33.0, 0.3703991791954189, 0.3572724348467844, 0.2025620511224947], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.315999999999992, 9, 102, 23.0, 44.0, 50.0, 62.97000000000003, 0.3726137813442713, 0.6072112725263661, 0.24343615206964597], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1504.0, 1504, 1504, 1504.0, 1504.0, 1504.0, 1504.0, 0.6648936170212766, 0.2837485455452128, 786.4295472490027], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.276000000000002, 2, 149, 9.0, 21.0, 24.0, 34.97000000000003, 0.37040411830114894, 0.3721078325562255, 0.21739538583885792], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 26.532, 10, 122, 23.0, 44.0, 49.0, 67.98000000000002, 0.3726157251288319, 0.5853814874726593, 0.22160446933931505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 17.91199999999999, 5, 60, 16.0, 31.0, 35.94999999999999, 42.98000000000002, 0.37261628049957407, 0.5766491658891407, 0.21287160555883872], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2924.846000000001, 1572, 6363, 2713.5, 4270.5, 4935.95, 5959.470000000001, 0.3719726079371515, 0.5680246940990266, 0.20487553796538424], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 69.38799999999998, 13, 228, 63.0, 133.90000000000003, 155.0, 179.99, 0.369548330639326, 0.19946587678482605, 2.979483415779566], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 31.767999999999997, 12, 82, 29.0, 51.900000000000034, 59.0, 70.98000000000002, 0.37261322598097885, 0.6745281866535159, 0.3107536083864804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 26.719999999999985, 8, 102, 23.0, 46.0, 51.94999999999999, 66.97000000000003, 0.3726137813442713, 0.6308635145062271, 0.26708839404950696], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 3.10546875, 909.21875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.6034358530961792, 2519.6882205204215], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.158, 1, 78, 6.0, 20.0, 23.0, 34.99000000000001, 0.3701707523646508, 0.3111422541677525, 0.15652728102919314], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 616.6400000000003, 316, 1380, 470.0, 1211.9, 1253.85, 1323.96, 0.3700918419915086, 0.32589405746305, 0.17131204404685066], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.783999999999992, 2, 47, 8.0, 23.0, 28.0, 39.960000000000036, 0.3703174286935275, 0.33549529470046136, 0.18081905697926148], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1715.0999999999995, 923, 3727, 1358.5, 3133.400000000001, 3502.85, 3679.9, 0.3700655460095092, 0.35008417487780435, 0.19551314491322702], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.255881320224719, 739.8503335674158], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 102.83000000000011, 29, 1162, 96.0, 165.0, 182.89999999999998, 222.96000000000004, 0.36925958284006405, 0.1993100234682928, 16.89001986431926], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 118.31599999999999, 30, 381, 104.5, 213.90000000000003, 236.0, 281.99, 0.3696939673338411, 83.66012378624849, 0.1140852477319275], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.7611234579100146, 0.5952920899854862], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.014000000000003, 1, 43, 7.0, 20.0, 22.0, 27.970000000000027, 0.3727485058376144, 0.4050400292290741, 0.15980136138936787], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.062000000000014, 2, 50, 9.0, 20.0, 25.0, 37.97000000000003, 0.3727435040125838, 0.38246613974713084, 0.13723076270775791], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.3859999999999975, 1, 31, 5.0, 13.0, 14.949999999999989, 17.0, 0.3727132180506502, 0.21136552036542297, 0.1444991675450275], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.25400000000005, 87, 464, 143.0, 364.0, 383.9, 421.9100000000001, 0.3726876594171463, 0.3394624089989908, 0.12156023266145202], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 315.1159999999999, 117, 1377, 274.0, 503.90000000000003, 540.75, 627.9000000000001, 0.3695865730676351, 0.1994865183595826, 109.33049369189636], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.086000000000003, 1, 44, 6.0, 14.0, 16.0, 23.99000000000001, 0.372741281022325, 0.20774138329321395, 0.15615821245954825], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.672000000000008, 2, 95, 9.0, 20.0, 24.0, 32.0, 0.3728099280775087, 0.20049819872223126, 0.15873547718925174], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 61.91399999999998, 7, 711, 53.5, 124.0, 138.0, 158.99, 0.36908240945854875, 0.1559625482390709, 0.26780100608173996], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.642000000000001, 2, 205, 10.0, 20.0, 24.0, 31.980000000000018, 0.37275378568744744, 0.19173158833929244, 0.14997515596018393], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.801999999999998, 2, 34, 8.0, 19.900000000000034, 22.0, 27.99000000000001, 0.37016691566561194, 0.22727308744934266, 0.18508345783280597], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.493999999999996, 2, 66, 9.0, 22.0, 25.94999999999999, 36.99000000000001, 0.37015129564058014, 0.2167806967857542, 0.17459284745546896], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 817.6920000000002, 381, 1883, 631.0, 1611.6000000000001, 1676.9, 1747.95, 0.3697852878704509, 0.3379021403449801, 0.16286441877888022], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.623999999999988, 5, 382, 25.0, 53.900000000000034, 64.94999999999999, 88.97000000000003, 0.3697921250548217, 0.32743575948091536, 0.15203367641414053], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 15.654000000000002, 4, 153, 14.5, 27.0, 31.0, 39.97000000000003, 0.37044089134005515, 0.24697627043629788, 0.17328240913270157], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 815.8380000000002, 441, 5434, 788.5, 996.0, 1045.0, 1264.5100000000004, 0.3703618657645639, 0.27838987470472903, 0.20471173439721013], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 256.7959999999999, 142, 570, 193.0, 499.90000000000003, 524.95, 557.99, 0.37279380625458536, 7.20784810530344, 0.18785312893297468], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 389.18400000000014, 201, 811, 310.0, 682.9000000000001, 725.6999999999999, 781.97, 0.37269960486387893, 0.7223638991888566, 0.26642198316441346], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 26.141999999999985, 8, 116, 22.0, 44.0, 48.0, 62.97000000000003, 0.37240452665150237, 0.30392791696086624, 0.2298434187927241], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 25.56999999999998, 8, 66, 22.0, 44.0, 48.0, 59.97000000000003, 0.37240092087299714, 0.3097437385905668, 0.23565995773994353], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.412000000000003, 9, 77, 21.0, 44.900000000000034, 52.0, 62.97000000000003, 0.3723884398711834, 0.301369164068016, 0.22728786613231408], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 29.169999999999995, 11, 77, 27.0, 48.0, 55.0, 64.0, 0.3724014756036069, 0.33301929221189347, 0.25893540100563295], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 26.701999999999995, 8, 80, 22.0, 48.0, 53.0, 65.0, 0.3718561422453864, 0.27914993662641696, 0.20517453161000324], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3154.0739999999987, 1717, 7027, 2746.5, 4768.6, 5374.65, 6388.85, 0.3713965252141101, 0.3103591021396154, 0.23647513128867167], "isController": false}]}, function(index, item){
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
