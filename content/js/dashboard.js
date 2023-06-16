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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8913209955328654, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.204, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.622, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.947, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.995, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.128, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.42505849819116, 1, 19222, 9.0, 842.0, 1497.9500000000007, 6035.0, 15.255428641523713, 96.09788806747048, 126.23997386968341], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6186.994, 4954, 19222, 6021.0, 6465.0, 6650.95, 16468.240000000085, 0.328981348731415, 0.1910629862344334, 0.1657757577591896], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.344, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.3300617611567476, 0.16944996919698616, 0.11926059729296547], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6840000000000006, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.3300593644772949, 0.1894328018524912, 0.13924379438885878], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.536000000000005, 8, 390, 11.0, 14.0, 16.0, 32.0, 0.3280437374154221, 0.17065642515485305, 3.6094421772066028], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.98199999999998, 23, 51, 34.0, 40.900000000000034, 42.0, 43.99000000000001, 0.3299996766003169, 1.372434494857945, 0.13728502171067872], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.333999999999999, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.33000599290883126, 0.206160286839559, 0.1395435497358632], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.872000000000007, 21, 43, 30.0, 35.0, 36.0, 38.0, 0.33000120120437243, 1.3543938948375271, 0.11988324887502591], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.1099999999999, 664, 1106, 862.5, 992.0, 1046.0, 1086.93, 0.32984794009961405, 1.3949958717468747, 0.16041433024375765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.672000000000002, 3, 16, 5.0, 7.0, 8.0, 13.0, 0.32995394502835296, 0.49064860511144853, 0.16852139965803573], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8939999999999952, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.3282649229233961, 0.31663139357487063, 0.17951987972373223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.759999999999996, 5, 30, 7.0, 9.0, 10.0, 14.990000000000009, 0.33000294362625715, 0.5377726680259488, 0.2155976262558262], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.8938371642561984, 2443.781072443182], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.062000000000003, 2, 16, 4.0, 5.0, 6.0, 11.0, 0.32826923329437874, 0.3297791435373636, 0.19266582930656406], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.941999999999999, 5, 18, 8.0, 10.0, 11.0, 15.0, 0.33000120120437243, 0.5184338206928574, 0.19626048001314725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.587999999999998, 4, 13, 6.0, 8.0, 9.0, 12.0, 0.3300005478009093, 0.5106984063531046, 0.18852570357766796], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1556.005999999999, 1337, 1917, 1533.0, 1770.9, 1827.85, 1898.94, 0.32965547706092363, 0.5034038730809931, 0.18156805572496185], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.775999999999994, 6, 57, 10.0, 13.0, 15.949999999999989, 31.99000000000001, 0.3280359894844783, 0.17065239449050434, 2.6447901652186063], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.99999999999999, 8, 23, 11.0, 13.0, 15.0, 18.0, 0.33000468606654215, 0.5973954947347752, 0.27521875185627637], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.807999999999998, 5, 20, 8.0, 10.0, 11.0, 15.0, 0.33000403264927897, 0.5587219643011537, 0.23654585934040112], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.359996448863637, 1549.8046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.8373053925992779, 3452.0638255866425], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2980000000000027, 1, 18, 2.0, 3.0, 3.0, 6.990000000000009, 0.32826837121112645, 0.2759217478370397, 0.13880879368595483], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 561.3260000000002, 445, 717, 547.0, 655.0, 669.0, 693.99, 0.3281582773003075, 0.2889683595941995, 0.15190139007846265], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.267999999999999, 1, 15, 3.0, 4.0, 5.0, 9.0, 0.32826901777314116, 0.29740083054523514, 0.16028760633454156], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 766.7520000000001, 625, 956, 741.0, 891.0, 914.95, 932.99, 0.3281175763398353, 0.31040114978140804, 0.1733511804686044], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.28, 14, 627, 20.0, 24.0, 27.0, 68.98000000000002, 0.3279023952614169, 0.17058289548799746, 14.95734461197342], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.07800000000001, 21, 332, 28.0, 34.0, 39.0, 93.97000000000003, 0.32816581562331815, 74.22146441841635, 0.10126991966500834], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 1.1181536513859276, 0.8745335820895523], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7359999999999993, 1, 12, 3.0, 4.0, 4.0, 6.0, 0.33001688366376825, 0.35860652990381986, 0.1414818475863225], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.413999999999997, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.3300153589148039, 0.3386234743802477, 0.1214997952254698], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8440000000000003, 1, 26, 2.0, 3.0, 3.0, 6.0, 0.3300628505680051, 0.1871785136263147, 0.12796381999560355], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.304, 67, 125, 92.0, 110.0, 113.0, 116.0, 0.330045856571312, 0.30062213953381683, 0.10765167587384591], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.47600000000001, 58, 342, 81.0, 93.0, 99.0, 284.9000000000001, 0.32810659527067154, 0.1706891253580463, 97.01894138867836], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 216.672, 13, 376, 265.5, 341.0, 346.0, 357.97, 0.33001122038149294, 0.18392646834367368, 0.13825665385123095], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 425.9219999999998, 339, 549, 415.5, 502.0, 518.95, 530.99, 0.32994763071205335, 0.17744673799749502, 0.1404855146391165], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.1680000000000055, 4, 269, 6.0, 8.0, 10.949999999999989, 32.98000000000002, 0.327847354271851, 0.14782265814536752, 0.23788142990623568], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.3279999999999, 285, 518, 396.0, 474.90000000000003, 483.0, 502.94000000000005, 0.3299354382334465, 0.16970731901556502, 0.13274746147673822], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4199999999999995, 2, 19, 3.0, 4.0, 5.0, 9.980000000000018, 0.3282649229233961, 0.2015463278234066, 0.16413246146169805], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.138000000000001, 2, 46, 4.0, 5.0, 6.0, 9.990000000000009, 0.3282556560090809, 0.19224433541524014, 0.15483152524647076], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 670.2879999999996, 531, 865, 672.0, 802.9000000000001, 837.0, 849.98, 0.32810465751123435, 0.29981524324202835, 0.14450703177496746], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.97400000000007, 171, 312, 235.0, 285.0, 293.95, 307.0, 0.32819338729707803, 0.29060178339466175, 0.13493107036334948], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.500000000000001, 3, 60, 4.0, 5.0, 6.0, 10.0, 0.32827225062141935, 0.21886205881030196, 0.15355703910904286], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.6560000000005, 807, 8388, 929.0, 1087.0, 1113.0, 1130.97, 0.32810573404142923, 0.24662721147366068, 0.18135531783930564], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.23, 115, 167, 136.0, 150.0, 151.0, 156.98000000000002, 0.33002058668419737, 6.380841689248325, 0.1662994362588338], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.4119999999999, 160, 221, 174.0, 202.0, 204.0, 207.99, 0.3299977164158024, 0.6395993825660227, 0.23589680509410874], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.214000000000007, 5, 16, 7.0, 9.0, 10.0, 15.0, 0.329950025769097, 0.2692798203471602, 0.20364103152936455], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.037999999999999, 5, 17, 7.0, 9.0, 9.0, 14.990000000000009, 0.32995111444288416, 0.2744361950020985, 0.2087971896083876], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.426000000000004, 6, 20, 8.0, 10.0, 11.0, 14.990000000000009, 0.3299463243319577, 0.26702130706751626, 0.20138325459714215], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.755999999999998, 7, 21, 10.0, 11.0, 12.0, 17.99000000000001, 0.329947412981319, 0.29505482963000357, 0.22941656058857338], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.824000000000002, 5, 33, 8.0, 9.0, 10.0, 23.930000000000064, 0.32992041659710847, 0.24766906586168283, 0.18203616736070924], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1617.8180000000002, 1375, 1979, 1591.5, 1823.4, 1901.5, 1969.89, 0.3296085371247984, 0.2754387903350207, 0.2098679357474302], "isController": false}]}, function(index, item){
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
