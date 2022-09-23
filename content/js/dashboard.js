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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9007232503722612, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.699, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.673, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 185.1870665815775, 1, 3296, 16.0, 547.0, 1225.0, 2194.980000000003, 26.49656857882349, 176.30975532629782, 219.52723320672172], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 23.958000000000016, 15, 59, 25.0, 28.0, 29.0, 36.0, 0.5740277691673613, 0.3333464462801852, 0.2903773285436456], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.9399999999999995, 4, 31, 7.0, 10.0, 12.0, 21.99000000000001, 0.573822888417844, 6.138391896501861, 0.2084590961830449], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.072000000000001, 5, 36, 8.0, 9.0, 11.0, 21.960000000000036, 0.5738057667479558, 6.161460201190647, 0.24319502223497347], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.768000000000008, 15, 253, 20.0, 26.0, 29.94999999999999, 60.88000000000011, 0.5703855806525211, 0.30796588024754734, 6.351109756445357], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.86600000000001, 28, 97, 46.0, 55.0, 57.0, 60.98000000000002, 0.5736471106542331, 2.385836426964397, 0.2397665657812615], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5339999999999994, 1, 15, 2.0, 3.0, 4.0, 9.980000000000018, 0.5736833107493337, 0.3584870816557877, 0.24370335954683606], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.05800000000003, 25, 63, 41.0, 49.0, 50.94999999999999, 55.99000000000001, 0.5736398711834305, 2.3543379131067534, 0.20951299982676078], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 761.9119999999998, 586, 972, 754.5, 898.0, 919.95, 950.97, 0.5732879900752382, 2.4245222468704206, 0.27992577640392496], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.104, 6, 52, 11.0, 14.0, 16.0, 25.0, 0.5734970935167301, 0.852802499285996, 0.29402927157840164], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4080000000000052, 2, 27, 3.0, 5.0, 7.0, 13.980000000000018, 0.5712477307183897, 0.5510677351998281, 0.31351682096067873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.544000000000015, 11, 63, 18.0, 22.0, 23.0, 36.940000000000055, 0.5736023604884339, 0.9346772041961308, 0.37586639051537024], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.7396149263431543, 2049.899466529463], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.399999999999999, 2, 25, 4.0, 6.0, 8.0, 19.940000000000055, 0.5712568679356947, 0.5739814954190912, 0.3363944251613515], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.963999999999967, 11, 42, 19.0, 22.0, 24.0, 35.97000000000003, 0.5735859099768386, 0.9012042902218517, 0.3422470615193832], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.479999999999995, 6, 62, 11.0, 13.0, 15.0, 23.970000000000027, 0.573583277982547, 0.8877567968184483, 0.32880213298413585], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1897.612, 1510, 2365, 1886.0, 2156.8, 2218.5, 2310.79, 0.5725199580457374, 0.8742402123419273, 0.31645146118543693], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.62800000000001, 12, 224, 17.0, 23.0, 27.94999999999999, 47.99000000000001, 0.5703491449325618, 0.3078492928668714, 4.599553944192477], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.623999999999995, 14, 66, 22.0, 26.0, 28.0, 38.98000000000002, 0.5736365805752887, 1.038465953808488, 0.47952432907465536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.71799999999998, 11, 128, 19.0, 22.0, 23.0, 32.99000000000001, 0.5736280251707977, 0.9711309596366641, 0.4122951430915109], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.852294921875, 1420.6746419270833], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.6370066933240612, 2659.868306675939], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2979999999999996, 1, 20, 2.0, 3.0, 4.0, 9.0, 0.5711955236549202, 0.47998162285501805, 0.24264653592762725], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 408.7620000000001, 318, 622, 406.0, 474.90000000000003, 485.0, 544.9100000000001, 0.5709965717365832, 0.5027089504854613, 0.2654241876431774], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.058000000000004, 1, 33, 3.0, 4.0, 5.0, 12.990000000000009, 0.5712620893339656, 0.5175121286082341, 0.28005231332583075], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.5839999999994, 933, 1493, 1176.5, 1344.0, 1373.9, 1417.98, 0.5706407610978216, 0.5397971821473897, 0.3025956379649581], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.321262668918919, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 43.756, 11, 659, 42.0, 49.0, 57.0, 94.95000000000005, 0.5699298188421078, 0.30672910437808687, 26.069836635316726], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.62800000000001, 9, 202, 44.0, 53.0, 56.0, 91.98000000000002, 0.5707202260965248, 126.96056777138602, 0.1772353827135692], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.7657039141414141, 1.3875736531986533], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1559999999999997, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.5738584520742114, 0.6235072955342336, 0.24714021227024144], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.083999999999998, 2, 22, 3.0, 4.0, 6.0, 10.0, 0.5738518658793419, 0.5887877056541625, 0.21239243864088925], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.215999999999997, 1, 26, 2.0, 3.0, 4.0, 7.990000000000009, 0.5738386939431326, 0.32542369917941066, 0.2235953504719823], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.34, 86, 213, 119.0, 149.0, 154.0, 160.99, 0.5737715264732445, 0.5227170670922521, 0.18826878212403333], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 167.68199999999996, 28, 541, 171.0, 197.0, 217.95, 338.9200000000001, 0.5704753885507872, 0.30592856920779227, 168.75820771465277], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.292000000000001, 1, 24, 2.0, 3.0, 4.0, 9.980000000000018, 0.5738485728385994, 0.3199228209535068, 0.24153196766937143], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0940000000000003, 1, 11, 3.0, 4.900000000000034, 5.0, 8.990000000000009, 0.573891385316415, 0.3086403562574247, 0.24547307301620094], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.563999999999993, 6, 333, 10.0, 13.900000000000034, 19.0, 44.99000000000001, 0.5697336950762474, 0.24068689266388107, 0.414503518390434], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.2299999999999995, 2, 49, 4.0, 5.0, 6.0, 9.990000000000009, 0.5738610865944902, 0.295206696155475, 0.2320102439942568], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6579999999999995, 2, 20, 3.0, 5.0, 6.0, 9.0, 0.5711883459299403, 0.350792198966606, 0.2867097752031146], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8639999999999963, 2, 27, 4.0, 5.0, 6.0, 10.980000000000018, 0.5711720335894849, 0.3345417072674787, 0.2705258166903322], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 531.9939999999998, 380, 823, 537.0, 637.0, 650.0, 725.6600000000003, 0.570664858800394, 0.5213970877973592, 0.25245232523103367], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.191999999999991, 5, 107, 13.0, 25.0, 35.0, 47.98000000000002, 0.5708485892618813, 0.5054306788588508, 0.2358095246657967], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.612, 5, 64, 10.0, 12.0, 13.0, 21.980000000000018, 0.5712666581357513, 0.3807391858507531, 0.2683391235969691], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 526.5380000000006, 351, 3296, 511.0, 585.0, 619.95, 685.8800000000001, 0.5710793971685884, 0.4291985132661744, 0.3167706031169514], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.87400000000008, 142, 244, 175.0, 190.0, 193.0, 211.99, 0.5739006073016226, 11.09628081200623, 0.29031300252171927], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 257.7519999999996, 209, 444, 262.0, 283.90000000000003, 287.95, 307.95000000000005, 0.5737563830397613, 1.1121483052670835, 0.4112667823742039], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.300000000000004, 11, 33, 19.0, 21.0, 22.0, 28.99000000000001, 0.5734661786851797, 0.46792152057998077, 0.35505620828750384], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.02199999999998, 11, 48, 18.0, 21.0, 22.0, 25.99000000000001, 0.5734707828105573, 0.47691824005544314, 0.3640195398699827], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.907999999999994, 11, 35, 18.0, 21.0, 22.0, 28.970000000000027, 0.5734378978225416, 0.4641733383776754, 0.3511187128268883], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.184, 13, 67, 21.0, 25.0, 26.0, 30.0, 0.5734497359837416, 0.5129037480388019, 0.3998467885667885], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.957999999999966, 11, 40, 18.0, 21.0, 22.0, 29.0, 0.5732281803559288, 0.4303185883998106, 0.3174027131463004], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2167.9280000000017, 1685, 2875, 2153.0, 2490.0, 2584.0, 2696.92, 0.5721452241893846, 0.47808320836728063, 0.36541306310532967], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
