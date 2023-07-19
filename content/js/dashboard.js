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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8905977451606041, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.182, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.654, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.947, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.081, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.5752818549243, 1, 18459, 9.0, 843.0, 1520.9500000000007, 6082.930000000011, 15.139687042282914, 95.3688018182439, 125.28220225886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6256.110000000009, 4958, 18459, 6079.5, 6643.500000000001, 6832.15, 16434.32000000008, 0.326606758277685, 0.18968389181183792, 0.1645791867883647], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3480000000000008, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.3276267309339262, 0.16819985226491635, 0.11838075238823506], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.642, 2, 24, 3.0, 5.0, 5.0, 8.0, 0.32762436948690093, 0.18803527167104156, 0.13821653087728633], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.332000000000003, 8, 346, 11.0, 15.0, 19.94999999999999, 37.99000000000001, 0.3254795126920736, 0.16932245234979934, 3.5812281928726497], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.94600000000003, 24, 54, 34.0, 40.0, 42.0, 46.99000000000001, 0.3275327287079161, 1.3621747139411031, 0.13625873284137918], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.305999999999999, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.32754131114786855, 0.20462055874453414, 0.13850135520217485], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.127999999999982, 22, 67, 30.0, 35.0, 36.94999999999999, 40.99000000000001, 0.32753487427573846, 1.344271573698622, 0.11898727854548312], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.1539999999992, 671, 1139, 850.5, 1023.0, 1066.95, 1098.94, 0.32739761458098016, 1.384632933048825, 0.15922266802864074], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.757999999999997, 4, 14, 5.0, 8.0, 9.0, 11.0, 0.32747866967685063, 0.4869678174840207, 0.1672571721103446], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.899999999999998, 2, 25, 4.0, 5.0, 6.0, 9.990000000000009, 0.3256620383577775, 0.3141207538148051, 0.17809642722690958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.827999999999996, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.32754367139770746, 0.5337650389629575, 0.21399093375494757], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.9508070054945055, 2599.5385473901097], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.013999999999998, 2, 20, 4.0, 5.0, 6.0, 9.990000000000009, 0.3256664927607595, 0.32716443141398527, 0.1911382442863442], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.094000000000007, 5, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.3275425985526548, 0.514571341521134, 0.19479828370953783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.6579999999999995, 4, 27, 6.0, 8.0, 9.0, 12.990000000000009, 0.3275421694166015, 0.5068938977501783, 0.18712125889522646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1569.7000000000005, 1339, 1967, 1546.5, 1774.0, 1830.9, 1911.97, 0.3271942958255243, 0.49964550031770566, 0.18021248324765204], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.80600000000001, 7, 64, 10.0, 14.0, 18.0, 40.950000000000045, 0.325471461685825, 0.1693182640182186, 2.624113659841964], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.020000000000007, 8, 25, 11.0, 13.0, 15.0, 19.0, 0.32754538796441024, 0.5929435167221747, 0.2731677356656312], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.810000000000004, 5, 27, 8.0, 10.0, 11.0, 14.990000000000009, 0.32754474424978824, 0.5545582017122074, 0.23478304910092243], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.070763221153847, 2622.7463942307695], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.8886344588122606, 3663.6845965038315], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.285999999999999, 1, 19, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.3256516452246768, 0.2737222925403629, 0.13770230701395025], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.4519999999995, 444, 710, 545.0, 648.0, 663.95, 689.0, 0.3255572889672541, 0.2866779912447878, 0.15069741696335787], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.271999999999998, 2, 15, 3.0, 4.0, 5.0, 9.980000000000018, 0.3256609778035991, 0.29503803292790715, 0.15901414931816363], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 761.9860000000003, 601, 946, 752.0, 879.0, 898.0, 915.99, 0.32552464807530296, 0.3079482244502214, 0.17198128379759658], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.200000000000017, 15, 622, 21.0, 26.0, 31.0, 82.7800000000002, 0.3253416412574845, 0.16925072823659626, 14.840535217907325], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.379999999999995, 20, 233, 29.0, 34.0, 40.94999999999999, 125.85000000000014, 0.3255988413890828, 73.64089027656854, 0.10047776745991227], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 1.0948101513569939, 0.8562760960334029], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6720000000000015, 1, 17, 2.0, 4.0, 4.0, 7.0, 0.327577791536045, 0.3559561371289772, 0.14043618211359743], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3800000000000026, 2, 18, 3.0, 4.0, 5.0, 8.0, 0.32757628924200155, 0.3361207840522104, 0.12060181742601034], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7980000000000016, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.3276278043301911, 0.18579759985604033, 0.1270197639834823], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.58400000000003, 65, 119, 91.0, 110.0, 113.0, 115.99000000000001, 0.32760698169790836, 0.29840069130806257, 0.10685618348349744], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.81999999999998, 58, 384, 79.0, 92.0, 103.94999999999999, 311.7600000000002, 0.32553757647691517, 0.16935265855958737, 96.25929959125502], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.57200000000012, 12, 357, 260.0, 332.0, 336.0, 343.0, 0.3275722116561986, 0.18256712589287993, 0.13723484257862223], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.7519999999998, 319, 536, 416.0, 503.0, 513.0, 527.0, 0.3275305831682033, 0.1761468432192981, 0.13945638111458658], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.323999999999998, 4, 273, 6.0, 8.0, 11.0, 26.99000000000001, 0.32528703327816466, 0.1466682384129506, 0.2360236969977308], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 397.31399999999974, 279, 503, 396.0, 464.0, 474.0, 489.98, 0.3275194268148015, 0.16846460673596106, 0.1317753943825178], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4559999999999986, 2, 22, 3.0, 4.0, 5.0, 8.0, 0.3256471912278462, 0.19993910702818282, 0.16282359561392312], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.192, 2, 38, 4.0, 5.0, 6.0, 10.990000000000009, 0.32563955608815714, 0.1907122052554968, 0.1535975640533007], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.2340000000002, 532, 900, 680.5, 799.7, 839.0, 857.98, 0.3254833264656351, 0.2974199252023042, 0.14335251976172017], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.43600000000018, 176, 372, 236.0, 287.0, 295.0, 308.99, 0.32559057245985634, 0.2882970976123792, 0.13386096777890577], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.499999999999998, 3, 55, 4.0, 5.0, 6.0, 9.990000000000009, 0.32567009879528114, 0.2171271808091078, 0.15233982160443327], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 998.1539999999991, 829, 9082, 949.0, 1095.7, 1114.9, 1152.7800000000002, 0.3255038800062497, 0.24467147605430709, 0.1799171836753294], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.1319999999999, 114, 171, 138.0, 150.0, 151.95, 163.96000000000004, 0.327632527357316, 6.334669331752507, 0.16509607823864755], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.862, 157, 257, 181.0, 203.0, 206.0, 213.96000000000004, 0.3276011861783749, 0.6349544435742993, 0.23418366043219768], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.211999999999995, 5, 16, 7.0, 9.0, 10.0, 14.0, 0.32747502347995916, 0.2672599139379264, 0.2021134910540373], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.128000000000004, 5, 24, 7.0, 9.0, 10.0, 14.990000000000009, 0.32747695380937564, 0.2723783167275228, 0.20723150983249553], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.520000000000008, 6, 24, 8.0, 10.0, 12.0, 15.0, 0.32747438004187746, 0.26502079441846116, 0.1998744995372787], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.850000000000001, 7, 19, 10.0, 12.0, 13.0, 17.980000000000018, 0.32747438004187746, 0.2928433247540504, 0.22769702987286788], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.948000000000008, 5, 27, 8.0, 9.0, 11.0, 15.980000000000018, 0.32743813711275527, 0.24580563513666612, 0.1806665502624089], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1635.218, 1412, 1984, 1618.0, 1825.0, 1886.6499999999999, 1965.93, 0.3271360676674413, 0.2733726606090881, 0.20829366808512867], "isController": false}]}, function(index, item){
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
