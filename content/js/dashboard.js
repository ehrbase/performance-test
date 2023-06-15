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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8888321633694959, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.167, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.55, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.936, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.994, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.132, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.0194426717749, 1, 19022, 9.0, 847.0, 1508.0, 6024.980000000003, 15.187512963177145, 95.67006965547186, 125.67796583560721], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6166.827999999999, 5114, 19022, 6017.5, 6510.9, 6697.5, 16664.010000000086, 0.3275649151770652, 0.19024036201655514, 0.165062008038443], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3160000000000016, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.32867750688908054, 0.1687393087369712, 0.11876042729390605], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6860000000000017, 2, 13, 4.0, 5.0, 5.0, 7.990000000000009, 0.3286751302703879, 0.18863834063594692, 0.1386598205828199], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.437999999999992, 8, 362, 11.0, 14.0, 17.0, 31.980000000000018, 0.32661891933557874, 0.16991519972583607, 3.593765004056607], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.813999999999986, 25, 63, 35.0, 41.0, 43.0, 48.0, 0.32862026154229373, 1.3666976504226387, 0.1367111634931808], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3320000000000007, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.32863235701041826, 0.20530215342102995, 0.1389627056499132], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.728, 22, 57, 31.0, 36.0, 38.0, 47.0, 0.3286198295777564, 1.348724456996809, 0.1193814224637943], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 870.244, 673, 1094, 876.0, 1004.9000000000001, 1062.0, 1085.99, 0.32848101182663036, 1.389214846413776, 0.15974955457974796], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.794000000000002, 3, 17, 5.0, 8.0, 9.0, 13.0, 0.3285714567346963, 0.48859281531688414, 0.16781530456274038], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.894000000000001, 2, 16, 4.0, 5.0, 5.0, 9.0, 0.32684758770137895, 0.3152642879380166, 0.1787447745241916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.04599999999999, 5, 25, 8.0, 10.0, 11.0, 14.0, 0.32862134145860555, 0.535521209673232, 0.21469499749590537], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.9343783747300215, 2554.6221146058315], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.13, 2, 21, 4.0, 5.0, 6.0, 11.0, 0.32685036528796824, 0.328353749292369, 0.19183307572077044], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.232000000000008, 5, 20, 8.0, 10.0, 12.0, 13.0, 0.3286189656520885, 0.5162623205411828, 0.19543842781457216], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.719999999999999, 4, 20, 6.0, 8.0, 9.0, 14.970000000000027, 0.3286183177108185, 0.5085593108003039, 0.18773605064534066], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1584.0420000000004, 1333, 1998, 1566.5, 1778.0, 1847.6499999999999, 1940.97, 0.3282647074078183, 0.5012800836139449, 0.18080204587696244], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.660000000000005, 7, 55, 10.0, 13.0, 15.949999999999989, 31.980000000000018, 0.3266091050779877, 0.16991009410751448, 2.633285909691276], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.436000000000003, 8, 44, 11.0, 14.0, 14.949999999999989, 20.99000000000001, 0.32862242138201503, 0.5948932311914601, 0.27406596470726646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.04800000000001, 5, 30, 8.0, 10.0, 10.0, 15.0, 0.3286222053967653, 0.5563824255062754, 0.23555536988400952], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.7521913109756095, 1663.2050304878048], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.8542673802946592, 3521.9951369705336], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.422000000000001, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.3268426736253651, 0.2747233961094609, 0.13820593523416316], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 579.2759999999992, 451, 723, 569.0, 671.9000000000001, 688.9, 705.95, 0.32672969064579427, 0.28771038022677653, 0.15124011070908838], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4320000000000004, 2, 28, 3.0, 4.0, 5.0, 9.990000000000009, 0.3268467330688489, 0.29611228782744325, 0.1595931313812739], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 780.0500000000004, 632, 962, 759.5, 901.0, 921.0, 946.0, 0.32669894887880185, 0.30905911989100016, 0.17260169076507012], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.706419427710843, 793.3334902108434], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.02000000000001, 15, 673, 20.0, 25.0, 27.0, 49.0, 0.32646729091565585, 0.16983631889031156, 14.891881990888951], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.548, 20, 329, 28.0, 33.900000000000034, 40.0, 104.97000000000003, 0.326741860860246, 73.89940769358638, 0.10083049612484153], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 1.2667006340579712, 0.990715579710145], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6639999999999993, 1, 13, 2.0, 4.0, 4.0, 7.0, 0.32862242138201503, 0.3570912641562324, 0.14088402635420372], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.404000000000002, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.32862134145860555, 0.3371930953945033, 0.12098656809559989], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8360000000000014, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.328678803241036, 0.18639362092783396, 0.12742723133465944], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.12600000000006, 68, 123, 92.0, 111.0, 115.94999999999999, 119.0, 0.3286610873160484, 0.2993608229985854, 0.10720000308941421], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.68399999999997, 57, 386, 78.0, 91.0, 98.94999999999999, 305.9200000000001, 0.3266818726188975, 0.16994794957305948, 96.59766036159763], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.5039999999999, 13, 371, 259.0, 333.0, 336.0, 346.0, 0.32861788575139134, 0.18314991560271152, 0.13767292283920596], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 433.68399999999974, 341, 554, 422.5, 505.0, 517.95, 545.98, 0.32855332058984515, 0.17669687420120472, 0.13989184353239503], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.267999999999995, 4, 285, 6.0, 8.0, 11.0, 28.970000000000027, 0.32640953429193287, 0.14717436140422688, 0.2368381679481505], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.0719999999998, 299, 512, 397.0, 469.0, 478.0, 507.99, 0.32854662799453827, 0.1689929633115266, 0.13218868235717748], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5799999999999987, 2, 17, 3.0, 5.0, 5.0, 9.990000000000009, 0.3268392552248523, 0.20067100405509464, 0.16341962761242615], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.249999999999995, 2, 44, 4.0, 5.0, 6.0, 12.960000000000036, 0.326830282263705, 0.19140955915660793, 0.15415920540368117], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 681.7079999999995, 540, 878, 683.0, 793.0, 835.95, 855.97, 0.3266746157489832, 0.2985085006860167, 0.14387719892850726], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.11000000000013, 167, 328, 240.0, 292.90000000000003, 302.95, 318.99, 0.32676257366045314, 0.28933485660514596, 0.13434281592876052], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.5859999999999985, 3, 56, 4.0, 5.0, 6.0, 13.960000000000036, 0.3268520745954879, 0.21791521469441946, 0.1528927184875378], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.8719999999998, 822, 8708, 926.5, 1090.9, 1110.0, 1246.95, 0.3266808054119249, 0.24555613548204366, 0.18056771080385692], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.76799999999992, 117, 167, 136.0, 150.0, 151.0, 154.99, 0.3286299810446227, 6.353954777351545, 0.1655987013857669], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.71800000000007, 158, 298, 179.5, 203.0, 205.0, 212.0, 0.3285967211304779, 0.6368839828074909, 0.23489531237061503], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.230000000000002, 5, 20, 7.0, 9.0, 10.0, 14.0, 0.3285675702493894, 0.2681515665362472, 0.202787797263295], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.122000000000002, 5, 15, 7.0, 9.0, 10.0, 12.0, 0.32856951348054997, 0.2732870511001164, 0.20792289524941054], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.281999999999996, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.3285626043186269, 0.26590148029774346, 0.20053869892494317], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.721999999999996, 7, 21, 9.0, 12.0, 13.0, 17.980000000000018, 0.3285647634005139, 0.293818397942856, 0.2284551870519198], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.792000000000007, 5, 38, 7.0, 9.0, 11.0, 16.980000000000018, 0.3285487868664594, 0.24663939253136327, 0.18127935994096636], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1622.8859999999988, 1411, 1964, 1605.5, 1834.0, 1898.9, 1943.99, 0.32823561540239066, 0.27429150239841765, 0.20899377074449088], "isController": false}]}, function(index, item){
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
