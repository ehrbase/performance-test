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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8716017868538609, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.819, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.837, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.492, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 483.92886619868193, 1, 25044, 12.0, 1019.9000000000015, 1844.9000000000015, 10340.990000000002, 10.227378044880373, 64.51518880061312, 84.73504780336545], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10950.790000000005, 8931, 25044, 10459.5, 12468.900000000001, 12979.15, 23358.72000000008, 0.22019253635378774, 0.12793143355800313, 0.11138645881959186], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9759999999999995, 2, 22, 3.0, 4.0, 4.949999999999989, 7.990000000000009, 0.2209770899792193, 0.11344713473923378, 0.08027683346901326], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.481999999999999, 2, 21, 4.0, 5.0, 6.0, 12.0, 0.220975429741967, 0.12676307318264282, 0.0936556020586071], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.285999999999987, 10, 390, 14.0, 20.0, 24.0, 33.98000000000002, 0.2196649318994778, 0.1290767443097996, 2.4459175327322717], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.122, 25, 94, 43.5, 53.0, 55.0, 63.99000000000001, 0.22090045209486525, 0.9187021136141832, 0.0923294858365257], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6620000000000004, 1, 14, 2.0, 4.0, 4.0, 8.0, 0.22090572229764927, 0.13801602748332273, 0.09384178632761467], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.94799999999999, 22, 75, 38.0, 46.0, 48.0, 55.99000000000001, 0.22089918337989886, 0.9066164130688816, 0.08067997517976776], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1098.857999999999, 759, 1681, 1092.0, 1356.3000000000002, 1502.95, 1562.99, 0.2208295240240439, 0.9339967466290373, 0.10782691602736519], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.589999999999997, 4, 24, 6.0, 8.0, 9.0, 15.0, 0.22079656334565081, 0.32832923337114844, 0.11320136304342451], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.223999999999991, 2, 16, 4.0, 5.0, 6.0, 11.0, 0.21982544101379978, 0.21203494760130873, 0.12064638461890181], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.131999999999993, 6, 32, 10.0, 12.0, 14.0, 19.0, 0.22089762190456164, 0.3600372372643685, 0.1447483440409774], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.9549484406438632, 2379.863163355131], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.546000000000001, 3, 16, 4.0, 6.0, 7.0, 13.0, 0.21982660077730687, 0.22083771727111653, 0.129448672137418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.569999999999995, 7, 28, 16.5, 19.0, 20.0, 22.0, 0.2208966459936859, 0.34702992517236564, 0.13180454170131062], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.706000000000001, 5, 28, 7.0, 9.0, 10.949999999999989, 16.0, 0.2208966459936859, 0.34185266003188863, 0.1266272765608336], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2213.8219999999974, 1472, 3539, 2149.5, 2862.8, 3191.8, 3326.9, 0.22063804108721602, 0.3369276476840728, 0.12195422974156665], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.247999999999992, 9, 80, 12.5, 18.0, 22.94999999999999, 44.97000000000003, 0.21966029973965862, 0.1290740224183105, 1.7714401906739263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.390000000000008, 9, 26, 14.0, 17.0, 19.0, 24.980000000000018, 0.2208995737521825, 0.39988647349624823, 0.18465823743346504], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.97799999999999, 6, 28, 10.0, 12.0, 13.0, 17.99000000000001, 0.22089869541648463, 0.37393575840707294, 0.1587709373305983], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 7.234815140845071, 1920.9121919014087], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.8306393678160919, 3140.304289819376], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.732, 1, 24, 3.0, 3.0, 4.0, 8.0, 0.21979934956976474, 0.18481175779254633, 0.09337179400668717], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 687.4439999999996, 537, 981, 664.0, 834.9000000000001, 854.95, 912.94, 0.2197484407749385, 0.19344300730795413, 0.1021486892664753], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5679999999999996, 2, 13, 3.0, 4.0, 5.0, 9.0, 0.2198224450147127, 0.1991518363912101, 0.10776451894275955], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 945.1720000000008, 735, 1317, 913.0, 1143.0, 1173.95, 1263.6000000000004, 0.2197474749916386, 0.20788239892495142, 0.1165262489457615], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.729166666666667, 731.6514756944445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.568, 19, 549, 27.0, 33.900000000000034, 38.0, 83.93000000000006, 0.21960839431126417, 0.12904352240335035, 10.045368349159778], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.98400000000004, 25, 242, 35.0, 45.0, 52.0, 123.83000000000015, 0.21972507120190932, 49.72275794322612, 0.06823493422090544], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 0.5254649924849699, 0.412935245490982], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.9819999999999993, 2, 20, 3.0, 4.0, 4.0, 8.0, 0.22094877170158836, 0.24002718028933684, 0.09515469562539108], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.730000000000005, 2, 12, 4.0, 5.0, 5.0, 8.0, 0.22094789297460823, 0.22676115286964915, 0.08177661273181301], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0899999999999994, 1, 25, 2.0, 3.0, 3.9499999999999886, 7.0, 0.22097816426367645, 0.1253166306343355, 0.08610379642695987], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 188.71799999999996, 88, 350, 187.5, 266.0, 271.95, 295.94000000000005, 0.22096166050036326, 0.20126284215360726, 0.0725030448516817], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.07999999999984, 82, 399, 110.0, 130.90000000000003, 145.95, 358.60000000000036, 0.21969282549139793, 0.12915535248615384, 64.9896002908733], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.56999999999982, 17, 594, 304.0, 414.0, 428.95, 466.94000000000005, 0.22094554973683175, 0.12316549255280929, 0.09299563665681101], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 497.31, 282, 1077, 466.0, 783.8000000000001, 879.0, 958.8000000000002, 0.22096488293501465, 0.11883551824330267, 0.09451427609915668], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.192000000000007, 5, 249, 7.0, 11.0, 13.0, 29.99000000000001, 0.21958775473277486, 0.10329845442609861, 0.15975866921476295], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 505.99400000000065, 302, 1022, 460.0, 869.7, 920.9, 968.96, 0.22091977740123228, 0.11363345308105768, 0.08931717562901384], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8559999999999994, 2, 14, 4.0, 5.0, 6.0, 12.0, 0.21979828671631468, 0.13495056722794357, 0.11032843688690015], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.377999999999999, 2, 26, 4.0, 5.0, 6.0, 12.980000000000018, 0.21979616104025126, 0.12872456614985262, 0.10410267393019713], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 861.4119999999994, 563, 1379, 848.5, 1137.8000000000002, 1244.75, 1315.93, 0.21970759555522745, 0.20076425218455263, 0.09719486404933403], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 465.78800000000007, 244, 978, 382.0, 848.8000000000001, 883.0, 941.97, 0.2197225607170338, 0.194555315456779, 0.09076429998369658], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.443999999999995, 3, 37, 5.0, 6.0, 7.0, 13.990000000000009, 0.2198275672562442, 0.14662326995704567, 0.10325884751001313], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1198.3020000000006, 884, 10646, 1132.5, 1419.0, 1444.95, 1541.99, 0.21974187361590086, 0.16511112538822895, 0.12188807052132002], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.64400000000006, 144, 298, 164.0, 188.0, 191.0, 234.8900000000001, 0.22104068607492305, 4.273813030856838, 0.11181550330743179], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 228.17999999999975, 194, 344, 221.0, 256.0, 259.0, 295.9200000000001, 0.22102085110709344, 0.42838114589917914, 0.15842705538340487], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.033999999999997, 6, 24, 9.0, 11.0, 12.0, 17.980000000000018, 0.22079422331657653, 0.1802577838795488, 0.13670267342061476], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.815999999999992, 6, 34, 9.0, 11.0, 12.0, 18.99000000000001, 0.2207952958237453, 0.1835835261428254, 0.14015326395061956], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.891999999999994, 6, 23, 10.0, 12.0, 13.0, 20.0, 0.22079198083525606, 0.1786841039433448, 0.13519196482783746], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.982000000000003, 8, 31, 12.0, 14.0, 16.0, 23.0, 0.22079295582153746, 0.19744366950716805, 0.1539513383365017], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.377999999999995, 6, 30, 9.0, 11.0, 12.0, 21.99000000000001, 0.22077394514209012, 0.16573353454118758, 0.12224494814020027], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2022.3960000000013, 1631, 2970, 1981.0, 2512.0, 2578.8, 2691.8500000000004, 0.22061769424505506, 0.18436012416253522, 0.14090231644166604], "isController": false}]}, function(index, item){
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
