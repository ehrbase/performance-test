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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8735162731333759, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.785, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 463.41127419698006, 1, 19852, 11.0, 1022.9000000000015, 1861.0, 10364.950000000008, 10.699649171681914, 67.39988144266367, 88.54050997763339], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10503.259999999993, 8948, 19852, 10344.0, 11259.9, 11481.85, 18861.170000000056, 0.2302902624526005, 0.1337721051304986, 0.11604470256400573], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.877999999999997, 2, 13, 3.0, 4.0, 4.0, 7.0, 0.23122392372200226, 0.11870774310536504, 0.08354770681361409], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.153999999999994, 2, 13, 4.0, 5.0, 6.0, 9.0, 0.2312228544368891, 0.13270701541123447, 0.09754714171556259], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.209999999999987, 10, 438, 14.0, 18.0, 21.94999999999999, 76.76000000000022, 0.22997736562767493, 0.11963988519874874, 2.5304247837177867], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.57400000000002, 26, 63, 44.0, 54.0, 56.0, 58.0, 0.23115647120229565, 0.9613558354237585, 0.09616470384001755], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6259999999999986, 1, 12, 2.0, 4.0, 5.0, 8.0, 0.2311625627606358, 0.14441113576524053, 0.09774745085483916], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.379999999999995, 23, 55, 38.5, 47.0, 49.0, 52.0, 0.2311552956753618, 0.9487096412966796, 0.08397438475706503], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1037.0839999999992, 734, 1459, 1032.5, 1268.9, 1374.8, 1417.95, 0.23108254314657706, 0.9772963676077273, 0.11238193992870642], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.848000000000001, 4, 23, 7.0, 9.0, 10.0, 14.990000000000009, 0.23114332735442594, 0.343715093745955, 0.11805464863902809], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.394000000000005, 2, 20, 4.0, 5.0, 6.0, 10.980000000000018, 0.23007599410085153, 0.2219222266927266, 0.12582280927390316], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.466000000000001, 6, 27, 9.0, 12.0, 13.0, 17.99000000000001, 0.23115465448389177, 0.3766895346521631, 0.1510180311032457], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.8287685584291188, 2265.881300886015], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.053999999999997, 3, 16, 5.0, 6.0, 8.0, 12.990000000000009, 0.23007768803214093, 0.23113595552299188, 0.13503583057355145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.651999999999989, 6, 23, 9.0, 12.0, 13.949999999999989, 17.0, 0.2311531583842949, 0.36314296623476466, 0.13747292329690974], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.662, 5, 19, 7.0, 9.0, 11.0, 15.0, 0.23115262406770368, 0.35772448719368233, 0.13205496589805338], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2038.1739999999998, 1632, 2667, 1986.5, 2405.8, 2541.75, 2627.91, 0.23096363108086823, 0.3526954487865864, 0.12721043743125945], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.302000000000001, 10, 83, 13.0, 17.0, 19.94999999999999, 43.960000000000036, 0.22997112482556692, 0.1196366385799099, 1.854142193906133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.894000000000014, 9, 29, 14.0, 17.0, 18.0, 23.99000000000001, 0.23115743300595276, 0.4184559034545554, 0.1927816872920739], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.606000000000002, 6, 24, 10.0, 13.0, 13.0, 18.0, 0.23115647120229565, 0.39136551336731645, 0.16569223619383303], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.994570974576272, 2311.573093220339], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.8224595523049646, 3390.85702016844], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.922000000000001, 2, 31, 3.0, 4.0, 4.0, 10.990000000000009, 0.2300880639055792, 0.1933975561368858, 0.09729309733507402], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 691.7479999999999, 510, 909, 677.0, 822.0, 842.9, 869.96, 0.23003100817990266, 0.2025598245956055, 0.10647919714577525], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.748000000000004, 2, 14, 4.0, 5.0, 5.949999999999989, 9.0, 0.23008795802459364, 0.20845205033105058, 0.11234763575419612], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 971.1299999999993, 685, 1225, 961.5, 1145.0, 1170.95, 1212.99, 0.2300039192667843, 0.21758505530559238, 0.12151574250325224], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.4005126953125, 1028.8543701171875], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.193999999999992, 20, 1511, 27.0, 35.0, 38.94999999999999, 88.96000000000004, 0.2298126796847889, 0.11955421151844133, 10.482959246168448], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.05799999999997, 27, 279, 38.0, 45.0, 49.94999999999999, 122.99000000000001, 0.2300467777117799, 52.02982124775877, 0.07099099780949458], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 1.1375576193058567, 0.8897098698481561], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1800000000000006, 2, 9, 3.0, 4.0, 5.0, 6.990000000000009, 0.23119804979821035, 0.2512269355380533, 0.09911713267716243], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9499999999999966, 2, 13, 4.0, 5.0, 6.0, 8.990000000000009, 0.23119719456076232, 0.23722773857122909, 0.08511849838809316], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.234, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.23122499301700522, 0.13112760321768074, 0.08964484592553815], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.5, 87, 180, 124.0, 153.0, 157.0, 164.99, 0.23121419359194487, 0.21060135791517862, 0.07541556705049765], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 103.60399999999994, 69, 644, 98.0, 116.90000000000003, 124.94999999999999, 511.2300000000016, 0.23001407686150394, 0.11965898328602709, 68.01363509071754], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 253.994, 15, 443, 318.0, 416.0, 423.0, 436.98, 0.2311939874766841, 0.12885226620392418, 0.0968576373315405], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 489.8899999999997, 360, 668, 476.0, 589.0, 610.0, 636.99, 0.23117367801020494, 0.124325836149414, 0.09842941759028256], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.492000000000008, 5, 294, 7.0, 10.0, 13.0, 28.99000000000001, 0.2297838469308691, 0.10360693356098785, 0.16672792799769112], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 459.1859999999999, 323, 615, 461.0, 550.0, 561.0, 594.9300000000001, 0.23116448647733986, 0.11890297526609345, 0.09300758635611721], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.073999999999999, 2, 15, 4.0, 5.0, 6.949999999999989, 13.0, 0.23008689922009745, 0.14126751407096433, 0.11504344961004871], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.633999999999994, 3, 32, 4.0, 5.900000000000034, 6.0, 12.0, 0.23008372286507614, 0.13474952093692855, 0.10852581849983572], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 770.6379999999995, 528, 1148, 732.0, 966.9000000000001, 1099.6999999999998, 1122.99, 0.23000730503200784, 0.21017591346826175, 0.10130204547796438], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 279.4299999999999, 192, 393, 273.5, 337.90000000000003, 347.0, 372.96000000000004, 0.23004931797278702, 0.2036992354483454, 0.09458082311185871], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.332000000000002, 3, 52, 5.0, 6.0, 7.0, 12.0, 0.2300787467518633, 0.1533955675732076, 0.10762472626381106], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1260.2579999999998, 934, 10775, 1160.5, 1491.0, 1513.0, 1565.91, 0.22998318362961298, 0.17287144167143498, 0.12711961126402438], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.56599999999997, 144, 195, 168.0, 185.0, 186.95, 190.0, 0.2312228544368891, 4.470619375359552, 0.11651464149358864], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.09199999999987, 197, 314, 232.0, 253.0, 256.0, 264.98, 0.23120564030783644, 0.4481212366946934, 0.16527590693880492], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.519999999999998, 5, 21, 8.0, 11.0, 12.0, 16.99000000000001, 0.23114012176461615, 0.18863878042959703, 0.14265679390159902], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.468000000000004, 5, 29, 8.0, 11.0, 12.949999999999989, 23.930000000000064, 0.2311411902846735, 0.19225123357163992, 0.14626903447701994], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.406000000000002, 6, 23, 9.0, 12.0, 13.0, 16.99000000000001, 0.23113787790465193, 0.18705690507652745, 0.14107536493203854], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.62, 8, 26, 11.0, 15.0, 15.949999999999989, 21.99000000000001, 0.23113862585313266, 0.20669526472653524, 0.16071357578850629], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.837999999999989, 6, 29, 9.0, 11.0, 12.0, 18.980000000000018, 0.23112804817448135, 0.17350629092988823, 0.12752670626814644], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2060.6999999999966, 1700, 2723, 1986.0, 2524.9, 2661.95, 2705.96, 0.23094400208403867, 0.19298934767903586, 0.1470463763269465], "isController": false}]}, function(index, item){
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
