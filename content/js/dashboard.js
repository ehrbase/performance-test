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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8831312486704956, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.119, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.526, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.948, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.081, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 334.73295043607857, 1, 25982, 10.0, 862.0, 1537.9500000000007, 6136.0, 14.80714800029482, 93.27407028233586, 122.53041330833767], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6354.479999999993, 5426, 25982, 6124.5, 6649.0, 6842.6, 23757.31000000015, 0.3194410548199183, 0.18554034891907537, 0.16096834403034946], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.5900000000000016, 1, 21, 2.0, 4.0, 4.0, 6.0, 0.32052946338880417, 0.1645561955059846, 0.11581631001353275], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.9640000000000017, 2, 12, 4.0, 5.0, 5.949999999999989, 10.0, 0.32052740861923845, 0.18396207355430919, 0.1352225005112412], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.241999999999999, 8, 359, 11.0, 14.900000000000034, 19.0, 37.99000000000001, 0.3184307731499172, 0.1656555245748949, 3.5036714073048016], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.48400000000003, 23, 63, 35.0, 41.0, 43.0, 46.99000000000001, 0.3204698857653045, 1.3328010812573827, 0.13332047982033177], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.624000000000002, 1, 32, 2.0, 4.0, 4.0, 7.990000000000009, 0.3204787182902332, 0.20020843835688, 0.13551492677702245], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.584000000000017, 22, 59, 31.0, 37.0, 37.0, 41.0, 0.3204739938558726, 1.3152922448418107, 0.1164221930804537], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 882.0599999999997, 675, 1128, 878.0, 1023.6000000000001, 1075.9, 1108.98, 0.32033109421898476, 1.354747141645605, 0.15578602043071718], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.910000000000002, 3, 17, 6.0, 8.0, 9.0, 13.0, 0.3204411320800667, 0.47650284788050623, 0.1636628047635497], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.251999999999992, 2, 26, 4.0, 5.0, 6.0, 14.970000000000027, 0.31862090675686616, 0.3073291560672112, 0.17424580838266118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.44600000000001, 5, 46, 8.0, 10.0, 11.0, 14.990000000000009, 0.32047645876076886, 0.5222483120104322, 0.20937378018647884], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.865234375, 2365.580078125], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.470000000000001, 3, 20, 4.0, 6.0, 6.949999999999989, 12.990000000000009, 0.3186257797569395, 0.3200913338806262, 0.18700595081437563], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.652, 5, 16, 8.0, 10.0, 12.0, 15.0, 0.32047604794065293, 0.5034697491041091, 0.19059561835532973], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.006000000000001, 4, 16, 7.0, 8.0, 9.0, 11.0, 0.3204756371215904, 0.4959579559599175, 0.18308422628528356], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1619.3259999999993, 1360, 2002, 1593.0, 1825.4, 1900.3999999999999, 1976.97, 0.32014772896805505, 0.4888849660787474, 0.17633136634568655], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.84999999999999, 7, 59, 10.0, 14.0, 18.0, 48.940000000000055, 0.3184226615039739, 0.1656513046970527, 2.5672827083757896], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.976000000000004, 8, 50, 11.0, 14.0, 16.0, 22.0, 0.32047769122743597, 0.5801491220754007, 0.26727338701975617], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.431999999999995, 5, 17, 8.0, 10.0, 11.0, 16.0, 0.32047666417122167, 0.542591403750282, 0.2297166713883562], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.734809027777779, 2525.607638888889], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.8937710741811175, 3684.86196411368], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5459999999999994, 1, 25, 2.0, 3.0, 4.0, 8.990000000000009, 0.31863329259075635, 0.2678231067048729, 0.134734585636521], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 592.9139999999999, 471, 737, 577.5, 690.9000000000001, 702.9, 727.0, 0.3185311889813691, 0.2804909750160062, 0.14744510114957907], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5580000000000025, 1, 12, 3.0, 4.0, 6.0, 9.990000000000009, 0.3186308559571862, 0.2886689759570715, 0.15558147263534483], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 792.6139999999999, 644, 993, 768.0, 918.9000000000001, 945.0, 976.95, 0.31848574043794337, 0.3012893765816798, 0.16826248591496812], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.47265625, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.09600000000003, 15, 579, 21.0, 25.0, 34.0, 67.0, 0.31830691279854806, 0.16559108937198683, 14.519644430488455], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.035999999999987, 21, 255, 29.0, 36.0, 42.0, 101.84000000000015, 0.3185533092591979, 72.04739794009892, 0.0983035602792056], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 1.2368256191037736, 0.9673496462264152], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.916, 1, 8, 3.0, 4.0, 4.0, 7.0, 0.3204756371215904, 0.3482387169741844, 0.13739141083630682], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.58, 2, 9, 3.0, 5.0, 5.0, 8.0, 0.3204750208949714, 0.3288342863325736, 0.11798738562246504], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.937999999999998, 1, 9, 2.0, 3.0, 3.0, 6.990000000000009, 0.32053028530400696, 0.18177259958875966, 0.12426808912665113], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.71800000000005, 66, 130, 90.5, 111.0, 114.94999999999999, 118.98000000000002, 0.3205138478007942, 0.29193991306863165, 0.10454260270064969], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 88.21399999999993, 59, 469, 85.0, 99.0, 109.0, 329.4800000000005, 0.318491217923157, 0.16568696943344233, 94.1757381591335], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 205.0720000000002, 13, 382, 260.0, 334.90000000000003, 338.0, 345.0, 0.32047152898889314, 0.1786096741301281, 0.13426004485960463], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 466.6600000000004, 360, 580, 460.0, 541.0, 553.95, 573.99, 0.32041710617213065, 0.17232119583989655, 0.13642759598735252], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.862000000000005, 4, 269, 6.0, 9.0, 13.0, 35.940000000000055, 0.31825545092023566, 0.14349777758240428, 0.23092167972044442], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 432.43799999999976, 318, 553, 429.5, 501.90000000000003, 510.0, 527.95, 0.32040252810410774, 0.1648039214626119, 0.1289119546668871], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.810000000000002, 2, 16, 4.0, 5.0, 6.0, 10.980000000000018, 0.31863126206019327, 0.19563150465807042, 0.15931563103009663], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.458000000000002, 2, 44, 4.0, 5.900000000000034, 6.0, 9.0, 0.3186227341144263, 0.18660277331617445, 0.15028787165748822], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 693.4340000000008, 553, 889, 697.5, 816.8000000000001, 852.95, 871.97, 0.3184776259913412, 0.291018261148787, 0.14026700129110828], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 258.8419999999998, 181, 350, 252.0, 312.0, 317.95, 330.99, 0.3185593979482226, 0.2820712809703447, 0.1309702212267595], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.8539999999999965, 3, 56, 4.0, 6.0, 6.949999999999989, 16.960000000000036, 0.3186290285064647, 0.212432835987938, 0.14904619595175447], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1006.9480000000017, 825, 9695, 946.5, 1101.0, 1125.95, 1166.8100000000002, 0.3184555162227609, 0.2393734329998255, 0.17602131072469013], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.07599999999996, 118, 173, 137.5, 152.0, 154.0, 158.99, 0.32051980620090437, 6.197147160378816, 0.16151193359342447], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 186.02999999999992, 162, 268, 184.5, 206.0, 209.0, 216.0, 0.3204910435572968, 0.6211736123619165, 0.22910101941791136], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.459999999999996, 5, 17, 7.0, 9.0, 10.0, 13.0, 0.32043866771856, 0.26151738183503687, 0.19777074023254873], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.380000000000007, 5, 23, 7.0, 9.0, 10.949999999999989, 14.0, 0.32043948916818393, 0.26652491925725974, 0.2027781142392414], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.64600000000001, 5, 18, 9.0, 10.0, 11.0, 15.970000000000027, 0.320431480213997, 0.25932106637513813, 0.1955758546228009], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.127999999999993, 7, 36, 10.0, 12.0, 13.0, 17.0, 0.3204329176891147, 0.28654651079794846, 0.22280101308071257], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.142000000000005, 5, 29, 8.0, 10.0, 11.0, 15.0, 0.3204320962731825, 0.24054624680288875, 0.17680091249448054], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1635.9839999999992, 1435, 2037, 1602.5, 1823.4, 1914.95, 1974.95, 0.3201255916721248, 0.26751432622046284, 0.20382996657248573], "isController": false}]}, function(index, item){
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
