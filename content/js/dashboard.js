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

    var data = {"OkPercent": 97.81323122739843, "KoPercent": 2.186768772601574};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9008296107211232, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.99, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.983, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.659, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 514, 2.186768772601574, 186.18357796213598, 1, 3225, 17.0, 550.9000000000015, 1229.9500000000007, 2185.970000000005, 26.462174457837836, 176.31024348007992, 219.24227380920215], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.999999999999986, 17, 77, 28.0, 32.0, 33.0, 39.97000000000003, 0.5731821813708913, 0.3328229354980896, 0.28994958002941573], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.015999999999998, 5, 33, 7.0, 11.0, 12.949999999999989, 16.0, 0.5731611557221544, 6.122101103120289, 0.2082187011021889], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.212000000000002, 5, 37, 8.0, 10.0, 11.0, 20.99000000000001, 0.5731407885958738, 6.154287279369454, 0.24291318579161061], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.718000000000014, 14, 254, 20.0, 27.0, 32.94999999999999, 52.950000000000045, 0.569792128435704, 0.30764546009574784, 6.344501805101463], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.802, 28, 85, 47.0, 56.0, 58.0, 62.99000000000001, 0.5729398229845123, 2.382927222247368, 0.23947094163805788], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5339999999999963, 1, 19, 2.0, 3.0, 4.0, 8.0, 0.5729772470735187, 0.3581107794209492, 0.2434034203876764], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.41000000000001, 25, 68, 42.0, 49.0, 51.0, 54.99000000000001, 0.572926692883792, 2.3514433312478804, 0.20925252259622876], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 768.0039999999996, 583, 1186, 763.5, 904.8000000000001, 923.95, 968.98, 0.5725999473208049, 2.421579976824017, 0.27958981802773675], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.196000000000002, 8, 34, 13.0, 15.0, 16.94999999999999, 23.99000000000001, 0.5727048851726706, 0.851559591733005, 0.2936231100738789], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4360000000000013, 2, 21, 3.0, 5.0, 6.0, 11.0, 0.5705958275750704, 0.5504711802032919, 0.31315903818084917], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.297999999999988, 13, 68, 21.0, 25.0, 26.0, 33.97000000000003, 0.5729043730936607, 0.9335398432791442, 0.37540901791586556], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.734522913080895, 2035.7865614242687], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.406000000000005, 2, 29, 4.0, 6.0, 7.0, 16.980000000000018, 0.5706062463124572, 0.5733277706356896, 0.3360112954359489], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.968, 13, 51, 22.0, 25.0, 27.0, 34.0, 0.5728853369997995, 0.9001035669273295, 0.34182904385437257], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.706000000000003, 7, 30, 12.0, 15.0, 16.0, 22.99000000000001, 0.5728813986555619, 0.8867029196757262, 0.3283997861433739], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1897.4840000000002, 1526, 2379, 1876.0, 2163.7000000000003, 2255.3999999999996, 2340.9300000000003, 0.5717258688803892, 0.8730924009056138, 0.3160125408069339], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 18.164000000000023, 5, 73, 17.0, 24.0, 28.94999999999999, 40.99000000000001, 0.5697551192497465, 0.3073617435788598, 4.594763451918365], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.707999999999974, 16, 85, 26.0, 30.0, 32.0, 40.99000000000001, 0.5729227539709276, 1.0371736990070104, 0.47892761464757233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.95200000000001, 13, 53, 21.0, 25.0, 26.0, 32.99000000000001, 0.5729148763076782, 0.9698911748192454, 0.4117825673461437], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.5266544117646], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.7829193376068376, 3269.1372863247866], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2619999999999987, 1, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.5705821535596338, 0.4794985196246026, 0.24238597343597726], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 411.31600000000043, 320, 602, 415.0, 474.0, 485.0, 526.99, 0.5703758206282119, 0.5020978244440262, 0.2651356353701454], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.119999999999994, 1, 28, 3.0, 4.0, 6.0, 14.0, 0.5706394585772817, 0.5168834383309937, 0.27974707832597207], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1178.5079999999978, 939, 1444, 1172.0, 1350.7, 1374.95, 1417.95, 0.5699525571491428, 0.5391461761597964, 0.3022307016913912], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.662471064814815, 1219.4191261574074], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 44.391999999999996, 11, 737, 43.0, 51.900000000000034, 57.94999999999999, 105.95000000000005, 0.5692854556674645, 0.30638231617203354, 26.040362054164095], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 45.23199999999998, 10, 205, 46.0, 54.0, 60.94999999999999, 86.99000000000001, 0.570116976601259, 127.06944111183357, 0.17704804546796912], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.7597787332214765, 1.3829173657718121], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.224, 1, 30, 2.0, 3.0, 4.0, 7.0, 0.5732110941568007, 0.6227714627429985, 0.24686141847963783], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2579999999999996, 2, 37, 3.0, 4.0, 5.0, 16.0, 0.5732051799405701, 0.5880917214985188, 0.21215308906003522], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2619999999999982, 1, 19, 2.0, 3.0, 4.0, 6.990000000000009, 0.573172325405978, 0.3251107315197779, 0.22333570101268088], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.34200000000004, 85, 268, 121.5, 147.0, 152.0, 159.98000000000002, 0.5731171382656558, 0.5221533683670287, 0.18805406099341831], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 166.90399999999994, 42, 652, 165.0, 198.0, 220.0, 368.71000000000026, 0.5698804504790985, 0.305905592749753, 168.5822129483677], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.161999999999999, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.5732005800789871, 0.3196264953370133, 0.2412592285293393], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.235999999999997, 2, 15, 3.0, 4.900000000000034, 5.0, 8.990000000000009, 0.573248553693899, 0.30835957796581603, 0.24519811183391385], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.710000000000015, 7, 314, 10.0, 16.0, 19.94999999999999, 40.960000000000036, 0.569099491111235, 0.2403867358274308, 0.41404211023229504], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.341999999999996, 2, 60, 4.0, 5.0, 6.0, 10.990000000000009, 0.5732137227365224, 0.29487367802585196, 0.23174851680949243], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.6319999999999975, 2, 16, 3.0, 5.0, 5.949999999999989, 11.0, 0.5705756423540582, 0.3504159104162007, 0.28640222672850185], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8360000000000007, 2, 31, 4.0, 5.0, 5.0, 10.990000000000009, 0.5705574117690019, 0.3341817165447956, 0.2702347116288729], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 523.2700000000007, 380, 771, 522.5, 631.0, 650.0, 708.95, 0.5700688757215646, 0.5208202692549314, 0.25218867256041877], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.691999999999998, 6, 112, 14.0, 22.0, 27.94999999999999, 47.99000000000001, 0.570247019603952, 0.5048334493786019, 0.2355610246996794], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.031999999999993, 6, 58, 11.0, 13.0, 15.0, 30.930000000000064, 0.570614711816746, 0.380369315036953, 0.2680328870936082], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 535.1899999999995, 384, 3225, 517.0, 602.0, 638.8, 732.7900000000002, 0.5704024988192669, 0.42862516990864435, 0.3163951360638121], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.80800000000002, 144, 253, 176.0, 189.90000000000003, 193.0, 207.99, 0.5730291236321794, 11.079495721478049, 0.289872154337372], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 266.0, 23, 338, 269.0, 293.0, 297.0, 309.97, 0.5731099121651749, 1.1091042413858714, 0.41080339407152183], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.421999999999997, 14, 45, 22.0, 24.0, 26.0, 32.98000000000002, 0.5726629054167038, 0.46729852323121607, 0.3545588691740139], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 19.84200000000002, 13, 54, 21.0, 25.0, 26.0, 29.99000000000001, 0.5726753675144172, 0.47622430835132484, 0.36351463758239366], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.966000000000026, 13, 47, 22.0, 25.0, 26.0, 30.0, 0.5726412620097189, 0.4635284959176404, 0.3506309289844665], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 22.899999999999977, 15, 92, 24.0, 28.0, 29.0, 35.99000000000001, 0.5726504438613591, 0.5121888468022626, 0.3992894696455179], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.304000000000023, 13, 75, 22.0, 24.0, 26.0, 38.0, 0.5724950479178356, 0.4297033777923446, 0.3169967696966921], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2158.106000000001, 1690, 2762, 2133.0, 2476.0, 2555.95, 2689.91, 0.5713756783657741, 0.47747254075622714, 0.3649215758312659], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.27626459143968, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19455252918287938, 0.0042544139544777706], "isController": false}, {"data": ["500", 13, 2.529182879377432, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 514, "No results for path: $['rows'][1]", 500, "500", 13, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
