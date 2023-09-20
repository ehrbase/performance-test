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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909593703467348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.178, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.624, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.967, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.113, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.60191448627916, 1, 18006, 9.0, 840.0, 1508.0, 6053.0, 15.247640361973339, 96.04882768155429, 126.17552519177127], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6201.044000000003, 5451, 18006, 6047.5, 6511.6, 6669.85, 15833.010000000077, 0.32902053219729127, 0.19108574287407332, 0.16579550255254127], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3479999999999994, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.3302003920139054, 0.16952114070862326, 0.11931068852064941], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.530000000000001, 2, 14, 3.0, 4.0, 5.0, 7.0, 0.3301977752594694, 0.18951224072045192, 0.13930218643758865], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.020000000000005, 7, 361, 11.0, 15.0, 19.94999999999999, 41.90000000000009, 0.32824617412671747, 0.17076173771390982, 3.611669574107154], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.883999999999986, 24, 52, 34.0, 40.0, 41.0, 44.99000000000001, 0.33016288916299746, 1.373113279011083, 0.13735292068695013], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.198000000000001, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3301707378919787, 0.20626320579773214, 0.13961321240940117], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.104, 21, 48, 30.0, 35.0, 37.0, 39.99000000000001, 0.3301626711480747, 1.3550566012311767, 0.1199419078780115], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.9020000000005, 686, 1099, 858.0, 1004.9000000000001, 1063.0, 1083.0, 0.3300005478009093, 1.3956412816082775, 0.16048854766098913], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.521999999999999, 3, 16, 5.0, 7.900000000000034, 9.0, 13.0, 0.3301831658094011, 0.4909894613375324, 0.16863847238116875], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8300000000000014, 2, 19, 4.0, 5.0, 5.0, 9.990000000000009, 0.3284354844324865, 0.3167959104773547, 0.17961315554901605], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.718000000000001, 5, 16, 7.0, 10.0, 11.0, 13.0, 0.33015743887630256, 0.538024433425073, 0.2156985611408656], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.8617872260956175, 2356.155456299801], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.088000000000002, 2, 19, 4.0, 5.0, 6.0, 10.990000000000009, 0.32843785758671745, 0.3299485434355782, 0.1927647972750168], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.986000000000001, 5, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.33015656684713024, 0.5186779010279755, 0.19635288008779522], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.608, 4, 18, 6.0, 8.0, 9.0, 12.990000000000009, 0.330155040807163, 0.5109374948413274, 0.1886139637423734], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1581.67, 1340, 1944, 1555.5, 1791.7, 1858.0, 1927.97, 0.3298359725708405, 0.5036795006530752, 0.18166746926753327], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.566, 8, 68, 10.0, 14.0, 19.0, 32.99000000000001, 0.32823669279211914, 0.17075680529032208, 2.646408335636461], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.055999999999989, 7, 35, 11.0, 13.900000000000034, 15.0, 18.99000000000001, 0.3301613630645842, 0.5976791214125492, 0.2753494180245653], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.727999999999996, 5, 22, 7.0, 10.0, 10.0, 15.990000000000009, 0.33015874692869823, 0.5589839073610874, 0.23665675805240677], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.861328125, 2273.046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 1.0494732748868778, 4326.79493071267], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.292000000000001, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.32846504343621735, 0.27608705814061196, 0.13889195684363487], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.1220000000005, 436, 722, 548.0, 651.8000000000001, 663.95, 701.96, 0.3283632275215669, 0.28914883387546103, 0.1519962596144753], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.243999999999997, 2, 18, 3.0, 4.0, 5.0, 9.0, 0.32846698545482494, 0.297580182691695, 0.16038427024161375], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.71, 606, 940, 757.0, 892.9000000000001, 903.0, 927.98, 0.3282948823423971, 0.3105688822987339, 0.173444854831286], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.764382102272728, 1496.515447443182], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.823999999999984, 16, 1370, 22.0, 27.0, 31.94999999999999, 65.99000000000001, 0.3279439032276895, 0.17060448895353755, 14.959238007583375], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.802000000000017, 21, 299, 29.0, 35.0, 41.0, 101.99000000000001, 0.3283623649445593, 74.26591809932535, 0.10133057355711009], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 1.022249634502924, 0.7995248538011696], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6839999999999997, 1, 13, 2.0, 4.0, 4.0, 7.0, 0.33014915478514884, 0.35875025978611613, 0.14153855366277376], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.274, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3301478468087579, 0.33875941808635746, 0.12154857250673998], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8119999999999998, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.3302017004066764, 0.18725725531558696, 0.1280176514271978], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.69199999999995, 65, 121, 92.0, 110.90000000000003, 114.0, 117.99000000000001, 0.3301805493279835, 0.3007448243786167, 0.10769560886283837], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.32200000000005, 58, 378, 81.0, 93.0, 99.94999999999999, 311.60000000000036, 0.32831018746511703, 0.17079503902787352, 97.07914224859647], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.77400000000006, 12, 418, 261.0, 331.0, 335.0, 339.99, 0.33014348696230356, 0.18400018500415652, 0.13831206631526194], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 420.3239999999997, 290, 549, 409.0, 494.0, 504.95, 518.98, 0.3300826791094633, 0.17751936739489507, 0.1405430157145762], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.058000000000002, 4, 260, 6.0, 8.0, 10.0, 24.99000000000001, 0.3278912135647284, 0.14784243380368237, 0.23791325359237614], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.5500000000002, 290, 506, 394.0, 456.0, 465.0, 481.96000000000004, 0.33006590095778526, 0.16977442450534674, 0.1327999523384839], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.442000000000001, 2, 24, 3.0, 4.0, 5.949999999999989, 8.0, 0.32846008060410375, 0.2016661496841856, 0.16423004030205188], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.12, 2, 30, 4.0, 5.0, 6.0, 9.0, 0.32845425486210833, 0.1923606456868701, 0.15492520029140464], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.2359999999998, 524, 886, 672.0, 787.0, 834.8499999999999, 859.94, 0.3283015646852573, 0.2999951729410567, 0.1445937555400889], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.05000000000007, 171, 326, 239.5, 285.0, 292.0, 305.99, 0.3283802643461128, 0.29076725535670306, 0.13500790165011084], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.537999999999999, 3, 50, 4.0, 5.0, 7.0, 9.0, 0.32844023077524376, 0.2189740526880534, 0.15363561576302906], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 997.3680000000008, 816, 8995, 939.0, 1098.0, 1115.95, 1151.91, 0.328237123749991, 0.2467259731656304, 0.18142794144774893], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.90599999999995, 117, 172, 136.0, 150.0, 152.0, 157.99, 0.33017095591755496, 6.38374902991646, 0.16637520825533045], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.7740000000002, 158, 248, 178.0, 203.0, 206.0, 213.99, 0.33014174305596367, 0.6398785340435563, 0.2359997616376615], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.878000000000002, 5, 18, 7.0, 9.0, 10.0, 12.990000000000009, 0.330178805030076, 0.2694665323746922, 0.20378223122950004], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.851999999999994, 5, 16, 7.0, 9.0, 10.0, 13.990000000000009, 0.3301809854053401, 0.2746273897261545, 0.2089426548268168], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.234000000000002, 6, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.33017509845821436, 0.2672064510188543, 0.20152288724256248], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.655999999999999, 7, 20, 9.0, 12.0, 13.0, 18.0, 0.33017662468360826, 0.2952598017470966, 0.22957593435032136], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.732000000000002, 5, 30, 7.0, 9.0, 10.0, 27.99000000000001, 0.33018512819767787, 0.24786778310237986, 0.18218222405438284], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1632.3520000000003, 1423, 1979, 1598.0, 1867.9, 1924.95, 1956.0, 0.3298440233582344, 0.27563557541784645, 0.2100178742476258], "isController": false}]}, function(index, item){
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
