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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8679004467134652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.461, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.745, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.765, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.841, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.483, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 500.76281642203685, 1, 23640, 12.0, 1049.0, 1902.9500000000007, 10654.980000000003, 9.879367064825544, 62.23280568376737, 81.85173529632426], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11269.982000000005, 9078, 23640, 10758.5, 13029.9, 13683.65, 20791.110000000055, 0.21264253429073507, 0.12354489710546729, 0.10756721949472732], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.1559999999999997, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.21337084108225104, 0.10954217272006854, 0.0775136258619115], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.584000000000001, 3, 15, 4.0, 6.0, 6.0, 9.990000000000009, 0.21336983949040456, 0.12240010850923186, 0.09043213900276911], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.244000000000014, 10, 452, 14.0, 19.0, 22.0, 39.97000000000003, 0.21219888977540868, 0.11039108454322066, 2.3627849035343846], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.10400000000001, 27, 63, 45.0, 55.0, 57.0, 59.0, 0.21329556579848263, 0.8870741787320858, 0.08915088101733454], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7039999999999966, 1, 15, 2.0, 4.0, 4.0, 7.0, 0.21329938744681914, 0.13326379151179354, 0.09061057962828742], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.734000000000044, 24, 56, 39.0, 49.0, 51.0, 53.0, 0.21329465590239635, 0.8754058430737892, 0.07790254033935179], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1157.6900000000023, 791, 1737, 1169.5, 1445.8000000000004, 1560.5, 1668.88, 0.2132268904696109, 0.9018414674061375, 0.1041146926121147], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.742000000000001, 4, 17, 7.0, 9.0, 9.0, 13.990000000000009, 0.21317816237013187, 0.31700050744396824, 0.10929544457453048], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.329999999999997, 2, 21, 4.0, 5.0, 6.0, 11.990000000000009, 0.21234019277092062, 0.20481497246266211, 0.11653826986060291], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.958000000000004, 6, 22, 10.0, 12.0, 13.0, 17.99000000000001, 0.21329465590239635, 0.3476452936534175, 0.13976632237354292], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.7643413206713782, 2089.738502098057], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.839999999999999, 3, 22, 5.0, 6.0, 7.0, 12.990000000000009, 0.2123415454302613, 0.2133182335933243, 0.12504096864692144], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.453999999999999, 7, 27, 16.0, 20.0, 20.0, 22.0, 0.2132938370025561, 0.3350858676995918, 0.1272681000083611], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.883999999999996, 5, 17, 8.0, 9.0, 10.0, 15.0, 0.21329447392411066, 0.33008777907448966, 0.12226939081391891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2345.1319999999996, 1627, 3658, 2265.5, 2954.9, 3250.0, 3455.96, 0.21303174854754955, 0.32531237843875843, 0.11774997038858694], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.815999999999978, 9, 76, 13.0, 17.0, 20.0, 39.960000000000036, 0.21219321635262778, 0.11038813308907065, 1.7112222467187503], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.802000000000001, 10, 34, 15.0, 18.0, 19.0, 26.970000000000027, 0.21329538381864432, 0.3861208847055265, 0.178301609910898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.082000000000015, 6, 23, 10.0, 12.0, 13.0, 18.0, 0.21329520183911654, 0.36106461794136857, 0.15330592632186502], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.256610576923077, 2098.2271634615386], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.6380566540577717, 2630.598779229711], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8859999999999983, 2, 16, 3.0, 4.0, 4.0, 8.990000000000009, 0.2123381187267357, 0.178538203343476, 0.09020222817004886], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 726.14, 538, 955, 693.0, 884.0, 900.95, 932.98, 0.21228483870173384, 0.18687285088136418, 0.09867928049025909], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.774000000000001, 2, 12, 4.0, 5.0, 5.0, 9.980000000000018, 0.2123444311611206, 0.19237700413328435, 0.10409853949500247], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 977.2499999999994, 744, 1313, 928.5, 1188.7, 1215.9, 1264.92, 0.21227348296632664, 0.20081195867608423, 0.11256298950265171], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.4005126953125, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.434000000000008, 19, 725, 27.0, 33.0, 36.0, 74.97000000000003, 0.2121287587625087, 0.11035460066442969, 9.70323345745694], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.50800000000004, 27, 249, 36.0, 43.0, 47.94999999999999, 108.97000000000003, 0.21226230866675497, 48.00743682887965, 0.06591739663674617], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1082.0, 1082, 1082, 1082.0, 1082.0, 1082.0, 1082.0, 0.9242144177449169, 0.4846710374306839, 0.3808774260628466], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.176, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.2133439834649879, 0.2317657364122284, 0.09187958662896452], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.92, 2, 34, 4.0, 5.0, 5.949999999999989, 9.0, 0.21334170770649985, 0.21895484470750426, 0.0789614328327768], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2020000000000013, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.21337166057348328, 0.12100298536291745, 0.0831399341492381], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.53800000000007, 91, 295, 193.5, 271.90000000000003, 278.0, 287.99, 0.21335527194476317, 0.19433456610898442, 0.07000719860687542], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.25200000000002, 81, 374, 109.0, 129.0, 139.0, 260.85000000000014, 0.21223194574672324, 0.1104683858232456, 62.78252051327872], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 255.02199999999993, 18, 461, 312.0, 422.0, 433.95, 454.0, 0.21333897686040124, 0.11891314564907957, 0.08979404201839153], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 532.2199999999995, 321, 1024, 506.0, 843.7, 904.75, 993.98, 0.21337184268350085, 0.11475196043381908, 0.09126647177282556], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.20799999999999, 5, 298, 7.0, 10.0, 12.949999999999989, 30.99000000000001, 0.21210392243783766, 0.09563525588747462, 0.1543138888829971], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 540.4640000000002, 312, 1075, 493.5, 875.0, 922.0, 1012.97, 0.21331658655917787, 0.10972263604158648, 0.0862432293315426], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.056000000000003, 2, 13, 4.0, 5.0, 6.0, 10.990000000000009, 0.21233712680688277, 0.1303696044870657, 0.10658328435423609], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.635999999999996, 3, 30, 4.0, 6.0, 6.0, 10.990000000000009, 0.2123346921338065, 0.12435472482379405, 0.1005686774266564], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 892.5280000000006, 599, 1501, 903.0, 1172.2000000000003, 1307.6, 1403.99, 0.21225212666018306, 0.19395159905976553, 0.09389669275103803], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 511.1520000000001, 267, 1049, 417.0, 929.9000000000001, 970.6999999999999, 1018.0, 0.21225798344727342, 0.1879457384487083, 0.08768078808417643], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.655999999999992, 3, 40, 5.0, 7.0, 8.0, 15.970000000000027, 0.212342086498823, 0.14163051277216418, 0.09974271836516979], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1220.6159999999998, 939, 9937, 1135.5, 1463.0, 1487.95, 1593.6100000000004, 0.21225870430494612, 0.15948837135382, 0.11773725004414981], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.41799999999995, 145, 209, 174.0, 191.0, 192.0, 195.99, 0.2134489942283392, 4.1270279655536015, 0.10797517481472627], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.37599999999992, 196, 318, 226.0, 258.0, 261.0, 269.98, 0.21343478030731194, 0.413677873851294, 0.15298938354059274], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.074, 5, 20, 9.0, 11.0, 12.0, 15.0, 0.21317570837222014, 0.17403798066325782, 0.1319857413163941], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.988, 6, 24, 9.0, 11.0, 12.0, 15.990000000000009, 0.21317652636524642, 0.17724878718544737, 0.13531713099356463], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.918000000000001, 6, 21, 10.0, 12.0, 13.0, 17.980000000000018, 0.2131732544308061, 0.17251836687436845, 0.1305269829376127], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.201999999999996, 8, 26, 12.0, 15.0, 16.0, 20.0, 0.21317407240500005, 0.1906304978925611, 0.1486389528292676], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.504000000000005, 6, 47, 10.0, 11.0, 12.0, 18.99000000000001, 0.21315716888058805, 0.16001567118183288, 0.11802745581571625], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2049.495999999998, 1667, 2715, 1964.5, 2518.0, 2618.0, 2683.91, 0.21300697257024012, 0.17800019189265642, 0.13604156255950883], "isController": false}]}, function(index, item){
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
