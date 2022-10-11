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

    var data = {"OkPercent": 97.84301212507977, "KoPercent": 2.1569878749202296};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.899234205488194, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.976, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.494, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.587, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.995, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 507, 2.1569878749202296, 190.4087640927458, 1, 3767, 17.0, 561.0, 1201.9500000000007, 2283.980000000003, 25.899856093545804, 173.52590448746273, 214.58339904482918], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.741999999999997, 16, 63, 27.0, 30.0, 32.0, 42.0, 0.5607355055479172, 0.3256909523083238, 0.2836533123767784], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.4060000000000015, 4, 25, 7.0, 10.0, 12.0, 18.980000000000018, 0.5607329901647433, 6.010590012013704, 0.20370378158328567], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.922000000000001, 5, 32, 7.0, 10.0, 11.0, 21.960000000000036, 0.5607178983396021, 6.020924178394081, 0.23764801550721418], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.194000000000003, 14, 239, 20.0, 28.0, 33.94999999999999, 53.950000000000045, 0.5575248572457603, 0.300958887001977, 6.207908615543124], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.82200000000001, 26, 92, 44.0, 53.0, 55.0, 68.0, 0.5605368597828256, 2.331214775513396, 0.2342868906123529], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.666000000000004, 1, 12, 2.0, 4.0, 4.0, 8.0, 0.5605682817012575, 0.35022817231196296, 0.23813203373051464], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.019999999999975, 23, 93, 39.0, 47.0, 49.0, 64.98000000000002, 0.5605280622769098, 2.300524309191203, 0.20472411649566824], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 768.3160000000003, 568, 1204, 773.5, 905.9000000000001, 928.95, 989.8800000000001, 0.5602159296279158, 2.369301973752763, 0.27354293438863075], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.581999999999994, 7, 26, 12.0, 14.0, 16.0, 22.99000000000001, 0.5602824720110892, 0.8332155426980066, 0.2872541970759978], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.582000000000001, 2, 20, 3.0, 5.0, 6.0, 12.990000000000009, 0.5582656250174458, 0.5384809965683413, 0.30639187623027786], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.33800000000001, 11, 44, 19.0, 22.0, 23.0, 29.0, 0.5604909901073339, 0.913407645097105, 0.36727485777541125], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.6894310379644588, 1910.810972839257], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.695999999999997, 2, 23, 4.0, 6.0, 7.949999999999989, 14.990000000000009, 0.5582743516480817, 0.5608738165979431, 0.3287494473083919], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.426, 12, 47, 20.0, 23.0, 25.0, 34.99000000000001, 0.5604771678416136, 0.8805446605021652, 0.33442534135861907], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.30600000000001, 6, 35, 12.0, 14.900000000000034, 16.0, 22.0, 0.5604727699909428, 0.8673699251292449, 0.32128663670379237], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2032.13, 1491, 3767, 2011.0, 2291.8, 2359.95, 2804.590000000002, 0.5593642042708575, 0.8541830076761551, 0.3091798238450248], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.813999999999993, 12, 86, 17.0, 24.0, 28.94999999999999, 47.930000000000064, 0.5574832086057568, 0.30090482834813265, 4.495797203775722], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.91999999999999, 15, 52, 24.0, 28.0, 29.0, 41.960000000000036, 0.5605173799624005, 1.0147477465099386, 0.46855749731231916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.644, 11, 70, 19.0, 23.0, 24.94999999999999, 39.0, 0.5605010430924412, 0.948907466112107, 0.4028601247226921], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.381100171232877, 1868.2844606164385], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.7557884694719472, 3155.850350660066], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.561999999999999, 1, 33, 2.0, 3.0, 5.0, 10.0, 0.5582313444666993, 0.4691509234960689, 0.23713929183888102], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.9859999999998, 316, 945, 411.5, 485.0, 499.9, 632.94, 0.5580164079144583, 0.49131273952854315, 0.2593904396164865], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3199999999999985, 2, 24, 3.0, 4.0, 6.0, 12.980000000000018, 0.5582512890022263, 0.5057571321486869, 0.2736739717569508], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1158.2859999999996, 931, 2456, 1141.0, 1361.9, 1382.85, 1527.7500000000002, 0.5576747194896161, 0.5275635522624863, 0.29572009051060694], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.868443080357], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.90000000000001, 16, 764, 44.0, 54.0, 59.0, 110.85000000000014, 0.5570186578969649, 0.30026460649138403, 25.479251890521326], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.354000000000006, 11, 185, 45.0, 54.900000000000034, 60.0, 88.94000000000005, 0.5577935472211283, 125.27452702767715, 0.17322104298468632], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.866242215302491, 1.4665814056939501], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.358000000000001, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.5607512272040608, 0.6092660653123777, 0.24149540155956134], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5260000000000002, 2, 21, 3.0, 5.0, 6.949999999999989, 10.990000000000009, 0.5607461961781782, 0.5754044522126485, 0.2075418050307906], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2419999999999995, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.5607443095667466, 0.317997878914556, 0.21849314405969908], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.98000000000006, 83, 297, 121.0, 150.90000000000003, 156.0, 208.95000000000005, 0.5606820585105369, 0.5107287913601137, 0.18397380044876993], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, 0.8, 172.82599999999994, 40, 664, 173.0, 206.0, 222.0, 344.8900000000001, 0.5575621598173872, 0.30007298488672013, 164.93821235535444], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.411999999999999, 1, 10, 2.0, 3.0, 4.949999999999989, 7.0, 0.5607424229680096, 0.3125525696021533, 0.2360156096671994], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.456000000000001, 2, 36, 3.0, 5.0, 6.0, 8.0, 0.5607870758767346, 0.3015928228086684, 0.2398679094082126], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.11600000000001, 6, 306, 10.0, 15.0, 19.94999999999999, 40.950000000000045, 0.5569131861448909, 0.23530234747261658, 0.405176097341742], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.879999999999997, 2, 55, 5.0, 6.0, 7.0, 16.960000000000036, 0.5607531138620413, 0.2884954296518396, 0.22671073158094246], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8900000000000015, 2, 21, 4.0, 5.0, 6.0, 9.0, 0.5582251120916024, 0.3427676633589968, 0.2802028394678552], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.113999999999995, 2, 30, 4.0, 5.0, 6.0, 10.990000000000009, 0.5582076621816542, 0.3269167159052342, 0.26438546499814675], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.8519999999997, 378, 1202, 518.0, 636.9000000000001, 651.0, 861.7500000000002, 0.5577132862920767, 0.5096268546058194, 0.24672277215850658], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.958000000000002, 7, 116, 16.0, 25.0, 33.0, 45.99000000000001, 0.5579024652594134, 0.49399975026890897, 0.230461662895246], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.083999999999989, 6, 49, 10.0, 12.0, 15.0, 21.99000000000001, 0.5582837019122333, 0.3721495168194131, 0.26224068419900803], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 555.8320000000002, 455, 3317, 540.0, 614.9000000000001, 642.95, 707.8900000000001, 0.5580201445272175, 0.41938374522195254, 0.30952679891744095], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 175.054, 141, 357, 182.0, 192.0, 200.0, 230.99, 0.5605808514550437, 10.838681858594601, 0.2835750791540162], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 264.4359999999996, 19, 517, 267.0, 290.0, 297.0, 425.82000000000016, 0.5606569104888817, 1.084941203909797, 0.40187712138558507], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.677999999999983, 11, 59, 19.0, 22.0, 24.0, 31.99000000000001, 0.5602561042703841, 0.4572061855915576, 0.3468773145580308], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.17999999999999, 11, 44, 19.0, 22.0, 24.0, 32.0, 0.5602674044267848, 0.46593785156779627, 0.3556384891380958], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.44600000000001, 11, 45, 19.0, 23.0, 25.94999999999999, 32.0, 0.5602397826269644, 0.4533948342390543, 0.3430374450264713], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.179999999999996, 14, 43, 22.0, 26.0, 28.0, 32.99000000000001, 0.5602491988436457, 0.5010334846939919, 0.39064250778746384], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.740000000000006, 11, 44, 19.0, 22.0, 23.0, 30.980000000000018, 0.5600816374994819, 0.42048128935273604, 0.3101233285763733], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2223.672000000001, 1724, 3104, 2195.5, 2538.6000000000004, 2641.95, 2930.140000000001, 0.559021488786029, 0.46714870914950474, 0.3570313024082646], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.61932938856016, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19723865877712032, 0.0042544139544777706], "isController": false}, {"data": ["500", 6, 1.183431952662722, 0.025526483726866625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 507, "No results for path: $['rows'][1]", 500, "500", 6, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
