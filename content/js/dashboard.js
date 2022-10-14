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

    var data = {"OkPercent": 97.8387577111253, "KoPercent": 2.1612422888747074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926611359285258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.892, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.416, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.984, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.643, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.526, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 508, 2.1612422888747074, 208.63275898745087, 1, 3815, 20.0, 622.0, 1337.9000000000015, 2517.0, 23.583130912713823, 157.34395826811726, 195.38905440599706], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 33.14600000000001, 20, 66, 33.0, 41.0, 45.89999999999998, 55.0, 0.5107627935864537, 0.29663646579472647, 0.2583741475368975], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.80999999999999, 4, 35, 7.0, 11.0, 13.0, 20.970000000000027, 0.5105390577695366, 5.452674800277121, 0.18546926708033945], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.522000000000002, 5, 38, 8.0, 12.0, 14.949999999999989, 22.0, 0.5105223767062934, 5.481901535038682, 0.216373741689972], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 24.255999999999986, 14, 374, 22.0, 32.0, 37.0, 49.99000000000001, 0.5077838181483967, 0.27419433591270587, 5.65405380325002], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.74, 25, 95, 45.0, 57.0, 62.0, 81.93000000000006, 0.5104327346637932, 2.1229236393905024, 0.21334493206650734], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.8280000000000016, 1, 17, 2.0, 4.0, 6.0, 9.0, 0.5104655650139153, 0.31904097813369703, 0.2168481648252472], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.604000000000006, 23, 71, 40.0, 51.0, 56.0, 65.99000000000001, 0.5104311714191212, 2.0948872885028442, 0.18642700987378058], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 844.1580000000006, 579, 1419, 832.0, 1091.0, 1186.75, 1362.98, 0.5101650383899191, 2.157594563872663, 0.2491040226513277], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 14.67600000000001, 9, 43, 15.0, 20.0, 22.94999999999999, 29.99000000000001, 0.5104681707781475, 0.7590193105642409, 0.2617146383384057], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9959999999999964, 2, 20, 3.0, 6.0, 8.0, 14.990000000000009, 0.5086200933419595, 0.4906236839455085, 0.27914501216619264], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 24.484000000000012, 15, 56, 24.0, 33.0, 38.0, 47.0, 0.5104077238980042, 0.8317602274861705, 0.3344566237651961], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.5902597683264177, 1635.950196663209], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.062000000000003, 3, 31, 4.0, 7.0, 9.0, 16.0, 0.5086288891036432, 0.5111124286012197, 0.29951486340771183], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 25.074000000000026, 15, 60, 26.0, 33.0, 37.94999999999999, 45.99000000000001, 0.5103962614494642, 0.8019800631564334, 0.30454308178283457], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 14.144000000000004, 8, 54, 14.0, 18.900000000000034, 21.94999999999999, 29.99000000000001, 0.5103941774232239, 0.7899566069250282, 0.292579474753352], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2169.856000000001, 1633, 3338, 2131.0, 2590.7000000000003, 2756.95, 3045.5600000000004, 0.5093179723032887, 0.777730533230451, 0.28151755109732557], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.45400000000002, 13, 162, 18.0, 27.0, 32.0, 47.960000000000036, 0.5077497849679661, 0.2740896807980202, 4.094724340102992], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 29.536000000000005, 18, 59, 30.0, 40.0, 44.0, 54.98000000000002, 0.5104233553393857, 0.923943036051712, 0.4266820236040177], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.21600000000002, 14, 56, 24.5, 34.0, 37.0, 46.0, 0.5104160605475948, 0.8640576287167222, 0.36686154351858374], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 3.2804247359154934, 960.4560959507044], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.5856877397698209, 2445.5822410485935], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8139999999999974, 1, 22, 2.0, 4.0, 6.0, 14.970000000000027, 0.508530083622687, 0.42738079959490494, 0.2160259632576844], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 457.6100000000001, 322, 846, 457.5, 596.9000000000001, 655.8, 740.7600000000002, 0.5083713510375351, 0.447544520303335, 0.2363132452088542], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.561999999999998, 2, 23, 3.0, 5.0, 7.0, 12.0, 0.5085621523977688, 0.4606828136633359, 0.24931464892937497], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1282.747999999998, 929, 2103, 1232.5, 1645.8000000000002, 1733.95, 1949.8100000000002, 0.508077414739529, 0.48061543353737723, 0.26941995723004325], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, 0.2, 49.67199999999997, 25, 782, 45.0, 62.0, 69.94999999999999, 99.99000000000001, 0.5073540976453697, 0.2736124975266488, 23.207486263387807], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 54.953999999999986, 11, 210, 53.0, 72.90000000000003, 81.94999999999999, 132.81000000000017, 0.5081254338120891, 113.46935763862425, 0.1577967655783636], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 1.5026190902578798, 1.1808291547277938], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6160000000000005, 1, 15, 2.0, 4.0, 5.0, 8.990000000000009, 0.510572423166509, 0.5547169935351319, 0.21988519396135783], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.781999999999995, 2, 23, 3.0, 6.0, 8.0, 13.0, 0.5105666881785432, 0.5238843016953878, 0.1889695066598319], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.4940000000000024, 1, 18, 2.0, 4.0, 5.0, 9.980000000000018, 0.5105484413466634, 0.28950290387189725, 0.1989344024387878], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 134.94999999999996, 86, 257, 129.0, 176.90000000000003, 200.79999999999995, 235.97000000000003, 0.5104957935146615, 0.4650716385128236, 0.16750643224699827], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 186.864, 35, 691, 179.5, 241.0, 260.9, 393.93000000000006, 0.507884913278651, 0.27283339470276036, 150.24267376012594], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.5600000000000005, 1, 16, 2.0, 4.0, 5.0, 9.990000000000009, 0.5105630387078263, 0.2846987256857117, 0.21489518523737608], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.857999999999998, 1, 21, 3.0, 6.0, 7.0, 13.0, 0.5106115287913416, 0.2746082763873826, 0.21840610313535905], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.312000000000001, 7, 314, 11.0, 18.0, 22.0, 45.91000000000008, 0.5072074174012721, 0.21424362059870763, 0.36901320894916767], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.251999999999998, 2, 72, 5.0, 7.0, 8.949999999999989, 14.0, 0.5105745086486215, 0.2625928575476698, 0.20642367830129818], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.304000000000004, 2, 17, 4.0, 6.0, 8.0, 13.0, 0.5085254288140678, 0.31236571750395375, 0.2552559281351864], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.702000000000005, 2, 27, 4.0, 6.0, 8.0, 16.99000000000001, 0.5085135335791827, 0.2978419384841008, 0.24084869510342147], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 586.1759999999998, 390, 976, 591.5, 760.9000000000003, 836.0, 941.7300000000002, 0.5080820613498928, 0.4642173126040933, 0.2247667712807631], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 19.24000000000001, 7, 123, 17.0, 33.0, 39.94999999999999, 57.0, 0.5082282147975727, 0.4499288798141918, 0.20994192857360672], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 13.15600000000001, 8, 70, 13.0, 17.0, 19.94999999999999, 29.970000000000027, 0.5086387200208338, 0.33905638520888776, 0.23892111750978623], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 605.0700000000003, 454, 3466, 588.0, 680.8000000000001, 717.8499999999999, 812.94, 0.5084008150681868, 0.38203441638382635, 0.28200357710813484], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 188.3339999999998, 143, 384, 184.0, 245.0, 268.0, 306.95000000000005, 0.5106605496341627, 9.873601779498816, 0.25832242647509407], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 297.5559999999999, 224, 538, 291.5, 366.90000000000003, 392.0, 427.9200000000001, 0.5104989208052814, 0.9895612781846455, 0.3659240311240982], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 25.048000000000034, 15, 61, 25.0, 34.900000000000034, 39.94999999999999, 52.97000000000003, 0.5104494098694373, 0.41653170331097905, 0.31603996665744455], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 24.46199999999999, 15, 61, 24.0, 34.0, 40.0, 50.99000000000001, 0.5104598324262462, 0.424458317572886, 0.32402235456744144], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 24.288, 15, 58, 25.0, 32.0, 35.0, 45.0, 0.5104186658064411, 0.4131619779182677, 0.31253174166077985], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 27.440000000000005, 17, 63, 28.0, 36.0, 40.94999999999999, 52.0, 0.5104353400928584, 0.4566003628174397, 0.35590901643193446], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 24.731999999999996, 14, 52, 24.0, 33.0, 39.0, 50.99000000000001, 0.5101884636184606, 0.3829372968812179, 0.28249693249186253], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2415.600000000001, 1682, 3815, 2351.5, 2937.0000000000005, 3144.9, 3510.9700000000003, 0.5093413198052278, 0.42560441306053015, 0.32530197573497954], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.4251968503937, 2.1272069772388855], "isController": false}, {"data": ["500", 8, 1.5748031496062993, 0.034035311635822164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 508, "No results for path: $['rows'][1]", 500, "500", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
