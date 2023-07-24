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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8912146351840035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.193, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.615, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.966, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.12, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.6391406083819, 1, 19401, 9.0, 840.9000000000015, 1505.0, 6011.980000000003, 15.257706261404332, 96.1122353837925, 126.25882136856205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6169.614, 5004, 19401, 6000.0, 6559.8, 6742.95, 16939.51000000009, 0.32913770529141523, 0.1911537936658765, 0.1658545468070022], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.335999999999999, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3301777148532426, 0.16950949851122868, 0.1193024946247068], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.656000000000001, 2, 16, 4.0, 5.0, 5.0, 7.990000000000009, 0.3301748804271671, 0.18949910056235386, 0.1392925276802111], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.388000000000009, 8, 348, 12.0, 15.0, 18.0, 57.950000000000045, 0.32800241934584506, 0.1706349304782472, 3.6089875573922234], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.76800000000003, 24, 67, 35.0, 41.0, 42.0, 50.98000000000002, 0.3301221253790627, 1.3729437466533871, 0.13733596231589915], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3179999999999996, 1, 9, 2.0, 3.0, 4.0, 5.990000000000009, 0.3301358575080818, 0.20624141543603022, 0.1395984631845697], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.464000000000006, 22, 70, 30.0, 36.0, 37.0, 41.0, 0.3301262666944853, 1.3549071897456841, 0.119928682822606], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.9159999999999, 649, 1076, 857.5, 977.9000000000001, 1034.95, 1070.99, 0.32997920471051917, 1.3955510172186447, 0.16047816791585792], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.634, 4, 21, 5.0, 8.0, 9.0, 12.0, 0.3300713482226318, 0.49082318618367543, 0.1685813624223012], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8359999999999994, 2, 24, 4.0, 5.0, 5.0, 9.990000000000009, 0.32822505735732876, 0.31659294082266326, 0.17949807824228917], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6940000000000035, 5, 34, 7.0, 9.0, 10.0, 14.990000000000009, 0.3301330238006102, 0.537984646627262, 0.21568261027598462], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.992241255733945, 2712.8211905103212], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9439999999999933, 2, 19, 4.0, 5.0, 5.949999999999989, 9.990000000000009, 0.32822958215061276, 0.329739310013825, 0.1926425574926936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.964000000000002, 5, 20, 8.0, 10.0, 10.0, 14.990000000000009, 0.3301304081138131, 0.5186368055046604, 0.19633732279425017], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.585999999999994, 3, 19, 6.0, 8.0, 9.0, 13.990000000000009, 0.3301297541985902, 0.5108983620859843, 0.18859951777946804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.2199999999991, 1307, 1988, 1548.5, 1752.0, 1812.6, 1918.97, 0.32978919874416274, 0.5036080741877292, 0.1816417071208084], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.476000000000004, 8, 65, 10.0, 14.0, 17.0, 36.0, 0.32799101567009875, 0.17062899800548664, 2.6444275638401713], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.106, 8, 35, 11.0, 13.0, 14.0, 19.99000000000001, 0.33013542154991976, 0.5976321604309588, 0.2753277832066714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.733999999999998, 5, 18, 7.0, 10.0, 10.0, 14.990000000000009, 0.3301352035712706, 0.5589440466636206, 0.2366398822473756], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.626116071428571, 2783.3227040816328], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 1.0471042607223475, 4317.027899266365], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3299999999999987, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.32821557724258216, 0.2758773725473271, 0.13878646967386532], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 563.584, 438, 704, 559.0, 651.0, 659.95, 693.8700000000001, 0.3281197295768437, 0.2889344153874372, 0.15188354669865614], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2760000000000016, 1, 10, 3.0, 4.0, 5.0, 8.0, 0.32822548828464765, 0.29736139427397507, 0.1602663517014881], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.9739999999999, 615, 942, 740.0, 879.9000000000001, 899.0, 931.94, 0.32809195498840854, 0.3103769118328332, 0.17333764418821193], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.10000000000002, 15, 634, 21.0, 26.0, 33.0, 64.92000000000007, 0.327857028107183, 0.17055929437790768, 14.955275178600115], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.215999999999966, 20, 264, 28.0, 34.900000000000034, 40.94999999999999, 104.99000000000001, 0.32811628441119534, 74.21026191369722, 0.10125463464251731], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 1.3077657418952617, 1.022833541147132], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6800000000000006, 1, 14, 3.0, 4.0, 4.0, 6.0, 0.330133241776381, 0.3587329682197235, 0.14153173158186644], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3880000000000003, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3301317159520305, 0.33874286647261526, 0.12154263370499561], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.768, 1, 10, 2.0, 3.0, 3.0, 5.990000000000009, 0.330178805030076, 0.18724427135646038, 0.12800877499701188], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.75799999999994, 65, 128, 92.0, 111.0, 114.0, 117.0, 0.3301613630645842, 0.300727348578094, 0.10768935084333117], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.84400000000008, 58, 383, 80.0, 93.0, 101.94999999999999, 307.71000000000026, 0.32806117159830095, 0.17066549484583093, 97.00550991039994], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.13799999999986, 12, 369, 263.0, 336.0, 340.0, 347.98, 0.3301275744998898, 0.1839913164480782, 0.13830539986372334], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 419.39400000000006, 334, 547, 408.0, 493.0, 508.95, 533.0, 0.3300968438120376, 0.1775269852106711, 0.14054904677934413], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.226, 4, 319, 6.0, 8.0, 10.0, 26.0, 0.32779448072765127, 0.147798818063246, 0.23784306560609855], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 395.54800000000034, 291, 509, 397.0, 460.0, 473.0, 495.99, 0.33006938718657436, 0.16977621770023493, 0.13280135500084828], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.476, 2, 17, 3.0, 5.0, 5.0, 9.980000000000018, 0.328212345510449, 0.20151404662683045, 0.1641061727552245], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.214000000000006, 2, 30, 4.0, 5.0, 6.0, 13.970000000000027, 0.32820674399217553, 0.1922156898823707, 0.15480845444162186], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.4480000000003, 509, 862, 682.0, 809.8000000000001, 834.0, 849.0, 0.3280454592275579, 0.2997611490759943, 0.14448095909338732], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.12800000000001, 178, 305, 237.0, 285.0, 293.0, 299.99, 0.3281294194931188, 0.2905451425279353, 0.13490477110019825], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.434, 3, 48, 4.0, 5.0, 6.0, 9.0, 0.3282325987487773, 0.21883562255056424, 0.1535384910162738], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 983.774, 809, 9022, 934.0, 1073.9, 1094.0, 1136.98, 0.32806612238309857, 0.24659743658153788, 0.18133342311409548], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.732, 117, 163, 138.0, 150.0, 151.0, 156.98000000000002, 0.3301942863180695, 6.384200115691823, 0.16638696458996474], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.40400000000002, 158, 279, 181.0, 203.0, 205.0, 218.98000000000002, 0.3301670315012365, 0.639927547940253, 0.236017838924712], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.989999999999998, 5, 38, 7.0, 9.0, 10.0, 12.990000000000009, 0.3300619790384238, 0.26937118799043086, 0.20371012768777721], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.962000000000003, 5, 39, 7.0, 9.0, 10.0, 13.0, 0.330064157871007, 0.2745302186526517, 0.2088687249027466], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.370000000000005, 5, 46, 8.0, 10.0, 11.0, 14.0, 0.3300571857079958, 0.26711102575007145, 0.20145091901122789], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.701999999999996, 7, 29, 9.0, 11.0, 13.0, 20.970000000000027, 0.3300587108434848, 0.29515435752586666, 0.22949394738336054], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.801999999999999, 4, 37, 7.0, 9.0, 11.0, 15.990000000000009, 0.330016665841625, 0.24774131953038628, 0.18208927363331848], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1607.206, 1383, 1978, 1580.5, 1799.9, 1861.8, 1914.98, 0.32971047463801084, 0.2755239748559495, 0.209932841273421], "isController": false}]}, function(index, item){
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
