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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9012763241863433, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.734, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.667, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 185.923080195703, 1, 3217, 17.0, 535.9000000000015, 1205.9500000000007, 2175.980000000003, 26.43012798456359, 175.86662671717121, 218.92514360945816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.139999999999983, 18, 67, 29.0, 32.0, 34.0, 37.99000000000001, 0.5725199580457374, 0.33240598220378964, 0.2884963851089849], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.570000000000008, 4, 39, 7.0, 10.0, 13.0, 26.0, 0.5725153691750855, 6.124913666471438, 0.20686590487771642], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.661999999999998, 5, 31, 7.0, 10.0, 11.0, 18.0, 0.5725009474890681, 6.147481629160222, 0.24152383722195062], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.198000000000008, 13, 258, 20.0, 28.0, 33.0, 55.92000000000007, 0.5688437454492501, 0.3071011840055929, 6.332830759884229], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.555999999999976, 27, 78, 45.0, 54.0, 56.0, 65.95000000000005, 0.5722460658082976, 2.379976976037196, 0.23806330472103004], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5019999999999984, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.5722794692451291, 0.35760983974458027, 0.24198926775697352], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.088000000000015, 23, 71, 39.0, 48.0, 49.0, 52.99000000000001, 0.5722362420101514, 2.3486095374614457, 0.20788269729275033], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 772.9399999999995, 588, 1009, 776.0, 910.9000000000001, 928.0, 967.7800000000002, 0.5718985086030692, 2.4185811326678723, 0.27813032937922705], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.394000000000002, 8, 36, 13.0, 15.0, 16.0, 23.980000000000018, 0.5719017793008158, 0.8504302327726028, 0.2920943657952409], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2920000000000003, 2, 22, 3.0, 4.0, 5.0, 11.990000000000009, 0.5696921497561147, 0.549567106957992, 0.31155039439787524], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.23000000000001, 13, 51, 21.0, 25.0, 27.0, 34.99000000000001, 0.572205462959996, 0.932368568696699, 0.37383345187523176], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.6984579582651391, 1935.826577843699], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.242000000000003, 2, 23, 4.0, 6.0, 7.0, 12.990000000000009, 0.5697051320177702, 0.5723900899934712, 0.3343679534596483], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.98200000000002, 14, 49, 22.0, 26.0, 27.0, 37.98000000000002, 0.5721904020781956, 0.8990117020089604, 0.3402968309234581], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.884000000000006, 7, 23, 12.0, 15.0, 16.0, 20.0, 0.5721910568826574, 0.8855695936671039, 0.3268864924573775], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1918.1240000000005, 1505, 2419, 1911.5, 2137.9, 2238.75, 2328.94, 0.5709333275478756, 0.8718820974149281, 0.3144593718134784], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.142000000000003, 12, 205, 17.0, 26.0, 31.0, 44.960000000000036, 0.5688094476974025, 0.30708266770777753, 4.586026172060308], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.498000000000005, 16, 53, 26.0, 30.0, 31.0, 36.99000000000001, 0.5722237990166906, 1.0358759555422163, 0.47722570738306036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 20.238, 13, 44, 21.0, 25.0, 27.0, 36.99000000000001, 0.5722159405627858, 0.9687727634653854, 0.4101625980205906], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.7710569234006734, 3219.6016151094277], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2940000000000005, 1, 23, 2.0, 3.0, 4.0, 10.0, 0.5696162153787264, 0.4786222500353162, 0.240863106698231], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 411.5040000000001, 318, 576, 417.0, 472.0, 479.0, 523.8400000000001, 0.5694235497636323, 0.5013240521090879, 0.26358082283980633], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0099999999999985, 1, 21, 3.0, 4.0, 5.0, 11.990000000000009, 0.5696635908630517, 0.5160962987105094, 0.27815605022609946], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1163.5420000000015, 929, 1459, 1167.0, 1331.9, 1367.0, 1399.97, 0.5690696962419776, 0.5383432670376622, 0.30065107975284167], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 8.995643028846155, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 45.07999999999998, 12, 711, 43.0, 53.0, 59.94999999999999, 96.98000000000002, 0.5683581383770192, 0.3061463332516792, 25.996834458303542], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.17800000000004, 9, 189, 47.0, 55.0, 60.94999999999999, 87.99000000000001, 0.5692025017588358, 126.62290750487806, 0.1756523345271407], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.8208821614583335, 1.4241536458333335], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.140000000000002, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.5725330695100949, 0.6220996727114708, 0.24545118897942544], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2439999999999998, 2, 36, 3.0, 4.0, 5.0, 11.990000000000009, 0.5725265137028496, 0.5873630015618523, 0.21078368717380302], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1100000000000034, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.572528480429259, 0.32471310597845693, 0.2219666081351717], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.30800000000005, 86, 178, 121.0, 148.0, 152.0, 162.97000000000003, 0.5724596530436534, 0.5214895003028311, 0.1867202383950979], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 172.53799999999984, 40, 603, 174.0, 204.0, 226.0, 347.6800000000003, 0.5689304789711916, 0.30510008127171895, 168.30008088769085], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1979999999999986, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.5725212691651494, 0.3191828439707785, 0.23985510202329016], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.186000000000002, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.5725730631857279, 0.3079637899069111, 0.24379087455954818], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.757999999999992, 7, 320, 10.0, 15.0, 20.0, 41.99000000000001, 0.5681740703535861, 0.2400602030142771, 0.41225911550069777], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.392000000000005, 2, 63, 4.0, 5.0, 6.0, 10.990000000000009, 0.572533725099077, 0.2945563010342249, 0.23035536595783174], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.651999999999998, 2, 13, 3.0, 5.0, 6.0, 10.0, 0.5696090772902557, 0.3497900367540257, 0.28480453864512784], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.023999999999997, 2, 26, 4.0, 5.0, 6.0, 17.970000000000027, 0.5695941527742653, 0.3336497873847426, 0.2686659919823927], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 518.4160000000006, 379, 769, 515.0, 631.9000000000001, 638.95, 671.8400000000001, 0.5691383586732702, 0.5200346128607057, 0.2506654294547313], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.621999999999982, 7, 103, 14.0, 27.900000000000034, 34.0, 52.97000000000003, 0.569319810849186, 0.504077094869176, 0.23406605504639388], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.907999999999989, 6, 57, 11.0, 13.0, 15.0, 20.0, 0.5697155182531155, 0.37967310934208115, 0.2664977863703538], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 522.496, 348, 3217, 511.0, 574.0, 607.95, 676.98, 0.5695273264906523, 0.42806430262517925, 0.31479733085323164], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.82200000000003, 143, 327, 178.0, 190.90000000000003, 193.0, 217.94000000000005, 0.5723567705799462, 11.066430964186491, 0.28841415392505104], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 267.0999999999997, 19, 423, 269.0, 294.0, 301.95, 327.0, 0.5724334374398945, 1.1077626786135433, 0.4092004650449246], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.500000000000018, 13, 43, 22.0, 25.0, 26.0, 35.0, 0.5718762688504715, 0.466591837252592, 0.3529548846811504], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.048000000000002, 13, 44, 21.0, 25.0, 26.0, 30.99000000000001, 0.5718900049640052, 0.47563600244883303, 0.36189914376628457], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.802000000000014, 13, 37, 21.0, 24.0, 26.0, 32.0, 0.5718527227623689, 0.46285781718383123, 0.3490312028578912], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.745999999999995, 15, 47, 24.0, 28.0, 29.0, 38.98000000000002, 0.5718631874510343, 0.5114847105228545, 0.3976236225245472], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.815999999999978, 13, 142, 21.0, 24.0, 26.0, 35.0, 0.5716121405845763, 0.4291054380749703, 0.3153914642873883], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2146.859999999999, 1673, 2758, 2130.0, 2442.8, 2530.85, 2631.95, 0.5705437395947086, 0.4767773275474493, 0.3632758966950683], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.1949317738791423, 0.0042544139544777706], "isController": false}, {"data": ["500", 12, 2.3391812865497075, 0.05105296745373325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 12, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
