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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.917064303567371, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.845, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.733, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.78, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.07507384685314, 1, 3740, 12.0, 571.0, 1251.0, 2148.0, 25.786273335669197, 173.37531413471262, 227.14701092576883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.349999999999998, 4, 31, 7.0, 9.0, 12.0, 17.99000000000001, 0.5969643170549124, 6.390029640024547, 0.215699997373357], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.736000000000001, 5, 40, 7.0, 9.0, 10.0, 17.980000000000018, 0.5969386597771986, 6.409418998110093, 0.25183349709350566], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.799999999999997, 12, 257, 18.0, 24.0, 29.0, 39.99000000000001, 0.5929805336350419, 0.31956091570425926, 6.601541097108864], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.98200000000001, 27, 74, 46.0, 55.0, 57.0, 62.99000000000001, 0.5967555593747911, 2.4820136009543314, 0.24825963700552833], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.219999999999998, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.5967954471668926, 0.3729971544793079, 0.25235588732740677], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.16599999999997, 23, 68, 40.0, 49.0, 50.0, 55.99000000000001, 0.5967463004713103, 2.448664526535518, 0.2167867419680932], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 747.907999999999, 566, 988, 745.0, 900.8000000000001, 917.95, 953.98, 0.596384004503892, 2.522401487799176, 0.29003831469036934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.177999999999988, 5, 21, 8.0, 10.0, 12.0, 17.0, 0.5966750877410716, 0.8874376549117697, 0.3047471395396294], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.089999999999997, 1, 20, 3.0, 4.0, 5.0, 9.0, 0.5938996998430918, 0.5730204135204829, 0.3247888983516908], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.331999999999992, 8, 27, 13.0, 15.0, 17.0, 20.99000000000001, 0.5967398906295128, 0.9726160912701728, 0.38986229182728915], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.712450438230384, 1974.6077446786312], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.090000000000002, 2, 20, 4.0, 5.0, 6.0, 10.990000000000009, 0.5939109869969128, 0.5961381531981513, 0.3485747101417428], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.368000000000004, 9, 34, 14.0, 16.0, 17.94999999999999, 26.0, 0.5967277835262554, 0.936955858852397, 0.354889863444814], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.920000000000001, 5, 23, 8.0, 10.0, 11.0, 16.0, 0.5967235105482814, 0.9236394181826427, 0.3409016149128366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1862.7120000000014, 1514, 2359, 1860.5, 2101.7000000000003, 2188.75, 2271.86, 0.5955613999980942, 0.9096269820283392, 0.3280240523427003], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.793999999999997, 11, 64, 15.0, 21.0, 25.0, 45.960000000000036, 0.5929474826414625, 0.3202148026374304, 4.780639078796791], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.808000000000018, 11, 38, 17.0, 20.0, 21.0, 26.99000000000001, 0.5967569838469821, 1.0804564922385786, 0.49768600020051035], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.319999999999995, 8, 32, 13.0, 15.0, 17.0, 22.99000000000001, 0.5967484371158432, 1.010509560506711, 0.4277474148857704], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.78515625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.7896686422413793, 3297.3161368534484], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.066000000000001, 1, 20, 2.0, 2.0, 3.0, 9.0, 0.5938376281650061, 0.4993107400879592, 0.2511051689408668], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 397.42000000000036, 308, 556, 395.0, 464.0, 473.95, 496.99, 0.5936317559746067, 0.5222336240743797, 0.2747865745429332], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.960000000000001, 1, 33, 3.0, 4.0, 5.0, 10.0, 0.5938862969051397, 0.5382094565702829, 0.28998354341071275], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1140.7379999999998, 926, 1405, 1131.0, 1313.7, 1354.95, 1380.0, 0.5932119937973754, 0.5613500214742742, 0.3134059459417774], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.00400000000001, 27, 638, 40.0, 47.0, 53.0, 78.97000000000003, 0.5925076226105649, 0.31997726103871327, 27.10143752718129], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.42599999999998, 27, 170, 39.0, 45.0, 52.0, 80.97000000000003, 0.5933161746295631, 134.2650167952976, 0.18309366326459173], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.956768889925373, 1.5304337686567164], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0139999999999993, 1, 11, 2.0, 3.0, 3.0, 7.0, 0.5970363117484806, 0.6489271630625575, 0.25595599693123333], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0460000000000043, 2, 21, 3.0, 4.0, 5.949999999999989, 10.990000000000009, 0.5970306085652399, 0.6127726265645187, 0.21980521428622604], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8860000000000017, 1, 10, 2.0, 3.0, 3.0, 5.0, 0.5969807103592869, 0.33871659445190005, 0.2314466230592157], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 120.01000000000003, 83, 172, 119.0, 145.0, 149.95, 155.99, 0.5969130047048683, 0.5438670247945724, 0.1946962339564707], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 160.06199999999984, 110, 626, 159.5, 184.90000000000003, 200.84999999999997, 341.7000000000003, 0.5930832261829638, 0.3202881094523232, 175.4449069422764], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.120000000000002, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.5970256183692842, 0.3322354280972196, 0.2501210842582255], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 450.784, 342, 648, 459.0, 523.0, 533.0, 551.9200000000001, 0.5967868993339859, 0.6485628252488601, 0.256431870807572], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.166000000000006, 6, 290, 9.0, 13.900000000000034, 18.94999999999999, 38.99000000000001, 0.5923244231944768, 0.25046530785469573, 0.4297822719077111], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.69, 1, 19, 2.0, 3.0, 4.0, 9.0, 0.5970398762933377, 0.6355209620700566, 0.2425474497441684], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4399999999999964, 2, 15, 3.0, 4.0, 6.0, 10.990000000000009, 0.5938298701175307, 0.3647646370155536, 0.29691493505876543], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7840000000000007, 2, 26, 3.0, 5.0, 6.0, 9.990000000000009, 0.5938143546306831, 0.3479380984164159, 0.2800901692252148], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 513.0480000000001, 371, 808, 516.0, 622.9000000000001, 632.0, 651.96, 0.5932471859319736, 0.5415929680631311, 0.26128367271027353], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.206000000000001, 6, 118, 14.0, 22.0, 32.94999999999999, 45.99000000000001, 0.5934316610033505, 0.5256274575488661, 0.24397922781485407], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.7040000000000015, 4, 46, 7.0, 8.0, 9.0, 12.990000000000009, 0.5939215690932719, 0.3961410465729538, 0.2778207339801535], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 506.40000000000026, 390, 3740, 497.0, 555.9000000000001, 571.0, 623.97, 0.5936564249060242, 0.4464018038844127, 0.3281343129851657], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.188000000000004, 8, 30, 13.0, 15.0, 16.0, 19.99000000000001, 0.5966494553187122, 0.4871083443812924, 0.3682445857045177], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.011999999999992, 8, 30, 13.0, 15.0, 15.949999999999989, 19.99000000000001, 0.596657999214798, 0.495762199269452, 0.3775726401281144], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.084000000000001, 8, 23, 12.5, 15.0, 16.0, 20.99000000000001, 0.5966266727920339, 0.4830112419380821, 0.3641520219677941], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.862000000000004, 10, 38, 15.0, 18.0, 19.0, 29.950000000000045, 0.5966337921447195, 0.5337075718794562, 0.4148469336006253], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.970000000000011, 8, 33, 13.0, 14.0, 15.0, 22.0, 0.5962986549887538, 0.4478063141468278, 0.329012441473287], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2092.1859999999997, 1570, 2634, 2083.0, 2384.8, 2452.8, 2583.92, 0.595207626276274, 0.4968821164511817, 0.3789798557930963], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
