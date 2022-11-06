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

    var data = {"OkPercent": 97.78345032971708, "KoPercent": 2.2165496702829186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8966602850457349, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.962, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.469, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.965, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.697, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.566, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.995, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 521, 2.2165496702829186, 196.50614762816312, 1, 4225, 18.0, 589.9000000000015, 1260.9500000000007, 2389.0, 25.115426246341677, 165.32586569350846, 208.08430413413487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 28.152000000000005, 18, 73, 29.0, 34.0, 38.0, 56.98000000000002, 0.5437950806121827, 0.31575907437648454, 0.27508383960655336], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.623999999999994, 4, 33, 7.0, 10.0, 12.0, 18.0, 0.5437797039663291, 5.849975682851364, 0.19754497058151801], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.084000000000012, 5, 39, 8.0, 10.0, 12.0, 18.99000000000001, 0.5437613714096796, 5.838816147211428, 0.23046136249199312], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.127999999999997, 14, 257, 20.0, 28.0, 34.0, 51.99000000000001, 0.5408252777408215, 0.2920055106039612, 6.021962711719575], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.86599999999999, 26, 125, 45.0, 55.0, 59.0, 72.98000000000002, 0.5437507272665977, 2.261526181529549, 0.22727081178721076], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.8600000000000017, 1, 27, 2.0, 4.0, 6.0, 11.990000000000009, 0.5437856179579762, 0.339835210866468, 0.23100267950363249], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.368000000000016, 21, 86, 40.0, 48.0, 51.0, 66.99000000000001, 0.5437264838295744, 2.2316287139917135, 0.1985876024924422], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 776.5940000000004, 578, 1725, 755.0, 911.9000000000001, 1019.4499999999998, 1417.0400000000009, 0.5433052299648047, 2.2976282672339137, 0.26528575681875227], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.451999999999996, 8, 31, 13.0, 16.0, 18.0, 24.0, 0.5435467950306778, 0.8083273356341669, 0.2786738939366268], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6400000000000023, 2, 17, 3.0, 5.0, 7.0, 14.990000000000009, 0.5415463531185488, 0.5224462670939106, 0.29721586958264107], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.29199999999998, 13, 58, 21.0, 25.0, 27.0, 44.99000000000001, 0.5436939655406764, 0.8858187028685294, 0.3562682137478456], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.7065526697019868, 1958.264887727649], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.626000000000005, 2, 24, 4.0, 6.0, 7.0, 14.990000000000009, 0.5415539783096801, 0.5441369369327899, 0.3189033680866573], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.925999999999995, 13, 61, 21.5, 26.0, 28.0, 40.98000000000002, 0.5436691360118824, 0.8541997795149818, 0.324396330178965], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 12.145999999999997, 7, 38, 12.0, 16.0, 19.0, 28.980000000000018, 0.5436614511411454, 0.8414764332954582, 0.3116496795115745], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2077.429999999998, 1585, 3541, 2012.0, 2425.8, 2648.85, 3481.0700000000006, 0.542619506520116, 0.828674308987624, 0.29992445379920474], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.97000000000001, 11, 151, 17.0, 24.0, 28.94999999999999, 51.97000000000003, 0.5407855017570121, 0.291984034524828, 4.3611393295990295], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 25.270000000000014, 16, 62, 26.0, 31.0, 34.0, 48.0, 0.5437128847992013, 0.984356071995198, 0.4545099896368324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 20.38000000000002, 13, 61, 21.0, 26.0, 29.0, 49.98000000000002, 0.5437051986916278, 0.9204111332202789, 0.3907881115596075], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.628162202381], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.6939512310606061, 2897.6444128787875], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3540000000000005, 1, 22, 2.0, 3.0, 4.0, 11.0, 0.5415569111326771, 0.4548305911824787, 0.23005591439718218], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 421.84, 317, 817, 421.0, 490.90000000000003, 527.0, 775.6100000000004, 0.5413768946837872, 0.47660093775952256, 0.2516556658881667], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4799999999999964, 1, 27, 3.0, 5.0, 8.0, 16.99000000000001, 0.5416190944562036, 0.4906889161308248, 0.2655202982588029], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1217.3119999999992, 936, 2218, 1188.0, 1383.9, 1544.85, 2118.91, 0.5409897082117909, 0.5118407178203092, 0.28687247222558837], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 46.23199999999998, 11, 690, 44.0, 56.0, 68.0, 94.99000000000001, 0.5403915677299772, 0.29111273716434927, 24.718692414523563], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 46.57999999999998, 9, 292, 47.0, 58.0, 65.0, 85.96000000000004, 0.5410880631644561, 118.52234628601212, 0.16803320711552447], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.7597787332214765, 1.3829173657718121], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3240000000000025, 1, 23, 2.0, 3.0, 4.0, 9.980000000000018, 0.5438128239764899, 0.5908313905620197, 0.23420064001331253], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.338000000000004, 2, 25, 3.0, 4.0, 6.0, 12.0, 0.5438080922994598, 0.5579003691913138, 0.2012727216616165], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1699999999999977, 1, 10, 2.0, 3.0, 4.0, 6.0, 0.5437903492439139, 0.30847569651386886, 0.21188705991047035], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.48599999999998, 84, 272, 123.0, 148.0, 154.0, 233.86000000000013, 0.5437365357240341, 0.4953854014760272, 0.1784135507844487], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 17, 3.4, 174.17, 34, 611, 176.0, 211.0, 241.89999999999998, 362.8000000000002, 0.5408633043719063, 0.28832133980223873, 159.99835171907992], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4339999999999997, 1, 18, 2.0, 4.0, 4.949999999999989, 8.0, 0.5438051350431292, 0.30320428848808034, 0.22888673164412957], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.152000000000002, 1, 15, 3.0, 4.0, 5.0, 8.0, 0.5438447649502925, 0.2925736127879658, 0.23262110063303532], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.31999999999999, 7, 324, 10.0, 16.900000000000034, 21.0, 36.950000000000045, 0.5402269169141807, 0.22822160439020805, 0.39303618466900836], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.584000000000003, 2, 53, 4.0, 6.0, 7.0, 11.990000000000009, 0.5438145983766046, 0.27981172934673726, 0.21986254270304134], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.92, 2, 37, 4.0, 5.0, 6.0, 11.990000000000009, 0.541543420409905, 0.3325859300791628, 0.2718294121979406], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.1279999999999974, 2, 37, 4.0, 5.0, 6.949999999999989, 15.0, 0.5415228923387507, 0.317237225339589, 0.2564830105315372], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 539.5960000000001, 378, 1198, 532.5, 636.9000000000001, 688.9, 1019.6000000000004, 0.5410640565736577, 0.49444377938654155, 0.23935743908971382], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.805999999999983, 7, 111, 16.0, 29.0, 36.94999999999999, 48.0, 0.5412520675828981, 0.47922584919743144, 0.22358361776129484], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 11.196000000000005, 6, 50, 11.0, 14.0, 16.0, 22.99000000000001, 0.5415633634550876, 0.36075841515001844, 0.2543866970916964], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 573.1000000000013, 427, 3468, 548.0, 658.9000000000001, 683.9, 765.7800000000002, 0.5413171111421466, 0.4067691484838249, 0.30026183508665943], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 177.92400000000004, 141, 371, 179.0, 195.0, 221.95, 351.9200000000001, 0.5436561309732858, 10.511539262777822, 0.2750135506290645], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 275.0500000000002, 25, 535, 272.0, 300.90000000000003, 339.84999999999997, 494.98, 0.5437241187319483, 1.0522357290089868, 0.3897397491691896], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.83399999999997, 13, 60, 21.0, 25.0, 27.94999999999999, 41.99000000000001, 0.5435119349785802, 0.4433263375421086, 0.3365103191175975], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.142000000000007, 13, 56, 21.0, 24.0, 27.0, 39.99000000000001, 0.5435196156229278, 0.4519482375697064, 0.34500756851064757], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 20.784000000000006, 13, 58, 21.0, 26.0, 31.0, 42.99000000000001, 0.5434918481657693, 0.43996408164280193, 0.3327826062499389], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 23.45400000000001, 15, 64, 24.0, 28.900000000000034, 32.0, 46.99000000000001, 0.5434989374595773, 0.48611521566037835, 0.37896312631458806], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.792000000000005, 13, 66, 21.0, 26.0, 30.94999999999999, 46.97000000000003, 0.5433489202026909, 0.4078884262197368, 0.30085823999504463], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2313.0379999999996, 1737, 4225, 2248.5, 2708.4, 3019.6999999999994, 3733.59, 0.5423558201287769, 0.45328341027102603, 0.34638740855880873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 95.96928982725528, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19193857965451055, 0.0042544139544777706], "isController": false}, {"data": ["500", 20, 3.838771593090211, 0.08508827908955541], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 521, "No results for path: $['rows'][1]", 500, "500", 20, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 17, "500", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
