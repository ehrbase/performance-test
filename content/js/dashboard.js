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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8913635396724101, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.182, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.633, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.968, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.116, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.0479897894066, 1, 17764, 9.0, 838.0, 1510.0, 6016.960000000006, 15.334401511454645, 96.59535858719961, 126.89348110771398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6156.326000000005, 5229, 17764, 6000.0, 6486.0, 6646.7, 14774.140000000069, 0.33063010162246803, 0.19202053489833787, 0.16660657464569678], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3380000000000023, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.33178478315541926, 0.17033454917249558, 0.11988317360107924], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.625999999999999, 2, 12, 3.0, 5.0, 5.0, 8.0, 0.3317825815471818, 0.1904218173838811, 0.13997077659021734], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.371999999999998, 8, 363, 12.0, 16.0, 19.94999999999999, 33.0, 0.32974743984087707, 0.1715427330836266, 3.628187895202307], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.630000000000045, 23, 52, 34.0, 40.0, 41.0, 42.99000000000001, 0.3317227090068686, 1.3796004082760174, 0.1380018301141856], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3419999999999987, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.3317301918926468, 0.2072374229059034, 0.14027262997023052], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.734000000000012, 21, 48, 30.0, 35.0, 36.0, 38.0, 0.3317231491672754, 1.3614611291375, 0.12050880028342427], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.4440000000002, 671, 1110, 855.5, 1002.8000000000001, 1050.0, 1075.0, 0.3315748812132988, 1.4022994666203568, 0.16125419027756135], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.599999999999999, 3, 22, 5.0, 7.0, 8.0, 12.0, 0.331702462890787, 0.49324868873870137, 0.16941444149597812], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.858000000000002, 2, 20, 4.0, 5.0, 6.0, 9.0, 0.32994959030159376, 0.3182563572624874, 0.18044118219618407], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.671999999999995, 5, 18, 7.0, 10.0, 11.0, 15.0, 0.33172160861096217, 0.5405734038136707, 0.2167204650007165], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 1.0734917803970223, 2934.9628760856076], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.026000000000003, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.32995350955050434, 0.331471166806347, 0.19365435472641904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.015999999999996, 5, 22, 8.0, 10.0, 11.0, 15.990000000000009, 0.33171874761577147, 0.5211320961689139, 0.19728195048633287], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.559999999999994, 4, 13, 6.0, 8.0, 9.0, 11.990000000000009, 0.33171720710034047, 0.513355053968731, 0.18950641225947185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.8940000000002, 1331, 1906, 1549.0, 1754.9, 1805.95, 1884.98, 0.3313975298953712, 0.5060640932350496, 0.1825275457626849], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.021999999999984, 7, 85, 11.0, 14.900000000000034, 19.0, 33.99000000000001, 0.3297313480868328, 0.17153436175716474, 2.6584589939500893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.011999999999986, 8, 28, 11.0, 13.0, 15.0, 19.99000000000001, 0.3317249098205833, 0.6005095533042123, 0.2766533915886505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.7839999999999945, 5, 20, 8.0, 10.0, 11.0, 14.990000000000009, 0.331722929086926, 0.5616321869016548, 0.23777795893535517], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 10.719992897727273, 3099.609375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 1.0285303492239468, 4240.4509077051], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.325999999999998, 1, 28, 2.0, 3.0, 4.0, 7.990000000000009, 0.32995154991441056, 0.27733652199885966, 0.13952052843060525], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 557.6899999999997, 429, 709, 546.0, 645.0, 661.0, 683.97, 0.3298538153860972, 0.2904614100310524, 0.15268623876270512], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1919999999999993, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.3299596063449913, 0.2989324476585076, 0.16111308903564026], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.0120000000005, 603, 923, 739.5, 875.0, 888.95, 911.0, 0.32981465076256444, 0.3120065921291053, 0.17424777935795643], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.867350260416666, 1371.8058268229167], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.20399999999999, 17, 659, 22.0, 27.0, 30.0, 56.0, 0.32958985179662725, 0.17146075190486454, 15.034318337324667], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.385999999999985, 20, 266, 29.0, 36.0, 41.94999999999999, 88.0, 0.32986447847766226, 74.60565204125912, 0.10179411640521609], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 1.1500308388157894, 0.8994654605263157], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.628, 1, 10, 2.0, 4.0, 4.0, 6.0, 0.3317330530852501, 0.36047137255711775, 0.14221758818791483], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.327999999999997, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.3317319526207156, 0.34038484368956257, 0.12213178333790017], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.82, 1, 13, 2.0, 3.0, 3.0, 6.0, 0.33178610413438664, 0.18815577005066375, 0.12863191732553858], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.06199999999997, 66, 121, 92.0, 112.0, 114.94999999999999, 117.0, 0.33176915236962795, 0.3021918028385505, 0.10821376649556226], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.57600000000001, 58, 350, 80.0, 92.0, 101.0, 281.71000000000026, 0.32980790668283166, 0.17157418942286254, 97.522007875483], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.93799999999987, 12, 343, 259.0, 332.90000000000003, 336.0, 339.0, 0.3317277709220705, 0.18488316029583482, 0.13897579465387525], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 417.92, 322, 540, 406.0, 492.0, 503.95, 525.98, 0.3316672581399437, 0.17837155833032067, 0.1412176997548979], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.5599999999999925, 4, 310, 6.0, 9.0, 11.0, 31.980000000000018, 0.3295268587456758, 0.14857992768697847, 0.23910005473441123], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.96999999999963, 278, 511, 389.0, 455.0, 467.0, 489.0, 0.33166197807183667, 0.17059539108419638, 0.13344212398984054], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.405999999999997, 2, 19, 3.0, 4.0, 5.0, 9.980000000000018, 0.32994806617438416, 0.20257973504345414, 0.16497403308719205], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.165999999999998, 2, 49, 4.0, 5.0, 6.0, 10.0, 0.32993805083157585, 0.1932296371720746, 0.15562507671059683], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 670.4659999999991, 533, 870, 677.0, 798.9000000000001, 834.95, 854.99, 0.3297831082453692, 0.3013489767737055, 0.14524627130728662], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 238.8299999999999, 158, 310, 231.0, 282.0, 288.95, 304.0, 0.32987078961170907, 0.2920870543445633, 0.13562070549465774], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.430000000000002, 3, 49, 4.0, 6.0, 6.0, 9.990000000000009, 0.32995634017706776, 0.21998485644754484, 0.15434481146954634], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 979.7399999999999, 797, 8715, 932.0, 1081.9, 1103.95, 1136.98, 0.32977549543821555, 0.24788232089233292, 0.18227825236135745], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.92199999999994, 118, 168, 133.0, 150.0, 151.0, 155.0, 0.3317411967497324, 6.414109130371968, 0.16716646242466987], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.50799999999992, 160, 228, 179.0, 202.0, 205.0, 211.99, 0.3317165468838216, 0.6429308083650289, 0.23712550031148186], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.968, 5, 17, 7.0, 9.0, 10.0, 12.0, 0.3316982819355789, 0.27070661249646744, 0.20472003338211509], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.8180000000000005, 5, 22, 6.0, 9.0, 10.0, 13.990000000000009, 0.3317002623749075, 0.2758910453782544, 0.20990407228412117], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.387999999999991, 5, 21, 8.0, 11.0, 12.0, 15.0, 0.3316943211278668, 0.26843593834167434, 0.20245014717277027], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.706000000000007, 6, 21, 9.0, 12.0, 13.0, 17.99000000000001, 0.3316954213427429, 0.296617982693128, 0.23063197265237592], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.618000000000003, 5, 31, 7.0, 9.0, 10.0, 16.970000000000027, 0.3316797989755074, 0.24898982252974836, 0.1830069203331657], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.8479999999995, 1403, 1971, 1591.5, 1802.0, 1868.6, 1958.91, 0.33136897803156223, 0.27690991034315243, 0.21098884148103375], "isController": false}]}, function(index, item){
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
