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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9003190810465859, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.488, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.731, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.641, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 187.55690278664204, 1, 3461, 17.0, 536.0, 1203.0, 2246.0, 26.240961353611606, 174.62248767460483, 217.4094968375204], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.112000000000002, 15, 71, 26.0, 30.0, 31.0, 41.97000000000003, 0.5686968766030143, 0.33028292918415886, 0.28768064656285297], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.651999999999998, 4, 22, 7.0, 10.0, 12.0, 20.970000000000027, 0.5685875829569284, 6.096332764674678, 0.20655720787107165], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.025999999999991, 5, 36, 8.0, 10.0, 11.0, 17.99000000000001, 0.5685701257335976, 6.105272695471567, 0.2409760103206849], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.73200000000001, 14, 263, 20.0, 27.900000000000034, 33.94999999999999, 46.98000000000002, 0.5650630553863505, 0.30512411715960885, 6.291844685073407], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.77600000000001, 26, 85, 46.0, 55.0, 57.0, 68.97000000000003, 0.5683161474530344, 2.363664597001337, 0.23753838975576044], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5619999999999985, 1, 14, 2.0, 4.0, 4.0, 8.0, 0.5683691216423594, 0.35523070102647464, 0.24144586710393195], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.747999999999955, 23, 78, 40.0, 48.0, 51.0, 67.97000000000003, 0.568298060967016, 2.33231744135164, 0.20756198711099996], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 771.0460000000004, 561, 1613, 762.5, 916.9000000000001, 932.0, 1203.020000000001, 0.5679978643280301, 2.4021816709219173, 0.27734270719142096], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.312000000000006, 7, 35, 11.0, 14.0, 16.0, 23.99000000000001, 0.5681140318484726, 0.8447977709335818, 0.29126940109418764], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.487999999999999, 2, 20, 3.0, 5.0, 6.949999999999989, 12.990000000000009, 0.5660014263235944, 0.5459426453067162, 0.31063750155650394], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.99999999999998, 11, 39, 19.0, 23.0, 24.0, 30.0, 0.5682722251267247, 0.9260561960851726, 0.37237369439456275], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.701904296875, 1945.3815660978619], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.614000000000001, 2, 27, 4.0, 6.0, 7.0, 15.980000000000018, 0.566012318692104, 0.5687439914254794, 0.33330608219857294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.970000000000013, 12, 40, 20.0, 23.0, 26.0, 35.99000000000001, 0.5682638289844103, 0.8929067390975742, 0.33907148389597136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.877999999999993, 6, 28, 11.0, 14.0, 16.0, 22.99000000000001, 0.5682677040961873, 0.8794653055518619, 0.3257550217817011], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1965.9440000000002, 1474, 2824, 1946.0, 2227.5, 2293.95, 2565.7000000000003, 0.5671873068018237, 0.8660329813747032, 0.31350392153303924], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.133999999999997, 12, 74, 17.0, 23.0, 28.94999999999999, 44.0, 0.5650253809401119, 0.3049437566672995, 4.5566206990268], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.11799999999998, 14, 41, 23.0, 27.0, 29.0, 33.99000000000001, 0.5682974150423779, 1.028768165271686, 0.4750611203869878], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.166, 11, 45, 19.0, 23.0, 25.0, 35.97000000000003, 0.5682838509641505, 0.9621156589762707, 0.4084540178804831], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.7351650280898876, 3069.7356540930978], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4840000000000004, 1, 26, 2.0, 3.0, 4.949999999999989, 12.0, 0.5658483368019837, 0.475488325346384, 0.2403750258875614], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 408.2639999999998, 310, 817, 411.5, 470.90000000000003, 485.95, 534.8500000000001, 0.5656319749492912, 0.49801796369378043, 0.26293048835533456], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1580000000000017, 1, 18, 3.0, 4.0, 6.0, 12.990000000000009, 0.5658624252637202, 0.5126525688880916, 0.2774052123851441], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1167.846, 926, 1861, 1152.5, 1349.9, 1383.95, 1651.97, 0.565245112890754, 0.5345971254318472, 0.29973446904265566], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, 1.0, 44.53800000000001, 10, 719, 43.0, 50.0, 65.84999999999997, 97.96000000000004, 0.5645826040808031, 0.30362193855082936, 25.825243335102357], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.637999999999955, 10, 191, 45.0, 54.900000000000034, 61.94999999999999, 79.96000000000004, 0.5653934007282267, 125.77557950173292, 0.17558115374177352], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.6595381724683544, 1.3041435917721518], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3499999999999988, 1, 18, 2.0, 3.0, 4.0, 9.980000000000018, 0.5686179740141586, 0.6178778377590766, 0.24488332669945695], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2760000000000007, 2, 16, 3.0, 4.0, 6.0, 9.990000000000009, 0.5686121541985184, 0.5834438247440678, 0.21045313129027196], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1979999999999995, 1, 26, 2.0, 3.0, 4.0, 8.0, 0.5685992217013853, 0.3223557790719096, 0.22155379829966088], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.9999999999999, 86, 215, 123.0, 148.0, 154.0, 176.9000000000001, 0.5685352145026511, 0.5179466846153234, 0.18655061725868238], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 171.43999999999994, 27, 637, 173.0, 201.0, 238.74999999999994, 396.52000000000044, 0.5651531112809082, 0.30313841532197905, 167.18376998946553], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.379999999999999, 1, 19, 2.0, 3.0, 5.0, 8.0, 0.5686082743876089, 0.3170657467532467, 0.23932633423931585], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.217999999999999, 2, 24, 3.0, 4.900000000000034, 5.949999999999989, 9.0, 0.5686541888773515, 0.3057271509060367, 0.2432329440705859], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.628000000000002, 6, 321, 10.0, 14.0, 19.0, 39.98000000000002, 0.5643952392132782, 0.23849557027341564, 0.4106195832166917], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.564000000000003, 2, 55, 4.0, 6.0, 6.949999999999989, 10.980000000000018, 0.5686199139791793, 0.29247831532419294, 0.22989125428455104], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.683999999999995, 2, 18, 3.0, 5.0, 6.0, 9.990000000000009, 0.5658406524821732, 0.3475399918490654, 0.2840254837654658], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.097999999999999, 2, 33, 4.0, 5.0, 6.949999999999989, 13.0, 0.565820802288632, 0.33137538412159717, 0.2679912979589712], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 516.4459999999999, 374, 1146, 517.5, 630.0, 640.9, 781.8200000000002, 0.5653345876223383, 0.5164629583591502, 0.25009430487589773], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.189999999999984, 6, 117, 15.5, 26.0, 32.0, 43.99000000000001, 0.5655091448483813, 0.5007351530522225, 0.2336038752645169], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.816, 6, 49, 10.0, 12.0, 13.0, 21.99000000000001, 0.5660244930118616, 0.37730949490521354, 0.265876739393267], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 537.1599999999996, 443, 3360, 519.0, 588.0, 634.8499999999999, 744.8900000000001, 0.5657727833871006, 0.4252423381635242, 0.3138270907850324], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 173.692, 142, 359, 179.0, 189.0, 191.95, 319.93000000000006, 0.5685811171936656, 10.993493690739633, 0.2876220885803894], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 260.80199999999974, 210, 500, 266.0, 285.0, 288.95, 367.7000000000003, 0.5684149975160264, 1.1017947596968756, 0.40743809392262054], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.19400000000001, 11, 40, 19.0, 22.0, 23.0, 31.980000000000018, 0.5681004765226797, 0.4635755366987227, 0.35173408409704976], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.82999999999998, 11, 39, 19.0, 22.0, 23.0, 31.0, 0.5681043494068991, 0.47248750525496525, 0.36061311241648863], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.018000000000008, 11, 38, 19.0, 22.0, 24.0, 30.99000000000001, 0.5680869218437375, 0.4597454228526598, 0.3478422851523666], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.083999999999993, 13, 55, 22.0, 26.0, 28.0, 37.97000000000003, 0.568090794543147, 0.5081427915385148, 0.39611018291387406], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.34600000000002, 11, 48, 18.0, 22.0, 23.94999999999999, 33.0, 0.5679230259847502, 0.4263360442429075, 0.31446519114585286], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2192.0560000000014, 1722, 3461, 2178.0, 2472.4, 2559.0, 2786.4900000000007, 0.5668458655396259, 0.4735587571876056, 0.3620285117801908], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["500", 14, 2.7237354085603114, 0.05956179536268879], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 14, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
