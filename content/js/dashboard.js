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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8612422888747076, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.447, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.978, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.555, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.7, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.31, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 496.86453945969396, 2, 27580, 15.0, 1233.0, 2339.9500000000007, 9833.990000000002, 9.983096055179914, 62.886162513192936, 82.61097178968392], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10032.056000000004, 8413, 27580, 9820.5, 10569.300000000001, 10794.9, 26455.510000000137, 0.21533142520979742, 0.12507054795818437, 0.10850685098462448], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.6360000000000015, 2, 17, 3.0, 4.900000000000034, 5.0, 9.0, 0.21609109363270307, 0.1109387195641097, 0.07807978969150403], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.195999999999997, 3, 18, 5.0, 6.0, 7.0, 11.990000000000009, 0.2160895993914917, 0.12402150240075545, 0.09116279974328556], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.834000000000017, 14, 528, 18.0, 23.0, 27.0, 86.99000000000001, 0.2146509582233426, 0.11166671089370786, 2.3617894006859386], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.576000000000015, 31, 80, 56.5, 68.0, 70.0, 74.0, 0.21602573989896043, 0.8984286902002947, 0.08987008320015345], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.5339999999999994, 2, 11, 3.0, 4.900000000000034, 5.0, 9.990000000000009, 0.21603199347410554, 0.13495881498566412, 0.09134946599051533], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.41800000000001, 28, 84, 49.0, 60.0, 62.94999999999999, 66.0, 0.2160228465762539, 0.8866029077485235, 0.07847704973277973], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1227.7800000000007, 850, 1787, 1205.5, 1521.7, 1704.6499999999999, 1767.96, 0.21594783391365716, 0.9133007507642394, 0.1050215051650403], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.921999999999999, 6, 27, 9.0, 12.0, 13.0, 17.99000000000001, 0.21599755663563933, 0.32119300728970157, 0.11031906457074159], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.515999999999996, 3, 21, 5.0, 7.0, 8.0, 14.0, 0.21478945693063287, 0.20717743603999553, 0.11746298425893986], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.322000000000001, 8, 40, 12.0, 15.0, 16.0, 22.980000000000018, 0.2160206999675537, 0.3520272482840396, 0.14113071120927093], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.725867764261745, 1984.5470454068793], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.032000000000007, 4, 24, 6.0, 7.0, 8.0, 13.990000000000009, 0.2147910255154555, 0.21577898033008225, 0.12606387337381714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.63199999999999, 9, 33, 13.0, 15.0, 17.0, 25.960000000000036, 0.21601930002834174, 0.3393675860826109, 0.12847241573951182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.566000000000011, 7, 22, 9.0, 11.0, 13.0, 18.99000000000001, 0.21601864672958568, 0.33430362271371267, 0.12340909017266372], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2303.888, 1962, 2939, 2263.0, 2632.8, 2743.8, 2889.9300000000003, 0.21581035276791882, 0.329567698952327, 0.11886429586045529], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.299999999999983, 13, 97, 17.0, 22.0, 25.0, 61.930000000000064, 0.2146439550466872, 0.11166306766886792, 1.7305668875639157], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.745999999999988, 12, 39, 17.5, 21.0, 23.0, 30.0, 0.21602321990386103, 0.3910589872734241, 0.1801599900370091], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.500000000000009, 8, 30, 13.0, 15.0, 16.0, 23.0, 0.21602219325604635, 0.3657420279979884, 0.1548440330565801], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6295955882351], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.7445701243980738, 3069.7325190609954], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.605999999999999, 2, 30, 3.0, 4.0, 5.0, 10.990000000000009, 0.2147918559519897, 0.18054052571917684, 0.09082507190157378], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 770.9320000000002, 571, 1028, 734.0, 942.0, 952.9, 971.0, 0.21473254202960046, 0.1890883598374131, 0.09939768058792052], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.644000000000001, 3, 17, 4.0, 6.0, 7.0, 12.970000000000027, 0.2147925941231887, 0.1945949584902572, 0.10487919634921322], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1040.9980000000014, 816, 1354, 975.5, 1306.0, 1320.0, 1347.97, 0.2147053405376995, 0.2031125101877684, 0.11343319260829629], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 4.118546195652174, 572.5798233695652], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.61200000000003, 24, 1702, 35.0, 40.0, 46.0, 106.94000000000005, 0.21448862052072687, 0.11158225882577774, 9.78394869582339], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.01000000000002, 30, 564, 45.0, 53.0, 61.0, 310.50000000000045, 0.21473281869034455, 48.566253714206724, 0.06626520576772352], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.8582881546644845, 0.6712868248772504], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.088000000000001, 3, 10, 4.0, 5.0, 6.0, 10.0, 0.21606728162295913, 0.23478537591277623, 0.09263040686765533], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 5.048000000000001, 3, 26, 5.0, 6.0, 7.0, 11.0, 0.21606644129496397, 0.22170231497366366, 0.07954789879707169], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8280000000000016, 2, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.21609165397848504, 0.12254549256039653, 0.08377772131783062], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 128.35800000000003, 83, 177, 131.5, 164.0, 168.0, 171.0, 0.21608091452357614, 0.19681721658719212, 0.07047951704186957], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 125.31800000000005, 84, 697, 122.0, 138.0, 150.74999999999994, 558.6900000000003, 0.21468819330868427, 0.11168608150143478, 63.48187309759425], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.35599999999994, 16, 530, 283.0, 490.0, 500.0, 516.97, 0.21606457392282086, 0.12042012986669248, 0.09051924044227554], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 589.7719999999994, 439, 748, 566.5, 703.9000000000001, 711.95, 731.0, 0.21603432699042147, 0.11618385177431152, 0.09198336578889038], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.94400000000001, 7, 382, 9.0, 12.0, 17.0, 43.99000000000001, 0.21445651358045872, 0.09669601258323594, 0.15560663045925863], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 549.0079999999995, 417, 700, 548.5, 646.9000000000001, 657.0, 682.96, 0.21602639324062056, 0.11111646639039771, 0.08691686915540593], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.184000000000001, 3, 18, 5.0, 6.0, 8.0, 12.990000000000009, 0.21479047189466677, 0.1318880619455721, 0.10739523594733338], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.714000000000004, 3, 44, 5.0, 7.0, 8.0, 15.990000000000009, 0.21478678116234015, 0.12579080129967482, 0.10131056181778349], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 948.7619999999996, 682, 1431, 904.0, 1211.3000000000002, 1385.6499999999999, 1413.98, 0.214705985917005, 0.19619388484609446, 0.0945628902818059], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 332.6400000000001, 211, 434, 332.5, 398.0, 401.0, 406.99, 0.2147503419899196, 0.19015261971257816, 0.08829091208765251], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.840000000000008, 5, 60, 6.0, 8.0, 10.0, 15.990000000000009, 0.21479167140998273, 0.14320353709795833, 0.1004738384818181], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1564.5479999999998, 1274, 14070, 1449.0, 1752.2000000000003, 1802.95, 5124.7300000000305, 0.21467915984881433, 0.16138002687353725, 0.1186605512445595], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.27599999999995, 130, 215, 185.5, 208.0, 209.0, 213.0, 0.2160942689638928, 4.178113050662221, 0.10889125272008662], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 236.09200000000018, 180, 334, 233.0, 283.90000000000003, 287.0, 295.99, 0.2160750316225809, 0.4187951914176294, 0.1544598858864543], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.201999999999996, 7, 36, 11.0, 14.0, 15.949999999999989, 21.99000000000001, 0.21599485068275973, 0.17627837564852455, 0.13330932190576578], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.134, 7, 25, 11.0, 14.0, 15.949999999999989, 21.0, 0.21599606368773536, 0.179654304104962, 0.13668500905239503], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.401999999999992, 9, 26, 12.5, 15.0, 16.0, 24.99000000000001, 0.21599223810293153, 0.1747997340217582, 0.13183120001399629], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.162, 10, 34, 15.0, 18.0, 20.0, 26.0, 0.21599335777226178, 0.19315163832581822, 0.15018288157602577], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.924000000000008, 8, 91, 11.0, 14.0, 15.0, 85.37000000000057, 0.21598281467940159, 0.16213686471894806, 0.11917020536509952], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2625.7199999999993, 2301, 3297, 2578.0, 2996.4, 3118.85, 3266.8, 0.21576863043451056, 0.18030798315343263, 0.13738393265947352], "isController": false}]}, function(index, item){
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
