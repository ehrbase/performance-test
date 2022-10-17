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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8924696873005743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.892, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.427, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.98, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.632, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.525, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 207.44973409912743, 1, 3854, 19.0, 611.9000000000015, 1291.9500000000007, 2547.9900000000016, 23.723565206245137, 157.87231159106346, 196.5525692896152], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.499999999999993, 17, 66, 29.0, 37.0, 42.0, 53.99000000000001, 0.5144345181446199, 0.29865234714607164, 0.26023152382706355], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.690000000000003, 5, 41, 8.0, 13.0, 16.0, 22.980000000000018, 0.5141827014542115, 5.515014191121196, 0.18679293451266277], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.041999999999998, 5, 40, 8.0, 12.0, 15.0, 23.0, 0.5141678963848856, 5.52104649877371, 0.2179188154600003], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 24.706, 9, 376, 22.0, 33.0, 38.0, 56.97000000000003, 0.5105719017986428, 0.2754924322394501, 5.685098461238402], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 48.89600000000001, 28, 95, 48.0, 62.0, 66.94999999999999, 85.95000000000005, 0.5140806695386639, 2.138095642780765, 0.21486965484623846], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.0179999999999993, 1, 15, 3.0, 5.0, 6.0, 9.990000000000009, 0.5141107991029794, 0.32129012988238176, 0.21839667735331647], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 43.58000000000003, 24, 83, 43.0, 56.0, 60.94999999999999, 71.0, 0.5140716842119333, 2.1099158596383814, 0.18775665028834282], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 839.1700000000001, 579, 1377, 827.0, 1084.8000000000002, 1210.75, 1350.96, 0.5138086062941555, 2.172887564226076, 0.2508831085420681], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.50199999999999, 8, 68, 13.0, 18.0, 21.0, 31.0, 0.5134466544329443, 0.7635062062222546, 0.2632416929465779], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6899999999999995, 2, 20, 3.0, 5.0, 7.0, 12.990000000000009, 0.5112667861667568, 0.49323464627496133, 0.2805975916266771], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.29600000000001, 13, 62, 22.0, 30.0, 34.94999999999999, 45.97000000000003, 0.5140479010396104, 0.8375757947566086, 0.3368419351538854], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.5223473837209303, 1447.725816630967], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.911999999999998, 2, 22, 4.0, 7.0, 9.0, 17.960000000000036, 0.5112746280988356, 0.5137421273293672, 0.30107285228866976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.018, 13, 60, 23.0, 32.0, 36.0, 44.99000000000001, 0.5140394453308769, 0.8076754426265154, 0.306716895602701], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.98600000000001, 7, 34, 13.0, 17.900000000000034, 21.0, 29.99000000000001, 0.5140389168583175, 0.795597709673904, 0.29466879315999256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2210.7340000000013, 1498, 3838, 2132.5, 2741.7000000000003, 2880.6, 3176.84, 0.5126711809073049, 0.7829380099155733, 0.28337098475931116], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.59, 12, 109, 18.0, 28.0, 33.94999999999999, 49.960000000000036, 0.5105312383854144, 0.27562006092935065, 4.117155240807374], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 27.292000000000005, 16, 65, 27.0, 36.900000000000034, 40.0, 52.98000000000002, 0.5140706271353208, 0.930632498362685, 0.4297309148709323], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.272000000000013, 13, 50, 22.0, 30.0, 35.0, 46.99000000000001, 0.5140579425550531, 0.8702519038135902, 0.36947914621144434], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 4.802271262886598, 1406.0285115979382], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.6469036899717514, 2701.1939442090397], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6620000000000004, 1, 42, 2.0, 4.0, 6.0, 11.0, 0.5112348981211096, 0.42959607682173445, 0.21717498113543227], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 453.63200000000023, 318, 902, 448.5, 604.7, 655.0, 724.95, 0.5110828311944516, 0.44981577859636207, 0.2375736598130459], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.400000000000001, 2, 31, 3.0, 5.0, 6.0, 11.990000000000009, 0.5112714912971367, 0.4631660365671596, 0.25064285999136976], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1253.6819999999996, 934, 2141, 1205.5, 1622.8000000000002, 1713.95, 1963.7600000000002, 0.5107789685738132, 0.4832288279563631, 0.2708525194683404], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3089599609375, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 48.97999999999996, 14, 855, 45.0, 64.0, 71.0, 104.97000000000003, 0.5100932144340057, 0.27479080120851285, 23.332779457117994], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 51.119999999999976, 10, 305, 49.0, 68.90000000000003, 78.0, 97.96000000000004, 0.5108917001556176, 113.65116353030251, 0.15865582094676406], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.8145815311418687, 1.4259839965397925], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.593999999999999, 1, 16, 2.0, 4.0, 5.0, 8.0, 0.5142472192081622, 0.5587386431715683, 0.22146779655351514], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.67, 2, 33, 3.0, 5.0, 7.0, 10.0, 0.514230823818349, 0.5275275071709489, 0.19032566623745534], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.548000000000003, 1, 47, 2.0, 4.0, 5.0, 8.0, 0.5142033242216505, 0.2916627539007464, 0.20035852184027197], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 136.23999999999992, 88, 281, 130.0, 181.0, 207.95, 235.0, 0.514154149583895, 0.46840447234416244, 0.16870683033221556], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 185.54800000000006, 32, 837, 179.0, 236.0, 264.95, 439.62000000000035, 0.5106657651713692, 0.27388341494197815, 151.06530623604604], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.6159999999999997, 1, 29, 2.0, 4.0, 5.0, 8.990000000000009, 0.5142170736523398, 0.2867071527980608, 0.2164331628360923], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.650000000000001, 2, 20, 3.0, 5.0, 7.0, 11.970000000000027, 0.514280013124426, 0.27663945557546393, 0.21997523998876814], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.31199999999998, 7, 368, 11.0, 17.900000000000034, 21.94999999999999, 42.91000000000008, 0.5099402655972879, 0.21542685474198553, 0.37100146276365187], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.026000000000005, 2, 52, 5.0, 7.0, 8.0, 12.0, 0.5142540950053586, 0.26460181112578446, 0.20791132356661957], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.175999999999998, 2, 23, 4.0, 6.0, 8.0, 12.990000000000009, 0.5112286255311665, 0.3139682645884201, 0.25661280617482385], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.659999999999999, 2, 37, 4.0, 6.0, 8.0, 13.990000000000009, 0.5112113767024616, 0.2994800053728316, 0.2421264821295839], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 585.3899999999995, 381, 1058, 588.0, 750.4000000000002, 844.8, 936.99, 0.5107774032076821, 0.4667667471141077, 0.22595914419246094], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.029999999999987, 6, 132, 17.0, 31.0, 36.0, 56.99000000000001, 0.511042608688542, 0.4524783234889492, 0.21110451511255202], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.262000000000006, 7, 43, 11.0, 15.0, 17.0, 24.99000000000001, 0.5112788105609751, 0.340758339916048, 0.24016123816389554], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 596.41, 457, 3837, 576.5, 666.7, 711.8499999999999, 785.9100000000001, 0.5110629803353186, 0.3839190950888892, 0.28348024690474705], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 188.52800000000002, 141, 361, 184.0, 242.90000000000003, 264.84999999999997, 318.82000000000016, 0.5143323862759661, 9.944567465429149, 0.2601798594638188], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 293.90000000000015, 216, 511, 283.0, 377.80000000000007, 393.0, 440.96000000000004, 0.5141737125604411, 0.996684567731589, 0.3685581103704725], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 21.74, 13, 53, 21.0, 29.0, 33.0, 42.99000000000001, 0.5134197658395132, 0.41889738195709453, 0.31787903470922985], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 21.773999999999987, 13, 59, 21.0, 30.0, 35.0, 43.99000000000001, 0.5134318917192677, 0.42681332431490215, 0.32590891564211333], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.66799999999999, 13, 54, 21.0, 27.0, 29.0, 38.97000000000003, 0.5133775933269127, 0.41555710260467255, 0.31434350685153734], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.545999999999996, 15, 65, 25.0, 32.900000000000034, 37.94999999999999, 49.99000000000001, 0.5133965701001945, 0.4592201964948363, 0.3579737803237684], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.813999999999997, 12, 54, 21.0, 29.0, 36.0, 46.0, 0.5130667848772539, 0.38515582832323614, 0.2840906904544951], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2397.79, 1699, 3854, 2334.5, 2887.8, 3122.2499999999995, 3456.8900000000003, 0.5121979952570466, 0.42804946680188694, 0.32712645400205903], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
