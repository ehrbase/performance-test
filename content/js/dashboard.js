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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8887470750904063, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.171, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.569, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.924, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.112, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.1964688364194, 1, 18044, 9.0, 849.0, 1514.0, 6049.980000000003, 15.205846601116454, 95.78555797952758, 125.82967825410293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6190.811999999998, 5426, 18044, 6027.0, 6512.1, 6677.85, 15019.95000000007, 0.3278716474304371, 0.19041850336265162, 0.1652165723379937], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.324, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.3290218312565475, 0.16891608096667932, 0.11888484137199472], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.714000000000001, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.3290190166411238, 0.18883570924819812, 0.1388048976454741], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.256000000000013, 7, 365, 11.0, 14.0, 16.0, 34.97000000000003, 0.3270470529135968, 0.17013792534922084, 3.598475727712397], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.38000000000002, 23, 50, 34.0, 41.0, 42.94999999999999, 45.98000000000002, 0.32895256240888016, 1.3680796553284393, 0.13684940584588176], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3700000000000037, 1, 22, 2.0, 3.0, 4.0, 7.0, 0.32896100298893965, 0.2055074640840377, 0.13910167411544033], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.55199999999999, 21, 59, 30.0, 36.0, 38.0, 46.99000000000001, 0.32895039822735206, 1.3500811798184325, 0.11950151185603025], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 869.4039999999991, 655, 1120, 874.5, 1008.9000000000001, 1061.0, 1084.96, 0.32880092222082663, 1.3905678143271056, 0.15990513600192546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.584000000000004, 3, 14, 5.0, 7.0, 8.0, 11.0, 0.3289222664586124, 0.48911447691327503, 0.16799447788852956], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.0219999999999985, 2, 24, 4.0, 5.0, 5.0, 12.0, 0.3272636828945818, 0.31566563694512445, 0.17897232658297443], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.943999999999993, 5, 29, 8.0, 10.0, 11.0, 14.0, 0.3289469355961374, 0.5360517977525687, 0.21490771475958584], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.9656633649553571, 2640.15633719308], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.172000000000005, 3, 20, 4.0, 5.0, 6.0, 13.980000000000018, 0.3272681812201736, 0.3287734870146531, 0.1920782977669183], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.173999999999994, 5, 22, 8.0, 10.0, 11.0, 16.99000000000001, 0.32894498789811394, 0.5167745033999754, 0.19563232190424937], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.6839999999999975, 4, 19, 6.0, 8.0, 9.0, 12.0, 0.3289436894455786, 0.5090628458020535, 0.18792193195865572], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1577.2320000000002, 1346, 1952, 1552.0, 1774.8000000000002, 1839.95, 1916.97, 0.328612918299599, 0.5018118227287753, 0.18099383390720103], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.059999999999988, 7, 75, 10.0, 13.0, 17.94999999999999, 43.97000000000003, 0.327040207631287, 0.1701343642649052, 2.6367616740272517], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.094000000000001, 8, 33, 11.0, 13.900000000000034, 15.0, 17.99000000000001, 0.3289532116688915, 0.5954920488308016, 0.27434183863792316], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.789999999999993, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.3289521295702964, 0.5569410122630064, 0.23579185850058354], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.823206018518518, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.8081309886759582, 3331.7828560540074], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3039999999999985, 1, 19, 2.0, 3.0, 3.0, 6.990000000000009, 0.32726304028673475, 0.27507672988788623, 0.13838368793374625], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 568.9079999999997, 432, 738, 554.0, 657.0, 669.0, 689.0, 0.32716603545432893, 0.28809461506789347, 0.15144209063022648], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.428000000000003, 2, 18, 3.0, 4.0, 5.0, 10.0, 0.3272763213617837, 0.2965014805571683, 0.15980289128993344], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 771.3380000000002, 616, 965, 752.0, 891.9000000000001, 910.8, 936.0, 0.32712022976924937, 0.3094576540818062, 0.17282426201676163], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.272000000000023, 15, 572, 20.0, 24.0, 28.94999999999999, 74.91000000000008, 0.3269196065457151, 0.17007162461227335, 14.91251447436558], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.28, 20, 314, 28.0, 34.0, 41.89999999999998, 116.83000000000015, 0.3271643228614577, 73.99495618431358, 0.10096086525802796], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 1.1550970539647576, 0.9034278634361234], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6920000000000015, 1, 8, 3.0, 3.0, 4.0, 6.0, 0.32897182487908644, 0.3574709367785237, 0.14103381945499896], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4080000000000004, 2, 8, 3.0, 4.0, 5.0, 6.0, 0.3289703097716025, 0.33755116619152387, 0.12111504568739662], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.81, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.3290229138137638, 0.18658876589920975, 0.12756064139068773], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.63999999999999, 66, 119, 90.5, 111.0, 114.0, 117.0, 0.32900212995978934, 0.2996714615574171, 0.10731124160797817], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.994, 58, 381, 80.0, 92.0, 99.94999999999999, 295.95000000000005, 0.3271078173534622, 0.17016953650621375, 96.72360939106917], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.98000000000022, 13, 363, 260.0, 333.90000000000003, 337.0, 348.99, 0.3289659809699759, 0.1833439208978271, 0.13781875569933563], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 434.202, 341, 551, 421.5, 509.0, 519.95, 537.99, 0.32891490971285725, 0.17689133782028088, 0.1400458014011775], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.154000000000001, 4, 253, 6.0, 8.0, 10.0, 27.960000000000036, 0.3268689549672641, 0.14738150898235888, 0.23717151712956758], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 405.6499999999999, 300, 504, 404.0, 471.0, 478.95, 493.99, 0.32889911545871886, 0.16917427060865414, 0.13233050348534392], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.441999999999998, 2, 12, 3.0, 4.0, 5.0, 8.990000000000009, 0.32726111247833534, 0.20093001369751384, 0.16363055623916764], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.209999999999996, 2, 40, 4.0, 5.0, 6.0, 10.990000000000009, 0.3272529730932605, 0.1916571098571868, 0.15435858008207506], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.7519999999997, 532, 900, 679.0, 788.9000000000001, 827.95, 848.98, 0.3270990436278162, 0.2988963340947109, 0.144064129566548], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 249.3660000000001, 172, 360, 243.0, 293.0, 301.0, 312.97, 0.32718230598089254, 0.2897065123593116, 0.13451538165815993], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.543999999999993, 3, 60, 4.0, 5.0, 6.0, 10.0, 0.32727182281241696, 0.21819506460182148, 0.1530890655538552], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 984.1620000000005, 825, 8404, 928.5, 1090.8000000000002, 1112.95, 1262.6400000000003, 0.32709412198779025, 0.24586681312033398, 0.18079616508309498], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.10600000000008, 118, 168, 135.0, 151.0, 152.0, 161.97000000000003, 0.3290073256771135, 6.361250614215551, 0.165788847704483], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.52199999999993, 159, 253, 179.0, 203.0, 205.0, 218.96000000000004, 0.3289848120871652, 0.6376361781225758, 0.2351727367654345], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.104000000000002, 5, 16, 7.0, 9.0, 10.0, 12.0, 0.3289183716698659, 0.2684378636603747, 0.20300430751499537], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.034000000000003, 5, 25, 7.0, 9.0, 10.0, 15.0, 0.3289194535463767, 0.27357811306639107, 0.2081443416973165], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.454000000000004, 5, 25, 8.0, 10.0, 11.0, 15.0, 0.32891534245349796, 0.2661869467232796, 0.20075399319671508], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.775999999999998, 7, 18, 10.0, 12.0, 13.0, 15.0, 0.32891664068225207, 0.29413306351479007, 0.22869985172437837], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.856000000000007, 5, 34, 8.0, 9.0, 11.0, 21.930000000000064, 0.32890084626187743, 0.24690368118160919, 0.1814736114628523], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1625.31, 1411, 1973, 1601.0, 1841.7, 1906.95, 1955.99, 0.328580525557979, 0.27457972805197095, 0.20921338150761948], "isController": false}]}, function(index, item){
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
