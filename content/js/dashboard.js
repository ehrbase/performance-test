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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9178141331515565, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.004, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.869, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.736, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.783, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.83744603499352, 1, 3809, 12.0, 577.0, 1283.9500000000007, 2138.980000000003, 25.800816058531094, 173.47641914381273, 227.27511536280016], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.6380000000000035, 4, 22, 6.0, 9.0, 11.0, 18.99000000000001, 0.5973344547292163, 6.397380843349636, 0.21583373852520513], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.0039999999999925, 4, 33, 7.0, 8.0, 10.0, 16.99000000000001, 0.5973151876943514, 6.413461834247425, 0.25199234480855454], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.408000000000015, 13, 264, 18.0, 23.900000000000034, 28.0, 36.0, 0.5932070672317162, 0.31968299607534206, 6.60406305316559], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.74200000000002, 25, 59, 41.5, 51.0, 53.0, 55.0, 0.5971625225578143, 2.483706233958722, 0.24842894004846572], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.112000000000002, 1, 13, 2.0, 3.0, 3.0, 6.0, 0.5971881990834356, 0.37324262442714723, 0.25252196308899183], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.42799999999999, 22, 53, 35.0, 45.0, 47.0, 48.0, 0.5971653753960698, 2.450384141556858, 0.21693898403060352], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 738.9659999999999, 552, 1023, 739.5, 885.9000000000001, 902.95, 925.98, 0.5967961594973543, 2.524144694124064, 0.2902387572555493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 7.809999999999999, 5, 31, 8.0, 10.0, 11.0, 16.99000000000001, 0.5970142125203433, 0.8879420367856278, 0.30492034487123], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.1900000000000013, 1, 37, 3.0, 4.0, 5.949999999999989, 14.970000000000027, 0.5942137838583014, 0.573323455519533, 0.3249606630475086], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 11.536000000000005, 7, 27, 12.0, 14.0, 16.0, 22.980000000000018, 0.5971639489735349, 0.9733072566765915, 0.39013933775712384], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.7065526697019868, 1958.2616540769868], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.988, 2, 24, 4.0, 5.0, 7.0, 11.990000000000009, 0.5942264953709756, 0.5964548447286168, 0.34875988644331674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.567999999999998, 8, 32, 13.0, 15.0, 17.0, 25.980000000000018, 0.5971610961489081, 0.937636227375059, 0.3551475659713721], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.513999999999994, 4, 27, 8.0, 9.900000000000034, 11.0, 14.0, 0.5971603829470103, 0.9243156318076283, 0.3411511953359385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1839.8200000000002, 1461, 2259, 1844.0, 2049.0, 2116.0, 2236.91, 0.5959866260601112, 0.9102764483964979, 0.3282582588846706], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.357999999999983, 11, 69, 15.0, 21.0, 25.94999999999999, 34.99000000000001, 0.5931669539571948, 0.3203333257210241, 4.782408566279882], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.780000000000003, 10, 40, 16.0, 19.0, 21.0, 26.980000000000018, 0.5971739340743865, 1.0812114001698363, 0.4980337301753183], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 11.510000000000014, 7, 26, 12.0, 15.0, 16.0, 20.0, 0.5971696547045623, 1.0112228332594833, 0.42804934233705927], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.4975961538462], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.68359375, 2854.3930736940297], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 1.978000000000001, 1, 17, 2.0, 2.0, 4.0, 8.0, 0.5941502344516826, 0.49957358580361194, 0.2512373549976353], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 398.1039999999998, 305, 663, 406.5, 461.0, 468.95, 490.0, 0.5939469676631512, 0.5225109241696028, 0.27493248307845086], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.748000000000001, 1, 14, 2.0, 3.0, 4.949999999999989, 10.990000000000009, 0.5941961298817668, 0.5384902427053513, 0.2901348290438315], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1148.1560000000006, 908, 1562, 1145.0, 1343.9, 1355.0, 1385.0, 0.5935542383927501, 0.561673883791577, 0.3135867607133572], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.662471064814815, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 39.99599999999999, 26, 588, 39.0, 46.900000000000034, 51.0, 76.98000000000002, 0.5927612002228783, 0.32011420285473796, 27.11303622660075], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.634000000000015, 26, 177, 39.0, 45.0, 52.94999999999999, 76.99000000000001, 0.5935584661024695, 134.31984636184274, 0.18316843289880896], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.8208821614583335, 1.4241536458333335], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9000000000000008, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.5973722788199268, 0.6492923303970495, 0.25610002968940226], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.8720000000000003, 1, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.5973651418324056, 0.6131159805330647, 0.21992837741290713], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.881999999999999, 1, 13, 2.0, 3.0, 3.0, 6.0, 0.5973480137581195, 0.3389249960873705, 0.2315890248652084], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.28000000000002, 82, 161, 114.0, 142.0, 148.0, 153.99, 0.597275943875174, 0.5441977105815795, 0.1948146145061603], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 157.60600000000005, 107, 612, 159.5, 182.90000000000003, 194.95, 358.2400000000007, 0.5933175827292372, 0.3204146711418634, 175.51423391130376], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1180000000000003, 1, 17, 2.0, 3.0, 4.0, 8.0, 0.5973601460426085, 0.3324215875204297, 0.2502612330588663], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 442.5440000000003, 334, 601, 443.5, 517.0, 524.95, 555.95, 0.5971368482400585, 0.6489431349565106, 0.2565822394781502], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.582, 6, 302, 9.0, 12.900000000000034, 16.94999999999999, 26.99000000000001, 0.5925673097207113, 0.25056801280182417, 0.4299585069555551], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.69, 1, 31, 2.0, 3.0, 4.0, 9.990000000000009, 0.5973758473776396, 0.6358785875406514, 0.24268393799716603], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.1860000000000017, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.594143174245557, 0.3649570865238822, 0.2970715871227785], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.682000000000003, 2, 27, 3.0, 5.0, 6.0, 10.0, 0.5941255244643068, 0.3481204244908047, 0.28023694171509783], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 508.9579999999993, 363, 876, 513.5, 616.0, 626.0, 644.97, 0.5935091465694577, 0.5418321197060468, 0.261399047951978], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.271999999999988, 6, 122, 13.0, 24.0, 32.849999999999966, 43.0, 0.5936782762432514, 0.5258458950709267, 0.24408061943203987], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.348, 4, 38, 6.0, 8.0, 9.0, 13.990000000000009, 0.5942392074275147, 0.39635290886034424, 0.27796931675564407], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 508.2579999999995, 331, 3809, 495.5, 566.9000000000001, 589.95, 659.94, 0.5940267050645529, 0.4466802372067439, 0.328338979557165], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.871999999999984, 7, 27, 12.0, 14.0, 16.0, 20.0, 0.5970013814611967, 0.48739565908355514, 0.36846179012058233], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.530000000000006, 7, 21, 12.0, 14.0, 16.0, 18.0, 0.5970085097592981, 0.4960534379332043, 0.3777944475820558], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 11.652000000000003, 7, 23, 12.0, 14.0, 15.0, 20.0, 0.596984274240248, 0.4833007454542632, 0.36437028457046383], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 14.399999999999983, 9, 36, 15.0, 17.0, 19.0, 23.0, 0.5969921149281461, 0.5340281028068181, 0.4150960799109765], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.345999999999993, 7, 34, 12.0, 14.0, 15.0, 20.99000000000001, 0.5967220862358891, 0.44812430108925655, 0.3292460729719505], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2096.3920000000016, 1624, 2697, 2093.0, 2404.4, 2513.85, 2618.9700000000003, 0.5955919051912981, 0.4972029142907513, 0.3792245333835219], "isController": false}]}, function(index, item){
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
