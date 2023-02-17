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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8671133801318869, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.461, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.733, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.736, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.484, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 504.7148691767714, 1, 24144, 13.0, 1058.0, 1896.0, 10729.950000000008, 9.827187003780363, 61.904133044454596, 81.41941726254832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11332.752000000011, 9105, 24144, 10817.5, 13217.1, 13747.2, 22927.850000000075, 0.2115408210322346, 0.12291678565837849, 0.10700990751435303], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.211999999999999, 2, 8, 3.0, 4.0, 4.0, 7.0, 0.21226645383416898, 0.10897519281753999, 0.07711242268194418], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.646000000000001, 3, 15, 5.0, 6.0, 6.0, 9.0, 0.21226537247053967, 0.12176652841469182, 0.08996403481661545], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.72200000000003, 11, 460, 14.0, 19.0, 23.0, 50.950000000000045, 0.21107716052249198, 0.10980753338079755, 2.3502947112084502], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.896, 27, 60, 45.0, 54.900000000000034, 57.0, 59.99000000000001, 0.2122143806650629, 0.882577641681748, 0.0886989794186005], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.665999999999999, 1, 15, 2.0, 4.0, 4.0, 7.0, 0.21221870410770524, 0.13258860926716637, 0.0901515002801287], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.94600000000005, 24, 54, 40.0, 48.0, 50.0, 53.0, 0.212213930316585, 0.8709582994852115, 0.07750782220547148], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1154.259999999999, 829, 1705, 1154.0, 1429.8000000000002, 1597.85, 1675.9, 0.2121448694884763, 0.8972650681197175, 0.10358636205492006], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.724, 4, 19, 7.0, 8.0, 9.0, 12.0, 0.21207882206332335, 0.31536576478910455, 0.10873181795238746], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.500000000000007, 3, 21, 4.0, 5.0, 6.0, 12.970000000000027, 0.21123053616224532, 0.20374464147735483, 0.11592925910466981], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.159999999999998, 6, 22, 10.0, 12.0, 13.0, 17.99000000000001, 0.21221248921430025, 0.3458814887682296, 0.1390572072878862], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.7823095614828209, 2138.8643620027124], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.065999999999993, 3, 17, 5.0, 6.0, 7.0, 13.980000000000018, 0.21123205319668026, 0.21220363812886422, 0.1243876250757795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.844000000000003, 7, 23, 17.0, 20.0, 21.0, 22.0, 0.21221158853531139, 0.3333976688132576, 0.12662234433112818], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.812000000000001, 5, 20, 8.0, 9.0, 10.0, 16.980000000000018, 0.21221131833310555, 0.3284115217535701, 0.12164848033352829], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2349.5020000000004, 1652, 3658, 2275.5, 3099.8, 3256.2, 3547.79, 0.2119260988262261, 0.32362398437066214, 0.11713883978090232], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.91999999999999, 9, 83, 13.0, 17.0, 20.0, 38.960000000000036, 0.21107323988135995, 0.10980549376679616, 1.702190248965108], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.896000000000015, 10, 25, 15.0, 18.0, 19.0, 23.0, 0.21221447073498784, 0.38416414701772883, 0.17739803413002891], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.41, 6, 28, 10.0, 13.0, 14.0, 19.0, 0.212213750177729, 0.35923394417292875, 0.15252863294024274], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.7324538934426235, 2235.8158299180327], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6524151722925458, 2689.79650140647], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9679999999999995, 2, 18, 3.0, 4.0, 4.0, 8.0, 0.21121947139370212, 0.17759762194333742, 0.0897270215393168], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 742.1019999999999, 556, 972, 713.5, 888.9000000000001, 907.95, 955.97, 0.2111647892005259, 0.18588687918079888, 0.09815863247993195], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8940000000000032, 2, 14, 4.0, 5.0, 5.0, 11.990000000000009, 0.2112312500580886, 0.19136849901502867, 0.10355281985269577], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 996.9640000000012, 759, 1452, 943.0, 1206.9, 1234.95, 1276.96, 0.2111555147696948, 0.19975435421147564, 0.11197016066400808], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 6.488120719178083, 902.0360659246576], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.622000000000018, 20, 672, 27.0, 33.0, 38.0, 75.91000000000008, 0.2110140915210318, 0.10977472333414924, 9.652246139497194], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.215999999999944, 26, 298, 35.0, 44.0, 50.94999999999999, 120.64000000000033, 0.2111385732015322, 47.753281205594924, 0.06556842409969457], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.5091398665048543, 0.40010618932038833], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.212000000000003, 2, 8, 3.0, 4.0, 4.0, 7.0, 0.2122377113303951, 0.2305639402716388, 0.09140315497725024], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8679999999999994, 2, 11, 4.0, 5.0, 5.0, 8.0, 0.21223699061530474, 0.21783308314129424, 0.07855255805000048], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2899999999999996, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.21226699452011527, 0.12036450674032614, 0.08270950274758399], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 192.6859999999999, 92, 296, 195.0, 270.90000000000003, 277.0, 288.0, 0.2122494236366901, 0.19332730460954808, 0.06964434213078895], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.47600000000008, 82, 400, 110.0, 130.0, 140.95, 260.7600000000002, 0.21110968963920088, 0.10988424275165437, 62.45053436084642], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.96399999999997, 17, 454, 308.0, 412.7000000000001, 427.95, 440.99, 0.21223446815103453, 0.11830952394217034, 0.08932915602841394], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 559.1960000000001, 338, 1088, 522.0, 880.9000000000001, 930.0, 1016.8200000000002, 0.21226483179285668, 0.11414458413710951, 0.09079296516139769], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.437999999999997, 5, 279, 7.0, 10.0, 13.0, 27.970000000000027, 0.21099147425650824, 0.09513366560446525, 0.1535045393760729], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 562.1840000000003, 325, 1149, 513.0, 920.0, 967.8, 1028.99, 0.21220834615425424, 0.10915259570596411, 0.08579517119908325], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.403999999999996, 3, 18, 4.0, 6.0, 6.0, 12.0, 0.2112184006711676, 0.12968273504489236, 0.10602173627439468], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.771999999999995, 3, 29, 5.0, 6.0, 7.0, 10.990000000000009, 0.21121617003408605, 0.12369965754994312, 0.1000389086587224], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 902.8760000000001, 613, 1485, 924.0, 1154.7, 1305.6999999999998, 1430.93, 0.21113072750159298, 0.19292688772511285, 0.0934006050373258], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 515.4580000000002, 272, 1093, 429.0, 901.9000000000001, 957.95, 1024.98, 0.21113705750951173, 0.1869532045062982, 0.08721774934230807], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.706, 4, 51, 5.0, 7.0, 7.0, 13.0, 0.21123312405763622, 0.14089084348766168, 0.09922180924972952], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1247.4399999999998, 957, 10273, 1153.5, 1477.9, 1492.0, 1523.98, 0.21114945115923162, 0.15865489327239843, 0.11712196118988628], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.85800000000015, 144, 225, 172.0, 190.0, 192.0, 197.0, 0.21234100436445702, 4.105605024816294, 0.1074146877546765], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.534, 198, 319, 223.5, 258.90000000000003, 261.0, 270.98, 0.21232513432749622, 0.41152716538195805, 0.15219399276990453], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.162000000000003, 6, 20, 9.0, 11.0, 12.0, 16.0, 0.21207747274910513, 0.17314137423657414, 0.13130577902630142], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.00199999999999, 6, 36, 9.0, 11.0, 12.0, 19.99000000000001, 0.21207810242693698, 0.17633548629720966, 0.13461988923584867], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.878000000000002, 6, 26, 10.0, 12.0, 13.0, 17.0, 0.21207612345205637, 0.17163047291597036, 0.12985520449652282], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.394000000000007, 8, 26, 12.0, 15.0, 16.0, 21.980000000000018, 0.21207666316881557, 0.18966115398123037, 0.14787376709231867], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.501999999999994, 6, 37, 9.0, 11.0, 12.949999999999989, 19.970000000000027, 0.2120685677058592, 0.15919846550895608, 0.11742468543869351], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2045.7899999999986, 1639, 2704, 1955.5, 2504.0, 2629.0, 2692.99, 0.21191666758497224, 0.17708907384681305, 0.1353452154302459], "isController": false}]}, function(index, item){
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
