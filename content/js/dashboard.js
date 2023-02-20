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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8672622846202935, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.457, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.743, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.748, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.474, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.3062327164408, 1, 25019, 13.0, 1070.9000000000015, 1919.9500000000007, 10654.960000000006, 9.758379938713803, 61.470698562273654, 80.84934251591834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11290.975999999988, 9041, 25019, 10754.0, 13295.400000000001, 13743.1, 21832.520000000062, 0.20998786270153585, 0.1220144319408338, 0.10622432898378473], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.3100000000000014, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.2106914091420688, 0.10816658271491893, 0.07654023847739218], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.627999999999997, 3, 16, 4.0, 6.0, 6.0, 9.990000000000009, 0.2106902549857742, 0.12086295857787449, 0.08929645572639258], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.431999999999988, 10, 470, 14.0, 19.0, 23.0, 38.98000000000002, 0.20952017784072693, 0.1089975526733727, 2.332958073964813], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.56199999999999, 27, 90, 46.0, 55.0, 57.0, 59.0, 0.21064134813833071, 0.876035562236514, 0.0880415009796929], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6479999999999992, 1, 8, 2.0, 4.0, 4.0, 7.0, 0.21064622892695126, 0.13160616854310325, 0.08948350545236698], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.10400000000004, 25, 81, 39.0, 49.0, 51.0, 54.0, 0.210640549485363, 0.8645009048591404, 0.07693316944094312], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1168.9180000000006, 790, 1763, 1172.0, 1479.7, 1589.85, 1664.94, 0.21057676554930424, 0.8906327847598013, 0.10282068630337121], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 7.058000000000002, 4, 41, 7.0, 9.0, 10.0, 14.990000000000009, 0.2105397903360552, 0.3130771915455221, 0.1079427636000283], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.528000000000003, 3, 21, 4.0, 5.0, 6.0, 10.990000000000009, 0.20968879666309637, 0.2022575403829169, 0.11508310910611344], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.51799999999999, 6, 25, 10.0, 13.0, 14.0, 17.0, 0.21063824229969777, 0.3433156507794879, 0.13802564510068088], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.8516086368110236, 2328.3306932824803], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.110000000000002, 3, 17, 5.0, 6.0, 7.0, 14.970000000000027, 0.2096903795731375, 0.2106548734088694, 0.12347978406504093], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.106, 7, 25, 17.0, 20.0, 21.0, 23.0, 0.2106369999898894, 0.33092389179661563, 0.12568281932990472], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.907999999999993, 5, 23, 8.0, 10.0, 11.0, 14.990000000000009, 0.21063726619790046, 0.32597556847312, 0.12074616724430427], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2361.8199999999997, 1619, 3764, 2273.5, 3003.8, 3220.95, 3616.9, 0.21039768528882552, 0.321290004358388, 0.11629403307956566], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.059999999999999, 9, 79, 13.0, 17.0, 20.0, 37.0, 0.20951534909447467, 0.10899504064073984, 1.689626711740402], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.132, 10, 49, 15.0, 18.0, 19.0, 23.0, 0.2106390409351699, 0.3813122036835292, 0.17608107328174363], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.453999999999994, 6, 44, 10.0, 13.0, 14.0, 19.0, 0.21063912967281845, 0.35656843765376656, 0.15139687445233826], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.806725543478261, 3325.991847826087], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.030000000000001, 2, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.20966901230379698, 0.17629396444684495, 0.08906837925014814], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 755.4899999999998, 560, 995, 739.0, 906.7, 932.9, 962.0, 0.20962119354115177, 0.18452806277525882, 0.09744110168514478], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.897999999999997, 2, 13, 4.0, 5.0, 6.0, 10.0, 0.20968694996491935, 0.1899694144062064, 0.10279575086170852], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1015.1380000000004, 771, 1335, 980.5, 1221.9, 1250.85, 1303.97, 0.20962040260533005, 0.19830212910918874, 0.11115613145966233], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.400443412162162, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.797999999999977, 20, 649, 27.0, 32.0, 38.94999999999999, 72.92000000000007, 0.20945926415284827, 0.10896586387389043, 9.581124934491614], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.15399999999996, 25, 231, 36.0, 42.900000000000034, 47.0, 104.91000000000008, 0.2095820054566771, 47.40123176191191, 0.06508503685080402], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1114.0, 1114, 1114, 1114.0, 1114.0, 1114.0, 1114.0, 0.8976660682226212, 0.4707487096050269, 0.3699366023339317], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.428, 2, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.21066220399853716, 0.22885239157427023, 0.09072464058921377], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9499999999999975, 2, 13, 4.0, 5.0, 5.949999999999989, 8.0, 0.2106613164309928, 0.21621586286032565, 0.0779693739524866], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2439999999999998, 1, 13, 2.0, 3.0, 4.0, 7.0, 0.21069203061608036, 0.1194714345325081, 0.08209582052325787], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.62800000000004, 88, 291, 197.0, 270.0, 276.0, 283.99, 0.21067622855842685, 0.1918943604870413, 0.06912813749573381], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.99200000000008, 83, 459, 111.0, 127.0, 136.95, 297.8700000000001, 0.2095531948689643, 0.10907407506363083, 61.990091591510414], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 256.49199999999985, 16, 464, 312.0, 417.0, 429.0, 443.99, 0.21065892003598055, 0.11743123895357288, 0.08866601028858165], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 545.498, 333, 1036, 506.0, 856.8000000000004, 928.95, 999.7000000000003, 0.2106960258936988, 0.11330096489298538, 0.09012193295062507], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.817999999999998, 5, 303, 7.0, 10.0, 15.949999999999989, 36.99000000000001, 0.20943469805171278, 0.09443173284907842, 0.1523719238755137], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 548.8560000000002, 320, 1031, 502.0, 887.9000000000001, 938.95, 1014.97, 0.21063451541423386, 0.10834307188850693, 0.08515887634911407], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.482000000000004, 3, 15, 4.0, 6.0, 6.0, 11.980000000000018, 0.20966795724283283, 0.12873080214662247, 0.10524348635040631], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.837999999999998, 3, 27, 5.0, 6.0, 6.0, 11.990000000000009, 0.20966593507233056, 0.12279175578342515, 0.0993046665137503], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 908.8839999999999, 599, 1465, 922.0, 1190.5000000000005, 1321.6999999999998, 1442.96, 0.2095799849437739, 0.19150985128099476, 0.09271458318313434], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 518.2460000000005, 258, 1115, 423.0, 928.0, 982.8, 1067.99, 0.20957972140148473, 0.18557424725775415, 0.08657443569612115], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.866000000000001, 3, 43, 6.0, 7.0, 8.0, 11.990000000000009, 0.20969125897793126, 0.13986243152531938, 0.0984975542660009], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1244.294, 920, 9940, 1159.5, 1476.9, 1502.9, 1542.8400000000001, 0.20961416320977977, 0.15750129829772339, 0.1162703561554247], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.28400000000008, 143, 230, 168.5, 190.0, 191.0, 195.0, 0.2107677002714688, 4.075185251635557, 0.10661881712951253], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 229.7040000000001, 199, 284, 224.0, 258.0, 260.0, 266.98, 0.21075481838203527, 0.4084835894443449, 0.15106839520743542], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.520000000000003, 6, 17, 9.0, 12.0, 13.0, 16.99000000000001, 0.21053651018891442, 0.17188332277141838, 0.13035170650368333], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.27599999999999, 6, 34, 9.0, 11.0, 12.0, 17.99000000000001, 0.21053739670508972, 0.1750544436549292, 0.13364190220537922], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.39599999999999, 7, 41, 10.0, 12.0, 13.949999999999989, 19.980000000000018, 0.21053447123004346, 0.17038283364555595, 0.1289112436144895], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.668000000000008, 8, 35, 13.0, 15.0, 17.0, 21.99000000000001, 0.21053544637935878, 0.18828283658196546, 0.1467991296043576], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.862000000000013, 6, 38, 10.0, 12.0, 13.0, 27.910000000000082, 0.2104904216333636, 0.15801376173220985, 0.11655084869738001], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2067.774000000001, 1662, 2722, 1985.0, 2581.9, 2636.95, 2690.0, 0.21034652486506272, 0.17577697733621367, 0.1343424094353037], "isController": false}]}, function(index, item){
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
