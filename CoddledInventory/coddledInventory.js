jQuery(document).ready(function() {

    function useTab(tabSelected) {
        window.location.search = "?tab=" + tabSelected;
    }

    jQuery('#coddledInventoryFinished').click( 
        function() {
            useTab('coddledInventoryFinished');
    });

    jQuery('#coddledInventory').click( 
        function() {
            useTab('coddledInventory');
    });

    jQuery('#coddledInput').click( 
        function() {
            useTab('coddledInput');
    });


    /*  
        CODDLED INVENTORY START
        INVENTORY TAB SHOWS CURRENT INVENTORY
        POPULATED BY PROCESSINVENTORYDATA FUNCTION, DISPLAYS INFORMATION IN ORDERS DB
        RELIES ON DATABASE NAMES TO POPULATE PAGE
        ALLOWS FOR INCREASE/DECREASE OF INVENTORY STOCK WITH +/- BUTTONS
        WILL BE UPDATED BY THE INPUT TAB
    */

    function processInventoryData(dbResponse) {

        //define variables
        var itemName;
        var itemIndex;
        var itemVariation;
        var prevVariation;
        var itemID;
        var itemQuantity;
        var htmlAppend;
        var htmlFirst;
        
        //loop through the data in the database response
        for(var item in dbResponse) {
                prevVariation = jQuery("#coddledFabrics").children().last().attr("id");

                if(prevVariation) {
                    prevVariation = prevVariation.split("_")[0];
                    itemVariation = item.split("_")[0];

                    if(prevVariation != itemVariation) {
                        if(itemVariation == "inc") {
                            itemVariation = "Incontinent Belly Bands";
                        } else if (itemVariation == "staydry") {
                            itemVariation = "Stay Dry Belly Bands";
                        } else if (itemVariation == "business") {
                            itemVariation = "Business Bags";
                        }
                        title = '<div class="col-xl-12 coddledInventorySectionHeader" style="margin-top: 25px;">'+ itemVariation + '</div>';
                        jQuery("#coddledFabrics").append(title);
                    }
                }

                

                itemName = item.split("_")[2];
                if(itemName != null) {
                    if(itemName == 'lpc') {
                        itemName = 'London Plaid Camel';
                    } else if(itemName == 'spr') {
                        itemName = 'Stewart Plaid Red';
                    } else if(itemName == 'b') {
                        itemName = 'Black';
                    } else if(itemName == 'db') {
                        itemName = 'Dog Bones';
                    } else if(itemName == 'bp') {
                        itemName = 'Blue Plaid';
                    } else if(itemName == 'as') {
                        itemName = 'Assorted';
                    }

                    itemSize = item.split("_")[1];
                    itemID = item;
                    itemType = item.split("_")[0];
                    itemQuantity = dbResponse[item];

                    //Check to see if it's the first item to be placed in the row
                    if(itemSize == 'XS') {
                        htmlFirst = "<div class='col-xl-2 coddledInventoryRowHeader'><div class='coddledInventoryRowHeaderText'>" + itemName + "</div></div><div class='col-xl-2 coddledInventoryItem' id='" + itemID + "'>"; 
                    } else {
                        htmlFirst = "<div class='col-xl-2 coddledInventoryItem' id='" + itemID + "'>"; 
                    }

                    //append the first column with spacing and item name
                    htmlAppend = htmlFirst;

                    //append the first part of new column, the variation
                    htmlAppend += "<div class='coddledInventoryItemVariation'>" + itemSize + "</div>";

                    if(itemQuantity < 5) {
                        var cssAppend = "style='background-color: rgb(255, 0, 0); font-weight: 800;'"
                    } else {
                        cssAppend = "";
                    }
                    //append the second part, the database quantity and plus/minus
                    htmlAppend += "<div class='coddledInventoryItemQuantity'><div class='coddledInventoryAddRemove'>+</div><div class='coddledInventoryItemQuantityNumber'" + cssAppend +">" + itemQuantity + "</div><div class='coddledInventoryAddRemove'>-</div></div>";

                    //append the third part, the outstanding quantities and plus/minus
                    //htmlAppend += "<div class='coddledInventoryItemSold'><div class='coddledInventoryAddRemove'>+</div><div class='coddledInventoryItemSoldNumber' id='" + "S_" + itemID + "'>" + '- ' + '0' + "</div><div class='coddledInventoryAddRemove'>-</div></div>";

                    //append the fourth and final part, the net number
                    htmlAppend += "<div class='coddledInventoryItemNet' id='" + "N_" + itemID + "'>0</div>";
                    jQuery("#coddledFabrics").append(htmlAppend);
            } else if(item.split("_")[0] == "business") {

                itemID = item;
                itemQuantity = dbResponse[item];

                itemName = item.split("_")[1];
                if(itemName == "PinkStripes") {
                    itemName = "Pink Stripes";
                }

                htmlFirst = "<div class='col-xl-3 coddledInventoryItem' id='" + itemID + "'>"; 

                //append the first column with spacing and item name
                htmlAppend = htmlFirst;

                //append the first part of new column, the variation
                htmlAppend += "<div class='coddledInventoryItemVariation'>" + itemName + "</div>";

                if(itemQuantity < 2) {
                    var cssAppend = "style='background-color: rgb(255, 0, 0); font-weight: 800;'"
                } else {
                    cssAppend = "";
                }
                //append the second part, the database quantity and plus/minus
                htmlAppend += "<div class='coddledInventoryItemQuantity'><div class='coddledInventoryAddRemove'>+</div><div class='coddledInventoryItemQuantityNumber'" + cssAppend +">" + itemQuantity + "</div><div class='coddledInventoryAddRemove'>-</div></div>";

                //append the third part, the outstanding quantities and plus/minus
                //htmlAppend += "<div class='coddledInventoryItemSold'><div class='coddledInventoryAddRemove'>+</div><div class='coddledInventoryItemSoldNumber' id='" + "S_" + itemID + "'>" + '- ' + '0' + "</div><div class='coddledInventoryAddRemove'>-</div></div>";

                //append the fourth and final part, the net number
                htmlAppend += "<div class='coddledInventoryItemNet' id='" + "N_" + itemID + "'>0</div>";
                jQuery("#coddledFabrics").append(htmlAppend);
            }
            

        }
    }

    function getInventoryData() {
        jQuery.ajax({
            type: "POST",
            url: 'CoddledInventory/processInventory.php',
            data: {functionname: 'queryInventory'},
            success: function(data) {
                try {
                    var responseObject = JSON.parse(data);
                    //console.log(responseObject);
                    processInventoryData(responseObject);
                } catch (e) {
                    //jQuery("#dataContainer").append(data);
                    console.log(data);
                    console.log("Some error occured.");
                    return false;
                }
            },
            failure: function() {
                console.log("Error! From coddledInventory.js");
            }
        });

        return false;
    }


    //Function to Remove 1 or add 1 to chosen inventory item and updates database
    //Because add/remove buttons generated by AJAX, need to use document selector
    jQuery(document).on('click touchend','.coddledInventoryAddRemove',
        function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            if(e.type == 'touchend'){
                $(this).off('click');
            }

            var newNumber;
            var plusminus = jQuery(this).html();

            var soldorcurrent = jQuery(this).parent()[0]["className"];

            if(soldorcurrent == 'coddledInventoryItemQuantity') {

                //+ -> ItemQuantity -> Item(ID)
                var elementID = jQuery(this).parent().parent()[0]["id"];
                //+ -> ItemQuantity <- Number(HTML)
                var currentNumber = jQuery(this).parent().children(".coddledInventoryItemQuantityNumber").html();
                //+ -> ItemQuantity -> Item <- Net(HTML)
                var netNumber = jQuery(this).parent().parent().children(".coddledInventoryItemNet").html(); 

                //Take HTML strings, turn to numbers.
                currentNumber = parseInt(currentNumber);
                netNumber = parseInt(netNumber);
                
                if(!((currentNumber == 0) && (plusminus == '-'))) {
                    if(plusminus == '+') {
                        newNumber = currentNumber + 1;
                        newNetNumber = netNumber + 1;
                    } else if (plusminus == '-') {
                        newNumber = currentNumber - 1;
                        newNetNumber = netNumber - 1;
                    }
                }

                if(plusminus == '+') {
                    plusminus = 'plus';
                } else if(plusminus == '-') {
                    plusminus = 'minus';
                }

                jQuery.ajax({
                    type: "POST",
                    url: 'CoddledInventory/processInventory.php',
                    data: {functionname: 'updateInventoryOne', element: elementID, plusorminus: plusminus},
                    success: function(data) {
                        if(data == 'minuserror') {
                            alert("You can't have stock go below 0.")
                        } else if(newNumber < 1) {
                            var elementStem = jQuery('#' + elementID).children(".coddledInventoryItemQuantity").children(".coddledInventoryItemQuantityNumber");
                            elementStem.html(newNumber).css("background-color","rgb(255, 0, 0)");
                            var elementStem2 = jQuery('#' + elementID).children(".coddledInventoryItemNet");
                            elementStem2.html(newNetNumber);
                        } else {
                            var elementStem = jQuery('#' + elementID).children(".coddledInventoryItemQuantity").children(".coddledInventoryItemQuantityNumber");
                            elementStem.html(newNumber)
                            var elementStem2 = jQuery('#' + elementID).children(".coddledInventoryItemNet");
                            elementStem2.html(newNetNumber);
                        }
                    },
                    failure: function() {
                        console.log("Error! From coddledInventory.js");
                    }
                });

            } else if (soldorcurrent == 'coddledInventoryItemSold') {

                //+ -> ItemSold -> Item[id]
                var elementID = jQuery(this).parent().parent()[0]["id"];
                var elementID2 = "S_" + elementID;
                //+ -> ItemSold <- Number(HTML)
                var currentNumber = jQuery(this).parent().children(".coddledInventoryItemSoldNumber").html();
                //+ -> ItemQuantity -> Item <- Net(HTML)
                var netNumber = jQuery(this).parent().parent().children(".coddledInventoryItemNet").html(); 

                //Take HTML strings, turn to numbers.
                currentNumber = currentNumber.replace("- ", "");
                currentNumber = parseInt(currentNumber);
                netNumber = parseInt(netNumber);

                if(plusminus == '+') {
                    newNumber = currentNumber + 1;
                    newNetNumber = netNumber - 1;
                } else if (plusminus == '-') {
                    newNumber = currentNumber - 1;
                    newNetNumber = netNumber + 1;
                }

                if(plusminus == '+') {
                    plusminus = 'plus';
                } else if(plusminus == '-') {
                    plusminus = 'minus';
                }

                jQuery.ajax({
                    type: "POST",
                    url: 'processInventory.php',
                    data: {functionname: 'updateInventoryOne', element: elementID2, plusorminus: plusminus},
                    success: function(data) {
                        if(data == 'minuserror') {
                            alert("You can't have sold items go below 0.")
                        } else {
                            var elementStem = jQuery('#' + elementID).children(".coddledInventoryItemSold").children(".coddledInventoryItemSoldNumber");
                            elementStem.html("- " + newNumber);
                            if(newNetNumber > 0) {
                                var elementStem2 = jQuery('#' + elementID).children(".coddledInventoryItemNet");
                                elementStem2.html(newNetNumber);
                            } else if(newNetNumber == 0) {
                                var elementStem2 = jQuery('#' + elementID).children(".coddledInventoryItemNet");
                                elementStem2.html(newNetNumber).css("background-color","rgb(239, 154, 154)");
                            } else if(newNetNumber < 0) {
                                var elementStem2 = jQuery('#' + elementID).children(".coddledInventoryItemNet");
                                elementStem2.html(newNetNumber).css("background-color","rgb(239, 83, 80)");
                            }
                        }
                    },
                    failure: function() {
                        console.log("Error! From coddledInventory.js");
                    }
                });
                                
            }

            return false;

        }
    );

    //Function to clear the current load of materials used to fulfill orders. Updates database.
    //Subtracts the quantity of materials needed from the database quantity, effectively updating inventory
    //Refers to a 'simulated quantity' which is the effective amount of materials if the orders were filled
    //If the simulated quantity is negative, this will output the negative quantities saying that we need to cut those
    //materials. Calls a PHP function in order to reset and update.
    jQuery("#inventoryRefresh").on('click',
        function() {
            jQuery(".coddledInventorySection").children().remove();
            jQuery(".coddledInventorySection").append('<div class="col-xl-12 coddledInventorySectionHeader">Regular Belly Bands</div>');
            getInventoryData();
            return false;
        }
    );

    /* END OF CODDLED INVENTORY */

    /*  
        CODDLED INPUT START
        INPUT TAB ALLOWS INPUT OF PRODUCTS INTO DATABASE, AUTOMATICALLY UPDATES INVENTORY
        POPULATES DYNAMICALLY BASED ON GETINPUTDATA FUNCTION
        ORDER ITEMS ENTER INTO ORDER QUEUE, SUBMIT TO DB WHEN DONE
    */


    //Function called on page load to populate page with item selection interface
    function getInputData() {

        //define variables
        var itemName;
        var itemID;
        var itemVariation1s;
        var itemVariation1;
        var itemVariation2s;
        var itemVariation2;
        var htmlAppend;
        var htmlFirst;
        
        itemName = "reg";

        itemVariation2s = ["XS", "S", "M", "L", "XL"];
        itemVariation1s = ["Black", "London Plaid Camel", "Stewart Plaid Red", "Dog Bones", "Blue Plaid", "Assorted"];

        //loop through the arrays above to append elements to page
        for(i = 0; i < itemVariation1s.length; i++) {

            itemVariation1 = itemVariation1s[i];

            for(j = 0; j < itemVariation2s.length; j++) {

                itemVariation2 = itemVariation2s[j];

                itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
                switch(itemVariation2) {
                    case "XS":
                        htmlFirst = "<div class='col-xl-2 coddledInputRowHeader'><div class='coddledInputRowHeaderText'>" + itemVariation1 + "</div></div><div class='col-xl-2 coddledInputItem' id='";

                        //remove white spaces from the variation
                        itemVariation1 = itemVariation1.replace(/ /g,"");
                        itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;

                        htmlFirst += itemID + "'>";
                        break;
                    default:
                        //remove white spaces from the variation
                        itemVariation1 = itemVariation1.replace(/ /g,"");
                        itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;

                        htmlFirst = "<div class='col-xl-2 coddledInputItem' id='" + itemID + "'>";
                }
                //append the first column with spacing and item name
                htmlAppend = htmlFirst;

                //append the first part of new column, the variation
                htmlAppend += "<div class='coddledInputItemVariation'>" + itemVariation2 + "</div>";

                //append the second part, the database quantity and plus/minus
                htmlAppend += "<div class='coddledInputItemQuantity'><div class='coddledInputAddRemove'>+</div><div class='coddledInputItemQuantityNumber'>0</div><div class='coddledInputAddRemove'>-</div></div>";

                jQuery("#coddledInputSelection").append(htmlAppend);

            }

        }
    }

    //Flexible function called to return a specific text string based on the name called
    function getInfoFromID(elementID) {

        var elementName;

        switch(elementID) {
            case 'reg':
                elementName = 'Regular Belly Bands';
            break;
            case 'regular4p':
                elementName = '4P Regular Belly Bands';
            break;
            case 'inc':
                elementName = 'Incontinent Belly Bands';
                break;
            case 'incontinent4p':
                elementName = '4P Incontinent Belly Bands';
                break;
            case 'staydry':
                elementName = 'Stay Dry Belly Bands';
                break;
            case 'staydry4p':
                elementName = '4P Stay Dry Belly Bands';
                break;
            case 'DogBones':
                elementName = 'Dog Bones';
                break;
            case 'StewartPlaidRed':
                elementName = 'Stewart Plaid Red';
                break;
            case 'LondonPlaidCamel':
                elementName = 'London Plaid Camel';
                break;
            case 'BluePlaid':
                elementName = 'Blue Plaid';
                break;
            case 'EachColor':
                elementName = 'One of Each Color';
                break;
            default:
                elementName = elementID;
        }

        return elementName;
    }

    //Function to Remove 1 or add 1 to chosen inventory item and updates database
    //Because add/remove buttons generated by AJAX, need to use document selector
    jQuery(document).on('click touchstart','.coddledInputAddRemove',
        function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            var newNumber;
            var plusminus = jQuery(this).html();

            var soldorcurrent = jQuery(this).parent()[0]["className"];

            if(soldorcurrent == 'coddledInputItemQuantity') {

                //+ -> ItemQuantity -> Item(ID)
                var elementID = jQuery(this).parent().parent()[0]["id"];
                var elementIDArray = elementID.split("_");

                //+ -> ItemQuantity <- Number(HTML)
                var currentNumber = jQuery(this).parent().children(".coddledInputItemQuantityNumber").html();

                //Take HTML strings, turn to numbers.
                currentNumber = parseInt(currentNumber);
                
                if(!((currentNumber == 0) && (plusminus == '-'))) {
                    if(plusminus == '+') {
                        newNumber = currentNumber + 1;
                    } else if (plusminus == '-') {
                        newNumber = currentNumber - 1;
                    }
                }
                
                var currentNumber = jQuery(this).parent().children(".coddledInputItemQuantityNumber").html(newNumber);

                var currentInputs = jQuery(".inputQueue").children();

                var appendDivID = "input_" + elementIDArray[0] + "_" + elementIDArray[1] + "_" + elementIDArray[2];

                //Check to see if we are going below 0. If we are, remove the div. If not, add a new div, or change an existing one.
                if(newNumber > 0) {
                    var duplicateItemCheck = jQuery("#" + appendDivID).length;
                    var itemType = getInfoFromID(elementIDArray[0]);

                    if(jQuery("#" + elementIDArray[0]).length == 0) {
                        var appendDiv = "<div id='queueTypeContainer' name='" + elementIDArray[0] + "Container'><div name='appendedInputHeader' id='" + elementIDArray[0] + "' class='inputQueueCategory'>" + itemType + "</div></div>";
                    }

                    jQuery(".inputQueue").append(appendDiv);
                    
                    if(duplicateItemCheck == 0) {
                    appendDiv = "<div name='appendedInput' id='" + appendDivID + "' class='inputQueueItem'>";
                        var elementName = getInfoFromID(elementIDArray[1]);
                        appendDiv += "<div class='inputQueueItemText'><b>" + elementIDArray[2] + "</b>" + " " + elementName + ": " + newNumber + " </div>";
                        appendDiv += "<div class='inputRemove'><img src='images/remove.png'></img></div></div>";
                        jQuery("[name='" + elementIDArray[0] + "Container']").append(appendDiv);
                    } else {
                        var elementName = getInfoFromID(elementIDArray[1]);
                        jQuery("#"+ appendDivID).children(".inputQueueItemText").html("<b>" + elementIDArray[2] + "</b>" + " " + elementName + ": " + newNumber + " ");
                    }
                }
                else {
                    jQuery("#" + appendDivID).remove();
                }
                

            }

            return false;

        }
    );


    //Removes the selected item from the input queue.
    //Also removes the selected item's values on the input area.
    //Also removes the header for the item (Incontinent, Stay-Dry, ETC) if it is the last one.
    jQuery(document).on('click touchstart', '.inputRemove',
        function() {

            //select current item and grabs id
            var currentItem = jQuery(this).parent();

            console.log(currentItem.parent().children().length);
            if(currentItem.parent().children().length <= 2) {
                currentItem.parent().remove();
            }

            var itemID = jQuery(currentItem).attr("id");

            console.log(currentItem.parent().children().length);
            if(currentItem.parent().children().length <= 2) {
                currentItem.parent().remove();
            } else {
                currentItem.remove();
            }

            var IDArray = itemID.split("_");
            var itemID = IDArray[1] + "_" + IDArray[2] + "_" + IDArray[3];

            //set the input quantity to 0 for the selected product in the input section
            jQuery("#" + itemID).children(".coddledInputItemQuantity").children(".coddledInputItemQuantityNumber").html('0');

        }
    );

    //function to remove the input queue items when the selected button is pressed
    jQuery(document).on('click touchstart', '#inputQueueRemoveAll',
        function( ) {
            jQuery(this).parent().parent().html('<div class="inputQueueHeader">Your Items:</div><div class="inputQueueButtons"><div id="inputQueueSubmit">Submit</div><div id="inputQueueRemoveAll">Clear All</div></div>');
            jQuery(".coddledInputItemQuantityNumber").html("0");
        }
    );

    //function to submit the input queue items to the database.
    jQuery(document).on('click touchstart', '#inputQueueSubmit',
        function( ) {
            var appendedItems = jQuery(this).parent().parent().children("#queueTypeContainer").children(".inputQueueItem");

            jQuery(this).parent().parent().html('<div class="inputQueueHeader">Your Items:</div><div class="inputQueueButtons"><div id="inputQueueSubmit">Submit</div><div id="inputQueueRemoveAll">Clear All</div></div>');
            jQuery(".coddledInputItemQuantityNumber").html("0");

            var numProcessed = 0;
            var orderQueue = [];

            for(var item in appendedItems) {
                var selectedItemID = jQuery(appendedItems[item]).attr("id");
                var selectedItemQuantity = jQuery(appendedItems[item]).children(".inputQueueItemText").html();
                if(typeof(selectedItemID) == 'undefined' || selectedItemQuantity == 'undefined') {
                    break;
                } else {
                    selectedItemID = selectedItemID.split("_").splice(1,3);
                    selectedItemQuantity = selectedItemQuantity.split(":")[1];
                    selectedItemQuantity = parseInt(selectedItemQuantity);

                    selectedItemID.push(selectedItemQuantity);

                    var selectedItemInfo = selectedItemID;
                    orderQueue.push(selectedItemInfo);
                    numProcessed += 1;
                }
            }

            if(numProcessed >= appendedItems.length) {
                jQuery.ajax({
                    type: "POST",
                    url: 'CoddledInventory/processInventory.php',
                    data: {
                        functionname: 'submitOrders',
                        dataset: JSON.stringify(orderQueue)
                    },
                    success: function(data) {
                        jQuery(".inputEntry").append(data);
                    },
                    failure: function() {
                        console.log("Error! From coddledInventory.js");
                    }
                });
            }

        }
    );

    /*
        RUNS SELECTED FUNCTIONS ON PAGE LOAD BASED ON WHICH TAB IS OPEN
    */
    
    var searchVar = window.location.search;

    //show the input tab, or inventory tab based on the selection (URL read)

    if(searchVar == '?tab=coddledInventoryFinished') {
        jQuery('#coddledInventoryFinished').parent().css("background-color", "black");
        getInventoryData();
    } else if(searchVar == '?tab=coddledInventory') {
        jQuery('#coddledInventoryFinished').parent().css("background-color", "black");
    } else if(searchVar == '?tab=coddledInput') {
        jQuery('#coddledInput').parent().css("background-color", "black");
        getInputData();
    }

});


