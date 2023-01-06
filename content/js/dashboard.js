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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8714316102956817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.822, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.494, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 484.1562220804102, 1, 24932, 13.0, 1021.0, 1816.0, 10429.87000000002, 10.207498179326267, 64.38978488243137, 84.5703407444634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10955.871999999988, 9059, 24932, 10522.0, 12661.000000000002, 13271.9, 22337.92000000007, 0.2197091402517691, 0.1276505813668633, 0.11114192836954727], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0100000000000033, 1, 11, 3.0, 4.0, 5.0, 8.0, 0.2205279792668415, 0.11321656638708129, 0.08011367996803226], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.507999999999998, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.22052681209086764, 0.12650572261564208, 0.09346546528069977], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.342000000000006, 10, 458, 14.0, 19.0, 24.0, 40.950000000000045, 0.21925574077306068, 0.1288363005669515, 2.441361285443787], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.41400000000001, 27, 77, 47.0, 56.0, 58.0, 65.98000000000002, 0.22047264926549537, 0.9169229259311111, 0.09215067762268751], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6839999999999984, 1, 16, 2.0, 4.0, 4.0, 8.0, 0.22047741297095078, 0.137748431192968, 0.09365983851793319], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.603999999999985, 24, 66, 41.0, 50.0, 51.0, 56.0, 0.22047284369842313, 0.9048666259177733, 0.08052426127266626], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1129.0260000000007, 776, 1830, 1112.5, 1456.3000000000002, 1533.0, 1639.6600000000003, 0.22040034400085692, 0.9321815330739368, 0.10761735546916841], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.693999999999999, 4, 22, 6.0, 8.0, 9.0, 14.990000000000009, 0.2203640149089478, 0.3276860245527382, 0.11297959748749765], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3400000000000025, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.21942325912877558, 0.2116470188223466, 0.12042565588903502], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.280000000000008, 7, 26, 10.0, 12.0, 13.0, 17.99000000000001, 0.22047235761674672, 0.3593441063108889, 0.14446967964925492], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.94921875, 2365.583984375], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.7559999999999985, 3, 25, 4.0, 6.0, 7.0, 13.0, 0.21942441465246026, 0.22043368124719961, 0.12921183792522806], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.055999999999997, 7, 39, 17.0, 20.0, 20.0, 24.980000000000018, 0.22047119102946816, 0.34636153293067945, 0.1315506813662159], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.7799999999999985, 5, 18, 8.0, 9.0, 10.0, 15.990000000000009, 0.22047099659945535, 0.3411939384971903, 0.12638327637097685], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2219.0640000000003, 1585, 3518, 2157.5, 2863.0, 3059.2999999999997, 3344.2600000000007, 0.22021144703143958, 0.33627621273196523, 0.12171843654276836], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.617999999999997, 9, 77, 12.0, 16.0, 19.0, 36.0, 0.219249203029147, 0.1288324589401055, 1.7681249205221636], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.687999999999992, 10, 29, 15.0, 17.0, 19.0, 25.0, 0.22047371865084192, 0.3991155634768088, 0.18430224918468818], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.269999999999994, 7, 29, 10.0, 12.0, 14.0, 19.99000000000001, 0.22047313534845778, 0.37321537331613647, 0.15846506603170404], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.026123046875, 2131.011962890625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.8501838235294118, 3214.1938025210084], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.733999999999997, 2, 18, 2.0, 3.0, 4.0, 9.0, 0.21941189712741557, 0.1844859799088914, 0.09320720239299392], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 692.8379999999999, 484, 983, 665.0, 844.8000000000001, 867.95, 921.9200000000001, 0.21935982030043522, 0.1931009074367366, 0.10196804146778042], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6240000000000023, 2, 17, 3.0, 4.0, 5.0, 10.0, 0.21942585907418086, 0.1987925426969808, 0.10757009888206913], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 952.6920000000005, 743, 1307, 916.0, 1144.0, 1183.85, 1264.98, 0.2193500045186101, 0.20750638952853787, 0.1163154809117239], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 9.046052631578947, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.99000000000002, 19, 550, 28.0, 35.0, 38.94999999999999, 79.97000000000003, 0.21919720339440021, 0.1288019035687935, 10.026559577142292], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.77200000000003, 27, 226, 34.5, 44.0, 52.0, 105.87000000000012, 0.219322390315776, 49.63163313839594, 0.0681098829300945], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.519221844059406, 0.4080290841584158], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0200000000000005, 2, 18, 3.0, 4.0, 4.0, 7.0, 0.22049151085634053, 0.23953043604180696, 0.09495776981215447], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8480000000000016, 2, 17, 4.0, 5.0, 6.0, 8.0, 0.22049044129838882, 0.22629166538965953, 0.08160730200399352], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0719999999999987, 1, 13, 2.0, 3.0, 4.0, 5.990000000000009, 0.2205288546569299, 0.12506182733186108, 0.08592872364073732], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 207.30200000000005, 89, 497, 217.5, 307.90000000000003, 318.95, 366.8600000000001, 0.22050843069883092, 0.2008500179659244, 0.07235432882305388], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 116.72400000000009, 82, 345, 115.0, 135.0, 147.95, 259.8800000000001, 0.2192918976906809, 0.12891965079081044, 64.87099770357526], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 271.21599999999995, 17, 599, 336.0, 449.90000000000003, 472.0, 512.94, 0.22048830221361437, 0.12291060117127796, 0.09280318188873808], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 488.1440000000006, 291, 1087, 462.5, 789.7000000000005, 884.8, 949.9100000000001, 0.220521268173709, 0.11859694101166336, 0.09432452681648881], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.144000000000005, 5, 293, 7.0, 10.0, 13.0, 27.940000000000055, 0.21917087657392084, 0.10310234663517913, 0.1594553740698936], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 493.71200000000005, 266, 1054, 453.0, 815.9000000000001, 884.8499999999999, 975.9100000000001, 0.2204640945561683, 0.11339906566765566, 0.08913294447876334], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.051999999999997, 2, 19, 4.0, 5.0, 6.949999999999989, 11.990000000000009, 0.219410452889504, 0.13471244710562508, 0.11013376248555183], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.568000000000003, 3, 30, 4.0, 5.0, 6.0, 11.990000000000009, 0.2194078533091751, 0.12849715205863807, 0.10391875864741203], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 840.6000000000001, 575, 1374, 822.5, 1125.7, 1243.9, 1317.97, 0.2193183497960997, 0.2004085674684653, 0.09702266841565739], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.8379999999998, 245, 1017, 385.0, 849.3000000000002, 885.0, 957.8100000000002, 0.2193197928217509, 0.19419868100528298, 0.09059792223007875], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.608000000000001, 3, 35, 5.0, 7.0, 8.0, 14.0, 0.21942528130321062, 0.14635494836923132, 0.10306988311215266], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1185.324000000001, 896, 10449, 1107.5, 1416.0, 1434.0, 1632.0600000000009, 0.21934057449683272, 0.16480959455991506, 0.12166547491621191], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.6459999999999, 142, 258, 166.0, 188.0, 190.0, 229.8800000000001, 0.22059063583927238, 4.265111327130619, 0.11158784117650693], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.34199999999996, 195, 319, 220.5, 257.0, 263.0, 284.98, 0.22057535758574096, 0.42751769331444917, 0.15810772701946665], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.268, 6, 24, 9.0, 11.0, 12.0, 16.99000000000001, 0.22036187827650566, 0.17990481468667846, 0.13643499104228965], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.128000000000009, 6, 24, 9.0, 11.0, 13.0, 18.99000000000001, 0.22036294658754757, 0.18322404295270484, 0.13987882351748623], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.254000000000005, 7, 30, 10.0, 12.0, 14.0, 23.0, 0.2203596445687077, 0.17833421977591188, 0.13492724330525363], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.388000000000005, 8, 28, 12.0, 15.0, 17.0, 22.0, 0.22036032438802633, 0.19705678969273396, 0.15364967930961992], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.441999999999993, 6, 32, 9.0, 11.0, 13.0, 28.930000000000064, 0.2203499333221102, 0.16541523168363215, 0.12201016815784813], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1983.436, 1595, 2917, 1904.5, 2498.3, 2589.8, 2643.8900000000003, 0.2201943787898205, 0.18400637878343487, 0.1406319567661549], "isController": false}]}, function(index, item){
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
