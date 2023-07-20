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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8891937885556265, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.157, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.572, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.955, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.114, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.5792810040438, 1, 18840, 9.0, 838.0, 1517.0, 6021.990000000002, 15.208955716412667, 95.80514310038816, 125.8554064485034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6187.556, 5205, 18840, 6015.0, 6530.0, 6743.75, 16075.80000000008, 0.3279725132796071, 0.1904770833715968, 0.165267399269802], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3340000000000014, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.3290969776391768, 0.16895466026825354, 0.11891199387353067], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6319999999999983, 2, 19, 3.0, 5.0, 5.0, 8.0, 0.32909307871182436, 0.18887821610324834, 0.13883614258155091], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.37200000000001, 8, 397, 11.0, 15.0, 17.94999999999999, 47.90000000000009, 0.3269788268130485, 0.17010243245271395, 3.5977250407252126], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.29800000000001, 24, 68, 34.0, 40.0, 42.0, 43.0, 0.32905864219874353, 1.3685208301935654, 0.13689353669596166], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2680000000000002, 1, 9, 2.0, 3.0, 4.0, 5.990000000000009, 0.3290655722384488, 0.20557279025064268, 0.1391458913859847], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.236000000000004, 21, 50, 30.0, 35.900000000000034, 37.0, 39.99000000000001, 0.3290623237459928, 1.3505405455376187, 0.11954217229834896], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 858.1600000000001, 664, 1097, 857.0, 1004.7, 1059.95, 1081.99, 0.32890538970684, 1.3910096291575287, 0.15995594147852182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.592000000000001, 3, 14, 5.0, 8.0, 9.0, 11.990000000000009, 0.32904153491295207, 0.48929183166728635, 0.16805539331979874], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9299999999999975, 2, 32, 4.0, 5.0, 5.0, 9.990000000000009, 0.32717310008944916, 0.3155782643450682, 0.17892278911141749], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.770000000000001, 5, 19, 7.0, 10.0, 10.949999999999989, 16.0, 0.32906124092942685, 0.5362380696790469, 0.21498239275565098], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.0399451622596154, 2843.2452862079326], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.139999999999998, 2, 17, 4.0, 5.0, 6.0, 11.0, 0.3271793086570336, 0.32868420567243856, 0.19202613720984105], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.16600000000001, 5, 26, 8.0, 10.0, 11.0, 14.990000000000009, 0.329058425639706, 0.5169527147566909, 0.19569978634236423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.665999999999996, 4, 16, 6.0, 8.0, 10.0, 12.0, 0.32905647662119547, 0.5092373916663815, 0.1879863660384759], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1573.36, 1329, 1915, 1558.5, 1751.7, 1797.9, 1887.99, 0.32874168858825825, 0.5020084627561966, 0.1810647581677516], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.488, 8, 53, 11.0, 14.0, 16.0, 26.99000000000001, 0.326969846186845, 0.17009776050995526, 2.6361943848814375], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.187999999999992, 8, 22, 11.0, 14.0, 15.0, 19.99000000000001, 0.32906448940050376, 0.5956934908658279, 0.2744346425273732], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.869999999999999, 5, 21, 8.0, 10.0, 11.0, 15.0, 0.32906319000437656, 0.5571290460375856, 0.23587146627266836], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 1.1258912317961165, 4641.85281401699], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.283999999999999, 1, 15, 2.0, 3.0, 4.0, 7.980000000000018, 0.3271861597636931, 0.2750121089552815, 0.13835117888445225], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 570.3660000000008, 433, 722, 557.5, 658.9000000000001, 668.0, 684.0, 0.32708641884855116, 0.28802450658196005, 0.15140523684981763], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2800000000000007, 2, 17, 3.0, 4.0, 5.0, 8.990000000000009, 0.3271868020696528, 0.296420379050818, 0.15975918069807266], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 774.9520000000002, 628, 949, 763.0, 890.0, 908.95, 932.98, 0.3270380685393302, 0.30937992907688927, 0.17278085457009537], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.867350260416666, 1371.8058268229167], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.26600000000001, 16, 581, 21.0, 26.0, 32.0, 65.99000000000001, 0.3268473740428275, 0.17003404748667442, 14.909219571816866], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.73199999999999, 20, 244, 28.0, 35.0, 41.0, 93.97000000000003, 0.3271018254898677, 73.98082111533054, 0.10094157895976386], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 1.4173353040540542, 1.1085304054054055], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.644000000000001, 1, 11, 2.0, 3.900000000000034, 4.0, 7.0, 0.32905171245092196, 0.35755774507936067, 0.14106806813081516], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.308000000000001, 2, 8, 3.0, 4.0, 5.0, 7.990000000000009, 0.3290501966074925, 0.33763313679439294, 0.12114445714943814], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8580000000000014, 1, 21, 2.0, 3.0, 3.0, 7.980000000000018, 0.329098060690948, 0.1866313816639066, 0.12758977548272102], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.63000000000001, 66, 118, 91.0, 112.0, 114.0, 117.0, 0.329081165895081, 0.29974345140820413, 0.10733702090718462], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.30800000000002, 59, 389, 80.0, 93.0, 108.0, 319.98, 0.3270421328379735, 0.17013536580480162, 96.70418691602539], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.42400000000004, 13, 369, 261.0, 335.0, 339.0, 349.98, 0.32904586570322036, 0.18338844337449697, 0.13785222303386868], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 429.83200000000016, 334, 550, 416.5, 497.90000000000003, 510.95, 528.99, 0.3289891413843995, 0.1769312598162135, 0.14007740785507633], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.269999999999995, 4, 307, 6.0, 8.0, 10.0, 24.980000000000018, 0.32678542484719514, 0.14734384619745944, 0.23711090884908786], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.4260000000002, 297, 510, 402.0, 468.0, 476.0, 493.99, 0.32897896771663593, 0.169215343834013, 0.13236263154224023], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4139999999999997, 2, 11, 3.0, 5.0, 5.0, 9.0, 0.3271842328609447, 0.2008828115644576, 0.16359211643047236], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.171999999999998, 2, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.32717888047239396, 0.19161371719540957, 0.15432363209781863], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.2040000000004, 536, 883, 682.0, 779.0, 826.9, 852.97, 0.32702502068433253, 0.29882869346146174, 0.14403152766468164], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.17199999999977, 164, 317, 239.0, 288.0, 292.0, 298.0, 0.3271056773769788, 0.2896386608735161, 0.13448387712471493], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.518000000000002, 3, 39, 4.0, 5.0, 6.0, 9.990000000000009, 0.32718102140679983, 0.2181345264889027, 0.15304659106821988], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 985.9499999999994, 824, 9259, 933.5, 1082.6000000000001, 1098.0, 1136.88, 0.3270098351478019, 0.24580345723790487, 0.1807495768492733], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.50599999999997, 117, 170, 141.0, 150.0, 150.0, 154.99, 0.3290634065696851, 6.362334920200479, 0.16581710721675538], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.188, 160, 219, 179.5, 202.0, 205.0, 212.96000000000004, 0.3290426175998315, 0.637748216383361, 0.23521405867487957], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.194000000000004, 5, 41, 7.0, 9.0, 10.0, 13.990000000000009, 0.32903720423668303, 0.2685348456568734, 0.20307764948982782], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.965999999999999, 5, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.32903871996041006, 0.2736773126733211, 0.208219814974947], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.411999999999999, 5, 22, 8.0, 10.0, 11.0, 16.99000000000001, 0.3290324406244509, 0.2662817127635632, 0.2008254642483221], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.78600000000001, 7, 18, 9.0, 12.0, 13.0, 16.0, 0.3290350389412968, 0.2942389409266943, 0.22878217551387048], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.784000000000002, 6, 31, 8.0, 9.0, 11.0, 17.970000000000027, 0.3289999651260037, 0.24697808905469756, 0.18152830107050008], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.0259999999994, 1389, 1962, 1592.5, 1802.8000000000002, 1864.8, 1942.98, 0.3286950085033398, 0.2746753962171806, 0.20928627494548593], "isController": false}]}, function(index, item){
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
