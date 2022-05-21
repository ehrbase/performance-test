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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9117927743694615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.982, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.796, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.724, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.621, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 199.58218586684995, 1, 3811, 13.0, 596.0, 1315.0, 2241.980000000003, 24.526686773979975, 164.91537934302363, 216.05152152466155], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.1160000000000005, 4, 34, 6.5, 9.0, 11.0, 20.980000000000018, 0.5674705454413388, 6.083444956562968, 0.2050430681770463], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.544000000000001, 4, 40, 7.0, 9.0, 11.0, 17.980000000000018, 0.5674544447571749, 6.09284260487693, 0.23939484388193313], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.836000000000027, 13, 281, 19.0, 27.900000000000034, 37.0, 71.8900000000001, 0.5638421557715447, 0.303858061758759, 6.277148999800399], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.04200000000001, 26, 194, 43.0, 52.0, 54.0, 59.0, 0.5672329920859653, 2.359223938763795, 0.23597778772326292], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.444000000000003, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.5672722487012302, 0.35454515543826887, 0.2398719567262038], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.46800000000002, 21, 59, 37.0, 45.900000000000034, 47.0, 55.99000000000001, 0.5672201222472808, 2.3275080063120255, 0.20606043503514496], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.0759999999996, 568, 1153, 766.5, 910.9000000000001, 928.95, 958.99, 0.5669094928994587, 2.397739271237847, 0.2757040307264945], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.705999999999998, 5, 40, 8.0, 11.0, 13.0, 19.0, 0.5669834214047582, 0.8432771003900846, 0.28958235292450046], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.512, 2, 52, 3.0, 5.0, 6.0, 11.990000000000009, 0.5647292687885428, 0.5448755054326956, 0.3088363188687343], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.031999999999993, 7, 67, 13.0, 16.0, 18.0, 30.980000000000018, 0.5672111137076776, 0.9244876452911268, 0.37057054206097295], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.712450438230384, 1974.6077446786312], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.547999999999999, 2, 25, 4.0, 6.0, 7.0, 17.99000000000001, 0.564738836525049, 0.5668566071620179, 0.3314531647964399], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.904000000000003, 8, 69, 14.0, 17.0, 19.0, 26.99000000000001, 0.5672046792117217, 0.8905999720935298, 0.3373316891015024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.475999999999992, 5, 52, 8.0, 11.0, 13.0, 19.0, 0.5672053226547478, 0.877949644929468, 0.32403819702444087], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1986.3180000000023, 1476, 3209, 1969.0, 2241.8, 2316.8, 2580.75, 0.5660482024007236, 0.8645501841354802, 0.31176873647852354], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.552000000000003, 11, 216, 16.0, 27.900000000000034, 36.0, 77.99000000000001, 0.5638040081954551, 0.3044761880196159, 4.545669816075857], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.625999999999994, 11, 54, 18.0, 21.0, 23.0, 36.99000000000001, 0.5672246266243894, 1.0269867751578303, 0.47305647571994985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.87199999999999, 8, 33, 13.0, 17.0, 18.0, 23.0, 0.5672220526858531, 0.9605107806223333, 0.4065829947963049], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.7078946097372488, 2955.862997488408], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3920000000000003, 1, 54, 2.0, 3.0, 4.949999999999989, 9.990000000000009, 0.5646355221241136, 0.4747570161609979, 0.23875701277318476], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.95799999999986, 313, 985, 420.0, 481.0, 491.0, 569.9200000000001, 0.5644385642489129, 0.4965515978691315, 0.2612733197792819], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.257999999999999, 1, 26, 3.0, 4.0, 6.0, 15.990000000000009, 0.5647088587008082, 0.5117674031976074, 0.275736747412504], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.6679999999994, 912, 1700, 1161.5, 1373.9, 1395.0, 1453.8600000000001, 0.5641271542605704, 0.5338273559360279, 0.2980398344286802], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.637999999999955, 26, 726, 40.0, 51.0, 59.0, 107.87000000000012, 0.5633529868412009, 0.304232618870297, 25.76789765397282], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.29400000000002, 28, 272, 40.0, 48.900000000000034, 57.0, 89.99000000000001, 0.5641850797870539, 127.672769515444, 0.17410398946553618], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.8863815197841725, 1.4753821942446042], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3400000000000003, 1, 54, 2.0, 3.0, 4.0, 6.0, 0.5675021054328111, 0.6168260188932801, 0.24329435965332433], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.339999999999998, 2, 25, 3.0, 4.900000000000034, 6.0, 11.990000000000009, 0.5674988848646912, 0.5824622343679595, 0.2089326949160045], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2640000000000007, 1, 34, 2.0, 3.0, 4.0, 10.980000000000018, 0.5674872911221154, 0.3219825352948721, 0.22001216267136697], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.74000000000001, 81, 326, 118.5, 148.0, 154.0, 167.99, 0.5674203143281574, 0.516995266863448, 0.18507654783750443], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.96999999999997, 108, 757, 163.0, 202.0, 233.95, 353.8600000000001, 0.5639394554600617, 0.3045493348334123, 166.82364450102637], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.333999999999998, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.5674956643331245, 0.3158024700816286, 0.23774964843643595], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 468.4600000000001, 353, 815, 473.5, 543.0, 556.95, 607.8200000000002, 0.5672786847303327, 0.6164945424954136, 0.24375255984506486], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.732000000000012, 7, 309, 10.0, 18.0, 23.0, 74.85000000000014, 0.5631734146105205, 0.23813875832651893, 0.40863071001525075], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.0400000000000023, 1, 28, 3.0, 4.0, 5.0, 13.990000000000009, 0.5675040377912288, 0.6040814464769917, 0.23054851535268672], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.672, 2, 36, 3.0, 5.0, 7.0, 12.990000000000009, 0.5646297835435261, 0.34682825571179493, 0.2823148917717631], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.9740000000000046, 2, 28, 4.0, 5.0, 6.0, 9.0, 0.5646138436539098, 0.33082842401596274, 0.26631688133285003], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.6559999999998, 380, 1223, 523.5, 638.9000000000001, 656.95, 761.8500000000001, 0.5641201530796448, 0.5150020350634522, 0.24845526273332008], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.98399999999998, 6, 110, 16.0, 26.0, 33.94999999999999, 50.99000000000001, 0.5642933241842576, 0.499818403354611, 0.23199950144684808], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.127999999999998, 4, 35, 7.0, 9.0, 10.0, 19.960000000000036, 0.564748404585757, 0.3766827737617891, 0.26417430253572033], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 544.9500000000007, 377, 3409, 525.0, 607.9000000000001, 651.0, 782.94, 0.5645309707335855, 0.4245008276024031, 0.3120356732765716], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.937999999999997, 8, 46, 13.0, 16.0, 17.0, 23.0, 0.566968634161221, 0.4628767364831843, 0.34992595389637854], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.856000000000009, 8, 72, 13.0, 16.0, 17.0, 26.0, 0.5669750633027658, 0.47109869419973166, 0.3587889072462815], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.978000000000005, 8, 60, 13.0, 16.0, 18.0, 28.0, 0.5669570620738609, 0.4589916059172175, 0.3460431287071905], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.955999999999984, 10, 100, 16.0, 19.0, 21.0, 28.99000000000001, 0.5669673483504084, 0.5071700108290763, 0.3942194843998934], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.649999999999997, 8, 82, 13.0, 15.0, 17.0, 43.940000000000055, 0.5667038802214679, 0.4255813319241297, 0.31268329328625916], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2179.0240000000026, 1695, 3811, 2155.0, 2487.6000000000004, 2591.95, 2759.5400000000004, 0.5656473324637449, 0.4722050446126051, 0.36015826246715005], "isController": false}]}, function(index, item){
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
