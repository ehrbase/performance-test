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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8707083599234205, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.805, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.829, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.488, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.2858115294623, 1, 24392, 13.0, 1015.9000000000015, 1835.9000000000015, 10469.0, 10.136778587397533, 68.32703846269747, 83.98442048450825], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11015.796000000015, 9005, 24392, 10561.5, 12733.0, 13226.55, 22632.750000000076, 0.21827627227782204, 0.1268180878725703, 0.11041709867178888], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.938, 5, 34, 8.0, 9.0, 10.0, 14.990000000000009, 0.21907139142317977, 2.3391240850757176, 0.07958452891545204], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.220000000000002, 6, 35, 9.0, 11.0, 12.949999999999989, 16.0, 0.21906860790662422, 2.3522962429186074, 0.0928474373354247], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.790000000000006, 10, 480, 14.0, 20.0, 27.0, 50.960000000000036, 0.21776244730148775, 0.12795883024001778, 2.42473381262848], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.01199999999995, 29, 86, 48.0, 57.0, 59.0, 71.0, 0.21900642915273422, 0.9108250682588288, 0.09153784343493188], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.833999999999999, 1, 21, 3.0, 4.0, 5.0, 9.990000000000009, 0.21901189716427777, 0.13683281584472232, 0.09303728053365314], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.78399999999999, 25, 88, 42.0, 50.0, 52.94999999999999, 67.99000000000001, 0.21900460654289403, 0.8988406737928576, 0.07998801059281482], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1121.778, 757, 1817, 1127.0, 1414.7, 1513.95, 1591.98, 0.21893517811033544, 0.9259846253865848, 0.10690194243668723], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.697999999999992, 4, 19, 6.0, 8.0, 10.0, 16.0, 0.21891581504766017, 0.3255325202453346, 0.11223711220705232], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.2739999999999965, 2, 19, 4.0, 5.0, 6.0, 11.0, 0.2179323450827925, 0.21020894195480955, 0.11960740032864198], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.457999999999998, 7, 29, 10.0, 13.0, 15.0, 21.0, 0.21900278396338974, 0.35694887347157955, 0.14350670706976026], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.8225465771230503, 2049.899466529463], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.689999999999997, 3, 24, 4.0, 6.0, 7.0, 12.0, 0.21793386491761663, 0.2189362755658217, 0.12833410209504184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.739999999999991, 7, 34, 16.0, 20.0, 21.0, 22.99000000000001, 0.2190018247232036, 0.3440531498539696, 0.1306739403377709], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.560000000000002, 5, 20, 7.0, 9.0, 10.0, 15.990000000000009, 0.21900192064684407, 0.3389204430354104, 0.1255411400582983], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2249.742, 1578, 3648, 2208.0, 2880.5000000000005, 3228.0, 3399.9700000000003, 0.21875471689858314, 0.3340516976186362, 0.12091325172324029], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.524000000000015, 10, 83, 13.0, 19.0, 27.899999999999977, 42.97000000000003, 0.21775723117325418, 0.12795576520435425, 1.756092983426497], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.613999999999997, 9, 43, 14.0, 17.0, 19.94999999999999, 24.99000000000001, 0.21900479839513284, 0.3964564305010173, 0.18307432365843138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.262000000000002, 7, 39, 10.0, 13.0, 14.0, 19.99000000000001, 0.21900374321197896, 0.3707279966391686, 0.1574089404336099], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 6.4208984375, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.6744791666666666, 2549.9270833333335], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6859999999999973, 2, 19, 2.0, 3.0, 4.0, 8.0, 0.21791961729828488, 0.1832312407166243, 0.09257327492651751], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 708.3380000000009, 533, 1340, 690.5, 848.8000000000001, 874.9, 953.98, 0.217867012232797, 0.19178679899110143, 0.10127411896758923], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.636000000000002, 2, 17, 3.0, 5.0, 6.0, 9.0, 0.2179331049975548, 0.19744015706765775, 0.10683829952028565], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 954.424, 731, 1335, 921.0, 1152.0, 1183.0, 1243.92, 0.21786150631188356, 0.2060982615033054, 0.11552616985093044], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 7.262323943661973, 927.4455325704226], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.624000000000013, 20, 578, 27.0, 34.0, 41.94999999999999, 78.95000000000005, 0.21770347219621874, 0.12792417603045583, 9.958233044600474], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.49000000000001, 25, 245, 34.0, 43.0, 51.0, 97.96000000000004, 0.21783341146291693, 49.29468417450069, 0.06764748520039802], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.50087303008596, 0.39360971824259794], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0460000000000007, 2, 22, 3.0, 4.0, 4.0, 7.990000000000009, 0.2190408725887433, 0.23795453855973617, 0.09433303204261309], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.813999999999999, 2, 23, 4.0, 5.0, 6.0, 9.0, 0.2190397211011039, 0.22480277595062145, 0.08107036552472499], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3080000000000007, 1, 20, 2.0, 3.0, 4.0, 7.990000000000009, 0.21907455895909791, 0.12423709680970482, 0.08536205959441412], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 196.17799999999988, 88, 480, 193.5, 274.0, 306.95, 340.8900000000001, 0.21905545914681404, 0.19952657939533683, 0.07187757253254835], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.58800000000001, 83, 384, 112.0, 134.90000000000003, 151.89999999999998, 274.83000000000015, 0.21779944156223183, 0.12804224982467144, 64.4294988652649], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 258.49399999999997, 17, 578, 318.0, 433.80000000000007, 454.95, 548.8000000000002, 0.21903722625275054, 0.12210170284468026, 0.09219242628411668], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 506.5799999999995, 304, 990, 476.5, 793.5000000000002, 905.9, 973.98, 0.21907398303666334, 0.11781858710753992, 0.09370547321294781], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.200000000000006, 4, 268, 7.0, 10.0, 12.949999999999989, 41.92000000000007, 0.21768015645108202, 0.1024010821914558, 0.15837081694927357], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 512.39, 280, 1058, 454.0, 884.7, 929.0, 977.8800000000001, 0.21901276055948124, 0.11265254991629331, 0.08854617467932151], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9299999999999997, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.21791847756921526, 0.13379641214115365, 0.10938486081111], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.311999999999999, 2, 28, 4.0, 5.0, 6.0, 11.0, 0.21791600819712856, 0.12762344655849606, 0.10321217185117906], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 846.5760000000001, 575, 1481, 833.5, 1152.2000000000003, 1243.0, 1351.8600000000001, 0.2178280021381997, 0.19904671863353007, 0.09636336422715278], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 474.6579999999998, 249, 1039, 386.5, 864.5000000000002, 907.6499999999999, 986.8200000000002, 0.21783217773363045, 0.19288145886021493, 0.08998340935676337], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.567999999999992, 3, 37, 5.0, 7.0, 7.0, 13.990000000000009, 0.21793471983402093, 0.14536075551429326, 0.10236972679703522], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1192.6879999999994, 901, 10853, 1102.5, 1410.0, 1432.0, 1647.93, 0.21785106481243457, 0.1636903967656088, 0.1208392625131473], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 167.44399999999987, 143, 279, 163.5, 186.0, 190.0, 242.92000000000007, 0.2191337031141529, 4.2369415898018685, 0.11085083809876094], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.39999999999992, 193, 317, 228.0, 255.90000000000003, 262.0, 308.9200000000001, 0.21911929818718223, 0.42469556865730707, 0.15706402819276538], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.202, 6, 28, 9.0, 11.0, 12.0, 17.99000000000001, 0.2189130354831761, 0.17872197037493673, 0.1355379536097008], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.191999999999995, 6, 33, 9.0, 11.0, 12.0, 24.950000000000045, 0.2189146648744853, 0.18201984762444753, 0.1389595040707182], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.043999999999988, 7, 31, 10.0, 12.0, 14.0, 21.0, 0.21891083105118792, 0.17716171367229488, 0.13404012799716292], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.264000000000005, 8, 34, 12.0, 15.0, 16.94999999999999, 22.0, 0.21891178949442322, 0.1957614401932991, 0.15263966572169743], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.334000000000007, 6, 31, 9.0, 11.0, 13.0, 19.980000000000018, 0.21888543536313093, 0.16431584279100817, 0.12119925962001488], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1988.1339999999998, 1582, 2870, 1925.5, 2474.7000000000003, 2591.5499999999997, 2695.8900000000003, 0.21872974015781788, 0.18278244721723275, 0.13969653326485634], "isController": false}]}, function(index, item){
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
