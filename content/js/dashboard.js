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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926824079982982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.201, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.645, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.985, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.129, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.53175920017134, 1, 18034, 9.0, 838.0, 1498.0, 6083.990000000002, 15.236698760644783, 95.97990370672159, 126.08498250704791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6227.525999999997, 5022, 18034, 6061.5, 6678.500000000001, 6929.349999999999, 15338.260000000071, 0.3286295490545328, 0.19085867101388787, 0.16559848370326066], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3060000000000014, 1, 7, 2.0, 3.0, 3.0, 6.0, 0.3297178670155521, 0.16927341784057218, 0.1191363386677288], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.724000000000002, 2, 20, 4.0, 5.0, 5.0, 9.980000000000018, 0.3297156927524534, 0.18923555643314882, 0.13909880787994128], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.459999999999994, 8, 374, 12.0, 16.0, 18.94999999999999, 49.87000000000012, 0.3276153533659201, 0.17043356923003838, 3.604728697630686], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.341999999999956, 24, 58, 33.0, 39.0, 41.0, 42.0, 0.3296598240275859, 1.3710210831880083, 0.1371436377302262], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2959999999999985, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.32966830094232386, 0.20594932499591212, 0.13940075616018188], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.292, 21, 52, 29.0, 35.0, 36.0, 39.99000000000001, 0.32965808522716405, 1.3529856751611864, 0.1197586012739307], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 850.7019999999992, 666, 1129, 851.0, 1015.8000000000001, 1052.95, 1079.99, 0.32951209144619564, 1.3935754976044472, 0.16025099759785685], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.64, 3, 25, 5.0, 7.0, 8.0, 12.0, 0.32964265417716576, 0.49018570892784386, 0.16836241028775165], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8820000000000006, 2, 25, 4.0, 5.0, 5.0, 10.970000000000027, 0.327841335284645, 0.3162228176503874, 0.17928823023379023], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.702000000000005, 5, 20, 7.0, 9.0, 11.0, 13.0, 0.32966482318097545, 0.537221667080396, 0.2153767253008521], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.8919942010309279, 2438.7423485824743], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.049999999999999, 2, 21, 4.0, 5.0, 6.0, 10.990000000000009, 0.3278456345386687, 0.3293535963928456, 0.1924172132399804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.9520000000000035, 5, 19, 8.0, 10.0, 11.0, 14.980000000000018, 0.3296639537521032, 0.5179040029692833, 0.19605990999514736], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.572000000000005, 4, 13, 6.0, 8.0, 8.949999999999989, 11.0, 0.32966373639560176, 0.510177167679174, 0.18833328690569048], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1562.496, 1326, 1929, 1536.0, 1770.0, 1816.85, 1882.94, 0.3293480029325146, 0.5029343414703149, 0.18139870474017405], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.11800000000001, 7, 89, 11.0, 14.0, 19.94999999999999, 51.88000000000011, 0.32759903974169474, 0.1704250824812482, 2.6412672579174132], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.026000000000003, 8, 23, 11.0, 13.0, 14.0, 19.0, 0.3296641711088914, 0.59677907287721, 0.2749347677021418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.758000000000001, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.32966438846596613, 0.5581469208274709, 0.23630240345119055], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.823206018518518, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.091452205882353, 4499.866727941177], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3080000000000003, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.3278411203249037, 0.2755626276121561, 0.13862812998113602], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.3500000000004, 439, 695, 540.0, 639.0, 655.0, 674.97, 0.32773883147997024, 0.2885990055994179, 0.1517072325405331], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2279999999999998, 1, 10, 3.0, 4.0, 5.0, 8.990000000000009, 0.3278452046081922, 0.2970168698897129, 0.16008066631259385], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 755.656000000001, 623, 934, 736.0, 873.9000000000001, 898.0, 920.98, 0.32770059700494764, 0.31000668488736605, 0.17313088181609051], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.425999999999974, 16, 744, 22.0, 26.0, 30.94999999999999, 71.0, 0.327440924745562, 0.17034282716914878, 14.93629452623555], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.96000000000002, 21, 229, 29.0, 35.0, 39.0, 86.97000000000003, 0.32775344026398573, 74.12819722968862, 0.10114266320646434], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.2456391033254157, 0.9742428741092637], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.708, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3296622149081166, 0.3582211358890726, 0.14132979721158512], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3960000000000012, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.3296606934346754, 0.33825955781127715, 0.12136922014147718], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8299999999999996, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.32971851930007356, 0.1869832434987751, 0.12783032437707928], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.68600000000004, 65, 127, 92.0, 113.0, 116.0, 119.0, 0.32969590827596074, 0.30030338926569466, 0.10753753258219814], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.57000000000002, 58, 368, 80.0, 92.0, 100.89999999999998, 322.5400000000004, 0.3276793356235934, 0.17046685437504341, 96.89260354830844], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.16599999999997, 12, 353, 262.0, 336.0, 340.0, 344.0, 0.3296567811388851, 0.18372892730837215, 0.1381081631919743], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 411.19999999999993, 317, 531, 397.0, 483.0, 495.0, 508.99, 0.3296000632832122, 0.17725981528388454, 0.14033752694480517], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.498000000000003, 4, 311, 6.0, 8.0, 11.0, 28.0, 0.32737724990014994, 0.1476106934095686, 0.23754032878497208], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.79200000000054, 268, 488, 394.0, 453.90000000000003, 464.0, 483.0, 0.3295968042293862, 0.1695331374566992, 0.1326112142016671], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.448, 2, 15, 3.0, 4.900000000000034, 5.0, 10.0, 0.32783897074299456, 0.20128480399983217, 0.1639194853714973], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.164000000000001, 2, 34, 4.0, 5.0, 6.0, 9.0, 0.32783209227030935, 0.19199627349162815, 0.15463173883453069], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.5880000000003, 522, 858, 671.5, 794.0, 832.95, 846.99, 0.32767396702420265, 0.2994216871916179, 0.14431734289835488], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.0499999999999, 171, 311, 234.0, 282.0, 288.0, 298.98, 0.327754944183333, 0.29021356000045884, 0.13475081201287423], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.557999999999999, 3, 56, 4.0, 5.0, 6.0, 14.990000000000009, 0.32784864408357783, 0.218579636525683, 0.15335888722268923], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.7979999999995, 821, 8984, 943.0, 1093.0, 1116.9, 1236.97, 0.3276696722713472, 0.2462994369570104, 0.18111429150935793], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.83000000000013, 118, 161, 135.0, 149.0, 150.0, 152.0, 0.32968786471720035, 6.374408617241291, 0.16613177558015174], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.03399999999985, 160, 227, 172.5, 202.0, 203.0, 208.0, 0.3296633016834586, 0.6389512221525168, 0.23565775081278487], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.0859999999999985, 5, 17, 7.0, 9.0, 9.949999999999989, 14.0, 0.32963895963307227, 0.2690259521044481, 0.2034490453985368], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.968000000000005, 5, 26, 7.0, 8.0, 10.0, 15.990000000000009, 0.32964135021097046, 0.2741785492072126, 0.20860116693037975], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.367999999999997, 6, 21, 8.0, 10.0, 11.0, 15.980000000000018, 0.3296337439471004, 0.26676833979140774, 0.20119247067083762], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.846000000000004, 7, 31, 10.0, 12.0, 13.0, 18.0, 0.32963656908984706, 0.29477685808717174, 0.2292004269452843], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.9440000000000035, 5, 34, 8.0, 9.0, 11.0, 14.0, 0.32960788527536106, 0.24743445067385036, 0.18186372576228416], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.9959999999996, 1432, 1981, 1600.0, 1814.9, 1881.6999999999998, 1957.95, 0.3293011505123597, 0.27518192139153447, 0.2096722169277915], "isController": false}]}, function(index, item){
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
