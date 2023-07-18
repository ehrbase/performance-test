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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8886832588810891, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.181, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.573, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.932, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.994, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.093, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.88789619229857, 1, 18874, 9.0, 843.0, 1518.0, 6089.990000000002, 15.161669647827408, 95.50727593238948, 125.46411019568262], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6235.2580000000025, 5176, 18874, 6074.5, 6595.0, 6872.349999999999, 16205.50000000008, 0.3269826758038706, 0.1899022139915233, 0.16476861397929415], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3799999999999994, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.328123820805019, 0.16845505257363919, 0.11856036493931349], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7079999999999997, 2, 26, 3.0, 5.0, 5.0, 11.0, 0.3281210215326139, 0.18832031793450443, 0.1384260559590715], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.383999999999997, 8, 376, 12.0, 16.0, 18.0, 38.99000000000001, 0.32615360530195303, 0.16967313191445643, 3.588645186462016], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.382, 23, 46, 34.0, 40.0, 41.0, 44.0, 0.3280641851016868, 1.3643849860687542, 0.1364798270051939], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3100000000000005, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.32807365647276204, 0.204953123810733, 0.13872645825459565], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.453999999999994, 21, 52, 30.0, 35.0, 36.0, 39.0, 0.3280631088441221, 1.3464395587600395, 0.11917917625977874], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 857.3359999999996, 682, 1115, 859.5, 994.0, 1056.8, 1082.0, 0.3279217500003279, 1.3868496112733595, 0.15947756982437825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.744000000000007, 3, 14, 5.0, 8.0, 9.0, 12.990000000000009, 0.3280157605012606, 0.48776648307897896, 0.16753148705288992], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.948000000000001, 2, 17, 4.0, 5.0, 5.949999999999989, 10.990000000000009, 0.3262440501241359, 0.3146821394024514, 0.1784147149116368], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.790000000000003, 6, 25, 7.5, 10.0, 11.0, 13.0, 0.3280609563501775, 0.5346080063194382, 0.21432888652174684], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.8209054791271347, 2244.3833758301707], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.1160000000000005, 2, 17, 4.0, 5.0, 6.0, 10.0, 0.32624703033640634, 0.32774763923570766, 0.19147896995330102], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.220000000000004, 6, 35, 8.0, 10.0, 11.0, 14.0, 0.3280583733947284, 0.5153816268201499, 0.19510502870838828], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.687999999999999, 5, 15, 6.0, 8.0, 9.0, 12.990000000000009, 0.32805772766222124, 0.5076917593785143, 0.1874157916820307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1571.5760000000002, 1354, 1918, 1551.0, 1772.0, 1820.0, 1906.97, 0.32771606156080674, 0.5004422681867667, 0.1804998620315381], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.891999999999998, 8, 100, 11.0, 14.0, 17.0, 37.99000000000001, 0.3261346714421479, 0.1696632820546354, 2.629460788502318], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.129999999999992, 8, 32, 11.0, 13.0, 14.949999999999989, 18.99000000000001, 0.32806676814865365, 0.593887352328946, 0.2736025585927248], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.855999999999997, 6, 25, 7.0, 10.0, 11.0, 14.0, 0.3280652613663131, 0.5554394768392487, 0.23515615414343144], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.82666015625, 2841.30859375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.8433948863636362, 3477.1697443181815], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.408000000000001, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.32633198928064683, 0.27429414696654836, 0.13798999156105476], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 572.1919999999994, 440, 739, 563.0, 663.0, 671.0, 700.0, 0.326196799748437, 0.28724112920035466, 0.15099344050855384], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.292, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.32629578582466695, 0.2956131479173845, 0.15932411417220063], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 765.5299999999995, 618, 949, 747.0, 891.9000000000001, 908.95, 937.99, 0.32610808265405017, 0.30850015698027833, 0.17228952413656365], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.2, 15, 542, 21.0, 26.0, 29.0, 65.98000000000002, 0.3260223899136497, 0.16960487044033237, 14.871587727408768], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.18600000000002, 19, 235, 28.0, 35.0, 40.0, 128.8800000000001, 0.32627385469720155, 73.79355845175715, 0.10068607234796455], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6979999999999995, 2, 14, 2.0, 4.0, 4.0, 7.0, 0.32805923437535883, 0.3564792877752007, 0.1406425819245923], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.432000000000002, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3280585886394623, 0.3366156637396186, 0.12077938273152079], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8579999999999992, 1, 12, 2.0, 3.0, 3.0, 7.0, 0.3281248974609695, 0.18607950117632777, 0.12721248466016105], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.29199999999994, 66, 121, 89.0, 109.90000000000003, 113.0, 116.0, 0.3281031503808293, 0.29885262635908527, 0.10701801975312206], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.7740000000001, 58, 451, 80.0, 94.0, 102.94999999999999, 316.82000000000016, 0.3262170178284125, 0.16970612067126328, 96.46020588697755], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.46999999999977, 12, 351, 261.0, 333.0, 336.95, 341.99, 0.3280553599981104, 0.18283640088332187, 0.13743725531170836], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 430.8720000000001, 326, 549, 417.5, 508.0, 516.0, 529.98, 0.32798843381586995, 0.17639307654954856, 0.13965132533566338], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.135999999999997, 4, 253, 6.0, 8.0, 10.0, 30.970000000000027, 0.3259724409859493, 0.14697728098400648, 0.23652101919195342], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.5860000000001, 305, 511, 395.5, 466.90000000000003, 480.0, 503.98, 0.32798219450262484, 0.16870263834616947, 0.13196158606941547], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5879999999999983, 2, 11, 3.0, 5.0, 6.0, 9.990000000000009, 0.3263300724256963, 0.20035837874488233, 0.16316503621284814], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.162000000000003, 2, 24, 4.0, 5.0, 6.0, 9.0, 0.32632559985171766, 0.1911139897334703, 0.15392115696130823], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 686.2500000000001, 543, 883, 691.5, 809.9000000000001, 832.95, 844.99, 0.32617488192469274, 0.2980518542634319, 0.14365710131644183], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.35000000000014, 165, 357, 240.0, 290.90000000000003, 298.0, 312.99, 0.3262678933469409, 0.2888968374771531, 0.13413943662017785], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.578000000000004, 3, 61, 4.0, 5.0, 6.0, 11.0, 0.3262485204629597, 0.21751281973170625, 0.15261039189624775], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.1199999999994, 753, 8951, 932.0, 1094.8000000000002, 1117.95, 1139.99, 0.3260672507183262, 0.24509494487344027, 0.18022857803376233], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.3019999999999, 117, 161, 139.0, 151.0, 152.0, 156.0, 0.32806332409507016, 6.342998647846001, 0.16531315940728142], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.79800000000017, 159, 258, 179.5, 203.0, 205.0, 212.0, 0.3280336221341343, 0.635792588072107, 0.23449278457244754], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.112000000000008, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.3280125327028495, 0.2676985876026351, 0.20244523502753992], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.965999999999999, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.32801446937427303, 0.2728253942487911, 0.20757165640090713], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.497999999999992, 6, 25, 8.0, 10.0, 11.0, 17.99000000000001, 0.3280099505098587, 0.2654542246943603, 0.2002013858092399], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.865999999999985, 7, 23, 10.0, 12.0, 12.0, 16.0, 0.32801038087253387, 0.29332264244998824, 0.22806971795043368], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.941999999999994, 5, 28, 8.0, 9.0, 10.0, 16.99000000000001, 0.32798047335453834, 0.24621276335192108, 0.18096578852081463], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1636.1239999999996, 1404, 2052, 1603.0, 1855.9, 1913.8, 1983.0, 0.327666451280586, 0.27381587795440454, 0.20863137327631062], "isController": false}]}, function(index, item){
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
