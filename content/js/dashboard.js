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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8889597957881302, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.178, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.584, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.917, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.109, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.94388427993994, 1, 14680, 9.0, 847.0, 1514.0, 6023.990000000002, 15.24476259225173, 96.03069986626377, 126.15171140174311], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6128.697999999999, 5049, 14680, 6022.0, 6438.200000000001, 6557.6, 11552.380000000041, 0.32872072413230874, 0.19091162289914584, 0.1656444273947962], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4700000000000006, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.32978593594897554, 0.16930836365989835, 0.11916093388781342], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6880000000000024, 2, 10, 4.0, 5.0, 5.0, 8.990000000000009, 0.32978419581794066, 0.18927487277750185, 0.1391277076106937], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.457999999999998, 8, 373, 12.0, 15.0, 18.94999999999999, 64.88000000000011, 0.32782263484164526, 0.1705414021547782, 3.607009401133611], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.02000000000001, 24, 67, 34.0, 40.0, 42.0, 45.97000000000003, 0.3297274341138641, 1.371302266538139, 0.1371717645825255], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2579999999999996, 1, 8, 2.0, 3.0, 3.0, 6.980000000000018, 0.3297365668620026, 0.20599197186258952, 0.1394296225109835], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.10200000000002, 22, 59, 30.0, 35.0, 36.94999999999999, 40.0, 0.329732870212526, 1.3532926083700052, 0.11978576925689423], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 870.2579999999994, 697, 1102, 875.5, 1033.9, 1069.95, 1087.98, 0.3295833341572917, 1.3938767979182858, 0.16028564493196412], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.618000000000004, 3, 13, 5.0, 7.0, 9.0, 11.0, 0.3297180844434392, 0.49029787535436453, 0.16840093570695186], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.882, 2, 14, 4.0, 5.0, 5.0, 10.980000000000018, 0.32804739628781565, 0.3164215759642953, 0.17940091984489917], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.972000000000007, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.32973678431455306, 0.5373389349155643, 0.2154237389711289], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.9243956997863247, 2527.32914329594], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.112000000000001, 2, 13, 4.0, 5.0, 6.0, 10.0, 0.32804933337094966, 0.32955823216018515, 0.1925367669491609], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.237999999999992, 5, 34, 8.0, 10.0, 11.0, 14.0, 0.32973634940973895, 0.5180177369716222, 0.19610296561575294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.675999999999997, 4, 18, 7.0, 8.0, 9.0, 12.0, 0.32973504470218, 0.5102875221581951, 0.18837402456130403], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.2079999999996, 1334, 1951, 1561.0, 1773.6000000000001, 1841.55, 1905.99, 0.3294217791279679, 0.50304700218769, 0.18143933928532605], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.61, 8, 90, 11.0, 14.0, 17.0, 30.0, 0.32780522600203504, 0.17053234564799225, 2.642929634641407], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.212, 8, 31, 11.0, 13.0, 15.0, 21.980000000000018, 0.3297396112238088, 0.596915639376647, 0.27499768357923116], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.937999999999998, 5, 26, 8.0, 10.0, 11.0, 15.0, 0.3297391763115376, 0.5582735423467537, 0.23635601114518417], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.070763221153847, 2622.7463942307695], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.8622066682156133, 3554.7274337825274], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.303999999999998, 1, 24, 2.0, 3.0, 4.0, 6.990000000000009, 0.32804890290605404, 0.2757372765822947, 0.13871599117023573], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 571.2599999999999, 451, 714, 568.0, 660.0, 669.0, 689.97, 0.3279471296755422, 0.2887824280270832, 0.1518036518224678], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.354000000000001, 1, 20, 3.0, 4.0, 5.0, 7.990000000000009, 0.32804825721082875, 0.29720082880572063, 0.16017981309122498], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 766.1560000000005, 640, 965, 746.0, 885.9000000000001, 903.0, 930.97, 0.32791013688280757, 0.31020491083959423, 0.17324158598984266], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.131999999999994, 16, 736, 21.0, 25.0, 28.0, 49.99000000000001, 0.3276494884408537, 0.1704513271360617, 14.945808208078395], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.56999999999999, 20, 257, 29.0, 35.0, 39.0, 123.88000000000011, 0.32796412334861863, 74.17584755255953, 0.10120767868961278], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 1.173185822147651, 0.9175755033557047], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.719999999999999, 1, 9, 3.0, 3.900000000000034, 4.0, 6.0, 0.32973417490287676, 0.35829932984001955, 0.14136064724840128], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4440000000000017, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.329732870212526, 0.3383336172470735, 0.12139579303722883], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8559999999999994, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.32978658850284803, 0.18702184551707898, 0.12785671448792058], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 93.43400000000003, 66, 121, 93.0, 112.0, 116.0, 118.99000000000001, 0.3297637506537566, 0.3003651834690091, 0.10755966085776827], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.61999999999999, 58, 406, 79.0, 91.0, 98.89999999999998, 355.98, 0.32788605303884794, 0.1705743938616452, 96.95372851526638], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.5000000000001, 12, 363, 264.0, 335.90000000000003, 339.0, 345.99, 0.3297265643547119, 0.18376781986609145, 0.13813739854313617], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 436.22399999999993, 356, 547, 422.0, 508.90000000000003, 516.95, 534.0, 0.3296830822466979, 0.17730446310945217, 0.14037287486285185], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.3519999999999985, 5, 286, 6.0, 8.0, 11.0, 23.99000000000001, 0.3275919567002055, 0.14770750227348817, 0.23769611701977805], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 413.9099999999998, 319, 511, 420.5, 473.0, 482.0, 497.97, 0.32966547525563905, 0.16956845944521257, 0.13263884355988603], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5439999999999996, 2, 14, 3.0, 5.0, 5.0, 9.0, 0.32804567445534577, 0.20141171483087933, 0.16402283722767289], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.222000000000004, 2, 43, 4.0, 5.0, 6.0, 9.0, 0.3280370655641122, 0.1921163169818884, 0.15472842057369746], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.7680000000001, 551, 870, 676.5, 814.7, 840.95, 854.99, 0.32788347283682157, 0.299613129265764, 0.14440961547793607], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.02799999999996, 172, 319, 240.0, 292.0, 297.95, 314.98, 0.32796412334861863, 0.29039877957170507, 0.1348368124314145], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.4620000000000015, 3, 37, 4.0, 5.0, 6.0, 10.0, 0.3280501943041301, 0.21871401186852799, 0.15345316706218587], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 975.972, 820, 8283, 922.5, 1078.9, 1108.95, 1139.98, 0.32787895758098773, 0.2464567504293575, 0.1812299706941788], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.44199999999998, 115, 166, 135.5, 150.90000000000003, 152.0, 157.0, 0.3297796280613443, 6.376182831928142, 0.16617801570278676], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.28400000000008, 158, 267, 176.5, 204.0, 206.0, 215.0, 0.3297463525107217, 0.6391121907144086, 0.23571711917758623], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.162, 5, 18, 7.0, 9.0, 9.0, 13.0, 0.32971460563165733, 0.26908768854729725, 0.20349573316328853], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.987999999999998, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.3297163450283721, 0.27424092600011213, 0.20864862458826672], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.359999999999987, 6, 17, 8.0, 10.0, 11.0, 14.0, 0.3297111268932837, 0.2668309648122394, 0.20123970147295148], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.790000000000013, 7, 20, 10.0, 12.0, 12.0, 15.0, 0.32971243141157147, 0.29484469782020517, 0.2292531749658583], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.791999999999998, 4, 30, 8.0, 9.0, 10.0, 14.990000000000009, 0.32966786621814254, 0.2474794779692855, 0.18189682071606497], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1627.4300000000019, 1416, 1968, 1603.0, 1824.8000000000002, 1886.95, 1960.89, 0.3293577655315241, 0.2752292319755669, 0.20970826477202514], "isController": false}]}, function(index, item){
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
