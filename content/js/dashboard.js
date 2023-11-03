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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8362263348223782, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.249, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.494, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.357, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.731, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.503, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.474, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.945, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.064, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 587.9222718570594, 2, 25002, 17.0, 1494.9000000000015, 2715.0, 11226.910000000014, 8.423701619264456, 53.063449293137474, 69.70684975756548], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11408.082000000002, 9217, 25002, 11200.5, 12217.8, 12727.4, 23602.400000000085, 0.18142524771803323, 0.10541799061741189, 0.09142131623291518], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 4.314000000000001, 2, 12, 4.0, 6.0, 7.0, 10.0, 0.1821348978478212, 0.09355757448042379, 0.06581046113641977], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 6.144, 4, 34, 6.0, 8.0, 9.0, 13.0, 0.1821329738271274, 0.10435721380444092, 0.07683734833331937], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 25.376000000000012, 15, 850, 22.0, 28.0, 34.94999999999999, 104.98000000000002, 0.18120012466568577, 0.09431608051446339, 1.993732231062775], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 63.06200000000005, 38, 123, 64.5, 76.0, 79.0, 93.97000000000003, 0.1820986800030884, 0.7573811309894076, 0.07575589617315982], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 4.275999999999999, 2, 24, 4.0, 6.0, 6.0, 10.990000000000009, 0.18210372045185033, 0.11381482528240644, 0.07700284273012811], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 55.058, 34, 121, 56.0, 68.0, 70.0, 80.98000000000002, 0.1820975525724739, 0.747345783062269, 0.06615262652046904], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1491.3919999999991, 1059, 2126, 1501.5, 1771.6000000000001, 1911.85, 1990.99, 0.18202834181282024, 0.7698874496009029, 0.08852550217068798], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.493999999999998, 6, 33, 10.0, 14.0, 15.0, 23.0, 0.18206705092524655, 0.27078917828042043, 0.09298932386123432], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 6.395999999999997, 4, 30, 6.0, 8.0, 9.0, 16.970000000000027, 0.18138806125547383, 0.17501113722696107, 0.09919659599908724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.386000000000003, 9, 52, 14.0, 18.0, 20.0, 28.0, 0.18209841472404079, 0.296799076342211, 0.11896859321326492], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.5707350758575198, 1560.4090225098944], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 7.544, 5, 58, 7.0, 9.0, 11.0, 20.970000000000027, 0.18138924572184395, 0.18227493539822012, 0.10645989910041817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.281999999999991, 9, 41, 14.0, 18.0, 20.0, 25.0, 0.18209808312631817, 0.28612872631859954, 0.10829856701555444], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.206000000000001, 7, 36, 11.0, 14.0, 16.0, 22.99000000000001, 0.18209675674750428, 0.28185874945780687, 0.10402988544657225], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2821.959999999998, 2313, 3877, 2764.0, 3229.9, 3364.85, 3720.9300000000003, 0.18191410016190354, 0.27779384527750994, 0.10019487547979843], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 22.468000000000007, 14, 160, 20.0, 27.0, 32.94999999999999, 100.0, 0.18119526544019213, 0.09431355124963126, 1.4608868276115492], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 20.812000000000005, 13, 47, 21.0, 25.0, 28.0, 37.0, 0.1820993432040889, 0.3296993967777157, 0.1518680069299726], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.670000000000002, 9, 64, 14.0, 18.0, 21.0, 32.99000000000001, 0.18209894528290893, 0.30812172961675455, 0.1305279549195851], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.359996448863637, 1549.8046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.5650026644336176, 2329.407258678441], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 4.5479999999999965, 2, 67, 4.0, 5.900000000000034, 7.0, 15.0, 0.18137812550785873, 0.15250641217018202, 0.07669602377431918], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 1011.6700000000002, 792, 2025, 991.5, 1175.6000000000001, 1240.75, 1505.95, 0.18132866037286974, 0.15944774509197715, 0.08393533693041041], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 5.391999999999996, 3, 21, 5.0, 7.0, 8.0, 16.960000000000036, 0.18138635038691522, 0.16438138003814193, 0.08856755389986094], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1395.4560000000001, 1133, 2339, 1376.0, 1606.0, 1669.95, 1969.7000000000003, 0.18130314901813468, 0.17156518691266845, 0.09578613634649498], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 4.59837682038835, 639.2881523058253], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 46.33199999999998, 29, 1961, 40.0, 49.900000000000034, 56.0, 217.7800000000002, 0.18106744327700205, 0.09424701881508016, 8.259433862762465], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 59.19200000000001, 36, 581, 54.0, 68.0, 77.94999999999999, 197.91000000000008, 0.18131649555828983, 41.00822714532771, 0.055953137301190996], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.7173926983584131, 0.5610892612859097], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.9, 3, 13, 5.0, 6.0, 7.0, 11.0, 0.1820856822386342, 0.19768459277447595, 0.07806212353785197], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 5.8980000000000015, 3, 18, 6.0, 8.0, 9.0, 13.0, 0.18208508544706806, 0.18688615703600442, 0.0670371847788522], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 3.385999999999996, 2, 17, 3.0, 5.0, 5.0, 10.990000000000009, 0.1821353622726996, 0.10326826027671462, 0.070613026193615], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 175.28199999999998, 123, 416, 172.0, 209.0, 219.95, 301.8000000000002, 0.18211625646194007, 0.16593209695213876, 0.059401200838171866], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 154.01, 103, 1069, 142.0, 167.0, 181.84999999999997, 1007.6400000000003, 0.18124905977050243, 0.09434155161882597, 53.59414336710003], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 407.1520000000003, 22, 980, 509.0, 628.0, 646.0, 750.8900000000001, 0.18208296355318151, 0.10153259002819008, 0.07628280406671374], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 718.8440000000002, 554, 1375, 702.0, 844.8000000000001, 869.95, 1029.97, 0.1820340410938207, 0.09787778400587023, 0.07750668155947835], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.643999999999998, 7, 500, 10.0, 15.900000000000034, 20.0, 46.90000000000009, 0.18103649913066272, 0.08167857675621698, 0.13135753794343985], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 676.84, 490, 1145, 683.5, 792.0, 816.0, 900.9300000000001, 0.18203854775471837, 0.09368585416673493, 0.07324207194818746], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 6.248000000000001, 3, 24, 6.0, 8.0, 10.0, 16.980000000000018, 0.18137687539154732, 0.11141216271609695, 0.09068843769577367], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 6.881999999999997, 3, 76, 6.0, 8.0, 10.0, 15.0, 0.1813721382650594, 0.10627273726468325, 0.08554955349807002], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 1120.3219999999994, 824, 1828, 1090.0, 1406.9, 1503.9, 1596.94, 0.18129519462583027, 0.165715138837673, 0.07984778591430611], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 425.8839999999994, 304, 790, 422.5, 502.0, 525.95, 608.98, 0.18132734517908614, 0.16060927937249134, 0.074549621406636], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.169999999999995, 5, 100, 8.0, 10.0, 12.0, 20.980000000000018, 0.18139253598737218, 0.12098740437438985, 0.08485061009565555], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1764.4799999999982, 1423, 11197, 1657.5, 1943.7, 2025.85, 3329.450000000007, 0.18130189993513018, 0.13606353484858208, 0.10021179234695672], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 257.8720000000002, 216, 441, 260.0, 287.90000000000003, 309.9, 357.93000000000006, 0.1820675813013681, 3.520269572447057, 0.0917449921401425], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 344.274, 288, 508, 344.0, 384.0, 402.95, 474.98, 0.1820558474517643, 0.3529109933513205, 0.13014148470184714], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.850000000000009, 8, 47, 13.0, 16.0, 18.0, 25.99000000000001, 0.182063006908927, 0.14863737673424116, 0.11236701207660336], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.849999999999998, 8, 64, 12.0, 16.0, 18.0, 26.99000000000001, 0.1820640676171382, 0.15124581264023484, 0.11521241778897026], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.903999999999982, 9, 42, 14.0, 17.0, 19.94999999999999, 27.0, 0.1820598248584485, 0.14739022930434942, 0.11112049857083038], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.320000000000004, 11, 61, 17.0, 21.0, 23.0, 30.99000000000001, 0.18206075294501475, 0.16285903290784523, 0.12658911728208058], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.452000000000007, 8, 120, 12.0, 16.0, 18.0, 113.13000000000079, 0.1820403372260839, 0.1367080266863853, 0.10044217825462638], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2945.2479999999996, 2423, 4210, 2882.0, 3371.5, 3502.6, 3916.95, 0.1818799548646704, 0.1520299729753669, 0.11580637751148937], "isController": false}]}, function(index, item){
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
