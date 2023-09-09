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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8932142097426079, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.216, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.653, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.986, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.131, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.45296745373145, 1, 17607, 9.0, 840.0, 1489.9500000000007, 6074.0, 15.307946651105812, 96.42871258410253, 126.67456488073412], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6189.319999999997, 5225, 17607, 6063.5, 6503.6, 6723.7, 14275.820000000062, 0.3299833424408736, 0.19164491560841007, 0.16628066865184646], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3160000000000007, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.3311025848516594, 0.16998431629137292, 0.1196366761671035], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.603999999999999, 2, 13, 3.0, 5.0, 5.0, 8.0, 0.3311001730329504, 0.19003015888007355, 0.13968288549827595], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.088000000000003, 8, 381, 11.0, 15.0, 17.0, 37.98000000000002, 0.32919318043407414, 0.1712543937002301, 3.6220894179206184], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.257999999999974, 23, 53, 33.0, 40.0, 41.0, 44.0, 0.3310370397343759, 1.3767487807492031, 0.1377165809832462], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.212000000000001, 1, 19, 2.0, 3.0, 4.0, 6.0, 0.33104514926163686, 0.20680946526773608, 0.13998295862332888], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.108000000000004, 21, 42, 29.0, 34.0, 36.0, 38.98000000000002, 0.3310372589055643, 1.35864609216309, 0.12025962921178704], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 850.7779999999996, 675, 1085, 854.0, 996.9000000000001, 1060.0, 1078.98, 0.3308874135722076, 1.3993920222961866, 0.16091985542867127], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.440000000000004, 3, 15, 5.0, 7.0, 8.0, 11.990000000000009, 0.33101359009395487, 0.49222432008981065, 0.16906260509681487], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8380000000000027, 2, 30, 4.0, 5.0, 5.0, 8.990000000000009, 0.3293992087831005, 0.31772548096401976, 0.1801401923032581], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.533999999999998, 5, 15, 7.0, 9.0, 10.0, 13.0, 0.3310390122855198, 0.5394610451083689, 0.21627451095606715], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.8775196501014199, 2399.1684362322517], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.06, 2, 23, 4.0, 5.0, 6.0, 11.0, 0.32940528511015643, 0.33092042074772365, 0.19333259409297268], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.841999999999993, 6, 25, 8.0, 10.0, 11.0, 13.990000000000009, 0.3310368205634776, 0.5200607847740939, 0.19687639035464638], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.380000000000002, 4, 13, 6.0, 8.0, 9.0, 11.0, 0.3310357247133396, 0.5123004133891371, 0.18911708882549186], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1546.242, 1335, 1942, 1529.0, 1747.6000000000001, 1782.95, 1877.99, 0.3307153903036893, 0.5050224247771309, 0.1821518360657039], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.785999999999994, 8, 98, 11.0, 14.0, 16.94999999999999, 48.940000000000055, 0.32917410874464187, 0.17124447213804508, 2.6539662517536753], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.675999999999998, 8, 26, 10.0, 13.0, 14.0, 18.0, 0.33103857393878966, 0.5992671043906971, 0.2760809981872328], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.4560000000000075, 5, 18, 7.0, 9.0, 10.949999999999989, 13.0, 0.33104010815742413, 0.5604761190562576, 0.23728851502690362], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.017869015957447, 1450.880984042553], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 1.1204521437198067, 4619.42840428744], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2460000000000013, 1, 16, 2.0, 3.0, 3.0, 6.0, 0.3294068042269481, 0.2768786430333755, 0.1392901818654966], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 554.9480000000003, 421, 731, 546.0, 640.0, 649.9, 684.9100000000001, 0.3293044037219301, 0.2899776112110367, 0.15243192125409655], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2519999999999984, 2, 24, 3.0, 4.0, 5.0, 8.0, 0.32940528511015643, 0.2984302510249446, 0.16084242437019358], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 763.1719999999991, 617, 947, 745.0, 883.9000000000001, 894.95, 922.97, 0.3292575637047534, 0.3114795845082341, 0.173953458949484], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.683999999999997, 16, 609, 23.0, 27.0, 33.94999999999999, 61.99000000000001, 0.32904413337343286, 0.1711768557513295, 15.009425263547898], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.554000000000006, 21, 236, 29.0, 35.0, 41.0, 97.0, 0.3293252257853748, 74.48368892807767, 0.1016277063947055], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 1.1017102153361344, 0.8616727941176471], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6919999999999997, 1, 7, 3.0, 3.0, 4.0, 5.990000000000009, 0.3310484370210143, 0.35972744761489533, 0.14192408579318874], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3520000000000016, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.3310473410939658, 0.33968237476644614, 0.12187973397697764], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8180000000000005, 1, 9, 2.0, 3.0, 3.0, 7.0, 0.3311034618853561, 0.18776864389789563, 0.12836726012547495], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.5, 68, 124, 92.0, 110.90000000000003, 114.0, 118.0, 0.33108504515337844, 0.301568684047859, 0.10799062996213712], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.00400000000002, 59, 364, 80.5, 93.0, 102.89999999999998, 304.98, 0.3292573468838097, 0.17128777466647876, 97.35921099897338], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.7260000000001, 13, 353, 262.0, 333.0, 336.0, 341.99, 0.33104383417617095, 0.18450197910418215, 0.1386892625601341], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.23799999999994, 302, 524, 407.5, 485.90000000000003, 496.95, 508.0, 0.3309945260125288, 0.17800976115269507, 0.14093126302877204], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.986000000000001, 4, 250, 6.0, 8.0, 10.0, 25.960000000000036, 0.3289943366914882, 0.1483398195252217, 0.23871366422048412], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.6320000000001, 297, 518, 394.0, 453.0, 460.0, 479.98, 0.3309798459752189, 0.17024452604844487, 0.13316767240409197], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4300000000000015, 2, 14, 3.0, 4.0, 5.0, 10.990000000000009, 0.32940441704970913, 0.20224594828449471, 0.16470220852485454], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.073999999999999, 2, 24, 4.0, 5.0, 5.949999999999989, 9.0, 0.32939942579092096, 0.19291418910261054, 0.15537101821974103], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.4759999999999, 532, 897, 668.0, 789.5000000000002, 829.8499999999999, 844.99, 0.32924347093734957, 0.3008558673738158, 0.1450085990163522], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.53200000000007, 177, 314, 235.5, 282.0, 287.0, 300.99, 0.3293286963852882, 0.29160705302686, 0.13539783318184212], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4739999999999975, 3, 37, 4.0, 5.0, 6.0, 10.980000000000018, 0.3294072382628907, 0.2196187652680255, 0.1540879561796139], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 981.4379999999993, 818, 7905, 935.5, 1098.0, 1114.0, 1134.0, 0.32923176401720694, 0.24747361433758241, 0.1819777133141984], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.67399999999992, 116, 169, 135.0, 150.0, 152.0, 159.0, 0.33110170782260895, 6.401744818051334, 0.16684421995748655], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.6320000000001, 160, 262, 177.5, 202.0, 204.95, 212.0, 0.33107145316530795, 0.6416804920036312, 0.2366643590986381], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.927999999999998, 5, 36, 7.0, 9.0, 10.0, 12.990000000000009, 0.33101096043492195, 0.2701456735791686, 0.2042958271434284], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.699999999999995, 5, 17, 7.0, 8.0, 9.0, 13.0, 0.33101117957157883, 0.2753179021024506, 0.20946801207263976], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.159999999999993, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.33100964562107343, 0.2678818392799216, 0.20203225440739345], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.371999999999991, 7, 25, 9.0, 11.0, 12.0, 15.0, 0.3310098647559895, 0.29600492505440146, 0.23015529658814893], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.512000000000004, 5, 28, 7.0, 9.0, 10.0, 13.980000000000018, 0.33095311850504505, 0.24844430832618475, 0.18260596870639692], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1621.3260000000012, 1409, 1964, 1595.0, 1831.4, 1872.0, 1947.97, 0.3306335997799303, 0.2762953883473478, 0.21052061235987748], "isController": false}]}, function(index, item){
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
