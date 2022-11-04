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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8994894703254627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.976, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.489, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.99, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.724, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.605, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 188.88542863220667, 1, 3324, 16.0, 550.0, 1213.9500000000007, 2273.0, 26.002285501886703, 173.95510656975318, 215.43203891852397], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 23.857999999999997, 15, 58, 25.0, 28.0, 29.0, 35.97000000000003, 0.5627025025631099, 0.3268015676751046, 0.2846483362575107], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.470000000000003, 4, 27, 7.0, 10.0, 12.0, 22.970000000000027, 0.5626841383842863, 6.010191932966314, 0.2044125971474165], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.820000000000002, 5, 41, 7.0, 9.0, 11.0, 22.0, 0.5626676749671402, 6.041956264685626, 0.23847438567943247], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.542000000000012, 14, 246, 20.0, 27.0, 31.94999999999999, 56.91000000000008, 0.5599800199128896, 0.30225249688091127, 6.235246276412857], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.91000000000002, 26, 80, 44.0, 53.0, 54.0, 64.0, 0.5624701890799788, 2.3392871505935187, 0.23509496184202236], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5579999999999985, 1, 17, 2.0, 4.0, 4.949999999999989, 7.0, 0.5625011953150401, 0.3514358053948365, 0.23895314449418206], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.72399999999997, 23, 78, 39.0, 47.0, 48.0, 63.8900000000001, 0.5624695563352633, 2.308460747921394, 0.2054332168646372], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 771.2559999999995, 574, 1230, 773.0, 911.0, 927.9, 1053.92, 0.5621426178307142, 2.377386769720525, 0.2744837001126534], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.669999999999996, 7, 42, 11.0, 13.0, 15.0, 22.980000000000018, 0.5621552582878551, 0.8359687874535942, 0.28821436582141], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.492, 1, 21, 3.0, 5.0, 6.0, 10.980000000000018, 0.5604507817727955, 0.5405887125632889, 0.3075911517151475], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.05800000000001, 11, 44, 18.0, 21.0, 23.0, 34.950000000000045, 0.5624341249031207, 0.9165105736209396, 0.3685481423925723], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.6475839339908953, 1794.828516217754], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.6199999999999966, 2, 34, 4.0, 6.0, 7.0, 14.970000000000027, 0.560462089783785, 0.5630399964662866, 0.33003773451134993], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.046000000000017, 11, 61, 19.0, 22.0, 24.0, 35.99000000000001, 0.5624284309821576, 0.8836102168499059, 0.3355896204395491], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.592000000000006, 6, 35, 11.0, 13.0, 15.0, 24.980000000000018, 0.5624233698158625, 0.8704204677112743, 0.32240480281436656], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2005.7339999999997, 1525, 2748, 1993.5, 2263.0, 2346.95, 2599.9, 0.561208798856032, 0.8569680280750314, 0.3101993946801896], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.861999999999984, 12, 414, 17.0, 23.0, 28.0, 46.99000000000001, 0.5599442743458171, 0.30223320300163725, 4.515644353073982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.720000000000013, 13, 50, 23.0, 26.0, 28.0, 35.98000000000002, 0.5624619635097177, 1.0182363175502758, 0.4701830476214046], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.257999999999996, 10, 63, 18.0, 21.0, 23.0, 31.99000000000001, 0.5624379209144791, 0.9522820988945846, 0.40425225565728184], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.7423141207455429, 3099.58721636953], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.349999999999999, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.5606625685970652, 0.47122593846504046, 0.23817208724582362], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 409.7060000000003, 315, 840, 409.5, 476.0, 497.95, 606.95, 0.560475911305808, 0.493446495288079, 0.26053372439605915], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.136000000000002, 2, 14, 3.0, 4.0, 6.0, 10.990000000000009, 0.5607436806990903, 0.5080469171433922, 0.2748958278427181], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.5000000000014, 924, 2394, 1166.0, 1351.9, 1384.95, 1672.8700000000001, 0.5598458408492637, 0.5295857357717979, 0.296871378497217], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.1965144230769225, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 43.576000000000015, 13, 693, 42.0, 51.0, 57.94999999999999, 80.96000000000004, 0.5595194399434213, 0.30158097812950413, 25.59364313178697], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.11599999999998, 10, 184, 44.0, 53.0, 61.0, 85.97000000000003, 0.5602328776025618, 125.58339172302142, 0.17397856941173306], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.8465283890845072, 1.4510893485915495], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.250000000000001, 1, 22, 2.0, 3.0, 4.0, 6.0, 0.5627177014107333, 0.6114982921517762, 0.24234229133020838], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.317999999999997, 1, 17, 3.0, 5.0, 6.0, 10.0, 0.5627120017466581, 0.5773897728078429, 0.20826938345896817], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.16, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.562697436463019, 0.3190736248800048, 0.21925417690307086], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.97999999999999, 86, 276, 119.0, 149.0, 154.0, 221.0, 0.56263475102287, 0.5125075111739261, 0.1846145276793792], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, 1.0, 169.96399999999983, 36, 408, 171.0, 199.0, 221.0, 346.98, 0.5599969536165723, 0.30121929886701415, 165.65847381790243], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.386, 1, 23, 2.0, 3.0, 5.0, 7.990000000000009, 0.5627088353165068, 0.3137123737703405, 0.23684326955216256], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2039999999999966, 1, 19, 3.0, 4.0, 5.0, 10.0, 0.5627582356854002, 0.30262104296546577, 0.24071104221699732], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.687999999999995, 7, 311, 10.0, 15.0, 19.0, 37.98000000000002, 0.5593441801356746, 0.23639283412983944, 0.40694474043073975], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.692000000000006, 2, 65, 4.0, 5.0, 6.0, 16.0, 0.5627189680184302, 0.2894749466261059, 0.22750552027307627], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8200000000000034, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.5606543958107904, 0.3442275636623066, 0.2814222260222131], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.087999999999998, 2, 31, 4.0, 5.0, 6.0, 12.980000000000018, 0.5606405654845, 0.32834155617842725, 0.26553776783201416], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 519.4599999999994, 380, 755, 517.0, 627.0, 647.9, 686.8300000000002, 0.5601688573003446, 0.5118389762409981, 0.24780907456743761], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.29199999999999, 6, 120, 15.0, 25.0, 33.0, 48.99000000000001, 0.5603433784222972, 0.49619281695823203, 0.2314699697974919], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.288, 5, 60, 9.0, 11.0, 13.0, 18.0, 0.560479052655886, 0.3736446740758261, 0.26327189875730583], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 546.7419999999998, 375, 2719, 530.0, 622.0, 650.95, 722.8500000000001, 0.5602812163481095, 0.4211148034421437, 0.31078098719309194], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.63799999999998, 141, 328, 176.0, 188.0, 193.0, 283.8900000000001, 0.5625632180416275, 10.877074117844618, 0.2845778778765264], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 258.2540000000001, 28, 478, 261.0, 281.0, 290.0, 425.6600000000003, 0.5626322185713643, 1.0887318041224063, 0.4032930160462709], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.08999999999999, 11, 86, 18.0, 20.0, 22.0, 28.980000000000018, 0.5621299779420197, 0.45873539094453575, 0.34803750587425825], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 16.55800000000001, 10, 33, 18.0, 20.0, 22.0, 26.0, 0.5621426178307142, 0.467529184336683, 0.3568288101464494], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.912000000000013, 11, 35, 18.0, 21.0, 22.0, 28.99000000000001, 0.562097748798516, 0.45489846231134595, 0.34417508642252886], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.801999999999992, 13, 45, 21.0, 24.0, 25.0, 36.0, 0.5621097553023813, 0.5026655508085387, 0.391939809849512], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.71399999999998, 10, 63, 18.0, 20.0, 22.0, 32.99000000000001, 0.5619865550336574, 0.4219114061915183, 0.31117810225008175], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2215.2200000000003, 1672, 3324, 2189.0, 2525.7000000000003, 2627.0, 2782.92, 0.5609582063697927, 0.46873536249680253, 0.3582682294588324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1968503937007874, 0.0042544139544777706], "isController": false}, {"data": ["500", 7, 1.3779527559055118, 0.029780897681344395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 7, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
