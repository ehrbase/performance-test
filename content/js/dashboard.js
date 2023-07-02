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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.887747287811104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.161, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.553, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.902, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.98, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.131, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 326.31286960221325, 1, 17640, 10.0, 848.0, 1511.9500000000007, 6010.94000000001, 15.19308893822899, 95.70519416353982, 125.72410750500134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6157.062000000001, 5198, 17640, 5996.0, 6507.000000000001, 6744.099999999999, 14870.830000000069, 0.3276567886882391, 0.19029371953201435, 0.165108303674933], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3859999999999983, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.3287749778570052, 0.16878934922774044, 0.11879564629598822], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.822000000000005, 2, 21, 4.0, 5.0, 5.0, 8.0, 0.3287723836458096, 0.18869415780515503, 0.13870084935057592], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 14.262000000000004, 8, 392, 12.0, 17.0, 27.699999999999932, 40.0, 0.3267745327614343, 0.16999615365951531, 3.5954772076397274], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.59799999999993, 24, 50, 35.0, 40.0, 42.0, 47.99000000000001, 0.32870732557145765, 1.367059740707444, 0.13674738348968846], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6120000000000014, 1, 34, 2.0, 3.0, 4.0, 8.0, 0.32871532135538534, 0.2053539826408726, 0.13899778725281428], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.383999999999983, 22, 54, 30.0, 36.0, 37.0, 40.0, 0.32870667728170094, 1.3490808981236107, 0.11941297260624292], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 867.9800000000002, 668, 1123, 869.5, 1013.9000000000001, 1057.0, 1082.96, 0.3285604452651154, 1.3895507870254766, 0.1597881852949487], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.786000000000004, 3, 24, 5.0, 8.0, 9.0, 12.990000000000009, 0.3286833405534107, 0.48875918895906645, 0.16787244834905646], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9819999999999927, 2, 14, 4.0, 5.0, 5.949999999999989, 8.990000000000009, 0.3269510312362476, 0.3153640654905802, 0.17880134520732294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.9700000000000095, 5, 18, 8.0, 10.0, 11.0, 15.990000000000009, 0.32870408414824553, 0.535656047127948, 0.21474905497575808], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.9323646282327586, 2549.116463496767], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.182000000000001, 2, 21, 4.0, 5.0, 6.0, 10.0, 0.32695316918976425, 0.3284570260519555, 0.1918934127764144], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.234, 5, 26, 8.0, 10.0, 11.949999999999989, 15.990000000000009, 0.32870149105570373, 0.5163919684338097, 0.19548750786418317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.701999999999996, 4, 22, 6.0, 8.0, 9.0, 12.0, 0.3287006267006149, 0.5086866895886049, 0.18778307287095672], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1578.0200000000007, 1319, 1946, 1557.0, 1766.8000000000002, 1853.95, 1910.98, 0.3283748727547368, 0.5014483127688569, 0.18086272288444488], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.197999999999995, 8, 75, 11.0, 16.0, 33.89999999999998, 68.96000000000004, 0.32676278720815183, 0.16999004333364703, 2.6345249718657238], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.405999999999986, 8, 24, 11.0, 14.0, 15.0, 18.0, 0.3287084060600681, 0.5950488861304775, 0.2741376745852522], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.16199999999999, 5, 26, 8.0, 10.0, 11.0, 15.990000000000009, 0.3287060289945014, 0.5565243452422431, 0.235615454376918], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.132408405172413, 2351.4278017241377], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 1.0377342002237135, 4278.396777125279], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4519999999999986, 1, 25, 2.0, 3.0, 4.0, 7.990000000000009, 0.3269818204647458, 0.2748403541916127, 0.13826477369261225], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 583.3560000000002, 456, 731, 573.0, 678.9000000000001, 690.95, 718.96, 0.32687023709205776, 0.28783414207839786, 0.15130516834144078], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.372, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.326988877146355, 0.2962410656420361, 0.15966253766911864], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 786.4279999999999, 619, 971, 776.5, 906.0, 920.95, 951.9200000000001, 0.3268091336616676, 0.3091633553412051, 0.17265990362398648], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.046000000000006, 16, 630, 22.0, 31.0, 44.94999999999999, 54.99000000000001, 0.3266304411732043, 0.16992119366931413, 14.899324128125365], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.232000000000017, 21, 268, 29.0, 35.0, 38.94999999999999, 159.60000000000036, 0.32689524053605584, 73.93409766922876, 0.10087782813417351], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 1.1425142973856208, 0.8935866013071895], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6839999999999975, 1, 19, 2.0, 4.0, 4.0, 6.990000000000009, 0.32872958507094313, 0.3572077115276261, 0.14092996859975002], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3460000000000023, 2, 9, 3.0, 4.0, 5.0, 6.990000000000009, 0.32872807219394434, 0.33730261009267504, 0.12102586251671583], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.848000000000001, 1, 11, 2.0, 3.0, 3.0, 7.0, 0.3287758426031682, 0.1864486519121932, 0.12746485304048613], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.17000000000007, 64, 128, 91.0, 110.0, 113.0, 117.0, 0.3287591970385372, 0.29945018620099023, 0.10723200372155411], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 86.70999999999997, 59, 355, 83.5, 100.0, 110.0, 313.6600000000003, 0.32684075076627817, 0.17003060189521876, 96.64463957472789], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.83999999999983, 13, 358, 263.0, 335.0, 339.0, 348.99, 0.3287241820027455, 0.18320915811600283, 0.1377174551554471], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 440.7339999999999, 334, 579, 430.0, 525.0, 539.0, 554.0, 0.3286567666484371, 0.17675250777437582, 0.13993588892452988], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.361999999999997, 4, 285, 6.0, 8.0, 11.0, 28.980000000000018, 0.3265749731228797, 0.14724895589898906, 0.236958208037402], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 411.4820000000003, 298, 522, 408.0, 482.0, 497.95, 516.0, 0.3286500698381398, 0.16904617019965493, 0.13223030153643908], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.613999999999998, 2, 23, 3.0, 5.0, 6.0, 9.990000000000009, 0.32697754383624444, 0.20075590975125512, 0.16348877191812222], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.228000000000007, 2, 36, 4.0, 5.0, 6.0, 9.990000000000009, 0.3269702738245255, 0.1914915458157287, 0.15422523657934162], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 676.1660000000004, 539, 869, 682.0, 789.9000000000001, 828.0, 849.0, 0.32681575565685395, 0.29863747141179176, 0.14393936113402453], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 248.6080000000002, 171, 332, 242.5, 299.80000000000007, 306.0, 324.97, 0.3269054994658364, 0.28946141154362165, 0.1344015774171066], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.6579999999999995, 3, 46, 4.0, 6.0, 7.0, 11.0, 0.32695466577386245, 0.21798361315475942, 0.15294070791570324], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 979.6039999999989, 813, 8665, 923.0, 1092.9, 1112.95, 1210.93, 0.32678713347555105, 0.24563605908932268, 0.1806264819796503], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.55400000000003, 118, 170, 135.0, 152.0, 155.0, 164.0, 0.328754657631612, 6.356365358982004, 0.16566152669717948], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.834, 160, 271, 178.0, 205.0, 209.0, 218.96000000000004, 0.32872677545331425, 0.6371360532323704, 0.2349882808904551], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.186000000000007, 5, 31, 7.0, 9.0, 10.0, 13.990000000000009, 0.3286792353606268, 0.26824269900706005, 0.2028567155741369], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.1460000000000035, 5, 24, 7.0, 9.0, 10.0, 15.0, 0.32868074778814294, 0.27337957001820234, 0.2079932857096842], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.112000000000002, 6, 16, 8.0, 10.0, 11.0, 14.0, 0.3286746981615909, 0.2659921963998946, 0.20060711557714292], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.787999999999991, 7, 20, 9.0, 12.0, 14.0, 18.0, 0.3286766426601247, 0.2939184457522488, 0.22853297809961795], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.691999999999991, 5, 32, 7.0, 9.0, 11.0, 19.950000000000045, 0.328646397509649, 0.24671266819301008, 0.18133321737592942], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1609.0079999999996, 1420, 1968, 1590.0, 1801.0, 1861.9, 1938.97, 0.3283362741318953, 0.27437561829824625, 0.20905786204491772], "isController": false}]}, function(index, item){
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
