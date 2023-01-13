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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8695383960859392, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.468, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.775, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.8, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.837, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.49, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.16396511380384, 1, 24901, 13.0, 1079.0, 1975.9000000000015, 11279.910000000014, 9.812676199219245, 61.89929630811886, 81.29919351480417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11414.787999999984, 8986, 24901, 11425.5, 12772.1, 13299.0, 21670.880000000067, 0.21111013531315234, 0.12266653370246645, 0.10679204110567668], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.040000000000001, 2, 13, 3.0, 4.0, 4.0, 8.0, 0.21184753078992014, 0.10876012247223525, 0.07696023579477566], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.438000000000004, 2, 19, 4.0, 6.0, 6.0, 8.0, 0.211845915144695, 0.12145391122639294, 0.08978625700468518], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.526000000000007, 10, 400, 14.0, 19.900000000000034, 25.0, 44.99000000000001, 0.21077232036718224, 0.123911071153363, 2.346900387525988], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.66800000000001, 26, 97, 47.0, 56.0, 58.0, 61.98000000000002, 0.21177207056753644, 0.8807621095770107, 0.088514107620025], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.722000000000001, 1, 16, 3.0, 4.0, 4.0, 7.990000000000009, 0.21177601721315467, 0.13236001075822168, 0.08996344481222879], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.72600000000002, 24, 78, 41.0, 50.0, 52.0, 68.97000000000003, 0.2117713530114098, 0.8691538896626779, 0.07734617776002664], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1151.5239999999994, 784, 1662, 1160.5, 1435.5000000000002, 1512.9, 1592.0, 0.211706165391631, 0.8954095725694862, 0.10337215107013233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.707999999999993, 4, 27, 6.0, 8.0, 9.0, 13.990000000000009, 0.21167013664577342, 0.314758040792857, 0.10852228685452249], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.410000000000001, 3, 29, 4.0, 5.0, 6.0, 11.0, 0.21087107890500553, 0.2034218109281406, 0.11573197885216123], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.190000000000001, 6, 27, 10.0, 12.0, 13.0, 19.0, 0.21177000760677867, 0.3451602956012828, 0.138767260843895], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.7990056818181819, 1991.2323100799665], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.809999999999997, 3, 26, 5.0, 6.0, 7.0, 12.990000000000009, 0.21087259078065035, 0.2119022421028215, 0.12417594945384], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.852000000000002, 8, 27, 17.0, 20.0, 20.0, 23.0, 0.21176893129538207, 0.33275020552174783, 0.12635821974753755], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.829999999999995, 5, 21, 8.0, 9.0, 11.0, 16.0, 0.21176920037220553, 0.3277513034658994, 0.12139503966648892], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2307.1320000000014, 1478, 3464, 2298.0, 2903.7000000000003, 3164.9, 3364.7700000000004, 0.2115271285657657, 0.32301473262653657, 0.11691831520334314], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.002000000000018, 10, 70, 13.0, 17.900000000000034, 23.0, 35.97000000000003, 0.21076707835097522, 0.12387217548403714, 1.6997212236546422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.777999999999997, 10, 30, 15.0, 17.0, 19.0, 25.0, 0.21177207056753644, 0.38336328606616016, 0.17702821524005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.173999999999998, 6, 36, 10.0, 12.0, 13.0, 18.0, 0.21177117362313794, 0.35840078973176637, 0.15221053104163038], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 8.420850409836065, 2235.8158299180327], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.6629873853211009, 2506.4814056356486], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7219999999999978, 2, 15, 3.0, 3.0, 4.0, 8.990000000000009, 0.2108736580000405, 0.17730685501761215, 0.08958011838868907], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 734.1380000000005, 526, 1005, 745.5, 865.9000000000001, 878.0, 944.99, 0.2108059109977444, 0.18548737997238443, 0.09799181019035774], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8720000000000026, 2, 22, 4.0, 5.0, 6.0, 11.0, 0.2108721461090926, 0.19104316276061162, 0.10337677475269968], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 999.8460000000005, 744, 1273, 1003.0, 1185.0, 1203.0, 1251.98, 0.21080155605276615, 0.1994195071912843, 0.11178246575844925], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 7.4728260869565215, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.790000000000003, 20, 527, 28.0, 34.0, 40.0, 65.97000000000003, 0.21072124403079395, 0.12382136693922757, 9.638850654689833], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.07000000000003, 25, 224, 35.0, 42.0, 48.94999999999999, 116.99000000000001, 0.21083097764854308, 47.709982498261695, 0.06547290126194989], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 0.4780438126709207, 0.37566943938012765], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.146, 2, 10, 3.0, 4.0, 4.0, 8.0, 0.2118180042761819, 0.23008399748868577, 0.09122240223222286], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8079999999999976, 2, 11, 4.0, 5.0, 5.0, 8.0, 0.21181728640874384, 0.21740231251522435, 0.07839721830948623], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.117999999999999, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.21184815910305185, 0.12013900827415355, 0.08254630418175556], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.09800000000016, 91, 348, 196.5, 271.0, 277.0, 319.9100000000001, 0.21183047799971022, 0.19296970456109147, 0.06950687559365491], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 115.144, 82, 384, 112.5, 133.0, 149.84999999999997, 232.85000000000014, 0.21079924533870167, 0.12392690009169766, 62.358698630858896], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 259.75600000000003, 18, 493, 321.0, 422.90000000000003, 432.95, 466.96000000000004, 0.2118146841800696, 0.11811150846369114, 0.08915246961094726], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 535.0079999999999, 313, 1034, 491.0, 874.8000000000001, 922.95, 978.96, 0.2118328113772861, 0.11392426518904808, 0.09060817517895636], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.645999999999987, 5, 264, 7.0, 10.0, 15.949999999999989, 31.99000000000001, 0.21070019890098776, 0.09911757110604963, 0.15329262517698816], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 544.6079999999994, 281, 1183, 476.0, 900.9000000000001, 950.8499999999999, 1006.98, 0.21179171555525433, 0.10893829541026173, 0.08562672874987823], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.050000000000004, 2, 15, 4.0, 5.0, 6.0, 12.0, 0.21087250184618875, 0.1295300817004421, 0.10584811127826271], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.578, 3, 26, 4.0, 5.0, 6.0, 12.990000000000009, 0.21087036744161528, 0.12352102443460383, 0.09987512520428067], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 897.0080000000003, 583, 1494, 893.0, 1152.9, 1267.9, 1373.93, 0.2107816500240502, 0.1926079079531289, 0.09324617916103001], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 489.4040000000005, 256, 1056, 397.0, 869.0, 928.0, 998.8800000000001, 0.21081622138064385, 0.1866691172734801, 0.08708521644923081], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.739999999999999, 4, 56, 5.0, 7.0, 8.0, 13.990000000000009, 0.21087356906467872, 0.1406510231163824, 0.09905291671885788], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1231.3879999999992, 910, 9763, 1211.5, 1419.9, 1435.9, 1768.3100000000015, 0.21079400198314996, 0.15830423695417, 0.1169247979750285], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 172.40000000000006, 144, 226, 179.0, 189.0, 191.0, 212.99, 0.21189385643428407, 4.0969594370531155, 0.10718849378218667], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 234.64000000000004, 196, 345, 242.0, 258.0, 264.0, 288.98, 0.21187760424060312, 0.4106837672992767, 0.15187320460215106], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.378000000000002, 6, 28, 9.0, 11.0, 13.0, 20.0, 0.21166843409809138, 0.17280743252539493, 0.13105252658026362], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.054000000000006, 6, 24, 9.0, 11.0, 12.0, 16.0, 0.21166915095693506, 0.17591153401607923, 0.13436030090039822], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.399999999999999, 6, 36, 10.0, 13.0, 14.0, 20.99000000000001, 0.2116667315777977, 0.17132313522138645, 0.1296045319328898], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.546000000000001, 8, 25, 12.0, 15.0, 17.0, 21.99000000000001, 0.21166726921282636, 0.18934298691303608, 0.14758831075972464], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.744000000000003, 6, 28, 10.0, 12.0, 13.0, 24.980000000000018, 0.21166440185756677, 0.1588950608905568, 0.11720089438793005], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2100.1720000000014, 1580, 2806, 2072.0, 2525.9, 2577.9, 2648.9300000000003, 0.21151218521699036, 0.17675106641799884, 0.1350868839178825], "isController": false}]}, function(index, item){
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
