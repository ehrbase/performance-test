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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8723037651563497, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.778, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.796, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.428, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 469.9317166560315, 1, 20332, 11.0, 1017.0, 1897.0, 10624.990000000002, 10.57690360640689, 66.62667510529656, 87.52477995017537], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10759.094000000003, 9327, 20332, 10600.5, 11451.7, 11849.65, 19069.75000000006, 0.2276370500241523, 0.13223089445084613, 0.114707732238733], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.827999999999999, 1, 9, 3.0, 4.0, 4.0, 7.0, 0.22858752113291633, 0.11735424388162641, 0.08259510040935453], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.162000000000005, 2, 13, 4.0, 5.0, 6.0, 9.0, 0.22858637158909131, 0.1311938441861571, 0.0964348755141479], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.11200000000001, 10, 449, 14.0, 18.0, 20.94999999999999, 83.96000000000004, 0.2275410188194626, 0.11837243763214444, 2.503617831092661], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.26399999999999, 25, 61, 42.0, 53.0, 55.0, 58.0, 0.2285669355985231, 0.9505862249050647, 0.09508741656735432], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.483999999999999, 1, 10, 2.0, 3.900000000000034, 4.0, 7.0, 0.22857195102160235, 0.1427927370976848, 0.09665200663315802], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.26200000000003, 23, 56, 36.0, 47.0, 48.0, 52.0, 0.2285657862617334, 0.9380817534961422, 0.08303366454039535], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1021.2679999999996, 744, 1438, 995.0, 1263.0000000000005, 1365.9, 1406.98, 0.228476486799314, 0.9662748106900949, 0.11111454143169763], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.86, 4, 24, 6.0, 9.0, 10.0, 16.99000000000001, 0.22859640436143652, 0.33992776453633106, 0.11675382761819462], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.413999999999997, 3, 16, 4.0, 5.0, 6.0, 11.0, 0.22760005753729454, 0.2195340359669543, 0.12446878146570797], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.075999999999999, 6, 21, 9.0, 12.0, 13.0, 17.0, 0.22856620420104684, 0.3724713970823524, 0.14932694395556673], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.8287685584291188, 2265.881300886015], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.066000000000001, 3, 17, 5.0, 6.0, 7.0, 12.990000000000009, 0.22760130078695426, 0.2286481778638161, 0.13358240407515576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.358, 6, 18, 9.0, 12.0, 13.0, 16.99000000000001, 0.2285656817771439, 0.35907802532393474, 0.1359340822287897], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.456000000000003, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.22856474142013675, 0.35371956189053216, 0.13057653684646484], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2067.4220000000005, 1607, 2712, 2023.5, 2446.9, 2598.95, 2659.99, 0.22836806354843778, 0.34873186001106216, 0.125780847501288], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.031999999999988, 9, 83, 13.0, 17.0, 19.0, 37.960000000000036, 0.22753490954349673, 0.11836925943644153, 1.8345002081944422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.663999999999985, 9, 38, 13.0, 17.0, 18.0, 24.0, 0.2285675625143712, 0.4137675549887842, 0.1906217757688213], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.26799999999999, 6, 18, 9.0, 12.0, 13.0, 16.0, 0.22856704008425896, 0.38698140924265684, 0.16383614006039657], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.7324538934426235, 2235.78381147541], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.840339107789855, 3464.5713032155795], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.836, 2, 17, 3.0, 4.0, 4.0, 9.980000000000018, 0.22765580991286247, 0.1913531563965819, 0.09626461493385689], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 695.0880000000008, 522, 887, 688.0, 824.0, 844.95, 871.0, 0.22758690064420747, 0.20040760173817218, 0.10534784268101009], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.771999999999999, 2, 13, 4.0, 4.0, 5.949999999999989, 11.0, 0.2276460668223159, 0.20623977798020574, 0.11115530606558394], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 954.3399999999991, 731, 1234, 928.5, 1138.8000000000002, 1159.0, 1203.99, 0.22752279550888205, 0.21523789769278234, 0.12020491442412616], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.176254734848484, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.715999999999998, 19, 1590, 27.0, 32.0, 36.0, 103.91000000000008, 0.22737184072511607, 0.11828442702409822, 10.37161980495134], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.80799999999998, 25, 299, 37.0, 45.0, 49.0, 127.87000000000012, 0.2276083461249224, 51.47831967555227, 0.07023851306198778], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2439999999999993, 2, 15, 3.0, 4.0, 5.0, 7.0, 0.22856077110918713, 0.24836118712978872, 0.09798650245794253], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9140000000000046, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.22855983079258607, 0.23452158184773253, 0.08414751582891108], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2079999999999984, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.22858804365665894, 0.12963219026548672, 0.08862251301923203], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.79799999999993, 87, 174, 127.0, 153.90000000000003, 158.0, 165.0, 0.22857728014980042, 0.20819952633644564, 0.07455548004886069], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.65400000000004, 69, 522, 98.0, 115.0, 121.0, 413.3300000000006, 0.22757643837412111, 0.11839086375613092, 67.29284157744154], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 256.226, 14, 447, 318.0, 415.0, 428.95, 440.99, 0.22855753227346634, 0.12738288012088866, 0.09575310678253621], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 489.5539999999998, 365, 656, 470.5, 591.9000000000001, 605.9, 627.98, 0.22854071269964174, 0.12290982020587862, 0.09730835032914434], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.365999999999993, 5, 301, 7.0, 9.900000000000034, 12.0, 26.0, 0.2273426868177162, 0.10250624211973412, 0.1649566565484015], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 463.7240000000001, 324, 597, 478.5, 546.0, 559.0, 581.97, 0.2285256712027489, 0.11754566042890612, 0.09194587552298099], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.172000000000002, 2, 23, 4.0, 5.0, 6.949999999999989, 13.970000000000027, 0.2276545660676316, 0.13977412327380925, 0.11382728303381581], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.593999999999995, 3, 27, 4.0, 5.0, 6.0, 10.980000000000018, 0.22765207841794555, 0.13332541791799427, 0.10737886120690206], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 767.4039999999997, 541, 1146, 708.0, 1021.9000000000001, 1109.0, 1126.99, 0.22757913153982773, 0.2079570988018869, 0.1002326057856077], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 273.8279999999999, 189, 364, 267.0, 332.90000000000003, 342.0, 354.99, 0.22761601360597483, 0.20154464423503268, 0.0935804118438627], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.236000000000002, 3, 41, 5.0, 6.0, 7.0, 12.0, 0.22760202602219484, 0.15174431561094984, 0.10646618209436653], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1288.5359999999978, 966, 10761, 1210.0, 1521.8000000000002, 1537.0, 1570.96, 0.227451586929722, 0.17096851657780893, 0.12572031074435808], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.83800000000008, 145, 211, 178.0, 186.0, 188.0, 193.0, 0.22859316451575737, 4.419775168193135, 0.11518952430676838], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.60599999999988, 196, 304, 227.0, 252.0, 254.0, 262.0, 0.22857602621492729, 0.44302453612209797, 0.16339614373957692], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.316000000000003, 5, 27, 8.0, 10.0, 11.0, 16.0, 0.2285938960857867, 0.1865607469705594, 0.1410852952404465], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.122000000000003, 5, 19, 8.0, 10.900000000000034, 12.0, 16.0, 0.22859494119395138, 0.19013339586357453, 0.14465773622429734], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.523999999999997, 6, 35, 9.0, 12.0, 13.0, 17.0, 0.228589506735847, 0.1849945411397107, 0.13951996260732846], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.663999999999996, 8, 36, 11.0, 14.0, 16.0, 20.99000000000001, 0.22859086532614886, 0.2044169348513748, 0.1589420860470879], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.152, 5, 96, 9.0, 10.0, 11.949999999999989, 43.81000000000017, 0.22856954777057836, 0.17158564166672, 0.12611503368200855], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2090.8540000000003, 1620, 2771, 2003.0, 2626.1000000000004, 2722.9, 2761.94, 0.2283837102121319, 0.19084982877502288, 0.1454161904866309], "isController": false}]}, function(index, item){
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
