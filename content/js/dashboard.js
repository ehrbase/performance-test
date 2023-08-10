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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8913422676026377, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.212, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.618, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.957, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.111, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.39668155711587, 1, 22997, 9.0, 845.0, 1500.9500000000007, 6069.990000000002, 15.185413217027044, 95.6568611081007, 125.6605902570279], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6242.494000000001, 5365, 22997, 6050.5, 6534.7, 6715.749999999999, 21745.35000000013, 0.3277850254688965, 0.1903867617461764, 0.1651729229901861], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3839999999999977, 1, 13, 2.0, 3.0, 4.0, 5.0, 0.32893503335730173, 0.16887151990846397, 0.1188534788498063], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6560000000000006, 2, 16, 4.0, 5.0, 5.0, 7.0, 0.32893200383403143, 0.18878576950517445, 0.138768189117482], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.641999999999989, 8, 369, 12.0, 16.0, 19.94999999999999, 37.98000000000002, 0.3265941714697783, 0.16990232527701718, 3.593492705029289], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.32000000000001, 24, 55, 35.0, 41.0, 42.0, 44.0, 0.3288670988857325, 1.3677242213824783, 0.1368138516848848], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.243999999999999, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3288755350804956, 0.20545407084603887, 0.13906553387681111], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.518000000000022, 21, 58, 30.0, 36.0, 38.0, 40.0, 0.3288647195244353, 1.349729536516152, 0.11947038638973626], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.1420000000002, 666, 1089, 860.0, 1007.5000000000002, 1047.95, 1077.0, 0.32872396588371194, 1.3902423498947756, 0.1598677099707896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.713999999999998, 4, 17, 5.0, 8.0, 9.0, 12.0, 0.3288400627163767, 0.4889922381824746, 0.16795249296939946], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.939999999999997, 2, 17, 4.0, 5.0, 5.0, 9.990000000000009, 0.3267486936587228, 0.31516889864614944, 0.178690691844614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.651999999999996, 5, 22, 7.0, 9.0, 10.0, 14.0, 0.32887099246030366, 0.5359280408480793, 0.2148580995663507], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.8994120322245323, 2459.022950233888], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.150000000000001, 2, 23, 4.0, 5.0, 6.0, 10.0, 0.3267510424992011, 0.3282539696575714, 0.19177478177931626], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.038000000000004, 5, 23, 8.0, 10.0, 11.0, 14.0, 0.3288690456614938, 0.5166551977012711, 0.19558715703891572], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.659999999999999, 4, 21, 6.0, 8.0, 9.0, 12.990000000000009, 0.3288677478084253, 0.5089453209272361, 0.18787854733196174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1559.2660000000003, 1317, 1937, 1535.5, 1771.0, 1818.9, 1896.99, 0.32854533268500385, 0.5017086154031909, 0.1809566090179123], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.120000000000005, 7, 72, 11.0, 15.0, 17.94999999999999, 45.960000000000036, 0.32658670517777094, 0.16989844112817418, 2.633105310495778], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.014000000000001, 8, 24, 11.0, 13.0, 15.0, 20.970000000000027, 0.3288720740251574, 0.5953451683019283, 0.27427417111082464], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.6379999999999955, 5, 15, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.3288722903389818, 0.5568058383628869, 0.23573462998907488], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.738281249999999, 1948.3258928571427], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 1.1713817866161615, 4829.402422664141], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.341999999999999, 1, 26, 2.0, 3.0, 4.0, 7.980000000000018, 0.3267591569352344, 0.27465319723215387, 0.13817062007124656], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.3800000000002, 422, 699, 543.5, 647.0, 657.95, 680.99, 0.32664900584375073, 0.28763933111266454, 0.15120276247064243], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.369999999999999, 2, 23, 3.0, 4.0, 5.0, 8.990000000000009, 0.3267516830979197, 0.2960261757097373, 0.15954672026265607], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 768.3119999999999, 619, 966, 748.0, 889.8000000000001, 903.95, 931.99, 0.32661187861273566, 0.3089767509091242, 0.17255568977489258], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.286917892156863, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.320000000000007, 17, 659, 22.0, 27.0, 33.0, 78.88000000000011, 0.3264521571305639, 0.16982844592287372, 14.891191659735], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.034000000000017, 21, 244, 29.0, 35.0, 41.0, 119.96000000000004, 0.32671047636347716, 73.89230944264337, 0.10082081106529178], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 1.263648343373494, 0.9883283132530121], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.723999999999999, 1, 14, 3.0, 4.0, 4.0, 7.990000000000009, 0.3288807268000958, 0.35737194679466266, 0.14099476471215044], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4300000000000006, 2, 27, 3.0, 4.0, 5.0, 8.0, 0.3288787798860369, 0.33745724884185335, 0.12108134767288664], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8300000000000003, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.3289361153434225, 0.18653954252058483, 0.12752699003060422], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.83999999999996, 65, 119, 92.0, 110.0, 113.0, 116.0, 0.32891815529541785, 0.29959497326717693, 0.10728385143424762], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.71399999999994, 58, 410, 80.0, 95.0, 103.94999999999999, 375.1200000000008, 0.32665519453623454, 0.16993407097792726, 96.58977182971334], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.49800000000013, 12, 384, 261.0, 334.0, 338.0, 350.99, 0.3288744534928769, 0.18329290952433572, 0.13778041069184002], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 427.5420000000001, 339, 555, 418.0, 496.90000000000003, 507.0, 527.95, 0.3288320608628685, 0.1768467814822171, 0.14001052591426824], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.565999999999993, 4, 304, 6.0, 8.0, 11.0, 39.90000000000009, 0.32639120989304815, 0.14716609914035084, 0.2368248720220066], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 398.2819999999997, 281, 531, 392.0, 459.90000000000003, 468.95, 492.94000000000005, 0.32881216605014385, 0.16912954685573367, 0.13229551993423758], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.568000000000002, 2, 17, 3.0, 4.900000000000034, 5.0, 10.990000000000009, 0.32675574028146737, 0.2006197280003529, 0.1633778701407337], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.203999999999998, 2, 41, 4.0, 5.0, 6.0, 9.0, 0.3267474124872405, 0.19136102611594044, 0.15412011741341522], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.0100000000001, 539, 860, 678.0, 815.9000000000001, 836.95, 852.99, 0.3265990780761224, 0.2984394759244223, 0.14384392989485467], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.9420000000001, 173, 322, 237.0, 285.0, 292.0, 305.98, 0.3267051394638899, 0.28928400097978874, 0.1343192028459938], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.508000000000004, 3, 37, 4.0, 5.0, 6.0, 11.0, 0.3267525372334516, 0.2178488522408689, 0.1528461575535384], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1000.8100000000002, 810, 10395, 933.0, 1091.9, 1117.0, 1139.99, 0.32657902591927096, 0.24547963089875202, 0.18051145377959704], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.6400000000001, 118, 173, 137.0, 152.0, 154.0, 165.0, 0.3289058224224308, 6.359288081497271, 0.16573769958005305], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.3679999999999, 161, 223, 181.0, 204.0, 206.0, 213.99, 0.32888267373720564, 0.6374382142509467, 0.2350997238043306], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.134, 5, 18, 7.0, 9.0, 10.0, 16.0, 0.32883508854542426, 0.2683698943831021, 0.20295290621162906], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.011999999999997, 5, 29, 7.0, 9.0, 10.0, 14.0, 0.3288374674779745, 0.2735099213141266, 0.20809245988840572], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.406000000000008, 6, 17, 8.0, 10.0, 11.0, 15.0, 0.3288311958209501, 0.2661188479382613, 0.20070263416806036], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.693999999999999, 7, 22, 9.0, 12.0, 13.0, 16.0, 0.3288324933855344, 0.2940578149590505, 0.22864134305712938], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.900000000000009, 5, 41, 8.0, 9.0, 10.0, 18.950000000000045, 0.32881021994773235, 0.2468356486093958, 0.18142360768600466], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1631.1099999999994, 1429, 1990, 1610.5, 1840.8000000000002, 1910.9, 1966.99, 0.3285051831547798, 0.2745167678490006, 0.20916540958683247], "isController": false}]}, function(index, item){
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
