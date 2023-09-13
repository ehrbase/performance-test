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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8927887683471601, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.195, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.647, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.989, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.133, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.5601361412446, 1, 18582, 9.0, 834.9000000000015, 1494.0, 6058.970000000005, 15.311825771551858, 96.45314816642434, 126.70666493345985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6193.526000000002, 5052, 18582, 6038.0, 6520.8, 6720.65, 15655.770000000077, 0.33016942974456776, 0.19175298980799987, 0.16637443920722358], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3220000000000027, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3312339724161597, 0.17005176917861262, 0.11968415018943271], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5400000000000005, 2, 18, 3.0, 4.0, 5.0, 7.0, 0.3312317781118066, 0.1901056917129784, 0.13973840639091842], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.111999999999997, 8, 337, 11.0, 14.0, 18.0, 75.96000000000004, 0.3293972557255831, 0.17136055868903846, 3.6243348440040477], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.22200000000002, 23, 45, 33.0, 39.0, 41.0, 42.99000000000001, 0.3311718848316654, 1.3773095875502555, 0.13777267865067327], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2279999999999975, 1, 13, 2.0, 3.0, 4.0, 6.990000000000009, 0.331180220327577, 0.20689384643140066, 0.14004007363461018], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.342000000000013, 21, 41, 29.0, 34.900000000000034, 36.0, 37.0, 0.33117166548217597, 1.359197724842379, 0.12030845660094676], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 851.48, 670, 1118, 859.5, 980.0, 1034.95, 1074.99, 0.3310280539655175, 1.399986819911139, 0.16098825280744894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.539999999999995, 3, 17, 5.0, 8.0, 8.949999999999989, 11.990000000000009, 0.3311142059252225, 0.49237393799257373, 0.16911399384657358], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.820000000000001, 2, 35, 4.0, 5.0, 5.0, 10.980000000000018, 0.3296020187464444, 0.3179211034531744, 0.1802511040019618], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.783999999999995, 5, 24, 8.0, 9.0, 11.0, 16.0, 0.33117056873908796, 0.5396754294537143, 0.21636045945942364], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 1.037451288968825, 2836.4269521882497], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.030000000000003, 2, 20, 4.0, 5.0, 6.0, 10.980000000000018, 0.3296054951828157, 0.3311215517085101, 0.19345010020007056], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.05400000000001, 5, 19, 8.0, 10.0, 10.0, 16.0, 0.331167717241055, 0.5202664242215406, 0.19695423808574464], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.567999999999992, 5, 21, 6.0, 8.0, 9.0, 12.990000000000009, 0.3311664011816017, 0.5125026441567344, 0.18919174286253612], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1566.0579999999993, 1333, 1913, 1548.5, 1771.9, 1832.75, 1902.0, 0.33080882095104885, 0.5051650990325828, 0.18220329591444492], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.285999999999992, 7, 53, 10.0, 14.0, 16.0, 30.0, 0.3293877077777661, 0.17135559161161498, 2.655688393958239], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.950000000000005, 8, 21, 11.0, 13.0, 15.0, 18.99000000000001, 0.3311745170482018, 0.5995131972631076, 0.2761943726163714], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.721999999999999, 5, 16, 8.0, 10.0, 11.0, 13.0, 0.33117342028622654, 0.5607018266449549, 0.23738407274422882], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 1.1743473101265822, 4841.628757911392], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3320000000000025, 1, 18, 2.0, 3.0, 4.0, 6.0, 0.32960658158422107, 0.27704656331577626, 0.13937465803317162], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 552.4039999999997, 406, 706, 542.0, 638.0, 651.9, 686.9200000000001, 0.3295031882728497, 0.2901526561499134, 0.15252393675911208], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2000000000000006, 2, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.32960592974251846, 0.29861202839983575, 0.1609403953820891], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 746.4520000000008, 608, 1004, 725.5, 870.0, 885.95, 907.96, 0.3294669290980579, 0.31167764539705045, 0.1740640709395013], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.321716994382022, 739.8503335674158], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.79199999999999, 16, 1174, 22.0, 27.0, 30.0, 97.83000000000015, 0.3291351053528559, 0.1712241816137889, 15.013574971710836], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.087999999999983, 21, 244, 29.0, 35.0, 40.0, 121.86000000000013, 0.32951534882494826, 74.52668917290823, 0.10168637717644888], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 1.2667006340579712, 0.990715579710145], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6500000000000026, 1, 10, 3.0, 3.0, 4.0, 6.0, 0.3311758331721611, 0.35986588020409704, 0.1419787019165808], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3759999999999977, 2, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.3311749557550259, 0.3398133181263313, 0.12192671710902808], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8600000000000014, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.3312348501460414, 0.18784315412920677, 0.12841819873826021], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.91600000000011, 64, 120, 92.0, 109.90000000000003, 114.0, 117.0, 0.3312129082944324, 0.3016851481399414, 0.10803233532259805], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.61399999999998, 60, 334, 80.0, 91.0, 98.94999999999999, 308.98, 0.3294534696392155, 0.1713898025502993, 97.41720319536921], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.84399999999994, 12, 365, 263.0, 332.0, 336.95, 342.99, 0.33117056873908796, 0.18457261258309068, 0.13874235741119992], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.1280000000001, 321, 536, 409.0, 483.0, 492.0, 525.97, 0.3311400821889684, 0.17808804166238945, 0.14099323811952172], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.038000000000005, 4, 241, 6.0, 8.0, 10.0, 29.0, 0.32908701389734457, 0.14838160662748337, 0.2387809094977803], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 389.346, 270, 490, 388.5, 451.0, 460.0, 476.99, 0.33111376737933385, 0.17031341056286028, 0.13322155484402887], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5099999999999985, 2, 14, 3.0, 5.0, 5.0, 9.0, 0.32960397423287974, 0.2023684713280799, 0.16480198711643987], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.056000000000001, 2, 31, 4.0, 5.0, 5.0, 8.0, 0.3295976733041046, 0.19303029361055135, 0.15546452754480716], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 666.6579999999999, 529, 886, 672.0, 779.9000000000001, 814.8499999999999, 843.99, 0.3294380577386317, 0.30103367676427256, 0.14509430082043254], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 240.24399999999991, 171, 317, 235.0, 281.90000000000003, 286.0, 298.98, 0.3295201264302821, 0.2917765564800792, 0.13547653635463747], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.487999999999995, 3, 42, 4.0, 5.0, 6.0, 11.990000000000009, 0.3296076679927882, 0.219752393569684, 0.15418171188334526], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 982.8280000000002, 812, 7951, 931.5, 1096.9, 1115.0, 1134.98, 0.3293712171715708, 0.24757843707922825, 0.18205479386631743], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.40399999999988, 117, 170, 135.0, 150.0, 151.0, 155.0, 0.33123814167452803, 6.404382722610249, 0.16691296982818016], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.24600000000012, 161, 268, 179.0, 203.0, 205.0, 219.99, 0.3312115918757771, 0.6419521079216539, 0.23676453637995004], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.895999999999999, 5, 16, 7.0, 8.900000000000034, 10.0, 13.980000000000018, 0.33110850491927907, 0.27022528188094797, 0.20435603037986755], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.835999999999996, 5, 20, 7.0, 9.0, 10.0, 13.990000000000009, 0.33111113612839693, 0.2754010407733564, 0.2095312658312512], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.202000000000007, 6, 17, 8.0, 10.0, 10.949999999999989, 14.990000000000009, 0.33110302336792696, 0.2679574086867527, 0.20208924766108824], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.616000000000005, 6, 23, 9.0, 11.0, 13.0, 16.0, 0.3311047774446128, 0.29608980054082656, 0.23022129056695734], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.629999999999997, 4, 31, 7.0, 9.0, 9.0, 16.0, 0.3311039004039467, 0.24855749929640422, 0.18268916379709954], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1622.5259999999992, 1417, 1979, 1591.0, 1846.9, 1927.95, 1960.99, 0.3307663658236314, 0.2764063348622457, 0.2106051469892653], "isController": false}]}, function(index, item){
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
