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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8748989576685812, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.458, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.728, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.798, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.823, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.837, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.481, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 488.2734311848555, 1, 21338, 14.0, 984.0, 1859.9500000000007, 10657.980000000003, 10.163010274563419, 68.50384111821866, 84.20175314359355], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11213.079999999994, 9088, 21338, 10787.0, 13041.300000000001, 13567.7, 17186.500000000007, 0.21866402403904817, 0.12705575615550163, 0.11061324653537788], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.1800000000000015, 5, 49, 7.0, 8.0, 10.0, 15.990000000000009, 0.2194931902237733, 2.3436278211734107, 0.07973776051098015], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.205999999999989, 6, 55, 9.0, 11.0, 12.0, 25.970000000000027, 0.21948846895379504, 2.3568045911171263, 0.09302538625580767], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.66600000000001, 13, 277, 19.0, 26.0, 32.0, 86.93000000000006, 0.21850673372201312, 0.12839617846471924, 2.4330212674789], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.68799999999997, 26, 97, 44.0, 55.0, 56.94999999999999, 72.99000000000001, 0.21943346667573657, 0.9126010731119397, 0.09171633177462428], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.892000000000003, 1, 33, 3.0, 4.0, 4.949999999999989, 8.990000000000009, 0.21943857080536588, 0.13708696106435608, 0.09321853349642008], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.37400000000001, 23, 86, 38.0, 48.900000000000034, 50.0, 69.0, 0.21942903686890564, 0.9005826245501156, 0.0801430271376667], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1117.3959999999988, 781, 1800, 1089.0, 1471.6000000000001, 1534.6499999999999, 1645.98, 0.21936059020282958, 0.9277839025082568, 0.10710966318497539], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.3940000000000055, 4, 23, 6.0, 8.0, 9.949999999999989, 14.980000000000018, 0.219329221056658, 0.3261472638624841, 0.11244906353002486], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.563999999999999, 3, 17, 4.0, 5.0, 7.0, 12.980000000000018, 0.2186599121162081, 0.21091072441044914, 0.12000670957940329], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.239999999999998, 6, 33, 9.0, 11.0, 13.0, 21.99000000000001, 0.21942566648351935, 0.35763812242284554, 0.14378381075238428], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.6918504008746356, 1724.1865775327988], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.962, 3, 25, 5.0, 6.0, 7.0, 14.990000000000009, 0.218661059614002, 0.21966681507375002, 0.12876232319066722], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.76200000000001, 7, 30, 16.0, 18.0, 19.0, 23.980000000000018, 0.21942422206433432, 0.3447167385518704, 0.1309259762512776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.104000000000002, 5, 23, 7.0, 9.0, 10.0, 16.99000000000001, 0.2194241257703981, 0.33957383432578864, 0.12578316584689814], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2264.7980000000002, 1586, 3717, 2223.0, 2966.0, 3259.35, 3522.4700000000003, 0.21916443995595672, 0.3346773695346964, 0.12113971974128077], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.237999999999996, 12, 93, 18.0, 23.0, 29.0, 50.98000000000002, 0.21850176833481114, 0.12839326076634688, 1.7620972684656935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.095999999999995, 9, 45, 14.0, 17.0, 19.0, 27.99000000000001, 0.2194294220623996, 0.3972251113000886, 0.18342928250528714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.395999999999995, 6, 39, 9.0, 11.0, 13.0, 18.0, 0.21942662944020755, 0.3714438554728951, 0.15771288991014917], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 4.466711956521739, 1185.954483695652], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.7978854495268138, 3016.4752563091483], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5599999999999983, 1, 15, 2.0, 3.0, 4.0, 10.980000000000018, 0.2186531230006905, 0.18384798721054155, 0.0928848715872074], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 524.8399999999999, 386, 1118, 519.0, 622.0, 655.95, 771.9300000000001, 0.21861354415840564, 0.1924439657961621, 0.10162113966738386], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.581999999999998, 2, 25, 3.0, 4.0, 6.0, 11.0, 0.21865981649193558, 0.1980985335524742, 0.10719455847553874], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 792.4539999999998, 595, 1288, 776.5, 952.8000000000001, 990.8499999999999, 1086.95, 0.21859901639186585, 0.20679595036031675, 0.11591725185623354], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 7.161458333333334, 914.5643446180557], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.346000000000004, 24, 675, 33.0, 43.0, 51.94999999999999, 106.96000000000004, 0.2184385748543124, 0.12835612780819172, 9.991858248218742], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.836, 29, 256, 39.5, 61.900000000000034, 73.94999999999999, 124.87000000000012, 0.21856127234133324, 49.459395693654464, 0.06787352012162498], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.4596091695880806, 0.36118262489044695], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2040000000000015, 2, 16, 3.0, 4.0, 4.0, 7.0, 0.2194571595484274, 0.2384067709227164, 0.0945123118758364], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.087999999999998, 2, 24, 4.0, 5.0, 6.0, 11.980000000000018, 0.21945610000175564, 0.22524254013852069, 0.08122447451236854], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.4999999999999987, 1, 41, 2.0, 3.0, 4.949999999999989, 8.0, 0.21949463555110715, 0.12447532208094084, 0.08552574178212084], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 198.5840000000002, 87, 365, 205.5, 291.90000000000003, 307.95, 327.99, 0.21947488439160465, 0.1999086127157164, 0.07201519644099527], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 135.77000000000007, 88, 484, 125.5, 184.80000000000007, 216.84999999999997, 415.84000000000015, 0.21852373233290256, 0.12846805357852278, 64.64375878738558], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.42799999999994, 17, 504, 339.0, 443.0, 468.95, 493.99, 0.21945369197918702, 0.12230900053656427, 0.09236771605764608], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 521.9460000000006, 296, 1282, 478.0, 853.4000000000002, 914.95, 999.94, 0.21947160893319678, 0.11803243140195391, 0.09387555147728534], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.151999999999996, 9, 314, 13.0, 18.0, 25.0, 67.8900000000001, 0.2184114758631294, 0.10274510941213677, 0.15890288038870254], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 525.1760000000004, 273, 1149, 467.5, 884.9000000000001, 931.8499999999999, 999.98, 0.21941854086670323, 0.11286126919912233, 0.0887102303894679], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.314000000000004, 3, 33, 4.0, 5.0, 6.0, 12.990000000000009, 0.2186520712036097, 0.13424682000627094, 0.1097530904283744], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.675999999999998, 3, 40, 4.0, 5.0, 6.0, 14.990000000000009, 0.21864853341496213, 0.12805245309988958, 0.10355911983032873], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 877.8880000000001, 583, 1522, 868.0, 1153.7, 1259.75, 1420.7900000000002, 0.21855534914217026, 0.19971135326740247, 0.09668513004043273], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 475.04000000000013, 249, 1222, 391.0, 825.9000000000001, 880.95, 996.6200000000003, 0.21856031696491407, 0.1935261962844309, 0.09028419343374869], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.885999999999994, 3, 38, 5.0, 6.0, 7.0, 13.0, 0.21866192024525122, 0.14584579250733062, 0.102711312146451], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1199.2380000000005, 902, 9115, 1128.5, 1420.9, 1469.0, 1725.9, 0.21853099097248477, 0.1642012842520012, 0.12121640905505014], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.178, 143, 330, 180.0, 188.0, 195.95, 263.99, 0.21955342832678332, 4.245056960392562, 0.11106316003249392], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.8900000000002, 193, 389, 232.0, 257.0, 266.9, 361.8800000000001, 0.21953337741563553, 0.42549813426815036, 0.1573608388897231], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.286000000000007, 5, 23, 8.0, 10.0, 12.0, 19.970000000000027, 0.21932700823485185, 0.17905994031673453, 0.1357942609579063], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.264000000000005, 5, 28, 8.0, 10.0, 11.949999999999989, 17.0, 0.21932825895473415, 0.18236373656175756, 0.13922203937556366], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.719999999999997, 6, 25, 9.0, 11.0, 13.0, 19.980000000000018, 0.21932479545769576, 0.1774967297302217, 0.1342936003437258], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.51999999999999, 7, 34, 11.0, 14.0, 16.0, 26.0, 0.21932585373685198, 0.19613171633337176, 0.15292837848448465], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.252000000000002, 5, 34, 8.0, 10.0, 12.0, 30.0, 0.21940429102136208, 0.16470534428811645, 0.12148655567296122], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2048.7839999999987, 1589, 3289, 1981.0, 2545.9, 2617.9, 2928.930000000001, 0.2191551219401014, 0.18313791933141033, 0.1399682126453382], "isController": false}]}, function(index, item){
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
