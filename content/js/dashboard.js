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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.870516911295469, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.463, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.994, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.832, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.84, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.476, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 490.45220165922075, 1, 22971, 13.0, 1017.0, 1824.9500000000007, 10589.980000000003, 10.103854122785147, 68.10509866759588, 83.71163736545388], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11149.556000000017, 8960, 22971, 10686.0, 12926.4, 13467.25, 18532.720000000027, 0.21738194747269574, 0.12631079955688862, 0.10996469608482069], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.720000000000002, 5, 20, 7.0, 9.0, 10.0, 15.990000000000009, 0.21814799334386842, 2.3292645471716678, 0.07924907570695221], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.238000000000007, 6, 34, 9.0, 11.0, 12.0, 21.99000000000001, 0.21814542359260206, 2.3423833530064146, 0.09245616585858331], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.61200000000003, 10, 436, 14.0, 20.0, 27.0, 42.99000000000001, 0.2169879897147693, 0.1275037532141346, 2.4161104089138665], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.913999999999994, 28, 111, 46.0, 56.0, 58.94999999999999, 71.98000000000002, 0.21806626684943528, 0.9069150305608971, 0.09114488497222491], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.678000000000004, 1, 11, 3.0, 4.0, 4.0, 8.0, 0.21807149779355256, 0.1362329275913218, 0.09263779447284705], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.93, 24, 87, 40.0, 49.0, 52.0, 66.99000000000001, 0.21806484027186582, 0.8949836766200908, 0.07964477564616973], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1127.9360000000006, 768, 1958, 1111.5, 1481.2000000000003, 1537.9, 1707.8200000000002, 0.21799686171717872, 0.9220160235323253, 0.10644378013534117], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.808, 4, 21, 6.0, 8.0, 10.0, 15.0, 0.21797053735840632, 0.3241268720127138, 0.11175247276676106], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.298000000000008, 2, 18, 4.0, 5.0, 6.0, 12.0, 0.21715743523170913, 0.2094614944850698, 0.11918210800802788], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.444000000000006, 6, 28, 10.0, 12.0, 14.0, 21.980000000000018, 0.21806417454205432, 0.35541905010809444, 0.14289166124777194], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.928785469667319, 2314.6614328522505], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.739999999999999, 3, 17, 4.0, 6.0, 7.0, 13.0, 0.21715875564558473, 0.2181576010939155, 0.12787766567801523], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.020000000000003, 8, 32, 17.0, 20.0, 21.0, 28.99000000000001, 0.21806341371296137, 0.34257890065837704, 0.130114009549433], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.684000000000004, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.2180636039197369, 0.33746833375746704, 0.12500325732508355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2205.7120000000027, 1598, 3637, 2116.5, 2832.3, 3095.1499999999996, 3402.7300000000005, 0.21782031566520146, 0.3326248103601877, 0.12039677604150785], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.139999999999997, 9, 69, 13.0, 18.0, 23.94999999999999, 35.98000000000002, 0.21698318727471722, 0.12750093126471687, 1.7498507426900534], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.792000000000003, 10, 37, 15.0, 18.0, 20.0, 28.980000000000018, 0.21806588642692504, 0.394756752273882, 0.18228945193500762], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.335999999999999, 7, 31, 10.0, 12.0, 14.0, 20.0, 0.21806474516735816, 0.3691384673515644, 0.15673403558903867], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 9.339488636363637, 2479.7230113636365], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.7550139925373134, 2854.39598880597], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8159999999999976, 2, 15, 3.0, 3.0, 4.0, 9.0, 0.21714234592773415, 0.18257769515994052, 0.092243086404848], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 707.4560000000001, 543, 1082, 692.0, 850.9000000000001, 880.95, 998.7400000000002, 0.21708992689713802, 0.1911027362340021, 0.1009128957060915], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7999999999999954, 2, 16, 3.0, 5.0, 6.0, 11.0, 0.2171572466024663, 0.19673725512263088, 0.10645794706488095], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 960.2799999999995, 767, 1317, 930.5, 1149.8000000000002, 1186.9, 1274.7900000000002, 0.21708370617459868, 0.20536245801601122, 0.11511372309844442], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.8125, 997.7065577651515], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.664000000000016, 20, 570, 27.0, 35.0, 41.94999999999999, 69.95000000000005, 0.21693056269618657, 0.12747000867179922, 9.92287847332947], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.08599999999996, 27, 224, 35.0, 45.900000000000034, 52.0, 127.73000000000025, 0.21705053500786373, 49.11752288716498, 0.06740436536377019], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.5514343454258676, 0.4333431913774974], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.127999999999999, 2, 17, 3.0, 4.0, 5.0, 8.980000000000018, 0.21812325010622602, 0.23695768152653118, 0.09393784501645085], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9899999999999958, 2, 23, 4.0, 5.0, 6.0, 15.970000000000027, 0.21812125185893838, 0.22387249580443774, 0.08073042427200942], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2580000000000005, 1, 12, 2.0, 3.0, 4.0, 8.0, 0.2181498017236452, 0.1237126673427129, 0.08500172938255315], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 192.4119999999999, 88, 389, 186.0, 267.0, 275.0, 337.97, 0.21813276607180407, 0.198686144768391, 0.07157481386731072], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.876, 85, 349, 112.0, 135.0, 149.0, 248.0, 0.21702010561066418, 0.12758408552501938, 64.19895546052967], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 258.144, 16, 573, 308.0, 425.90000000000003, 439.0, 520.8300000000002, 0.21811716032396505, 0.12156410602391611, 0.09180517197229389], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 510.67600000000004, 301, 1275, 475.0, 836.0, 907.8, 1019.6100000000004, 0.21815084869406176, 0.1173221229338933, 0.09331061692187406], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.330000000000004, 5, 283, 7.0, 10.900000000000034, 15.949999999999989, 27.980000000000018, 0.21690609484435905, 0.10203694819089472, 0.15780765689360104], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 521.932, 290, 1153, 461.0, 881.9000000000001, 932.0, 1033.98, 0.2180945169293688, 0.11218023731627719, 0.0881749316491784], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.0820000000000025, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.21714112001389702, 0.13331913433978243, 0.10899466375697565], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.663999999999998, 3, 39, 4.0, 5.0, 7.0, 19.99000000000001, 0.2171378195454437, 0.12716769703085745, 0.10284359617142597], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 862.4939999999997, 581, 1502, 853.0, 1103.9, 1260.9, 1347.8500000000001, 0.21704978123552549, 0.19833559648427104, 0.09601909267548149], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 475.0239999999996, 246, 1027, 388.0, 846.9000000000001, 887.9, 943.96, 0.21704789682758452, 0.19218701028568277, 0.08965943394342603], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.549999999999997, 3, 36, 5.0, 6.0, 8.0, 13.980000000000018, 0.21715960449155552, 0.14484375963645743, 0.10200563453167794], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1196.6039999999991, 897, 9358, 1126.0, 1426.9, 1499.85, 1772.94, 0.21707550667594014, 0.16310765268222838, 0.12040907010931054], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.91399999999996, 143, 327, 173.0, 186.90000000000003, 190.95, 238.93000000000006, 0.21821397101856607, 4.2191586056607315, 0.11038558299571995], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.77200000000002, 194, 373, 222.5, 255.0, 262.0, 316.98, 0.21819692534348561, 0.4229078317367865, 0.1564028742208188], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.370000000000001, 6, 31, 9.0, 11.0, 13.949999999999989, 18.99000000000001, 0.2179686369287696, 0.17795095749262832, 0.13495323809847648], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.127999999999998, 6, 29, 9.0, 11.0, 12.0, 18.0, 0.21796854190815765, 0.18123317964008162, 0.13835893773467037], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.160000000000005, 7, 39, 10.0, 12.0, 14.0, 23.0, 0.21796749668689405, 0.17639828533144136, 0.13346251994402594], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.21600000000001, 9, 26, 12.0, 15.0, 16.0, 22.0, 0.21796835186718228, 0.19491777293779053, 0.15198183909489077], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.564000000000005, 6, 35, 9.0, 11.0, 13.0, 24.99000000000001, 0.21796008540547987, 0.1636211887227016, 0.12068688322744832], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2004.7040000000004, 1616, 3079, 1944.5, 2487.0, 2580.95, 2741.9, 0.2178047545906708, 0.18200947905349896, 0.1391057709983386], "isController": false}]}, function(index, item){
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
