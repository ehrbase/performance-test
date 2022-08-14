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

    var data = {"OkPercent": 97.80897681344395, "KoPercent": 2.191023186556052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8807913209955328, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.413, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.819, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.339, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.992, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.926, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.545, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.513, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.969, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.893, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 274.78034460752986, 1, 8946, 28.0, 774.9000000000015, 1698.9500000000007, 3497.970000000005, 17.83761509454581, 118.52798538513653, 147.75193099724828], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 49.38400000000003, 20, 153, 39.0, 83.90000000000003, 92.0, 106.99000000000001, 0.38722678246296366, 0.2248683404737952, 0.1951259958504778], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 13.807999999999998, 5, 85, 10.0, 24.0, 31.94999999999999, 65.90000000000009, 0.38705532181714736, 4.137887490759054, 0.13985397370346142], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 14.616000000000001, 5, 111, 11.0, 26.0, 29.94999999999999, 40.0, 0.387023564316737, 4.155792513958005, 0.1632755661961234], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 62.59199999999989, 14, 631, 51.0, 124.0, 140.95, 179.96000000000004, 0.3830487153695233, 0.20668395948072385, 4.264409526574771], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 64.20199999999996, 27, 193, 55.0, 104.90000000000003, 118.0, 140.0, 0.38677058934555325, 1.6086045650726044, 0.16090260845820864], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.988, 1, 31, 4.0, 13.0, 16.0, 23.980000000000018, 0.3868005099577923, 0.2417284101009859, 0.1635592000114493], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 57.38199999999997, 26, 146, 50.0, 94.0, 104.94999999999999, 128.0, 0.38676281074458024, 1.587333496192707, 0.14050367734080457], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1082.7480000000012, 576, 2546, 892.0, 2066.5, 2319.5499999999997, 2451.9300000000003, 0.38654752756470423, 1.6347683821710366, 0.1879889343039284], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 22.720000000000013, 8, 112, 17.0, 41.0, 47.0, 66.97000000000003, 0.38609174003053215, 0.5741048438876658, 0.1971933398788753], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 9.029999999999994, 2, 44, 6.0, 21.0, 26.94999999999999, 32.99000000000001, 0.38405259984407464, 0.37050724467223034, 0.21002876553972832], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 37.700000000000024, 15, 104, 29.0, 71.0, 76.0, 91.98000000000002, 0.38673020386095963, 0.6301934845048809, 0.25265869763963084], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.45691414614561027, 1266.370491501606], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 9.211999999999998, 3, 53, 6.0, 20.0, 24.0, 30.0, 0.38405967980176375, 0.3859132178267445, 0.22541002691490233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 37.10199999999999, 15, 123, 29.0, 68.0, 76.0, 98.99000000000001, 0.3867101638258938, 0.6076115472718371, 0.22998680641598565], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 22.350000000000016, 8, 84, 16.0, 42.900000000000034, 47.0, 52.0, 0.3867059766182098, 0.5985196436001707, 0.220920894845364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2756.050000000002, 1484, 8946, 2373.5, 4167.200000000001, 4816.05, 5857.320000000002, 0.38565933476850023, 0.588881466687518, 0.21241393047796303], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 60.18000000000001, 12, 307, 41.5, 131.0, 141.95, 183.95000000000005, 0.3830126240960902, 0.20679839029369407, 3.0880392817747273], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 40.76800000000007, 17, 112, 33.5, 73.0, 82.0, 96.98000000000002, 0.386748151923956, 0.7001161295927311, 0.32254191576470553], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 37.04200000000001, 14, 100, 28.0, 70.0, 76.0, 87.96000000000004, 0.3867364854935144, 0.654708613395005, 0.277211504250234], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 4.658203125, 1363.828125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.597141867666232, 2493.407248207301], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 7.172, 1, 48, 3.0, 17.0, 20.0, 35.960000000000036, 0.3838270628785494, 0.32255566931763224, 0.16230187326798037], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 594.6480000000003, 313, 1459, 471.0, 1172.9, 1243.95, 1327.96, 0.38374811387802027, 0.33783250215090815, 0.17763340427556798], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 8.573999999999995, 1, 38, 6.0, 20.0, 24.0, 28.0, 0.3840006881292331, 0.34784837334428503, 0.18750033600060212], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1581.4519999999993, 919, 4199, 1328.0, 2737.5000000000014, 3128.2999999999997, 3620.4400000000005, 0.38373486070040824, 0.36295022172200253, 0.20273492152238365], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.496853298611112, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 89.9819999999999, 16, 1060, 68.5, 168.0, 188.95, 261.85000000000014, 0.3827062691113943, 0.20596773020738854, 17.505074445937], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 112.04399999999994, 11, 364, 78.0, 219.0, 243.95, 319.9200000000001, 0.3834100025535106, 85.12858951439782, 0.11831793047549742], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.827226698606272, 1.4291158536585367], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.950000000000006, 1, 41, 4.0, 17.900000000000034, 20.0, 30.970000000000027, 0.38706550928918515, 0.4205315560962431, 0.16593921736128153], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 8.738000000000007, 2, 48, 5.0, 20.0, 24.0, 38.0, 0.3870595165936285, 0.3971336476837197, 0.14250140405839645], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.566000000000005, 1, 31, 3.0, 12.0, 15.0, 19.0, 0.38706880535083915, 0.2195284921347619, 0.15006476144949527], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 181.40200000000019, 84, 659, 141.0, 335.0, 368.0, 554.6700000000003, 0.3870208681652115, 0.3526054910036999, 0.12623532223357484], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, 2.0, 293.8799999999999, 33, 911, 244.0, 509.80000000000007, 551.95, 663.97, 0.38317523523127694, 0.2053729454143887, 113.35026943924603], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.659999999999998, 1, 30, 4.0, 12.0, 15.0, 18.99000000000001, 0.387057119567363, 0.21582970241500418, 0.16215576591249878], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 8.620000000000005, 2, 46, 6.0, 18.0, 23.94999999999999, 28.99000000000001, 0.3870843874931486, 0.20819696672932272, 0.16481327436231716], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 49.282000000000004, 7, 391, 32.0, 115.90000000000003, 132.0, 175.95000000000005, 0.38260816332777275, 0.16161309036439603, 0.27761510288333513], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.439999999999994, 2, 68, 6.0, 20.0, 24.0, 29.980000000000018, 0.38706610856894696, 0.19911527331899123, 0.15573362961953724], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 8.93199999999999, 2, 71, 6.0, 19.0, 24.0, 31.0, 0.38382146467806205, 0.23572185350839686, 0.19191073233903103], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 10.177999999999997, 2, 41, 7.0, 21.0, 25.0, 32.0, 0.38381292037110104, 0.2248469042225562, 0.18103675833910332], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 757.4719999999999, 385, 2411, 619.0, 1504.1000000000004, 1627.8, 1770.6100000000004, 0.3835011662270465, 0.35037026078846306, 0.16890529879726363], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.29600000000001, 6, 361, 24.0, 55.0, 66.94999999999999, 89.98000000000002, 0.3835085200252809, 0.3395158981539434, 0.15767293645570632], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 21.119999999999973, 7, 137, 16.0, 40.0, 44.0, 56.97000000000003, 0.38407030022775374, 0.2560196118297493, 0.17965788457919338], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 796.8299999999992, 381, 5913, 763.0, 1004.9000000000001, 1083.6499999999999, 1424.2300000000007, 0.38399478995868985, 0.2885503349490554, 0.2122471202310727], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 236.9539999999999, 141, 740, 191.0, 483.0, 511.0, 616.5600000000004, 0.3871521244585677, 7.485571203276546, 0.19508837521545017], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 404.5619999999997, 220, 1131, 316.0, 709.7, 807.5999999999999, 950.8500000000001, 0.38702116773574813, 0.7502095417263002, 0.27665966287360116], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 37.16800000000004, 14, 139, 28.0, 68.0, 75.0, 85.0, 0.3860833924684396, 0.3150478185998763, 0.23828584378911508], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 36.39399999999999, 14, 96, 28.0, 69.0, 73.94999999999999, 83.0, 0.38608607557403274, 0.32106073481446246, 0.2443200946991926], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 37.04800000000004, 14, 107, 28.0, 70.0, 77.0, 91.0, 0.3860404678501638, 0.31248317104835466, 0.2356204027405785], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 40.75399999999999, 17, 116, 32.0, 73.90000000000003, 80.0, 97.95000000000005, 0.3860622270540055, 0.34532285973857413, 0.2684338922484882], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 38.65399999999998, 14, 131, 28.0, 74.90000000000003, 80.94999999999999, 115.97000000000003, 0.3857411553410492, 0.2895514751320392, 0.2128356960622], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3111.4579999999974, 1650, 6869, 2780.5, 4673.400000000001, 5186.85, 6721.8, 0.385268859873863, 0.3219079344676933, 0.24530790687281118], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
