<?php

    if( isset($_POST['functionname']) ) {
        switch( $_POST['functionname'] ) {
            case 'queryInventory':

                include '../Database/connection.php';

                $sqlcheck = "SELECT * FROM inventory";
                $result = mysqli_query($conn, $sqlcheck);
                $inventoryData = mysqli_fetch_object($result);

                echo json_encode($inventoryData);

                break;
            case 'updateInventoryOne':

                include '../Database/connection.php';

                $itemID = $_POST['element'];
                $plusMinus = $_POST['plusorminus'];

                $allGood = 'YES';
                $message = "";

                $sql = "SELECT " . $itemID . " FROM inventory WHERE id = '1'";
                $result = mysqli_query($conn, $sql);
                $responseData = mysqli_fetch_array($result);

                $currentStock = $responseData[0];

                if(($currentStock == 0) && ($plusMinus == 'minus')) {
                    echo "minuserror";
                } else {

                    if($plusMinus == 'plus') {
                        $newStock = $responseData[0] + 1;
                    } else if ($plusMinus == 'minus') {
                        $newStock = $responseData[0] - 1;
                    }

                    $sql = "UPDATE inventory SET " . $itemID . " = " . $newStock . " WHERE id = '1'";
                    $result = mysqli_query($conn, $sql);

                    date_default_timezone_set("America/Los_Angeles");
                    $lastUpdate = date("Y-m-d h:i:sa");

                    $sql = "UPDATE inventory SET " . 
                    'lastupdate' . "='" . $lastUpdate .
                    "' WHERE id=1";

                    echo '<script> console.log("' . $sql . '"); </script>';

                    $result = mysqli_query($conn, $sql);

                    if($result != 1) {
                        $allGood = 'NO';
                        $message .=  "Had trouble updating the stock by 1.";
                    }

                    if($allGood == 'YES') {
                        echo "<script> alert('You have successfully updated the database!'); </script>";
                    } else {
                        echo "<script> alert('Something went wrong, contact Paul!" . $message . "'); </script>" ;
                    }
                }

                break;
            case 'submitOrders':
                include '../Database/connection.php';

                $allGood = "YES";
                
                $ordersSubmitted = $_POST['dataset'];
                $ordersSubmitted = json_decode($ordersSubmitted);

                $sql = "SELECT MAX(orderID) FROM orders_manual";
                $result = mysqli_query($conn, $sql);

                $responseData = mysqli_fetch_assoc($result);
                if($responseData['MAX(orderID)'] == 0) {
                    $responseData = 1;
                } else {
                    $responseData = $responseData['MAX(orderID)'] + 1;
                }

                for($i = 0; $i < sizeof($ordersSubmitted); $i++) {

                    $order_ID = $responseData;

                    $item_Name = $ordersSubmitted[$i][0];
                    $item_Var1 = $ordersSubmitted[$i][1];
                    $item_Var2 = $ordersSubmitted[$i][2];
                    $item_Quantity = $ordersSubmitted[$i][3];

                    $timestamp = time();
                    $timestamp = $timestamp - (60 * 60 * 8);

                    $entry_Date = date("m/d/Y h:i:s A", $timestamp);

                    $sql = "INSERT INTO orders_manual (orderID,itemName,itemVar1,itemVar2,itemQuantity,entryDate) VALUES ('" . $order_ID . "','" . $item_Name . "','" . $item_Var1 . "','" . $item_Var2 . "','" . $item_Quantity . "','" . $entry_Date . "')";
                    $result = mysqli_query($conn, $sql);
                    
                }

                //UPDATE DATABASE FOR INVENTORY REMOVAL
                for($i = 0; $i < sizeof($ordersSubmitted); $i++) {
                
                    //regular or incontintent
                    $itemType = $ordersSubmitted[$i][0];

                    //Color, or 'each color'
                    $item_Var1 = $ordersSubmitted[$i][1];

                    if($item_Var1 == 'Black') {
                        $itemColor = 'b';
                    } else if($item_Var1 == 'DogBones') {
                        $itemColor = 'db';
                    } else if($item_Var1 == 'StewartPlaidRed') {
                        $itemColor = 'spr';
                    } else if($item_Var1 == 'LondonPlaidCamel') {
                        $itemColor = 'lpc';
                    } else if($item_Var1 == 'BluePlaid') {
                        $itemColor = 'bp';
                    } else if($item_Var1 == 'Assorted') {
                        $itemColor = 'as';
                    } else if($item_Var1 == 'EachColor') {
                        $itemColor = ['b','lpc','spr','db'];
                    }

                    //Size of bands
                    $itemSize = $ordersSubmitted[$i][2];

                    //quantity of belly bands
                    $item_Quantity = $ordersSubmitted[$i][3];

                    //concatenate all parts of order
                    $itemID = $itemType . '_' . $itemSize . '_' . $itemColor;

                    echo '<script> console.log("' . $itemID . '"); </script>';

                    $sql = "SELECT " . $itemID . " FROM inventory WHERE id='1'";

                    $result = mysqli_query($conn, $sql);
                    $responseData = mysqli_fetch_array($result);

                    echo '<script> console.log("' . $responseData[0] . '"); </script>';

                    $itemNum = $responseData[0] - $item_Quantity;

                    echo '<script> console.log("' . $itemNum . '"); </script>';

                    $sql = "UPDATE inventory SET " . 
                    $itemID . "=" . $itemNum .
                    " WHERE id=1";

                    echo '<script> console.log("' . $sql . '"); </script>';

                    $result = mysqli_query($conn, $sql);

                    echo '<script> console.log("' . $itemNum . '"); </script>';

                    date_default_timezone_set("America/Los_Angeles");
                    $lastUpdate = date("Y-m-d h:i:sa");

                    $sql = "UPDATE inventory SET " . 
                    'lastupdate' . "='" . $lastUpdate .
                    "' WHERE id=1";

                    echo '<script> console.log("' . $sql . '"); </script>';

                    $result = mysqli_query($conn, $sql);
                }

                if($allGood == 'YES') {
                    echo "<script> alert('You have successfully updated the database!'); </script>";
                } else {
                    echo "<script> alert('Something went wrong, contact Paul!" . $message . "'); </script>" ;
                }

                break;
            default: 
                echo "We don't know this function name.";
                break;
        }
    }
?>