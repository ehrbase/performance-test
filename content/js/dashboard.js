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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8616677302701553, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.984, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.604, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.701, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.267, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 498.9186556051901, 1, 28787, 14.0, 1213.0, 2376.9500000000007, 9811.960000000006, 9.916541576065631, 62.466918246040976, 82.06022779541632], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10033.918000000009, 8507, 28787, 9798.0, 10481.5, 10865.0, 27395.740000000136, 0.21391554870835652, 0.12423605075424483, 0.10779338196632028], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.51, 2, 18, 3.0, 4.0, 5.0, 11.0, 0.21465519721016932, 0.11020154660679504, 0.07756095992945572], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.048000000000004, 3, 19, 5.0, 6.0, 7.0, 10.0, 0.21465363060857737, 0.1231973488720381, 0.0905570004129936], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.942, 13, 555, 18.0, 23.900000000000034, 28.0, 91.99000000000001, 0.2132006145294513, 0.11091220641209378, 2.345831370999344], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.626000000000005, 32, 95, 56.0, 68.0, 70.0, 73.0, 0.21459466929673893, 0.8924770157038232, 0.08927473546915116], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.464000000000002, 2, 14, 3.0, 4.0, 5.0, 9.990000000000009, 0.21460084029105025, 0.13406474955330835, 0.09074430063088354], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.74, 29, 70, 48.0, 60.0, 61.0, 64.0, 0.21459374828325, 0.880737589694822, 0.07795788511852442], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1206.244, 851, 1784, 1172.0, 1482.9, 1650.9, 1758.96, 0.21452064503783716, 0.9072526393279412, 0.1043274230750419], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.849999999999996, 5, 27, 8.0, 12.0, 13.0, 20.99000000000001, 0.21458094701438507, 0.31908647834792414, 0.10959554227394863], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.402000000000006, 3, 30, 5.0, 6.0, 7.0, 13.990000000000009, 0.21338358943631736, 0.20582139172084477, 0.11669415047298608], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.014, 8, 30, 12.0, 15.0, 17.0, 22.99000000000001, 0.2145944850934087, 0.34970308908224806, 0.14019893606200234], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.704588253257329, 1926.3681417956027], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.044000000000005, 4, 24, 6.0, 7.0, 9.0, 17.99000000000001, 0.21338504648806625, 0.21436653434837757, 0.12523868451106232], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.393999999999991, 8, 40, 12.0, 15.0, 17.0, 23.0, 0.21459337988006805, 0.3371274571746722, 0.12762438315132954], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.460000000000004, 6, 30, 9.0, 11.0, 12.0, 18.99000000000001, 0.214593011478151, 0.33209735470658264, 0.12259464034640462], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2358.242000000002, 1967, 2967, 2316.5, 2726.9, 2834.65, 2924.9700000000003, 0.2143965573058414, 0.3274086676025791, 0.11808560382860796], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.547999999999995, 13, 102, 17.0, 22.0, 25.0, 87.0, 0.21319270573948876, 0.11090809206492486, 1.7188661900246283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.512000000000008, 12, 53, 17.0, 21.0, 23.94999999999999, 31.99000000000001, 0.21459549821563845, 0.3884744345676866, 0.17896929245718282], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.191999999999995, 8, 36, 12.0, 15.0, 16.0, 21.99000000000001, 0.21459549821563845, 0.3633265246205415, 0.15382138251003769], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.206311677631579, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.6996488499245852, 2884.5299538084464], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.486000000000003, 2, 33, 3.0, 4.0, 5.0, 10.990000000000009, 0.2133688379079612, 0.17934442624586064, 0.09022334649819062], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 774.734, 577, 994, 758.5, 946.0, 957.95, 972.97, 0.21331240027645285, 0.18783781684890655, 0.09874031028421744], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.557999999999994, 3, 23, 4.0, 6.0, 7.0, 13.990000000000009, 0.21337375485745352, 0.19330953722539865, 0.10418640373899098], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1059.2520000000009, 816, 1371, 1018.5, 1308.9, 1333.85, 1353.99, 0.21329174428708728, 0.20178732082960252, 0.11268636099542405], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.151075487012987, 855.1516842532468], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.86999999999999, 24, 1754, 34.0, 40.0, 46.94999999999999, 108.97000000000003, 0.21303465306880678, 0.11082586917605865, 9.717625629730435], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 50.02000000000004, 30, 725, 45.0, 63.0, 76.0, 189.97000000000003, 0.21328819586340342, 48.23952248065582, 0.06581940419222214], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.81939697265625, 0.640869140625], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.0259999999999945, 2, 14, 4.0, 5.0, 5.0, 10.0, 0.21463759729522286, 0.2332318368030932, 0.09201748555918246], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.88, 3, 20, 5.0, 6.0, 7.0, 10.990000000000009, 0.21463686018898348, 0.22023544469645195, 0.07902157840942067], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.7519999999999993, 1, 14, 2.0, 4.0, 4.0, 8.0, 0.21465602659674032, 0.12173134883300105, 0.08322113531143155], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.99600000000007, 84, 174, 130.0, 162.0, 166.0, 171.0, 0.21464745657789278, 0.19551155197731093, 0.07001196337599237], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 127.70199999999998, 85, 820, 120.0, 148.90000000000003, 161.95, 697.8700000000001, 0.2132433503259851, 0.11093443862515188, 63.054642622270535], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 264.57799999999986, 16, 519, 281.0, 479.90000000000003, 494.84999999999997, 510.99, 0.21463483317292958, 0.11962328675793225, 0.08992025725701834], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 585.0379999999993, 410, 734, 567.5, 700.0, 712.0, 726.99, 0.21461143312364367, 0.115418615562033, 0.09137752425967641], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.791999999999996, 6, 420, 9.0, 12.0, 19.0, 39.98000000000002, 0.2129990781399898, 0.09603887145313936, 0.15454913579884028], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 542.6679999999993, 405, 684, 549.5, 647.0, 657.0, 679.99, 0.2145999192245904, 0.11039489282236234, 0.0863429362505188], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.978000000000001, 3, 20, 5.0, 6.0, 7.0, 15.0, 0.2133672900263167, 0.13100209854731015, 0.10668364501315836], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.601999999999995, 3, 36, 5.0, 7.0, 7.0, 14.990000000000009, 0.2133643764276744, 0.12495776385492247, 0.10063964239703782], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 932.9240000000011, 678, 1422, 880.5, 1160.8000000000002, 1355.4499999999998, 1408.98, 0.21328610325862776, 0.19489642546887753, 0.09393753180629015], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 330.3420000000002, 216, 460, 330.0, 395.0, 402.0, 425.99, 0.21332623383627128, 0.1889037132844219, 0.08770541449713887], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.955999999999996, 4, 76, 7.0, 8.0, 10.0, 18.99000000000001, 0.21338613928993627, 0.1422664562056957, 0.0998163678905073], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1599.2120000000004, 1280, 14121, 1479.5, 1779.0, 1822.85, 5539.910000000033, 0.21327045551583512, 0.16030898663583346, 0.11788191193551044], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.88799999999998, 129, 234, 180.5, 205.0, 207.0, 212.98000000000002, 0.21467538076972287, 4.150679304686836, 0.10817626609099316], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 234.11200000000002, 179, 331, 237.0, 280.0, 283.0, 291.96000000000004, 0.21465657952468165, 0.41604595698088953, 0.15344591426959664], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.061999999999996, 7, 29, 11.0, 13.0, 15.0, 20.980000000000018, 0.2145782764386186, 0.17512227676027142, 0.1324350299894599], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 10.769999999999985, 7, 24, 11.0, 13.0, 15.0, 19.99000000000001, 0.2145795656737927, 0.17847613464846288, 0.13578863140294695], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.244, 8, 38, 12.0, 15.0, 17.0, 21.0, 0.2145753296735365, 0.173653048294684, 0.13096638774019562], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.018000000000006, 11, 43, 15.0, 18.0, 19.0, 25.980000000000018, 0.21457652678708988, 0.19188463998457625, 0.14919774128164845], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.203999999999992, 7, 38, 11.0, 13.0, 15.0, 31.980000000000018, 0.21456179401123704, 0.16107011393982226, 0.11838614610971573], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2670.212, 2308, 3341, 2632.0, 3046.3, 3200.85, 3316.9700000000003, 0.21435234724394328, 0.17913660107056134, 0.1364821585967295], "isController": false}]}, function(index, item){
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
