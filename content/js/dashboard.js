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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.861050840246756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.441, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.971, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.562, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.705, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.3, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 492.5728568389666, 2, 26505, 15.0, 1222.7000000000044, 2338.9000000000015, 9636.990000000002, 10.070469723896469, 63.43655236218494, 83.33399635456922], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9811.018000000005, 8363, 26505, 9613.5, 10383.1, 10605.3, 25075.850000000126, 0.21700814344759103, 0.12605672454527028, 0.10935175978413765], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.474000000000002, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.21778416804923317, 0.11180792479019762, 0.07869154509591432], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.140000000000001, 3, 17, 5.0, 6.0, 7.0, 11.0, 0.21778284001890355, 0.12499331338624006, 0.09187713563297495], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.946000000000005, 14, 567, 18.0, 24.0, 27.0, 87.99000000000001, 0.21655821431293876, 0.1126589124478961, 2.382774805335821], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.20599999999999, 31, 79, 56.0, 68.0, 70.0, 74.99000000000001, 0.21772982689607842, 0.9055158116216779, 0.09057901001731387], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.480000000000001, 2, 19, 3.0, 4.0, 5.0, 8.990000000000009, 0.21773580025091874, 0.1360232116977688, 0.09206992334828888], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.556, 28, 67, 49.0, 60.0, 62.0, 65.0, 0.21773058539916113, 0.8936118247684652, 0.079097439227039], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1217.9999999999986, 881, 1773, 1175.5, 1538.1000000000004, 1659.6999999999998, 1756.99, 0.2176540980131228, 0.9205169948672811, 0.10585130938528824], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.862000000000016, 5, 38, 9.0, 11.0, 12.0, 18.0, 0.21771399435075728, 0.32374538704867345, 0.11119572172406841], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.514000000000003, 3, 21, 5.0, 7.0, 7.0, 13.990000000000009, 0.2166860383984995, 0.20900680369783392, 0.11850017724917941], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.425999999999995, 9, 38, 12.0, 15.0, 17.0, 22.980000000000018, 0.21773077502575755, 0.3548139859308905, 0.1422479379806951], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.6437755766369048, 1760.1042247953867], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.084, 4, 19, 6.0, 8.0, 9.0, 15.0, 0.21668754089977335, 0.21768421894434165, 0.1271769649226209], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.569999999999995, 8, 24, 13.0, 15.0, 16.0, 20.0, 0.21773001652135365, 0.34205513171686214, 0.12948982427881287], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.686000000000005, 7, 28, 9.0, 12.0, 13.0, 17.99000000000001, 0.21772944764651886, 0.3369512040819482, 0.12438645202462259], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2332.426, 1962, 2970, 2286.0, 2683.6000000000004, 2800.8, 2951.8500000000004, 0.2175235208183061, 0.3321839073271493, 0.11980787670070765], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.607999999999997, 13, 104, 17.0, 22.0, 25.0, 83.97000000000003, 0.21655230539418802, 0.11265583848294715, 1.7459529622406407], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.598000000000013, 12, 35, 17.0, 21.0, 22.0, 28.99000000000001, 0.2177321972357591, 0.39415268685341703, 0.1815852504290413], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.49599999999999, 9, 32, 13.0, 15.0, 17.0, 22.99000000000001, 0.21773172316369419, 0.3686363923497346, 0.15606941875210112], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.913330078125, 1420.654296875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.725926741001565, 2992.86910700313], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.620000000000002, 2, 29, 3.0, 4.0, 5.0, 12.990000000000009, 0.21668068590704487, 0.18212815738969976, 0.09162376659936564], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 772.8700000000013, 580, 976, 737.5, 942.0, 953.0, 971.99, 0.216621732098705, 0.19075193559640946, 0.10027216895975212], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.759999999999997, 3, 26, 4.0, 6.0, 6.949999999999989, 13.990000000000009, 0.2166855688711245, 0.19630993075920988, 0.10580350042535377], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1044.138000000001, 811, 1388, 997.5, 1303.8000000000002, 1326.95, 1358.97, 0.21660005492977394, 0.204904921104513, 0.11443420870801532], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.638485863095238, 783.8890438988095], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.26400000000004, 25, 1424, 34.0, 41.0, 46.0, 122.95000000000005, 0.2164199551318149, 0.11258698661940345, 9.872046976764722], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.83999999999996, 32, 525, 45.0, 56.0, 67.94999999999999, 252.6700000000003, 0.2166384386781069, 48.997248959241865, 0.06685326818582206], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.8582881546644845, 0.6712868248772504], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.087999999999996, 3, 11, 4.0, 5.0, 5.0, 9.0, 0.2177649131945503, 0.23663007476631645, 0.09335820009024177], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.9360000000000035, 3, 16, 5.0, 6.0, 7.0, 11.0, 0.21776405960986264, 0.22344421393816283, 0.08017290085245918], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7920000000000016, 2, 13, 3.0, 4.0, 4.0, 9.0, 0.21778473721004685, 0.1235056393996546, 0.0844341217503795], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.036, 83, 177, 125.0, 163.0, 167.95, 173.0, 0.21777354426007736, 0.19835894772150073, 0.07103160525670492], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 124.12200000000011, 84, 607, 121.0, 141.0, 156.0, 522.0000000000009, 0.21660240073436876, 0.11268189931172422, 64.04789152183547], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 264.3000000000001, 15, 533, 282.0, 487.0, 502.0, 525.99, 0.21776121437589854, 0.12136572525045806, 0.09123004000709031], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 586.4460000000003, 441, 745, 555.0, 703.0, 714.95, 736.0, 0.21772100968553684, 0.11709095433976757, 0.09270152365516998], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.022, 7, 395, 9.0, 13.0, 17.0, 48.99000000000001, 0.21638520721480212, 0.0975656386944788, 0.15700606343808396], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 545.2880000000001, 413, 727, 532.0, 648.0, 664.0, 683.99, 0.21772423309904756, 0.11198977618710872, 0.08759998441094491], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.156000000000003, 3, 19, 5.0, 6.0, 7.0, 14.990000000000009, 0.21667918350083357, 0.13303551704961822, 0.10833959175041677], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.821999999999998, 3, 47, 5.0, 7.0, 7.949999999999989, 17.960000000000036, 0.21667505199117873, 0.12689667522424783, 0.10220122081224543], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 957.6619999999988, 665, 1427, 914.5, 1266.2000000000003, 1386.9, 1415.97, 0.21659067221947392, 0.19791607217039447, 0.09539296208103784], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 332.6699999999999, 214, 420, 331.0, 400.0, 405.95, 413.99, 0.2166503601162286, 0.19183500783299376, 0.08907207188372289], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.892, 4, 68, 7.0, 8.0, 9.0, 16.0, 0.21668894951364165, 0.1444684694555257, 0.10136133478226012], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1553.8539999999998, 1272, 12147, 1447.0, 1765.0, 1804.85, 2767.4800000000087, 0.2165504296143973, 0.16277444451025172, 0.11969486636889538], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.32399999999993, 129, 232, 179.5, 207.0, 208.0, 212.0, 0.21777961486981787, 4.210698670624231, 0.10974050905549416], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 235.98399999999998, 182, 325, 233.0, 285.0, 287.0, 299.97, 0.2177654822547264, 0.42207161160720513, 0.1556682939555271], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.090000000000002, 7, 24, 11.0, 14.0, 15.0, 21.0, 0.21771171920413304, 0.17767955161727153, 0.13436895169630086], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.045999999999998, 7, 46, 11.0, 14.0, 15.0, 19.0, 0.2177127619737665, 0.18108216455144205, 0.1377713571865241], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.331999999999988, 8, 32, 12.0, 15.0, 16.0, 22.99000000000001, 0.21770944410505963, 0.17618944670342182, 0.13287929938052953], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.15, 10, 31, 15.0, 18.0, 20.0, 23.99000000000001, 0.21771039205722822, 0.19468709288156685, 0.1513767569772915], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.632000000000009, 7, 50, 12.0, 14.0, 15.0, 44.77000000000021, 0.21769484668405034, 0.1634220757758753, 0.12011483239891448], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2638.420000000001, 2208, 3291, 2596.5, 3018.0000000000005, 3113.65, 3276.9700000000003, 0.21748084972377757, 0.1817511248109548, 0.13847413478506151], "isController": false}]}, function(index, item){
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
