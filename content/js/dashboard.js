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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8912146351840035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.165, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.644, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.984, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.098, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.3942990853004, 1, 17906, 9.0, 838.0, 1507.0, 6087.980000000003, 15.148800470221861, 95.4262096563694, 125.35761665277248], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6301.076000000002, 5177, 17906, 6128.0, 6800.8, 7026.349999999999, 14587.900000000065, 0.32658243887846367, 0.18966976779825304, 0.16456693209110082], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3980000000000032, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.3276763291862617, 0.1682253154458102, 0.11839867363175473], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6579999999999995, 2, 21, 3.0, 5.0, 5.0, 8.0, 0.32767396702420265, 0.18806373746073649, 0.1382374548383355], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.796000000000012, 8, 372, 12.0, 16.0, 21.94999999999999, 40.0, 0.3258770491963546, 0.16952926062245124, 3.5856022590774685], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.712, 24, 48, 33.0, 40.0, 41.0, 44.0, 0.32765550038565056, 1.3626853086400135, 0.13630980777762414], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.282, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3276638745335705, 0.20469712615026403, 0.13855318132132424], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.707999999999995, 22, 54, 30.0, 35.0, 36.0, 40.99000000000001, 0.32765550038565056, 1.3447666484626732, 0.11903109974947461], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.4059999999996, 688, 1100, 852.0, 1014.8000000000001, 1054.9, 1085.99, 0.32748017107564137, 1.3849820817177645, 0.1592628175738959], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.658000000000003, 4, 17, 5.0, 8.0, 8.949999999999989, 13.0, 0.3276993083578398, 0.48729591194293576, 0.1673698615929201], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8999999999999995, 2, 29, 4.0, 5.0, 5.0, 8.990000000000009, 0.3260440746380096, 0.3144892509381918, 0.17830535331766148], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.767999999999999, 5, 19, 7.0, 10.0, 11.0, 15.0, 0.32765700340632226, 0.5339497247599256, 0.21406497585823198], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.9765625, 2669.9549414503385], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.154000000000001, 2, 19, 4.0, 5.0, 6.0, 9.990000000000009, 0.3260496025781394, 0.3275493033868728, 0.19136309682564628], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.17, 6, 24, 8.0, 10.0, 11.0, 16.0, 0.3276561445356785, 0.5147497229257728, 0.1948658125217072], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.595999999999997, 4, 14, 6.0, 8.0, 9.0, 11.990000000000009, 0.3276550709537056, 0.5070686205967254, 0.18718575830851347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1575.0780000000002, 1341, 1913, 1562.0, 1740.0, 1811.8, 1891.97, 0.327331599348741, 0.4998551711109569, 0.18028810745379878], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.040000000000001, 8, 87, 11.0, 15.0, 19.0, 36.99000000000001, 0.3258630319469599, 0.16952196850436038, 2.6272706950723643], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.014000000000003, 8, 27, 11.0, 13.0, 15.0, 18.99000000000001, 0.32765936532380935, 0.5931498457953113, 0.27326279100247386], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.845999999999997, 5, 21, 8.0, 10.0, 11.0, 15.0, 0.32765872116111766, 0.5547511733049231, 0.2348647473947855], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.626116071428571, 2783.3227040816328], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.7997710129310346, 3297.3161368534484], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.380000000000001, 1, 17, 2.0, 3.0, 4.0, 8.0, 0.32604832688301055, 0.2740557181948008, 0.13787004447299178], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.6320000000001, 442, 719, 550.0, 643.0, 657.0, 689.95, 0.32594779098663096, 0.2870218580181201, 0.15087817668717096], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.285999999999999, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.3260481142681263, 0.2953887657106284, 0.15920318079498355], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.9079999999999, 611, 981, 745.5, 874.9000000000001, 891.95, 928.9100000000001, 0.3259082737681645, 0.30831113660347526, 0.17218396104353223], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.867350260416666, 1371.8058268229167], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.804, 17, 653, 23.0, 27.0, 33.94999999999999, 60.950000000000045, 0.32572610864138335, 0.1694507376312025, 14.858072787733416], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.343999999999998, 22, 227, 30.0, 38.0, 45.94999999999999, 101.98000000000002, 0.3259962445232631, 73.73077118792216, 0.10060040358335072], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 1.13264376349892, 0.8858666306695464], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.760000000000002, 1, 19, 3.0, 4.0, 4.0, 7.0, 0.32763317141702003, 0.35601631461663313, 0.14045992407428887], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.387999999999999, 2, 17, 3.0, 4.0, 5.0, 8.0, 0.327631668614983, 0.3361776079398914, 0.12062220612094589], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.844000000000001, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.3276778323980316, 0.18582597075377044, 0.12703915963087747], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.16400000000007, 65, 124, 90.0, 112.0, 115.0, 118.0, 0.3276615125510743, 0.29845036071436765, 0.10687396991411992], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.77600000000007, 59, 369, 81.0, 96.0, 107.0, 310.8000000000002, 0.32594014174484887, 0.16956208291884614, 96.37833546769804], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 205.864, 12, 361, 261.5, 335.0, 338.95, 348.0, 0.32762737497084116, 0.18259787028282104, 0.13725795299071372], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 419.8720000000001, 305, 528, 415.0, 487.0, 496.0, 512.97, 0.32758251312131753, 0.17617477129007889, 0.139478491914936], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.466000000000004, 4, 278, 6.0, 9.0, 11.0, 33.97000000000003, 0.32567222002936264, 0.14684191475562208, 0.23630318308771134], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.89599999999984, 291, 486, 398.0, 450.0, 462.0, 477.97, 0.3275653443727222, 0.16848822513140282, 0.13179386902496246], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5440000000000014, 2, 24, 3.0, 5.0, 6.0, 9.990000000000009, 0.3260436494196097, 0.2001825222916043, 0.16302182470980484], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.383999999999999, 2, 57, 4.0, 5.0, 6.0, 13.0, 0.3260321689420452, 0.1909421406603847, 0.1537827515615311], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.752, 535, 910, 674.0, 826.0, 836.95, 853.99, 0.3258817218808068, 0.29778397068465795, 0.14352798492992566], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.6400000000002, 166, 321, 234.0, 285.0, 291.0, 302.0, 0.3259847673837897, 0.28864614104937103, 0.1340230342466557], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.5000000000000036, 3, 56, 4.0, 5.0, 6.0, 9.0, 0.3260527918596356, 0.2173823257133709, 0.15251883525465376], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.2060000000002, 806, 8368, 944.0, 1080.9, 1109.0, 1137.0, 0.3258768368047907, 0.24495181646192912, 0.18012332971827297], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.96600000000004, 117, 177, 140.0, 151.0, 152.0, 162.95000000000005, 0.3276565739704375, 6.335134265267813, 0.16510819547729078], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.90000000000006, 159, 228, 186.0, 203.0, 204.0, 212.96000000000004, 0.32763918276303367, 0.6350280883023638, 0.23421082205326235], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.200000000000003, 5, 19, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.32769501294067604, 0.2674394524068871, 0.2022492657993235], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.986000000000001, 5, 20, 7.0, 9.0, 10.0, 14.990000000000009, 0.32769716063518195, 0.27256147332479574, 0.20737085946445108], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.423999999999992, 6, 20, 8.0, 10.0, 11.0, 14.0, 0.3276834158767858, 0.26518996442504994, 0.2000020848857335], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.969999999999999, 7, 50, 10.0, 12.0, 13.0, 18.0, 0.3276855634192809, 0.2930321750768259, 0.22784386831496872], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.713999999999995, 5, 28, 7.0, 9.0, 10.0, 15.990000000000009, 0.32766280090094163, 0.24597428875054964, 0.18079051026272658], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1637.81, 1410, 1981, 1621.0, 1836.0, 1864.9, 1962.8600000000001, 0.32735410155047995, 0.2735548615603137, 0.20843249434659467], "isController": false}]}, function(index, item){
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
