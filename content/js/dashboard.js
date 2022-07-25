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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8800042544139545, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.378, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.842, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.317, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.947, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.546, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.962, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.871, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 287.10274409700213, 1, 7608, 25.0, 793.0, 1845.8500000000022, 3815.7600000000384, 17.04078333229419, 114.78741225750143, 141.15164105217502], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 34.36200000000001, 13, 86, 30.0, 55.0, 60.0, 73.95000000000005, 0.36998175249996673, 0.21487485159106953, 0.18643611747068636], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.131999999999994, 5, 111, 13.0, 24.0, 30.0, 51.99000000000001, 0.36986023721356176, 3.960355062591448, 0.1336409060244315], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.717999999999991, 5, 179, 14.0, 26.0, 32.0, 38.99000000000001, 0.3698131851713788, 3.971053260078888, 0.15601493749417544], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 69.71400000000011, 14, 257, 63.0, 126.0, 148.0, 176.0, 0.36630197641894396, 0.1977136380727681, 4.0779712218515245], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 66.27999999999997, 27, 168, 56.0, 110.0, 119.0, 149.98000000000002, 0.3695333089934061, 1.536850779632137, 0.15373163049920993], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.012000000000002, 1, 27, 6.0, 13.0, 16.0, 21.0, 0.3695554322061646, 0.23086748587559136, 0.15626709193873953], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 59.17399999999996, 24, 144, 51.0, 100.0, 113.94999999999999, 129.97000000000003, 0.36952893928935154, 1.5166239926179204, 0.13424293497620973], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1162.5059999999999, 572, 2505, 905.0, 2226.0000000000005, 2329.95, 2469.8100000000004, 0.3694055378322988, 1.5622932194782368, 0.1796523025785984], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.334000000000003, 6, 64, 16.0, 32.0, 35.94999999999999, 51.98000000000002, 0.3689674740412934, 0.5486625609349783, 0.18844725480819963], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.138000000000007, 2, 88, 8.0, 24.0, 28.0, 36.0, 0.3667972220245593, 0.35379812906823965, 0.20059223079468083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.80600000000003, 9, 99, 22.5, 45.0, 51.0, 63.99000000000001, 0.36949835425433014, 0.6021343737575618, 0.24140078026967468], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1300.0, 1300, 1300, 1300.0, 1300.0, 1300.0, 1300.0, 0.7692307692307693, 0.32827524038461536, 909.8384915865385], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 11.186, 3, 144, 9.0, 20.0, 24.0, 42.930000000000064, 0.36681794238610665, 0.36850516163282404, 0.2152906087637208], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 27.856, 10, 80, 24.0, 48.0, 52.0, 67.96000000000004, 0.36949207402552003, 0.5804742132867132, 0.2197467510561931], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 18.271999999999995, 6, 52, 16.0, 32.0, 36.0, 45.98000000000002, 0.36949070878663687, 0.5718121300012415, 0.2110860006251783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2917.1419999999966, 1570, 6132, 2645.0, 4474.8, 4942.85, 5939.98, 0.36853886868886404, 0.5627811663647104, 0.20298429877003837], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 70.35, 13, 203, 64.0, 128.0, 148.95, 184.95000000000005, 0.36626226429191977, 0.19769220321951855, 2.9529895058536035], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 32.25599999999998, 12, 90, 29.0, 52.0, 57.0, 72.0, 0.36951856165638913, 0.6689260282500635, 0.3081727066939026], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 26.78200000000001, 9, 76, 22.0, 47.0, 52.0, 63.0, 0.3695144653827764, 0.6256161365027082, 0.26486681405366974], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 4.234730113636363, 1239.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.5696614583333333, 2378.6608947450245], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.113999999999997, 1, 85, 7.0, 20.0, 24.0, 32.0, 0.3665737524395483, 0.3081188422482848, 0.1550062839905512], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 578.2599999999993, 315, 1348, 466.0, 1175.4, 1218.95, 1315.8500000000001, 0.3665111437713264, 0.3227409799316823, 0.16965457240977413], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.481999999999987, 2, 105, 8.0, 20.0, 25.0, 36.99000000000001, 0.3667773111555319, 0.3322880657540025, 0.17909048396266208], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1688.7720000000002, 929, 3708, 1325.5, 3137.3000000000047, 3405.8, 3569.92, 0.3665307570619481, 0.34674024382175755, 0.19364564411183], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.1965144230769225, 1013.0258413461538], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 100.32999999999993, 28, 880, 96.0, 161.90000000000003, 178.95, 198.99, 0.36604587726188903, 0.19757540705216664, 16.743024217961285], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 119.92400000000009, 29, 295, 107.5, 216.0, 235.95, 279.98, 0.3663661243226806, 82.90704750463452, 0.11305829617770222], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.9232641945422536, 0.722106073943662], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.061999999999998, 1, 41, 6.0, 20.0, 22.0, 24.99000000000001, 0.36987501183600036, 0.4019176019726914, 0.15856946308203532], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 10.593999999999996, 2, 40, 9.0, 20.0, 24.0, 32.0, 0.3698725493169564, 0.37952029911408125, 0.13617378036376226], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.706000000000001, 1, 28, 6.0, 13.0, 16.0, 20.0, 0.36986543555723556, 0.20975054402582252, 0.14339509562131106], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 198.022, 87, 462, 141.5, 379.0, 399.0, 436.96000000000004, 0.36984053955296636, 0.33686911098285865, 0.1206315822370027], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 314.8480000000002, 116, 1256, 274.5, 507.60000000000014, 535.95, 713.7400000000002, 0.36627353307450006, 0.19769828561094427, 108.35043563658341], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.002000000000002, 1, 32, 6.0, 12.0, 16.0, 20.0, 0.369871181264989, 0.2061417791599042, 0.154955797619805], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.24999999999999, 2, 47, 8.0, 20.0, 24.0, 31.99000000000001, 0.36989416588125806, 0.19893009384030041, 0.1574940003166294], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 65.16199999999999, 7, 384, 61.5, 127.0, 139.0, 166.97000000000003, 0.36595157289645547, 0.1546395557695559, 0.26552931509967426], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.254000000000001, 2, 70, 10.0, 21.0, 24.0, 28.0, 0.36987555906690756, 0.19025112862903404, 0.14881711946832607], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.816000000000004, 2, 41, 9.0, 21.0, 24.0, 32.0, 0.3665713336818205, 0.22506549140536852, 0.18328566684091024], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.310000000000002, 2, 56, 9.0, 21.0, 25.94999999999999, 36.960000000000036, 0.3665570905337364, 0.21467573512108112, 0.172897533913862], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 788.8399999999998, 382, 1777, 627.0, 1549.8000000000002, 1623.95, 1729.98, 0.36619734814528365, 0.3346235553056869, 0.16128418360695598], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 31.743999999999968, 6, 200, 28.0, 56.0, 67.0, 93.93000000000006, 0.3664235812628569, 0.32445305211605957, 0.15064875753092066], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 15.570000000000006, 5, 83, 13.0, 28.0, 31.94999999999999, 40.0, 0.3668523918042241, 0.24458378555533383, 0.17160380436935874], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 838.874, 482, 7608, 784.5, 1014.9000000000001, 1086.95, 1474.4400000000014, 0.3666863943946851, 0.27562713342727835, 0.20268017502674976], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 248.5320000000001, 143, 577, 192.5, 488.90000000000003, 516.0, 548.0, 0.3699324799237643, 7.152525282804133, 0.18641128871158436], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 382.4680000000002, 203, 903, 302.0, 689.7, 719.9, 804.9200000000001, 0.3698342476868717, 0.7168102829361436, 0.26437370049491216], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 27.102000000000018, 9, 67, 22.5, 48.0, 52.0, 61.99000000000001, 0.36896883541628545, 0.30112397016185927, 0.22772295310848867], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 26.662000000000024, 9, 76, 21.0, 48.0, 51.0, 60.0, 0.3689674740412934, 0.306887975894248, 0.23348722966675595], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 27.695999999999987, 9, 86, 23.0, 49.0, 53.0, 64.0, 0.368974553300957, 0.2986063496738634, 0.22520419512997866], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 30.95199999999998, 11, 103, 27.0, 52.0, 57.94999999999999, 74.98000000000002, 0.36897183047663046, 0.32995233875562036, 0.2565507258782821], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 29.230000000000025, 8, 85, 24.0, 52.0, 56.0, 69.97000000000003, 0.36873183534796117, 0.27680454018587036, 0.20345067087070123], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3291.4080000000013, 1702, 6960, 2902.5, 5140.900000000001, 5727.6, 6695.620000000001, 0.3682733943832415, 0.30774924444109725, 0.23448657532995457], "isController": false}]}, function(index, item){
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
