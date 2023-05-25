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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8907679217187833, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.171, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.616, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.967, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.117, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.98221654967, 1, 20943, 9.0, 839.9000000000015, 1509.9500000000007, 6066.94000000001, 15.22329770112337, 95.8954869690385, 125.97408759589446], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6236.981999999997, 5392, 20943, 6047.5, 6544.900000000001, 6779.7, 19776.51000000011, 0.32860600731214085, 0.19084499864121415, 0.1655866208721335], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3539999999999996, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.32984054188842943, 0.1693363977306311, 0.11918066454953018], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.602000000000002, 2, 13, 3.0, 5.0, 5.0, 7.990000000000009, 0.32983814842057, 0.1893058380939973, 0.139150468864928], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.35800000000001, 7, 375, 11.0, 14.0, 17.94999999999999, 54.91000000000008, 0.3275790792276209, 0.17041469853061128, 3.604329575837505], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.094000000000015, 24, 53, 34.0, 41.0, 42.0, 43.99000000000001, 0.3297839783028525, 1.3715374279669346, 0.13719528784864762], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2559999999999985, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.32979180902679756, 0.2060264825708327, 0.13945298174668297], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.28999999999997, 22, 52, 30.0, 36.0, 37.0, 38.99000000000001, 0.3297844133333157, 1.3535041521094329, 0.1198044939062436], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.6639999999992, 686, 1096, 851.0, 998.0, 1044.8, 1078.96, 0.3296352651717927, 1.3940964250313812, 0.16031090044487575], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.635999999999999, 3, 20, 5.0, 7.0, 9.0, 13.990000000000009, 0.3297557037844083, 0.49035381612261375, 0.16842014949145076], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.902000000000003, 2, 31, 4.0, 5.0, 5.0, 9.990000000000009, 0.32774119457732526, 0.31612622587497063, 0.17923346578447477], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.731999999999996, 5, 19, 7.0, 10.0, 11.0, 15.0, 0.3297848483649267, 0.5374172600732782, 0.21545514019153902], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.9303595430107526, 2543.6344926075267], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.151999999999999, 2, 21, 4.0, 5.0, 6.0, 12.990000000000009, 0.32774699505167587, 0.32925450320274363, 0.19235932033794648], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.982000000000001, 5, 18, 8.0, 10.0, 11.0, 15.0, 0.3297837607880513, 0.5180922205247519, 0.19613116242180004], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.788000000000001, 4, 26, 6.0, 8.0, 10.0, 15.0, 0.329782020679971, 0.5103602206950749, 0.18840086142361623], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.2220000000007, 1329, 1943, 1553.0, 1772.5000000000002, 1860.6499999999999, 1927.92, 0.3294269881083446, 0.5030549566161128, 0.18144220829404917], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.440000000000001, 7, 44, 10.0, 13.0, 16.0, 28.980000000000018, 0.3275717824425456, 0.17041090256344574, 2.6410474959430235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.910000000000009, 8, 20, 11.0, 13.0, 15.0, 18.0, 0.3297874585786952, 0.5970022557049933, 0.27503758752559154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.752, 5, 19, 8.0, 10.0, 10.0, 14.0, 0.32978658850284803, 0.5583538147981179, 0.2363899960557524], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.719992897727273, 3099.609375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 1.136929381127451, 4687.3611749387255], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2719999999999985, 1, 17, 2.0, 3.0, 3.0, 6.0, 0.3277891083546232, 0.27551890962100367, 0.13860613663823423], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 557.222, 432, 704, 547.0, 643.9000000000001, 656.95, 680.0, 0.32768255686766934, 0.28854945151674427, 0.1516811835500735], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.295999999999999, 2, 17, 3.0, 4.0, 5.0, 8.990000000000009, 0.32778567012830184, 0.296962933627663, 0.1600515967423349], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.4919999999996, 597, 950, 737.0, 878.9000000000001, 897.0, 918.0, 0.327608054964769, 0.3099191395751186, 0.17308198997650395], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.764382102272728, 1496.515447443182], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.404, 15, 636, 20.0, 24.0, 32.0, 68.99000000000001, 0.3274370649589296, 0.17034081921315564, 14.936118461163673], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.73199999999999, 20, 289, 28.0, 34.0, 40.94999999999999, 100.98000000000002, 0.32769651632387425, 74.11532270713205, 0.10112509683432058], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 1.2575876798561152, 0.983588129496403], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6440000000000006, 1, 9, 3.0, 3.0, 4.0, 6.0, 0.32978767609837434, 0.3583574658900607, 0.1413835837960804], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.362000000000002, 2, 19, 3.0, 4.0, 5.0, 7.990000000000009, 0.32978419581794066, 0.33838628162877776, 0.12141468928062854], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.792, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.32984141224899066, 0.18705293604210094, 0.12787796939731377], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.83800000000005, 65, 120, 90.0, 110.0, 113.0, 116.0, 0.3298235707755207, 0.30041967060355074, 0.1075791724990468], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.30600000000005, 57, 365, 80.0, 94.0, 101.0, 302.5800000000004, 0.32764540903252865, 0.1704492049274593, 96.88257168062437], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.83599999999998, 12, 384, 261.0, 335.0, 340.0, 351.98, 0.3297800630803305, 0.1837976365239994, 0.13815981158345875], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 422.3660000000004, 324, 529, 411.0, 488.0, 507.95, 524.97, 0.329711561731566, 0.17731977945428778, 0.14038500089351832], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.290000000000007, 4, 299, 6.0, 8.0, 11.0, 28.960000000000036, 0.32737617814502107, 0.14761021016732195, 0.23753955113452213], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 397.34000000000003, 297, 502, 389.5, 461.0, 475.0, 494.97, 0.32970308259194103, 0.1695878033515637, 0.13265397463660125], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4579999999999997, 2, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.3277867445662791, 0.20125273845338412, 0.16389337228313955], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2159999999999975, 2, 27, 4.0, 5.0, 6.0, 10.990000000000009, 0.3277813724468289, 0.19196656920907013, 0.1546078153240414], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.7759999999994, 537, 866, 673.0, 790.5000000000002, 836.9, 850.96, 0.327621149386726, 0.2993734235279818, 0.14429408044278652], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.17600000000007, 176, 359, 238.0, 287.0, 293.95, 310.95000000000005, 0.3277036038876134, 0.29016810027435347, 0.13472970433270043], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4300000000000015, 3, 32, 4.0, 5.0, 6.0, 10.980000000000018, 0.327749573106181, 0.21851358501496176, 0.15331254445103584], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1006.5659999999995, 818, 10204, 947.5, 1095.9, 1119.95, 1152.9, 0.327551825249791, 0.24621085489552405, 0.18104915340955244], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.76599999999988, 118, 167, 136.0, 151.90000000000003, 153.95, 158.97000000000003, 0.3298037733509317, 6.376649673321117, 0.1661901826651179], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.456, 158, 266, 176.0, 205.0, 206.0, 214.0, 0.32977941055228155, 0.639176263591034, 0.23574075051198254], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.0040000000000004, 5, 19, 7.0, 9.0, 10.0, 12.990000000000009, 0.3297522241787521, 0.2691183899105712, 0.20351895086032357], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.908000000000001, 4, 26, 7.0, 9.0, 10.0, 13.990000000000009, 0.32975352902226757, 0.2742718537144097, 0.2086721550844037], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.416000000000007, 6, 23, 8.0, 10.0, 11.0, 16.980000000000018, 0.32974743984087707, 0.2668603524126301, 0.20126186513725408], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.731999999999994, 7, 25, 9.0, 12.0, 13.0, 17.0, 0.3297493970532275, 0.2948777542730575, 0.22927887763857221], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.774000000000001, 5, 29, 8.0, 9.0, 10.0, 17.970000000000027, 0.3297546163997523, 0.2475446007545445, 0.18194468580650394], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1620.6820000000012, 1390, 2041, 1587.5, 1830.3000000000002, 1902.9, 1976.97, 0.3294172214052675, 0.275278916531935, 0.20974612144163515], "isController": false}]}, function(index, item){
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
