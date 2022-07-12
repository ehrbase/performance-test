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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8886619868113167, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.846, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.359, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.62, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.529, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.984, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.969, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 227.64509678791708, 1, 6107, 15.0, 655.0, 1484.9500000000007, 2897.930000000011, 21.464322469826215, 144.58023539012922, 177.7925510588107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.08, 13, 113, 22.0, 41.0, 56.849999999999966, 88.0, 0.4651872471707311, 0.27016748805166557, 0.23441076126962626], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 10.041999999999993, 5, 55, 8.0, 17.0, 22.94999999999999, 39.98000000000002, 0.46493549484944463, 4.9739970658502095, 0.167994270599897], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 10.052000000000003, 4, 49, 8.0, 16.0, 21.0, 32.0, 0.464921660700172, 4.992327884548328, 0.19613882560788506], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 29.748, 13, 254, 23.0, 51.0, 59.89999999999998, 111.93000000000006, 0.46264981757717694, 0.2497179498760561, 5.150593672245915], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 56.06999999999997, 27, 196, 51.0, 84.0, 109.84999999999997, 144.96000000000004, 0.4648823243372405, 1.9333974643342282, 0.19339831071060984], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.1239999999999983, 1, 22, 3.0, 5.0, 7.0, 11.990000000000009, 0.46490912421348995, 0.290436538916613, 0.19658754959418082], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 52.06200000000004, 24, 210, 45.0, 79.0, 105.0, 163.80000000000018, 0.4648676289426586, 1.907913899251563, 0.16887769332682517], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 938.0600000000002, 555, 2504, 890.0, 1263.4000000000005, 1502.0, 2123.4600000000005, 0.46445437757539954, 1.9642746264741784, 0.2258772265942861], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.187999999999994, 5, 46, 10.0, 17.900000000000034, 25.94999999999999, 40.97000000000003, 0.4646386737353697, 0.6909276903160008, 0.23731057262070152], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.261999999999998, 2, 43, 3.0, 7.0, 10.0, 20.0, 0.4633301950434789, 0.44691002631483845, 0.2533837004144025], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.629999999999985, 8, 79, 14.0, 30.0, 42.0, 70.97000000000003, 0.4648360802046766, 0.7574966947249473, 0.3036868531805944], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.6248284224011712, 1731.7570118045387], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.220000000000001, 2, 34, 4.0, 8.0, 10.949999999999989, 21.99000000000001, 0.4633366353790881, 0.4654678029109588, 0.27193878697542184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.64800000000001, 9, 96, 16.0, 31.0, 43.94999999999999, 62.0, 0.46482268409069993, 0.7302391602769042, 0.2764423970812854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.583999999999989, 5, 66, 9.0, 20.0, 30.94999999999999, 41.99000000000001, 0.4648179308164992, 0.7193375226017719, 0.26554539992934767], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2388.426000000004, 1486, 6107, 2242.5, 3174.7000000000003, 3600.5499999999997, 4301.89, 0.46366232029607624, 0.7080404363966575, 0.2553765123505732], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 24.19600000000002, 12, 101, 19.5, 40.0, 46.0, 71.95000000000005, 0.4626125767705571, 0.2496978489324752, 3.729813900212617], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.403999999999993, 11, 98, 20.0, 36.0, 44.94999999999999, 70.95000000000005, 0.46487195102109125, 0.8415408050071358, 0.38769594352735537], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.457999999999995, 8, 124, 15.0, 27.900000000000034, 39.94999999999999, 62.99000000000001, 0.4648555275505925, 0.7870358170602908, 0.33320698947474114], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.903371710526316, 1435.608552631579], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.6352396844660194, 2652.487322295423], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9379999999999997, 1, 30, 2.0, 6.0, 8.0, 13.990000000000009, 0.46346805731802154, 0.38956210118573664, 0.19597819220576496], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 482.69400000000024, 304, 1645, 457.0, 644.8000000000001, 760.75, 1148.7800000000002, 0.4632473453610874, 0.4079245740093224, 0.2144328532237846], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.055999999999997, 1, 25, 3.0, 7.0, 10.0, 20.970000000000027, 0.4634461484844384, 0.41986682266650227, 0.22629206468966717], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1393.562, 910, 5452, 1258.0, 1939.4000000000005, 2339.4999999999995, 2900.2800000000016, 0.4629355297463854, 0.43793972365295014, 0.24457824374296336], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 6.981693097014925, 982.7862639925372], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 54.28200000000002, 27, 939, 45.0, 74.90000000000003, 103.0, 211.5500000000004, 0.4622165688000119, 0.24948410131001422, 21.141894188920855], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 53.90399999999998, 28, 276, 46.0, 80.90000000000003, 100.89999999999998, 188.94000000000005, 0.46290081424253227, 104.75242455150698, 0.14284829814515643], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.7364704056291391, 1.3581332781456954], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.194000000000003, 1, 30, 2.0, 5.0, 8.949999999999989, 16.980000000000018, 0.46497051621956653, 0.505251311623705, 0.19933794591834933], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.204000000000007, 2, 22, 3.0, 7.0, 9.0, 16.980000000000018, 0.46496100372061794, 0.4770890392766509, 0.17118193203386034], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.961999999999998, 1, 55, 2.0, 5.0, 7.0, 17.960000000000036, 0.46494543865277405, 0.2636703766406762, 0.18025716713393683], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 150.85800000000017, 83, 740, 139.0, 199.90000000000003, 236.44999999999987, 567.8100000000002, 0.4649043691712615, 0.4234579630563743, 0.15163872978828255], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 213.7079999999999, 109, 717, 191.0, 308.90000000000003, 377.79999999999995, 517.99, 0.4627106143038658, 0.24975076526551723, 136.878294788768], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.856, 1, 21, 2.0, 4.900000000000034, 7.0, 13.990000000000009, 0.4649579770980299, 0.259136881942985, 0.19479196501470197], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 4.156000000000004, 2, 25, 3.0, 6.900000000000034, 9.0, 17.99000000000001, 0.46500035340026863, 0.25007846154400576, 0.1979884317212081], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 16.191999999999982, 5, 336, 11.0, 29.900000000000034, 36.94999999999999, 50.99000000000001, 0.4620858555519616, 0.19526286187098563, 0.33528299870615963], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.587999999999999, 2, 65, 5.0, 8.0, 11.0, 21.980000000000018, 0.46497267820542865, 0.23916578060310673, 0.18707885099671542], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.479999999999998, 2, 26, 4.0, 7.0, 10.0, 16.980000000000018, 0.46346333170812193, 0.2845547180451302, 0.23173166585406094], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.069999999999997, 2, 28, 4.0, 8.0, 11.0, 20.980000000000018, 0.4634521624677901, 0.2714227503452719, 0.21860097116400648], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 648.124000000001, 374, 2393, 607.0, 925.9000000000001, 1125.8499999999997, 1737.8700000000001, 0.4628926718535334, 0.4229817402149118, 0.20387167481049173], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 20.781999999999982, 7, 184, 17.0, 38.0, 51.0, 84.93000000000006, 0.46301440900840835, 0.4099802683515761, 0.19036041620365224], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.427999999999997, 4, 51, 8.0, 15.0, 23.94999999999999, 39.0, 0.46334307589374246, 0.3089149915463056, 0.2167395833526393], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 645.2840000000004, 383, 4383, 614.0, 770.9000000000001, 823.0, 897.99, 0.46319670574502875, 0.34817103162012314, 0.25602474165203737], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 211.15399999999983, 142, 918, 186.5, 255.90000000000003, 372.2999999999996, 754.8800000000001, 0.4650924836403719, 8.992413287866666, 0.23436300933440612], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 317.6839999999995, 201, 1068, 271.0, 426.80000000000007, 603.0499999999997, 977.7000000000003, 0.46489874970130257, 0.9010636694528049, 0.3323299656067905], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 16.968000000000004, 8, 64, 15.0, 27.0, 36.94999999999999, 54.98000000000002, 0.4646309018578731, 0.3791959872965265, 0.28676438474040605], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.065999999999985, 8, 94, 15.0, 27.900000000000034, 36.94999999999999, 57.98000000000002, 0.4646343559935509, 0.3864587181086594, 0.2940264284021689], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.018000000000008, 8, 93, 15.0, 28.0, 40.94999999999999, 61.98000000000002, 0.464622698491463, 0.3760131606121683, 0.2835831899972308], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.991999999999997, 10, 93, 18.0, 35.0, 43.0, 74.93000000000006, 0.4646265842604957, 0.4154914155011509, 0.3230606718686259], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 18.517999999999965, 8, 113, 14.0, 30.900000000000034, 56.0, 81.99000000000001, 0.4650808031387373, 0.34913307048904174, 0.25661196657557284], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2703.8840000000023, 1689, 5156, 2581.5, 3605.7000000000003, 4020.2499999999995, 4749.370000000001, 0.4638279161324915, 0.3875997911266936, 0.29532793097498483], "isController": false}]}, function(index, item){
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
