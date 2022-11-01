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

    var data = {"OkPercent": 97.78770474367155, "KoPercent": 2.212295256328441};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8993192937672836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.489, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.983, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.977, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.742, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.602, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 520, 2.212295256328441, 190.18068496064666, 1, 3400, 18.0, 558.0, 1239.8500000000022, 2250.9900000000016, 25.86579717385491, 171.64182856116895, 214.30121683004504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 28.54200000000001, 18, 63, 30.0, 34.0, 36.0, 45.0, 0.5605123531317507, 0.3254978435688494, 0.28354042863500667], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.154000000000005, 5, 24, 8.0, 11.0, 13.0, 18.99000000000001, 0.5605180083225714, 5.9977178509291145, 0.20362568271093412], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.413999999999993, 5, 39, 8.0, 10.0, 12.0, 22.980000000000018, 0.5604979014958568, 6.0186571184914985, 0.2375547746574237], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.31199999999997, 13, 260, 20.0, 27.0, 31.0, 45.98000000000002, 0.5568697682085277, 0.30060526175106583, 6.200614352650032], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.103999999999985, 28, 68, 46.0, 55.0, 57.0, 60.0, 0.5602900061071611, 2.330251606981774, 0.23418371349010247], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.672000000000002, 1, 14, 2.0, 4.0, 5.0, 8.990000000000009, 0.56031449331881, 0.35013308519805997, 0.2380242232360179], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.55800000000001, 24, 73, 41.0, 49.0, 52.0, 62.98000000000002, 0.5602837276796969, 2.299394569660076, 0.20463487710176434], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 763.6739999999999, 574, 1515, 754.5, 894.9000000000001, 916.95, 1200.7200000000003, 0.5599436472713386, 2.368055272667359, 0.2734099840192083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.676000000000002, 8, 51, 13.0, 16.0, 18.0, 22.99000000000001, 0.5598320503848846, 0.8325774142757173, 0.2870232680195941], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.628000000000002, 2, 27, 3.0, 5.0, 6.0, 14.980000000000018, 0.5576635236750472, 0.5379002333682431, 0.3060614260794693], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.81200000000001, 13, 48, 22.0, 25.0, 27.0, 34.97000000000003, 0.560258615376858, 0.9129337539708329, 0.36712258878698406], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.6266634544787077, 1736.8458035058736], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.7999999999999945, 3, 24, 4.0, 6.0, 8.0, 15.990000000000009, 0.557672231491974, 0.5603004797235954, 0.3283948785055277], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 21.866000000000014, 14, 63, 23.0, 27.0, 29.0, 36.0, 0.560230366726798, 0.8802203841219509, 0.33427808014655624], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.600000000000003, 8, 31, 13.0, 16.0, 17.0, 25.99000000000001, 0.5602247173386189, 0.8670495096493105, 0.32114444245875906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2004.3279999999997, 1512, 2708, 1993.0, 2248.9, 2321.5, 2550.7300000000005, 0.5589002631302439, 0.8533479156233862, 0.30892338762863086], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.075999999999997, 12, 76, 16.5, 23.0, 28.94999999999999, 37.99000000000001, 0.5568331783480988, 0.3005224313285483, 4.490555065233007], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 25.748, 16, 44, 27.0, 31.0, 34.0, 40.99000000000001, 0.5602849833539332, 1.0143587559376201, 0.4683632282724285], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 21.066000000000024, 13, 44, 22.0, 26.0, 28.0, 34.98000000000002, 0.5602780772152836, 0.9485934621571378, 0.402699867998485], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 4.955535239361702, 1450.901761968085], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.69924856870229, 2919.7638358778627], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4439999999999973, 1, 23, 2.0, 3.0, 4.0, 12.970000000000027, 0.5576629016985296, 0.46867319064877383, 0.2368978146863871], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 411.60200000000066, 313, 841, 408.5, 473.90000000000003, 495.84999999999997, 645.7600000000002, 0.5574179508647225, 0.4907542478034945, 0.25911225059727333], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2699999999999987, 1, 29, 3.0, 4.0, 6.0, 12.990000000000009, 0.5576485966215418, 0.5052742839931432, 0.27337851123438867], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1180.518, 921, 2052, 1169.5, 1351.9, 1377.95, 1800.5500000000004, 0.5570695467904995, 0.5268332915066949, 0.2953991835031653], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 8, 1.6, 43.963999999999984, 10, 674, 42.0, 50.900000000000034, 58.89999999999998, 104.99000000000001, 0.5564235763346376, 0.29861905753531065, 25.452031558119554], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.396, 8, 226, 47.0, 57.0, 66.94999999999999, 90.99000000000001, 0.5571912213408695, 123.47564126267054, 0.17303399256484034], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 1.6235729489164086, 1.2758804179566563], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3599999999999963, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.5605349745797389, 0.6091580992399146, 0.24140226932584458], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.268000000000001, 2, 19, 3.0, 5.0, 6.0, 10.0, 0.560529319046562, 0.5751184083153403, 0.20746153507680373], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.299999999999999, 1, 24, 2.0, 3.0, 4.0, 8.980000000000018, 0.560529319046562, 0.3177807116816552, 0.2184093733394319], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.7699999999999, 82, 271, 120.0, 149.90000000000003, 157.0, 203.99, 0.560464602737085, 0.5105624546023672, 0.183902447773106], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, 2.2, 167.43800000000013, 34, 652, 167.5, 198.0, 228.64999999999992, 355.9100000000001, 0.556957851657618, 0.29829009066159906, 164.7594457266852], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3619999999999997, 1, 16, 2.0, 4.0, 4.0, 7.990000000000009, 0.5605255487545122, 0.31255868001838527, 0.23592432764960428], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4120000000000017, 2, 17, 3.0, 4.900000000000034, 6.0, 11.990000000000009, 0.5605720525682049, 0.3014136803825568, 0.23977593654772822], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.929999999999996, 6, 306, 10.0, 15.0, 20.0, 42.98000000000002, 0.5562521068048545, 0.23511755310538862, 0.4046951362984537], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.677999999999999, 2, 59, 4.0, 6.0, 7.0, 13.970000000000027, 0.5605368597828256, 0.28841592073224054, 0.22662330073250958], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.0420000000000025, 2, 32, 4.0, 5.0, 7.0, 11.990000000000009, 0.5576554380885356, 0.3424178657188011, 0.2799168898217845], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1560000000000015, 2, 27, 4.0, 5.0, 7.0, 11.990000000000009, 0.5576405114678772, 0.326584561652735, 0.2641168438104691], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 517.8079999999995, 375, 1043, 508.5, 628.0, 639.0, 797.6000000000004, 0.5571458975676125, 0.5089506010768515, 0.2464717691387973], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.091999999999974, 5, 129, 16.0, 27.0, 33.94999999999999, 48.99000000000001, 0.557326615689859, 0.493552993749582, 0.23022378753594758], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.687999999999997, 7, 69, 12.0, 14.0, 15.0, 23.0, 0.5576815615976015, 0.3717481326730012, 0.26195784289887336], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 560.286, 410, 3400, 536.0, 641.5000000000002, 685.95, 778.0, 0.5574496455735153, 0.41892340864849675, 0.3092103502790593], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.19000000000017, 142, 361, 172.0, 189.0, 193.0, 254.96000000000004, 0.5603703824079563, 10.834739454389773, 0.2834686114133998], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 267.6659999999998, 31, 474, 269.5, 296.0, 303.0, 362.99, 0.5604413587788655, 1.0845240844069521, 0.4017226145934446], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.66800000000002, 14, 50, 21.0, 25.0, 26.0, 34.99000000000001, 0.5598107391852962, 0.45681103007695156, 0.34660157094089633], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.615999999999993, 13, 45, 22.0, 26.0, 27.0, 35.99000000000001, 0.5598213945822725, 0.4656303515426438, 0.35535537742038775], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.80800000000001, 13, 51, 22.0, 25.900000000000034, 27.0, 40.940000000000055, 0.5597743885304467, 0.4530816087384141, 0.34275248203963876], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 23.50200000000001, 15, 58, 24.0, 29.0, 31.0, 37.97000000000003, 0.5597844158257772, 0.5006495336016193, 0.3903184305660204], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.856000000000005, 14, 54, 22.0, 25.0, 27.0, 40.98000000000002, 0.5595607671801942, 0.4201219398321094, 0.3098349169835646], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2204.652000000002, 1714, 3066, 2182.0, 2511.4, 2652.8, 2899.5700000000006, 0.5584944776066054, 0.46655014261156486, 0.3566947151901562], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.15384615384616, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19230769230769232, 0.0042544139544777706], "isController": false}, {"data": ["500", 19, 3.6538461538461537, 0.08083386513507765], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 520, "No results for path: $['rows'][1]", 500, "500", 19, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 11, "500", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
