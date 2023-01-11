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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8714316102956817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.464, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.823, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.491, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.4500319081052, 1, 25555, 12.0, 1004.9000000000015, 1811.9500000000007, 10472.94000000001, 10.175425989089936, 64.1874952414299, 84.3046188203389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10976.466, 8945, 25555, 10608.5, 12658.300000000001, 13300.8, 22700.07000000008, 0.21907206331708404, 0.1272928492906885, 0.11081965702954057], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0200000000000014, 2, 9, 3.0, 4.0, 4.0, 7.990000000000009, 0.21983307634846708, 0.112859811100735, 0.07986123476721656], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.448000000000006, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.21983162656058472, 0.12609447640613103, 0.09317082610087282], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.435999999999993, 10, 449, 14.0, 20.0, 25.0, 38.99000000000001, 0.21854512760194367, 0.1284311175261391, 2.433448774333361], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.111999999999966, 28, 75, 45.5, 54.0, 57.0, 59.0, 0.2197694003635865, 0.9139981865453217, 0.09185674155821778], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.539999999999997, 1, 13, 2.0, 3.0, 4.0, 7.990000000000009, 0.21977480993874435, 0.13732191166393268, 0.0933613694564002], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.89399999999998, 24, 77, 39.0, 49.0, 50.0, 53.0, 0.21976766162812675, 0.9019599635515333, 0.08026670453996035], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1104.5139999999994, 766, 1643, 1100.0, 1434.5000000000002, 1523.95, 1583.95, 0.21970025854326425, 0.9292205271004663, 0.10727551686682825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.662000000000003, 4, 25, 6.0, 8.0, 9.0, 15.0, 0.21966464238376554, 0.3266460425822106, 0.11262103247214542], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.305999999999998, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.2187197893290989, 0.21096847960766044, 0.12003957187788436], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.252000000000006, 7, 26, 10.0, 12.0, 13.0, 18.99000000000001, 0.21976804801140684, 0.3581961641904668, 0.1440081642730996], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.7963244546979866, 1984.5503224622485], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.682000000000004, 3, 16, 4.0, 6.0, 6.949999999999989, 11.980000000000018, 0.21872112881099695, 0.21973954906702314, 0.128797695969757], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.711999999999989, 7, 35, 16.0, 20.0, 20.0, 21.99000000000001, 0.21976727524620526, 0.3452805726223159, 0.13113066911663224], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.639999999999997, 5, 15, 7.0, 9.0, 10.949999999999989, 14.990000000000009, 0.21976727524620526, 0.34010488159708396, 0.12597987360304932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2186.4780000000014, 1595, 3316, 2092.0, 2778.6000000000004, 2938.95, 3294.94, 0.21951236644867625, 0.335208674354941, 0.12133203067378005], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.803999999999998, 9, 80, 12.0, 17.0, 21.94999999999999, 42.0, 0.2185396828726954, 0.1284155396302046, 1.7624030284792171], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.490000000000013, 9, 35, 14.0, 17.0, 18.0, 23.0, 0.21976911057243262, 0.3978400370695548, 0.1837132408691429], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.970000000000006, 6, 19, 10.0, 12.0, 13.0, 18.0, 0.21976882078204296, 0.3720106667269566, 0.15795883993709336], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.7699533866057838, 2910.8756659056316], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7719999999999985, 2, 15, 3.0, 3.0, 4.0, 7.0, 0.2187096480699311, 0.1838955146369245, 0.09290888370158205], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 700.5800000000006, 518, 1010, 683.0, 844.9000000000001, 874.8, 945.0, 0.21865646969508792, 0.19246936800517953, 0.10164109333482603], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8259999999999965, 2, 24, 4.0, 5.0, 6.0, 13.970000000000027, 0.21872725236575397, 0.19815962821507185, 0.10722761785899265], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 935.1300000000003, 734, 1289, 890.0, 1133.0, 1170.6999999999998, 1237.7200000000003, 0.21864939394760985, 0.20684360782323158, 0.11594396573589077], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.9326923076923075, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.54000000000001, 19, 537, 27.0, 34.0, 42.0, 77.95000000000005, 0.21848916490382325, 0.1283858548967573, 9.994172347749101], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.48800000000001, 26, 262, 35.0, 41.0, 48.0, 119.94000000000005, 0.21861344857468404, 49.471190549302364, 0.06788972328784133], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 947.0, 947, 947, 947.0, 947.0, 947.0, 947.0, 1.0559662090813093, 0.5537635295670539, 0.4351735744456178], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.035999999999999, 2, 13, 3.0, 4.0, 4.0, 8.0, 0.21980002593640308, 0.23876679340885662, 0.0946599721073767], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7439999999999998, 2, 17, 4.0, 5.0, 5.0, 9.990000000000009, 0.21979876983024502, 0.22559424520662844, 0.08135130250553013], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0879999999999983, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.21983394623037542, 0.12465529350249996, 0.0856579536581248], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.64200000000002, 87, 377, 200.5, 285.0, 302.9, 321.0, 0.2198148104185186, 0.20021823420454737, 0.07212673466857643], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.23599999999999, 81, 384, 111.0, 132.90000000000003, 147.0, 280.0, 0.2185799038510719, 0.12850107628744656, 64.66037546344404], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 263.03800000000007, 17, 505, 317.5, 433.80000000000007, 449.95, 488.97, 0.21979577455811158, 0.12253700289339158, 0.09251169808061142], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 492.46999999999986, 279, 997, 460.0, 776.8000000000001, 883.95, 979.8600000000001, 0.21982988684036744, 0.11821266293791213, 0.0940287992539853], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.38399999999999, 4, 264, 7.0, 10.0, 13.949999999999989, 31.99000000000001, 0.21846587148002325, 0.10277069819398633, 0.15894245532482162], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 496.36600000000095, 285, 1062, 451.5, 828.8000000000001, 893.95, 990.98, 0.2197734575199884, 0.11304382598667292, 0.08885372208327655], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.073999999999995, 2, 13, 4.0, 5.0, 6.0, 9.990000000000009, 0.2187086913959126, 0.13429397116369646, 0.10978151111083893], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.455999999999994, 3, 29, 4.0, 5.0, 6.0, 9.990000000000009, 0.2187061084178669, 0.12808617214773335, 0.10358638924088423], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 852.1540000000003, 584, 1337, 861.0, 1083.0, 1230.0, 1286.96, 0.21861344857468404, 0.19976444332599377, 0.09671083223079285], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 469.0919999999999, 243, 1014, 390.0, 827.8000000000001, 891.95, 956.94, 0.2186138309100719, 0.19357358068796024, 0.09030629929195352], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.607999999999999, 3, 49, 5.0, 7.0, 7.0, 13.0, 0.21872208559382608, 0.1458859223247883, 0.1027395734088187], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1186.9759999999983, 906, 10526, 1100.5, 1415.0, 1438.95, 1579.5700000000004, 0.2186334273894338, 0.1642658700812398, 0.12127322925507655], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.50799999999998, 140, 262, 174.0, 188.0, 190.95, 209.99, 0.21991313431194678, 4.252011861564682, 0.11124512067733246], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.3139999999999, 195, 350, 223.0, 257.0, 260.0, 287.0, 0.2198923407099884, 0.42620632938113495, 0.15761814265735494], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.30400000000001, 6, 29, 9.0, 11.0, 13.0, 20.99000000000001, 0.21966251929186076, 0.17933385364062068, 0.13600198948343722], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.958000000000002, 6, 27, 9.0, 11.0, 12.0, 19.0, 0.21966329132053225, 0.18262986232932713, 0.13943470640463473], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.219999999999994, 7, 42, 10.0, 12.0, 13.0, 20.980000000000018, 0.21966020323840643, 0.17776817092353497, 0.13449897210007894], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.279999999999992, 8, 40, 12.0, 15.0, 16.0, 20.99000000000001, 0.21966126475684378, 0.19645654048554806, 0.15316224905897113], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.418000000000005, 6, 34, 9.0, 12.0, 12.949999999999989, 19.0, 0.21964350979785768, 0.1648849242350695, 0.1216190137259622], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1997.201999999999, 1594, 2704, 1934.5, 2468.3, 2572.95, 2617.98, 0.21948779450323547, 0.18341591858824574, 0.14018068125499608], "isController": false}]}, function(index, item){
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
