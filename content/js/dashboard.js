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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8708572644118273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.996, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.832, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.488, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.8087640927438, 1, 25974, 13.0, 1024.9000000000015, 1856.9500000000007, 10320.990000000002, 10.16598605090908, 64.12793502029737, 84.22640780579485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10972.362000000006, 9098, 25974, 10403.0, 12707.800000000001, 13096.9, 24380.290000000092, 0.21888831005091341, 0.1271860785940366, 0.11072670371716128], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9079999999999977, 2, 12, 3.0, 4.0, 4.0, 8.0, 0.21967188050552652, 0.11277705498101596, 0.07980267533989831], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.477999999999993, 2, 18, 4.0, 5.900000000000034, 7.0, 11.980000000000018, 0.21967033633285854, 0.1260144032896951, 0.09310246676607482], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.630000000000003, 11, 416, 15.0, 19.0, 22.94999999999999, 53.0, 0.2183557723003475, 0.12830747241293172, 2.4313403474302366], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.539999999999935, 27, 91, 46.0, 57.0, 58.0, 62.99000000000001, 0.2196054042254715, 0.9133161435830641, 0.09178819629736504], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7420000000000013, 1, 28, 3.0, 4.0, 4.0, 7.990000000000009, 0.2196109021879395, 0.13720705827243523, 0.0932917406755407], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.69199999999998, 23, 65, 41.0, 50.0, 52.0, 54.0, 0.21960386098724233, 0.9012877007673398, 0.08020687891526233], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1121.5260000000003, 790, 2112, 1114.0, 1398.1000000000004, 1532.95, 1628.8400000000001, 0.21953559440359863, 0.9285240814081892, 0.10719511445488215], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.742, 4, 24, 6.0, 8.0, 9.0, 18.970000000000027, 0.21949164856226386, 0.3263887970529734, 0.11253233935077005], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.191999999999999, 2, 18, 4.0, 5.0, 6.0, 11.0, 0.218528603208874, 0.21078406901898136, 0.1199346435579953], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.15799999999999, 6, 27, 10.0, 12.0, 13.0, 19.0, 0.219602510671584, 0.3579263577254626, 0.1438996920513993], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.8475167410714285, 2112.1285574776784], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.628000000000003, 3, 20, 4.0, 6.0, 7.0, 12.990000000000009, 0.21852994035006748, 0.21953509271241983, 0.128685111358487], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.766000000000004, 7, 36, 16.0, 20.0, 20.0, 28.970000000000027, 0.21960144972093049, 0.3450076026021894, 0.13103172439403177], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.695999999999997, 5, 20, 8.0, 9.0, 10.0, 16.0, 0.21960144972093049, 0.33984825526099194, 0.12588481541619745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2231.7380000000007, 1577, 3392, 2184.0, 2805.9, 3071.85, 3335.8500000000004, 0.21934134426413612, 0.33494751312428933, 0.1212375008334971], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.115999999999987, 9, 86, 13.0, 17.0, 21.0, 42.0, 0.21835109983448986, 0.12830472683731534, 1.7608822094074388], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.707999999999998, 9, 32, 15.0, 18.0, 19.0, 25.0, 0.21960453615129874, 0.3975421139736562, 0.18357566693897628], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.182000000000004, 6, 32, 10.0, 13.0, 14.0, 19.0, 0.21960376453557318, 0.3717437085168489, 0.15784020575994323], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 7.338169642857142, 1948.3537946428569], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.7676166540212442, 2902.0414453717754], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6619999999999986, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.21850568333282347, 0.1837240169429307, 0.09282223852517404], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 705.7380000000003, 502, 938, 694.0, 847.0, 863.0, 895.98, 0.21845413118607487, 0.1923036356774918, 0.101547037543527], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6079999999999997, 2, 24, 3.0, 4.0, 5.0, 10.980000000000018, 0.21852573796141708, 0.19797706285565064, 0.10712882857092909], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 954.8420000000001, 758, 1320, 919.5, 1160.0, 1186.95, 1226.98, 0.21845394029741194, 0.20665870752490811, 0.1158403218569284], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 8.59375, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.729999999999958, 20, 589, 28.0, 33.900000000000034, 38.0, 66.98000000000002, 0.21829590359005077, 0.12827229311442329, 9.985332152498025], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.85, 26, 228, 35.0, 42.900000000000034, 49.0, 106.98000000000002, 0.21841662797052075, 49.426663347735, 0.0678286012642828], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.5228455259222333, 0.41087674476570296], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0259999999999976, 2, 20, 3.0, 4.0, 4.0, 8.0, 0.219642737908228, 0.23860837353893652, 0.09459223380618022], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8379999999999974, 2, 23, 4.0, 5.0, 5.949999999999989, 10.980000000000018, 0.21964138711443054, 0.2254327127512368, 0.08129305245739177], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.097999999999998, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.21967255608789538, 0.1245637783569811, 0.08559506824127956], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 192.79200000000003, 90, 347, 192.0, 266.90000000000003, 275.0, 307.9000000000001, 0.2196550887933731, 0.20007275182467485, 0.07207432601032555], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 122.09399999999997, 88, 351, 119.0, 139.90000000000003, 152.89999999999998, 276.6400000000003, 0.21838600512595632, 0.12838708504475166, 64.603016281987], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 271.99600000000004, 17, 610, 329.5, 443.90000000000003, 456.95, 499.7800000000002, 0.2196382031662165, 0.12243671578179559, 0.09244537652796807], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 509.6980000000002, 276, 1007, 478.0, 785.8000000000001, 909.0, 974.97, 0.21967728528083105, 0.11813060204537128, 0.09396352632129297], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.378000000000002, 5, 259, 7.0, 10.0, 16.0, 31.99000000000001, 0.218273413643398, 0.10268016219351685, 0.1588024347307925], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 511.5220000000002, 280, 1024, 460.5, 838.9000000000001, 915.4499999999998, 972.7900000000002, 0.21961466411035196, 0.11296214817730808, 0.08878952240398995], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9139999999999984, 2, 36, 4.0, 5.0, 6.0, 11.990000000000009, 0.2185024367391745, 0.1341549482444203, 0.10967798094134346], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.395999999999995, 3, 35, 4.0, 5.0, 6.0, 11.980000000000018, 0.2184993812097524, 0.12796510147002016, 0.10348847645188469], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 856.4660000000002, 595, 1350, 853.0, 1121.5000000000002, 1253.5, 1301.99, 0.21841157127031666, 0.19957997202475392, 0.09662152518110688], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 469.38600000000037, 249, 1078, 385.5, 852.9000000000001, 896.8499999999999, 969.7900000000002, 0.2184131932052529, 0.1933959242296239, 0.09022341867756054], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.544, 3, 39, 5.0, 7.0, 8.0, 15.0, 0.21853070443809638, 0.14575827258908186, 0.10264967659641051], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1198.062, 895, 10750, 1110.0, 1415.9, 1437.0, 1638.98, 0.21844811835344294, 0.16413901486670515, 0.12117044064917538], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.83, 143, 289, 174.0, 189.0, 194.95, 234.92000000000007, 0.21974409481694, 4.248743489531831, 0.11115961046403801], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.73799999999991, 196, 337, 233.0, 257.90000000000003, 261.0, 319.9100000000001, 0.21972903016000667, 0.425877347118034, 0.1575010821654735], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.22600000000001, 6, 27, 9.0, 11.0, 12.949999999999989, 20.980000000000018, 0.21948923975951004, 0.17919238714741248, 0.13589470508547788], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.907999999999998, 6, 29, 9.0, 11.0, 12.0, 19.980000000000018, 0.21949020327426705, 0.1824983875700942, 0.1393248360627672], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.932000000000002, 6, 28, 10.0, 12.0, 13.0, 20.980000000000018, 0.21948663831191947, 0.17762770706588943, 0.13439269748200539], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.163999999999989, 8, 41, 12.0, 15.0, 16.0, 27.99000000000001, 0.2194876981534939, 0.19628887730725467, 0.15304122703280726], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.371999999999991, 6, 35, 9.0, 11.0, 13.0, 22.99000000000001, 0.2194783526306017, 0.16476094184635726, 0.12152756439604606], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2005.562, 1614, 2755, 1942.0, 2454.6000000000004, 2580.95, 2675.78, 0.21932585373685198, 0.1832805920909781, 0.140077254242091], "isController": false}]}, function(index, item){
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
