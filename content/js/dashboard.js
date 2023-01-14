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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8713465220165922, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.478, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.802, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.841, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.492, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.79038502446366, 1, 26158, 12.0, 1027.0, 1848.9500000000007, 10420.960000000006, 10.178602978621685, 64.20752371110002, 84.33094055780303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10985.104000000014, 9023, 26158, 10540.5, 12522.300000000001, 13164.55, 24227.52000000009, 0.21919412840304364, 0.1273637757810654, 0.1108814047976334], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0160000000000005, 2, 13, 3.0, 4.0, 4.0, 7.0, 0.21996615160859048, 0.11292813043178915, 0.07990957851405825], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.5120000000000005, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.21996470006493357, 0.1261832657345149, 0.09322722639470818], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.254, 11, 436, 14.0, 19.0, 21.0, 43.97000000000003, 0.21865503538494438, 0.12848332162253406, 2.4346725717374373], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.681999999999974, 28, 90, 45.0, 55.0, 58.0, 75.92000000000007, 0.21990452625088291, 0.9145601611229469, 0.09191321995642372], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.786000000000001, 1, 21, 3.0, 3.900000000000034, 4.0, 8.990000000000009, 0.21990974903899438, 0.13740622567248403, 0.09341869221871345], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.98400000000001, 25, 93, 39.0, 49.0, 51.0, 58.99000000000001, 0.21990355909512324, 0.9025177074592167, 0.08031633896638289], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1117.4420000000011, 769, 1687, 1120.0, 1417.0, 1484.55, 1595.7300000000002, 0.21983239977840893, 0.9297794174221573, 0.10734003895430123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.695999999999998, 4, 24, 6.0, 8.0, 9.0, 15.990000000000009, 0.2198185793301073, 0.3268749501286598, 0.11269995522295538], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.346000000000002, 2, 22, 4.0, 5.0, 6.0, 11.980000000000018, 0.21883092641197374, 0.21107567805309624, 0.12010056703469651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.282000000000002, 6, 26, 10.0, 12.0, 14.0, 19.0, 0.21990288209115325, 0.3584159279395847, 0.14409651746402719], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.7268137442572741, 1811.3200492917304], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.611999999999999, 3, 14, 4.0, 6.0, 7.0, 10.0, 0.21883255458121578, 0.21983909885082273, 0.1288633109496808], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.785999999999998, 8, 34, 17.0, 20.0, 20.0, 24.0, 0.2199016248091254, 0.34547919642668656, 0.13121083277185117], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.662000000000005, 5, 21, 7.0, 9.0, 10.0, 14.0, 0.21990152809571872, 0.34031264705914693, 0.12605683300018253], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2224.7519999999995, 1591, 3378, 2179.0, 2863.9000000000005, 3085.75, 3324.5000000000005, 0.21966329132053225, 0.33543914577229444, 0.12141545203849732], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.048, 9, 83, 12.0, 17.0, 23.0, 46.91000000000008, 0.21864987202422992, 0.12848028759345642, 1.763291643726651], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.707999999999991, 9, 36, 14.0, 18.0, 19.0, 26.99000000000001, 0.2199049131155688, 0.39808587547994245, 0.18382676330754583], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.226000000000006, 7, 37, 10.0, 12.0, 14.0, 20.0, 0.21990384924095788, 0.37225168979615353, 0.15805589164193848], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.285030241935484, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.7472073485967503, 2824.882293205317], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7939999999999974, 2, 16, 3.0, 3.0, 4.0, 8.990000000000009, 0.21881416725454741, 0.18398339649039583, 0.09295328394114075], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 707.542, 519, 1116, 704.0, 845.9000000000001, 868.0, 935.8000000000002, 0.218759693788931, 0.19257262028829905, 0.10168907640969842], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6679999999999975, 2, 13, 3.0, 5.0, 5.0, 10.0, 0.21883130950843924, 0.19825390053132244, 0.10727863024730128], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 963.3940000000005, 743, 1300, 926.5, 1161.0, 1200.0, 1272.92, 0.2187581624139351, 0.20694650342969048, 0.11600164276442065], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 8.59375, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.692, 20, 667, 27.0, 34.900000000000034, 40.94999999999999, 76.92000000000007, 0.2185867839807364, 0.12844321659086808, 9.99863765786884], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.89800000000002, 25, 269, 34.0, 43.900000000000034, 51.0, 113.97000000000003, 0.21871959797588136, 49.49522404569358, 0.06792268765266628], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.5297111742424242, 0.41627209595959597], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9879999999999987, 2, 10, 3.0, 4.0, 4.0, 6.0, 0.21993306117350123, 0.23892376553772096, 0.09471726560304107], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.776, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.2199319970265194, 0.2257309852293671, 0.08140061218071373], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0720000000000005, 1, 15, 2.0, 3.0, 3.0, 5.990000000000009, 0.21996692577304075, 0.12473069861715592, 0.08570976892914381], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 195.85000000000016, 90, 422, 192.0, 268.0, 280.0, 340.8700000000001, 0.2199497986579543, 0.2003411881897076, 0.07217102768464126], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 113.28199999999998, 82, 472, 108.0, 131.90000000000003, 148.89999999999998, 284.98, 0.21868630761290775, 0.12856363006149457, 64.6918518575215], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 262.40199999999993, 18, 515, 314.0, 428.0, 443.9, 491.9100000000001, 0.21992890138476032, 0.12259876470884493, 0.09256773095393721], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 509.2659999999995, 297, 1006, 484.0, 806.9000000000001, 896.0, 936.9200000000001, 0.21996953861829216, 0.11828776013597637, 0.09408853311993355], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.218000000000009, 4, 263, 7.0, 9.0, 12.0, 31.0, 0.21856337419885594, 0.1028165654153622, 0.15901339236147233], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 515.592, 293, 1067, 461.5, 876.9000000000001, 917.0, 992.8900000000001, 0.21990288209115325, 0.11311039748655402, 0.08890604803294672], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9939999999999998, 2, 22, 4.0, 5.0, 6.0, 12.0, 0.21881282663284696, 0.1343455197581418, 0.10983378211844076], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.482000000000001, 2, 73, 4.0, 5.0, 6.0, 10.990000000000009, 0.21880602801854948, 0.12814469049121516, 0.10363371444237941], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 859.7119999999994, 573, 1630, 848.5, 1114.5000000000002, 1259.8, 1340.9, 0.2187134748497001, 0.19985584526524694, 0.09675508213565835], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 466.7480000000001, 246, 1703, 387.0, 819.7, 888.8, 937.9100000000001, 0.2187193109466828, 0.19366697893404958, 0.09034987161176448], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.614, 4, 39, 5.0, 7.0, 8.0, 13.0, 0.21883351233914644, 0.1459602430933955, 0.10279191351086858], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1195.287999999999, 893, 10699, 1099.0, 1421.8000000000002, 1447.95, 1749.4800000000014, 0.21874820899903882, 0.164364498992227, 0.12133689717915434], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.22000000000006, 143, 282, 172.0, 189.0, 193.0, 240.81000000000017, 0.2200451444618378, 4.254564272656178, 0.11131189924924997], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.08799999999997, 194, 378, 226.5, 259.0, 264.0, 327.96000000000004, 0.22002713374613359, 0.4264426670346987, 0.1577147618844356], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.33199999999999, 6, 33, 9.0, 11.0, 13.0, 22.99000000000001, 0.2198160667080214, 0.1794592107108456, 0.13609705692664606], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.020000000000003, 6, 29, 9.0, 11.0, 13.0, 18.99000000000001, 0.2198173230118842, 0.1827703761316196, 0.13953248042746555], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.000000000000004, 6, 25, 10.0, 12.0, 13.0, 19.99000000000001, 0.21981374741553988, 0.17789243224680865, 0.13459298791947608], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.242000000000008, 8, 29, 12.0, 15.0, 17.0, 23.99000000000001, 0.21981461714448502, 0.19658124249333084, 0.15326917640738508], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.269999999999994, 6, 36, 9.0, 11.0, 12.0, 28.930000000000064, 0.21977606577106454, 0.16498443312390138, 0.1216924114181578], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2008.7900000000004, 1620, 2846, 1952.5, 2464.9, 2559.8, 2629.9, 0.21961900495021236, 0.18352556516205687, 0.14026448167718641], "isController": false}]}, function(index, item){
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
