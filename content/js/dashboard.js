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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8748989576685812, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.856, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 459.8898532227186, 1, 20519, 11.0, 997.0, 1853.0, 10382.950000000008, 10.762411915805476, 67.7952533085946, 89.05987704127539], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10523.622000000001, 8937, 20519, 10358.5, 11333.500000000002, 11807.25, 19192.73000000006, 0.23166177010905245, 0.13458191450151716, 0.11673581384401471], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.764, 2, 8, 3.0, 4.0, 4.0, 6.990000000000009, 0.23258897109616855, 0.11940854296383473, 0.08404093682185777], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.102000000000002, 2, 17, 4.0, 5.0, 6.0, 11.980000000000018, 0.23258756456630794, 0.1334902710656883, 0.09812287880141116], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.930000000000007, 10, 448, 14.0, 18.0, 23.0, 40.99000000000001, 0.2312991192592137, 0.12032749396540598, 2.5449679459898054], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.430000000000035, 26, 65, 45.0, 55.0, 56.0, 58.0, 0.232568415813722, 0.9672279669043515, 0.09675209486000544], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.680000000000003, 1, 16, 2.0, 4.0, 4.0, 8.0, 0.23257414929027673, 0.14529297758054974, 0.09834434242450178], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.05199999999998, 23, 60, 40.0, 48.0, 49.0, 52.0, 0.23256819946165114, 0.9545084937104256, 0.08448766621067795], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1008.4560000000009, 740, 1461, 999.0, 1225.9, 1367.95, 1411.96, 0.2324925009543817, 0.9832593738360844, 0.11306764206570517], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.478000000000007, 4, 22, 6.0, 9.0, 10.0, 14.0, 0.23253348017047493, 0.34578228084998425, 0.11876465832925624], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.345999999999999, 3, 22, 4.0, 5.0, 6.0, 12.980000000000018, 0.23144794296011734, 0.2232455544347046, 0.12657309380631418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.985999999999997, 6, 26, 9.0, 11.0, 12.0, 18.0, 0.2325696057573071, 0.37899533869460544, 0.15194244751136568], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.8193507339015151, 2240.132649739583], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.869999999999999, 3, 28, 5.0, 6.0, 7.0, 12.990000000000009, 0.23144944287804606, 0.23251401990534643, 0.1358409327829157], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.136000000000001, 6, 19, 9.0, 12.0, 13.0, 17.0, 0.2325686321661954, 0.3653666838399221, 0.13831474315352835], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.3860000000000054, 5, 18, 7.0, 9.0, 10.0, 13.0, 0.23256722588231354, 0.35991368020308695, 0.13286311244253263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2019.3760000000004, 1575, 2701, 1991.5, 2360.6000000000004, 2489.9, 2613.8900000000003, 0.2323571236046955, 0.3548233962420882, 0.12797794698539866], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.065999999999995, 9, 98, 13.0, 17.0, 19.0, 39.960000000000036, 0.23129451841243145, 0.12032510049168588, 1.8648120547002283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.534000000000006, 9, 36, 13.0, 16.0, 18.0, 28.0, 0.23257036300047398, 0.42101367929453964, 0.1939600488304734], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.116000000000005, 6, 32, 9.0, 11.0, 12.949999999999989, 19.99000000000001, 0.2325694975801144, 0.39375787465783213, 0.16670508908574605], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.734809027777779, 2525.607638888889], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.8357967342342342, 3445.8438907657655], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.838000000000004, 2, 23, 3.0, 4.0, 4.0, 9.0, 0.2314354086917882, 0.19453004942881744, 0.09786282418314873], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 675.4279999999998, 519, 896, 661.0, 816.9000000000001, 836.0, 855.0, 0.23138068091632302, 0.2037483142471266, 0.10710394800228235], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.69, 2, 13, 3.0, 4.900000000000034, 6.0, 11.0, 0.2314424791377749, 0.20967920148525895, 0.11300902301649167], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 935.4560000000004, 718, 1193, 909.0, 1121.0, 1145.8, 1186.93, 0.23136183742018596, 0.21886965383526202, 0.12223315824640682], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.118000000000002, 19, 1359, 27.0, 33.0, 36.94999999999999, 75.0, 0.2311503799649946, 0.12025011612417214, 10.543978757973532], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.05799999999997, 26, 427, 37.0, 47.0, 53.0, 129.0, 0.23137532733824434, 52.33030013414563, 0.07140097992078634], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 1.0143405464216635, 0.7933389748549323], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0600000000000014, 2, 9, 3.0, 4.0, 4.0, 7.990000000000009, 0.23256008654956178, 0.2527069667036747, 0.09970105272974379], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.784000000000001, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.2325590048707158, 0.23862507032002908, 0.08561986800416001], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2179999999999995, 1, 22, 2.0, 3.0, 4.0, 8.0, 0.23258951207372155, 0.13190142144172934, 0.09017386356764401], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.74400000000001, 86, 169, 126.0, 154.90000000000003, 157.0, 164.99, 0.23257620475636945, 0.21184194525225913, 0.07585981678576893], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.94399999999999, 70, 656, 98.0, 120.90000000000003, 139.64999999999992, 566.9300000000019, 0.2313396788264971, 0.12034859405045241, 68.40560678894047], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.32199999999992, 14, 451, 317.0, 412.0, 417.0, 436.95000000000005, 0.2325567333778912, 0.12961177080673467, 0.09742855333897982], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 474.0079999999996, 345, 657, 457.0, 580.0, 591.95, 610.99, 0.23254429503731872, 0.12506295773437673, 0.09901300062135834], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.377999999999997, 5, 324, 7.0, 10.0, 13.949999999999989, 26.99000000000001, 0.23111886026969722, 0.10420887595226748, 0.16769659490271976], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 438.83200000000045, 315, 575, 431.5, 527.0, 545.9, 567.0, 0.2325268835956469, 0.11960374497916325, 0.09355573832168605], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.989999999999993, 2, 18, 4.0, 5.0, 6.0, 14.960000000000036, 0.2314339089557517, 0.14209454384723696, 0.11571695447787585], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.521999999999998, 3, 34, 4.0, 5.0, 6.0, 11.990000000000009, 0.23143058818083986, 0.13553831839641747, 0.10916110751107974], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 756.0720000000002, 542, 1145, 707.5, 970.8000000000001, 1094.9, 1122.93, 0.23135445075065264, 0.21140690733583317, 0.10189536844584408], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 274.50199999999984, 189, 409, 269.0, 330.90000000000003, 340.0, 371.99, 0.23139556516515628, 0.2048912821200184, 0.09513430950637772], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.075999999999994, 3, 46, 5.0, 6.0, 7.0, 12.0, 0.23145040712126613, 0.1543100658649996, 0.10826635254988913], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1244.057999999998, 943, 10737, 1152.0, 1487.0, 1505.0, 1585.5200000000004, 0.2313543437009384, 0.1739021014551263, 0.12787749856907338], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.32399999999987, 144, 203, 177.0, 185.0, 187.0, 191.0, 0.23260292912216587, 4.497302674648747, 0.1172100697529664], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 225.36599999999984, 193, 323, 219.5, 250.0, 253.0, 259.99, 0.23258399422075293, 0.4507927530955767, 0.16626121461874135], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.971999999999999, 5, 21, 8.0, 10.0, 12.0, 16.99000000000001, 0.2325317498851293, 0.18977452021142716, 0.14351568938222825], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.928000000000016, 5, 19, 8.0, 10.0, 11.949999999999989, 15.0, 0.23253218245405166, 0.1934081885917386, 0.14714927170920458], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.182000000000004, 6, 24, 9.0, 11.0, 12.0, 18.0, 0.23252937078482383, 0.18818302232723766, 0.14192466478565907], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.286, 7, 25, 11.0, 14.0, 16.0, 20.0, 0.23253023590657493, 0.20793970929883765, 0.1616811796537904], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.595999999999998, 5, 42, 8.0, 11.0, 12.0, 37.81000000000017, 0.23250871791437822, 0.17454275053511883, 0.12828850158361688], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2054.8879999999995, 1635, 2741, 2008.0, 2502.6000000000004, 2631.7, 2713.9700000000003, 0.23233239889242496, 0.19414956743773143, 0.14793039460728621], "isController": false}]}, function(index, item){
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
