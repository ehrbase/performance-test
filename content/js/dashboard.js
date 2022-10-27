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

    var data = {"OkPercent": 97.75366943203574, "KoPercent": 2.246330567964263};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.898362050627526, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.994, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.986, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.492, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.981, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.968, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.582, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 528, 2.246330567964263, 190.1434588385461, 1, 3272, 18.0, 559.9000000000015, 1231.9000000000015, 2256.0, 25.78337359071733, 169.91712091626135, 213.61832760598003], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 29.723999999999997, 19, 55, 31.0, 36.0, 37.0, 41.99000000000001, 0.5584907346387123, 0.3243871262300759, 0.2825177739676299], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.1259999999999994, 4, 25, 7.0, 9.0, 11.0, 17.99000000000001, 0.5583067672363257, 5.971945782829834, 0.20282238028507144], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.599999999999997, 4, 35, 7.0, 9.0, 11.0, 17.0, 0.558289935595673, 5.994916238016307, 0.23661897660988487], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, 0.6, 21.683999999999994, 6, 254, 20.0, 27.0, 33.0, 56.930000000000064, 0.5549266386983641, 0.29891145070309205, 6.178978060975339], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.72600000000006, 24, 90, 43.0, 51.0, 53.0, 58.99000000000001, 0.558134135260459, 2.3212853190769134, 0.23328262684714493], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.49, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5581596805540516, 0.34881818583312585, 0.23710884867286372], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.848000000000006, 22, 81, 38.0, 44.0, 47.0, 58.960000000000036, 0.5581291510855613, 2.290678676326952, 0.20384795166601552], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 764.0560000000003, 582, 1271, 764.0, 898.9000000000001, 915.95, 1154.6300000000003, 0.5577804799143249, 2.3588754378576766, 0.27235374995816647], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 13.357999999999997, 8, 32, 14.0, 17.0, 18.94999999999999, 23.99000000000001, 0.5579118030705233, 0.8297216389719249, 0.2860387662226805], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4819999999999953, 2, 20, 3.0, 5.0, 6.0, 9.0, 0.5557698357033212, 0.5361366149643251, 0.3050221168606118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 22.433999999999997, 14, 56, 24.0, 28.0, 30.0, 37.0, 0.5580886579642041, 0.9093346170535151, 0.36570067333396583], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.6398168103448275, 1773.3013376124436], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.539999999999999, 2, 22, 4.0, 6.0, 8.0, 11.0, 0.5557803378255206, 0.5583367102778235, 0.32728080440311413], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 23.251999999999985, 15, 56, 25.0, 29.0, 31.94999999999999, 40.0, 0.5580737081430767, 0.8768318943867831, 0.33299124577677724], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 13.337999999999994, 8, 39, 14.0, 17.0, 19.0, 26.99000000000001, 0.5580737081430767, 0.8637204322085544, 0.3199113932421739], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1986.3180000000011, 1479, 2972, 1970.0, 2262.8, 2356.6, 2582.84, 0.5570087294408078, 0.8505545056714628, 0.307877871937009], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.918000000000003, 12, 397, 17.0, 24.0, 30.0, 50.0, 0.5548847615327248, 0.2995651593545803, 4.474842149157463], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 26.753999999999976, 17, 83, 28.0, 33.0, 35.94999999999999, 45.99000000000001, 0.5581173140269392, 1.0104343345678888, 0.4665511921943945], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 22.227999999999987, 14, 49, 23.0, 28.0, 30.0, 36.98000000000002, 0.558100493807317, 0.9448750364160573, 0.40113472992400906], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.063264266304348, 1482.4431046195652], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.6908111802413273, 2884.5328996983408], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3640000000000003, 1, 19, 2.0, 3.0, 4.0, 10.990000000000009, 0.5556889208965707, 0.4667309390364799, 0.23605925838867994], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.2119999999998, 311, 755, 419.5, 475.90000000000003, 487.95, 619.7300000000002, 0.5555086459365653, 0.48913621252538675, 0.2582247221345753], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1819999999999977, 1, 24, 3.0, 4.0, 5.0, 12.990000000000009, 0.5557377140284872, 0.5035428713439405, 0.2724417309006841], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1181.5719999999997, 929, 1739, 1170.0, 1364.0, 1406.95, 1591.6000000000004, 0.5551712536766216, 0.5251638136878582, 0.29439256908828665], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0785222457628], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, 1.8, 43.94999999999998, 11, 694, 43.0, 51.900000000000034, 59.89999999999998, 94.99000000000001, 0.5544663372397335, 0.2973434027654563, 25.36250316045812], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.91799999999999, 10, 228, 48.0, 56.0, 64.94999999999999, 82.98000000000002, 0.5552470849528041, 121.85476384647419, 0.1724302470849528], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.8863815197841725, 1.482407823741007], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3619999999999997, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.558321729546721, 0.6066896207850897, 0.2404491042286171], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3380000000000023, 2, 21, 3.0, 5.0, 6.0, 10.0, 0.5583192357726301, 0.5728508024443216, 0.20664354527131523], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2379999999999973, 1, 26, 2.0, 3.0, 4.0, 11.0, 0.5583173654566813, 0.31665318330229086, 0.21754748907931235], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 120.92599999999999, 85, 275, 120.0, 146.0, 150.0, 173.97000000000003, 0.5582556520593492, 0.508550182507729, 0.18317763583197397], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 167.3519999999999, 41, 421, 170.0, 199.0, 217.95, 302.8600000000001, 0.5550085637821393, 0.29608731276786104, 164.1828067782086], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2699999999999974, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.5583154951532632, 0.31129469280643984, 0.2349941195420473], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2399999999999998, 1, 13, 3.0, 4.0, 6.0, 8.0, 0.5583522800873709, 0.30034663381973264, 0.23882646355299658], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.796000000000012, 6, 350, 10.0, 14.900000000000034, 18.0, 48.92000000000007, 0.5542678066846914, 0.23421603772512972, 0.40325148044931164], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.502000000000002, 2, 50, 4.0, 6.0, 6.949999999999989, 9.990000000000009, 0.5583229764421203, 0.2872767999216115, 0.22572823461624786], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.803999999999998, 2, 21, 4.0, 5.0, 6.0, 11.0, 0.5556802749061456, 0.34117357972289336, 0.27892545048999884], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.131999999999995, 2, 33, 4.0, 5.0, 7.0, 13.0, 0.5556629837324105, 0.32548936023464536, 0.2631802217873233], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 520.9800000000006, 374, 1072, 520.5, 628.0, 646.95, 820.7000000000003, 0.5552224221022941, 0.5072564100428631, 0.24562085665267508], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.519999999999998, 6, 115, 15.0, 25.0, 31.0, 43.950000000000045, 0.5553827698049496, 0.49180012051806105, 0.22942081213622428], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.152000000000003, 7, 67, 12.0, 14.0, 16.0, 21.0, 0.5557889869300662, 0.37023470864707625, 0.26106885030601745], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 557.2440000000001, 360, 3272, 535.0, 640.7, 674.9, 746.9200000000001, 0.5556080296472444, 0.4176023742520127, 0.3081888289449559], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.1099999999999, 141, 336, 175.0, 188.0, 192.0, 208.99, 0.558374727513133, 10.796121918260082, 0.2824590906755887], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 273.3960000000001, 219, 522, 273.0, 300.90000000000003, 306.0, 406.96000000000004, 0.5582195030729984, 1.0820005697327804, 0.4001299953667781], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 22.55199999999999, 15, 51, 23.5, 27.0, 29.0, 42.92000000000007, 0.5578788108701571, 0.4551081632872228, 0.34540543563640586], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 21.968000000000018, 14, 50, 23.0, 27.0, 28.0, 35.0, 0.5578931277608736, 0.46399491996465186, 0.35413137992633575], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.370000000000015, 14, 42, 24.0, 28.0, 29.0, 37.0, 0.5578582705277897, 0.4515307020785799, 0.3415792340048088], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 24.68, 16, 48, 26.0, 30.0, 32.0, 41.0, 0.5578657395681896, 0.49896514161979666, 0.3889806035661009], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 21.998, 14, 59, 23.0, 27.0, 29.0, 39.99000000000001, 0.5576255856462713, 0.4186689926856252, 0.30876338580218343], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2206.122, 1659, 3120, 2197.5, 2540.9, 2620.0, 2836.55, 0.5566205562197893, 0.4651108321978274, 0.3554978943044358], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 94.6969696969697, 2.1272069772388855], "isController": false}, {"data": ["500", 28, 5.303030303030303, 0.11912359072537758], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 528, "No results for path: $['rows'][1]", 500, "500", 28, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
