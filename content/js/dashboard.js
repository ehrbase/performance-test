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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8690278664114018, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.434, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.687, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.985, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.756, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.488, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.84, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.456, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.997, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 514.9392469687338, 1, 24761, 21.0, 1021.9000000000015, 1951.9500000000007, 10986.960000000006, 9.629853899076837, 64.38475093763557, 79.78448893713944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11729.237999999996, 9136, 24761, 11084.0, 14011.6, 14870.3, 22144.410000000003, 0.20721171359528487, 0.12034265448462095, 0.1048199879319898], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.595999999999994, 5, 20, 7.0, 9.0, 10.0, 13.0, 0.20791179217469913, 2.21999156151008, 0.07553045575096493], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.49200000000001, 6, 34, 9.0, 11.900000000000034, 13.0, 18.99000000000001, 0.20790954437870807, 2.2325087292121646, 0.08811791236363213], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.970000000000034, 15, 301, 22.0, 29.0, 35.0, 56.97000000000003, 0.2068769198178159, 0.12160928405173412, 2.3035260153932975], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.02599999999997, 26, 89, 46.0, 56.0, 57.0, 69.0, 0.20783885006921035, 0.8644155792364832, 0.08687014436486526], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.0799999999999983, 1, 24, 3.0, 4.0, 5.0, 11.0, 0.20784247867951855, 0.12990154917469907, 0.08829245920467828], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.797999999999995, 24, 73, 41.0, 49.0, 51.0, 56.99000000000001, 0.20783746777480064, 0.8529377702666471, 0.07590938764431195], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1191.8140000000003, 816, 2714, 1161.5, 1568.2000000000003, 1645.5, 2503.78, 0.20777208897798155, 0.8786998170670642, 0.10145121532128006], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.03600000000001, 7, 32, 11.0, 14.0, 14.949999999999989, 18.99000000000001, 0.2077493844385739, 0.30893956508081866, 0.10651213557641728], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.859999999999997, 3, 24, 5.0, 6.0, 7.0, 13.990000000000009, 0.20697668738779276, 0.1996767166439475, 0.11359462725775343], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.45200000000003, 12, 41, 19.0, 23.0, 24.0, 31.99000000000001, 0.20783599910713657, 0.33867769099816564, 0.1361894095711803], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.6387743943472409, 1591.9138522039032], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.304000000000002, 3, 16, 5.0, 7.0, 8.0, 13.0, 0.20697780121686388, 0.20797671165984608, 0.12188243567750873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.601999999999986, 12, 41, 23.0, 30.0, 31.0, 34.0, 0.20783582632407008, 0.3265701606986609, 0.12401141590235042], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.852000000000002, 8, 32, 12.0, 15.0, 17.94999999999999, 25.99000000000001, 0.20783660385013153, 0.3216766680238397, 0.11914070943362032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2411.0960000000023, 1686, 5576, 2282.0, 3083.8, 3463.85, 4167.35, 0.20760670984886231, 0.31696922100772296, 0.11475136501411726], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.99799999999999, 14, 86, 19.0, 26.0, 32.0, 51.97000000000003, 0.20687212654616227, 0.1215713143041318, 1.6683105674005936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.194000000000017, 15, 48, 23.0, 28.0, 30.0, 37.0, 0.20783703581156832, 0.37626337963907847, 0.17373877212373284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.44600000000002, 12, 34, 19.0, 23.0, 24.0, 29.99000000000001, 0.2078362582822749, 0.3518590725982442, 0.1493823106403851], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 5.035998774509804, 1337.1055453431372], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.7016080097087379, 2652.4900312066575], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7540000000000036, 1, 12, 3.0, 3.0, 4.0, 8.990000000000009, 0.2069840560181649, 0.1739660564259235, 0.08792779723427904], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.002, 404, 1139, 543.5, 647.9000000000001, 664.9, 939.96, 0.20694336374021158, 0.1822059522343675, 0.09619632923861399], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.719999999999997, 2, 14, 3.0, 5.0, 6.0, 11.0, 0.20697865801661458, 0.18752751522535008, 0.1014680530511138], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 823.5239999999999, 605, 1956, 792.5, 964.9000000000001, 1003.8, 1652.4300000000014, 0.20692049742032217, 0.19570112255921754, 0.10972444345628411], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 7.5827205882352935, 968.362247242647], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, 1.4, 44.27800000000002, 11, 746, 42.0, 52.0, 58.94999999999999, 93.91000000000008, 0.20680949205934276, 0.12081955939030907, 9.459918562558217], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.26399999999999, 11, 220, 46.0, 55.0, 65.89999999999998, 121.79000000000019, 0.20693094507431925, 46.297967401392235, 0.06426175833362649], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1066.0, 1066, 1066, 1066.0, 1066.0, 1066.0, 1066.0, 0.9380863039399625, 0.49194564962476545, 0.38659416041275796], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.51, 2, 17, 3.0, 5.0, 5.0, 8.0, 0.20788490826246883, 0.2258706070540754, 0.08952855912475464], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.334000000000009, 2, 22, 4.0, 5.0, 6.0, 13.990000000000009, 0.2078839575118452, 0.21329462473411642, 0.07694142568065365], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.5159999999999996, 1, 20, 2.0, 4.0, 4.0, 7.0, 0.2079133483696267, 0.1178722496182711, 0.08101311132761821], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.11599999999996, 91, 530, 194.0, 268.0, 275.95, 299.93000000000006, 0.20789683660015493, 0.18939807862783098, 0.06821614950942582], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 160.44600000000005, 32, 527, 158.0, 192.0, 211.95, 383.85000000000014, 0.20688890396879123, 0.1210049558685279, 61.20194022483032], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 260.49599999999975, 18, 888, 314.5, 424.90000000000003, 441.0, 471.0, 0.20788162388809317, 0.11591836644541131, 0.08749705067946108], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 552.2679999999993, 337, 1643, 512.0, 876.7, 926.9, 1083.88, 0.20790807469222328, 0.11178997898153319, 0.08892943038593144], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.304000000000004, 9, 369, 13.0, 18.0, 23.94999999999999, 45.98000000000002, 0.20678041243593942, 0.09728533763519304, 0.15044082740700673], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 565.9439999999994, 320, 2024, 497.0, 936.0, 993.9, 1263.8100000000002, 0.20785630311767825, 0.10693760229128318, 0.08403565379953008], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.560000000000004, 2, 14, 4.0, 6.0, 7.0, 12.0, 0.20698319917372307, 0.12712932349093722, 0.10389586364774771], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.894000000000002, 3, 30, 5.0, 6.0, 7.0, 11.0, 0.20698097141137428, 0.12124274234160057, 0.09803297962355129], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 916.3260000000006, 597, 2139, 891.0, 1270.7, 1368.85, 1908.2200000000007, 0.20689489656496543, 0.18903283579765842, 0.09152674623430598], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 525.1060000000003, 265, 1996, 418.0, 944.8000000000001, 1005.5999999999999, 1195.5900000000004, 0.20691347581947048, 0.18322511586120077, 0.08547304714026954], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.013999999999994, 6, 51, 10.0, 12.0, 15.0, 20.99000000000001, 0.20697814393591293, 0.13798246475990122, 0.0972231320636466], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1265.322, 943, 9554, 1177.0, 1495.9, 1566.0, 2159.4400000000005, 0.20689772176642654, 0.15549535672374148, 0.11476358004231473], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.7939999999998, 143, 365, 180.0, 187.0, 192.0, 226.98000000000002, 0.20798417989134074, 4.021365993817047, 0.1052107472497212], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 259.80799999999965, 211, 520, 264.0, 283.0, 293.84999999999997, 483.8900000000001, 0.2079650618696059, 0.40311183971092857, 0.14906870645731518], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.66, 11, 39, 18.0, 21.0, 23.0, 32.99000000000001, 0.2077447232840286, 0.1695334897477979, 0.1286231978145255], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.495999999999984, 11, 47, 18.0, 21.0, 23.0, 34.99000000000001, 0.20774636329603732, 0.1727690981491461, 0.13187025013908618], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.146000000000008, 12, 63, 19.0, 23.0, 25.0, 36.98000000000002, 0.2077423064714221, 0.16815847066138503, 0.12720158804451337], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.353999999999992, 14, 44, 21.0, 25.0, 26.0, 34.99000000000001, 0.2077434285559962, 0.18582122210784793, 0.14485235155173953], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.14599999999999, 11, 59, 18.0, 21.0, 24.0, 37.98000000000002, 0.20771770997040853, 0.15594407076028421, 0.11501556792306801], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2116.9380000000006, 1702, 4378, 2029.0, 2592.6000000000004, 2709.65, 3278.3600000000006, 0.20757051170282545, 0.17342191923846528, 0.13256944790395297], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
