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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8731333758774729, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.769, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.796, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 462.62778132312343, 1, 19956, 11.0, 1007.9000000000015, 1885.0, 10381.960000000006, 10.723431279024092, 67.54970406132566, 88.73730894539695], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10516.624, 8959, 19956, 10353.0, 11233.0, 11520.9, 18510.27000000006, 0.2308323723012233, 0.1341000829726962, 0.11631787510491332], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8219999999999983, 1, 9, 3.0, 4.0, 4.0, 6.990000000000009, 0.2317687244793663, 0.11898743764262469, 0.08374455864977104], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.121999999999998, 2, 18, 4.0, 5.0, 6.0, 8.0, 0.2317670055563822, 0.13301932308158337, 0.09777670546909874], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.058000000000014, 10, 491, 14.0, 18.0, 20.0, 51.90000000000009, 0.23047082423741813, 0.11989659451124512, 2.5358542741044823], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.075999999999986, 26, 75, 43.0, 54.0, 56.0, 59.0, 0.2317076109462383, 0.9636479685672407, 0.09639398658505617], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5800000000000005, 1, 11, 2.0, 3.0, 4.0, 7.990000000000009, 0.23171373158744762, 0.14475546018926377, 0.09798051345445782], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.22600000000001, 23, 60, 39.0, 48.0, 49.94999999999999, 52.99000000000001, 0.23170524867997522, 0.9509667633591977, 0.08417417237202224], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1024.1859999999997, 754, 1441, 997.5, 1315.4, 1390.95, 1418.99, 0.23163322268986397, 0.9796253064797078, 0.112649750878469], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.758000000000003, 4, 17, 7.0, 9.0, 10.0, 13.0, 0.2316912908170547, 0.3445299271875365, 0.1183345166966012], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.378000000000002, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.23058284887876784, 0.22241111881449976, 0.12609999548057615], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.066000000000003, 6, 27, 9.0, 11.0, 13.0, 19.99000000000001, 0.231703960191406, 0.3775846830185558, 0.15137690367973694], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.8466089774951077, 2314.6576106898237], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.922000000000003, 3, 17, 5.0, 6.0, 7.0, 12.0, 0.2305842312667606, 0.23164482865862232, 0.13533312792121396], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.324000000000002, 6, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.23170267171716705, 0.3640062549005115, 0.13779973347241672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.385999999999999, 5, 17, 7.0, 9.0, 10.0, 15.0, 0.23170170537089185, 0.35857422804522077, 0.13236865004098802], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2019.348000000001, 1614, 2653, 1976.0, 2387.7000000000003, 2512.8, 2617.0, 0.23150431037875496, 0.35352109881090127, 0.12750823345079862], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.212000000000012, 9, 75, 13.0, 17.0, 20.0, 57.86000000000013, 0.23046604382450103, 0.11989410762280268, 1.8581324783350397], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.501999999999995, 9, 30, 13.0, 17.0, 18.0, 23.0, 0.23170578555444182, 0.4194485661524652, 0.19323900474950517], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.144, 6, 21, 9.0, 12.0, 13.0, 17.0, 0.23170514130538042, 0.39229445364506943, 0.16608552120913012], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.1257102272727275, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.8622066682156133, 3554.7274337825274], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8560000000000003, 1, 20, 3.0, 4.0, 4.0, 7.0, 0.23058922926933653, 0.19381880422305725, 0.09750501589220967], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 682.7520000000001, 493, 885, 672.5, 808.9000000000001, 831.0, 870.0, 0.2305312870146798, 0.20300035821680362, 0.10671077152827951], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.735999999999999, 2, 18, 4.0, 5.0, 5.0, 10.990000000000009, 0.2305914624894562, 0.20890820865829435, 0.11259348754367979], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 943.6999999999997, 695, 1228, 912.0, 1128.9, 1151.9, 1207.0, 0.23050928721918207, 0.218063136349701, 0.12178273865779052], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.400443412162162, 889.8199957770271], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.327999999999992, 19, 1336, 27.0, 33.0, 35.94999999999999, 76.98000000000002, 0.23032548215184806, 0.1198209839815537, 10.50635085089143], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.477999999999994, 25, 284, 37.0, 44.0, 49.94999999999999, 124.8900000000001, 0.23054595587811497, 52.14272068075034, 0.07114504107176205], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 1.1017102153361344, 0.8616727941176471], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.2559999999999993, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.231739506255808, 0.2518152988338868, 0.09934926098271456], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8840000000000012, 2, 10, 4.0, 5.0, 5.0, 7.990000000000009, 0.2317389692250649, 0.2377836448774101, 0.08531796034946237], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.168000000000001, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.2317693690820589, 0.13143631867152578, 0.08985589797419666], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.75800000000001, 87, 168, 127.5, 153.0, 157.0, 163.99, 0.231757874205534, 0.21109656918969105, 0.07559290037563317], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.75999999999996, 70, 469, 97.0, 114.0, 121.94999999999999, 395.61000000000035, 0.23051247533516514, 0.11991826243730061, 68.1610082097018], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 253.28199999999998, 14, 453, 317.0, 414.0, 424.95, 443.97, 0.23173671372312377, 0.1291547459852773, 0.09708500994845712], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 494.7880000000003, 367, 644, 484.5, 589.0, 611.0, 632.95, 0.23171641618122077, 0.12461772222183604, 0.0986605053271604], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.368000000000015, 5, 294, 7.0, 9.0, 12.0, 24.980000000000018, 0.23029673273419335, 0.10383818795967227, 0.1671000707241266], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 462.58200000000016, 330, 630, 471.5, 546.9000000000001, 560.8, 590.0, 0.23170374544470437, 0.1191803513312307, 0.09322455383126778], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.136, 2, 19, 4.0, 5.0, 6.0, 11.990000000000009, 0.23058763413859146, 0.1415749525969471, 0.11529381706929573], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.634000000000002, 2, 30, 4.0, 6.0, 6.0, 10.990000000000009, 0.23058476295886368, 0.13504295722076184, 0.10876214893469839], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 776.8340000000003, 548, 1180, 751.0, 987.7, 1104.0, 1127.96, 0.23050418641703369, 0.210629953390901, 0.1015208867910959], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 279.3599999999999, 190, 372, 273.0, 335.0, 343.95, 362.0, 0.2305443613460102, 0.20413757605082117, 0.09478435168620145], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.149999999999998, 3, 51, 5.0, 6.0, 7.0, 12.0, 0.2305856136713288, 0.15373350030229777, 0.10786182514508448], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1251.7720000000008, 958, 11180, 1149.0, 1485.0, 1504.0, 1542.96, 0.2304856979014738, 0.17324916653490569, 0.12739736817600994], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.32399999999978, 144, 203, 167.0, 186.0, 187.95, 192.0, 0.23177226983854743, 4.481242145092917, 0.11679149534833054], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.78599999999997, 195, 295, 225.0, 253.0, 255.0, 262.99, 0.2317558331784432, 0.44918761686287884, 0.16566920887365272], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.031999999999996, 5, 20, 8.0, 10.0, 11.0, 14.0, 0.2316883920871927, 0.18908623647576933, 0.14299517949131424], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.13, 5, 20, 8.0, 10.900000000000034, 12.0, 16.0, 0.2316895730424548, 0.19270734985936444, 0.14661605794092844], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.349999999999996, 6, 21, 9.0, 12.0, 12.0, 16.0, 0.23168506400531577, 0.18749973573422388, 0.141409340823557], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.562000000000005, 7, 27, 11.0, 14.0, 15.0, 22.970000000000027, 0.23168635228373236, 0.20718506801732087, 0.16109441682228265], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.720000000000008, 5, 46, 9.0, 10.0, 11.0, 30.8900000000001, 0.23167905222879884, 0.17391992601445308, 0.12783072705983528], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2082.5599999999986, 1646, 2730, 2027.5, 2530.4, 2642.8, 2716.99, 0.2314987367113938, 0.19345291405401052, 0.14739958626545777], "isController": false}]}, function(index, item){
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
