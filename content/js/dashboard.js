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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8862156987874921, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.138, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.558, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.948, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.014, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 334.1768559880876, 1, 19635, 10.0, 855.0, 1547.9500000000007, 6286.960000000006, 14.834566654570127, 93.44676963189701, 122.75730501230693], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6469.436000000011, 5452, 19635, 6275.0, 6835.7, 7110.2, 16626.800000000083, 0.3197816275221977, 0.18572005049192009, 0.1611399607436074], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.466, 1, 9, 2.0, 3.0, 4.0, 6.990000000000009, 0.3208985158443642, 0.1647456628559968, 0.11594965904532692], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.8119999999999985, 2, 28, 4.0, 5.0, 5.0, 7.990000000000009, 0.32089604444281855, 0.18417364675731338, 0.1353780187493141], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.670000000000002, 8, 372, 12.0, 16.0, 19.0, 39.950000000000045, 0.3191661847257277, 0.16603810377465078, 3.5117630891648184], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.852, 24, 59, 34.0, 40.0, 41.0, 46.0, 0.32084435968449454, 1.3343584795233923, 0.13347626682186978], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.320000000000001, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.32085115394117514, 0.20044110516377847, 0.13567241177395395], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.90199999999999, 22, 63, 30.0, 35.0, 36.94999999999999, 40.99000000000001, 0.32083859508629275, 1.3167886444874155, 0.1165546458711923], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 866.7920000000001, 672, 1103, 866.5, 1042.7, 1069.95, 1084.98, 0.3207029809342078, 1.3563199282827958, 0.15596687939964402], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.903999999999997, 4, 40, 5.0, 8.0, 9.0, 12.980000000000018, 0.3208120394342159, 0.4770543950848387, 0.16385224279696767], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9779999999999998, 2, 28, 4.0, 5.0, 6.0, 10.990000000000009, 0.31926686112146957, 0.3079522181623893, 0.17459906467580366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.064000000000005, 5, 21, 8.0, 10.0, 11.0, 15.0, 0.32083900683643757, 0.5228391202129216, 0.20961064020857104], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.0179227941176472, 2783.0353860294117], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.109999999999998, 2, 15, 4.0, 5.0, 6.0, 9.980000000000018, 0.3192717539002238, 0.3207402792526359, 0.18738508212308053], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.311999999999998, 6, 21, 8.0, 10.0, 11.0, 14.990000000000009, 0.32083735984219935, 0.5040373722185005, 0.19081050014052675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.669999999999998, 4, 14, 6.0, 8.0, 9.0, 12.0, 0.32083591873611184, 0.49651551638701535, 0.1832900512310795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1596.486000000001, 1383, 1970, 1571.0, 1790.7, 1829.95, 1938.97, 0.3205154914752495, 0.48944656169410383, 0.17653392303910223], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.706000000000007, 8, 52, 11.0, 15.0, 19.0, 33.99000000000001, 0.31915722067679203, 0.16603344045579482, 2.573205091706636], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.48000000000001, 8, 46, 11.0, 14.0, 15.0, 20.99000000000001, 0.3208418891170431, 0.58080841628433, 0.2675771223690965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.037999999999997, 5, 19, 8.0, 10.0, 11.0, 14.0, 0.32084127148112523, 0.543208711698771, 0.2299780207686972], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.970628955696203, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 1.0172526041666667, 4193.954735471491], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4200000000000017, 1, 15, 2.0, 3.0, 4.0, 7.0, 0.31935271037838825, 0.26842780405252203, 0.13503879257211143], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 575.4340000000001, 461, 694, 572.0, 655.9000000000001, 663.95, 682.99, 0.31921916438637776, 0.28109678976449287, 0.14776355851478815], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3779999999999992, 2, 11, 3.0, 4.0, 5.0, 8.980000000000018, 0.3193151838840349, 0.2892889543369707, 0.15591561713087643], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 773.1039999999995, 642, 940, 758.0, 890.9000000000001, 904.95, 930.0, 0.3191339979830731, 0.30190263201775663, 0.16860497354379156], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.457728794642858, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.63, 16, 630, 21.0, 27.0, 34.94999999999999, 55.960000000000036, 0.31903035190962, 0.16596744020095083, 14.552644275096045], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.900000000000013, 21, 222, 29.0, 35.0, 40.0, 90.99000000000001, 0.31927318098894225, 72.21021177210504, 0.09852570819580642], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 1.1375576193058567, 0.8897098698481561], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.792, 2, 8, 3.0, 4.0, 4.0, 6.0, 0.32083818333720476, 0.34863267088002065, 0.13754683836428994], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4900000000000007, 2, 8, 3.0, 4.0, 5.0, 7.0, 0.3208371539691085, 0.3292058652801582, 0.11812071000620498], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9000000000000012, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.3208999575128456, 0.18198224055398884, 0.12441140930917942], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.66000000000001, 68, 121, 92.0, 111.0, 114.94999999999999, 117.99000000000001, 0.3208773042199216, 0.29227096720601864, 0.10466115196235724], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.84600000000003, 59, 380, 81.0, 94.90000000000003, 100.94999999999999, 318.4600000000005, 0.3192242595114464, 0.16606831570736585, 94.39249368893638], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 204.48999999999987, 13, 361, 260.0, 331.0, 333.0, 341.97, 0.3208342717735783, 0.17881184301161998, 0.13441201424889168], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 433.86000000000035, 345, 570, 423.0, 502.90000000000003, 515.95, 540.0, 0.32078631140651964, 0.17251975542449652, 0.1365847966535572], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.298000000000013, 4, 272, 6.0, 8.0, 11.0, 26.0, 0.31897885935711723, 0.14382395425173303, 0.23144657470931457], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 408.03199999999987, 325, 515, 406.0, 464.0, 473.0, 492.99, 0.32076943606166985, 0.1649926461601974, 0.12905957779043747], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6759999999999997, 2, 19, 3.0, 5.0, 6.0, 10.990000000000009, 0.319351078608268, 0.19607345374199628, 0.159675539304134], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.424, 3, 46, 4.0, 5.0, 6.0, 12.0, 0.3193425120887108, 0.1870243143796101, 0.15062737630746806], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 680.0460000000008, 538, 870, 685.0, 796.9000000000001, 836.0, 848.99, 0.3191957289057906, 0.2916744487250365, 0.14058327513331212], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 246.48200000000017, 170, 313, 240.0, 288.90000000000003, 294.95, 306.97, 0.319273996473938, 0.2827040286551604, 0.1312640161284452], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.5600000000000005, 3, 33, 4.0, 6.0, 6.0, 10.0, 0.3192729771183443, 0.21286216231295393, 0.14934741800750675], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1010.1199999999995, 851, 8647, 961.0, 1109.9, 1139.95, 1175.95, 0.31905640981136746, 0.23982510663662857, 0.17635344526683006], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.576, 118, 174, 133.0, 149.0, 151.0, 164.99, 0.3208647433178313, 6.203816408373222, 0.16168574956250092], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.94000000000014, 162, 246, 174.5, 202.0, 204.0, 212.98000000000002, 0.32084394792061033, 0.6218576092553854, 0.2293532908963738], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.330000000000007, 5, 16, 7.0, 9.0, 11.0, 14.0, 0.3208081285080369, 0.2618189073002456, 0.197998766813554], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.138000000000001, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.32080936352705514, 0.26683256153283996, 0.20301217535696459], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.652000000000001, 6, 41, 8.0, 10.0, 12.0, 18.980000000000018, 0.3208040118466506, 0.25962255142327906, 0.19580322988687165], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.073999999999991, 7, 23, 10.0, 12.0, 14.0, 17.99000000000001, 0.3208056584985269, 0.2868798335387559, 0.22306018442475695], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.008000000000004, 5, 32, 8.0, 9.0, 11.0, 26.930000000000064, 0.3208252137818812, 0.24084135750612296, 0.17701781815113563], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1666.4419999999989, 1459, 2053, 1647.0, 1844.9, 1907.85, 2029.94, 0.3204750208949714, 0.26780632825198825, 0.20405245471047004], "isController": false}]}, function(index, item){
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
