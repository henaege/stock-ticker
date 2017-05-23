// 1. Give the user the ability to search for multiple symbols
// 2. Multiple will bring back an array inside of quote. a single will bring a single object


// 1. Make an AJAX request when the user submits the form.
// 2. Get the user's input
// 3. When the AJAX has a response/JSON, check to see if there was any valid data
// 4. If there is, load up the table with the data.

$(document).ready(()=> {
    
    // console.log("Hello");
    let userStockSavedIfAny = localStorage.getItem('symbol');
    // console.log(userStockSavedIfAny);
    if(userStockSavedIfAny) {
        let url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env 'store://datatables.org/alltableswithkeys';select * from yahoo.finance.quotes where symbol in ("${symbol}");&format=json`);

        $.getJSON(url, (theDataJSFound)=> {
            if(theDataJSFound.query.count > 1) {
                let stocksArray = theDataJSFound.query.results.quote;
                let newRow = '';
                for (let i = 0; i < stocksArray.length; i++) {
                    newRow += addRow(stocksArray[i]);
                }
            }
        })
    }
    $('.buttons').submit((event)=> {
        // prevent the broweser from submitting the form, JS will handle everything
        event.preventDefault();
        $( function() {
            $( "#sortable" ).sortable();
            $( "#sortable" ).disableSelection();
        } );
        // Get whatever the user typed and stash it in a var
        let symbol = $('#symbol').val();
        console.log(symbol);
        // Store in localStorage
        localStorage.setItem("lastSymbolSearched", symbol);


        let url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env 'store://datatables.org/alltableswithkeys';select * from yahoo.finance.quotes where symbol in ("${symbol}");&format=json`);

        console.log(url)

        $.getJSON(url, (theDataJSFound)=> {
            // console.log(theDataJSFound);
            if (theDataJSFound.query.count > 1) {
                let stocksArray = theDataJSFound.query.results.quote;
                var newRow = '';
                for (let i = 0; i < stocksArray.length; i++) {
                    newRow += addRow(stocksArray[i]);
                }
            } else {
                var newRow = addRow(theDataJSFound);//(theDataJSFound.query.results.quote);
            }
            
            
            
            $('#stock-ticker-body').append(newRow);
        });
        // $('#stock-table').DataTable();
    });

    


    console.log("I'm the last line but I'm not last besauce JS is async...");
    function addRow(stockInfo) {
            let newHTML = '';
            if (stockInfo.Ask == null) {
                stockInfo.Ask = "Not available for this stock";
            }
            if (stockInfo.Ask !==null) {
                if (stockInfo.Change.indexOf('+') > -1){
                        var classChange = "success";
                    }else {
                        var classChange = "danger";
                    }
            }
            
            // for (i=0; i < stockInfo.length; i++) {
                // console.log(stockInfo)
                
                newHTML += '<div class="table-cell">'+stockInfo.Symbol+'</div>';
                newHTML += '<div class="table-cell">'+stockInfo.Name+'</div>';
                newHTML += '<div class="table-cell">'+stockInfo.Ask+'</div>';
                newHTML += '<div class="table-cell">'+stockInfo.Bid+'</div>';
                newHTML += '<div class="table-cell" class="bg-'+classChange+'">'+stockInfo.Change+'</div>';
                newHTML += '</div>';
            // }
            return newHTML;
            }
});



