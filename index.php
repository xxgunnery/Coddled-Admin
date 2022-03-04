<?php include 'header.php'; ?>

<?php include 'CoddledInventory/inventoryManager.php'; ?>

<?php

/*
    require_once("includes/shipping_easy/lib/ShippingEasy.php");

    ShippingEasy::setApiKey('068857308dece77091cfb609ad3f5442');
    ShippingEasy::setApiSecret('8ef1888b83710ae877d3b969272b5f8e12b54865f9017e4331fc50c741375f0c');

    $order = new ShippingEasy_Order();
    $order->findAll();

    $order = json_encode($order);

    echo "<script> console.log(" . $order . "); </script>";
*/
?>

<?php include 'CoddledInventory/processInventory.php'; ?>

<?php include 'footer.php'; ?>
