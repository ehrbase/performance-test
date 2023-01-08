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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8712401616677302, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.464, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.81, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.848, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.495, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 487.0723675813675, 1, 25021, 13.0, 1008.0, 1821.0, 10443.930000000011, 10.184190652555102, 64.2427712502096, 84.37723510326522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11037.534000000005, 9037, 25021, 10522.0, 12766.1, 13125.0, 22987.28000000008, 0.2193007464120205, 0.1274257266749533, 0.11093533851701817], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.984000000000001, 2, 13, 3.0, 4.0, 4.0, 8.990000000000009, 0.22006645126562416, 0.1129796231395032, 0.07994601549884002], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.486, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.2200651921125114, 0.1262409132331362, 0.0932698177508105], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 17.052000000000003, 11, 449, 15.0, 20.0, 25.0, 61.850000000000136, 0.2187816139432148, 0.128557700122824, 2.436081994316929], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.170000000000016, 28, 81, 45.0, 55.0, 57.0, 61.0, 0.21999586407775534, 0.9149400256900171, 0.09195139631374931], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.781999999999999, 1, 17, 3.0, 4.0, 5.0, 8.0, 0.22000118800641522, 0.1374508984848518, 0.09345753592069396], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.81999999999999, 24, 60, 40.0, 48.0, 50.0, 53.99000000000001, 0.21999538009701797, 0.9028945548393483, 0.08034987515262179], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1111.706000000001, 780, 1636, 1112.5, 1409.3000000000002, 1519.0, 1611.97, 0.21992551562636767, 0.9301732501736313, 0.10738550567693735], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.623999999999995, 4, 17, 6.0, 8.0, 9.0, 14.980000000000018, 0.21989949713382995, 0.3269952766412639, 0.1127414414016218], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.335999999999992, 2, 20, 4.0, 5.0, 6.0, 12.0, 0.21896595517328968, 0.211205921468955, 0.12017467461659061], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.34599999999999, 7, 24, 10.0, 13.0, 14.0, 20.0, 0.21999567048520485, 0.3585671621482489, 0.14415731923395747], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.8268456010452963, 2060.6132268074916], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.747999999999997, 3, 23, 4.0, 6.0, 7.0, 13.0, 0.21896758535246993, 0.21997475071087824, 0.12894282614017516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.79599999999999, 7, 24, 16.0, 20.0, 20.0, 21.0, 0.21999470252756315, 0.34562542733970963, 0.13126637035580183], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.674000000000003, 5, 25, 7.0, 9.0, 10.0, 14.990000000000009, 0.21999508970959766, 0.34045744005243805, 0.12611046646438853], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2205.010000000001, 1561, 3485, 2128.5, 2879.3, 3071.95, 3319.83, 0.21974312907184018, 0.33556106285246795, 0.12145958110806791], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.204, 9, 86, 13.0, 18.0, 22.0, 41.950000000000045, 0.21877625315037805, 0.12855455008116598, 1.7643108383943573], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.801999999999996, 10, 35, 15.0, 17.0, 19.0, 25.0, 0.21999721923514887, 0.39825297389491, 0.18390392545438228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.291999999999994, 7, 34, 10.0, 12.0, 13.0, 19.99000000000001, 0.2199965416543652, 0.3724085988618259, 0.15812251431407498], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 6.264291158536585, 1663.2288490853657], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.7320685600578872, 2767.648787988423], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7539999999999987, 2, 15, 3.0, 3.0, 4.0, 8.990000000000009, 0.21893920452380944, 0.18408853036621084, 0.09300640035923545], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 705.6940000000001, 541, 938, 682.5, 847.0, 870.9, 907.94, 0.2188849562558415, 0.19268288795716862, 0.10174730388455133], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7239999999999998, 2, 20, 3.0, 4.0, 5.0, 9.0, 0.218958859381993, 0.19836945648170773, 0.10734115957984422], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 949.2499999999993, 737, 1308, 899.0, 1157.0, 1180.95, 1220.97, 0.21888303984765742, 0.20706463821369553, 0.11606786195046678], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 7.4728260869565215, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.99399999999999, 20, 657, 27.0, 34.0, 39.89999999999998, 86.8900000000001, 0.21871443156556666, 0.12851822325909876, 10.004476537628069], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.550000000000004, 26, 245, 35.0, 42.0, 51.94999999999999, 138.92000000000007, 0.21885123237317464, 49.5250122953358, 0.0679635663033882], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.5531793908227849, 0.4347145305907173], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0559999999999996, 2, 9, 3.0, 4.0, 4.0, 7.0, 0.2200318782185163, 0.2390311152029706, 0.09475982255309148], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8500000000000036, 2, 18, 4.0, 5.0, 5.0, 8.0, 0.22003042580728063, 0.22583200930024605, 0.08143704236421813], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.140000000000001, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.22006703241807454, 0.12478746338634748, 0.0857487753269646], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.11200000000008, 90, 418, 205.0, 302.0, 311.0, 329.99, 0.22004737179820072, 0.20043006264638652, 0.07220304387128462], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 115.91599999999994, 83, 463, 111.5, 130.0, 146.84999999999997, 402.97, 0.2188149333314661, 0.12863924791556894, 64.72990195778097], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.24800000000016, 18, 511, 329.5, 444.0, 465.95, 491.99, 0.22002732739406236, 0.1226536320185967, 0.09260915830746178], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 509.0939999999996, 307, 1020, 477.0, 787.0, 910.8, 979.8900000000001, 0.2200675167141279, 0.1183404474742851, 0.09413044171951954], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.521999999999993, 5, 274, 7.0, 11.0, 15.949999999999989, 27.980000000000018, 0.2186901335759336, 0.10287619555162399, 0.15910561475983448], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 519.8399999999999, 287, 1055, 467.0, 891.0, 920.9, 1014.8200000000002, 0.220002349625094, 0.11316156012796216, 0.08894626244608292], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.074000000000002, 2, 21, 4.0, 5.0, 6.0, 11.990000000000009, 0.21893805410484768, 0.13442240624634647, 0.10989664043934737], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.5280000000000005, 2, 33, 4.0, 5.0, 6.0, 11.0, 0.218935082245153, 0.12822027165355537, 0.10369483875869062], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 856.4879999999993, 591, 1325, 857.5, 1111.5000000000002, 1221.9, 1311.94, 0.2188312137341971, 0.19996343262033747, 0.09680716779452274], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 466.0419999999994, 246, 1003, 392.0, 848.9000000000001, 893.95, 943.9100000000001, 0.2188370561163863, 0.1937712374524303, 0.09039851048557755], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.596000000000001, 4, 37, 5.0, 7.0, 8.0, 14.980000000000018, 0.21896844839833338, 0.14605024439068526, 0.10285529656210776], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1196.4920000000004, 894, 10441, 1111.5, 1420.9, 1436.0, 1576.2100000000007, 0.21888227329377985, 0.164465233122754, 0.1214112609676435], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.29199999999977, 143, 282, 178.0, 189.0, 192.95, 231.96000000000004, 0.22015288296804833, 4.256647392465224, 0.11136639978266508], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.096, 196, 345, 234.0, 259.0, 264.9, 292.94000000000005, 0.22013272242100207, 0.42665978077752637, 0.15779044751661672], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.157999999999996, 6, 19, 9.0, 11.0, 12.0, 17.980000000000018, 0.219896305698085, 0.17952471832382721, 0.13614673614510342], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.865999999999994, 6, 27, 9.0, 11.0, 12.0, 18.99000000000001, 0.21989746620945586, 0.18283701238286612, 0.13958335257436164], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.059999999999993, 6, 31, 10.0, 12.0, 14.0, 19.980000000000018, 0.21989379129880268, 0.17795721072971757, 0.13464199916440361], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.143999999999997, 8, 30, 12.0, 14.900000000000034, 16.0, 25.0, 0.21989456495399584, 0.1966527401941317, 0.153324921266751], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.416000000000016, 6, 29, 9.0, 11.0, 12.0, 19.0, 0.2198866352463324, 0.16506743689473455, 0.12175363494596726], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1994.1820000000007, 1623, 2749, 1942.0, 2441.7000000000003, 2543.8, 2643.84, 0.2197291267217425, 0.1836175888936155, 0.1403348133554879], "isController": false}]}, function(index, item){
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
