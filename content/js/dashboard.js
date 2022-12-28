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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8716868751329504, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.478, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.993, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.817, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.841, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.493, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 484.01174218251566, 1, 26681, 12.0, 998.9000000000015, 1792.0, 10443.900000000016, 10.250772133250878, 64.66277309225738, 84.92887061774584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10995.349999999997, 9023, 26681, 10532.0, 12656.5, 12997.6, 25092.300000000105, 0.22067192836812669, 0.12822245837796425, 0.11162896376434533], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8979999999999997, 2, 10, 3.0, 4.0, 4.0, 8.0, 0.2214645182836677, 0.11369737490908882, 0.08045390703273866], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.382000000000004, 3, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.2214621640751164, 0.12704228947363758, 0.09386189375839894], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.30599999999998, 10, 459, 14.0, 19.0, 25.0, 37.99000000000001, 0.22040996253030637, 0.1295145298379987, 2.4542132741899936], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.86400000000001, 27, 76, 45.0, 56.0, 58.0, 62.0, 0.22140695262112622, 0.9208085968721841, 0.09254118722836135], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.616000000000001, 1, 11, 2.0, 4.0, 4.0, 8.0, 0.22141244311360805, 0.13833261318936213, 0.0940570437054878], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.42999999999998, 24, 67, 39.0, 49.0, 51.0, 56.0, 0.2214073447901302, 0.9087020136942657, 0.08086557319483272], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1086.9120000000012, 761, 1660, 1060.0, 1402.9, 1493.75, 1600.6900000000003, 0.22132404008443954, 0.936088298443074, 0.10806837894748025], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.586000000000004, 4, 26, 6.0, 8.0, 9.949999999999989, 15.0, 0.22132051326882873, 0.3291083581636506, 0.11346998971302255], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.247999999999999, 3, 17, 4.0, 5.0, 6.0, 11.0, 0.22056591921287963, 0.21274918365796225, 0.1210527798805062], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.11, 6, 34, 10.0, 12.0, 13.949999999999989, 17.0, 0.2214066584952849, 0.36086690725452203, 0.14508190219759393], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.8724437040441175, 2174.2499856387867], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.643999999999997, 3, 16, 4.0, 6.0, 6.949999999999989, 14.960000000000036, 0.2205670868028536, 0.22158160924312845, 0.12988472006066476], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.901999999999997, 7, 38, 17.0, 20.0, 20.0, 27.0, 0.2214058741635286, 0.3478424661780387, 0.1321083878065586], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.758000000000004, 5, 28, 8.0, 10.0, 10.0, 15.0, 0.22140489375664768, 0.3426392081885714, 0.12691862562026582], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2209.9399999999973, 1488, 3461, 2132.5, 2810.4000000000005, 3044.3999999999996, 3360.8500000000004, 0.22113913189622383, 0.33769284368891034, 0.12223119985670185], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.759999999999998, 9, 78, 12.0, 17.0, 20.0, 46.960000000000036, 0.22040539605306833, 0.12951184654208178, 1.7774489849670296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.474000000000004, 9, 26, 14.0, 17.0, 19.0, 24.0, 0.2214080310892301, 0.40080691534220386, 0.1850832759886533], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.103999999999997, 6, 28, 10.0, 12.0, 13.0, 21.0, 0.22140744283259828, 0.3747969624559399, 0.15913659953592998], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.026123046875, 2131.011962890625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.6996671853388658, 2645.152576071923], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.698000000000003, 2, 17, 2.0, 3.0, 4.0, 8.0, 0.22056630840816413, 0.18545663236272394, 0.0936976017163588], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 701.4300000000002, 482, 999, 687.0, 839.0, 865.8, 954.9300000000001, 0.22051232068489363, 0.19411544542165704, 0.10250377406836851], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.706000000000001, 2, 13, 3.0, 5.0, 6.0, 10.990000000000009, 0.22058372630324175, 0.1998415319616996, 0.10813772519944077], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 951.2740000000001, 751, 1371, 911.5, 1150.9, 1185.9, 1252.8500000000001, 0.2204886911350317, 0.2085835937396646, 0.11691929617804903], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.316532258064516, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.677999999999987, 20, 580, 27.0, 34.0, 38.0, 79.92000000000007, 0.2203500304303392, 0.1294793132912494, 10.07929240757528], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.03399999999996, 26, 227, 34.0, 42.0, 49.0, 104.95000000000005, 0.22047848240250992, 49.89325138102209, 0.06846890371484195], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.5334832782299085, 0.4192363936927772], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0340000000000003, 2, 12, 3.0, 4.0, 4.0, 7.990000000000009, 0.22142773949292163, 0.24054750582687098, 0.09536096984021332], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.778000000000001, 2, 14, 4.0, 5.0, 6.0, 8.990000000000009, 0.2214265627733234, 0.22726495847144815, 0.08195377665145466], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.052000000000003, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.22146530303097411, 0.12559288683898143, 0.08629360928648308], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 198.87800000000007, 91, 365, 196.0, 295.7000000000001, 311.95, 329.95000000000005, 0.22144499948403315, 0.20169054849490478, 0.07266164045569838], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.99200000000002, 82, 371, 113.0, 130.0, 154.95, 296.60000000000036, 0.22044582081017366, 0.129598031374731, 65.21235160138458], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 273.07800000000003, 18, 549, 338.0, 448.0, 461.0, 510.97, 0.22142332685891525, 0.12343182810309293, 0.09319673230096921], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 496.3760000000002, 265, 1019, 465.0, 850.8000000000001, 902.8499999999999, 963.9000000000001, 0.2214577500689841, 0.11910058353563499, 0.09472509231466313], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.273999999999997, 5, 274, 7.0, 10.0, 14.0, 30.980000000000018, 0.22032585312373587, 0.10364567061351056, 0.1602956646261555], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 501.62199999999865, 275, 1077, 448.5, 876.9000000000001, 915.9, 1001.99, 0.2213993056032179, 0.11388010571706143, 0.089511047382551], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.935999999999997, 2, 13, 4.0, 5.0, 6.0, 10.990000000000009, 0.22056523812443674, 0.13542145591915491, 0.11071341054293017], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.345999999999997, 2, 28, 4.0, 5.0, 6.0, 9.990000000000009, 0.22056270840418912, 0.129173497907301, 0.10446573591409347], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 845.7180000000002, 575, 1438, 844.0, 1058.9, 1232.95, 1302.97, 0.2204681774028055, 0.20145925613044838, 0.09753133238620205], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.16000000000014, 231, 1074, 382.0, 863.9000000000001, 899.95, 981.7900000000002, 0.22047012166864136, 0.19521725001774787, 0.09107310690022978], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.5539999999999985, 3, 36, 5.0, 7.0, 8.0, 12.0, 0.22056796250344637, 0.14711710780259168, 0.10360663082437276], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1169.1939999999993, 892, 9852, 1077.5, 1412.0, 1422.95, 1598.5800000000004, 0.22043376957176333, 0.16563100682022083, 0.12227185655933746], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.82600000000005, 143, 291, 176.0, 189.0, 193.0, 226.99, 0.22153251765060336, 4.283322575160445, 0.11206430092091067], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.23200000000008, 193, 362, 229.0, 260.0, 269.84999999999997, 312.8800000000001, 0.22151377195422992, 0.429323975133307, 0.15878037950625468], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.094000000000003, 6, 23, 9.0, 11.0, 13.0, 18.0, 0.22131874990317305, 0.1806860106631374, 0.13702742913926924], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.816000000000003, 6, 19, 9.0, 11.0, 12.0, 16.980000000000018, 0.22131933768860282, 0.18401924853010762, 0.140485907712492], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.894, 6, 30, 10.0, 12.0, 13.0, 18.0, 0.22131639879267478, 0.17910850863620853, 0.13551306840137411], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.986000000000008, 8, 31, 12.0, 14.0, 15.0, 22.0, 0.2213172804532578, 0.1979125457850124, 0.1543169318785411], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.248000000000005, 6, 28, 9.0, 11.0, 12.949999999999989, 20.99000000000001, 0.22139469803977133, 0.1661995296192897, 0.1225886658091312], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1986.4479999999994, 1615, 2966, 1908.5, 2492.7000000000003, 2576.0, 2712.5400000000004, 0.2211418704710145, 0.18479815427807791, 0.14123709305472995], "isController": false}]}, function(index, item){
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
