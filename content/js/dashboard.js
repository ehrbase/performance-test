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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8795788130185067, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.372, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.84, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.321, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.948, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.539, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.501, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.953, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.868, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 288.22978089768185, 1, 7024, 24.0, 798.0, 1891.9500000000007, 3904.980000000003, 17.07006387929457, 114.98190044668664, 141.39417669032122], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 32.55800000000002, 12, 94, 29.0, 52.0, 58.94999999999999, 68.99000000000001, 0.3695521545260161, 0.21462535333805374, 0.1862196403666253], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.084000000000003, 4, 108, 13.0, 24.0, 32.0, 52.98000000000002, 0.369337865847623, 3.9519678240699707, 0.13345215855822318], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.850000000000007, 5, 73, 13.0, 28.0, 32.0, 47.960000000000036, 0.36931958775070334, 3.965753011939733, 0.155806701082328], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 68.49400000000001, 15, 283, 62.5, 126.90000000000003, 144.0, 170.99, 0.36708213022165154, 0.19813473065899317, 4.08665652785823], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 64.89600000000002, 27, 170, 54.0, 112.0, 125.89999999999998, 146.97000000000003, 0.36921840893449476, 1.5355411428842014, 0.1536006271543894], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.933999999999998, 1, 52, 6.0, 13.0, 16.0, 21.0, 0.36924376661135394, 0.23067278314350512, 0.15613530365499637], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 58.09800000000005, 24, 136, 50.0, 96.0, 107.94999999999999, 129.97000000000003, 0.3692219533465909, 1.5153640581535652, 0.1341314127391912], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1182.7979999999989, 580, 2562, 911.0, 2274.7000000000003, 2384.65, 2480.92, 0.3690832267913085, 1.5609300987279175, 0.17949555365436684], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 17.812, 5, 63, 16.0, 29.0, 33.0, 45.97000000000003, 0.3687943890146478, 0.5484051797817328, 0.18835885298306718], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 11.658000000000001, 2, 53, 9.0, 24.0, 29.0, 38.99000000000001, 0.3676951836343286, 0.3546642674096316, 0.20108330355002346], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 24.23800000000003, 8, 66, 20.0, 41.0, 48.0, 54.99000000000001, 0.3692224986467995, 0.601684839567286, 0.24122055819795793], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1092.0, 1092, 1092, 1092.0, 1092.0, 1092.0, 1092.0, 0.9157509157509157, 0.39080385760073255, 1083.1410614125457], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.863999999999994, 2, 61, 8.0, 20.0, 24.0, 35.97000000000003, 0.36770113251948816, 0.3693924140958229, 0.21580896547286366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.704, 9, 99, 21.0, 41.0, 45.94999999999999, 62.99000000000001, 0.3692214080479929, 0.5800489954500846, 0.21958577880979263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 17.516000000000005, 5, 55, 14.0, 31.0, 36.0, 43.99000000000001, 0.3692230439486189, 0.5713979003670078, 0.21093308663080282], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2983.418, 1537, 6161, 2722.5, 4469.0, 5112.15, 6051.5, 0.368382740826533, 0.5625427496658768, 0.20289830647086385], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 66.24, 11, 473, 58.0, 129.80000000000007, 145.89999999999998, 202.73000000000025, 0.36707027266713993, 0.1981283304744677, 2.959504073378816], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 28.860000000000014, 12, 73, 26.0, 44.900000000000034, 48.0, 61.99000000000001, 0.3692301330188477, 0.6684038963655939, 0.3079321617168906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 23.574000000000016, 8, 68, 20.0, 40.0, 44.0, 56.0, 0.3692263157933603, 0.6251282772989323, 0.2646602693284438], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 2.3408055904522613, 685.3407663316583], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.6197669993234101, 2587.8800532814616], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.780000000000006, 1, 37, 6.0, 19.900000000000034, 22.0, 29.99000000000001, 0.3676724714796464, 0.30904235637426414, 0.15547087905340518], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.2980000000001, 320, 1334, 466.0, 1185.4, 1239.0, 1296.0, 0.36759164978808345, 0.3236924477836062, 0.17015472851518706], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 9.795999999999994, 2, 40, 7.0, 20.0, 24.0, 32.0, 0.3676832864414582, 0.33310884928184104, 0.17953285470774327], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1698.7099999999998, 923, 3703, 1342.0, 3099.2000000000003, 3484.1, 3631.98, 0.3674376733846521, 0.34759819197699837, 0.19412478642685232], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.774980709876543, 812.9219714506172], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 92.83200000000006, 28, 950, 78.5, 159.7000000000001, 178.89999999999998, 242.85000000000014, 0.36684647035000084, 0.19800753186245018, 16.77964353345053], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 108.91800000000006, 29, 312, 96.0, 199.90000000000003, 221.84999999999997, 262.97, 0.36725738793324436, 83.10873655172307, 0.11333333455752463], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 1.6235729489164086, 1.2698335913312693], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.2, 1, 33, 6.0, 17.0, 20.0, 28.0, 0.36933732020659255, 0.4013333296553492, 0.15833894879950597], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 9.978000000000005, 2, 67, 7.0, 20.0, 23.0, 38.930000000000064, 0.36933486484190625, 0.3789685896855852, 0.1359758242630846], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.493999999999996, 1, 29, 5.0, 13.0, 16.0, 20.0, 0.3693501431970505, 0.20945832192964767, 0.14319531918870024], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 188.122, 87, 449, 141.0, 370.80000000000007, 392.0, 421.9200000000001, 0.3692983110511043, 0.3363752223637455, 0.12045472254987188], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 311.78600000000006, 115, 1224, 268.0, 503.90000000000003, 544.0, 667.5800000000004, 0.36711096883521566, 0.19815029646964064, 108.59816450940023], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.849999999999999, 1, 28, 6.0, 14.0, 16.0, 19.99000000000001, 0.3693299542104723, 0.2058401349291588, 0.154729053082317], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.68599999999998, 2, 44, 7.0, 20.0, 24.0, 30.99000000000001, 0.36946149509244297, 0.19869740230699148, 0.15730977720732925], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 60.34199999999997, 7, 400, 50.0, 123.0, 141.89999999999998, 175.0, 0.3667732754320589, 0.15498678126192014, 0.2661255309043162], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 11.240000000000002, 2, 449, 8.5, 20.0, 23.0, 28.0, 0.3693395027803878, 0.1899753999115801, 0.14860144057179664], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 10.466000000000006, 2, 40, 9.0, 20.0, 23.0, 31.960000000000036, 0.36766949747668426, 0.22573973609234976, 0.18383474873834213], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 11.689999999999996, 2, 39, 10.0, 23.0, 27.94999999999999, 36.99000000000001, 0.3676603054080625, 0.2153218376526066, 0.17341789796102947], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 815.17, 372, 1860, 631.5, 1596.0, 1674.0, 1806.8100000000002, 0.367307839230828, 0.33563829906902154, 0.1617732768487338], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.980000000000004, 6, 274, 27.0, 52.900000000000034, 60.0, 79.99000000000001, 0.3673342844842406, 0.32525944246553307, 0.15102317750768096], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 14.965999999999998, 4, 104, 12.0, 27.0, 31.0, 35.99000000000001, 0.3677116787435439, 0.24515667987793444, 0.17200575597476322], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 827.1619999999999, 468, 5963, 796.0, 1002.8000000000001, 1053.9, 1260.6800000000003, 0.3675921902833621, 0.27630799295215497, 0.20318083955115523], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 249.4039999999998, 141, 583, 195.0, 499.0, 523.8499999999999, 569.99, 0.36949425842871825, 7.144052411421141, 0.18619046616134632], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 384.2920000000001, 206, 789, 289.0, 684.8000000000001, 716.0, 772.96, 0.3694044461519139, 0.7159772444552392, 0.2640664595539072], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 25.03199999999998, 8, 84, 21.0, 40.900000000000034, 46.94999999999999, 59.950000000000045, 0.36878541261924674, 0.30097427458987375, 0.22760974685094137], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 24.499999999999993, 8, 84, 22.0, 41.0, 45.94999999999999, 54.99000000000001, 0.36879003676836664, 0.3067403927890484, 0.23337494514248203], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 25.112, 8, 109, 21.0, 42.0, 46.94999999999999, 58.97000000000003, 0.3687756206862472, 0.29844535607314443, 0.2250827762977583], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 27.916, 10, 70, 26.5, 45.0, 51.94999999999999, 63.99000000000001, 0.3687818765834572, 0.3297824728576539, 0.2564186485619351], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 25.718, 8, 95, 22.0, 44.0, 48.0, 63.99000000000001, 0.36920668559466274, 0.27716100711276676, 0.20371267320408637], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3302.7780000000002, 1752, 7024, 2920.0, 5042.800000000001, 5539.9, 6864.95, 0.3681188464333333, 0.30762009578268323, 0.23438817175247392], "isController": false}]}, function(index, item){
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
