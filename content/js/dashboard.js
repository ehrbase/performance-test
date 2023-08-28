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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8921506062539886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.205, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.631, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.968, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.133, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.46339076792134, 1, 23477, 9.0, 831.9000000000015, 1493.9500000000007, 6017.990000000002, 15.248134933506325, 96.05194311547194, 126.17961781341226], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6229.867999999998, 5298, 23477, 5992.5, 6518.8, 6754.7, 22208.960000000137, 0.3291756257299469, 0.19117581677525075, 0.16587365515298108], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2680000000000002, 1, 11, 2.0, 3.0, 4.0, 5.0, 0.3303188435669414, 0.16958195239411794, 0.11935348839821125], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5860000000000025, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.3303166613705895, 0.18958047368565348, 0.13935234151571746], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.024000000000001, 8, 363, 11.0, 15.0, 19.0, 33.99000000000001, 0.3278800326306209, 0.17057126189712699, 3.6076409449699267], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 32.316, 23, 55, 32.0, 39.0, 40.0, 41.0, 0.3302374671578839, 1.373423441171828, 0.13738394629810405], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2399999999999998, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.33024553755717373, 0.20630993440498008, 0.13964484156470336], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 28.368000000000006, 20, 48, 28.0, 34.0, 35.0, 38.98000000000002, 0.3302374671578839, 1.3553635796866312, 0.11996907986595001], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 849.8740000000003, 674, 1117, 855.5, 1001.0, 1047.95, 1074.98, 0.33009270323477646, 1.3960310261971471, 0.16053336544035027], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.644000000000003, 4, 14, 5.0, 8.0, 9.0, 12.0, 0.3301984294441902, 0.4910121586903934, 0.16864626816339012], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8560000000000048, 2, 20, 4.0, 5.0, 5.0, 10.990000000000009, 0.3281154231310874, 0.31648719197344366, 0.1794381220248134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.743999999999998, 5, 20, 7.0, 10.0, 11.0, 16.980000000000018, 0.3302385577293325, 0.5381566246762837, 0.2157515577352768], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.942521105664488, 2576.8846166938997], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9180000000000073, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.3281186529548069, 0.32962787058705023, 0.19257745158773334], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.004000000000001, 5, 25, 8.0, 10.0, 11.0, 14.0, 0.3302383396144665, 0.5188063665245981, 0.19640151252461927], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.623999999999999, 5, 28, 6.0, 8.0, 9.0, 12.0, 0.33023943019167756, 0.5110680931826692, 0.18866217447473765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1561.141999999999, 1334, 1918, 1537.5, 1774.6000000000001, 1840.85, 1903.94, 0.32989995453978627, 0.5037772049935636, 0.18170270933636665], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.121999999999998, 7, 80, 10.0, 15.0, 20.94999999999999, 64.79000000000019, 0.3278733674365352, 0.17056779449913737, 2.643479024957065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.074000000000003, 8, 22, 11.0, 14.0, 15.949999999999989, 18.99000000000001, 0.3302411751301976, 0.5978236022955064, 0.2754159800402234], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.86, 5, 24, 8.0, 10.0, 11.0, 15.0, 0.33024008454146164, 0.5591216181351343, 0.23671506059905553], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.299771769662922, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.9564271907216495, 3943.1821842783506], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.426000000000002, 1, 38, 2.0, 3.0, 4.0, 9.990000000000009, 0.32810573404142923, 0.2757850452605455, 0.1387400223046278], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 557.9040000000005, 423, 696, 550.5, 644.0, 659.95, 677.0, 0.3280230770795187, 0.28884930550134064, 0.1518388071637616], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.394000000000003, 2, 25, 3.0, 4.0, 5.0, 11.980000000000018, 0.3281246821292142, 0.2972700672442318, 0.16021712994590537], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 759.7059999999998, 606, 942, 745.0, 879.9000000000001, 893.95, 919.96, 0.3279776765274248, 0.31026880373914234, 0.173277268555993], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.580000000000002, 16, 524, 22.0, 26.900000000000034, 32.0, 52.98000000000002, 0.32776353827294835, 0.17051065866541243, 14.951010617899822], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.62, 21, 274, 29.0, 35.0, 39.94999999999999, 115.94000000000005, 0.3279989766431929, 74.18373034363633, 0.10121843419848531], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 1.0680530804480652, 0.8353487780040734], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.626000000000001, 1, 11, 2.0, 3.0, 4.0, 7.980000000000018, 0.33027498695413804, 0.35888699290404186, 0.14159249928990877], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.328000000000002, 2, 8, 3.0, 4.0, 5.0, 6.990000000000009, 0.33027367798052176, 0.3388885314364395, 0.1215948990221257], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7619999999999985, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.3303194982314694, 0.18732405841601232, 0.12806332109169274], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.99800000000005, 65, 137, 92.0, 110.0, 113.94999999999999, 118.99000000000001, 0.3303031323967258, 0.30085647911889657, 0.10773559201221329], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.72200000000002, 57, 399, 79.0, 91.0, 99.94999999999999, 367.2600000000007, 0.3279421824814598, 0.1706035937790024, 96.97032561871211], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.61999999999992, 12, 378, 260.0, 334.0, 338.0, 365.97, 0.3302701874349368, 0.18407079948339136, 0.13836514688436316], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 421.7499999999998, 333, 528, 414.5, 491.90000000000003, 502.95, 519.99, 0.3302344135961471, 0.17760097061673258, 0.1406076214139845], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.316, 4, 294, 6.0, 8.0, 11.0, 28.0, 0.3277053221310546, 0.14775861746204025, 0.23777837338220076], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 393.7000000000002, 294, 530, 392.0, 457.0, 469.0, 489.94000000000005, 0.33020453529325133, 0.1698457331878012, 0.1328557309968941], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4540000000000006, 2, 19, 3.0, 5.0, 5.0, 13.980000000000018, 0.3281020738675885, 0.20144634263798006, 0.16405103693379425], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.197999999999995, 2, 48, 4.0, 5.0, 6.0, 9.980000000000018, 0.32809238556629733, 0.19214871537887124, 0.1547545138950406], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.1899999999998, 527, 872, 674.5, 791.9000000000001, 828.95, 846.0, 0.32794024666353594, 0.29966500801321994, 0.14443462035669405], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 236.03000000000017, 166, 310, 229.0, 278.0, 283.0, 295.0, 0.3280088746081114, 0.29043840497648504, 0.1348552111425927], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.50999999999999, 3, 61, 4.0, 5.0, 6.0, 13.950000000000045, 0.32812166751431426, 0.2187616636998999, 0.15348660033140288], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 987.1300000000002, 794, 10324, 920.5, 1079.0, 1104.95, 1133.93, 0.3279488504736893, 0.2465092868145541, 0.18126860289854313], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.19800000000018, 118, 171, 140.0, 150.0, 151.0, 156.97000000000003, 0.3303144792030701, 6.386524006389273, 0.166447530535922], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.13, 159, 279, 178.0, 202.0, 204.95, 210.98000000000002, 0.33028196832199586, 0.6401503177229965, 0.23610000079267673], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.071999999999997, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.33019341409423986, 0.2694784551686496, 0.20379124776128868], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.95, 4, 18, 7.0, 9.0, 10.0, 14.0, 0.3301953766043368, 0.27463935957781216, 0.20895176175743185], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.320000000000002, 5, 34, 8.0, 10.0, 11.0, 14.990000000000009, 0.3301901432959184, 0.26721862661207085, 0.20153206988276268], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.670000000000005, 7, 23, 9.0, 12.0, 13.0, 16.99000000000001, 0.33019145160747104, 0.2952730606948021, 0.22958624369581973], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.646000000000003, 4, 35, 7.0, 9.0, 10.0, 15.0, 0.3301831658094011, 0.24786630995053197, 0.18218114129131996], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.377999999999, 1422, 1963, 1580.5, 1837.9, 1899.8, 1938.0, 0.3298744893542905, 0.27566103445835927, 0.21003727251855214], "isController": false}]}, function(index, item){
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
