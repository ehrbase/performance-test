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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.867283556690066, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.457, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.736, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.762, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.468, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 505.12184641565324, 1, 23910, 13.0, 1052.9000000000015, 1880.9500000000007, 10745.980000000003, 9.780033503012024, 61.69328880177842, 81.02874488061744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11414.261999999997, 9112, 23910, 10848.0, 13328.8, 13923.85, 22873.24000000007, 0.21053686479448863, 0.12232150724078386, 0.10650204683939954], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2039999999999997, 1, 11, 3.0, 4.0, 5.0, 8.0, 0.211267129538863, 0.10846215104480046, 0.07674938690279008], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.697999999999994, 3, 23, 4.0, 6.0, 6.0, 10.0, 0.21126587979985514, 0.12119316710159268, 0.08954042171204799], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.499999999999996, 10, 463, 14.0, 20.0, 24.0, 42.0, 0.21002340920919044, 0.12341131401881054, 2.3385614373078023], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.118, 26, 63, 43.0, 53.0, 54.0, 56.0, 0.21120626657441177, 0.8783849995342903, 0.08827761923227367], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.680000000000003, 1, 9, 2.0, 4.0, 4.0, 7.0, 0.21121072747733285, 0.13195885224288895, 0.08972330708265605], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.89599999999995, 23, 52, 38.0, 46.0, 48.0, 50.0, 0.21120528520105686, 0.8668306290696619, 0.07713943033710477], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1170.4620000000007, 812, 1725, 1182.5, 1453.8000000000002, 1586.85, 1669.96, 0.21113634425020839, 0.892999518503567, 0.10309391809092207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.729999999999999, 4, 19, 7.0, 8.0, 9.0, 14.0, 0.2111082634952013, 0.31392252334646287, 0.10823421712400458], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.4339999999999975, 2, 25, 4.0, 5.0, 6.0, 11.990000000000009, 0.2101819713471529, 0.2027332372258754, 0.11535377724326167], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.072, 6, 28, 10.0, 12.0, 14.0, 16.980000000000018, 0.21120457148070879, 0.34423870097783493, 0.13839674556987852], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.8355798855633804, 2082.3802679357395], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.817999999999998, 3, 14, 5.0, 6.0, 7.0, 11.990000000000009, 0.2101833850034155, 0.21115014647154642, 0.12377009878619095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.714000000000016, 7, 24, 16.0, 20.0, 21.0, 23.0, 0.21120376855108303, 0.33180235791583274, 0.12602099861788255], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.847999999999999, 5, 16, 8.0, 10.0, 11.0, 14.990000000000009, 0.21120394697936115, 0.3268525457203744, 0.121071012575083], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2346.9559999999988, 1660, 3789, 2300.0, 2993.0000000000005, 3259.5, 3603.88, 0.21096013865987995, 0.3221489047107821, 0.11660492039208208], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.155999999999997, 9, 74, 13.0, 18.0, 22.0, 38.97000000000003, 0.21001793973241195, 0.12340810011366173, 1.6936798303811114], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.688000000000002, 10, 32, 14.5, 18.0, 19.0, 24.0, 0.21120564206303982, 0.3823379011217554, 0.17655471641207235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.996000000000006, 6, 21, 10.0, 12.0, 13.0, 16.99000000000001, 0.21120537441643955, 0.35752697277436, 0.15180386286181594], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 7.553998161764706, 2005.6583180147056], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.7406433016105417, 2800.0663433382138], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.872, 2, 15, 3.0, 4.0, 4.0, 7.0, 0.2101677474893361, 0.17671331112140465, 0.08928024429478632], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 736.762, 564, 960, 720.0, 883.9000000000001, 901.95, 945.98, 0.21011890628906899, 0.18496619580770757, 0.09767246034530941], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7920000000000016, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.21018232475943582, 0.19041820752204705, 0.10303860061448904], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 979.4360000000003, 776, 1311, 916.5, 1195.9, 1221.95, 1255.92, 0.21011369672357105, 0.19876878823543995, 0.1114177122274405], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.695895522388059, 982.8154151119402], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.377999999999993, 19, 697, 27.0, 33.0, 38.0, 70.98000000000002, 0.20995744162658228, 0.12337255097766683, 9.603912661903433], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.238000000000035, 26, 241, 36.0, 43.0, 49.0, 107.93000000000006, 0.21008844723628647, 47.5420349232652, 0.06524231076283116], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1074.0, 1074, 1074, 1074.0, 1074.0, 1074.0, 1074.0, 0.931098696461825, 0.48828124999999994, 0.38371450186219735], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.055999999999999, 2, 11, 3.0, 4.0, 5.0, 6.990000000000009, 0.2112386570122151, 0.2294786199546175, 0.09097289818592466], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.884, 2, 12, 4.0, 5.0, 6.0, 8.0, 0.21123785382340515, 0.21679563727820025, 0.07818276035065484], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.276, 1, 11, 2.0, 3.0, 4.0, 9.0, 0.2112674866098667, 0.11980970913009344, 0.08232004605208673], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 197.45399999999978, 93, 294, 197.0, 275.0, 280.95, 288.99, 0.21125061632367312, 0.19241754135864567, 0.06931660848120524], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.36799999999991, 82, 388, 110.0, 130.0, 141.0, 247.96000000000004, 0.2100569380336234, 0.12349050458617314, 62.13910905189962], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 255.106, 18, 461, 311.0, 413.0, 426.95, 444.97, 0.21123580125752897, 0.11774085528530985, 0.08890881869335447], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 534.2039999999996, 316, 974, 508.0, 819.3000000000002, 916.95, 963.96, 0.21126927198299028, 0.11362119216186775, 0.09036713000834935], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.383999999999999, 5, 286, 7.0, 10.0, 13.0, 30.0, 0.20993399255406114, 0.09875713237618827, 0.15273518012966364], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 540.778, 301, 1050, 495.0, 887.9000000000001, 940.95, 1004.98, 0.21121260111275247, 0.1086404190743143, 0.08539259459050735], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.070000000000002, 2, 13, 4.0, 5.0, 6.0, 11.0, 0.21016668740311314, 0.12903700980196414, 0.10549382551289078], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.657999999999999, 3, 28, 4.0, 6.0, 6.949999999999989, 11.970000000000027, 0.21016456726274943, 0.12308378186830414, 0.09954083508050143], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 893.3639999999999, 616, 1490, 897.5, 1197.3000000000002, 1315.75, 1426.8600000000001, 0.2100839453428801, 0.1919703598601429, 0.09293752660187957], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 507.64399999999966, 263, 1096, 416.5, 928.7, 979.95, 1022.94, 0.21008659349210557, 0.18602306170432328, 0.08678381742886783], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.611999999999999, 3, 40, 5.0, 7.0, 8.0, 11.0, 0.21018409183867784, 0.1401911471931806, 0.09872905095156644], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1242.0720000000015, 935, 11088, 1144.5, 1485.9, 1505.0, 1576.8500000000001, 0.2101051324061534, 0.1578702060311939, 0.11654269063153821], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.30800000000008, 145, 206, 171.5, 190.0, 192.95, 197.0, 0.21132936738553873, 4.086045063345978, 0.10690294170479402], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.9519999999999, 195, 342, 231.5, 259.0, 261.0, 268.98, 0.21131150485488182, 0.40956255546927, 0.1514674263315266], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.915999999999999, 6, 20, 9.0, 11.0, 12.0, 16.0, 0.21110683737047012, 0.17234894144698537, 0.13070481923132624], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.919999999999995, 6, 23, 9.0, 11.0, 12.0, 17.0, 0.2111075504304272, 0.1755285064330804, 0.13400381619118915], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.975999999999983, 7, 21, 10.0, 12.0, 13.0, 17.0, 0.21110541126500695, 0.17084488805607803, 0.12926083287417905], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.17800000000001, 8, 22, 12.0, 15.0, 16.0, 20.99000000000001, 0.21110603518377624, 0.18878115964661693, 0.14719698156368774], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.187999999999994, 6, 38, 9.0, 11.0, 12.0, 16.99000000000001, 0.21108758657229645, 0.15846204948631837, 0.11688150545555867], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2059.7800000000007, 1644, 2760, 1981.0, 2581.7000000000003, 2657.0, 2726.98, 0.21094402937690931, 0.17627628454894048, 0.13472401876220574], "isController": false}]}, function(index, item){
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
