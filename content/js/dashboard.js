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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8887470750904063, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.17, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.559, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.935, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.114, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.9271218889595, 1, 18345, 9.0, 844.0, 1511.0, 6076.970000000005, 15.078636000892978, 94.98422552873056, 124.7769996814113], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6211.2480000000005, 5163, 18345, 6059.0, 6510.6, 6686.85, 16259.530000000079, 0.3252244048393391, 0.18888106035351893, 0.16388261025107323], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4419999999999997, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3262932305901209, 0.1675152482944653, 0.11789892120932102], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6120000000000005, 2, 15, 3.0, 5.0, 5.0, 7.990000000000009, 0.3262908883269435, 0.18726993943225387, 0.13765396851292927], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.719999999999997, 8, 358, 12.0, 16.0, 22.94999999999999, 58.850000000000136, 0.32419093289831236, 0.1686521014299414, 3.5670500400051615], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.64600000000004, 24, 47, 33.0, 40.0, 41.94999999999999, 43.99000000000001, 0.32620978159602704, 1.3566727138484533, 0.13570836617178467], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3039999999999994, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.326217869170976, 0.20379378231187995, 0.13794173569436777], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.726, 21, 42, 30.0, 35.0, 36.0, 39.0, 0.3262099944218091, 1.3388339898989075, 0.11850597453604783], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.078, 687, 1096, 867.5, 1029.0, 1065.0, 1085.99, 0.326073417386365, 1.3790326263762744, 0.15857867368985332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.7099999999999955, 4, 17, 5.0, 8.0, 9.0, 12.980000000000018, 0.3261453081714403, 0.48498508027903686, 0.16657616813834303], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8359999999999994, 2, 15, 4.0, 5.0, 5.0, 11.0, 0.32440063738237235, 0.3129040562001396, 0.17740659856848487], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.033999999999997, 5, 17, 8.0, 10.0, 12.0, 14.0, 0.3262133996720903, 0.5315972286785291, 0.2131218402154574], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.013155005854801, 2770.000091481265], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.187999999999996, 3, 19, 4.0, 5.0, 7.0, 11.0, 0.32440253163735694, 0.3258946565631498, 0.1903964077285659], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.39000000000001, 6, 24, 8.0, 10.0, 12.0, 15.0, 0.3262121226949036, 0.51248115615285, 0.19400701437616827], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.637999999999996, 4, 15, 6.0, 8.0, 9.0, 13.0, 0.3262121226949036, 0.5048355595271882, 0.18636141775050646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.316000000002, 1273, 1951, 1566.0, 1771.0, 1824.6999999999998, 1919.99, 0.3258774739803131, 0.4976346336306205, 0.17948720246571934], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.012000000000008, 7, 73, 11.0, 16.0, 19.0, 36.98000000000002, 0.3241816843831957, 0.16864729012477753, 2.6137148303395152], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.251999999999995, 8, 25, 11.0, 14.0, 15.0, 20.0, 0.32621403816443273, 0.5905334225447174, 0.27205741073479056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.093999999999992, 6, 17, 8.0, 10.0, 11.949999999999989, 15.0, 0.32621403816443273, 0.5523052149473229, 0.2338292031373961], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.43359375, 2727.65625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 1.1313833841463414, 4664.49599847561], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.346, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3243941128956392, 0.27266528995156797, 0.13717055750372242], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 572.9899999999999, 449, 755, 560.0, 664.9000000000001, 679.0, 707.95, 0.3242979597766754, 0.2855690559670176, 0.15011448528725016], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.324000000000001, 2, 20, 3.0, 4.0, 5.0, 8.990000000000009, 0.3243934815076252, 0.29388972336859276, 0.15839525464239512], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.3139999999996, 611, 957, 753.5, 896.0, 908.95, 939.94, 0.3242672532877457, 0.30675872161364465, 0.17131697659049844], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.286658653846153, 1013.0258413461538], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.145999999999987, 17, 1256, 23.0, 28.0, 35.0, 59.99000000000001, 0.32391958242878793, 0.1685109382379293, 14.77566767114129], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.004000000000023, 21, 254, 29.0, 35.0, 40.0, 104.98000000000002, 0.3242990114717532, 73.34690694446606, 0.10007664807136135], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 1.194565062642369, 0.9342966970387244], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.722, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3262438372539143, 0.3545066212410185, 0.139864301322723], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.436, 2, 29, 3.0, 4.0, 5.0, 8.0, 0.3262427729069732, 0.3347524842979353, 0.12011086463469617], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8759999999999997, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.32629429526631815, 0.18504136738681995, 0.1265027687702425], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.97000000000003, 67, 125, 92.0, 111.0, 115.0, 117.0, 0.32627215143204114, 0.2971848616818155, 0.10642079939287279], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.01799999999994, 60, 329, 82.0, 94.0, 103.94999999999999, 256.96000000000004, 0.32425043028032097, 0.16868305343225565, 95.87869900837734], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.608, 12, 361, 262.0, 333.0, 336.95, 344.97, 0.32623830272565574, 0.18182369311382715, 0.13667600768486945], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 429.70799999999986, 343, 552, 411.0, 506.0, 516.0, 533.0, 0.3262076533534799, 0.17543536794755363, 0.13889310240441136], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.428000000000002, 4, 249, 6.0, 8.0, 13.0, 31.970000000000027, 0.3238706952726538, 0.1460296276507197, 0.23499602205818532], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 404.1359999999999, 276, 503, 397.0, 470.0, 481.95, 498.99, 0.326186372455257, 0.16777892991787932, 0.13123904829254482], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6239999999999997, 2, 15, 3.0, 4.0, 5.0, 11.990000000000009, 0.324392008278484, 0.199168456567154, 0.162196004139242], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.164, 2, 34, 4.0, 5.0, 6.0, 9.0, 0.32438527368709924, 0.18997762937782256, 0.15300594452233296], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 680.8660000000001, 519, 879, 686.0, 806.4000000000002, 840.8499999999999, 864.97, 0.3242273014950769, 0.29627219558785006, 0.14279932907644502], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 251.11199999999985, 173, 325, 243.5, 293.0, 299.0, 312.98, 0.3243082666825794, 0.2871616684411734, 0.1333337697982089], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.5260000000000025, 3, 42, 4.0, 5.0, 6.0, 10.990000000000009, 0.324405267822501, 0.21628390663583952, 0.15174816727243945], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.3739999999995, 784, 8793, 932.0, 1092.9, 1115.95, 1137.99, 0.32424916862513165, 0.2437283472484864, 0.17922366156428177], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.30800000000008, 117, 168, 136.5, 151.0, 153.0, 157.99, 0.32628641682698206, 6.30864271845365, 0.16441776472922143], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.012, 160, 245, 180.0, 204.0, 207.0, 214.0, 0.3262591646199342, 0.6323533463015915, 0.2332243247087811], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.152000000000001, 5, 21, 7.0, 9.0, 10.0, 14.990000000000009, 0.3261416916056347, 0.2661717510661572, 0.20129057528785266], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.161999999999999, 5, 24, 7.0, 9.0, 10.0, 15.0, 0.32614360624812877, 0.27126930749765016, 0.20638775082889396], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.430000000000007, 6, 20, 8.0, 10.0, 11.0, 16.0, 0.3261389260506076, 0.26394002871816313, 0.19905940310706033], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.958000000000006, 7, 22, 10.0, 12.0, 14.0, 17.0, 0.32614062792507376, 0.2916506195285833, 0.22676965535415286], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.900000000000001, 5, 36, 8.0, 9.0, 10.0, 15.990000000000009, 0.3261053176689731, 0.24480509643097295, 0.1799311567216502], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.2020000000014, 1407, 1996, 1598.0, 1813.9, 1890.85, 1947.99, 0.32581313183311594, 0.27226714359464416, 0.20745133003436675], "isController": false}]}, function(index, item){
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
