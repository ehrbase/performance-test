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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8659646883641778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.444, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.983, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.736, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.722, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.477, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 507.4452244203332, 1, 24831, 13.0, 1076.9000000000015, 1920.9000000000015, 10647.920000000013, 9.75387291622749, 61.44231934962665, 80.81200129667792], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11311.839999999998, 9116, 24831, 10738.5, 13191.7, 13674.949999999999, 23319.51000000008, 0.20997287150500155, 0.12200572123581632, 0.10621674554647538], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2779999999999982, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.21069868949629109, 0.10817032036630389, 0.0765428832935745], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.714000000000001, 3, 18, 5.0, 6.0, 6.0, 9.0, 0.21069735768657674, 0.12086703305883681, 0.08929946605075614], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.606, 10, 450, 14.0, 20.0, 24.0, 46.960000000000036, 0.20949454413358712, 0.10898421738808906, 2.3326726486437113], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.278000000000034, 28, 61, 45.0, 55.0, 57.0, 59.99000000000001, 0.21063779861594115, 0.8760208001403269, 0.08804001739025666], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.691999999999995, 1, 26, 2.0, 4.0, 4.0, 8.990000000000009, 0.21064214679735466, 0.1316036181369629, 0.08948177134457938], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.32999999999998, 24, 69, 40.0, 48.0, 50.0, 53.0, 0.21063744367028162, 0.864488158120895, 0.07693203509051302], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1188.567999999999, 820, 1753, 1188.0, 1539.1000000000006, 1637.85, 1712.91, 0.21057029173250497, 0.8906054038022256, 0.1028175252600122], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.906000000000001, 4, 17, 7.0, 9.0, 9.0, 14.990000000000009, 0.21052135191759688, 0.3130497732211367, 0.10793331030931481], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.563999999999995, 3, 19, 4.0, 6.0, 6.949999999999989, 10.990000000000009, 0.2096559127160504, 0.20222582182497084, 0.1150650614711136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.290000000000006, 7, 19, 10.0, 12.0, 13.0, 18.0, 0.21063726619790046, 0.3433140598479452, 0.13802500548710078], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.7307722761824325, 1997.959446262669], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.1060000000000025, 3, 16, 5.0, 7.0, 7.0, 13.0, 0.20965731930474277, 0.21062166107615424, 0.12346031595777333], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.188000000000017, 8, 24, 17.0, 20.0, 21.0, 22.99000000000001, 0.210636467575886, 0.3309230553409404, 0.12568250164928355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.938000000000005, 5, 18, 8.0, 9.0, 10.0, 15.0, 0.21063664504692142, 0.32597460719951843, 0.12074581117435829], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2371.9140000000007, 1652, 3655, 2275.0, 3050.9, 3245.6, 3562.96, 0.21037652770175005, 0.32125769544189803, 0.116282338553897], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.248000000000001, 9, 91, 13.0, 17.900000000000034, 22.0, 46.99000000000001, 0.20949059429129752, 0.10898216258292684, 1.6894270777905611], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.08599999999999, 10, 38, 15.0, 18.0, 19.0, 24.0, 0.21063815356279691, 0.3813105973055589, 0.17608033149390054], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.548, 7, 41, 10.0, 13.0, 14.0, 18.99000000000001, 0.21063770987941413, 0.3565660342374746, 0.1513958539758289], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.7324538934426235, 2235.8158299180327], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6524151722925458, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0180000000000033, 2, 15, 3.0, 4.0, 4.0, 7.990000000000009, 0.20963481615026622, 0.17626521162634692, 0.0890538525638338], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 752.3439999999988, 545, 988, 731.5, 902.9000000000001, 927.95, 963.96, 0.20957972140148473, 0.18449155514231094, 0.09742182362022143], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.942000000000001, 2, 15, 4.0, 5.0, 6.0, 9.0, 0.20964896796102542, 0.18993500397179972, 0.10277713077776833], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1019.3560000000009, 832, 1320, 993.5, 1215.0, 1241.9, 1274.99, 0.20957366011176143, 0.19825791043639104, 0.11113134515692039], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.06914645522388, 982.8154151119402], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.511999999999997, 20, 626, 27.0, 34.0, 40.0, 78.97000000000003, 0.20943671576421782, 0.10895413364722312, 9.580093521871056], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.82600000000005, 25, 253, 35.0, 42.0, 47.94999999999999, 107.85000000000014, 0.2095563566196548, 47.39543075592636, 0.06507707168461936], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1056.0, 1056, 1056, 1056.0, 1056.0, 1056.0, 1056.0, 0.946969696969697, 0.4966042258522727, 0.3902550899621212], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.32, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.21066069513816182, 0.22885075242733785, 0.09072399077727476], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9240000000000017, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.21065998509369946, 0.21621449641941223, 0.07796888120167197], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.308000000000001, 1, 15, 2.0, 3.0, 4.0, 5.0, 0.210699133436604, 0.11947546213694432, 0.08209858812617675], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 206.58800000000008, 91, 362, 206.5, 312.90000000000003, 319.0, 333.0, 0.21068084464478787, 0.1918985650475001, 0.06912965214907103], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.00400000000002, 81, 380, 112.0, 131.0, 138.0, 262.97, 0.20952544581776733, 0.10905963146569336, 61.98188285851376], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 279.84000000000003, 18, 552, 347.5, 466.7000000000001, 489.0, 519.99, 0.2106580324961081, 0.1174426759995197, 0.08866563672443613], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 553.4819999999993, 310, 1098, 517.0, 879.3000000000002, 945.8, 1009.99, 0.21070144195638818, 0.1133038773595401, 0.09012424958681448], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.922, 5, 298, 7.0, 11.0, 14.949999999999989, 36.99000000000001, 0.20941355827141672, 0.09442220116161701, 0.15235654385957564], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 563.8739999999997, 307, 1094, 518.5, 912.5000000000002, 961.95, 1031.89, 0.21063389427947832, 0.10834275239838284, 0.08515862522627347], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.5299999999999985, 3, 13, 4.0, 6.0, 7.0, 12.0, 0.20963393721882848, 0.12870991471567347, 0.10522640989304476], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.838000000000001, 3, 28, 5.0, 6.0, 7.0, 12.0, 0.2096317399224782, 0.12277172924698182, 0.09928847056875187], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 918.8399999999997, 603, 1523, 927.0, 1247.0, 1361.95, 1452.96, 0.20954854024295896, 0.1914811177643937, 0.09270067258794962], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 516.3120000000001, 266, 1108, 428.0, 901.0, 977.8499999999999, 1050.8400000000001, 0.20955222879750549, 0.18554990368455684, 0.08656307888803205], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.794000000000006, 4, 71, 5.0, 7.0, 8.0, 12.0, 0.20965802260616664, 0.13984026312501155, 0.09848194225934195], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1247.6500000000017, 953, 10614, 1156.5, 1483.9, 1499.95, 1527.96, 0.20958007279135088, 0.1574756832100793, 0.11625144662645244], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.7180000000001, 144, 198, 165.5, 189.90000000000003, 191.0, 194.0, 0.2107622808019589, 4.075080466404282, 0.10661607564005343], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.8860000000001, 199, 301, 225.5, 258.0, 261.0, 266.99, 0.21074833361292614, 0.4084710207079205, 0.15106374694520291], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.43800000000001, 6, 37, 9.0, 12.0, 12.0, 16.0, 0.2105201996236741, 0.17187000672401517, 0.13034160797012634], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.196000000000016, 6, 21, 9.0, 11.0, 12.0, 16.0, 0.21052064281215158, 0.1750405133819552, 0.13363126741005718], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.399999999999986, 7, 38, 11.0, 12.0, 13.0, 18.99000000000001, 0.21051949052599137, 0.17037070995487724, 0.12890207085917635], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.642000000000007, 8, 24, 13.0, 15.0, 16.0, 19.0, 0.21051975643706258, 0.18826880499302337, 0.1467881895469362], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.720000000000018, 6, 36, 10.0, 12.0, 12.0, 18.99000000000001, 0.21051576784152712, 0.15803278896236356, 0.11656488317006432], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2047.7080000000003, 1658, 2734, 1983.0, 2500.5, 2635.7, 2698.99, 0.21036643729712787, 0.17579361724563017, 0.1343551269456266], "isController": false}]}, function(index, item){
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
