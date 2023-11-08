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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8605190385024463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.454, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.969, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.563, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.69, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.273, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 495.7905977451596, 1, 26612, 14.0, 1218.9000000000015, 2341.9500000000007, 9798.0, 9.98373210212672, 62.89016914114101, 82.61623513244746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9954.334000000003, 8361, 26612, 9750.5, 10409.8, 10721.15, 25334.450000000128, 0.2151146431979459, 0.12495681909654431, 0.10839761317396493], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.563999999999999, 2, 11, 3.0, 4.0, 5.0, 9.0, 0.21584640715021444, 0.11081310029583909, 0.07799137758357357], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.172000000000001, 3, 18, 5.0, 6.0, 7.0, 11.990000000000009, 0.21584491629102456, 0.12388107007167777, 0.09105957406027598], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.607999999999993, 14, 580, 18.0, 23.0, 28.0, 80.99000000000001, 0.21463732087978982, 0.11165961641198517, 2.3616393499537027], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 52.946000000000005, 32, 77, 55.0, 68.0, 70.0, 73.99000000000001, 0.21581156370153087, 0.8975379535657683, 0.0897809825555197], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.4660000000000024, 2, 13, 3.0, 4.0, 5.0, 9.0, 0.21581584865266165, 0.13482378568515058, 0.0912580688150415], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.416, 28, 76, 48.0, 60.0, 62.0, 65.98000000000002, 0.21581165685083314, 0.8857361409800438, 0.07840032846534173], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1214.6, 872, 1783, 1196.5, 1483.8000000000002, 1649.6, 1769.96, 0.2157326020285768, 0.912390477951265, 0.10491683184592894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.726000000000008, 5, 19, 8.5, 11.0, 12.0, 16.0, 0.2157947050021644, 0.3208913625525838, 0.11021545968372266], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.326000000000002, 3, 21, 5.0, 7.0, 7.0, 13.970000000000027, 0.21479766918753213, 0.2071853572590013, 0.11746747533693162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.02800000000001, 8, 23, 12.0, 15.0, 16.0, 20.0, 0.21581100480740595, 0.35168552913297496, 0.14099371310171344], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.7283117634680135, 1991.2290219907409], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.946000000000001, 4, 21, 6.0, 7.900000000000034, 8.0, 14.990000000000009, 0.2147991456149184, 0.2157871377788308, 0.12606863917438083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.495999999999995, 8, 24, 13.0, 15.0, 17.0, 21.0, 0.21580960758475815, 0.3390381580250745, 0.12834770607335713], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.473999999999991, 6, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.2158088624067436, 0.3339789671333893, 0.12328924268354005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2330.98, 1953, 2960, 2286.5, 2677.8, 2779.8, 2928.95, 0.2156075735178704, 0.3292580312743098, 0.11875260885163957], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.34999999999997, 12, 106, 17.0, 21.0, 26.0, 84.84000000000015, 0.21462893661664095, 0.11165525471196368, 1.7304458014716677], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.320000000000007, 12, 32, 17.0, 21.0, 23.0, 28.99000000000001, 0.21581268149846514, 0.39067785724660137, 0.1799844042965715], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.195999999999998, 8, 24, 12.0, 15.0, 16.0, 20.99000000000001, 0.21581202944884628, 0.36538620466382743, 0.154693388296341], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.813058035714286, 1391.6613520408164], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.8195533348056537, 3378.8751932420496], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.6339999999999986, 2, 31, 3.0, 4.0, 5.0, 11.990000000000009, 0.21478825744005045, 0.18053750103635335, 0.09082355026517759], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 779.5839999999994, 598, 987, 758.5, 944.0, 955.0, 973.98, 0.21473069764285818, 0.18908673571439613, 0.09939682683858865], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.588, 3, 16, 4.0, 6.0, 6.0, 12.990000000000009, 0.21479268639494534, 0.194595042085405, 0.1048792414037819], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1040.871999999999, 791, 1374, 979.0, 1305.9, 1327.0, 1358.95, 0.21471151789878157, 0.20311835400754752, 0.1134364562336336], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.204756181318682, 723.5898866758242], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.866000000000064, 24, 1691, 34.0, 41.0, 48.0, 89.99000000000001, 0.21447481979825642, 0.11157507935032146, 9.783319172633357], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.66200000000001, 32, 499, 45.0, 54.0, 61.89999999999998, 181.0, 0.21472341262496367, 48.56412633861259, 0.06626230311473487], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.8350542396496815, 0.6531150477707006], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.110000000000001, 2, 16, 4.0, 5.0, 5.0, 9.990000000000009, 0.21582777289047775, 0.2345251183329722, 0.09252772685441382], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.9940000000000015, 3, 19, 5.0, 6.0, 7.0, 10.990000000000009, 0.2158264686127883, 0.22145608284779572, 0.07945954947951289], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8040000000000003, 1, 16, 3.0, 4.0, 4.949999999999989, 9.0, 0.21584705940758617, 0.12240678307478453, 0.08368289314923018], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 128.48199999999997, 84, 179, 133.0, 163.90000000000003, 168.95, 174.99, 0.21583634425033563, 0.1965944498493462, 0.07039974509727744], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 121.59799999999993, 82, 493, 119.0, 135.0, 146.95, 476.2300000000007, 0.21468164858331582, 0.11168267677423648, 63.47993786576385], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 273.15800000000013, 15, 533, 284.0, 491.0, 504.95, 519.0, 0.21582246271559047, 0.1202851930629049, 0.09041780908690264], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 589.7719999999994, 459, 755, 576.5, 700.0, 710.0, 736.98, 0.2158049503065941, 0.1160604923665473, 0.09188570149772951], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.93999999999999, 6, 390, 9.0, 13.0, 17.94999999999999, 44.90000000000009, 0.21444170530906198, 0.09668933570141308, 0.15559588578577446], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 546.4200000000002, 398, 696, 539.5, 646.9000000000001, 662.0, 680.99, 0.2157894895844887, 0.11099461138578716, 0.08682155245000914], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.039999999999994, 3, 18, 5.0, 6.0, 7.0, 13.0, 0.21478705796286504, 0.13187380001155555, 0.1073935289814325], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.814000000000009, 3, 51, 5.0, 7.0, 7.0, 13.990000000000009, 0.21478272150327285, 0.1257884237428982, 0.10130864695906326], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 944.6880000000004, 664, 1425, 912.0, 1172.3000000000002, 1370.75, 1416.98, 0.21470045422028095, 0.19618883009615146, 0.09456045395834639], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 332.9640000000003, 240, 440, 330.0, 401.0, 406.0, 430.8700000000001, 0.21474416239468946, 0.1901471479344618, 0.08828837145328541], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.827999999999994, 5, 75, 6.0, 8.0, 9.0, 14.990000000000009, 0.21480016067052018, 0.14320919696422935, 0.10047780953240154], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1564.4539999999997, 1263, 11811, 1462.5, 1783.8000000000002, 1806.95, 2743.7800000000084, 0.21468671840616582, 0.16137354885196278, 0.11866472911903306], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.59200000000016, 130, 247, 168.5, 207.0, 208.0, 213.0, 0.21586812012111065, 4.173740535667027, 0.10877729490477842], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 234.89200000000014, 178, 349, 227.0, 283.0, 284.0, 289.99, 0.2158471525875325, 0.4183535177851578, 0.15429698798249392], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 10.941999999999988, 7, 33, 11.0, 13.900000000000034, 15.0, 20.0, 0.21579237665955128, 0.17611313193179062, 0.1331843574695668], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.806000000000003, 7, 22, 11.0, 13.0, 14.0, 19.99000000000001, 0.2157934942577351, 0.1794858173772027, 0.13655682058497298], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.29799999999999, 8, 30, 13.0, 15.0, 16.0, 20.99000000000001, 0.2157898621059623, 0.17463595373616408, 0.13170767950803364], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.87999999999999, 10, 30, 14.5, 18.0, 19.94999999999999, 25.0, 0.2157906071527681, 0.19297032898033326, 0.15004190653590907], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.496000000000002, 8, 43, 11.0, 14.0, 15.949999999999989, 39.8900000000001, 0.21578017696563873, 0.16198474593286735, 0.11905839842342372], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2646.0359999999982, 2231, 3296, 2606.0, 3022.9, 3147.65, 3275.7400000000002, 0.21556974004445048, 0.180153989549179, 0.13725729541892745], "isController": false}]}, function(index, item){
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
