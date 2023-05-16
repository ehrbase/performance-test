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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8893001489044884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.194, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.554, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.928, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.129, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.1209955328648, 1, 17761, 9.0, 847.0, 1497.0, 6082.990000000002, 15.141305972264451, 95.3789998766407, 125.29559904261275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6212.289999999999, 5124, 17761, 6059.5, 6543.8, 6723.95, 14784.88000000007, 0.32649607029329797, 0.189619607386843, 0.16452341042123217], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4640000000000013, 1, 19, 2.0, 3.0, 4.0, 6.0, 0.32759539086388867, 0.16818376262798335, 0.11836942833949105], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7600000000000033, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.32759324450314914, 0.1880174079364705, 0.13820340002476605], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.131999999999989, 8, 345, 11.0, 16.0, 24.0, 40.0, 0.3256289523214088, 0.1694001945225954, 3.582872466606751], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.635999999999974, 24, 57, 34.0, 40.0, 42.0, 45.0, 0.32754281312110306, 1.3622166539716531, 0.1362629281148339], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.298, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.32755161066953514, 0.20462699302871906, 0.1385057103710046], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.756000000000004, 21, 56, 30.0, 36.0, 37.0, 41.98000000000002, 0.32754131114786855, 1.3442979919670492, 0.11898961694043661], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.1420000000005, 643, 1110, 865.0, 1007.7, 1062.0, 1085.0, 0.32739847209681044, 1.3846365596624783, 0.15922308506270663], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.947999999999994, 4, 26, 6.0, 8.0, 9.0, 13.980000000000018, 0.3275170669143569, 0.4870249150011332, 0.16727678319942252], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8900000000000015, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.3258182273142543, 0.3142714075200802, 0.17818184306248283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.249999999999998, 6, 17, 8.0, 10.0, 11.0, 15.0, 0.3275438859675614, 0.5337653886259076, 0.21399107393779157], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.9031674060542798, 2469.290269441545], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.190000000000004, 3, 17, 4.0, 5.0, 6.0, 11.990000000000009, 0.3258203504784346, 0.327318996817061, 0.19122854554447188], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.563999999999988, 6, 26, 8.0, 10.0, 12.0, 17.0, 0.3275423839844876, 0.5145710044332862, 0.19479815610014936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.876000000000001, 5, 21, 7.0, 8.0, 9.0, 13.0, 0.3275410965813881, 0.5068922374643471, 0.18712064599620312], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1575.9780000000007, 1359, 1959, 1552.5, 1770.9, 1823.95, 1939.8300000000002, 0.32721699329466936, 0.499680160727351, 0.18022498458807962], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.408000000000008, 7, 56, 10.0, 15.0, 21.94999999999999, 38.99000000000001, 0.3256208939205277, 0.1693960023441448, 2.625318457234254], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.561999999999998, 8, 29, 11.0, 14.0, 15.0, 22.0, 0.3275473191234572, 0.592947012629242, 0.273169346222102], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.268, 6, 26, 8.0, 10.0, 11.0, 16.99000000000001, 0.3275458171088972, 0.5545600181444006, 0.23478381812297905], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.359996448863637, 1549.8046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.9167335721343873, 3779.5323307806325], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.44, 1, 15, 2.0, 3.0, 4.0, 8.0, 0.32583733678807797, 0.27387837319029945, 0.1377808269816775], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 577.1239999999998, 448, 717, 574.0, 665.8000000000001, 677.0, 687.99, 0.32571889417132555, 0.2868202969367441, 0.15077222249727373], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3259999999999987, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.32582353527658836, 0.29518530460101927, 0.15909352308427163], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 776.7379999999994, 647, 960, 755.0, 902.9000000000001, 918.95, 941.0, 0.32567370490966135, 0.30808923308890435, 0.17206003355090507], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.847318672839506, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.765999999999988, 15, 542, 20.0, 25.900000000000034, 36.849999999999966, 68.96000000000004, 0.3255076943508791, 0.16933711314224298, 14.848109768681214], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.898000000000003, 20, 323, 28.0, 34.0, 39.0, 97.88000000000011, 0.3257539085582718, 73.67596191362668, 0.10052562021915419], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.9483075271247738, 0.7416930379746834], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.8160000000000025, 1, 21, 3.0, 4.0, 4.0, 6.990000000000009, 0.3275395946238961, 0.35591463118550337, 0.14041980667958048], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4700000000000024, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.32753830724272354, 0.33608181133105675, 0.12058783381885428], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.84, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.3275960347775951, 0.18577958335517308, 0.1270074470768606], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.20800000000003, 66, 121, 92.0, 111.0, 114.0, 117.0, 0.3275739285220585, 0.29837058483575113, 0.10684540246715579], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.20199999999994, 58, 388, 79.0, 95.0, 105.94999999999999, 328.9000000000001, 0.32568855445740613, 0.1694312010205125, 96.30394277749804], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.54800000000006, 13, 364, 262.0, 335.0, 337.95, 349.0, 0.3275350888340668, 0.18254643608251, 0.13721929014630335], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 436.91599999999954, 357, 566, 424.0, 511.0, 524.0, 545.97, 0.32747051946648503, 0.1761145407962773, 0.13943080711658934], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.132000000000007, 4, 282, 6.0, 8.0, 10.949999999999989, 27.910000000000082, 0.3254511240756374, 0.14674222509469, 0.23614275897285023], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 411.3140000000001, 310, 520, 407.0, 475.0, 482.95, 499.98, 0.3274737366063242, 0.16844110528116896, 0.13175701121270075], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.673999999999994, 2, 17, 3.0, 5.0, 6.0, 11.990000000000009, 0.3258345763922423, 0.20005415676129554, 0.16291728819612114], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.302000000000003, 2, 24, 4.0, 5.0, 6.0, 10.990000000000009, 0.3258303297207439, 0.19082393265315167, 0.15368754810070243], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.0740000000001, 540, 882, 690.0, 786.8000000000001, 827.95, 852.97, 0.3256798567008631, 0.2975995104624654, 0.1434390775118059], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 248.7640000000002, 177, 315, 243.0, 291.0, 295.95, 311.98, 0.32576112457952383, 0.288448114519043, 0.13393108735154252], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.839999999999995, 3, 35, 4.0, 6.0, 7.0, 12.0, 0.3258222613498556, 0.21722862895132802, 0.15241099920564533], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 986.7859999999998, 812, 8634, 937.5, 1097.0, 1117.95, 1149.94, 0.3256516452246768, 0.24478254672449806, 0.1799988585909835], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.44999999999996, 117, 168, 132.0, 151.0, 153.0, 157.99, 0.32757006559918134, 6.333461653788249, 0.16506460336833748], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 184.56, 162, 272, 178.0, 206.0, 209.0, 213.99, 0.3275363761899397, 0.6348288292850929, 0.23413733141702717], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.568000000000004, 5, 33, 7.0, 9.0, 10.0, 15.0, 0.32751449251629383, 0.2672921255281171, 0.2021378508499001], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.499999999999996, 5, 24, 7.0, 9.900000000000034, 11.0, 16.0, 0.32751599424357886, 0.27241078853242046, 0.20725621510726475], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.817999999999993, 6, 19, 9.0, 10.0, 12.0, 16.0, 0.3275121326869554, 0.2650513471474676, 0.19989754192319054], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.261999999999992, 7, 36, 10.0, 12.0, 14.0, 17.99000000000001, 0.32751234721549005, 0.2928772768248988, 0.22772342892327038], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.278, 5, 40, 8.0, 10.0, 11.0, 15.0, 0.3274917537576404, 0.24584588479593333, 0.1806961336651043], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.5180000000003, 1401, 1987, 1587.0, 1843.9, 1900.75, 1977.99, 0.3271829482717215, 0.27341183658749496, 0.2083235178448852], "isController": false}]}, function(index, item){
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
