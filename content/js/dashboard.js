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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8672622846202935, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.449, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.994, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.755, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.758, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.841, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 504.1512444160804, 1, 24379, 13.0, 1055.0, 1923.7500000000036, 10687.990000000002, 9.819883164070381, 61.85812416470416, 81.3589040787922], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11316.416000000014, 9174, 24379, 10767.5, 13065.6, 13560.55, 21111.310000000056, 0.21135965127348416, 0.12281151612082332, 0.10691826109342266], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.242000000000001, 2, 22, 3.0, 4.0, 5.0, 6.990000000000009, 0.2121193994645258, 0.10889969677001549, 0.07705900058672226], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.656000000000003, 3, 17, 4.0, 6.0, 6.0, 8.990000000000009, 0.21211795964583088, 0.1216819647022988, 0.08990155711551817], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.243999999999986, 10, 415, 14.0, 19.0, 23.0, 39.99000000000001, 0.21090817058252836, 0.1097196206552917, 2.348413047833973], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.46200000000002, 27, 71, 45.0, 56.0, 57.0, 61.0, 0.21203601219631144, 0.8818358256841341, 0.08862442697267703], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.693999999999999, 1, 14, 2.0, 4.0, 4.0, 8.980000000000018, 0.21204212683342225, 0.1324782884765282, 0.0900764894263073], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.800000000000004, 24, 56, 40.0, 49.0, 51.0, 53.0, 0.212034663426777, 0.8702225608592493, 0.07744234777501426], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1154.1940000000004, 758, 1733, 1130.0, 1510.5000000000002, 1604.85, 1661.0, 0.21196949335051699, 0.8965233161143449, 0.10350072917505714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.772000000000001, 4, 17, 7.0, 9.0, 9.0, 14.0, 0.2119077760406049, 0.3151114156785054, 0.10864412345831796], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.402000000000003, 3, 20, 4.0, 5.0, 6.0, 11.980000000000018, 0.21105720241145517, 0.2035774505799008, 0.11583412866722442], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.352, 7, 22, 10.0, 12.0, 13.949999999999989, 18.0, 0.21203376425662024, 0.3455901880315422, 0.1389400935705002], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.7536884799651569, 2060.6132268074916], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.030000000000005, 3, 16, 5.0, 6.0, 7.0, 12.990000000000009, 0.21105853877419734, 0.21202932560781693, 0.12428544812582128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.984000000000004, 7, 27, 17.0, 20.0, 20.0, 22.0, 0.21203304492598563, 0.33311716564403127, 0.12651581098611056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.949999999999996, 5, 23, 8.0, 9.0, 10.949999999999989, 15.0, 0.21203304492598563, 0.32813563146939323, 0.12154628649565777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2360.283999999998, 1610, 3702, 2284.0, 2970.3, 3278.2, 3586.91, 0.21176471584775133, 0.32337754279129616, 0.11704963786115943], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.767999999999999, 9, 74, 13.0, 17.0, 20.0, 36.0, 0.21090247700741196, 0.1097166587174008, 1.700813139772664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.056000000000004, 10, 29, 15.0, 18.0, 20.0, 23.99000000000001, 0.21203502309697506, 0.3838392994776305, 0.17724802712012758], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.296000000000001, 7, 25, 10.0, 12.900000000000034, 13.0, 20.0, 0.21203448359213553, 0.35893048295730434, 0.15239978508184743], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.861328125, 2273.0794270833335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.8686651451310861, 3581.358263108614], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.965999999999999, 2, 15, 3.0, 4.0, 4.0, 7.990000000000009, 0.21104446326961057, 0.17745047155774873, 0.08965267726785216], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 737.1139999999997, 562, 960, 709.5, 887.8000000000001, 909.0, 940.98, 0.2109885361488769, 0.18573172485871153, 0.09807670235045449], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.787999999999998, 2, 16, 4.0, 5.0, 5.949999999999989, 10.0, 0.21105515335478497, 0.19120896124879647, 0.10346649119541217], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 993.4640000000006, 794, 1310, 944.0, 1192.9, 1224.8, 1267.93, 0.2109840846265603, 0.19959218029159687, 0.11187925581271702], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.2320106907894735, 866.4293791118421], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.560000000000002, 20, 650, 28.0, 33.0, 37.0, 75.91000000000008, 0.21084564707053166, 0.10968709438568645, 9.644541121859087], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.38200000000004, 27, 242, 36.0, 42.0, 49.0, 102.92000000000007, 0.21096984101734723, 47.71511899147344, 0.065516024847184], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.49240757042253525, 0.3869571596244132], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.269999999999998, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.21208556889196742, 0.2303986606902367, 0.0913376326966383], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.946000000000003, 2, 12, 4.0, 5.0, 5.0, 7.0, 0.2120847592498647, 0.21767683786289826, 0.07849621460517453], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2859999999999983, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.21211993940157572, 0.12028112016933958, 0.08265220295041865], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 205.57200000000012, 90, 353, 215.0, 307.0, 316.0, 330.96000000000004, 0.21209978361580076, 0.19319100505497416, 0.06959524149893463], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.88399999999997, 82, 389, 111.0, 129.0, 135.95, 224.99, 0.21093771093771094, 0.10979472649394524, 62.39965956762832], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 266.20200000000017, 17, 514, 331.5, 444.80000000000007, 469.0, 504.98, 0.21208197052993769, 0.11822451456027559, 0.08926497001797182], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 533.3320000000003, 337, 1079, 496.5, 850.6000000000001, 916.9, 999.8600000000001, 0.2120948352362482, 0.11405316915284232, 0.0907202517905046], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.47, 5, 274, 7.0, 10.0, 14.0, 31.99000000000001, 0.21082288811334177, 0.09505765202227638, 0.15338188637152306], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 542.8439999999998, 329, 1076, 490.0, 879.0, 930.8, 1038.8500000000001, 0.21205669547810302, 0.10907459187038246, 0.08573385930462368], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.2880000000000065, 2, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.21104339432065342, 0.1295752855891973, 0.10593389128985924], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.844000000000002, 3, 46, 5.0, 6.0, 7.0, 11.990000000000009, 0.21103965308457667, 0.12359627963999167, 0.09995530443947236], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 904.8120000000009, 618, 1572, 915.5, 1146.8000000000002, 1299.6, 1384.97, 0.21095898155754392, 0.19276994983711856, 0.09332462758356191], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 508.09400000000045, 273, 1084, 420.0, 884.0, 945.5999999999999, 990.97, 0.210966903512177, 0.18680254012063088, 0.08714746111879969], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.713999999999995, 3, 43, 5.0, 7.0, 8.0, 12.990000000000009, 0.2110596078765757, 0.14077510955048947, 0.09914030409046184], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1242.672, 958, 10286, 1156.0, 1478.9, 1507.0, 1654.96, 0.21097251154758043, 0.15852194319818294, 0.11702381499904851], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.996, 145, 212, 165.0, 190.0, 192.0, 195.0, 0.21216377346000925, 4.102178272201878, 0.10732503384012186], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.42799999999988, 196, 342, 218.0, 258.0, 261.0, 264.0, 0.21214567958959146, 0.4111793474006426, 0.15206536017457042], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.391999999999996, 6, 23, 9.0, 11.0, 12.949999999999989, 18.0, 0.2119060696679347, 0.17300143968983733, 0.13119965641549863], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.064000000000004, 6, 19, 9.0, 11.0, 12.0, 16.0, 0.2119070575645522, 0.17619326850743264, 0.13451131583687395], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.312000000000006, 7, 36, 10.0, 12.0, 13.949999999999989, 22.970000000000027, 0.21190418370906064, 0.17149132429837466, 0.12974992498591897], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.768000000000002, 8, 43, 13.0, 15.0, 17.0, 22.99000000000001, 0.21190499197303891, 0.1895076276261386, 0.14775406666870097], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.731999999999998, 6, 50, 10.0, 11.0, 13.0, 21.970000000000027, 0.211891342119761, 0.15906542343836083, 0.1173265536932661], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2062.7340000000027, 1666, 2743, 1993.5, 2576.5, 2666.9, 2732.87, 0.21173853001795967, 0.1769402124235042, 0.1352314439763141], "isController": false}]}, function(index, item){
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
