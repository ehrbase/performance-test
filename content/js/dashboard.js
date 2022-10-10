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

    var data = {"OkPercent": 97.80472239948946, "KoPercent": 2.1952776005105297};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8983195064879813, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.982, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.49, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.985, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.705, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.58, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 516, 2.1952776005105297, 190.8649649010867, 1, 4424, 17.0, 567.0, 1245.0, 2269.0, 25.773987188118856, 171.4923306402733, 213.54056014012585], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.79199999999999, 15, 64, 25.0, 29.900000000000034, 32.0, 43.0, 0.5592985054425337, 0.3247929441976695, 0.28292639240159423], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.507999999999996, 4, 35, 7.0, 10.0, 12.0, 19.99000000000001, 0.5589602445115693, 5.970448697650578, 0.20305977632646854], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.818000000000002, 5, 55, 7.0, 9.900000000000034, 11.0, 24.99000000000001, 0.5589446231204089, 6.001946271378235, 0.23689645159595457], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.55200000000002, 14, 250, 20.0, 29.0, 35.0, 54.99000000000001, 0.5547068540688302, 0.2994691126049367, 6.1765308106375025], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.937999999999974, 25, 97, 44.0, 52.0, 54.0, 76.98000000000002, 0.5588184343025108, 2.3240996736500343, 0.23356864246237755], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.63, 1, 15, 2.0, 3.0, 4.0, 8.0, 0.5588477899805298, 0.34921656176162236, 0.23740116078274456], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.63399999999998, 22, 65, 38.0, 46.0, 49.0, 59.97000000000003, 0.5588090661182887, 2.2934375384181234, 0.20409628000804686], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 773.6020000000001, 576, 1434, 769.0, 909.0, 937.0, 1257.2400000000007, 0.5584913584632105, 2.361945037608808, 0.2727008586246145], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.961999999999998, 7, 25, 11.0, 14.0, 16.0, 22.0, 0.5584321013576601, 0.8304637921700001, 0.28630552071559723], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.722000000000002, 1, 20, 3.0, 5.0, 7.0, 14.0, 0.5555876561756902, 0.5359294023099113, 0.30492213161204873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.645999999999987, 11, 31, 18.0, 22.0, 23.0, 29.980000000000018, 0.5587865837576386, 0.9105667485940929, 0.3661580055677495], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.661640019379845, 1833.7860343992247], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.676000000000002, 2, 28, 4.0, 6.0, 8.0, 12.990000000000009, 0.555597534035905, 0.5582474738369121, 0.32717315724965884], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.76399999999998, 11, 57, 19.0, 22.900000000000034, 26.0, 33.0, 0.5587797145082682, 0.8779411544891803, 0.3334125054341327], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.71800000000001, 6, 30, 11.0, 14.0, 16.0, 20.0, 0.5587797145082682, 0.8647814556658586, 0.3203161058753452], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2021.3719999999996, 1515, 2677, 2013.5, 2288.8, 2371.85, 2605.98, 0.557501856481182, 0.8512443580812125, 0.3081504402034659], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.902000000000008, 12, 71, 17.0, 24.900000000000034, 29.0, 47.99000000000001, 0.5546748551466616, 0.2994204202438573, 4.473149368946418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.400000000000013, 14, 49, 23.0, 27.0, 29.0, 36.0, 0.5588078170507912, 1.0116527932148438, 0.46712840956589574], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.603999999999985, 10, 46, 18.0, 22.0, 23.0, 30.99000000000001, 0.5587959511880561, 0.9460524593448006, 0.4016345899164153], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.129214638157895, 1794.5363898026317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.7024659700920245, 2933.1983320552145], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.393999999999999, 1, 24, 2.0, 3.0, 4.0, 8.990000000000009, 0.555530248066477, 0.46684939213880255, 0.23599185342667722], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.25800000000004, 308, 822, 416.5, 482.0, 495.0, 533.0, 0.5553414405779106, 0.48895753005507875, 0.2581469977686381], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2200000000000006, 1, 27, 3.0, 4.0, 5.0, 12.980000000000018, 0.5555722227222372, 0.5033929229682447, 0.2723606013735968], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1185.6260000000007, 930, 1871, 1173.0, 1366.0, 1389.95, 1639.5800000000004, 0.5550060995170336, 0.5249132785625564, 0.29430499222436457], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.879021139705882, 968.362247242647], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, 1.4, 44.84400000000006, 11, 762, 43.0, 52.0, 60.94999999999999, 95.99000000000001, 0.5542143568120703, 0.2976271814569852, 25.350977024489623], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.12600000000001, 11, 189, 44.0, 53.0, 62.0, 91.0, 0.5550060995170336, 123.46482277683982, 0.17235540981095382], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.7137714460784315, 1.3467626633986929], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.4519999999999986, 1, 22, 2.0, 4.0, 5.0, 7.990000000000009, 0.5589852405537084, 0.6074106123208173, 0.24073485457439983], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.6319999999999943, 2, 34, 3.0, 5.0, 6.949999999999989, 18.980000000000018, 0.5589808660849539, 0.5735296532362197, 0.20688842602167729], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2899999999999965, 1, 10, 2.0, 3.0, 4.0, 8.0, 0.5589714924538849, 0.31699251502235887, 0.21780236864169927], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.35600000000004, 83, 254, 122.5, 151.90000000000003, 157.0, 221.75000000000023, 0.5589058858378838, 0.5091108645715148, 0.1833909937905556], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 174.54199999999992, 26, 596, 175.0, 203.90000000000003, 243.5999999999999, 380.0, 0.5547776340287286, 0.29754176470049776, 164.11449306638914], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.428000000000001, 1, 24, 2.0, 3.0, 4.0, 9.0, 0.5589771165948009, 0.3116319260059632, 0.235272594973007], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.4380000000000015, 2, 26, 3.0, 5.0, 6.0, 12.970000000000027, 0.5590308640940066, 0.3006483273097758, 0.2391167172589599], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.26600000000002, 7, 344, 10.0, 16.0, 20.94999999999999, 40.98000000000002, 0.5540196898597776, 0.23411119140549255, 0.40307096576712337], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.708, 2, 72, 4.0, 6.0, 6.949999999999989, 15.950000000000045, 0.5589877402808802, 0.28758718287228024, 0.22599699655887145], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.844000000000001, 2, 25, 4.0, 5.0, 6.0, 13.0, 0.5555228414326712, 0.3411398498893954, 0.2788464262660088], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.0820000000000025, 2, 46, 4.0, 5.0, 6.0, 11.990000000000009, 0.5554963026166098, 0.32536026018335823, 0.263101276141656], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 528.8919999999997, 381, 1056, 532.5, 632.9000000000001, 648.0, 686.0, 0.5549549709536569, 0.5069806311697118, 0.2455025408613345], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.274000000000004, 7, 138, 16.0, 27.0, 32.94999999999999, 47.97000000000003, 0.5551182457375246, 0.4915973225675551, 0.2293115409638407], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.778000000000015, 5, 60, 10.0, 12.0, 13.0, 24.970000000000027, 0.5556080296472444, 0.37036592518460076, 0.26098384986359824], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 567.0340000000002, 370, 4424, 540.0, 628.9000000000001, 675.95, 743.9000000000001, 0.5554136165202226, 0.4174247917893205, 0.30808099041356096], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.76600000000008, 141, 372, 179.0, 191.0, 201.0, 287.84000000000015, 0.5591590248266607, 10.811254560640796, 0.28285583482442406], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 262.7420000000003, 210, 558, 264.0, 285.0, 296.0, 344.83000000000015, 0.5589008878699505, 1.0832896459139314, 0.4006184098599059], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.452000000000012, 11, 49, 18.0, 21.900000000000034, 23.0, 35.99000000000001, 0.5584015420816986, 0.45566111147872546, 0.34572907976542666], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.348, 11, 44, 18.0, 21.0, 23.0, 31.0, 0.5584171331311119, 0.4643991016324766, 0.3544640005226784], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.37000000000001, 11, 45, 18.0, 22.0, 24.0, 35.0, 0.558374727513133, 0.4519170958707072, 0.34189546303782653], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.082000000000008, 13, 55, 20.0, 25.0, 28.0, 36.98000000000002, 0.5583871990851383, 0.4994315443817313, 0.38934419936209846], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.117999999999995, 10, 54, 18.0, 21.0, 22.94999999999999, 37.97000000000003, 0.5581497113807842, 0.41906250976761994, 0.30905359995400844], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2219.4659999999967, 1706, 3112, 2192.5, 2524.0, 2629.6, 2896.98, 0.557121065750314, 0.46546594541773495, 0.35581755566475126], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.89922480620154, 2.1272069772388855], "isController": false}, {"data": ["500", 16, 3.10077519379845, 0.06807062327164433], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 516, "No results for path: $['rows'][1]", 500, "500", 16, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
