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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.910202226766644, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.975, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.784, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.591, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 201.48702567598298, 1, 3350, 14.0, 607.9000000000015, 1289.8500000000022, 2270.9900000000016, 24.377922608819922, 163.8988659727323, 214.74108263304277], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.749999999999988, 4, 51, 8.0, 11.0, 14.0, 35.940000000000055, 0.5636565527892544, 6.026036793386053, 0.2036649653633048], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.051999999999998, 5, 43, 8.0, 10.0, 12.0, 23.970000000000027, 0.5636393970411187, 6.051879871253489, 0.23778537062672192], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.215999999999998, 12, 254, 19.0, 28.0, 34.94999999999999, 85.7800000000002, 0.560355938091876, 0.301979317262325, 6.238337592038463], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.27400000000002, 26, 136, 44.0, 53.0, 55.0, 70.91000000000008, 0.5635098095787652, 2.343738553706993, 0.23442888562554096], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.426000000000002, 1, 21, 2.0, 3.0, 4.0, 6.990000000000009, 0.5635377547754189, 0.35221109673463685, 0.23829282013452774], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.22999999999996, 23, 63, 39.0, 47.0, 49.0, 58.99000000000001, 0.5635021886425007, 2.3122519885992237, 0.20470977946778346], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 778.7380000000004, 580, 1586, 779.5, 918.9000000000001, 934.95, 1017.7400000000002, 0.5631740489398249, 2.3819402401937317, 0.27388737926956325], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.299999999999999, 5, 41, 9.0, 12.0, 14.0, 28.970000000000027, 0.563194982608539, 0.8376425376101609, 0.2876474374065096], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5340000000000016, 2, 18, 3.0, 5.0, 6.949999999999989, 12.0, 0.5612932195779076, 0.5415602548271217, 0.3069572294566682], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.98200000000001, 9, 50, 14.0, 17.0, 20.0, 29.980000000000018, 0.5634990133132276, 0.9184373566599385, 0.36814535147123956], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.6647317951713395, 1842.352085767134], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.800000000000005, 3, 43, 4.0, 6.0, 7.0, 18.980000000000018, 0.5613014109994869, 0.563406291290735, 0.32943569141669105], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.09799999999999, 10, 100, 15.0, 18.0, 20.0, 33.99000000000001, 0.5634913926689771, 0.8847695320203983, 0.33512329896035836], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.951999999999998, 5, 35, 9.0, 11.0, 12.949999999999989, 21.980000000000018, 0.5634913926689771, 0.872201032597977, 0.3219164694446792], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1984.8060000000003, 1516, 3126, 1978.5, 2247.9, 2308.8, 2517.3800000000006, 0.562252608852105, 0.8587530080514574, 0.3096781947193235], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.65, 12, 271, 16.0, 23.900000000000034, 33.89999999999998, 83.93000000000006, 0.5603201445177717, 0.30259476554524195, 4.517581165174534], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.895999999999965, 12, 80, 19.0, 23.0, 24.0, 31.0, 0.56350917449287, 1.0202597749118953, 0.46995784669620205], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.111999999999997, 9, 49, 14.0, 17.0, 19.94999999999999, 25.980000000000018, 0.5635085394084062, 0.9542224680997816, 0.4039211600837599], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.8222761445242369, 3433.471022217235], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5000000000000004, 1, 21, 2.0, 3.0, 4.949999999999989, 16.0, 0.561187382711837, 0.4718577505028239, 0.2372989616349858], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 413.38000000000005, 306, 667, 412.5, 486.0, 500.95, 589.97, 0.5610072998269854, 0.49353302341420063, 0.2596850196464756], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3020000000000005, 1, 32, 3.0, 4.0, 6.0, 15.970000000000027, 0.56124974603449, 0.5086325823437565, 0.2740477275559033], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1168.3440000000003, 904, 1863, 1162.0, 1345.8000000000002, 1384.95, 1486.97, 0.5606877171263185, 0.5305726541947291, 0.2962227099270882], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.1965144230769225, 1013.0258413461538], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.41999999999997, 27, 683, 41.0, 51.0, 62.0, 97.99000000000001, 0.5599022634608903, 0.3023690934510472, 25.61006075779412], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.51999999999998, 29, 202, 43.0, 51.0, 59.0, 104.88000000000011, 0.5606487378675613, 126.87250984359022, 0.17301269645131775], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.7081891286644952, 1.3360138436482085], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.4280000000000013, 1, 28, 2.0, 3.0, 4.0, 7.990000000000009, 0.5637836649320922, 0.6127843936224792, 0.24170022354022314], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5020000000000016, 2, 28, 3.0, 5.0, 6.949999999999989, 13.0, 0.5637766722743653, 0.5786418775003496, 0.20756231000726144], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2800000000000016, 1, 27, 2.0, 3.0, 4.0, 9.990000000000009, 0.5636718032199188, 0.31981769303786406, 0.21853291589678492], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.052, 84, 256, 119.5, 151.0, 157.0, 186.94000000000005, 0.5636108064481585, 0.5135242992345038, 0.18383399350945798], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 166.31400000000005, 110, 628, 164.0, 193.90000000000003, 240.5499999999999, 374.4800000000005, 0.560434448784698, 0.3026564943143925, 165.78679917672181], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4880000000000004, 1, 19, 2.0, 4.0, 5.0, 12.990000000000009, 0.5637722224915801, 0.3137304328755879, 0.23618972993055454], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 475.6220000000001, 357, 755, 480.5, 549.9000000000001, 570.9, 603.98, 0.5635625266987747, 0.6124559787221333, 0.24215577319087978], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.957999999999995, 7, 316, 10.0, 18.0, 25.94999999999999, 94.94000000000005, 0.5597230042796421, 0.23667974692684085, 0.4061271408005606], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.2279999999999993, 1, 25, 3.0, 4.0, 6.0, 14.950000000000045, 0.5637874791821473, 0.6001253440513091, 0.22903866341774734], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9120000000000004, 2, 17, 4.0, 5.0, 7.0, 12.0, 0.5611817140060855, 0.3447102520603787, 0.28059085700304276], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.398000000000001, 2, 38, 4.0, 5.0, 7.0, 18.980000000000018, 0.5611590403282556, 0.32880412519233726, 0.2646873207798315], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 538.3560000000001, 376, 1717, 533.5, 644.0, 666.9, 882.8600000000001, 0.560614164028977, 0.5118013135750478, 0.2469111210713561], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.50999999999999, 6, 130, 16.0, 32.0, 37.94999999999999, 55.99000000000001, 0.560768207582932, 0.49669605886496027, 0.23055021034415465], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.682000000000004, 5, 43, 7.0, 9.0, 11.0, 17.980000000000018, 0.5613083423891079, 0.3743882791521101, 0.26256513281678], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 549.9120000000005, 379, 2955, 536.0, 609.9000000000001, 645.9, 727.7200000000003, 0.5610948081897398, 0.42191699443955044, 0.3101363881205007], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.004000000000003, 9, 71, 14.0, 17.0, 18.0, 22.99000000000001, 0.5631727802826452, 0.4597777776526283, 0.34758320033069506], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.940000000000008, 9, 111, 14.0, 17.0, 18.0, 26.99000000000001, 0.5631848327566321, 0.4679493975611844, 0.3563904019788062], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.925999999999993, 9, 35, 14.0, 17.0, 18.0, 24.99000000000001, 0.5631683400275277, 0.4559243690261919, 0.3437306762863328], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.954000000000004, 11, 77, 17.0, 21.0, 22.0, 30.950000000000045, 0.5631664370824825, 0.5037699769214394, 0.3915766632839136], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.370000000000008, 9, 35, 14.0, 16.0, 18.0, 24.980000000000018, 0.562954022419081, 0.4227652766018294, 0.3106142799480281], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2207.026, 1677, 3350, 2185.0, 2501.0000000000005, 2613.45, 2785.9300000000003, 0.5619158182674338, 0.4690899590700518, 0.35778233741246757], "isController": false}]}, function(index, item){
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
