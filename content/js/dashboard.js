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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9099295614633038, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.974, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.786, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.694, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.588, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 201.7882299477401, 1, 3516, 13.0, 611.9000000000015, 1301.0, 2261.980000000003, 24.40395786615918, 164.07443061590467, 214.9704229028178], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.604000000000003, 4, 43, 8.0, 12.0, 14.0, 30.980000000000018, 0.5645061136012104, 6.035651956931006, 0.2039719355785623], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.7979999999999965, 5, 33, 7.0, 10.0, 11.0, 19.0, 0.5644901806933068, 6.061014861615233, 0.23814429497998882], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.364000000000015, 13, 246, 20.0, 29.0, 36.94999999999999, 69.96000000000004, 0.5610356268843784, 0.30234560580065956, 6.245904439923744], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.648, 25, 92, 43.0, 51.0, 53.0, 73.96000000000004, 0.5643621127911544, 2.3472834359155534, 0.2347834570791326], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4419999999999997, 1, 26, 2.0, 3.0, 4.0, 7.0, 0.5644079811803803, 0.35275498823773765, 0.2386607967295944], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.22799999999998, 22, 67, 37.0, 45.0, 46.0, 54.0, 0.5643602017700593, 2.315772724810065, 0.20502147954927938], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 777.5880000000001, 578, 1338, 777.5, 921.0, 944.95, 1004.7500000000002, 0.5640444241388453, 2.385621485298182, 0.2743106672081493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.966000000000005, 5, 25, 9.0, 12.0, 13.0, 18.99000000000001, 0.5641417936549844, 0.839050734117716, 0.28813101375152034], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.704, 2, 43, 3.0, 5.0, 6.0, 14.970000000000027, 0.5618198468479098, 0.542068367857163, 0.30724522874495064], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.56, 8, 33, 14.0, 17.0, 19.0, 28.0, 0.564358927763186, 0.9198389164421459, 0.36870715104840956], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.7370601252158895, 2042.8152660837652], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.825999999999998, 3, 70, 4.0, 6.0, 8.0, 12.0, 0.5618387859787513, 0.5639456814261716, 0.32975108434885697], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.503999999999998, 9, 30, 15.0, 18.0, 20.0, 24.99000000000001, 0.5643480989369939, 0.8861146947215394, 0.33563280493420833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.687999999999995, 5, 30, 9.0, 11.0, 13.0, 17.99000000000001, 0.5643474619601594, 0.8735261007879419, 0.32240553246747383], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1999.7100000000012, 1470, 2851, 1982.0, 2271.0000000000005, 2355.8, 2571.84, 0.5632203588389549, 0.8602310949454353, 0.3102112132667682], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.033999999999992, 12, 81, 17.0, 25.900000000000034, 33.0, 50.0, 0.5609965992386154, 0.3029600775185101, 4.523035081361337], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.048, 11, 81, 18.0, 22.0, 25.0, 28.99000000000001, 0.5643691199792312, 1.021816746524897, 0.4706750277951791], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.409999999999997, 8, 60, 14.0, 17.0, 19.0, 24.0, 0.5643672089106809, 0.9556765041514852, 0.4045366516996483], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 5.118904532967033, 1498.7122252747254], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.6785300925925926, 2833.249421296296], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.372000000000003, 1, 21, 2.0, 3.0, 5.0, 9.0, 0.5617422097590351, 0.4723242603540324, 0.23753357111881074], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.4719999999999, 314, 762, 415.5, 490.90000000000003, 501.95, 570.9100000000001, 0.5615125801278452, 0.49397753191637506, 0.25991890916074084], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.342, 1, 31, 3.0, 4.0, 6.0, 14.990000000000009, 0.5617857596298507, 0.5091183446645521, 0.274309452944263], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1174.9540000000004, 926, 1896, 1178.0, 1356.9, 1389.9, 1437.99, 0.5612094287673708, 0.5310663442144359, 0.29649834078432385], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.64600000000004, 28, 702, 43.0, 53.0, 61.0, 102.99000000000001, 0.5605626254959578, 0.30272571474537563, 25.64026587205046], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.46400000000002, 29, 181, 42.0, 51.0, 58.94999999999999, 100.8900000000001, 0.5613549761873219, 127.03232867867143, 0.17323063718280637], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.7776747881355932, 1.3903601694915255], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.541999999999999, 1, 19, 2.0, 4.0, 5.0, 8.0, 0.564644449036886, 0.6137199919707559, 0.24206925110077435], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5079999999999982, 2, 30, 3.0, 5.0, 7.0, 12.980000000000018, 0.5646374350102313, 0.5795253361286651, 0.20787921191294645], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.188000000000001, 1, 16, 2.0, 3.0, 4.0, 6.990000000000009, 0.5645245969012116, 0.3203015535152382, 0.21886354000955174], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.04799999999993, 84, 364, 122.0, 148.0, 155.0, 178.97000000000003, 0.5644589548026425, 0.5142970750301421, 0.18411063564851818], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 171.11399999999998, 116, 589, 171.0, 204.90000000000003, 247.84999999999997, 351.9200000000001, 0.5611174766771521, 0.30302535605709485, 165.98885136727498], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.436000000000001, 1, 16, 2.0, 4.0, 5.0, 9.0, 0.5646329716294517, 0.3142094263216082, 0.2365503367471043], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 478.122, 359, 1325, 487.0, 548.0, 563.0, 650.9300000000001, 0.5644207237228288, 0.6133886310426883, 0.242524529724653], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.288, 7, 305, 10.0, 17.900000000000034, 24.0, 72.93000000000006, 0.5603986451802354, 0.23696544273734566, 0.406617376336831], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.0919999999999987, 1, 16, 3.0, 4.0, 5.0, 9.0, 0.5646463619834897, 0.6010395845332068, 0.22938758455579272], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8840000000000026, 2, 24, 4.0, 5.0, 6.0, 12.990000000000009, 0.5617340054667953, 0.34504950140489676, 0.28086700273339765], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.175999999999998, 2, 31, 4.0, 5.0, 6.0, 10.990000000000009, 0.5617169665486312, 0.3291310350870886, 0.2649504832451063], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.7220000000003, 383, 1199, 540.5, 638.9000000000001, 659.0, 790.6500000000003, 0.5612415561207882, 0.5123740784413648, 0.24718744317429245], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.995999999999977, 6, 127, 16.0, 34.0, 38.0, 47.0, 0.5614621372393132, 0.4973107016367744, 0.2308355075954598], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.5120000000000005, 4, 43, 7.0, 9.0, 10.0, 15.990000000000009, 0.561878562310085, 0.3747686113845587, 0.2628318665493464], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 560.7040000000004, 365, 3516, 541.5, 632.9000000000001, 664.95, 906.2000000000007, 0.5616759511701395, 0.42235398671973384, 0.3104576058225576], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.713999999999997, 8, 41, 14.0, 16.0, 18.0, 29.970000000000027, 0.564123335413068, 0.4605538168020751, 0.34816987107525293], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.33400000000001, 8, 46, 14.0, 16.0, 18.0, 25.99000000000001, 0.5641297001876295, 0.46873448643324483, 0.3569883258999843], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.40000000000001, 8, 33, 14.0, 17.0, 18.94999999999999, 24.0, 0.5641042419510786, 0.45668204743891033, 0.3443019054877189], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.487999999999996, 10, 49, 17.0, 20.0, 22.0, 32.99000000000001, 0.5641137885205101, 0.5046174123874875, 0.39223536858066715], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.45, 8, 69, 14.0, 16.0, 18.0, 33.98000000000002, 0.563898114888602, 0.4234742679192724, 0.3111351903438087], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2190.22, 1661, 3308, 2173.0, 2501.9, 2619.7499999999995, 2781.5400000000004, 0.5628652995794271, 0.4698825905199975, 0.3583868899665883], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
