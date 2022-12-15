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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8709636247606892, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.463, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.812, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.838, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.846, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.489, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 485.5237609019387, 1, 24654, 12.0, 1019.9000000000015, 1833.0, 10434.0, 10.165775007893018, 64.12657924563288, 84.22465928921748], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10973.569999999996, 9065, 24654, 10544.0, 12544.2, 13102.1, 22093.190000000068, 0.21878745367722638, 0.12711508326722307, 0.1106756845750032], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9960000000000018, 2, 12, 3.0, 4.0, 4.949999999999989, 7.990000000000009, 0.2195705901881808, 0.11272505367952003, 0.07976587846680004], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.451999999999994, 2, 16, 4.0, 6.0, 6.0, 10.0, 0.21956914386038565, 0.12595635399069116, 0.09305957855020251], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.76600000000001, 10, 457, 14.0, 21.0, 25.0, 40.99000000000001, 0.2183588238145627, 0.12830926550533253, 2.431374325325824], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.28799999999996, 27, 105, 46.0, 56.0, 58.0, 62.98000000000002, 0.2195050424698356, 0.9128987494303845, 0.09174624821981411], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7880000000000016, 1, 21, 3.0, 4.0, 5.0, 9.0, 0.21951063177793953, 0.13714441198370003, 0.09324914533535518], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.16600000000002, 24, 95, 41.0, 49.0, 51.0, 65.98000000000002, 0.21950340427829695, 0.9008878439398841, 0.0801701886719561], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1114.8600000000015, 782, 1751, 1102.5, 1445.7, 1525.95, 1626.5500000000004, 0.21943471861008293, 0.9280974280276066, 0.10714585869632956], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.742, 4, 26, 6.0, 8.0, 9.0, 17.980000000000018, 0.21938118709792914, 0.3262245384823122, 0.11247570627579374], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.183999999999997, 2, 16, 4.0, 5.0, 6.0, 11.0, 0.21852946279776278, 0.21078489814451, 0.11993511532455339], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.327999999999992, 7, 30, 10.0, 12.0, 14.0, 20.0, 0.21950292246190964, 0.35776404061418676, 0.1438344345429115], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.7630375803858521, 1901.594842745177], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.627999999999998, 3, 27, 4.0, 6.0, 7.0, 11.990000000000009, 0.2185305134155882, 0.2195356684138181, 0.12868544881796845], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.803999999999995, 7, 32, 17.0, 20.0, 20.0, 24.0, 0.21950157338727805, 0.34483825793344536, 0.13097213021447937], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.6099999999999985, 5, 16, 8.0, 9.0, 10.0, 14.990000000000009, 0.21950166974920177, 0.33969383893384525, 0.125827617326935], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2195.0939999999987, 1590, 3391, 2127.5, 2764.6000000000004, 3001.0499999999997, 3288.92, 0.2192296882597679, 0.3347770076451969, 0.12117578472170763], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.873999999999988, 10, 69, 12.0, 17.0, 23.0, 33.99000000000001, 0.21835338836420995, 0.12830607159436402, 1.7609006651480916], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.712000000000005, 10, 34, 15.0, 17.0, 19.94999999999999, 26.0, 0.21950456064625656, 0.397361131948801, 0.1834920936652301], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.108000000000004, 6, 28, 10.0, 12.0, 13.0, 19.99000000000001, 0.21950378973292972, 0.37157447187388193, 0.15776834887054325], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.153521825396826, 2164.8375496031745], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.7055221408647141, 2667.2877440725247], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7499999999999973, 2, 21, 3.0, 3.0, 4.0, 9.980000000000018, 0.21851656967444527, 0.1837331704000951, 0.0928268630941247], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 697.6040000000002, 544, 1037, 673.5, 839.9000000000001, 858.95, 919.8700000000001, 0.2184645351227618, 0.1923127941898046, 0.1015518737484713], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.560000000000001, 2, 12, 3.0, 4.0, 5.0, 9.990000000000009, 0.2185290807574218, 0.1979800913178396, 0.10713046732443919], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 959.1660000000007, 743, 1375, 927.5, 1156.0, 1177.9, 1221.99, 0.21845775813405616, 0.2066623192207437, 0.11584234635428955], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 8.18452380952381, 1045.2163938492063], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.369999999999994, 20, 603, 27.0, 34.0, 38.94999999999999, 68.99000000000001, 0.21829676134924864, 0.12827279714009412, 9.985371388280083], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.65999999999999, 25, 246, 34.0, 44.0, 48.94999999999999, 111.92000000000007, 0.21842616955200356, 49.42882256308475, 0.06783156437259485], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1020.0, 1020, 1020, 1020.0, 1020.0, 1020.0, 1020.0, 0.9803921568627451, 0.5141314338235294, 0.4040287990196078], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.939999999999999, 2, 8, 3.0, 4.0, 4.0, 7.0, 0.2195367511107462, 0.2384932350298987, 0.09454658910140534], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7919999999999967, 2, 16, 4.0, 5.0, 5.0, 8.0, 0.21953588357924278, 0.225311992734899, 0.08125400378567676], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.067999999999996, 1, 16, 2.0, 3.0, 3.0, 7.980000000000018, 0.21957145799400393, 0.12451888805829886, 0.08555567552696051], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 205.98, 88, 399, 220.0, 304.0, 314.0, 336.97, 0.21955313910491697, 0.19997989099076866, 0.07204087376880088], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.85600000000008, 84, 361, 111.0, 131.0, 140.95, 255.85000000000014, 0.21839392235921345, 0.12839173951195948, 64.60535836040327], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 273.8879999999999, 17, 567, 339.5, 447.0, 469.95, 528.98, 0.21953289546765556, 0.1223655778127762, 0.09240105268218705], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 509.504, 305, 1042, 468.0, 869.8000000000004, 908.6999999999999, 1001.5600000000004, 0.21956663693734402, 0.11808353772242648, 0.09391619822124675], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.019999999999994, 5, 275, 7.0, 10.0, 12.0, 27.980000000000018, 0.21827236549620294, 0.10267966912419524, 0.15880167216276483], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 512.2420000000005, 279, 1042, 454.5, 885.9000000000001, 907.95, 977.94, 0.21950976445285214, 0.11290819144039235, 0.08874711180027421], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8819999999999957, 2, 15, 4.0, 5.0, 6.0, 10.0, 0.21851542369266594, 0.13416292190411716, 0.10968449978323269], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.348, 3, 27, 4.0, 5.0, 6.0, 11.0, 0.2185130362692308, 0.12797309861427772, 0.10349494393611028], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 856.6340000000005, 577, 1508, 862.5, 1101.9, 1245.95, 1308.92, 0.21842683749392772, 0.19959392198383116, 0.0966282786960442], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.0019999999996, 243, 1065, 385.0, 856.7, 885.95, 946.96, 0.21842540619480663, 0.19340673833095032, 0.09022846369180001], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.540000000000003, 3, 46, 5.0, 7.0, 8.0, 12.980000000000018, 0.21853108648411454, 0.14575852741079123, 0.10264985605357334], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1186.2520000000002, 903, 9275, 1115.0, 1406.9, 1432.9, 1611.7500000000002, 0.21844649589975926, 0.16413779577655546, 0.12116954069439773], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.45200000000006, 144, 264, 180.0, 189.0, 191.0, 217.98000000000002, 0.21964013282078113, 4.246733388397114, 0.11110702031363733], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.68800000000005, 195, 387, 238.5, 259.0, 264.95, 302.96000000000004, 0.21962209187407045, 0.4256700800423695, 0.1574244291362966], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.170000000000003, 6, 26, 9.0, 11.0, 12.0, 18.99000000000001, 0.2193789732274289, 0.1791023648614556, 0.13582643459588858], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.950000000000001, 6, 34, 9.0, 11.0, 12.0, 19.99000000000001, 0.21937993577433001, 0.18240670402048834, 0.13925484204425245], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.965999999999989, 6, 26, 10.0, 12.0, 13.0, 20.980000000000018, 0.2193764706450151, 0.1775385497931938, 0.13432524130314888], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.181999999999997, 8, 31, 12.0, 14.0, 16.0, 23.970000000000027, 0.21937752942291425, 0.19617792721470392, 0.1529644101640242], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.351999999999997, 6, 34, 9.0, 11.0, 12.0, 27.950000000000045, 0.21933441655290523, 0.16465288998865604, 0.12144786541552467], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1997.713999999999, 1587, 3092, 1936.0, 2423.9, 2567.0, 2647.95, 0.21918144497559414, 0.18315991628912662, 0.13998502442777203], "isController": false}]}, function(index, item){
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
