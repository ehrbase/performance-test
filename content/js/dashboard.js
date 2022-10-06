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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926824079982982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.491, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.875, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.432, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.986, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.659, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.532, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.987, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 214.88713039778773, 1, 4794, 20.0, 622.0, 1348.9000000000015, 2582.9900000000016, 22.774463533244127, 152.17352192926253, 188.68914864758153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 34.249999999999964, 19, 81, 34.0, 44.0, 53.0, 65.99000000000001, 0.49295177551370506, 0.2862644132937263, 0.24936427706650313], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.525999999999994, 5, 45, 7.0, 12.0, 15.949999999999989, 26.99000000000001, 0.4928337050942249, 5.282244592320566, 0.17903724442876137], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.86399999999999, 5, 34, 8.0, 12.0, 14.949999999999989, 24.980000000000018, 0.49282107539472503, 5.291855917659947, 0.20887143234502994], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 24.79800000000003, 12, 283, 22.0, 32.0, 39.94999999999999, 59.99000000000001, 0.48966752554350645, 0.26415745877489105, 5.452333131100645], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 48.43399999999999, 26, 99, 48.0, 62.0, 72.0, 88.0, 0.49270792274339775, 2.049177062290599, 0.20593651458415452], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.2179999999999995, 1, 36, 3.0, 4.0, 6.0, 12.990000000000009, 0.492730743343454, 0.30787298885787967, 0.20931432944765868], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 42.193999999999996, 23, 98, 41.0, 54.0, 62.94999999999999, 79.99000000000001, 0.4927035530824027, 2.0222141632686546, 0.17995227427033067], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 879.5299999999992, 583, 1683, 853.0, 1118.5000000000002, 1264.3999999999999, 1565.91, 0.4924517003372309, 2.082653262664873, 0.24045493180528854], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 14.988, 8, 35, 15.0, 20.0, 23.0, 30.0, 0.492373624923559, 0.732142270251081, 0.25243764949694186], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.890000000000001, 1, 26, 3.0, 6.0, 8.0, 14.980000000000018, 0.49040955082408416, 0.47308525874253105, 0.2691505542608743], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 24.717999999999996, 14, 54, 25.0, 32.0, 37.94999999999999, 49.98000000000002, 0.4926991834989131, 0.8028744901795198, 0.3228526876247761], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.605330230496454, 1677.71913785461], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.028000000000001, 3, 27, 5.0, 7.0, 8.0, 15.0, 0.49041724699374223, 0.4927007523000569, 0.28879062493869784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 25.418000000000003, 15, 66, 26.0, 34.0, 40.0, 51.98000000000002, 0.492693357508154, 0.7740799644398569, 0.29398011859129114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 14.169999999999996, 8, 56, 14.0, 19.0, 21.0, 33.960000000000036, 0.4926952994897647, 0.7625354694425448, 0.2824337312504804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2300.395999999999, 1507, 4794, 2250.0, 2824.5, 3060.2499999999995, 3470.98, 0.4916590049805057, 0.7508487647682074, 0.2717568328310217], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 21.346000000000007, 13, 233, 19.0, 28.0, 32.0, 58.940000000000055, 0.4896306030878065, 0.2643364529127145, 3.9486030471670954], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 29.883999999999997, 18, 61, 30.0, 40.0, 47.0, 56.0, 0.49270986483982987, 0.8919347690939854, 0.41187465263954526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.948, 15, 58, 25.0, 34.0, 40.94999999999999, 55.97000000000003, 0.4927074372216819, 0.8341074998940678, 0.35413347050308386], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.6122929216867465, 1643.1899472891566], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.609863931424767, 2546.531707723036], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6920000000000015, 1, 20, 2.0, 4.0, 5.0, 10.990000000000009, 0.4903297173151113, 0.412084778069415, 0.20829436233600923], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 460.96600000000024, 317, 979, 446.0, 588.9000000000001, 682.9, 872.8800000000001, 0.49018550580281606, 0.43153461855479586, 0.22785966871302774], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.526, 2, 17, 3.0, 5.0, 7.0, 11.990000000000009, 0.49038598280706747, 0.44424564230756025, 0.24040406579018345], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1291.0400000000006, 920, 2455, 1250.0, 1578.8000000000002, 1718.8, 2274.6800000000003, 0.48994582179102636, 0.4634916181906105, 0.25980525510988994], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 50.56199999999998, 26, 746, 46.0, 66.0, 74.94999999999999, 109.88000000000011, 0.48928227183544465, 0.26389420218855963, 22.380841418722877], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 55.132000000000005, 10, 261, 52.0, 75.0, 87.94999999999999, 106.99000000000001, 0.48993718025474775, 109.61671223031408, 0.1521484602744236], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.7250462582236843, 1.3556229440789473], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.729999999999998, 1, 25, 2.0, 4.0, 5.0, 10.990000000000009, 0.4928448780603203, 0.5354846233014101, 0.21225057736777464], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.720000000000002, 2, 18, 3.0, 5.0, 7.0, 14.970000000000027, 0.4928405059697771, 0.5056678352325763, 0.18240874195561083], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.681999999999999, 1, 27, 2.0, 4.0, 6.0, 12.970000000000027, 0.49284196332467245, 0.2795463146386877, 0.19203510094389092], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 141.02, 85, 332, 132.0, 192.80000000000007, 225.0, 287.98, 0.4927943608555699, 0.44891737544868926, 0.16169814965573387], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, 1.2, 196.07800000000015, 38, 701, 188.0, 262.80000000000007, 298.79999999999995, 431.8800000000001, 0.4897457044404263, 0.2632325769292553, 144.87672733309955], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.625999999999999, 1, 15, 2.0, 4.0, 5.0, 9.0, 0.49283759128584287, 0.27473096765950444, 0.20743457211347488], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.820000000000004, 2, 33, 3.0, 5.0, 7.0, 12.970000000000027, 0.49287062638927903, 0.26512300356591895, 0.2108177093344768], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.522000000000013, 8, 334, 11.0, 18.0, 23.94999999999999, 50.99000000000001, 0.48915111736789735, 0.20664437350258616, 0.35587654535066754], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.1, 2, 53, 5.0, 6.0, 8.0, 15.970000000000027, 0.4928463354410728, 0.2535030208400073, 0.1992562332740275], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.376000000000005, 2, 26, 4.0, 6.0, 7.0, 12.0, 0.490325389735136, 0.3010751119658027, 0.24612036164439446], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.764000000000003, 2, 29, 4.0, 7.0, 9.949999999999989, 17.0, 0.4903128882665184, 0.28720939308335225, 0.23222827227466936], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 583.1540000000008, 382, 1243, 572.0, 751.8000000000001, 821.9, 1108.4600000000005, 0.48993333966980457, 0.44769094263909454, 0.21673808874064593], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.904000000000003, 5, 117, 17.0, 31.900000000000034, 39.0, 57.97000000000003, 0.49006011077318745, 0.4339003706569648, 0.20243694029009598], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 13.592000000000008, 7, 49, 13.0, 18.0, 21.0, 32.0, 0.49042205722244564, 0.32694101387404, 0.2303642671132777], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 611.1120000000002, 373, 3685, 589.0, 702.8000000000001, 732.8499999999999, 834.8400000000001, 0.4902662537971122, 0.3684073207414983, 0.27194456265308564], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 192.6619999999999, 144, 412, 186.0, 234.0, 284.0, 379.0, 0.4928589664353187, 9.529325116203822, 0.24931732872411627], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 311.91799999999967, 220, 572, 300.0, 394.2000000000003, 458.79999999999995, 538.99, 0.4927681348528989, 0.9551357480737693, 0.35321465916213646], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 25.277999999999995, 15, 69, 25.0, 32.0, 41.0, 52.0, 0.4923552007972215, 0.4017945393130857, 0.3048371067435922], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 24.815999999999992, 15, 66, 25.0, 33.0, 39.0, 51.98000000000002, 0.4923668369271189, 0.40944149106403427, 0.3125375429713157], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.002000000000002, 15, 62, 25.0, 34.0, 39.0, 51.0, 0.4923304758472515, 0.3984924794673575, 0.30145625816037763], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 28.414000000000005, 16, 92, 28.0, 37.900000000000034, 47.94999999999999, 64.0, 0.4923421108084848, 0.4403317441145424, 0.34329322960669745], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 24.919999999999987, 15, 84, 25.0, 33.0, 40.0, 58.97000000000003, 0.4920368752115759, 0.36934094551282054, 0.27244619945797216], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2480.314000000001, 1752, 4495, 2416.0, 3064.0000000000014, 3328.9999999999995, 4168.010000000001, 0.49123055218243916, 0.41049892168753416, 0.31373513781964374], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["500", 8, 1.5748031496062993, 0.034035311635822164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
