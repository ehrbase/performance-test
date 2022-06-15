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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9162463076573506, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.004, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.994, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.852, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.747, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.7656896159964, 1, 3813, 12.0, 574.0, 1267.0, 2167.0, 25.69035908128801, 172.7293261581822, 226.30211814485952], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.028000000000003, 4, 28, 7.0, 9.0, 11.0, 15.990000000000009, 0.5944985107812305, 6.362511165425156, 0.2148090322158743], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.442000000000001, 4, 34, 7.0, 9.0, 10.0, 18.970000000000027, 0.59447871944528, 6.383006253618889, 0.25079570976597754], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.99399999999999, 12, 240, 18.0, 25.0, 29.94999999999999, 51.930000000000064, 0.5906165209615709, 0.3182869344994466, 6.575222987267489], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.37599999999995, 26, 79, 45.0, 54.0, 56.0, 59.98000000000002, 0.5943282070544381, 2.471917806489113, 0.2472498205128815], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2459999999999978, 1, 16, 2.0, 3.0, 3.0, 6.990000000000009, 0.5943649448310458, 0.3714780905194036, 0.25132814561703404], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.425999999999924, 22, 90, 39.0, 48.0, 49.0, 52.0, 0.5943169040368381, 2.438695839900535, 0.2159041877946326], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 745.36, 568, 989, 745.5, 888.8000000000001, 904.0, 935.9000000000001, 0.5939681347975044, 2.5121835857499915, 0.28886340930581755], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.211999999999998, 5, 23, 8.0, 10.0, 11.949999999999989, 17.0, 0.594202485192474, 0.883760141550916, 0.30348427710514053], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.177999999999998, 1, 18, 3.0, 4.0, 5.0, 12.980000000000018, 0.5915738585878185, 0.5707763401218405, 0.3235169539152133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.530000000000005, 8, 37, 13.0, 16.0, 17.0, 29.930000000000064, 0.5943084270557722, 0.9686530905821132, 0.3882737672854606], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.7773366347905282, 2154.444515596539], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9920000000000004, 2, 23, 4.0, 5.0, 6.0, 9.0, 0.5915829576781552, 0.5938013937694483, 0.3472083569966516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.330000000000005, 9, 38, 14.0, 16.0, 17.0, 25.0, 0.5942971247905103, 0.9331393448468496, 0.35344428613029366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.10000000000001, 5, 53, 8.0, 10.0, 12.0, 16.99000000000001, 0.5942928865518651, 0.9198771730319396, 0.33951302600863387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1829.846000000001, 1480, 2248, 1822.0, 2099.0, 2161.7, 2226.9700000000003, 0.5931683613486751, 0.9059719894036403, 0.3267060115240749], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.795999999999985, 11, 122, 15.0, 21.0, 25.0, 37.99000000000001, 0.5905690841808984, 0.318930374562536, 4.761463241208493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.010000000000012, 11, 32, 18.0, 20.900000000000034, 22.0, 28.980000000000018, 0.5943211426180559, 1.0760462875135504, 0.4956545466756052], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.361999999999995, 8, 31, 13.0, 15.0, 17.0, 21.99000000000001, 0.5943176104628426, 1.0063932974048526, 0.4260050059372329], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.75101902173913, 1976.5624999999998], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.7993155541012217, 3337.5974858202444], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.054000000000001, 1, 26, 2.0, 2.0, 3.9499999999999886, 8.0, 0.5914828830768466, 0.49733082258707517, 0.25010946130104944], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 400.68599999999986, 305, 587, 404.5, 462.0, 473.95, 502.98, 0.5912821361841016, 0.5201666011328966, 0.2736989575695939], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9819999999999984, 1, 30, 3.0, 4.0, 5.0, 12.0, 0.5915507621540019, 0.5360928782020643, 0.2888431455830088], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1144.5960000000002, 910, 1475, 1143.0, 1319.0, 1351.0, 1407.8700000000001, 0.5909124752259944, 0.5591740122011608, 0.3121910635715459], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.087476325757575, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.27600000000001, 26, 679, 39.0, 46.0, 52.0, 80.96000000000004, 0.590102795907047, 0.3186785606802705, 26.991440190131122], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.529999999999994, 28, 176, 40.0, 47.0, 53.0, 79.95000000000005, 0.5909376170795153, 133.72675897752427, 0.1823596552706317], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.9494946561338289, 1.5247444237918215], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.937999999999999, 1, 10, 2.0, 3.0, 3.0, 7.0, 0.5945373904564858, 0.6462110503692077, 0.2548846820414036], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.93, 2, 11, 3.0, 4.0, 5.0, 9.980000000000018, 0.5945310279798193, 0.6102071390691308, 0.2188849585433514], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.978, 1, 16, 2.0, 3.0, 3.0, 6.0, 0.5945105275924226, 0.3373150552062476, 0.23048894477948415], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.52599999999995, 81, 214, 115.0, 141.0, 146.0, 152.0, 0.5944455012364467, 0.5416188014195359, 0.1938914037236066], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 158.68199999999987, 109, 617, 159.0, 183.0, 207.89999999999998, 305.97, 0.5907072301383555, 0.31900497877588924, 174.74204369047888], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.047999999999999, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.5945282002561227, 0.3308456539394033, 0.24907480264636392], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 449.44599999999997, 344, 584, 462.0, 519.9000000000001, 524.0, 546.99, 0.5943006567022256, 0.6458608816450242, 0.25536356342673755], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.053999999999991, 6, 291, 9.0, 14.0, 18.0, 40.92000000000007, 0.5899169043048597, 0.24944728473047287, 0.42803541005713935], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.697999999999999, 1, 18, 2.0, 3.0, 4.0, 9.0, 0.594540218267605, 0.6328601932731341, 0.24153196367121452], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4139999999999975, 2, 22, 3.0, 4.0, 5.0, 11.0, 0.5914751864329788, 0.3633182541663512, 0.29573759321648935], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.6360000000000006, 2, 33, 3.0, 4.900000000000034, 5.949999999999989, 9.990000000000009, 0.5914534969688008, 0.3465547833801567, 0.2789766006210262], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 512.7160000000005, 364, 812, 516.5, 620.0, 631.0, 648.98, 0.5908859389236658, 0.5394373155697263, 0.2602437094282942], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.869999999999992, 5, 120, 15.0, 24.0, 30.0, 50.99000000000001, 0.5910556727159245, 0.523522944485687, 0.24300238106777755], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.877999999999994, 4, 51, 7.0, 8.0, 9.0, 12.990000000000009, 0.5915962568521637, 0.3945900814746365, 0.2767330146798695], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 514.0640000000002, 333, 3813, 501.0, 567.8000000000001, 588.0, 647.98, 0.5913968320054503, 0.4447026959415984, 0.3268853583155126], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.562000000000008, 8, 27, 13.0, 15.0, 16.0, 19.0, 0.5941848318872855, 0.4850962104079792, 0.366723450930434], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.446000000000007, 8, 33, 13.0, 15.0, 16.0, 22.99000000000001, 0.5941918930834876, 0.4937131155382368, 0.3760120573418944], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.392000000000001, 8, 48, 13.0, 15.0, 16.0, 21.970000000000027, 0.5941643553673244, 0.48101782285108574, 0.3626491426802516], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.146000000000017, 10, 31, 16.0, 18.0, 19.0, 22.99000000000001, 0.5941742404076511, 0.5315074259896566, 0.4131367765334449], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.384000000000002, 8, 40, 13.0, 15.0, 17.0, 26.980000000000018, 0.5940711697261332, 0.4461335249212856, 0.3277834090774075], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2104.3860000000013, 1587, 2657, 2110.5, 2394.0, 2489.95, 2603.92, 0.5929137322377869, 0.49496716295522436, 0.37751929044827837], "isController": false}]}, function(index, item){
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
