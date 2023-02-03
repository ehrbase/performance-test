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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8659646883641778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.442, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.987, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.731, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.843, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.479, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 506.67734524568846, 1, 23572, 13.0, 1063.0, 1918.0, 10746.0, 9.778231132340382, 61.5957466488602, 81.01381202447864], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11333.342000000002, 9234, 23572, 10857.0, 13234.7, 13657.8, 21374.54000000006, 0.2104362933582939, 0.12225115618960478, 0.10645117183554319], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2419999999999995, 2, 10, 3.0, 4.0, 5.0, 8.0, 0.21119413387173758, 0.10843663806394115, 0.07672286894559217], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.726000000000003, 3, 26, 5.0, 6.0, 6.0, 9.990000000000009, 0.21119270658659364, 0.12115119111630553, 0.08950940884627115], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.451999999999995, 10, 460, 14.0, 19.0, 24.0, 42.99000000000001, 0.21002552650249112, 0.10926044748353715, 2.3385850128724646], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.622000000000014, 27, 69, 46.0, 56.0, 58.0, 60.0, 0.21114356622327926, 0.8781242352643962, 0.08825141244488625], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6660000000000004, 1, 17, 2.0, 4.0, 4.0, 7.0, 0.21114855948118266, 0.13192001133023168, 0.08969689782647895], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.29999999999999, 24, 59, 40.0, 49.0, 52.0, 54.0, 0.2111418721358605, 0.8665703685977562, 0.07711626970587093], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1183.1520000000003, 789, 1798, 1201.5, 1523.8000000000002, 1605.9, 1726.7400000000002, 0.21107457644720118, 0.8927263166673772, 0.10306375803085994], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.892, 4, 18, 7.0, 9.0, 9.0, 14.970000000000027, 0.2110180099651145, 0.3138002666001538, 0.1081879445621925], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.546000000000003, 3, 20, 4.0, 5.900000000000034, 6.0, 11.980000000000018, 0.21018161793605852, 0.20273289633947694, 0.11535358328131338], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.492000000000006, 7, 21, 10.0, 13.0, 13.949999999999989, 18.980000000000018, 0.2111399997550776, 0.3441214975305065, 0.13835443343325884], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.7603114015817224, 2078.72054865993], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.101999999999999, 3, 19, 5.0, 6.0, 7.0, 12.990000000000009, 0.21018311994141775, 0.21114988019036704, 0.12376994269987783], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.178000000000004, 8, 26, 17.0, 20.0, 21.0, 23.0, 0.21113910815685272, 0.3317007760576275, 0.12598241707405958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.117999999999993, 5, 31, 8.0, 10.0, 10.0, 15.0, 0.21113955395502387, 0.32675289311334565, 0.12103409977695218], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2371.183999999999, 1677, 3610, 2294.5, 3014.7000000000003, 3309.9499999999994, 3539.99, 0.21087018957651782, 0.32202349083368376, 0.1165552024417081], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.968, 9, 72, 13.0, 17.0, 22.0, 38.940000000000055, 0.21001996869862388, 0.10925755617719132, 1.6936961928840193], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.036000000000007, 9, 28, 15.0, 18.0, 19.0, 24.0, 0.21114276375742907, 0.3822360340674627, 0.17650215407847586], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.605999999999995, 7, 37, 10.0, 13.0, 14.0, 20.99000000000001, 0.21114115884402748, 0.35741826910489666, 0.15175770791914478], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.9121919014087], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.6975446428571428, 2875.8576127819547], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0200000000000022, 2, 17, 3.0, 4.0, 5.0, 7.990000000000009, 0.21016368388355589, 0.1766979905567152, 0.08927851805600275], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 749.1860000000001, 563, 1004, 722.5, 905.0, 925.95, 972.99, 0.21011254888793732, 0.1849486985261025, 0.0976695051471271], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.901999999999997, 2, 14, 4.0, 5.0, 5.0, 11.990000000000009, 0.21018038100658748, 0.19042835129464808, 0.10303764772002627], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1006.8000000000003, 758, 1348, 972.5, 1213.9, 1233.0, 1303.8500000000001, 0.21010981179203497, 0.1987770138185021, 0.11141565215144042], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5643446180557], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.523999999999987, 20, 681, 27.0, 34.0, 38.0, 76.99000000000001, 0.20996070375468529, 0.10923861740036735, 9.604061878778767], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.247999999999934, 26, 243, 35.0, 43.900000000000034, 50.0, 105.0, 0.2100877410441697, 47.51560224815417, 0.06524209145707613], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.5071702732108317, 0.3985583897485493], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.3040000000000025, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.2111555147696948, 0.22940025855464896, 0.09093709180999551], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9579999999999997, 2, 14, 4.0, 5.0, 5.0, 8.0, 0.2111545338679203, 0.21669816520435112, 0.07815192220306816], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2839999999999994, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.21119475831505444, 0.11976846494251489, 0.08229170758565109], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 204.66600000000005, 91, 343, 204.0, 302.0, 319.95, 335.96000000000004, 0.21117513471917718, 0.19234878896867555, 0.06929184107973002], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 111.94800000000005, 82, 384, 110.0, 128.0, 136.0, 250.86000000000013, 0.210056320300599, 0.10932405806019711, 62.13892631392329], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 271.0959999999999, 17, 523, 325.0, 450.0, 481.5999999999999, 508.0, 0.21115239375022699, 0.11770632452623737, 0.0888737126038553], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 555.0919999999996, 340, 1099, 518.5, 863.3000000000002, 925.8, 1010.95, 0.21118173497621462, 0.1135741145202648, 0.0903296874214668], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.370000000000005, 5, 258, 7.0, 10.0, 12.949999999999989, 26.980000000000018, 0.20993972210698864, 0.09467133359169916, 0.15273934860322905], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 563.398, 324, 1103, 513.5, 910.9000000000001, 945.0, 1014.8800000000001, 0.21112609168023855, 0.10860787994357021, 0.08535761909728394], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.409999999999999, 2, 14, 4.0, 5.0, 6.949999999999989, 10.980000000000018, 0.2101625355017063, 0.12903446063991972, 0.10549174145300493], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.8340000000000005, 2, 31, 5.0, 6.0, 6.0, 11.990000000000009, 0.21015988543764325, 0.12308103993731351, 0.09953861761450876], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 910.7379999999999, 595, 1454, 925.5, 1163.9, 1308.6499999999999, 1425.8600000000001, 0.21008014977874356, 0.1919787906231986, 0.09293584750954184], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 521.028, 277, 1106, 425.0, 922.7, 975.95, 1056.8700000000001, 0.21008456323839472, 0.1860331633188991, 0.08678297875961032], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.874, 3, 64, 6.0, 7.0, 8.0, 13.0, 0.21018409183867784, 0.1401792422348538, 0.09872905095156644], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1223.7060000000006, 957, 9881, 1150.5, 1464.8000000000002, 1495.0, 1574.7400000000002, 0.21010495582963512, 0.15785817287792944, 0.11654259268675074], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.5580000000001, 144, 205, 174.0, 190.0, 192.0, 196.99, 0.21124133435236153, 4.084330983247084, 0.10685840936965164], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.67600000000002, 196, 316, 225.0, 258.0, 261.95, 264.99, 0.21122652058803773, 0.4093978395276215, 0.15140650987462861], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.567999999999998, 6, 20, 9.0, 12.0, 12.949999999999989, 16.0, 0.21101613978046724, 0.17226294328160482, 0.13064866466876585], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.350000000000005, 6, 19, 9.0, 12.0, 12.0, 17.99000000000001, 0.21101703034045066, 0.1754412900241277, 0.13394635714970013], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.381999999999993, 7, 27, 10.0, 13.0, 13.949999999999989, 19.980000000000018, 0.21101444773720768, 0.1707712724456068, 0.12920513547971604], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.778000000000002, 8, 24, 13.0, 15.0, 16.0, 21.99000000000001, 0.2110151601731675, 0.1886998948458703, 0.14713361754261872], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.526000000000009, 6, 40, 9.0, 11.0, 12.0, 16.99000000000001, 0.21098016744230008, 0.15839336070730678, 0.11682202630838295], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2047.2319999999995, 1654, 2771, 1997.0, 2483.8, 2633.5, 2708.8, 0.21082902187983588, 0.17619211952740566, 0.1346505667084108], "isController": false}]}, function(index, item){
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
