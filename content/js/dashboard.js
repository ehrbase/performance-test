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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8727930227611147, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.763, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.794, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 462.9061901723038, 1, 19447, 11.0, 1008.0, 1874.9000000000015, 10398.960000000006, 10.704248956102333, 67.42885668471354, 88.57857358624673], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10511.866, 8911, 19447, 10363.5, 11146.9, 11547.75, 18451.11000000005, 0.2304029609545318, 0.13383756997337926, 0.11610149204349456], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.855999999999999, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.23133004597915993, 0.1187622250700236, 0.08358605176981364], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.114, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.2313289757123082, 0.1327679221834772, 0.09759191162863001], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.991999999999994, 9, 450, 14.0, 18.0, 20.0, 78.91000000000008, 0.23007662932216205, 0.11969152461543843, 2.53151697516875], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.65600000000003, 24, 57, 42.0, 51.900000000000034, 53.0, 55.0, 0.23127194481666377, 0.9618360782325921, 0.0962127426678699], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5300000000000025, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.23127782850471484, 0.14448314421167102, 0.0977961911548257], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.85800000000002, 21, 59, 37.0, 45.0, 47.0, 49.99000000000001, 0.2312700193110466, 0.9491804910729773, 0.08401606170284115], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1027.8740000000007, 748, 1447, 1008.0, 1267.0, 1390.9, 1431.97, 0.23119890504198573, 0.9777884863812285, 0.11243852999112197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.8039999999999985, 4, 28, 6.0, 9.0, 10.0, 15.0, 0.23125729038607942, 0.3438845592224482, 0.11811285436710892], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.434000000000001, 2, 22, 4.0, 5.0, 6.0, 11.990000000000009, 0.2301932518387837, 0.22203532888055177, 0.1258869345993348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.223999999999984, 6, 24, 9.0, 12.0, 13.0, 18.0, 0.23126820080740354, 0.3768745696966038, 0.1510922132228056], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.8793032266260162, 2404.04479484248], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.008000000000004, 3, 18, 5.0, 6.0, 7.0, 12.990000000000009, 0.23019515945618696, 0.23125396726970124, 0.13510477620426598], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.420000000000009, 6, 32, 9.0, 12.0, 13.0, 17.0, 0.23126734505087881, 0.3633223541570305, 0.13754083314061055], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.461999999999998, 5, 17, 7.0, 9.0, 10.0, 15.990000000000009, 0.23126638233235847, 0.35790053588467946, 0.13211995475041963], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2044.9559999999997, 1611, 2643, 2005.5, 2406.9, 2539.75, 2617.91, 0.23107624221966294, 0.3528674128137784, 0.12727246153504873], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.183999999999989, 9, 76, 13.0, 17.0, 20.0, 44.0, 0.23007154764988816, 0.11968888100446476, 1.8549518529272233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.730000000000004, 9, 27, 14.0, 17.0, 18.0, 23.99000000000001, 0.2312700193110466, 0.4186597143526174, 0.19287558251136114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.270000000000005, 6, 21, 9.0, 12.0, 13.0, 16.99000000000001, 0.23126948445406526, 0.3915568534109936, 0.16577324373953506], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.575994318181818, 2479.6875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.8802033918406071, 3628.924780597723], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8420000000000027, 2, 22, 3.0, 4.0, 4.0, 8.0, 0.2301894366988257, 0.19348276373149048, 0.09733596297909329], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 692.3920000000005, 542, 894, 675.0, 830.0, 847.95, 873.99, 0.230131483321681, 0.2026483006113213, 0.10652570614695], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7439999999999976, 2, 14, 4.0, 5.0, 5.0, 10.0, 0.23018858890711982, 0.2085432185693595, 0.1123967719273046], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 953.8100000000003, 744, 1217, 919.5, 1147.0, 1168.9, 1196.98, 0.23010394715708873, 0.21767968227592133, 0.12156858926951661], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.315104166666667, 877.9557291666667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.87200000000002, 20, 1657, 27.0, 32.0, 35.94999999999999, 100.94000000000005, 0.22989731866159296, 0.11959824279708711, 10.486820072932625], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.41399999999999, 25, 313, 37.0, 44.0, 51.0, 129.8900000000001, 0.23014440640924555, 52.0519019903291, 0.07102112541535312], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 1.1653645833333333, 0.9114583333333333], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2240000000000006, 2, 9, 3.0, 4.0, 4.949999999999989, 6.990000000000009, 0.2313036132862646, 0.2513416440817964, 0.09916238889909194], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9399999999999955, 2, 10, 4.0, 5.0, 6.0, 8.0, 0.23130297127170837, 0.23733627436025068, 0.08515744157171294], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1720000000000015, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.2313307951718487, 0.13118760357836354, 0.08968586492502337], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.79200000000003, 88, 167, 126.0, 152.0, 156.0, 161.98000000000002, 0.23131977182617708, 0.2106975238085875, 0.07545000370111635], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.71600000000001, 69, 470, 98.0, 115.90000000000003, 126.94999999999999, 397.27000000000066, 0.23011400768396695, 0.11971096975910746, 68.04318397131675], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 253.05800000000005, 15, 450, 316.5, 417.0, 425.95, 439.98, 0.23129997525090265, 0.12891133679242445, 0.09690204041273166], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 500.29200000000003, 375, 645, 487.0, 598.0, 607.95, 635.0, 0.23128039602604772, 0.12438322939014133, 0.09847485612046562], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.408000000000005, 5, 281, 7.0, 9.0, 13.0, 28.0, 0.2298695214622276, 0.10364556323664562, 0.1667900922328468], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 465.598, 336, 603, 475.0, 551.0, 562.95, 573.99, 0.23126852171773304, 0.11895648737690155, 0.09304944428486916], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.080000000000001, 2, 14, 4.0, 5.0, 6.0, 10.0, 0.23018827098684014, 0.1413297537618518, 0.11509413549342006], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.638000000000003, 3, 30, 4.0, 6.0, 6.0, 12.0, 0.23018540974384047, 0.13480907429441266, 0.10857378213503413], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 769.8259999999995, 542, 1148, 730.0, 975.9000000000001, 1089.9, 1126.99, 0.23011390177910263, 0.2102733193688712, 0.10134899384997587], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 276.53200000000004, 192, 395, 265.0, 341.90000000000003, 350.0, 368.99, 0.2301502328660056, 0.20378859144720307, 0.09462231253573082], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.236000000000005, 3, 59, 5.0, 6.0, 7.0, 11.990000000000009, 0.23019643121868752, 0.1534740288645607, 0.10767977593139778], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1253.6899999999998, 964, 10711, 1166.0, 1489.9, 1511.0, 1599.5800000000004, 0.2300993937341174, 0.17295879331160888, 0.1271838445835063], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.81199999999995, 144, 195, 169.0, 185.0, 186.0, 190.0, 0.23133207951346238, 4.472731207015608, 0.11656968069233065], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.14400000000006, 197, 300, 222.0, 252.0, 254.95, 263.99, 0.23131570522606948, 0.4483345637883129, 0.1653545861576981], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.294000000000006, 5, 25, 8.0, 11.0, 12.0, 16.0, 0.2312556859991795, 0.18873309506481867, 0.14272811870261862], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.197999999999995, 5, 19, 8.0, 10.0, 11.0, 14.990000000000009, 0.23125622079233932, 0.19234690997172202, 0.14634182722015224], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.54, 6, 23, 10.0, 12.0, 13.0, 19.99000000000001, 0.231252477292163, 0.1871496488835824, 0.14114531084726745], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.651999999999992, 7, 31, 11.0, 14.0, 15.0, 21.99000000000001, 0.23125354685127483, 0.20679803260466884, 0.16079348179502703], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.659999999999991, 5, 33, 8.5, 10.0, 12.0, 18.970000000000027, 0.23123814615453275, 0.17358894075239342, 0.12758745368878027], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2053.2079999999983, 1686, 2749, 1979.0, 2524.9, 2647.7, 2713.99, 0.23105734150044016, 0.19308406024935706, 0.14711854165848337], "isController": false}]}, function(index, item){
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
