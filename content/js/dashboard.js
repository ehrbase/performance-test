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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9119745512383549, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.98, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.815, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.72, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.615, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 198.16041808679904, 1, 3404, 13.0, 588.0, 1261.9500000000007, 2234.9900000000016, 24.79514846665585, 166.7029134088174, 218.41635611109422], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.658000000000002, 4, 33, 7.0, 10.0, 13.0, 24.960000000000036, 0.5736576411197798, 6.131872463357618, 0.2072786398577329], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.883999999999994, 4, 32, 8.0, 10.0, 11.0, 14.990000000000009, 0.5736438199630344, 6.159298845197626, 0.24200598654690514], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.36199999999999, 13, 282, 19.0, 27.0, 32.0, 59.950000000000045, 0.5700831751352522, 0.30722138610023203, 6.346629098185425], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.75599999999997, 26, 77, 45.0, 54.0, 56.0, 60.99000000000001, 0.5734668364128502, 2.385151617463212, 0.23857116436706466], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4299999999999997, 1, 12, 2.0, 3.0, 4.0, 8.0, 0.5735016981385282, 0.35843856133658014, 0.24250608915427999], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.676, 23, 92, 40.0, 47.0, 49.0, 55.97000000000003, 0.5734517090581285, 2.353078446473444, 0.20832425368127325], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 758.7139999999997, 572, 1332, 759.5, 899.9000000000001, 920.95, 971.9100000000001, 0.5730974311480747, 2.423911107717101, 0.2787133991325597], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.650000000000002, 5, 38, 9.0, 11.0, 12.0, 16.99000000000001, 0.5732386954463065, 0.8525805987936765, 0.29277718527189284], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.368000000000002, 1, 22, 3.0, 5.0, 6.0, 9.990000000000009, 0.5709587539396154, 0.5508859852464257, 0.31224306856072714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.152000000000006, 8, 37, 13.0, 17.0, 18.0, 29.0, 0.5734398708154659, 0.9346397894443482, 0.3746399156011198], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.6828125, 1892.4640625], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.493999999999998, 2, 26, 4.0, 6.0, 8.0, 11.0, 0.5709711419765423, 0.5731122837589543, 0.33511099250771664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.159999999999993, 9, 67, 15.0, 17.0, 19.0, 24.99000000000001, 0.5734319789252279, 0.9003778056593149, 0.34103522965377325], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.607999999999993, 5, 47, 9.0, 11.0, 13.0, 18.0, 0.57342934834342, 0.8875835128167193, 0.3275939148250983], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1987.948, 1480, 2517, 1975.0, 2244.7000000000003, 2312.7, 2418.91, 0.5722827443017807, 0.8740724727421729, 0.3152026052599652], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.098000000000024, 11, 107, 16.0, 24.0, 28.0, 49.98000000000002, 0.5700422287283042, 0.30784507078784396, 4.5959654691219525], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.839999999999996, 11, 60, 18.0, 22.0, 24.94999999999999, 31.980000000000018, 0.5734510513651576, 1.0382600090146505, 0.47824921666586384], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.044000000000008, 8, 67, 13.0, 16.0, 19.0, 25.980000000000018, 0.5734471052390128, 0.971052031723094, 0.4110450930131205], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.503676470588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.6745328608247422, 2816.5587030559645], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.258000000000001, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5708785707027401, 0.4800062982178313, 0.24139689561942038], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 405.8160000000003, 313, 556, 412.0, 476.90000000000003, 497.0, 531.9100000000001, 0.5706759314001877, 0.5020387754321729, 0.26416053855828997], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0079999999999987, 1, 17, 3.0, 4.0, 5.0, 10.990000000000009, 0.5709131184416355, 0.5173900135877323, 0.27876617111407986], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1148.242000000001, 914, 1458, 1146.5, 1320.9, 1361.95, 1417.8000000000002, 0.5702958010260761, 0.5396646789006522, 0.3012988558155344], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.54639668367347, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.745999999999995, 27, 632, 41.0, 50.0, 57.0, 78.99000000000001, 0.5696408756063827, 0.30762832442415006, 26.055507159816166], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.129999999999995, 29, 193, 42.0, 50.900000000000034, 56.94999999999999, 85.92000000000007, 0.5704259256301495, 129.08504733251723, 0.17602987548742896], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.9351072416974169, 1.513491697416974], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.335999999999998, 1, 28, 2.0, 3.0, 5.0, 7.990000000000009, 0.5736701465497757, 0.623530149521387, 0.2459386663431167], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3239999999999994, 1, 17, 3.0, 4.0, 6.949999999999989, 11.0, 0.5736648810391136, 0.5887908105196371, 0.2112027931169393], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1919999999999984, 1, 20, 2.0, 3.0, 4.0, 8.980000000000018, 0.5736688301630481, 0.3254898343014951, 0.2224087163815724], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.70799999999996, 83, 532, 121.0, 149.0, 154.0, 170.0, 0.5735984122795948, 0.5226243346258417, 0.18709166963025844], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.226, 110, 541, 167.0, 193.0, 216.5999999999999, 325.8000000000002, 0.5701897933746226, 0.3079247614611, 168.67260920845112], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3259999999999987, 1, 15, 2.0, 3.0, 4.0, 7.990000000000009, 0.5736602737965755, 0.31923297892601615, 0.24033228267454187], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 460.71399999999994, 348, 670, 466.0, 534.0, 548.9, 584.98, 0.5734543398450985, 0.6232059839386909, 0.24640616165219076], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.218000000000004, 7, 315, 10.0, 16.0, 20.94999999999999, 48.90000000000009, 0.569455975927957, 0.24079534919609902, 0.41318924815866415], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.980000000000004, 1, 13, 3.0, 4.0, 5.0, 9.0, 0.5736760703648122, 0.6106512858375441, 0.2330559035857049], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8180000000000054, 2, 25, 3.0, 5.0, 6.0, 13.990000000000009, 0.5708733563128888, 0.3506634190632882, 0.2854366781564444], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.169999999999997, 2, 30, 4.0, 5.0, 6.0, 13.0, 0.5708544549481664, 0.33448503219619125, 0.269260450917934], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 521.9880000000005, 374, 747, 527.5, 630.8000000000001, 643.0, 691.8900000000001, 0.5703693141308998, 0.5207070797091117, 0.2512075787822615], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.47200000000001, 6, 109, 15.0, 26.0, 32.0, 42.0, 0.570544390635769, 0.5053552366275805, 0.23456951997818237], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.398000000000001, 4, 46, 7.0, 9.0, 11.0, 17.980000000000018, 0.5709822264652545, 0.38084068425368056, 0.26709031882505563], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 542.7959999999998, 423, 3404, 528.5, 595.7, 629.95, 715.8300000000002, 0.5707371641211789, 0.4291675941145584, 0.31546604969979225], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.902000000000012, 8, 31, 13.0, 15.0, 17.0, 20.99000000000001, 0.573219637129041, 0.4679800943748811, 0.3537839947905799], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.926000000000004, 8, 46, 13.0, 16.0, 17.0, 26.960000000000036, 0.5732314662802322, 0.47629712965807885, 0.36274803725545945], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.17799999999999, 8, 43, 14.0, 17.0, 18.94999999999999, 25.99000000000001, 0.5731999229619303, 0.46404564075726584, 0.3498534686046938], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.100000000000033, 10, 39, 16.0, 20.0, 23.0, 28.99000000000001, 0.5732091227378302, 0.5127534730740746, 0.39855946815364757], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.597999999999999, 8, 41, 13.0, 16.0, 17.0, 23.980000000000018, 0.5729582061366116, 0.43027818410063895, 0.3161341664718609], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2165.21, 1662, 2820, 2153.0, 2478.4, 2542.75, 2677.98, 0.571888042621672, 0.47741481870577157, 0.3641318396380177], "isController": false}]}, function(index, item){
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
