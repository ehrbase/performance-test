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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8910870027653691, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.187, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.609, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.982, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.109, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.9291214635201, 1, 15504, 9.0, 838.0, 1510.0, 6011.0, 15.257537892311188, 96.1111747833566, 126.25742809994807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6143.211999999994, 5018, 15504, 6000.0, 6505.700000000001, 6764.95, 13221.810000000054, 0.3291751923041473, 0.1911755650539057, 0.16587343674701174], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.367999999999997, 1, 27, 2.0, 3.0, 4.0, 5.0, 0.33026626065934356, 0.16955495692502295, 0.11933448871480187], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5839999999999987, 2, 14, 3.0, 5.0, 5.0, 7.0, 0.33026342471281944, 0.1895499192753624, 0.13932988230072071], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.524000000000004, 8, 394, 11.0, 15.0, 18.94999999999999, 55.930000000000064, 0.32826427637751177, 0.1707711549502581, 3.6118687518998294], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.16200000000002, 23, 66, 33.0, 40.0, 42.0, 44.0, 0.3301953766043368, 1.3732483909166553, 0.13736643597016354], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1920000000000015, 1, 12, 2.0, 3.0, 4.0, 5.990000000000009, 0.33020388108433674, 0.20628391090670026, 0.139627227060076], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.49000000000001, 21, 56, 29.5, 35.0, 36.0, 39.99000000000001, 0.33020148234049457, 1.3552158904758005, 0.11995600725650776], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.9159999999993, 665, 1114, 858.0, 997.7, 1042.75, 1075.99, 0.33004825305459656, 1.3958430370957733, 0.16051174806756746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.630000000000001, 3, 15, 5.0, 8.0, 9.0, 12.0, 0.3301532967787603, 0.49094504544725204, 0.16862321700712074], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8239999999999954, 2, 18, 4.0, 5.0, 5.0, 10.0, 0.32850561481796847, 0.31686355548032774, 0.1796515081035765], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.738, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.3302075883024623, 0.5381061569103532, 0.21573132477963597], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.7794904279279279, 2131.153223536036], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.162, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.32850863649205336, 0.3300196478962307, 0.1928063384098868], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.14199999999999, 6, 20, 8.0, 10.0, 11.0, 14.0, 0.33020518950475825, 0.5187542875080075, 0.19638179727382596], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.546000000000002, 4, 15, 6.0, 8.0, 9.0, 12.0, 0.3302036630152746, 0.5110127410321638, 0.18864174107806211], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1566.2940000000006, 1329, 1938, 1557.0, 1758.8000000000002, 1788.85, 1891.98, 0.32986208466240263, 0.5037193753978961, 0.18168185131796394], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.885999999999987, 8, 54, 11.0, 15.0, 20.0, 33.0, 0.3282550094997, 0.17076633409236835, 2.646556014091331], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.991999999999999, 8, 22, 11.0, 13.0, 15.0, 18.0, 0.3302088967522634, 0.5977651699205452, 0.2753890603773759], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.86, 5, 32, 8.0, 10.0, 11.0, 14.0, 0.3302088967522634, 0.5590688148323892, 0.23669270528922007], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.764441287878788, 1377.6041666666665], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.8719308035714285, 3594.8183446898493], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3480000000000003, 1, 34, 2.0, 3.0, 4.0, 7.980000000000018, 0.32851036318791715, 0.2761251510737033, 0.13891112037145326], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.0500000000009, 432, 745, 546.5, 644.0, 657.0, 676.9300000000001, 0.32841391187603824, 0.28919346531029533, 0.15201972092699423], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.297999999999997, 2, 15, 3.0, 4.0, 5.0, 9.0, 0.3285144641633427, 0.2976231968251705, 0.16040745320475716], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.2460000000001, 615, 931, 751.0, 876.9000000000001, 892.95, 916.99, 0.32836667787491597, 0.3106368012931736, 0.17348278586946242], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 9.665975765306122, 1343.8097895408164], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.333999999999993, 17, 1436, 23.0, 28.0, 33.94999999999999, 49.97000000000003, 0.32794949577765026, 0.1706073983356563, 14.959493113060589], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.189999999999994, 21, 263, 29.0, 36.0, 41.94999999999999, 106.93000000000006, 0.32839838139005784, 74.27406396096231, 0.10134168800708815], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 1.1653645833333333, 0.9114583333333333], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.662000000000001, 1, 7, 3.0, 3.0, 4.0, 6.990000000000009, 0.3302071521548328, 0.35881328151777736, 0.1415634177695035], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.399999999999999, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.330205625647203, 0.3388187040271218, 0.12156984459862845], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8480000000000014, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.330266915115458, 0.18729423855146254, 0.12804293486409848], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.61599999999993, 65, 119, 90.0, 111.0, 114.0, 117.0, 0.33024401069462206, 0.3008026281396298, 0.10771630817578493], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.80199999999999, 59, 411, 81.0, 94.0, 105.94999999999999, 318.60000000000036, 0.32833045278082756, 0.17080558154382292, 97.08513456787773], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 215.4759999999998, 12, 374, 263.0, 334.0, 338.0, 347.98, 0.3302017004066764, 0.18403262933505302, 0.13833645456490642], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.1060000000002, 331, 533, 414.0, 492.0, 496.95, 513.99, 0.330151552768783, 0.1775564078372036, 0.1405723408273334], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.290000000000005, 4, 261, 6.0, 8.0, 10.0, 29.980000000000018, 0.3279015351038267, 0.14784708766873814, 0.23792074275599928], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 403.6619999999998, 307, 499, 408.5, 458.0, 465.0, 486.99, 0.3301402171530292, 0.16981265017253128, 0.13282985299516412], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5700000000000003, 2, 34, 3.0, 4.900000000000034, 6.0, 10.0, 0.32850885232804367, 0.20169609428434018, 0.16425442616402183], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.077999999999997, 2, 23, 4.0, 5.0, 5.0, 8.990000000000009, 0.32850431983180584, 0.19238996645149634, 0.1549488149206662], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.1379999999998, 533, 857, 685.5, 787.0, 820.95, 839.98, 0.328331962000172, 0.3000229493781064, 0.14460714341999767], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.96999999999989, 173, 316, 238.5, 290.0, 295.95, 310.98, 0.32840700925648, 0.290790936877874, 0.13501889736033015], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.473999999999998, 3, 31, 4.0, 5.0, 6.0, 12.0, 0.3285094998377163, 0.21902023499434306, 0.15366801799049423], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.2120000000002, 806, 8223, 931.0, 1076.9, 1107.0, 1144.95, 0.3283392926914957, 0.24680277048590932, 0.18148441373377594], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.34599999999992, 118, 174, 140.0, 150.0, 151.0, 155.99, 0.33023136009087967, 6.384916925141504, 0.16640564629579485], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.90599999999995, 160, 232, 181.0, 203.0, 204.0, 213.95000000000005, 0.3302062798630304, 0.6400036188544485, 0.23604589537083817], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.1600000000000055, 5, 24, 7.0, 9.0, 11.0, 13.990000000000009, 0.3301495907795822, 0.26944268995156706, 0.2037642005592734], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.029999999999999, 5, 21, 7.0, 9.0, 10.0, 12.990000000000009, 0.33015089876979176, 0.2746023652258001, 0.20892361562775882], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.393999999999998, 5, 22, 8.0, 10.0, 11.0, 15.0, 0.3301465388427307, 0.26718333809019473, 0.20150545583662763], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.760000000000005, 6, 20, 10.0, 12.0, 13.0, 16.0, 0.3301485007956579, 0.2952346520152264, 0.22955637945948087], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.739999999999998, 5, 27, 7.0, 9.0, 11.0, 17.980000000000018, 0.3301199457811001, 0.24781885109510687, 0.18214625914679838], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.9099999999996, 1403, 1952, 1601.0, 1799.8000000000002, 1851.85, 1942.97, 0.3298120401183366, 0.2756088484859978, 0.2099975099190971], "isController": false}]}, function(index, item){
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
