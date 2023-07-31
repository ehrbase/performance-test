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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8936609232078281, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.218, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.668, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.99, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.129, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.60821101892924, 1, 18825, 9.0, 834.0, 1496.0, 6034.990000000002, 15.372279930492835, 96.8339645391161, 127.2069282577069], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6198.846000000002, 5310, 18825, 6025.5, 6567.9, 6750.75, 15573.360000000077, 0.33148870916307716, 0.19251918967419301, 0.16703923235170687], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.192000000000001, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3326502914016553, 0.17077889130152754, 0.12019590607286372], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5700000000000003, 2, 17, 3.0, 4.0, 5.0, 7.0, 0.332647856982711, 0.190918429714169, 0.1403358146645812], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.951999999999996, 8, 347, 11.0, 15.0, 18.0, 35.99000000000001, 0.3305859437501405, 0.17197894345228257, 3.6374138947586263], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.891999999999975, 24, 67, 34.0, 40.0, 42.0, 47.99000000000001, 0.33259386630391763, 1.3832234612960517, 0.13836424516159074], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3220000000000014, 1, 35, 2.0, 3.0, 4.0, 6.0, 0.332602273536101, 0.20778222695681559, 0.1406413910557927], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.783999999999992, 21, 58, 30.0, 35.0, 36.0, 46.960000000000036, 0.33259010531133093, 1.3650192983329918, 0.12082374919513193], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 845.7280000000002, 671, 1083, 849.0, 985.8000000000001, 1036.95, 1066.98, 0.33245343989574255, 1.4060150748934486, 0.16168145807429668], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.415999999999995, 3, 17, 5.0, 7.0, 8.0, 11.0, 0.3325363545369598, 0.49448870353220115, 0.16984034513948237], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.819999999999997, 2, 28, 4.0, 5.0, 5.0, 9.990000000000009, 0.33076549057483734, 0.3190433424762428, 0.18088737765811416], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.394000000000002, 5, 28, 7.0, 9.0, 10.949999999999989, 14.980000000000018, 0.33259010531133093, 0.541988705697335, 0.21728787153640663], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 1.044969051932367, 2856.980770682367], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.860000000000007, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.3307709609557958, 0.3322923781687858, 0.194134128451595], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.720000000000002, 5, 29, 7.0, 10.0, 11.0, 15.990000000000009, 0.33258899915322837, 0.5224992664333887, 0.19779951219171493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.502000000000007, 4, 23, 6.0, 8.0, 8.949999999999989, 13.990000000000009, 0.3325874505442461, 0.5147018151874729, 0.19000357282068747], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1548.8159999999993, 1331, 2089, 1526.0, 1738.0, 1794.95, 1880.89, 0.3322347437805656, 0.507342569528426, 0.18298866747288964], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.672000000000011, 8, 91, 10.0, 14.0, 18.0, 57.7800000000002, 0.3305680216429495, 0.17196961993106996, 2.6652046744962803], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.801999999999998, 8, 25, 10.0, 13.0, 15.0, 17.0, 0.3325927601207977, 0.6020805911753163, 0.2773771651788684], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.604, 5, 32, 7.0, 9.0, 11.0, 14.0, 0.3325914327107665, 0.5631026296923662, 0.2384004996188502], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.146661931818182, 2066.40625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 1.0494732748868778, 4326.79493071267], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2440000000000015, 1, 28, 2.0, 3.0, 4.0, 7.0, 0.33076592819865536, 0.2780210371678366, 0.13986488956056423], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.3580000000001, 418, 704, 540.0, 637.9000000000001, 650.95, 672.97, 0.3306602756648586, 0.29117155973609343, 0.1530595416651787], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.208000000000004, 1, 17, 3.0, 4.0, 5.0, 8.990000000000009, 0.3307646153306753, 0.29966175907072345, 0.1615061598294313], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.4860000000002, 613, 967, 736.5, 878.0, 890.0, 921.99, 0.3306202634514507, 0.31276870645317856, 0.1746734009055028], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.74200000000001, 15, 610, 21.0, 25.0, 29.0, 61.960000000000036, 0.3304367250019661, 0.17190131618730212, 15.072948657072107], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.27799999999998, 20, 228, 29.0, 35.0, 39.89999999999998, 103.83000000000015, 0.33069964138930885, 74.79454135080718, 0.10205184245998204], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 1.1350953733766234, 0.8877840909090908], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.536, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.3325989548410443, 0.36141228812615084, 0.14258880974142427], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.313999999999999, 2, 24, 3.0, 4.0, 5.0, 7.0, 0.332597848624076, 0.341273325710745, 0.12245057512819985], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7280000000000002, 1, 11, 2.0, 2.0, 3.0, 5.0, 0.33265161928155235, 0.18864660335252953, 0.12896747349099244], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.79600000000006, 65, 121, 92.0, 110.90000000000003, 114.0, 117.0, 0.332632808638341, 0.302978463813542, 0.10849546688008387], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.99800000000005, 57, 385, 79.0, 93.0, 99.0, 285.8700000000001, 0.33064540660788233, 0.17200987749422364, 97.76965104179754], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.26400000000004, 12, 358, 260.5, 334.0, 337.0, 346.96000000000004, 0.33259320259316266, 0.18536549477728895, 0.13933836319576837], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 408.91999999999985, 321, 515, 397.0, 476.0, 489.0, 509.99, 0.33253989314828153, 0.17884086382391615, 0.14158925137954176], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.221999999999993, 4, 266, 6.0, 8.0, 11.0, 28.980000000000018, 0.33038235811068867, 0.14896566265945904, 0.2397207930432048], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 382.25, 304, 483, 379.0, 443.0, 453.95, 470.0, 0.332527729487362, 0.17104070351395353, 0.13379045366093079], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3100000000000005, 2, 22, 3.0, 5.0, 6.0, 9.990000000000009, 0.330761333206321, 0.20307906035170514, 0.1653806666031605], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.105999999999999, 2, 27, 4.0, 5.0, 6.0, 10.0, 0.330755863143808, 0.1937085924667706, 0.1560108221664641], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.8459999999998, 532, 853, 681.0, 775.0, 821.95, 840.99, 0.33059971449408654, 0.30209517465748215, 0.14560592894221977], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.45999999999984, 176, 305, 235.0, 279.0, 286.95, 299.98, 0.3306895803681501, 0.29281205997617715, 0.13595733724120235], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.357999999999999, 3, 45, 4.0, 5.0, 6.0, 9.0, 0.330773805625404, 0.22052986800636673, 0.15472720009235205], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 977.2000000000004, 801, 8678, 924.5, 1082.0, 1104.95, 1129.0, 0.3305977471747117, 0.2485003827908665, 0.18273273916102226], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.69399999999993, 117, 169, 133.0, 150.0, 151.0, 156.99, 0.3326290467649829, 6.431275424293297, 0.1676138555964172], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.16599999999997, 160, 276, 177.0, 201.0, 204.0, 214.97000000000003, 0.33259762738156534, 0.6446385127348305, 0.23775533519854083], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.873999999999996, 5, 35, 7.0, 9.0, 10.0, 14.0, 0.3325272871891868, 0.27138318278991724, 0.2052316850620762], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.816, 5, 36, 6.0, 8.0, 10.0, 14.990000000000009, 0.33253082560753383, 0.2765818647247975, 0.21042966307976751], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.124000000000006, 5, 18, 8.0, 10.0, 10.949999999999989, 15.980000000000018, 0.33252220084473944, 0.26910593072465233, 0.2029554448515255], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.429999999999996, 7, 24, 9.0, 11.0, 13.0, 17.0, 0.3325246334248441, 0.2973595039779922, 0.23120853417821194], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.483999999999998, 4, 31, 7.0, 9.0, 10.0, 15.980000000000018, 0.3325045104236839, 0.24960892793729497, 0.18346196131775527], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1612.8480000000006, 1373, 1969, 1590.5, 1816.7, 1879.95, 1942.98, 0.3321894941750572, 0.27759557818411934, 0.21151127949427473], "isController": false}]}, function(index, item){
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
