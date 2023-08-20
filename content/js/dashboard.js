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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.889661774090619, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.161, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.586, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.95, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.996, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.124, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.7812805786013, 1, 18449, 9.0, 846.9000000000015, 1511.0, 6103.0, 15.178842998262231, 95.61545530555614, 125.60622113606262], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6210.5660000000025, 4932, 18449, 6071.5, 6564.3, 6764.95, 15207.430000000071, 0.3271763113880913, 0.190014672017199, 0.16486618816040538], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.385999999999999, 1, 15, 2.0, 3.0, 4.0, 6.990000000000009, 0.32820739031144913, 0.1684979562115546, 0.11859056095237909], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.633999999999999, 2, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.3282054513612649, 0.1883687752143838, 0.13846167479303365], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.660000000000005, 8, 348, 12.0, 16.0, 19.0, 58.90000000000009, 0.32626746754454367, 0.16973236585513074, 3.5898980047113023], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.41200000000003, 23, 56, 33.0, 40.0, 41.94999999999999, 45.98000000000002, 0.3281236054746767, 1.3646321092490825, 0.13650454680880106], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3079999999999994, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.32813135754505246, 0.20498917063979052, 0.1387508572431716], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.586000000000002, 21, 65, 29.0, 35.0, 36.0, 40.98000000000002, 0.32812683545948584, 1.3467011061073593, 0.11920232694426634], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 865.5839999999997, 673, 1099, 864.5, 1020.9000000000001, 1050.9, 1073.98, 0.3279880035107836, 1.387129811215025, 0.1595097907698928], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.66, 4, 21, 5.0, 7.0, 8.0, 12.0, 0.32809066326152303, 0.48787786509272824, 0.16756974305251615], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.894000000000002, 2, 24, 4.0, 5.0, 5.0, 8.980000000000018, 0.32646579878998716, 0.31489602941685374, 0.17853598371327423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.829999999999992, 5, 18, 8.0, 10.0, 11.0, 15.0, 0.32813501837227965, 0.5347286977617255, 0.21437727274517102], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 1.0227356678486998, 2796.193945774232], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.128000000000005, 2, 21, 4.0, 5.0, 6.0, 10.990000000000009, 0.32647006204237056, 0.3279716968003975, 0.19160987039791474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.115999999999998, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.32813480302724046, 0.5155016982206563, 0.1951504834410053], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.7200000000000015, 4, 19, 6.0, 8.0, 9.0, 13.0, 0.3281345876824838, 0.5078107055139736, 0.18745970097095024], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1575.0380000000007, 1341, 1949, 1562.5, 1748.0, 1781.0, 1900.97, 0.3277961999242135, 0.5005646443198163, 0.18054400073950824], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.252, 8, 75, 11.0, 14.0, 19.94999999999999, 51.97000000000003, 0.32625618418597124, 0.16972649597432493, 2.630440484999393], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.071999999999996, 8, 27, 11.0, 13.0, 15.0, 19.99000000000001, 0.32813652579546854, 0.5940136320628105, 0.2736607353802052], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.964000000000008, 5, 28, 8.0, 10.0, 11.0, 15.0, 0.32813652579546854, 0.555560132946154, 0.23520723626354875], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.734809027777779, 2525.607638888889], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 1.0447459177927927, 4307.304863457207], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.340000000000003, 1, 22, 2.0, 3.0, 4.0, 6.0, 0.32646707775401096, 0.27440769384145974, 0.13804711393309252], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 566.6579999999999, 444, 685, 558.0, 654.0, 666.0, 679.99, 0.32636479228839155, 0.2873890594280914, 0.15107120268036878], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3200000000000025, 1, 20, 3.0, 4.0, 5.0, 8.990000000000009, 0.32646473299428885, 0.295766208443488, 0.1594066079073676], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.0760000000002, 615, 958, 752.0, 896.8000000000001, 911.8499999999999, 931.98, 0.32632666473916383, 0.30870693691355017, 0.17240500549207777], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.186000000000007, 16, 549, 22.0, 27.0, 34.0, 50.960000000000036, 0.32614105339646554, 0.1696666021043273, 14.877000589989166], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.881999999999998, 21, 245, 29.0, 37.0, 42.94999999999999, 96.0, 0.32638375287788873, 73.8184141908963, 0.10071998623966097], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 1.092529296875, 0.8544921875], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.679999999999996, 1, 17, 2.0, 4.0, 4.0, 6.0, 0.3281509546895725, 0.3565789538990568, 0.14068190342648662], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.374000000000001, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.3281494471338115, 0.3367088921855147, 0.12081283356391302], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8080000000000003, 1, 17, 2.0, 3.0, 3.0, 5.990000000000009, 0.32820868295763284, 0.1861270158987568, 0.1272449679044729], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.55199999999996, 66, 120, 90.0, 110.0, 114.0, 118.0, 0.3281873555975635, 0.298929324647855, 0.10704548512654904], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.15999999999998, 59, 333, 80.0, 94.0, 106.84999999999997, 314.8900000000001, 0.3263247479467647, 0.169762164530001, 96.492060967579], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.34, 12, 363, 261.5, 330.0, 335.0, 341.0, 0.32814492454963745, 0.1828863182516832, 0.1374747779607368], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 431.46799999999996, 337, 561, 422.0, 500.90000000000003, 515.95, 536.99, 0.32810853305299736, 0.17645766624767206, 0.13970246133897155], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.386000000000001, 4, 291, 6.0, 8.0, 10.0, 28.99000000000001, 0.3260827741557228, 0.1470270289603894, 0.23660107538838088], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 402.1060000000006, 284, 513, 402.0, 466.0, 476.0, 497.97, 0.3280917396998879, 0.16875898458723435, 0.13200566089487678], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.463999999999999, 2, 22, 3.0, 4.0, 5.0, 10.990000000000009, 0.32646366720554937, 0.20044040254765716, 0.16323183360277468], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.222000000000001, 2, 44, 4.0, 5.0, 6.0, 10.0, 0.32645471485486477, 0.19118960648985445, 0.15398205788564423], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.1139999999994, 516, 869, 682.0, 799.9000000000001, 832.8499999999999, 852.99, 0.3263006834694116, 0.29816680911051086, 0.14371250805146937], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.38600000000002, 179, 322, 238.0, 286.0, 296.95, 314.97, 0.3263771483775792, 0.28899357832561995, 0.13418435494820394], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4419999999999975, 3, 52, 4.0, 5.0, 6.0, 9.0, 0.3264734727244472, 0.2176627974254955, 0.15271561858887717], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 974.568, 811, 7970, 923.5, 1087.8000000000002, 1111.0, 1141.95, 0.3263100532864317, 0.2452774522608392, 0.18036278335949252], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.5360000000001, 118, 168, 138.0, 151.0, 152.0, 155.99, 0.3281998500783085, 6.345638333734284, 0.16538195570352263], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.83400000000006, 159, 267, 186.0, 204.0, 206.0, 212.96000000000004, 0.3281733542926715, 0.6360634160138752, 0.23459267123265193], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.147999999999999, 5, 29, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.32808420477966194, 0.26775708083633915, 0.20248947013744759], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.939999999999995, 5, 28, 7.0, 8.0, 9.0, 14.0, 0.32808592701662936, 0.2728848290032553, 0.20761687569021078], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.482000000000005, 5, 20, 8.0, 10.0, 11.0, 16.980000000000018, 0.3280816214581128, 0.2655122270688991, 0.2002451302844927], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.814000000000005, 6, 32, 9.0, 12.0, 13.0, 16.99000000000001, 0.3280818367333548, 0.2933865417139651, 0.22811940210366075], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.838000000000004, 5, 28, 8.0, 9.0, 11.0, 16.0, 0.32801446937427303, 0.24623828393818106, 0.18098454609029713], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1614.138000000001, 1396, 1950, 1594.5, 1799.9, 1865.75, 1935.99, 0.327717350339679, 0.2738584119718425, 0.20866378166159252], "isController": false}]}, function(index, item){
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
