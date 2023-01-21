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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8716868751329504, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.823, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.84, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.0997660072348, 1, 25415, 12.0, 1022.0, 1796.9000000000015, 10551.0, 10.135257501513497, 63.93408441377528, 83.97181810640791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11085.345999999994, 9059, 25415, 10628.5, 12744.800000000001, 13284.95, 23284.15000000008, 0.21816246122162253, 0.1267519638712056, 0.1103595262820317], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.052000000000002, 2, 14, 3.0, 4.0, 5.0, 9.0, 0.21896499625569857, 0.11241414861482744, 0.0795458775460155], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.556000000000005, 3, 21, 4.0, 5.0, 6.0, 12.0, 0.21896384556567558, 0.12560912320526285, 0.09280303610888985], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.164000000000005, 10, 452, 14.0, 19.0, 22.94999999999999, 38.0, 0.21768754870758902, 0.1279148192703549, 2.4238998343397755], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.65199999999999, 28, 81, 46.0, 55.0, 57.0, 63.98000000000002, 0.21890201376718546, 0.9103908154789554, 0.0914942010667533], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.697999999999997, 1, 22, 2.0, 3.900000000000034, 4.0, 8.0, 0.21890738072503, 0.13677991580055962, 0.09299288146033989], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.168, 24, 84, 40.0, 48.0, 50.94999999999999, 62.98000000000002, 0.2189003845641956, 0.8984129250115143, 0.07994994514356364], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1116.3999999999994, 769, 1633, 1110.5, 1446.5000000000002, 1498.95, 1581.9, 0.21883207570539426, 0.9255485545703735, 0.10685159946552454], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.7600000000000025, 4, 34, 6.0, 8.0, 9.0, 18.980000000000018, 0.21881263511680218, 0.32537908947139244, 0.11218421234015737], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.413999999999991, 3, 23, 4.0, 5.0, 6.0, 13.990000000000009, 0.21786093674974139, 0.21014006429403034, 0.11956820942710417], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.06800000000002, 6, 32, 10.0, 12.0, 13.0, 19.0, 0.2188991387194488, 0.3567799438698828, 0.14343879109448254], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.9057430820610687, 2257.236626312023], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.607999999999994, 3, 15, 4.0, 6.0, 6.0, 11.990000000000009, 0.21786236066068068, 0.21886444241723518, 0.12829199558436566], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.927999999999995, 8, 41, 17.0, 20.0, 20.0, 24.99000000000001, 0.21889798872150004, 0.34389002288687925, 0.13061198350472317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.730000000000007, 5, 19, 8.0, 9.0, 10.949999999999989, 14.0, 0.21889827621985442, 0.33876004619957567, 0.12548172670024857], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2192.1659999999997, 1587, 3567, 2134.0, 2778.9, 3026.9, 3355.71, 0.21866316339123826, 0.33391188986964176, 0.12086264695257896], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.846000000000009, 9, 83, 12.0, 17.0, 21.0, 46.930000000000064, 0.21768252570939473, 0.12791186771933583, 1.755490524715021], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.592000000000002, 9, 39, 14.0, 17.0, 19.0, 27.980000000000018, 0.21890067206884337, 0.39626793439524965, 0.18298728055754876], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.104, 6, 30, 10.0, 12.0, 13.0, 18.99000000000001, 0.21890019289484997, 0.37055270739042073, 0.1573345136431734], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.782907196969696, 2066.43584280303], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.7299558080808082, 2759.661345598846], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.728000000000001, 2, 16, 3.0, 3.0, 4.0, 8.0, 0.21784499021875994, 0.18316849275229719, 0.09254157299332087], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 684.7300000000008, 507, 1013, 652.0, 828.0, 858.95, 927.8500000000001, 0.2177927057738153, 0.19172138753772713, 0.10123957807454696], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7599999999999993, 2, 22, 3.0, 4.0, 6.0, 12.0, 0.21785998748612231, 0.19737391503002982, 0.106802454802767], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 946.0439999999999, 736, 1326, 927.0, 1129.9, 1151.9, 1212.99, 0.2177859704020155, 0.20602680408997698, 0.11548611516435], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.0633561643835625, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.492000000000004, 19, 579, 27.0, 34.0, 39.0, 88.8900000000001, 0.21762851943400915, 0.12788013323109146, 9.954804541297841], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.50999999999997, 26, 240, 34.0, 43.0, 47.94999999999999, 152.62000000000035, 0.21775467061993012, 49.27686548929257, 0.06762303247767362], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.5297111742424242, 0.41627209595959597], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.072000000000002, 2, 17, 3.0, 4.0, 4.0, 7.990000000000009, 0.2189310559832982, 0.2378352395477935, 0.09428573797718212], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7900000000000023, 2, 15, 4.0, 5.0, 5.0, 8.990000000000009, 0.218930001510617, 0.2246901695777059, 0.08102975641848031], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1120000000000005, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.21896566749713045, 0.1241753445041588, 0.0853196302064014], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.0139999999999, 89, 373, 198.0, 295.90000000000003, 311.0, 332.98, 0.21894658666650318, 0.19942741293917401, 0.07184184874994637], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.44200000000002, 80, 386, 109.0, 130.0, 152.95, 321.9000000000001, 0.21772072527128, 0.1279959732551861, 64.4062129874767], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 265.85999999999984, 18, 561, 315.5, 441.90000000000003, 472.9, 499.99, 0.21892568786451128, 0.12203952607514405, 0.0921454799507855], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 499.6819999999999, 293, 1059, 459.0, 799.9000000000001, 890.95, 947.9200000000001, 0.2189543528344298, 0.11775424965766486, 0.09365430326316429], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.359999999999985, 5, 298, 7.0, 10.0, 12.949999999999989, 34.99000000000001, 0.21760247335675317, 0.10236453851629058, 0.1583142994636534], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 502.0039999999999, 288, 1048, 450.0, 850.0, 899.0, 974.95, 0.21890325964465873, 0.11259622645257636, 0.08850190380164913], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.021999999999996, 2, 17, 4.0, 5.0, 6.0, 11.990000000000009, 0.21784385127016034, 0.13375059348834228, 0.1093474019070922], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.491999999999994, 3, 26, 4.0, 5.0, 6.0, 11.0, 0.21784166831863264, 0.12757990908922578, 0.10317696204544613], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 859.84, 587, 1377, 854.5, 1085.6000000000001, 1244.0, 1341.7800000000002, 0.21775078248743687, 0.19897615691535112, 0.09632920358086806], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.93999999999954, 247, 986, 384.0, 862.7, 895.0, 936.94, 0.2177524894553357, 0.19281089815824945, 0.08995049124961621], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.643999999999996, 3, 38, 5.0, 6.0, 8.0, 14.990000000000009, 0.21786330994498082, 0.14531312567619326, 0.1023361836753279], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1205.4599999999994, 902, 10380, 1120.5, 1424.0, 1458.85, 1652.3000000000006, 0.21778132228978767, 0.1636379931603598, 0.12080057720761661], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.41600000000005, 140, 300, 174.5, 189.0, 191.95, 254.86000000000013, 0.21901122563938136, 4.234561087678736, 0.11078888171992145], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.93800000000007, 197, 361, 226.5, 258.0, 263.95, 297.95000000000005, 0.2189963572145941, 0.42445728528064164, 0.15697590448780474], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.187999999999988, 6, 31, 9.0, 11.0, 13.0, 17.99000000000001, 0.218810719974793, 0.17863843935442086, 0.13547460592189334], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.033999999999999, 6, 25, 9.0, 11.0, 12.0, 20.0, 0.21881253935890552, 0.18193493384859308, 0.13889467830399274], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.137999999999996, 7, 31, 10.0, 12.0, 14.0, 19.980000000000018, 0.21880842184863358, 0.1770788352247863, 0.13397742236239576], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.304000000000011, 8, 39, 12.0, 14.0, 16.0, 25.99000000000001, 0.2188092836402863, 0.19566977453344392, 0.1525681919132465], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.644000000000007, 6, 31, 10.0, 12.0, 13.0, 25.99000000000001, 0.21876955252875727, 0.1642288503167783, 0.12113509402715367], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2000.9559999999997, 1610, 2798, 1940.5, 2472.0000000000005, 2579.95, 2730.7400000000002, 0.2186148823392842, 0.18268646578764539, 0.13962317680653502], "isController": false}]}, function(index, item){
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
