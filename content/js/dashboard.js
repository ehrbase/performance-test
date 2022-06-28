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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9189275164735288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.007, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.992, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.71, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.727, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 181.48870711202014, 1, 3701, 11.0, 581.0, 1277.0, 2172.0, 27.158586149059353, 181.92472739206607, 239.23066611122493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.9559999999999995, 4, 38, 6.0, 10.0, 12.0, 23.930000000000064, 0.6290107296650266, 6.734251527159425, 0.22727926755474595], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.189999999999998, 4, 31, 7.0, 9.0, 10.0, 18.980000000000018, 0.6289909475622827, 6.753569169820008, 0.265355556002838], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.038000000000014, 13, 247, 18.0, 25.0, 30.0, 45.97000000000003, 0.624890644137276, 0.3367574736921039, 6.956790374184518], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.964, 24, 98, 42.0, 51.0, 52.0, 56.0, 0.6287410090035712, 2.6150468333459083, 0.2615660838237513], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2059999999999986, 1, 21, 2.0, 3.0, 3.0, 6.0, 0.6287781708339988, 0.39298635677124927, 0.2658798320030483], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.98399999999999, 22, 74, 37.0, 44.0, 46.0, 52.960000000000036, 0.6287370558758621, 2.579934092638118, 0.22840838357990303], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 747.8079999999995, 564, 943, 743.0, 897.0, 909.0, 931.99, 0.6283317289929853, 2.6575241389341984, 0.3055753916391667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.379999999999994, 5, 29, 8.0, 10.0, 12.0, 19.99000000000001, 0.6286777649248101, 0.9350353866996931, 0.3210922568903083], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.258000000000001, 1, 19, 3.0, 4.0, 5.949999999999989, 11.0, 0.6257634313862913, 0.603763935751617, 0.34221437653937803], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.515999999999991, 8, 42, 13.0, 15.0, 16.0, 23.0, 0.6287244062012345, 1.0247471034666606, 0.4107584255357675], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.6303660450516986, 1747.1049321454948], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.179999999999997, 2, 23, 4.0, 5.0, 6.949999999999989, 10.980000000000018, 0.6257767453852093, 0.628123408180404, 0.3672771718520614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.415999999999991, 8, 32, 14.0, 16.0, 17.94999999999999, 23.99000000000001, 0.6287180815547947, 0.9871856252412705, 0.3739153434246777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.03599999999999, 5, 18, 8.0, 10.0, 11.0, 15.0, 0.6287165004130667, 0.9731598175338974, 0.35917886009926175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1837.2880000000014, 1460, 2295, 1818.5, 2094.8, 2173.75, 2225.98, 0.6275147654224305, 0.9584307550006652, 0.34562336689282297], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.912000000000003, 11, 69, 16.0, 22.0, 25.94999999999999, 42.97000000000003, 0.624846912506436, 0.33744174083599515, 5.03782823208314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.702000000000005, 11, 49, 17.0, 20.0, 21.0, 27.99000000000001, 0.6287425902685737, 1.1383679319901714, 0.5243614961810175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.509999999999991, 8, 33, 13.0, 15.0, 16.0, 21.980000000000018, 0.6287299403712524, 1.0646657388708514, 0.4506716564770501], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.293412642045455, 1549.8046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.7684694840604027, 3208.79758284396], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1100000000000003, 1, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.625851157574301, 0.5262283658901106, 0.2646421398727269], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 401.10599999999977, 309, 584, 400.0, 466.0, 478.95, 515.0, 0.6255058778787344, 0.5502741357698039, 0.2895408067524611], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8959999999999986, 1, 11, 3.0, 4.0, 5.0, 9.990000000000009, 0.6258072914059136, 0.5671378578366093, 0.3055699665067938], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1156.9399999999991, 914, 1425, 1153.0, 1336.9, 1355.0, 1389.95, 0.6250039062744142, 0.5914343605272533, 0.3302022590766192], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.682477678571428, 940.6668526785713], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.07399999999997, 27, 581, 39.0, 47.0, 52.0, 84.92000000000007, 0.6244029147128058, 0.33720196468377117, 28.560335663396877], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.77600000000002, 28, 177, 40.0, 48.900000000000034, 53.94999999999999, 75.94000000000005, 0.6252336810883067, 141.48781759526372, 0.19294320627334466], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.8729073660714284, 1.4648437499999998], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0580000000000007, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.6290233908638128, 0.683694369171312, 0.269669207606654], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.992000000000002, 2, 11, 3.0, 4.0, 6.0, 8.0, 0.6290162688767782, 0.6456016587788026, 0.23158118492826696], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9720000000000026, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.6290225995239557, 0.35689661164396314, 0.24386911329200234], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.23999999999997, 85, 179, 119.0, 143.90000000000003, 149.0, 154.0, 0.6289418933163603, 0.5730495961564103, 0.2051431566090472], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 158.30000000000004, 106, 543, 159.0, 183.90000000000003, 206.95, 321.96000000000004, 0.6249671892225658, 0.33750669496101454, 184.8767685790246], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.211999999999999, 1, 17, 2.0, 3.0, 4.0, 7.990000000000009, 0.629009938357026, 0.3500342024153982, 0.26352076519059003], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.025999999999999, 1, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.6290756236970271, 0.3377841220054428, 0.2678486054022498], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.666, 6, 303, 9.0, 13.0, 16.94999999999999, 42.930000000000064, 0.6241862172193003, 0.26393811724214555, 0.4529007415956447], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.088000000000001, 2, 62, 4.0, 5.0, 5.0, 7.0, 0.6290281389447676, 0.3237283488514575, 0.25308554027855884], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4479999999999986, 2, 21, 3.0, 4.0, 5.0, 10.0, 0.6258433238789269, 0.3844291510935986, 0.3129216619394634], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.022000000000005, 2, 28, 4.0, 5.0, 6.949999999999989, 18.99000000000001, 0.6258229571887032, 0.36669313897775574, 0.29518797687709336], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 521.8359999999999, 372, 850, 538.5, 625.0, 632.95, 664.99, 0.625159415650991, 0.5707265899679418, 0.2753387660728486], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.58999999999999, 5, 120, 14.0, 26.0, 34.94999999999999, 52.99000000000001, 0.6253658390158243, 0.553912906237649, 0.25710841623599806], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.840000000000002, 4, 45, 7.0, 8.0, 9.0, 14.0, 0.6257908431780663, 0.4173976034088079, 0.2927283338694275], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 517.5259999999998, 393, 3701, 504.0, 568.0, 585.0, 673.8700000000001, 0.6255191809201638, 0.4703611028403575, 0.3457459535164186], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.566000000000003, 8, 30, 13.0, 15.0, 16.94999999999999, 23.99000000000001, 0.6286524708556714, 0.513235806284513, 0.38799644685623474], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.457999999999997, 8, 37, 13.0, 15.0, 16.0, 21.99000000000001, 0.6286674889637421, 0.5223588342870219, 0.39782864535986817], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.565999999999995, 8, 27, 13.0, 15.0, 16.0, 20.99000000000001, 0.6286374534651125, 0.5089262196509553, 0.38368985196845246], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.22000000000001, 10, 26, 16.0, 18.0, 19.0, 23.0, 0.6286445668764663, 0.562342210213714, 0.437104425406293], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.210000000000004, 8, 35, 13.0, 14.0, 16.0, 22.0, 0.6284209666371309, 0.47192941732807975, 0.3467361778808388], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2108.814, 1633, 2682, 2095.0, 2447.4000000000005, 2527.95, 2628.94, 0.627128316724885, 0.5235296584659187, 0.39930435791467295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
