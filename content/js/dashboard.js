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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8925547755796639, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.204, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.651, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.973, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.126, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.04858540736114, 1, 19228, 9.0, 837.0, 1496.0, 6023.970000000005, 15.319490067261066, 96.50142754607904, 126.77008763450584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6170.7820000000065, 5177, 19228, 6005.0, 6502.0, 6670.65, 16672.85000000008, 0.3304312656707028, 0.19190505664748403, 0.16650637996687756], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.283999999999999, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.33153310855388574, 0.1702053422830696, 0.119792236489197], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5620000000000003, 2, 14, 3.0, 5.0, 5.0, 7.0, 0.33153047063402546, 0.19027712196906557, 0.1398644172987295], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.253999999999996, 8, 357, 11.0, 15.0, 18.0, 64.90000000000009, 0.3294141829935316, 0.17136936467039476, 3.6245210935430867], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.34399999999998, 24, 55, 33.0, 39.900000000000034, 41.0, 43.0, 0.3314748642610431, 1.3785696476339324, 0.137898722827348], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2799999999999994, 1, 8, 2.0, 3.0, 4.0, 6.990000000000009, 0.33148277549201993, 0.2070828577246094, 0.1401680095586373], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.48, 21, 50, 29.0, 35.0, 36.0, 39.99000000000001, 0.33147552351586806, 1.3604448217142324, 0.12041884252724895], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.3399999999998, 670, 1092, 858.5, 988.9000000000001, 1027.9, 1072.96, 0.3313305505984824, 1.4012661413890173, 0.16113536542777757], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.539999999999998, 4, 15, 5.0, 7.0, 8.949999999999989, 12.0, 0.33144871593452957, 0.4928713615631519, 0.16928484222046775], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.807999999999998, 2, 17, 4.0, 5.0, 5.0, 9.0, 0.32963852498627055, 0.31795631593182544, 0.1802710683518667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.695999999999999, 5, 24, 7.0, 9.0, 11.0, 14.0, 0.33147947909988734, 0.5401788296570049, 0.21656227687287566], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.0275942695961995, 2809.4775274643707], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.071999999999999, 2, 24, 4.0, 5.0, 6.0, 10.0, 0.3296415675379533, 0.33115778998239054, 0.1934712715725683], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.895999999999998, 5, 24, 8.0, 9.900000000000034, 10.0, 15.0, 0.33147772105089046, 0.5207534420232207, 0.19713860558592997], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.564000000000006, 5, 19, 6.0, 8.0, 9.0, 12.980000000000018, 0.3314766222797371, 0.5129827325126193, 0.1893689687828576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1552.2839999999997, 1322, 1932, 1535.5, 1735.6000000000001, 1798.85, 1902.97, 0.3311525831888404, 0.5056900447834196, 0.18239263370947853], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.624, 8, 79, 10.0, 14.0, 18.0, 29.99000000000001, 0.32939877476831736, 0.17136134893245153, 2.655777621569559], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.933999999999992, 8, 23, 11.0, 13.0, 14.0, 18.99000000000001, 0.3314814569272995, 0.6000688393756878, 0.27645035567960324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.640000000000008, 5, 22, 7.0, 9.0, 11.0, 15.990000000000009, 0.3314810174080571, 0.5612226120024636, 0.23760455739991593], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.89961674528302, 2573.260613207547], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.9544592335390947, 3935.0686406893005], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.245999999999998, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.32962592072760305, 0.2770628185834524, 0.1393828356201681], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.4580000000001, 429, 704, 542.0, 638.0, 651.95, 674.0, 0.3295240354831481, 0.2901710137065523, 0.15253358673731662], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.296000000000001, 2, 30, 3.0, 4.0, 5.0, 9.990000000000009, 0.32963287468215147, 0.2986364396204871, 0.1609535520908943], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 751.6639999999995, 592, 936, 736.0, 874.0, 887.95, 915.96, 0.32948842309476617, 0.31169797884387784, 0.17407542665455908], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.457728794642858, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.208000000000016, 16, 682, 21.0, 25.0, 31.899999999999977, 53.99000000000001, 0.3292525768952931, 0.171285293201066, 15.018933463651504], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.567999999999987, 20, 271, 28.0, 35.0, 47.0, 202.8800000000001, 0.32954618853469264, 74.53366420903477, 0.10169589411812781], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 1.1918501420454546, 0.9321732954545454], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6739999999999995, 1, 11, 2.0, 4.0, 4.0, 6.990000000000009, 0.33148673124912154, 0.3602037116486426, 0.14211198732262145], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.365999999999998, 2, 20, 3.0, 4.0, 5.0, 7.0, 0.33148607194971486, 0.34013254947098137, 0.12204125891117433], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8139999999999987, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.33153530685250326, 0.18801354301007536, 0.12853468439496465], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.92199999999998, 67, 130, 90.0, 109.0, 113.94999999999999, 117.0, 0.3315188203234298, 0.3019637879920568, 0.1081321152226812], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.19200000000002, 59, 388, 78.0, 93.0, 104.89999999999998, 332.97, 0.3294788698611181, 0.17140301637081662, 97.42471387231244], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.65600000000015, 13, 380, 261.0, 333.0, 337.0, 349.0, 0.33148255573050467, 0.18474649353609016, 0.13887306289881496], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.32000000000005, 327, 546, 405.5, 485.90000000000003, 503.95, 520.98, 0.3314335561892565, 0.17824587278221235, 0.14111819384620689], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.4439999999999955, 4, 297, 6.0, 8.0, 12.0, 30.99000000000001, 0.3291916632869656, 0.1484287918517821, 0.23885684162325724], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 386.9360000000003, 296, 500, 381.0, 451.0, 462.95, 486.97, 0.3314210339673418, 0.17047145781341658, 0.13334518163529765], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.450000000000002, 2, 17, 3.0, 5.0, 5.0, 9.0, 0.32962396498075, 0.20238074513969462, 0.16481198249037496], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.188000000000003, 2, 38, 4.0, 5.0, 6.0, 10.990000000000009, 0.32961614222540997, 0.1930411100136725, 0.15547323895983695], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.8780000000003, 531, 885, 670.0, 800.9000000000001, 830.0, 851.8900000000001, 0.32946215303517007, 0.3010556945474014, 0.14510491310435714], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.662, 173, 343, 232.5, 280.90000000000003, 287.0, 299.0, 0.3295503154126069, 0.2918032875857078, 0.13548894803584716], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.452000000000003, 3, 34, 4.0, 5.0, 6.949999999999989, 12.990000000000009, 0.32964613147078875, 0.21977803751603728, 0.15419970407666778], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 989.5919999999992, 811, 8877, 936.5, 1107.0, 1117.95, 1133.98, 0.3294699684829028, 0.24765266546970227, 0.182109377110667], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.32800000000003, 117, 169, 130.0, 149.0, 150.0, 159.0, 0.3315291516898372, 6.410009307473728, 0.16705961159370705], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.46999999999983, 157, 238, 175.0, 201.0, 203.95, 214.98000000000002, 0.3315025552216957, 0.6425160511465347, 0.23697252970925897], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.904000000000001, 4, 25, 7.0, 9.0, 9.949999999999989, 13.0, 0.3314469582118304, 0.2705015014132898, 0.20456491952136407], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.824000000000006, 5, 16, 7.0, 9.0, 10.0, 13.990000000000009, 0.3314467384978038, 0.2756801773886372, 0.20974363920564149], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.15600000000001, 5, 14, 8.0, 10.0, 11.0, 13.990000000000009, 0.33144366253201746, 0.2682330835711994, 0.20229715730713957], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.476000000000003, 7, 21, 9.0, 12.0, 13.0, 17.0, 0.33144476108467286, 0.29639383024691973, 0.2304576854416866], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.655999999999996, 5, 30, 7.0, 9.0, 10.0, 16.0, 0.33140719471763447, 0.24878518032362573, 0.18285650880416351], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1633.4179999999997, 1349, 2022, 1607.0, 1876.9, 1918.8, 1964.97, 0.33109447251021923, 0.27668051862472626, 0.21081405866861613], "isController": false}]}, function(index, item){
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
