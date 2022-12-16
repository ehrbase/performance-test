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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8717081472027228, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.825, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.84, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.491, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.6464156562444, 1, 23684, 12.0, 1004.9000000000015, 1795.9500000000007, 10436.950000000008, 10.228366059317995, 64.5214212814798, 84.74323362090685], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10973.818000000001, 9003, 23684, 10531.5, 12592.7, 13215.9, 20789.930000000062, 0.22013979757705335, 0.12791326128744798, 0.1113597804149547], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0199999999999996, 2, 20, 3.0, 4.0, 5.0, 8.0, 0.2209370559165176, 0.11342658170495358, 0.0802622898446724], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.419999999999997, 2, 19, 4.0, 5.0, 6.0, 10.0, 0.22093529865591802, 0.1267400518910736, 0.09363859337565275], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.345999999999993, 10, 396, 14.0, 20.0, 25.0, 41.97000000000003, 0.2197133882792575, 0.12910521763819532, 2.446457083164154], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.602000000000025, 28, 84, 44.0, 55.0, 57.94999999999999, 62.98000000000002, 0.22086434820943063, 0.9185519612919769, 0.09231439554066045], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.555999999999999, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.22086903129051566, 0.1379805937566951, 0.09382619981579524], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.94, 24, 69, 40.0, 49.0, 51.0, 61.940000000000055, 0.2208632750313184, 0.9064690377020236, 0.08066686021651669], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1095.9680000000008, 783, 1773, 1069.5, 1411.6000000000001, 1499.0, 1606.96, 0.22079315081982706, 0.9338429064459677, 0.10780915567374368], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.614000000000003, 4, 20, 6.0, 8.0, 9.0, 14.0, 0.22074860266134516, 0.32825791480318056, 0.11317677382539669], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.299999999999998, 2, 25, 4.0, 5.0, 6.0, 12.990000000000009, 0.21987657887874376, 0.21208427316828515, 0.12067445051743554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.142, 6, 29, 10.0, 12.0, 13.0, 20.0, 0.2208620067433588, 0.3599791887252596, 0.1447250063718689], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.855152027027027, 2131.15674268018], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.560000000000001, 3, 15, 4.0, 6.0, 6.949999999999989, 12.0, 0.21987812595234715, 0.22088947944183498, 0.12947901362232941], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.792000000000003, 7, 37, 17.0, 20.0, 20.0, 22.99000000000001, 0.22086073846996515, 0.34697351424220474, 0.13178311641127805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.706000000000002, 5, 23, 8.0, 9.0, 10.0, 15.990000000000009, 0.22086103114714778, 0.3417975436222622, 0.12660686062829662], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2184.217999999999, 1615, 3359, 2147.0, 2764.5, 3016.5499999999997, 3301.9300000000003, 0.22059219297757987, 0.33685763484469866, 0.121928887915342], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.83400000000001, 9, 72, 12.0, 18.0, 22.0, 39.99000000000001, 0.21970933334036402, 0.1291028349260063, 1.7718356198483656], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.587999999999989, 9, 41, 14.0, 17.0, 19.0, 24.99000000000001, 0.22086395796163769, 0.3998219995244799, 0.18462846485855652], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.11799999999999, 7, 36, 10.0, 12.0, 14.0, 19.0, 0.2208632750313184, 0.37387579902811324, 0.1587454789287601], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 8.561197916666668, 2273.0794270833335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.7341935776487664, 2775.682601596517], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.751999999999997, 2, 18, 3.0, 3.0, 4.0, 8.990000000000009, 0.219862269479907, 0.18486466213105462, 0.09339852267945269], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 697.171999999999, 538, 931, 685.0, 833.9000000000001, 847.95, 890.99, 0.21980939887404832, 0.19349666829398893, 0.1021770252578584], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5879999999999983, 2, 15, 3.0, 4.0, 5.0, 9.0, 0.21987773918190529, 0.19920193107074743, 0.10779162604425435], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 938.1779999999997, 737, 1314, 890.0, 1134.9, 1177.6999999999998, 1242.92, 0.21980437410704473, 0.20793622582151886, 0.1165564210352786], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 9.046052631578947, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.534000000000006, 20, 551, 27.0, 35.900000000000034, 41.94999999999999, 61.950000000000045, 0.21965701874465135, 0.12907209448129314, 10.047592537108857], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.45000000000004, 26, 226, 34.5, 42.900000000000034, 47.0, 125.74000000000024, 0.21977461673504586, 49.73396986609792, 0.0682503204313912], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.5076612415295257, 0.3989442158760891], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9719999999999995, 2, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.22090396553544692, 0.23997850521576353, 0.09513539921985555], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7739999999999974, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.22090289197230056, 0.22672747994422643, 0.0817599570874042], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.055999999999998, 1, 16, 2.0, 3.0, 3.0, 6.990000000000009, 0.22093783693020133, 0.1252937610192746, 0.08608808294448274], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 204.18799999999985, 89, 392, 218.0, 304.0, 314.0, 332.98, 0.22091880129458416, 0.20122380386276523, 0.07248898167478543], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.0440000000001, 81, 366, 109.0, 129.0, 141.0, 250.97000000000003, 0.21974254962885484, 0.129184584840401, 65.0043097007546], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.78999999999985, 17, 506, 339.0, 450.90000000000003, 470.9, 488.99, 0.22089967134546898, 0.12312740587354554, 0.09297632651357142], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 501.03799999999967, 305, 1187, 466.0, 834.7000000000005, 899.9, 994.7900000000002, 0.22093627490835563, 0.11882013276834036, 0.09450203946275368], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.249999999999993, 5, 272, 7.0, 10.0, 14.0, 30.0, 0.21963280031381135, 0.1033196447648106, 0.15979144163456002], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 509.6040000000005, 286, 997, 449.0, 864.7, 920.95, 967.0, 0.2208749829926263, 0.11361041239457637, 0.08929906538959696], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9279999999999986, 2, 19, 4.0, 5.0, 6.0, 11.0, 0.2198606259519965, 0.13498884193582003, 0.11035972826106075], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.385999999999996, 2, 26, 4.0, 5.0, 6.0, 10.0, 0.21985830571913012, 0.12876096144806595, 0.10413210768923645], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 866.858, 590, 1353, 860.5, 1130.4, 1240.5, 1326.8600000000001, 0.21976969015550463, 0.20082099294473366, 0.09722233363324571], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.4179999999999, 250, 1019, 385.0, 842.8000000000001, 889.95, 933.94, 0.21977084933081975, 0.19459807304369878, 0.09078424733099291], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.619999999999998, 3, 46, 5.0, 7.0, 8.0, 13.990000000000009, 0.21987918957807823, 0.1466577016424096, 0.1032830958857965], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1168.952, 877, 9612, 1090.5, 1405.0, 1425.9, 1569.9, 0.21979123349477733, 0.16514821374565583, 0.1219154498291343], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.59599999999983, 144, 304, 169.0, 188.0, 192.95, 220.94000000000005, 0.2210034617982256, 4.273093300920966, 0.11179667305808678], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.10400000000013, 192, 381, 219.0, 258.0, 263.95, 314.95000000000005, 0.22098627056498235, 0.42831412212209585, 0.15840226815888384], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.277999999999983, 6, 36, 9.0, 11.0, 12.0, 17.99000000000001, 0.22074626364874148, 0.18021862930698035, 0.1366729796418966], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.006000000000013, 6, 35, 9.0, 11.0, 12.0, 18.99000000000001, 0.22074733569003188, 0.18354364897774117, 0.1401228205063679], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.098, 7, 34, 10.0, 12.0, 13.0, 17.0, 0.22074353486335094, 0.1786448972427808, 0.13516230113214944], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.206000000000007, 8, 35, 12.0, 14.0, 16.0, 21.0, 0.22074480179103503, 0.19740060785944205, 0.15391776218632713], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.361999999999998, 5, 30, 9.0, 11.0, 12.949999999999989, 25.970000000000027, 0.22072316856054502, 0.16569541689860992, 0.12221683259162991], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1992.6859999999988, 1612, 2784, 1906.0, 2535.8, 2569.0, 2604.95, 0.2205618327453155, 0.18431344326024796, 0.14086663927288703], "isController": false}]}, function(index, item){
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
