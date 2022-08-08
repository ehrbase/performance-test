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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8774941501808126, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.389, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.796, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.311, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.896, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.525, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.498, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.957, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.882, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 288.7854073601338, 1, 7008, 29.0, 812.0, 1844.9500000000007, 3718.9900000000016, 17.079813339185254, 113.64911167985288, 141.47493308726075], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 42.60200000000002, 16, 122, 37.0, 68.0, 74.94999999999999, 88.99000000000001, 0.37009485531141634, 0.2149615008826762, 0.18649311068426835], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.274000000000006, 4, 56, 13.0, 27.0, 32.0, 48.0, 0.36984737878067236, 3.9553421830260023, 0.13363625991098513], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 16.457999999999984, 5, 43, 15.0, 27.0, 32.0, 39.99000000000001, 0.36983725681351176, 3.971248897884975, 0.15602509271820028], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 73.99599999999994, 15, 294, 71.5, 137.90000000000003, 153.89999999999998, 196.0, 0.36771573514465206, 0.1985392055758943, 4.093710332665071], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 71.192, 28, 170, 64.0, 117.90000000000003, 128.0, 144.0, 0.36999462027822116, 1.5388321956923745, 0.15392354320168183], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 7.287999999999996, 1, 46, 6.0, 15.0, 16.0, 21.0, 0.370020084690197, 0.2312206365936543, 0.1564635709676321], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.512000000000036, 24, 149, 55.0, 103.0, 113.0, 131.99, 0.36998394269688695, 1.5185333339345573, 0.13440822918285344], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1141.0240000000015, 604, 2638, 903.0, 2208.9000000000005, 2328.95, 2425.0, 0.3696089758800574, 1.5631536014975818, 0.17975124022291858], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 23.238000000000003, 7, 70, 21.0, 39.0, 42.0, 52.99000000000001, 0.3698635203609868, 0.5499740517623997, 0.1889049034656212], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.517999999999997, 2, 78, 8.0, 24.0, 27.94999999999999, 36.0, 0.368014803027437, 0.3550142488431454, 0.20125809540562958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 33.99000000000005, 11, 99, 28.0, 58.0, 63.0, 74.98000000000002, 0.3699880493860049, 0.6028695116897724, 0.2417207080461301], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1088.0, 1088, 1088, 1088.0, 1088.0, 1088.0, 1088.0, 0.9191176470588235, 0.39224063648897056, 1087.1231976677389], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.504000000000001, 3, 86, 8.0, 20.0, 24.0, 31.99000000000001, 0.3680345775846332, 0.3697899300035037, 0.21600466907066854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 35.636, 12, 94, 30.0, 60.0, 64.0, 79.99000000000001, 0.369988596951442, 0.5813171228687731, 0.22004204642912906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 23.09999999999999, 7, 64, 19.5, 40.0, 44.94999999999999, 54.0, 0.36998941830263654, 0.5726258299325139, 0.21137090791703356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2910.104000000001, 1601, 5926, 2663.5, 4339.6, 4764.85, 5388.0, 0.36940280864343467, 0.564142301396121, 0.20346014069814175], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 72.80400000000006, 13, 362, 65.5, 143.0, 156.0, 188.91000000000008, 0.36769599483460663, 0.19850772074261355, 2.9645489583540163], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 41.13599999999994, 15, 112, 36.0, 67.90000000000003, 72.94999999999999, 89.0, 0.36998585914046367, 0.6697929161397451, 0.3085624254940976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 35.31599999999996, 11, 100, 29.0, 60.0, 67.94999999999999, 80.0, 0.36999160859031716, 0.6263611066301016, 0.2652088288137625], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 5.416515261627907, 1585.8466569767443], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1209.0, 1209, 1209, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 0.3788319375516956, 1581.8390069272125], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 9.54, 1, 63, 7.0, 21.0, 24.0, 32.99000000000001, 0.3679953014359913, 0.3091886460293675, 0.15560738820486741], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 614.2200000000004, 321, 1453, 477.0, 1169.8000000000002, 1234.8, 1336.7900000000002, 0.3679078405575717, 0.3239083622508896, 0.1703010902580947], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.836000000000006, 2, 54, 7.0, 24.0, 27.0, 36.0, 0.3680028851426195, 0.333356707266585, 0.17968890876104468], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1710.150000000001, 944, 3709, 1352.0, 3067.100000000001, 3400.0, 3672.6600000000003, 0.3677522467823517, 0.34787495053732276, 0.19429098194262917], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 3.8030360772357725, 535.3388592479674], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 103.04799999999993, 19, 1275, 92.0, 177.80000000000007, 196.95, 235.99, 0.36738286732041225, 0.19772086690600435, 16.80417845659518], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 124.86599999999989, 10, 321, 115.0, 225.0, 241.0, 290.97, 0.36782448004331497, 81.8250391192829, 0.11350833563836674], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.8168443341121495, 0.6388726635514018], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 9.485999999999994, 1, 32, 8.0, 20.0, 23.0, 28.0, 0.36986297316570155, 0.4018416725721454, 0.15856430197240526], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 11.226000000000004, 2, 75, 10.0, 22.0, 27.0, 35.960000000000036, 0.36986023721356176, 0.37950766586197404, 0.13616924748975856], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.376000000000004, 1, 21, 5.0, 13.0, 15.0, 20.0, 0.36985285034496174, 0.2097853043500613, 0.1433902163935057], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 181.63399999999993, 88, 432, 139.0, 348.0, 377.9, 408.0, 0.3698249470595588, 0.33691774991475537, 0.12062649640419204], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 331.36999999999983, 50, 1386, 291.0, 532.0, 576.0, 709.8200000000002, 0.3676819345364376, 0.19717661868294858, 108.76706664639512], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 7.189999999999999, 1, 42, 7.0, 13.0, 16.0, 19.960000000000036, 0.36985777489124333, 0.2061971542588013, 0.15495018108236658], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 10.25, 2, 40, 8.0, 20.0, 23.0, 31.970000000000027, 0.36988376772483017, 0.1989664025789036, 0.15748957297658783], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 62.56800000000002, 7, 511, 51.5, 135.0, 147.0, 183.95000000000005, 0.36725226264119015, 0.155147583305667, 0.2664730772875042], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.264000000000001, 2, 68, 10.0, 20.0, 23.0, 32.0, 0.36986543555723556, 0.19026687085704477, 0.1488130463374815], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.812000000000001, 2, 46, 9.0, 21.0, 24.94999999999999, 32.0, 0.36799178053558995, 0.22600013956088275, 0.18399589026779498], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.678000000000003, 2, 40, 10.0, 22.0, 25.0, 33.0, 0.36798528058877644, 0.21555384659613616, 0.1735711821527139], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 818.812, 382, 1761, 634.0, 1572.9, 1639.75, 1711.93, 0.3676470588235294, 0.3359066233915441, 0.16192267922794118], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 32.18600000000001, 6, 451, 28.0, 56.0, 71.0, 88.0, 0.3678959295994349, 0.3257150804680372, 0.1512540882435177], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 19.441999999999997, 6, 76, 16.0, 34.0, 40.0, 46.0, 0.3680538124118051, 0.24528054947857816, 0.17216579701685022], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 836.3920000000002, 450, 6293, 806.0, 1004.0, 1072.0, 1366.5600000000004, 0.3679278743629329, 0.27649779758374404, 0.20336638368107424], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 251.23400000000004, 146, 599, 193.5, 496.0, 516.95, 559.98, 0.3700335028333466, 7.154541404991308, 0.186462194787116], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 392.4839999999998, 213, 1091, 328.0, 682.9000000000001, 740.0, 820.8000000000002, 0.36979595398850823, 0.7167988987661388, 0.26434632648397266], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 33.453999999999965, 12, 84, 28.0, 58.0, 64.0, 79.99000000000001, 0.36982002338741826, 0.301755803770537, 0.2282482956844222], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 34.58599999999998, 12, 97, 28.0, 59.0, 64.0, 79.99000000000001, 0.36983889817595456, 0.3075499374972262, 0.23403867775197124], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 34.198000000000064, 12, 100, 28.0, 61.0, 67.94999999999999, 84.0, 0.3698082618124155, 0.2993229515673214, 0.22571305042261688], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 36.709999999999994, 14, 108, 31.0, 60.0, 67.0, 80.95000000000005, 0.36981236460244804, 0.3307668239663559, 0.2571351597626396], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 33.03200000000001, 11, 115, 27.0, 61.0, 65.0, 77.98000000000002, 0.3696313814085765, 0.277437951135101, 0.2039470024373493], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3191.7699999999995, 1789, 7008, 2819.5, 4861.200000000001, 5560.75, 6442.84, 0.3691657960506643, 0.30851589351043446, 0.23505478420413392], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
