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

    var data = {"OkPercent": 97.79195915762604, "KoPercent": 2.208040842373963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8995532865347798, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.978, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.486, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.98, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.747, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.608, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 519, 2.208040842373963, 189.97596256115756, 1, 3300, 17.0, 551.0, 1232.9000000000015, 2267.980000000003, 25.8799228832249, 171.98556518020433, 214.41825001816716], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.21800000000002, 16, 68, 27.0, 31.0, 33.0, 44.950000000000045, 0.5607738679377541, 0.32571323426328336, 0.28367271835132485], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.895999999999998, 5, 29, 7.0, 10.0, 13.0, 18.980000000000018, 0.5605418870530519, 6.011721964357384, 0.2036343574059915], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.349999999999993, 5, 33, 8.0, 10.0, 12.0, 23.950000000000045, 0.5605249203774351, 6.018883751755845, 0.2375662260193426], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.164000000000005, 15, 277, 20.0, 29.0, 35.0, 47.99000000000001, 0.5570714087556027, 0.3008087684571684, 6.202859572882209], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.44200000000005, 27, 84, 46.0, 55.0, 57.0, 66.0, 0.5602962846753363, 2.330277719608129, 0.2341863377353945], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6180000000000008, 1, 21, 2.0, 3.900000000000034, 4.0, 9.970000000000027, 0.5603270516935325, 0.35017267003404545, 0.2380295580924674], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.448000000000015, 23, 70, 41.0, 48.0, 51.0, 65.94000000000005, 0.5602874947192904, 2.2994734995921107, 0.2046362529541158], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 780.0680000000004, 583, 1583, 776.5, 915.9000000000001, 934.0, 1181.7400000000002, 0.5599655957137993, 2.36811637792974, 0.27342070103212857], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.74, 7, 38, 12.0, 15.0, 17.94999999999999, 25.980000000000018, 0.5600521520563995, 0.8328413041822454, 0.28713611311485326], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5439999999999983, 2, 21, 3.0, 5.0, 7.0, 11.0, 0.55789873022249, 0.5381587040570396, 0.30619051404789], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.85199999999999, 12, 38, 20.0, 24.0, 25.0, 32.0, 0.5602642654487269, 0.912911226967536, 0.3671262911289997], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.6872106481481481, 1904.6569922504025], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.604000000000002, 2, 21, 4.0, 6.0, 7.0, 12.990000000000009, 0.5579086904320891, 0.5606012536626706, 0.3285341214165525], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.68999999999999, 12, 43, 20.0, 24.0, 26.0, 34.0, 0.5602579875981293, 0.8802955147286222, 0.3342945609594306], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.204000000000002, 7, 28, 11.0, 14.0, 15.0, 20.99000000000001, 0.5602579875981293, 0.8671010014191335, 0.32116351437509943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2010.9000000000005, 1499, 2881, 1992.5, 2278.2000000000003, 2369.9, 2635.700000000001, 0.5591296364427278, 0.8537614694961236, 0.3090501701431484], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.442000000000014, 11, 437, 17.0, 24.0, 28.0, 42.99000000000001, 0.5570279661460683, 0.30065910856307954, 4.492125922299055], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.229999999999993, 15, 43, 24.0, 28.0, 31.0, 39.0, 0.5602824720110892, 1.0143224745687784, 0.4683611289467698], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.655999999999995, 12, 43, 19.0, 23.0, 26.0, 33.99000000000001, 0.5602686600278566, 0.9485140502073555, 0.4026930993950219], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.17578125, 1515.3862847222222], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.7122983087091758, 2974.2539852255054], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.386000000000003, 1, 17, 2.0, 3.0, 4.0, 9.0, 0.5578402211724909, 0.46879061774110414, 0.2369731408301109], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 409.31799999999987, 317, 961, 405.0, 474.90000000000003, 496.79999999999995, 620.95, 0.55764921856615, 0.49095785733325453, 0.2592197539428588], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.254000000000001, 1, 21, 3.0, 4.0, 6.0, 11.0, 0.5578707190395698, 0.5054439465448277, 0.2734874032791641], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.9740000000004, 930, 1923, 1162.0, 1360.0, 1387.95, 1784.7500000000002, 0.5572986619259127, 0.5270815366256681, 0.29552067717360414], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.662471064814815, 1219.4191261574074], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, 1.8, 44.52399999999999, 10, 689, 43.0, 50.900000000000034, 60.0, 86.96000000000004, 0.5566094026913178, 0.29846113676616615, 25.460531662169263], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.02599999999996, 10, 207, 44.0, 53.0, 62.94999999999999, 92.94000000000005, 0.5574136008918618, 123.7626702724359, 0.1731030518394649], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 1.3012755893300247, 1.0226039081885856], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.4740000000000006, 1, 23, 2.0, 3.900000000000034, 5.0, 9.970000000000027, 0.5605783374591898, 0.609109969072893, 0.24142094415967064], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.487999999999997, 2, 28, 3.0, 5.0, 6.0, 12.0, 0.5605714240868571, 0.5752251114696276, 0.20747711887589734], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.285999999999998, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5605525703017006, 0.31782564355639215, 0.21841843315466655], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.17000000000002, 86, 300, 123.5, 151.0, 157.95, 253.93000000000006, 0.5604922467107513, 0.5105876372365267, 0.18391151845196527], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 172.16599999999994, 33, 451, 174.0, 203.0, 222.89999999999998, 347.85000000000014, 0.5571682480958775, 0.2985975639907733, 164.82168526680002], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2900000000000005, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.5605676532283652, 0.31255040729444267, 0.23594204935686075], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.5600000000000014, 1, 29, 3.0, 5.0, 6.0, 11.990000000000009, 0.5606110211641873, 0.30146638674424026, 0.2397926047557754], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.906000000000008, 7, 318, 10.0, 15.0, 20.0, 30.99000000000001, 0.5564285300938807, 0.23512909107121396, 0.40482349113275495], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.814000000000003, 2, 51, 5.0, 6.0, 7.0, 11.990000000000009, 0.5605802229539663, 0.2884064809940881, 0.22664083232709184], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.844000000000001, 2, 15, 3.0, 5.0, 6.949999999999989, 13.0, 0.5578339975276797, 0.3426222949932168, 0.28000651829026113], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1679999999999975, 2, 29, 4.0, 5.0, 6.0, 12.0, 0.5578171943803265, 0.3266880367595953, 0.2642005266352132], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 514.8500000000004, 375, 1042, 504.0, 629.0, 644.0, 738.8800000000001, 0.5573701048970537, 0.5091554135964863, 0.24657095460777864], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.32200000000001, 6, 107, 16.0, 24.0, 31.0, 43.0, 0.5575360474931507, 0.493675302365737, 0.23031030086875268], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.988000000000003, 6, 45, 10.0, 12.0, 13.0, 18.0, 0.5579161608226809, 0.37187291478834894, 0.26206804038643505], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 546.7360000000001, 358, 3300, 529.5, 610.0, 638.8499999999999, 742.7700000000002, 0.5577213735561989, 0.4191276122274834, 0.30936107439445404], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.8559999999998, 141, 358, 177.0, 189.0, 198.0, 326.74000000000024, 0.5606657120398477, 10.840417884829732, 0.2836180066764073], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 266.2000000000001, 211, 498, 269.0, 290.0, 302.95, 420.9100000000001, 0.5604809374828353, 1.0864156690573046, 0.4017509844847667], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.808000000000035, 12, 41, 19.0, 23.0, 25.0, 34.99000000000001, 0.5600232969691539, 0.4569527592347841, 0.34673317410004256], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.466000000000008, 11, 36, 20.0, 22.0, 24.0, 32.99000000000001, 0.5600364695748987, 0.46571407730071385, 0.3554918996325041], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.396000000000008, 12, 44, 19.0, 23.0, 25.0, 35.98000000000002, 0.5599925632987593, 0.4532581994811109, 0.34288607147297084], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.408000000000023, 14, 42, 23.0, 26.0, 28.0, 35.99000000000001, 0.5600101249830597, 0.5009148377902672, 0.39047580980264124], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.30399999999997, 12, 57, 19.0, 22.0, 24.0, 38.97000000000003, 0.5597750152258805, 0.4202510926808297, 0.309953548469799], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2212.0999999999976, 1699, 3097, 2183.0, 2510.7000000000003, 2620.9, 2971.78, 0.5587316344911742, 0.4667799035266023, 0.35684618062229295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.33911368015414, 2.1272069772388855], "isController": false}, {"data": ["500", 19, 3.6608863198458574, 0.08083386513507765], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 519, "No results for path: $['rows'][1]", 500, "500", 19, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
