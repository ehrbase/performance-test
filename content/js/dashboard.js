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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8872580302063391, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.158, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.551, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.911, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.988, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.098, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 329.6646245479693, 1, 19226, 10.0, 855.0, 1534.8500000000022, 6101.0, 14.983754053518233, 94.38653961818041, 123.9918434698913], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6250.339999999999, 5152, 19226, 6065.5, 6714.400000000001, 6951.9, 16610.140000000083, 0.3231299661036665, 0.18766467006006987, 0.16282720948192572], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4919999999999987, 1, 15, 2.0, 3.0, 4.0, 7.980000000000018, 0.32418756974085094, 0.1664342258676394, 0.1171380867227684], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7340000000000004, 2, 15, 4.0, 5.0, 5.0, 8.990000000000009, 0.3241850474185469, 0.1860613224788615, 0.13676556687969949], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.844000000000014, 8, 398, 12.0, 15.0, 17.94999999999999, 42.98000000000002, 0.32214605973489957, 0.16758830808728356, 3.544550444368275], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.96399999999998, 23, 51, 34.0, 40.0, 41.0, 45.99000000000001, 0.32414133340075474, 1.3480702519210235, 0.13484785940304836], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.460000000000002, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.32414952888107473, 0.2025016553911253, 0.13706713477100133], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.02800000000001, 21, 51, 30.0, 35.0, 37.0, 40.0, 0.3241417536717157, 1.3303454976305238, 0.11775462145105296], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 872.8020000000001, 689, 1107, 874.5, 1008.9000000000001, 1050.0, 1074.97, 0.3239993442253273, 1.3702609375293624, 0.157569993578333], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.947999999999995, 4, 13, 6.0, 8.0, 9.0, 11.0, 0.3240877577794025, 0.48192545864089265, 0.1655252903502222], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.038, 2, 24, 4.0, 5.0, 5.0, 9.0, 0.32235333406829897, 0.310929308195898, 0.17628697956860098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.347999999999997, 5, 23, 8.0, 10.0, 11.0, 15.990000000000009, 0.3241440651814818, 0.5282250420009673, 0.21176990195938605], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.8041211663568772, 2198.4944963986986], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.266, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.3223576984176105, 0.32384041790935564, 0.18919626635642964], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.453999999999999, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.32414154353609903, 0.5092282641620681, 0.19277558595066824], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.758, 4, 13, 7.0, 8.0, 9.0, 12.0, 0.32413986246097354, 0.5016285951567669, 0.18517755814420853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1588.8980000000008, 1276, 1946, 1565.5, 1789.0, 1853.6999999999998, 1897.98, 0.3238222423135933, 0.4944961704376846, 0.17835521939928384], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.077999999999996, 7, 64, 11.0, 15.0, 20.0, 34.0, 0.3221354747181637, 0.16758280150108687, 2.5972172649151943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.520000000000003, 8, 27, 11.0, 14.0, 15.0, 20.0, 0.3241467970082547, 0.5867911709786835, 0.2703333639111812], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.495999999999997, 5, 26, 8.0, 10.0, 12.0, 17.99000000000001, 0.32414574630020043, 0.5488034392755083, 0.2323466579925265], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.1257102272727275, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.8081309886759582, 3331.7828560540074], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4740000000000015, 1, 21, 2.0, 3.0, 4.0, 8.0, 0.3223653882729919, 0.27096007162153013, 0.1363127081271538], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 582.3160000000006, 444, 762, 577.0, 670.9000000000001, 684.0, 713.98, 0.32226274855320136, 0.2837768974588938, 0.14917240509200924], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4439999999999986, 1, 19, 3.0, 4.0, 5.0, 9.990000000000009, 0.3223682980436757, 0.29205497439267425, 0.15740639552913854], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 791.9319999999996, 621, 966, 782.0, 909.9000000000001, 923.0, 961.96, 0.3222247427357654, 0.30482649466363604, 0.1702378767773917], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.611505681818182, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.406, 16, 573, 21.0, 27.0, 32.94999999999999, 53.98000000000002, 0.3220188780347059, 0.16752214503698065, 14.688966594727649], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.592000000000013, 20, 254, 29.0, 35.0, 38.0, 102.95000000000005, 0.32227084931259625, 72.88819626113445, 0.09945076990505901], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 1.1277721774193548, 0.8820564516129031], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.726000000000001, 1, 11, 3.0, 3.0, 4.0, 6.990000000000009, 0.3241444854595267, 0.3522254007965527, 0.13896428624680882], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4600000000000004, 2, 11, 3.0, 5.0, 5.0, 7.990000000000009, 0.3241434347664579, 0.332598387054165, 0.11933796377632287], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8939999999999964, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.32418841052367453, 0.18384712097187794, 0.12568632712685426], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.75799999999998, 66, 119, 90.0, 110.90000000000003, 113.0, 117.99000000000001, 0.3241724363957471, 0.2952723370612083, 0.10573593140251909], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.70599999999997, 57, 360, 82.0, 97.90000000000003, 106.89999999999998, 299.9100000000001, 0.3222118684808484, 0.16762254341643823, 95.27590982159774], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.29399999999998, 12, 362, 260.0, 334.0, 338.0, 352.0, 0.32413944219491675, 0.18065392681158293, 0.13579669990392507], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 444.38800000000003, 340, 569, 437.0, 516.0, 531.9, 555.98, 0.32409490017228887, 0.1742991235096496, 0.13799353171398235], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.347999999999996, 4, 277, 6.0, 8.0, 11.0, 33.92000000000007, 0.32196683097707274, 0.14517119680705495, 0.23361460489840338], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 413.96599999999984, 298, 532, 415.0, 479.0, 494.0, 514.98, 0.32407305384408974, 0.16669191229513722, 0.13038876775758299], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.732, 2, 21, 3.0, 5.0, 6.0, 10.0, 0.3223614393825102, 0.19792173882243944, 0.1611807196912551], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.324, 2, 45, 4.0, 5.0, 6.0, 11.0, 0.322352918422147, 0.1887873717841267, 0.15204732382607125], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 690.4279999999997, 538, 872, 689.0, 811.9000000000001, 842.0, 860.0, 0.32219816475925356, 0.2944180124481261, 0.14190563701799155], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 250.94400000000013, 178, 323, 246.5, 298.0, 304.0, 311.99, 0.32228082003710096, 0.2853664475935936, 0.13250021995665967], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.848000000000007, 3, 67, 4.0, 6.0, 7.0, 10.990000000000009, 0.3223610237154558, 0.2149209907234168, 0.15079192417939777], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 992.1260000000001, 818, 8807, 945.5, 1085.9, 1103.9, 1143.99, 0.3222031477958727, 0.2421904149316027, 0.17809275551998432], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.39800000000008, 116, 161, 137.0, 151.0, 153.0, 159.0, 0.3241772705051849, 6.2678630540270595, 0.16335495271550332], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.94800000000015, 159, 267, 180.0, 204.0, 207.0, 212.99, 0.3241478477231207, 0.6282612059126512, 0.23171506302082454], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.550000000000005, 5, 16, 7.0, 9.0, 11.0, 13.990000000000009, 0.3240852370100155, 0.26449343107582035, 0.20002135721711894], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.375999999999998, 5, 19, 7.0, 9.0, 10.0, 14.970000000000027, 0.32408586719868604, 0.2695577870622977, 0.2050855878366685], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.704, 6, 19, 9.0, 10.0, 12.0, 15.0, 0.3240837665793153, 0.2622768146503363, 0.19780503331257038], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.136, 7, 20, 10.0, 12.0, 14.0, 18.0, 0.3240837665793153, 0.2898112752874461, 0.22533949394968017], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.090000000000003, 5, 33, 8.0, 9.0, 10.949999999999989, 15.0, 0.32403965986204986, 0.24325442083257454, 0.17879141388872868], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1633.3400000000001, 1427, 1966, 1621.0, 1823.9, 1878.8, 1946.98, 0.32374717935269987, 0.27054072152724495, 0.2061358993534769], "isController": false}]}, function(index, item){
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
