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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8919804296958094, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.198, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.64, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.977, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.113, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.9056796426284, 1, 22688, 9.0, 840.0, 1510.9500000000007, 6064.930000000011, 15.271058858383586, 96.19634684339646, 126.36931524804345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6239.285999999997, 5266, 22688, 6044.5, 6512.3, 6690.2, 20819.080000000125, 0.3295325054158667, 0.19138308232018567, 0.1660534890572141], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4240000000000013, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3307125466387369, 0.16978407509126014, 0.11949574439094986], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6719999999999984, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.33071014049889613, 0.18980630534434204, 0.1395183405229718], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.519999999999998, 8, 366, 12.0, 15.0, 18.0, 63.98000000000002, 0.3285993125702381, 0.17094544902274567, 3.615555131571165], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.29599999999997, 23, 45, 33.0, 40.0, 41.94999999999999, 43.0, 0.3306806134522196, 1.3752664407374047, 0.13756830208070855], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2960000000000016, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3306884868157807, 0.20658665224699518, 0.1398321433508135], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.345999999999993, 21, 51, 29.0, 35.0, 36.0, 38.99000000000001, 0.330680394753028, 1.3571814471020491, 0.12012998715637346], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.1200000000002, 664, 1085, 861.5, 1019.8000000000001, 1060.9, 1074.99, 0.3304900175490199, 1.3977113514645665, 0.16072659056583197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.790000000000004, 4, 27, 5.0, 8.0, 9.0, 12.0, 0.33072064027515957, 0.49178869741541825, 0.1689129832655356], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.876000000000004, 2, 22, 4.0, 5.0, 5.0, 9.0, 0.32880330065905333, 0.31715069149800157, 0.1798143050479198], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6720000000000015, 5, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.3306828004600459, 0.5388805624567219, 0.21604179053493236], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.8687092118473896, 2375.0803997238954], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.1199999999999966, 2, 13, 4.0, 5.0, 6.0, 10.0, 0.32880719272310227, 0.3303195773693189, 0.19298156526033639], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.066000000000004, 5, 15, 8.0, 10.0, 11.0, 13.0, 0.33068148825187876, 0.5195025556305468, 0.196665064790424], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.63, 4, 14, 6.0, 8.0, 9.0, 11.990000000000009, 0.330680394753028, 0.5117505159854209, 0.1889140927055873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1556.225999999999, 1329, 1983, 1536.0, 1743.9, 1790.0, 1923.9, 0.33035223476679776, 0.5044678642843645, 0.18195181680515032], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.435999999999988, 7, 85, 10.0, 14.0, 16.94999999999999, 28.970000000000027, 0.3285835486103216, 0.1709372482228559, 2.649204860670718], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.060000000000002, 8, 30, 11.0, 13.0, 15.0, 20.99000000000001, 0.3306841126786273, 0.5986254360483381, 0.27578538303471456], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.989999999999986, 5, 23, 8.0, 10.0, 11.0, 17.0, 0.3306830191624196, 0.5598715401875767, 0.23703255475118748], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 1.0494732748868778, 4326.79493071267], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.297999999999999, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.3288162745642198, 0.27638228093766565, 0.13904047547490936], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.7019999999995, 432, 715, 544.5, 640.9000000000001, 656.0, 689.0, 0.3287155374630523, 0.2894590696150478, 0.15215934058348324], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3619999999999983, 2, 12, 3.0, 4.0, 5.0, 8.990000000000009, 0.3288244919003951, 0.2979040716610504, 0.1605588339357398], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.9179999999997, 615, 939, 740.5, 878.0, 889.0, 919.98, 0.32866540809726397, 0.3109194018338872, 0.1736406111138865], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.268000000000004, 17, 623, 22.5, 27.0, 30.94999999999999, 53.0, 0.32845101842807284, 0.1708683027605651, 14.982370186303987], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.377999999999986, 21, 276, 30.0, 36.0, 39.94999999999999, 109.87000000000012, 0.3287161857877585, 74.34594197711445, 0.10143976045794109], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.2339154411764706, 0.9650735294117647], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7580000000000005, 1, 17, 3.0, 4.0, 4.0, 6.0, 0.33064015902469085, 0.3592838001448865, 0.1417490525506243], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.375999999999998, 2, 10, 3.0, 4.0, 5.0, 6.990000000000009, 0.3306390657991579, 0.3392634500252278, 0.12172942168582279], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.86, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.330713640350239, 0.18754757625760476, 0.1282161281435985], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.32800000000005, 66, 124, 91.0, 111.90000000000003, 115.0, 118.99000000000001, 0.330690673927752, 0.3012094711710484, 0.10786199716002849], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.87600000000003, 58, 345, 79.0, 93.0, 99.94999999999999, 325.5300000000004, 0.3286610873160484, 0.17097758576575403, 97.18290100432255], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 199.93800000000007, 13, 358, 259.0, 332.0, 335.95, 339.0, 0.330636004806125, 0.18427468193642926, 0.13851840435725352], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 418.06000000000006, 309, 533, 409.5, 488.0, 499.95, 515.97, 0.3305629950594055, 0.17777768262613788, 0.1407475252401375], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.203999999999999, 4, 285, 6.0, 8.0, 10.0, 26.0, 0.3283923421532948, 0.1480683870074197, 0.23827686544911922], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.41800000000006, 281, 505, 388.5, 454.0, 462.95, 487.98, 0.33055753155502193, 0.17002730219272033, 0.13299775683659087], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5480000000000005, 2, 21, 3.0, 5.0, 6.0, 9.0, 0.32881454465104226, 0.2018837816089422, 0.16440727232552113], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2180000000000035, 2, 45, 4.0, 5.0, 6.0, 10.0, 0.32880503045392195, 0.19256607891945463, 0.1550906540129339], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.6899999999999, 540, 863, 678.0, 803.9000000000001, 834.95, 852.94, 0.32864877371283063, 0.30031244536214136, 0.1447466767036002], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.9160000000001, 174, 307, 233.0, 280.90000000000003, 285.0, 300.99, 0.3287269915760421, 0.2910742680975714, 0.135150452591322], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.492000000000004, 2, 41, 4.0, 5.0, 6.0, 9.0, 0.32880870632844966, 0.21921971864989828, 0.1538079788391869], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 996.4800000000001, 802, 9719, 935.0, 1095.9, 1114.0, 1170.7500000000002, 0.3286049274966088, 0.24700244017911596, 0.18163123922175836], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.0359999999999, 118, 167, 136.5, 150.0, 152.0, 157.99, 0.33064759315003994, 6.392964657202761, 0.16661538873576232], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.26199999999992, 159, 243, 182.0, 203.0, 205.0, 217.99, 0.33061960759420017, 0.640804727918247, 0.23634136011616652], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.088000000000004, 5, 26, 7.0, 9.0, 9.949999999999989, 14.0, 0.33071714027565935, 0.2699058801755579, 0.20411448501388352], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.898000000000001, 5, 18, 7.0, 9.0, 10.0, 12.990000000000009, 0.33071889026614937, 0.27507479104353716, 0.20928304774654763], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.496, 6, 33, 8.0, 10.0, 11.0, 15.990000000000009, 0.33071210915616156, 0.2676410468542995, 0.2018506525611338], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.74199999999999, 7, 24, 9.0, 12.0, 13.0, 16.99000000000001, 0.33071429658061263, 0.2957406137908523, 0.22994978434120722], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.836000000000011, 5, 32, 8.0, 9.0, 10.0, 12.990000000000009, 0.33071626528735937, 0.24826650418852153, 0.1824752830931231], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.548, 1411, 1975, 1588.5, 1788.9, 1854.95, 1947.7000000000003, 0.3303862876475175, 0.2760887209012277, 0.21036314408806775], "isController": false}]}, function(index, item){
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
