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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.871176345458413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.998, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.836, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.849, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.49, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 486.2174430972128, 1, 24296, 13.0, 1003.9000000000015, 1813.9000000000015, 10481.980000000003, 10.208389250377197, 64.39540583599673, 84.57772337447524], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11038.050000000003, 9033, 24296, 10575.5, 12776.800000000001, 13205.8, 22120.88000000007, 0.21976022401478196, 0.12769270828983914, 0.11116776956997759], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.043999999999996, 2, 14, 3.0, 4.0, 5.0, 7.990000000000009, 0.22054393191014865, 0.11322475629344166, 0.08011947526423369], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.532000000000003, 3, 17, 4.0, 5.900000000000034, 6.0, 10.990000000000009, 0.22054247273102595, 0.12651470637857348, 0.09347210270045435], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.569999999999986, 10, 415, 14.0, 19.900000000000034, 24.0, 42.950000000000045, 0.2192947830648288, 0.12885924210736147, 2.441796012212088], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.45800000000001, 25, 88, 43.0, 53.0, 56.0, 62.99000000000001, 0.22046564990848472, 0.9168938163298466, 0.09214775211018696], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.723999999999999, 1, 10, 3.0, 4.0, 5.0, 7.0, 0.22047089938457753, 0.13774436167721912, 0.09365707151590939], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.191999999999986, 23, 77, 38.0, 46.0, 49.0, 53.0, 0.2204640945561683, 0.9048307176095254, 0.08052106578516302], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1104.252, 782, 1736, 1100.0, 1434.5000000000002, 1516.9, 1605.94, 0.22039130917727043, 0.9321433203581623, 0.10761294393421407], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.787999999999999, 4, 25, 7.0, 8.0, 9.0, 15.0, 0.22035420616515813, 0.3276714387399882, 0.11297456859053516], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.318000000000005, 2, 22, 4.0, 5.0, 7.0, 11.990000000000009, 0.2194678519101165, 0.21169003125990352, 0.12045012966160691], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.382000000000005, 7, 31, 10.0, 12.900000000000034, 14.0, 19.0, 0.22046224760379582, 0.3593276281745461, 0.14446305482631544], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.8772816543438077, 2186.306824745841], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.674000000000005, 3, 19, 4.0, 6.0, 7.0, 13.0, 0.21946891157026935, 0.220478382833449, 0.12923804070007072], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.914000000000001, 8, 37, 16.0, 20.0, 21.0, 24.99000000000001, 0.22046108112350493, 0.34634565020917346, 0.13154464899068508], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.6080000000000005, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.22046137274242042, 0.3411790449205479, 0.12637775957011796], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2208.8699999999967, 1557, 3333, 2174.5, 2811.6000000000004, 3086.7, 3306.9300000000003, 0.22019699704143314, 0.3362541467223237, 0.12171044953657341], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.010000000000002, 10, 83, 13.0, 18.0, 22.0, 38.97000000000003, 0.21929074356228165, 0.12885686846568406, 1.7684599222044157], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.741999999999992, 9, 33, 15.0, 18.0, 19.0, 26.980000000000018, 0.220464386183056, 0.39909866924940696, 0.18429444782489837], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.325999999999995, 7, 21, 10.0, 13.0, 14.0, 19.0, 0.22046351130470745, 0.3731990818025449, 0.1584581487502585], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 5.295586340206185, 1406.0285115979382], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.6882440476190477, 2601.966411564626], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7780000000000014, 2, 23, 3.0, 3.0, 4.0, 8.990000000000009, 0.21945070610459197, 0.18451861128520866, 0.09322368862841553], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 689.3519999999999, 533, 966, 660.0, 838.9000000000001, 861.9, 942.7900000000002, 0.21939745560382787, 0.19313403752968997, 0.10198553600334186], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6820000000000004, 2, 14, 3.0, 5.0, 5.0, 10.990000000000009, 0.21946756291366892, 0.19883032499085918, 0.10759054353775567], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 932.2460000000008, 741, 1303, 888.0, 1143.6000000000001, 1173.95, 1253.92, 0.21939524140497202, 0.20754918388809612, 0.11633946883095683], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 7.366071428571428, 940.6947544642857], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.890000000000015, 20, 550, 27.0, 34.0, 39.0, 85.82000000000016, 0.21923882035483364, 0.12882635800362008, 10.028463227949617], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.13000000000001, 25, 244, 35.0, 43.0, 51.94999999999999, 119.95000000000005, 0.2193574143902851, 49.63955892296606, 0.06812075954698306], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 0.5181957139328063, 0.40722270256917], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.0639999999999965, 2, 12, 3.0, 4.0, 4.0, 8.990000000000009, 0.2205048325839109, 0.23954490806933026, 0.09496350700146945], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.846000000000003, 2, 22, 4.0, 5.0, 5.0, 8.0, 0.2205038601405756, 0.22631792676537593, 0.0816122685481232], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.116, 1, 14, 2.0, 3.0, 4.0, 7.990000000000009, 0.22054471014690924, 0.12507081897403483, 0.08593490170763358], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 200.32199999999992, 89, 425, 206.0, 302.0, 313.0, 332.99, 0.2205244777759842, 0.20086463443988103, 0.0723595942702448], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 117.98599999999995, 84, 413, 115.0, 135.0, 148.95, 308.0, 0.21932450683788013, 0.12893882140273813, 64.88064415169009], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 268.61999999999995, 17, 549, 335.5, 441.90000000000003, 465.84999999999997, 490.98, 0.22050084562074296, 0.12290510415357443, 0.09280846138919943], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 506.2319999999996, 305, 1022, 471.5, 840.5000000000002, 901.95, 983.8700000000001, 0.22054149995567118, 0.1186078217193239, 0.09433318064510153], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.264, 5, 263, 7.0, 10.0, 12.0, 33.97000000000003, 0.21921546293263816, 0.10312332094656361, 0.15948781238751508], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 515.836, 284, 1195, 462.5, 889.0, 928.9, 1009.8700000000001, 0.22047264926549537, 0.1134034659127237, 0.08913640312101082], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9599999999999973, 2, 26, 4.0, 5.0, 6.0, 12.0, 0.2194482982003923, 0.1347356831655944, 0.11015275905761879], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.51, 3, 46, 4.0, 5.0, 6.0, 11.990000000000009, 0.21944415672877227, 0.12851841331231645, 0.10393595313813922], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 853.1859999999991, 580, 1438, 850.5, 1118.4, 1243.9, 1345.99, 0.21935385374011482, 0.20044101023746372, 0.09703837475026564], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 468.5840000000004, 249, 994, 387.0, 857.9000000000001, 895.0, 930.0, 0.2193506781226214, 0.1942260286724239, 0.0906106805135438], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.562, 3, 42, 5.0, 6.0, 8.0, 12.990000000000009, 0.2194698749065607, 0.14638469195427828, 0.10309082991216376], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1187.8860000000004, 912, 9797, 1105.5, 1420.0, 1437.0, 1633.7600000000002, 0.21938397856355268, 0.1648422077991882, 0.12168955060947063], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.44599999999988, 143, 307, 170.0, 189.0, 192.95, 238.0, 0.22061565003298206, 4.2655824797805755, 0.11160049484090301], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.85199999999992, 194, 361, 226.0, 258.0, 263.0, 303.97, 0.220599978998882, 0.4275654143738976, 0.15812537557146425], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.363999999999985, 6, 27, 9.0, 11.0, 12.0, 19.0, 0.2203505159727682, 0.1798955384308928, 0.1364279561784522], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.028000000000004, 6, 35, 9.0, 11.0, 12.0, 17.99000000000001, 0.2203514870640456, 0.18321451476178682, 0.13987154940588833], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.124, 6, 37, 10.0, 12.0, 14.0, 17.99000000000001, 0.22034847670894567, 0.17832518177096715, 0.13492040517237203], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.234, 8, 27, 12.0, 15.0, 16.0, 22.0, 0.22034915645935926, 0.19704680279433578, 0.1536418922968579], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.530000000000003, 5, 32, 9.0, 11.0, 14.0, 19.99000000000001, 0.22033012503293936, 0.165400361732491, 0.12199920009148106], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2008.0880000000009, 1633, 2929, 1930.0, 2525.0, 2579.9, 2718.75, 0.22016984782740798, 0.18398587937928834, 0.14061628953039532], "isController": false}]}, function(index, item){
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
