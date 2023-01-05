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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8712827058072751, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.475, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.989, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.817, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.488, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.5235907253775, 1, 25197, 13.0, 1019.0, 1807.9000000000015, 10477.990000000002, 10.153172299398715, 64.04710474765015, 84.1202443451301], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11001.905999999994, 8937, 25197, 10597.0, 12668.700000000003, 13066.199999999999, 23614.52000000008, 0.21861545585039008, 0.12702753538181843, 0.11058867786181842], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9900000000000033, 2, 12, 3.0, 4.0, 4.0, 7.990000000000009, 0.2193831122390328, 0.11262880462420112, 0.07969777124308615], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.499999999999996, 3, 18, 4.0, 5.0, 6.949999999999989, 11.0, 0.2193816683800375, 0.1258488082419938, 0.09298012116888309], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.924000000000007, 10, 462, 14.0, 21.0, 26.0, 50.97000000000003, 0.21807530227417649, 0.12814266614394015, 2.4282173794239847], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.784000000000034, 27, 88, 46.0, 56.0, 58.0, 64.96000000000004, 0.2193207548494012, 0.9121323162936459, 0.09166922175346066], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7520000000000016, 1, 21, 3.0, 3.900000000000034, 4.0, 8.0, 0.21932546890688626, 0.13702872714025469, 0.09317048727978078], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.196000000000026, 23, 82, 39.5, 49.0, 51.0, 56.99000000000001, 0.2193197928217509, 0.9001218417401535, 0.08010312745638168], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1116.4819999999997, 755, 1829, 1109.5, 1413.0, 1507.55, 1593.91, 0.21925035672033039, 0.9273176708552254, 0.10705583824234882], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.658000000000001, 4, 30, 6.0, 8.0, 10.0, 15.0, 0.21921459793850592, 0.3259768168231859, 0.11239029679464416], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.321999999999999, 2, 23, 4.0, 5.0, 6.0, 12.990000000000009, 0.21824816562416793, 0.21051356998891302, 0.11978073152420154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.20000000000001, 6, 31, 10.0, 12.0, 13.0, 19.980000000000018, 0.21931921560921178, 0.35746461997243595, 0.14371405632205184], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.8708428899082569, 2170.260536123853], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.644000000000002, 3, 25, 4.0, 6.0, 7.0, 13.990000000000009, 0.21824949933564852, 0.21925336177888183, 0.12851996884706646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.735999999999988, 7, 39, 16.0, 20.0, 20.94999999999999, 24.99000000000001, 0.21931825359506482, 0.34456268378869653, 0.13086274701814904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.546000000000002, 5, 27, 7.0, 9.0, 10.0, 14.0, 0.21931863839971083, 0.3394105854085994, 0.12572269603577174], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2200.148000000001, 1557, 4141, 2161.5, 2829.0, 3045.2, 3328.8, 0.21905785843780204, 0.3345146131032963, 0.12108080847245699], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.088000000000003, 9, 62, 13.0, 18.0, 23.0, 40.97000000000003, 0.218070736913357, 0.12813998350403913, 1.7586212357719748], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.452000000000007, 9, 29, 14.0, 17.0, 18.0, 25.99000000000001, 0.21932065864625638, 0.3970282208390156, 0.18333836308710497], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.154, 6, 33, 10.0, 12.0, 14.0, 21.99000000000001, 0.2193202738345211, 0.3712638174514019, 0.15763644681856204], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.6873089334239131, 2598.4311311141305], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7199999999999993, 2, 20, 2.5, 3.0, 4.0, 8.0, 0.2182341626377003, 0.18349571682720697, 0.09270689526113245], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 695.8739999999999, 539, 935, 673.0, 839.9000000000001, 853.95, 907.96, 0.21818235768728447, 0.19206439537741402, 0.10142070533119864], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6019999999999985, 2, 12, 3.0, 5.0, 5.0, 9.990000000000009, 0.2182515952009093, 0.19772869861702694, 0.10699443436607077], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 956.6059999999994, 741, 1395, 916.0, 1155.0, 1193.9, 1280.89, 0.2181777878430464, 0.20639746568499753, 0.11569388554567793], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 8.452868852459016, 1079.4857838114754], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.123999999999988, 20, 557, 27.0, 34.900000000000034, 44.0, 77.99000000000001, 0.2180187243201195, 0.1281094205182218, 9.972653366361717], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.69200000000005, 26, 280, 35.0, 43.0, 49.0, 108.88000000000011, 0.21814209252365968, 49.36453725763323, 0.06774334513918338], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.5091398665048543, 0.40010618932038833], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.070000000000003, 2, 22, 3.0, 4.0, 5.0, 8.0, 0.21934846486783377, 0.23828869071120667, 0.09446550098311982], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.83, 2, 14, 4.0, 5.0, 5.0, 9.0, 0.21934731014393571, 0.22513088179812152, 0.08118420951616372], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0740000000000016, 1, 12, 2.0, 3.0, 4.0, 6.990000000000009, 0.2193837860464014, 0.1244000333353663, 0.08548254944581463], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 202.76600000000005, 88, 376, 200.5, 303.0, 311.0, 365.98, 0.21936443979586823, 0.1998080142988323, 0.07197895680801926], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 120.9059999999999, 84, 373, 117.0, 140.90000000000003, 162.0, 293.0, 0.2181110708817358, 0.128225453780083, 64.52168514794474], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 278.6039999999999, 17, 546, 343.5, 458.0, 479.0, 508.0, 0.2193435573752297, 0.1222724662912821, 0.09232136057492578], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 499.11799999999977, 298, 1060, 465.5, 794.9000000000001, 887.9, 931.97, 0.21939610782528876, 0.11797939996700281, 0.09384325705808248], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.312000000000006, 4, 253, 7.0, 11.0, 15.0, 27.960000000000036, 0.21799657658176136, 0.10254993252460963, 0.15860102495450412], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 514.6080000000004, 285, 1166, 456.0, 857.8000000000001, 911.8499999999999, 996.7400000000002, 0.21932123586639124, 0.11281121888983099, 0.0886708902819199], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.981999999999998, 2, 20, 4.0, 5.0, 6.0, 11.990000000000009, 0.21823273386256226, 0.133989357526105, 0.10954260273960645], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.49, 3, 29, 4.0, 5.0, 7.0, 12.980000000000018, 0.21823016211445823, 0.1278074321500603, 0.1033609654546018], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 867.8939999999997, 585, 1446, 870.0, 1165.9, 1254.95, 1325.94, 0.21814247321210428, 0.1993340757903302, 0.09650248082527661], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 476.8499999999999, 243, 1062, 388.0, 865.8000000000001, 894.95, 963.98, 0.21814380563212404, 0.19315739258271797, 0.09011213845936375], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.578000000000002, 3, 52, 5.0, 7.0, 8.0, 14.0, 0.21825045199668608, 0.1455713464001334, 0.10251803458047462], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1189.0459999999994, 907, 10566, 1092.5, 1413.0, 1438.75, 1627.6600000000003, 0.21816131895097565, 0.1639235176047458, 0.1210113566056193], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.46199999999993, 142, 271, 169.0, 189.0, 192.0, 224.94000000000005, 0.219454269899784, 4.243139736079906, 0.11101299981258606], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.95, 194, 473, 222.0, 257.0, 261.95, 300.9100000000001, 0.2194413637315214, 0.4253197939566287, 0.15729488376849288], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.07200000000001, 6, 24, 9.0, 11.0, 12.0, 19.0, 0.21921219521284407, 0.17896620624798598, 0.1357231755517023], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.089999999999995, 6, 33, 9.0, 11.0, 13.0, 25.960000000000036, 0.2192131562967883, 0.1822680327482534, 0.1391489761649535], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.877999999999997, 6, 22, 10.0, 12.0, 13.0, 19.0, 0.21920979253985234, 0.17740365935127053, 0.13422318351805412], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.164000000000001, 8, 37, 12.0, 15.0, 16.0, 25.980000000000018, 0.21921075360272874, 0.19604120449732784, 0.15284812311752766], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.159999999999995, 5, 28, 9.0, 11.0, 12.0, 21.980000000000018, 0.2191707805022167, 0.1645300494920498, 0.12135725834448913], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1993.5999999999997, 1614, 3061, 1919.0, 2489.0000000000005, 2566.0, 2647.92, 0.2190184207632967, 0.1830236844056256, 0.13988090544843365], "isController": false}]}, function(index, item){
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
