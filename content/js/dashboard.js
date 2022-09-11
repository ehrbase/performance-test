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

    var data = {"OkPercent": 97.82599446926186, "KoPercent": 2.1740055307381407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.900659434162944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.98, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.669, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 511, 2.1740055307381407, 186.3040629653277, 1, 3739, 16.0, 549.9000000000015, 1211.0, 2192.0, 26.404979706191945, 175.7134875397816, 218.76840846526463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.98999999999999, 16, 108, 26.0, 29.0, 31.0, 52.0, 0.5720241302659111, 0.33221530323285153, 0.2893637690212324], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.333999999999997, 4, 30, 7.0, 10.0, 12.0, 19.99000000000001, 0.5718219849542199, 6.12996295022404, 0.2077322054716502], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.887999999999997, 5, 46, 7.0, 10.0, 11.0, 21.0, 0.5718017128892111, 6.139876127378552, 0.24234564784562268], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.17400000000001, 14, 256, 20.0, 28.0, 33.94999999999999, 68.91000000000008, 0.5683852742743141, 0.3068858632635546, 6.32883681374583], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.79399999999997, 27, 169, 44.0, 52.0, 54.0, 60.97000000000003, 0.5716330527377221, 2.377459826343595, 0.2389247525114698], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.416, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5716696526878192, 0.35722877347704346, 0.2428479481632826], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.91199999999995, 23, 138, 39.0, 46.0, 48.0, 57.0, 0.5716252105009838, 2.346101701842577, 0.20877717649157027], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 783.2539999999995, 577, 1599, 779.0, 919.9000000000001, 938.95, 1084.6300000000003, 0.5712934197281329, 2.416054546595834, 0.2789518651016274], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.222000000000007, 7, 50, 11.0, 14.0, 16.0, 26.980000000000018, 0.5713900434142155, 0.8496369066257247, 0.2929489968676398], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.397999999999999, 2, 22, 3.0, 5.0, 6.0, 12.0, 0.5692511046317685, 0.5491416422695131, 0.31242101640923237], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.678000000000004, 11, 54, 18.0, 22.0, 24.0, 32.98000000000002, 0.5715912299614405, 0.9313677192138106, 0.3745485501016861], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.6905466221682848, 1913.9028999797736], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.503999999999997, 2, 30, 4.0, 6.0, 7.949999999999989, 18.980000000000018, 0.5692640667997226, 0.571979189555826, 0.3352209299611648], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.524, 12, 48, 19.5, 22.900000000000034, 25.0, 31.99000000000001, 0.5715781615988642, 0.8980497645955342, 0.34104907884463476], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.636, 6, 32, 11.0, 13.0, 15.0, 28.99000000000001, 0.5715742412066162, 0.8846473336919009, 0.3276504683479332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1918.0000000000005, 1467, 3739, 1901.0, 2178.6000000000004, 2241.65, 2458.680000000001, 0.5704500051910951, 0.8711440075367854, 0.3153073270880467], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.761999999999997, 12, 74, 17.0, 23.0, 29.899999999999977, 59.99000000000001, 0.5683484476130503, 0.3068015963771197, 4.583419414441962], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.347999999999995, 14, 80, 23.0, 27.0, 29.0, 46.99000000000001, 0.5716121405845763, 1.034801068971864, 0.47783202376991923], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.45200000000002, 11, 45, 19.0, 22.0, 23.0, 30.970000000000027, 0.5716016850817676, 0.9676356893087621, 0.41083871115252046], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.628162202381], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.7111922554347826, 2969.635578416149], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.464000000000001, 1, 30, 2.0, 3.0, 5.0, 16.970000000000027, 0.5691487242531346, 0.4782616757303601, 0.2417770459473765], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 413.42799999999966, 315, 894, 415.5, 476.0, 487.95, 539.99, 0.568952490191259, 0.5008771024928085, 0.2644740091123431], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0699999999999994, 1, 20, 3.0, 4.0, 5.949999999999989, 10.0, 0.5692063896832481, 0.5156176092107839, 0.2790445386923735], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1162.6039999999996, 938, 1590, 1154.0, 1349.0, 1375.0, 1462.9, 0.5685882295413426, 0.5379200019104564, 0.3015072350009268], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3089599609375, 1028.8848876953125], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.681999999999974, 15, 643, 44.0, 53.0, 60.94999999999999, 109.87000000000012, 0.5679436690751265, 0.30615380631587436, 25.978985800272383], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.53600000000003, 10, 193, 45.0, 54.0, 64.0, 89.94000000000005, 0.5687111072691516, 126.51359351060816, 0.1766114571402248], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.9422743055555554, 1.5263310185185184], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2819999999999996, 1, 25, 2.0, 3.0, 4.0, 10.0, 0.57185337679419, 0.6212963558643564, 0.24627669840452907], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.219999999999999, 2, 52, 3.0, 4.0, 6.0, 13.970000000000027, 0.5718468365433003, 0.5867304907303628, 0.2116503428221785], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2340000000000018, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5718344104787512, 0.32431945986808924, 0.22281438455177902], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.17, 86, 730, 122.0, 148.0, 152.0, 168.95000000000005, 0.5717696728791347, 0.5208933393693153, 0.1876119239134661], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 171.99400000000003, 36, 612, 173.0, 202.0, 231.95, 378.97, 0.568465404900854, 0.3048828744538469, 168.16361372320964], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.31, 1, 33, 2.0, 3.0, 4.0, 9.990000000000009, 0.5718429124645743, 0.318804657460377, 0.2406877883517886], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.3640000000000043, 2, 38, 3.0, 5.0, 6.0, 11.990000000000009, 0.5718998168776787, 0.3076016780684427, 0.24462121073478832], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.410000000000004, 7, 312, 10.0, 16.0, 22.94999999999999, 53.0, 0.5677624481916765, 0.2398219709873389, 0.4130693592800772], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.408000000000002, 2, 60, 4.0, 5.0, 6.0, 9.990000000000009, 0.5718612252927358, 0.29417792375488655, 0.23120170631952403], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6980000000000017, 2, 18, 3.0, 5.0, 7.0, 14.990000000000009, 0.5691403021907349, 0.34953440410441217, 0.2856817532480837], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.846, 2, 28, 4.0, 5.0, 5.949999999999989, 10.0, 0.5691234588136735, 0.33337407012340875, 0.2695555444576481], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.1319999999992, 383, 750, 527.5, 635.9000000000001, 647.95, 686.9300000000001, 0.5686399610595355, 0.519643631914804, 0.25155654527340776], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.615999999999985, 7, 113, 14.0, 25.900000000000034, 35.94999999999999, 59.99000000000001, 0.5688301552792558, 0.5036113337844157, 0.23497573797180196], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.45, 6, 41, 10.0, 12.0, 13.949999999999989, 18.99000000000001, 0.5692731406685316, 0.3794105415011505, 0.2674027154898083], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 534.5359999999997, 419, 3255, 513.0, 606.0, 648.6999999999999, 806.7200000000003, 0.5690288952873027, 0.4275929846561358, 0.3156332153546757], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.76599999999996, 142, 310, 177.0, 191.90000000000003, 197.0, 223.94000000000005, 0.5718998168776787, 11.057628226730253, 0.28930088392835696], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 263.32400000000007, 210, 1195, 264.0, 288.0, 296.0, 374.74000000000024, 0.5717637883696385, 1.108285932924103, 0.4098384967415182], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.301999999999985, 11, 124, 19.0, 22.0, 24.0, 33.98000000000002, 0.5713743724880954, 0.4661823417750088, 0.3537610860912622], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.656, 11, 97, 18.0, 21.0, 23.0, 42.950000000000045, 0.5713809019361814, 0.4751154957214998, 0.3626929553305839], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.710000000000008, 11, 89, 19.0, 21.900000000000034, 23.0, 39.940000000000055, 0.5713397689044902, 0.4624749931724898, 0.34983401865538616], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.532, 13, 70, 21.0, 25.0, 27.0, 51.950000000000045, 0.5713489090663931, 0.5110247306946918, 0.39838195417324673], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.678000000000026, 11, 136, 18.0, 21.0, 23.0, 46.99000000000001, 0.5711381069056308, 0.4287172345207294, 0.3162454166166921], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2164.0860000000025, 1657, 3468, 2140.5, 2472.4, 2553.95, 2959.120000000001, 0.570075375366131, 0.47641822639289366, 0.36409110887641566], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.84735812133073, 2.1272069772388855], "isController": false}, {"data": ["500", 11, 2.152641878669276, 0.04679855349925548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 511, "No results for path: $['rows'][1]", 500, "500", 11, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
