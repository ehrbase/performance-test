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

    var data = {"OkPercent": 97.80897681344395, "KoPercent": 2.191023186556052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9012975962561157, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.987, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.713, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.69, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 515, 2.191023186556052, 183.54503297170666, 1, 3351, 16.0, 534.9000000000015, 1219.9500000000007, 2174.980000000003, 26.815141513900407, 178.4328709156963, 222.16664799750615], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 23.593999999999998, 15, 48, 25.0, 28.0, 29.0, 32.0, 0.5811581552180447, 0.3375530016237559, 0.2939843011747531], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.337999999999995, 4, 30, 7.0, 9.0, 13.0, 19.0, 0.5809036071790392, 6.218047805534966, 0.21103138854551032], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.668000000000004, 5, 35, 7.0, 10.0, 11.0, 15.0, 0.5808826860944817, 6.237517148746049, 0.24619441969238776], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.435999999999996, 13, 259, 20.0, 27.0, 32.0, 50.950000000000045, 0.5771825870939665, 0.3115703752956618, 6.426792830122467], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.97400000000004, 27, 74, 44.0, 53.0, 55.0, 59.99000000000001, 0.5805650058637065, 2.4145097618377203, 0.2426580297945961], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4299999999999984, 1, 15, 2.0, 3.0, 4.0, 7.980000000000018, 0.580601410164705, 0.362842995726193, 0.2466422006070768], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.31, 24, 65, 39.0, 47.0, 49.0, 52.0, 0.5805454572898513, 2.3826469991895585, 0.212035157252348], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 754.6580000000007, 580, 1050, 746.5, 887.9000000000001, 912.95, 937.97, 0.5801783236095447, 2.4536625170862516, 0.283290197074973], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.703999999999997, 7, 39, 11.0, 13.0, 15.0, 23.980000000000018, 0.5804086541251964, 0.8631787625281208, 0.297572796304422], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.3059999999999974, 2, 21, 3.0, 4.0, 6.0, 10.0, 0.5780747797535088, 0.5575553831768677, 0.31726369748190625], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.023999999999983, 11, 36, 18.0, 21.0, 23.0, 26.0, 0.5805225399486585, 0.9459206608552491, 0.3804010002983886], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.7513341769366197, 2082.3802679357395], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.189999999999997, 2, 24, 4.0, 5.0, 6.0, 11.0, 0.5780861417721577, 0.580843341690532, 0.3404159604380968], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 17.796, 11, 34, 18.5, 22.0, 24.0, 30.0, 0.5805131039222948, 0.912088129580974, 0.3463803774380099], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.269999999999985, 6, 34, 10.5, 13.0, 14.949999999999989, 20.99000000000001, 0.5805083860241445, 0.8983764105628145, 0.33277189706657506], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1883.3220000000008, 1492, 2326, 1871.5, 2116.6000000000004, 2187.85, 2286.9, 0.5794018024031269, 0.8847488155578654, 0.3202552931251659], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.83800000000002, 11, 221, 17.0, 24.0, 28.0, 49.97000000000003, 0.5771426130939807, 0.3114834173941549, 4.654339549736419], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.195999999999984, 14, 43, 22.0, 26.0, 27.94999999999999, 34.99000000000001, 0.5805427610381498, 1.051034117191845, 0.48529746430532833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 16.957999999999988, 11, 56, 18.0, 21.0, 23.0, 38.90000000000009, 0.580533324354418, 0.9828542566735208, 0.41725832687973785], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.6846155642750373, 2858.662649476831], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2079999999999993, 1, 24, 2.0, 3.0, 4.0, 9.990000000000009, 0.5779738778926148, 0.48567754541140756, 0.24552601258133538], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 407.0700000000003, 312, 541, 411.5, 471.0, 479.95, 514.97, 0.5777715121667125, 0.5086409250439684, 0.2685734763587453], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.896, 1, 16, 3.0, 4.0, 5.0, 9.990000000000009, 0.5780179763590648, 0.5237305731770758, 0.2833642813791509], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1162.13, 921, 1501, 1162.0, 1331.9, 1354.9, 1400.95, 0.5774098778662626, 0.5461677180097605, 0.30618512078259824], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.2163938492063], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, 1.2, 43.937999999999974, 11, 603, 44.0, 51.0, 56.94999999999999, 91.98000000000002, 0.5767484995887783, 0.3099955597574888, 26.38173800853357], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.24399999999999, 8, 176, 44.0, 52.0, 59.0, 81.97000000000003, 0.5775112499191484, 128.47124416280505, 0.17934431393973554], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.906960227272727, 1.4985795454545454], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.1019999999999985, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.5809285794785818, 0.6312549215543093, 0.25018506206060015], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1020000000000008, 1, 26, 3.0, 4.0, 5.0, 10.990000000000009, 0.5809218299967119, 0.5960745859334426, 0.21500915387573616], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0760000000000005, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5809157555971233, 0.3294041946474422, 0.22635291648755096], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.10000000000011, 87, 192, 120.0, 147.0, 151.95, 159.0, 0.580852319459482, 0.5290691082842319, 0.19059216732264256], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 167.56799999999998, 29, 541, 171.0, 199.90000000000003, 217.89999999999998, 316.8800000000001, 0.5772745483115297, 0.30960744861679246, 170.76953727981305], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2600000000000025, 1, 20, 2.0, 3.0, 4.0, 9.980000000000018, 0.5809164305241377, 0.32389608269171116, 0.24450681792568685], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0759999999999987, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.5809751551784639, 0.3124171202630191, 0.2485030448907883], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.246000000000004, 6, 309, 9.0, 14.0, 18.0, 42.90000000000009, 0.5765629468362838, 0.24366991540668445, 0.41947206581350727], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.148000000000007, 2, 64, 4.0, 5.0, 6.0, 8.990000000000009, 0.5809339791770024, 0.2989109557467732, 0.23486979236257716], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.634000000000002, 2, 20, 3.0, 5.0, 6.0, 12.0, 0.577966528802384, 0.35488951013868886, 0.29011210527775916], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.954000000000001, 2, 29, 4.0, 5.0, 6.949999999999989, 12.970000000000027, 0.5779484909186954, 0.33844528171521243, 0.27373536923395236], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 522.7599999999998, 380, 746, 520.5, 628.0, 640.9, 675.94, 0.5774518895958183, 0.5275981671821387, 0.2554547910028376], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.167999999999996, 5, 130, 15.0, 26.0, 31.0, 45.0, 0.5776260033363678, 0.5114968513606558, 0.23860917911258162], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.168000000000001, 5, 47, 9.0, 11.0, 12.0, 16.0, 0.5780961674536482, 0.385290933761163, 0.27154712553242655], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 523.9000000000002, 349, 3351, 510.0, 575.0, 603.95, 672.99, 0.5778883727703621, 0.43428311213692716, 0.3205474567710603], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 170.56399999999996, 141, 216, 177.0, 188.0, 192.0, 200.98000000000002, 0.5810257894106888, 11.234078032271915, 0.2939173426901726], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 258.3460000000001, 209, 448, 261.0, 283.0, 287.0, 347.85000000000014, 0.5808401736944455, 1.1257805675127959, 0.41634442137863575], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.27, 11, 36, 18.0, 21.0, 22.0, 28.0, 0.5803837265046158, 0.47353304204357755, 0.3593391431678969], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.01599999999998, 11, 56, 18.0, 21.0, 22.0, 30.0, 0.5803904634882163, 0.4827057607526039, 0.3684119153001373], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.076, 11, 37, 18.0, 21.0, 22.94999999999999, 31.99000000000001, 0.5803716003282581, 0.46968725479299883, 0.355364251372869], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.86999999999999, 13, 69, 21.0, 24.0, 26.0, 32.99000000000001, 0.5803769896774148, 0.5190996082165131, 0.4046769244430412], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.87, 10, 43, 18.0, 21.0, 22.0, 31.0, 0.5801278369701547, 0.4355638324086096, 0.3212231284785915], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2149.372000000001, 1675, 2642, 2144.0, 2429.8, 2515.5, 2601.94, 0.5790320899584255, 0.4838378572627995, 0.3698115105789163], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.0873786407767, 2.1272069772388855], "isController": false}, {"data": ["500", 15, 2.912621359223301, 0.06381620931716656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 515, "No results for path: $['rows'][1]", 500, "500", 15, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
