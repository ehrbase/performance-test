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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8932567538821528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.218, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.657, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.99, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.122, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.7720059561795, 1, 21300, 9.0, 839.0, 1494.0, 6073.980000000003, 15.284832413078693, 96.28311002445703, 126.48329258854702], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6237.386000000001, 5142, 21300, 6040.5, 6562.0, 6696.95, 19469.20000000011, 0.3298076891364645, 0.19154290117807304, 0.16619215585392158], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.2419999999999987, 1, 9, 2.0, 3.0, 3.9499999999999886, 6.0, 0.33092530023197864, 0.16989330037593114, 0.11957261824788291], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.546, 2, 15, 3.0, 4.0, 5.0, 7.0, 0.3309222339368693, 0.18992803330765376, 0.13960781744211673], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.772, 8, 346, 11.0, 15.0, 17.0, 31.99000000000001, 0.3286779390052628, 0.1709863524291929, 3.61642025270732], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.36799999999996, 23, 68, 33.0, 40.0, 41.0, 44.0, 0.3308740567607827, 1.3760709514333134, 0.13764877751962248], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2259999999999986, 1, 20, 2.0, 3.0, 4.0, 7.0, 0.33088215830461276, 0.20670764207914435, 0.13991403764247784], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.462, 21, 66, 29.0, 34.0, 36.0, 41.98000000000002, 0.3308793117710315, 1.3579978441144842, 0.12020224997932004], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 846.4960000000002, 669, 1080, 855.5, 988.9000000000001, 1031.95, 1067.97, 0.3307254528954352, 1.3987070567468654, 0.1608410893964128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.709999999999997, 4, 50, 5.0, 7.0, 8.0, 12.0, 0.3308265502862973, 0.4919461878773904, 0.16896707597630223], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.695999999999998, 2, 27, 3.0, 5.0, 5.0, 9.980000000000018, 0.3289107987335618, 0.3172543798995375, 0.17987309305741664], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.501999999999998, 5, 19, 7.0, 9.0, 11.0, 13.990000000000009, 0.3308876325453134, 0.5392143567428612, 0.21617561149688932], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.8901588220164609, 2433.7243602109056], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.874000000000005, 2, 21, 4.0, 5.0, 6.0, 10.980000000000018, 0.32891599156659396, 0.3304288766449911, 0.19304542083156542], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.752000000000002, 5, 20, 8.0, 10.0, 10.949999999999989, 13.0, 0.33088456694820534, 0.51982159345239, 0.19678584108540725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.503999999999998, 4, 24, 6.0, 8.0, 9.0, 12.0, 0.3308832531382622, 0.5120644532038433, 0.189029983482308], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1547.9299999999998, 1330, 1898, 1531.5, 1727.9, 1802.95, 1892.95, 0.33054157915578364, 0.504757004630557, 0.1820561041443964], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.102000000000004, 7, 83, 10.0, 13.0, 15.0, 35.98000000000002, 0.3286623835384844, 0.17097826009256448, 2.6498404672790303], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.710000000000003, 8, 22, 10.0, 13.0, 14.0, 19.0, 0.33088916536516927, 0.5989966354776054, 0.27595639377134235], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.597999999999996, 5, 16, 7.0, 9.0, 11.0, 13.990000000000009, 0.33088938434059373, 0.560220932153448, 0.23718047666601152], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 10.25390625, 2964.84375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 1.1231651029055691, 4630.613460956417], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2300000000000018, 1, 35, 2.0, 3.0, 3.0, 6.0, 0.3288930577911147, 0.2764468200892484, 0.13907294338237566], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.9660000000001, 444, 704, 544.5, 630.9000000000001, 642.95, 669.97, 0.3287968140903902, 0.28953063987641187, 0.15219696277230954], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2339999999999973, 1, 24, 3.0, 4.0, 5.0, 12.970000000000027, 0.32891166419434736, 0.2979830468649785, 0.16060139853239616], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 752.2139999999993, 600, 952, 729.5, 872.0, 889.8499999999999, 927.8300000000002, 0.3287743293003682, 0.3110224419302341, 0.17369815639794844], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 9.108323317307693, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.769999999999996, 16, 700, 22.0, 26.0, 28.94999999999999, 53.97000000000003, 0.32851295326574725, 0.170900522787301, 14.985195358440484], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.18000000000004, 21, 318, 29.0, 34.900000000000034, 38.94999999999999, 103.95000000000005, 0.3287989762515075, 74.36466674723611, 0.10146530907761366], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 1.1253520654506437, 0.880163626609442], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.579999999999998, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.3308782169634644, 0.359542481247477, 0.14185111059273522], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.245999999999999, 2, 8, 3.0, 4.0, 5.0, 6.0, 0.3308777790424662, 0.33950838986104453, 0.1218173073232517], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7699999999999996, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.33092639535114604, 0.1876682295355117, 0.1282986122601611], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.17, 65, 120, 91.0, 112.0, 114.0, 117.99000000000001, 0.33090931231750353, 0.3014086178629479, 0.10793331085356071], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.36400000000002, 58, 299, 79.0, 92.0, 97.94999999999999, 288.5400000000004, 0.3287399594597882, 0.17101861699592164, 97.20622297346608], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.15, 12, 359, 262.5, 335.0, 337.0, 343.99, 0.3308738378056447, 0.18440723434966746, 0.13861804337756012], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 411.76199999999983, 308, 522, 401.0, 479.90000000000003, 494.0, 512.0, 0.33083815199101707, 0.17792566277634084, 0.14086468190242524], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 6.952000000000001, 4, 298, 6.0, 8.0, 9.0, 23.99000000000001, 0.32845252875601894, 0.1480955244647866, 0.23832053600168168], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 383.97400000000005, 286, 496, 379.5, 446.90000000000003, 457.0, 472.99, 0.3308180137024821, 0.1701612851535492, 0.13310256020060804], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.322000000000001, 2, 18, 3.0, 4.0, 5.0, 8.990000000000009, 0.3288906780541775, 0.2019305255853925, 0.16444533902708877], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.02, 2, 23, 4.0, 5.0, 5.0, 11.970000000000027, 0.3288859186836144, 0.1926134514587406, 0.15512880734783763], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 667.888, 524, 856, 678.0, 768.9000000000001, 819.8499999999999, 844.98, 0.3287386626253727, 0.3003945839894409, 0.14478626644926085], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.75200000000015, 175, 309, 238.0, 280.0, 288.95, 304.94000000000005, 0.3288208156729153, 0.2911573454870987, 0.13518902675614977], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.464, 3, 40, 4.0, 5.0, 6.0, 10.970000000000027, 0.3289194535463767, 0.21929355481508478, 0.15385978344601017], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.7220000000008, 813, 9368, 935.0, 1080.0, 1108.85, 1138.95, 0.32874774068115215, 0.2471097885543844, 0.18171017697805872], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.86999999999995, 115, 172, 139.0, 150.0, 152.0, 161.99, 0.3309371279025668, 6.39856271833577, 0.1667612871071528], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.02000000000007, 158, 255, 183.0, 202.0, 204.0, 208.0, 0.3309095313195944, 0.6413666561575314, 0.23654861027924132], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.849999999999998, 5, 16, 7.0, 9.0, 11.0, 12.990000000000009, 0.33082217249597384, 0.269991599391221, 0.2041793095873589], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.698000000000002, 5, 16, 7.0, 8.0, 10.0, 12.990000000000009, 0.3308241424872815, 0.27516233437289306, 0.2093496526677328], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.211999999999998, 5, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.330819326994394, 0.26772781686867597, 0.20191609313622677], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.454000000000008, 7, 27, 9.0, 11.0, 13.0, 17.0, 0.33082173472331394, 0.29583669014012287, 0.23002448742480422], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.755999999999994, 5, 32, 7.0, 9.0, 10.0, 27.940000000000055, 0.3307836529364988, 0.24831709164923438, 0.1825124647550018], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1613.1299999999999, 1404, 1977, 1590.5, 1818.6000000000001, 1865.85, 1945.9, 0.3304736348134146, 0.2761617129357295, 0.21041875966635382], "isController": false}]}, function(index, item){
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
