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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8899595830674325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.18, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.607, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.936, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.111, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.0180387151666, 1, 17299, 9.0, 843.0, 1509.9500000000007, 6070.950000000008, 15.207371482992071, 95.7951636045967, 125.84229678175335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6199.696000000006, 4951, 17299, 6055.0, 6534.8, 6809.9, 14654.000000000065, 0.32792454587369263, 0.19044922527006225, 0.16524322819416543], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.456, 1, 17, 2.0, 3.0, 4.0, 6.0, 0.32894498789811394, 0.16887663045695064, 0.11885707570537318], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6960000000000024, 2, 15, 4.0, 5.0, 5.0, 7.990000000000009, 0.32894260740962955, 0.1887918552741342, 0.1387726625009375], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.430000000000016, 8, 346, 12.0, 15.900000000000034, 20.0, 49.850000000000136, 0.326961293668133, 0.17009331127924915, 3.5975321247645065], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.711999999999996, 23, 59, 34.0, 40.0, 41.0, 43.0, 0.3288560675917607, 1.367678343372761, 0.13680926249422856], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.303999999999999, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.3288645032205701, 0.20544717905784265, 0.13906086903760434], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.976000000000006, 21, 60, 30.0, 35.0, 36.0, 39.98000000000002, 0.3288597446075223, 1.3497091184174612, 0.11946857909570148], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.7780000000001, 660, 1081, 868.0, 998.9000000000001, 1041.8, 1076.97, 0.3287131602943429, 1.3901966507991346, 0.15986245490877224], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.783999999999999, 4, 16, 5.0, 8.0, 9.0, 11.990000000000009, 0.3288234106484858, 0.4889674761997615, 0.16794398805581842], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9019999999999984, 2, 20, 4.0, 5.0, 5.0, 8.0, 0.32716796214274074, 0.3155733084843813, 0.17891997929681136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.922000000000002, 5, 24, 8.0, 10.0, 11.0, 15.990000000000009, 0.328866017353602, 0.5359199334161419, 0.21485484922808568], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.7629932760141094, 2086.0494516093477], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.218, 3, 24, 4.0, 5.0, 6.0, 9.990000000000009, 0.32717160150498936, 0.32867646307050546, 0.19202161377392443], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.208000000000002, 5, 16, 8.0, 10.0, 11.0, 13.0, 0.32886580104802954, 0.5166501003945074, 0.1955852273811035], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.652, 4, 27, 6.0, 8.0, 9.0, 13.980000000000018, 0.32886515213301937, 0.5089413039421066, 0.1878770644509925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1565.7160000000008, 1312, 1930, 1544.5, 1757.9, 1796.95, 1891.97, 0.3285425262160509, 0.5017043297551766, 0.18095506326743427], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.618, 8, 53, 11.0, 14.0, 18.0, 32.99000000000001, 0.3269533829866538, 0.17008919594806673, 2.636061650329896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.129999999999997, 8, 21, 11.0, 13.0, 15.0, 17.99000000000001, 0.3288681804249766, 0.5953381198589682, 0.27427092390911134], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.980000000000002, 6, 26, 8.0, 10.0, 11.0, 14.0, 0.3288668825787373, 0.5567966826128736, 0.23573075372343083], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.275082236842104, 2392.6809210526317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.076257975638051, 4437.223571635731], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4160000000000004, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.32717524094820616, 0.2750029312856744, 0.13834656184626298], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 562.0179999999992, 446, 702, 548.0, 651.0, 664.95, 692.0, 0.3270740089984601, 0.28801357876367334, 0.15139949244655285], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3880000000000003, 1, 17, 3.0, 4.0, 5.949999999999989, 8.990000000000009, 0.32717374234413443, 0.296408547373122, 0.1597528038789719], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 764.7980000000002, 589, 940, 743.0, 890.0, 907.95, 926.0, 0.3270355016659189, 0.3093775007996018, 0.17277949843873253], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.802000000000024, 17, 747, 22.0, 27.0, 32.0, 74.99000000000001, 0.32679546329466036, 0.17000704223798682, 14.906851650872643], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.08, 21, 234, 29.0, 35.0, 41.94999999999999, 102.97000000000003, 0.32708641884855116, 73.97733658578528, 0.10093682456654508], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.776000000000002, 1, 10, 3.0, 4.0, 4.0, 7.0, 0.3288965192881364, 0.3573891073995139, 0.14100153512450378], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4120000000000013, 2, 18, 3.0, 4.0, 5.0, 7.0, 0.32889284144997016, 0.3374716771874005, 0.1210865246353894], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.880000000000001, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.3289462863609002, 0.18654531050062334, 0.12753093328640366], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.62199999999997, 64, 126, 91.0, 109.90000000000003, 113.94999999999999, 118.99000000000001, 0.3289239975054404, 0.29960029464189386, 0.10728575699884482], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.438, 58, 455, 81.0, 96.0, 102.0, 351.93000000000006, 0.327019673503558, 0.17012368190632848, 96.69754583998274], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.826, 12, 358, 261.0, 332.0, 335.0, 344.98, 0.32888916369405674, 0.18330110801937025, 0.13778657346167028], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 433.39199999999977, 314, 556, 421.5, 504.0, 514.95, 536.98, 0.3288677478084253, 0.17686597401911905, 0.14002572074655611], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.314000000000001, 4, 281, 6.0, 8.0, 10.0, 23.99000000000001, 0.32673887160077214, 0.14732285586600832, 0.23707713046813841], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 403.45600000000013, 277, 509, 399.0, 466.0, 475.95, 493.96000000000004, 0.32883811628373466, 0.1691428947537167, 0.13230596084853385], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.542000000000001, 2, 19, 3.0, 5.0, 5.0, 9.990000000000009, 0.32717181558764313, 0.20087518767393273, 0.16358590779382157], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.311999999999996, 2, 52, 4.0, 5.0, 6.0, 10.990000000000009, 0.32716132586707564, 0.19160343626537496, 0.1543153519470679], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.8660000000003, 514, 865, 678.0, 806.8000000000001, 834.95, 850.98, 0.3270147542516823, 0.2988193122078532, 0.14402700602295776], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.16400000000007, 169, 317, 238.0, 292.0, 297.0, 307.0, 0.3270904843490474, 0.28962520807043435, 0.1344776307724111], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.474000000000002, 3, 55, 4.0, 5.0, 6.0, 8.990000000000009, 0.32717331417406403, 0.21812938800759304, 0.15304298582946943], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 972.8539999999994, 816, 8345, 921.0, 1072.9, 1095.95, 1124.99, 0.3269991419542515, 0.24579541948594427, 0.1807436663536195], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.0440000000001, 118, 161, 137.0, 151.0, 152.0, 154.99, 0.328961219419765, 6.36035916458818, 0.16576561447324098], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.25999999999982, 160, 249, 180.0, 203.0, 206.0, 211.98000000000002, 0.32893243661965343, 0.6375346643392504, 0.2351352964898304], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.2079999999999975, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.32882211315558085, 0.2683593048684087, 0.20294489796321008], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.161999999999999, 5, 28, 7.0, 9.0, 10.0, 13.0, 0.3288223294036873, 0.2734973302504048, 0.20808288032577085], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.649999999999993, 6, 26, 8.0, 10.0, 12.0, 17.99000000000001, 0.32881843698128893, 0.2661085223737929, 0.20069484679033747], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.951999999999986, 7, 21, 10.0, 12.0, 14.0, 18.0, 0.3288197344451825, 0.2940464053015606, 0.22863247160641595], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.900000000000002, 5, 28, 8.0, 9.0, 11.0, 16.99000000000001, 0.32879097639741095, 0.2468212026039588, 0.18141298990677462], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1610.806, 1424, 1938, 1589.5, 1787.6000000000001, 1838.95, 1924.0, 0.32848360144164884, 0.2744987329976888, 0.20915166810542485], "isController": false}]}, function(index, item){
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
