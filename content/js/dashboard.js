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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8896405020208467, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.173, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.578, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.957, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.993, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.115, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.507423952348, 1, 18185, 9.0, 843.0, 1514.0, 6067.980000000003, 15.145208431058212, 95.403582473247, 125.32789222215742], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6214.129999999998, 5240, 18185, 6049.0, 6537.7, 6742.25, 15901.840000000077, 0.3266007847563656, 0.18968042256099432, 0.16457617669363736], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3300000000000014, 1, 7, 2.0, 3.0, 4.0, 5.990000000000009, 0.3276711754220405, 0.1682226695616415, 0.11839681143179197], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.638000000000004, 2, 15, 3.0, 5.0, 5.0, 7.990000000000009, 0.32766838386744374, 0.18806053308860873, 0.13823509944407783], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.132000000000007, 8, 340, 11.0, 15.0, 19.0, 48.92000000000007, 0.325624711008069, 0.16939798808701995, 3.58282579973429], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.34800000000003, 23, 62, 33.0, 40.0, 41.0, 43.0, 0.3275977518931874, 1.3624451386377308, 0.1362857835024393], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1759999999999966, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.3276037619395191, 0.2046595728030564, 0.1385277626170037], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.618000000000027, 21, 68, 29.0, 35.0, 36.0, 41.98000000000002, 0.32760247405388404, 1.3445490173154289, 0.11901183627738757], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 855.1120000000002, 678, 1112, 854.5, 997.8000000000001, 1061.0, 1084.99, 0.3274546491683634, 1.3848741442382062, 0.159250405552583], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.565999999999997, 3, 29, 5.0, 7.0, 8.0, 12.990000000000009, 0.32753744899423076, 0.4870552235918019, 0.1672871931874831], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.010000000000002, 2, 30, 4.0, 5.0, 6.0, 10.0, 0.3258422206799024, 0.3142945505739711, 0.17819496443432162], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.735999999999998, 5, 20, 7.5, 10.0, 10.0, 13.0, 0.32761170412469687, 0.5338759050682842, 0.2140353809174045], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.0179227941176472, 2783.0353860294117], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.208000000000005, 2, 18, 4.0, 5.0, 6.0, 10.990000000000009, 0.3258477417773951, 0.327346514105297, 0.19124462188302196], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.075999999999995, 6, 26, 8.0, 10.0, 10.0, 14.990000000000009, 0.3276104161766161, 0.5146778834057462, 0.1948386166519133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.605999999999998, 4, 21, 6.0, 8.0, 8.949999999999989, 12.0, 0.32760998686283954, 0.5069988498841899, 0.1871600022605089], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1575.2819999999997, 1280, 1962, 1553.5, 1765.8000000000002, 1812.95, 1909.97, 0.32726625335120646, 0.4997553838162256, 0.18025211610359418], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.889999999999988, 7, 70, 10.0, 14.900000000000034, 21.899999999999977, 33.99000000000001, 0.32561283591848217, 0.16939181037317835, 2.6252534895927626], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.934000000000001, 8, 21, 11.0, 13.0, 14.0, 17.99000000000001, 0.3276132067435903, 0.5930662865943952, 0.27322429546779886], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.767999999999999, 5, 19, 8.0, 10.0, 11.0, 13.990000000000009, 0.32761299208290445, 0.5546737504922385, 0.23483196893442562], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7227822580644], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.9486036554192229, 3910.9271152862984], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4219999999999997, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.3258345763922423, 0.27387605297516293, 0.13777965974398526], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.7740000000001, 430, 724, 564.5, 650.9000000000001, 659.95, 684.99, 0.32573502107505586, 0.28683449790389515, 0.1507796874898208], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.344, 2, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.3258456182562176, 0.2952053110473395, 0.15910430578916876], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 769.5739999999997, 613, 961, 758.0, 893.0, 906.8, 933.97, 0.32570573919568924, 0.3081195377111876, 0.17207695791491004], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.936468160377359, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.139999999999986, 17, 675, 22.0, 27.0, 31.94999999999999, 64.95000000000005, 0.32547167354930767, 0.1693183742348161, 14.846466671375158], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.270000000000014, 21, 254, 29.0, 35.0, 40.94999999999999, 84.0, 0.32573671873676696, 73.67207408112115, 0.10052031554767418], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.2456391033254157, 0.9742428741092637], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.762, 1, 8, 3.0, 4.0, 4.0, 6.0, 0.3276159973581046, 0.35599765275423495, 0.14045256136739057], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4180000000000033, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.3276149240392037, 0.3361604265988591, 0.12061604136990214], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8219999999999996, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.32767160489620023, 0.18582243913991447, 0.12703674525760889], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.72799999999997, 64, 118, 91.0, 110.0, 113.0, 117.0, 0.32765550038565056, 0.29844488453583995, 0.10687200891485085], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.58799999999998, 57, 389, 79.0, 92.0, 102.94999999999999, 327.5600000000004, 0.32568112951426614, 0.1694273383823679, 96.30174727111782], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.87399999999997, 13, 375, 261.0, 334.0, 338.0, 344.0, 0.3276104161766161, 0.1825884185704654, 0.1372508481833675], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 431.1059999999999, 315, 544, 424.0, 499.0, 510.0, 527.9200000000001, 0.3275945323162178, 0.17618123524596124, 0.1394836094627646], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.4040000000000035, 4, 278, 6.0, 8.900000000000034, 10.0, 28.980000000000018, 0.3254168101212438, 0.14672675332136667, 0.23611786125008216], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 408.00199999999967, 295, 530, 410.0, 465.0, 474.0, 505.98, 0.32755332731945425, 0.16848204397698216, 0.13178903403868666], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6000000000000014, 2, 14, 3.0, 5.0, 5.0, 10.0, 0.3258320283760597, 0.20005259234405517, 0.16291601418802987], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.282000000000003, 2, 27, 4.0, 5.0, 6.0, 9.990000000000009, 0.3258269324632451, 0.1908219430346999, 0.15368594568334704], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.664000000001, 535, 869, 678.0, 790.6000000000001, 833.8, 846.0, 0.32566734123228613, 0.29758807408638915, 0.14343356532789164], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.76999999999987, 168, 325, 241.0, 289.0, 294.95, 312.95000000000005, 0.3257430851257889, 0.28843214132266026, 0.13392367074019254], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.491999999999995, 3, 51, 4.0, 5.0, 6.0, 9.990000000000009, 0.32584986532625065, 0.2172470327703951, 0.15242391161257232], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 984.1759999999994, 824, 8580, 938.0, 1084.0, 1113.95, 1135.99, 0.3256830387530248, 0.24480614429549874, 0.18001621087325395], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.13400000000013, 118, 170, 134.0, 150.0, 151.0, 158.99, 0.32769200621566197, 6.335819336310633, 0.16512605000711092], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.08, 159, 243, 177.5, 203.0, 205.95, 214.99, 0.32766537763107106, 0.6350788590216436, 0.234229547290961], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.047999999999998, 5, 25, 7.0, 9.0, 10.0, 12.990000000000009, 0.32752715036312935, 0.26730245588864343, 0.2021456631147439], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.925999999999995, 5, 39, 7.0, 8.0, 9.0, 14.990000000000009, 0.32753122682716573, 0.2724234582040677, 0.20726585447656581], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.240000000000002, 5, 19, 8.0, 10.0, 10.949999999999989, 14.990000000000009, 0.3275243612619907, 0.2650612435756097, 0.19990500565307048], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.679999999999984, 7, 17, 9.0, 11.0, 13.0, 16.99000000000001, 0.3275254339875763, 0.2928889796452769, 0.22773252831948665], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.7760000000000025, 5, 37, 8.0, 9.0, 10.0, 16.970000000000027, 0.3275121326869554, 0.24586118312284128, 0.18070737789856425], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1636.558000000001, 1339, 1978, 1620.0, 1829.9, 1894.6, 1953.96, 0.3272079995811738, 0.27343277082188105, 0.2083394684833255], "isController": false}]}, function(index, item){
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
