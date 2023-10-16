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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8727079344820251, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.793, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.803, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.423, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 470.13673686449437, 1, 20413, 11.0, 1026.0, 1919.0, 10656.960000000006, 10.514971924286835, 66.23656395207155, 87.01228999553321], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10772.359999999997, 9355, 20413, 10622.0, 11462.300000000001, 11713.949999999999, 19396.69000000006, 0.22634932491313844, 0.13149569511877682, 0.11405883950701118], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.830000000000003, 2, 10, 3.0, 4.0, 4.0, 7.990000000000009, 0.22731715744440958, 0.1167020535547857, 0.0821360822797183], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.139999999999997, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.2273160206421132, 0.13046474462068003, 0.0958989462083915], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.84000000000001, 9, 423, 14.0, 18.0, 20.0, 46.940000000000055, 0.22602261672712018, 0.11758252749678143, 2.486910959633265], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.894, 26, 59, 43.0, 53.0, 55.0, 57.0, 0.2272837815293744, 0.9452497199579707, 0.09455360442530614], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4759999999999995, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.22728884411803746, 0.14199115866284154, 0.09610944287413108], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.80000000000001, 22, 60, 38.0, 47.0, 49.0, 51.0, 0.22728243843146026, 0.932814625801057, 0.08256744833642893], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1015.8919999999994, 722, 1433, 1005.5, 1229.0, 1376.75, 1406.99, 0.22721107045042777, 0.9609231004984101, 0.11049913387139944], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.701999999999996, 4, 18, 6.0, 9.0, 10.0, 15.990000000000009, 0.22723275496537654, 0.33789998858723486, 0.1160573543426679], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.36599999999999, 3, 18, 4.0, 5.0, 6.0, 11.0, 0.22613485778378795, 0.21812076209143083, 0.12366750035050902], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.084000000000005, 6, 35, 9.0, 11.0, 12.0, 16.0, 0.22728016553269015, 0.37037566897075724, 0.14848674877086887], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.7563237543706295, 2067.8147536057695], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.905999999999997, 3, 21, 5.0, 6.0, 7.0, 11.0, 0.2261362896281234, 0.22717642822592463, 0.1327225684243185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.421999999999993, 6, 19, 9.0, 12.0, 13.0, 16.0, 0.22727871916623257, 0.35705619952139644, 0.13516869137913637], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.3039999999999985, 4, 17, 7.0, 9.0, 9.0, 13.0, 0.22727799598990706, 0.35172823537613823, 0.12984143325595274], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2067.3299999999995, 1560, 2673, 2015.5, 2444.9, 2567.0, 2643.9700000000003, 0.22705867286930412, 0.34673234116451124, 0.1250596596662964], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.140000000000011, 9, 87, 13.0, 16.0, 18.94999999999999, 66.88000000000011, 0.22601801906055158, 0.11758013567748674, 1.822270278675697], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.768, 9, 27, 14.0, 17.0, 18.0, 23.0, 0.22728367821358667, 0.41144338588018337, 0.1895510363226592], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.247999999999996, 6, 24, 9.0, 12.0, 13.0, 17.0, 0.22728295500570253, 0.38480735539349276, 0.1629157118888532], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.4228515625, 2435.4073660714284], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.7848852580372251, 3235.9447705160746], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.802000000000001, 2, 23, 3.0, 3.0, 4.0, 8.990000000000009, 0.22613833515148554, 0.19007766254710462, 0.09562294835995433], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 692.3459999999999, 526, 896, 683.0, 823.9000000000001, 840.95, 881.9300000000001, 0.2260833234610282, 0.19908358749808958, 0.10465185089895251], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7119999999999997, 2, 14, 4.0, 5.0, 5.0, 8.990000000000009, 0.22613884653810826, 0.20487428644713712, 0.11041935866118567], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 946.1160000000007, 750, 1236, 920.0, 1124.0, 1147.95, 1181.99, 0.2260537836204141, 0.21384820383880015, 0.11942880560414457], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.2320106907894735, 866.4036800986843], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.280000000000005, 19, 1450, 27.0, 33.0, 37.0, 76.92000000000007, 0.22587109446290565, 0.1175037018860688, 10.303162912463206], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.164, 26, 289, 36.0, 45.0, 53.0, 125.93000000000006, 0.226092115354006, 51.13539282925682, 0.06977061372252528], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 1.1837789221218962, 0.9258606094808126], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1079999999999988, 2, 9, 3.0, 4.0, 4.0, 7.0, 0.22728605450046846, 0.2469760407257971, 0.09744001750557191], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.905999999999999, 2, 27, 4.0, 5.0, 5.949999999999989, 8.990000000000009, 0.22728543459475234, 0.23321394431938694, 0.08367832894748206], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1759999999999993, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.22731777752318186, 0.1289118228373896, 0.08813003679365547], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.20599999999996, 89, 168, 125.5, 153.0, 158.0, 165.0, 0.22730671995948487, 0.2070422370834093, 0.0741410590492851], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.34799999999998, 70, 463, 98.0, 117.90000000000003, 128.0, 406.63000000000034, 0.22605807612822196, 0.11760097434986828, 66.84387194420344], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 250.99000000000004, 14, 461, 316.0, 412.0, 421.95, 440.96000000000004, 0.22728336826678705, 0.12667274521829885, 0.09521930174458168], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 486.57799999999986, 358, 654, 472.0, 585.0, 597.0, 622.96, 0.22724845300615615, 0.12221483940919947, 0.09675813038152742], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.378000000000005, 5, 334, 7.0, 9.0, 12.0, 28.99000000000001, 0.22583885584615496, 0.1018281817702424, 0.1638654979430597], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 456.9680000000001, 325, 608, 465.0, 542.0, 552.95, 584.95, 0.22724907271015882, 0.11688902254606226, 0.09143224409822796], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.112, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.22613700555709076, 0.13884237965214702, 0.11306850277854538], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.596000000000001, 3, 34, 4.0, 6.0, 6.0, 10.990000000000009, 0.22613383504893536, 0.13243625216523147, 0.10666273664905838], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 769.8280000000001, 545, 1136, 733.5, 981.0000000000003, 1103.9, 1121.99, 0.22606257321601592, 0.2065712992030842, 0.09956466847697575], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 278.2919999999994, 195, 384, 270.5, 337.0, 343.0, 361.96000000000004, 0.22609947653449194, 0.20020181285995034, 0.09295691369240341], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.208, 3, 45, 5.0, 6.0, 7.0, 11.0, 0.22613721010905694, 0.15076770968120531, 0.10578098011937331], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1287.3399999999986, 940, 11398, 1200.0, 1519.9, 1542.95, 1872.1800000000017, 0.22604111145318667, 0.16990830458655498, 0.12494069246338246], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.4120000000001, 142, 200, 173.5, 185.0, 186.0, 193.96000000000004, 0.22730330989987746, 4.3948362448709, 0.11453955850423511], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.1539999999999, 197, 304, 231.5, 253.0, 255.0, 262.0, 0.22728605450046846, 0.44052432151135223, 0.16247401552181923], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.171999999999999, 5, 23, 8.0, 10.900000000000034, 12.0, 17.970000000000027, 0.22723006999140616, 0.1854476970630059, 0.140243558822821], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.144, 5, 35, 8.0, 10.0, 11.0, 16.0, 0.22723141247045991, 0.18899928351095255, 0.14379487820396292], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.433999999999996, 6, 36, 9.0, 11.0, 12.0, 18.99000000000001, 0.22722738508088614, 0.18389219364295034, 0.13868858952690805], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.651999999999994, 8, 29, 11.0, 15.0, 15.0, 22.0, 0.2272286242624727, 0.20319875344080943, 0.15799490280750053], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.755999999999993, 5, 41, 9.0, 10.0, 12.0, 38.79000000000019, 0.22721107045042777, 0.1705658417636214, 0.1253654832075114], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2114.972000000001, 1706, 2814, 2065.5, 2508.7000000000003, 2703.95, 2782.95, 0.2270312485810547, 0.1897196384016546, 0.14455505280746841], "isController": false}]}, function(index, item){
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
