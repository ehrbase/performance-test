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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8930865773239737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.214, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.657, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.974, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.134, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.4496490108482, 1, 17723, 9.0, 837.0, 1491.0, 6042.990000000002, 15.385582128767602, 96.91775852425397, 127.31700508360775], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6177.382000000001, 5157, 17723, 6038.5, 6544.9, 6668.85, 15280.250000000075, 0.3318356484400406, 0.19272068211306304, 0.1672140572217392], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.260000000000001, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.3329413503834818, 0.17092831768564476, 0.12030107386903152], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5800000000000014, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.33293846830991775, 0.19108522188517751, 0.14045841631824657], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.456, 8, 355, 11.0, 14.0, 16.0, 66.85000000000014, 0.33096319556879994, 0.1721751991322807, 3.641564769993818], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.077999999999925, 24, 64, 34.0, 40.0, 42.0, 49.99000000000001, 0.33287507531298577, 1.38439298045524, 0.13848123250325384], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1719999999999993, 1, 7, 2.0, 3.0, 3.9499999999999886, 6.0, 0.332887707655352, 0.20796054244551293, 0.1407620873191088], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.656000000000013, 21, 67, 30.0, 35.0, 37.0, 38.99000000000001, 0.33287463209031287, 1.3661870556955849, 0.12092711243905897], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 848.7699999999991, 656, 1091, 855.5, 981.5000000000002, 1035.0, 1070.98, 0.3327324185853682, 1.4071949340740622, 0.16181713325733724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.458000000000001, 3, 21, 5.0, 7.0, 8.0, 12.990000000000009, 0.3328316451002855, 0.49492780694399974, 0.16999116248774349], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.856000000000003, 2, 29, 4.0, 5.0, 5.0, 9.980000000000018, 0.3310951302528243, 0.3193612999043135, 0.18106764935701325], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.472000000000001, 5, 19, 7.0, 9.0, 10.949999999999989, 15.990000000000009, 0.3328739672585166, 0.5424512870155852, 0.21747332431244884], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.9224247068230278, 2521.9403817963753], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.906000000000005, 2, 17, 4.0, 5.0, 6.0, 9.980000000000018, 0.33110061154282955, 0.33262354501975017, 0.19432760501683646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.728000000000003, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.33287263760289093, 0.5229448640997526, 0.19796819951187555], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.547999999999989, 4, 17, 6.0, 8.0, 9.0, 13.980000000000018, 0.3328708647452473, 0.5151404180375398, 0.1901654842538766], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1548.8420000000003, 1336, 1942, 1526.5, 1731.5000000000002, 1799.95, 1899.91, 0.33252684489218814, 0.5077886256116831, 0.1831495512882755], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.572000000000005, 7, 79, 10.0, 12.0, 15.0, 34.99000000000001, 0.33094808020328154, 0.1721673357471583, 2.6682688966389576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.742, 8, 41, 10.0, 13.0, 15.0, 18.0, 0.3328779562891298, 0.602596871438206, 0.27761501432706726], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.522000000000001, 5, 19, 7.0, 9.0, 11.0, 13.0, 0.3328768482154805, 0.5635858598824811, 0.23860508456070575], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 1.0040415313852813, 4139.487790854978], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.268, 1, 22, 2.0, 3.0, 3.0, 6.990000000000009, 0.33113481889243346, 0.2783311034852602, 0.14002087556682002], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 548.7260000000003, 446, 692, 534.0, 635.0, 645.9, 668.0, 0.33100964562107343, 0.29147920659470516, 0.15322126174256717], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2340000000000027, 2, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.331112013207396, 0.2999764900123372, 0.1616757876989238], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 750.9740000000002, 622, 949, 730.0, 872.0, 889.95, 911.0, 0.3309592522968572, 0.31308939188719587, 0.17485249559824195], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.639238911290323, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.27199999999998, 15, 556, 20.0, 24.0, 28.899999999999977, 73.88000000000011, 0.3308280825402833, 0.17210491000979913, 15.090800522906868], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.304000000000016, 21, 311, 28.0, 35.0, 41.94999999999999, 94.0, 0.3310804412904986, 74.88066709874043, 0.1021693549294898], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.2252665011682242, 0.9583089953271028], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5859999999999985, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.33289812451854606, 0.3617373751299135, 0.14271706705433762], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.332000000000002, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.3328965730295186, 0.3415798420389116, 0.12256055471887549], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8240000000000014, 1, 17, 2.0, 3.0, 3.0, 6.990000000000009, 0.33294312399201464, 0.1888119155599637, 0.1290804885008104], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.17400000000013, 66, 127, 90.0, 111.0, 114.0, 117.0, 0.3329269405146118, 0.30324637371814805, 0.10859140442566441], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.13199999999999, 58, 369, 79.0, 92.0, 102.0, 302.3500000000006, 0.3310203835731797, 0.17220494973952005, 97.88052924035456], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.48600000000013, 12, 353, 260.0, 334.0, 338.0, 344.98, 0.3328921402834111, 0.18553210291127492, 0.13946360173982747], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 416.6320000000001, 319, 550, 400.0, 489.0, 501.0, 521.0, 0.33285734732665617, 0.1790115915490848, 0.14172441741642786], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.235999999999999, 4, 320, 6.0, 8.0, 10.0, 28.99000000000001, 0.330761333206321, 0.1491365382370024, 0.23999577204325828], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.818, 292, 507, 386.5, 461.0, 471.95, 486.99, 0.332828986475827, 0.17119565963543246, 0.1339116625273835], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.398, 2, 16, 3.0, 4.0, 5.0, 10.980000000000018, 0.3311317487133876, 0.2033064860679628, 0.1655658743566938], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.173999999999999, 2, 36, 4.0, 5.0, 6.0, 11.990000000000009, 0.33112473137506165, 0.19392462173138497, 0.15618480981851052], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.8800000000006, 543, 858, 679.0, 818.9000000000001, 836.0, 848.0, 0.33096801525100616, 0.30243172026417864, 0.14576813952949585], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.842, 175, 312, 237.0, 284.90000000000003, 289.0, 301.99, 0.3310878952278977, 0.2931647514473507, 0.13612109754975094], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.397999999999998, 3, 42, 4.0, 5.0, 6.0, 9.990000000000009, 0.3311036811445062, 0.22074979897867758, 0.1548815070978696], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 978.7119999999999, 811, 8655, 920.5, 1097.0, 1111.0, 1141.99, 0.3309250812090149, 0.2487464299388583, 0.1829136679338891], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.43, 117, 169, 134.0, 150.0, 151.0, 160.0, 0.3329420154844672, 6.437326573625466, 0.16777156249021985], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 180.66000000000003, 159, 260, 175.0, 202.0, 205.0, 216.93000000000006, 0.33291829519199395, 0.6452600289555688, 0.23798456257865197], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.713999999999998, 5, 16, 6.0, 8.0, 9.949999999999989, 13.0, 0.3328278787281715, 0.2716285024725783, 0.20541720640254332], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.625999999999997, 5, 21, 6.0, 8.0, 10.0, 13.990000000000009, 0.33282942957695383, 0.2768302279931517, 0.2106186234041661], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.122000000000003, 6, 26, 8.0, 10.0, 11.0, 14.990000000000009, 0.33282411244129817, 0.26935026388791816, 0.203139717066222], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.340000000000005, 7, 21, 9.0, 11.0, 12.0, 16.0, 0.33282522016388316, 0.2976283030822944, 0.2314175358952], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.570000000000003, 5, 30, 7.0, 9.0, 10.0, 20.940000000000055, 0.332830315782747, 0.24985350785679242, 0.18364172696997272], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1611.4840000000004, 1392, 1964, 1589.5, 1810.9, 1866.95, 1943.99, 0.3324640506622019, 0.2778250124923367, 0.21168609475757386], "isController": false}]}, function(index, item){
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
