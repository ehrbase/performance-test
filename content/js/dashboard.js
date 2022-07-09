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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8880450967879174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.471, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.831, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.353, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.989, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.625, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.52, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.988, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.971, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 229.727802595193, 1, 6148, 17.0, 662.0, 1518.9500000000007, 2899.0, 21.193910075785922, 142.75451813976213, 175.5526802479836], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.147999999999996, 13, 139, 25.5, 41.900000000000034, 57.849999999999966, 99.96000000000004, 0.45932240758433157, 0.26676135645945104, 0.2314554319467921], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.333999999999994, 5, 55, 8.0, 14.0, 18.0, 31.970000000000027, 0.45913555793693867, 4.907606716877732, 0.16589859027018292], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.804000000000007, 5, 53, 9.0, 14.900000000000034, 18.94999999999999, 28.980000000000018, 0.4591157430788302, 4.929983952470043, 0.1936894541113815], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 27.878, 14, 292, 22.0, 42.900000000000034, 55.94999999999999, 97.92000000000007, 0.4562505874226313, 0.24626392790465096, 5.079352242791013], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 58.96400000000003, 26, 245, 51.0, 88.7000000000001, 120.0, 205.97000000000003, 0.458923585551617, 1.9086156865473891, 0.1909193822704969], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.217999999999999, 1, 40, 3.0, 5.0, 6.0, 15.970000000000027, 0.458940013786558, 0.28670753537050686, 0.1940635019234176], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 50.583999999999975, 24, 186, 46.0, 75.0, 95.94999999999999, 149.92000000000007, 0.45893538006274565, 1.8835667101010758, 0.1667226185384193], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 961.1599999999999, 558, 2846, 890.0, 1288.1000000000004, 1603.85, 2332.55, 0.4587080213354275, 1.939972085036669, 0.22308261193851844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.720000000000004, 6, 84, 11.0, 21.0, 29.94999999999999, 47.960000000000036, 0.458663418106564, 0.6820423568213341, 0.2342587574899736], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.197999999999992, 1, 32, 3.0, 7.0, 9.949999999999989, 19.960000000000036, 0.45727120663811466, 0.441065765145051, 0.25007019113021894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 21.048000000000027, 10, 102, 18.0, 32.900000000000034, 51.0, 87.96000000000004, 0.4589185309467122, 0.7478534587657111, 0.29982079805014694], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.6027652718926554, 1670.6073998057911], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.238000000000002, 2, 28, 4.0, 8.0, 10.0, 22.0, 0.4572837527997198, 0.45938707943613255, 0.2683862650709293], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 21.380000000000003, 11, 108, 19.0, 31.0, 45.89999999999998, 82.96000000000004, 0.45890336780003566, 0.7209398797007766, 0.27292202245138836], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.822, 6, 90, 11.0, 20.0, 27.94999999999999, 45.97000000000003, 0.4588978924655391, 0.7101758585635395, 0.26216334676986364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2391.5879999999993, 1499, 5079, 2245.5, 3201.1000000000004, 3629.6999999999994, 4851.75, 0.45775515043207504, 0.6990198303536524, 0.2521229539489164], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.098000000000013, 12, 116, 19.0, 41.0, 49.94999999999999, 81.99000000000001, 0.45622727417890496, 0.2462513444447486, 3.6783323980674214], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.253999999999984, 13, 130, 23.0, 40.0, 52.94999999999999, 88.93000000000006, 0.45894085629184966, 0.8308039596843405, 0.38274950319652307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.233999999999998, 10, 115, 18.0, 36.900000000000034, 58.0, 93.98000000000002, 0.45893538006274565, 0.7770125564146315, 0.32896344625591334], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 3.4001482664233573, 995.4949817518248], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.6459912729196051, 2697.381324929478], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.954, 1, 21, 2.0, 5.0, 7.0, 12.0, 0.45698659384128304, 0.38411419061047924, 0.1932374952473394], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 496.25999999999965, 309, 1601, 463.0, 668.9000000000001, 784.9, 1301.0900000000008, 0.45686633552994665, 0.4023056087995197, 0.2114791435949167], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.017999999999995, 1, 30, 3.0, 7.0, 10.0, 16.99000000000001, 0.45704215116943375, 0.4140650137318314, 0.22316511287570007], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1410.2439999999995, 921, 4350, 1316.5, 1839.7, 2320.0999999999995, 3156.820000000001, 0.4566656285134712, 0.43200836034891077, 0.241265727564246], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.682477678571428, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 55.030000000000015, 28, 982, 46.0, 76.80000000000007, 110.0, 223.4600000000005, 0.45582341765458795, 0.2460333605194017, 20.849469957134367], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 59.457999999999984, 31, 279, 50.0, 91.0, 110.94999999999999, 211.97000000000003, 0.4564642643256745, 103.29586152808488, 0.1408620190692511], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 1.537871151026393, 1.2028042521994133], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.010000000000001, 1, 35, 2.0, 5.0, 7.0, 12.0, 0.4591777229009379, 0.49895668364170176, 0.1968545120639763], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.082, 2, 26, 3.0, 7.0, 9.0, 12.990000000000009, 0.4591730843758093, 0.47115014793408844, 0.16905102813445322], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7360000000000007, 1, 43, 2.0, 4.900000000000034, 7.0, 12.0, 0.45915832605567386, 0.2603885073474515, 0.17801353070713136], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 160.12999999999997, 88, 895, 141.5, 201.0, 261.0, 685.6000000000004, 0.45911785096116325, 0.41818731520506497, 0.14975133029397314], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 209.0319999999998, 109, 801, 188.0, 293.50000000000017, 368.6499999999999, 670.9200000000001, 0.456319292084503, 0.24630101164846258, 134.98762433559912], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.99, 1, 20, 2.0, 5.0, 6.0, 14.980000000000018, 0.4591697109618504, 0.25591088451468513, 0.19236699804944707], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 4.071999999999997, 1, 31, 3.0, 6.0, 9.0, 16.99000000000001, 0.45921019520106976, 0.24696449863201284, 0.1955230909254555], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.23799999999999, 7, 326, 12.0, 30.0, 38.0, 50.98000000000002, 0.4556983714251602, 0.19256371318298932, 0.330648330047748], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.623999999999999, 2, 76, 5.0, 8.0, 11.949999999999989, 21.0, 0.4591789879695105, 0.23618570776701256, 0.18474779594085772], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.562000000000003, 2, 50, 4.0, 7.0, 10.0, 16.99000000000001, 0.45698116415037604, 0.28057483175095993, 0.22849058207518805], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.999999999999997, 2, 31, 4.0, 8.0, 10.0, 20.0, 0.45696905222790696, 0.26762588897617, 0.21554301975203033], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 638.1880000000004, 370, 2303, 604.5, 854.8000000000001, 1044.3999999999999, 1678.3800000000006, 0.45649968821071296, 0.417139964116842, 0.20105601502249176], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.25999999999998, 5, 208, 17.0, 41.900000000000034, 51.0, 70.99000000000001, 0.45656680028855023, 0.40427117528284306, 0.18770959269675744], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.095999999999991, 5, 66, 9.0, 18.900000000000034, 24.94999999999999, 48.98000000000002, 0.4572904443674164, 0.30487964772859266, 0.2139083230976489], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 655.6960000000001, 386, 4238, 627.0, 795.9000000000001, 835.9, 961.7800000000002, 0.45710357235583865, 0.34359100652149666, 0.2526568573763718], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 210.52799999999996, 143, 849, 189.0, 257.0, 331.69999999999993, 663.97, 0.4592325489335242, 8.87911333876529, 0.23141015161103373], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 326.234, 208, 1351, 287.0, 422.1000000000003, 544.4999999999999, 1219.3900000000006, 0.45912459631469865, 0.8898722437028767, 0.3282023481468354], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.139999999999993, 10, 112, 17.0, 27.0, 45.89999999999998, 89.94000000000005, 0.4586524790166491, 0.3743168586318396, 0.28307457689308807], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.58400000000001, 10, 103, 17.0, 28.900000000000034, 36.94999999999999, 58.950000000000045, 0.45865710702947055, 0.3814871529571, 0.29024395054208685], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.598000000000017, 10, 109, 18.0, 30.800000000000068, 50.94999999999999, 94.94000000000005, 0.45863354720944416, 0.3711662176835337, 0.27992770215420176], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.047999999999988, 12, 88, 20.0, 32.0, 42.0, 68.99000000000001, 0.45864154044851474, 0.4101393017618256, 0.3188991960931079], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.60799999999999, 10, 191, 17.0, 34.900000000000034, 48.799999999999955, 99.95000000000005, 0.45887557130008627, 0.3444748441543841, 0.2531881814302234], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2692.4840000000013, 1696, 6148, 2550.0, 3511.0000000000005, 3952.65, 5127.110000000001, 0.4578301779677468, 0.38258775545779355, 0.2915090586279013], "isController": false}]}, function(index, item){
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
