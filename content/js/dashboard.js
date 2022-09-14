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

    var data = {"OkPercent": 97.77494150180813, "KoPercent": 2.225058498191874};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9012975962561157, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.967, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.693, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 523, 2.225058498191874, 183.79344820251094, 1, 3520, 16.0, 534.0, 1198.9500000000007, 2163.0, 26.73678175824626, 176.21329753215124, 221.51742806918463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.62399999999999, 15, 63, 26.0, 29.0, 31.0, 41.0, 0.5794535058096009, 0.3364644314778846, 0.2931219882904036], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.175999999999999, 4, 32, 7.0, 9.0, 11.0, 16.980000000000018, 0.5792145387482942, 6.201577664560642, 0.21041778165465375], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.619999999999994, 5, 32, 7.0, 9.0, 11.0, 16.0, 0.5791964228828923, 6.219344445578704, 0.24547973391716332], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 21.57199999999999, 8, 267, 20.0, 27.0, 31.0, 51.97000000000003, 0.575544868326845, 0.3105502967941, 6.408557215490905], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.62200000000001, 26, 84, 44.0, 53.0, 54.0, 60.98000000000002, 0.5790227023221127, 2.4082266658917413, 0.24201339511119552], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4260000000000024, 1, 17, 2.0, 3.0, 4.0, 8.0, 0.5790542191627571, 0.36187608898384094, 0.24598494661699155], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.79000000000001, 24, 76, 39.0, 46.0, 48.0, 60.92000000000007, 0.5790139855038058, 2.376459992811541, 0.21147581111174157], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 766.9600000000004, 575, 991, 771.5, 912.9000000000001, 928.95, 965.95, 0.5786742341825185, 2.4471048349389615, 0.28255577840943286], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.745999999999995, 7, 29, 11.0, 13.0, 15.0, 22.970000000000027, 0.578861148576291, 0.8608445385174208, 0.29677939746343046], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2140000000000004, 2, 19, 3.0, 5.0, 6.0, 8.0, 0.5764067494924738, 0.5560771536285382, 0.31634823556129915], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.399999999999995, 11, 40, 18.0, 21.0, 23.0, 29.99000000000001, 0.578997893605663, 0.9432723828281963, 0.37940194004824207], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.6545365222392637, 1814.0981475268404], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.1220000000000026, 2, 30, 4.0, 5.0, 7.0, 10.0, 0.5764180460350509, 0.5791999385970676, 0.3394336735929059], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.52999999999998, 12, 40, 19.0, 23.0, 25.0, 31.99000000000001, 0.5789864957189739, 0.9097223539014426, 0.3454694813323174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.411999999999992, 6, 27, 11.0, 13.0, 15.0, 20.99000000000001, 0.5789838139284977, 0.8961482070463488, 0.33189794802346506], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1915.1859999999997, 1518, 2471, 1901.0, 2160.5, 2237.9, 2349.8500000000004, 0.5778623254566846, 0.8824962196968996, 0.3194043712973471], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.42599999999999, 12, 166, 17.0, 24.0, 29.0, 43.98000000000002, 0.5755090953457429, 0.3107321979210309, 4.641166122426899], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.162000000000017, 14, 46, 23.0, 27.0, 29.0, 34.99000000000001, 0.5790166675737928, 1.0482384304508339, 0.4840217455499674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.45200000000001, 11, 39, 18.5, 22.0, 24.0, 27.99000000000001, 0.5790052689479475, 0.9802344338052227, 0.41616003705633725], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.0496144480519485, 1771.2307224025974], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.6755277470501474, 2820.7158001474922], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1300000000000003, 1, 17, 2.0, 3.0, 4.0, 9.990000000000009, 0.5763423012195403, 0.4840780036079028, 0.2448329111625977], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 407.8439999999997, 320, 576, 410.5, 472.0, 481.95, 530.94, 0.5761390845841313, 0.5071711851814723, 0.26781465259965476], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.096, 1, 35, 3.0, 4.0, 5.0, 14.980000000000018, 0.5763821644303039, 0.5222157499308341, 0.28256235014063724], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1152.9179999999988, 930, 1449, 1150.5, 1341.0, 1366.95, 1401.97, 0.5757695447850825, 0.5447139749632371, 0.3053152957209959], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.2163938492063], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 44.820000000000014, 14, 647, 44.0, 52.0, 58.94999999999999, 95.95000000000005, 0.5750907493202427, 0.30907196491543865, 26.30590888492204], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.268000000000015, 9, 187, 44.0, 53.0, 58.94999999999999, 79.97000000000003, 0.5758935564421757, 126.39192797716812, 0.17884194428575378], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.866242215302491, 1.4665814056939501], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1740000000000053, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5792615110847483, 0.6293778141248285, 0.24946711561364648], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.132, 1, 39, 3.0, 4.0, 6.0, 10.990000000000009, 0.5792548002845299, 0.5942000266746835, 0.21439215752718443], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.092, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.57922795863849, 0.3285783725837506, 0.22569526903980225], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.26599999999995, 86, 229, 122.0, 149.0, 153.0, 159.98000000000002, 0.5791635488362288, 0.5276621089632509, 0.19003803946188758], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 169.48599999999982, 28, 625, 175.0, 198.0, 212.89999999999998, 341.7900000000002, 0.5756356456617219, 0.3070914983651948, 170.28471658578985], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1540000000000004, 1, 21, 2.0, 3.0, 4.0, 6.0, 0.5792501028168933, 0.322967004103987, 0.24380546319734472], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.010000000000003, 1, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.5793125182483443, 0.3116542942409384, 0.24779187792263166], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.246000000000008, 6, 295, 9.0, 14.0, 18.0, 44.0, 0.5749208046591583, 0.24287821344797256, 0.4182773432334696], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.302000000000001, 2, 66, 4.0, 5.0, 6.0, 9.990000000000009, 0.5792688931445844, 0.2980214002927625, 0.23419660328306438], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4539999999999984, 2, 11, 3.0, 4.0, 6.0, 9.0, 0.5763349935623382, 0.35398562843855863, 0.2892931510654705], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8139999999999996, 2, 33, 3.0, 5.0, 6.0, 13.980000000000018, 0.5763177216546773, 0.3376208790401313, 0.272962983400897], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 518.652, 376, 747, 515.0, 627.9000000000001, 637.9, 685.8800000000001, 0.5758239176525732, 0.5261759745963762, 0.2547346041959137], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.208000000000006, 6, 108, 14.0, 25.900000000000034, 32.94999999999999, 41.99000000000001, 0.5760129764203328, 0.5100358650879687, 0.23794286037675857], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.349999999999989, 5, 41, 10.0, 11.0, 12.0, 16.99000000000001, 0.5764286784796118, 0.3839510367069783, 0.27076386166864574], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 521.532, 356, 3520, 509.0, 569.9000000000001, 602.5999999999999, 666.8800000000001, 0.5762200884152103, 0.43302939644403055, 0.31962208029281197], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.076, 143, 252, 180.0, 191.0, 195.95, 231.84000000000015, 0.5793319838760321, 11.201328464361813, 0.29306051528103977], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 260.1279999999996, 209, 395, 264.0, 286.90000000000003, 291.95, 321.94000000000005, 0.5791689157726229, 1.1226725644643962, 0.4151464689229543], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.753999999999998, 11, 31, 18.0, 22.0, 23.0, 27.99000000000001, 0.5788296527485147, 0.47210115236301414, 0.3583769529712484], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.245999999999988, 11, 51, 18.0, 21.0, 22.0, 27.99000000000001, 0.5788423846917028, 0.4813854509269003, 0.3674292480953191], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.60599999999997, 11, 44, 19.0, 22.0, 23.0, 28.0, 0.5787954803018535, 0.46854285452380756, 0.35439918569263873], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.224000000000004, 13, 52, 21.0, 25.0, 27.0, 34.0, 0.5788142411455891, 0.5177346422493879, 0.40358727361127994], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.877999999999986, 11, 43, 18.0, 21.0, 22.0, 31.940000000000055, 0.5785597333996748, 0.43435371984980586, 0.320354852380484], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2119.328000000002, 1677, 2660, 2107.5, 2432.7000000000003, 2498.6, 2604.96, 0.5774578917705321, 0.4825878760983249, 0.3688061144706328], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 95.60229445506693, 2.1272069772388855], "isController": false}, {"data": ["500", 23, 4.397705544933078, 0.09785152095298873], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 523, "No results for path: $['rows'][1]", 500, "500", 23, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
