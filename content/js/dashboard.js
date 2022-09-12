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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9015954052329291, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.984, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.705, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.709, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 186.01033822590844, 1, 3274, 18.0, 532.0, 1180.8500000000022, 2177.9900000000016, 26.453716406706334, 176.26694128482004, 219.17219784605635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 30.46199999999999, 19, 52, 32.0, 36.0, 38.0, 44.99000000000001, 0.5729417925515276, 0.3326833517581865, 0.2898279770914954], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.682000000000001, 5, 36, 7.0, 10.0, 12.0, 19.99000000000001, 0.572952297137645, 6.139305840002498, 0.20814282669453507], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.068000000000001, 5, 36, 8.0, 10.0, 12.0, 17.99000000000001, 0.5729319448518627, 6.152044751141281, 0.2428246719391684], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 21.277999999999995, 11, 249, 20.0, 27.0, 32.0, 44.98000000000002, 0.5693891820610523, 0.3071643340452596, 6.340015091660271], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.37599999999999, 27, 62, 46.0, 55.0, 56.0, 58.0, 0.5727435907128481, 2.382078627528806, 0.23938892268076076], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4280000000000004, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5727790207082527, 0.3579220028192183, 0.24331921289852532], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.49000000000001, 24, 114, 40.0, 48.0, 50.0, 54.98000000000002, 0.5727357179757687, 2.3506919596066678, 0.20918277199505614], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 764.1860000000003, 575, 1011, 761.0, 906.0, 922.0, 951.97, 0.5723797029578294, 2.42064854233492, 0.2794822768348776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.620000000000005, 8, 33, 14.0, 16.0, 18.0, 25.980000000000018, 0.5725363474700191, 0.8513414204569527, 0.29353670158375006], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.1599999999999993, 1, 18, 3.0, 4.0, 5.0, 9.990000000000009, 0.5702366139806051, 0.550124635903922, 0.3129618916573243], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.217999999999993, 14, 79, 22.5, 27.0, 29.0, 36.98000000000002, 0.5727101330749266, 0.9332233318242421, 0.3752817375910895], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.7773366347905282, 2154.448073201275], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.211999999999999, 2, 23, 4.0, 5.0, 7.0, 10.980000000000018, 0.5702457188802654, 0.5729332245827227, 0.3357989926609376], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.00399999999999, 15, 45, 24.0, 28.0, 30.0, 40.0, 0.5727035732121339, 0.8998179840662411, 0.3417205890943495], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.987999999999987, 8, 72, 13.5, 16.0, 17.0, 24.0, 0.5726996373665896, 0.8863891524102637, 0.32829559290448057], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1910.3499999999992, 1547, 2375, 1908.5, 2119.8, 2192.8, 2298.8100000000004, 0.5715435333278465, 0.8728139531494336, 0.31591175767925894], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.168000000000013, 12, 409, 16.0, 24.0, 29.0, 62.840000000000146, 0.5693574118378515, 0.30737849663737515, 4.591556159137674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.347999999999995, 18, 79, 26.0, 33.0, 34.0, 43.99000000000001, 0.5727337498253162, 1.036766660967966, 0.4787696189946003], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.124000000000006, 14, 53, 23.0, 28.0, 29.0, 38.99000000000001, 0.572721285186564, 0.9695634432003666, 0.41164342372784285], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.7304749800637959, 3050.152013556619], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1319999999999966, 1, 20, 2.0, 3.0, 3.9499999999999886, 7.990000000000009, 0.5701312784281709, 0.4790873263665192, 0.24219443956665462], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 405.22999999999985, 315, 599, 405.5, 472.0, 482.0, 512.0, 0.5699343663583702, 0.5017737782316989, 0.26493042811189865], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.962000000000001, 1, 32, 3.0, 4.0, 5.0, 11.0, 0.5701813404735242, 0.5165330672392048, 0.27952249308370036], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1141.8779999999995, 934, 1445, 1131.5, 1317.0, 1349.0, 1392.94, 0.5695766336881796, 0.5388228328321059, 0.3020313594655093], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.868443080357], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 44.05800000000001, 12, 642, 43.0, 52.0, 57.0, 88.94000000000005, 0.5689505479562728, 0.30623429874284686, 26.02504264284357], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.720000000000006, 9, 203, 47.0, 56.0, 62.0, 91.0, 0.5697096759491364, 126.97261307668862, 0.17692155952326694], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 1.5244594840116281, 1.1979923691860466], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.170000000000001, 1, 14, 2.0, 3.0, 4.0, 7.990000000000009, 0.5729976025780308, 0.6225395124821798, 0.24676947532901522], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0760000000000005, 2, 11, 3.0, 4.0, 5.0, 9.0, 0.5729910361282309, 0.5878720162208032, 0.21207383075449168], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.077999999999999, 1, 12, 2.0, 3.0, 4.0, 6.980000000000018, 0.5729654284119805, 0.32499337687775093, 0.2232550839222463], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.57799999999997, 86, 235, 123.0, 148.0, 153.0, 184.91000000000008, 0.5729017473503294, 0.5219246813234031, 0.18798338584932683], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 166.91, 30, 401, 169.0, 196.90000000000003, 219.84999999999997, 336.97, 0.5694760820045558, 0.30562402121298404, 168.46259253986332], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2039999999999997, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.5729877529597682, 0.3194429105084808, 0.24116964992740245], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2160000000000006, 2, 28, 3.0, 4.0, 5.0, 10.970000000000027, 0.5730356909549755, 0.3082450756894192, 0.24510706312331956], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.408000000000003, 6, 308, 10.0, 15.0, 19.0, 39.87000000000012, 0.5687686840512711, 0.24027921885593317, 0.41380143517402046], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.368000000000002, 2, 56, 4.0, 5.0, 6.0, 10.0, 0.5730008858593695, 0.2947317349521372, 0.23166246752517478], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.637999999999999, 2, 18, 3.0, 5.0, 6.0, 11.0, 0.570123477342723, 0.3501059235971827, 0.2861752610880464], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8520000000000025, 2, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.5701078758122612, 0.3339830009509399, 0.270021796649362], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.2120000000001, 380, 801, 535.0, 635.0, 645.0, 677.98, 0.5696486634903057, 0.5205008899336245, 0.2520027778917075], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.593999999999998, 6, 107, 15.0, 25.0, 33.0, 47.0, 0.5698362860350221, 0.504534383209204, 0.23539135643829526], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.898000000000007, 7, 45, 12.0, 14.0, 15.0, 24.99000000000001, 0.5702554744525546, 0.38009754932709855, 0.2678641437614051], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 515.6780000000001, 351, 3274, 506.0, 556.8000000000001, 581.0, 657.9100000000001, 0.570056526805198, 0.4283974798941063, 0.3162032297122583], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.16400000000021, 143, 263, 181.0, 191.0, 195.0, 219.94000000000005, 0.5727895193264911, 11.074798095274371, 0.28975094825304926], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 275.746, 20, 366, 279.0, 303.0, 307.0, 334.99, 0.5728708966689849, 1.1086092416822009, 0.41063206851077627], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.56599999999999, 14, 42, 24.0, 27.0, 29.0, 32.99000000000001, 0.572493081421111, 0.4671599451923748, 0.35445372423924254], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 22.588000000000005, 14, 61, 24.0, 28.0, 29.0, 48.90000000000009, 0.5725022585214099, 0.4760803546994993, 0.3634047539442543], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.025999999999986, 14, 50, 24.0, 27.0, 28.0, 33.0, 0.5724622747360949, 0.46338361341050127, 0.3505213342378237], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.97000000000001, 16, 90, 27.0, 31.0, 32.0, 42.97000000000003, 0.572476039015387, 0.5120328559741882, 0.3991678631415882], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.88399999999999, 14, 128, 23.0, 27.0, 28.0, 37.98000000000002, 0.572183199328028, 0.42950171926746816, 0.3168240957216718], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2162.065999999999, 1659, 2729, 2141.5, 2466.8, 2530.9, 2659.99, 0.5711348449368896, 0.47730363670112513, 0.3647677622936775], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