//create three functions to control the display of the dropdown menu
function openOptions() {
    var options = jQuery("#dropdownOptions");
    if(options.css("display") == "block") {
        options.css("display","none");
    } else {
        options.css("display", "block");
    }
}
function closeGrid() {
    var info = jQuery(event.target).parent();
    info.html("");
    info.css("display","none");
    var grid = jQuery("#checkboxGrid");
    grid.css("display","block");
}
jQuery(window).click(
    function(event) {
        var options = jQuery("#dropdownOptions");
        if(event.target.className !== ("dropdownText" || "dropdownOptions")) {
            options.css("display","none");
        }
    }
);

//Once dropdown menu chosen, run this function to populate page with options
//reset the numbers for each item and read queue to show the correct numbers
jQuery("[name='dropdownChoice']").click(
    function() {
        function getInputData() {

            //define variables
            var itemName;
            var itemID;
            var itemVariation1s;
            var itemVariation1;
            var itemVariation2s;
            var itemVariation2;
            var htmlAppend;
            var htmlFirst;
            
            itemName = "reg";
            
            itemVariation2s = ["XS", "S", "M", "L", "XL"];
            itemVariation1s = ["Black", "London Plaid Camel", "Stewart Plaid Red","Dog Bones", "Blue Plaid", "Assorted"];
    
            //loop through the arrays above to append elements to page
            for(i = 0; i < itemVariation1s.length; i++) {
    
                itemVariation1 = itemVariation1s[i];
        
                for(j = 0; j < itemVariation2s.length; j++) {
    
                    itemVariation2 = itemVariation2s[j];
    
                    itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
                    switch(itemVariation2) {
                        case "XS":
                            htmlFirst = "<div class='col-xl-2 coddledInputRowHeader'><div class='coddledInputRowHeaderText'>" + itemVariation1 + "</div></div><div class='col-xl-2 coddledInputItem' id='";
    
                            //remove white spaces from the variation
                            itemVariation1 = itemVariation1.replace(/ /g,"");
                            itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
    
                            htmlFirst += itemID + "'>";
                            break;
                        default:
                            //remove white spaces from the variation
                            itemVariation1 = itemVariation1.replace(/ /g,"");
                            itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
    
                            htmlFirst = "<div class='col-xl-2 coddledInputItem' id='" + itemID + "'>";
                    }
                    //append the first column with spacing and item name
                    htmlAppend = htmlFirst;
    
                    //append the first part of new column, the variation
                    htmlAppend += "<div class='coddledInputItemVariation'>" + itemVariation2 + "</div>";
    
                    //append the second part, the database quantity and plus/minus
                    htmlAppend += "<div class='coddledInputItemQuantity'><div class='coddledInputAddRemove'>+</div><div class='coddledInputItemQuantityNumber'>0</div><div class='coddledInputAddRemove'>-</div></div>";
    
                    jQuery("#coddledInputSelection").append(htmlAppend);
    
                }
    
            }
        }
        function getInputData2() {

            //define variables
            var itemName;
            var itemID;
            var itemVariation1s;
            var itemVariation1;
            var itemVariation2s;
            var itemVariation2;
            var htmlAppend;
            var htmlFirst;
            
            itemName = "reg";
            
            itemVariation2s = ["XS", "S", "M", "L", "XL"];
            itemVariation1s = ["Black", "London Plaid Camel", "Stewart Plaid Red", "Dog Bones", "Blue Plaid", "Each Color"];

            //loop through the arrays above to append elements to page
            for(i = 0; i < itemVariation1s.length; i++) {
    
                itemVariation1 = itemVariation1s[i];
        
                for(j = 0; j < itemVariation2s.length; j++) {
    
                    itemVariation2 = itemVariation2s[j];
    
                    itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
                    switch(itemVariation2) {
                        case "XS":
                            htmlFirst = "<div class='col-xl-2 coddledInputRowHeader'><div class='coddledInputRowHeaderText'>" + itemVariation1 + "</div></div><div class='col-xl-2 coddledInputItem' id='";
    
                            //remove white spaces from the variation
                            itemVariation1 = itemVariation1.replace(/ /g,"");
                            itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
    
                            htmlFirst += itemID + "'>";
                            break;
                        default:
                            //remove white spaces from the variation
                            itemVariation1 = itemVariation1.replace(/ /g,"");
                            itemID = itemName + "_" + itemVariation1 + "_" + itemVariation2;
    
                            htmlFirst = "<div class='col-xl-2 coddledInputItem' id='" + itemID + "'>";
                    }
                    //append the first column with spacing and item name
                    htmlAppend = htmlFirst;
    
                    //append the first part of new column, the variation
                    htmlAppend += "<div class='coddledInputItemVariation'>" + itemVariation2 + "</div>";
    
                    //append the second part, the database quantity and plus/minus
                    htmlAppend += "<div class='coddledInputItemQuantity'><div class='coddledInputAddRemove'>+</div><div class='coddledInputItemQuantityNumber'>0</div><div class='coddledInputAddRemove'>-</div></div>";
    
                    jQuery("#coddledInputSelection").append(htmlAppend);
    
                }
    
            }
        }


        //get document data - name of clicked choice, dropdown box, options container
        var choicetext = jQuery(this).html();

        if(choicetext == '4P Regular' || choicetext == '4P Incontinent' || choicetext == '4P Stay Dry') {
            jQuery("#coddledInputSelection").html("");
            getInputData2();
        } else {
            jQuery("#coddledInputSelection").html("");
            getInputData();  
        }
        var dropdownbox = jQuery("#dropdownBox");
        var options = jQuery("#dropdownOptions");

        //Change dropdownbox text to the choice and close the options container
        dropdownbox.html('<img src="images/downarrow.png" onclick="openOptions()">' + choicetext);
        options.css("display","none");

        var boxText = jQuery("#dropdownBox").text();

        switch(boxText) {
            case "Regular":
                boxText = "reg";
                break;
            case "4P Regular":
                boxText = "regular4p";
                break;
            case "Incontinent":
                boxText = "inc";
                break;
            case "4P Incontinent":
                boxText = "incontinent4p";
                break;
            case "Stay Dry":
                boxText = "staydry";
                break;
            case "4P Stay Dry":
                boxText = "staydry4p";
                break;
            default:
                boxText = "regular";
        }
        var inputItems = jQuery(".coddledInputItem");

        for(i = 0; i < inputItems.length; i++) {
            var itemId = jQuery(inputItems[i]).attr("id");
            itemIdArray = itemId.split("_");
            itemIdArray[0] = boxText;

            var newItemId = itemIdArray[0] + "_" + itemIdArray[1] + "_" + itemIdArray[2];

            jQuery(inputItems[i]).attr("id", newItemId);

            jQuery(inputItems[i]).children('.coddledInputItemQuantity').children('.coddledInputItemQuantityNumber').html("0");
        }
        
        //ENSURE QUANTITIES TRANSLATE FROM QUEUE TO ADD/REMOVE SECTION
        if(jQuery(".inputQueue").children().length != 0) {
            console.log(jQuery(".inputQueue").children());
            jQuery(".inputQueue").children("#queueTypeContainer").children(".inputQueueItem").each(
                function (index, value) {
                    console.log(jQuery(".inputQueue").children("#queueTypeContainer"));
                    var thingarray = jQuery(value).children(".inputQueueItemText").html().split(" ");
                    console.log(thingarray);
                    var thingarray2 = jQuery(value).attr("id").split("_");
                    var thing = thingarray[thingarray.length - 2];
                    console.log(thing);
                    var thing2 = thingarray2[1] + "_" + thingarray2[2] + "_" + thingarray2[3];
                    jQuery("#" + thing2).children(".coddledInputItemQuantity").children(".coddledInputItemQuantityNumber").html(thing);
                }
            )
        }
});
