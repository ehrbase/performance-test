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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8753243990640289, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.461, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.745, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.791, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.826, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.838, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.486, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 480.3668155711538, 1, 23010, 14.0, 971.0, 1809.9500000000007, 10446.970000000005, 10.256891382989402, 69.13665973769217, 84.97956933220021], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10998.871999999988, 8954, 23010, 10588.5, 12647.6, 13115.25, 21194.960000000057, 0.2208088493120921, 0.12830201693427226, 0.1116982265074841], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.089999999999998, 5, 18, 7.0, 8.0, 10.0, 13.990000000000009, 0.2216478096098511, 2.3666336644622312, 0.08052049333482872], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.986, 5, 34, 9.0, 11.0, 12.0, 20.99000000000001, 0.22164496023689412, 2.3799603795780766, 0.09393936791290239], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.86400000000002, 14, 285, 19.0, 29.0, 35.0, 54.940000000000055, 0.22042162247947875, 0.12952138131067104, 2.454343104991227], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.14200000000005, 25, 90, 44.0, 54.0, 55.94999999999999, 59.0, 0.2216068446376462, 0.9216399270769436, 0.09262473584464119], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.826000000000001, 1, 22, 3.0, 3.900000000000034, 5.0, 11.960000000000036, 0.2216125414969484, 0.1384450770713016, 0.09414204643669194], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.92799999999996, 22, 73, 39.0, 47.0, 49.0, 51.99000000000001, 0.22160556779556975, 0.9095155623341006, 0.08093797105033505], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1133.3839999999989, 786, 1765, 1129.0, 1451.3000000000002, 1524.9, 1610.98, 0.22152221203220046, 0.9369264651479103, 0.10816514259384788], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.122, 4, 18, 6.0, 7.0, 8.0, 14.0, 0.22149718809319716, 0.3293710774232346, 0.113560570067313], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.483999999999998, 2, 17, 4.0, 5.0, 6.0, 11.990000000000009, 0.220600757631242, 0.21278278742183013, 0.12107190018433399], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.810000000000004, 6, 29, 9.0, 10.0, 11.949999999999989, 16.0, 0.22160507670638124, 0.3611903056864749, 0.1452119203808416], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 0.6379158266129032, 1589.774183047715], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.849999999999993, 3, 15, 5.0, 6.0, 7.0, 10.990000000000009, 0.22060202292055017, 0.2216167060533195, 0.12990529279403493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.356000000000002, 6, 26, 16.0, 18.0, 19.0, 21.0, 0.2216044874022281, 0.3481419481726937, 0.13222689629175916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.030000000000001, 4, 24, 7.0, 8.0, 10.0, 15.0, 0.22160488027131528, 0.3429487009909727, 0.12703326632740436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2219.168000000002, 1580, 3477, 2162.5, 2820.7000000000003, 3024.6, 3349.98, 0.22132952646547813, 0.33798358772395787, 0.12233643747994202], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.959999999999976, 13, 86, 18.0, 26.0, 32.94999999999999, 50.98000000000002, 0.22041501502348743, 0.12951749872049084, 1.7775265567030851], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.760000000000003, 9, 35, 13.0, 16.0, 18.0, 25.980000000000018, 0.22160645176159402, 0.40116610907713324, 0.1852491432694575], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.027999999999999, 6, 34, 9.0, 11.0, 12.0, 17.99000000000001, 0.22160596066848767, 0.375133012052705, 0.15927928423047552], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 7.338169642857142, 1948.3537946428569], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.8676833190394512, 3280.352165523156], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.531999999999998, 1, 17, 2.0, 3.0, 4.0, 7.990000000000009, 0.2205859645562472, 0.1854731596512977, 0.09370595174020267], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 517.476, 373, 870, 508.0, 619.0, 636.95, 694.8200000000002, 0.22054899054727026, 0.19414772564367222, 0.10252081982470765], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.446000000000003, 2, 21, 3.0, 4.0, 5.0, 9.0, 0.22059433407864806, 0.19985114225400646, 0.10814292549558724], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 772.5879999999995, 580, 1333, 746.5, 930.9000000000001, 949.95, 1033.8700000000001, 0.22053410714340846, 0.20862655754969847, 0.11694337908092853], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.9326923076923075, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.926000000000045, 24, 1033, 33.0, 43.0, 51.0, 84.91000000000008, 0.22031624193367158, 0.12945945891983351, 10.077746847825368], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.484000000000016, 29, 252, 38.0, 47.0, 55.94999999999999, 109.80000000000018, 0.22048159353512692, 49.89395541581065, 0.06846986986735387], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 0.537860576923077, 0.42267628205128205], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2000000000000024, 2, 19, 3.0, 4.0, 4.949999999999989, 7.0, 0.2216088090388028, 0.24074421030365725, 0.09543894998643754], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.966000000000006, 2, 18, 4.0, 5.0, 5.949999999999989, 8.0, 0.22160782683387126, 0.22745100195546747, 0.08202086559573946], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.354000000000002, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.22164938170904974, 0.12569727778541237, 0.08636533525577231], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 201.37200000000013, 91, 420, 195.5, 301.90000000000003, 312.95, 354.85000000000014, 0.22162825848947043, 0.20187001267159566, 0.07272177231685749], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 123.74800000000006, 88, 457, 120.0, 147.0, 166.95, 263.94000000000005, 0.22044086409291672, 0.12959511736712487, 65.21088530373666], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 263.692, 18, 597, 317.0, 450.0, 476.95, 499.0, 0.22160488027131528, 0.12352048271747859, 0.09327314784857117], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 522.108, 310, 1073, 482.5, 859.8000000000001, 905.0, 962.97, 0.2216397529514658, 0.11919846518349776, 0.09480294120384962], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.155999999999995, 10, 322, 13.0, 18.900000000000034, 23.94999999999999, 49.99000000000001, 0.22028818982145204, 0.10362795304579263, 0.16026826310252124], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 525.096, 289, 1170, 466.0, 880.0, 911.9, 970.95, 0.22158081960972528, 0.11397347021156094, 0.08958443292815065], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.151999999999998, 2, 14, 4.0, 5.0, 7.0, 11.990000000000009, 0.22058479676640336, 0.13543346442871623, 0.11072322806438605], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.616000000000003, 3, 29, 4.0, 5.0, 7.0, 10.0, 0.22058236391060768, 0.12918500923909232, 0.10447504540687962], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 861.8800000000003, 551, 1540, 856.0, 1109.9, 1231.8, 1409.8500000000001, 0.22047955184444373, 0.2014696498597309, 0.09753636424368457], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 470.6860000000001, 242, 1196, 385.5, 853.0, 890.8499999999999, 969.8500000000001, 0.2204785796240752, 0.19522473919037622, 0.09107660076267951], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.736000000000001, 3, 44, 4.0, 6.0, 7.0, 12.0, 0.22060309356130162, 0.14714053994371973, 0.10362313281541609], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1189.7980000000005, 899, 9879, 1085.5, 1406.9, 1453.75, 1823.6000000000013, 0.2205190312334335, 0.16569507130041836, 0.12231915013729514], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.92199999999997, 143, 360, 173.5, 187.0, 191.0, 223.98000000000002, 0.22171877279546134, 4.286923811110682, 0.11215851983207907], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.49800000000005, 193, 332, 236.5, 254.0, 257.0, 300.0, 0.2217007819829982, 0.4296989834076918, 0.15891442771046943], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.812000000000002, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.2214949313099919, 0.1808298462647981, 0.13713651020560047], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.824000000000001, 5, 23, 8.0, 9.0, 11.0, 18.0, 0.22149581439359542, 0.1841659827060498, 0.1405979290584346], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.49399999999999, 6, 32, 8.0, 10.0, 12.0, 19.980000000000018, 0.2214923802191357, 0.17925092813613275, 0.13562082265370906], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.029999999999996, 7, 33, 11.0, 13.0, 14.0, 21.0, 0.22149355763838252, 0.1980701813135188, 0.15443984390020032], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.870000000000001, 5, 35, 8.0, 10.0, 11.0, 28.910000000000082, 0.22148335375409856, 0.16626608287530578, 0.12263775544782606], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2004.047999999998, 1616, 2811, 1916.5, 2488.8, 2582.95, 2725.9700000000003, 0.22132550962411845, 0.18495161312544375, 0.14135437821696628], "isController": false}]}, function(index, item){
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
