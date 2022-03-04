<div class="row coddledTabs">
    <div class="coddledTabsPane">
        <div class="paneGroup">
            <div class="coddledTabsPaneTrapezoidL"></div>
            <div class="paneName" id="coddledInventoryFinished">Inventory (Finished Product)</div>
            <div class="coddledTabsPaneTrapezoidR"></div>
        </div>
    </div>
    <div class="coddledTabsPane">
            <div class="paneGroup">
                <div class="coddledTabsPaneTrapezoidL"></div>
                <div class="paneName" id="coddledInput">Input Orders</div>
                <div class="coddledTabsPaneTrapezoidR"></div>
            </div>
    </div>
</div>
<?php 
    if(isset($_GET['tab'])) {
        $tabSelected = $_GET['tab'];
        if($tabSelected == 'coddledInventory') {
            include 'includes/inventory.inc.php';
        } else if ($tabSelected == 'coddledOrders') {
            include 'includes/orders.inc.php';
        } else if ($tabSelected == 'coddledInventoryFinished') {
            include 'includes/inventoryfinished.inc.php';
        } else {
            echo 'Not sure why this GET variable is bad...';
        }
    } else {
        header('Location: http://coddledadmin.local/?tab=coddledInventoryFinished');
        include 'includes/inventoryfinished.inc.php';
    }

?>
