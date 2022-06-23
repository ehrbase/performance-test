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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9172233583276528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.005, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.995, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.867, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.735, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.759, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.88707112019867, 1, 3819, 12.0, 574.9000000000015, 1248.9000000000015, 2136.0, 25.980542633828428, 174.67814530191092, 228.85829699712508], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.800000000000001, 4, 28, 6.0, 9.0, 12.0, 17.99000000000001, 0.601532705333189, 6.435518795641293, 0.21735068454421866], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.254000000000006, 4, 33, 7.0, 9.0, 10.949999999999989, 16.99000000000001, 0.6015124428863936, 6.458528386274448, 0.25376306184269726], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.774000000000008, 13, 246, 18.0, 25.0, 30.94999999999999, 41.98000000000002, 0.5977214856965248, 0.3221158444011428, 6.654321227480843], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.818, 25, 68, 42.0, 51.0, 53.0, 56.0, 0.6012657847300137, 2.5007724386378203, 0.2501359612255721], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.23, 1, 15, 2.0, 3.0, 4.0, 6.0, 0.6013048314843209, 0.3758155196777006, 0.2542626875319443], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.288000000000004, 22, 67, 37.0, 45.0, 47.0, 58.950000000000045, 0.6012621695463116, 2.4671947602406976, 0.21842727253049604], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 746.7139999999999, 551, 983, 738.0, 893.0, 905.95, 925.98, 0.6009001484223366, 2.541502483219863, 0.2922346424944567], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 7.862, 5, 28, 8.0, 10.0, 11.0, 17.970000000000027, 0.6011154297915211, 0.8940417964575065, 0.30701500955172417], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.133999999999998, 2, 20, 3.0, 4.0, 5.0, 10.990000000000009, 0.5985135317924404, 0.5774720404403623, 0.3273120876989908], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.944000000000004, 7, 28, 12.0, 15.0, 16.0, 20.99000000000001, 0.601253493282796, 0.9799727346572134, 0.39281112012323294], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.6731195780757098, 1865.5994306979494], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.041999999999994, 2, 21, 4.0, 5.0, 6.0, 10.0, 0.5985249950023164, 0.600769463733575, 0.35128273632460166], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.807999999999991, 8, 36, 13.0, 15.0, 17.0, 22.99000000000001, 0.6012440942798839, 0.9440471724091489, 0.3575758334145013], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.782000000000005, 4, 29, 8.0, 9.0, 11.0, 19.950000000000045, 0.6012404793570093, 0.9306310154109959, 0.34348210978891647], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1846.3379999999997, 1482, 2260, 1848.0, 2085.8, 2160.0, 2238.9300000000003, 0.6000607261454859, 0.9164989996987695, 0.3305021968223184], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.667999999999992, 10, 84, 15.0, 21.0, 25.0, 43.97000000000003, 0.5976714719453011, 0.32276594139233544, 4.81872624255899], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.373999999999995, 11, 31, 17.0, 19.0, 21.0, 26.980000000000018, 0.6012650616897953, 1.0886185784891411, 0.5014456666827004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 11.85599999999999, 7, 32, 12.0, 15.0, 16.0, 20.99000000000001, 0.6012621695463116, 1.0181529316340863, 0.4309828441865164], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.7937743717504333, 3314.459894930676], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0300000000000007, 1, 16, 2.0, 3.0, 3.0, 8.0, 0.5986496857687799, 0.5033568158661323, 0.2531399550174626], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 397.98399999999987, 307, 562, 410.0, 457.0, 466.9, 518.7800000000002, 0.5983430683750558, 0.5263782907372904, 0.2769673968845473], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.975999999999997, 1, 23, 3.0, 4.0, 5.0, 15.990000000000009, 0.5986339174004921, 0.542511987644196, 0.29230171748070904], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1124.3459999999998, 915, 1422, 1118.5, 1318.8000000000002, 1338.0, 1368.95, 0.5978429825190712, 0.5657322754501758, 0.3158525913504077], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.916000000000025, 27, 599, 40.0, 46.0, 53.94999999999999, 79.99000000000001, 0.5972524000587697, 0.3225396262036129, 27.318464759719387], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.760000000000005, 27, 172, 39.0, 46.0, 53.94999999999999, 77.96000000000004, 0.5980832627595083, 135.34378928659433, 0.184564756867192], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.7026430600649352, 1.3316761363636365], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0680000000000014, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.6015775770380245, 0.653863128167306, 0.25790288703094993], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0300000000000016, 2, 14, 3.0, 4.0, 5.0, 10.0, 0.6015717867644581, 0.6174335428607867, 0.22147711290058666], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9279999999999995, 1, 10, 2.0, 3.0, 3.0, 7.0, 0.601547179345276, 0.3413075304683646, 0.23321702167976033], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.69200000000005, 84, 155, 118.0, 142.0, 145.0, 151.0, 0.6014806046564222, 0.5480287149848065, 0.19618605659691896], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 157.06200000000007, 109, 577, 155.0, 189.0, 209.95, 306.85000000000014, 0.597815820119611, 0.32284389504506333, 176.84489511620342], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1499999999999986, 1, 14, 2.0, 3.0, 4.0, 8.990000000000009, 0.6015667203665226, 0.33476248040396406, 0.2520235576535529], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 442.86799999999977, 332, 634, 452.5, 515.0, 524.0, 546.0, 0.6013438833104221, 0.6535151631866896, 0.258389949859947], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.196, 7, 311, 9.0, 14.0, 19.0, 42.97000000000003, 0.5970491443091664, 0.252463163560419, 0.4332104631071393], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.7300000000000004, 1, 22, 2.0, 3.0, 4.0, 8.0, 0.6015811960156074, 0.6403549840400509, 0.2443923608813405], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4139999999999975, 2, 13, 3.0, 4.0, 5.0, 9.0, 0.5986425182256715, 0.36772084371479236, 0.29932125911283575], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8260000000000014, 2, 25, 4.0, 5.0, 6.0, 11.0, 0.5986260335278468, 0.3507574415202228, 0.28235974042377937], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 511.88199999999955, 367, 872, 521.5, 616.0, 625.95, 657.97, 0.5980031478885705, 0.545934826925929, 0.26337833954857937], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.250000000000002, 5, 128, 15.0, 23.0, 30.0, 43.99000000000001, 0.5981998968703378, 0.5298508852162074, 0.24593960603751192], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.474, 4, 34, 6.0, 8.0, 9.0, 11.990000000000009, 0.5985364586513058, 0.39921914185433777, 0.27997945673239794], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 512.5159999999998, 419, 3819, 499.0, 565.8000000000001, 598.95, 687.96, 0.5982127794999659, 0.4498279689599353, 0.33065276679392647], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.899999999999999, 8, 30, 12.0, 14.0, 15.0, 20.99000000000001, 0.6010966407113137, 0.49073905433072096, 0.3709893329390139], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.594, 7, 22, 12.0, 14.0, 15.0, 18.99000000000001, 0.6011038671416189, 0.4994562639831787, 0.38038604092555567], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 11.835999999999999, 8, 28, 12.0, 15.0, 16.0, 19.99000000000001, 0.6010865240007839, 0.4866218050748533, 0.36687409912157215], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.546, 10, 26, 15.0, 17.900000000000034, 19.0, 24.980000000000018, 0.6010908596921694, 0.5376945580840109, 0.4179459883797115], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.388, 7, 34, 12.0, 14.0, 15.0, 20.99000000000001, 0.6009528708720547, 0.45130152119200206, 0.3315804414479599], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2092.572, 1665, 2649, 2080.0, 2397.5, 2462.5, 2576.95, 0.5997771228211596, 0.5006967535863673, 0.38188933992128526], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
