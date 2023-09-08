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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8897255902999361, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.177, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.589, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.943, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.112, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.84543714103575, 1, 18127, 9.0, 844.0, 1508.0, 6066.990000000002, 15.208936034469707, 95.8050191187423, 125.8552435787458], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6199.202000000004, 5191, 18127, 6059.0, 6518.9, 6703.299999999999, 14928.45000000007, 0.3278682074723787, 0.19041650553310388, 0.16521483892162836], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.327999999999999, 1, 12, 2.0, 3.0, 4.0, 5.990000000000009, 0.3289854614744865, 0.16889740913257062, 0.11887169994683594], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5480000000000005, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.32898329686005184, 0.1888152083961143, 0.13878982836283435], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.170000000000003, 8, 331, 11.0, 15.0, 20.0, 59.75000000000023, 0.3270183902061916, 0.1701230143034574, 3.5981603539581655], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.51199999999998, 23, 46, 33.5, 40.0, 41.0, 43.0, 0.3289317874416475, 1.3679932543902527, 0.13684076313490415], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1559999999999993, 1, 7, 2.0, 3.0, 3.0, 6.0, 0.3289393613444936, 0.20549394418524022, 0.1390925229122712], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.559999999999988, 21, 47, 29.0, 35.0, 36.0, 39.98000000000002, 0.32893092187495887, 1.3500012447979575, 0.1194944364623874], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.5359999999996, 678, 1091, 873.0, 1020.0, 1063.8, 1080.0, 0.3287838417208283, 1.390495577323055, 0.1598968292743872], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.530000000000002, 3, 15, 5.0, 7.0, 8.0, 11.990000000000009, 0.3289060387806532, 0.4890903460075083, 0.16798618972879065], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.822000000000002, 2, 18, 4.0, 5.0, 6.0, 9.0, 0.32719172649912703, 0.31559623064497344, 0.1789329754292101], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.680000000000002, 5, 15, 7.0, 9.0, 10.949999999999989, 14.0, 0.32893351858869097, 0.5360299334024752, 0.21489894915608815], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.0107878212616823, 2763.528128650701], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.179999999999998, 2, 19, 4.0, 5.0, 6.0, 9.0, 0.32719408171345, 0.3286990466791437, 0.19203480772439788], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.235999999999994, 6, 25, 8.0, 10.0, 11.0, 16.0, 0.32893308580022185, 0.5167558051344481, 0.19562524341048348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.519999999999995, 4, 13, 6.0, 8.0, 9.0, 11.990000000000009, 0.3289328694064143, 0.5090461010517957, 0.18791575058862536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.5140000000006, 1323, 1947, 1561.5, 1776.8000000000002, 1839.35, 1928.99, 0.32860276788683446, 0.5017963224339081, 0.18098824325017054], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.619999999999994, 7, 73, 11.0, 14.0, 18.0, 31.0, 0.32700491619191, 0.170116004789641, 2.6364771367972746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.105999999999996, 8, 29, 11.0, 14.0, 15.0, 21.980000000000018, 0.3289341677735302, 0.595457574358858, 0.2743259563267527], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.801999999999998, 5, 18, 7.0, 10.0, 11.0, 14.0, 0.3289341677735302, 0.5569106015728974, 0.23577898354079213], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.206311677631579, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.9486036554192229, 3910.9271152862984], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3739999999999966, 1, 17, 2.0, 3.0, 4.0, 9.990000000000009, 0.32719707930799125, 0.2750212872374816, 0.1383557962308205], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 567.78, 444, 729, 562.0, 654.0, 664.0, 688.96, 0.32709733173622607, 0.28803411621081293, 0.15141028832321404], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.284000000000001, 2, 22, 3.0, 4.0, 5.0, 9.990000000000009, 0.3271915123904154, 0.2964246464450315, 0.15976148065938253], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 759.2360000000002, 590, 931, 740.0, 881.9000000000001, 894.95, 917.0, 0.3270526149164773, 0.309393690034903, 0.17278853971661545], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.230000000000008, 17, 605, 23.0, 27.0, 31.0, 48.0, 0.3268777163538229, 0.17004983230355958, 14.910603643444402], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.872000000000003, 21, 242, 29.0, 35.0, 38.94999999999999, 111.7800000000002, 0.32713456942220837, 73.98822683065323, 0.10095168353263462], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 1.2195675872093024, 0.9538517441860466], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7520000000000016, 1, 12, 3.0, 4.0, 4.0, 7.0, 0.32892983992300406, 0.35742531462961513, 0.14101582004511604], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3159999999999976, 2, 9, 3.0, 4.0, 5.0, 6.0, 0.328928757978167, 0.33750853056175767, 0.12109974781032126], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8239999999999996, 1, 12, 2.0, 3.0, 3.0, 7.990000000000009, 0.3289867602568203, 0.18656826323118952, 0.1275466248261305], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.64, 67, 124, 91.0, 109.0, 113.94999999999999, 118.0, 0.32896554809607903, 0.29963814098114633, 0.10729930963290077], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.15999999999998, 59, 330, 80.0, 94.0, 102.89999999999998, 297.8000000000002, 0.327075292732387, 0.1701526163979198, 96.71399207660103], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 205.37799999999984, 12, 352, 260.0, 333.0, 337.95, 341.0, 0.3289255121863613, 0.18332136626941234, 0.1378018014921377], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 431.0199999999998, 342, 551, 416.5, 502.0, 511.0, 523.0, 0.32886298910148054, 0.17686341477351206, 0.14002369457836475], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.2039999999999935, 4, 248, 6.0, 8.0, 10.0, 27.0, 0.32682857318410774, 0.14736330129378358, 0.2371422166755782], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 404.97999999999985, 290, 505, 403.5, 463.0, 473.95, 488.99, 0.3288565001775825, 0.16915235078958446, 0.1323133574933242], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4560000000000013, 2, 11, 3.0, 4.900000000000034, 5.0, 8.0, 0.3271951522766239, 0.20088951580843378, 0.1635975761383119], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.058000000000001, 2, 26, 4.0, 5.0, 6.0, 9.0, 0.3271900136372798, 0.19162023738126274, 0.15432888338555287], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.698, 536, 874, 678.0, 817.6000000000001, 836.0, 858.95, 0.3270466250750572, 0.2988484351064275, 0.1440410428797371], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 249.2719999999999, 171, 317, 241.0, 292.0, 297.0, 309.97, 0.3271296467130667, 0.28965988473750465, 0.1344937317052745], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.551999999999995, 3, 42, 4.0, 5.0, 6.0, 9.0, 0.3271951522766239, 0.21814394766677137, 0.1530532011137723], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 987.8939999999996, 805, 8668, 938.0, 1100.9, 1120.0, 1145.96, 0.32702330956745934, 0.2458135855538761, 0.18075702462420118], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.17000000000007, 117, 164, 133.0, 151.0, 152.0, 156.99, 0.32895256240888016, 6.360191784072577, 0.16576125215134974], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.9919999999998, 160, 247, 177.0, 204.0, 205.0, 209.0, 0.3289235647420252, 0.6375174689249463, 0.23512895448355714], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.934, 5, 16, 7.0, 9.0, 9.949999999999989, 12.990000000000009, 0.3289017116702879, 0.26842426705075806, 0.2029940251715058], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.811999999999999, 4, 16, 7.0, 8.0, 9.0, 12.990000000000009, 0.3289036588558626, 0.273564975863405, 0.20813434661972555], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.211999999999998, 5, 16, 8.0, 10.0, 10.0, 13.0, 0.3288967356341195, 0.26617188846421014, 0.20074263649543428], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.62399999999999, 7, 23, 10.0, 11.0, 12.0, 15.0, 0.3288984664122308, 0.29411681120932015, 0.22868721492725422], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.714000000000005, 5, 26, 8.0, 9.0, 10.0, 17.960000000000036, 0.32888635134797356, 0.24689279994599686, 0.18146561378086434], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.5720000000008, 1396, 1970, 1594.5, 1825.8000000000002, 1865.95, 1949.0, 0.32857167265324255, 0.27457233008408805, 0.20920774469718176], "isController": false}]}, function(index, item){
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
