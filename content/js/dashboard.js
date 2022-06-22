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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9184957964099069, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.006, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.869, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.737, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.807, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.19441036128194, 1, 3629, 14.0, 571.0, 1248.9500000000007, 2129.0, 25.899112921544695, 174.12620860504057, 228.14099614852944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.217999999999997, 4, 29, 7.0, 9.0, 12.0, 18.99000000000001, 0.5996498045141637, 6.410839663386582, 0.2166703395217193], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.569999999999993, 5, 36, 7.0, 9.0, 11.0, 15.0, 0.5996275113899245, 6.438289597002342, 0.2529678563676244], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.475999999999996, 13, 243, 18.0, 24.0, 28.0, 38.99000000000001, 0.5954911789891657, 0.32091391817713005, 6.62949164109032], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.874, 26, 80, 45.0, 54.0, 56.0, 60.0, 0.5994017970065875, 2.4930197787607966, 0.2493605132078186], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2180000000000004, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5994413206891178, 0.3746508254306986, 0.253474699080457], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.709999999999994, 23, 66, 40.0, 48.0, 50.0, 53.0, 0.5993946114424432, 2.4595314981868315, 0.21774882368807505], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 745.8759999999995, 562, 985, 748.0, 891.9000000000001, 906.8, 936.0, 0.5990369881378695, 2.5336222613526496, 0.29132853524673735], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.492000000000004, 6, 30, 10.0, 12.0, 13.949999999999989, 20.0, 0.599128866627923, 0.8910871717522723, 0.30600038793594114], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.145999999999998, 1, 21, 3.0, 4.0, 5.0, 11.0, 0.5964601284297948, 0.5754908270396849, 0.3261891327350441], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.98399999999999, 10, 26, 16.0, 18.0, 19.94999999999999, 24.0, 0.5993838334192451, 0.9769254081803905, 0.39158963335690905], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.7593555382562277, 2104.6086104314945], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9899999999999998, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.5964722246743858, 0.5987089955169148, 0.35007793655205655], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.07399999999999, 11, 40, 17.0, 19.0, 21.0, 25.0, 0.599375211279762, 0.9411127340859887, 0.3564643590521241], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.466000000000006, 6, 23, 10.0, 12.0, 13.949999999999989, 17.0, 0.599370181812951, 0.9277360724350853, 0.3424136292583753], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1840.6119999999994, 1447, 2273, 1825.0, 2075.9, 2168.45, 2250.98, 0.5981061566655342, 0.9135137002196246, 0.3294256566009388], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.56200000000001, 10, 86, 15.0, 21.0, 26.0, 40.960000000000036, 0.5954408286630923, 0.32156130688543955, 4.8007416810961825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.269999999999982, 13, 44, 20.0, 23.0, 25.0, 34.97000000000003, 0.5993996413192547, 1.0852411474666974, 0.4998899352408627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.995999999999986, 10, 28, 16.0, 19.0, 20.0, 24.0, 0.5993917372650235, 1.0149856175952643, 0.4296421241723899], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.381100171232877, 1868.2577054794522], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.65900404676259, 2751.717063848921], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0580000000000025, 1, 18, 2.0, 2.0, 4.0, 7.990000000000009, 0.5963925407992138, 0.5014589625274639, 0.2521855177402925], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 390.41800000000023, 303, 507, 396.5, 455.0, 461.0, 471.98, 0.596169254836125, 0.5244659292251708, 0.2759611589768782], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.8700000000000006, 1, 14, 3.0, 4.0, 5.0, 10.990000000000009, 0.5964309571524, 0.5405155549193625, 0.2912260532970703], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1132.6220000000005, 907, 1375, 1131.0, 1311.0, 1344.95, 1362.0, 0.5957941697965721, 0.563793506379764, 0.314770161972603], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 8.995643028846155, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.91, 27, 618, 40.0, 48.0, 53.0, 82.94000000000005, 0.5950114242193449, 0.32132941171220486, 27.21596199959539], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.123999999999995, 29, 182, 42.0, 49.0, 53.0, 79.99000000000001, 0.5958218587973694, 134.83204284525195, 0.18386690173825068], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 2.072782855731225, 1.6211709486166008], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.096, 1, 22, 2.0, 3.0, 4.0, 9.0, 0.5996850454141485, 0.6518061089315892, 0.2570915380242297], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.063999999999999, 1, 23, 3.0, 4.0, 5.0, 10.0, 0.5996778530573376, 0.6154896714484979, 0.22077983457286746], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8999999999999992, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.5996627496695858, 0.34023833745901305, 0.23248643712775935], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 117.65800000000003, 82, 211, 118.0, 142.0, 147.0, 153.0, 0.5995937152985137, 0.5463095081772591, 0.19557060635713241], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 158.42999999999995, 107, 548, 160.0, 186.0, 208.89999999999998, 333.7600000000002, 0.5955748786516184, 0.3216336991155713, 176.1819834876865], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1579999999999977, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.5996728185102208, 0.33370855361314866, 0.25123011634852027], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 443.44199999999967, 330, 652, 449.0, 516.0, 524.95, 551.98, 0.5994592877224744, 0.6514670642080843, 0.2575801626932507], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.972000000000001, 6, 301, 9.0, 13.900000000000034, 17.0, 38.98000000000002, 0.594819597164376, 0.25152039606657695, 0.4315927350518861], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.6779999999999986, 1, 13, 2.0, 3.0, 4.0, 8.980000000000018, 0.5996886416572516, 0.6383404486390666, 0.24362351067325846], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.316, 2, 19, 3.0, 4.0, 5.0, 9.0, 0.596384004503892, 0.3663335340165509, 0.29819200225194603], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.695999999999997, 2, 35, 4.0, 5.0, 5.0, 9.0, 0.5963612422443221, 0.34943041537753244, 0.2812914843789136], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 505.4600000000001, 367, 843, 509.0, 615.0, 622.95, 645.96, 0.5957636438810904, 0.543890317232225, 0.2623919954984099], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.01000000000003, 6, 118, 14.0, 25.0, 37.89999999999998, 46.99000000000001, 0.595945425701696, 0.5278540049916388, 0.24501271896524804], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.029999999999982, 5, 45, 8.0, 10.0, 11.0, 14.0, 0.5964821866559777, 0.3978489584824539, 0.2790185228595833], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 503.3040000000001, 336, 3629, 493.0, 545.0, 585.95, 655.95, 0.5962758992436837, 0.44837152579847306, 0.32958218649602045], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 15.046000000000006, 10, 35, 15.5, 18.0, 19.0, 26.0, 0.5991044586552022, 0.4891126244489737, 0.3697597830762576], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.507999999999997, 10, 30, 15.0, 18.0, 19.0, 23.0, 0.599115226633308, 0.49780390569207394, 0.3791276043538902], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 15.146000000000006, 10, 42, 16.0, 18.0, 20.0, 26.980000000000018, 0.5990822060603156, 0.48499916877343907, 0.36565076053486056], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.604, 12, 37, 18.0, 21.0, 23.0, 28.99000000000001, 0.5990929732385168, 0.5359073862172671, 0.41655683295490625], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 14.667999999999997, 9, 40, 16.0, 18.0, 19.0, 22.99000000000001, 0.5988604882629334, 0.4497301908927692, 0.330425952996638], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2084.4640000000004, 1561, 2746, 2076.0, 2389.9, 2465.95, 2575.98, 0.5977164839447375, 0.49897652259308534, 0.3805772925116883], "isController": false}]}, function(index, item){
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
