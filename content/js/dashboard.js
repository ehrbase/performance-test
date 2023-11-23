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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8621357158051478, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.46, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.975, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.586, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.725, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.28, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 495.34635184003383, 1, 28106, 14.0, 1200.800000000003, 2342.0, 9748.930000000011, 10.004507455177636, 63.02103858494957, 82.78815295186175], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9957.892000000009, 8416, 28106, 9718.0, 10497.5, 10790.1, 27130.51000000014, 0.21592414671095703, 0.1254025871977278, 0.10880552705356818], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.4800000000000026, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.21669204852861765, 0.11124724299998007, 0.07829693159725443], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.072000000000003, 3, 19, 5.0, 6.0, 7.0, 11.0, 0.21669054596483198, 0.12436640700096817, 0.0914163240789135], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.548000000000012, 13, 596, 18.0, 24.0, 28.0, 51.960000000000036, 0.2150493237128868, 0.11187395042489447, 2.36617258815732], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.109999999999985, 32, 79, 55.0, 67.0, 69.0, 72.99000000000001, 0.21664134851440361, 0.9009889427068123, 0.09012618600306244], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4339999999999957, 2, 13, 3.0, 4.0, 5.0, 10.0, 0.21664820101833318, 0.13534377018890423, 0.09161003031341629], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.67199999999996, 28, 69, 48.0, 59.900000000000034, 62.0, 65.0, 0.2166394711917164, 0.8891336640352915, 0.07870105789386572], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1193.6440000000005, 850, 1773, 1147.0, 1453.7, 1673.8499999999995, 1747.98, 0.21656374835465692, 0.9158933502314416, 0.10532104168029213], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.749999999999995, 5, 32, 8.0, 11.0, 12.0, 21.960000000000036, 0.2166176966260494, 0.3221151687787614, 0.11063579622599984], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.4079999999999995, 3, 16, 5.0, 7.0, 7.0, 13.0, 0.21519667254297048, 0.2075702201537279, 0.11768568029693698], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.22999999999999, 8, 27, 12.0, 15.0, 16.94999999999999, 22.99000000000001, 0.21663768776529993, 0.35303269135823595, 0.14153380187010317], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.7550038176265271, 2064.206001854276], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.003999999999995, 4, 19, 6.0, 7.0, 8.0, 13.990000000000009, 0.21519759873911423, 0.21618742363175217, 0.12630249691621842], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.366000000000003, 8, 25, 13.0, 15.0, 17.0, 23.0, 0.21663646754309115, 0.3403371598644982, 0.12883946165404542], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.452000000000007, 6, 26, 9.0, 11.0, 12.949999999999989, 18.0, 0.21663543505811247, 0.3352581448153724, 0.1237614545986287], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2341.4119999999975, 1888, 2977, 2298.5, 2678.7000000000003, 2789.9, 2933.99, 0.21642632523249597, 0.33050836109000953, 0.11920356194446068], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.48200000000002, 12, 93, 17.0, 22.0, 26.94999999999999, 77.99000000000001, 0.215041832087596, 0.11187005309705397, 1.7337747712062428], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.38400000000003, 12, 56, 17.0, 21.0, 23.0, 31.960000000000036, 0.2166403159828993, 0.3921760938873635, 0.18067463852480076], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.280000000000006, 8, 29, 12.0, 15.0, 17.0, 24.0, 0.21663918959611955, 0.36678664979950043, 0.155286294105031], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.970628955696203, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.8239204040852577, 3396.879856793961], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.522, 2, 24, 3.0, 4.0, 5.0, 9.990000000000009, 0.2151929678381198, 0.18087767514448055, 0.0909946826893612], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 774.9539999999994, 574, 972, 745.5, 939.0, 946.0, 961.95, 0.21513408016412147, 0.18944194475077147, 0.0995835488259703], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.579999999999997, 3, 16, 4.0, 6.0, 6.0, 12.990000000000009, 0.2151985249432306, 0.19496271833504344, 0.10507740475743682], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1059.2099999999984, 810, 1371, 1021.5, 1295.9, 1321.95, 1350.98, 0.2151165867365136, 0.2035137358394129, 0.11365046232856822], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.148182744565218, 715.7247792119565], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 36.979999999999954, 23, 1254, 34.0, 40.0, 46.0, 110.8900000000001, 0.21492721060158554, 0.1118104241792682, 9.803955085156309], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.001999999999974, 31, 455, 44.0, 54.0, 59.94999999999999, 136.94000000000005, 0.2151336173383927, 48.65690259102088, 0.06638888972551962], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.8527057926829268, 0.6669207317073171], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.063999999999997, 2, 15, 4.0, 5.0, 5.0, 9.0, 0.21667308018984027, 0.23544365533011447, 0.09289011933919912], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.8480000000000025, 3, 12, 5.0, 6.0, 7.0, 10.990000000000009, 0.21667251682462094, 0.22232419936796627, 0.07977103402625203], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.766, 1, 14, 2.0, 4.0, 4.0, 9.0, 0.2166926119954096, 0.1228862956170452, 0.08401070992400156], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.49200000000002, 81, 174, 130.0, 160.0, 166.95, 171.0, 0.21668359687836944, 0.19736616957463274, 0.0706760950755619], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 122.2440000000001, 83, 575, 120.0, 137.0, 146.0, 439.4200000000005, 0.2150961350666067, 0.1118983028430977, 63.602498766423665], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.42600000000016, 16, 521, 280.0, 489.80000000000007, 500.95, 519.95, 0.21666998171738694, 0.12075754420500966, 0.09077287319995996], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 575.4159999999998, 401, 781, 551.5, 689.9000000000001, 703.8499999999999, 731.9300000000001, 0.21664144238139207, 0.11652263079835405, 0.09224186413895209], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.575999999999999, 6, 413, 9.0, 12.0, 16.0, 34.97000000000003, 0.21489118555037284, 0.0968920012504518, 0.15592202232805374], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 532.2180000000011, 370, 690, 521.5, 637.9000000000001, 652.95, 668.97, 0.21663186836754458, 0.1114279017459662, 0.08716047828850425], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.012000000000001, 3, 20, 5.0, 6.0, 7.0, 12.0, 0.2151913933771836, 0.13212205168961827, 0.1075956966885918], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.632000000000003, 3, 50, 5.0, 7.0, 7.0, 13.980000000000018, 0.21518731840880168, 0.1260253776591235, 0.10149948710102658], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 930.4840000000003, 677, 1438, 874.0, 1153.9, 1367.8, 1415.99, 0.21510705447887304, 0.19656037299455692, 0.09473953278317553], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 328.6520000000003, 230, 450, 327.5, 396.0, 400.0, 408.98, 0.21514963226624853, 0.19051836108476725, 0.08845507342196351], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.819999999999996, 4, 97, 7.0, 8.0, 9.0, 16.0, 0.21519880280602022, 0.14347497525751765, 0.10066428373445672], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1599.5420000000001, 1233, 16084, 1458.5, 1762.9, 1802.95, 6605.830000000044, 0.2150883626011238, 0.1616754527126084, 0.11888673167210552], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.928, 128, 235, 172.0, 205.0, 207.0, 214.0, 0.21669646243025084, 4.189756267268, 0.10919470177149358], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 233.10600000000005, 176, 343, 229.0, 280.0, 283.0, 292.99, 0.2166819066274328, 0.41997143252200403, 0.1548937066907039], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.931999999999986, 7, 48, 11.0, 13.0, 15.0, 20.99000000000001, 0.21661413051954467, 0.17678378419578972, 0.13369153368003148], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.048, 7, 42, 11.0, 14.0, 16.0, 21.0, 0.21661525664575607, 0.1801693166384345, 0.13707684209614251], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.281999999999998, 8, 31, 12.0, 15.0, 17.0, 23.980000000000018, 0.21661131525524177, 0.17530074518083144, 0.13220905472121688], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.884000000000002, 10, 46, 14.5, 18.0, 20.0, 27.980000000000018, 0.21661234751032266, 0.19370516869011478, 0.15061327287827123], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.465999999999996, 7, 46, 11.0, 14.0, 15.0, 42.7800000000002, 0.21658607498816357, 0.16258972822671017, 0.1195030589534301], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2642.6819999999984, 2242, 3300, 2593.0, 3021.4, 3158.75, 3271.96, 0.21637322130393427, 0.18082546762580587, 0.1377688870021144], "isController": false}]}, function(index, item){
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
