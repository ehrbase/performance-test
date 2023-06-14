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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8904913848117422, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.177, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.622, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.938, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.997, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.123, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.1821314613899, 1, 16706, 9.0, 835.0, 1511.9500000000007, 6052.970000000005, 15.203004250761282, 95.76765327998106, 125.80615756235463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6193.532000000001, 4957, 16706, 6047.0, 6528.9, 6858.8, 14068.750000000058, 0.327847354271851, 0.19040439458887942, 0.16520433086354994], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.407999999999999, 1, 12, 2.0, 3.0, 4.0, 6.0, 0.32891815529541785, 0.16886285490268957, 0.11884738033135216], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7059999999999977, 2, 20, 3.0, 5.0, 5.0, 8.0, 0.3289151260830353, 0.18877608276392643, 0.13876106881628053], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.004000000000005, 7, 386, 11.0, 15.0, 18.0, 66.81000000000017, 0.3268755793869645, 0.1700487206008104, 3.5965890165555945], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.696000000000005, 24, 53, 35.0, 41.0, 42.94999999999999, 47.99000000000001, 0.32884460448215197, 1.3676306694865092, 0.13680449366152025], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.392, 1, 26, 2.0, 3.0, 4.0, 6.0, 0.3288534721007292, 0.2054402877319897, 0.13905620451134348], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.41400000000002, 22, 56, 30.0, 35.900000000000034, 37.0, 45.98000000000002, 0.32884676727185436, 1.3496558567198194, 0.11946386467297834], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.0039999999997, 662, 1107, 858.0, 1018.9000000000001, 1057.8, 1086.96, 0.32870084278896095, 1.3901445574947078, 0.1598564645594751], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.804000000000001, 4, 15, 5.0, 8.0, 9.0, 12.990000000000009, 0.32877303219477044, 0.4888925623567371, 0.16791825765416496], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.850000000000002, 2, 17, 4.0, 5.0, 5.0, 10.980000000000018, 0.3271048213942254, 0.3155124054094633, 0.17888544919996704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.005999999999998, 5, 24, 8.0, 10.0, 12.0, 17.0, 0.3288504440796397, 0.5358945552149761, 0.21484467489187395], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.9384320770065075, 2565.7050738882863], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.024000000000001, 2, 13, 4.0, 5.0, 6.0, 10.0, 0.3271076033545539, 0.3286121705535773, 0.19198405235945987], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.151999999999996, 5, 34, 8.0, 10.0, 11.0, 18.99000000000001, 0.3288482812415732, 0.5166225766759095, 0.1955748078868341], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.701999999999994, 4, 21, 6.0, 8.0, 9.0, 12.0, 0.32884655099160387, 0.5089125174042037, 0.18786643782235185], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1579.1739999999995, 1303, 2013, 1553.5, 1792.8000000000002, 1841.85, 1912.99, 0.3284946077610136, 0.501631155373022, 0.18092867068087076], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.084000000000003, 7, 74, 10.0, 13.0, 17.0, 44.86000000000013, 0.326863612888886, 0.1700424953340219, 2.6353378789166433], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.486, 8, 44, 11.0, 14.0, 15.0, 27.930000000000064, 0.3288530395228737, 0.5953107108339318, 0.2742582966333341], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.986000000000002, 5, 25, 8.0, 10.0, 11.0, 16.0, 0.32885239065822436, 0.5567721466875685, 0.2357203659600944], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 10.481770833333334, 3030.729166666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.9505475153688525, 3918.941310194672], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3799999999999994, 1, 26, 2.0, 3.0, 4.0, 7.990000000000009, 0.3270969037661283, 0.2749370859770941, 0.1383134368464195], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 558.4520000000003, 420, 749, 546.5, 656.9000000000001, 678.95, 709.99, 0.32699336792051187, 0.28794256815195773, 0.15136216444758066], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3399999999999985, 2, 24, 3.0, 4.0, 5.0, 9.990000000000009, 0.3271086733518957, 0.29634959702664754, 0.15972103191010528], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 757.5539999999995, 628, 947, 735.5, 884.0, 907.95, 934.99, 0.3269642869987883, 0.30931013130722285, 0.1727418742835395], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.936468160377359, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.551999999999985, 15, 649, 21.0, 25.0, 32.89999999999998, 50.0, 0.3267267016089983, 0.16997127071692333, 14.903715070465148], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 32.32399999999998, 20, 370, 29.0, 39.900000000000034, 51.94999999999999, 130.97000000000003, 0.3269937956197219, 73.95638793313599, 0.10090824161702357], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 1.048828125, 0.8203125], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7340000000000004, 1, 11, 3.0, 4.0, 4.0, 7.0, 0.3288673151930122, 0.3573573733285319, 0.14098901500950428], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.462, 2, 19, 3.0, 4.0, 5.0, 6.990000000000009, 0.328866233659459, 0.33744437535969746, 0.12107672860314067], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.83, 1, 12, 2.0, 3.0, 3.0, 6.0, 0.32891923717050514, 0.18652997091531645, 0.1275204464420806], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.61599999999997, 66, 131, 90.0, 111.0, 114.0, 118.0, 0.3288969519803872, 0.2995756602359638, 0.10727693550922787], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 88.21999999999998, 58, 574, 82.0, 98.90000000000003, 117.89999999999998, 387.08000000000084, 0.3269405556681684, 0.17008252286131836, 96.67415122144992], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 209.86999999999998, 12, 363, 260.0, 333.0, 336.0, 344.0, 0.3288625564985872, 0.18328627892510616, 0.1377754265018495], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.7500000000003, 298, 563, 415.0, 506.0, 519.0, 542.0, 0.32881021994773235, 0.17683503537833561, 0.1400012264621204], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.019999999999998, 4, 289, 6.0, 8.0, 9.949999999999989, 25.99000000000001, 0.32666885317019057, 0.1472912853488366, 0.23702632607954255], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 398.76799999999974, 282, 515, 397.5, 467.0, 481.0, 497.0, 0.32879746273573957, 0.169121983981974, 0.13228960414758273], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5420000000000003, 2, 29, 3.0, 5.0, 6.0, 10.990000000000009, 0.32709112627941694, 0.2008256464874338, 0.16354556313970847], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.188000000000001, 2, 53, 4.0, 5.0, 6.0, 9.990000000000009, 0.3270802138057941, 0.19155593263815707, 0.15427709303535017], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 671.3880000000001, 534, 913, 671.0, 800.3000000000002, 838.95, 865.98, 0.32693521124918673, 0.29874662745896147, 0.1439919729232258], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.15600000000006, 177, 319, 239.0, 290.0, 300.0, 311.98, 0.32702117069654857, 0.2895638336740894, 0.13444913365551459], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.544, 3, 54, 4.0, 5.0, 6.0, 10.0, 0.3271093153536608, 0.2180867194190408, 0.15301304888125344], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 980.6740000000001, 821, 8363, 933.0, 1084.0, 1113.0, 1200.3700000000006, 0.3269397005493895, 0.24575073916979548, 0.18071081104585393], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.02999999999992, 118, 169, 135.0, 151.0, 153.0, 162.0, 0.32888224108252245, 6.3588321438895985, 0.16572581679548984], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.39399999999995, 160, 225, 176.0, 204.0, 207.0, 211.99, 0.3288649358285851, 0.6374038347542491, 0.2350870439712151], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.369999999999998, 5, 21, 7.0, 9.0, 10.0, 14.0, 0.32876741152211425, 0.2683146616046348, 0.20291113679880485], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.219999999999999, 5, 27, 7.0, 9.0, 10.0, 15.0, 0.3287684924057766, 0.27345255143254293, 0.20804881160053051], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.564000000000016, 6, 32, 8.0, 10.0, 11.0, 15.0, 0.32876481743032154, 0.2660651287623846, 0.20066212001362402], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.883999999999995, 7, 22, 10.0, 12.0, 13.0, 18.99000000000001, 0.3287661144711008, 0.2939984557444646, 0.22859518896818729], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.922000000000006, 5, 37, 8.0, 9.0, 10.0, 14.0, 0.3287360689872365, 0.24677998397576031, 0.1813826943142467], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1624.546, 1411, 1966, 1600.0, 1844.0, 1895.0, 1950.93, 0.3284352686928933, 0.2744583435285115, 0.20912089373805318], "isController": false}]}, function(index, item){
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
