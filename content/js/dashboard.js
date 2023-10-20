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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8747713252499468, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.809, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.854, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.453, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 460.3046585832822, 1, 20110, 11.0, 996.0, 1853.9500000000007, 10415.990000000002, 10.75676754215756, 67.75969791968897, 89.01316936766179], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10508.044000000002, 8953, 20110, 10410.0, 11148.9, 11520.6, 18962.990000000063, 0.2315243563622893, 0.1345020851662345, 0.11666657019818485], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.746000000000001, 1, 14, 3.0, 4.0, 4.0, 6.0, 0.23245780425937085, 0.11934120339569712, 0.08399354255465548], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.117999999999993, 2, 18, 4.0, 5.0, 6.0, 8.0, 0.2324562912435575, 0.13341492863940543, 0.0980674978683758], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.881999999999985, 10, 469, 14.0, 18.0, 21.0, 47.90000000000009, 0.23117538814347668, 0.12026312599405416, 2.543606541223195], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.808000000000014, 26, 59, 44.0, 54.0, 55.94999999999999, 57.99000000000001, 0.2324241983340763, 0.9666281813352677, 0.09669209813507472], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4740000000000015, 1, 10, 2.0, 3.0, 4.0, 7.990000000000009, 0.23242906032649774, 0.1452023380678358, 0.09828299132946633], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.442, 23, 56, 37.0, 46.0, 48.0, 52.0, 0.23242203751384655, 0.9539086145310722, 0.08443456831557707], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1010.2480000000002, 738, 1431, 1007.5, 1247.9, 1380.95, 1415.91, 0.23234708192976333, 0.9826443663906693, 0.11299692070412319], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.626000000000003, 4, 18, 6.0, 9.0, 10.0, 13.990000000000009, 0.2323921142848644, 0.34557206674092367, 0.11869245680760164], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.321999999999996, 2, 19, 4.0, 5.0, 6.0, 11.0, 0.2312949463904573, 0.2230979799798033, 0.12648942380728134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.840000000000007, 6, 28, 9.0, 11.0, 12.0, 17.980000000000018, 0.2324204169250407, 0.37875222063182096, 0.15184497941684788], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.8600739314115308, 2351.4712506212722], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.836000000000005, 3, 23, 5.0, 6.0, 7.0, 11.0, 0.2312960163424513, 0.23235988766762022, 0.1357508845916145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.129999999999999, 6, 30, 9.0, 11.0, 13.0, 17.99000000000001, 0.2324194445826049, 0.3651323092719554, 0.13822601733477186], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.325999999999997, 4, 16, 7.0, 9.0, 10.0, 14.0, 0.23241879635883417, 0.3596839753689532, 0.13277831627921677], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2035.9279999999994, 1604, 2719, 2012.5, 2394.8, 2530.7, 2625.9700000000003, 0.23221510921541016, 0.3546065316711221, 0.12789972812255013], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.101999999999997, 9, 86, 13.0, 17.0, 19.94999999999999, 41.0, 0.23117036469899077, 0.12026051267460874, 1.8638110653856128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.311999999999985, 9, 29, 13.0, 16.0, 17.0, 23.0, 0.23242257771513733, 0.42074614896125706, 0.19383679821164773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.972000000000016, 6, 21, 9.0, 11.0, 13.0, 17.0, 0.23242160535462192, 0.3935074818548453, 0.16659908040067625], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.486979166666667, 2164.8065476190477], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.8081309886759582, 3331.7828560540074], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.72, 1, 22, 3.0, 3.0, 4.0, 8.0, 0.2312949463904573, 0.19441198565208057, 0.09780342947955861], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 670.8020000000002, 514, 887, 647.0, 806.0, 824.95, 851.98, 0.23123836003905154, 0.20362298987384095, 0.10703806900245158], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.702000000000001, 2, 25, 3.0, 4.0, 5.0, 11.0, 0.23129409043598936, 0.20954476624840984, 0.11293656759569792], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 930.1240000000001, 742, 1245, 894.5, 1126.8000000000002, 1149.95, 1196.99, 0.23121184137572895, 0.21872775669832267, 0.12215391228932557], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.151999999999994, 20, 1293, 27.0, 33.0, 37.0, 91.79000000000019, 0.23103321287261613, 0.12018916291930797, 10.538634153593653], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.12799999999999, 27, 288, 38.0, 44.0, 52.94999999999999, 119.99000000000001, 0.23124755744767447, 52.30140233938701, 0.07136155093111829], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 1.2515848747016707, 0.9788931980906922], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.117999999999998, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.2324301407968821, 0.2525657636387682, 0.09964534356428831], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.794000000000004, 2, 12, 4.0, 5.0, 5.0, 8.990000000000009, 0.23242960056043427, 0.23849229062974012, 0.08557222598758175], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.052000000000002, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.2324584527007488, 0.13182709772251155, 0.09012305246308328], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.936, 90, 168, 127.0, 154.0, 158.0, 162.0, 0.23244721356227213, 0.2117244536735028, 0.07581774348613174], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.20799999999996, 70, 465, 97.0, 115.0, 125.84999999999997, 404.3400000000006, 0.23121526279695553, 0.12028386977008416, 68.36881779520525], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.88000000000002, 14, 456, 318.0, 414.0, 423.0, 443.93000000000006, 0.23242679137138778, 0.12953934971051242, 0.09737411474445835], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.754, 368, 628, 448.0, 570.0, 591.0, 610.99, 0.2324098296342985, 0.12499064187295364, 0.09895574777397866], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.274000000000004, 5, 315, 7.0, 9.0, 12.0, 25.99000000000001, 0.23100215201604818, 0.10415625352278282, 0.16761191303508183], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 444.93400000000025, 319, 590, 451.5, 527.0, 542.9, 565.99, 0.23239665088538478, 0.11953675780062598, 0.09350334000466652], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.972, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.2312936624611311, 0.14200843606048608, 0.11564683123056556], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.492000000000001, 3, 26, 4.0, 5.0, 6.0, 10.0, 0.23129109464524109, 0.13545662340790776, 0.10909531124380026], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 768.8640000000001, 538, 1140, 740.0, 984.8000000000001, 1099.0, 1126.98, 0.23121408667198767, 0.2112786455467242, 0.10183354793854145], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 274.5399999999999, 187, 373, 267.5, 331.90000000000003, 340.95, 355.99, 0.23125258424762896, 0.2047646783819997, 0.0950755253596209], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.1479999999999935, 3, 38, 5.0, 6.0, 7.0, 11.990000000000009, 0.23129676531473706, 0.1542076314922111, 0.10819448299390534], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1242.7780000000005, 954, 10938, 1132.0, 1495.9, 1512.0, 1560.7900000000002, 0.23119772908342587, 0.17378437895781615, 0.12779093228634672], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.19600000000003, 144, 198, 166.5, 185.0, 186.95, 192.0, 0.23246677468622798, 4.4946701725077824, 0.11714146068173208], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 224.85999999999996, 195, 306, 221.5, 251.0, 253.0, 264.0, 0.2324488345247886, 0.4505307874704035, 0.16616459655482935], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.970000000000004, 5, 31, 8.0, 10.0, 11.949999999999989, 16.0, 0.2323899540611539, 0.18965879737153019, 0.14342817477211842], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.024000000000001, 5, 21, 8.0, 10.0, 12.0, 17.0, 0.23239092615685364, 0.19329069894243536, 0.14705988295863395], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.272000000000006, 6, 23, 9.0, 11.900000000000034, 12.0, 17.980000000000018, 0.23238757786145794, 0.18806827114215707, 0.14183812125333128], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.274000000000006, 8, 25, 11.0, 14.0, 15.0, 19.0, 0.2323887659552317, 0.20781320007115744, 0.16158281382824705], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.621999999999993, 6, 33, 9.0, 10.900000000000034, 12.0, 29.88000000000011, 0.23237202575425636, 0.1744401366382367, 0.12821308061636214], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2073.94, 1618, 2786, 1986.0, 2615.1000000000004, 2693.0, 2719.96, 0.23219030689057243, 0.19403082764583177, 0.14783992196548165], "isController": false}]}, function(index, item){
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
