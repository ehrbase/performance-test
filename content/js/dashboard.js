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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8899595830674325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.172, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.595, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.955, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.113, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.328610933845, 1, 18109, 9.0, 849.0, 1522.9500000000007, 6054.0, 15.230064360871856, 95.93811190776562, 126.03008228276343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6190.53, 5395, 18109, 6045.5, 6523.9, 6730.549999999999, 15261.380000000072, 0.3284337585236771, 0.1907449614566563, 0.16549982363107169], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4399999999999986, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.3296163595191557, 0.16922130504181185, 0.11909966115438242], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.716, 2, 16, 4.0, 5.0, 5.0, 9.0, 0.32961353472280824, 0.18917692430853672, 0.1390557099611847], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.483999999999998, 8, 386, 12.0, 15.0, 20.94999999999999, 39.940000000000055, 0.3276881405074316, 0.17047143489229874, 3.605529569430891], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.72200000000001, 23, 48, 34.0, 40.0, 41.0, 45.0, 0.32955531124521814, 1.3705864253448468, 0.13710015877974896], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2499999999999996, 1, 11, 2.0, 3.0, 4.0, 6.0, 0.32956443446083916, 0.2058844378602963, 0.1393568360561947], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.582000000000004, 21, 49, 30.0, 35.0, 37.0, 39.99000000000001, 0.32955465960628766, 1.3525611947987706, 0.11972102868509668], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 862.002, 701, 1108, 863.0, 1015.9000000000001, 1057.85, 1081.96, 0.32939682171594664, 1.3930879978256516, 0.16019493868607562], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.694000000000004, 3, 15, 5.0, 8.0, 9.0, 11.0, 0.32954249615259135, 0.4900367717934691, 0.16831125535918484], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9360000000000017, 2, 25, 4.0, 5.0, 5.0, 9.0, 0.32790024487590286, 0.3162796395179473, 0.17932044641650938], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.746000000000002, 5, 16, 7.0, 10.0, 11.0, 14.0, 0.3295514014502898, 0.5370368350723761, 0.2153026245803163], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 1.0399451622596154, 2843.2452862079326], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.104000000000006, 2, 18, 4.0, 5.0, 6.0, 9.980000000000018, 0.32790497576126415, 0.32941321056188483, 0.1924520414380076], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.935999999999994, 5, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.32954922938208203, 0.5177237703117668, 0.19599168036492964], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.608, 4, 16, 6.0, 8.0, 9.0, 11.990000000000009, 0.32954792615490075, 0.5099979434149733, 0.18826712578185245], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1576.2799999999986, 1338, 1977, 1566.0, 1760.9, 1811.9, 1925.8400000000001, 0.3292081359181878, 0.5027207560709273, 0.1813216686111894], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.937999999999999, 7, 76, 11.0, 14.0, 17.0, 40.930000000000064, 0.3276804093645818, 0.17046741296152967, 2.641923300501941], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.162000000000008, 8, 39, 11.0, 14.0, 15.0, 18.0, 0.32955335633615757, 0.596578468919823, 0.2748423499131627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.8219999999999965, 5, 20, 8.0, 10.0, 11.0, 13.990000000000009, 0.3295529219150716, 0.5579581994661902, 0.2362225045758423], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.626116071428571, 2783.3227040816328], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 1.008406929347826, 4157.485563858695], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4600000000000026, 1, 26, 2.0, 3.0, 4.0, 8.0, 0.3279176638096294, 0.27562696525154895, 0.1386604965132515], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 564.0579999999998, 456, 705, 558.0, 653.0, 671.0, 695.99, 0.32780092780774606, 0.2886536861460183, 0.15173597634850747], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.310000000000003, 2, 14, 3.0, 4.0, 5.0, 7.990000000000009, 0.3279140078305865, 0.29707920332472015, 0.16011426163602857], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 768.0980000000003, 575, 960, 750.0, 893.9000000000001, 906.0, 935.99, 0.32776353827294835, 0.3100662276956912, 0.1731641349664698], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.072215544871795, 844.1882011217949], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.784000000000017, 17, 691, 23.0, 28.0, 32.89999999999998, 63.88000000000011, 0.3275338014883136, 0.17039114393636673, 14.940531120624149], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.666000000000047, 21, 299, 29.0, 36.0, 39.94999999999999, 94.99000000000001, 0.3278239244588774, 74.14413868341158, 0.10116441418848171], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 1.0242462158203125, 0.80108642578125], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.700000000000003, 1, 12, 3.0, 4.0, 4.0, 6.990000000000009, 0.3295629138898245, 0.35811323233822906, 0.14128722577893843], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.362000000000001, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.32956204499840164, 0.338158336230733, 0.12133290133241935], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8899999999999988, 1, 14, 2.0, 3.0, 3.0, 5.0, 0.32961722869700333, 0.18692580163734063, 0.12779105448506867], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.17600000000002, 67, 118, 91.5, 111.0, 114.0, 117.0, 0.329595283359657, 0.30021173509998605, 0.10750471156457563], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.92600000000003, 56, 379, 81.0, 94.90000000000003, 99.0, 335.97, 0.3277538699538195, 0.17050562896787028, 96.91464285480176], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.79399999999995, 12, 366, 261.0, 334.0, 338.0, 349.96000000000004, 0.32955770061001133, 0.18367370636244099, 0.13806665386884262], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 424.8020000000003, 329, 542, 412.0, 499.0, 508.95, 530.99, 0.32949645692459867, 0.17720409550092356, 0.14029341329992678], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.691999999999998, 4, 312, 6.0, 9.0, 12.0, 29.99000000000001, 0.3274715918394079, 0.14765323112126275, 0.23760878196941418], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 399.5619999999995, 301, 515, 397.5, 459.0, 470.0, 495.95000000000005, 0.3294762645299033, 0.1694711360259232, 0.13256271580695328], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.543999999999999, 2, 18, 3.0, 5.0, 5.0, 10.980000000000018, 0.3279142228859206, 0.20133100690488978, 0.1639571114429603], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.246, 2, 51, 4.0, 5.0, 6.0, 9.990000000000009, 0.3279034704647507, 0.1920380764379059, 0.1546654064789791], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.2759999999996, 538, 887, 676.0, 785.0, 831.95, 853.0, 0.32774699505167587, 0.29948841869121445, 0.14434950660967366], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.944, 166, 317, 243.0, 289.0, 294.0, 311.97, 0.3278308025888143, 0.29028072950713263, 0.1347819998924715], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.567999999999999, 3, 54, 4.0, 5.0, 6.949999999999989, 10.0, 0.32790841649090774, 0.2186194873266676, 0.1533868471671336], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.38, 829, 8401, 930.0, 1095.5000000000002, 1114.0, 1229.7700000000002, 0.32772465361142733, 0.24634076477661304, 0.1811446815860038], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.078, 115, 167, 131.0, 151.0, 152.0, 156.0, 0.3295724719978749, 6.37217753620024, 0.16607362846767917], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.95200000000014, 160, 229, 173.0, 203.0, 207.0, 214.0, 0.3295466229380268, 0.6387250761829405, 0.23557434374085506], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.074000000000001, 5, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.3295383694705109, 0.2689438581544929, 0.20338696240758097], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.9979999999999976, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.3295401070082635, 0.2740943403711017, 0.20853709896616676], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.574000000000002, 5, 28, 8.0, 10.0, 11.0, 14.990000000000009, 0.3295329397831278, 0.2666867602809334, 0.20113094469185044], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.79599999999999, 7, 29, 9.0, 12.0, 14.0, 17.99000000000001, 0.32953576319823685, 0.2946867126154858, 0.22913033534877406], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.846000000000001, 5, 28, 8.0, 9.0, 11.0, 19.950000000000045, 0.3295377178985775, 0.24738177649005422, 0.18182501036396123], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.1600000000005, 1408, 2000, 1597.0, 1805.8000000000002, 1907.0, 1956.98, 0.32918884576515006, 0.27508807344696934, 0.20960071038952915], "isController": false}]}, function(index, item){
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
