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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8972984471389066, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.96, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.471, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.98, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.685, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.583, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 194.7042331418833, 1, 3822, 16.0, 569.0, 1250.0, 2304.980000000003, 25.227671551923066, 167.8894177588506, 209.01426988805588], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.41600000000001, 16, 66, 26.0, 31.0, 37.0, 52.98000000000002, 0.5476427266474189, 0.3180242604358798, 0.27703020742515916], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.841999999999997, 4, 31, 7.0, 10.0, 12.949999999999989, 19.99000000000001, 0.547334590013552, 5.8777449171773295, 0.19883639402836067], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.377999999999991, 5, 38, 8.0, 10.0, 14.0, 19.0, 0.5473160169843106, 5.877016320758383, 0.23196792126092855], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.486000000000004, 14, 272, 20.0, 31.0, 38.0, 52.98000000000002, 0.5429866218956098, 0.29320323113691626, 6.046028772318108], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.127999999999986, 27, 77, 46.0, 55.900000000000034, 60.0, 67.98000000000002, 0.5470615137848561, 2.27529615004092, 0.22865461708976403], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.629999999999997, 1, 19, 2.0, 4.0, 4.0, 7.0, 0.547093238912335, 0.341902286617224, 0.23240777238951724], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.14799999999997, 25, 66, 41.0, 49.900000000000034, 52.0, 58.99000000000001, 0.547052535643208, 2.245248917109506, 0.19980239094781227], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 781.2460000000001, 577, 1724, 766.0, 926.0, 957.8499999999999, 1285.6600000000012, 0.546752834913449, 2.31227006480388, 0.2669691576725825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.159999999999998, 7, 31, 11.0, 14.0, 17.0, 26.0, 0.5465705431271487, 0.8127311822594133, 0.28022415541186824], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6880000000000015, 1, 21, 3.0, 5.0, 7.949999999999989, 13.990000000000009, 0.5442864078621082, 0.5250896813910654, 0.29871968868994614], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.786, 11, 39, 18.0, 22.0, 25.0, 37.98000000000002, 0.5470357772339026, 0.8913563355495575, 0.3584580141835436], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.7357893318965518, 2039.2965382543105], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.595999999999997, 2, 22, 4.0, 6.0, 8.0, 12.980000000000018, 0.5442947029239511, 0.5469215627109142, 0.3205172908819751], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.637999999999998, 12, 51, 19.0, 23.0, 25.0, 35.98000000000002, 0.5470118384302073, 0.8594827356909908, 0.3263908528133366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.95800000000001, 6, 27, 11.0, 14.0, 17.0, 23.99000000000001, 0.5470034603438901, 0.8466491781683261, 0.31356546017760106], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2052.137999999999, 1464, 3785, 1996.0, 2388.4, 2603.65, 3289.4700000000003, 0.5457156952199671, 0.8333409079808738, 0.301635823725099], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.944000000000003, 12, 72, 17.0, 25.0, 31.0, 48.99000000000001, 0.5429536024428568, 0.293123894750073, 4.3786238759503044], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.268000000000015, 14, 43, 23.0, 27.0, 29.94999999999999, 40.0, 0.5470519371109093, 0.9902772630171008, 0.45730122867865075], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.707999999999984, 11, 44, 19.0, 23.0, 25.0, 33.99000000000001, 0.5470453533420642, 0.9260964977062388, 0.39318884771460866], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.381100171232877, 1868.2844606164385], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 954.0, 954, 954, 954.0, 954.0, 954.0, 954.0, 1.0482180293501049, 0.4800920466457023, 2004.6596567085955], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4419999999999984, 1, 33, 2.0, 3.0, 5.0, 9.990000000000009, 0.5439009665120175, 0.45701491172487313, 0.23105168011008556], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 427.2960000000002, 318, 833, 430.0, 495.0, 540.75, 743.6100000000004, 0.5437199798606119, 0.47863287524018827, 0.25274483438833134], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4119999999999977, 1, 26, 3.0, 4.0, 7.0, 13.0, 0.5439465278805232, 0.4927666840638898, 0.26666128612892837], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1218.204, 918, 2377, 1196.5, 1397.9, 1595.0999999999995, 1995.93, 0.5434097439888015, 0.5140380227873442, 0.2881557529159367], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.496853298611112, 914.5643446180557], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 46.41400000000001, 26, 750, 43.0, 59.900000000000034, 74.0, 142.69000000000028, 0.5425182394632108, 0.2926070005332954, 24.815971031696083], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.479999999999976, 8, 192, 45.0, 57.0, 71.0, 91.98000000000002, 0.5433542343595484, 120.87275658375533, 0.16873695949837536], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 1.2790586890243902, 1.0051448170731707], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.4459999999999993, 1, 18, 2.0, 4.0, 5.0, 8.980000000000018, 0.5474035009738308, 0.5947635261352328, 0.2357470155561127], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.577999999999999, 2, 25, 3.0, 5.0, 7.949999999999989, 17.980000000000018, 0.5473975080275845, 0.5616448111369118, 0.20260122611567824], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2279999999999993, 1, 15, 2.0, 3.0, 4.0, 7.990000000000009, 0.5473483708175743, 0.3104320494365049, 0.2132734374572384], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.21199999999999, 86, 235, 121.0, 150.0, 161.89999999999998, 222.0, 0.5472866621862132, 0.49861983710286145, 0.1795784360298512], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 171.87399999999982, 26, 704, 170.5, 209.90000000000003, 240.0, 376.9200000000001, 0.5430697779496292, 0.2912625350687309, 160.6510714223649], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.527999999999999, 1, 16, 2.0, 4.0, 5.0, 11.990000000000009, 0.5473945116036688, 0.30520558324611513, 0.23039749463005985], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.3779999999999992, 2, 14, 3.0, 5.0, 6.0, 9.990000000000009, 0.5474442564885831, 0.29447903322712915, 0.23416072689648376], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.159999999999988, 6, 307, 10.0, 16.0, 20.0, 46.92000000000007, 0.5423522903537221, 0.2291501983653502, 0.3945824768686748], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.718, 2, 69, 4.0, 6.0, 7.0, 17.0, 0.5474041002756727, 0.2815656383361324, 0.2213137671036411], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.909999999999998, 2, 18, 4.0, 5.0, 7.0, 12.0, 0.5438944583681425, 0.3340606137060316, 0.2730095230480716], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.416000000000003, 2, 36, 4.0, 6.0, 9.949999999999989, 15.990000000000009, 0.5438743432717305, 0.31858395686260643, 0.25759673485038015], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 546.2879999999993, 374, 1264, 544.0, 643.9000000000001, 691.8499999999999, 1074.96, 0.5433087721547735, 0.49643353445718563, 0.24035046268175037], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.365999999999996, 6, 112, 16.0, 32.0, 41.0, 56.99000000000001, 0.5434629021353744, 0.48118332729183744, 0.2244968824250619], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.854000000000005, 6, 66, 10.0, 12.0, 15.949999999999989, 23.99000000000001, 0.5443000355972223, 0.3627355764572817, 0.25567218468971087], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 565.294, 372, 3501, 537.5, 650.8000000000001, 687.9, 775.95, 0.5441193754380161, 0.40884407211867024, 0.3018162160632745], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 178.14199999999997, 141, 383, 177.0, 194.0, 246.89999999999998, 354.8600000000001, 0.5475215887762455, 10.586277519461655, 0.2769689286973585], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 266.7799999999999, 210, 544, 265.0, 295.80000000000007, 330.79999999999995, 475.95000000000005, 0.5473190125489303, 1.0609340775457996, 0.39231655782315905], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.601999999999997, 11, 42, 18.0, 21.900000000000034, 24.0, 32.0, 0.5465424630701258, 0.4459220741805689, 0.3383866421742771], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.336000000000013, 10, 38, 18.0, 22.0, 24.0, 33.99000000000001, 0.5465538142351034, 0.4544402817539568, 0.3469335734890793], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.797999999999984, 11, 56, 18.0, 22.0, 28.0, 35.99000000000001, 0.5465143858981799, 0.44237991234455765, 0.3346333202716395], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.080000000000005, 13, 44, 21.0, 25.0, 27.94999999999999, 36.0, 0.5465269306610353, 0.4888544628159472, 0.38107444188669837], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.690000000000023, 11, 65, 18.0, 22.0, 25.0, 35.99000000000001, 0.5461920039675386, 0.40999177366568024, 0.3024324865718696], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2282.7840000000006, 1670, 3822, 2227.5, 2705.0, 2924.95, 3562.3200000000006, 0.5452360544974341, 0.4555979692410532, 0.3482269332434784], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
