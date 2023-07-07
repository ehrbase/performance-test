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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.888130185067007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.158, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.572, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.911, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.987, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.118, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.8527972771762, 1, 15815, 10.0, 847.0, 1510.9500000000007, 6041.990000000002, 15.173541939140573, 95.58206256398968, 125.56235441945144], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6166.837999999998, 5327, 15815, 6032.5, 6535.5, 6750.799999999999, 13412.680000000055, 0.3273348137595844, 0.19010672567476797, 0.16494605849604055], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.498000000000002, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.32845554945358135, 0.1686253583039475, 0.11868022782990732], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.73, 2, 15, 4.0, 5.0, 5.0, 8.0, 0.32845274451828793, 0.18851070554769825, 0.1385660015936527], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.859999999999998, 8, 354, 12.0, 16.0, 18.0, 70.92000000000007, 0.3263307113748443, 0.16976526685204427, 3.5905938721292685], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.16200000000003, 24, 69, 34.0, 41.0, 42.0, 46.99000000000001, 0.3283686187305401, 1.3656510940175177, 0.13660647615157231], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.410000000000002, 1, 12, 2.0, 3.0, 4.0, 5.0, 0.3283796173457995, 0.20514426270730607, 0.13885583428782342], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.35999999999999, 22, 64, 30.0, 36.0, 37.0, 55.930000000000064, 0.3283714222291691, 1.3477049413249524, 0.11929118073169034], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.3739999999997, 687, 1125, 861.5, 1006.8000000000001, 1063.0, 1094.91, 0.32822591921309807, 1.3881360064407773, 0.15962549586730745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.904000000000002, 3, 14, 5.0, 8.0, 9.0, 13.0, 0.32830113355815393, 0.48819083894564125, 0.1676772391122212], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.0580000000000025, 2, 28, 4.0, 5.0, 6.0, 11.990000000000009, 0.32655449737384873, 0.3149815845714103, 0.17858449075132354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.301999999999992, 5, 25, 8.0, 10.0, 12.0, 16.99000000000001, 0.3283746570947643, 0.5351192129302775, 0.21453383359023176], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.9613715277777778, 2628.422309027778], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.347999999999995, 3, 20, 4.0, 5.0, 6.0, 14.950000000000045, 0.32655982935289557, 0.32806187700548556, 0.19166255609481467], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.476000000000004, 5, 23, 8.0, 10.0, 12.0, 17.99000000000001, 0.3283731474828885, 0.5158761387570289, 0.1952922332198038], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.657999999999994, 5, 16, 6.0, 8.0, 8.0, 12.0, 0.32837185354089937, 0.5081778906492175, 0.1875952483607677], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1570.1120000000003, 1302, 2020, 1551.0, 1738.8000000000002, 1801.8, 1906.93, 0.3280232922779381, 0.500911428093686, 0.1806690789499581], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.947999999999995, 8, 55, 11.0, 14.0, 17.94999999999999, 36.99000000000001, 0.3263215533428054, 0.16976050261840414, 2.630967523826368], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.654000000000007, 8, 43, 11.0, 14.0, 15.0, 21.0, 0.3283809113489756, 0.5944560343522555, 0.2738645491133059], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.433999999999997, 5, 43, 8.0, 10.0, 11.0, 20.980000000000018, 0.32837810768831666, 0.5559691494924917, 0.23538040140939884], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.835937499999999, 1976.5624999999998], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.8342935026978416, 3439.6463298111507], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4420000000000015, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.3265421278529986, 0.2744707762347211, 0.13807884898471523], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 573.1039999999998, 439, 730, 564.5, 668.0, 680.95, 717.94, 0.32644725493767796, 0.28746167407212264, 0.15110937386763607], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3520000000000008, 2, 15, 3.0, 4.0, 5.0, 8.0, 0.3265606824857015, 0.29585313549688497, 0.15945345824497145], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 776.3319999999998, 609, 951, 753.0, 897.0, 919.0, 941.9200000000001, 0.32641017355228924, 0.3087859367400763, 0.1724491248943247], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.776009908536585, 803.0082888719512], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.67600000000001, 16, 529, 22.0, 26.0, 32.0, 69.90000000000009, 0.32621063290082153, 0.1697027990748014, 14.88017447538806], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.073999999999995, 21, 252, 29.0, 37.0, 43.94999999999999, 87.0, 0.32645087828344294, 73.83359598516836, 0.10074070072028121], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 1.1500308388157894, 0.8994654605263157], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.922000000000001, 1, 24, 3.0, 4.0, 5.0, 6.990000000000009, 0.3284171475788431, 0.3568682073070845, 0.1407960232296017], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5600000000000036, 2, 18, 3.0, 4.0, 5.0, 10.0, 0.3284149904365555, 0.3369813619156184, 0.12091059706502091], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9479999999999982, 1, 27, 2.0, 3.0, 3.0, 7.0, 0.3284568440552596, 0.186267747960283, 0.12734117879876763], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.53199999999994, 67, 125, 91.0, 112.0, 115.0, 119.0, 0.32844346699668664, 0.29916260361570274, 0.1071290214618099], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.01800000000001, 59, 334, 81.0, 95.0, 107.0, 308.9200000000001, 0.3263929144014998, 0.16979762639728807, 96.51221733557631], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 212.06600000000003, 12, 352, 261.5, 332.0, 335.0, 341.0, 0.32841067623699166, 0.1830344306984507, 0.1375861133844428], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 438.1619999999999, 327, 563, 427.5, 519.0, 530.95, 550.98, 0.32835611139678095, 0.17659081455793088, 0.13980787555566063], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.370000000000006, 4, 291, 6.0, 8.0, 11.0, 32.950000000000045, 0.32615169054205756, 0.14705810257829435, 0.23665108014916875], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 410.0119999999997, 293, 523, 408.5, 479.0, 490.95, 510.0, 0.32833886146529756, 0.16888609543201843, 0.1321050887926783], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.733999999999996, 2, 14, 3.0, 5.0, 6.0, 10.980000000000018, 0.3265395687587839, 0.2004870041741553, 0.16326978437939194], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.334, 2, 42, 4.0, 5.0, 6.0, 10.990000000000009, 0.3265310387344179, 0.1912343058978689, 0.15401805830930065], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 678.212, 536, 881, 688.0, 785.9000000000001, 825.9, 849.0, 0.32638013102203983, 0.29823940663928994, 0.14374749911224605], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.74200000000013, 171, 346, 245.0, 294.0, 301.95, 311.99, 0.3264530097008776, 0.2890607504159011, 0.1342155440274116], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.701999999999996, 3, 59, 4.0, 6.0, 6.0, 10.990000000000009, 0.32656302862390263, 0.21772250514826616, 0.1527575104598138], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 978.5420000000001, 790, 8711, 926.0, 1087.9, 1109.0, 1135.97, 0.3263929144014998, 0.24533973646872895, 0.18040858354614153], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.78599999999992, 118, 172, 141.0, 152.0, 154.0, 163.99, 0.3284484293267661, 6.350444533394666, 0.16550721634044074], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 185.05200000000016, 159, 280, 179.5, 206.0, 209.0, 223.95000000000005, 0.3284255607045385, 0.6365522408065475, 0.23477295940988496], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.599999999999994, 5, 23, 7.0, 10.0, 11.0, 13.990000000000009, 0.32829596012123313, 0.2679298992508943, 0.20262016288732357], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.428000000000008, 5, 39, 7.0, 9.0, 10.949999999999989, 15.980000000000018, 0.32829919350020126, 0.27306221298443006, 0.2077518333868461], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.640000000000002, 6, 19, 8.0, 10.0, 11.949999999999989, 15.990000000000009, 0.3282922957020629, 0.26568272301880524, 0.20037371563846615], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.174, 7, 27, 10.0, 12.0, 14.0, 18.0, 0.32829402012442344, 0.2935762862970076, 0.22826693586776314], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.958000000000007, 5, 30, 8.0, 9.0, 10.0, 16.980000000000018, 0.3282569490354826, 0.2464203118096346, 0.1811183361377419], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1617.5140000000001, 1422, 2009, 1594.0, 1805.9, 1892.8, 1954.96, 0.32795100149676837, 0.27405366356523403, 0.2088125517342705], "isController": false}]}, function(index, item){
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
