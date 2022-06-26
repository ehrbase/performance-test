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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9209497841399682, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.004, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.74, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.785, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 180.5201999545566, 1, 3525, 12.0, 568.9000000000015, 1255.8500000000022, 2137.9900000000016, 27.229597291518175, 182.40800783376827, 239.85617889817578], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.04, 4, 41, 6.0, 9.0, 12.0, 21.980000000000018, 0.630483631383962, 6.757769843841814, 0.22781146837115815], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.342000000000006, 4, 40, 7.0, 9.0, 10.0, 15.990000000000009, 0.6304573968414084, 6.769314653406045, 0.26597421429246915], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.515999999999977, 12, 247, 18.0, 24.0, 29.0, 42.0, 0.6261246764500734, 0.33742250141817237, 6.970528624541833], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.765999999999956, 26, 122, 43.0, 52.0, 53.0, 56.99000000000001, 0.6301824630303458, 2.6210420996545336, 0.2621657512216087], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.222, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.6302253559827923, 0.39389084748924524, 0.26649177650444245], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.83599999999998, 22, 61, 38.0, 46.0, 47.0, 51.98000000000002, 0.6301713435883216, 2.5858194905694862, 0.228929433412945], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 758.2079999999999, 558, 999, 768.5, 897.8000000000001, 909.0, 965.98, 0.6297879629886209, 2.6636832692419117, 0.30628359918782544], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.657999999999996, 6, 23, 9.0, 11.0, 12.0, 17.99000000000001, 0.6300538191972359, 0.9370819986693264, 0.3217950658595257], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.105999999999999, 1, 15, 3.0, 4.0, 5.0, 10.0, 0.627222720515828, 0.6051719217476934, 0.3430124252820934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.593999999999998, 8, 26, 14.0, 17.0, 18.0, 20.99000000000001, 0.6301475175338547, 1.027066608167972, 0.41168817307631717], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.6606158088235294, 1830.9443329140865], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.033999999999997, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.6272313756187637, 0.6295834932773341, 0.3681309147918721], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.724000000000004, 9, 35, 15.0, 18.0, 19.94999999999999, 26.960000000000036, 0.6301348110414742, 0.9894101118993398, 0.374757910082283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.673999999999996, 5, 38, 9.0, 11.0, 12.0, 15.0, 0.6301371934697623, 0.9753588395015363, 0.3599904865037216], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1851.0159999999998, 1439, 2260, 1845.0, 2102.8, 2153.0, 2228.92, 0.6289300265031114, 0.9605923451668614, 0.3464028661599168], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.436000000000003, 11, 72, 15.0, 21.0, 25.94999999999999, 39.98000000000002, 0.6260815558877962, 0.33810849649018676, 5.047782544345356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.063999999999993, 12, 39, 19.0, 21.0, 23.0, 27.99000000000001, 0.6301753147725697, 1.1409619468636176, 0.5255563660310298], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.70000000000002, 8, 36, 14.5, 17.0, 18.0, 23.980000000000018, 0.6301578419362481, 1.067083689372514, 0.45169517185664665], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 4.955535239361702, 1450.880984042553], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.8625382532956685, 3601.588247410546], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.022000000000002, 1, 17, 2.0, 2.0, 3.0, 7.0, 0.6271456219591277, 0.5273167778386806, 0.26518950616045145], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 396.9159999999999, 309, 558, 403.5, 460.0, 465.0, 499.8800000000001, 0.6269112958131102, 0.551510519258088, 0.29019136153849046], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8400000000000025, 1, 15, 3.0, 4.0, 5.0, 9.0, 0.627191249427688, 0.5683920697938422, 0.30624572725961324], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1137.881999999999, 921, 1397, 1126.0, 1323.8000000000002, 1351.0, 1374.99, 0.6264761343916604, 0.5928275138921083, 0.33098006709559397], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.35546875, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.04600000000003, 26, 644, 39.0, 46.0, 53.0, 81.94000000000005, 0.6255864873318737, 0.3378411401313732, 28.61447255239287], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.47400000000001, 28, 179, 41.0, 49.0, 53.0, 76.97000000000003, 0.6265216644926365, 141.7792829569191, 0.19334066990202453], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 2.0326126453488373, 1.5897529069767442], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0640000000000027, 1, 18, 2.0, 3.0, 4.0, 8.980000000000018, 0.6305361070196325, 0.6853385616336434, 0.27031772556798694], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0639999999999987, 2, 15, 3.0, 4.0, 5.0, 11.0, 0.6305281556042603, 0.6471534097071071, 0.23213780728789662], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9640000000000009, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.6305003272296699, 0.35773504894574043, 0.24444202139665913], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.16, 83, 174, 118.0, 143.90000000000003, 148.0, 154.0, 0.6304200362617605, 0.5743963806955299, 0.20562528526506643], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 155.19200000000004, 107, 564, 156.0, 184.0, 207.95, 308.8800000000001, 0.6262352490287092, 0.3381914967899181, 185.2518839504673], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.143999999999997, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.6305225897328224, 0.350875969270851, 0.26415448339392655], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.088000000000003, 1, 23, 3.0, 4.0, 5.0, 8.0, 0.6305870008273301, 0.33859566067861246, 0.26849212144601164], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.558000000000009, 6, 297, 9.0, 13.0, 17.0, 40.960000000000036, 0.6253760073244038, 0.2644412218471356, 0.4537640365644844], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.231999999999997, 2, 58, 4.0, 5.0, 6.0, 10.990000000000009, 0.6305424682963247, 0.3245076960860968, 0.2536948212285994], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4200000000000013, 2, 25, 3.0, 4.0, 5.0, 8.0, 0.6271275301460204, 0.3852179848260223, 0.3135637650730102], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7819999999999947, 2, 30, 3.0, 5.0, 5.949999999999989, 13.980000000000018, 0.6271047202172291, 0.36744417200228263, 0.2957925584618375], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 506.9700000000005, 368, 835, 512.0, 616.9000000000001, 624.95, 646.96, 0.6264502322877461, 0.5719050147967545, 0.27590728004079446], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.142000000000007, 7, 114, 15.0, 24.900000000000034, 32.94999999999999, 47.98000000000002, 0.6266559383170027, 0.5550556016147671, 0.25763881839009584], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.268000000000008, 4, 35, 7.0, 9.0, 10.0, 16.980000000000018, 0.6272439652858101, 0.41836682450215645, 0.293408065792874], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 504.8879999999999, 348, 3525, 496.0, 557.9000000000001, 579.95, 633.9300000000001, 0.6269985579033168, 0.4714735249858925, 0.3465636560285911], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.694000000000008, 9, 29, 14.0, 17.0, 18.0, 21.0, 0.6300268265422742, 0.5143578388567785, 0.38884468200655986], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.414000000000012, 9, 35, 14.0, 16.0, 17.94999999999999, 20.99000000000001, 0.6300300020286966, 0.5234909442637659, 0.39869086065878456], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.574000000000003, 9, 37, 14.5, 17.0, 18.0, 23.0, 0.6300117434188973, 0.5100388039983066, 0.3845286519890731], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.343999999999994, 11, 34, 17.0, 20.0, 21.0, 27.99000000000001, 0.6300149187532761, 0.5635680327910165, 0.4380572481956373], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.346000000000002, 8, 43, 14.0, 16.0, 18.0, 24.0, 0.6297752709922991, 0.4729464681573028, 0.3474834258893057], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2083.112, 1633, 2600, 2064.0, 2385.0, 2462.85, 2533.8900000000003, 0.6285165500977972, 0.5246885621929697, 0.4001882721325818], "isController": false}]}, function(index, item){
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
