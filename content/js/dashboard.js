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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8876834716017868, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.164, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.591, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.948, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.024, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 333.5501382684511, 1, 20035, 9.0, 851.9000000000015, 1533.9500000000007, 6331.960000000006, 14.862961033179719, 93.62563316182384, 122.99227091840831], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6477.915999999996, 5280, 20035, 6318.5, 6750.3, 6945.6, 17331.91000000009, 0.3204817995181236, 0.18612669042131177, 0.16149278178842943], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.397999999999999, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3215456829598151, 0.1650779111218793, 0.11618349872571446], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5780000000000056, 2, 12, 3.0, 5.0, 5.0, 7.0, 0.3215436151405885, 0.1845453105998782, 0.13565121263743576], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.430000000000005, 9, 364, 11.0, 15.0, 20.0, 46.97000000000003, 0.3197211008892723, 0.16632678481906663, 3.5178687926947565], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.34999999999998, 23, 60, 33.0, 39.900000000000034, 41.0, 45.99000000000001, 0.32148944775185645, 1.337041334018856, 0.1337446335373934], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.220000000000001, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.32149606263772085, 0.20084399045896134, 0.13594511242395815], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.469999999999985, 21, 60, 29.0, 35.0, 36.0, 39.0, 0.3214900678858427, 1.3194624250044045, 0.1167913137241538], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 858.0159999999998, 677, 1091, 858.0, 1011.4000000000002, 1067.0, 1084.0, 0.32134605435247166, 1.3590396201609303, 0.15627962408938562], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.680000000000002, 3, 13, 5.0, 8.0, 9.0, 11.0, 0.32146795125259986, 0.4780297500506312, 0.16418724463389622], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.024000000000001, 2, 36, 4.0, 5.0, 5.0, 13.990000000000009, 0.31983910813504374, 0.30850418505475, 0.17491201226135206], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.842000000000006, 5, 21, 8.0, 10.0, 11.0, 14.0, 0.3214956491993794, 0.5239091843510707, 0.21003963800232892], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.9204621010638299, 2516.5745511968084], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.185999999999996, 2, 23, 4.0, 5.0, 7.0, 9.990000000000009, 0.31984463227142784, 0.3213157926405669, 0.18772131249524232], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.224000000000002, 5, 16, 8.0, 10.0, 11.0, 13.990000000000009, 0.32149461560817777, 0.5050699248779607, 0.19120138760291042], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.7440000000000015, 4, 20, 6.0, 8.0, 9.0, 13.0, 0.32149358202362205, 0.4975332952818888, 0.1836657670740419], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1587.2920000000004, 1350, 1987, 1562.0, 1782.7, 1861.75, 1957.96, 0.32117576022302446, 0.49045483204916557, 0.1768975866853377], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.052000000000012, 8, 91, 11.0, 14.0, 19.0, 40.960000000000036, 0.3197053595406473, 0.16631859578212718, 2.577624461296469], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.169999999999996, 8, 31, 11.0, 13.0, 15.0, 18.99000000000001, 0.3214977164017204, 0.5819956365928057, 0.26812407207721606], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.953999999999993, 5, 25, 8.0, 10.0, 11.0, 14.0, 0.32149668279722693, 0.5443183729808401, 0.23044781755191848], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.4228515625, 2435.4073660714284], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 1.1341496026894866, 4675.9006341687045], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.386000000000001, 1, 36, 2.0, 3.0, 3.0, 8.0, 0.31990725248935825, 0.2688939172755035, 0.13527328157020715], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 565.2019999999997, 435, 699, 558.5, 650.0, 660.0, 680.99, 0.31978449083593585, 0.2815946027653044, 0.1480252428283531], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.356, 1, 14, 3.0, 4.0, 5.0, 8.990000000000009, 0.3198916974669056, 0.28981125650099904, 0.1561971179037625], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 775.6820000000002, 619, 956, 762.5, 896.8000000000001, 911.0, 931.96, 0.31970924362547726, 0.3024468177660508, 0.16890888750135077], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.296365489130435, 1431.449558423913], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.26400000000001, 15, 808, 21.0, 25.0, 28.94999999999999, 51.97000000000003, 0.31954210893957397, 0.16623366880195356, 14.575988191960448], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.128000000000018, 20, 232, 28.0, 35.0, 39.0, 110.8900000000001, 0.3198278558548647, 72.33566292778575, 0.09869687739271216], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 1.1302027209051724, 0.8839574353448275], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7240000000000015, 1, 9, 3.0, 4.0, 4.0, 6.0, 0.3215041248979224, 0.3493563035304368, 0.13783233479510543], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.456000000000003, 2, 21, 3.0, 4.0, 5.0, 8.990000000000009, 0.32150205761316875, 0.329888112260481, 0.11836550363297325], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8280000000000005, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.32154671687940195, 0.18234901753812258, 0.12466215488390878], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.86400000000003, 66, 127, 91.0, 111.0, 114.0, 119.0, 0.32153017496386, 0.2928656342681073, 0.10487410003704027], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.82999999999996, 59, 346, 81.0, 94.90000000000003, 103.0, 279.8700000000001, 0.31977917329409006, 0.16635699551317842, 94.55657800948977], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.45399999999995, 12, 378, 260.0, 332.0, 335.0, 358.85000000000014, 0.3214968895175939, 0.1791811423990098, 0.13468961484672637], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 427.55400000000003, 321, 540, 415.0, 501.0, 514.9, 530.99, 0.3214532774090352, 0.17287845156438453, 0.13686877827181576], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.159999999999996, 4, 278, 6.0, 8.0, 9.949999999999989, 26.99000000000001, 0.31948922618431463, 0.1440540728726171, 0.23181688970209546], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 401.7460000000001, 308, 512, 398.5, 463.0, 471.0, 491.99, 0.3214336454882609, 0.16533429239758, 0.12932681830191747], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.552, 2, 27, 3.0, 4.0, 5.0, 8.990000000000009, 0.31990193086407426, 0.19641166304057828, 0.15995096543203716], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.210000000000002, 2, 49, 4.0, 5.0, 6.0, 9.990000000000009, 0.31989251611458547, 0.18734642660066217, 0.1508868020345164], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.1819999999999, 532, 885, 683.0, 788.9000000000001, 835.0, 856.0, 0.31974440910913454, 0.2921758213354573, 0.14082493018380826], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.6379999999998, 173, 321, 235.0, 286.0, 289.95, 303.98, 0.3198270375380994, 0.2831937238341505, 0.13149138945658187], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.6819999999999995, 3, 60, 4.0, 5.0, 6.0, 11.0, 0.3198485197410506, 0.21324588175040302, 0.14961664155855786], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1014.8500000000005, 830, 8895, 954.5, 1128.0, 1156.9, 1178.97, 0.3196340318189286, 0.24025928772592534, 0.17667271680616561], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.33799999999994, 117, 167, 137.5, 150.0, 151.0, 154.0, 0.32154092701535425, 6.216890202254066, 0.16202648275383086], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 184.59200000000004, 159, 233, 181.0, 203.0, 205.0, 210.99, 0.321516115673782, 0.6231604003309686, 0.2298337858136801], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.245999999999999, 5, 29, 7.0, 9.0, 10.949999999999989, 13.0, 0.32146443767511773, 0.26235453633737565, 0.19840383262761174], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.126000000000001, 5, 19, 7.0, 9.0, 10.0, 14.990000000000009, 0.32146588443301455, 0.2673786215141043, 0.203427629992767], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.596000000000002, 6, 17, 8.0, 10.0, 12.0, 14.0, 0.32146051082646854, 0.2601538475849636, 0.19620392506498324], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.016000000000004, 7, 25, 10.0, 12.0, 13.0, 17.0, 0.32146216422473295, 0.2874669125021779, 0.2235166610625096], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.01199999999999, 5, 27, 8.0, 9.0, 11.0, 16.970000000000027, 0.32146051082646854, 0.24131827077872522, 0.17736834825874484], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1670.082, 1445, 2062, 1630.5, 1882.9, 1975.55, 2048.94, 0.32114419824102897, 0.2683655291765927, 0.20447853247378017], "isController": false}]}, function(index, item){
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
