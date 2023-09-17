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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8887045309508615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.17, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.615, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.969, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.02, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 333.02497340991414, 1, 19110, 9.0, 847.9000000000015, 1537.0, 6328.950000000008, 14.87423817385741, 93.69667078574325, 123.0855902198799], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6485.148, 5165, 19110, 6310.0, 6884.0, 7064.5, 16894.450000000084, 0.32083674222371944, 0.1863328310233088, 0.16167163963617115], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3800000000000012, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.32186693119836857, 0.16524283632841244, 0.11629957474941051], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.568000000000002, 2, 12, 3.0, 4.0, 5.0, 8.990000000000009, 0.321865066439387, 0.18472980292684782, 0.1357868249041164], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.398000000000005, 8, 429, 11.0, 15.0, 18.94999999999999, 72.97000000000003, 0.3200223247573751, 0.16648348888818484, 3.5211831377356884], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.86999999999998, 24, 66, 34.0, 40.0, 41.0, 45.99000000000001, 0.32181099782648853, 1.3383786274937939, 0.13387840339266024], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2639999999999993, 1, 25, 2.0, 3.0, 4.0, 6.0, 0.3218184544861814, 0.20104539406187025, 0.13608143632081696], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.891999999999985, 21, 46, 30.0, 35.0, 36.0, 39.99000000000001, 0.321817004553067, 1.3208042414113477, 0.11691008368529386], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.2919999999997, 666, 1120, 869.5, 1011.9000000000001, 1056.95, 1080.98, 0.32166711056727926, 1.3603974339890839, 0.1564357627563526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6080000000000005, 3, 26, 5.0, 7.0, 8.949999999999989, 12.0, 0.3217764117296512, 0.4784884374070871, 0.1643447884127027], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7800000000000025, 2, 14, 4.0, 5.0, 5.0, 11.0, 0.3201628988829517, 0.3088165008356252, 0.17508908532661419], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.781999999999994, 5, 16, 8.0, 9.0, 10.0, 14.0, 0.3218219758067112, 0.5244409660629071, 0.21025283380340798], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9165618379237289, 2505.9110997086864], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.099999999999997, 2, 15, 4.0, 5.0, 6.0, 9.0, 0.32016453895986224, 0.32163717077480464, 0.18790907022937228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.083999999999998, 5, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.32182156152970803, 0.5055835588363834, 0.1913958310269455], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.577999999999997, 4, 16, 6.0, 8.0, 9.0, 12.0, 0.32182135439160636, 0.49804054542765874, 0.18385301984286107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1586.4799999999998, 1345, 1979, 1557.0, 1787.8000000000002, 1877.95, 1964.8400000000001, 0.3214923417309276, 0.4909382711797547, 0.17707195384398747], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.524000000000001, 8, 47, 10.0, 14.0, 18.0, 31.99000000000001, 0.32001454146076397, 0.16647943982574567, 2.5801172405274095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.14999999999999, 8, 38, 11.0, 13.0, 15.0, 19.0, 0.3218209401162031, 0.5825807567410223, 0.26839363560472407], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.908000000000005, 5, 22, 8.0, 10.0, 11.0, 14.990000000000009, 0.3218219758067112, 0.5448691188240754, 0.23068098656457617], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 6.738281249999999, 1948.3258928571427], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 1.021733893171806, 4212.430306993392], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.309999999999999, 1, 18, 2.0, 3.0, 4.0, 6.990000000000009, 0.3201963187669624, 0.26913688820889864, 0.13539551369735814], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.6059999999999, 446, 745, 554.5, 645.0, 660.95, 684.97, 0.3200723107364416, 0.2818480501114812, 0.14815847196198567], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3500000000000005, 2, 22, 3.0, 4.0, 5.0, 11.0, 0.3201649489817154, 0.2900588133006125, 0.15633054149497821], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 760.1819999999999, 586, 951, 750.0, 869.0, 892.0, 921.0, 0.32002621654765956, 0.30274667600769856, 0.1690763507346522], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.148182744565218, 715.7247792119565], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.108, 17, 1478, 22.0, 27.0, 31.0, 86.95000000000005, 0.3197139455386477, 0.166323062429583, 14.5838265587014], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.58399999999999, 21, 241, 29.0, 35.0, 42.0, 104.95000000000005, 0.3201493688895491, 72.4083797286462, 0.0987960943057593], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 1.263648343373494, 0.9883283132530121], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.701999999999997, 1, 9, 3.0, 4.0, 4.0, 6.0, 0.3218199044323612, 0.349699439317317, 0.13796771293535798], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3299999999999996, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.32181866162055006, 0.3302129745618439, 0.11848206585053453], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.787999999999998, 1, 11, 2.0, 2.0, 3.0, 5.990000000000009, 0.321867967184917, 0.18253119846089175, 0.12478670212149615], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.41600000000003, 67, 119, 90.0, 109.0, 114.0, 117.0, 0.321848284580828, 0.293155384288461, 0.10497785844726226], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.16600000000003, 58, 388, 80.0, 92.0, 100.89999999999998, 297.98, 0.3200940308224944, 0.1665207921479014, 94.64967928978817], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.78799999999987, 12, 368, 259.0, 332.0, 337.0, 346.98, 0.32181472611314105, 0.17935828353518624, 0.1348227709985718], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.84599999999983, 319, 559, 414.0, 492.90000000000003, 503.0, 527.97, 0.3217886299205504, 0.17305880506205693, 0.13701156508335935], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.252000000000002, 4, 263, 6.0, 8.0, 11.0, 25.99000000000001, 0.3196648889036645, 0.14413327720284272, 0.23194434810099876], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 395.7960000000001, 279, 510, 395.0, 453.0, 464.95, 481.99, 0.32176398740229634, 0.16550420879361671, 0.12945972930639268], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5319999999999965, 2, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.3201940632178351, 0.19659102488836433, 0.16009703160891753], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.089999999999996, 2, 22, 4.0, 5.0, 6.0, 10.0, 0.32019016734418904, 0.18752074732224963, 0.1510271980734798], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.0059999999999, 534, 876, 681.0, 819.8000000000001, 835.0, 850.99, 0.32003277135578684, 0.2924393207864485, 0.14095193347798815], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.57199999999992, 174, 321, 238.0, 287.0, 292.95, 305.99, 0.3201415794120792, 0.2834722377624281, 0.13162070794188022], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.510000000000001, 3, 36, 4.0, 5.0, 6.0, 10.990000000000009, 0.32016617905357597, 0.213457668068034, 0.14976523414713172], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1011.8799999999997, 836, 8471, 960.0, 1114.9, 1140.0, 1193.8200000000002, 0.31999897600327676, 0.24053360529246304, 0.1768744340018112], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.81999999999996, 117, 168, 139.0, 149.0, 150.0, 156.96000000000004, 0.3218698319775103, 6.223249473702591, 0.16219222001991732], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.36399999999992, 161, 244, 184.5, 202.0, 203.0, 215.99, 0.32184269101685553, 0.6237933664922494, 0.2300672361565803], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.962000000000004, 5, 24, 7.0, 9.0, 9.0, 12.990000000000009, 0.321772891406154, 0.26260627253616886, 0.19859420641473566], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.919999999999998, 5, 28, 7.0, 9.0, 9.949999999999989, 16.99000000000001, 0.32177434094179486, 0.26763517961282823, 0.20362282512722957], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.274000000000006, 5, 25, 8.0, 10.0, 11.0, 14.990000000000009, 0.32177082066360724, 0.2604049773360722, 0.19639332315893998], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.737999999999989, 7, 18, 9.0, 12.0, 13.0, 15.990000000000009, 0.32177123480998443, 0.2877432982693856, 0.2237315617038173], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.665999999999998, 5, 30, 7.0, 9.0, 10.0, 15.980000000000018, 0.3217416260306993, 0.24152930209576062, 0.17752345576889172], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1669.1339999999998, 1437, 2040, 1645.0, 1875.9, 1945.85, 2027.99, 0.32142806632732435, 0.2686027447626511, 0.20465927660685104], "isController": false}]}, function(index, item){
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
