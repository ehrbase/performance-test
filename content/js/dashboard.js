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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.861157200595618, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.451, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.969, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.579, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.695, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.287, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 498.62935545628454, 1, 35198, 15.0, 1224.0, 2342.9500000000007, 9745.960000000006, 9.946436082564095, 62.65523164937025, 82.30760738781538], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10004.589999999993, 8385, 35198, 9722.0, 10362.6, 10634.25, 34456.220000000205, 0.21488684488522033, 0.12483666585224552, 0.10828282418044306], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.6199999999999988, 2, 16, 3.0, 5.0, 5.0, 11.0, 0.21564765243809078, 0.11071106187815302, 0.07791956191610702], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.258000000000001, 3, 25, 5.0, 6.0, 7.949999999999989, 14.980000000000018, 0.2156456062854656, 0.12376667897463964, 0.0909754901516808], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.00399999999998, 14, 539, 18.0, 24.0, 29.0, 85.66000000000031, 0.21385342486259917, 0.11125181441265156, 2.353014197194243], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.84, 32, 79, 56.0, 68.0, 69.94999999999999, 74.99000000000001, 0.21556156157968684, 0.8964982206201447, 0.08967697776654941], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.493999999999999, 2, 12, 3.0, 4.900000000000034, 5.0, 9.0, 0.2155671377383472, 0.1346684117994122, 0.09115290101631282], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.95600000000001, 28, 68, 48.0, 60.0, 62.0, 65.0, 0.21556100397968725, 0.8847074092143276, 0.07830927097699576], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1225.1159999999995, 866, 1800, 1192.0, 1499.8000000000002, 1672.0, 1765.98, 0.21547943959831187, 0.9113075818972706, 0.10479371183589775], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.890000000000002, 6, 34, 8.5, 11.0, 13.0, 22.960000000000036, 0.2155462286307469, 0.32052187284992634, 0.1100885523182428], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.402, 3, 22, 5.0, 6.900000000000034, 7.0, 13.990000000000009, 0.21400692440804614, 0.20642263604206176, 0.11703503678565023], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.233999999999991, 8, 25, 12.0, 15.0, 17.0, 21.980000000000018, 0.21556063224795682, 0.3512775221078985, 0.14083013962293273], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.6780833659874608, 1853.9028825431035], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.0959999999999965, 4, 38, 6.0, 8.0, 9.0, 16.0, 0.2140085731834417, 0.21499292902298667, 0.12560464109692235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.523999999999997, 8, 23, 13.0, 15.0, 17.0, 22.0, 0.21555933119699666, 0.338644972353438, 0.12819886005758882], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.534000000000013, 6, 21, 9.0, 12.0, 13.0, 18.0, 0.21555830895368858, 0.3335912185371092, 0.1231461042362381], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2355.512, 1905, 3018, 2305.0, 2728.8, 2877.65, 2991.94, 0.21535433325221653, 0.32885910590803075, 0.11861312886157238], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.404, 12, 89, 17.0, 22.0, 25.94999999999999, 68.88000000000011, 0.21384876016904317, 0.11124938772426854, 1.7241556288629105], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.554000000000027, 12, 37, 17.0, 21.0, 23.0, 29.99000000000001, 0.21556184038076845, 0.3902237686838225, 0.17977520672380493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.525999999999994, 8, 31, 13.0, 15.0, 17.0, 22.0, 0.21556156157968684, 0.36496214348273326, 0.1545138537104396], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 3.997285487288136, 1155.7865466101696], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.7270645572100314, 2997.560124412226], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.596, 2, 30, 3.0, 4.0, 5.0, 9.980000000000018, 0.21400234460968756, 0.1798769121376994, 0.09049122579686984], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 776.1040000000007, 562, 983, 745.0, 946.0, 957.0, 974.0, 0.21394502211977584, 0.1883948885699444, 0.09903314500466186], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.656, 3, 15, 4.0, 6.0, 6.0, 12.990000000000009, 0.21400527565805552, 0.19388167410227997, 0.10449476350490992], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1048.0240000000013, 825, 1412, 993.5, 1309.0, 1332.95, 1355.96, 0.21392378580068036, 0.20238527160405617, 0.11302028136539852], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 5.092825940860215, 708.028813844086], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 38.592000000000006, 25, 1656, 35.0, 41.0, 44.94999999999999, 102.0, 0.21369895800388078, 0.11117145695141342, 9.747928055040305], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 48.15200000000007, 31, 579, 45.0, 54.900000000000034, 62.0, 215.94000000000005, 0.21393248119747424, 48.38525300831855, 0.06601822661953306], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.8206792840375586, 0.6418720657276995], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.0840000000000005, 3, 10, 4.0, 5.0, 6.0, 9.0, 0.21562551884890474, 0.2343053428499656, 0.09244101833463787], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.981999999999999, 3, 16, 5.0, 6.0, 7.0, 9.990000000000009, 0.21562477494164117, 0.22124912820208184, 0.07938529311816281], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.826000000000001, 1, 15, 3.0, 4.0, 5.0, 9.980000000000018, 0.21564839650321813, 0.12229412141932011, 0.08360587247243906], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 130.3919999999999, 87, 179, 134.0, 165.0, 169.0, 174.99, 0.2156382590574538, 0.19641402402878685, 0.07033513527850545], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 124.84400000000001, 85, 562, 123.0, 141.90000000000003, 156.89999999999998, 472.7600000000002, 0.21389111573306047, 0.1112714221310143, 63.246182551575565], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.5320000000001, 15, 522, 281.0, 486.80000000000007, 501.95, 516.0, 0.2156221713066402, 0.12017356385391856, 0.0903338979399889], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 586.3720000000009, 443, 789, 571.5, 702.9000000000001, 713.0, 745.9300000000001, 0.2155908396314604, 0.11594534306000151, 0.09179453718683274], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.854000000000005, 7, 404, 9.0, 12.0, 16.0, 42.98000000000002, 0.21366462175379342, 0.09633895752924214, 0.15503204488580907], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 546.134000000001, 391, 724, 539.0, 643.9000000000001, 659.0, 682.99, 0.2155838679453952, 0.11088884676320225, 0.0867388218686551], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.1720000000000015, 3, 20, 5.0, 6.0, 8.0, 13.990000000000009, 0.21400078752289808, 0.13139104992531372, 0.10700039376144904], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.691999999999998, 3, 42, 5.0, 7.0, 7.0, 14.980000000000018, 0.21399712387865505, 0.125328335118426, 0.10093809651698281], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 943.8239999999994, 683, 1438, 900.5, 1174.4, 1337.8, 1412.99, 0.2139140844027968, 0.19547026163724704, 0.09421411334537241], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 336.36199999999985, 220, 418, 336.5, 403.0, 407.0, 412.99, 0.2139601281022079, 0.1894529177261259, 0.08796602922952101], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.906000000000007, 4, 71, 7.0, 8.0, 9.0, 14.990000000000009, 0.2140097639814719, 0.14268223239042058, 0.10010808295617679], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1613.1679999999992, 1270, 17633, 1448.0, 1768.0, 1812.85, 8705.720000000063, 0.2138982528790705, 0.1607808830308099, 0.11822891711870498], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.14200000000008, 128, 216, 172.0, 207.0, 209.0, 212.99, 0.21564504825057954, 4.169427512938703, 0.1086648875950186], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 235.57200000000003, 177, 398, 235.0, 283.0, 287.0, 295.98, 0.21562719265901534, 0.4179271929123773, 0.154139751002343], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.032000000000004, 7, 22, 11.0, 14.0, 15.949999999999989, 21.0, 0.21554344105619735, 0.17590996984870577, 0.13303071752687182], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.933999999999996, 7, 29, 11.0, 13.0, 15.0, 21.980000000000018, 0.2155447419153478, 0.17927891810226648, 0.13639940699330602], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.285999999999992, 8, 27, 12.0, 15.0, 17.0, 23.99000000000001, 0.21554000314688404, 0.17443374610142018, 0.1315551777019556], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.216000000000001, 10, 38, 15.0, 18.0, 19.0, 28.0, 0.21554139688068488, 0.1927474731812617, 0.14986862751860125], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.491999999999988, 7, 44, 11.0, 14.0, 16.0, 43.8900000000001, 0.2155231868465337, 0.1617918251570302, 0.1189166021174722], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2635.818000000001, 2227, 3334, 2597.5, 3034.7000000000003, 3183.7, 3296.8100000000004, 0.21531306519679613, 0.17992728810502973, 0.13709386573077256], "isController": false}]}, function(index, item){
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
