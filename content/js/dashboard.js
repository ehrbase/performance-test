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

    var data = {"OkPercent": 97.80472239948946, "KoPercent": 2.1952776005105297};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.885726441182727, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.425, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.824, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.353, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.973, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.641, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.52, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.905, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 516, 2.1952776005105297, 243.56068921506076, 1, 5752, 22.0, 697.0, 1688.9000000000015, 3226.980000000003, 19.963597541347706, 132.4676745108154, 165.4007884102844], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 38.009999999999984, 20, 82, 35.0, 58.0, 62.94999999999999, 71.96000000000004, 0.43151249444427664, 0.25056126965000025, 0.21828464074427276], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 9.015999999999996, 5, 51, 8.0, 14.0, 17.0, 27.980000000000018, 0.43162759861395744, 4.613171704264309, 0.15680221355897675], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 10.190000000000014, 5, 45, 8.0, 17.0, 21.0, 31.980000000000018, 0.43161530300689116, 4.634659833728836, 0.18293070459471752], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 27.14799999999999, 9, 352, 23.0, 38.0, 45.0, 59.99000000000001, 0.43373259864814223, 0.23403177519596036, 4.829510829869255], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 54.33400000000004, 27, 107, 50.0, 83.0, 89.0, 101.99000000000001, 0.43208078873755495, 1.797077166550293, 0.18059626716764993], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.879999999999999, 1, 34, 3.0, 8.0, 12.0, 19.99000000000001, 0.4320960981722335, 0.27006006135764593, 0.18355644795402495], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.30000000000002, 23, 102, 44.0, 70.0, 76.0, 87.99000000000001, 0.43209759183370117, 1.7733943442530156, 0.15781689389238696], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1017.1119999999992, 589, 2091, 890.0, 1793.9000000000003, 1905.95, 1984.8700000000001, 0.43135390776445665, 1.824188093542977, 0.21062202527561358], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 16.660000000000014, 9, 58, 16.0, 25.0, 29.0, 36.99000000000001, 0.4331922281848726, 0.644166150175183, 0.22209562480181455], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.4719999999999995, 2, 34, 3.0, 8.0, 12.0, 20.980000000000018, 0.4329791563834117, 0.41770818449674835, 0.23763113856198964], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 29.111999999999988, 15, 65, 27.0, 47.0, 52.0, 59.99000000000001, 0.4320931108802774, 0.7040408686086949, 0.283139138086588], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.6741829581358609, 1868.5497506911531], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.089999999999996, 2, 29, 4.0, 7.0, 10.0, 16.99000000000001, 0.43298515553692757, 0.43507481631687245, 0.25497075077028064], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 29.977999999999987, 16, 76, 28.0, 48.0, 52.0, 64.99000000000001, 0.4320841492522352, 0.6789046242833884, 0.25781583514952705], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 16.08600000000001, 9, 48, 15.0, 24.0, 28.94999999999999, 39.99000000000001, 0.4320908704384167, 0.6687635811561715, 0.24769271576889706], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2558.806000000001, 1617, 5342, 2295.5, 3716.8, 4165.5, 5118.82, 0.43126387052423576, 0.6585171878598358, 0.23837436593429434], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 22.868000000000027, 13, 146, 20.0, 33.900000000000034, 38.94999999999999, 56.98000000000002, 0.43370852011713595, 0.23414584603737876, 3.4976220303977628], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 34.241999999999976, 18, 82, 32.0, 52.0, 55.0, 69.98000000000002, 0.43209871208657874, 0.7822126011543085, 0.3612075171348744], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 29.278000000000006, 14, 69, 27.0, 47.0, 52.0, 59.99000000000001, 0.4321009526097601, 0.7315553522400546, 0.3105725596882651], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 4.122303650442478, 1206.944828539823], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.5307158893395133, 2216.0432358053304], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9319999999999995, 1, 25, 2.0, 4.0, 7.0, 15.0, 0.4339467894446783, 0.36460090591816635, 0.18434263028167489], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 535.0360000000002, 318, 1059, 468.0, 971.0, 994.9, 1041.0, 0.4335836556305174, 0.38168064341646574, 0.2015486524219983], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.4419999999999975, 2, 25, 3.0, 9.900000000000034, 14.0, 19.0, 0.4337220639618602, 0.3929377890215404, 0.21262546495005258], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1477.6660000000006, 953, 2994, 1275.0, 2454.100000000001, 2822.85, 2934.87, 0.43262325436516863, 0.40919062137678025, 0.22940862023465486], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.236979166666667, 877.9817708333334], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 57.22600000000001, 9, 902, 49.0, 83.0, 89.0, 110.93000000000006, 0.43337771121096136, 0.2332139201679252, 19.823644524532643], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 62.145999999999965, 9, 225, 55.0, 97.0, 102.94999999999999, 113.99000000000001, 0.43395846496740104, 96.162075912734, 0.13476444517542338], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.7364704056291391, 1.3646005794701987], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.727999999999998, 1, 22, 2.0, 4.0, 6.0, 14.960000000000036, 0.4315586777387361, 0.46892053310875026, 0.18585681336209242], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.116000000000005, 2, 25, 3.0, 7.0, 10.949999999999989, 19.0, 0.43155532539271535, 0.44273867706715003, 0.15972604328499915], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.771999999999997, 1, 23, 2.0, 4.0, 6.0, 12.0, 0.43163914967087513, 0.24480684148052229, 0.16818752023308514], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 165.98200000000006, 88, 367, 132.5, 303.90000000000003, 319.95, 348.98, 0.4315061636340413, 0.3931349837041697, 0.14158795994241982], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 227.42600000000002, 26, 735, 199.0, 351.0, 366.0, 539.3400000000006, 0.4338210349408138, 0.23234166725232508, 128.33307412526497], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 3.212000000000001, 1, 23, 2.0, 6.900000000000034, 9.0, 16.99000000000001, 0.4315527180484841, 0.24064121289617618, 0.18163986472548502], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.888000000000003, 2, 31, 3.0, 6.0, 8.0, 16.980000000000018, 0.4315799104730634, 0.23215374586546444, 0.1846015632687517], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 14.097999999999997, 7, 371, 11.0, 20.0, 26.94999999999999, 54.98000000000002, 0.4332695560546821, 0.1830860054691616, 0.3152205266218146], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.415999999999999, 2, 55, 5.0, 7.0, 10.0, 19.99000000000001, 0.43156016768701877, 0.2219795467992477, 0.17447842717033765], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.525999999999997, 2, 30, 4.0, 7.0, 9.0, 15.0, 0.43393963378966427, 0.26652623159662014, 0.21781735524207757], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.218000000000002, 2, 35, 4.0, 9.0, 13.0, 22.0, 0.43392758269357945, 0.2541807091960537, 0.20552234141248635], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 698.0360000000001, 378, 1387, 606.5, 1292.8000000000002, 1323.95, 1353.95, 0.43357989576739303, 0.3961226575846131, 0.19180829373303618], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 21.459999999999997, 8, 145, 20.0, 33.0, 41.0, 66.97000000000003, 0.43403983443984556, 0.38432447098139877, 0.17929575192192837], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 14.772000000000006, 7, 64, 14.0, 22.0, 26.0, 33.99000000000001, 0.43298928005140447, 0.2885797440145727, 0.20338656611789607], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 667.5819999999999, 456, 3846, 640.5, 836.8000000000001, 890.8499999999999, 990.9300000000001, 0.43275206076531336, 0.325213173665133, 0.24004215870575976], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 222.26999999999995, 143, 428, 186.0, 381.0, 391.95, 405.98, 0.4314447271845556, 8.341966946803728, 0.21825036004062484], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 354.424, 222, 647, 308.0, 568.9000000000001, 601.95, 626.96, 0.43138256386187473, 0.8362005557393724, 0.30921367370567976], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 28.22799999999999, 15, 86, 27.0, 44.0, 48.0, 60.0, 0.43318209502455707, 0.3534317484247333, 0.2682006330523137], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 27.706000000000024, 15, 60, 26.0, 45.0, 49.0, 56.0, 0.433187349196654, 0.3602291236186739, 0.2749724384549074], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 27.304000000000016, 15, 61, 26.0, 44.0, 50.89999999999998, 59.99000000000001, 0.4331607043539581, 0.3506249778005139, 0.2652263297167302], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 30.723999999999975, 17, 70, 30.0, 47.0, 51.0, 60.99000000000001, 0.4331719623382969, 0.3874613218047503, 0.30203591905228905], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 29.017999999999986, 15, 72, 26.0, 48.0, 53.0, 58.0, 0.4341905992524974, 0.3259439995619017, 0.2404160837657872], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2791.879999999999, 1789, 5752, 2485.5, 4125.6, 4825.3, 5573.6, 0.4323778359662261, 0.36126941619696024, 0.27614756320499206], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.89922480620154, 2.1272069772388855], "isController": false}, {"data": ["500", 16, 3.10077519379845, 0.06807062327164433], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 516, "No results for path: $['rows'][1]", 500, "500", 16, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
