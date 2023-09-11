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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8911295469049139, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.189, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.644, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.948, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.108, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.4184641565629, 1, 17578, 9.0, 839.0, 1507.0, 6063.990000000002, 15.235898772182964, 95.9748643726284, 126.07836253425727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6188.907999999999, 5147, 17578, 6042.0, 6530.200000000001, 6748.45, 14712.030000000068, 0.3285215871534919, 0.1907959698203644, 0.16554408102656426], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.291999999999999, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3296224438603535, 0.1692244286736586, 0.11910185959797928], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.559999999999999, 2, 13, 3.0, 4.900000000000034, 5.0, 7.0, 0.32962027085556894, 0.1891807904145766, 0.13905855176719317], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.205999999999987, 8, 359, 12.0, 15.0, 17.0, 32.0, 0.3276074110038088, 0.17042943741781147, 3.6046413083788216], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.93599999999999, 24, 72, 34.0, 40.900000000000034, 42.0, 58.88000000000011, 0.32957008241888625, 1.370647857127085, 0.13710630381879446], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.174000000000001, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.3295822479091302, 0.20589556622065402, 0.13936436850063808], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.923999999999996, 21, 47, 30.0, 35.0, 37.0, 42.960000000000036, 0.3295761650517435, 1.3526494576412236, 0.11972884121020369], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.994, 672, 1090, 867.0, 1025.8000000000002, 1072.9, 1082.99, 0.3294293756127386, 1.3932256750584406, 0.1602107705616639], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.499999999999998, 3, 17, 5.0, 7.0, 8.0, 12.990000000000009, 0.3295201264302821, 0.4900035075357958, 0.16829983019827885], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8140000000000014, 2, 21, 4.0, 5.0, 5.0, 9.990000000000009, 0.32780178743758653, 0.316184671357401, 0.17926660250493015], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.6440000000000055, 5, 24, 7.0, 9.0, 11.0, 14.990000000000009, 0.3295785547189387, 0.5370810840283596, 0.2153203643622754], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.705737663132137, 1929.510667312398], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.024000000000003, 2, 16, 4.0, 5.0, 6.0, 9.0, 0.3278056558276634, 0.3293134337953863, 0.1923937491722907], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.968, 5, 21, 8.0, 10.0, 11.0, 17.0, 0.32957746850228137, 0.5177681341350635, 0.1960084749198138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.418000000000002, 4, 19, 6.0, 8.0, 8.0, 12.990000000000009, 0.3295763822927838, 0.5100419812335912, 0.18828338246218607], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1572.7659999999996, 1322, 1954, 1544.0, 1781.6000000000001, 1845.0, 1898.8700000000001, 0.3292332815339637, 0.5027591549487055, 0.18133551834487843], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.602000000000002, 8, 44, 10.0, 14.0, 22.899999999999977, 31.99000000000001, 0.32760054224441754, 0.1704258641201403, 2.6412793718456165], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.820000000000002, 8, 21, 11.0, 13.0, 14.0, 18.99000000000001, 0.3295818134118705, 0.5966299837301937, 0.2748660826696654], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.897999999999997, 5, 35, 8.0, 10.0, 11.0, 15.980000000000018, 0.3295792064523699, 0.5580027011899786, 0.23624134525003856], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.4228515625, 2435.4073660714284], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.083801839953271, 4468.325606016355], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.234000000000001, 1, 14, 2.0, 3.0, 3.0, 5.990000000000009, 0.3277985638489321, 0.2755268573148577, 0.13861013490877694], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 554.0219999999998, 430, 706, 535.0, 651.0, 664.0, 678.99, 0.32770016745478553, 0.2885649589801315, 0.15168933532575035], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2500000000000013, 1, 21, 3.0, 4.0, 5.0, 8.990000000000009, 0.3278013576221027, 0.29697714597617275, 0.16005925665141735], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 755.6259999999999, 614, 945, 728.5, 884.0, 902.95, 923.98, 0.3276623714498601, 0.3099705232882754, 0.17311068647888117], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.611505681818182, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.53999999999999, 17, 583, 22.0, 27.0, 32.0, 87.97000000000003, 0.3274773827745587, 0.17036179353304212, 14.937957567773081], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.35999999999997, 21, 253, 29.0, 35.0, 40.0, 101.94000000000005, 0.32772057233120755, 74.1207634691107, 0.10113252036783357], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 1.1277721774193548, 0.8820564516129031], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6259999999999994, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.32957008241888625, 0.35812102188312395, 0.141290299005753], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2760000000000016, 2, 9, 3.0, 4.0, 5.0, 6.0, 0.32956943072153955, 0.3381659146029578, 0.1213356204902543], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8060000000000005, 1, 10, 2.0, 2.0, 3.0, 6.990000000000009, 0.32962287846474847, 0.18692900561842196, 0.12779324487354018], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.51399999999995, 66, 125, 93.0, 110.0, 114.0, 117.0, 0.3296020187464444, 0.3002178700244103, 0.10750690845831293], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 85.83999999999996, 59, 348, 83.0, 97.90000000000003, 103.94999999999999, 281.99, 0.327666451280586, 0.17046015162273534, 96.88879373364125], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.5139999999999, 12, 368, 260.0, 334.0, 338.0, 353.0, 0.32956595504588543, 0.1836783068400755, 0.13807011202605945], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 428.67599999999993, 316, 543, 417.0, 502.0, 514.9, 528.95, 0.32952772745157094, 0.1772209128758346, 0.1403067277039892], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.267999999999999, 4, 262, 6.0, 8.0, 10.949999999999989, 28.980000000000018, 0.327424414074011, 0.1476319592012809, 0.23757455044627948], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 397.858, 274, 509, 393.0, 462.0, 470.0, 488.98, 0.3295118742899019, 0.16948945244847094, 0.13257704317132774], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.385999999999999, 2, 11, 3.0, 4.0, 5.0, 9.0, 0.3277970595292572, 0.2012590715787493, 0.1638985297646286], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1319999999999935, 2, 40, 4.0, 5.0, 5.0, 10.990000000000009, 0.327788893463365, 0.19197097392472132, 0.15461136283477078], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.2279999999996, 535, 880, 673.5, 794.0, 830.0, 849.99, 0.327635747681158, 0.29938676314720347, 0.14430050996504126], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 243.36800000000005, 164, 319, 235.0, 290.0, 295.95, 306.98, 0.3277203575298013, 0.2901829349373497, 0.13473659230473273], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.349999999999998, 3, 40, 4.0, 5.0, 6.0, 9.0, 0.3278084497217234, 0.21855283858351346, 0.1533400853678765], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 979.6999999999997, 809, 8444, 934.5, 1093.9, 1111.95, 1145.9, 0.3276372505206156, 0.24627506650217093, 0.18109637089323088], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.76199999999997, 118, 172, 133.5, 150.0, 151.0, 157.98000000000002, 0.32960462606684776, 6.372799224761679, 0.1660898311039975], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.7540000000002, 160, 224, 176.5, 204.0, 206.0, 212.98000000000002, 0.3295818134118705, 0.6387932821256577, 0.23559949943114178], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.901999999999996, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.329516217470159, 0.2689257793964713, 0.20337329046986377], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.779999999999995, 5, 18, 7.0, 9.0, 9.949999999999989, 13.0, 0.32951817193862787, 0.2740760959197742, 0.20852321817991298], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.173999999999989, 5, 26, 8.0, 10.0, 11.0, 16.0, 0.32951165713389446, 0.26666953650725556, 0.20111795479363676], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.443999999999996, 7, 24, 9.0, 12.0, 12.0, 15.990000000000009, 0.3295136115482658, 0.2946669035457642, 0.2291149330296536], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.5640000000000045, 4, 39, 7.0, 9.0, 10.0, 23.910000000000082, 0.3294586796218605, 0.2473224429805863, 0.18178140037729607], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.2759999999996, 1348, 1970, 1586.5, 1819.0, 1885.85, 1954.93, 0.3291457220272217, 0.27505203691007213, 0.20957325269702004], "isController": false}]}, function(index, item){
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
