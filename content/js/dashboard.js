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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.917632356282663, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.005, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.851, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.729, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.797, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.4378550329463, 1, 3998, 13.0, 567.0, 1267.0, 2114.9900000000016, 25.77690937140889, 173.3106940221262, 227.06452531551966], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.891999999999997, 4, 32, 6.0, 9.0, 11.0, 19.970000000000027, 0.5971988982874724, 6.390847027352904, 0.21578475817027815], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.296, 4, 32, 7.0, 9.0, 10.0, 13.0, 0.5971803532441226, 6.412014096740828, 0.2519354615248642], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.861999999999995, 13, 255, 18.0, 26.0, 32.0, 46.98000000000002, 0.5925715233828722, 0.31934049752305105, 6.596987662660883], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.65999999999999, 26, 77, 44.0, 53.0, 55.0, 58.99000000000001, 0.5969308204933514, 2.482742543438656, 0.24833254836930438], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1380000000000017, 1, 10, 2.0, 3.0, 3.0, 5.990000000000009, 0.5969693062261511, 0.37310581639134444, 0.252429403902269], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.639999999999986, 21, 73, 39.0, 46.0, 48.0, 50.0, 0.5969322458023725, 2.4494275270529693, 0.2168542924203931], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 750.0019999999995, 558, 996, 748.5, 897.8000000000001, 912.0, 932.96, 0.5965754184678272, 2.523211071664219, 0.29013140468454884], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.551999999999987, 5, 27, 9.0, 10.0, 12.0, 17.99000000000001, 0.5967028586840554, 0.8874789587654457, 0.30476132333179784], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0700000000000007, 1, 20, 3.0, 4.0, 5.949999999999989, 10.990000000000009, 0.5936691125834105, 0.5727979328441499, 0.3246627959440526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.934, 8, 24, 14.0, 16.0, 17.0, 20.0, 0.5969158551595616, 0.9729028928333089, 0.3899772530290495], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.6773933531746031, 1877.4445064484128], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.895999999999997, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.5936810958878085, 0.5959073999973878, 0.3484397838169658], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.914000000000017, 9, 27, 15.0, 17.0, 18.94999999999999, 23.0, 0.5969044535041276, 0.9372332583223404, 0.35499493377345087], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.20399999999999, 5, 38, 8.0, 10.0, 12.0, 16.0, 0.5968845016551607, 0.9238886085189744, 0.3409935873713565], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1847.2519999999993, 1429, 2315, 1834.0, 2088.5, 2147.75, 2237.95, 0.5956919557758292, 0.9098263855794891, 0.3280959600171559], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.760000000000012, 11, 71, 15.0, 23.0, 28.0, 42.98000000000002, 0.5925336025806024, 0.3199912912373761, 4.777302170806107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.396, 11, 35, 18.0, 21.0, 23.0, 29.0, 0.5969315331470111, 1.08077252192828, 0.4978315715894019], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.016000000000009, 8, 38, 14.0, 16.0, 17.0, 24.0, 0.5969272572505768, 1.0108123672583011, 0.4278755925995346], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.129214638157895, 1794.5106907894738], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.7046274038461539, 2942.2205528846152], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0260000000000016, 1, 21, 2.0, 3.0, 3.9499999999999886, 9.990000000000009, 0.5935246461109297, 0.4990475784194439, 0.2509728239902662], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 389.208, 304, 559, 393.0, 456.0, 465.0, 482.0, 0.5933218070683614, 0.5219609537885378, 0.2746431021000032], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.7660000000000005, 1, 18, 2.0, 4.0, 4.949999999999989, 11.980000000000018, 0.5936084985741523, 0.5379577018328255, 0.2898478996944103], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1126.752000000001, 907, 1390, 1112.0, 1316.9, 1353.95, 1368.98, 0.5929756109131232, 0.561126334936344, 0.3132810600624996], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 8.995643028846155, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.10799999999994, 26, 580, 39.0, 46.0, 54.94999999999999, 80.98000000000002, 0.5921364282330649, 0.3197768015750829, 27.084459009355758], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.524, 25, 187, 40.0, 47.0, 54.89999999999998, 77.99000000000001, 0.5929045921646473, 134.17187737161836, 0.1829666514883091], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.7837213010204083, 1.3950892857142858], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9140000000000006, 1, 11, 2.0, 3.0, 3.0, 6.990000000000009, 0.5972153044782786, 0.6491217127776603, 0.2560327330722308], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.8599999999999994, 1, 24, 3.0, 4.0, 5.0, 9.990000000000009, 0.597210311194349, 0.6129570674465437, 0.21987137433620074], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8520000000000008, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.5972124511629517, 0.3388480802008545, 0.2315364678825116], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.46399999999993, 84, 161, 116.0, 142.90000000000003, 147.0, 155.99, 0.5971404139855062, 0.5440742248520286, 0.19477040846792879], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 156.98400000000015, 107, 563, 159.0, 183.0, 224.44999999999987, 342.84000000000015, 0.592667049134469, 0.3200633575892201, 175.32179413058114], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 1.986000000000002, 1, 14, 2.0, 3.0, 3.0, 5.0, 0.597206744614091, 0.332336222022357, 0.25019696624945803], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 442.6819999999998, 331, 570, 451.5, 517.0, 524.95, 553.9000000000001, 0.5969828486827573, 0.6487757747344919, 0.2565160677933723], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.153999999999993, 7, 291, 9.0, 14.0, 19.0, 42.99000000000001, 0.5919534582512984, 0.25030844474884006, 0.42951310496163553], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.492000000000002, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.5972195845023907, 0.6357122530347713, 0.24262045620409622], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.1799999999999997, 2, 17, 3.0, 4.0, 5.0, 9.0, 0.5935176007644507, 0.36457282312581984, 0.29675880038222535], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.6919999999999984, 2, 26, 3.0, 5.0, 5.0, 12.990000000000009, 0.5935013971022888, 0.34775472486462233, 0.279942553516021], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 510.4839999999999, 355, 907, 521.0, 616.0, 625.95, 643.98, 0.5928645197856677, 0.5412436207777671, 0.2611151351790391], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.063999999999998, 5, 116, 13.0, 24.0, 33.89999999999998, 46.98000000000002, 0.5930325788377511, 0.5252739736385158, 0.24381515204169255], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.004000000000001, 4, 49, 7.0, 8.0, 10.0, 14.0, 0.5936923747338775, 0.3959881757258186, 0.27771352294680396], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 509.27599999999984, 334, 3998, 495.0, 552.0, 573.95, 712.4500000000005, 0.5934915344367528, 0.4462778139807614, 0.32804317235468955], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.25, 8, 30, 14.0, 16.0, 17.0, 22.0, 0.5966836323712804, 0.4871362467406156, 0.3682656793541496], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.193999999999999, 8, 37, 14.0, 16.0, 17.0, 22.99000000000001, 0.5966900410045396, 0.49578882274248287, 0.3775929165731852], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.068000000000003, 8, 34, 14.0, 16.0, 17.94999999999999, 26.99000000000001, 0.5966708155177372, 0.4830469785783244, 0.3641789645494002], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.760000000000009, 10, 33, 17.0, 19.0, 21.0, 27.980000000000018, 0.596678647973918, 0.5337476968204188, 0.41487812241936484], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.758000000000003, 8, 36, 14.0, 16.0, 17.94999999999999, 25.980000000000018, 0.596312878211443, 0.4478169954537106, 0.3290202892475247], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2067.7700000000013, 1606, 2633, 2042.0, 2354.9, 2451.5, 2583.94, 0.5951828282611853, 0.49686141495194497, 0.3789640664319266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
