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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.879706445437141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.379, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.822, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.317, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.962, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.543, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.96, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.868, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 284.0788768347164, 1, 6932, 25.0, 803.9000000000015, 1843.0, 3647.7600000000384, 17.320429042612457, 116.67947835195068, 143.46799295659835], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 36.608000000000025, 14, 150, 31.0, 60.0, 65.94999999999999, 80.99000000000001, 0.37500093750234376, 0.2177898511152528, 0.18896531616329043], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 14.350000000000005, 4, 98, 12.0, 25.0, 31.0, 50.97000000000003, 0.3748479991363502, 4.022269116357692, 0.13544312468793904], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.39400000000002, 5, 60, 13.0, 27.900000000000034, 33.0, 40.0, 0.37483282456024614, 4.024954138032562, 0.15813259786135384], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 61.062000000000026, 15, 321, 50.0, 116.90000000000003, 137.89999999999998, 166.97000000000003, 0.3730444079524115, 0.20135290499939193, 4.153033447907705], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 70.97599999999997, 27, 155, 61.5, 122.90000000000003, 131.95, 142.99, 0.3747229860325754, 1.5584341092253802, 0.15589061723620815], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.695999999999997, 1, 39, 5.0, 14.0, 17.0, 20.99000000000001, 0.37473871343205944, 0.23410556872033475, 0.15845885050398612], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.139999999999965, 24, 147, 53.0, 106.90000000000003, 118.0, 136.0, 0.37471765025053627, 1.5379195467621398, 0.1361278963800776], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1166.8119999999994, 571, 2500, 912.0, 2240.0, 2331.95, 2454.9300000000003, 0.37457392216353896, 1.584151396926621, 0.18216583323968988], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.09000000000001, 6, 50, 16.0, 28.900000000000034, 34.0, 43.99000000000001, 0.37442049068554145, 0.5567713138396297, 0.19123234045755683], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 9.937999999999994, 2, 38, 7.0, 23.0, 26.0, 33.0, 0.3733569494049063, 0.36012538329757815, 0.20417958170580816], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 27.717999999999993, 10, 68, 22.0, 48.0, 52.0, 56.99000000000001, 0.37471203380202317, 0.6106305839118887, 0.24480698302104834], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1346.0, 1346, 1346, 1346.0, 1346.0, 1346.0, 1346.0, 0.7429420505200593, 0.31705632429420505, 878.7444569557949], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 9.886000000000008, 3, 60, 8.0, 20.0, 23.0, 29.0, 0.3733619677071767, 0.3750792869141111, 0.21913138925001288], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 28.93200000000001, 11, 84, 23.0, 49.0, 53.0, 66.96000000000004, 0.37470389025072937, 0.5886620071145028, 0.22284635660419355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 17.47000000000001, 6, 52, 14.0, 32.0, 36.0, 43.99000000000001, 0.37470332863954964, 0.5798790155550593, 0.21406391333411773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2826.775999999999, 1528, 6031, 2584.5, 4204.6, 4724.0, 5699.93, 0.3739981524491269, 0.5711178232092033, 0.20599116990362068], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 59.31799999999998, 13, 548, 44.0, 125.90000000000003, 143.0, 183.92000000000007, 0.37301936045084616, 0.20133938546365934, 3.007468593634947], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 33.76, 13, 73, 30.0, 55.0, 59.94999999999999, 68.99000000000001, 0.37471399953985124, 0.678331140709978, 0.31250562070999305], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 28.259999999999977, 10, 64, 23.0, 48.0, 52.0, 61.0, 0.37471091053252414, 0.6344141139642016, 0.2685916096981179], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 2.317513992537313, 678.5214552238806], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.5356816520467836, 2236.7758589181285], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 7.3880000000000035, 1, 30, 5.0, 17.0, 20.0, 26.980000000000018, 0.373407975098169, 0.31386326000658693, 0.15789614572022184], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 600.7579999999995, 318, 1337, 470.0, 1163.7, 1215.95, 1315.95, 0.37326636437068034, 0.3286894662272326, 0.17278150069502196], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 9.830000000000005, 2, 44, 6.0, 20.900000000000034, 26.94999999999999, 39.960000000000036, 0.3733778598877178, 0.33826794374651825, 0.18231340814829972], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1757.0880000000013, 932, 3916, 1338.5, 3313.4, 3480.7, 3670.9700000000003, 0.37309534824719803, 0.3529503855474055, 0.19711385097825598], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 4.822406572164948, 678.8317493556701], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 94.13400000000001, 29, 967, 84.0, 161.90000000000003, 183.95, 223.96000000000004, 0.3727654574652247, 0.20120233983945737, 17.05037939136347], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 113.54400000000003, 30, 348, 104.5, 209.90000000000003, 236.95, 278.8900000000001, 0.3731435177134959, 84.44074191169446, 0.11514975741939913], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.216737964037123, 0.9516386310904873], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.241999999999992, 1, 42, 5.0, 20.0, 20.94999999999999, 28.0, 0.37487216859051065, 0.4073476667112764, 0.16071179883909587], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 9.387999999999995, 2, 55, 7.0, 18.900000000000034, 20.0, 36.99000000000001, 0.37486907697486654, 0.38464715612134964, 0.13801332228469207], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.177999999999998, 1, 49, 4.0, 13.0, 16.0, 21.99000000000001, 0.37485418172330964, 0.21257966002787415, 0.1453292091251503], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 189.98399999999998, 85, 486, 139.5, 368.0, 396.95, 443.97, 0.3748272046586524, 0.34141121294645665, 0.12225809214452137], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 300.7299999999999, 114, 1016, 260.0, 481.80000000000007, 519.6999999999999, 669.0900000000008, 0.37301045548306716, 0.20133457895512313, 110.34334097072241], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.062000000000004, 1, 38, 4.0, 12.0, 15.0, 19.99000000000001, 0.37486710960964337, 0.2089261798098824, 0.1570488183813838], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 8.840000000000003, 2, 40, 7.0, 19.0, 21.0, 25.0, 0.37490702305828155, 0.20162602213713499, 0.15962838091153395], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 54.33999999999996, 7, 524, 39.0, 122.90000000000003, 143.0, 175.0, 0.3726526608890598, 0.15747122352861823, 0.27039153031305807], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.792000000000007, 2, 106, 8.0, 18.0, 20.0, 27.960000000000036, 0.37487778984051195, 0.19282410223329693, 0.1508297357561435], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 8.983999999999995, 2, 37, 7.0, 19.0, 21.0, 31.960000000000036, 0.37340462872377767, 0.2292609610594983, 0.18670231436188883], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 10.419999999999995, 2, 45, 8.0, 21.0, 25.0, 33.98000000000002, 0.3733968207501094, 0.21868145251176574, 0.17612369572490513], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 795.5680000000002, 373, 1928, 625.0, 1566.4, 1649.9, 1730.8200000000002, 0.3731290377225994, 0.3409575897338023, 0.1643371054813402], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.993999999999986, 6, 329, 26.0, 54.0, 62.94999999999999, 83.99000000000001, 0.3732017274761561, 0.3304548225780327, 0.1534354758471306], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 15.929999999999986, 5, 57, 13.0, 28.0, 32.0, 46.98000000000002, 0.3733736776037774, 0.24893158538757307, 0.17465428864473567], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 800.63, 453, 5338, 778.0, 981.8000000000001, 1056.35, 1206.94, 0.3731696959338684, 0.28050043618872833, 0.20626371865094675], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 248.604, 143, 571, 191.0, 491.90000000000003, 524.8, 561.0, 0.37493541737435726, 7.2492554661365824, 0.1889323001612972], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 386.8900000000001, 208, 856, 309.5, 691.9000000000001, 720.0, 776.97, 0.3748440648690145, 0.7265202773302557, 0.2679549369962096], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 28.682000000000016, 10, 81, 23.0, 48.900000000000034, 54.94999999999999, 71.97000000000003, 0.3744089954007599, 0.305563810103876, 0.2310805518489065], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 28.60200000000001, 10, 95, 24.0, 48.0, 52.0, 67.96000000000004, 0.3744137616526923, 0.31141791497774857, 0.23693370854584433], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 28.585999999999988, 10, 72, 22.0, 51.900000000000034, 56.0, 62.98000000000002, 0.37440394891333, 0.303000289554654, 0.22851803522542113], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 32.22599999999999, 12, 83, 27.0, 53.0, 60.0, 75.98000000000002, 0.3744045096274376, 0.3348105014755282, 0.2603281356003277], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 28.813999999999975, 10, 98, 22.0, 52.0, 60.0, 68.99000000000001, 0.3746589666755835, 0.28125399831366, 0.20672101188643038], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3233.2739999999994, 1692, 6932, 2932.0, 4923.400000000001, 5504.15, 6370.58, 0.37335890095087043, 0.3119989698561224, 0.23772461271481204], "isController": false}]}, function(index, item){
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
