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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8687938736439056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.449, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.989, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.782, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.808, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.832, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.483, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 498.8688789619241, 1, 23461, 13.0, 1057.9000000000015, 1889.9500000000007, 10595.980000000003, 9.933443183705519, 62.661010204071935, 82.29976239556784], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11203.208, 9166, 23461, 10739.5, 13037.500000000002, 13439.8, 20490.56000000005, 0.21383449295778864, 0.12423742276298114, 0.10817018296106887], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9920000000000004, 1, 9, 3.0, 4.0, 4.949999999999989, 7.0, 0.21458370974892418, 0.11016484575401068, 0.07795423830722636], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.568000000000001, 3, 18, 4.0, 6.0, 7.0, 10.0, 0.21458260464657172, 0.12309581408348551, 0.09094614298497278], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 17.439999999999998, 10, 501, 15.0, 20.900000000000034, 27.0, 67.96000000000004, 0.2133585494690999, 0.12537106718852745, 2.375697442428396], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.33400000000002, 28, 91, 46.0, 57.0, 59.0, 76.95000000000005, 0.214519724659643, 0.8921653287160822, 0.08966254116633517], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.852, 1, 15, 3.0, 4.0, 5.0, 8.0, 0.21452395846472927, 0.1340288709561161, 0.09113078313687228], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.71599999999998, 24, 81, 40.0, 50.0, 52.0, 73.95000000000005, 0.21451990873465004, 0.8804345367560557, 0.07835004479175695], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1146.0520000000015, 787, 1939, 1138.5, 1509.4, 1576.0, 1797.3200000000006, 0.21445191451946688, 0.9070226970545029, 0.10471284888645843], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.756000000000001, 4, 20, 6.0, 8.0, 10.0, 15.0, 0.21440731386229048, 0.3188282821203597, 0.10992562478291258], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3459999999999965, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.21355474689491397, 0.20598648345271042, 0.1172048513231852], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.468000000000009, 6, 33, 10.0, 12.900000000000034, 15.0, 23.970000000000027, 0.21452046096156652, 0.34964321225083445, 0.14056955986837022], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.8676588208409506, 2162.3253970521023], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.729999999999999, 3, 19, 4.0, 6.0, 7.0, 14.990000000000009, 0.2135557502234861, 0.2145380232542992, 0.12575597400855673], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.772000000000002, 7, 37, 16.0, 20.0, 21.0, 27.0, 0.21451981669710704, 0.3370118889832061, 0.12799961718938713], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.787999999999995, 5, 29, 7.0, 9.0, 11.0, 17.980000000000018, 0.21452027688561176, 0.3319847929525369, 0.12297207278501378], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2295.7540000000013, 1571, 3746, 2230.5, 2999.000000000001, 3189.75, 3518.4100000000008, 0.21425911554694138, 0.3271866421600661, 0.11842837831989143], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.342000000000002, 9, 78, 13.0, 18.0, 23.849999999999966, 42.99000000000001, 0.21335390633934195, 0.12536833885102094, 1.7205825767092635], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.068000000000005, 10, 41, 15.0, 18.0, 20.94999999999999, 29.99000000000001, 0.21452110522989584, 0.3883397636481545, 0.17932623640311604], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.406000000000004, 6, 34, 10.0, 13.0, 15.0, 24.99000000000001, 0.21452092115283544, 0.36313950697729297, 0.15418691207860047], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.036601027397261, 1868.2844606164385], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.7247268982808024, 2739.892997851003], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.706000000000002, 2, 20, 3.0, 3.0, 4.0, 7.990000000000009, 0.21352893722804422, 0.17953946772787702, 0.09070809345136643], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 739.0339999999992, 538, 1165, 731.5, 884.0, 916.95, 1029.99, 0.21347715431537664, 0.18792243793258478, 0.09923352095128836], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.73, 2, 21, 3.5, 4.0, 5.0, 10.990000000000009, 0.21355483810621279, 0.19347359263624478, 0.10469192258722541], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1000.2200000000004, 761, 1539, 989.0, 1184.9, 1225.95, 1355.98, 0.2134792506707518, 0.2019526219895156, 0.11320237608810374], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.890086206896552, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.924000000000014, 20, 560, 27.0, 35.0, 42.94999999999999, 74.95000000000005, 0.21330393720673374, 0.12533897661783572, 9.756988690198641], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.88400000000002, 27, 227, 35.0, 48.0, 61.94999999999999, 120.83000000000015, 0.21342831177778526, 48.297830678623065, 0.06627949525911692], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1067.0, 1067, 1067, 1067.0, 1067.0, 1067.0, 1067.0, 0.9372071227741331, 0.49148459465791944, 0.38623184161199625], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1520000000000006, 2, 17, 3.0, 4.0, 5.0, 8.0, 0.21454301265589232, 0.23306829896354272, 0.0923959654113755], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9000000000000066, 2, 15, 4.0, 5.0, 6.0, 9.990000000000009, 0.21454227619915187, 0.22018700081375883, 0.07940578386667828], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0979999999999985, 1, 18, 2.0, 3.0, 4.0, 7.990000000000009, 0.21458417021159715, 0.12169059910505525, 0.08361238663518288], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 206.25799999999998, 91, 449, 201.5, 306.0, 321.84999999999997, 380.8900000000001, 0.21456455625260426, 0.19543604224840483, 0.07040399502038579], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 118.08200000000001, 82, 395, 113.0, 141.90000000000003, 167.89999999999998, 316.4200000000005, 0.21339561070836247, 0.12545327895159591, 63.12675624587614], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.652, 17, 680, 333.5, 450.90000000000003, 475.95, 582.8900000000001, 0.21453988274966326, 0.11958251933326154, 0.09029950143076648], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 526.6140000000004, 307, 1073, 480.0, 830.9000000000001, 910.8499999999999, 1036.88, 0.21458647255460475, 0.11540519169975232, 0.0917860107215985], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.474000000000006, 5, 277, 7.0, 11.0, 15.0, 28.980000000000018, 0.21328164523754883, 0.10033193489001918, 0.15517072822458386], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 536.0100000000003, 291, 1163, 464.0, 900.9000000000001, 942.8499999999999, 1052.8700000000001, 0.21451125755079628, 0.11033713326619131, 0.08672623108010707], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.0720000000000045, 2, 19, 4.0, 5.0, 6.949999999999989, 14.0, 0.21352766058668007, 0.13110056199946446, 0.10718087650542338], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.6620000000000035, 3, 63, 4.0, 5.0, 7.0, 14.990000000000009, 0.2135220982560369, 0.12505013432141396, 0.10113107192790811], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 890.9539999999997, 600, 1920, 875.0, 1162.6000000000001, 1290.55, 1499.6900000000003, 0.21342712744160633, 0.19502529044764208, 0.09441649290141375], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 489.7979999999996, 245, 1164, 394.0, 864.0, 913.95, 1000.96, 0.21342220803201675, 0.18897661156709952, 0.08816171288822568], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.574, 3, 50, 5.0, 6.0, 7.0, 12.990000000000009, 0.21355675356148596, 0.14244068621337397, 0.10031327974909646], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1206.8240000000003, 890, 9928, 1135.5, 1433.8000000000002, 1479.55, 1756.2400000000007, 0.21347678973603593, 0.16040362456904372, 0.11841290680670744], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 175.5360000000001, 144, 369, 179.5, 193.90000000000003, 210.79999999999995, 294.98, 0.21465759323330574, 4.150396180103731, 0.10858655595200427], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 236.86200000000034, 195, 447, 240.5, 263.90000000000003, 289.95, 351.97, 0.21464091433595253, 0.4160155948161214, 0.15385393664315344], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.564, 6, 32, 9.0, 12.0, 14.0, 20.99000000000001, 0.21440565893719973, 0.17504211999169822, 0.13274725367791468], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.167999999999992, 6, 26, 9.0, 11.0, 13.0, 19.0, 0.21440639445630827, 0.17827137926561523, 0.13609780898105506], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.166000000000007, 6, 24, 10.0, 12.0, 14.0, 19.0, 0.21440391209954174, 0.17351432226172972, 0.13128052039688737], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.491999999999994, 8, 35, 12.0, 15.0, 17.0, 21.99000000000001, 0.2144048314842346, 0.1917311017953403, 0.14949711882787453], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.492000000000013, 6, 37, 9.0, 11.0, 13.0, 28.970000000000027, 0.21438469876377209, 0.16093716971357347, 0.11870715253814333], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2047.4459999999997, 1625, 3093, 1980.0, 2529.2000000000003, 2609.9, 2743.76, 0.21423460403018135, 0.17902606739713525, 0.1368256162458385], "isController": false}]}, function(index, item){
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
