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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8892576047649436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.184, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.585, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.921, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.984, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.125, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 327.6720272282485, 1, 18845, 10.0, 849.0, 1506.9500000000007, 6131.980000000003, 15.135446307318139, 95.34208833260247, 125.24710981513248], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6274.303999999998, 5392, 18845, 6108.0, 6685.400000000001, 6891.349999999999, 16175.68000000008, 0.32642168066689253, 0.18957640401309342, 0.16448592502355133], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3960000000000004, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3276267309339262, 0.16819985226491635, 0.11838075238823506], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.707999999999999, 2, 13, 4.0, 5.0, 5.0, 7.990000000000009, 0.32762415481158663, 0.18803514846124764, 0.1382164403111381], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.734000000000004, 8, 363, 12.0, 16.0, 20.0, 38.98000000000002, 0.32565100893195587, 0.1694116689142014, 3.583115153941745], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.95999999999999, 24, 58, 34.0, 40.0, 42.0, 44.99000000000001, 0.3275554731571565, 1.362269305751088, 0.1362681948876452], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3900000000000015, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.3275653443727222, 0.20463557270378332, 0.13851151768885617], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.910000000000007, 21, 43, 30.0, 36.0, 37.0, 40.0, 0.3275535419019593, 1.3443481895378744, 0.11899406014407114], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 871.598, 674, 1102, 877.0, 1022.0, 1052.95, 1086.99, 0.32742226995311313, 1.3847372057701628, 0.15923465862954136], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.856000000000003, 3, 19, 5.0, 8.0, 9.0, 12.0, 0.3275228594579759, 0.48703352863794375, 0.16727974169582166], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9760000000000013, 2, 26, 4.0, 5.0, 6.0, 15.960000000000036, 0.3258424330263463, 0.3142947553949732, 0.17819508056128314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.000000000000014, 5, 26, 8.0, 10.0, 11.0, 14.0, 0.327551825249791, 0.5337783264771276, 0.21399626083213885], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9165618379237289, 2505.9110997086864], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.112000000000001, 2, 21, 4.0, 5.0, 6.0, 10.0, 0.3258471047181357, 0.3273458741158139, 0.19124424798398396], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.349999999999998, 5, 15, 8.0, 10.0, 11.0, 14.990000000000009, 0.3275498940376093, 0.5145828027707446, 0.19480262252822664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.674000000000003, 4, 13, 6.0, 8.0, 9.0, 11.0, 0.3275486065754728, 0.5069038596935718, 0.1871249363736832], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1560.5800000000008, 1336, 1934, 1545.0, 1729.3000000000002, 1801.6499999999999, 1896.93, 0.32721699329466936, 0.499680160727351, 0.18022498458807962], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.098000000000017, 7, 78, 11.0, 14.900000000000034, 19.0, 47.97000000000003, 0.32564273735285015, 0.16940736583519223, 2.625494569907355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.274000000000004, 8, 26, 11.0, 14.0, 15.0, 19.0, 0.3275567606732733, 0.5929641043238802, 0.2731772203271244], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.053999999999997, 5, 24, 8.0, 10.0, 11.0, 13.0, 0.3275537564847455, 0.5545734601124688, 0.23478950904277654], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 4.4921875, 1298.8839285714287], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.8327956687612208, 3433.471022217235], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4879999999999995, 1, 26, 2.0, 3.0, 4.0, 7.0, 0.32582778177097826, 0.27387034184384634, 0.13777678662776716], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 573.8940000000005, 448, 732, 563.0, 676.0, 693.95, 720.98, 0.3257267452276146, 0.2868272103898363, 0.15077585667762627], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3780000000000023, 2, 20, 3.0, 4.0, 5.0, 9.980000000000018, 0.3258409466070508, 0.2952010786883077, 0.15910202471047402], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.3759999999999, 628, 990, 742.5, 901.0, 921.95, 949.99, 0.32569979858724457, 0.30811391786079073, 0.1720738193708001], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 10.077293882978724, 1400.9931848404256], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.424, 16, 603, 21.0, 27.0, 32.0, 63.90000000000009, 0.32551659483600476, 0.16934174339364072, 14.848515766396272], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.475999999999992, 20, 264, 29.0, 35.900000000000034, 41.0, 104.0, 0.3257774679272083, 73.68129035059357, 0.10053289049316193], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 1.1181536513859276, 0.8745335820895523], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7859999999999965, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.3275775769217666, 0.35595590392247944, 0.14043609010610894], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4480000000000004, 2, 10, 3.0, 4.0, 5.0, 7.990000000000009, 0.3275760746296916, 0.3361205638419563, 0.12060173841347045], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8740000000000012, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.3276278043301911, 0.18579759985604033, 0.1270197639834823], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.91600000000003, 66, 130, 92.0, 113.0, 116.0, 118.99000000000001, 0.3276104161766161, 0.29840381960165197, 0.1068573037138572], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 85.11400000000005, 59, 376, 82.5, 98.0, 108.94999999999999, 304.99, 0.3257146505146943, 0.1694447768317215, 96.31165920834403], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 201.47599999999989, 12, 366, 261.0, 332.90000000000003, 337.0, 358.0, 0.32757156783614083, 0.18256676707008196, 0.13723457285322696], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 438.77, 338, 552, 431.5, 512.9000000000001, 526.0, 545.99, 0.3275157797102664, 0.17613888187914142, 0.13945007807976187], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.208000000000003, 4, 318, 6.0, 8.0, 10.949999999999989, 27.0, 0.325453666137913, 0.14674337128177323, 0.23614460345748955], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 409.552, 302, 519, 405.0, 477.0, 491.9, 510.97, 0.3275084857448657, 0.16845897902995915, 0.1317709923114108], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.666000000000002, 2, 30, 3.0, 5.0, 6.0, 11.0, 0.3258220490297019, 0.20004646527877334, 0.16291102451485098], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.283999999999997, 2, 24, 4.0, 5.0, 6.0, 11.0, 0.3258173780563299, 0.19081634745523593, 0.15368143906367904], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 679.7020000000005, 541, 866, 680.5, 810.8000000000001, 843.95, 859.0, 0.3256747655467363, 0.29759485827122717, 0.14343683521638484], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 248.00599999999986, 176, 333, 241.0, 296.0, 302.0, 315.97, 0.3257713124479173, 0.28845713545864365, 0.1339352759185285], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.61, 3, 52, 4.0, 6.0, 6.0, 11.0, 0.32585071475354277, 0.21724759909120236, 0.1524243089520967], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.4319999999993, 814, 8548, 931.5, 1080.8000000000002, 1108.9, 1136.97, 0.3256773111039028, 0.24480183899393068, 0.18001304500469628], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.25799999999998, 118, 172, 140.0, 152.0, 154.0, 157.99, 0.32759903974169474, 6.334021859496375, 0.16507920361983833], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.7680000000001, 161, 223, 180.0, 205.0, 207.0, 214.99, 0.3275782207654455, 0.6349099321634641, 0.2341672437502989], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.289999999999994, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.32751728144935566, 0.2672944016406651, 0.20213957214452422], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.331999999999999, 5, 27, 7.0, 9.0, 10.0, 15.980000000000018, 0.3275198558912634, 0.2724140004503398, 0.20725865880619013], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.563999999999993, 6, 30, 8.0, 10.0, 12.0, 16.99000000000001, 0.327513205332439, 0.2650522152256304, 0.1998981966140375], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.920000000000002, 7, 20, 10.0, 12.0, 13.0, 17.0, 0.3275149215798272, 0.29287957894517924, 0.2277252189109736], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.981999999999999, 5, 40, 7.0, 9.0, 10.949999999999989, 16.99000000000001, 0.3274994760008384, 0.24585168183262157, 0.18070039447311884], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1609.5940000000007, 1425, 1966, 1590.0, 1789.8000000000002, 1841.6999999999998, 1942.0, 0.3271664636053483, 0.2733980611052076, 0.20831302174871785], "isController": false}]}, function(index, item){
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
