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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8910657306955967, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.177, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.674, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.985, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.047, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 330.7230801957025, 1, 18030, 9.0, 838.9000000000015, 1522.0, 6325.970000000005, 14.991122041318224, 94.43295247772856, 124.0528141977023], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6476.433999999995, 5381, 18030, 6312.5, 6875.900000000001, 7114.349999999999, 15601.620000000072, 0.3232465330193101, 0.18773236880069719, 0.16288594827926173], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.375999999999997, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.3243692801532061, 0.16652751393490428, 0.11720374380535767], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5920000000000027, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.3243667550025463, 0.18616561092045555, 0.13684222476669922], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.251999999999994, 8, 354, 11.5, 15.900000000000034, 18.0, 48.88000000000011, 0.3224776603600786, 0.1677608148929858, 3.5481990227314504], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.15800000000002, 24, 55, 34.0, 41.0, 43.0, 44.99000000000001, 0.3243034286655692, 1.3487443893479945, 0.1349152935659497], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3400000000000007, 1, 36, 2.0, 3.0, 4.0, 5.990000000000009, 0.3243118427009728, 0.20260305556078056, 0.13713576942336056], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.339999999999993, 22, 62, 30.0, 36.0, 37.0, 40.99000000000001, 0.32430237694184155, 1.331004729098874, 0.11781297287340338], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 858.7040000000003, 655, 1143, 860.0, 1016.0, 1063.95, 1086.0, 0.3241587755615402, 1.3709352059688653, 0.1576475295211397], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.789999999999998, 4, 25, 5.0, 7.900000000000034, 9.0, 14.0, 0.3242523227815143, 0.48217017033460896, 0.16560934063938668], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8480000000000016, 2, 16, 4.0, 5.0, 6.0, 8.0, 0.3226424676212152, 0.3112081950138188, 0.17644509948035206], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.658000000000001, 5, 24, 7.0, 10.0, 10.0, 14.0, 0.3243021665979146, 0.5284826840074278, 0.21187319282617664], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.0275942695961995, 2809.4775274643707], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.983999999999996, 2, 18, 4.0, 5.0, 6.0, 10.0, 0.3226451741961296, 0.32412921596416056, 0.18936498993347056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.028000000000004, 5, 26, 8.0, 10.0, 11.0, 13.990000000000009, 0.3243009045400829, 0.5094786212330829, 0.19287036217276418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.500000000000003, 4, 15, 6.0, 8.0, 8.0, 12.0, 0.3242994321516943, 0.5018755401612417, 0.1852687185632238], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1580.6960000000001, 1335, 1987, 1550.5, 1778.9, 1842.85, 1952.93, 0.3239550505888207, 0.49469897671508284, 0.1784283677071239], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.902000000000013, 7, 71, 11.0, 14.0, 20.0, 34.99000000000001, 0.3224670535411397, 0.16775529696474661, 2.5998906191754387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.099999999999987, 8, 44, 11.0, 13.0, 14.949999999999989, 20.99000000000001, 0.32430616317918626, 0.5870796657684467, 0.2704662728076417], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.863999999999996, 5, 43, 8.0, 10.0, 11.0, 15.990000000000009, 0.32430595283034774, 0.5490746811342796, 0.23246149353269072], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.823206018518518, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.982769465042373, 4051.7867783368647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3219999999999996, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.32266370504407266, 0.2712108179379724, 0.13643885183992524], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 544.5680000000006, 389, 671, 534.5, 632.9000000000001, 643.9, 662.98, 0.3225571297060279, 0.28403612248752186, 0.1493086713678293], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2880000000000007, 2, 21, 3.0, 4.0, 5.0, 8.990000000000009, 0.32265308598317555, 0.29231298281001156, 0.15754545214022245], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 740.754, 602, 915, 721.5, 853.9000000000001, 876.0, 897.98, 0.32250407645152634, 0.30509074599546687, 0.17038545445339429], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.156000000000013, 16, 628, 21.0, 26.0, 31.94999999999999, 50.99000000000001, 0.3223383714820796, 0.1676883533908385, 14.703540363210877], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.286000000000016, 20, 259, 29.0, 34.0, 38.0, 105.94000000000005, 0.3225960465209307, 72.96174631381595, 0.09955112373106846], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.677999999999998, 1, 12, 3.0, 4.0, 4.0, 6.990000000000009, 0.3243227815997416, 0.3524191428846176, 0.13904072375223298], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3980000000000006, 2, 15, 3.0, 4.0, 4.0, 7.990000000000009, 0.3243202571729911, 0.33277982169358744, 0.11940306343185318], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.833999999999999, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.3243718053431821, 0.18395112410238212, 0.12575742843871415], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.55800000000002, 65, 119, 91.0, 111.0, 114.0, 117.0, 0.3243556027240681, 0.2954391740398101, 0.1057956751072644], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.80800000000006, 58, 365, 79.0, 92.0, 101.94999999999999, 326.7000000000003, 0.32253861109713444, 0.1677925229663618, 95.37252544345834], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.16400000000002, 12, 358, 259.0, 329.0, 332.0, 340.0, 0.3243171016948163, 0.18075294248852403, 0.1358711295186291], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 410.53200000000004, 299, 536, 399.0, 484.90000000000003, 496.95, 527.9100000000001, 0.3242718799208258, 0.17439430370234177, 0.1380688863725391], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.242000000000004, 4, 304, 6.0, 8.0, 11.0, 24.980000000000018, 0.32227895047926103, 0.1453119279548629, 0.23384107442001068], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 386.5900000000002, 291, 490, 386.0, 452.0, 459.0, 472.99, 0.3242537947421599, 0.1667848791295342, 0.1304614877282909], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.396000000000002, 2, 16, 3.0, 4.900000000000034, 6.0, 9.0, 0.32266162282017874, 0.19810604383132283, 0.16133081141008937], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2540000000000004, 2, 42, 4.0, 5.0, 6.0, 11.0, 0.32265308598317555, 0.1889631662060256, 0.1521889067674549], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.1839999999994, 530, 854, 685.0, 799.7, 832.9, 847.0, 0.32250553258241144, 0.29469887880145335, 0.14204101093229254], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.22399999999988, 177, 328, 235.0, 280.0, 287.0, 300.99, 0.322591467584719, 0.285641513255606, 0.13262793735660808], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.325999999999996, 3, 31, 4.0, 5.0, 6.0, 8.990000000000009, 0.322647880816454, 0.21511224092988412, 0.150926108311603], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1004.5660000000001, 825, 8712, 941.0, 1115.9, 1153.0, 1183.99, 0.3224198512612742, 0.24235330440851113, 0.17821253497449338], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.16000000000005, 117, 169, 136.0, 148.0, 150.0, 159.97000000000003, 0.3243457136092218, 6.2711198471601906, 0.16343983224839692], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.58599999999998, 160, 250, 174.5, 202.0, 203.0, 206.99, 0.32431752242169193, 0.6285900682866759, 0.2318363539186313], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.140000000000001, 5, 17, 7.0, 9.0, 10.0, 13.990000000000009, 0.32424769670648645, 0.2646260181782986, 0.2001216253110346], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.007999999999996, 5, 22, 7.0, 9.0, 10.0, 15.990000000000009, 0.3242495891757705, 0.26969396249696825, 0.2051891931502923], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.498000000000006, 5, 35, 8.0, 10.0, 12.0, 16.0, 0.3242420194311757, 0.2624048866433688, 0.19790162318797347], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.924, 7, 25, 10.0, 12.0, 13.0, 18.0, 0.3242439118341895, 0.28995448486883363, 0.22545084494720985], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.782000000000001, 5, 29, 8.0, 9.0, 10.0, 15.980000000000018, 0.3242397065241568, 0.2434045945333834, 0.17890179119741076], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1655.5540000000003, 1423, 2056, 1626.0, 1871.9, 1940.55, 2041.94, 0.32386964635377835, 0.27064306160292156, 0.20621387638931982], "isController": false}]}, function(index, item){
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
