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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9002339927674963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.989, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.716, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.623, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 188.40506275260546, 1, 3821, 17.0, 551.9000000000015, 1217.9500000000007, 2226.0, 26.158229186373905, 175.00994092523396, 216.72405095735445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.569999999999993, 16, 63, 26.0, 30.0, 31.0, 35.0, 0.5672658128181651, 0.32948393843577584, 0.28695672953106405], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.608000000000007, 4, 55, 7.0, 10.0, 12.0, 21.0, 0.5670451504030556, 6.06692792267829, 0.20599687104486009], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.709999999999994, 5, 35, 7.0, 9.900000000000034, 10.949999999999989, 14.990000000000009, 0.5670265016846358, 6.088665234145089, 0.2403217790343085], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.492000000000008, 15, 269, 20.0, 28.0, 32.0, 60.960000000000036, 0.5633631427550937, 0.304110466498484, 6.272916556341384], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.12800000000004, 26, 60, 44.0, 52.0, 54.0, 56.99000000000001, 0.5668863540250633, 2.357653773592393, 0.23694078078391315], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.631999999999999, 1, 18, 2.0, 4.0, 4.0, 6.990000000000009, 0.5669191346546328, 0.3542281271968116, 0.2408299058347317], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.708000000000006, 23, 53, 39.0, 46.0, 47.0, 50.0, 0.5668779987846135, 2.3266178839804814, 0.20704333158734908], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 764.0879999999995, 586, 976, 762.0, 905.0, 919.95, 949.0, 0.566536287782305, 2.39603244723281, 0.2766290467687036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.556000000000006, 7, 35, 12.0, 14.0, 16.0, 27.950000000000045, 0.5665208819597091, 0.8424287228211607, 0.2904526006141086], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5260000000000002, 2, 22, 3.0, 4.900000000000034, 6.0, 11.990000000000009, 0.5640469693192292, 0.5440894011626136, 0.30956484058340505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.51000000000001, 11, 33, 19.0, 23.0, 24.0, 30.0, 0.5668600037186016, 0.9237548406301442, 0.37144830321795086], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.6741829581358609, 1868.5497506911531], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.531999999999997, 2, 23, 4.0, 6.0, 7.0, 13.0, 0.5640571502704654, 0.5667154899259393, 0.33215474766903386], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.36999999999997, 12, 35, 20.0, 24.0, 25.0, 30.0, 0.566849721336677, 0.8905884470500007, 0.33822771458663053], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.967999999999988, 7, 56, 11.0, 14.0, 15.0, 20.99000000000001, 0.566846508168825, 0.8772658272047779, 0.32494033231943387], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1992.518, 1520, 2480, 1978.0, 2237.8, 2298.75, 2421.4500000000007, 0.5655699134904261, 0.8636915356241177, 0.3126099326519347], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.272, 12, 141, 17.0, 24.900000000000034, 29.94999999999999, 50.960000000000036, 0.563321886632597, 0.30408819592785874, 4.542882949035143], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.94600000000001, 14, 39, 24.0, 28.0, 29.0, 34.99000000000001, 0.5668779987846135, 1.0261986475849862, 0.47387457710901293], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.414000000000016, 12, 55, 19.0, 23.0, 24.0, 29.99000000000001, 0.566870286473568, 0.9596903587977136, 0.407438018402877], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.294869087837838, 1843.0373733108108], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.8063517825704226, 3366.9811839788736], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.522, 1, 20, 2.0, 3.0, 5.0, 10.0, 0.5640603318930992, 0.47408169215279267, 0.23961547302099434], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 408.71800000000013, 319, 602, 406.5, 475.0, 485.0, 506.96000000000004, 0.5638637750228647, 0.49642919167872396, 0.26210855167078473], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.189999999999999, 1, 21, 3.0, 4.0, 5.949999999999989, 10.0, 0.5641182436968248, 0.511072398300763, 0.2765501546248106], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1164.8460000000014, 926, 1476, 1160.0, 1330.9, 1361.0, 1406.99, 0.5634355142419595, 0.5329813845131861, 0.29877488694666404], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.868443080357], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 45.67600000000001, 13, 776, 44.0, 51.0, 58.0, 116.95000000000005, 0.5628386881806127, 0.3031095201772041, 25.74547280701162], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.14200000000002, 10, 188, 45.0, 54.900000000000034, 62.0, 93.99000000000001, 0.563611441763157, 126.34074025325599, 0.17502777195379288], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.7364704056291391, 1.3646005794701987], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.416000000000001, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.5670740904982199, 0.6161680868564701, 0.24421843155245604], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.354000000000001, 2, 23, 3.0, 4.0, 6.0, 10.990000000000009, 0.5670676591106791, 0.5818911621371192, 0.2098814871122533], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.353999999999999, 1, 28, 2.0, 3.0, 4.0, 7.0, 0.5670586554131986, 0.3216108605341919, 0.22095351905260374], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.53399999999999, 82, 173, 123.0, 146.0, 152.0, 160.98000000000002, 0.5669904938373803, 0.5164751845270562, 0.1860437557903904], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, 1.0, 172.09199999999996, 30, 733, 172.5, 200.0, 226.95, 377.71000000000026, 0.5633796468961725, 0.30300692090769477, 166.65914320096542], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4280000000000017, 1, 25, 2.0, 3.0, 4.0, 8.0, 0.5670657297228637, 0.3161092404636556, 0.2386770796001506], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.420000000000005, 1, 18, 3.0, 5.0, 6.0, 9.0, 0.567118471048602, 0.3050299863891567, 0.2425760647649294], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.017999999999992, 7, 318, 10.0, 15.0, 18.0, 45.940000000000055, 0.5626613431401454, 0.23776288065446516, 0.4093581060931722], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.774000000000001, 2, 70, 5.0, 6.0, 6.949999999999989, 9.0, 0.5670760199429294, 0.2916841899063871, 0.22926706275036407], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.943999999999995, 2, 12, 4.0, 5.0, 7.0, 11.0, 0.5640539686837236, 0.34634676345832766, 0.2831286522494472], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.107999999999999, 2, 26, 4.0, 5.0, 6.0, 12.980000000000018, 0.5640393338469851, 0.33036400701439317, 0.267147536050574], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 528.1160000000007, 386, 779, 530.5, 634.0, 650.95, 685.94, 0.5635466470101596, 0.5148614999582976, 0.24930335067929912], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.841999999999988, 6, 116, 16.0, 27.0, 36.0, 56.99000000000001, 0.5637245506551607, 0.49915496809037185, 0.2328666844991533], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.90399999999999, 6, 52, 10.0, 12.0, 14.0, 16.99000000000001, 0.5640666952460458, 0.37606833350725394, 0.2649571097786602], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 543.9820000000001, 436, 3821, 529.0, 606.6000000000001, 629.95, 685.8700000000001, 0.5638110015313107, 0.42370396765078, 0.31273891491189887], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.4459999999999, 142, 220, 180.0, 189.0, 192.95, 209.95000000000005, 0.5671371258171028, 10.965477804875905, 0.286891632005136], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 261.0400000000002, 210, 383, 264.0, 286.0, 292.0, 318.9200000000001, 0.5669853502325207, 1.0989593550881833, 0.4064133272174514], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.534, 11, 57, 19.0, 22.0, 24.0, 34.930000000000064, 0.566481729264786, 0.46231879488659605, 0.3507318519080804], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.396000000000004, 11, 55, 19.0, 22.0, 24.0, 34.99000000000001, 0.566496491120734, 0.4710860899052591, 0.35959249924655967], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.058000000000025, 12, 54, 19.0, 23.0, 24.94999999999999, 36.950000000000045, 0.5664554165599842, 0.4584571510464697, 0.3468433068194435], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.127999999999975, 13, 47, 22.0, 26.0, 28.0, 38.99000000000001, 0.5664676099485307, 0.5066267239733624, 0.3949783920930185], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.622000000000003, 11, 37, 19.0, 22.0, 23.0, 26.0, 0.566241155313154, 0.42507347509841276, 0.31353392095952964], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2191.5039999999976, 1738, 2785, 2166.5, 2511.7000000000003, 2604.7, 2753.63, 0.5651396968816721, 0.4722294061681607, 0.3609388298443492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["500", 8, 1.5748031496062993, 0.034035311635822164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 5, "500", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
