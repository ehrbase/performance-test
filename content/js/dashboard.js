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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8706658157838758, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.459, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.988, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.807, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.487, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.4121676239124, 1, 24752, 13.0, 1019.0, 1809.8500000000022, 10499.0, 10.179387617048882, 64.21246101460734, 84.33744138082386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11035.75199999999, 9074, 24752, 10577.5, 12763.6, 13406.65, 22330.150000000074, 0.21918720998792277, 0.12734734090296362, 0.11087790505248436], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.1719999999999997, 2, 17, 3.0, 4.0, 5.0, 9.0, 0.22001135258579343, 0.11295133610144283, 0.07992599918155777], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.557999999999996, 2, 18, 4.0, 6.0, 7.0, 11.0, 0.22000990044552005, 0.12620919503877676, 0.09324638358726142], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.173999999999996, 10, 451, 14.0, 19.0, 22.0, 43.99000000000001, 0.21884203675408237, 0.12859320501494034, 2.436754788154343], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.629999999999995, 27, 85, 46.0, 56.0, 58.0, 64.0, 0.2199575393965949, 0.914780637308274, 0.09193537779467051], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6759999999999953, 1, 11, 2.0, 4.0, 4.0, 8.0, 0.21996295823783277, 0.1374270135409197, 0.09344129573579808], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.08799999999997, 24, 73, 40.0, 49.0, 52.0, 60.950000000000045, 0.21995695882229765, 0.902749326574276, 0.08033584238236262], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1130.3440000000003, 762, 1758, 1116.5, 1474.8000000000002, 1533.6999999999998, 1619.0, 0.21986391303238945, 0.9299127024836708, 0.10735542628534642], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.6439999999999975, 4, 19, 6.0, 9.0, 10.0, 14.990000000000009, 0.21988673194663963, 0.3269762945336598, 0.11273489674998614], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.400000000000004, 3, 17, 4.0, 5.0, 6.0, 12.980000000000018, 0.21894591554205098, 0.21118659203128826, 0.1201636763033522], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.414000000000001, 6, 40, 10.0, 12.0, 14.0, 22.0, 0.21995579768289766, 0.35850217415308216, 0.14413119164572685], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.8566956227436823, 2135.0035960063174], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.706, 3, 20, 4.0, 6.0, 7.0, 12.0, 0.21894735367091514, 0.2199544259714913, 0.12893091236675958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.050000000000004, 8, 33, 17.0, 20.0, 21.0, 25.0, 0.21995473331588358, 0.3455501748365186, 0.13124252153906726], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.836, 5, 31, 8.0, 9.0, 10.949999999999989, 17.970000000000027, 0.21995453979571503, 0.3403946862887378, 0.12608722154305146], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2205.1360000000013, 1564, 3375, 2124.0, 2832.4, 3126.7, 3329.98, 0.2196976520911921, 0.3354916167495293, 0.1214344444175925], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.937999999999999, 9, 93, 12.0, 18.0, 21.0, 45.950000000000045, 0.2188378223535833, 0.1285907286019283, 1.7648073603475494], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.729999999999993, 10, 40, 15.0, 18.0, 19.0, 25.99000000000001, 0.2199577329220417, 0.3981814932567557, 0.18387091736451922], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.277999999999997, 7, 33, 10.0, 12.0, 14.0, 20.0, 0.21995695882229765, 0.3723415933220187, 0.15809406415352645], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.6910647199453552, 2612.6302083333335], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.837999999999999, 1, 19, 3.0, 3.0, 4.0, 9.990000000000009, 0.2189454361699612, 0.1840937700608756, 0.09300904759173156], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 708.542, 543, 1124, 694.5, 852.9000000000001, 878.95, 963.94, 0.21887949458098147, 0.1926780800831917, 0.1017447650591281], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7940000000000005, 2, 13, 4.0, 5.0, 6.0, 11.0, 0.21895157229124063, 0.19836285461944025, 0.10733758719746365], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 962.7600000000001, 769, 1360, 933.0, 1158.0, 1203.9, 1269.99, 0.21887144629376223, 0.20705367064377972, 0.11606171419678994], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.056640625, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.56600000000002, 20, 549, 27.0, 34.0, 39.0, 88.87000000000012, 0.21878640058739773, 0.1285605127904718, 10.007768558118858], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.59000000000003, 26, 242, 35.0, 42.0, 49.0, 112.0, 0.21890670984090735, 49.53756658731663, 0.06798079465762553], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1025.0, 1025, 1025, 1025.0, 1025.0, 1025.0, 1025.0, 0.975609756097561, 0.5116234756097562, 0.40205792682926833], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.156, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.21996005525396586, 0.23895309049376634, 0.09472889098339742], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8720000000000043, 2, 19, 4.0, 5.0, 6.0, 10.0, 0.21995918437374762, 0.22574643080479986, 0.08141067468520542], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.152, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.2200120302578145, 0.12476873641700728, 0.08572734382116014], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 205.4460000000001, 89, 371, 220.0, 304.0, 317.95, 342.94000000000005, 0.21998337805595408, 0.20037177397125874, 0.07218204592460994], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.44599999999991, 82, 374, 111.5, 132.0, 139.95, 286.85000000000014, 0.21887403317867693, 0.12867399216168313, 64.74738489305159], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 278.83200000000016, 16, 593, 342.5, 458.90000000000003, 483.95, 516.98, 0.21995666853629836, 0.12261424343154398, 0.09257941810463338], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 503.4560000000002, 309, 1216, 468.0, 808.8000000000001, 897.4499999999998, 957.8700000000001, 0.21998376519812837, 0.11830787044166141, 0.0940946183171682], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.356000000000002, 5, 279, 7.0, 11.0, 13.0, 28.99000000000001, 0.2187618951780503, 0.10290995363888536, 0.15915782412856197], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 511.6819999999995, 294, 1098, 453.5, 880.0, 942.9, 1017.9300000000001, 0.21992996550178562, 0.11312432825141162, 0.08891699777122973], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.164000000000004, 2, 23, 4.0, 5.0, 6.0, 13.980000000000018, 0.2189441898123517, 0.1344261734149645, 0.1098997202769031], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.543999999999997, 3, 39, 4.0, 5.0, 6.0, 11.990000000000009, 0.21894073843456496, 0.12822358422518843, 0.10369751771558985], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 861.5899999999997, 576, 1467, 868.5, 1111.5000000000002, 1224.4499999999998, 1321.98, 0.21885276505148948, 0.19998312576789964, 0.09681670172687963], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 471.1899999999998, 246, 1072, 386.0, 833.9000000000001, 895.95, 954.8500000000001, 0.21889310136501738, 0.19382086322136224, 0.09042166198965074], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.635999999999995, 3, 54, 5.0, 6.900000000000034, 7.0, 13.0, 0.21894802480418382, 0.14603662201294684, 0.10284570305743401], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1190.9759999999992, 900, 10497, 1107.0, 1420.8000000000002, 1459.8, 1629.4100000000005, 0.2188627279838322, 0.16445054703644546, 0.12140041942853191], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.548, 142, 277, 170.0, 188.0, 191.95, 225.98000000000002, 0.22007100370863655, 4.255064260182905, 0.11132498039167356], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.7079999999998, 194, 455, 222.0, 259.0, 264.0, 295.0, 0.22004039941733303, 0.42648084094489747, 0.15772427067609612], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.198000000000013, 6, 28, 9.0, 11.0, 13.0, 18.0, 0.21988470125804832, 0.17951524438645353, 0.13613955136484635], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.97999999999999, 6, 24, 9.0, 11.0, 12.0, 18.0, 0.2198856682479378, 0.18282720279263592, 0.1395758636339449], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.027999999999999, 6, 29, 10.0, 12.0, 13.0, 17.0, 0.21988257391022897, 0.17794813264174403, 0.13463513070479843], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.17999999999999, 8, 28, 12.0, 15.0, 16.0, 23.0, 0.219883250789161, 0.196630167558733, 0.15331703228853608], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.648, 6, 33, 10.0, 12.0, 13.0, 25.950000000000045, 0.21987242122630765, 0.16505676652429196, 0.12174576448761372], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1974.965999999999, 1561, 2905, 1905.5, 2457.9, 2578.9, 2715.98, 0.21971473995881666, 0.1836055665333584, 0.14032562493463488], "isController": false}]}, function(index, item){
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
