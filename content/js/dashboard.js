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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916188045096788, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.188, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.632, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.985, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.105, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.95669006594414, 1, 17681, 9.0, 837.0, 1509.0, 6029.980000000003, 15.283441020742696, 96.27434528450088, 126.47177869822859], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6167.057999999994, 4951, 17681, 6010.5, 6563.200000000001, 6801.25, 15106.41000000007, 0.3296506955300025, 0.1914517237682107, 0.16611304579441533], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.265999999999998, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.3307265466923046, 0.1697912625601674, 0.11950080300405536], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5699999999999976, 2, 15, 3.0, 4.900000000000034, 5.0, 7.990000000000009, 0.33072392159197267, 0.18981421480353344, 0.13952415442161348], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.489999999999986, 8, 341, 12.0, 16.0, 18.94999999999999, 38.0, 0.3285818211450288, 0.17093634955289871, 3.6153626746494525], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.842000000000034, 24, 48, 34.0, 40.0, 42.0, 45.0, 0.330649998379815, 1.375139115820412, 0.13755556573222774], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3619999999999997, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.330658744964894, 0.2065680720131761, 0.1398195669626944], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.68799999999999, 21, 51, 30.0, 35.0, 36.0, 39.0, 0.3306495610627077, 1.3570548991932152, 0.12011878585481178], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.8819999999998, 661, 1104, 860.0, 986.0, 1034.95, 1068.0, 0.3305103343971359, 1.397797275661153, 0.16073647122048212], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.6919999999999975, 3, 17, 5.0, 7.0, 9.0, 15.0, 0.3306016818368758, 0.49161180366194257, 0.16885222617254497], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9120000000000004, 2, 22, 4.0, 5.0, 6.0, 11.970000000000027, 0.32880740895158445, 0.3171546541948921, 0.17981655177039774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.692, 5, 17, 7.0, 10.0, 11.0, 14.0, 0.3306521849827036, 0.538830671486804, 0.21602178882170772], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.8775196501014199, 2399.1684362322517], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9339999999999993, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.32881173358095045, 0.33032413911333947, 0.19298423035366333], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.897999999999997, 5, 16, 8.0, 10.0, 11.0, 13.990000000000009, 0.330650654357645, 0.5194541154020381, 0.19664672705449784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5859999999999985, 4, 17, 6.0, 8.0, 9.0, 13.0, 0.3306489050892157, 0.5117017835780576, 0.18889610300506948], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1556.5920000000006, 1317, 1910, 1538.0, 1731.7, 1794.85, 1885.94, 0.33031207885209946, 0.5044065437713051, 0.1819296996802579], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.521999999999995, 8, 47, 11.0, 14.0, 18.0, 30.99000000000001, 0.32857404777598087, 0.1709323056550222, 2.6491282601938453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.036000000000001, 8, 33, 11.0, 14.0, 15.0, 19.980000000000018, 0.33065349695831847, 0.5985700135220748, 0.27575985000234765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.717999999999994, 5, 18, 7.0, 10.0, 11.0, 14.0, 0.3306528409692096, 0.5598204462077425, 0.2370109231166014], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7227822580644], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.7835594383445946, 3230.4786475929054], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.28, 1, 29, 2.0, 3.0, 3.0, 6.990000000000009, 0.328794435746005, 0.27636392460053116, 0.13903124089650404], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.8059999999998, 427, 700, 544.0, 642.0, 655.95, 679.99, 0.3287012749665053, 0.28944651040043706, 0.15215273860754253], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3740000000000014, 1, 48, 3.0, 4.0, 5.0, 9.990000000000009, 0.3287994086871434, 0.2978813471026854, 0.16054658627301924], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 752.8799999999998, 617, 946, 728.0, 875.0, 887.95, 923.98, 0.32866324769245536, 0.3109173580782797, 0.1736394697281429], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.639238911290323, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.004000000000005, 17, 625, 22.0, 27.0, 30.94999999999999, 48.99000000000001, 0.3284410937613928, 0.1708631397047183, 14.981917470307282], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.731999999999992, 20, 235, 29.0, 36.0, 41.0, 101.98000000000002, 0.3286947924226647, 74.34110342656926, 0.10143315859918169], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 1.2083273329493087, 0.9450604838709677], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.622000000000003, 1, 24, 2.0, 4.0, 4.0, 7.0, 0.3306797386571889, 0.35932680859496163, 0.14176602077197847], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3679999999999954, 2, 9, 3.0, 4.0, 5.0, 8.0, 0.3306788638667867, 0.3393042861850307, 0.12174407390408065], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8280000000000003, 1, 13, 2.0, 3.0, 3.0, 6.0, 0.3307274217350093, 0.18755539167552465, 0.1282214711218737], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.08399999999996, 66, 122, 91.0, 110.0, 113.0, 116.0, 0.33071101545478715, 0.3012279992430025, 0.10786863199404191], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.24999999999994, 58, 307, 79.0, 91.90000000000003, 102.0, 289.8700000000001, 0.32863538101657436, 0.1709642127161517, 97.17529982227398], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.63399999999987, 12, 354, 261.0, 335.0, 339.0, 345.99, 0.3306749273672522, 0.1842963748025044, 0.13853471078178828], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 419.2439999999999, 316, 538, 415.0, 485.0, 496.0, 522.9200000000001, 0.33062288690647407, 0.17780989262525812, 0.14077302606564715], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.244000000000002, 4, 266, 6.0, 8.0, 11.0, 29.99000000000001, 0.32838738151783275, 0.1480661503130845, 0.23827326608178684], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.6980000000003, 281, 497, 395.0, 450.0, 460.0, 477.96000000000004, 0.33061020725953894, 0.17005439674382006, 0.1330189505770801], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4519999999999977, 2, 21, 3.0, 4.900000000000034, 5.0, 10.0, 0.32879119260456546, 0.20186944404532847, 0.16439559630228273], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.149999999999996, 2, 48, 4.0, 5.0, 6.0, 10.0, 0.3287818959536812, 0.19255253009998255, 0.15507974193908985], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.4819999999994, 531, 881, 676.5, 797.5000000000002, 832.95, 845.99, 0.32862479723850013, 0.3002905361562861, 0.14473611675250347], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.64200000000002, 166, 305, 232.0, 282.0, 287.0, 298.96000000000004, 0.328696953242201, 0.2910476703849962, 0.1351381028466471], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.486000000000002, 2, 37, 4.0, 5.0, 7.0, 11.0, 0.3288149771276302, 0.21922389944805118, 0.15381091215247544], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.7320000000004, 805, 8848, 935.0, 1079.0, 1102.0, 1187.7600000000002, 0.32864920575346446, 0.24703572281298744, 0.18165571333638758], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.3019999999998, 116, 165, 135.5, 149.0, 151.0, 155.0, 0.3307002975641278, 6.393983680064328, 0.16664194681942374], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.516, 159, 214, 178.0, 202.0, 205.0, 211.99, 0.33068148825187876, 0.6409246645980335, 0.23638559511755397], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.969999999999997, 5, 17, 7.0, 9.0, 10.0, 14.0, 0.33059796576459705, 0.2698086191104799, 0.20404093199533724], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.911999999999995, 5, 17, 7.0, 9.0, 10.0, 15.0, 0.33059905871836004, 0.2749751213877094, 0.2092072168452122], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.332, 6, 21, 8.0, 10.0, 11.949999999999989, 18.970000000000027, 0.3305931568538904, 0.2675447802894409, 0.20177804983757958], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.475999999999999, 7, 20, 9.0, 11.0, 12.0, 17.0, 0.3305951241186334, 0.2956340440494861, 0.22986692223873728], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.692000000000003, 5, 37, 7.0, 9.0, 10.0, 14.990000000000009, 0.33057020716173746, 0.24815685932353435, 0.18239469438123207], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.975999999999, 1430, 1964, 1600.5, 1805.6000000000001, 1862.8, 1937.99, 0.33025927995550747, 0.2759825863776634, 0.21028227590917078], "isController": false}]}, function(index, item){
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
